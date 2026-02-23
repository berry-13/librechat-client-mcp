import { Axios } from "axios";
import { logError, logWarning, logInfo } from './logger.js';
import { cache } from './cache.js';
import { withRetry } from './retry.js';

// Constants for the LibreChat Client package in the LibreChat monorepo
const REPO_OWNER = 'danny-avila';
const REPO_NAME = 'LibreChat';
const REPO_BRANCH = 'main';
const DEFAULT_PATH = 'packages/client';

// GitHub API for accessing repository structure and metadata
const githubApi = new Axios({
    baseURL: "https://api.github.com",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/vnd.github+json",
        "User-Agent": "Mozilla/5.0 (compatible; LibreChatClientMCP/1.0.0)",
        ...(process.env.GITHUB_PERSONAL_ACCESS_TOKEN && {
            "Authorization": `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`
        })
    },
    timeout: 30000,
    transformResponse: [(data) => {
        try {
            return JSON.parse(data);
        } catch {
            return data;
        }
    }],
});

// Rate limit state tracking
const rateLimitState = {
    limit: 0,
    remaining: -1,
    reset: 0,
    used: 0,
};

// Response interceptor to track rate limit headers
githubApi.interceptors.response.use((response) => {
    const headers = response.headers;
    if (headers) {
        const limit = parseInt(headers['x-ratelimit-limit'] as string, 10);
        const remaining = parseInt(headers['x-ratelimit-remaining'] as string, 10);
        const reset = parseInt(headers['x-ratelimit-reset'] as string, 10);
        const used = parseInt(headers['x-ratelimit-used'] as string, 10);

        if (!isNaN(limit)) rateLimitState.limit = limit;
        if (!isNaN(remaining)) rateLimitState.remaining = remaining;
        if (!isNaN(reset)) rateLimitState.reset = reset;
        if (!isNaN(used)) rateLimitState.used = used;

        if (!isNaN(remaining) && remaining < 10) {
            const resetDate = new Date(reset * 1000).toISOString();
            logWarning(`GitHub API rate limit low: ${remaining}/${limit} remaining, resets at ${resetDate}`);
        }
    }
    return response;
});

// GitHub Raw for directly fetching file contents
const githubRaw = new Axios({
    baseURL: `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${REPO_BRANCH}`,
    headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LibreChatClientMCP/1.0.0)",
    },
    timeout: 30000,
    transformResponse: [(data) => data],
});

/**
 * Fetch source file from the repository
 * @param filePath Path to the file within the repository
 * @returns Promise with file content
 */
async function getSourceFile(filePath: string): Promise<string> {
    return cache.getOrFetch(`file:${filePath}`, () =>
        withRetry(async () => {
            const response = await githubRaw.get(`/${filePath}`);
            if (response.status !== 200) {
                throw new Error(`File not found: ${filePath}`);
            }
            return response.data;
        })
    );
}

/**
 * List files in a directory
 * @param directory Directory path within the repository
 * @returns Promise with list of files
 */
async function listFiles(directory?: string): Promise<any[]> {
    const path = directory || DEFAULT_PATH;

    return cache.getOrFetch(`dir:${path}`, () =>
        withRetry(async () => {
            const response = await githubApi.get(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${REPO_BRANCH}`);

            if (!response.data || !Array.isArray(response.data)) {
                throw new Error('Invalid response from GitHub API');
            }

            return response.data.map((item: any) => ({
                name: item.name,
                path: item.path,
                type: item.type,
                size: item.size,
            }));
        })
    );
}

/**
 * Recursively builds a directory tree structure from the repository
 * @param path Path within the repository to start building the tree from
 * @returns Promise resolving to the directory tree structure
 */
async function buildDirectoryTree(path?: string): Promise<any> {
    const targetPath = path || DEFAULT_PATH;

    try {
        const response = await withRetry(() =>
            githubApi.get(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${targetPath}?ref=${REPO_BRANCH}`)
        );

        if (!response.data) {
            throw new Error('No data received from GitHub API');
        }

        const contents = response.data;

        // Handle different response types from GitHub API
        if (!Array.isArray(contents)) {
            if (contents.message) {
                const message: string = contents.message;
                if (message.includes('rate limit exceeded')) {
                    throw new Error(`GitHub API rate limit exceeded. Consider setting GITHUB_PERSONAL_ACCESS_TOKEN environment variable.`);
                } else if (message.includes('Not Found')) {
                    throw new Error(`Path not found: ${targetPath}`);
                } else {
                    throw new Error(`GitHub API error: ${message}`);
                }
            }

            // If contents is not an array, it might be a single file
            if (contents.type === 'file') {
                return {
                    path: contents.path,
                    type: 'file',
                    name: contents.name,
                    url: contents.download_url,
                    sha: contents.sha,
                };
            }
        }

        // Build tree node for this level
        const result: Record<string, any> = {
            path: targetPath,
            type: 'directory',
            children: {},
        };

        // Process each item
        for (const item of contents) {
            if (item.type === 'file') {
                result.children[item.name] = {
                    path: item.path,
                    type: 'file',
                    name: item.name,
                    url: item.download_url,
                    sha: item.sha,
                };
            } else if (item.type === 'dir') {
                // Limit depth to avoid infinite recursion
                if (targetPath.split('/').length < 6) {
                    try {
                        const subTree = await buildDirectoryTree(item.path);
                        result.children[item.name] = subTree;
                    } catch (error) {
                        logWarning(`Failed to fetch subdirectory ${item.path}: ${error instanceof Error ? error.message : String(error)}`);
                        result.children[item.name] = {
                            path: item.path,
                            type: 'directory',
                            error: 'Failed to fetch contents'
                        };
                    }
                } else {
                    result.children[item.name] = {
                        path: item.path,
                        type: 'directory',
                        note: 'Depth limit reached'
                    };
                }
            }
        }

        return result;
    } catch (error: any) {
        logError(`Error building directory tree for ${targetPath}`, error);

        if (error.message && (error.message.includes('rate limit') || error.message.includes('GitHub API error'))) {
            throw error;
        }

        if (error.response?.status === 404) {
            throw new Error(`Path not found: ${targetPath}`);
        } else if (error.response?.status === 403) {
            throw new Error(`GitHub API rate limit exceeded. Consider setting GITHUB_PERSONAL_ACCESS_TOKEN environment variable.`);
        }

        throw error;
    }
}

/**
 * Set or update GitHub API key for higher rate limits
 * @param apiKey GitHub Personal Access Token
 */
function setGitHubApiKey(apiKey: string): void {
    if (apiKey && apiKey.trim()) {
        (githubApi.defaults.headers as any)['Authorization'] = `Bearer ${apiKey.trim()}`;
        logInfo('GitHub API key updated successfully');
    } else {
        delete (githubApi.defaults.headers as any)['Authorization'];
        logInfo('GitHub API key removed - using unauthenticated requests');
    }
}

/**
 * Get current GitHub API rate limit status
 * @returns Promise with rate limit information
 */
async function getGitHubRateLimit(): Promise<any> {
    try {
        const response = await githubApi.get('/rate_limit');
        return response.data;
    } catch (error: any) {
        throw new Error(`Failed to get rate limit info: ${error.message}`);
    }
}

/**
 * Resolve a file path by trying multiple extensions
 * @param basePath Base directory path
 * @param name File name without extension
 * @param extensions Extensions to try in order
 * @returns Promise with file content
 */
async function getFileWithFallback(basePath: string, name: string, extensions = ['.ts', '.tsx']): Promise<string> {
    for (let i = 0; i < extensions.length; i++) {
        try {
            return await getSourceFile(`${basePath}/${name}${extensions[i]}`);
        } catch (error) {
            if (i === extensions.length - 1) throw error;
        }
    }
    throw new Error(`File not found: ${basePath}/${name}`);
}

/**
 * LibreChat Client specific paths
 */
const CLIENT_PATHS = {
    HOOKS: `${DEFAULT_PATH}/src/hooks`,
    COMPONENTS: `${DEFAULT_PATH}/src/components`,
    PROVIDERS: `${DEFAULT_PATH}/src/Providers`,
    UTILS: `${DEFAULT_PATH}/src/utils`,
    COMMON: `${DEFAULT_PATH}/src/common`,
    THEME: `${DEFAULT_PATH}/src/theme`,
    LOCALES: `${DEFAULT_PATH}/src/locales`,
    SVGS: `${DEFAULT_PATH}/src/svgs`,
    SRC: `${DEFAULT_PATH}/src`,
};

/**
 * Get a hook file from the hooks directory
 * @param hookName Name of the hook (with or without .ts/.tsx extension)
 * @returns Promise with hook source code
 */
async function getHook(hookName: string): Promise<string> {
    if (hookName.endsWith('.ts') || hookName.endsWith('.tsx')) {
        return await getSourceFile(`${CLIENT_PATHS.HOOKS}/${hookName}`);
    }
    return await getFileWithFallback(CLIENT_PATHS.HOOKS, hookName, ['.ts', '.tsx']);
}

/**
 * List all hooks in the hooks directory
 * @returns Promise with list of hook files
 */
async function listHooks(): Promise<any[]> {
    return await listFiles(CLIENT_PATHS.HOOKS);
}

/**
 * Get a component file from the components directory
 * @param componentPath Path to the component (can be nested like "Chat/Input.tsx")
 * @returns Promise with component source code
 */
async function getComponent(componentPath: string): Promise<string> {
    if (componentPath.endsWith('.ts') || componentPath.endsWith('.tsx')) {
        return await getSourceFile(`${CLIENT_PATHS.COMPONENTS}/${componentPath}`);
    }
    return await getFileWithFallback(CLIENT_PATHS.COMPONENTS, componentPath, ['.tsx', '.ts']);
}

/**
 * List components in the components directory
 * @param subdir Optional subdirectory within components
 * @returns Promise with list of component files/directories
 */
async function listComponents(subdir?: string): Promise<any[]> {
    const path = subdir ? `${CLIENT_PATHS.COMPONENTS}/${subdir}` : CLIENT_PATHS.COMPONENTS;
    return await listFiles(path);
}

/**
 * Get a provider file from the Providers directory
 * @param providerName Name of the provider
 * @returns Promise with provider source code
 */
async function getProvider(providerName: string): Promise<string> {
    if (providerName.endsWith('.ts') || providerName.endsWith('.tsx')) {
        return await getSourceFile(`${CLIENT_PATHS.PROVIDERS}/${providerName}`);
    }
    return await getFileWithFallback(CLIENT_PATHS.PROVIDERS, providerName, ['.tsx', '.ts']);
}

/**
 * List all providers
 * @returns Promise with list of provider files
 */
async function listProviders(): Promise<any[]> {
    return await listFiles(CLIENT_PATHS.PROVIDERS);
}

/**
 * Get a utility file from the utils directory
 * @param utilName Name of the utility file
 * @returns Promise with utility source code
 */
async function getUtil(utilName: string): Promise<string> {
    if (utilName.endsWith('.ts') || utilName.endsWith('.tsx')) {
        return await getSourceFile(`${CLIENT_PATHS.UTILS}/${utilName}`);
    }
    return await getFileWithFallback(CLIENT_PATHS.UTILS, utilName, ['.ts', '.tsx']);
}

/**
 * List all utility files
 * @returns Promise with list of utility files
 */
async function listUtils(): Promise<any[]> {
    return await listFiles(CLIENT_PATHS.UTILS);
}

/**
 * Get the package.json for the client package
 * @returns Promise with package.json content
 */
async function getPackageInfo(): Promise<any> {
    const content = await getSourceFile(`${DEFAULT_PATH}/package.json`);
    try {
        return JSON.parse(content);
    } catch {
        return { raw: content };
    }
}

/**
 * Get the store.ts file (state management)
 * @returns Promise with store source code
 */
async function getStore(): Promise<string> {
    return await getSourceFile(`${CLIENT_PATHS.SRC}/store.ts`);
}

/**
 * Get the main index.ts entry point
 * @returns Promise with index.ts source code
 */
async function getIndex(): Promise<string> {
    return await getSourceFile(`${CLIENT_PATHS.SRC}/index.ts`);
}

/**
 * Get the current rate limit state from tracked response headers
 */
function getRateLimitState() {
    return {
        ...rateLimitState,
        resetDate: rateLimitState.reset ? new Date(rateLimitState.reset * 1000).toISOString() : null,
    };
}

export const axios = {
    githubRaw,
    githubApi,
    getSourceFile,
    listFiles,
    buildDirectoryTree,
    setGitHubApiKey,
    getGitHubRateLimit,
    getRateLimitState,
    // LibreChat specific functions
    getHook,
    listHooks,
    getComponent,
    listComponents,
    getProvider,
    listProviders,
    getUtil,
    listUtils,
    getPackageInfo,
    getStore,
    getIndex,
    paths: {
        REPO_OWNER,
        REPO_NAME,
        REPO_BRANCH,
        DEFAULT_PATH,
        ...CLIENT_PATHS
    }
};


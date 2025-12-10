import { Axios } from "axios";
import { logError, logWarning, logInfo } from './logger.js';

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
    try {
        const response = await githubRaw.get(`/${filePath}`);
        if (response.status !== 200) {
            throw new Error(`File not found: ${filePath}`);
        }
        return response.data;
    } catch (error) {
        throw new Error(`File "${filePath}" not found in repository`);
    }
}

/**
 * List files in a directory
 * @param directory Directory path within the repository
 * @returns Promise with list of files
 */
async function listFiles(directory?: string): Promise<any[]> {
    const path = directory || DEFAULT_PATH;

    try {
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
    } catch (error: any) {
        logError(`Error listing files in ${path}`, error);

        if (error.response?.status === 403) {
            throw new Error(`GitHub API rate limit exceeded. Please set GITHUB_PERSONAL_ACCESS_TOKEN environment variable for higher limits.`);
        } else if (error.response?.status === 404) {
            throw new Error(`Directory not found: ${path}`);
        }

        throw error;
    }
}

/**
 * Recursively builds a directory tree structure from the repository
 * @param path Path within the repository to start building the tree from
 * @returns Promise resolving to the directory tree structure
 */
async function buildDirectoryTree(path?: string): Promise<any> {
    const targetPath = path || DEFAULT_PATH;

    try {
        const response = await githubApi.get(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${targetPath}?ref=${REPO_BRANCH}`);

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

export const axios = {
    githubRaw,
    githubApi,
    getSourceFile,
    listFiles,
    buildDirectoryTree,
    setGitHubApiKey,
    getGitHubRateLimit,
    paths: {
        REPO_OWNER,
        REPO_NAME,
        REPO_BRANCH,
        DEFAULT_PATH
    }
};

/**
 * Get the axios implementation (for compatibility with tool imports)
 */
export async function getAxiosImplementation() {
    return axios;
}

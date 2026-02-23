export const capabilities = {
  resources: {
    get_modules: {
      description:
        "List of all modules in the LibreChat Client package with descriptions and paths",
      uri: "resource:get_modules",
      contentType: "application/json",
    },
    get_package_structure: {
      description:
        "Overview of the LibreChat Client package structure and organization",
      uri: "resource:get_package_structure",
      contentType: "text/plain",
    },
    get_installation_guide: {
      description:
        "Get information about the LibreChat Client package structure",
      uriTemplate:
        "resource-template:get_installation_guide",
      contentType: "text/plain",
    },
  },
  prompts: {
    "explore-librechat-client": {
      description: "Explore the LibreChat Client package structure and available modules",
      arguments: {
        focus: {
          type: "string",
          description: "Area to focus on (hooks, components, providers, utils, store, all)",
        },
      },
    },
    "explore-hooks": {
      description: "Discover and understand available React hooks in LibreChat Client",
    },
    "explore-components": {
      description: "Browse and understand React components in LibreChat Client",
      arguments: {
        category: {
          type: "string",
          description: "Component category to explore (e.g., 'Chat', 'Nav', 'ui')",
        },
      },
    },
    "explore-providers": {
      description: "Understand Context providers and global state management",
    },
    "understand-state-management": {
      description: "Learn about state management patterns in LibreChat Client",
    },
    "implement-feature": {
      description: "Get guidance on implementing a feature using LibreChat Client",
      arguments: {
        feature: {
          type: "string",
          description: "The feature to implement (e.g., 'chat-interface', 'message-list', 'auth-flow')",
        },
      },
    },
  },
  tools: {
    get_source_file: {
      description: "Get the source code for any file in the LibreChat Client package",
      inputSchema: {
        type: "object",
        properties: {
          filePath: {
            type: "string",
            description: "Path to the source file within the LibreChat Client package",
          },
        },
        required: ["filePath"],
      },
    },
    list_files: {
      description: "List files in a directory within the LibreChat monorepo",
      inputSchema: {
        type: "object",
        properties: {
          directory: {
            type: "string",
            description: "Directory path within the repository",
          },
        },
      },
    },
    get_directory_structure: {
      description: "Get the full directory tree structure of the LibreChat Client package",
      inputSchema: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "Path within the repository",
          },
        },
      },
    },
    get_hook: {
      description: "Get the source code of a React hook from src/hooks/",
      inputSchema: {
        type: "object",
        properties: {
          hookName: {
            type: "string",
            description: "Name of the hook file (e.g., 'useConversation', 'useAuth')",
          },
        },
        required: ["hookName"],
      },
    },
    list_hooks: {
      description: "List all available React hooks in the LibreChat Client package",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
    get_component: {
      description: "Get the source code of a React component",
      inputSchema: {
        type: "object",
        properties: {
          componentPath: {
            type: "string",
            description: "Path to the component within src/components/",
          },
        },
        required: ["componentPath"],
      },
    },
    list_components: {
      description: "List component files/directories",
      inputSchema: {
        type: "object",
        properties: {
          subdir: {
            type: "string",
            description: "Subdirectory within components to list",
          },
        },
      },
    },
    get_provider: {
      description: "Get the source code of a React context provider",
      inputSchema: {
        type: "object",
        properties: {
          providerName: {
            type: "string",
            description: "Name of the provider",
          },
        },
        required: ["providerName"],
      },
    },
    list_providers: {
      description: "List all context providers in the LibreChat Client package",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
    get_util: {
      description: "Get the source code of a utility function from src/utils/",
      inputSchema: {
        type: "object",
        properties: {
          utilName: {
            type: "string",
            description: "Name of the utility file",
          },
        },
        required: ["utilName"],
      },
    },
    list_utils: {
      description: "List all utility files in the LibreChat Client package",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
    get_package_info: {
      description: "Get the package.json of the LibreChat Client package",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
    get_store: {
      description: "Get the store.ts file containing state management configuration",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
    get_index: {
      description: "Get the main index.ts entry point showing all package exports",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
    get_rate_limit: {
      description: "Get the current GitHub API rate limit status",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
    clear_cache: {
      description: "Clear the server cache. Optionally specify a prefix to clear only matching entries.",
      inputSchema: {
        type: "object",
        properties: {
          prefix: {
            type: "string",
            description: "Optional cache key prefix to clear (e.g., \"file:\" for files, \"dir:\" for directories). Omit to clear entire cache.",
          },
        },
      },
    },
    search_code: {
      description: "Search for code in the LibreChat Client package using GitHub Code Search API",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query string (e.g., \"useEffect\", \"interface ChatMessage\")",
          },
          extension: {
            type: "string",
            description: "Optional file extension filter (e.g., \"ts\", \"tsx\", \"json\")",
          },
        },
        required: ["query"],
      },
    },
    get_source_files: {
      description: "Fetch multiple source files in parallel. Returns results keyed by file path with individual success/failure status.",
      inputSchema: {
        type: "object",
        properties: {
          filePaths: {
            type: "array",
            items: { type: "string" },
            description: "Array of file paths to fetch",
          },
        },
        required: ["filePaths"],
      },
    },
  },
}

/**
 * Resources implementation for the LibreChat Client MCP server.
 *
 * This file defines the resources that can be returned by the server based on client requests.
 * Resources are static content or dynamically generated content referenced by URIs.
 */

import { logError } from '../utils/logger.js';

/**
 * LibreChat Client package module structure
 */
const LIBRECHAT_CLIENT_MODULES = {
  hooks: {
    path: 'packages/client/src/hooks',
    description: 'Custom React hooks for state management, API calls, and UI interactions',
    examples: ['useConversation', 'useAuth', 'useMessages', 'useChat']
  },
  components: {
    path: 'packages/client/src/components',
    description: 'Reusable React UI components organized by feature',
    examples: ['Chat', 'Nav', 'ui', 'Messages', 'Input']
  },
  Providers: {
    path: 'packages/client/src/Providers',
    description: 'React Context providers for global state and configuration',
    examples: ['AuthContext', 'ChatContext', 'ThemeProvider']
  },
  utils: {
    path: 'packages/client/src/utils',
    description: 'Utility functions and helper methods',
    examples: ['cn', 'api', 'format', 'validation']
  },
  common: {
    path: 'packages/client/src/common',
    description: 'Shared constants, types, and common utilities',
    examples: ['constants', 'types', 'enums']
  },
  theme: {
    path: 'packages/client/src/theme',
    description: 'Theme configuration, colors, and styling utilities',
    examples: ['colors', 'tokens', 'variants']
  },
  locales: {
    path: 'packages/client/src/locales',
    description: 'Internationalization files and translation strings',
    examples: ['en', 'es', 'fr', 'de']
  },
  svgs: {
    path: 'packages/client/src/svgs',
    description: 'SVG icons and graphic assets',
    examples: ['icons', 'logos', 'illustrations']
  },
  store: {
    path: 'packages/client/src/store.ts',
    description: 'State management store configuration (Zustand/Jotai)',
    examples: ['atoms', 'selectors', 'actions']
  }
};

/**
 * Resource definitions exported to the MCP handler
 * Each resource has a name, description, uri and contentType
 */
export const resources = [
  {
    name: 'get_modules',
    description: 'List of all modules in the LibreChat Client package with descriptions and paths',
    uri: 'resource:get_modules',
    contentType: 'application/json',
  },
  {
    name: 'get_package_structure',
    description: 'Overview of the LibreChat Client package structure and organization',
    uri: 'resource:get_package_structure',
    contentType: 'text/plain',
  }
];

/**
 * Handler for the get_modules resource
 * @returns List of available modules in LibreChat Client
 */
const getModulesList = async () => {
  try {
    return {
      content: JSON.stringify(LIBRECHAT_CLIENT_MODULES, null, 2),
      contentType: 'application/json',
    };
  } catch (error) {
    logError("Error fetching modules list", error);
    return {
      content: JSON.stringify({
        error: "Failed to fetch modules list",
        message: error instanceof Error ? error.message : String(error)
      }, null, 2),
      contentType: 'application/json',
    };
  }
};

/**
 * Handler for the get_package_structure resource
 * @returns Overview of the package structure
 */
const getPackageStructure = async () => {
  try {
    const structure = `# LibreChat Client Package Structure

## Repository
- **Repo**: danny-avila/LibreChat
- **Path**: packages/client
- **Branch**: main

## Directory Structure

packages/client/
├── src/
│   ├── index.ts          # Main entry point - exports all public APIs
│   ├── store.ts          # State management configuration
│   ├── hooks/            # React hooks
│   ├── components/       # UI components (organized by feature)
│   ├── Providers/        # Context providers
│   ├── utils/            # Utility functions
│   ├── common/           # Shared constants and types
│   ├── theme/            # Theming and styling
│   ├── locales/          # i18n translations
│   └── svgs/             # SVG assets
├── package.json          # Package configuration
├── tsconfig.json         # TypeScript configuration
├── rollup.config.js      # Build configuration
└── tailwind.config.js    # Tailwind CSS configuration

## Quick Start Tools

- \`list_hooks\` - See all available hooks
- \`list_components\` - Browse component directories
- \`list_providers\` - View context providers
- \`get_package_info\` - Get package.json details
- \`get_index\` - See all package exports
- \`get_store\` - View state management setup

## Exploring the Package

1. Start with \`get_index\` to see what's exported
2. Use \`list_*\` tools to discover available modules
3. Use \`get_*\` tools to read specific source files
`;

    return {
      content: structure,
      contentType: 'text/plain',
    };
  } catch (error) {
    logError("Error fetching package structure", error);
    return {
      content: `Error: ${error instanceof Error ? error.message : String(error)}`,
      contentType: 'text/plain',
    };
  }
};

/**
 * Map of resource URIs to their handler functions
 * Each handler function returns the resource content when requested
 */
export const resourceHandlers = {
  'resource:get_modules': getModulesList,
  'resource:get_package_structure': getPackageStructure,
};

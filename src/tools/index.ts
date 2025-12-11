// Base tools
import { handleGetSourceFile } from './source/get-source-file.js';
import { handleListFiles } from './source/list-files.js';
import { handleGetDirectoryStructure } from './source/get-directory-structure.js';

import { schema as getSourceFileSchema } from './source/get-source-file.js';
import { schema as listFilesSchema } from './source/list-files.js';
import { schema as getDirectoryStructureSchema } from './source/get-directory-structure.js';

// LibreChat-specific tools
import { handleGetHook } from './librechat/get-hook.js';
import { handleListHooks } from './librechat/list-hooks.js';
import { handleGetComponent } from './librechat/get-component.js';
import { handleListComponents } from './librechat/list-components.js';
import { handleGetProvider } from './librechat/get-provider.js';
import { handleListProviders } from './librechat/list-providers.js';
import { handleGetUtil } from './librechat/get-util.js';
import { handleListUtils } from './librechat/list-utils.js';
import { handleGetPackageInfo } from './librechat/get-package-info.js';
import { handleGetStore } from './librechat/get-store.js';
import { handleGetIndex } from './librechat/get-index.js';

import { schema as getHookSchema } from './librechat/get-hook.js';
import { schema as listHooksSchema } from './librechat/list-hooks.js';
import { schema as getComponentSchema } from './librechat/get-component.js';
import { schema as listComponentsSchema } from './librechat/list-components.js';
import { schema as getProviderSchema } from './librechat/get-provider.js';
import { schema as listProvidersSchema } from './librechat/list-providers.js';
import { schema as getUtilSchema } from './librechat/get-util.js';
import { schema as listUtilsSchema } from './librechat/list-utils.js';
import { schema as getPackageInfoSchema } from './librechat/get-package-info.js';
import { schema as getStoreSchema } from './librechat/get-store.js';
import { schema as getIndexSchema } from './librechat/get-index.js';

export const toolHandlers = {
  // Base tools
  get_source_file: handleGetSourceFile,
  list_files: handleListFiles,
  get_directory_structure: handleGetDirectoryStructure,
  // LibreChat-specific tools
  get_hook: handleGetHook,
  list_hooks: handleListHooks,
  get_component: handleGetComponent,
  list_components: handleListComponents,
  get_provider: handleGetProvider,
  list_providers: handleListProviders,
  get_util: handleGetUtil,
  list_utils: handleListUtils,
  get_package_info: handleGetPackageInfo,
  get_store: handleGetStore,
  get_index: handleGetIndex,
};

export const toolSchemas = {
  get_source_file: getSourceFileSchema,
  list_files: listFilesSchema,
  get_directory_structure: getDirectoryStructureSchema,
  get_hook: getHookSchema,
  list_hooks: listHooksSchema,
  get_component: getComponentSchema,
  list_components: listComponentsSchema,
  get_provider: getProviderSchema,
  list_providers: listProvidersSchema,
  get_util: getUtilSchema,
  list_utils: listUtilsSchema,
  get_package_info: getPackageInfoSchema,
  get_store: getStoreSchema,
  get_index: getIndexSchema,
};

export const tools = {
  // ===== Base Tools =====
  'get_source_file': {
    name: 'get_source_file',
    description: 'Get the source code for any file in the LibreChat Client package. Use the full path from packages/client/.',
    inputSchema: {
      type: 'object',
      properties: getSourceFileSchema,
      required: ['filePath']
    }
  },
  'list_files': {
    name: 'list_files',
    description: 'List files in a directory within the LibreChat monorepo. Defaults to packages/client.',
    inputSchema: {
      type: 'object',
      properties: listFilesSchema
    }
  },
  'get_directory_structure': {
    name: 'get_directory_structure',
    description: 'Get the full directory tree structure of the LibreChat Client package.',
    inputSchema: {
      type: 'object',
      properties: getDirectoryStructureSchema
    }
  },

  // ===== Hooks Tools =====
  'get_hook': {
    name: 'get_hook',
    description: 'Get the source code of a React hook from src/hooks/. Automatically handles .ts/.tsx extensions.',
    inputSchema: {
      type: 'object',
      properties: getHookSchema,
      required: ['hookName']
    }
  },
  'list_hooks': {
    name: 'list_hooks',
    description: 'List all available React hooks in the LibreChat Client package.',
    inputSchema: {
      type: 'object',
      properties: listHooksSchema
    }
  },

  // ===== Components Tools =====
  'get_component': {
    name: 'get_component',
    description: 'Get the source code of a React component. Supports nested paths like "Chat/Input" or "ui/Button".',
    inputSchema: {
      type: 'object',
      properties: getComponentSchema,
      required: ['componentPath']
    }
  },
  'list_components': {
    name: 'list_components',
    description: 'List component files/directories. Use subdir to explore nested component folders.',
    inputSchema: {
      type: 'object',
      properties: listComponentsSchema
    }
  },

  // ===== Providers Tools =====
  'get_provider': {
    name: 'get_provider',
    description: 'Get the source code of a React context provider from src/Providers/.',
    inputSchema: {
      type: 'object',
      properties: getProviderSchema,
      required: ['providerName']
    }
  },
  'list_providers': {
    name: 'list_providers',
    description: 'List all context providers in the LibreChat Client package.',
    inputSchema: {
      type: 'object',
      properties: listProvidersSchema
    }
  },

  // ===== Utils Tools =====
  'get_util': {
    name: 'get_util',
    description: 'Get the source code of a utility function from src/utils/.',
    inputSchema: {
      type: 'object',
      properties: getUtilSchema,
      required: ['utilName']
    }
  },
  'list_utils': {
    name: 'list_utils',
    description: 'List all utility files in the LibreChat Client package.',
    inputSchema: {
      type: 'object',
      properties: listUtilsSchema
    }
  },

  // ===== Package Info Tools =====
  'get_package_info': {
    name: 'get_package_info',
    description: 'Get the package.json of the LibreChat Client package, including dependencies and exports.',
    inputSchema: {
      type: 'object',
      properties: getPackageInfoSchema
    }
  },

  // ===== State Management Tools =====
  'get_store': {
    name: 'get_store',
    description: 'Get the store.ts file containing state management configuration.',
    inputSchema: {
      type: 'object',
      properties: getStoreSchema
    }
  },

  // ===== Entry Point Tools =====
  'get_index': {
    name: 'get_index',
    description: 'Get the main index.ts entry point showing all package exports.',
    inputSchema: {
      type: 'object',
      properties: getIndexSchema
    }
  },
};

import { handleGetSourceFile } from './source/get-source-file.js';
import { handleListFiles } from './source/list-files.js';
import { handleGetDirectoryStructure } from './source/get-directory-structure.js';

import { schema as getSourceFileSchema } from './source/get-source-file.js';
import { schema as listFilesSchema } from './source/list-files.js';
import { schema as getDirectoryStructureSchema } from './source/get-directory-structure.js';

export const toolHandlers = {
  get_source_file: handleGetSourceFile,
  list_files: handleListFiles,
  get_directory_structure: handleGetDirectoryStructure
};

export const toolSchemas = {
  get_source_file: getSourceFileSchema,
  list_files: listFilesSchema,
  get_directory_structure: getDirectoryStructureSchema
};

export const tools = {
  'get_source_file': {
    name: 'get_source_file',
    description: 'Get the source code for a specific file in the LibreChat Client package',
    inputSchema: {
      type: 'object',
      properties: getSourceFileSchema,
      required: ['filePath']
    }
  },
  'list_files': {
    name: 'list_files',
    description: 'List files in a directory within the LibreChat Client package',
    inputSchema: {
      type: 'object',
      properties: listFilesSchema
    }
  },
  'get_directory_structure': {
    name: 'get_directory_structure',
    description: 'Get the directory structure of the LibreChat Client repository',
    inputSchema: {
      type: 'object',
      properties: getDirectoryStructureSchema
    }
  }
};

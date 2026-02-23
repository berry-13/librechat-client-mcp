import { axios } from '../../utils/axios.js';
import { createToolHandler } from '../create-handler.js';

export const handleGetDirectoryStructure = createToolHandler(
  ({ path }: { path?: string }) => axios.buildDirectoryTree(path),
  'Failed to get directory structure'
);

export const schema = {
  path: {
    type: 'string',
    description: 'Path within the LibreChat Client repository (optional, defaults to package root)'
  }
};

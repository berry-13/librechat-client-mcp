import { axios } from '../../utils/axios.js';
import { createToolHandler } from '../create-handler.js';

export const handleListFiles = createToolHandler(
  ({ directory }: { directory?: string }) => axios.listFiles(directory),
  'Failed to list files'
);

export const schema = {
  directory: {
    type: 'string',
    description: 'Directory path within the LibreChat Client package (optional, defaults to root)'
  }
};

import { axios } from '../../utils/axios.js';
import { createToolHandler } from '../create-handler.js';

export const handleGetSourceFile = createToolHandler(
  ({ filePath }: { filePath: string }) => axios.getSourceFile(filePath),
  'Failed to get source file'
);

export const schema = {
  filePath: {
    type: 'string',
    description: 'Path to the source file within the LibreChat Client package (e.g., "src/api/index.ts")'
  }
};

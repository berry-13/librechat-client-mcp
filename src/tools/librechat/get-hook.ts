import { axios } from '../../utils/axios.js';
import { createToolHandler } from '../create-handler.js';

export const handleGetHook = createToolHandler(
  ({ hookName }: { hookName: string }) => axios.getHook(hookName),
  'Failed to get hook'
);

export const schema = {
  hookName: {
    type: 'string',
    description: 'Name of the hook file (e.g., "useConversation", "useAuth", "index"). Extension is optional.'
  }
};

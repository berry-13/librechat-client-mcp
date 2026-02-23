import { axios } from '../../utils/axios.js';
import { createToolHandler } from '../create-handler.js';

export const handleGetProvider = createToolHandler(
  ({ providerName }: { providerName: string }) => axios.getProvider(providerName),
  'Failed to get provider'
);

export const schema = {
  providerName: {
    type: 'string',
    description: 'Name of the provider file (e.g., "AuthContext", "ChatContext", "index"). Extension is optional.'
  }
};

import { axios } from '../../utils/axios.js';
import { createToolHandler } from '../create-handler.js';

export const handleGetUtil = createToolHandler(
  ({ utilName }: { utilName: string }) => axios.getUtil(utilName),
  'Failed to get util'
);

export const schema = {
  utilName: {
    type: 'string',
    description: 'Name of the utility file (e.g., "cn", "api", "helpers"). Extension is optional.'
  }
};

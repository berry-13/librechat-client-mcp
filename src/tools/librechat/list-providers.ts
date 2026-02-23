import { axios } from '../../utils/axios.js';
import { createToolHandler } from '../create-handler.js';

export const handleListProviders = createToolHandler(
  () => axios.listProviders(),
  'Failed to list providers'
);

export const schema = {};

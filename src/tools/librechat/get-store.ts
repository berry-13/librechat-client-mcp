import { axios } from '../../utils/axios.js';
import { createToolHandler } from '../create-handler.js';

export const handleGetStore = createToolHandler(
  () => axios.getStore(),
  'Failed to get store'
);

export const schema = {};

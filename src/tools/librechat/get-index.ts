import { axios } from '../../utils/axios.js';
import { createToolHandler } from '../create-handler.js';

export const handleGetIndex = createToolHandler(
  () => axios.getIndex(),
  'Failed to get index'
);

export const schema = {};

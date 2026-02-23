import { axios } from '../../utils/axios.js';
import { createToolHandler } from '../create-handler.js';

export const handleListUtils = createToolHandler(
  () => axios.listUtils(),
  'Failed to list utils'
);

export const schema = {};

import { axios } from '../../utils/axios.js';
import { createToolHandler } from '../create-handler.js';

export const handleListHooks = createToolHandler(
  () => axios.listHooks(),
  'Failed to list hooks'
);

export const schema = {};

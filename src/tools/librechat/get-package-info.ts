import { axios } from '../../utils/axios.js';
import { createToolHandler } from '../create-handler.js';

export const handleGetPackageInfo = createToolHandler(
  () => axios.getPackageInfo(),
  'Failed to get package info'
);

export const schema = {};

import { axios } from '../../utils/axios.js';
import { createToolHandler } from '../create-handler.js';

export const handleListComponents = createToolHandler(
  ({ subdir }: { subdir?: string }) => axios.listComponents(subdir),
  'Failed to list components'
);

export const schema = {
  subdir: {
    type: 'string',
    description: 'Optional subdirectory within components (e.g., "Chat", "ui", "Nav"). Leave empty to list root component directories.'
  }
};

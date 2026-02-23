import { axios } from '../../utils/axios.js';
import { createToolHandler } from '../create-handler.js';

export const handleGetComponent = createToolHandler(
  ({ componentPath }: { componentPath: string }) => axios.getComponent(componentPath),
  'Failed to get component'
);

export const schema = {
  componentPath: {
    type: 'string',
    description: 'Path to the component within src/components/ (e.g., "Chat/Input", "ui/Button", "Nav/index"). Can be nested. Extension is optional.'
  }
};

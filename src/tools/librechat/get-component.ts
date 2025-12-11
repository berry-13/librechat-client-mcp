import { getAxiosImplementation } from '../../utils/axios.js';
import { logError } from '../../utils/logger.js';

export async function handleGetComponent({ componentPath }: { componentPath: string }) {
  try {
    const axios = await getAxiosImplementation();
    const sourceCode = await axios.getComponent(componentPath);
    return {
      content: [{ type: "text", text: sourceCode }]
    };
  } catch (error) {
    logError(`Failed to get component "${componentPath}"`, error);
    throw new Error(`Failed to get component "${componentPath}": ${error instanceof Error ? error.message : String(error)}`);
  }
}

export const schema = {
  componentPath: {
    type: 'string',
    description: 'Path to the component within src/components/ (e.g., "Chat/Input", "ui/Button", "Nav/index"). Can be nested. Extension is optional.'
  }
};

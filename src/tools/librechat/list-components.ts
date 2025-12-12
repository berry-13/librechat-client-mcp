import { getAxiosImplementation } from '../../utils/axios.js';
import { logError } from '../../utils/logger.js';

export async function handleListComponents({ subdir }: { subdir?: string }) {
  try {
    const axios = await getAxiosImplementation();
    const components = await axios.listComponents(subdir);
    return {
      content: [{ type: "text", text: JSON.stringify(components, null, 2) }]
    };
  } catch (error) {
    logError(`Failed to list components${subdir ? ` in ${subdir}` : ''}`, error);
    throw new Error(`Failed to list components: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export const schema = {
  subdir: {
    type: 'string',
    description: 'Optional subdirectory within components (e.g., "Chat", "ui", "Nav"). Leave empty to list root component directories.'
  }
};

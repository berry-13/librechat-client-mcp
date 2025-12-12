import { getAxiosImplementation } from '../../utils/axios.js';
import { logError } from '../../utils/logger.js';

export async function handleGetStore() {
  try {
    const axios = await getAxiosImplementation();
    const sourceCode = await axios.getStore();
    return {
      content: [{ type: "text", text: sourceCode }]
    };
  } catch (error) {
    logError('Failed to get store', error);
    throw new Error(`Failed to get store: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export const schema = {};

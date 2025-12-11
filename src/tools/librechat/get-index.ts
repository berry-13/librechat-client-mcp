import { getAxiosImplementation } from '../../utils/axios.js';
import { logError } from '../../utils/logger.js';

export async function handleGetIndex() {
  try {
    const axios = await getAxiosImplementation();
    const sourceCode = await axios.getIndex();
    return {
      content: [{ type: "text", text: sourceCode }]
    };
  } catch (error) {
    logError('Failed to get index', error);
    throw new Error(`Failed to get index: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export const schema = {};

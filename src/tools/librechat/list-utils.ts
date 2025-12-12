import { getAxiosImplementation } from '../../utils/axios.js';
import { logError } from '../../utils/logger.js';

export async function handleListUtils() {
  try {
    const axios = await getAxiosImplementation();
    const utils = await axios.listUtils();
    return {
      content: [{ type: "text", text: JSON.stringify(utils, null, 2) }]
    };
  } catch (error) {
    logError('Failed to list utils', error);
    throw new Error(`Failed to list utils: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export const schema = {};

import { getAxiosImplementation } from '../../utils/axios.js';
import { logError } from '../../utils/logger.js';

export async function handleListHooks() {
  try {
    const axios = await getAxiosImplementation();
    const hooks = await axios.listHooks();
    return {
      content: [{ type: "text", text: JSON.stringify(hooks, null, 2) }]
    };
  } catch (error) {
    logError('Failed to list hooks', error);
    throw new Error(`Failed to list hooks: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export const schema = {};

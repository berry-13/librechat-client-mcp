import { getAxiosImplementation } from '../../utils/axios.js';
import { logError } from '../../utils/logger.js';

export async function handleListProviders() {
  try {
    const axios = await getAxiosImplementation();
    const providers = await axios.listProviders();
    return {
      content: [{ type: "text", text: JSON.stringify(providers, null, 2) }]
    };
  } catch (error) {
    logError('Failed to list providers', error);
    throw new Error(`Failed to list providers: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export const schema = {};

import { getAxiosImplementation } from '../../utils/axios.js';
import { logError } from '../../utils/logger.js';

export async function handleGetProvider({ providerName }: { providerName: string }) {
  try {
    const axios = await getAxiosImplementation();
    const sourceCode = await axios.getProvider(providerName);
    return {
      content: [{ type: "text", text: sourceCode }]
    };
  } catch (error) {
    logError(`Failed to get provider "${providerName}"`, error);
    throw new Error(`Failed to get provider "${providerName}": ${error instanceof Error ? error.message : String(error)}`);
  }
}

export const schema = {
  providerName: {
    type: 'string',
    description: 'Name of the provider file (e.g., "AuthContext", "ChatContext", "index"). Extension is optional.'
  }
};

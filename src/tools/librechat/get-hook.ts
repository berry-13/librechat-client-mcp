import { getAxiosImplementation } from '../../utils/axios.js';
import { logError } from '../../utils/logger.js';

export async function handleGetHook({ hookName }: { hookName: string }) {
  try {
    const axios = await getAxiosImplementation();
    const sourceCode = await axios.getHook(hookName);
    return {
      content: [{ type: "text", text: sourceCode }]
    };
  } catch (error) {
    logError(`Failed to get hook "${hookName}"`, error);
    throw new Error(`Failed to get hook "${hookName}": ${error instanceof Error ? error.message : String(error)}`);
  }
}

export const schema = {
  hookName: {
    type: 'string',
    description: 'Name of the hook file (e.g., "useConversation", "useAuth", "index"). Extension is optional.'
  }
};

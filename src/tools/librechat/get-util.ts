import { getAxiosImplementation } from '../../utils/axios.js';
import { logError } from '../../utils/logger.js';

export async function handleGetUtil({ utilName }: { utilName: string }) {
  try {
    const axios = await getAxiosImplementation();
    const sourceCode = await axios.getUtil(utilName);
    return {
      content: [{ type: "text", text: sourceCode }]
    };
  } catch (error) {
    logError(`Failed to get util "${utilName}"`, error);
    throw new Error(`Failed to get util "${utilName}": ${error instanceof Error ? error.message : String(error)}`);
  }
}

export const schema = {
  utilName: {
    type: 'string',
    description: 'Name of the utility file (e.g., "cn", "api", "helpers"). Extension is optional.'
  }
};

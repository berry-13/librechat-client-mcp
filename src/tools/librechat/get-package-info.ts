import { getAxiosImplementation } from '../../utils/axios.js';
import { logError } from '../../utils/logger.js';

export async function handleGetPackageInfo() {
  try {
    const axios = await getAxiosImplementation();
    const packageInfo = await axios.getPackageInfo();
    return {
      content: [{ type: "text", text: JSON.stringify(packageInfo, null, 2) }]
    };
  } catch (error) {
    logError('Failed to get package info', error);
    throw new Error(`Failed to get package info: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export const schema = {};

import { getAxiosImplementation } from '../../utils/axios.js';
import { logError } from '../../utils/logger.js';

export async function handleListFiles({ directory }: { directory?: string }) {
  try {
    const axios = await getAxiosImplementation();
    const files = await axios.listFiles(directory);
    return {
      content: [{ type: "text", text: JSON.stringify(files, null, 2) }]
    };
  } catch (error) {
    logError(`Failed to list files in "${directory || 'root'}"`, error);
    throw new Error(`Failed to list files: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export const schema = {
  directory: {
    type: 'string',
    description: 'Directory path within the LibreChat Client package (optional, defaults to root)'
  }
};

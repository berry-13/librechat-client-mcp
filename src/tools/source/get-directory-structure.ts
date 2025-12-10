import { getAxiosImplementation } from '../../utils/axios.js';
import { logError } from '../../utils/logger.js';

export async function handleGetDirectoryStructure({ path }: { path?: string }) {
  try {
    const axios = await getAxiosImplementation();
    const structure = await axios.buildDirectoryTree(path);
    return {
      content: [{ type: "text", text: JSON.stringify(structure, null, 2) }]
    };
  } catch (error) {
    logError(`Failed to get directory structure for "${path || 'root'}"`, error);
    throw new Error(`Failed to get directory structure: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export const schema = {
  path: {
    type: 'string',
    description: 'Path within the LibreChat Client repository (optional, defaults to package root)'
  }
};

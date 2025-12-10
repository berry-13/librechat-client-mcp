import { getAxiosImplementation } from '../../utils/axios.js';
import { logError } from '../../utils/logger.js';

export async function handleGetSourceFile({ filePath }: { filePath: string }) {
  try {
    const axios = await getAxiosImplementation();
    const sourceCode = await axios.getSourceFile(filePath);
    return {
      content: [{ type: "text", text: sourceCode }]
    };
  } catch (error) {
    logError(`Failed to get source file "${filePath}"`, error);
    throw new Error(`Failed to get source file "${filePath}": ${error instanceof Error ? error.message : String(error)}`);
  }
}

export const schema = {
  filePath: {
    type: 'string',
    description: 'Path to the source file within the LibreChat Client package (e.g., "src/api/index.ts")'
  }
};

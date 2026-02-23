import { axios } from '../../utils/axios.js';
import { logError } from '../../utils/logger.js';

type ToolResult = {
  content: Array<{ type: string; text: string }>;
};

export async function handleGetSourceFiles({ filePaths }: { filePaths: string[] }): Promise<ToolResult> {
  try {
    const results = await Promise.allSettled(
      filePaths.map(async (filePath) => {
        const content = await axios.getSourceFile(filePath);
        return { filePath, content };
      })
    );

    const output: Record<string, { status: string; content?: string; error?: string }> = {};
    for (const result of results) {
      if (result.status === 'fulfilled') {
        output[result.value.filePath] = { status: 'success', content: result.value.content };
      } else {
        const filePath = filePaths[results.indexOf(result)];
        output[filePath] = { status: 'error', error: result.reason?.message || String(result.reason) };
      }
    }

    return {
      content: [{ type: "text", text: JSON.stringify(output, null, 2) }]
    };
  } catch (error) {
    logError('Failed to batch fetch files', error);
    throw new Error(`Failed to batch fetch files: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export const schema = {
  filePaths: {
    type: 'array',
    items: { type: 'string' },
    description: 'Array of file paths to fetch (e.g., ["packages/client/src/hooks/useAuth.ts", "packages/client/src/utils/cn.ts"])'
  }
};

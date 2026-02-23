import { logError } from '../utils/logger.js';

type ToolResult = {
  content: Array<{ type: string; text: string }>;
};

export function createToolHandler<T extends Record<string, any>>(
  fn: (params: T) => Promise<any>,
  errorContext: string
): (params: T) => Promise<ToolResult> {
  return async (params: T): Promise<ToolResult> => {
    try {
      const result = await fn(params);
      const text = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
      return { content: [{ type: "text", text }] };
    } catch (error) {
      logError(errorContext, error);
      throw new Error(`${errorContext}: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
}

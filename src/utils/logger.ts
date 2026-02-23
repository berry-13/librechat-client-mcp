/**
 * Logging utility with structured JSON output in production
 * All logging goes to stderr to avoid interfering with JSON-RPC stdout communication
 */

const isProduction = process.env.NODE_ENV === 'production';

let requestId: string | undefined;

/**
 * Set the current request correlation ID
 */
export function setRequestId(id: string | undefined): void {
  requestId = id;
}

/**
 * Get the current request correlation ID
 */
export function getRequestId(): string | undefined {
  return requestId;
}

function formatMessage(level: string, message: string, metadata?: Record<string, any>): string {
  if (isProduction) {
    const entry: Record<string, any> = {
      timestamp: new Date().toISOString(),
      level,
      message,
    };
    if (requestId) entry.requestId = requestId;
    if (metadata) Object.assign(entry, metadata);
    return JSON.stringify(entry);
  }

  const prefix = `${level.toUpperCase()}: ${message}`;
  if (metadata && Object.keys(metadata).length > 0) {
    return `${prefix} ${JSON.stringify(metadata)}`;
  }
  return prefix;
}

/**
 * Log an error message
 */
export function logError(message: string, error?: any): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const metadata: Record<string, any> = { error: errorMessage };
  if (error instanceof Error && error.stack) {
    metadata.stack = error.stack;
  }
  console.error(formatMessage('error', message, metadata));
}

/**
 * Log a warning message
 */
export function logWarning(message: string, metadata?: Record<string, any>): void {
  console.error(formatMessage('warn', message, metadata));
}

/**
 * Log an info message
 */
export function logInfo(message: string, metadata?: Record<string, any>): void {
  console.error(formatMessage('info', message, metadata));
}

import { logWarning } from './logger.js';

export interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
}

const TRANSIENT_STATUS_CODES = new Set([500, 502, 503, 504]);
const TRANSIENT_ERROR_CODES = new Set(['ECONNRESET', 'ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'EAI_AGAIN']);

function isTransientError(error: any): boolean {
  if (error?.response?.status && TRANSIENT_STATUS_CODES.has(error.response.status)) {
    return true;
  }
  if (error?.code && TRANSIENT_ERROR_CODES.has(error.code)) {
    return true;
  }
  return false;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries = 3, baseDelay = 1000, maxDelay = 8000 } = options;

  let lastError: any;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      if (attempt === maxRetries || !isTransientError(error)) {
        throw error;
      }

      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      logWarning(`Transient error (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms: ${error.message || error}`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

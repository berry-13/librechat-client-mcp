import { cache } from '../../utils/cache.js';
import { createToolHandler } from '../create-handler.js';

export const handleClearCache = createToolHandler(
  async ({ prefix }: { prefix?: string }) => {
    if (prefix) {
      const count = cache.deleteByPrefix(prefix);
      return { cleared: count, scope: prefix };
    }
    cache.clear();
    return { cleared: 'all', scope: 'full' };
  },
  'Failed to clear cache'
);

export const schema = {
  prefix: {
    type: 'string',
    description: 'Optional cache key prefix to clear (e.g., "file:" for files, "dir:" for directories). Omit to clear entire cache.'
  }
};

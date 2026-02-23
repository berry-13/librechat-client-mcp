import { axios } from '../../utils/axios.js';
import { createToolHandler } from '../create-handler.js';

export const handleGetRateLimit = createToolHandler(
  async () => {
    const [apiRateLimit, trackedState] = await Promise.all([
      axios.getGitHubRateLimit().catch(() => null),
      Promise.resolve(axios.getRateLimitState()),
    ]);

    return {
      tracked: trackedState,
      api: apiRateLimit?.rate || apiRateLimit || null,
    };
  },
  'Failed to get rate limit info'
);

export const schema = {};

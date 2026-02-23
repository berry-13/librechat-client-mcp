import { axios } from '../../utils/axios.js';
import { createToolHandler } from '../create-handler.js';

export const handleSearchCode = createToolHandler(
  async ({ query, extension }: { query: string; extension?: string }) => {
    const paths = axios.paths;
    let searchQuery = `${query} repo:${paths.REPO_OWNER}/${paths.REPO_NAME} path:${paths.DEFAULT_PATH}`;
    if (extension) {
      searchQuery += ` extension:${extension}`;
    }

    const response = await axios.githubApi.get(`/search/code?q=${encodeURIComponent(searchQuery)}`);

    if (!response.data || response.status !== 200) {
      throw new Error('GitHub Code Search API request failed');
    }

    const results = response.data.items?.map((item: any) => ({
      name: item.name,
      path: item.path,
      url: item.html_url,
    })) || [];

    return {
      total_count: response.data.total_count,
      results,
    };
  },
  'Failed to search code'
);

export const schema = {
  query: {
    type: 'string',
    description: 'Search query string (e.g., "useEffect", "interface ChatMessage", "import axios")'
  },
  extension: {
    type: 'string',
    description: 'Optional file extension filter (e.g., "ts", "tsx", "json")'
  }
};

/**
 * Prompts for the LibreChat Client MCP server
 *
 * These prompts help AI assistants understand and work with the LibreChat Client package.
 */

/**
 * List of prompts metadata available in this MCP server
 * Each prompt must have a name, description, and arguments if parameters are needed
 */
export const prompts = {
  "explore-librechat-client": {
    name: "explore-librechat-client",
    description: "Explore the LibreChat Client package structure and available APIs",
    arguments: [
      {
        name: "focus",
        description: "Area to focus on (api, types, hooks, utils, all)",
      },
    ],
  },
  "understand-api-endpoint": {
    name: "understand-api-endpoint",
    description: "Understand how to use a specific LibreChat API endpoint",
    arguments: [
      {
        name: "endpoint",
        description: "The API endpoint to understand (e.g., 'messages', 'conversations', 'users')",
        required: true,
      },
    ],
  },
  "implement-librechat-feature": {
    name: "implement-librechat-feature",
    description: "Get guidance on implementing a feature using LibreChat Client",
    arguments: [
      {
        name: "feature",
        description: "The feature to implement (e.g., 'send-message', 'list-conversations', 'authentication')",
        required: true,
      },
      {
        name: "framework",
        description: "Target framework (react, vue, vanilla-js)",
      },
    ],
  },
};

/**
 * Map of prompt names to their handler functions
 * Each handler generates the actual prompt content with the provided parameters
 */
export const promptHandlers = {
  "explore-librechat-client": ({
    focus = "all",
  }: {
    focus?: string;
  }) => {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Explore the LibreChat Client package with focus on: ${focus}

INSTRUCTIONS:
1. Use the MCP tools to explore the package structure:
   - Use 'get_directory_structure' to see the overall layout
   - Use 'list_files' to see files in specific directories
   - Use 'get_source_file' to read specific implementation files

2. Focus areas:
   ${focus === "api" || focus === "all" ? "- API layer: How API calls are structured and made" : ""}
   ${focus === "types" || focus === "all" ? "- Types: TypeScript interfaces and type definitions" : ""}
   ${focus === "hooks" || focus === "all" ? "- Hooks: React hooks for state management and API integration" : ""}
   ${focus === "utils" || focus === "all" ? "- Utils: Utility functions and helpers" : ""}

3. Provide a summary of:
   - Key exports and their purposes
   - Common usage patterns
   - Integration approaches`,
          },
        },
      ],
    };
  },

  "understand-api-endpoint": ({
    endpoint,
  }: {
    endpoint: string;
  }) => {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Help me understand the ${endpoint} API endpoint in LibreChat Client.

INSTRUCTIONS:
1. Use the MCP tools to find relevant source files:
   - Look for files related to '${endpoint}' in the api directory
   - Find TypeScript types for request/response payloads
   - Locate any hooks that wrap this endpoint

2. Explain:
   - Request/response format
   - Required and optional parameters
   - Authentication requirements
   - Error handling patterns
   - Example usage code

3. Provide working code examples for calling this endpoint.`,
          },
        },
      ],
    };
  },

  "implement-librechat-feature": ({
    feature,
    framework = "react",
  }: {
    feature: string;
    framework?: string;
  }) => {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Help me implement the "${feature}" feature using LibreChat Client in ${framework}.

INSTRUCTIONS:
1. First, explore the relevant parts of LibreChat Client:
   - Use 'get_directory_structure' to understand the package layout
   - Use 'get_source_file' to read the relevant API implementations
   - Find related types and hooks

2. Implementation guidance for ${framework}:
   ${framework === "react" ? "- Use React hooks provided by the package\n   - Implement proper state management\n   - Handle loading and error states" : ""}
   ${framework === "vue" ? "- Use Vue Composition API patterns\n   - Implement reactive state\n   - Handle async operations properly" : ""}
   ${framework === "vanilla-js" ? "- Use the raw API client\n   - Handle promises and async/await\n   - Implement error handling" : ""}

3. Provide:
   - Complete implementation code
   - Type-safe usage
   - Error handling
   - Loading states (if applicable)
   - Example usage`,
          },
        },
      ],
    };
  },
};

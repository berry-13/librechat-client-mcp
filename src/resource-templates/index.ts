/**
 * Resource templates implementation for the LibreChat Client MCP server.
 *
 * This file defines resource templates that can be used to dynamically generate
 * resources based on parameters in the URI.
 */

/**
 * Resource template definitions exported to the MCP handler
 * Each template has a name, description, uriTemplate and contentType
 */
export const resourceTemplates = [
  {
    name: "get_installation_guide",
    description: "Get the installation guide for LibreChat Client based on package manager",
    uriTemplate: "resource-template:get_installation_guide?packageManager={packageManager}",
    contentType: "text/plain",
  },
];

/**
 * Extract parameters from URI
 * @param uri URI to extract from
 * @param paramName Name of parameter to extract
 * @returns Parameter value or undefined
 */
function extractParam(uri: string, paramName: string): string | undefined {
  const match = uri.match(new RegExp(`${paramName}=([^&]+)`));
  return match?.[1];
}

/**
 * Gets a resource template handler for a given URI
 * @param uri The URI of the resource template
 * @returns A function that generates the resource
 */
export const getResourceTemplate = (uri: string) => {
  // Installation guide template
  if (uri.startsWith("resource-template:get_installation_guide")) {
    return async () => {
      try {
        const packageManager = extractParam(uri, "packageManager") || "npm";

        const installCommand = packageManager === "npm"
          ? "npm install @danny-avila/librechat-client"
          : packageManager === "pnpm"
            ? "pnpm add @danny-avila/librechat-client"
            : packageManager === "yarn"
              ? "yarn add @danny-avila/librechat-client"
              : packageManager === "bun"
                ? "bun add @danny-avila/librechat-client"
                : "npm install @danny-avila/librechat-client";

        const guide = `# LibreChat Client Installation Guide

## Installation

Install the LibreChat Client package using ${packageManager}:

\`\`\`bash
${installCommand}
\`\`\`

## Basic Usage

\`\`\`typescript
import { LibreChatClient } from '@danny-avila/librechat-client';

// Initialize the client
const client = new LibreChatClient({
  baseURL: 'https://your-librechat-instance.com',
  // Add authentication as needed
});

// Example: Fetch conversations
const conversations = await client.getConversations();
\`\`\`

## Configuration

The client can be configured with the following options:

- \`baseURL\`: The URL of your LibreChat instance
- \`apiKey\`: Optional API key for authentication
- \`timeout\`: Request timeout in milliseconds

## Documentation

For more detailed documentation, use the MCP tools to explore the source code:

- \`get_directory_structure\`: See the package structure
- \`get_source_file\`: Read specific source files
- \`list_files\`: List files in directories
`;

        return {
          content: guide,
          contentType: "text/plain",
        };
      } catch (error) {
        return {
          content: `Error generating installation guide: ${error instanceof Error ? error.message : String(error)
            }`,
          contentType: "text/plain",
        };
      }
    };
  }

  return undefined;
};

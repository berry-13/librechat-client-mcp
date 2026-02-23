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
    description: "Get information about the LibreChat Client package structure",
    uriTemplate: "resource-template:get_installation_guide",
    contentType: "text/plain",
  },
];

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
        const guide = `# LibreChat Client Package

## Overview

The LibreChat Client package is part of the LibreChat monorepo and provides the client-side functionality for the LibreChat application.

## Source Location

The client package is located at:
- Repository: https://github.com/danny-avila/LibreChat
- Path: \`packages/client\`

## Exploring the Package

Use the MCP tools to explore the source code:

### List Package Contents
Use \`list_files\` to see the package structure:
- \`list_files\` with no arguments lists the root of packages/client
- \`list_files\` with \`directory: "packages/client/src"\` lists the src directory

### Read Source Files
Use \`get_source_file\` to read specific files:
- Example: \`get_source_file\` with \`filePath: "packages/client/package.json"\`
- Example: \`get_source_file\` with \`filePath: "packages/client/src/index.ts"\`

### Browse Directory Tree
Use \`get_directory_structure\` to see the full directory tree:
- Returns a nested structure of all files and directories

## Package Structure

The client package typically contains:
- \`src/\` - Source code
- \`package.json\` - Package configuration
- TypeScript types and interfaces
- API client implementations
- React hooks and utilities
`;

        return {
          content: guide,
          contentType: "text/plain",
        };
      } catch (error) {
        return {
          content: `Error generating guide: ${error instanceof Error ? error.message : String(error)
            }`,
          contentType: "text/plain",
        };
      }
    };
  }

  return undefined;
};

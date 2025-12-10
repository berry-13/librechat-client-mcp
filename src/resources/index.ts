/**
 * Resources implementation for the LibreChat Client MCP server.
 *
 * This file defines the resources that can be returned by the server based on client requests.
 * Resources are static content or dynamically generated content referenced by URIs.
 */

import { logError } from '../utils/logger.js';

/**
 * Resource definitions exported to the MCP handler
 * Each resource has a name, description, uri and contentType
 */
export const resources = [
  {
    name: 'get_modules',
    description: 'List of available modules in the LibreChat Client package',
    uri: 'resource:get_modules',
    contentType: 'text/plain',
  }
];

/**
 * Handler for the get_modules resource
 * @returns List of available modules in LibreChat Client
 */
const getModulesList = async () => {
  try {
    // List of available modules in LibreChat Client
    // This will be populated once we have the actual package structure
    const modules = [
      "api",
      "types",
      "hooks",
      "utils",
      "config"
    ];

    return {
      content: JSON.stringify(modules, null, 2),
      contentType: 'application/json',
    };
  } catch (error) {
    logError("Error fetching modules list", error);
    return {
      content: JSON.stringify({
        error: "Failed to fetch modules list",
        message: error instanceof Error ? error.message : String(error)
      }, null, 2),
      contentType: 'application/json',
    };
  }
};

/**
 * Map of resource URIs to their handler functions
 * Each handler function returns the resource content when requested
 */
export const resourceHandlers = {
  'resource:get_modules': getModulesList,
};

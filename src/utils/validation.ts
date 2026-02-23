import Joi from 'joi';


/**
 * Validation schemas for different request types
 */
export const validationSchemas = {
  // Source file path
  filePath: Joi.object({
    filePath: Joi.string().required().min(1).max(500)
      .description('Path to the source file within the repository')
  }),

  // Directory listing
  directory: Joi.object({
    directory: Joi.string().optional().max(500)
      .description('Directory path within the repository')
  }),

  // Directory structure
  directoryStructure: Joi.object({
    path: Joi.string().optional().max(500)
      .description('Path within the repository')
  }),

  // Hook name
  hookName: Joi.object({
    hookName: Joi.string().required().min(1).max(200)
      .description('Name of the hook file')
  }),

  // Component path
  componentPath: Joi.object({
    componentPath: Joi.string().required().min(1).max(300)
      .description('Path to the component within src/components/')
  }),

  // Component listing with optional subdir
  componentList: Joi.object({
    subdir: Joi.string().optional().max(200)
      .description('Subdirectory within components')
  }),

  // Provider name
  providerName: Joi.object({
    providerName: Joi.string().required().min(1).max(200)
      .description('Name of the provider')
  }),

  // Util name
  utilName: Joi.object({
    utilName: Joi.string().required().min(1).max(200)
      .description('Name of the utility file')
  }),

  // Cache control
  clearCache: Joi.object({
    prefix: Joi.string().optional().max(100)
      .description('Cache key prefix to clear')
  }),

  // Code search
  searchCode: Joi.object({
    query: Joi.string().required().min(1).max(500)
      .description('Search query string'),
    extension: Joi.string().optional().max(20)
      .description('File extension filter')
  }),

  // Batch file fetch
  sourceFiles: Joi.object({
    filePaths: Joi.array().items(Joi.string().min(1).max(500)).required().min(1).max(20)
      .description('Array of file paths to fetch')
  }),

  // Empty params (for tools with no arguments)
  empty: Joi.object({}),

  // Resource schemas
  resourceRequest: Joi.object({
    uri: Joi.string().required().min(1).max(1000)
      .description('Resource URI')
  }),

  // Prompt schemas
  promptRequest: Joi.object({
    name: Joi.string().required().min(1).max(200)
      .description('Prompt name'),
    arguments: Joi.object().optional()
      .description('Prompt arguments')
  }),

  // Tool schemas
  toolRequest: Joi.object({
    name: Joi.string().required().min(1).max(200)
      .description('Tool name'),
    arguments: Joi.object().optional()
      .description('Tool arguments')
  })
};

/**
 * Validate request parameters against a schema
 * @param schema Joi schema to validate against
 * @param params Parameters to validate
 * @returns Validated parameters
 * @throws ValidationError if validation fails
 */
export function validateRequest<T>(
  schema: Joi.ObjectSchema,
  params: any
): T {
  try {
    const { error, value } = schema.validate(params, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false
    });

    if (error) {
      const errorMessages = error.details.map(detail =>
        `${detail.path.join('.')}: ${detail.message}`
      ).join(', ');

      throw new Error(`Validation failed: ${errorMessages}`);
    }

    return value as T;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Unexpected validation error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Get validation schema for a specific method
 * @param method Method name
 * @returns Joi schema or undefined
 */
export function getValidationSchema(method: string): Joi.ObjectSchema | undefined {
  const schemaMap: Record<string, Joi.ObjectSchema> = {
    // Source tools
    'get_source_file': validationSchemas.filePath,
    'list_files': validationSchemas.directory,
    'get_directory_structure': validationSchemas.directoryStructure,

    // Hook tools
    'get_hook': validationSchemas.hookName,
    'list_hooks': validationSchemas.empty,

    // Component tools
    'get_component': validationSchemas.componentPath,
    'list_components': validationSchemas.componentList,

    // Provider tools
    'get_provider': validationSchemas.providerName,
    'list_providers': validationSchemas.empty,

    // Util tools
    'get_util': validationSchemas.utilName,
    'list_utils': validationSchemas.empty,

    // Rate limit
    'get_rate_limit': validationSchemas.empty,

    // Cache & search tools
    'clear_cache': validationSchemas.clearCache,
    'search_code': validationSchemas.searchCode,
    'get_source_files': validationSchemas.sourceFiles,

    // Package info tools
    'get_package_info': validationSchemas.empty,
    'get_store': validationSchemas.empty,
    'get_index': validationSchemas.empty,

    // Resource methods
    'read_resource': validationSchemas.resourceRequest,

    // Prompt methods
    'get_prompt': validationSchemas.promptRequest,

    // Tool methods
    'call_tool': validationSchemas.toolRequest
  };

  return schemaMap[method];
}

/**
 * Validate and sanitize input parameters
 * @param method Method name
 * @param params Parameters to validate
 * @returns Validated and sanitized parameters
 */
export function validateAndSanitizeParams<T>(
  method: string,
  params: any
): T {
  const schema = getValidationSchema(method);

  if (!schema) {
    // If no specific schema found, return params as-is
    return params as T;
  }

  return validateRequest<T>(schema, params);
}

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
    description: "Explore the LibreChat Client package structure and available modules",
    arguments: [
      {
        name: "focus",
        description: "Area to focus on (hooks, components, providers, utils, store, all)",
      },
    ],
  },
  "explore-hooks": {
    name: "explore-hooks",
    description: "Discover and understand available React hooks in LibreChat Client",
    arguments: [],
  },
  "explore-components": {
    name: "explore-components",
    description: "Browse and understand React components in LibreChat Client",
    arguments: [
      {
        name: "category",
        description: "Component category to explore (e.g., 'Chat', 'Nav', 'ui')",
      },
    ],
  },
  "explore-providers": {
    name: "explore-providers",
    description: "Understand Context providers and global state management",
    arguments: [],
  },
  "understand-state-management": {
    name: "understand-state-management",
    description: "Learn about state management patterns in LibreChat Client",
    arguments: [],
  },
  "implement-feature": {
    name: "implement-feature",
    description: "Get guidance on implementing a feature using LibreChat Client",
    arguments: [
      {
        name: "feature",
        description: "The feature to implement (e.g., 'chat-interface', 'message-list', 'auth-flow')",
        required: true,
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

## INSTRUCTIONS

### Step 1: Get Package Overview
- Use \`get_index\` to see all package exports
- Use \`get_package_info\` to see dependencies and configuration

### Step 2: Explore Specific Areas
${focus === "hooks" || focus === "all" ? `
**Hooks:**
- Use \`list_hooks\` to see all available hooks
- Use \`get_hook\` with a hook name to read its implementation
- Look for patterns like useConversation, useAuth, useMessages` : ""}
${focus === "components" || focus === "all" ? `
**Components:**
- Use \`list_components\` to see component directories
- Use \`list_components\` with subdir to explore nested components
- Use \`get_component\` to read specific component source` : ""}
${focus === "providers" || focus === "all" ? `
**Providers:**
- Use \`list_providers\` to see context providers
- Use \`get_provider\` to read provider implementations
- Understand how global state is managed` : ""}
${focus === "utils" || focus === "all" ? `
**Utils:**
- Use \`list_utils\` to see utility functions
- Use \`get_util\` to read specific utilities` : ""}
${focus === "store" || focus === "all" ? `
**State Management:**
- Use \`get_store\` to see the state management setup` : ""}

### Step 3: Summarize
Provide a clear summary of:
- Main exports and their purposes
- Key patterns and conventions used
- How different modules interact`,
          },
        },
      ],
    };
  },

  "explore-hooks": () => {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Explore React hooks in the LibreChat Client package.

## INSTRUCTIONS

### Step 1: List All Hooks
Use \`list_hooks\` to get a complete list of available hooks.

### Step 2: Analyze Key Hooks
For important hooks, use \`get_hook\` to read their source code and understand:
- What state they manage
- What API calls they make
- What values and functions they return
- How they handle loading/error states

### Step 3: Identify Patterns
Look for:
- Custom hooks for API integration
- State management hooks
- UI interaction hooks
- Authentication hooks

### Step 4: Provide Summary
Create a guide showing:
- Available hooks grouped by purpose
- When to use each hook
- Example usage patterns`,
          },
        },
      ],
    };
  },

  "explore-components": ({
    category,
  }: {
    category?: string;
  }) => {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Explore React components in the LibreChat Client package${category ? ` focusing on: ${category}` : ""}.

## INSTRUCTIONS

### Step 1: Browse Component Structure
${category
  ? `Use \`list_components\` with subdir "${category}" to see components in that category.`
  : `Use \`list_components\` to see the top-level component directories.`}

### Step 2: Explore Components
- Navigate into subdirectories using \`list_components\` with the subdir parameter
- Use \`get_component\` to read specific component source code
- Look for index files that export multiple components

### Step 3: Understand Component Patterns
For each important component, identify:
- Props interface and types
- State management approach
- Styling patterns (Tailwind, CSS modules, etc.)
- How it integrates with hooks and providers

### Step 4: Document Findings
Provide:
- Component hierarchy and organization
- Key components and their purposes
- Reusable patterns
- How to compose components together`,
          },
        },
      ],
    };
  },

  "explore-providers": () => {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Explore Context providers in the LibreChat Client package.

## INSTRUCTIONS

### Step 1: List All Providers
Use \`list_providers\` to see available context providers.

### Step 2: Analyze Each Provider
For each provider, use \`get_provider\` to understand:
- What state it manages
- What context values it provides
- How it initializes and updates state
- Dependencies on other providers

### Step 3: Understand Provider Hierarchy
- Look at the main index or App component to see provider nesting
- Identify which providers depend on others
- Map out the context structure

### Step 4: Document
Provide:
- List of providers with descriptions
- Provider hierarchy diagram
- How to consume each context
- Best practices for using the providers`,
          },
        },
      ],
    };
  },

  "understand-state-management": () => {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Understand state management in the LibreChat Client package.

## INSTRUCTIONS

### Step 1: Explore Store Configuration
Use \`get_store\` to read the main store configuration.

### Step 2: Examine Related Files
- Use \`list_files\` with "packages/client/src" to find state-related files
- Look for atoms, selectors, or store slices
- Check the common directory for shared types

### Step 3: Understand the Pattern
Identify:
- State management library used (Zustand, Jotai, Redux, etc.)
- How state is organized (global vs local)
- How components access state
- How state updates are handled

### Step 4: Connect with Hooks
- Use \`list_hooks\` and examine hooks that interact with state
- Understand how hooks abstract state access

### Step 5: Document
Provide:
- State management architecture overview
- Key stores/atoms and their purposes
- How to read and update state
- Best practices and patterns`,
          },
        },
      ],
    };
  },

  "implement-feature": ({
    feature,
  }: {
    feature: string;
  }) => {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Help implement the "${feature}" feature using LibreChat Client.

## INSTRUCTIONS

### Step 1: Understand the Package
- Use \`get_index\` to see available exports
- Use \`get_package_info\` to understand dependencies

### Step 2: Find Relevant Code
Based on "${feature}", explore:
- Use \`list_hooks\` and \`get_hook\` for relevant hooks
- Use \`list_components\` and \`get_component\` for UI components
- Use \`list_providers\` and \`get_provider\` for state management
- Use \`list_utils\` and \`get_util\` for helper functions

### Step 3: Analyze Patterns
Look at existing implementations to understand:
- How similar features are built
- Component composition patterns
- State management approach
- Error handling patterns

### Step 4: Provide Implementation Guide
Create a guide that includes:
- Required imports from LibreChat Client
- Component structure
- Hook usage
- State management integration
- Complete code examples
- Best practices and tips`,
          },
        },
      ],
    };
  },
};

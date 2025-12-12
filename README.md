# LibreChat Client MCP Server

A Model Context Protocol (MCP) server that provides AI assistants with comprehensive access to the [LibreChat Client](https://github.com/danny-avila/LibreChat/tree/main/packages/client) package source code, hooks, components, providers, and utilities.

## Features

- **Hooks Access** - Browse and read React hooks (`list_hooks`, `get_hook`)
- **Components Access** - Explore UI components (`list_components`, `get_component`)
- **Providers Access** - Understand context providers (`list_providers`, `get_provider`)
- **Utils Access** - Read utility functions (`list_utils`, `get_util`)
- **Package Info** - Get package.json details (`get_package_info`)
- **State Management** - Understand store configuration (`get_store`)
- **Entry Point** - See all exports (`get_index`)
- **Directory Browsing** - Full directory tree exploration
- **Smart Caching** - Efficient GitHub API integration
- **SSE Transport** - Multi-client support

## Quick Start

```bash
# Basic usage (60 requests/hour)
npx @librechat/client-mcp

# With GitHub token (5000 requests/hour) - Recommended
npx @librechat/client-mcp --github-api-key ghp_your_token_here
```

## Available Tools

### LibreChat-Specific Tools

| Tool | Description |
|------|-------------|
| `get_hook` | Get source code of a React hook |
| `list_hooks` | List all available hooks |
| `get_component` | Get source code of a component (supports nested paths) |
| `list_components` | List components (with optional subdir) |
| `get_provider` | Get source code of a context provider |
| `list_providers` | List all context providers |
| `get_util` | Get source code of a utility function |
| `list_utils` | List all utility files |
| `get_package_info` | Get package.json with dependencies |
| `get_store` | Get state management configuration |
| `get_index` | Get main entry point exports |

### Base Tools

| Tool | Description |
|------|-------------|
| `get_source_file` | Get any file by path |
| `list_files` | List files in any directory |
| `get_directory_structure` | Get full directory tree |

## Available Prompts

| Prompt | Description |
|--------|-------------|
| `explore-librechat-client` | Explore package structure (focus: hooks, components, providers, utils, store, all) |
| `explore-hooks` | Discover and understand React hooks |
| `explore-components` | Browse React components (optional category) |
| `explore-providers` | Understand context providers |
| `understand-state-management` | Learn state management patterns |
| `implement-feature` | Get guidance on implementing features |

## Usage Examples

### Exploring Hooks
```
# List all hooks
Use: list_hooks

# Get a specific hook
Use: get_hook with hookName: "useConversation"
```

### Exploring Components
```
# List top-level component directories
Use: list_components

# List components in a category
Use: list_components with subdir: "Chat"

# Get a specific component
Use: get_component with componentPath: "Chat/Input"
```

### Understanding State Management
```
# Get store configuration
Use: get_store

# Get package exports
Use: get_index
```

## SSE Transport

Run with Server-Sent Events for multi-client support:

```bash
# SSE mode
node build/index.js --mode sse --port 7424

# Connect with Claude Code
claude mcp add --scope user --transport sse librechat-client-mcp http://localhost:7424/sse
```

### Transport Modes
- **`stdio`** (default) - Standard input/output for CLI
- **`sse`** - Server-Sent Events for HTTP connections
- **`dual`** - Both stdio and SSE simultaneously

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GITHUB_PERSONAL_ACCESS_TOKEN` | GitHub token for higher rate limits |
| `MCP_TRANSPORT_MODE` | Transport mode (stdio\|sse\|dual) |
| `MCP_PORT` | SSE server port (default: 7424) |
| `MCP_HOST` | Host binding (default: 0.0.0.0) |
| `MCP_CORS_ORIGINS` | CORS origins (comma-separated) |

## GitHub Token Setup

For higher rate limits (5000 requests/hour vs 60):

1. Visit https://github.com/settings/tokens
2. Generate a new token (no scopes needed for public repos)
3. Set environment variable:
   ```bash
   export GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here
   ```

## Installation

```bash
# Global installation
npm install -g @librechat/client-mcp

# Or use npx (recommended)
npx @librechat/client-mcp
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run in development
npm run dev
```

## Source Repository

This MCP server fetches files from the LibreChat monorepo:
- **Repository**: [danny-avila/LibreChat](https://github.com/danny-avila/LibreChat)
- **Package path**: `packages/client`
- **Branch**: `main`

## Package Structure

```
packages/client/
├── src/
│   ├── index.ts          # Main entry point
│   ├── store.ts          # State management
│   ├── hooks/            # React hooks
│   ├── components/       # UI components
│   ├── Providers/        # Context providers
│   ├── utils/            # Utility functions
│   ├── common/           # Shared constants/types
│   ├── theme/            # Theming
│   ├── locales/          # i18n
│   └── svgs/             # SVG assets
├── package.json
├── tsconfig.json
├── rollup.config.js
└── tailwind.config.js
```

## License

MIT License

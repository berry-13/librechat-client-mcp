# LibreChat Client MCP Server

A Model Context Protocol (MCP) server that provides AI assistants with access to the [LibreChat Client](https://github.com/danny-avila/librechat-client) package source code, types, and documentation.

## Features

- **Source Code Access** - Retrieve source files from the LibreChat Client package
- **Directory Browsing** - Explore the package structure
- **File Listing** - List files in any directory
- **Smart Caching** - Efficient GitHub API integration with rate limit handling
- **SSE Transport** - Server-Sent Events support for multi-client deployments

## Quick Start

```bash
# Basic usage (60 requests/hour)
npx @anthropic/librechat-client-mcp

# With GitHub token (5000 requests/hour) - Recommended
npx @anthropic/librechat-client-mcp --github-api-key ghp_your_token_here
```

## SSE Transport

Run the server with **Server-Sent Events (SSE)** transport for multi-client support:

```bash
# SSE mode
node build/index.js --mode sse --port 7424

# Connect with Claude Code
claude mcp add --scope user --transport sse librechat-client-mcp http://localhost:7424/sse
```

### Transport Modes
- **`stdio`** (default) - Standard input/output for CLI usage
- **`sse`** - Server-Sent Events for HTTP-based connections
- **`dual`** - Both stdio and SSE simultaneously

## Available Tools

| Tool | Description |
|------|-------------|
| `get_source_file` | Get source code for a specific file |
| `list_files` | List files in a directory |
| `get_directory_structure` | Get the package directory tree |

## Available Prompts

| Prompt | Description |
|--------|-------------|
| `explore-librechat-client` | Explore the package structure and APIs |
| `understand-api-endpoint` | Understand how to use a specific API endpoint |
| `implement-librechat-feature` | Get guidance on implementing features |

## Environment Variables

- `GITHUB_PERSONAL_ACCESS_TOKEN` - GitHub API token for higher rate limits
- `MCP_TRANSPORT_MODE` - Transport mode (stdio|sse|dual)
- `MCP_PORT` - SSE server port (default: 7424)
- `MCP_HOST` - Host binding (default: 0.0.0.0)
- `MCP_CORS_ORIGINS` - CORS origins (comma-separated)

## GitHub Token Setup

For higher rate limits (5000 requests/hour vs 60):

1. Visit https://github.com/settings/tokens
2. Generate a new token (no scopes needed for public repos)
3. Set as environment variable:
   ```bash
   export GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here
   ```

## Installation

```bash
# Global installation
npm install -g @anthropic/librechat-client-mcp

# Or use npx (recommended)
npx @anthropic/librechat-client-mcp
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

## License

MIT License

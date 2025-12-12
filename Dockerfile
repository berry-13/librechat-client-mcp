# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies after build
RUN npm ci --only=production && npm cache clean --force

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S mcpserver -u 1001

# Change ownership of the app directory to the nodejs user
RUN chown -R mcpserver:nodejs /app
USER mcpserver

# Expose port for SSE transport (Railway provides PORT dynamically)
EXPOSE ${PORT:-7423}

# Add health check (uses PORT env variable)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); \
    const port = process.env.PORT || 7423; \
    const options = { hostname: 'localhost', port: port, path: '/health', method: 'GET' }; \
    const req = http.request(options, (res) => { \
      if (res.statusCode === 200) process.exit(0); \
      else process.exit(1); \
    }); \
    req.on('error', () => process.exit(1)); \
    req.end();"

# Default to SSE mode for containerized deployment
# Railway injects PORT automatically, MCP_PORT is fallback for other platforms
ENV MCP_TRANSPORT_MODE=sse
ENV MCP_HOST=0.0.0.0
ENV NODE_ENV=production

# Start the server (PORT will be injected by Railway, falls back to MCP_PORT)
CMD ["node", "build/index.js", "--mode", "sse", "--host", "0.0.0.0"]
import { setupHandlers } from "./handler.js"
import { axios } from "../utils/axios.js"
import { logError, logInfo, logWarning } from "../utils/logger.js"
import { parseArgs } from "../cli/args.js"
import { readVersion } from "../server/version.js"
import { createServer } from "../server/createServer.js"
import { TransportManager, TransportMode } from "./transport.js"

export async function start() {
  try {
    logInfo("Starting LibreChat Client MCP Server...")

    const { githubApiKey, mode = 'stdio', port, host, cors } = parseArgs()

    if (githubApiKey) {
      axios.setGitHubApiKey(githubApiKey)
      logInfo("GitHub API configured with token")
    } else {
      logWarning("No GitHub API key provided. Rate limited to 60 requests/hour.")
    }

    const version = await readVersion("1.0.3")
    const server = createServer(version)

    setupHandlers(server)

    const parsedPort = port ? parseInt(port) : 7424
    const parsedHost = host || '0.0.0.0'
    const parsedCors = cors ? cors.split(',') : true

    const transportManager = new TransportManager({
      mode: mode as TransportMode,
      sse: {
        port: parsedPort,
        host: parsedHost,
        corsOrigin: parsedCors,
        path: '/sse'
      },
      http: {
        port: parsedPort,
        host: parsedHost,
        corsOrigin: parsedCors,
      }
    })

    await transportManager.initialize(server)

    const status = transportManager.getStatus()
    logInfo(`Server started successfully - Mode: ${status.mode}`)

    if (status.sse.active) {
      logInfo(`SSE endpoint: http://${parsedHost}:${parsedPort}/sse`)
    }

    if (status.http.active) {
      logInfo(`Streamable HTTP endpoint: http://${parsedHost}:${parsedPort}/mcp`)
    }

    process.on('SIGINT', async () => {
      logInfo("Shutting down server...")
      await transportManager.shutdown()
      process.exit(0)
    })

    process.on('SIGTERM', async () => {
      logInfo("Shutting down server...")
      await transportManager.shutdown()
      process.exit(0)
    })

  } catch (error) {
    logError("Failed to start server", error as Error)
    process.exit(1)
  }
}

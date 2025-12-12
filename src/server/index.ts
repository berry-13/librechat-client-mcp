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

    const version = await readVersion("0.1.0")
    const server = createServer(version)

    setupHandlers(server)

    const transportManager = new TransportManager({
      mode: mode as TransportMode,
      sse: {
        port: port ? parseInt(port) : 7424,
        host: host || '0.0.0.0',
        corsOrigin: cors ? cors.split(',') : true,
        path: '/sse'
      }
    })

    await transportManager.initialize(server)

    const status = transportManager.getStatus()
    logInfo(`Server started successfully - Mode: ${status.mode}`)

    if (status.sse.active) {
      logInfo(`SSE endpoint: http://${host || '0.0.0.0'}:${port || 7424}/sse`)
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

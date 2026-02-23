/**
 * Streamable HTTP transport manager for MCP server.
 *
 * Implements the MCP 2025-03-26 Streamable HTTP transport specification,
 * exposing a single /mcp endpoint that handles POST (JSON-RPC messages),
 * GET (SSE notification stream), and DELETE (session termination).
 */
import express from "express"
import cors from "cors"
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js"
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js"
import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { randomUUID } from "node:crypto"
import { logInfo, logError, logWarning } from "../utils/logger.js"
import { createServer } from "./createServer.js"
import { setupHandlers } from "./handler.js"
import { readVersion } from "./version.js"

export interface HTTPTransportOptions {
  port?: number
  host?: string
  corsOrigin?: string | string[] | boolean
}

export class StreamableHTTPTransportManager {
  private app: express.Application
  private httpServer: any
  private transports: Map<string, StreamableHTTPServerTransport> = new Map()
  private mcpServer?: Server
  private cachedVersion?: string

  constructor(private options: HTTPTransportOptions = {}) {
    this.app = express()
    this.setupMiddleware()
    this.setupRoutes()
  }

  private setupMiddleware() {
    this.app.use(cors({
      origin: this.options.corsOrigin || true,
      credentials: true,
      methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'mcp-session-id'],
      exposedHeaders: ['mcp-session-id']
    }))

    this.app.use(express.json())
    this.app.use((req, res, next) => {
      logInfo(`${req.method} ${req.path} - ${req.ip}`)
      next()
    })
  }

  private setupRoutes() {
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        activeConnections: this.transports.size,
        serverInfo: this.mcpServer ? {
          name: (this.mcpServer as any)._serverInfo?.name,
          version: (this.mcpServer as any)._serverInfo?.version
        } : null
      })
    })

    this.app.get('/connections', (req, res) => {
      res.json({
        total: this.transports.size,
        connections: Array.from(this.transports.keys())
      })
    })

    // Handle all MCP traffic on a single /mcp endpoint
    this.app.post('/mcp', async (req, res) => {
      try {
        const sessionId = req.headers['mcp-session-id'] as string | undefined

        if (sessionId) {
          // Existing session - route to its transport
          const transport = this.transports.get(sessionId)
          if (!transport) {
            res.status(404).json({
              jsonrpc: '2.0',
              error: { code: -32000, message: 'Session not found. The session may have expired.' },
              id: null
            })
            return
          }
          await transport.handleRequest(req, res, req.body)
          return
        }

        // No session ID - only allow initialize requests
        const body = req.body
        if (!isInitializeRequest(body)) {
          res.status(400).json({
            jsonrpc: '2.0',
            error: { code: -32600, message: 'Missing mcp-session-id header. Send an initialize request first.' },
            id: null
          })
          return
        }

        // Create new session
        const transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID(),
        })

        if (!this.cachedVersion) {
          this.cachedVersion = await readVersion("1.0.3")
        }
        const connectionServer = createServer(this.cachedVersion)
        setupHandlers(connectionServer)
        await connectionServer.connect(transport)

        const newSessionId = transport.sessionId
        if (newSessionId) {
          this.transports.set(newSessionId, transport)
          logInfo(`HTTP session created: ${newSessionId}`)
        }

        transport.onclose = () => {
          if (newSessionId) {
            this.transports.delete(newSessionId)
            logInfo(`HTTP session closed: ${newSessionId}`)
          }
        }

        await transport.handleRequest(req, res, req.body)
      } catch (error) {
        logError('Failed to handle POST /mcp', error as Error)
        if (!res.headersSent) {
          res.status(500).json({
            jsonrpc: '2.0',
            error: { code: -32603, message: 'Internal server error' },
            id: null
          })
        }
      }
    })

    this.app.get('/mcp', async (req, res) => {
      const sessionId = req.headers['mcp-session-id'] as string | undefined
      if (!sessionId) {
        res.status(400).json({
          jsonrpc: '2.0',
          error: { code: -32600, message: 'Missing mcp-session-id header' },
          id: null
        })
        return
      }

      const transport = this.transports.get(sessionId)
      if (!transport) {
        res.status(404).json({
          jsonrpc: '2.0',
          error: { code: -32000, message: 'Session not found' },
          id: null
        })
        return
      }

      await transport.handleRequest(req, res)
    })

    this.app.delete('/mcp', async (req, res) => {
      const sessionId = req.headers['mcp-session-id'] as string | undefined
      if (!sessionId) {
        res.status(400).json({
          jsonrpc: '2.0',
          error: { code: -32600, message: 'Missing mcp-session-id header' },
          id: null
        })
        return
      }

      const transport = this.transports.get(sessionId)
      if (!transport) {
        res.status(404).json({
          jsonrpc: '2.0',
          error: { code: -32000, message: 'Session not found' },
          id: null
        })
        return
      }

      await transport.handleRequest(req, res)
      this.transports.delete(sessionId)
      logInfo(`HTTP session terminated: ${sessionId}`)
    })
  }

  setMcpServer(server: Server) {
    this.mcpServer = server
  }

  async start(): Promise<void> {
    const port = this.options.port || 7424
    const host = this.options.host || '0.0.0.0'

    return new Promise((resolve, reject) => {
      this.httpServer = this.app.listen(port, host, () => {
        logInfo(`Streamable HTTP server listening on ${host}:${port}`)
        logInfo(`Health check available at http://${host}:${port}/health`)
        logInfo(`MCP endpoint available at http://${host}:${port}/mcp`)
        resolve()
      })

      this.httpServer.on('error', (error: Error) => {
        logError('HTTP server error', error)
        reject(error)
      })
    })
  }

  async stop(): Promise<void> {
    // Close all active transports
    for (const [sessionId, transport] of this.transports) {
      try {
        await transport.close()
        logInfo(`Closed session: ${sessionId}`)
      } catch (error) {
        logWarning(`Error closing session ${sessionId}: ${error}`)
      }
    }
    this.transports.clear()

    if (this.httpServer) {
      return new Promise((resolve) => {
        this.httpServer.close(() => {
          logInfo('HTTP server stopped')
          resolve(undefined)
        })
      })
    }
  }

  getActiveConnections(): number {
    return this.transports.size
  }

  getApp(): express.Application {
    return this.app
  }
}

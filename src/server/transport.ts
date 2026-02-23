import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { SSETransportManager, SSETransportOptions } from "./sse.js"
import { StreamableHTTPTransportManager, HTTPTransportOptions } from "./http-transport.js"
import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { logInfo, logError, logWarning } from "../utils/logger.js"

export type TransportMode = 'stdio' | 'sse' | 'http' | 'dual'

export interface TransportConfig {
  mode: TransportMode
  sse?: SSETransportOptions
  http?: HTTPTransportOptions
}

export class TransportManager {
  private sseManager?: SSETransportManager
  private httpManager?: StreamableHTTPTransportManager
  private stdioTransport?: StdioServerTransport

  constructor(private config: TransportConfig) {}

  async initialize(server: Server): Promise<void> {
    const { mode } = this.config

    switch (mode) {
      case 'stdio':
        await this.initializeStdio(server)
        break

      case 'sse':
        await this.initializeSSE(server)
        break

      case 'http':
        await this.initializeHTTP(server)
        break

      case 'dual':
        await this.initializeDual(server)
        break

      default:
        throw new Error(`Unsupported transport mode: ${mode}`)
    }
  }

  private async initializeStdio(server: Server): Promise<void> {
    try {
      this.stdioTransport = new StdioServerTransport()
      logInfo("Transport initialized: stdio")

      await server.connect(this.stdioTransport)
      logInfo("Server connected via stdio")
    } catch (error) {
      logError("Failed to initialize stdio transport", error as Error)
      throw error
    }
  }

  private async initializeSSE(server: Server): Promise<void> {
    try {
      this.sseManager = new SSETransportManager(this.config.sse)
      this.sseManager.setMcpServer(server)

      await this.sseManager.start()
      logInfo("Transport initialized: SSE")
    } catch (error) {
      logError("Failed to initialize SSE transport", error as Error)
      throw error
    }
  }

  private async initializeHTTP(server: Server): Promise<void> {
    try {
      this.httpManager = new StreamableHTTPTransportManager(this.config.http)
      this.httpManager.setMcpServer(server)

      await this.httpManager.start()
      logInfo("Transport initialized: Streamable HTTP")
    } catch (error) {
      logError("Failed to initialize HTTP transport", error as Error)
      throw error
    }
  }

  private async initializeDual(server: Server): Promise<void> {
    try {
      await this.initializeHTTP(server)

      if (process.stdin.isTTY === false) {
        await this.initializeStdio(server)
        logInfo("Dual transport mode: Both HTTP and stdio active")
      } else {
        logWarning("Dual transport mode: Only HTTP active (no stdio pipe detected)")
      }
    } catch (error) {
      logError("Failed to initialize dual transport", error as Error)
      throw error
    }
  }

  async shutdown(): Promise<void> {
    const shutdownPromises: Promise<void>[] = []

    if (this.sseManager) {
      shutdownPromises.push(this.sseManager.stop())
    }

    if (this.httpManager) {
      shutdownPromises.push(this.httpManager.stop())
    }

    if (this.stdioTransport) {
      try {
        (this.stdioTransport as any).close?.()
      } catch (error) {
        logWarning(`Error closing stdio transport: ${error}`)
      }
    }

    await Promise.all(shutdownPromises)
    logInfo("All transports shutdown")
  }

  getSSEManager(): SSETransportManager | undefined {
    return this.sseManager
  }

  getHTTPManager(): StreamableHTTPTransportManager | undefined {
    return this.httpManager
  }

  getStatus() {
    return {
      mode: this.config.mode,
      sse: {
        active: !!this.sseManager,
        connections: this.sseManager?.getActiveConnections() || 0
      },
      http: {
        active: !!this.httpManager,
        connections: this.httpManager?.getActiveConnections() || 0
      },
      stdio: {
        active: !!this.stdioTransport
      }
    }
  }
}
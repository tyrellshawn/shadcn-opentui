// CLI Plugin Host
// Manages CLI app execution and lifecycle

import type {
  CLIPluginHost,
  CLIPluginHostOptions,
  CLIAppDefinition,
  CLIAppInstance,
  CLIAppStatus,
  CLIAppContext,
  CLISignal,
  CLILibrary,
  ICLIAdapter,
  CLIRenderInstance,
} from "./types"
import type { OpenTUIRuntimeContext } from "../../types"
import { createCLIAppRegistry, createCLIAdapterRegistry } from "./cli-app-registry"
import { createExtendedCLITerminalBridge, type ExtendedCLITerminalBridge } from "./cli-terminal-bridge"
import { createInkAdapter } from "./adapters/ink-adapter"

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Generate a pseudo process ID
 */
let pidCounter = 1000
function generatePid(): number {
  return pidCounter++
}

/**
 * CLI App Instance Implementation
 */
class CLIAppInstanceImpl implements CLIAppInstance {
  readonly id: string
  readonly app: CLIAppDefinition
  readonly startTime: Date
  readonly pid: number
  
  status: CLIAppStatus = "starting"
  exitCode?: number
  error?: Error

  private renderInstance: CLIRenderInstance | null = null
  private bridge: ExtendedCLITerminalBridge | null = null
  private statusListeners = new Set<(status: CLIAppStatus) => void>()
  private exitListeners = new Set<(code: number) => void>()
  private errorListeners = new Set<(error: Error) => void>()
  private outputListeners = new Set<(output: string) => void>()

  constructor(
    id: string,
    app: CLIAppDefinition,
    renderInstance: CLIRenderInstance,
    bridge: ExtendedCLITerminalBridge
  ) {
    this.id = id
    this.app = app
    this.startTime = new Date()
    this.pid = generatePid()
    this.renderInstance = renderInstance
    this.bridge = bridge
    this.status = "running"
  }

  private setStatus(status: CLIAppStatus): void {
    this.status = status
    this.statusListeners.forEach((listener) => listener(status))
  }

  suspend(): void {
    if (this.status !== "running") return
    this.setStatus("suspended")
    this.renderInstance?.pause()
    this.app.lifecycle?.onSuspend?.()
  }

  resume(): void {
    if (this.status !== "suspended") return
    this.setStatus("running")
    this.renderInstance?.resume()
    this.app.lifecycle?.onResume?.()
  }

  terminate(code: number = 0): void {
    if (this.status === "terminated" || this.status === "exiting") return
    
    this.setStatus("exiting")
    this.exitCode = code
    
    try {
      this.renderInstance?.unmount()
    } catch (err) {
      // Ignore unmount errors
    }
    
    this.setStatus("terminated")
    this.app.lifecycle?.onExit?.(code)
    this.exitListeners.forEach((listener) => listener(code))
  }

  sendInput(input: string): void {
    if (this.status !== "running" || !this.bridge) return
    this.bridge.dispatchKeyPress(input, { ctrl: false, alt: false, shift: false, meta: false })
  }

  sendSignal(signal: CLISignal): void {
    switch (signal) {
      case "SIGINT":
      case "SIGTERM":
        this.terminate(130) // Standard exit code for SIGINT
        break
      case "SIGKILL":
        this.terminate(137) // Standard exit code for SIGKILL
        break
      case "SIGHUP":
        this.terminate(129) // Standard exit code for SIGHUP
        break
      default:
        // Custom signals - notify but don't terminate
        break
    }
  }

  onStatusChange(callback: (status: CLIAppStatus) => void): () => void {
    this.statusListeners.add(callback)
    return () => this.statusListeners.delete(callback)
  }

  onExit(callback: (code: number) => void): () => void {
    this.exitListeners.add(callback)
    return () => this.exitListeners.delete(callback)
  }

  onError(callback: (error: Error) => void): () => void {
    this.errorListeners.add(callback)
    return () => this.errorListeners.delete(callback)
  }

  onOutput(callback: (output: string) => void): () => void {
    this.outputListeners.add(callback)
    return () => this.outputListeners.delete(callback)
  }

  /**
   * Set error and notify listeners
   */
  setError(error: Error): void {
    this.error = error
    this.setStatus("error")
    this.app.lifecycle?.onError?.(error)
    this.errorListeners.forEach((listener) => listener(error))
  }

  /**
   * Emit output
   */
  emitOutput(output: string): void {
    this.outputListeners.forEach((listener) => listener(output))
  }
}

/**
 * CLI Plugin Host Implementation
 */
class CLIPluginHostImpl implements CLIPluginHost {
  private options: Required<CLIPluginHostOptions>
  private appRegistry = createCLIAppRegistry()
  private adapterRegistry = createCLIAdapterRegistry()
  private runningInstances = new Map<string, CLIAppInstanceImpl>()
  private foregroundInstanceId: string | null = null
  private runtimeContext: OpenTUIRuntimeContext | null = null
  private _initialized = false

  // Event listeners
  private launchListeners = new Set<(instance: CLIAppInstance) => void>()
  private terminateListeners = new Set<(instance: CLIAppInstance, code: number) => void>()
  private errorListeners = new Set<(instance: CLIAppInstance, error: Error) => void>()

  constructor(options: CLIPluginHostOptions = {}) {
    this.options = {
      maxConcurrentApps: options.maxConcurrentApps ?? 10,
      sandboxMode: options.sandboxMode ?? false,
      defaultLibrary: options.defaultLibrary ?? "ink",
      defaultLibraryVersion: options.defaultLibraryVersion ?? ">=6.6.0",
      adapters: options.adapters ?? [],
      autoInitialize: options.autoInitialize ?? false,
    }
  }

  // ============================================
  // App Management
  // ============================================

  registerApp(app: CLIAppDefinition): void {
    this.appRegistry.register(app)
  }

  unregisterApp(name: string): void {
    // Terminate any running instances of this app
    for (const instance of this.runningInstances.values()) {
      if (instance.app.manifest.name === name) {
        instance.terminate(0)
      }
    }
    this.appRegistry.unregister(name)
  }

  getApp(name: string): CLIAppDefinition | undefined {
    return this.appRegistry.get(name)
  }

  listApps(): CLIAppDefinition[] {
    return this.appRegistry.list()
  }

  // ============================================
  // App Execution
  // ============================================

  async launch(
    name: string,
    args: string[] = [],
    flags: Record<string, string | boolean | number> = {}
  ): Promise<CLIAppInstance> {
    if (!this._initialized || !this.runtimeContext) {
      throw new Error("CLI Plugin Host is not initialized")
    }

    // Check concurrent app limit
    if (this.runningInstances.size >= this.options.maxConcurrentApps) {
      throw new Error(`Maximum concurrent apps (${this.options.maxConcurrentApps}) reached`)
    }

    // Get app definition
    const app = this.appRegistry.get(name)
    if (!app) {
      throw new Error(`App "${name}" not found`)
    }

    // Get adapter for the app's library
    const adapter = this.adapterRegistry.getAdapter(app.manifest.library)
    if (!adapter) {
      throw new Error(`No adapter registered for library: ${app.manifest.library}`)
    }

    // Check version compatibility
    const compatibility = adapter.checkCompatibility(app.manifest.libraryVersion)
    if (!compatibility.compatible) {
      const warnings = compatibility.warnings?.join("; ") || "Version mismatch"
      throw new Error(`Incompatible version: ${warnings}`)
    }

    // Create terminal bridge
    const bridge = createExtendedCLITerminalBridge(this.runtimeContext)

    // Create instance ID
    const instanceId = generateId()

    // Create app context
    const context: CLIAppContext = {
      terminal: bridge,
      runtime: this.runtimeContext,
      exit: (code = 0) => {
        const instance = this.runningInstances.get(instanceId)
        instance?.terminate(code)
      },
      args,
      flags,
      instanceId,
      manifest: app.manifest,
      suspend: () => {
        const instance = this.runningInstances.get(instanceId)
        instance?.suspend()
      },
      isForeground: () => this.foregroundInstanceId === instanceId,
    }

    // Call lifecycle hook
    if (app.lifecycle?.onBeforeStart) {
      await app.lifecycle.onBeforeStart(context)
    }

    // Create render instance
    const props = { ...context }
    if (adapter.transformProps) {
      Object.assign(props, adapter.transformProps(props, app.manifest.libraryVersion))
    }

    const renderInstance = adapter.createRenderInstance(
      app.Component as React.ComponentType<unknown>,
      props,
      bridge
    )

    // Create app instance
    const instance = new CLIAppInstanceImpl(instanceId, app, renderInstance, bridge)
    this.runningInstances.set(instanceId, instance)

    // Set as foreground if no other foreground
    if (!this.foregroundInstanceId) {
      this.foregroundInstanceId = instanceId
    }

    // Subscribe to exit
    instance.onExit((code) => {
      this.runningInstances.delete(instanceId)
      if (this.foregroundInstanceId === instanceId) {
        this.foregroundInstanceId = null
      }
      this.terminateListeners.forEach((listener) => listener(instance, code))
    })

    // Subscribe to error
    instance.onError((error) => {
      this.errorListeners.forEach((listener) => listener(instance, error))
    })

    // Notify launch listeners
    this.launchListeners.forEach((listener) => listener(instance))

    return instance
  }

  getInstance(instanceId: string): CLIAppInstance | undefined {
    return this.runningInstances.get(instanceId)
  }

  listRunningInstances(): CLIAppInstance[] {
    return Array.from(this.runningInstances.values())
  }

  terminate(instanceId: string, code: number = 0): void {
    const instance = this.runningInstances.get(instanceId)
    instance?.terminate(code)
  }

  terminateAll(): void {
    for (const instance of this.runningInstances.values()) {
      instance.terminate(0)
    }
  }

  getForegroundInstance(): CLIAppInstance | undefined {
    if (!this.foregroundInstanceId) return undefined
    return this.runningInstances.get(this.foregroundInstanceId)
  }

  bringToForeground(instanceId: string): void {
    const instance = this.runningInstances.get(instanceId)
    if (!instance) return

    // Suspend current foreground
    if (this.foregroundInstanceId && this.foregroundInstanceId !== instanceId) {
      const current = this.runningInstances.get(this.foregroundInstanceId)
      current?.suspend()
    }

    // Resume and set as foreground
    instance.resume()
    this.foregroundInstanceId = instanceId
  }

  // ============================================
  // Adapter Management
  // ============================================

  registerAdapter(adapter: ICLIAdapter): void {
    this.adapterRegistry.register(adapter)
  }

  getAdapter(library: CLILibrary): ICLIAdapter | undefined {
    return this.adapterRegistry.getAdapter(library)
  }

  supportsLibrary(library: CLILibrary): boolean {
    return this.adapterRegistry.supportsLibrary(library)
  }

  listSupportedLibraries(): CLILibrary[] {
    return this.adapterRegistry.list().map((adapter) => adapter.library)
  }

  // ============================================
  // Lifecycle
  // ============================================

  async initialize(context: OpenTUIRuntimeContext): Promise<void> {
    if (this._initialized) return

    this.runtimeContext = context

    // Register default adapters
    const inkAdapter = createInkAdapter()
    await inkAdapter.initialize()
    this.adapterRegistry.register(inkAdapter)

    // Register custom adapters from options
    for (const adapter of this.options.adapters) {
      await adapter.initialize()
      this.adapterRegistry.register(adapter)
    }

    this._initialized = true
  }

  isInitialized(): boolean {
    return this._initialized
  }

  async destroy(): Promise<void> {
    if (!this._initialized) return

    // Terminate all running apps
    this.terminateAll()

    // Destroy all adapters
    for (const adapter of this.adapterRegistry.list()) {
      await adapter.destroy()
    }

    this._initialized = false
    this.runtimeContext = null
  }

  // ============================================
  // Events
  // ============================================

  onAppLaunched(callback: (instance: CLIAppInstance) => void): () => void {
    this.launchListeners.add(callback)
    return () => this.launchListeners.delete(callback)
  }

  onAppTerminated(callback: (instance: CLIAppInstance, code: number) => void): () => void {
    this.terminateListeners.add(callback)
    return () => this.terminateListeners.delete(callback)
  }

  onAppError(callback: (instance: CLIAppInstance, error: Error) => void): () => void {
    this.errorListeners.add(callback)
    return () => this.errorListeners.delete(callback)
  }
}

/**
 * Create a new CLI Plugin Host
 */
export function createCLIPluginHost(options?: CLIPluginHostOptions): CLIPluginHost {
  return new CLIPluginHostImpl(options)
}

// Export implementation for advanced use
export { CLIPluginHostImpl, CLIAppInstanceImpl }

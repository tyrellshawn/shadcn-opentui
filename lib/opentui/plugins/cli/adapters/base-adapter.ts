// Base Adapter for CLI Plugin Framework
// Abstract base class that all library adapters extend

import type {
  ICLIAdapter,
  CLILibrary,
  VersionRange,
  VersionCompatibility,
  CLIFeature,
  CLITerminalBridge,
  CLIRenderInstance,
} from "../types"
import { versionNegotiator, satisfiesRange } from "./version-negotiator"

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Abstract base adapter class
 * Provides common functionality for all CLI library adapters
 */
export abstract class BaseCLIAdapter implements ICLIAdapter {
  abstract readonly library: CLILibrary
  abstract readonly adapterVersion: string
  abstract readonly supportedVersions: VersionRange

  protected initialized = false
  protected activeInstances = new Map<string, CLIRenderInstance>()

  /**
   * Initialize the adapter
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return
    }
    await this.doInitialize()
    this.initialized = true
  }

  /**
   * Cleanup resources
   */
  async destroy(): Promise<void> {
    if (!this.initialized) {
      return
    }
    
    // Unmount all active instances
    for (const instance of this.activeInstances.values()) {
      try {
        instance.unmount()
      } catch {
        // Ignore unmount errors during cleanup
      }
    }
    this.activeInstances.clear()
    
    await this.doDestroy()
    this.initialized = false
  }

  /**
   * Check version compatibility
   */
  checkCompatibility(requestedVersion: string): VersionCompatibility {
    return versionNegotiator.negotiate(
      this.library,
      requestedVersion,
      this.getAdapterLibraryVersion()
    )
  }

  /**
   * Create a render instance
   */
  createRenderInstance(
    component: React.ComponentType<unknown>,
    props: Record<string, unknown>,
    bridge: CLITerminalBridge
  ): CLIRenderInstance {
    if (!this.initialized) {
      throw new Error(`Adapter for ${this.library} is not initialized`)
    }

    const id = generateId()
    const instance = this.doCreateRenderInstance(id, component, props, bridge)
    this.activeInstances.set(id, instance)

    // Remove from tracking when unmounted
    const originalUnmount = instance.unmount.bind(instance)
    instance.unmount = () => {
      this.activeInstances.delete(id)
      originalUnmount()
    }

    return instance
  }

  /**
   * Check if a feature is supported
   */
  supportsFeature(feature: CLIFeature): boolean {
    return this.getSupportedFeatures().includes(feature)
  }

  /**
   * Get features for a specific version
   */
  getFeaturesForVersion(version: string): CLIFeature[] {
    if (!satisfiesRange(version, this.supportedVersions)) {
      return []
    }
    return versionNegotiator.getFeaturesForVersion(this.library, version)
  }

  /**
   * Transform props for version compatibility
   */
  transformProps?(props: Record<string, unknown>, targetVersion: string): Record<string, unknown> {
    // Default: no transformation
    return props
  }

  // ============================================
  // Abstract methods to be implemented by subclasses
  // ============================================

  /**
   * Perform adapter-specific initialization
   */
  protected abstract doInitialize(): Promise<void>

  /**
   * Perform adapter-specific cleanup
   */
  protected abstract doDestroy(): Promise<void>

  /**
   * Create an adapter-specific render instance
   */
  protected abstract doCreateRenderInstance(
    id: string,
    component: React.ComponentType<unknown>,
    props: Record<string, unknown>,
    bridge: CLITerminalBridge
  ): CLIRenderInstance

  /**
   * Get the library version this adapter uses
   */
  protected abstract getAdapterLibraryVersion(): string

  /**
   * Get list of supported features
   */
  protected abstract getSupportedFeatures(): CLIFeature[]
}

/**
 * Base render instance class
 */
export abstract class BaseRenderInstance implements CLIRenderInstance {
  readonly id: string
  protected _isActive = true
  protected _isPaused = false
  protected exitCode: number | null = null
  protected exitResolve: ((code: number) => void) | null = null

  constructor(id: string) {
    this.id = id
  }

  /**
   * Re-render with new props
   */
  abstract rerender(props?: Record<string, unknown>): void

  /**
   * Unmount the component
   */
  unmount(): void {
    if (!this._isActive) return
    this._isActive = false
    this.doUnmount()
    if (this.exitResolve) {
      this.exitResolve(this.exitCode ?? 0)
    }
  }

  /**
   * Wait for exit
   */
  waitUntilExit(): Promise<number> {
    if (!this._isActive) {
      return Promise.resolve(this.exitCode ?? 0)
    }
    return new Promise((resolve) => {
      this.exitResolve = resolve
    })
  }

  /**
   * Clear rendered content
   */
  abstract clear(): void

  /**
   * Pause rendering
   */
  pause(): void {
    if (!this._isActive) return
    this._isPaused = true
    this.doPause()
  }

  /**
   * Resume rendering
   */
  resume(): void {
    if (!this._isActive) return
    this._isPaused = false
    this.doResume()
  }

  /**
   * Check if instance is active
   */
  isActive(): boolean {
    return this._isActive
  }

  /**
   * Set exit code
   */
  protected setExitCode(code: number): void {
    this.exitCode = code
  }

  // Abstract methods for subclasses
  protected abstract doUnmount(): void
  protected abstract doPause(): void
  protected abstract doResume(): void
}

export { generateId }

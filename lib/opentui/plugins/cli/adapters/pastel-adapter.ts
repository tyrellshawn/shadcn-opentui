// Pastel v4.0.0+ Adapter for CLI Plugin Framework
// Provides integration for Pastel CLI applications (future implementation)

import type {
  CLILibrary,
  VersionRange,
  CLIFeature,
  CLITerminalBridge,
  CLIRenderInstance,
} from "../types"
import { BaseCLIAdapter, BaseRenderInstance } from "./base-adapter"

/**
 * Configuration options for the Pastel adapter
 */
export interface PastelAdapterOptions {
  /** Enable debug mode */
  debug?: boolean
  /** Theme configuration */
  theme?: PastelTheme
}

/**
 * Pastel theme configuration
 */
export interface PastelTheme {
  primaryColor?: string
  secondaryColor?: string
  backgroundColor?: string
  textColor?: string
}

/**
 * Default Pastel adapter options
 */
const DEFAULT_OPTIONS: Required<PastelAdapterOptions> = {
  debug: false,
  theme: {
    primaryColor: "cyan",
    secondaryColor: "magenta",
    backgroundColor: "black",
    textColor: "white",
  },
}

/**
 * Pastel v4 supported features by version
 */
const PASTEL_FEATURES: Record<string, CLIFeature[]> = {
  "4.0.0": [
    "useInput",
    "flexbox",
    "colors16",
    "colors256",
    "trueColor",
    "unicode",
    "boxDrawing",
  ],
  "4.1.0": [
    "useInput",
    "useFocus",
    "flexbox",
    "colors16",
    "colors256",
    "trueColor",
    "unicode",
    "boxDrawing",
    "hyperlinks",
  ],
}

/**
 * Pastel render instance
 */
class PastelRenderInstance extends BaseRenderInstance {
  private component: React.ComponentType<unknown>
  private props: Record<string, unknown>
  private bridge: CLITerminalBridge
  private options: Required<PastelAdapterOptions>

  constructor(
    id: string,
    component: React.ComponentType<unknown>,
    props: Record<string, unknown>,
    bridge: CLITerminalBridge,
    options: Required<PastelAdapterOptions>
  ) {
    super(id)
    this.component = component
    this.props = props
    this.bridge = bridge
    this.options = options
  }

  rerender(props?: Record<string, unknown>): void {
    if (!this._isActive) return
    if (props) {
      this.props = { ...this.props, ...props }
    }
    // Render logic would go here
  }

  clear(): void {
    this.bridge.clear()
  }

  protected doUnmount(): void {
    // Cleanup
  }

  protected doPause(): void {
    // Pause rendering
  }

  protected doResume(): void {
    // Resume rendering
  }
}

/**
 * Pastel v4.0.0+ Adapter
 * 
 * This adapter provides integration between Pastel CLI components and OpenTUI.
 * Pastel is an alternative CLI framework that may be supported in the future.
 * 
 * Note: This is a stub implementation for future extension.
 */
export class PastelAdapter extends BaseCLIAdapter {
  readonly library: CLILibrary = "pastel"
  readonly adapterVersion = "1.0.0"
  readonly supportedVersions: VersionRange = ">=4.0.0 <5.0.0"

  private options: Required<PastelAdapterOptions>
  private currentLibraryVersion = "4.0.0"

  constructor(options: PastelAdapterOptions = {}) {
    super()
    this.options = { 
      ...DEFAULT_OPTIONS, 
      ...options,
      theme: { ...DEFAULT_OPTIONS.theme, ...options.theme },
    }
  }

  /**
   * Set the target Pastel library version
   */
  setTargetVersion(version: string): void {
    this.currentLibraryVersion = version
  }

  protected async doInitialize(): Promise<void> {
    if (this.options.debug) {
      console.log(`[PastelAdapter] Initialized for Pastel ${this.supportedVersions}`)
    }
  }

  protected async doDestroy(): Promise<void> {
    if (this.options.debug) {
      console.log("[PastelAdapter] Destroyed")
    }
  }

  protected doCreateRenderInstance(
    id: string,
    component: React.ComponentType<unknown>,
    props: Record<string, unknown>,
    bridge: CLITerminalBridge
  ): CLIRenderInstance {
    return new PastelRenderInstance(id, component, props, bridge, this.options)
  }

  protected getAdapterLibraryVersion(): string {
    return this.currentLibraryVersion
  }

  protected getSupportedFeatures(): CLIFeature[] {
    const version = this.currentLibraryVersion
    const versionKeys = Object.keys(PASTEL_FEATURES).sort()
    let features: CLIFeature[] = []
    
    for (const v of versionKeys) {
      if (this.compareVersions(version, v) >= 0) {
        features = PASTEL_FEATURES[v]
      }
    }
    
    return features
  }

  private compareVersions(a: string, b: string): number {
    const partsA = a.split(".").map(Number)
    const partsB = b.split(".").map(Number)
    
    for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
      const partA = partsA[i] || 0
      const partB = partsB[i] || 0
      if (partA !== partB) {
        return partA - partB
      }
    }
    
    return 0
  }

  transformProps(props: Record<string, unknown>, targetVersion: string): Record<string, unknown> {
    return { ...props }
  }
}

/**
 * Create a Pastel adapter instance
 */
export function createPastelAdapter(options?: PastelAdapterOptions): PastelAdapter {
  return new PastelAdapter(options)
}

export type { PastelRenderInstance }

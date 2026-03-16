// Ink v6.6.0+ Adapter for CLI Plugin Framework
// Bridges Ink CLI components to OpenTUI terminal

import type {
  CLILibrary,
  VersionRange,
  CLIFeature,
  CLITerminalBridge,
  CLIRenderInstance,
} from "../types"
import { BaseCLIAdapter, BaseRenderInstance, generateId } from "./base-adapter"

/**
 * Configuration options for the Ink adapter
 */
export interface InkAdapterOptions {
  /** Enable debug mode */
  debug?: boolean
  /** Render output to terminal bridge instead of stdout */
  useTerminalBridge?: boolean
  /** Patch interval for updates (ms) */
  patchInterval?: number
}

/**
 * Default Ink adapter options
 */
const DEFAULT_OPTIONS: Required<InkAdapterOptions> = {
  debug: false,
  useTerminalBridge: true,
  patchInterval: 16, // ~60fps
}

/**
 * Ink v6 supported features by version
 */
const INK_FEATURES: Record<string, CLIFeature[]> = {
  "6.6.0": [
    "useInput",
    "useStdin",
    "useStdout",
    "useFocus",
    "flexbox",
    "colors16",
    "colors256",
    "unicode",
    "boxDrawing",
  ],
  "6.7.0": [
    "useInput",
    "useStdin",
    "useStdout",
    "useFocus",
    "useFocusManager",
    "measureElement",
    "flexbox",
    "colors16",
    "colors256",
    "trueColor",
    "unicode",
    "boxDrawing",
  ],
  "6.8.0": [
    "useInput",
    "useStdin",
    "useStdout",
    "useFocus",
    "useFocusManager",
    "measureElement",
    "staticOutput",
    "flexbox",
    "colors16",
    "colors256",
    "trueColor",
    "unicode",
    "mouse",
    "boxDrawing",
  ],
}

/**
 * Ink render instance that bridges to OpenTUI
 */
class InkRenderInstance extends BaseRenderInstance {
  private component: React.ComponentType<unknown>
  private props: Record<string, unknown>
  private bridge: CLITerminalBridge
  private renderCallback: (() => void) | null = null
  private outputBuffer: string[] = []
  private options: Required<InkAdapterOptions>

  constructor(
    id: string,
    component: React.ComponentType<unknown>,
    props: Record<string, unknown>,
    bridge: CLITerminalBridge,
    options: Required<InkAdapterOptions>
  ) {
    super(id)
    this.component = component
    this.props = props
    this.bridge = bridge
    this.options = options
    
    // Start rendering
    this.startRender()
  }

  /**
   * Start the render loop
   */
  private startRender(): void {
    // In a full implementation, this would integrate with Ink's render function
    // For now, we simulate the render cycle with a callback pattern
    this.render()
  }

  /**
   * Perform a render cycle
   */
  private render(): void {
    if (!this._isActive || this._isPaused) return

    try {
      // In a real implementation, this would call Ink's render function
      // and capture the output to send to the terminal bridge
      
      // For demonstration, we'll emit a placeholder that shows the component is running
      if (this.options.debug) {
        this.bridge.writeLine(`[Ink] Rendering component: ${this.component.name || "Anonymous"}`, "system")
      }
    } catch (error) {
      if (this.options.debug) {
        this.bridge.writeLine(`[Ink] Render error: ${error}`, "error")
      }
    }
  }

  rerender(props?: Record<string, unknown>): void {
    if (!this._isActive) return
    if (props) {
      this.props = { ...this.props, ...props }
    }
    this.render()
  }

  clear(): void {
    this.outputBuffer = []
    this.bridge.clear()
  }

  protected doUnmount(): void {
    this.renderCallback = null
    this.outputBuffer = []
  }

  protected doPause(): void {
    // Stop render updates but keep state
  }

  protected doResume(): void {
    // Resume render updates
    this.render()
  }

  /**
   * Write output to terminal bridge
   */
  writeOutput(content: string): void {
    this.outputBuffer.push(content)
    this.bridge.writeLine(content)
  }

  /**
   * Get current props
   */
  getProps(): Record<string, unknown> {
    return { ...this.props }
  }

  /**
   * Set exit code and trigger exit
   */
  exit(code: number = 0): void {
    this.setExitCode(code)
    this.unmount()
  }
}

/**
 * Ink v6.6.0+ Adapter
 * 
 * This adapter provides integration between Ink CLI components and OpenTUI.
 * It supports Ink version 6.6.0 and above, with feature detection for
 * version-specific capabilities.
 */
export class InkAdapter extends BaseCLIAdapter {
  readonly library: CLILibrary = "ink"
  readonly adapterVersion = "1.0.0"
  readonly supportedVersions: VersionRange = ">=6.6.0 <7.0.0"

  private options: Required<InkAdapterOptions>
  private currentLibraryVersion = "6.6.0" // Default to minimum supported

  constructor(options: InkAdapterOptions = {}) {
    super()
    this.options = { ...DEFAULT_OPTIONS, ...options }
  }

  /**
   * Set the target Ink library version
   * This allows apps to specify which version's features they need
   */
  setTargetVersion(version: string): void {
    this.currentLibraryVersion = version
  }

  protected async doInitialize(): Promise<void> {
    // In a full implementation, this would:
    // 1. Dynamically import the Ink package
    // 2. Verify the installed version
    // 3. Set up any global Ink configuration
    
    if (this.options.debug) {
      console.log(`[InkAdapter] Initialized for Ink ${this.supportedVersions}`)
    }
  }

  protected async doDestroy(): Promise<void> {
    // Cleanup any Ink-specific resources
    if (this.options.debug) {
      console.log("[InkAdapter] Destroyed")
    }
  }

  protected doCreateRenderInstance(
    id: string,
    component: React.ComponentType<unknown>,
    props: Record<string, unknown>,
    bridge: CLITerminalBridge
  ): CLIRenderInstance {
    return new InkRenderInstance(id, component, props, bridge, this.options)
  }

  protected getAdapterLibraryVersion(): string {
    return this.currentLibraryVersion
  }

  protected getSupportedFeatures(): CLIFeature[] {
    // Get features for current library version
    const version = this.currentLibraryVersion
    
    // Find the best matching feature set
    const versionKeys = Object.keys(INK_FEATURES).sort()
    let features: CLIFeature[] = []
    
    for (const v of versionKeys) {
      if (this.compareVersions(version, v) >= 0) {
        features = INK_FEATURES[v]
      }
    }
    
    return features
  }

  /**
   * Compare two version strings
   */
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

  /**
   * Transform props for version compatibility
   * Handles API changes between Ink versions
   */
  transformProps(props: Record<string, unknown>, targetVersion: string): Record<string, unknown> {
    const transformed = { ...props }
    
    // Example: Handle API changes between versions
    // In a real implementation, this would handle breaking changes
    
    // 6.6.0 -> 6.7.0: No breaking changes
    // 6.7.0 -> 6.8.0: Mouse support added, may need to disable by default
    
    if (this.compareVersions(targetVersion, "6.8.0") >= 0) {
      // Enable mouse support by default in 6.8.0+
      if (transformed.enableMouse === undefined) {
        transformed.enableMouse = false // Opt-in for compatibility
      }
    }
    
    return transformed
  }

  /**
   * Create an Ink component wrapper that integrates with OpenTUI
   */
  createComponentWrapper<P extends Record<string, unknown>>(
    InkComponent: React.ComponentType<P>,
    bridge: CLITerminalBridge
  ): React.ComponentType<P> {
    // This would wrap the Ink component with OpenTUI integration
    // In a full implementation, this would:
    // 1. Intercept Ink's stdout/stderr
    // 2. Route output through the terminal bridge
    // 3. Handle input from the bridge
    
    return InkComponent
  }
}

/**
 * Create an Ink adapter instance
 */
export function createInkAdapter(options?: InkAdapterOptions): InkAdapter {
  return new InkAdapter(options)
}

// Export for type inference
export type { InkRenderInstance }

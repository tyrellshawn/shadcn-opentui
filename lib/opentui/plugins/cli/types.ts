// OpenTUI CLI Plugin Framework Types
// Library-agnostic plugin system supporting Ink v6.6.0+, Pastel v4.0.0+, and future CLI libraries

import type { OpenTUIRuntimeContext, TerminalLine } from "../../types"

// ============================================
// Version Management
// ============================================

/** Supported CLI library identifiers */
export type CLILibrary = "ink" | "pastel" | "custom"

/** Semantic version range (e.g., "6.6.0", ">=6.6.0 <7.0.0") */
export type VersionRange = string

/** Version compatibility result */
export interface VersionCompatibility {
  compatible: boolean
  negotiatedVersion: string
  warnings?: string[]
  requiredShims?: string[]
  missingFeatures?: CLIFeature[]
}

/** Feature availability by version */
export interface VersionFeatureMap {
  version: string
  features: CLIFeature[]
}

// ============================================
// Plugin Manifest
// ============================================

/** Declares plugin metadata and requirements */
export interface CLIAppManifest {
  /** Unique plugin identifier */
  name: string
  /** Plugin version (semver) */
  version: string
  /** Human-readable description */
  description?: string
  /** Author information */
  author?: string
  /** Repository URL */
  repository?: string
  /** Target CLI library */
  library: CLILibrary
  /** Required library version (semver range) */
  libraryVersion: VersionRange
  /** Plugin capabilities/permissions */
  capabilities?: CLIAppCapabilities
  /** Entry command to trigger this app */
  entryCommand?: string
  /** Keywords for discoverability */
  keywords?: string[]
  /** License */
  license?: string
}

/** Capabilities the CLI app requires */
export interface CLIAppCapabilities {
  /** Needs keyboard input handling */
  stdin?: boolean
  /** Takes over the terminal (full-screen mode) */
  fullscreen?: boolean
  /** Maintains state between invocations */
  persistentState?: boolean
  /** Requires network access */
  networking?: boolean
  /** Requires file system access */
  fileSystem?: boolean
  /** Custom rendering (bypasses default renderer) */
  customRenderer?: boolean
  /** Requires focus management */
  focusManagement?: boolean
}

// ============================================
// CLI Application Definition
// ============================================

/** Complete CLI application definition */
export interface CLIAppDefinition<TProps = Record<string, unknown>> {
  /** Plugin manifest */
  manifest: CLIAppManifest
  /** The main React component */
  Component: React.ComponentType<TProps & CLIAppContext>
  /** Commands this app provides */
  commands?: CLICommand[]
  /** Lifecycle hooks */
  lifecycle?: CLIAppLifecycle
}

/** Lifecycle hooks for CLI apps */
export interface CLIAppLifecycle {
  /** Called when app is registered */
  onRegister?: (registry: CLIAppRegistry) => void
  /** Called before app starts */
  onBeforeStart?: (context: CLIAppContext) => void | Promise<void>
  /** Called when app exits */
  onExit?: (code: number) => void
  /** Called when app encounters an error */
  onError?: (error: Error) => void
  /** Called when app is suspended */
  onSuspend?: () => void
  /** Called when app is resumed */
  onResume?: () => void
}

// ============================================
// Runtime Context
// ============================================

/** Context provided to running CLI apps */
export interface CLIAppContext {
  /** Terminal bridge for I/O */
  terminal: CLITerminalBridge
  /** OpenTUI runtime reference */
  runtime: OpenTUIRuntimeContext
  /** Exit the application */
  exit: (code?: number) => void
  /** Command line arguments */
  args: string[]
  /** Parsed flags */
  flags: Record<string, string | boolean | number>
  /** App instance ID */
  instanceId: string
  /** App manifest */
  manifest: CLIAppManifest
  /** Suspend the app (allow other commands) */
  suspend: () => void
  /** Check if app is in foreground */
  isForeground: () => boolean
}

/** Bridge between CLI app and OpenTUI terminal */
export interface CLITerminalBridge {
  /** Write raw content */
  write: (content: string) => void
  /** Write a line with optional type */
  writeLine: (content: string, type?: TerminalLine["type"]) => void
  /** Clear terminal */
  clear: () => void
  /** Update the current (last) line - useful for progress indicators */
  updateLine: (content: string) => void
  /** Set the prompt text */
  setPrompt: (prompt: string) => void
  /** Request user input */
  requestInput: (prompt?: string) => Promise<string>
  /** Terminal dimensions */
  dimensions: TerminalDimensions
  /** Subscribe to resize events */
  onResize: (callback: (dims: TerminalDimensions) => void) => () => void
  /** Subscribe to keyboard events */
  onKeyPress: (callback: (key: string, modifiers: KeyModifiers) => void) => () => void
  /** Render styled content using ANSI codes */
  renderStyled: (content: StyledContent) => void
  /** Get current cursor position */
  getCursorPosition: () => { x: number; y: number }
  /** Set cursor position */
  setCursorPosition: (x: number, y: number) => void
  /** Show/hide cursor */
  setCursorVisible: (visible: boolean) => void
}

export interface TerminalDimensions {
  columns: number
  rows: number
}

export interface KeyModifiers {
  ctrl: boolean
  alt: boolean
  shift: boolean
  meta: boolean
}

/** Styled content for terminal rendering */
export interface StyledContent {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  color?: string
  backgroundColor?: string
  dim?: boolean
  inverse?: boolean
}

// ============================================
// Command Definition
// ============================================

/** CLI command definition */
export interface CLICommand {
  /** Command name */
  name: string
  /** Description shown in help */
  description: string
  /** Command aliases */
  aliases?: string[]
  /** Positional arguments */
  args?: CLICommandArg[]
  /** Flag options */
  flags?: CLICommandFlag[]
  /** Subcommands */
  subcommands?: CLICommand[]
  /** Usage examples */
  examples?: string[]
  /** Command handler (if not using Component) */
  handler?: (args: string[], flags: Record<string, unknown>, ctx: CLIAppContext) => void | Promise<void>
}

export interface CLICommandArg {
  name: string
  required?: boolean
  description?: string
  default?: string
  /** Validation function */
  validate?: (value: string) => boolean | string
}

export interface CLICommandFlag {
  name: string
  char?: string
  type: "boolean" | "string" | "number"
  description?: string
  default?: string | boolean | number
  required?: boolean
  /** Allowed values (enum-like) */
  choices?: (string | number)[]
}

// ============================================
// Adapter Interface
// ============================================

/** Interface all library adapters must implement */
export interface ICLIAdapter {
  /** Library identifier */
  readonly library: CLILibrary
  /** Adapter version */
  readonly adapterVersion: string
  /** Supported library version range */
  readonly supportedVersions: VersionRange
  
  /** Initialize the adapter */
  initialize(): Promise<void>
  /** Cleanup resources */
  destroy(): Promise<void>
  
  /** Check version compatibility */
  checkCompatibility(requestedVersion: string): VersionCompatibility
  
  /** Create a render instance for a CLI app */
  createRenderInstance(
    component: React.ComponentType<unknown>,
    props: Record<string, unknown>,
    bridge: CLITerminalBridge
  ): CLIRenderInstance
  
  /** Feature support detection */
  supportsFeature(feature: CLIFeature): boolean
  
  /** Get all supported features for a version */
  getFeaturesForVersion(version: string): CLIFeature[]
  
  /** Apply version-specific transformations to props */
  transformProps?(props: Record<string, unknown>, targetVersion: string): Record<string, unknown>
}

/** Running render instance */
export interface CLIRenderInstance {
  /** Instance ID */
  readonly id: string
  /** Re-render with new props */
  rerender(props?: Record<string, unknown>): void
  /** Unmount the component */
  unmount(): void
  /** Wait for app to exit */
  waitUntilExit(): Promise<number>
  /** Clear rendered content */
  clear(): void
  /** Pause rendering */
  pause(): void
  /** Resume rendering */
  resume(): void
  /** Check if instance is active */
  isActive(): boolean
}

/** CLI features that adapters can support */
export type CLIFeature = 
  | "useInput"
  | "useStdin"
  | "useStdout"
  | "useFocus"
  | "useFocusManager"
  | "measureElement"
  | "staticOutput"
  | "flexbox"
  | "colors16"
  | "colors256"
  | "trueColor"
  | "unicode"
  | "mouse"
  | "hyperlinks"
  | "images"
  | "boxDrawing"

// ============================================
// Registry Types
// ============================================

/** Registry for managing CLI apps */
export interface CLIAppRegistry {
  /** Register a CLI app */
  register(app: CLIAppDefinition): void
  /** Unregister an app */
  unregister(name: string): void
  /** Get an app by name */
  get(name: string): CLIAppDefinition | undefined
  /** List all registered apps */
  list(): CLIAppDefinition[]
  /** Check if app exists */
  has(name: string): boolean
  /** Get apps by library type */
  getByLibrary(library: CLILibrary): CLIAppDefinition[]
  /** Search apps by keyword */
  search(query: string): CLIAppDefinition[]
  /** Get app count */
  count(): number
}

/** Registry for managing adapters */
export interface CLIAdapterRegistry {
  /** Register an adapter */
  register(adapter: ICLIAdapter): void
  /** Unregister an adapter */
  unregister(library: CLILibrary): void
  /** Get adapter for library */
  getAdapter(library: CLILibrary): ICLIAdapter | undefined
  /** List all registered adapters */
  list(): ICLIAdapter[]
  /** Check library support */
  supportsLibrary(library: CLILibrary): boolean
  /** Get supported version range for library */
  getSupportedVersions(library: CLILibrary): VersionRange | undefined
}

// ============================================
// App Instance Types
// ============================================

/** Status of a running CLI app */
export type CLIAppStatus = "starting" | "running" | "suspended" | "exiting" | "terminated" | "error"

/** Running app instance */
export interface CLIAppInstance {
  /** Unique instance ID */
  readonly id: string
  /** App definition */
  readonly app: CLIAppDefinition
  /** Current status */
  status: CLIAppStatus
  /** Start timestamp */
  readonly startTime: Date
  /** Exit code (if terminated) */
  exitCode?: number
  /** Error (if status is error) */
  error?: Error
  /** Process ID (for display purposes) */
  readonly pid: number
  
  /** Suspend execution (background) */
  suspend(): void
  /** Resume execution (foreground) */
  resume(): void
  /** Terminate the app */
  terminate(code?: number): void
  /** Send input to the app */
  sendInput(input: string): void
  /** Send signal to the app */
  sendSignal(signal: CLISignal): void
  
  /** Subscribe to status change event */
  onStatusChange(callback: (status: CLIAppStatus) => void): () => void
  /** Subscribe to exit event */
  onExit(callback: (code: number) => void): () => void
  /** Subscribe to error event */
  onError(callback: (error: Error) => void): () => void
  /** Subscribe to output event */
  onOutput(callback: (output: string) => void): () => void
}

/** Signals that can be sent to CLI apps */
export type CLISignal = "SIGINT" | "SIGTERM" | "SIGKILL" | "SIGHUP" | "SIGUSR1" | "SIGUSR2"

// ============================================
// Plugin Host Types
// ============================================

/** CLI Plugin Host configuration */
export interface CLIPluginHostOptions {
  /** Maximum concurrent running apps */
  maxConcurrentApps?: number
  /** Enable sandbox mode for untrusted apps */
  sandboxMode?: boolean
  /** Default library if not specified */
  defaultLibrary?: CLILibrary
  /** Default library version if not specified */
  defaultLibraryVersion?: VersionRange
  /** Custom adapters to register */
  adapters?: ICLIAdapter[]
  /** Auto-initialize on creation */
  autoInitialize?: boolean
}

/** CLI Plugin Host interface */
export interface CLIPluginHost {
  // ============================================
  // App Management
  // ============================================
  
  /** Register a CLI app */
  registerApp(app: CLIAppDefinition): void
  /** Unregister an app */
  unregisterApp(name: string): void
  /** Get app by name */
  getApp(name: string): CLIAppDefinition | undefined
  /** List all apps */
  listApps(): CLIAppDefinition[]
  
  // ============================================
  // App Execution
  // ============================================
  
  /** Launch an app */
  launch(
    name: string,
    args?: string[],
    flags?: Record<string, string | boolean | number>
  ): Promise<CLIAppInstance>
  
  /** Get running instance */
  getInstance(instanceId: string): CLIAppInstance | undefined
  /** List running instances */
  listRunningInstances(): CLIAppInstance[]
  /** Terminate an instance */
  terminate(instanceId: string, code?: number): void
  /** Terminate all running apps */
  terminateAll(): void
  /** Get foreground instance */
  getForegroundInstance(): CLIAppInstance | undefined
  /** Bring instance to foreground */
  bringToForeground(instanceId: string): void
  
  // ============================================
  // Adapter Management
  // ============================================
  
  /** Register an adapter */
  registerAdapter(adapter: ICLIAdapter): void
  /** Get adapter for library */
  getAdapter(library: CLILibrary): ICLIAdapter | undefined
  /** Check library support */
  supportsLibrary(library: CLILibrary): boolean
  /** List supported libraries */
  listSupportedLibraries(): CLILibrary[]
  
  // ============================================
  // Lifecycle
  // ============================================
  
  /** Initialize the host */
  initialize(context: OpenTUIRuntimeContext): Promise<void>
  /** Check if host is initialized */
  isInitialized(): boolean
  /** Cleanup resources */
  destroy(): Promise<void>
  
  // ============================================
  // Events
  // ============================================
  
  /** Subscribe to app launched event */
  onAppLaunched(callback: (instance: CLIAppInstance) => void): () => void
  /** Subscribe to app terminated event */
  onAppTerminated(callback: (instance: CLIAppInstance, code: number) => void): () => void
  /** Subscribe to app error event */
  onAppError(callback: (instance: CLIAppInstance, error: Error) => void): () => void
}

// ============================================
// Utility Types
// ============================================

/** Event emitter for CLI apps */
export interface CLIEventEmitter<T extends Record<string, unknown[]>> {
  on<K extends keyof T>(event: K, callback: (...args: T[K]) => void): () => void
  off<K extends keyof T>(event: K, callback: (...args: T[K]) => void): void
  emit<K extends keyof T>(event: K, ...args: T[K]): void
  once<K extends keyof T>(event: K, callback: (...args: T[K]) => void): () => void
}

/** Argument parser result */
export interface ParsedArgs {
  args: string[]
  flags: Record<string, string | boolean | number>
  command?: string
  subcommand?: string
}

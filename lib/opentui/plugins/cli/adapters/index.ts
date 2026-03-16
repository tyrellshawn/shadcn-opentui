// CLI Plugin Framework Adapters
// Export all adapter implementations and utilities

// Base adapter
export { BaseCLIAdapter, BaseRenderInstance, generateId } from "./base-adapter"

// Version negotiator
export { 
  VersionNegotiator, 
  versionNegotiator,
  parseVersion,
  compareVersions,
  satisfiesRange,
} from "./version-negotiator"

// Ink adapter
export { InkAdapter, createInkAdapter } from "./ink-adapter"
export type { InkAdapterOptions, InkRenderInstance } from "./ink-adapter"

// Pastel adapter (future)
export { PastelAdapter, createPastelAdapter } from "./pastel-adapter"
export type { PastelAdapterOptions, PastelTheme, PastelRenderInstance } from "./pastel-adapter"

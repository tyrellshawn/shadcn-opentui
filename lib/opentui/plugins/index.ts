// OpenTUI Plugin Framework
// Main entry point for the plugin system

export * from "./types"
export * from "./utils"
export { createTablePlugin, tablePlugin } from "./table-plugin"
export { createProgressPlugin, progressPlugin, progressManager, ProgressManager } from "./progress-plugin"

// CLI Plugin Framework exports
export {
  // Main plugin creator
  createCLIIntegrationPlugin,
  
  // App builder
  createCLIApp,
  createCommand,
  
  // Plugin host
  createCLIPluginHost,
  getCLIPluginHost,
  registerCLIApp,
  
  // Registries
  createCLIAppRegistry,
  createCLIAdapterRegistry,
  
  // Terminal bridge
  createCLITerminalBridge,
  createExtendedCLITerminalBridge,
  
  // Adapters
  InkAdapter,
  createInkAdapter,
  PastelAdapter,
  createPastelAdapter,
  
  // Version utilities
  versionNegotiator,
  parseVersion,
  compareVersions,
  satisfiesRange,
} from "./cli"

export type {
  // Core types
  CLILibrary,
  VersionRange,
  CLIAppManifest,
  CLIAppCapabilities,
  CLIAppDefinition,
  CLIAppContext,
  CLITerminalBridge,
  CLICommand,
  CLIAppInstance,
  CLIPluginHost,
  CLIAppBuilder,
  CommandBuilder,
  
  // Adapter types
  ICLIAdapter,
  CLIFeature,
  InkAdapterOptions,
  PastelAdapterOptions,
} from "./cli"

import type { OpenTUIPluginDefinition, PluginRegistry as IPluginRegistry } from "./types"

// ============================================
// Plugin Registry Implementation
// ============================================

class PluginRegistryImpl implements IPluginRegistry {
  plugins: Map<string, OpenTUIPluginDefinition> = new Map()

  register(plugin: OpenTUIPluginDefinition): void {
    if (this.plugins.has(plugin.name)) {
      console.warn(`Plugin "${plugin.name}" is already registered. Overwriting.`)
    }
    this.plugins.set(plugin.name, plugin)
  }

  unregister(name: string): void {
    const plugin = this.plugins.get(name)
    if (plugin) {
      plugin.onDestroy?.()
      this.plugins.delete(name)
    }
  }

  get(name: string): OpenTUIPluginDefinition | undefined {
    return this.plugins.get(name)
  }

  list(): OpenTUIPluginDefinition[] {
    return Array.from(this.plugins.values())
  }

  has(name: string): boolean {
    return this.plugins.has(name)
  }
}

// Global plugin registry
export const pluginRegistry = new PluginRegistryImpl()

// ============================================
// Plugin Builder Helper
// ============================================

export function definePlugin(definition: OpenTUIPluginDefinition): OpenTUIPluginDefinition {
  return definition
}

// ============================================
// Built-in Plugins Collection
// ============================================

import { tablePlugin } from "./table-plugin"
import { progressPlugin } from "./progress-plugin"
import { createCLIIntegrationPlugin } from "./cli"

// Create a default CLI plugin instance
const cliPlugin = createCLIIntegrationPlugin()

export const builtinPlugins = {
  table: tablePlugin,
  progress: progressPlugin,
  cli: cliPlugin,
}

// Register all built-in plugins
export function registerBuiltinPlugins(): void {
  Object.values(builtinPlugins).forEach((plugin) => {
    pluginRegistry.register(plugin)
  })
}

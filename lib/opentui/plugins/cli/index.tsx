// OpenTUI CLI Plugin Framework
// Main entry point for CLI application integration

import type { OpenTUIPluginDefinition } from "../types"
import type { OpenTUIRuntimeContext } from "../../types"
import type { 
  CLIPluginHostOptions, 
  CLIAppDefinition,
  CLIPluginHost,
} from "./types"
import { createCLIPluginHost } from "./cli-plugin-host"

// ============================================
// Re-exports
// ============================================

// Types
export type {
  // Core types
  CLILibrary,
  VersionRange,
  VersionCompatibility,
  VersionFeatureMap,
  
  // Manifest types
  CLIAppManifest,
  CLIAppCapabilities,
  CLIAppDefinition,
  CLIAppLifecycle,
  
  // Runtime types
  CLIAppContext,
  CLITerminalBridge,
  TerminalDimensions,
  KeyModifiers,
  StyledContent,
  
  // Command types
  CLICommand,
  CLICommandArg,
  CLICommandFlag,
  
  // Adapter types
  ICLIAdapter,
  CLIRenderInstance,
  CLIFeature,
  
  // Registry types
  CLIAppRegistry,
  CLIAdapterRegistry,
  
  // Instance types
  CLIAppStatus,
  CLIAppInstance,
  CLISignal,
  
  // Host types
  CLIPluginHostOptions,
  CLIPluginHost,
  
  // Utility types
  CLIEventEmitter,
  ParsedArgs,
} from "./types"

// Terminal bridge
export { 
  createCLITerminalBridge, 
  createExtendedCLITerminalBridge,
} from "./cli-terminal-bridge"
export type { 
  CLITerminalBridgeConfig,
  ExtendedCLITerminalBridge,
} from "./cli-terminal-bridge"

// App registry
export { 
  createCLIAppRegistry, 
  createCLIAdapterRegistry,
} from "./cli-app-registry"

// Plugin host
export { createCLIPluginHost } from "./cli-plugin-host"

// App builder
export { 
  createCLIApp, 
  createCommand,
} from "./create-cli-app"
export type { 
  CLIAppBuilder, 
  CommandBuilder,
} from "./create-cli-app"

// Adapters
export {
  // Base
  BaseCLIAdapter,
  BaseRenderInstance,
  
  // Version negotiator
  VersionNegotiator,
  versionNegotiator,
  parseVersion,
  compareVersions,
  satisfiesRange,
  
  // Ink adapter
  InkAdapter,
  createInkAdapter,
  
  // Pastel adapter
  PastelAdapter,
  createPastelAdapter,
} from "./adapters"
export type {
  InkAdapterOptions,
  PastelAdapterOptions,
  PastelTheme,
} from "./adapters"

// ============================================
// Singleton Plugin Host
// ============================================

let globalPluginHost: CLIPluginHost | null = null

/**
 * Get or create the global CLI plugin host
 */
export function getCLIPluginHost(options?: CLIPluginHostOptions): CLIPluginHost {
  if (!globalPluginHost) {
    globalPluginHost = createCLIPluginHost(options)
  }
  return globalPluginHost
}

/**
 * Register a CLI app with the global plugin host
 */
export function registerCLIApp(app: CLIAppDefinition): void {
  getCLIPluginHost().registerApp(app)
}

// ============================================
// OpenTUI Plugin Integration
// ============================================

/**
 * Configuration options for the CLI integration plugin
 */
export interface CLIIntegrationPluginOptions extends CLIPluginHostOptions {
  /** Automatically register built-in apps */
  autoRegisterBuiltins?: boolean
  /** Command prefix for CLI commands (default: "cli") */
  commandPrefix?: string
}

/**
 * Create an OpenTUI plugin that integrates CLI app support
 * 
 * @example
 * ```typescript
 * import { OpenTUIProvider } from "@/lib/opentui"
 * import { createCLIIntegrationPlugin } from "@/lib/opentui/plugins/cli"
 * 
 * const cliPlugin = createCLIIntegrationPlugin()
 * 
 * function App() {
 *   return (
 *     <OpenTUIProvider plugins={[cliPlugin]}>
 *       <Terminal />
 *     </OpenTUIProvider>
 *   )
 * }
 * ```
 */
export function createCLIIntegrationPlugin(
  options: CLIIntegrationPluginOptions = {}
): OpenTUIPluginDefinition {
  const {
    autoRegisterBuiltins = true,
    commandPrefix = "cli",
    ...hostOptions
  } = options

  const host = createCLIPluginHost(hostOptions)

  return {
    name: "cli-integration",
    version: "1.0.0",
    description: "CLI application integration for OpenTUI (Ink, Pastel, etc.)",
    keywords: ["cli", "ink", "pastel", "terminal"],

    onInit: async (context: OpenTUIRuntimeContext) => {
      await host.initialize(context)

      // Register built-in apps if enabled
      if (autoRegisterBuiltins) {
        // Built-in help app would be registered here
      }
    },

    onDestroy: async () => {
      await host.destroy()
    },

    commands: [
      {
        name: `${commandPrefix}:list`,
        description: "List all registered CLI apps",
        category: "system",
        handler: (args, ctx) => {
          const apps = host.listApps()
          
          if (apps.length === 0) {
            ctx.addLine("No CLI apps registered.", "system")
            return
          }
          
          ctx.addLine(`Registered CLI Apps (${apps.length}):`, "system")
          ctx.addLine("", "output")
          
          for (const app of apps) {
            const { name, version, description, library } = app.manifest
            ctx.addLine(`  ${name} v${version} [${library}]`, "success")
            if (description) {
              ctx.addLine(`    ${description}`, "output")
            }
          }
        },
      },
      {
        name: `${commandPrefix}:run`,
        description: "Run a CLI app",
        usage: `${commandPrefix}:run <app-name> [args...]`,
        category: "system",
        handler: async (args, ctx) => {
          const [appName, ...appArgs] = args
          
          if (!appName) {
            ctx.addLine(`Usage: ${commandPrefix}:run <app-name> [args...]`, "error")
            ctx.addLine(`Use '${commandPrefix}:list' to see available apps.`, "system")
            return
          }
          
          try {
            const instance = await host.launch(appName, appArgs)
            ctx.addLine(`Started ${appName} (PID: ${instance.pid})`, "success")
          } catch (error) {
            ctx.addLine(`Error: ${error instanceof Error ? error.message : String(error)}`, "error")
          }
        },
      },
      {
        name: `${commandPrefix}:stop`,
        description: "Stop a running CLI app",
        usage: `${commandPrefix}:stop <instance-id|pid>`,
        category: "system",
        handler: (args, ctx) => {
          const [idOrPid] = args
          
          if (!idOrPid) {
            ctx.addLine(`Usage: ${commandPrefix}:stop <instance-id|pid>`, "error")
            return
          }
          
          // Find instance by ID or PID
          const instances = host.listRunningInstances()
          const instance = instances.find(
            (i) => i.id === idOrPid || i.pid.toString() === idOrPid
          )
          
          if (!instance) {
            ctx.addLine(`No running instance found with ID/PID: ${idOrPid}`, "error")
            return
          }
          
          host.terminate(instance.id)
          ctx.addLine(`Stopped ${instance.app.manifest.name} (PID: ${instance.pid})`, "success")
        },
      },
      {
        name: `${commandPrefix}:ps`,
        description: "List running CLI app instances",
        category: "system",
        handler: (args, ctx) => {
          const instances = host.listRunningInstances()
          
          if (instances.length === 0) {
            ctx.addLine("No CLI apps currently running.", "system")
            return
          }
          
          ctx.addLine(`Running CLI Apps (${instances.length}):`, "system")
          ctx.addLine("", "output")
          ctx.addLine("  PID    STATUS      APP", "output")
          ctx.addLine("  ─────  ─────────   ───────────────────", "output")
          
          for (const instance of instances) {
            const fg = host.getForegroundInstance()?.id === instance.id ? "*" : " "
            const status = instance.status.padEnd(9)
            ctx.addLine(
              `${fg} ${instance.pid.toString().padEnd(5)}  ${status}   ${instance.app.manifest.name}`,
              instance.status === "running" ? "success" : "output"
            )
          }
        },
      },
      {
        name: `${commandPrefix}:fg`,
        description: "Bring a CLI app to foreground",
        usage: `${commandPrefix}:fg <instance-id|pid>`,
        category: "system",
        handler: (args, ctx) => {
          const [idOrPid] = args
          
          if (!idOrPid) {
            ctx.addLine(`Usage: ${commandPrefix}:fg <instance-id|pid>`, "error")
            return
          }
          
          const instances = host.listRunningInstances()
          const instance = instances.find(
            (i) => i.id === idOrPid || i.pid.toString() === idOrPid
          )
          
          if (!instance) {
            ctx.addLine(`No running instance found with ID/PID: ${idOrPid}`, "error")
            return
          }
          
          host.bringToForeground(instance.id)
          ctx.addLine(`Brought ${instance.app.manifest.name} to foreground`, "success")
        },
      },
      {
        name: `${commandPrefix}:info`,
        description: "Show detailed info about a CLI app",
        usage: `${commandPrefix}:info <app-name>`,
        category: "system",
        handler: (args, ctx) => {
          const [appName] = args
          
          if (!appName) {
            ctx.addLine(`Usage: ${commandPrefix}:info <app-name>`, "error")
            return
          }
          
          const app = host.getApp(appName)
          if (!app) {
            ctx.addLine(`App "${appName}" not found.`, "error")
            return
          }
          
          const { manifest, commands } = app
          
          ctx.addLine(`App: ${manifest.name}`, "success")
          ctx.addLine(`Version: ${manifest.version}`, "output")
          ctx.addLine(`Library: ${manifest.library} (${manifest.libraryVersion})`, "output")
          
          if (manifest.description) {
            ctx.addLine(`Description: ${manifest.description}`, "output")
          }
          if (manifest.author) {
            ctx.addLine(`Author: ${manifest.author}`, "output")
          }
          if (manifest.repository) {
            ctx.addLine(`Repository: ${manifest.repository}`, "output")
          }
          if (manifest.keywords?.length) {
            ctx.addLine(`Keywords: ${manifest.keywords.join(", ")}`, "output")
          }
          
          if (manifest.capabilities) {
            ctx.addLine("", "output")
            ctx.addLine("Capabilities:", "system")
            for (const [cap, enabled] of Object.entries(manifest.capabilities)) {
              if (enabled) {
                ctx.addLine(`  - ${cap}`, "output")
              }
            }
          }
          
          if (commands?.length) {
            ctx.addLine("", "output")
            ctx.addLine("Commands:", "system")
            for (const cmd of commands) {
              ctx.addLine(`  ${cmd.name} - ${cmd.description}`, "output")
            }
          }
        },
      },
    ],
  }
}

// Default export
export default createCLIIntegrationPlugin

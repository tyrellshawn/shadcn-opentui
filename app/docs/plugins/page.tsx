"use client"

import { useState } from "react"
import { Terminal } from "@/components/ui/terminal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, Puzzle, Activity, Code2, Layers, Zap } from "lucide-react"

const pluginDocsCode = `// lib/opentui/plugins/my-plugin.ts
import { createPlugin } from "@/lib/opentui/plugins/create-plugin"

export const myPlugin = createPlugin()
  .name("my-awesome-plugin")
  .version("1.0.0")
  .description("Does amazing things")
  .keywords("awesome", "custom", "plugin")
  
  // Add commands
  .command("greet", "Greet a user", (args, ctx) => {
    const name = args[0] || "World"
    ctx.addLine(\`Hello, \${name}!\`, "success")
  })
  
  // Add middleware
  .middleware(async (cmd, args, ctx, next) => {
    console.log(\`Executing: \${cmd}\`)
    await next()
  })
  
  // Lifecycle hooks
  .onInit((ctx) => {
    ctx.addLine("Plugin initialized!", "system")
  })
  
  .build()`

const tablePluginCode = `// Using the Table Plugin
import { createTablePlugin } from "@/lib/opentui/plugins"

// Create with custom options
const tablePlugin = createTablePlugin({
  defaultStyle: "rounded",
  maxWidth: 100,
  defaultShowBorders: true,
})

// Or use the command directly in terminal:
// table [{"name":"John","age":30},{"name":"Jane","age":25}]
// table --style=double --sort=age --desc [data]
// table --zebra --numbers [data]`

const progressPluginCode = `// Using the Progress Plugin
import { createProgressPlugin, progressManager } from "@/lib/opentui/plugins"

// Create with custom options
const progressPlugin = createProgressPlugin({
  defaultStyle: "gradient",
  defaultWidth: 40,
  adaptiveSpeed: true,
})

// Programmatic usage:
const bar = progressManager.create("download", 100, "Downloading")

// Update progress
progressManager.update("download", 50)
progressManager.increment("download", 10)

// Complete or error
progressManager.complete("download", "Download finished!")
progressManager.error("download", "Network error")`

const registryCode = `// Plugin Registry Usage
import { 
  pluginRegistry, 
  registerBuiltinPlugins,
  tablePlugin,
  progressPlugin 
} from "@/lib/opentui/plugins"

// Register all built-in plugins
registerBuiltinPlugins()

// Or register individually
pluginRegistry.register(tablePlugin)
pluginRegistry.register(progressPlugin)

// Check if plugin exists
if (pluginRegistry.has("table")) {
  const plugin = pluginRegistry.get("table")
  console.log(plugin?.description)
}

// List all plugins
const allPlugins = pluginRegistry.list()

// Unregister a plugin
pluginRegistry.unregister("my-plugin")`

export default function PluginsPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
            <Puzzle className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Plugin Framework</h1>
            <p className="text-muted-foreground">Extend OpenTUI with custom functionality</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-black/50 border border-emerald-500/20">
          <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-500/20">
            <Layers className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="table" className="data-[state=active]:bg-emerald-500/20">
            <Table className="h-4 w-4 mr-2" />
            Table Plugin
          </TabsTrigger>
          <TabsTrigger value="progress" className="data-[state=active]:bg-emerald-500/20">
            <Activity className="h-4 w-4 mr-2" />
            Progress Plugin
          </TabsTrigger>
          <TabsTrigger value="custom" className="data-[state=active]:bg-emerald-500/20">
            <Code2 className="h-4 w-4 mr-2" />
            Custom Plugins
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-emerald-500/20 bg-black/40 p-6 space-y-3">
              <div className="flex items-center gap-3">
                <Puzzle className="h-5 w-5 text-emerald-400" />
                <h3 className="font-semibold text-white">Modular Design</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Plugins are self-contained modules with commands, renderers, and lifecycle hooks.
              </p>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-black/40 p-6 space-y-3">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-emerald-400" />
                <h3 className="font-semibold text-white">Fluent API</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Build plugins with a chainable API using the createPlugin() builder.
              </p>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-black/40 p-6 space-y-3">
              <div className="flex items-center gap-3">
                <Layers className="h-5 w-5 text-emerald-400" />
                <h3 className="font-semibold text-white">Registry System</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Central registry for managing plugin lifecycle and dependencies.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Plugin Registry</h2>
            <div className="rounded-xl border border-emerald-500/20 bg-black/50 p-4 overflow-x-auto">
              <pre className="text-sm text-emerald-400 font-mono">{registryCode}</pre>
            </div>
          </div>
        </TabsContent>

        {/* Table Plugin Tab */}
        <TabsContent value="table" className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Table Plugin</h2>
            <p className="text-muted-foreground">
              Render data in beautifully formatted ASCII tables with sorting, styling, and formatting options.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-500/20 overflow-hidden">
            <Terminal
              welcomeMessage={["Table Plugin Demo", "Try: table, table --style=double, table --zebra --numbers"]}
              className="h-[400px]"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Usage</h3>
            <div className="rounded-xl border border-emerald-500/20 bg-black/50 p-4 overflow-x-auto">
              <pre className="text-sm text-emerald-400 font-mono">{tablePluginCode}</pre>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Options</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-emerald-500/20">
                    <th className="text-left py-3 px-4 text-white font-medium">Option</th>
                    <th className="text-left py-3 px-4 text-white font-medium">Description</th>
                    <th className="text-left py-3 px-4 text-white font-medium">Default</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-emerald-500/10">
                    <td className="py-3 px-4 font-mono text-emerald-400">--style</td>
                    <td className="py-3 px-4">Border style: minimal, rounded, double, heavy, ascii</td>
                    <td className="py-3 px-4">rounded</td>
                  </tr>
                  <tr className="border-b border-emerald-500/10">
                    <td className="py-3 px-4 font-mono text-emerald-400">--sort</td>
                    <td className="py-3 px-4">Column to sort by</td>
                    <td className="py-3 px-4">none</td>
                  </tr>
                  <tr className="border-b border-emerald-500/10">
                    <td className="py-3 px-4 font-mono text-emerald-400">--desc</td>
                    <td className="py-3 px-4">Sort in descending order</td>
                    <td className="py-3 px-4">false</td>
                  </tr>
                  <tr className="border-b border-emerald-500/10">
                    <td className="py-3 px-4 font-mono text-emerald-400">--zebra</td>
                    <td className="py-3 px-4">Alternate row shading</td>
                    <td className="py-3 px-4">false</td>
                  </tr>
                  <tr className="border-b border-emerald-500/10">
                    <td className="py-3 px-4 font-mono text-emerald-400">--numbers</td>
                    <td className="py-3 px-4">Show row numbers</td>
                    <td className="py-3 px-4">false</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-mono text-emerald-400">--no-borders</td>
                    <td className="py-3 px-4">Hide table borders</td>
                    <td className="py-3 px-4">false</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Progress Plugin Tab */}
        <TabsContent value="progress" className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Progress Plugin</h2>
            <p className="text-muted-foreground">
              Animated progress bars with smooth rendering, adaptive speed, and multiple styles.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-500/20 overflow-hidden">
            <Terminal
              welcomeMessage={["Progress Plugin Demo", "Try: progress, spinner, multibar"]}
              className="h-[400px]"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Usage</h3>
            <div className="rounded-xl border border-emerald-500/20 bg-black/50 p-4 overflow-x-auto">
              <pre className="text-sm text-emerald-400 font-mono">{progressPluginCode}</pre>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-emerald-500/20 bg-black/40 p-6 space-y-3">
              <h4 className="font-semibold text-white">Bar Styles</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <code className="text-emerald-400">block</code> - Classic block characters
                </li>
                <li>
                  <code className="text-emerald-400">line</code> - Line-based progress
                </li>
                <li>
                  <code className="text-emerald-400">dots</code> - Dot-style progress
                </li>
                <li>
                  <code className="text-emerald-400">arrow</code> - Arrow indicator
                </li>
                <li>
                  <code className="text-emerald-400">gradient</code> - Gradient fill effect
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-black/40 p-6 space-y-3">
              <h4 className="font-semibold text-white">Spinner Styles</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <code className="text-emerald-400">dots</code> - Braille dot pattern
                </li>
                <li>
                  <code className="text-emerald-400">line</code> - Rotating line
                </li>
                <li>
                  <code className="text-emerald-400">circle</code> - Quarter circle
                </li>
                <li>
                  <code className="text-emerald-400">bounce</code> - Bouncing dots
                </li>
                <li>
                  <code className="text-emerald-400">arrow</code> - Rotating arrow
                </li>
              </ul>
            </div>
          </div>
        </TabsContent>

        {/* Custom Plugins Tab */}
        <TabsContent value="custom" className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Creating Custom Plugins</h2>
            <p className="text-muted-foreground">Build your own plugins using the fluent createPlugin() API.</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Plugin Structure</h3>
            <div className="rounded-xl border border-emerald-500/20 bg-black/50 p-4 overflow-x-auto">
              <pre className="text-sm text-emerald-400 font-mono">{pluginDocsCode}</pre>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Plugin API Reference</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-emerald-500/20">
                    <th className="text-left py-3 px-4 text-white font-medium">Method</th>
                    <th className="text-left py-3 px-4 text-white font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-emerald-500/10">
                    <td className="py-3 px-4 font-mono text-emerald-400">.name()</td>
                    <td className="py-3 px-4">Set plugin name (required)</td>
                  </tr>
                  <tr className="border-b border-emerald-500/10">
                    <td className="py-3 px-4 font-mono text-emerald-400">.version()</td>
                    <td className="py-3 px-4">Set plugin version</td>
                  </tr>
                  <tr className="border-b border-emerald-500/10">
                    <td className="py-3 px-4 font-mono text-emerald-400">.description()</td>
                    <td className="py-3 px-4">Set plugin description</td>
                  </tr>
                  <tr className="border-b border-emerald-500/10">
                    <td className="py-3 px-4 font-mono text-emerald-400">.command()</td>
                    <td className="py-3 px-4">Add a terminal command</td>
                  </tr>
                  <tr className="border-b border-emerald-500/10">
                    <td className="py-3 px-4 font-mono text-emerald-400">.middleware()</td>
                    <td className="py-3 px-4">Add command middleware</td>
                  </tr>
                  <tr className="border-b border-emerald-500/10">
                    <td className="py-3 px-4 font-mono text-emerald-400">.renderer()</td>
                    <td className="py-3 px-4">Add a custom renderer</td>
                  </tr>
                  <tr className="border-b border-emerald-500/10">
                    <td className="py-3 px-4 font-mono text-emerald-400">.onInit()</td>
                    <td className="py-3 px-4">Plugin initialization hook</td>
                  </tr>
                  <tr className="border-b border-emerald-500/10">
                    <td className="py-3 px-4 font-mono text-emerald-400">.onDestroy()</td>
                    <td className="py-3 px-4">Plugin cleanup hook</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-mono text-emerald-400">.build()</td>
                    <td className="py-3 px-4">Build the plugin definition</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

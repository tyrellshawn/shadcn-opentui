"use client"

import { TerminalIcon, Settings, Keyboard, Eye, Sparkles, Zap, Code2, Layers } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodePreview, codeExamples } from "@/components/docs/code-preview"
import { CodeBlock } from "@/components/docs/code-block"
import { Terminal } from "@/components/ui/terminal"

const installationCode = `npx shadcn@latest add https://opentui.com/r/terminal.json`

const importCode = `import { Terminal, type TerminalCommand } from "@/components/ui/terminal"`

const advancedUsageCode = `import { Terminal, type TerminalCommand } from "@/components/ui/terminal"
import { useState } from "react"

export function AdvancedTerminal() {
  const [logs, setLogs] = useState<string[]>([])

  const commands: TerminalCommand[] = [
    {
      name: "fetch",
      description: "Fetch data from an API",
      handler: async (args) => {
        const url = args[0] || "https://api.example.com"
        try {
          const response = await fetch(url)
          const data = await response.json()
          return JSON.stringify(data, null, 2)
        } catch (error) {
          return \`Error: Failed to fetch from \${url}\`
        }
      },
    },
    {
      name: "log",
      description: "Add a log entry",
      handler: (args) => {
        const message = args.join(" ")
        setLogs((prev) => [...prev, message])
        return \`Logged: \${message}\`
      },
    },
  ]

  return (
    <Terminal
      commands={commands}
      welcomeMessage={["Advanced Terminal", "Try: fetch, log <message>"]}
      showTimestamp={true}
      onCommand={(cmd) => console.log("Command executed:", cmd)}
    />
  )
}`

const themeIntegrationCode = `import { Terminal } from "@/components/ui/terminal"
import { TerminalThemeProvider, useTerminalTheme } from "@/lib/opentui/themes"

export function ThemedTerminal() {
  return (
    <TerminalThemeProvider defaultTheme="tokyo-night">
      <TerminalContent />
    </TerminalThemeProvider>
  )
}

function TerminalContent() {
  const { theme, setTheme, themes } = useTerminalTheme()

  return (
    <div className="space-y-4">
      <select onChange={(e) => setTheme(e.target.value)}>
        {themes.map((t) => (
          <option key={t.name} value={t.name}>
            {t.displayName}
          </option>
        ))}
      </select>
      <Terminal
        welcomeMessage={[\`Current theme: \${theme.displayName}\`]}
        className="h-64"
      />
    </div>
  )
}`

export default function TerminalComponentPage() {
  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
            <TerminalIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Terminal Component</h1>
            <p className="text-muted-foreground">A fully interactive terminal component built with shadcn/ui</p>
          </div>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl">
          The Terminal component provides a complete command-line interface experience with command handling, history
          navigation, tab completion, and customizable appearance.
        </p>
      </div>

      {/* Quick Start */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Zap className="h-5 w-5 text-emerald-400" />
          Quick Start
        </h2>

        <div className="grid gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Installation</h3>
            <CodeBlock
              code={installationCode}
              language="bash"
              showLineNumbers={false}
              showHeader={true}
              title="Terminal"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Import</h3>
            <CodeBlock code={importCode} language="typescript" showLineNumbers={false} />
          </div>
        </div>
      </section>

      {/* Overview */}
      <Card className="border-emerald-500/20 bg-black/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            Overview
          </CardTitle>
          <CardDescription>Key features and capabilities of the terminal component</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-emerald-400">Interactive Features</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">-</span>
                  Command input with history (Arrow Up/Down)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">-</span>
                  Tab completion for commands
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">-</span>
                  Keyboard shortcuts (Ctrl+L to clear)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">-</span>
                  Custom command handlers with TypeScript
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-emerald-400">Shadcn Integration</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">-</span>
                  Built with shadcn/ui design system
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">-</span>
                  Consistent theming and styling
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">-</span>
                  Responsive design patterns
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">-</span>
                  Full TypeScript support
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Code2 className="h-5 w-5 text-emerald-400" />
          Examples
        </h2>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="bg-black/50 border border-emerald-500/20">
            <TabsTrigger
              value="basic"
              className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
            >
              Basic Usage
            </TabsTrigger>
            <TabsTrigger
              value="custom"
              className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
            >
              Custom Commands
            </TabsTrigger>
            <TabsTrigger
              value="variants"
              className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
            >
              Variants
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <CodePreview {...codeExamples.basicTerminal} />
          </TabsContent>

          <TabsContent value="custom">
            <CodePreview {...codeExamples.customCommands} />
          </TabsContent>

          <TabsContent value="variants">
            <CodePreview {...codeExamples.variants} />
          </TabsContent>
        </Tabs>
      </section>

      {/* Advanced Usage */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Layers className="h-5 w-5 text-emerald-400" />
          Advanced Usage
        </h2>

        <div className="grid gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Async Command Handlers</h3>
            <p className="text-muted-foreground">
              Commands can be asynchronous, allowing you to fetch data or perform complex operations.
            </p>
            <CodeBlock
              code={advancedUsageCode}
              language="tsx"
              title="advanced-terminal.tsx"
              highlightLines={[10, 11, 12, 13, 14, 15, 16, 17]}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Theme Integration</h3>
            <p className="text-muted-foreground">
              Integrate with the OpenTUI theme system for consistent styling across your application.
            </p>
            <CodeBlock code={themeIntegrationCode} language="tsx" title="themed-terminal.tsx" />
          </div>
        </div>
      </section>

      {/* API Reference */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="h-5 w-5 text-emerald-400" />
          API Reference
        </h2>

        <Card className="border-emerald-500/20 bg-black/40">
          <CardHeader>
            <CardTitle className="text-white">Props</CardTitle>
            <CardDescription>Terminal component properties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-emerald-500/20">
                    <th className="text-left p-3 text-white font-medium">Prop</th>
                    <th className="text-left p-3 text-white font-medium">Type</th>
                    <th className="text-left p-3 text-white font-medium">Default</th>
                    <th className="text-left p-3 text-white font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-emerald-500/10">
                    <td className="p-3">
                      <code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">prompt</code>
                    </td>
                    <td className="p-3">
                      <code className="text-purple-400">string</code>
                    </td>
                    <td className="p-3">
                      <code className="text-amber-400">"user@terminal:~$"</code>
                    </td>
                    <td className="p-3">Command prompt prefix</td>
                  </tr>
                  <tr className="border-b border-emerald-500/10">
                    <td className="p-3">
                      <code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">welcomeMessage</code>
                    </td>
                    <td className="p-3">
                      <code className="text-purple-400">string[]</code>
                    </td>
                    <td className="p-3">
                      <code className="text-amber-400">["Welcome..."]</code>
                    </td>
                    <td className="p-3">Initial messages to display</td>
                  </tr>
                  <tr className="border-b border-emerald-500/10">
                    <td className="p-3">
                      <code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">commands</code>
                    </td>
                    <td className="p-3">
                      <code className="text-purple-400">TerminalCommand[]</code>
                    </td>
                    <td className="p-3">
                      <code className="text-amber-400">[]</code>
                    </td>
                    <td className="p-3">Custom command handlers</td>
                  </tr>
                  <tr className="border-b border-emerald-500/10">
                    <td className="p-3">
                      <code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">onCommand</code>
                    </td>
                    <td className="p-3">
                      <code className="text-purple-400">function</code>
                    </td>
                    <td className="p-3">
                      <code className="text-amber-400">undefined</code>
                    </td>
                    <td className="p-3">Fallback command handler</td>
                  </tr>
                  <tr className="border-b border-emerald-500/10">
                    <td className="p-3">
                      <code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">maxLines</code>
                    </td>
                    <td className="p-3">
                      <code className="text-purple-400">number</code>
                    </td>
                    <td className="p-3">
                      <code className="text-amber-400">1000</code>
                    </td>
                    <td className="p-3">Maximum lines to keep in history</td>
                  </tr>
                  <tr className="border-b border-emerald-500/10">
                    <td className="p-3">
                      <code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">variant</code>
                    </td>
                    <td className="p-3">
                      <code className="text-purple-400">"default" | "compact" | "minimal"</code>
                    </td>
                    <td className="p-3">
                      <code className="text-amber-400">"default"</code>
                    </td>
                    <td className="p-3">Visual style variant</td>
                  </tr>
                  <tr className="border-b border-emerald-500/10">
                    <td className="p-3">
                      <code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">showTimestamp</code>
                    </td>
                    <td className="p-3">
                      <code className="text-purple-400">boolean</code>
                    </td>
                    <td className="p-3">
                      <code className="text-amber-400">false</code>
                    </td>
                    <td className="p-3">Show timestamps on input lines</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/20 bg-black/40">
          <CardHeader>
            <CardTitle className="text-white">TerminalCommand Interface</CardTitle>
            <CardDescription>Structure for custom command definitions</CardDescription>
          </CardHeader>
          <CardContent>
            <CodePreview {...codeExamples.terminalCommandType} />
          </CardContent>
        </Card>
      </section>

      {/* Keyboard Shortcuts */}
      <Card className="border-emerald-500/20 bg-black/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Keyboard className="h-5 w-5 text-emerald-400" />
            Keyboard Shortcuts
          </CardTitle>
          <CardDescription>Built-in keyboard interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-emerald-400">Navigation</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-black/30 border border-emerald-500/10">
                  <span className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 text-xs">
                      Arrow Up
                    </kbd>
                  </span>
                  <span>Previous command</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-black/30 border border-emerald-500/10">
                  <span className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 text-xs">
                      Arrow Down
                    </kbd>
                  </span>
                  <span>Next command</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-black/30 border border-emerald-500/10">
                  <span className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 text-xs">
                      Tab
                    </kbd>
                  </span>
                  <span>Command completion</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-emerald-400">Actions</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-black/30 border border-emerald-500/10">
                  <span className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 text-xs">
                      Enter
                    </kbd>
                  </span>
                  <span>Execute command</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-black/30 border border-emerald-500/10">
                  <span className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 text-xs">
                      Ctrl
                    </kbd>
                    <span className="text-emerald-400">+</span>
                    <kbd className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 text-xs">
                      L
                    </kbd>
                  </span>
                  <span>Clear terminal</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-black/30 border border-emerald-500/10">
                  <span className="text-emerald-400">Click anywhere</span>
                  <span>Focus input</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Built-in Commands */}
      <Card className="border-emerald-500/20 bg-black/40">
        <CardHeader>
          <CardTitle className="text-white">Built-in Commands</CardTitle>
          <CardDescription>Commands available by default in the terminal component</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "help", description: "Show all available commands and their descriptions" },
              { name: "clear", description: "Clear the terminal screen" },
              { name: "history", description: "Show command history with line numbers" },
              { name: "date", description: "Display current date and time" },
              { name: "info", description: "Show terminal component information" },
            ].map((cmd) => (
              <div key={cmd.name} className="p-4 rounded-lg bg-black/30 border border-emerald-500/10 space-y-2">
                <Badge variant="outline" className="font-mono text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                  {cmd.name}
                </Badge>
                <p className="text-sm text-muted-foreground">{cmd.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Demo */}
      <Card className="border-emerald-500/20 bg-black/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Eye className="h-5 w-5 text-emerald-400" />
            Live Demo
          </CardTitle>
          <CardDescription>Try the terminal component with all features enabled</CardDescription>
        </CardHeader>
        <CardContent>
          <Terminal
            welcomeMessage={[
              "OpenTUI Terminal Component Demo",
              "Features: command history, tab completion, keyboard shortcuts",
              "Try: help, date, history, clear, info",
              "",
            ]}
            showTimestamp={true}
            className="h-80"
          />
        </CardContent>
      </Card>
    </div>
  )
}

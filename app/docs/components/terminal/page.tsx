import { TerminalIcon, Settings, Keyboard, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodePreview, codeExamples } from "@/components/docs/code-preview"
import { Terminal } from "@/components/ui/terminal"

export default function TerminalComponentPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Terminal Component</h1>
        <p className="text-xl text-muted-foreground">
          A fully interactive terminal component with command handling, history, and customizable appearance.
        </p>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TerminalIcon className="h-5 w-5" />
            Overview
          </CardTitle>
          <CardDescription>Key features and capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Interactive Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Command input with history (↑/↓ arrows)</li>
                <li>• Tab completion for commands</li>
                <li>• Keyboard shortcuts (Ctrl+L to clear)</li>
                <li>• Custom command handlers</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Customization</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Multiple visual variants</li>
                <li>• Custom prompt and welcome messages</li>
                <li>• Configurable line limits</li>
                <li>• Timestamp display options</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Examples */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Examples</h2>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Usage</TabsTrigger>
            <TabsTrigger value="custom">Custom Commands</TabsTrigger>
            <TabsTrigger value="variants">Variants</TabsTrigger>
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
      </div>

      {/* API Reference */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">API Reference</h2>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Props
            </CardTitle>
            <CardDescription>Terminal component properties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Prop</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-left p-2">Default</th>
                      <th className="text-left p-2">Description</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b">
                      <td className="p-2 font-mono">prompt</td>
                      <td className="p-2">string</td>
                      <td className="p-2">"user@terminal:~$"</td>
                      <td className="p-2">Command prompt prefix</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">welcomeMessage</td>
                      <td className="p-2">string[]</td>
                      <td className="p-2">["Welcome..."]</td>
                      <td className="p-2">Initial messages to display</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">commands</td>
                      <td className="p-2">TerminalCommand[]</td>
                      <td className="p-2">[]</td>
                      <td className="p-2">Custom command handlers</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">onCommand</td>
                      <td className="p-2">function</td>
                      <td className="p-2">undefined</td>
                      <td className="p-2">Fallback command handler</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">maxLines</td>
                      <td className="p-2">number</td>
                      <td className="p-2">1000</td>
                      <td className="p-2">Maximum lines to keep in history</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">variant</td>
                      <td className="p-2">"default" | "compact" | "minimal"</td>
                      <td className="p-2">"default"</td>
                      <td className="p-2">Visual style variant</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">showTimestamp</td>
                      <td className="p-2">boolean</td>
                      <td className="p-2">false</td>
                      <td className="p-2">Show timestamps on input lines</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>TerminalCommand Interface</CardTitle>
            <CardDescription>Structure for custom command definitions</CardDescription>
          </CardHeader>
          <CardContent>
            <CodePreview
              title="TerminalCommand Type"
              description="TypeScript interface for defining custom commands"
              language="typescript"
              code={`interface TerminalCommand {
  name: string                    // Command name (e.g., "help")
  description: string             // Help text description
  handler: (args: string[]) => Promise<void> | void | string
}

// Example usage
const customCommands: TerminalCommand[] = [
  {
    name: "greet",
    description: "Greet the user",
    handler: (args) => {
      const name = args[0] || "World"
      return \`Hello, \${name}!\`
    },
  },
]`}
            />
          </CardContent>
        </Card>
      </div>

      {/* Keyboard Shortcuts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </CardTitle>
          <CardDescription>Built-in keyboard interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Navigation</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>↑ Arrow Up</span>
                  <span>Previous command</span>
                </div>
                <div className="flex justify-between">
                  <span>↓ Arrow Down</span>
                  <span>Next command</span>
                </div>
                <div className="flex justify-between">
                  <span>Tab</span>
                  <span>Command completion</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Actions</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Enter</span>
                  <span>Execute command</span>
                </div>
                <div className="flex justify-between">
                  <span>Ctrl+L</span>
                  <span>Clear terminal</span>
                </div>
                <div className="flex justify-between">
                  <span>Click anywhere</span>
                  <span>Focus input</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Built-in Commands */}
      <Card>
        <CardHeader>
          <CardTitle>Built-in Commands</CardTitle>
          <CardDescription>Commands available by default in every terminal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Badge variant="outline" className="font-mono">
                  help
                </Badge>
                <p className="text-sm text-muted-foreground">Show all available commands and their descriptions</p>
              </div>
              <div className="space-y-2">
                <Badge variant="outline" className="font-mono">
                  clear
                </Badge>
                <p className="text-sm text-muted-foreground">Clear the terminal screen</p>
              </div>
              <div className="space-y-2">
                <Badge variant="outline" className="font-mono">
                  history
                </Badge>
                <p className="text-sm text-muted-foreground">Show command history with line numbers</p>
              </div>
              <div className="space-y-2">
                <Badge variant="outline" className="font-mono">
                  date
                </Badge>
                <p className="text-sm text-muted-foreground">Display current date and time</p>
              </div>
              <div className="space-y-2">
                <Badge variant="outline" className="font-mono">
                  opentui
                </Badge>
                <p className="text-sm text-muted-foreground">Show OpenTUI information and links</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Live Demo
          </CardTitle>
          <CardDescription>Try the terminal component with all features enabled</CardDescription>
        </CardHeader>
        <CardContent>
          <Terminal
            welcomeMessage={[
              "🚀 OpenTUI Terminal Component Demo",
              "Features: command history, tab completion, keyboard shortcuts",
              "Try: help, date, history, clear, opentui",
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

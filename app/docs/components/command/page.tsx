import { Code, Palette } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Command } from "@/components/command"
import { CodePreview } from "@/components/docs/code-preview"

export default function CommandComponentPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Command Component</h1>
        <p className="text-xl text-muted-foreground">
          A styled component for displaying command snippets with different variants, built with shadcn/ui design
          patterns.
        </p>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Overview
          </CardTitle>
          <CardDescription>Display command snippets with consistent shadcn styling</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The Command component provides a consistent way to display command snippets and code examples throughout
              your shadcn-based documentation or application.
            </p>
            <div className="flex flex-wrap gap-2">
              <Command>npx shadcn@latest add terminal</Command>
              <Command variant="success">✅ Component installed</Command>
              <Command variant="error">❌ Command not found</Command>
              <Command variant="warning">⚠️ Deprecated command</Command>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Variants */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Variants</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Default</CardTitle>
              <CardDescription>Standard command styling</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Command>help</Command>
                <Command>clear</Command>
                <Command>npm install @opentui/react</Command>
              </div>
              <CodePreview
                title="Default Usage"
                description="Basic command component"
                code={`<Command>npx shadcn@latest add terminal</Command>`}
                preview={<Command>npx shadcn@latest add terminal</Command>}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Success</CardTitle>
              <CardDescription>Successful commands or positive states</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Command variant="success">✅ Installation complete</Command>
                <Command variant="success">git push origin main</Command>
                <Command variant="success">Tests passed</Command>
              </div>
              <CodePreview
                title="Success Variant"
                description="Green styling for successful operations"
                code={`<Command variant="success">✅ Installation complete</Command>`}
                preview={<Command variant="success">✅ Installation complete</Command>}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Error</CardTitle>
              <CardDescription>Error messages and failed commands</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Command variant="error">❌ Command not found</Command>
                <Command variant="error">npm ERR! Package not found</Command>
                <Command variant="error">Build failed</Command>
              </div>
              <CodePreview
                title="Error Variant"
                description="Red styling for errors and failures"
                code={`<Command variant="error">❌ Command not found</Command>`}
                preview={<Command variant="error">❌ Command not found</Command>}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Warning</CardTitle>
              <CardDescription>Warnings and deprecated commands</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Command variant="warning">⚠️ Deprecated command</Command>
                <Command variant="warning">npm WARN peer dependency</Command>
                <Command variant="warning">Using fallback method</Command>
              </div>
              <CodePreview
                title="Warning Variant"
                description="Yellow styling for warnings"
                code={`<Command variant="warning">⚠️ Deprecated command</Command>`}
                preview={<Command variant="warning">⚠️ Deprecated command</Command>}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* API Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            API Reference
          </CardTitle>
          <CardDescription>Component props and styling options</CardDescription>
        </CardHeader>
        <CardContent>
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
                  <td className="p-2 font-mono">variant</td>
                  <td className="p-2">"default" | "success" | "error" | "warning"</td>
                  <td className="p-2">"default"</td>
                  <td className="p-2">Visual style variant</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-mono">children</td>
                  <td className="p-2">React.ReactNode</td>
                  <td className="p-2">-</td>
                  <td className="p-2">Command text or content</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-mono">className</td>
                  <td className="p-2">string</td>
                  <td className="p-2">-</td>
                  <td className="p-2">Additional CSS classes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Usage Examples */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Usage Examples</h2>

        <Card>
          <CardHeader>
            <CardTitle>Documentation Lists</CardTitle>
            <CardDescription>Using commands in documentation and help text</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Installation Commands</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Command>npx shadcn@latest add terminal</Command>
                    <span className="text-muted-foreground text-sm">Install with shadcn</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Command>bun install @opentui/react</Command>
                    <span className="text-muted-foreground text-sm">Install with Bun</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Terminal Commands</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Command>help</Command>
                    <span className="text-sm text-muted-foreground">Show available commands</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Command>clear</Command>
                    <span className="text-sm text-muted-foreground">Clear terminal output</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <CodePreview
          title="Complete Example"
          description="Command component with all variants in a documentation context"
          code={`import { Command } from "@/components/command"

export function CommandExamples() {
  return (
    <div className="space-y-4">
      <h3>Available Commands</h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Command>help</Command>
          <span>Show available commands</span>
        </div>
        <div className="flex items-center gap-2">
          <Command variant="success">npm install</Command>
          <span>Install packages</span>
        </div>
        <div className="flex items-center gap-2">
          <Command variant="error">invalid-command</Command>
          <span>Command not found</span>
        </div>
        <div className="flex items-center gap-2">
          <Command variant="warning">deprecated-cmd</Command>
          <span>Deprecated command</span>
        </div>
      </div>
    </div>
  )
}`}
          preview={
            <div className="space-y-4">
              <h3 className="font-semibold">Available Commands</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Command>help</Command>
                  <span className="text-sm text-muted-foreground">Show available commands</span>
                </div>
                <div className="flex items-center gap-2">
                  <Command variant="success">npm install</Command>
                  <span className="text-sm text-muted-foreground">Install packages</span>
                </div>
                <div className="flex items-center gap-2">
                  <Command variant="error">invalid-command</Command>
                  <span className="text-sm text-muted-foreground">Command not found</span>
                </div>
                <div className="flex items-center gap-2">
                  <Command variant="warning">deprecated-cmd</Command>
                  <span className="text-sm text-muted-foreground">Deprecated command</span>
                </div>
              </div>
            </div>
          }
        />
      </div>
    </div>
  )
}

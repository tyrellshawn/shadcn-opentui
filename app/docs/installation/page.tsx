import { Package, Download, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CodePreview } from "@/components/docs/code-preview"

export default function InstallationPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Installation</h1>
          <p className="text-xl text-muted-foreground">
            Get started with the shadcn terminal component using a single command.
          </p>
        </div>

        {/* Prerequisites */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Installation
            </CardTitle>
            <CardDescription>Install the terminal component in one simple step</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-4">
              <code className="text-sm block">bunx --bun shadcn@latest add https://opentui.vercel.app/r/terminal.json</code>
            </div>
          </CardContent>
        </Card>

        {/* Prerequisites */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Prerequisites
            </CardTitle>
            <CardDescription>Requirements for using the shadcn terminal component</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Next.js Project</h4>
                <p className="text-sm text-muted-foreground">
                  A Next.js project with shadcn/ui already set up. The terminal component integrates with your existing
                  shadcn components.
                </p>
                <div className="flex gap-2">
                  <Badge variant="outline">Next.js 16+</Badge>
                  <Badge variant="outline">shadcn/ui</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">React Knowledge</h4>
                <p className="text-sm text-muted-foreground">
                  Familiarity with React hooks, components, and TypeScript will help you customize the terminal component.
                </p>
                <div className="flex gap-2">
                  <Badge variant="outline">React 19+</Badge>
                  <Badge variant="outline">TypeScript</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Version Consistency</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              For the best experience, we recommend using <strong>Next.js 16</strong> with <strong>React 19</strong> (the
              latest stable versions). This ensures full compatibility with all terminal component features including
              server components, streaming, and modern React patterns.
            </p>
          </CardContent>
        </Card>

      {/* Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Verify Installation
          </CardTitle>
          <CardDescription>Test your terminal component installation</CardDescription>
        </CardHeader>
        <CardContent>
          <CodePreview
            title="Basic Usage"
            description="Simple test to verify your installation works"
            code={`import { Terminal } from "@/components/ui/terminal"

export default function TestPage() {
  return (
    <div className="p-4">
      <Terminal
        welcomeMessage={["Terminal component installed successfully!"]}
        className="h-64"
      />
    </div>
  )
}`}
          />
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle>Troubleshooting</CardTitle>
          <CardDescription>Common installation issues and solutions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm">Nothing appears or garbled output</h4>
              <p className="text-sm text-muted-foreground">
                Make sure your terminal supports ANSI escape codes and you're running in a real terminal, not a web
                environment.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm">JSX element errors</h4>
              <p className="text-sm text-muted-foreground">
                Ensure your tsconfig.json has the correct jsxImportSource setting pointing to "@opentui/react".
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm">Module not found errors</h4>
              <p className="text-sm text-muted-foreground">
                Verify all required packages are installed: @opentui/react, @opentui/core, and react.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

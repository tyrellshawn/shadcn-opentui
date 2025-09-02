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
          Get started with the shadcn terminal component by installing it in your project using the shadcn CLI.
        </p>
      </div>

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
                <Badge variant="outline">Next.js 13+</Badge>
                <Badge variant="outline">shadcn/ui</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Registry Configuration</h4>
              <p className="text-sm text-muted-foreground">
                Make sure your components.json file includes the @shadcn-opentui registry configuration.
              </p>
              <div className="bg-muted rounded-lg p-3">
                <code className="text-xs">
                  {`"registries": {
  "@shadcn-opentui": "https://opentui.vercel.app/r/{name}.json"
}`}
                </code>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">React Knowledge</h4>
              <p className="text-sm text-muted-foreground">
                Familiarity with React hooks, components, and TypeScript will help you customize the terminal component.
              </p>
              <div className="flex gap-2">
                <Badge variant="outline">React 18+</Badge>
                <Badge variant="outline">TypeScript</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Package Installation */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Installation</h2>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Using shadcn CLI (Recommended)
            </CardTitle>
            <CardDescription>Install the terminal component using the shadcn CLI</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-4">
              <code className="text-sm">bunx shadcn@latest add @shadcn-opentui/terminal</code>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Manual Installation
            </CardTitle>
            <CardDescription>Copy the component files manually if needed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              If you prefer to install manually, copy the terminal component from our GitHub repository to your
              components/ui directory.
            </p>
            <div className="bg-muted rounded-lg p-4">
              <code className="text-sm">
                {`# Manual installation (if needed)
# Download from: https://opentui.vercel.app/r/terminal.json`}
              </code>
            </div>
          </CardContent>
        </Card>
      </div>

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

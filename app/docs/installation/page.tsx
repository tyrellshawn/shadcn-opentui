import { Terminal, Package, Download, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CodePreview } from "@/components/docs/code-preview"

export default function InstallationPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Installation</h1>
        <p className="text-xl text-muted-foreground">
          Get started with OpenTUI React by installing the required packages and setting up your development
          environment.
        </p>
      </div>

      {/* Prerequisites */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Prerequisites
          </CardTitle>
          <CardDescription>Requirements for using OpenTUI React</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Node.js Environment</h4>
              <p className="text-sm text-muted-foreground">
                OpenTUI requires Node.js or Bun to render to your terminal. It's not intended to run in a browser.
              </p>
              <div className="flex gap-2">
                <Badge variant="outline">Node.js 18+</Badge>
                <Badge variant="outline">Bun (recommended)</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">React Knowledge</h4>
              <p className="text-sm text-muted-foreground">
                Familiarity with React hooks, components, and JSX patterns will help you get started quickly.
              </p>
              <div className="flex gap-2">
                <Badge variant="outline">React 18+</Badge>
                <Badge variant="outline">TypeScript (optional)</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Package Installation */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Package Installation</h2>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Using Bun (Recommended)
            </CardTitle>
            <CardDescription>Bun provides the fastest installation and runtime performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-4">
              <code className="text-sm">bun install @opentui/react @opentui/core react</code>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Using npm
            </CardTitle>
            <CardDescription>Standard npm installation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-4">
              <code className="text-sm">npm install @opentui/react @opentui/core react</code>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Using pnpm
            </CardTitle>
            <CardDescription>Fast, disk space efficient package manager</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-4">
              <code className="text-sm">pnpm install @opentui/react @opentui/core react</code>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Start Project */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Quick Start Project
          </CardTitle>
          <CardDescription>Scaffold a new TUI project with Bun</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted rounded-lg p-4">
            <code className="text-sm">bun create tui</code>
          </div>
          <p className="text-sm text-muted-foreground">
            This sets up a starter TypeScript project configured for OpenTUI with example components and proper
            configuration.
          </p>
        </CardContent>
      </Card>

      {/* TypeScript Configuration */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">TypeScript Configuration</h2>

        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertDescription>
            To get proper JSX support for OpenTUI's custom elements like &lt;box&gt; and &lt;text&gt;, update your
            tsconfig.json
          </AlertDescription>
        </Alert>

        <CodePreview
          title="tsconfig.json"
          description="Recommended TypeScript configuration for OpenTUI"
          language="json"
          code={`{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@opentui/react",
    "target": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "lib": ["ESNext", "DOM"]
  }
}`}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Key Configuration Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">jsxImportSource</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Critical setting that tells TypeScript to use OpenTUI's JSX runtime for elements like &lt;box&gt; and
                  &lt;text&gt;.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">target: "ESNext"</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Ensures compatibility with modern JavaScript features used by OpenTUI.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Verify Installation
          </CardTitle>
          <CardDescription>Test your OpenTUI setup with a simple example</CardDescription>
        </CardHeader>
        <CardContent>
          <CodePreview
            title="test.ts"
            description="Simple test to verify your installation works"
            code={`import { render } from "@opentui/react"

function App() {
  return (
    <box>
      <text fg="#00FF00">Hello, Terminal!</text>
      <box title="Welcome" padding={2}>
        <text>OpenTUI is working!</text>
      </box>
    </box>
  )
}

render(<App />)`}
          />
          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground">Run the test:</p>
            <div className="bg-muted rounded-lg p-4">
              <code className="text-sm">bun run test.ts</code>
            </div>
          </div>
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

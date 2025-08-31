import { Terminal, BookOpen, Code, Zap, ArrowRight, Github, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Terminal as TerminalComponent } from "@/components/ui/terminal"

export default function DocsPage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-8 w-8 text-green-500" />
          <h1 className="text-4xl font-bold tracking-tight">OpenTUI React</h1>
          <Badge variant="secondary" className="ml-2">
            v0.1.0
          </Badge>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Build beautiful terminal user interfaces with React. OpenTUI provides a React renderer for creating rich,
          interactive console applications using familiar React patterns and components.
        </p>
        <div className="flex items-center gap-4 pt-4">
          <Button asChild>
            <Link href="/docs/installation">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="https://github.com/sst/opentui" target="_blank">
              <Github className="mr-2 h-4 w-4" />
              View on GitHub
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Interactive Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Interactive Terminal Demo
          </CardTitle>
          <CardDescription>
            Try out the terminal component right here. Type commands like 'help', 'clear', or 'opentui info'.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TerminalComponent
            variant="default"
            className="h-64"
            initialOutput={["Welcome to OpenTUI React Documentation!", "Type 'help' to see available commands.", ""]}
          />
        </CardContent>
      </Card>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              React Familiar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Use familiar React patterns like hooks, state, and JSX to build terminal UIs. No need to learn new
              paradigms.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-green-500" />
              Rich Components
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Built-in components like text, box, input, select, and more. Create complex layouts with flexbox-like
              positioning.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Interactive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Handle keyboard events, manage focus, and create responsive terminal applications with real-time updates.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Start Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
          <CardDescription>Get up and running with OpenTUI React in minutes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted rounded-lg p-4">
            <code className="text-sm">
              {`# Install OpenTUI React
bun install @opentui/react @opentui/core react

# Or with npm
npm install @opentui/react @opentui/core react`}
            </code>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <code className="text-sm">
              {`import { render } from "@opentui/react"

function App() {
  return (
    <box>
      <text fg="#00FF00">Hello, Terminal!</text>
    </box>
  )
}

render(<App />)`}
            </code>
          </div>
          <Button asChild variant="outline">
            <Link href="/docs/quick-start">
              View Full Quick Start Guide
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Navigation Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Installation Guide</CardTitle>
            <CardDescription>Step-by-step setup instructions for OpenTUI React</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="ghost" className="p-0 h-auto">
              <Link href="/docs/installation" className="flex items-center gap-2">
                Learn more
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Component Reference</CardTitle>
            <CardDescription>Explore all available components and their APIs</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="ghost" className="p-0 h-auto">
              <Link href="/docs/components/terminal" className="flex items-center gap-2">
                Browse components
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

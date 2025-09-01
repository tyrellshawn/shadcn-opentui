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
          <h1 className="text-4xl font-bold tracking-tight">Shadcn OpenTUI</h1>
          <Badge variant="secondary" className="ml-2">
            v1.0.0
          </Badge>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl">
          A beautiful, interactive terminal component built with shadcn/ui and React. Create rich terminal user
          interfaces with familiar React patterns, complete command handling, and customizable styling.
        </p>
        <div className="flex items-center gap-4 pt-4">
          <Button asChild>
            <Link href="/docs/installation">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="https://github.com/shadcn-opentui/terminal" target="_blank">
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
            Try out the shadcn terminal component right here. Type commands like 'help', 'clear', or 'info'.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TerminalComponent
            variant="default"
            className="h-64"
            initialOutput={["Welcome to Shadcn OpenTUI Terminal!", "Type 'help' to see available commands.", ""]}
          />
        </CardContent>
      </Card>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              Shadcn Compatible
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Built with shadcn/ui components and design system. Integrates seamlessly with your existing shadcn
              projects and follows the same patterns.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-green-500" />
              Rich Terminal Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Command history, tab completion, keyboard shortcuts, custom commands, and interactive UI modes. Everything
              you need for a professional terminal experience.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Easy Installation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Install with a single shadcn command. No complex setup or configuration required. Works out of the box
              with TypeScript support.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Start Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
          <CardDescription>Get up and running with the shadcn terminal component in seconds.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted rounded-lg p-4">
            <code className="text-sm">
              {`# Configure registry in components.json
# "registries": {
#   "@shadcn-opentui": "https://opentui.vercel.app/r/{name}.json"
# }

# Install the terminal component
bunx shadcn@latest add @shadcn-opentui/terminal`}
            </code>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <code className="text-sm">
              {`import { Terminal } from "@/components/ui/terminal"

function App() {
  return (
    <Terminal
      welcomeMessage={["Welcome to my app!"]}
      commands={[
        {
          name: "hello",
          description: "Say hello",
          handler: () => "Hello, World!"
        }
      ]}
    />
  )
}`}
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
            <CardDescription>Step-by-step setup instructions for Shadcn OpenTUI</CardDescription>
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

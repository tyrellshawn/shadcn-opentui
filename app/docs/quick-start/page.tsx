"use client"

import { Play, TerminalIcon, Code, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CodePreview } from "@/components/docs/code-preview"
import { Terminal as TerminalComponent } from "@/components/ui/terminal"
import Link from "next/link"

export default function QuickStartPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Quick Start</h1>
        <p className="text-xl text-muted-foreground">
          Build your first interactive terminal interface with the shadcn terminal component in just a few minutes.
        </p>
      </div>

      {/* Hello Terminal Example */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Your First Terminal</h2>

        <CodePreview
          title="Basic Terminal"
          description="A simple terminal with welcome message and basic styling"
          code={`import { Terminal } from "@/components/ui/terminal"

export default function MyTerminal() {
  return (
    <Terminal
      welcomeMessage={[
        "Welcome to my application!",
        "Type 'help' to see available commands."
      ]}
      className="h-64"
    />
  )
}`}
          preview={
            <div className="bg-black text-green-400 font-mono p-4 rounded-lg">
              <div>Welcome to my application!</div>
              <div>Type 'help' to see available commands.</div>
              <div className="mt-2">
                <span className="text-green-500">user@terminal:~$ </span>
                <span className="bg-green-400 w-2 h-4 inline-block animate-pulse"></span>
              </div>
            </div>
          }
        />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">What's included?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Shadcn Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Built with shadcn/ui components and follows the same design patterns. Integrates seamlessly with your
                  existing components.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TerminalIcon className="h-4 w-4" />
                  Interactive Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Command history, tab completion, keyboard shortcuts, and custom command handling built-in.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Interactive Example */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Adding Custom Commands</h2>

        <CodePreview
          title="Custom Commands"
          description="Add your own commands with custom handlers"
          code={`import { Terminal } from "@/components/ui/terminal"

const customCommands = [
  {
    name: "greet",
    description: "Greet the user",
    handler: (args: string[]) => {
      const name = args[0] || "World"
      return \`Hello, \${name}! 👋\`
    }
  },
  {
    name: "time",
    description: "Show current time",
    handler: () => {
      return \`Current time: \${new Date().toLocaleTimeString()}\`
    }
  }
]

export default function CustomTerminal() {
  return (
    <Terminal
      commands={customCommands}
      welcomeMessage={["Try: greet [name], time, help"]}
      className="h-64"
    />
  )
}`}
          preview={
            <div className="bg-black text-green-400 font-mono p-4 rounded-lg">
              <div>Try: greet [name], time, help</div>
              <div className="mt-2">
                <span className="text-green-500">user@terminal:~$ </span>
                <span>greet Alice</span>
              </div>
              <div>Hello, Alice! 👋</div>
              <div className="mt-1">
                <span className="text-green-500">user@terminal:~$ </span>
                <span className="bg-green-400 w-2 h-4 inline-block ml-1 animate-pulse"></span>
              </div>
            </div>
          }
        />
      </div>

      {/* User Input Example */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Handling User Input</h2>

        <CodePreview
          title="Simple Input Form"
          description="Capture and display user input with OpenTUI's input component"
          code={`import { render } from "@opentui/react"
import { useState } from "react"

function InputForm() {
  const [name, setName] = useState("")
  const [submitted, setSubmitted] = useState(false)

  return (
    <box title="User Input" padding={2}>
      {!submitted ? (
        <>
          <text>Enter your name:</text>
          <input
            placeholder="Type here..."
            focused={true}
            onInput={setName}
            onSubmit={() => setSubmitted(true)}
          />
        </>
      ) : (
        <text fg="#00FF00">Hello, {name}!</text>
      )}
    </box>
  )
}

render(<InputForm />)`}
          preview={
            <div className="bg-black text-green-400 font-mono p-4 rounded-lg">
              <div className="border border-green-400/30 p-2 rounded">
                <div className="text-xs text-green-400/70 mb-1">User Input</div>
                <div>Enter your name:</div>
                <div className="bg-gray-800 px-2 py-1 mt-1 rounded">
                  <span className="text-gray-400">Type here...</span>
                  <span className="bg-green-400 w-2 h-4 inline-block ml-1 animate-pulse"></span>
                </div>
              </div>
            </div>
          }
        />
      </div>

      {/* Try It Yourself */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Try It Yourself
          </CardTitle>
          <CardDescription>Interactive terminal demo - try typing some commands!</CardDescription>
        </CardHeader>
        <CardContent>
          <TerminalComponent
            welcomeMessage={[
              "🚀 Quick Start Demo Terminal",
              "Try these commands: help, date, clear",
              "This is running the actual terminal component!",
            ]}
            className="h-64"
          />
        </CardContent>
      </Card>

      {/* Core Concepts */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Core Concepts</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">React Patterns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Use familiar React patterns like hooks, state, and props. OpenTUI components work just like regular
                React components.
              </p>
              <div className="flex gap-2">
                <Badge variant="outline">useState</Badge>
                <Badge variant="outline">useEffect</Badge>
                <Badge variant="outline">Props</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Terminal Elements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Built-in components like box, text, input, and select provide the building blocks for terminal UIs.
              </p>
              <div className="flex gap-2">
                <Badge variant="outline">&lt;box&gt;</Badge>
                <Badge variant="outline">&lt;text&gt;</Badge>
                <Badge variant="outline">&lt;input&gt;</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Layout System</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Flexbox-like layout system for arranging components. Use padding, margins, and flex properties for
                positioning.
              </p>
              <div className="flex gap-2">
                <Badge variant="outline">flexDirection</Badge>
                <Badge variant="outline">padding</Badge>
                <Badge variant="outline">justifyContent</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Event Handling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Handle keyboard events, input changes, and user interactions with React event handlers and custom hooks.
              </p>
              <div className="flex gap-2">
                <Badge variant="outline">useKeyboard</Badge>
                <Badge variant="outline">onInput</Badge>
                <Badge variant="outline">onSubmit</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>Continue your OpenTUI journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Explore Components</h4>
              <p className="text-sm text-muted-foreground">
                Learn about all available OpenTUI components and their APIs
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href="/docs/components/terminal">
                  View Components
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">See Examples</h4>
              <p className="text-sm text-muted-foreground">Interactive examples and real-world use cases</p>
              <Button asChild variant="outline" size="sm">
                <Link href="/docs/components/examples">
                  View Examples
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

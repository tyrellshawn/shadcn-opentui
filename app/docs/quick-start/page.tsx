"use client"

import { useState } from "react"
import { Play, TerminalIcon, Code, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CodePreview } from "@/components/docs/code-preview"
import { Terminal as TerminalComponent } from "@/components/ui/terminal"
import Link from "next/link"

function ProfileSetupTerminal() {
  const [completedProfile, setCompletedProfile] = useState<Record<string, string> | null>(null)

  return (
    <div className="space-y-3">
      {completedProfile && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-200">
          Saved profile: {completedProfile.name} - {completedProfile.role}
        </div>
      )}
      <TerminalComponent
        commands={{
          profile: {
            name: "profile",
            description: "Open a profile form",
            handler: (_args, context) => {
              context?.setState?.((prev: { formData: Record<string, string> }) => ({
                ...prev,
                formData: {},
                mode: "form",
                activeComponent: {
                  id: `profile-${Date.now()}`,
                  type: "form",
                  props: { fields: ["name", "role"] },
                  active: true,
                },
              }))
              context?.addLine?.("Profile form ready. Fill in name and role, then press Enter.", "success")
            },
          },
          save: {
            name: "save",
            description: "Save the latest profile values",
            handler: (_args, context) => {
              const formData = context?.state?.formData as Record<string, string> | undefined

              if (!formData?.name || !formData?.role) {
                context?.addLine?.("Run 'profile' and submit the form before saving.", "error")
                return
              }

              setCompletedProfile(formData)
              context?.addLine?.(`Saved profile for ${formData.name} (${formData.role}).`, "success")
            },
          },
        }}
        welcomeMessage={[
          "Profile Setup Demo",
          "Run 'profile' to open a real interactive form.",
          "After submitting, run 'save' to persist the values above.",
        ]}
        className="h-72"
      />
    </div>
  )
}

export default function QuickStartPage() {
  return (
    <div className="space-y-8">
       <div className="space-y-4">
         <h1 className="text-4xl font-bold tracking-tight">Quick Start</h1>
         <p className="text-xl text-muted-foreground">
           Build your first interactive terminal interface with the shadcn terminal component in just a few minutes.
         </p>
         <div className="bg-muted rounded-lg p-4">
           <p className="text-sm">
             <strong>Prerequisites:</strong> Add the OpenTUI registry to your components.json:
           </p>
           <code className="text-xs block mt-2">
{`"registries": [
  "https://opentui.vercel.app/registry/index.json"
]`}
           </code>
         </div>
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
        "Type 'help' to see available commands.",
      ]}
      className="h-64"
    />
  )
}`}
          preview={
            <TerminalComponent
              welcomeMessage={["Welcome to my application!", "Type 'help' to see available commands."]}
              className="h-64"
            />
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

const customCommands = {
  greet: {
    name: "greet",
    description: "Greet the user",
    handler: (args, context) => {
      const name = args[0] || "World"
      context?.addLine?.(\`Hello, \${name}! 👋\`, "success")
    },
  },
  time: {
    name: "time",
    description: "Show current time",
    handler: (_args, context) => {
      context?.addLine?.(\`Current time: \${new Date().toLocaleTimeString()}\`, "output")
    },
  },
}

export default function CustomTerminal() {
  return (
    <Terminal
      commands={customCommands}
      welcomeMessage={[
        "Try: greet [name]",
        "Try: time",
      ]}
      className="h-64"
    />
  )
}`}
          preview={
            <TerminalComponent
              commands={{
                greet: {
                  name: "greet",
                  description: "Greet the user",
                  handler: (args, context) => {
                    const name = args[0] || "World"
                    context?.addLine?.(`Hello, ${name}!`, "success")
                  },
                },
                time: {
                  name: "time",
                  description: "Show current time",
                  handler: (_, context) => {
                    context?.addLine?.(`Current time: ${new Date().toLocaleTimeString()}`, "output")
                  },
                },
              }}
              welcomeMessage={["Try: greet [name]", "Try: time"]}
              className="h-64"
            />
          }
        />
      </div>

      {/* User Input Example */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Handling User Input</h2>

        <CodePreview
          title="Terminal-Driven Form"
          description="Open a real form inside the terminal and persist the submitted data"
          code={`import { useState } from "react"
 import { Terminal } from "@/components/ui/terminal"

 export default function ProfileSetupTerminal() {
   const [completedProfile, setCompletedProfile] = useState(null)

   return (
     <Terminal
       commands={{
         profile: {
           name: "profile",
           description: "Open a profile form",
           handler: (_args, context) => {
              context?.setState?.((prev) => ({
                ...prev,
                formData: {},
                mode: "form",
                activeComponent: {
                  id: \`profile-\${Date.now()}\`,
                 type: "form",
                 props: { fields: ["name", "role"] },
                 active: true,
               },
             }))
             context?.addLine?.("Profile form ready. Fill in name and role, then press Enter.", "success")
           },
         },
         save: {
           name: "save",
           description: "Save the latest profile values",
           handler: (_args, context) => {
             const formData = context?.state?.formData
             if (!formData?.name || !formData?.role) {
               context?.addLine?.("Run 'profile' and submit the form before saving.", "error")
               return
             }

              setCompletedProfile(formData)
              context?.addLine?.(\`Saved profile for \${formData.name} (\${formData.role}).\`, "success")
            },
          },
        }}
       welcomeMessage={[
         "Profile Setup Demo",
         "Run 'profile' to open a real interactive form.",
         "After submitting, run 'save' to persist the values above.",
       ]}
       className="h-72"
     />
   )
 }`}
          preview={<ProfileSetupTerminal />}
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

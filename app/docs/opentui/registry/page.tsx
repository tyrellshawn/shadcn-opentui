"use client"

import { Terminal } from "@/registry/new-york/terminal/terminal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegistryPage() {
  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">OpenTUI Registry</h1>
        <p className="text-muted-foreground text-lg">
          The OpenTUI registry provides a collection of terminal-based UI components that can be installed directly into your project using the shadcn CLI.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Installation</CardTitle>
            <CardDescription>
              Install components directly from the OpenTUI registry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Terminal
              variant="compact"
              welcomeMessage={[
                "# Install the shadcn CLI",
                "npm install -g shadcn@canary",
                "",
                "# Add a component from the registry",
                "shadcn add terminal --from=https://opentui.vercel.app/r/terminal.json"
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Components</CardTitle>
            <CardDescription>
              Components available in the OpenTUI registry
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Terminal</h3>
              <p className="text-sm text-muted-foreground">
                A terminal component with command history, input handling, and customizable styling.
              </p>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                shadcn add terminal --from=https://opentui.vercel.app/r/terminal.json
              </code>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Terminal Controls</h3>
              <p className="text-sm text-muted-foreground">
                Control panel for terminal settings with sliders and buttons.
              </p>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                shadcn add terminal-controls --from=https://opentui.vercel.app/r/terminal-controls.json
              </code>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Terminal Slider</h3>
              <p className="text-sm text-muted-foreground">
                A slider component with ASCII visualization for terminal interfaces.
              </p>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                shadcn add terminal-slider --from=https://opentui.vercel.app/r/terminal-slider.json
              </code>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Terminal Block</h3>
              <p className="text-sm text-muted-foreground">
                A complete terminal interface with controls and sliders.
              </p>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                shadcn add terminal-block --from=https://opentui.vercel.app/r/terminal-block.json
              </code>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Usage Example</h2>
        <p className="text-muted-foreground">
          After installing components from the registry, you can import and use them in your project:
        </p>
        
        <pre className="p-4 rounded-lg bg-muted overflow-x-auto">
          <code className="text-sm">
{`import { Terminal } from "@/components/ui/terminal"
import { TerminalControls } from "@/components/ui/terminal-controls"

export default function TerminalDemo() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-3">
        <Terminal 
          prompt="user@opentui:~$" 
          welcomeMessage={["Welcome to OpenTUI", "Type 'help' for available commands"]} 
        />
      </div>
      <div className="col-span-1">
        <TerminalControls />
      </div>
    </div>
  )
}`}
          </code>
        </pre>
      </div>
    </div>
  )
}
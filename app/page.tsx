"use client"

import { Terminal, type TerminalCommand } from "@/components/ui/terminal"
import { Command } from "@/components/command"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Github, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function Home() {
  const customCommands: TerminalCommand[] = [
    {
      name: "echo",
      description: "Echo text to output",
      handler: (args) => {
        addOutput(args.join(" "))
      },
    },
    {
      name: "whoami",
      description: "Display current user",
      handler: () => {
        addOutput("developer", "success")
      },
    },
    {
      name: "pwd",
      description: "Print working directory",
      handler: () => {
        addOutput("/home/developer/opentui-terminal", "success")
      },
    },
    {
      name: "ls",
      description: "List directory contents",
      handler: (args) => {
        if (args.includes("-la")) {
          addOutput("total 8")
          addOutput("drwxr-xr-x  5 developer developer  160 Dec 31 12:00 .")
          addOutput("drwxr-xr-x  3 developer developer   96 Dec 31 11:00 ..")
          addOutput("drwxr-xr-x  3 developer developer   96 Dec 31 12:00 components")
          addOutput("drwxr-xr-x  2 developer developer   64 Dec 31 12:00 app")
          addOutput("-rw-r--r--  1 developer developer  512 Dec 31 12:00 package.json")
          addOutput("-rw-r--r--  1 developer developer 1024 Dec 31 12:00 README.md")
        } else {
          addOutput("components/  app/  lib/  package.json  README.md  node_modules/", "success")
        }
      },
    },
    {
      name: "cat",
      description: "Display file contents",
      handler: (args) => {
        if (args[0] === "package.json") {
          addOutput(
            '{\n  "name": "opentui-terminal-component",\n  "version": "1.0.0",\n  "description": "OpenTUI terminal component with React",\n  "dependencies": {\n    "@opentui/react": "github:sst/opentui#main",\n    "react": "^18.0.0",\n    "typescript": "^5.0.0"\n  }\n}',
            "success",
          )
        } else if (args[0] === "README.md") {
          addOutput(
            "# OpenTUI Terminal Component\n\nA powerful terminal interface built with OpenTUI and React.\n\n## Features\n- Command history\n- Tab completion\n- Custom commands\n- Async support",
            "success",
          )
        } else {
          addOutput(`cat: ${args[0] || "filename"}: No such file or directory`, "error")
        }
      },
    },
    {
      name: "npm",
      description: "Node package manager",
      handler: async (args) => {
        if (args[0] === "install") {
          addOutput("📦 Installing OpenTUI dependencies...")
          await new Promise((resolve) => setTimeout(resolve, 1500))
          addOutput("✅ @opentui/react@latest installed", "success")
          addOutput("✅ @opentui/core@latest installed", "success")
          addOutput("🎉 Installation complete!", "success")
        } else if (args[0] === "run" && args[1] === "dev") {
          addOutput("🚀 Starting development server...")
          await new Promise((resolve) => setTimeout(resolve, 1000))
          addOutput("✅ Server running on http://localhost:3000", "success")
        } else {
          addOutput(`npm: unknown command '${args.join(" ")}'`, "error")
        }
      },
    },
    {
      name: "git",
      description: "Git version control",
      handler: (args) => {
        if (args[0] === "status") {
          addOutput("On branch main", "success")
          addOutput("Your branch is up to date with 'origin/main'.")
          addOutput("nothing to commit, working tree clean")
        } else if (args[0] === "log" && args[1] === "--oneline") {
          addOutput("a1b2c3d feat: integrate OpenTUI React components", "success")
          addOutput("d4e5f6g docs: update README with OpenTUI usage")
          addOutput("g7h8i9j initial: setup terminal component")
        } else if (args[0] === "branch") {
          addOutput("* main", "success")
          addOutput("  feature/opentui-integration")
        } else {
          addOutput(`git: '${args.join(" ")}' is not a git command.`, "error")
        }
      },
    },
  ]

  const [terminalLines, setTerminalLines] = useState<string[]>([])

  const addOutput = (content: string, type: "output" | "error" | "success" = "output") => {
    setTerminalLines((prev) => [...prev, content])
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Shadcn OpenTUI</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A powerful, customizable terminal interface built with OpenTUI React and shadcn/ui. Features command
            history, tab completion, and extensible command system.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Powered by</span>
            <code className="bg-muted px-2 py-1 rounded font-mono">@opentui/react</code>
            <span>•</span>
            <code className="bg-muted px-2 py-1 rounded font-mono">shadcn/ui</code>
          </div>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button asChild>
              <Link href="/docs">
                <BookOpen className="mr-2 h-4 w-4" />
                View Documentation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="https://github.com/sst/opentui" target="_blank">
                <Github className="mr-2 h-4 w-4" />
                GitHub
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Default Terminal</h3>
            <Terminal
              prompt="default@demo:~$"
              commands={customCommands.slice(0, 3)}
              welcomeMessage={["Default terminal variant", "Try: echo, whoami, pwd"]}
              variant="default"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Compact Terminal</h3>
            <Terminal
              prompt="compact@demo:~$"
              commands={customCommands.slice(0, 3)}
              welcomeMessage={["Compact variant", "Smaller size"]}
              variant="compact"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Minimal Terminal</h3>
            <Terminal
              prompt="minimal@demo:~$"
              commands={customCommands.slice(0, 3)}
              welcomeMessage={["Minimal variant"]}
              variant="minimal"
            />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Features</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Built with OpenTUI React reconciler</li>
                <li>• Command history with arrow key navigation</li>
                <li>• Enhanced tab completion with suggestions</li>
                <li>• Custom command handling with async support</li>
                <li>• Multiple terminal variants (default, compact, minimal)</li>
                <li>• TypeScript support with full type safety</li>
                <li>• Error handling and output formatting</li>
                <li>• Scrollable output with auto-scroll</li>
                <li>• Keyboard shortcuts (Ctrl+L to clear)</li>
                <li>• Customizable prompts and welcome messages</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-medium">Built-in Commands</h3>
              <div className="grid gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Command>help</Command>
                  <span className="text-muted-foreground">Show available commands</span>
                </div>
                <div className="flex items-center gap-2">
                  <Command>clear</Command>
                  <span className="text-muted-foreground">Clear terminal output</span>
                </div>
                <div className="flex items-center gap-2">
                  <Command>history</Command>
                  <span className="text-muted-foreground">Show command history</span>
                </div>
                <div className="flex items-center gap-2">
                  <Command>date</Command>
                  <span className="text-muted-foreground">Show current date/time</span>
                </div>
                <div className="flex items-center gap-2">
                  <Command>opentui</Command>
                  <span className="text-muted-foreground">Show OpenTUI information</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-medium">Demo Commands</h3>
              <div className="grid gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Command variant="success">echo Hello OpenTUI!</Command>
                  <span className="text-muted-foreground">Echo text</span>
                </div>
                <div className="flex items-center gap-2">
                  <Command variant="success">ls -la</Command>
                  <span className="text-muted-foreground">List files (detailed)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Command variant="success">cat package.json</Command>
                  <span className="text-muted-foreground">Show file contents</span>
                </div>
                <div className="flex items-center gap-2">
                  <Command variant="success">npm install</Command>
                  <span className="text-muted-foreground">Install packages (async)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Command variant="success">git status</Command>
                  <span className="text-muted-foreground">Git repository status</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Full-Featured Terminal</h2>
            <Terminal
              prompt="opentui@demo:~$"
              commands={customCommands}
              welcomeMessage={[
                "🚀 Welcome to OpenTUI Terminal Component!",
                "Built with @opentui/react for enhanced terminal experiences.",
                "",
                "Try these commands:",
                "• help - Show all available commands",
                "• echo Hello World - Echo text",
                "• ls -la - List files with details",
                "• npm install - Simulate package installation",
                "• git status - Show git repository status",
                "",
                "Use ↑/↓ for history, Tab for completion, Ctrl+L to clear",
              ]}
              showTimestamp={false}
              maxLines={500}
              className="h-[600px]"
            />
          </div>
        </div>

        <div className="bg-muted p-6 rounded-lg space-y-6">
          <h3 className="text-xl font-semibold">Installation & Usage</h3>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Install Dependencies</h4>
                <pre className="text-sm overflow-x-auto bg-background p-3 rounded border">
                  <code>{`npm install @opentui/react @opentui/core
# or from GitHub (latest)
npm install github:sst/opentui#main`}</code>
                </pre>
              </div>

              <div>
                <h4 className="font-medium mb-2">Add shadcn/ui Terminal</h4>
                <pre className="text-sm overflow-x-auto bg-background p-3 rounded border">
                  <code>{`# Install the latest shadcn CLI and initialize
bunx shadcn@latest init

# Add the @shadcn-opentui registry to your components.json
# Add this to your components.json:
# "registries": {
#   "@shadcn-opentui": "https://opentui.vercel.app/r/{name}.json"
# }

# Add components from the @shadcn-opentui registry
bunx shadcn@latest add @shadcn-opentui/terminal
bunx shadcn@latest add @shadcn-opentui/terminal-controls
bunx shadcn@latest add @shadcn-opentui/terminal-slider
bunx shadcn@latest add @shadcn-opentui/terminal-block`}</code>
                </pre>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Basic Usage</h4>
                <pre className="text-sm overflow-x-auto bg-background p-3 rounded border">
                  <code>{`import { Terminal } from '@/components/ui/terminal'

export default function MyApp() {
  const customCommands = [
    {
      name: "hello",
      description: "Say hello",
      handler: () => console.log("Hello!")
    }
  ]

  return (
    <Terminal
      prompt="user@opentui:~$"
      commands={customCommands}
      variant="default"
    />
  )
}`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

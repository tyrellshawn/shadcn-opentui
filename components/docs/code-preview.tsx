"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Terminal } from "@/components/ui/terminal"
import { Copy, Code, Eye } from "lucide-react"
import { toast } from "sonner"

interface CodePreviewProps {
  title: string
  description: string
  code: string
  preview?: React.ReactNode
  language?: string
  showLineNumbers?: boolean
  component?: React.ComponentType<any>
  componentProps?: Record<string, any>
}

export function CodePreview({
  title,
  description,
  code,
  preview,
  language = "tsx",
  showLineNumbers = true,
  component: Component,
  componentProps,
}: CodePreviewProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview")
  const hasPreview = Boolean(preview || Component)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      toast.success("Code copied to clipboard!")
    } catch (err) {
      toast.error("Failed to copy code")
    }
  }

  const formatCode = (code: string) => {
    if (!code) return null
    return code.split("\n").map((line, index) => (
      <div key={index} className="flex">
        {showLineNumbers && (
          <span className="text-muted-foreground text-xs mr-4 select-none w-8 text-right">{index + 1}</span>
        )}
        <span className="flex-1">{line}</span>
      </div>
    ))
  }

  const renderPreview = () => {
    if (Component) {
      return <Component {...componentProps} />
    }
    return preview
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{language}</Badge>
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {hasPreview && (
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Code
              </TabsTrigger>
            </TabsList>
          )}

          {hasPreview && (
            <TabsContent value="preview" className="mt-4">
              <div className="not-prose relative bg-background border rounded-lg p-4">
                {renderPreview()}
              </div>
            </TabsContent>
          )}

          <TabsContent value="code" className="mt-4">
            <div className="bg-muted rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm font-mono">
                <code className="language-tsx">{formatCode(code)}</code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Terminal Example Components
function BasicTerminal() {
  return (
    <Terminal
      welcomeMessage={[
        "Welcome to OpenTUI Terminal",
        "Type 'help' for available commands"
      ]}
      className="h-64"
    />
  )
}

function CustomCommandsTerminal() {
  const customCommands = [
    {
      name: "greet",
      description: "Greet the user",
      handler: (args: string[]) => {
        const name = args[0] || "World"
        return `Hello, ${name}!`
      },
    },
    {
      name: "time",
      description: "Show current time",
      handler: () => {
        return new Date().toLocaleTimeString()
      },
    },
  ]

  return (
    <Terminal
      commands={customCommands}
      welcomeMessage={[
        "Terminal with custom commands",
        "Try: greet John, time"
      ]}
      className="h-64"
    />
  )
}

function TerminalVariants() {
  return (
    <div className="space-y-4">
      <Terminal
        variant="default"
        welcomeMessage={["Default terminal"]}
        className="h-32"
      />
      <Terminal
        variant="compact"
        welcomeMessage={["Compact terminal"]}
        className="h-24"
      />
      <Terminal
        variant="minimal"
        welcomeMessage={["Minimal terminal"]}
        className="h-20"
      />
    </div>
  )
}

function TypeDemo() {
  return (
    <Terminal
      commands={[
        {
          name: "greet",
          description: "Greet the user",
          handler: (args: string[]) => {
            const name = args[0] || "World"
            return `Hello, ${name}!`
          },
        },
        {
          name: "help",
          description: "Show available commands",
          handler: () => "Available commands: greet [name], help",
        }
      ]}
      welcomeMessage={[
        "Try these commands:",
        "greet - Greet with optional name",
        "help - Show available commands"
      ]}
      className="h-48"
    />
  )
}

// Predefined code examples
export const codeExamples = {
  basicTerminal: {
    title: "Basic Terminal",
    description: "Simple terminal with welcome message",
    code: `export function BasicTerminal() {
  return (
    <Terminal
      welcomeMessage={[
        "Welcome to OpenTUI Terminal",
        "Type 'help' for available commands"
      ]}
      className="h-64"
    />
  )
}`,
    component: BasicTerminal
  },

  customCommands: {
    title: "Custom Commands",
    description: "Terminal with custom command handlers",
    code: `export function CustomCommandsTerminal() {
  const customCommands = [
    {
      name: "greet",
      description: "Greet the user",
      handler: (args: string[]) => {
        const name = args[0] || "World"
        return \`Hello, \${name}!\`
      },
    },
    {
      name: "time",
      description: "Show current time",
      handler: () => {
        return new Date().toLocaleTimeString()
      },
    },
  ]

  return (
    <Terminal
      commands={customCommands}
      welcomeMessage={[
        "Terminal with custom commands",
        "Try: greet John, time"
      ]}
      className="h-64"
    />
  )
}`,
    component: CustomCommandsTerminal
  },

  variants: {
    title: "Terminal Variants",
    description: "Different terminal styles and sizes",
    code: `export function TerminalVariants() {
  return (
    <div className="space-y-4">
      <Terminal
        variant="default"
        welcomeMessage={["Default terminal"]}
        className="h-32"
      />
      <Terminal
        variant="compact"
        welcomeMessage={["Compact terminal"]}
        className="h-24"
      />
      <Terminal
        variant="minimal"
        welcomeMessage={["Minimal terminal"]}
        className="h-20"
      />
    </div>
  )
}`,
    component: TerminalVariants
  },

  terminalCommandType: {
    title: "TerminalCommand Type",
    description: "TypeScript interface for defining custom commands",
    language: "typescript",
    code: `interface TerminalCommand {
  name: string                    // Command name (e.g., "help")
  description: string             // Help text description
  handler: (args: string[]) => Promise<void> | void | string
}

// Example usage
const customCommands: TerminalCommand[] = [
  {
    name: "greet",
    description: "Greet the user",
    handler: (args) => {
      const name = args[0] || "World"
      return \`Hello, \${name}!\`
    },
  },
]`,
    component: TypeDemo
  },
}

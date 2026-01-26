"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Terminal } from "@/components/ui/terminal"
import { Copy, Code, Eye, Check } from "lucide-react"
import { toast } from "sonner"
import { SyntaxHighlighter } from "./syntax-highlighter"

interface CodePreviewProps {
  title: string
  description: string
  code: string
  preview?: React.ReactNode
  language?: string
  showLineNumbers?: boolean
  highlightLines?: number[]
}

export function CodePreview({
  title,
  description,
  code,
  preview,
  language = "tsx",
  showLineNumbers = true,
  highlightLines = [],
}: CodePreviewProps) {
  const [activeTab, setActiveTab] = useState(preview ? "preview" : "code")
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success("Code copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error("Failed to copy code")
    }
  }

  return (
    <Card className="overflow-hidden border-emerald-500/20 bg-black/40">
      <CardHeader className="border-b border-emerald-500/10 pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-white">
              <Code className="h-5 w-5 text-emerald-400" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              {language}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="border-emerald-500/20 hover:bg-emerald-500/10 hover:text-emerald-400 bg-transparent"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {preview && (
            <TabsList className="grid w-full grid-cols-2 rounded-none border-b border-emerald-500/10 bg-transparent h-auto p-0">
              <TabsTrigger
                value="preview"
                className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent data-[state=active]:text-emerald-400 py-3"
              >
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger
                value="code"
                className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent data-[state=active]:text-emerald-400 py-3"
              >
                <Code className="h-4 w-4" />
                Code
              </TabsTrigger>
            </TabsList>
          )}

          {preview && (
            <TabsContent value="preview" className="mt-0 p-4">
              <div className="rounded-lg border border-emerald-500/10 bg-background/50 p-4">{preview}</div>
            </TabsContent>
          )}

          <TabsContent value="code" className="mt-0">
            <div className="bg-black/60 p-4 overflow-x-auto max-h-[500px] overflow-y-auto terminal-scrollbar">
              <SyntaxHighlighter
                code={code}
                language={language}
                showLineNumbers={showLineNumbers}
                highlightLines={highlightLines}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Predefined code examples
export const codeExamples = {
  basicTerminal: {
    title: "Basic Terminal",
    description: "Simple terminal with welcome message",
    code: `import { Terminal } from "@/components/ui/terminal"

export function BasicTerminal() {
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
    preview: (
      <Terminal
        welcomeMessage={["Welcome to OpenTUI Terminal", "Type 'help' for available commands"]}
        className="h-64"
      />
    ),
  },

  customCommands: {
    title: "Custom Commands",
    description: "Terminal with custom command handlers",
    code: `import { Terminal, type TerminalCommand } from "@/components/ui/terminal"

const customCommands: TerminalCommand[] = [
  {
    name: "greet",
    description: "Greet the user",
    handler: (args) => {
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

export function CustomCommandsTerminal() {
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
    preview: (
      <Terminal
        commands={[
          {
            name: "greet",
            description: "Greet the user",
            handler: (args) => {
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
        ]}
        welcomeMessage={["Terminal with custom commands", "Try: greet John, time"]}
        className="h-64"
      />
    ),
  },

  variants: {
    title: "Terminal Variants",
    description: "Different terminal styles and sizes",
    code: `import { Terminal } from "@/components/ui/terminal"

export function TerminalVariants() {
  return (
    <div className="space-y-4">
      {/* Default variant */}
      <Terminal
        variant="default"
        welcomeMessage={["Default terminal"]}
        className="h-48"
      />
      
      {/* Compact variant */}
      <Terminal
        variant="compact"
        welcomeMessage={["Compact terminal"]}
        className="h-32"
      />
      
      {/* Minimal variant */}
      <Terminal
        variant="minimal"
        welcomeMessage={["Minimal terminal"]}
        className="h-24"
      />
    </div>
  )
}`,
    preview: (
      <div className="space-y-4">
        <Terminal variant="default" welcomeMessage={["Default terminal"]} className="h-32" />
        <Terminal variant="compact" welcomeMessage={["Compact terminal"]} className="h-24" />
        <Terminal variant="minimal" welcomeMessage={["Minimal terminal"]} className="h-20" />
      </div>
    ),
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
    preview: (
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
          },
        ]}
        welcomeMessage={["Try these commands:", "greet - Greet with optional name", "help - Show available commands"]}
        className="h-48"
      />
    ),
  },
}

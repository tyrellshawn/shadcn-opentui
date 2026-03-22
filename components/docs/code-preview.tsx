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

type CodePreviewBackend = "opentui" | "cmdk"

const DEFAULT_BACKENDS: CodePreviewBackend[] = ["opentui"]

const BACKEND_LABELS: Record<CodePreviewBackend, string> = {
  opentui: "OpenTUI",
  cmdk: "cmdk",
}

function buildMissingBackendCode(backend: CodePreviewBackend) {
  return `// ${BACKEND_LABELS[backend]} example not provided yet.
// Add ${backend === "cmdk" ? "codeByBackend.cmdk" : `codeByBackend.${backend}`} to this CodePreview
// so the preview and code stay aligned.`
}

function MissingBackendPreview({ backend }: { backend: CodePreviewBackend }) {
  return (
    <div className="rounded-lg border border-dashed border-emerald-500/20 bg-black/40 p-4 text-sm text-muted-foreground">
      <p className="font-medium text-white">{BACKEND_LABELS[backend]} preview not provided yet.</p>
      <p className="mt-2">Add a backend-specific preview so the rendered example matches the selected code.</p>
    </div>
  )
}

function BasicTerminalPreview() {
  return (
    <Terminal
      welcomeMessage={[
        "Welcome to OpenTUI Terminal",
        "Type 'help' for available commands",
      ]}
      className="h-64"
    />
  )
}

function CustomCommandsPreview() {
  return (
    <Terminal
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
          handler: (_args, context) => {
            context?.addLine?.(`Current time: ${new Date().toLocaleTimeString()}`, "output")
          },
        },
      }}
      welcomeMessage={[
        "Terminal with custom commands",
        "Try: greet Alex",
        "Try: time",
      ]}
      className="h-64"
    />
  )
}

function TerminalVariantsPreview() {
  return (
    <div className="space-y-4">
      <Terminal variant="default" welcomeMessage={["Default terminal"]} className="h-32" />
      <Terminal variant="compact" welcomeMessage={["Compact terminal"]} className="h-24" />
      <Terminal variant="minimal" welcomeMessage={["Minimal terminal"]} className="h-20" />
    </div>
  )
}

function TerminalCommandTypePreview() {
  return (
    <Terminal
      commands={{
        greet: {
          name: "greet",
          description: "Greet the user",
          handler: (args, context) => {
            const name = args[0] || "World"
            context?.addLine?.(`Hello, ${name}!`, "success")
          },
        },
        helpme: {
          name: "helpme",
          description: "Show custom command help",
          handler: (_args, context) => {
            context?.addLine?.("Custom commands: greet [name], helpme", "output")
          },
        },
      }}
      welcomeMessage={[
        "Try these commands:",
        "greet - Greet with an optional name",
        "helpme - Show custom help",
      ]}
      className="h-48"
    />
  )
}

interface CodePreviewProps {
  title: string
  description: string
  code: string
  preview?: React.ReactNode
  language?: string
  showLineNumbers?: boolean
  highlightLines?: number[]
  backendOptions?: CodePreviewBackend[]
  codeByBackend?: Partial<Record<CodePreviewBackend, string>>
  previewByBackend?: Partial<Record<CodePreviewBackend, React.ReactNode>>
}

export function CodePreview({
  title,
  description,
  code,
  preview,
  language = "tsx",
  showLineNumbers = true,
  highlightLines = [],
  backendOptions,
  codeByBackend,
  previewByBackend,
}: CodePreviewProps) {
  const providedBackends = ["opentui", "cmdk"].filter(
    (backend) => codeByBackend?.[backend as CodePreviewBackend] || previewByBackend?.[backend as CodePreviewBackend],
  ) as CodePreviewBackend[]

  const availableBackends = backendOptions ?? (providedBackends.length > 0 ? providedBackends : DEFAULT_BACKENDS)

  const normalizedBackends = availableBackends.length > 0 ? availableBackends : DEFAULT_BACKENDS
  const showBackendPicker = normalizedBackends.length > 1
  const [activeTab, setActiveTab] = useState(preview ? "preview" : "code")
  const [activeBackend, setActiveBackend] = useState<CodePreviewBackend>(
    normalizedBackends.includes("opentui") ? "opentui" : normalizedBackends[0],
  )
  const [copied, setCopied] = useState(false)

  const resolvedCode =
    codeByBackend?.[activeBackend] ??
    (activeBackend === "opentui" ? code : undefined) ??
    buildMissingBackendCode(activeBackend)
  const resolvedPreview =
    previewByBackend?.[activeBackend] ??
    (activeBackend === "opentui" ? preview : undefined) ??
    <MissingBackendPreview backend={activeBackend} />

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(resolvedCode)
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
            {showBackendPicker && (
              <div className="flex items-center gap-1 rounded-md border border-emerald-500/20 bg-black/50 p-1">
                {normalizedBackends.map((backend) => (
                  <Button
                    key={backend}
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveBackend(backend)}
                    className={
                      activeBackend === backend
                        ? "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/20 hover:text-emerald-200"
                        : "text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-300"
                    }
                  >
                    {BACKEND_LABELS[backend]}
                  </Button>
                ))}
              </div>
            )}
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
          {resolvedPreview && (
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

          {resolvedPreview && (
            <TabsContent value="preview" className="mt-0 p-4">
              <div className="rounded-lg border border-emerald-500/10 bg-background/50 p-4">{resolvedPreview}</div>
            </TabsContent>
          )}

          <TabsContent value="code" className="mt-0">
            <div className="bg-black/60 p-4 overflow-x-auto max-h-[500px] overflow-y-auto terminal-scrollbar">
              <SyntaxHighlighter
                code={resolvedCode}
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
        "Type 'help' for available commands",
      ]}
      className="h-64"
    />
  )
}`,
    preview: <BasicTerminalPreview />,
  },

  customCommands: {
    title: "Custom Commands",
    description: "Terminal with custom command handlers",
    code: `import { Terminal } from "@/components/ui/terminal"

const customCommands = {
  greet: {
    name: "greet",
    description: "Greet the user",
    handler: (args, context) => {
      const name = args[0] || "World"
      context?.addLine?.(\`Hello, \${name}!\`, "success")
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

export function CustomCommandsTerminal() {
  return (
    <Terminal
      commands={customCommands}
      welcomeMessage={[
        "Terminal with custom commands",
        "Try: greet Alex",
        "Try: time",
      ]}
      className="h-64"
    />
  )
}`,
    preview: <CustomCommandsPreview />,
  },

  variants: {
    title: "Terminal Variants",
    description: "Different terminal styles and sizes",
    code: `import { Terminal } from "@/components/ui/terminal"

export function TerminalVariants() {
  return (
    <div className="space-y-4">
      <Terminal
        variant="default"
        welcomeMessage={["Default terminal"]}
        className="h-48"
      />
      <Terminal
        variant="compact"
        welcomeMessage={["Compact terminal"]}
        className="h-32"
      />
      <Terminal
        variant="minimal"
        welcomeMessage={["Minimal terminal"]}
        className="h-24"
      />
    </div>
  )
}`,
    preview: <TerminalVariantsPreview />,
  },

  terminalCommandType: {
    title: "TerminalCommand Type",
    description: "TypeScript interface for defining custom commands",
    language: "typescript",
    code: `import type { CommandHandler } from "@/lib/types"

interface TerminalCommand extends CommandHandler {
  name: string                    // Command name (e.g., "help")
  description: string             // Help text description
  handler: (args: string[], context?: any) => Promise<void> | void
}

const customCommands: Record<string, TerminalCommand> = {
  greet: {
    name: "greet",
    description: "Greet the user",
    handler: (args, context) => {
      const name = args[0] || "World"
      context?.addLine?.(\`Hello, \${name}!\`, "success")
    },
  },
}`,
    preview: <TerminalCommandTypePreview />,
  },
}

"use client"

import { Code2, FileText, ImageIcon, LogIn, Menu, Monitor, SlidersHorizontal, Timer } from "lucide-react"
import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Terminal } from "@/components/ui/terminal"
import type { CommandHandler } from "@/lib/types"

type Example = {
  value: string
  label: string
  title: string
  description: string
  status: string
  icon: React.ElementType
  welcomeMessage: string[]
  commands: Record<string, CommandHandler>
}

const examples: Example[] = [
  {
    value: "login",
    label: "Login",
    title: "Login Form Example",
    description: "Interactive login simulation. Try: login admin secret",
    status: "idle",
    icon: LogIn,
    welcomeMessage: ["Login Terminal Demo", "Try: login admin secret", "Type 'help' for all commands"],
    commands: {
      login: {
        name: "login",
        description: "Validate a username and password",
        handler: (args, context) => {
          const [username, password] = args
          if (username === "admin" && password === "secret") {
            context?.addLine?.("Authentication successful", "success")
            context?.addLine?.("Welcome back, admin.", "output")
            return
          }

          context?.addLine?.("Invalid credentials. Try: login admin secret", "error")
        },
      },
    },
  },
  {
    value: "menu",
    label: "Menu",
    title: "Interactive Menu Example",
    description: "Open a keyboard-driven menu. Try: menu",
    status: "ready",
    icon: Menu,
    welcomeMessage: ["Menu Terminal Demo", "Try: menu", "Use arrow keys after opening the menu"],
    commands: {
      menu: {
        name: "menu",
        description: "Open an interactive menu",
        handler: (_args, context) => {
          context?.setState?.((prev: { menuSelection: number }) => ({
            ...prev,
            mode: "ui",
            menuSelection: 0,
            activeComponent: {
              id: `menu-${Date.now()}`,
              type: "menu",
              props: { items: ["Dashboard", "Projects", "Deployments", "Settings"] },
              active: true,
            },
          }))
        },
      },
    },
  },
  {
    value: "ascii",
    label: "ASCII",
    title: "ASCII Art Example",
    description: "Generate terminal banners. Try: ascii opentui",
    status: "creative",
    icon: ImageIcon,
    welcomeMessage: ["ASCII Terminal Demo", "Try: ascii opentui", "Try: box launch"],
    commands: {
      ascii: {
        name: "ascii",
        description: "Generate a simple banner",
        handler: (args, context) => {
          const label = (args.join(" ") || "OpenTUI").toUpperCase().slice(0, 18)
          context?.addLine?.("+--------------------+", "success")
          context?.addLine?.(`| ${label.padEnd(18, " ")} |`, "success")
          context?.addLine?.("+--------------------+", "success")
        },
      },
      box: {
        name: "box",
        description: "Draw a boxed label",
        handler: (args, context) => {
          const label = args.join(" ") || "launch"
          context?.addLine?.(`[ ${label} ]`, "success")
        },
      },
    },
  },
  {
    value: "counter",
    label: "Counter",
    title: "Counter Example",
    description: "Increment and reset a counter. Try: inc",
    status: "0",
    icon: Timer,
    welcomeMessage: ["Counter Terminal Demo", "Try: inc", "Try: reset"],
    commands: {
      inc: {
        name: "inc",
        description: "Increment a demo counter",
        handler: (_args, context) => {
          const count = Number(context?.state?.formData?.count ?? 0) + 1
          context?.setState?.((prev: { formData: Record<string, string> }) => ({
            ...prev,
            formData: { ...prev.formData, count: String(count) },
          }))
          context?.addLine?.(`Counter: ${count}`, "success")
        },
      },
      reset: {
        name: "reset",
        description: "Reset the demo counter",
        handler: (_args, context) => {
          context?.setState?.((prev: { formData: Record<string, string> }) => ({ ...prev, formData: { ...prev.formData, count: "0" } }))
          context?.addLine?.("Counter reset to 0", "success")
        },
      },
    },
  },
  {
    value: "monitor",
    label: "Monitor",
    title: "System Monitor Example",
    description: "Render a compact system dashboard. Try: status",
    status: "live",
    icon: Monitor,
    welcomeMessage: ["Monitor Terminal Demo", "Try: status", "Try: deploy"],
    commands: {
      status: {
        name: "status",
        description: "Show system status",
        handler: (_args, context) => {
          context?.addLine?.("System status", "success")
          context?.addLine?.("CPU    [####......] 42%")
          context?.addLine?.("Memory [######....] 61%")
          context?.addLine?.("Network 842 Mbps")
        },
      },
      deploy: {
        name: "deploy",
        description: "Animate deployment progress",
        handler: async (_args, context) => {
          context?.addLine?.("Deploying preview...", "success")
          context?.addLine?.("Deploy [..........] 0%")
          for (let step = 1; step <= 10; step += 1) {
            context?.updateLastLine?.(`Deploy [${"#".repeat(step)}${".".repeat(10 - step)}] ${step * 10}%`)
            await new Promise((resolve) => setTimeout(resolve, 120))
          }
          context?.addLine?.("Deploy complete", "success")
        },
      },
    },
  },
  {
    value: "files",
    label: "Files",
    title: "File Browser Example",
    description: "Explore a terminal-style file list. Try: ls",
    status: "4 files",
    icon: FileText,
    welcomeMessage: ["Files Terminal Demo", "Try: ls", "Try: open package.json"],
    commands: {
      ls: {
        name: "ls",
        description: "List demo files",
        handler: (_args, context) => {
          context?.addLine?.("demo/", "success")
          context?.addLine?.("  package.json")
          context?.addLine?.("  components.json")
          context?.addLine?.("  app/docs/page.tsx")
          context?.addLine?.("  components/ui/terminal.tsx")
        },
      },
      open: {
        name: "open",
        description: "Open a demo file",
        handler: (args, context) => {
          const file = args.join(" ") || "package.json"
          context?.addLine?.(`Opened ${file}`, "success")
          context?.addLine?.("Read-only preview loaded inside the terminal.")
        },
      },
    },
  },
  {
    value: "controls",
    label: "Controls",
    title: "Terminal Controls Example",
    description: "Drive control-like state through commands. Try: volume 75",
    status: "50%",
    icon: SlidersHorizontal,
    welcomeMessage: ["Controls Terminal Demo", "Try: volume 75", "Try: theme dark"],
    commands: {
      volume: {
        name: "volume",
        description: "Set a demo volume percentage",
        handler: (args, context) => {
          const value = Math.max(0, Math.min(100, Number(args[0]) || 50))
          const filled = Math.round(value / 10)
          context?.addLine?.(`Volume [${"#".repeat(filled)}${".".repeat(10 - filled)}] ${value}%`, "success")
        },
      },
      theme: {
        name: "theme",
        description: "Switch a named theme",
        handler: (args, context) => {
          context?.addLine?.(`Theme set to ${args[0] || "dark"}`, "success")
        },
      },
    },
  },
  {
    value: "devtools",
    label: "DevTools",
    title: "DevTools Example",
    description: "Inspect commands and debug output. Try: inspect",
    status: "debug",
    icon: Code2,
    welcomeMessage: ["DevTools Terminal Demo", "Try: inspect", "Try: logs"],
    commands: {
      inspect: {
        name: "inspect",
        description: "Inspect the terminal runtime state",
        handler: (_args, context) => {
          context?.addLine?.("Terminal state", "success")
          context?.addLine?.(`mode: ${context?.state?.mode ?? "command"}`)
          context?.addLine?.(`activeComponent: ${context?.state?.activeComponent?.type ?? "none"}`)
        },
      },
      logs: {
        name: "logs",
        description: "Show sample debug logs",
        handler: (_args, context) => {
          context?.addLine?.("[debug] command registry loaded")
          context?.addLine?.("[debug] input focus active")
          context?.addLine?.("[debug] shadcn terminal renderer mounted", "success")
        },
      },
    },
  },
]

export function InteractiveExamples() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Interactive Examples</h1>
        <p className="max-w-3xl text-muted-foreground">
          Explore OpenTUI React capabilities through these interactive terminal examples. Each demo uses the stable shadcn
          terminal component and showcases a different terminal UI pattern.
        </p>
      </div>

      <Tabs defaultValue="login" className="space-y-8">
        <TabsList className="grid h-auto w-full grid-cols-2 rounded-xl bg-muted/60 p-1 sm:grid-cols-4 lg:grid-cols-8">
          {examples.map((example) => (
            <TabsTrigger key={example.value} value={example.value} className="rounded-lg font-semibold">
              {example.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {examples.map((example) => {
          const Icon = example.icon

          return (
            <TabsContent key={example.value} value={example.value}>
              <Card className="border-border/80 bg-black/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    {example.title}
                  </CardTitle>
                  <CardDescription>{example.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Badge variant="secondary" className="rounded-full font-mono text-xs">
                    Status: {example.status}
                  </Badge>
                  <Terminal commands={example.commands} welcomeMessage={example.welcomeMessage} className="h-48 sm:h-56" />
                </CardContent>
              </Card>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}

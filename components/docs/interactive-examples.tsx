"use client"

import { useState } from "react"
import { Terminal, type TerminalCommand } from "@/components/ui/terminal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Play, User, Menu, Palette } from "lucide-react"

// Login Form Example Component
export function LoginFormExample() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const loginCommands: TerminalCommand[] = [
    {
      name: "login",
      description: "Simulate login with username and password",
      handler: (args) => {
        const [user, pass] = args
        if (!user || !pass) {
          setStatus("error")
          return "Usage: login <username> <password>"
        }

        setUsername(user)
        setPassword(pass)

        if (user === "admin" && pass === "secret") {
          setStatus("success")
          return "✅ Login successful! Welcome, admin."
        } else {
          setStatus("error")
          return "❌ Invalid credentials. Try: login admin secret"
        }
      },
    },
    {
      name: "reset",
      description: "Reset login status",
      handler: () => {
        setStatus("idle")
        setUsername("")
        setPassword("")
        return "Login status reset"
      },
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Login Form Example
        </CardTitle>
        <CardDescription>
          Interactive login simulation. Try: <code>login admin secret</code>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant={status === "success" ? "default" : status === "error" ? "destructive" : "secondary"}>
            Status: {status}
          </Badge>
          {username && <Badge variant="outline">User: {username}</Badge>}
        </div>
        <Terminal
          variant="compact"
          commands={loginCommands}
          welcomeMessage={["🔐 Login Terminal Demo", "Try: login admin secret", "Type 'help' for all commands"]}
          className="h-48"
        />
      </CardContent>
    </Card>
  )
}

// Interactive Menu Example
export function InteractiveMenuExample() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [menuData, setMenuData] = useState([
    { id: "1", name: "Dashboard", description: "View main dashboard" },
    { id: "2", name: "Settings", description: "Configure application" },
    { id: "3", name: "Profile", description: "Manage user profile" },
    { id: "4", name: "Help", description: "Get help and support" },
  ])

  const menuCommands: TerminalCommand[] = [
    {
      name: "menu",
      description: "Show available menu options",
      handler: () => {
        return [
          "📋 Available Options:",
          ...menuData.map((item, index) => `  ${index + 1}. ${item.name} - ${item.description}`),
          "",
          "Use: select <number> to choose an option",
        ].join("\n")
      },
    },
    {
      name: "select",
      description: "Select a menu option by number",
      handler: (args) => {
        const optionNum = Number.parseInt(args[0])
        if (isNaN(optionNum) || optionNum < 1 || optionNum > menuData.length) {
          return `❌ Invalid option. Choose 1-${menuData.length}`
        }

        const selected = menuData[optionNum - 1]
        setSelectedOption(selected.name)
        return `✅ Selected: ${selected.name}\n${selected.description}`
      },
    },
    {
      name: "back",
      description: "Go back to menu",
      handler: () => {
        setSelectedOption(null)
        return "🔙 Returned to main menu"
      },
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Menu className="h-5 w-5" />
          Interactive Menu Example
        </CardTitle>
        <CardDescription>
          Navigate through menu options. Try: <code>menu</code> then <code>select 1</code>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline">Current: {selectedOption || "Main Menu"}</Badge>
        </div>
        <Terminal
          variant="compact"
          commands={menuCommands}
          welcomeMessage={["🎯 Interactive Menu Demo", "Type 'menu' to see options", "Type 'help' for all commands"]}
          className="h-48"
        />
      </CardContent>
    </Card>
  )
}

// ASCII Art Example
export function ASCIIArtExample() {
  const [currentFont, setCurrentFont] = useState("block")
  const [currentText, setCurrentText] = useState("OPENTUI")

  const asciiCommands: TerminalCommand[] = [
    {
      name: "ascii",
      description: "Generate ASCII art text",
      handler: (args) => {
        const text = args.join(" ") || "HELLO"
        setCurrentText(text.toUpperCase())

        // Simple ASCII art simulation
        const artLines = {
          block: [
            "██████  ██      ██████   ██████ ██   ██",
            "██   ██ ██      ██    ██ ██      ██  ██ ",
            "██████  ██      ██    ██ ██      █████  ",
            "██   ██ ██      ██    ██ ██      ██  ██ ",
            "██████  ███████  ██████   ██████ ██   ██",
          ],
          small: ["┌─┐┌─┐┌─┐┌┐┌┌┬┐┬ ┬┬", "│ │├─┘├┤ │││ │ │ ││", "└─┘┴  └─┘┘└┘ ┴ └─┘┴"],
        }

        const art = currentFont === "small" ? artLines.small : artLines.block
        return [`🎨 ASCII Art: "${text}"`, `Font: ${currentFont}`, "", ...art].join("\n")
      },
    },
    {
      name: "font",
      description: "Change ASCII font (block, small)",
      handler: (args) => {
        const font = args[0]
        if (!font || !["block", "small"].includes(font)) {
          return "❌ Available fonts: block, small"
        }
        setCurrentFont(font)
        return `✅ Font changed to: ${font}`
      },
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          ASCII Art Example
        </CardTitle>
        <CardDescription>
          Generate ASCII art text. Try: <code>ascii HELLO</code> or <code>font small</code>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline">Font: {currentFont}</Badge>
          <Badge variant="outline">Text: {currentText}</Badge>
        </div>
        <Terminal
          variant="compact"
          commands={asciiCommands}
          welcomeMessage={["🎨 ASCII Art Generator", "Try: ascii YOUR_TEXT", "Change font: font small"]}
          className="h-64"
        />
      </CardContent>
    </Card>
  )
}

// Counter Example with Timer
export function CounterExample() {
  const [count, setCount] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [interval, setIntervalRef] = useState<NodeJS.Timeout | null>(null)

  const counterCommands: TerminalCommand[] = [
    {
      name: "start",
      description: "Start the counter",
      handler: () => {
        if (isRunning) return "⚠️ Counter is already running"

        setIsRunning(true)
        const timer = setInterval(() => {
          setCount((prev) => prev + 1)
        }, 1000)
        setIntervalRef(timer)

        return "▶️ Counter started! Watch it increment every second."
      },
    },
    {
      name: "stop",
      description: "Stop the counter",
      handler: () => {
        if (!isRunning) return "⚠️ Counter is not running"

        setIsRunning(false)
        if (interval) {
          clearInterval(interval)
          setIntervalRef(null)
        }

        return "⏹️ Counter stopped."
      },
    },
    {
      name: "reset",
      description: "Reset counter to 0",
      handler: () => {
        setCount(0)
        return "🔄 Counter reset to 0"
      },
    },
    {
      name: "count",
      description: "Show current count",
      handler: () => {
        return `📊 Current count: ${count}`
      },
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          Counter with Timer
        </CardTitle>
        <CardDescription>
          Dynamic counter example. Try: <code>start</code>, <code>stop</code>, <code>reset</code>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant={isRunning ? "default" : "secondary"}>{isRunning ? "Running" : "Stopped"}</Badge>
          <Badge variant="outline" className="font-mono text-lg">
            Count: {count}
          </Badge>
        </div>
        <Terminal
          variant="compact"
          commands={counterCommands}
          welcomeMessage={[
            "⏱️ Dynamic Counter Demo",
            "Commands: start, stop, reset, count",
            "Watch the counter update in real-time!",
          ]}
          className="h-48"
        />
      </CardContent>
    </Card>
  )
}

// Main Interactive Examples Component
export function InteractiveExamples() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Interactive Examples</h2>
        <p className="text-muted-foreground">
          Explore OpenTUI React capabilities through these interactive terminal examples. Each demo showcases different
          aspects of building terminal user interfaces with React.
        </p>
      </div>

      <Tabs defaultValue="login" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="login">Login Form</TabsTrigger>
          <TabsTrigger value="menu">Interactive Menu</TabsTrigger>
          <TabsTrigger value="ascii">ASCII Art</TabsTrigger>
          <TabsTrigger value="counter">Counter Timer</TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="space-y-4">
          <LoginFormExample />
        </TabsContent>

        <TabsContent value="menu" className="space-y-4">
          <InteractiveMenuExample />
        </TabsContent>

        <TabsContent value="ascii" className="space-y-4">
          <ASCIIArtExample />
        </TabsContent>

        <TabsContent value="counter" className="space-y-4">
          <CounterExample />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Code Examples
          </CardTitle>
          <CardDescription>View the source code for these interactive examples</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg p-4">
            <code className="text-sm">
              {`// Example: Custom Terminal Commands
const customCommands: TerminalCommand[] = [
  {
    name: "greet",
    description: "Greet the user",
    handler: (args) => {
      const name = args[0] || "World"
      return \`Hello, \${name}!\`
    },
  },
]

<Terminal
  commands={customCommands}
  welcomeMessage={["Welcome to my terminal!"]}
/>`}
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

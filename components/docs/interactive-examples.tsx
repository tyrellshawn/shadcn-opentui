"use client"

import { useState, useEffect } from "react"
import { Terminal, type TerminalCommand } from "@/components/ui/terminal"
import { TerminalSlider } from "@/components/ui/terminal-slider"
import { TerminalControls } from "@/components/ui/terminal-controls"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Play, User, Menu, Palette, Monitor, Database, Settings, Activity } from "lucide-react"

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

// System Monitor Example
export function SystemMonitorExample() {
  const [cpuUsage, setCpuUsage] = useState(45)
  const [memoryUsage, setMemoryUsage] = useState(62)
  const [diskUsage, setDiskUsage] = useState(78)
  const [networkActivity, setNetworkActivity] = useState(23)
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [processes, setProcesses] = useState([
    { pid: 1234, name: "node", cpu: 15.2, memory: 128 },
    { pid: 5678, name: "chrome", cpu: 8.7, memory: 256 },
    { pid: 9012, name: "vscode", cpu: 12.1, memory: 192 },
  ])

  useEffect(() => {
    if (!isMonitoring) return

    const interval = setInterval(() => {
      setCpuUsage((prev) => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 10)))
      setMemoryUsage((prev) => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 8)))
      setDiskUsage((prev) => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 3)))
      setNetworkActivity((prev) => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 15)))

      setProcesses((prev) =>
        prev.map((proc) => ({
          ...proc,
          cpu: Math.max(0, Math.min(50, proc.cpu + (Math.random() - 0.5) * 5)),
          memory: Math.max(50, Math.min(500, proc.memory + (Math.random() - 0.5) * 20)),
        })),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [isMonitoring])

  const monitorCommands: TerminalCommand[] = [
    {
      name: "start",
      description: "Start system monitoring",
      handler: () => {
        setIsMonitoring(true)
        return "🔄 System monitoring started. Real-time updates every 2 seconds."
      },
    },
    {
      name: "stop",
      description: "Stop system monitoring",
      handler: () => {
        setIsMonitoring(false)
        return "⏹️ System monitoring stopped."
      },
    },
    {
      name: "status",
      description: "Show current system status",
      handler: () => {
        return [
          "📊 System Status:",
          `CPU Usage: ${cpuUsage.toFixed(1)}%`,
          `Memory Usage: ${memoryUsage.toFixed(1)}%`,
          `Disk Usage: ${diskUsage.toFixed(1)}%`,
          `Network Activity: ${networkActivity.toFixed(1)}%`,
          "",
          "Top Processes:",
          ...processes.map((p) => `  PID ${p.pid}: ${p.name} - CPU: ${p.cpu.toFixed(1)}% MEM: ${p.memory}MB`),
        ].join("\n")
      },
    },
    {
      name: "processes",
      description: "List running processes",
      handler: () => {
        return [
          "🔍 Running Processes:",
          "PID    NAME       CPU%   MEMORY",
          "--------------------------------",
          ...processes.map(
            (p) =>
              `${p.pid.toString().padEnd(6)} ${p.name.padEnd(10)} ${p.cpu.toFixed(1).padStart(5)}% ${p.memory.toString().padStart(6)}MB`,
          ),
        ].join("\n")
      },
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          System Monitor
        </CardTitle>
        <CardDescription>
          Real-time system monitoring dashboard. Try: <code>start</code>, <code>status</code>, <code>processes</code>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={isMonitoring ? "default" : "secondary"}>{isMonitoring ? "Live" : "Stopped"}</Badge>
            </div>
            <TerminalSlider label="CPU" value={[cpuUsage]} max={100} unit="%" showValue className="text-xs" />
          </div>
          <div className="space-y-2">
            <TerminalSlider
              label="Memory"
              value={[memoryUsage]}
              max={100}
              unit="%"
              showValue
              ascii
              width={10}
              className="text-xs"
            />
          </div>
          <div className="space-y-2">
            <TerminalSlider label="Disk" value={[diskUsage]} max={100} unit="%" showValue className="text-xs" />
          </div>
          <div className="space-y-2">
            <TerminalSlider
              label="Network"
              value={[networkActivity]}
              max={100}
              unit="%"
              showValue
              ascii
              width={8}
              className="text-xs"
            />
          </div>
        </div>
        <Terminal
          variant="compact"
          commands={monitorCommands}
          welcomeMessage={["🖥️ System Monitor v2.1", "Type 'start' to begin monitoring", "Type 'help' for all commands"]}
          className="h-64"
        />
      </CardContent>
    </Card>
  )
}

// File Manager Example
export function FileManagerExample() {
  const [currentPath, setCurrentPath] = useState("/home/user")
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [fileSystem] = useState({
    "/home/user": {
      type: "directory",
      files: ["documents", "downloads", "projects", "config.json", "readme.txt"],
    },
    "/home/user/documents": {
      type: "directory",
      files: ["report.pdf", "notes.md", "presentation.pptx"],
    },
    "/home/user/downloads": {
      type: "directory",
      files: ["installer.exe", "image.png", "archive.zip"],
    },
    "/home/user/projects": {
      type: "directory",
      files: ["website", "mobile-app", "api-server"],
    },
  })

  const fileCommands: TerminalCommand[] = [
    {
      name: "ls",
      description: "List directory contents",
      handler: (args) => {
        const path = args[0] || currentPath
        const dir = fileSystem[path as keyof typeof fileSystem]

        if (!dir) {
          return `❌ Directory not found: ${path}`
        }

        const files = dir.files.map((file) => {
          const fullPath = `${path}/${file}`
          const isDir = fileSystem[fullPath as keyof typeof fileSystem]
          return `${isDir ? "📁" : "📄"} ${file}`
        })

        return [`📂 Contents of ${path}:`, ...files, "", `Total: ${dir.files.length} items`].join("\n")
      },
    },
    {
      name: "cd",
      description: "Change directory",
      handler: (args) => {
        if (!args[0]) {
          return `📍 Current directory: ${currentPath}`
        }

        let newPath = args[0]
        if (!newPath.startsWith("/")) {
          newPath = `${currentPath}/${newPath}`
        }

        if (newPath === "..") {
          const parts = currentPath.split("/")
          parts.pop()
          newPath = parts.join("/") || "/"
        }

        if (!fileSystem[newPath as keyof typeof fileSystem]) {
          return `❌ Directory not found: ${newPath}`
        }

        setCurrentPath(newPath)
        return `📂 Changed to: ${newPath}`
      },
    },
    {
      name: "pwd",
      description: "Print working directory",
      handler: () => {
        return `📍 ${currentPath}`
      },
    },
    {
      name: "cat",
      description: "Display file contents",
      handler: (args) => {
        if (!args[0]) {
          return "❌ Usage: cat <filename>"
        }

        const filename = args[0]
        const mockContents = {
          "config.json": '{\n  "theme": "dark",\n  "language": "en",\n  "autoSave": true\n}',
          "readme.txt":
            "Welcome to OpenTUI!\n\nThis is a terminal UI framework for React.\nBuild amazing console applications with ease.",
          "notes.md": "# Meeting Notes\n\n- Discussed project timeline\n- Reviewed requirements\n- Assigned tasks",
        }

        const content = mockContents[filename as keyof typeof mockContents]
        if (!content) {
          return `❌ Cannot read file: ${filename}`
        }

        return `📄 Contents of ${filename}:\n\n${content}`
      },
    },
    {
      name: "find",
      description: "Search for files",
      handler: (args) => {
        if (!args[0]) {
          return "❌ Usage: find <pattern>"
        }

        const pattern = args[0].toLowerCase()
        const results: string[] = []

        Object.entries(fileSystem).forEach(([path, dir]) => {
          dir.files.forEach((file) => {
            if (file.toLowerCase().includes(pattern)) {
              results.push(`${path}/${file}`)
            }
          })
        })

        if (results.length === 0) {
          return `❌ No files found matching: ${pattern}`
        }

        return [`🔍 Found ${results.length} files matching "${pattern}":`, ...results.map((r) => `  ${r}`)].join("\n")
      },
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          File Manager
        </CardTitle>
        <CardDescription>
          Navigate filesystem with terminal commands. Try: <code>ls</code>, <code>cd documents</code>,{" "}
          <code>cat config.json</code>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono">
            {currentPath}
          </Badge>
          {selectedFile && <Badge variant="secondary">Selected: {selectedFile}</Badge>}
        </div>
        <Terminal
          variant="compact"
          commands={fileCommands}
          welcomeMessage={[
            "📁 File Manager Terminal",
            `Current directory: ${currentPath}`,
            "Commands: ls, cd, pwd, cat, find",
            "Type 'help' for all commands",
          ]}
          className="h-64"
        />
      </CardContent>
    </Card>
  )
}

// Terminal Controls Demo
export function TerminalControlsExample() {
  const [controlValues, setControlValues] = useState({
    volume: 75,
    brightness: 50,
    speed: 25,
  })

  const controlsCommands: TerminalCommand[] = [
    {
      name: "set",
      description: "Set control value (volume, brightness, speed)",
      handler: (args) => {
        const [control, value] = args
        if (!control || !value) {
          return "❌ Usage: set <control> <value>\nControls: volume, brightness, speed"
        }

        const numValue = Number.parseInt(value)
        if (isNaN(numValue) || numValue < 0 || numValue > 100) {
          return "❌ Value must be between 0 and 100"
        }

        if (!["volume", "brightness", "speed"].includes(control)) {
          return "❌ Invalid control. Available: volume, brightness, speed"
        }

        setControlValues((prev) => ({ ...prev, [control]: numValue }))
        return `✅ ${control} set to ${numValue}%`
      },
    },
    {
      name: "get",
      description: "Get current control values",
      handler: () => {
        return [
          "🎛️ Current Control Values:",
          `Volume: ${controlValues.volume}%`,
          `Brightness: ${controlValues.brightness}%`,
          `Speed: ${controlValues.speed}%`,
        ].join("\n")
      },
    },
    {
      name: "reset",
      description: "Reset all controls to defaults",
      handler: () => {
        setControlValues({ volume: 75, brightness: 50, speed: 25 })
        return "🔄 All controls reset to default values"
      },
    },
    {
      name: "save",
      description: "Save current configuration",
      handler: () => {
        return "💾 Configuration saved successfully!"
      },
    },
  ]

  const handleControlCommand = (command: string) => {
    // This would be called by the TerminalControls component
    console.log(`Control command: ${command}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Terminal Controls
        </CardTitle>
        <CardDescription>
          Interactive control panel with sliders. Try: <code>set volume 80</code>, <code>get</code>, <code>reset</code>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <TerminalControls onCommand={handleControlCommand} />
        <Terminal
          variant="compact"
          commands={controlsCommands}
          welcomeMessage={[
            "🎛️ Terminal Controls Demo",
            "Use sliders above or commands below",
            "Commands: set, get, reset, save",
            "Type 'help' for all commands",
          ]}
          className="h-48"
        />
      </CardContent>
    </Card>
  )
}

// Development Tools Example
export function DevToolsExample() {
  const [buildStatus, setBuildStatus] = useState<"idle" | "building" | "success" | "error">("idle")
  const [testResults, setTestResults] = useState({ passed: 0, failed: 0, total: 0 })
  const [serverStatus, setServerStatus] = useState<"stopped" | "starting" | "running">("stopped")

  const devCommands: TerminalCommand[] = [
    {
      name: "build",
      description: "Build the project",
      handler: async () => {
        setBuildStatus("building")

        // Simulate build process
        await new Promise((resolve) => setTimeout(resolve, 3000))

        const success = Math.random() > 0.3
        setBuildStatus(success ? "success" : "error")

        if (success) {
          return [
            "🔨 Build started...",
            "📦 Installing dependencies...",
            "⚡ Compiling TypeScript...",
            "🎨 Processing styles...",
            "✅ Build completed successfully!",
            "📊 Bundle size: 2.4MB (gzipped: 890KB)",
          ].join("\n")
        } else {
          return [
            "🔨 Build started...",
            "📦 Installing dependencies...",
            "❌ Build failed!",
            "Error: Type 'string' is not assignable to type 'number'",
            "  at src/components/terminal.tsx:42:15",
          ].join("\n")
        }
      },
    },
    {
      name: "test",
      description: "Run test suite",
      handler: async () => {
        const total = 15
        const passed = Math.floor(Math.random() * total)
        const failed = total - passed

        setTestResults({ passed, failed, total })

        await new Promise((resolve) => setTimeout(resolve, 2000))

        return [
          "🧪 Running test suite...",
          "",
          "✅ Terminal component tests",
          "✅ Command handler tests",
          failed > 0 ? "❌ Integration tests" : "✅ Integration tests",
          failed > 1 ? "❌ UI component tests" : "✅ UI component tests",
          "",
          `📊 Results: ${passed} passed, ${failed} failed, ${total} total`,
          failed === 0 ? "🎉 All tests passed!" : "⚠️ Some tests failed",
        ].join("\n")
      },
    },
    {
      name: "serve",
      description: "Start development server",
      handler: async () => {
        if (serverStatus === "running") {
          return "⚠️ Server is already running on http://localhost:3000"
        }

        setServerStatus("starting")
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setServerStatus("running")

        return [
          "🚀 Starting development server...",
          "📦 Loading configuration...",
          "⚡ Compiling application...",
          "✅ Server ready!",
          "",
          "🌐 Local:    http://localhost:3000",
          "🌍 Network:  http://192.168.1.100:3000",
          "",
          "Press Ctrl+C to stop",
        ].join("\n")
      },
    },
    {
      name: "stop",
      description: "Stop development server",
      handler: () => {
        if (serverStatus === "stopped") {
          return "⚠️ Server is not running"
        }

        setServerStatus("stopped")
        return "⏹️ Development server stopped"
      },
    },
    {
      name: "lint",
      description: "Run code linter",
      handler: () => {
        const issues = Math.floor(Math.random() * 5)

        if (issues === 0) {
          return ["🔍 Running ESLint...", "✅ No linting errors found!", "📊 Checked 42 files"].join("\n")
        } else {
          return [
            "🔍 Running ESLint...",
            "⚠️ Found issues:",
            "  src/terminal.tsx:15:3 - Missing semicolon",
            "  src/commands.tsx:28:1 - Unused variable 'result'",
            `📊 ${issues} issues found in 42 files`,
          ].join("\n")
        }
      },
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Development Tools
        </CardTitle>
        <CardDescription>
          Simulate development workflow. Try: <code>build</code>, <code>test</code>, <code>serve</code>,{" "}
          <code>lint</code>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Badge
            variant={buildStatus === "success" ? "default" : buildStatus === "error" ? "destructive" : "secondary"}
          >
            Build: {buildStatus}
          </Badge>
          <Badge
            variant={
              testResults.failed === 0 && testResults.total > 0
                ? "default"
                : testResults.failed > 0
                  ? "destructive"
                  : "secondary"
            }
          >
            Tests: {testResults.passed}/{testResults.total}
          </Badge>
          <Badge variant={serverStatus === "running" ? "default" : "secondary"}>Server: {serverStatus}</Badge>
          <Badge variant="outline">Ready</Badge>
        </div>
        <Terminal
          variant="compact"
          commands={devCommands}
          welcomeMessage={[
            "⚡ Development Tools Terminal",
            "Available commands: build, test, serve, stop, lint",
            "Type 'help' for all commands",
          ]}
          className="h-64"
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
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="ascii">ASCII</TabsTrigger>
          <TabsTrigger value="counter">Counter</TabsTrigger>
          <TabsTrigger value="monitor">Monitor</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
          <TabsTrigger value="devtools">DevTools</TabsTrigger>
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

        <TabsContent value="monitor" className="space-y-4">
          <SystemMonitorExample />
        </TabsContent>

        <TabsContent value="files" className="space-y-4">
          <FileManagerExample />
        </TabsContent>

        <TabsContent value="controls" className="space-y-4">
          <TerminalControlsExample />
        </TabsContent>

        <TabsContent value="devtools" className="space-y-4">
          <DevToolsExample />
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

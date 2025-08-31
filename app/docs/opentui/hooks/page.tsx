"use client"

import { Zap, Keyboard, Focus, Clock, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { CodePreview } from "@/components/docs/code-preview"

export default function HooksPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Hooks & Events</h1>
        <p className="text-lg text-muted-foreground">
          React hooks and event handling patterns for building interactive terminal applications.
        </p>
      </div>

      {/* Hook Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5 text-blue-500" />
              Input Hooks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Handle keyboard input and user interactions.</p>
            <div className="space-y-1">
              <Badge variant="outline" className="text-xs">
                useInput
              </Badge>
              <Badge variant="outline" className="text-xs">
                useKeypress
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Focus className="h-5 w-5 text-green-500" />
              Focus Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Manage focus and component lifecycle.</p>
            <div className="space-y-1">
              <Badge variant="outline" className="text-xs">
                useFocus
              </Badge>
              <Badge variant="outline" className="text-xs">
                useFocusManager
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Input Hooks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-blue-500" />
            Input Hooks
          </CardTitle>
          <CardDescription>Handle keyboard input and user interactions in your terminal applications</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="useInput" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="useInput">useInput</TabsTrigger>
              <TabsTrigger value="useKeypress">useKeypress</TabsTrigger>
            </TabsList>

            <TabsContent value="useInput" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">useInput Hook</h4>
                <p className="text-sm text-muted-foreground">
                  Handle raw keyboard input with customizable key bindings and input processing.
                </p>
              </div>
              <CodePreview
                title="Basic Input Handling"
                code={`import { useInput } from "@opentui/react"

function InputHandler() {
  const [input, setInput] = useState("")
  
  useInput((input, key) => {
    if (key.return) {
      console.log("Submitted:", input)
      setInput("")
    } else if (key.ctrl && key.name === "c") {
      process.exit(0)
    } else if (key.name === "backspace") {
      setInput(prev => prev.slice(0, -1))
    } else if (key.sequence) {
      setInput(prev => prev + key.sequence)
    }
  })
  
  return (
    <box>
      <text>Input: {input}</text>
    </box>
  )
}`}
              />
            </TabsContent>

            <TabsContent value="useKeypress" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">useKeypress Hook</h4>
                <p className="text-sm text-muted-foreground">
                  Listen for specific key combinations and trigger actions.
                </p>
              </div>
              <CodePreview
                title="Key Bindings"
                code={`import { useKeypress } from "@opentui/react"

function KeyBindings() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState("")
  
  useKeypress("space", () => {
    setCount(prev => prev + 1)
  })
  
  useKeypress("r", () => {
    setCount(0)
    setMessage("Reset!")
  })
  
  useKeypress("ctrl+c", () => {
    process.exit(0)
  })
  
  return (
    <box flexDirection="column">
      <text>Count: {count}</text>
      <text>Press SPACE to increment, R to reset</text>
      {message && <text fg="#00FF00">{message}</text>}
    </box>
  )
}`}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Focus Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Focus className="h-5 w-5 text-green-500" />
            Focus Management
          </CardTitle>
          <CardDescription>Manage component focus and navigation in terminal applications</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="useFocus" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="useFocus">useFocus</TabsTrigger>
              <TabsTrigger value="useFocusManager">useFocusManager</TabsTrigger>
            </TabsList>

            <TabsContent value="useFocus" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">useFocus Hook</h4>
                <p className="text-sm text-muted-foreground">Manage focus state for individual components.</p>
              </div>
              <CodePreview
                title="Focus Management"
                code={`import { useFocus } from "@opentui/react"

function FocusableButton({ children, onPress }) {
  const { isFocused } = useFocus({
    autoFocus: false
  })
  
  useInput((input, key) => {
    if (isFocused && key.return) {
      onPress?.()
    }
  })
  
  return (
    <text 
      bg={isFocused ? "#0000FF" : undefined}
      fg={isFocused ? "#FFFFFF" : "#CCCCCC"}
    >
      {isFocused ? "> " : "  "}{children}
    </text>
  )
}`}
              />
            </TabsContent>

            <TabsContent value="useFocusManager" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">useFocusManager Hook</h4>
                <p className="text-sm text-muted-foreground">Coordinate focus between multiple components.</p>
              </div>
              <CodePreview
                title="Focus Navigation"
                code={`import { useFocusManager } from "@opentui/react"

function Menu() {
  const { focusNext, focusPrevious } = useFocusManager()
  
  useInput((input, key) => {
    if (key.downArrow) {
      focusNext()
    } else if (key.upArrow) {
      focusPrevious()
    }
  })
  
  return (
    <box flexDirection="column">
      <FocusableButton onPress={() => console.log("Option 1")}>
        Option 1
      </FocusableButton>
      <FocusableButton onPress={() => console.log("Option 2")}>
        Option 2
      </FocusableButton>
      <FocusableButton onPress={() => console.log("Option 3")}>
        Option 3
      </FocusableButton>
    </box>
  )
}`}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Event Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Event Patterns
          </CardTitle>
          <CardDescription>Common patterns for handling events in terminal applications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">Event Delegation</h4>
            <p className="text-sm text-muted-foreground">
              Handle events at the application level and delegate to focused components.
            </p>
          </div>
          <CodePreview
            title="Event Delegation Pattern"
            code={`function App() {
  const [activeView, setActiveView] = useState("menu")
  
  useInput((input, key) => {
    // Global key bindings
    if (key.ctrl && key.name === "q") {
      process.exit(0)
    } else if (key.escape) {
      setActiveView("menu")
    }
    
    // Delegate to active view
    switch (activeView) {
      case "menu":
        handleMenuInput(input, key)
        break
      case "form":
        handleFormInput(input, key)
        break
    }
  })
  
  return (
    <box>
      {activeView === "menu" && <MenuView />}
      {activeView === "form" && <FormView />}
    </box>
  )
}`}
          />
        </CardContent>
      </Card>

      {/* Lifecycle Hooks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-500" />
            Lifecycle & Effects
          </CardTitle>
          <CardDescription>
            Use React's built-in hooks for managing component lifecycle in terminal apps
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">useEffect for Terminal Apps</h4>
            <p className="text-sm text-muted-foreground">
              Handle side effects, timers, and cleanup in terminal applications.
            </p>
          </div>
          <CodePreview
            title="Terminal Effects"
            code={`function StatusMonitor() {
  const [status, setStatus] = useState("idle")
  const [uptime, setUptime] = useState(0)
  
  useEffect(() => {
    // Setup interval for uptime counter
    const interval = setInterval(() => {
      setUptime(prev => prev + 1)
    }, 1000)
    
    // Cleanup on unmount
    return () => clearInterval(interval)
  }, [])
  
  useEffect(() => {
    // Monitor system status
    const checkStatus = async () => {
      try {
        const response = await fetch("/api/status")
        setStatus(response.ok ? "online" : "offline")
      } catch {
        setStatus("error")
      }
    }
    
    checkStatus()
    const interval = setInterval(checkStatus, 5000)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <box flexDirection="column">
      <text>Status: <text fg={status === "online" ? "#00FF00" : "#FF0000"}>{status}</text></text>
      <text>Uptime: {uptime}s</text>
    </box>
  )
}`}
          />
        </CardContent>
      </Card>

      {/* Next Steps */}
      <div className="flex justify-between items-center pt-8 border-t">
        <div>
          <h3 className="font-semibold">Next: Custom Components</h3>
          <p className="text-sm text-muted-foreground">Learn how to create custom OpenTUI components</p>
        </div>
        <Button asChild>
          <Link href="/docs/opentui/custom">
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

"use client"

import { Terminal, Box, Layers, Zap, ArrowRight, Code2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Terminal as TerminalComponent } from "@/components/ui/terminal"

export default function ConceptsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Core Concepts</h1>
        <p className="text-lg text-muted-foreground">
          Understanding the fundamental concepts behind OpenTUI and how it enables React-based terminal applications.
        </p>
      </div>

      {/* What is OpenTUI */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-green-500" />
            What is OpenTUI?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            OpenTUI is a TypeScript library that provides a React reconciler for building Terminal User Interfaces
            (TUIs). It allows you to use familiar React patterns like components, hooks, and state management to create
            rich, interactive console applications.
          </p>
          <div className="bg-muted rounded-lg p-4">
            <code className="text-sm">
              {`// Traditional terminal output
console.log("Hello, World!")

// OpenTUI React approach
function App() {
  return <text fg="#00FF00">Hello, World!</text>
}

render(<App />)`}
            </code>
          </div>
        </CardContent>
      </Card>

      {/* React Reconciler */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-500" />
            React Reconciler
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            OpenTUI uses a custom React reconciler that translates React components into terminal output. This means you
            can:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Use JSX syntax for terminal layouts</li>
            <li>Manage state with useState and useEffect</li>
            <li>Create reusable components</li>
            <li>Handle events and user input</li>
            <li>Leverage the entire React ecosystem</li>
          </ul>
          <div className="bg-muted rounded-lg p-4">
            <code className="text-sm">
              {`function Counter() {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    const timer = setInterval(() => setCount(c => c + 1), 1000)
    return () => clearInterval(timer)
  }, [])
  
  return (
    <box>
      <text>Count: {count}</text>
    </box>
  )
}`}
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Component Architecture */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Box className="h-5 w-5 text-purple-500" />
            Component Architecture
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            OpenTUI provides a set of primitive components that map to terminal concepts:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Badge variant="outline">Layout Components</Badge>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  <code>&lt;box&gt;</code> - Container with flexbox-like layout
                </li>
                <li>
                  <code>&lt;text&gt;</code> - Text rendering with styling
                </li>
                <li>
                  <code>&lt;newline&gt;</code> - Line breaks
                </li>
                <li>
                  <code>&lt;spacer&gt;</code> - Flexible spacing
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <Badge variant="outline">Interactive Components</Badge>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  <code>&lt;input&gt;</code> - Text input fields
                </li>
                <li>
                  <code>&lt;select&gt;</code> - Selection menus
                </li>
                <li>
                  <code>&lt;checkbox&gt;</code> - Boolean inputs
                </li>
                <li>
                  <code>&lt;progress&gt;</code> - Progress indicators
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* State Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            State Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            OpenTUI applications use standard React state management patterns. You can use local state, context, or
            external state management libraries like Zustand or Redux.
          </p>
          <div className="bg-muted rounded-lg p-4">
            <code className="text-sm">
              {`// Local state
const [input, setInput] = useState("")

// Context for global state
const AppContext = createContext()

// External state management
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 }))
}))`}
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Event Handling */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-red-500" />
            Event Handling
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Handle keyboard events, focus management, and user interactions using React patterns:
          </p>
          <div className="bg-muted rounded-lg p-4">
            <code className="text-sm">
              {`function InputForm() {
  const [value, setValue] = useState("")
  
  const handleSubmit = (inputValue) => {
    console.log("Submitted:", inputValue)
    setValue("")
  }
  
  return (
    <box>
      <text>Enter your name:</text>
      <input
        value={value}
        onChange={setValue}
        onSubmit={handleSubmit}
        placeholder="Type here..."
      />
    </box>
  )
}`}
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Try OpenTUI Concepts</CardTitle>
          <CardDescription>
            Experiment with OpenTUI concepts using our interactive terminal. Try commands like 'ui form' or 'ui menu'.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TerminalComponent
            variant="default"
            className="h-64"
            welcomeMessage={["OpenTUI Concepts Demo", "Try: ui form, ui menu, progress, ascii art", ""]}
          />
        </CardContent>
      </Card>

      {/* Next Steps */}
      <div className="flex justify-between items-center pt-8 border-t">
        <div>
          <h3 className="font-semibold">Next: React Components</h3>
          <p className="text-sm text-muted-foreground">Learn about OpenTUI's React component library</p>
        </div>
        <Button asChild>
          <Link href="/docs/opentui/components">
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

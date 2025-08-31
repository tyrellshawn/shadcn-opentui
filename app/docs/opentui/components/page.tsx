"use client"

import { Box, Type, MousePointer, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { CodePreview } from "@/components/docs/code-preview"

export default function ComponentsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">React Components</h1>
        <p className="text-lg text-muted-foreground">
          Comprehensive guide to OpenTUI's React component library for building terminal user interfaces.
        </p>
      </div>

      {/* Component Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Box className="h-5 w-5 text-blue-500" />
              Layout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Components for structuring and positioning terminal content.
            </p>
            <div className="space-y-1">
              <Badge variant="outline" className="text-xs">
                box
              </Badge>
              <Badge variant="outline" className="text-xs">
                spacer
              </Badge>
              <Badge variant="outline" className="text-xs">
                newline
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5 text-green-500" />
              Text & Display
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Components for rendering and styling text content.</p>
            <div className="space-y-1">
              <Badge variant="outline" className="text-xs">
                text
              </Badge>
              <Badge variant="outline" className="text-xs">
                static
              </Badge>
              <Badge variant="outline" className="text-xs">
                transform
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MousePointer className="h-5 w-5 text-purple-500" />
              Interactive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Components for user input and interaction.</p>
            <div className="space-y-1">
              <Badge variant="outline" className="text-xs">
                input
              </Badge>
              <Badge variant="outline" className="text-xs">
                select
              </Badge>
              <Badge variant="outline" className="text-xs">
                checkbox
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Layout Components */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Box className="h-5 w-5 text-blue-500" />
            Layout Components
          </CardTitle>
          <CardDescription>Structure your terminal UI with flexible layout components</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="box" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="box">Box</TabsTrigger>
              <TabsTrigger value="spacer">Spacer</TabsTrigger>
              <TabsTrigger value="newline">Newline</TabsTrigger>
            </TabsList>

            <TabsContent value="box" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Box Component</h4>
                <p className="text-sm text-muted-foreground">
                  The fundamental layout component. Supports flexbox-like properties for arranging child components.
                </p>
              </div>
              <CodePreview
                title="Basic Box Layout"
                code={`import { render } from "@opentui/react"

function App() {
  return (
    <box flexDirection="column" padding={1}>
      <text fg="#00FF00">Header</text>
      <box flexDirection="row" justifyContent="space-between">
        <text>Left</text>
        <text>Right</text>
      </box>
      <text fg="#FF0000">Footer</text>
    </box>
  )
}

render(<App />)`}
              />
            </TabsContent>

            <TabsContent value="spacer" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Spacer Component</h4>
                <p className="text-sm text-muted-foreground">
                  Creates flexible space between components, similar to CSS flex-grow.
                </p>
              </div>
              <CodePreview
                title="Using Spacers"
                code={`function Layout() {
  return (
    <box flexDirection="row">
      <text>Left</text>
      <spacer />
      <text>Right</text>
    </box>
  )
}`}
              />
            </TabsContent>

            <TabsContent value="newline" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Newline Component</h4>
                <p className="text-sm text-muted-foreground">Inserts line breaks in your terminal output.</p>
              </div>
              <CodePreview
                title="Line Breaks"
                code={`function MultiLine() {
  return (
    <box>
      <text>First line</text>
      <newline />
      <text>Second line</text>
      <newline count={2} />
      <text>Third line (with extra spacing)</text>
    </box>
  )
}`}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Text Components */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5 text-green-500" />
            Text & Display Components
          </CardTitle>
          <CardDescription>Render and style text content with rich formatting options</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="static">Static</TabsTrigger>
              <TabsTrigger value="transform">Transform</TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Text Component</h4>
                <p className="text-sm text-muted-foreground">
                  The primary component for rendering text with styling options.
                </p>
              </div>
              <CodePreview
                title="Styled Text"
                code={`function StyledText() {
  return (
    <box flexDirection="column">
      <text fg="#FF0000" bold>Red Bold Text</text>
      <text bg="#0000FF" fg="#FFFFFF">Blue Background</text>
      <text italic underline>Italic Underlined</text>
      <text strikethrough>Strikethrough Text</text>
    </box>
  )
}`}
              />
            </TabsContent>

            <TabsContent value="static" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Static Component</h4>
                <p className="text-sm text-muted-foreground">
                  Renders text that doesn't re-render when parent components update.
                </p>
              </div>
              <CodePreview
                title="Static Content"
                code={`function App() {
  const [count, setCount] = useState(0)
  
  return (
    <box flexDirection="column">
      <static>
        <text>This header never re-renders</text>
      </static>
      <text>Count: {count}</text>
    </box>
  )
}`}
              />
            </TabsContent>

            <TabsContent value="transform" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Transform Component</h4>
                <p className="text-sm text-muted-foreground">
                  Apply transformations to text content like uppercase, lowercase, etc.
                </p>
              </div>
              <CodePreview
                title="Text Transformations"
                code={`function Transforms() {
  return (
    <box flexDirection="column">
      <transform type="uppercase">
        <text>this will be uppercase</text>
      </transform>
      <transform type="lowercase">
        <text>THIS WILL BE LOWERCASE</text>
      </transform>
    </box>
  )
}`}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Interactive Components */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MousePointer className="h-5 w-5 text-purple-500" />
            Interactive Components
          </CardTitle>
          <CardDescription>Handle user input with interactive terminal components</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="input" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="input">Input</TabsTrigger>
              <TabsTrigger value="select">Select</TabsTrigger>
              <TabsTrigger value="checkbox">Checkbox</TabsTrigger>
            </TabsList>

            <TabsContent value="input" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Input Component</h4>
                <p className="text-sm text-muted-foreground">Text input field for collecting user input.</p>
              </div>
              <CodePreview
                title="Text Input"
                code={`function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  
  return (
    <box flexDirection="column">
      <text>Username:</text>
      <input
        value={username}
        onChange={setUsername}
        placeholder="Enter username"
      />
      <text>Password:</text>
      <input
        value={password}
        onChange={setPassword}
        mask="*"
        placeholder="Enter password"
      />
    </box>
  )
}`}
              />
            </TabsContent>

            <TabsContent value="select" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Select Component</h4>
                <p className="text-sm text-muted-foreground">Dropdown selection component for choosing from options.</p>
              </div>
              <CodePreview
                title="Selection Menu"
                code={`function LanguageSelector() {
  const [language, setLanguage] = useState("javascript")
  
  const options = [
    { label: "JavaScript", value: "javascript" },
    { label: "TypeScript", value: "typescript" },
    { label: "Python", value: "python" },
    { label: "Rust", value: "rust" }
  ]
  
  return (
    <box flexDirection="column">
      <text>Select Language:</text>
      <select
        options={options}
        value={language}
        onChange={setLanguage}
      />
    </box>
  )
}`}
              />
            </TabsContent>

            <TabsContent value="checkbox" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Checkbox Component</h4>
                <p className="text-sm text-muted-foreground">Boolean input component for yes/no selections.</p>
              </div>
              <CodePreview
                title="Checkbox Options"
                code={`function Settings() {
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  
  return (
    <box flexDirection="column">
      <checkbox
        checked={darkMode}
        onChange={setDarkMode}
        label="Enable Dark Mode"
      />
      <checkbox
        checked={notifications}
        onChange={setNotifications}
        label="Enable Notifications"
      />
    </box>
  )
}`}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <div className="flex justify-between items-center pt-8 border-t">
        <div>
          <h3 className="font-semibold">Next: Hooks & Events</h3>
          <p className="text-sm text-muted-foreground">Learn about OpenTUI's React hooks and event handling</p>
        </div>
        <Button asChild>
          <Link href="/docs/opentui/hooks">
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

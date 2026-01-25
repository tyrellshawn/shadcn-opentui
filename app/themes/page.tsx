"use client"

import { Terminal } from "@/components/ui/terminal"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Palette, Sun, Moon, Monitor } from "lucide-react"

const colorThemes = [
  {
    name: "default",
    label: "Default Blue",
    description: "Modern blue accent with excellent contrast",
    colors: { primary: "#7c3aed", secondary: "#c084fc", accent: "#a78bfa" },
  },
  {
    name: "matrix",
    label: "Matrix Green",
    description: "Classic terminal green aesthetic",
    colors: { primary: "#22c55e", secondary: "#16a34a", accent: "#4ade80" },
  },
  {
    name: "cyan",
    label: "Cyan",
    description: "Cool cyan tones for a tech-forward look",
    colors: { primary: "#06b6d4", secondary: "#0891b2", accent: "#22d3ee" },
  },
  {
    name: "amber",
    label: "Amber",
    description: "Warm amber tones for a retro terminal feel",
    colors: { primary: "#f59e0b", secondary: "#d97706", accent: "#fbbf24" },
  },
  {
    name: "purple",
    label: "Purple",
    description: "Vibrant purple for creative projects",
    colors: { primary: "#a855f7", secondary: "#9333ea", accent: "#c084fc" },
  },
]

export default function ThemesPage() {
  const applyColorTheme = (themeName: string) => {
    const html = document.documentElement
    colorThemes.forEach((t) => html.classList.remove(`theme-${t.name}`))
    if (themeName !== "default") {
      html.classList.add(`theme-${themeName}`)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Theme Customization</h1>
              <p className="text-xs text-muted-foreground">Configure your OpenTUI appearance</p>
            </div>
          </div>
          <ThemeSwitcher />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Introduction */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Customizable Themes</h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-3xl">
            OpenTUI supports full theme customization with light/dark modes and multiple color schemes. Choose from
            pre-built themes or create your own by modifying CSS variables.
          </p>
        </div>

        {/* Quick Start */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Start</CardTitle>
            <CardDescription>Get started with OpenTUI themes in seconds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 text-foreground">1. Install the component</h4>
              <pre className="bg-muted border border-border rounded-lg p-4 overflow-x-auto">
                <code className="text-sm font-mono text-foreground">
                  npx shadcn@latest add https://opentui.vercel.app/r/terminal.json
                </code>
              </pre>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-foreground">2. Add ThemeProvider to your layout</h4>
              <pre className="bg-muted border border-border rounded-lg p-4 overflow-x-auto">
                <code className="text-sm font-mono text-foreground">
                  {`import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}`}
                </code>
              </pre>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-foreground">3. Use the theme switcher</h4>
              <pre className="bg-muted border border-border rounded-lg p-4 overflow-x-auto">
                <code className="text-sm font-mono text-foreground">
                  {`import { ThemeSwitcher } from "@/components/theme-switcher"

export function Nav() {
  return <nav><ThemeSwitcher /></nav>
}`}
                </code>
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Color Theme Gallery */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6 text-foreground">Color Themes</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colorThemes.map((theme) => (
              <Card key={theme.name} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{theme.label}</CardTitle>
                      <CardDescription className="text-sm mt-1">{theme.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <div
                      className="w-8 h-8 rounded-md border border-border"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div
                      className="w-8 h-8 rounded-md border border-border"
                      style={{ backgroundColor: theme.colors.secondary }}
                    />
                    <div
                      className="w-8 h-8 rounded-md border border-border"
                      style={{ backgroundColor: theme.colors.accent }}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyColorTheme(theme.name)}
                    className="w-full"
                  >
                    Apply Theme
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Live Preview */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6 text-foreground">Live Preview</h3>
          <Tabs defaultValue="terminal" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="terminal">Terminal</TabsTrigger>
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="colors">Color Palette</TabsTrigger>
            </TabsList>

            <TabsContent value="terminal" className="space-y-4">
              <Card>
                <CardContent className="p-0">
                  <Terminal
                    welcomeMessage={[
                      "Welcome to OpenTUI Theme Preview",
                      "",
                      "Try different themes using the controls above.",
                      "Type 'help' to see available commands.",
                    ]}
                    prompt="user@opentui:~$"
                    className="h-[400px] rounded-lg"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="components" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Buttons</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    <Button>Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Badges</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="colors" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "Background", var: "background" },
                  { name: "Foreground", var: "foreground" },
                  { name: "Primary", var: "primary" },
                  { name: "Secondary", var: "secondary" },
                  { name: "Muted", var: "muted" },
                  { name: "Accent", var: "accent" },
                  { name: "Card", var: "card" },
                  { name: "Border", var: "border" },
                ].map((color) => (
                  <Card key={color.var}>
                    <CardContent className="p-4">
                      <div className={`w-full h-16 rounded-md bg-${color.var} border border-border mb-2`} />
                      <p className="text-sm font-medium text-foreground">{color.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">--{color.var}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Light/Dark Mode */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6 text-foreground">Light & Dark Modes</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Sun className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Light Mode</CardTitle>
                <CardDescription>Clean and modern light interface</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Optimized for daytime use with high contrast and excellent readability.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Moon className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Dark Mode</CardTitle>
                <CardDescription>Terminal-inspired dark theme</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Perfect for low-light environments with reduced eye strain.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Monitor className="h-8 w-8 text-primary mb-2" />
                <CardTitle>System</CardTitle>
                <CardDescription>Automatic theme detection</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Automatically adapts to your system preferences.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Custom Theme Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Create Custom Themes</CardTitle>
            <CardDescription>Build your own color scheme with CSS variables</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Add custom themes by defining CSS classes in your globals.css file:
            </p>
            <pre className="bg-muted border border-border rounded-lg p-4 overflow-x-auto">
              <code className="text-sm font-mono text-foreground">
                {`.theme-custom {
  --background: oklch(0.10 0.02 220);
  --foreground: oklch(0.90 0.12 200);
  --primary: oklch(0.70 0.20 200);
  --primary-foreground: oklch(0.98 0 0);
  --accent: oklch(0.60 0.18 200);
  --border: oklch(0.28 0.08 200);
  --ring: oklch(0.70 0.20 200);
}`}
              </code>
            </pre>
            <p className="text-sm text-muted-foreground mt-4">
              Apply your theme by adding the class to the HTML element or using the theme switcher component.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

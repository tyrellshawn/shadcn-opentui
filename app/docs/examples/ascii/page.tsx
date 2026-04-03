"use client"

import Link from "next/link"
import { ArrowRight, ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CodePreview } from "@/components/docs/code-preview"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Terminal as TerminalComponent } from "@/components/ui/terminal"

function AsciiPreview() {
  return (
    <TerminalComponent
      className="h-72"
      commands={{
        ascii: {
          name: "ascii",
          description: "Generate a simple banner",
          handler: (args, context) => {
            const text = (args.join(" ") || "OpenTUI").toUpperCase()
            context?.addLine?.("+------------------+", "success")
            context?.addLine?.(`| ${text.padEnd(16, " ")} |`, "success")
            context?.addLine?.("+------------------+", "success")
          },
        },
        art: {
          name: "art",
          description: "Show a predefined icon",
          handler: (args, context) => {
            const kind = args[0] || "rocket"
            const icons: Record<string, string[]> = {
              rocket: ["   /\\", "  /  \\", " | 🚀 |", " |____|"],
              cat: [" /\_/\\", "( o.o )", " > ^ <"],
            }
            ;(icons[kind] || icons.rocket).forEach((line) => context?.addLine?.(line, "output"))
          },
        },
      }}
      welcomeMessage={[
        "ASCII Art Demo",
        "Try: ascii launch",
        "Try: art rocket",
      ]}
    />
  )
}

const generatorCode = `import { Terminal } from "@/components/ui/terminal"

export function BannerTerminal() {
  return (
    <Terminal
      commands={{
        ascii: {
          name: "ascii",
          description: "Generate a simple banner",
          handler: (args, context) => {
            const text = (args.join(" ") || "OpenTUI").toUpperCase()
            context?.addLine?.("+------------------+", "success")
            context?.addLine?.(\`| \${text.padEnd(16, " ")} |\`, "success")
            context?.addLine?.("+------------------+", "success")
          },
        },
      }}
      welcomeMessage={["Try: ascii launch"]}
      className="h-72"
    />
  )
}`

const animationCode = `import { useEffect, useState } from "react"
import { Terminal } from "@/components/ui/terminal"

export function AnimatedStatusTerminal() {
  const frames = ["-", "\\", "|", "/"]
  const [frameIndex, setFrameIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setFrameIndex((current) => (current + 1) % frames.length)
    }, 180)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <Terminal
      welcomeMessage={[\`Rendering animation frame: \${frames[frameIndex]}\`]}
      className="h-56"
    />
  )
}`

const interactiveCode = `import { useState } from "react"
import { Terminal } from "@/components/ui/terminal"

export function TemplateGalleryTerminal() {
  const [lastTemplate, setLastTemplate] = useState("rocket")

  return (
    <Terminal
      commands={{
        art: {
          name: "art",
          description: "Render a predefined icon",
          handler: (args, context) => {
            const template = args[0] || "rocket"
            setLastTemplate(template)
            context?.addLine?.(\`Loaded template: \${template}\`, "success")
          },
        },
      }}
      welcomeMessage={[\`Last template: \${lastTemplate}\`, "Try: art cat"]}
      className="h-56"
    />
  )
}`

export default function AsciiExamplePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">ASCII Art Example</h1>
        <p className="text-lg text-muted-foreground">
          Build banners, icon packs, and lightweight animations with command-driven output.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-emerald-500" />
            ASCII Art Generator Demo
          </CardTitle>
          <CardDescription>Try the live terminal output before wiring it into your own app.</CardDescription>
        </CardHeader>
        <CardContent>
          <AsciiPreview />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ASCII Art Implementation Examples</CardTitle>
          <CardDescription>Working code samples for banners, simple animation, and reusable templates.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="generator" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="generator">Text Generator</TabsTrigger>
              <TabsTrigger value="animations">Animations</TabsTrigger>
              <TabsTrigger value="interactive">Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="generator">
              <CodePreview title="ASCII Text Generator" description="Render banners directly from a terminal command." code={generatorCode} preview={<AsciiPreview />} />
            </TabsContent>

            <TabsContent value="animations">
              <CodePreview title="Animated Status" description="Use React state to rotate simple ASCII frames." code={animationCode} />
            </TabsContent>

            <TabsContent value="interactive">
              <CodePreview title="Template Gallery" description="Track reusable art templates in React state and render them from commands." code={interactiveCode} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between border-t pt-8">
        <div>
          <h3 className="font-semibold">Next: Advanced Terminal Demos</h3>
          <p className="text-sm text-muted-foreground">Explore the broader example gallery and reuse these patterns.</p>
        </div>
        <Button asChild>
          <Link href="/docs/components/examples">
            View More Examples
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

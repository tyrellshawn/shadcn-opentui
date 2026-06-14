"use client"

import { Brain, Sparkles, Code2, Settings, Eye, Zap, Layers, Play } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TerminalThinkingIndicator, TerminalDotMatrix, TerminalAsciiSpinner } from "@/components/ui/terminal-thinking-indicator"
import { TerminalThinkingMatrix } from "@/components/ui/terminal-thinking-matrix"
import { CodeBlock } from "@/components/docs/code-block"

const installationCode = `npx shadcn@latest add https://opentui.com/r/thinking-indicator.json`

const importCode = `import {
  TerminalThinkingIndicator,
  TerminalDotMatrix,
  TerminalAsciiSpinner,
  CLAUDE_THINKING_FRAMES,
} from "@/components/ui/terminal-thinking-indicator"`

// --- Preview components ---

function DotMatrixPreview() {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <TerminalThinkingIndicator label="Thinking" variant="dots" />
      <TerminalThinkingIndicator label="Analyzing" variant="dots" tone="active" />
    </div>
  )
}

function AsciiPreview() {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <TerminalThinkingIndicator label="Thinking" variant="ascii" />
      <TerminalThinkingIndicator label="Processing" variant="ascii" tone="active" />
    </div>
  )
}

function CursorPreview() {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <TerminalThinkingIndicator label="Waiting" variant="cursor" />
      <TerminalThinkingIndicator label="Running" variant="cursor" tone="active" />
    </div>
  )
}

function BlobPreview() {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <TerminalThinkingIndicator label="Thinking" variant="blob" />
      <TerminalThinkingIndicator label="Working" variant="blob" tone="active" />
    </div>
  )
}

function DotMatrixConfigPreview() {
  return (
    <div className="flex items-center gap-6 flex-wrap">
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground">Default</span>
        <TerminalIndicator label="Thinking" variant="dots" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground">Fast</span>
        <TerminalIndicator label="Fast" variant="dots" dotProps={{ speed: 40 }} />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground">Long trail</span>
        <TerminalIndicator label="Trail" variant="dots" dotProps={{ trail: 7 }} />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground">No center</span>
        <TerminalIndicator label="No pulse" variant="dots" dotProps={{ pulseCenter: false }} />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground">Blue</span>
        <TerminalIndicator label="Blue" variant="dots" dotProps={{ color: "#3b82f6" }} />
      </div>
    </div>
  )
}

function TerminalIndicator({ label, variant, dotProps }: { label: string; variant: "dots" | "ascii" | "cursor" | "blob"; dotProps?: any }) {
  return <TerminalThinkingIndicator label={label} variant={variant} dotProps={dotProps} />
}

export default function ThinkingIndicatorPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Thinking Indicator</h1>
            <p className="text-muted-foreground">Animated thinking states while the agent works</p>
          </div>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl">
          The Thinking Indicator component provides animated feedback during agent processing,
          with variants including dot matrix, ASCII spinner, blinking cursor, and animated blob.
        </p>
      </div>

      {/* Quick Start */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Zap className="h-5 w-5 text-emerald-400" />
          Quick Start
        </h2>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Installation</h3>
            <CodeBlock code={installationCode} language="bash" showLineNumbers={false} showHeader={true} title="Thinking Indicator" />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Import</h3>
            <CodeBlock code={importCode} language="typescript" showLineNumbers={false} />
          </div>
        </div>
      </section>

      {/* Overview */}
      <Card className="border-emerald-500/20 bg-black/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            Overview
          </CardTitle>
          <CardDescription>Four animation variants with configurable options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-emerald-400">Variants</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-1">-</span><strong className="text-white">dots</strong> — 3×3 dot matrix with spinning comet tail</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-1">-</span><strong className="text-white">ascii</strong> — Claude-style symbol loop (· ✻ ✽ ✶ ✳ ✢)</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-1">-</span><strong className="text-white">cursor</strong> — Blinking block cursor</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-1">-</span><strong className="text-white">blob</strong> — Morphing organic blobs (default)</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-emerald-400">Features</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-1">-</span>Configurable speed, trail, dot size, and color</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-1">-</span>Custom animation frames for full control</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-1">-</span>Prefers-reduced-motion support</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-1">-</span>Standalone TerminalDotMatrix and TerminalAsciiSpinner exports</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Code2 className="h-5 w-5 text-emerald-400" />
          Variants
        </h2>

        <Tabs defaultValue="dots" className="space-y-6">
          <TabsList className="bg-black/50 border border-emerald-500/20">
            <TabsTrigger value="dots" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">Dot Matrix</TabsTrigger>
            <TabsTrigger value="ascii" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">ASCII</TabsTrigger>
            <TabsTrigger value="cursor" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">Cursor</TabsTrigger>
            <TabsTrigger value="blob" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">Blob</TabsTrigger>
          </TabsList>

          <TabsContent value="dots">
            <Card className="border-emerald-500/20 bg-black/40">
              <CardContent className="pt-6">
                <DotMatrixPreview />
                <div className="mt-4">
                  <CodeBlock
                    code={'<TerminalThinkingIndicator label="Thinking" variant="dots" />'}
                    language="tsx"
                    showLineNumbers={false}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ascii">
            <Card className="border-emerald-500/20 bg-black/40">
              <CardContent className="pt-6">
                <AsciiPreview />
                <div className="mt-4">
                  <CodeBlock
                    code={'<TerminalThinkingIndicator label="Thinking" variant="ascii" />'}
                    language="tsx"
                    showLineNumbers={false}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cursor">
            <Card className="border-emerald-500/20 bg-black/40">
              <CardContent className="pt-6">
                <CursorPreview />
                <div className="mt-4">
                  <CodeBlock
                    code={'<TerminalThinkingIndicator label="Waiting" variant="cursor" />'}
                    language="tsx"
                    showLineNumbers={false}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blob">
            <Card className="border-emerald-500/20 bg-black/40">
              <CardContent className="pt-6">
                <BlobPreview />
                <div className="mt-4">
                  <CodeBlock
                    code={'<TerminalThinkingIndicator label="Thinking" variant="blob" />'}
                    language="tsx"
                    showLineNumbers={false}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Dot Matrix Customization */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Layers className="h-5 w-5 text-emerald-400" />
          Dot Matrix Customization
        </h2>
        <p className="text-muted-foreground">
          The <code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">dotProps</code> prop on TerminalThinkingIndicator
          passes options to the underlying TerminalDotMatrix for speed, trail, pulse center, dot size, and color.
        </p>

        <DotMatrixConfigPreview />

        <CodeBlock
          code={`{/* Fast animation */}
<TerminalThinkingIndicator label="Fast" variant="dots" dotProps={{ speed: 40 }} />

{/* Long trail */}
<TerminalThinkingIndicator label="Trail" variant="dots" dotProps={{ trail: 7 }} />

{/* No center pulse */}
<TerminalThinkingIndicator label="No center" variant="dots" dotProps={{ pulseCenter: false }} />

{/* Custom color */}
<TerminalThinkingIndicator label="Blue" variant="dots" dotProps={{ color: "#3b82f6" }} />`}
          language="tsx"
          title="dot-matrix-custom.tsx"
        />
      </section>

      {/* Standalone Sub-Components */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Play className="h-5 w-5 text-emerald-400" />
          Standalone Sub-Components
        </h2>
        <p className="text-muted-foreground">
          <code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">TerminalDotMatrix</code> and{' '}
          <code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">TerminalAsciiSpinner</code> are exported
          as standalone components for embedding in custom layouts.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-emerald-500/20 bg-black/40">
            <CardHeader>
              <CardTitle className="text-sm text-white">TerminalDotMatrix</CardTitle>
              <CardDescription>3×3 grid animation primitive</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-4">
                <TerminalDotMatrix speed={120} trail={4} dotSize={3} tone="active" />
              </div>
              <CodeBlock
                code={'<TerminalDotMatrix speed={120} trail={4} dotSize={3} tone="active" />'}
                language="tsx"
                showLineNumbers={false}
              />
            </CardContent>
          </Card>

          <Card className="border-emerald-500/20 bg-black/40">
            <CardHeader>
              <CardTitle className="text-sm text-white">TerminalAsciiSpinner</CardTitle>
              <CardDescription>Symbol loop animation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-4">
                <TerminalAsciiSpinner speed={150} color="var(--terminal-primary, #22c55e)" />
              </div>
              <CodeBlock
                code={'<TerminalAsciiSpinner speed={150} color="var(--terminal-primary)" />'}
                language="tsx"
                showLineNumbers={false}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Variant Comparison Table */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Eye className="h-5 w-5 text-emerald-400" />
          Variant Comparison
        </h2>
        <p className="text-muted-foreground">All variants rendered side-by-side with default and active tones.</p>

        <div className="overflow-x-auto rounded-lg border border-emerald-500/20 bg-black/40">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-emerald-500/20">
                <th className="text-left p-4 text-white font-medium">Variant</th>
                <th className="text-center p-4 text-white font-medium">Default Tone</th>
                <th className="text-center p-4 text-white font-medium">Active Tone</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {(["dots", "ascii", "cursor", "blob"] as const).map((v) => (
                <tr key={v} className="border-b border-emerald-500/10">
                  <td className="p-4 font-mono text-emerald-400">{v}</td>
                  <td className="p-4">
                    <div className="flex justify-center">
                      <TerminalThinkingIndicator label="" variant={v} tone="default" />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center">
                      <TerminalThinkingIndicator label="" variant={v} tone="active" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Thinking Matrix */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="h-5 w-5 text-emerald-400" />
          Thinking Matrix
        </h2>
        <p className="text-muted-foreground">
          Interactive sandbox — tweak parameters and see the dot matrix update in real time.
        </p>
        <TerminalThinkingMatrix />
      </section>

      {/* API Reference */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="h-5 w-5 text-emerald-400" />
          API Reference
        </h2>

        <Card className="border-emerald-500/20 bg-black/40">
          <CardHeader>
            <CardTitle className="text-white">TerminalThinkingIndicator</CardTitle>
            <CardDescription>Animated thinking state while the agent works</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-emerald-500/20">
                    <th className="text-left p-3 text-white font-medium">Prop</th>
                    <th className="text-left p-3 text-white font-medium">Type</th>
                    <th className="text-left p-3 text-white font-medium">Default</th>
                    <th className="text-left p-3 text-white font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-emerald-500/10">
                    <td className="p-3"><code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">label</code></td>
                    <td className="p-3"><code className="text-purple-400">string</code></td>
                    <td className="p-3"><code className="text-amber-400">""</code></td>
                    <td className="p-3">Status text</td>
                  </tr>
                  <tr className="border-b border-emerald-500/10">
                    <td className="p-3"><code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">variant</code></td>
                    <td className="p-3"><code className="text-purple-400">"auto" | "dots" | "ascii" | "cursor" | "blob"</code></td>
                    <td className="p-3"><code className="text-amber-400">"blob"</code></td>
                    <td className="p-3">Animation style</td>
                  </tr>
                  <tr className="border-b border-emerald-500/10">
                    <td className="p-3"><code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">tone</code></td>
                    <td className="p-3"><code className="text-purple-400">"default" | "active"</code></td>
                    <td className="p-3"><code className="text-amber-400">"default"</code></td>
                    <td className="p-3">Text emphasis — active uses brighter foreground</td>
                  </tr>
                  <tr className="border-b border-emerald-500/10">
                    <td className="p-3"><code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">dotProps</code></td>
                    <td className="p-3"><code className="text-purple-400">Partial&lt;TerminalDotMatrixProps&gt;</code></td>
                    <td className="p-3"><code className="text-amber-400">-</code></td>
                    <td className="p-3">Customize dot matrix — speed, trail, pulseCenter, dotSize, color</td>
                  </tr>
                  <tr className="border-b border-emerald-500/10">
                    <td className="p-3"><code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">asciiProps</code></td>
                    <td className="p-3"><code className="text-purple-400">Partial&lt;TerminalAsciiSpinnerProps&gt;</code></td>
                    <td className="p-3"><code className="text-amber-400">-</code></td>
                    <td className="p-3">Customize ASCII spinner — frames, speed, color</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/20 bg-black/40">
          <CardHeader>
            <CardTitle className="text-white">TerminalDotMatrix</CardTitle>
            <CardDescription>Low-level 3×3 dot animation primitive</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-emerald-500/20">
                    <th className="text-left p-3 text-white font-medium">Prop</th>
                    <th className="text-left p-3 text-white font-medium">Type</th>
                    <th className="text-left p-3 text-white font-medium">Default</th>
                    <th className="text-left p-3 text-white font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-emerald-500/10"><td className="p-3"><code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">speed</code></td><td className="p-3"><code className="text-purple-400">number</code></td><td className="p-3"><code className="text-amber-400">120</code></td><td className="p-3">Milliseconds per ring step</td></tr>
                  <tr className="border-b border-emerald-500/10"><td className="p-3"><code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">trail</code></td><td className="p-3"><code className="text-purple-400">number</code></td><td className="p-3"><code className="text-amber-400">4</code></td><td className="p-3">Cells that fade behind the comet head</td></tr>
                  <tr className="border-b border-emerald-500/10"><td className="p-3"><code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">pulseCenter</code></td><td className="p-3"><code className="text-purple-400">boolean</code></td><td className="p-3"><code className="text-amber-400">true</code></td><td className="p-3">Pulse the center dot</td></tr>
                  <tr className="border-b border-emerald-500/10"><td className="p-3"><code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">dotSize</code></td><td className="p-3"><code className="text-purple-400">number</code></td><td className="p-3"><code className="text-amber-400">2</code></td><td className="p-3">Dot size in pixels</td></tr>
                  <tr className="border-b border-emerald-500/10"><td className="p-3"><code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">color</code></td><td className="p-3"><code className="text-purple-400">string</code></td><td className="p-3"><code className="text-amber-400">-</code></td><td className="p-3">Override dot color (any CSS color)</td></tr>
                  <tr className="border-b border-emerald-500/10"><td className="p-3"><code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">tone</code></td><td className="p-3"><code className="text-purple-400">"default" | "active"</code></td><td className="p-3"><code className="text-amber-400">"default"</code></td><td className="p-3">Color preset</td></tr>
                  <tr className="border-b border-emerald-500/10"><td className="p-3"><code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">frames</code></td><td className="p-3"><code className="text-purple-400">ReadonlyArray&lt;number[]&gt;</code></td><td className="p-3"><code className="text-amber-400">-</code></td><td className="p-3">Custom animation frames (9 opacity values each)</td></tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/20 bg-black/40">
          <CardHeader>
            <CardTitle className="text-white">TerminalAsciiSpinner</CardTitle>
            <CardDescription>Symbol loop animation primitive</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-emerald-500/20">
                    <th className="text-left p-3 text-white font-medium">Prop</th>
                    <th className="text-left p-3 text-white font-medium">Type</th>
                    <th className="text-left p-3 text-white font-medium">Default</th>
                    <th className="text-left p-3 text-white font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-emerald-500/10"><td className="p-3"><code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">frames</code></td><td className="p-3"><code className="text-purple-400">ReadonlyArray&lt;string&gt;</code></td><td className="p-3"><code className="text-amber-400">CLAUDE_THINKING_FRAMES</code></td><td className="p-3">Single-character frames cycled in order</td></tr>
                  <tr className="border-b border-emerald-500/10"><td className="p-3"><code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">speed</code></td><td className="p-3"><code className="text-purple-400">number</code></td><td className="p-3"><code className="text-amber-400">150</code></td><td className="p-3">Milliseconds per frame</td></tr>
                  <tr className="border-b border-emerald-500/10"><td className="p-3"><code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">color</code></td><td className="p-3"><code className="text-purple-400">string</code></td><td className="p-3"><code className="text-amber-400">"var(--terminal-primary)"</code></td><td className="p-3">Symbol color</td></tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

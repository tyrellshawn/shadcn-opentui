"use client"

import type React from "react"
import { Terminal, type TerminalCommand } from "@/components/ui/terminal"
import { TerminalControls } from "@/components/ui/terminal-controls"
import { TerminalSlider } from "@/components/ui/terminal-slider"
import { Command } from "@/components/command"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  BookOpen,
  Github,
  TerminalIcon,
  Zap,
  Layers,
  Code2,
  Sparkles,
  Copy,
  Check,
  SlidersHorizontal,
  Gauge,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { MatrixRain } from "@/components/matrix-rain"

function TypewriterText({ text, delay = 50 }: { text: string; delay?: number }) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, text, delay])

  return (
    <span>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button onClick={handleCopy} className="text-muted-foreground hover:text-primary transition-colors p-1">
      {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
    </button>
  )
}

function OpenTUITerminalDemo({
  title,
  script,
}: {
  title: string
  script: Array<{ command: string; output: string[]; delay: number }>
}) {
  const [lines, setLines] = useState<Array<{ type: string; content: string }>>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [typedCommand, setTypedCommand] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (currentStep >= script.length) {
      const resetTimer = setTimeout(() => {
        setLines([])
        setCurrentStep(0)
        setTypedCommand("")
      }, 5000)
      return () => clearTimeout(resetTimer)
    }

    const step = script[currentStep]
    setIsTyping(true)
    setTypedCommand("")

    let charIndex = 0
    const typeInterval = setInterval(() => {
      if (charIndex < step.command.length) {
        setTypedCommand(step.command.slice(0, charIndex + 1))
        charIndex++
      } else {
        clearInterval(typeInterval)
        setIsTyping(false)

        setTimeout(() => {
          setLines((prev) => [...prev, { type: "command", content: step.command }])
          step.output.forEach((output, i) => {
            setTimeout(() => {
              setLines((prev) => [
                ...prev,
                { type: output.startsWith("✓") || output.startsWith("✔") ? "success" : "output", content: output },
              ])
            }, i * 150)
          })
          setTypedCommand("")
          setTimeout(() => setCurrentStep((prev) => prev + 1), step.delay)
        }, 200)
      }
    }, 50)

    return () => clearInterval(typeInterval)
  }, [currentStep, script])

  return (
    <div className="bg-black border border-primary/30 rounded-lg overflow-hidden shadow-lg shadow-primary/10">
      {/* OpenTUI Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-primary/20 bg-black/80">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs text-primary font-mono font-semibold ml-2">OpenTUI Terminal</span>
        </div>
        <span className="text-xs text-primary/50 font-mono">{title}</span>
      </div>

      {/* Terminal Body */}
      <div className="p-4 font-mono text-sm h-[260px] overflow-hidden bg-black">
        {lines.map((line, i) => (
          <div key={i} className="leading-relaxed">
            {line.type === "command" ? (
              <span>
                <span className="text-primary font-bold">user@opentui:~$</span>{" "}
                <span className="text-white">{line.content}</span>
              </span>
            ) : (
              <span className={line.type === "success" ? "text-primary" : "text-primary/70"}>{line.content}</span>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="leading-relaxed">
            <span className="text-primary font-bold">user@opentui:~$</span>{" "}
            <span className="text-white">{typedCommand}</span>
            <span className="animate-pulse text-primary">█</span>
          </div>
        )}
        {!isTyping && currentStep < script.length && (
          <div className="leading-relaxed">
            <span className="text-primary font-bold">user@opentui:~$</span>
            <span className="animate-pulse text-primary ml-1">█</span>
          </div>
        )}
      </div>
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <div className="group p-6 rounded-xl border border-primary/10 bg-black/40 backdrop-blur-sm hover:bg-black/60 hover:border-primary/30 transition-all duration-300">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  )
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-primary glow-text">{value}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  )
}

function RegistrySetupBlock() {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      title: "Initialize shadcn with OpenTUI registry",
      command: "bunx shadcn@latest init -r https://opentui.vercel.app/api/registry",
      description: "Set up shadcn/ui with the OpenTUI registry for seamless component integration",
    },
    {
      title: "Add terminal component",
      command: "bunx shadcn@latest add terminal",
      description: "Install the main OpenTUI terminal component",
    },
    {
      title: "Add terminal controls",
      command: "bunx shadcn@latest add terminal-controls terminal-slider",
      description: "Add interactive UI components for terminal control panels",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveStep(i)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-all ${
              activeStep === i
                ? "bg-primary text-primary-foreground"
                : "bg-black/40 text-primary/60 hover:text-primary border border-primary/20"
            }`}
          >
            Step {i + 1}
          </button>
        ))}
      </div>

      <div className="bg-black/60 border border-primary/30 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-primary/20 flex items-center justify-between">
          <span className="text-sm text-primary font-medium">{steps[activeStep].title}</span>
          <CopyButton text={steps[activeStep].command} />
        </div>
        <div className="p-4 font-mono text-sm">
          <span className="text-primary">$</span> <span className="text-foreground">{steps[activeStep].command}</span>
        </div>
        <div className="px-4 pb-4 text-xs text-muted-foreground">{steps[activeStep].description}</div>
      </div>
    </div>
  )
}

export default function Home() {
  const customCommands: TerminalCommand[] = [
    { name: "echo", description: "Echo text to output", handler: () => {} },
    { name: "whoami", description: "Display current user", handler: () => {} },
    { name: "pwd", description: "Print working directory", handler: () => {} },
    { name: "ls", description: "List directory contents", handler: () => {} },
    { name: "ui", description: "Enter UI mode", handler: () => {} },
    { name: "form", description: "Create interactive form", handler: () => {} },
    { name: "menu", description: "Create interactive menu", handler: () => {} },
    { name: "progress", description: "Show progress bar", handler: () => {} },
    { name: "ascii", description: "Generate ASCII art", handler: () => {} },
  ]

  const demoScript1 = [
    {
      command: "npx shadcn@latest add https://opentui.vercel.app/r/terminal.json",
      output: ["Downloading @shadcn-opentui/terminal...", "✓ Terminal component installed"],
      delay: 2000,
    },
    {
      command: "npm run dev",
      output: ["Starting development server...", "✓ Ready on localhost:3000"],
      delay: 2500,
    },
  ]

  const demoScript2 = [
    {
      command: "ui menu Dashboard Settings Logout",
      output: ["Creating menu with options...", "► Dashboard", "  Settings", "  Logout"],
      delay: 2500,
    },
    {
      command: "form username email password",
      output: ["Creating form...", "✓ Form ready - TAB to navigate"],
      delay: 2000,
    },
  ]

  const demoScript3 = [
    {
      command: "ascii HELLO",
      output: [
        "Generating ASCII art...",
        "██   ██ ███████ ██      ██       ██████",
        "██   ██ ██      ██      ██      ██    ██",
        "███████ █████   ██      ██      ██    ██",
      ],
      delay: 3000,
    },
    {
      command: "progress 2000",
      output: ["[████████████░░░░░░░░] 60%", "✓ Progress complete!"],
      delay: 2500,
    },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Matrix Rain Background */}
      <MatrixRain />

      {/* Content overlay */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-primary/10 bg-black/60 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                <TerminalIcon className="w-4 h-4 text-primary" />
              </div>
              <span className="font-semibold text-lg text-primary">OpenTUI</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/docs" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Docs
              </Link>
              <Link
                href="/docs/components/terminal"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Components
              </Link>
              <Link
                href="/docs/examples"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Examples
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary" asChild>
                <Link href="https://github.com/sst/opentui" target="_blank">
                  <Github className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                size="sm"
                className="bg-primary/20 border border-primary/50 text-primary hover:bg-primary/30 animate-pulse-glow"
                asChild
              >
                <Link href="/docs">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              {/* Glowing OpenTUI Title */}
              <div className="fade-in-up">
                <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-4 font-mono">
                  <span className="text-primary glow-text-strong">OpenTUI</span>
                </h1>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-black/40 text-sm">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-primary/80">Built with shadcn/ui</span>
                </div>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold tracking-tight fade-in-up-delay-1 text-balance">
                <span className="text-foreground">The terminal component</span>
                <br />
                <span className="text-primary glow-text">for modern apps</span>
              </h2>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto fade-in-up-delay-2 text-balance leading-relaxed">
                A powerful, customizable terminal interface built with OpenTUI and React. Command history, tab
                completion, interactive UI components, and full TypeScript support.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-in-up-delay-3">
                <Button
                  size="lg"
                  className="px-8 bg-transparent border-2 border-primary text-primary hover:bg-primary/10"
                  asChild
                >
                  <Link href="/docs">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Documentation
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 bg-black/40 border-border/50 hover:bg-black/60"
                  asChild
                >
                  <Link href="https://github.com/sst/opentui" target="_blank">
                    <Github className="w-4 h-4 mr-2" />
                    View on GitHub
                  </Link>
                </Button>
              </div>

              {/* Install command with glow */}
              <div className="pt-4 fade-in-up-delay-3">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-black/60 border border-primary/30 font-mono text-sm backdrop-blur-sm">
                  <span className="text-primary">$</span>
                  <span className="text-foreground">npx shadcn@latest add https://opentui.vercel.app/r/terminal.json</span>
                  <CopyButton text="npx shadcn@latest add https://opentui.vercel.app/r/terminal.json" />
                </div>
                <div className="mt-2 text-xs text-muted-foreground text-center">
                  Compatible with npm, yarn, pnpm, and bun
                </div>
               </div>
            </div>
          </div>
        </section>

        {/* Animated Demos - Using OpenTUI Terminal */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">See it in action</h2>
              <p className="text-muted-foreground text-lg">
                Watch automated demos showcasing OpenTUI terminal features
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <OpenTUITerminalDemo title="Installation" script={[{
                command: "npx shadcn@latest add https://opentui.vercel.app/r/terminal.json",
                output: ["Downloading @shadcn-opentui/terminal...", "✓ Terminal component installed"],
                delay: 2000,
              }, {
                command: "npm run dev",
                output: ["Starting development server...", "✓ Ready on localhost:3000"],
                delay: 2500,
              }]} />
              <OpenTUITerminalDemo title="UI Components" script={demoScript2} />
              <OpenTUITerminalDemo title="Built-in Commands" script={demoScript3} />
            </div>
          </div>
        </section>

        <section className="py-20 px-6 border-y border-primary/10 bg-black/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">OpenTUI Components</h2>
              <p className="text-muted-foreground text-lg">
                Interactive terminal UI components from the @shadcn-opentui registry
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Terminal Controls Demo */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-mono text-primary">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>@shadcn-opentui/terminal-controls</span>
                </div>
                <TerminalControls className="bg-black/80" onCommand={(cmd) => console.log("Command:", cmd)} />
                <p className="text-xs text-muted-foreground">
                  Pre-built control panel with sliders and buttons for terminal settings
                </p>
              </div>

              {/* Terminal Slider Demo */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-mono text-primary">
                  <Gauge className="w-4 h-4" />
                  <span>@shadcn-opentui/terminal-slider</span>
                </div>
                <div className="p-6 border border-primary/20 rounded bg-black/50 space-y-6">
                  <TerminalSlider label="CPU Usage" defaultValue={[65]} unit="%" max={100} />
                  <TerminalSlider label="Memory" defaultValue={[42]} unit=" GB" max={64} ascii width={20} />
                  <TerminalSlider label="Network Speed" defaultValue={[850]} unit=" Mbps" max={1000} />
                </div>
                <p className="text-xs text-muted-foreground">Terminal-styled sliders with ASCII visualization mode</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatItem value="15+" label="Built-in commands" />
              <StatItem value="5" label="UI components" />
              <StatItem value="100%" label="TypeScript" />
              <StatItem value="<5kb" label="Bundle size" />
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Everything you need</h2>
              <p className="text-muted-foreground text-lg">Powerful features for building terminal experiences</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FeatureCard
                icon={TerminalIcon}
                title="Command History"
                description="Navigate through previous commands with arrow keys, just like a real terminal."
              />
              <FeatureCard
                icon={Zap}
                title="Tab Completion"
                description="Intelligent tab completion with suggestions for faster command entry."
              />
              <FeatureCard
                icon={Layers}
                title="UI Components"
                description="Built-in forms, menus, sliders, and progress bars for interactive terminal UIs."
              />
              <FeatureCard
                icon={Code2}
                title="Async Commands"
                description="Full support for async command handlers with loading states."
              />
            </div>
          </div>
        </section>

        {/* Interactive Demo - Using actual OpenTUI Terminal */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">Try it yourself</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Experience the full power of the OpenTUI terminal component. Type commands, use tab completion, and
                  explore the built-in functionality including interactive UI modes.
                </p>

                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Available commands</h3>
                  <div className="grid gap-2">
                    {[
                      { cmd: "help", desc: "Show all commands" },
                      { cmd: "ui menu [items]", desc: "Create interactive menu" },
                      { cmd: "form [fields]", desc: "Create interactive form" },
                      { cmd: "progress [ms]", desc: "Show animated progress" },
                      { cmd: "ascii [text]", desc: "Generate ASCII art" },
                      { cmd: "clear", desc: "Clear terminal" },
                    ].map((item) => (
                      <div key={item.cmd} className="flex items-center gap-3">
                        <Command>{item.cmd}</Command>
                        <span className="text-sm text-muted-foreground">{item.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-primary/20 overflow-hidden shadow-xl shadow-primary/10">
                <Terminal
                  prompt="demo@opentui:~$"
                  commands={customCommands}
                  welcomeMessage={[
                    "🚀 Welcome to OpenTUI Terminal",
                    "",
                    "Type 'help' to see available commands.",
                    "Use ↑/↓ for history, Tab for completion.",
                    "Try 'ui menu' or 'form' for interactive modes!",
                  ]}
                  className="h-[500px] bg-black"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="p-12 rounded-2xl border border-primary/20 bg-black/40 backdrop-blur-sm">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Ready to get started?</h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Add the OpenTUI terminal component to your project using the @shadcn-opentui registry.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 animate-pulse-glow"
                  asChild
                >
                  <Link href="/docs">
                    Read the docs
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-black/40 border-border/50 hover:bg-black/60" asChild>
                  <Link href="/docs/installation">Installation guide</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-primary/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <TerminalIcon className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">OpenTUI - Built with shadcn/ui</span>
              </div>
              <div className="flex items-center gap-6">
                <Link href="/docs" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Documentation
                </Link>
                <Link
                  href="https://github.com/sst/opentui"
                  target="_blank"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  GitHub
                </Link>
                <Link
                  href="https://twitter.com/shadcn"
                  target="_blank"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Twitter
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

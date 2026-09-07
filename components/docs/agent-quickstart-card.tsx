"use client"

import { useState } from "react"
import Link from "next/link"
import { Bot, Check, Copy, ArrowRight } from "lucide-react"
import { track } from "@vercel/analytics"

const installCommand = "npx shadcn@latest add https://opentui.vercel.app/r/terminal.json"
const agentPrompt = `Install Shadcn OpenTUI's terminal component from https://opentui.vercel.app/r/terminal.json. Then render it in my React/Next.js app with a typed command handler, streaming-friendly output, and an approval step before any destructive command. Keep the installed source inspectable and editable in my repo.`

type CopyTarget = "install" | "prompt"

export function AgentQuickstartCard({ compact = false }: { compact?: boolean }) {
  const [copied, setCopied] = useState<CopyTarget | null>(null)

  const copy = async (target: CopyTarget, value: string) => {
    await navigator.clipboard.writeText(value)
    setCopied(target)
    track("quickstart_copied", { target, surface: compact ? "terminal_docs" : "agent_docs" })
    window.setTimeout(() => setCopied(null), 1800)
  }

  return (
    <section className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2 text-emerald-400">
          <Bot className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">Use with an agent</p>
            <h2 className="mt-1 text-xl font-semibold text-foreground">Give your coding agent one install command and one prompt</h2>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              Shadcn OpenTUI is distributed as inspectable source. Your agent can install the terminal, read the component, and adapt command, streaming, and approval flows directly in your app.
            </p>
          </div>

          <div className="grid gap-3">
            <div className="rounded-xl border bg-background/70 p-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-muted-foreground">1. Install</span>
                <button
                  type="button"
                  onClick={() => copy("install", installCommand)}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Copy Shadcn OpenTUI install command"
                >
                  {copied === "install" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied === "install" ? "Copied" : "Copy"}
                </button>
              </div>
              <code className="block overflow-x-auto whitespace-nowrap text-xs text-emerald-300 sm:text-sm">{installCommand}</code>
            </div>

            <div className="rounded-xl border bg-background/70 p-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-muted-foreground">2. Prompt your agent</span>
                <button
                  type="button"
                  onClick={() => copy("prompt", agentPrompt)}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Copy Shadcn OpenTUI agent prompt"
                >
                  {copied === "prompt" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied === "prompt" ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">{agentPrompt}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <Link
              href="/docs/agents"
              onClick={() => track("example_opened", { example: "agent_quickstart" })}
              className="inline-flex items-center gap-1.5 font-medium text-emerald-400 hover:text-emerald-300"
            >
              Agent templates <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/docs/compare-termcn"
              onClick={() => track("competitor_comparison_opened", { competitor: "termcn" })}
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
            >
              Compare with termcn <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export { installCommand, agentPrompt }

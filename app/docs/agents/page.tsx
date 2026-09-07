import type { Metadata } from "next"
import Link from "next/link"
import { Bot, Braces, CheckCircle2, ShieldCheck, Terminal, Wrench } from "lucide-react"
import { AgentQuickstartCard } from "@/components/docs/agent-quickstart-card"
import { CodeBlock } from "@/components/docs/code-block"

export const metadata: Metadata = {
  title: "Use Shadcn OpenTUI with AI Agents",
  description:
    "Agent-first quickstart, prompts, templates, and machine-readable resources for installing and adapting Shadcn OpenTUI terminal components.",
}

const codingAgentPrompt = `Use Shadcn OpenTUI for the agent surface in this React app.
1. Install https://opentui.vercel.app/r/terminal.json with the shadcn CLI.
2. Read the installed Terminal source before changing it.
3. Add typed commands for inspect, test, and apply.
4. Stream progress into terminal output instead of replacing the whole UI.
5. Require an explicit approval interaction before destructive actions.
6. Keep all generated code local and editable.`

const deployAgentPrompt = `Build a deploy/debug terminal with Shadcn OpenTUI.
- Commands: status, logs, test, deploy.
- status and logs are read-only.
- deploy must show the target environment, planned changes, and require explicit approval.
- Stream progress and final status into the same terminal session.
- Never hide command failures; render them as terminal errors.`

const approvalExample = `const commands = {
  deploy: {
    name: "deploy",
    description: "Deploy after explicit approval",
    handler: async (_args, context) => {
      context?.addLine?.("Target: production", "output")
      context?.addLine?.("Plan: build -> test -> deploy", "output")
      context?.addLine?.("Approval required before continuing.", "warning")
      // Wire your own approval state/UI here before invoking the action.
    },
  },
}`

const agentResources = [
  ["/llms.txt", "Short project map for model discovery"],
  ["/llms-full.txt", "Expanded implementation and decision context"],
  ["/faq.json", "Machine-readable frequently asked questions"],
  ["/qa.json", "Question/answer corpus for retrieval and grounding"],
  ["/agent-index.json", "Canonical index of agent-facing resources"],
  ["/registry/index.json", "Installable shadcn registry metadata"],
]

export default function AgentsPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-emerald-400">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">Agent-first adoption</p>
            <h1 className="text-4xl font-bold tracking-tight">Use Shadcn OpenTUI with an AI agent</h1>
          </div>
        </div>
        <p className="max-w-3xl text-lg text-muted-foreground">
          The fastest path is to let your coding agent install the registry component, inspect the copied source, and adapt the terminal around your workflow. This project is intentionally copy-own-edit rather than a black-box runtime dependency.
        </p>
      </header>

      <AgentQuickstartCard />

      <section className="space-y-5">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Ready-made agent prompts</h2>
          <p className="text-muted-foreground">Start from a concrete workflow instead of asking an agent to invent a terminal architecture from scratch.</p>
        </div>
        <div className="grid gap-5">
          <CodeBlock code={codingAgentPrompt} language="text" title="Coding agent" showLineNumbers={false} />
          <CodeBlock code={deployAgentPrompt} language="text" title="Deploy / debug agent" showLineNumbers={false} />
          <CodeBlock code={approvalExample} language="tsx" title="Approval-first command pattern" showLineNumbers={false} />
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">What agents can build well with it</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            [Terminal, "Interactive command surfaces", "Typed commands, history, completion, forms, menus, progress, and terminal-native output."],
            [Braces, "Coding-agent sessions", "Streaming reasoning summaries, tool output, edits, diffs, and status without switching to generic cards."],
            [Wrench, "Deploy and debugging consoles", "Read-only diagnostics plus guarded write actions in one inspectable React surface."],
            [ShieldCheck, "Approval workflows", "Present intent, target, and planned action before invoking destructive or expensive operations."],
          ].map(([Icon, title, copy]) => {
            const IconComponent = Icon as typeof Terminal
            return (
              <div key={String(title)} className="rounded-xl border bg-card/50 p-5">
                <IconComponent className="mb-3 h-5 w-5 text-emerald-400" />
                <h3 className="font-semibold">{String(title)}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{String(copy)}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="space-y-5">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Machine-readable entry points</h2>
          <p className="text-muted-foreground">Agents should not need to scrape the visual docs to understand the project.</p>
        </div>
        <div className="overflow-hidden rounded-xl border">
          {agentResources.map(([href, description], index) => (
            <Link
              key={href}
              href={href}
              className={`flex items-start gap-3 p-4 transition-colors hover:bg-muted/40 ${index ? "border-t" : ""}`}
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              <div>
                <code className="text-sm text-foreground">{href}</code>
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-5">
        <h2 className="text-lg font-semibold">Shadcn OpenTUI vs native terminal libraries</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Shadcn OpenTUI is strongest when the terminal experience lives in a browser React application and you want inspectable shadcn-style source. If you are building a native terminal program directly on Ink or OpenTUI, a library such as termcn may be the more natural starting point.
        </p>
        <Link href="/docs/compare-termcn" className="mt-3 inline-block text-sm font-medium text-emerald-400 hover:text-emerald-300">
          See the decision guide →
        </Link>
      </section>
    </div>
  )
}

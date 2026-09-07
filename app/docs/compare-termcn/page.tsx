import type { Metadata } from "next"
import Link from "next/link"
import { Check, Minus } from "lucide-react"
import { CodeBlock } from "@/components/docs/code-block"
import { AgentQuickstartCard } from "@/components/docs/agent-quickstart-card"

export const metadata: Metadata = {
  title: "Shadcn OpenTUI vs termcn",
  description:
    "A practical decision guide for choosing Shadcn OpenTUI or termcn, with a migration pattern for moving terminal workflows into a browser React/shadcn interface.",
}

const migrationExample = `// Native terminal command logic can stay conceptually similar.
// Move the interaction surface into the browser and emit output through context.

import { Terminal } from "@/components/ui/terminal"

const commands = {
  status: {
    name: "status",
    description: "Read current service status",
    handler: async (_args, context) => {
      const status = await getStatus()
      context?.addLine?.(\`Service: \${status}\`, "success")
    },
  },
}

export function WebAgentTerminal() {
  return <Terminal commands={commands} welcomeMessage={["Agent console ready"]} />
}`

const rows = [
  ["Primary surface", "Browser React / Next.js UI", "Native terminal application"],
  ["Distribution", "shadcn-compatible copied source", "shadcn-style registry for Ink/OpenTUI components"],
  ["Best fit", "Web agent consoles, in-app terminals, browser workflows", "CLI/TUI apps built directly on Ink or OpenTUI"],
  ["Customization model", "Edit the installed React/shadcn source", "Edit installed terminal component source"],
  ["Terminal renderer required in user environment", "No — renders as web UI", "Yes — targets terminal runtime/output"],
  ["Agent-oriented web session primitives", "A core product focus", "Available as part of a broader terminal component catalog"],
]

export default function CompareTermcnPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">Decision guide</p>
        <h1 className="text-4xl font-bold tracking-tight">Shadcn OpenTUI vs termcn</h1>
        <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
          These projects overlap around React, OpenTUI-style experiences, and shadcn distribution, but they optimize for different execution surfaces. The most important question is whether your UI runs <strong className="text-foreground">inside a browser app</strong> or <strong className="text-foreground">as a native terminal app</strong>.
        </p>
      </header>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-muted/30 text-left">
            <tr>
              <th className="p-4 font-medium">Decision</th>
              <th className="p-4 font-medium text-emerald-400">Shadcn OpenTUI</th>
              <th className="p-4 font-medium">termcn</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, ours, theirs]) => (
              <tr key={label} className="border-t align-top">
                <td className="p-4 font-medium text-foreground">{label}</td>
                <td className="p-4 leading-6 text-muted-foreground">{ours}</td>
                <td className="p-4 leading-6 text-muted-foreground">{theirs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.04] p-5">
          <h2 className="text-lg font-semibold">Choose Shadcn OpenTUI when…</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {[
              "The terminal belongs inside a browser product or Next.js app.",
              "You want an agent console, deploy surface, debugging panel, or approval workflow on the web.",
              "You want the component source copied into the app for both humans and coding agents to modify.",
              "You need terminal-native interaction without asking users to launch a local TUI.",
            ].map((item) => (
              <li key={item} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />{item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border p-5">
          <h2 className="text-lg font-semibold">Choose termcn when…</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {[
              "You are building a native terminal application on Ink or OpenTUI.",
              "You want a broad ready-made catalog of terminal components for that runtime.",
              "Your users already live in terminal emulators and the CLI/TUI is the product surface.",
              "Browser rendering is not part of the requirement.",
            ].map((item) => (
              <li key={item} className="flex gap-2"><Minus className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-semibold">Migrating a workflow from termcn to a browser surface</h2>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            This is not a one-to-one component rename because the render targets differ. Keep your command/domain logic, replace terminal-runtime rendering with the Shadcn OpenTUI React surface, and route output through terminal command context.
          </p>
        </div>
        <CodeBlock code={migrationExample} language="tsx" title="web-agent-terminal.tsx" showLineNumbers={false} />
      </section>

      <AgentQuickstartCard compact />

      <footer className="rounded-xl border p-5 text-sm text-muted-foreground">
        <p>
          termcn is an independent project. See its current documentation at{" "}
          <Link href="https://www.termcn.dev/docs" target="_blank" rel="noreferrer" className="text-foreground underline underline-offset-4">termcn.dev</Link>.
          This comparison intentionally focuses on product fit rather than declaring one library universally better.
        </p>
      </footer>
    </div>
  )
}

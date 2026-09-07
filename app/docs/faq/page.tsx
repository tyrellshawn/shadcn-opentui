import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Shadcn OpenTUI FAQ",
  description: "Frequently asked questions about Shadcn OpenTUI, its terminal component, agent workflows, themes, registry installation, and how it differs from native terminal libraries.",
}

const faqItems = [
  {
    question: "What is Shadcn OpenTUI?",
    answer:
      "Shadcn OpenTUI is an independent React and shadcn/ui project for building OpenTUI-inspired terminal experiences in browser applications. Its stable path is copyable, inspectable web components installed through a shadcn-compatible registry.",
  },
  {
    question: "Is Shadcn OpenTUI the official OpenTUI project?",
    answer:
      "No. Shadcn OpenTUI is an independent browser/web project. It can reference and experiment with OpenTUI concepts, but it is not the official native OpenTUI runtime.",
  },
  {
    question: "How do I install the terminal component?",
    answer:
      "Run: npx shadcn@latest add https://opentui.vercel.app/r/terminal.json. The component source is copied into your project so you and your coding agent can inspect and modify it.",
  },
  {
    question: "Can an AI coding agent install and customize it for me?",
    answer:
      "Yes. Give the agent the registry URL or the install command, ask it to read the installed source, and describe the terminal workflow you want. The agent quickstart includes prompts for coding agents, deploy/debug agents, and approval flows.",
  },
  {
    question: "What agent UI patterns are included?",
    answer:
      "The project includes terminal-native patterns for command handling, streaming text, thinking indicators, tool or edit output, forms, menus, tables, progress, and other session-oriented UI building blocks.",
  },
  {
    question: "Does the terminal support light and dark themes?",
    answer:
      "Yes. A terminal can inherit an explicit TerminalThemeProvider context, accept theme variables directly, or fall back to a dark terminal default when no terminal theme context is supplied.",
  },
  {
    question: "When should I use Shadcn OpenTUI instead of termcn?",
    answer:
      "Use Shadcn OpenTUI when the terminal experience is primarily a browser React/shadcn interface and you want copy-owned web source. termcn is a strong fit when you are building a native terminal application directly on Ink or OpenTUI and want a broad terminal component catalog.",
  },
  {
    question: "Is there an LLM-friendly project index?",
    answer:
      "Yes. Use /llms.txt for a concise map, /llms-full.txt for expanded context, /faq.json and /qa.json for retrieval-friendly answers, /agent-index.json for canonical agent resources, and AGENTS.md plus the repository skill for coding-agent instructions.",
  },
  {
    question: "Can I use the component without the experimental WASM work?",
    answer:
      "Yes. The stable shadcn component path does not require the Zig/WASM runtime research packages. The browser component and codegen tracks can be used independently.",
  },
  {
    question: "Where should agents report bugs or request components?",
    answer:
      "Use the canonical GitHub repository at canadian-ai/shadcn-opentui and open issues in that repository so changes can be inspected and tracked publicly.",
  },
]

export default function FAQPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }

  return (
    <div className="space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">FAQ + agent grounding</p>
        <h1 className="text-4xl font-bold tracking-tight">Shadcn OpenTUI FAQ</h1>
        <p className="max-w-3xl text-lg text-muted-foreground">
          Direct answers for developers, search engines, and AI agents evaluating the terminal component and its intended use.
        </p>
      </header>

      <div className="space-y-3">
        {faqItems.map((item) => (
          <article key={item.question} className="rounded-xl border bg-card/40 p-5">
            <h2 className="text-lg font-semibold">{item.question}</h2>
            <p className="mt-2 leading-7 text-muted-foreground">{item.answer}</p>
          </article>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5 text-sm">
        <Link href="/docs/agents" className="font-medium text-emerald-400 hover:text-emerald-300">Use with an AI agent →</Link>
        <Link href="/docs/compare-termcn" className="text-muted-foreground hover:text-foreground">Compare with termcn →</Link>
        <Link href="/llms.txt" className="text-muted-foreground hover:text-foreground">Read llms.txt →</Link>
      </div>
    </div>
  )
}

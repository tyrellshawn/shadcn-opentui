# Shadcn OpenTUI

[![Registry Build](https://github.com/canadian-ai/shadcn-opentui/actions/workflows/registry-build.yml/badge.svg)](https://github.com/canadian-ai/shadcn-opentui/actions/workflows/registry-build.yml)
[![Release](https://github.com/canadian-ai/shadcn-opentui/actions/workflows/release.yml/badge.svg)](https://github.com/canadian-ai/shadcn-opentui/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**Inspectable shadcn/React terminal components for browser agent consoles, developer workflows, streaming output, commands, and approval UX.**

Shadcn OpenTUI brings OpenTUI-inspired interaction patterns into React and Next.js applications while keeping the installed source local, readable, and editable. It is an independent browser/web project, not the official native OpenTUI runtime.

- **Canonical repository:** [canadian-ai/shadcn-opentui](https://github.com/canadian-ai/shadcn-opentui)
- **Documentation:** [opentui.vercel.app/docs](https://opentui.vercel.app/docs)
- **Agent quickstart:** [opentui.vercel.app/docs/agents](https://opentui.vercel.app/docs/agents)
- **Issues and feature requests:** [canadian-ai/shadcn-opentui/issues](https://github.com/canadian-ai/shadcn-opentui/issues)

## Give this to your coding agent

Install the terminal directly:

```bash
npx shadcn@latest add https://opentui.vercel.app/r/terminal.json
```

Then prompt your agent with:

> Install Shadcn OpenTUI's terminal component, inspect the copied source, then build my requested terminal workflow with typed commands, streaming-friendly output, and explicit approval before destructive actions. Keep the source local and editable.

The component follows the shadcn copy-own-edit model, so an agent can inspect the exact implementation it is changing instead of programming against an opaque terminal widget.

## Why use it for agent interfaces?

- **Terminal-native sessions:** commands, history, completion, forms, menus, progress, tables, streaming text, edits, and status can live in one continuous developer surface.
- **Inspectable source:** installed components are copied into your app and remain editable by humans and coding agents.
- **Approval-friendly UX:** show a target and planned action before destructive or production-changing operations.
- **React-first:** use normal React state, props, and TypeScript inside a browser application.
- **Theme-aware:** explicit terminal theme context when desired, with a coherent dark fallback otherwise.

## Machine-readable agent entry points

Agents do not need to scrape the visual documentation first:

- [`/agent-index.json`](https://opentui.vercel.app/agent-index.json) — canonical map of agent resources
- [`/llms.txt`](https://opentui.vercel.app/llms.txt) — concise project context
- [`/llms-full.txt`](https://opentui.vercel.app/llms-full.txt) — expanded implementation and decision context
- [`/faq.json`](https://opentui.vercel.app/faq.json) — machine-readable FAQ
- [`/qa.json`](https://opentui.vercel.app/qa.json) — retrieval-friendly Q&A corpus
- [`/skills/shadcn-opentui/SKILL.md`](https://opentui.vercel.app/skills/shadcn-opentui/SKILL.md) — published agent skill
- [`AGENTS.md`](./AGENTS.md) — repository-level coding-agent instructions

## Current focus

- **Stable shadcn components:** installable terminal and terminal-oriented components from the Shadcn OpenTUI registry.
- **Agent and developer workflows:** browser consoles for coding, deployment, debugging, approvals, and other terminal-native product surfaces.
- **OpenTUI-to-shadcn codegen:** parser and generator research for translating practical OpenTUI TypeScript/TSX into inspectable web code.
- **Future runtime research:** Zig/WASM packages remain in-tree for later experimentation but are not required for normal component usage.

## Shadcn OpenTUI or termcn?

The key distinction is the render target.

| Choose | Best when |
| --- | --- |
| **Shadcn OpenTUI** | The terminal experience belongs inside a browser React/Next.js product: agent console, deploy/debug panel, in-app terminal, or approval flow. |
| **termcn** | You are building a native terminal application directly on Ink or OpenTUI and want components designed for terminal-runtime rendering. |

See the full [Shadcn OpenTUI vs termcn decision guide](https://opentui.vercel.app/docs/compare-termcn). The projects overlap in style and distribution ideas but are not one-to-one replacements.

## Basic usage

```tsx
import { Terminal } from "@/components/ui/terminal"

const commands = {
  status: {
    name: "status",
    description: "Show service status",
    handler: async (_args, context) => {
      context?.addLine?.("Service: healthy", "success")
    },
  },
}

export default function App() {
  return (
    <Terminal
      commands={commands}
      welcomeMessage={["Agent console ready", "Try: status"]}
    />
  )
}
```

## Registry

You can also register the full registry in `components.json`:

```json
{
  "registries": ["https://opentui.vercel.app/registry/index.json"]
}
```

Then install supported registry items with the shadcn CLI.

## Why Hunk matters

[Hunk](https://github.com/modem-dev/hunk), a review-first terminal diff viewer built on OpenTUI, is a useful validation target for the codegen track. A strong outcome is translating Hunk-like OpenTUI experiences into browser-viewable, inspectable shadcn/React code.

## Codegen track

The OpenTUI-to-shadcn generator starts with a custom grammar and intermediate representation. The initial goal is to translate a practical OpenTUI TSX subset into readable shadcn/React components, not to emulate the full native runtime.

See `lib/opentui-codegen/README.md` and `grammars/OpenTUIProgram.g4` for the current scaffold.

## Development

```bash
git clone https://github.com/canadian-ai/shadcn-opentui.git
cd shadcn-opentui
bun install
bun dev
```

Before making agent-oriented changes, also read [`AGENTS.md`](./AGENTS.md) and [`.agents/skills/shadcn-opentui/SKILL.md`](./.agents/skills/shadcn-opentui/SKILL.md).

## Future runtime research

The Zig/WASM code in `packages/web-core`, `packages/web-renderer`, and `packages/web-react` is kept for later browser-native runtime integration research. It is not required for the stable shadcn component or codegen workflow.

```bash
bun run build:web-runtime
bun run dev:web-runtime
```

## License

MIT

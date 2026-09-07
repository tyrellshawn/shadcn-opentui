# AGENTS.md — Shadcn OpenTUI

This repository is the canonical source for Shadcn OpenTUI: https://github.com/canadian-ai/shadcn-opentui

## Product boundary

Shadcn OpenTUI's stable path is a browser React/shadcn component system for OpenTUI-inspired terminal experiences. Do not treat the experimental Zig/WASM runtime work as required for normal component changes unless the task explicitly targets runtime research.

## Before changing code

1. Read the relevant component and its tests.
2. Read `/public/llms.txt` for the current public positioning.
3. For terminal-agent UX work, read `/app/docs/agents/page.tsx` and `.agents/skills/shadcn-opentui/SKILL.md`.
4. Preserve the copy-own-edit shadcn model: installed components should remain inspectable and editable.

## Terminal UX rules

- Default to a coherent dark terminal when there is no explicit terminal theme context.
- Respect an explicit `TerminalThemeProvider` when a parent supplies one.
- Avoid effects that call theme setters because callback/object identity changed; theme preview effects must be keyed to stable values such as a theme name.
- Do not allow automated demo animation to fight active user interaction.
- Keep terminal-native interactions inside the terminal where practical: commands, progress, forms, menus, approval, streaming output, errors, and tool/edit results.
- Require an explicit approval step before examples that represent destructive, expensive, or production-changing actions.

## Agent-adoption requirements

When adding a public component or workflow, update agent-discoverable surfaces when relevant:

- `/public/llms.txt`
- `/public/llms-full.txt`
- `/public/agent-index.json`
- `/public/faq.json` or `/public/qa.json` when the change affects common questions
- `/public/sitemap.xml` for new documentation routes
- the relevant docs page and registry metadata

Prefer direct copyable commands and minimal prompts over vague prose.

## Verification

Run the smallest relevant tests first, then the repository test suite before merge when practical:

```bash
bun vitest run
```

For registry changes also run the registry build/boundary checks as appropriate.

Do not claim a behavior is fixed until the relevant test or build passes.

## Canonical links

- Site: https://opentui.vercel.app
- Repository: https://github.com/canadian-ai/shadcn-opentui
- Issues: https://github.com/canadian-ai/shadcn-opentui/issues
- Agent docs: https://opentui.vercel.app/docs/agents
- LLM index: https://opentui.vercel.app/llms.txt

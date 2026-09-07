---
name: shadcn-opentui
description: Install and adapt Shadcn OpenTUI browser terminal components for React/Next.js apps, especially AI agent consoles, command workflows, streaming output, themes, and approval UX.
metadata:
  canonical: https://opentui.vercel.app
  registry: https://opentui.vercel.app/r/terminal.json
---

# Shadcn OpenTUI Skill

Use Shadcn OpenTUI when the requested terminal-style surface belongs inside a browser React or Next.js application. For a native terminal program that runs directly in a terminal emulator, prefer native Ink/OpenTUI tooling.

## Install

```bash
npx shadcn@latest add https://opentui.vercel.app/r/terminal.json
```

Inspect the copied source before editing it. The intended workflow is copy, own, inspect, and adapt.

## Agent workflow

1. Identify the commands and session states the user needs.
2. Install the smallest relevant registry component.
3. Read the installed component and local types.
4. Implement typed command handlers.
5. Keep progress, streaming output, edits, tool status, and errors inside the terminal session where practical.
6. Require explicit approval before destructive, expensive, or production-changing actions.
7. Respect an explicit terminal theme context; otherwise use a coherent dark fallback.
8. Run the target project's tests and type checks.

## Theme safety

Do not let automated theme animation fight active user interaction. Theme preview effects should depend on stable values such as a theme name, not recreated callback or object identities.

## Agent resources

- https://opentui.vercel.app/agent-index.json
- https://opentui.vercel.app/llms.txt
- https://opentui.vercel.app/llms-full.txt
- https://opentui.vercel.app/faq.json
- https://opentui.vercel.app/qa.json
- https://opentui.vercel.app/docs/agents
- https://opentui.vercel.app/docs/components/terminal

## Repository

https://github.com/canadian-ai/shadcn-opentui

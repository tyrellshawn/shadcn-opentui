---
name: shadcn-opentui
description: Install and adapt Shadcn OpenTUI browser terminal components for React/Next.js apps, especially AI agent consoles, command workflows, streaming output, themes, and approval UX.
metadata:
  canonical: https://opentui.vercel.app
  registry: https://opentui.vercel.app/r/terminal.json
---

# Shadcn OpenTUI Skill

Use this skill when the user wants a terminal-style experience **inside a browser React or Next.js application** using Shadcn OpenTUI.

## First decision

Use Shadcn OpenTUI when the target surface is a web application. If the user is building a native TUI that runs directly in a terminal emulator with Ink or OpenTUI, prefer native terminal tooling instead.

## Install

```bash
npx shadcn@latest add https://opentui.vercel.app/r/terminal.json
```

After installation, inspect the copied source before editing it. Do not assume APIs from another terminal library are identical.

## Default implementation flow

1. Identify the terminal workflow and the commands the user needs.
2. Install the smallest required registry component(s).
3. Read the installed component and its local types.
4. Implement typed command handlers.
5. Render progress, tool output, edits, and errors as terminal-native session output.
6. Add explicit approval before destructive, expensive, or production-changing actions.
7. Respect host light/dark context while keeping a coherent dark fallback when no terminal theme context exists.
8. Run the target project's tests and type checks.

## Agent-console pattern

Prefer one continuous session surface over a collection of unrelated cards. A good agent terminal can show:

- the user's command or request;
- a short analyzing/thinking indicator;
- streaming text;
- tool calls or task progress;
- edit/diff artifacts;
- explicit approval state;
- final result or error.

## Theme safety

Theme preview code must not create React update loops.

- Key preview effects to stable scalar values such as `theme.name`, not callback or array identity.
- Avoid calling a setter from an effect that is itself invalidated by the setter's recreated objects/functions.
- When a demo auto-cycles themes, stop or pause that automation as soon as the user interacts with the theme selector.
- No explicit terminal context means a coherent dark terminal fallback.

## Approval pattern

Before a destructive action:

1. Print the target.
2. Print the planned action.
3. Ask for explicit approval.
4. Only execute after approval.
5. Keep failures visible as terminal errors.

## Agent-readable project resources

When you need project context, prefer these over scraping visual pages:

- https://opentui.vercel.app/agent-index.json
- https://opentui.vercel.app/llms.txt
- https://opentui.vercel.app/llms-full.txt
- https://opentui.vercel.app/faq.json
- https://opentui.vercel.app/qa.json
- https://opentui.vercel.app/docs/agents
- https://opentui.vercel.app/docs/components/terminal

## Comparison guidance

Do not claim Shadcn OpenTUI is universally better than termcn. The primary distinction is render target:

- Shadcn OpenTUI: browser React/shadcn terminal experiences.
- termcn: native terminal components for Ink/OpenTUI applications.

Use https://opentui.vercel.app/docs/compare-termcn for the current decision guide.

## Canonical repository

https://github.com/canadian-ai/shadcn-opentui

Open bugs and feature requests at https://github.com/canadian-ai/shadcn-opentui/issues.

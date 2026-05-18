# Shadcn OpenTUI

[![Registry Build](https://github.com/tyrellshawn/shadcn-opentui/actions/workflows/registry-build.yml/badge.svg)](https://github.com/tyrellshawn/shadcn-opentui/actions/workflows/registry-build.yml)
[![Release](https://github.com/tyrellshawn/shadcn-opentui/actions/workflows/release.yml/badge.svg)](https://github.com/tyrellshawn/shadcn-opentui/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Independent shadcn/ui experiments for bringing OpenTUI-style terminal applications to the web.

This is not the official OpenTUI project. It started as a one-day experiment to explore an OpenTUI web adapter with React in mind, and is now focused on translating OpenTUI TypeScript applications into inspectable shadcn web code.

Upstream OpenTUI lives at [anomalyco/opentui](https://github.com/anomalyco/opentui).

## Current Focus

- **Stable shadcn components:** installable components from the Shadcn OpenTUI registry (`terminal`, `terminal-slider`, `terminal-controls`, CLI plugin helpers).
- **OpenTUI-to-shadcn codegen:** a parser and generator track for turning OpenTUI TypeScript/TSX programs into shadcn web components.
- **Future runtime research:** Zig/WASM code remains in-tree for a later browser-native runtime integration, but it is not the main product path today.

## Why Hunk Matters

The north-star validation example is [Hunk](https://github.com/modem-dev/hunk), a review-first terminal diff viewer built on OpenTUI. A good outcome for this project is being able to view a Hunk-like OpenTUI app on the web as generated shadcn code.

The first Hunk target is a static browser-viewable diff review example. Later milestones can parse more of Hunk's `src/opentui` components directly.

## Features

- Interactive terminal with command history and keyboard shortcuts
- OpenTUI-inspired forms, menus, and progress indicators
- Terminal-style sliders and controls
- TypeScript support with full type definitions
- Theme support for light and dark modes

## Installation

### Stable shadcn components

Add the registry to your `components.json`:

```json
{
  "registries": ["https://opentui.vercel.app/registry/index.json"]
}
```

Install components:

```bash
npx shadcn@latest add terminal
```

## Usage

```tsx
import { Terminal } from "@/components/ui/terminal"

export default function App() {
  return <Terminal title="My Terminal" />
}
```

## Codegen Track

The OpenTUI-to-shadcn generator starts with a custom grammar and an intermediate representation. The initial goal is to translate a practical OpenTUI TSX subset into readable shadcn/React components, not to emulate the full OpenTUI runtime.

See `lib/opentui-codegen/README.md` and `grammars/OpenTUIProgram.g4` for the current scaffold.

## Development

```bash
git clone https://github.com/tyrellshawn/shadcn-opentui.git
cd shadcn-opentui
bun install
bun dev
```

## Future Runtime Research

The Zig/WASM code in `packages/web-core`, `packages/web-renderer`, and `packages/web-react` is kept for a later browser-native runtime integration. It is not required for the current shadcn component or codegen workflow.

```bash
bun run build:web-runtime
bun run dev:web-runtime
```

Open `http://localhost:8090/packages/web-renderer/demo/index.html` when working on that research track.

## License

MIT

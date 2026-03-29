# Shadcn OpenTUI

[![Registry Build](https://github.com/tyrellshawn/shadcn-opentui/actions/workflows/registry-build.yml/badge.svg)](https://github.com/tyrellshawn/shadcn-opentui/actions/workflows/registry-build.yml)
[![Release](https://github.com/tyrellshawn/shadcn-opentui/actions/workflows/release.yml/badge.svg)](https://github.com/tyrellshawn/shadcn-opentui/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Terminal UI components for React built with shadcn/ui and OpenTUI.

## 🚀 Future Vision: True Web OpenTUI Runtime

This project is evolving from a React/DOM wrapper into a real, native OpenTUI WASM environment for the browser. Currently, `shadcn-opentui` uses a "dom-wrapper" strategy where components mimic the terminal using DOM elements (divs, spans). 

The new architecture introduces a true Zig-to-WASM rendering core so any OpenTUI app—not just terminal components—can run natively in the browser.

### The Turborepo Packages
We are restructuring into a monorepo to separate the native web renderer from the shadcn integration:
- `packages/web-core`: The OpenTUI Zig core compiled to `wasm32-freestanding` with a JS interop layer.
- `packages/web-renderer`: The canvas-based WebAssembly renderer that executes OpenTUI draw commands natively.
- `packages/web-react`: The React reconciler target for the browser renderer (similar to `@opentui/react` but for web surfaces).
- `apps/docs`: The shadcn UI wrapper and documentation site you see today.

*Status: The Zig WASM proof-of-concept is built and running. Rendering surface APIs are under active development.*

## Features

- Interactive terminal with command history and keyboard shortcuts
- OpenTUI integration for forms, menus, and progress indicators
- Terminal-style sliders and controls
- TypeScript support with full type definitions
- Theme support for light and dark modes

## Installation

Add the registry to your `components.json`:

\`\`\`json
{
  "registries": ["https://opentui.vercel.app/registry/index.json"]
}
\`\`\`

Install components:

\`\`\`bash
npx shadcn@latest add terminal
\`\`\`

## Usage

\`\`\`tsx
import { Terminal } from "@/components/ui/terminal"

export default function App() {
  return <Terminal title="My Terminal" />
}
\`\`\`

## Documentation

[https://opentui.vercel.app/docs](https://opentui.vercel.app/docs)

## Development

\`\`\`bash
git clone https://github.com/tyrellshawn/shadcn-opentui.git
cd shadcn-opentui
bun install
bun dev
\`\`\`

### Run the WASM runtime demo

\`\`\`bash
bun run build:web-runtime
bun run dev:web-runtime
\`\`\`

Open `http://localhost:8090/packages/web-renderer/demo/index.html`.

## License

MIT

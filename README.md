# Shadcn OpenTUI

[![Registry Build](https://github.com/tyrellshawn/shadcn-opentui/actions/workflows/registry-build.yml/badge.svg)](https://github.com/tyrellshawn/shadcn-opentui/actions/workflows/registry-build.yml)
[![Release](https://github.com/tyrellshawn/shadcn-opentui/actions/workflows/release.yml/badge.svg)](https://github.com/tyrellshawn/shadcn-opentui/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Terminal UI components for React built with shadcn/ui and OpenTUI.

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

## License

MIT

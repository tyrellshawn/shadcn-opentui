# Shadcn OpenTUI Terminal Component

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://opentui.vercel.app)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![OpenTUI](https://img.shields.io/badge/Powered%20by-OpenTUI-green?style=for-the-badge)](https://github.com/sst/opentui)

A powerful, interactive terminal component for React applications built with shadcn/ui and OpenTUI integration. Create beautiful terminal interfaces with command handling, interactive forms, ASCII art, and real-time system monitoring.

## 🌟 Features

### Core Terminal
- **Interactive Command Line**: Full-featured terminal with command history and tab completion
- **Custom Block Cursor**: Authentic terminal cursor with green blinking animation
- **Click-to-Focus**: Click anywhere in terminal to start typing
- **Keyboard Shortcuts**: Comprehensive keyboard navigation and shortcuts

### OpenTUI Integration
- **UI Mode**: Switch between command mode and interactive UI components
- **Form Handling**: Built-in login forms with validation and state management
- **Menu Navigation**: Interactive menus with keyboard navigation
- **Progress Indicators**: Real-time progress bars and loading states

### Advanced Components
- **Custom Sliders**: Terminal-style sliders with ASCII progress indicators
- **System Monitor**: Real-time CPU, memory, and disk usage simulation
- **File Manager**: Interactive file system navigation
- **ASCII Art Generator**: Create and display ASCII art with customizable styles

### Developer Experience
- **TypeScript Support**: Full TypeScript definitions and type safety
- **shadcn/ui Compatible**: Seamless integration with existing shadcn projects
- **Customizable Themes**: Support for light/dark modes and custom styling
- **Comprehensive Documentation**: Interactive docs with live examples

## 🚀 Quick Start

### Registry Setup

Add the OpenTUI registry to your `components.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "registries": [
    "https://opentui.vercel.app/registry/index.json"
  ]
}
```

### Installation

Install components using the shadcn CLI:

```bash
npx shadcn@latest add terminal
npx shadcn@latest add terminal-controls
npx shadcn@latest add terminal-slider
```

### Basic Usage

```tsx
import { Terminal } from "@/components/ui/terminal"

export default function App() {
  return (
    <Terminal
      title="My Terminal"
      onCommand={(command) => {
        console.log("Command executed:", command)
        return `Executed: ${command}`
      }}
    />
  )
}
```

### Advanced Usage with Custom Commands

```tsx
import { Terminal } from "@/components/ui/terminal"

const customCommands = {
  hello: (args: string[]) => `Hello, ${args[0] || 'World'}!`,
  time: () => new Date().toLocaleTimeString(),
  calc: (args: string[]) => {
    const [a, op, b] = args
    const result = eval(`${a} ${op} ${b}`)
    return `${a} ${op} ${b} = ${result}`
  }
}

export default function App() {
  return (
    <Terminal
      title="Advanced Terminal"
      commands={customCommands}
      variant="compact"
      showWelcome={true}
    />
  )
}
```

## 📚 Documentation

Visit our comprehensive documentation site for detailed guides, API references, and interactive examples:

**[https://opentui.vercel.app/docs](https://opentui.vercel.app/docs)**

### Documentation Sections

- **Getting Started**: Installation, quick start, and basic usage
- **Components**: Terminal, Command, and Interactive Examples
- **OpenTUI Integration**: Core concepts, React components, hooks & events
- **Examples**: Login forms, interactive menus, ASCII art generation
- **Advanced**: Custom components, system monitoring, file management

## 🎯 Use Cases

- **Development Tools**: Build CLI tools and development environments
- **System Monitoring**: Create real-time system dashboards
- **Interactive Tutorials**: Build engaging command-line tutorials
- **Admin Interfaces**: Create powerful admin panels with terminal aesthetics
- **Gaming**: Develop text-based games and interactive fiction
- **Educational**: Teach command-line concepts and programming

## 🛠️ Built With

- **[OpenTUI](https://github.com/sst/opentui)** - Terminal UI library by SST
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful UI components
- **[v0](https://v0.app)** - AI-powered development platform
- **[Next.js](https://nextjs.org/)** - React framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Clone the repository:
```bash
git clone https://github.com/tyrellshawn/shadcn-opentui.git
cd shadcn-opentui
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **SST Team** for creating OpenTUI
- **shadcn** for the amazing UI component library
- **Vercel** for hosting and the v0 platform
- **Contributors** who help improve this project

## 📞 Support

- **Documentation**: [https://opentui.vercel.app/docs](https://opentui.vercel.app/docs)
- **Issues**: [GitHub Issues](https://github.com/tyrellshawn/shadcn-opentui/issues)
- **Discussions**: [GitHub Discussions](https://github.com/tyrellshawn/shadcn-opentui/discussions)

---

**[Live Demo](https://opentui.vercel.app)** | **[Documentation](https://opentui.vercel.app/docs)** | **[GitHub](https://github.com/tyrellshawn/shadcn-opentui)**

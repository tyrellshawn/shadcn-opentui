// OpenTUI Plugin Creator
// A fluent API for building custom plugins

import type { OpenTUIPluginDefinition, PluginManifest, PluginRenderer } from "./types"
import type { TerminalCommand, TerminalMiddleware, OpenTUIRuntimeContext } from "../types"

type CommandHandler = (args: string[], context: OpenTUIRuntimeContext) => void | Promise<void>

interface PluginBuilder {
  // Metadata
  name(name: string): PluginBuilder
  version(version: string): PluginBuilder
  description(description: string): PluginBuilder
  author(author: string): PluginBuilder
  keywords(...keywords: string[]): PluginBuilder

  // Commands
  command(
    name: string,
    description: string,
    handler: CommandHandler,
    options?: Partial<Omit<TerminalCommand, "name" | "description" | "handler">>,
  ): PluginBuilder

  // Middleware
  middleware(fn: TerminalMiddleware): PluginBuilder

  // Renderers
  renderer(type: string, render: PluginRenderer["render"], supports?: PluginRenderer["supports"]): PluginBuilder

  // Lifecycle
  onInit(fn: (context: OpenTUIRuntimeContext) => void | Promise<void>): PluginBuilder
  onDestroy(fn: () => void | Promise<void>): PluginBuilder

  // Build
  build(): OpenTUIPluginDefinition
}

class PluginBuilderImpl implements PluginBuilder {
  private manifest: Partial<PluginManifest> = {}
  private commands: TerminalCommand[] = []
  private middlewares: TerminalMiddleware[] = []
  private renderers: PluginRenderer[] = []
  private initFn?: (context: OpenTUIRuntimeContext) => void | Promise<void>
  private destroyFn?: () => void | Promise<void>

  name(name: string): PluginBuilder {
    this.manifest.name = name
    return this
  }

  version(version: string): PluginBuilder {
    this.manifest.version = version
    return this
  }

  description(description: string): PluginBuilder {
    this.manifest.description = description
    return this
  }

  author(author: string): PluginBuilder {
    this.manifest.author = author
    return this
  }

  keywords(...keywords: string[]): PluginBuilder {
    this.manifest.keywords = keywords
    return this
  }

  command(
    name: string,
    description: string,
    handler: CommandHandler,
    options?: Partial<Omit<TerminalCommand, "name" | "description" | "handler">>,
  ): PluginBuilder {
    this.commands.push({
      name,
      description,
      handler,
      ...options,
    })
    return this
  }

  middleware(fn: TerminalMiddleware): PluginBuilder {
    this.middlewares.push(fn)
    return this
  }

  renderer(type: string, render: PluginRenderer["render"], supports?: PluginRenderer["supports"]): PluginBuilder {
    this.renderers.push({ type, render, supports })
    return this
  }

  onInit(fn: (context: OpenTUIRuntimeContext) => void | Promise<void>): PluginBuilder {
    this.initFn = fn
    return this
  }

  onDestroy(fn: () => void | Promise<void>): PluginBuilder {
    this.destroyFn = fn
    return this
  }

  build(): OpenTUIPluginDefinition {
    if (!this.manifest.name) {
      throw new Error("Plugin name is required")
    }

    return {
      name: this.manifest.name,
      version: this.manifest.version || "1.0.0",
      description: this.manifest.description || "",
      author: this.manifest.author,
      keywords: this.manifest.keywords,
      commands: this.commands.length > 0 ? this.commands : undefined,
      middleware: this.middlewares.length > 0 ? this.middlewares : undefined,
      renderers: this.renderers.length > 0 ? this.renderers : undefined,
      onInit: this.initFn,
      onDestroy: this.destroyFn,
    }
  }
}

// Factory function
export function createPlugin(): PluginBuilder {
  return new PluginBuilderImpl()
}

// ============================================
// Example Plugin Templates
// ============================================

// Example: Custom greeting plugin
export const exampleGreetingPlugin = createPlugin()
  .name("greeting")
  .version("1.0.0")
  .description("A friendly greeting plugin")
  .keywords("greeting", "hello", "welcome")
  .command("hello", "Say hello to someone", (args, ctx) => {
    const name = args[0] || "World"
    ctx.addLine(`Hello, ${name}! 👋`, "success")
  })
  .command("goodbye", "Say goodbye", (args, ctx) => {
    ctx.addLine("Goodbye! See you soon! 👋", "success")
  })
  .onInit((ctx) => {
    console.log("Greeting plugin initialized")
  })
  .build()

// Example: File system simulation plugin
export const exampleFileSystemPlugin = createPlugin()
  .name("filesystem")
  .version("1.0.0")
  .description("Simulated file system commands")
  .keywords("files", "directory", "ls", "cat")
  .command(
    "ls",
    "List files in current directory",
    (args, ctx) => {
      ctx.addLine("drwxr-xr-x  2 user  staff    64 Jan  1 12:00 documents/")
      ctx.addLine("drwxr-xr-x  3 user  staff    96 Jan  1 12:00 projects/")
      ctx.addLine("-rw-r--r--  1 user  staff  1024 Jan  1 12:00 readme.md")
      ctx.addLine("-rw-r--r--  1 user  staff   512 Jan  1 12:00 config.json")
    },
    { aliases: ["dir", "list"] },
  )
  .command("cat", "Display file contents", (args, ctx) => {
    const file = args[0]
    if (!file) {
      ctx.addLine("Usage: cat <filename>", "error")
      return
    }
    ctx.addLine(`# Contents of ${file}`, "success")
    ctx.addLine("This is simulated file content.")
    ctx.addLine("In a real implementation, this would read from storage.")
  })
  .command("pwd", "Print working directory", (args, ctx) => {
    ctx.addLine("/home/user/opentui", "success")
  })
  .build()

// Example: Math plugin with operations
export const exampleMathPlugin = createPlugin()
  .name("math")
  .version("1.0.0")
  .description("Mathematical operations")
  .keywords("math", "calculate", "numbers")
  .command(
    "calc",
    "Perform calculations",
    (args, ctx) => {
      const expression = args.join(" ")
      if (!expression) {
        ctx.addLine("Usage: calc <expression>", "error")
        ctx.addLine("Example: calc 2 + 2")
        return
      }
      try {
        // Safe evaluation (in production, use a proper math parser)
        const sanitized = expression.replace(/[^0-9+\-*/().% ]/g, "")
        const result = Function(`"use strict"; return (${sanitized})`)()
        ctx.addLine(`${expression} = ${result}`, "success")
      } catch {
        ctx.addLine(`Error evaluating: ${expression}`, "error")
      }
    },
    { aliases: ["calculate", "math"] },
  )
  .command("random", "Generate random number", (args, ctx) => {
    const min = Number.parseInt(args[0], 10) || 1
    const max = Number.parseInt(args[1], 10) || 100
    const result = Math.floor(Math.random() * (max - min + 1)) + min
    ctx.addLine(`Random number (${min}-${max}): ${result}`, "success")
  })
  .build()

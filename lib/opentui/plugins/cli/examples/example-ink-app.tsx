// Example Ink Application for OpenTUI
// Demonstrates how to create CLI apps using the builder API

import { createCLIApp, createCommand } from "../create-cli-app"
import type { CLIAppContext } from "../types"

/**
 * Example: Simple File Browser App
 * 
 * This demonstrates how to create an Ink-based CLI application
 * that integrates with OpenTUI.
 */

// Define the component (would use Ink components in a real implementation)
const FileBrowserComponent = ({ terminal, args, exit }: CLIAppContext) => {
  // In a real Ink app, you would use Ink's hooks and components:
  // import { Box, Text, useInput } from 'ink'
  
  // For this example, we'll simulate the behavior
  const path = args[0] || "."
  
  // Simulate rendering
  terminal.writeLine(`File Browser - ${path}`, "system")
  terminal.writeLine("", "output")
  terminal.writeLine("  documents/", "output")
  terminal.writeLine("  projects/", "output")
  terminal.writeLine("  readme.md", "output")
  terminal.writeLine("", "output")
  terminal.writeLine("Press 'q' to exit", "system")
  
  // Set up keyboard handler
  const unsubscribe = terminal.onKeyPress((key) => {
    if (key === "q") {
      unsubscribe()
      exit(0)
    }
  })
  
  // Return null since we're using the terminal bridge directly
  return null
}

/**
 * File Browser App Definition
 */
export const fileBrowserApp = createCLIApp()
  .name("file-browser")
  .version("1.0.0")
  .description("Interactive file browser for the terminal")
  .author("OpenTUI Team")
  .keywords("files", "browser", "navigation")
  .forInk(">=6.6.0")
  .requiresInput()
  .entryCommand("browse")
  .command(
    createCommand("browse")
      .description("Browse files in a directory")
      .arg("path", { description: "Directory to browse", default: "." })
      .booleanFlag("hidden", { char: "a", description: "Show hidden files" })
      .stringFlag("sort", { char: "s", description: "Sort by", choices: ["name", "date", "size"], default: "name" })
      .example("browse /home/user")
      .example("browse . -a")
      .build()
  )
  .onBeforeStart((ctx) => {
    ctx.terminal.writeLine("Starting file browser...", "system")
  })
  .onExit((code) => {
    console.log(`File browser exited with code ${code}`)
  })
  .component(FileBrowserComponent)
  .build()

/**
 * Example: System Monitor App
 */
const SystemMonitorComponent = ({ terminal, exit }: CLIAppContext) => {
  let running = true
  let updateInterval: ReturnType<typeof setInterval>
  
  const render = () => {
    if (!running) return
    
    const cpu = Math.floor(Math.random() * 100)
    const memory = Math.floor(Math.random() * 100)
    const uptime = Math.floor(Date.now() / 1000) % 10000
    
    terminal.updateLine(
      `CPU: ${cpu.toString().padStart(3)}% | Memory: ${memory.toString().padStart(3)}% | Uptime: ${uptime}s`
    )
  }
  
  // Initial render
  terminal.writeLine("System Monitor", "system")
  terminal.writeLine("Press 'q' to exit", "output")
  terminal.writeLine("", "output")
  terminal.write("Loading...")
  
  // Update every second
  updateInterval = setInterval(render, 1000)
  render()
  
  // Keyboard handler
  const unsubscribe = terminal.onKeyPress((key) => {
    if (key === "q") {
      running = false
      clearInterval(updateInterval)
      unsubscribe()
      exit(0)
    }
  })
  
  return null
}

export const systemMonitorApp = createCLIApp()
  .name("sysmon")
  .version("1.0.0")
  .description("Real-time system monitor")
  .forInk(">=6.6.0")
  .requiresInput()
  .component(SystemMonitorComponent)
  .build()

/**
 * Example: Todo List App
 */
const TodoListComponent = ({ terminal, flags, exit }: CLIAppContext) => {
  const todos = [
    { id: 1, text: "Learn OpenTUI", done: true },
    { id: 2, text: "Build CLI apps", done: false },
    { id: 3, text: "Deploy to production", done: false },
  ]
  
  let selectedIndex = 0
  
  const render = () => {
    terminal.clear()
    terminal.writeLine("Todo List", "system")
    terminal.writeLine("─".repeat(40), "output")
    
    todos.forEach((todo, index) => {
      const prefix = index === selectedIndex ? "> " : "  "
      const checkbox = todo.done ? "[x]" : "[ ]"
      const type = todo.done ? "success" : "output"
      terminal.writeLine(`${prefix}${checkbox} ${todo.text}`, type as "success" | "output")
    })
    
    terminal.writeLine("", "output")
    terminal.writeLine("↑/↓: Navigate | Space: Toggle | q: Quit", "system")
  }
  
  render()
  
  const unsubscribe = terminal.onKeyPress((key, modifiers) => {
    switch (key) {
      case "ArrowUp":
        selectedIndex = Math.max(0, selectedIndex - 1)
        render()
        break
      case "ArrowDown":
        selectedIndex = Math.min(todos.length - 1, selectedIndex + 1)
        render()
        break
      case " ":
        todos[selectedIndex].done = !todos[selectedIndex].done
        render()
        break
      case "q":
        unsubscribe()
        exit(0)
        break
    }
  })
  
  return null
}

export const todoListApp = createCLIApp()
  .name("todo")
  .version("1.0.0")
  .description("Simple todo list manager")
  .forInk(">=6.6.0")
  .requiresInput()
  .requiresFullscreen()
  .addCommand("list", "List all todos", (args, flags, ctx) => {
    ctx.terminal.writeLine("Todos:", "system")
    ctx.terminal.writeLine("1. [x] Learn OpenTUI", "success")
    ctx.terminal.writeLine("2. [ ] Build CLI apps", "output")
  })
  .addCommand("add", "Add a new todo", (args, flags, ctx) => {
    const text = args.join(" ")
    if (text) {
      ctx.terminal.writeLine(`Added: ${text}`, "success")
    } else {
      ctx.terminal.writeLine("Usage: todo add <text>", "error")
    }
  })
  .component(TodoListComponent)
  .build()

/**
 * Collection of example apps
 */
export const exampleApps = {
  fileBrowser: fileBrowserApp,
  systemMonitor: systemMonitorApp,
  todoList: todoListApp,
}

export default exampleApps

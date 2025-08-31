"use client"

import React, { useState, useRef, useCallback, useContext, createContext } from "react"
import { cn } from "@/lib/utils"

interface TerminalLine {
  id: string
  type: "input" | "output" | "error" | "success"
  content: string
  timestamp: Date
}

interface TerminalCommand {
  name: string
  description: string
  handler: (args: string[], context?: any) => Promise<void> | void
  category?: "system" | "ui" | "data" | "custom"
  requiresUI?: boolean
}

interface TerminalProps extends React.HTMLAttributes<HTMLDivElement> {
  prompt?: string
  welcomeMessage?: string[]
  commands?: TerminalCommand[]
  onCommand?: (command: string, args: string[]) => Promise<void> | void
  maxLines?: number
  showTimestamp?: boolean
  variant?: "default" | "compact" | "minimal"
}

interface TerminalUIComponent {
  id: string
  type: "form" | "menu" | "slider" | "progress" | "table" | "chart"
  props: Record<string, any>
  active: boolean
}

interface TerminalState {
  mode: "command" | "ui" | "form"
  activeComponent?: TerminalUIComponent
  formData: Record<string, any>
  menuSelection: number
}

interface OpenTUIContext {
  state: TerminalState
  setState: React.Dispatch<React.SetStateAction<TerminalState>>
  addUIComponent: (component: TerminalUIComponent) => void
  removeUIComponent: (id: string) => void
  updateFormData: (key: string, value: any) => void
}

const OpenTUIContext = createContext<OpenTUIContext | null>(null)

export const useOpenTUI = () => {
  const context = useContext(OpenTUIContext)
  if (!context) {
    throw new Error("useOpenTUI must be used within an OpenTUI provider")
  }
  return context
}

const createBuiltInCommands = (
  addLine: (content: string, type?: TerminalLine["type"]) => void,
  clearLines: () => void,
  commandHistory: string[],
  opentuiContext?: OpenTUIContext,
): TerminalCommand[] => [
  {
    name: "clear",
    description: "Clear the terminal screen",
    handler: () => clearLines(),
  },
  {
    name: "help",
    description: "Show available commands",
    handler: () => {
      addLine("Available commands:", "success")
      addLine("  clear      - Clear the terminal screen")
      addLine("  help       - Show this help message")
      addLine("  history    - Show command history")
      addLine("  date       - Show current date and time")
      addLine("  opentui    - Show OpenTUI information")
      addLine("  ui         - Enter UI mode for interactive components")
      addLine("  form       - Create an interactive form")
      addLine("  menu       - Create an interactive menu")
      addLine("  progress   - Show a progress bar")
      addLine("  ascii      - Generate ASCII art")
      addLine("  table      - Display data in table format")
    },
  },
  {
    name: "history",
    description: "Show command history",
    handler: () => {
      if (commandHistory.length === 0) {
        addLine("No commands in history")
        return
      }
      addLine("Command history:", "success")
      commandHistory.forEach((cmd, index) => {
        addLine(`  ${(index + 1).toString().padStart(3)} ${cmd}`)
      })
    },
  },
  {
    name: "date",
    description: "Show current date and time",
    handler: () => {
      addLine(new Date().toLocaleString(), "success")
    },
  },
  {
    name: "opentui",
    description: "Show OpenTUI information",
    category: "system",
    handler: () => {
      addLine("🚀 OpenTUI Terminal Component", "success")
      addLine("Built with React and shadcn/ui")
      addLine("GitHub: https://github.com/sst/opentui")
      addLine("Type 'help' for available commands")
    },
  },
  {
    name: "ui",
    description: "Enter UI mode for interactive components",
    category: "ui",
    requiresUI: true,
    handler: (args) => {
      if (!opentuiContext) {
        addLine("OpenTUI context not available", "error")
        return
      }

      const [componentType] = args
      if (!componentType) {
        addLine("Available UI components: form, menu, slider, progress", "success")
        addLine("Usage: ui <component-type>")
        return
      }

      opentuiContext.setState((prev) => ({
        ...prev,
        mode: "ui",
        activeComponent: {
          id: `ui-${Date.now()}`,
          type: componentType as any,
          props: {},
          active: true,
        },
      }))

      addLine(`Entering ${componentType} UI mode...`, "success")
      addLine("Press ESC to return to command mode")
    },
  },
  {
    name: "form",
    description: "Create an interactive form",
    category: "ui",
    requiresUI: true,
    handler: (args) => {
      if (!opentuiContext) {
        addLine("OpenTUI context not available", "error")
        return
      }

      const formFields = args.length > 0 ? args : ["name", "email"]

      opentuiContext.setState((prev) => ({
        ...prev,
        mode: "form",
        activeComponent: {
          id: `form-${Date.now()}`,
          type: "form",
          props: { fields: formFields },
          active: true,
        },
      }))

      addLine(`Creating form with fields: ${formFields.join(", ")}`, "success")
      addLine("Use TAB to navigate, ENTER to submit, ESC to cancel")
    },
  },
  {
    name: "menu",
    description: "Create an interactive menu",
    category: "ui",
    requiresUI: true,
    handler: (args) => {
      if (!opentuiContext) {
        addLine("OpenTUI context not available", "error")
        return
      }

      const menuItems = args.length > 0 ? args : ["Option 1", "Option 2", "Option 3"]

      opentuiContext.setState((prev) => ({
        ...prev,
        mode: "ui",
        activeComponent: {
          id: `menu-${Date.now()}`,
          type: "menu",
          props: { items: menuItems },
          active: true,
        },
        menuSelection: 0,
      }))

      addLine(`Creating menu with options: ${menuItems.join(", ")}`, "success")
      addLine("Use ↑↓ arrows to navigate, ENTER to select, ESC to cancel")
    },
  },
  {
    name: "progress",
    description: "Show a progress bar",
    category: "ui",
    handler: async (args) => {
      const duration = Number.parseInt(args[0]) || 3000
      const steps = 20
      const stepDuration = duration / steps

      addLine("Starting progress...", "success")

      for (let i = 0; i <= steps; i++) {
        const percent = Math.round((i / steps) * 100)
        const filled = "█".repeat(i)
        const empty = "░".repeat(steps - i)
        const bar = `[${filled}${empty}] ${percent}%`

        addLine(`Progress: ${bar}`, "output")

        if (i < steps) {
          await new Promise((resolve) => setTimeout(resolve, stepDuration))
        }
      }

      addLine("Progress complete!", "success")
    },
  },
  {
    name: "ascii",
    description: "Generate ASCII art",
    category: "ui",
    handler: (args) => {
      const text = args.join(" ") || "OpenTUI"
      addLine("Generating ASCII art...", "success")

      // Simple ASCII art generator
      const asciiArt = [
        "  ___                   _____ _   _ ___ ",
        " / _ \\ _ __   ___ _ __  |_   _| | | |_ _|",
        "| | | | '_ \\ / _ \\ '_ \\   | | | | | || | ",
        "| |_| | |_) |  __/ | | |  | | | |_| || | ",
        " \\___/| .__/ \\___|_| |_|  |_|  \\___/|___|",
        "      |_|                               ",
      ]

      asciiArt.forEach((line) => addLine(line, "success"))
    },
  },
  {
    name: "table",
    description: "Display data in table format",
    category: "data",
    handler: (args) => {
      const sampleData = [
        ["Name", "Age", "City"],
        ["Alice", "25", "New York"],
        ["Bob", "30", "San Francisco"],
        ["Charlie", "35", "Chicago"],
      ]

      addLine("Sample Data Table:", "success")
      sampleData.forEach((row, index) => {
        const formattedRow = row.map((cell) => cell.padEnd(12)).join(" | ")
        addLine(index === 0 ? `| ${formattedRow} |` : `| ${formattedRow} |`, "output")
        if (index === 0) {
          addLine(`|${"-".repeat(formattedRow.length + 2)}|`, "output")
        }
      })
    },
  },
]

const Terminal = React.forwardRef<HTMLDivElement, TerminalProps>(
  (
    {
      className,
      prompt = "user@terminal:~$",
      welcomeMessage = ["Welcome to OpenTUI Terminal", "Type 'help' for available commands"],
      commands = [],
      onCommand,
      maxLines = 1000,
      showTimestamp = false,
      variant = "default",
      ...props
    },
    ref,
  ) => {
    const [lines, setLines] = useState<TerminalLine[]>(() =>
      welcomeMessage.map((content, index) => ({
        id: `welcome-${index}`,
        type: "output" as const,
        content,
        timestamp: new Date(),
      })),
    )

    const [currentInput, setCurrentInput] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)
    const [commandHistory, setCommandHistory] = useState<string[]>([])
    const [historyIndex, setHistoryIndex] = useState(-1)
    const [cursorPosition, setCursorPosition] = useState(0)

    const inputRef = useRef<HTMLInputElement>(null)
    const terminalRef = useRef<HTMLDivElement>(null)
    const lineIdCounter = useRef(0)

    const [opentuiState, setOpentuiState] = useState<TerminalState>({
      mode: "command",
      formData: {},
      menuSelection: 0,
    })

    const opentuiContext: OpenTUIContext = {
      state: opentuiState,
      setState: setOpentuiState,
      addUIComponent: (component) => {
        setOpentuiState((prev) => ({
          ...prev,
          activeComponent: component,
        }))
      },
      removeUIComponent: (id) => {
        setOpentuiState((prev) => ({
          ...prev,
          activeComponent: prev.activeComponent?.id === id ? undefined : prev.activeComponent,
        }))
      },
      updateFormData: (key, value) => {
        setOpentuiState((prev) => ({
          ...prev,
          formData: { ...prev.formData, [key]: value },
        }))
      },
    }

    const addLine = useCallback(
      (content: string, type: TerminalLine["type"] = "output") => {
        const newLine: TerminalLine = {
          id: `line-${lineIdCounter.current++}`,
          type,
          content,
          timestamp: new Date(),
        }

        setLines((prev) => {
          const newLines = [...prev, newLine]
          return newLines.length > maxLines ? newLines.slice(-maxLines) : newLines
        })
      },
      [maxLines],
    )

    const clearLines = useCallback(() => {
      setLines([])
    }, [])

    const builtInCommands = createBuiltInCommands(addLine, clearLines, commandHistory, opentuiContext)
    const allCommands = [...builtInCommands, ...commands]

    const processCommand = useCallback(
      async (input: string) => {
        const [commandName, ...args] = input.trim().split(/\s+/)
        const command = allCommands.find((cmd) => cmd.name === commandName)

        if (command) {
          try {
            await command.handler(args, opentuiContext)
          } catch (error) {
            addLine(
              `Error executing ${commandName}: ${error instanceof Error ? error.message : "Unknown error"}`,
              "error",
            )
          }
        } else if (onCommand) {
          try {
            await onCommand(input, args)
          } catch (error) {
            addLine(`Error: ${error instanceof Error ? error.message : "Unknown error"}`, "error")
          }
        } else {
          addLine(`Command not found: ${commandName}`, "error")
          addLine("Type 'help' for available commands")
        }
      },
      [onCommand, addLine],
    )

    const handleCommand = async (command: string) => {
      if (!command.trim()) return

      setCommandHistory((prev) => [...prev, command])
      setHistoryIndex(-1)

      const inputLine = showTimestamp
        ? `[${new Date().toLocaleTimeString()}] ${prompt} ${command}`
        : `${prompt} ${command}`

      addLine(inputLine, "input")
      setCurrentInput("")
      setIsProcessing(true)

      try {
        await processCommand(command)
      } finally {
        setIsProcessing(false)
        setTimeout(() => {
          inputRef.current?.focus()
        }, 0)
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (opentuiState.mode === "ui" && opentuiState.activeComponent?.type === "menu") {
        if (e.key === "ArrowUp") {
          e.preventDefault()
          setOpentuiState((prev) => ({
            ...prev,
            menuSelection: Math.max(0, prev.menuSelection - 1),
          }))
          return
        } else if (e.key === "ArrowDown") {
          e.preventDefault()
          const maxItems = opentuiState.activeComponent?.props.items?.length || 0
          setOpentuiState((prev) => ({
            ...prev,
            menuSelection: Math.min(maxItems - 1, prev.menuSelection + 1),
          }))
          return
        } else if (e.key === "Enter") {
          e.preventDefault()
          const selectedItem = opentuiState.activeComponent?.props.items?.[opentuiState.menuSelection]
          if (selectedItem) {
            addLine(`Selected: ${selectedItem}`, "success")
            setOpentuiState((prev) => ({ ...prev, mode: "command", activeComponent: undefined }))
          }
          return
        }
      }

      if (e.key === "Escape" && opentuiState.mode !== "command") {
        e.preventDefault()
        setOpentuiState((prev) => ({ ...prev, mode: "command", activeComponent: undefined }))
        addLine("Exited UI mode", "success")
        return
      }

      setTimeout(() => {
        if (inputRef.current) {
          setCursorPosition(inputRef.current.selectionStart || 0)
        }
      }, 0)

      if (e.key === "Enter") {
        e.preventDefault()
        handleCommand(currentInput)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        if (commandHistory.length > 0) {
          const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
          setHistoryIndex(newIndex)
          setCurrentInput(commandHistory[newIndex])
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        if (historyIndex !== -1) {
          const newIndex = historyIndex + 1
          if (newIndex >= commandHistory.length) {
            setHistoryIndex(-1)
            setCurrentInput("")
          } else {
            setHistoryIndex(newIndex)
            setCurrentInput(commandHistory[newIndex])
          }
        }
      } else if (e.key === "Tab") {
        e.preventDefault()
        const commandNames = allCommands.map((cmd) => cmd.name)
        const matches = commandNames.filter((cmd) => cmd.startsWith(currentInput))

        if (matches.length === 1) {
          setCurrentInput(matches[0])
        } else if (matches.length > 1) {
          addLine(`Available completions: ${matches.join(", ")}`, "success")
        }
      } else if (e.key === "l" && e.ctrlKey) {
        e.preventDefault()
        clearLines()
      }
    }

    const renderUIComponent = () => {
      if (!opentuiState.activeComponent) return null

      const { type, props } = opentuiState.activeComponent

      switch (type) {
        case "menu":
          return (
            <div className="border border-green-400/20 rounded p-2 mb-2 bg-black/50">
              <div className="text-green-400 text-xs mb-2">MENU (Use ↑↓ arrows, ENTER to select)</div>
              {props.items?.map((item: string, index: number) => (
                <div
                  key={index}
                  className={cn(
                    "px-2 py-1 font-mono text-sm",
                    index === opentuiState.menuSelection ? "bg-green-400 text-black" : "text-green-400",
                  )}
                >
                  {index === opentuiState.menuSelection ? "► " : "  "}
                  {item}
                </div>
              ))}
            </div>
          )
        case "form":
          return (
            <div className="border border-green-400/20 rounded p-2 mb-2 bg-black/50">
              <div className="text-green-400 text-xs mb-2">FORM (TAB to navigate, ENTER to submit)</div>
              {props.fields?.map((field: string, index: number) => (
                <div key={index} className="mb-2">
                  <label className="text-green-400 text-sm block mb-1">{field}:</label>
                  <input
                    type="text"
                    className="w-full bg-transparent border border-green-400/20 rounded px-2 py-1 text-green-400 font-mono text-sm focus:border-green-400 outline-none"
                    placeholder={`Enter ${field}`}
                  />
                </div>
              ))}
            </div>
          )
        default:
          return null
      }
    }

    const getVariantStyles = () => {
      switch (variant) {
        case "compact":
          return "p-2 text-xs"
        case "minimal":
          return "p-3 border-0 shadow-none"
        default:
          return "p-4 text-sm shadow-2xl shadow-green-400/10"
      }
    }

    const getHeightClass = () => {
      switch (variant) {
        case "compact":
          return "h-64"
        case "minimal":
          return "h-48"
        default:
          return "h-96"
      }
    }

    return (
      <OpenTUIContext.Provider value={opentuiContext}>
        <div
          ref={ref}
          className={cn(
            "bg-black text-green-400 font-mono rounded-lg border border-border overflow-hidden",
            getVariantStyles(),
            className,
          )}
          onClick={() => {
            if (inputRef.current && !isProcessing) {
              inputRef.current.focus()
            }
          }}
          {...props}
        >
          {variant !== "minimal" && (
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-green-400/20">
              <div className="text-green-400 text-xs font-semibold">
                OpenTUI Terminal {opentuiState.mode !== "command" && `- ${opentuiState.mode.toUpperCase()} MODE`}
              </div>
              <div className="text-green-400/60 text-xs">Ctrl+L to clear</div>
            </div>
          )}

          <div
            ref={terminalRef}
            className={cn(
              "overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground scrollbar-track-transparent",
              getHeightClass(),
            )}
            onClick={(e) => {
              e.stopPropagation()
              if (inputRef.current && !isProcessing) {
                inputRef.current.focus()
              }
            }}
          >
            {lines.map((line) => (
              <div
                key={line.id}
                className={cn(
                  "whitespace-pre-wrap break-words leading-relaxed mb-1",
                  line.type === "input" && "text-white font-semibold",
                  line.type === "error" && "text-red-400",
                  line.type === "success" && "text-emerald-400",
                  line.type === "output" && "text-green-400",
                )}
              >
                {line.content}
              </div>
            ))}

            {renderUIComponent()}

            <div className="flex items-center text-white mt-1 relative">
              <span className="text-green-400 mr-2 font-bold shrink-0">{prompt}</span>
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={(e) => {
                    setCurrentInput(e.target.value)
                    setCursorPosition(e.target.selectionStart || 0)
                  }}
                  onKeyDown={handleKeyDown}
                  onSelect={() => {
                    if (inputRef.current) {
                      setCursorPosition(inputRef.current.selectionStart || 0)
                    }
                  }}
                  onClick={() => {
                    if (inputRef.current) {
                      setCursorPosition(inputRef.current.selectionStart || 0)
                    }
                  }}
                  disabled={isProcessing}
                  className="w-full bg-transparent border-none outline-none text-white font-mono caret-transparent"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder={
                    isProcessing
                      ? "Processing..."
                      : opentuiState.mode !== "command"
                        ? `${opentuiState.mode.toUpperCase()} mode - ESC to exit`
                        : "Type a command..."
                  }
                />
                <div
                  className="absolute top-0 w-2 h-5 bg-green-400 pointer-events-none"
                  style={{
                    left: `${cursorPosition * 0.6}em`,
                    animation: "blink 1s infinite",
                  }}
                />
              </div>
              {isProcessing && <span className="ml-2 text-yellow-400 animate-pulse">⚡</span>}
            </div>
          </div>

          <style jsx>{`
            @keyframes blink {
              0%, 50% { opacity: 1; }
              51%, 100% { opacity: 0; }
            }
          `}</style>
        </div>
      </OpenTUIContext.Provider>
    )
  },
)

Terminal.displayName = "Terminal"

export { Terminal }
export type { TerminalProps, TerminalLine, TerminalCommand, OpenTUIContext }

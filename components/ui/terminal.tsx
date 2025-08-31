"use client"

import React, { useState, useRef, useCallback } from "react"
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
  handler: (args: string[]) => Promise<void> | void
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

const createBuiltInCommands = (
  addLine: (content: string, type?: TerminalLine["type"]) => void,
  clearLines: () => void,
  commandHistory: string[],
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
    handler: () => {
      addLine("🚀 OpenTUI Terminal Component", "success")
      addLine("Built with React and shadcn/ui")
      addLine("GitHub: https://github.com/sst/opentui")
      addLine("Type 'help' for available commands")
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

    const builtInCommands = createBuiltInCommands(addLine, clearLines, commandHistory)
    const allCommands = [...builtInCommands, ...commands]

    const processCommand = useCallback(
      async (input: string) => {
        const [commandName, ...args] = input.trim().split(/\s+/)
        const command = allCommands.find((cmd) => cmd.name === commandName)

        if (command) {
          try {
            await command.handler(args)
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
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
            <div className="text-green-400 text-xs font-semibold">OpenTUI Terminal</div>
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
                placeholder={isProcessing ? "Processing..." : "Type a command..."}
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
    )
  },
)

Terminal.displayName = "Terminal"

export { Terminal }
export type { TerminalProps, TerminalLine, TerminalCommand }

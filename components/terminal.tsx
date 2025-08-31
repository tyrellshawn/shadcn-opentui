"use client"

import React, { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface OpenTUITerminalProps extends React.HTMLAttributes<HTMLDivElement> {
  prompt?: string
  onCommand?: (command: string) => void | Promise<void>
  initialOutput?: string[]
}

interface TerminalLine {
  type: "input" | "output" | "error"
  content: string
  timestamp?: Date
}

const OpenTUITerminal = React.forwardRef<HTMLDivElement, OpenTUITerminalProps>(
  ({ className, prompt = "user@terminal:~$", onCommand, initialOutput = [], ...props }, ref) => {
    const [lines, setLines] = useState<TerminalLine[]>(() =>
      initialOutput.map((content) => ({ type: "output" as const, content })),
    )
    const [currentInput, setCurrentInput] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)
    const [commandHistory, setCommandHistory] = useState<string[]>([])
    const [historyIndex, setHistoryIndex] = useState(-1)
    const [cursorPosition, setCursorPosition] = useState(0)
    const inputRef = useRef<HTMLInputElement>(null)
    const terminalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (inputRef.current && !isProcessing) {
        inputRef.current.focus()
      }
    }, [isProcessing])

    useEffect(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight
      }
    }, [lines])

    const addLine = (content: string, type: TerminalLine["type"] = "output") => {
      setLines((prev) => [...prev, { type, content, timestamp: new Date() }])
    }

    const handleCommand = async (command: string) => {
      if (!command.trim()) return

      setCommandHistory((prev) => [...prev, command])
      setHistoryIndex(-1)

      addLine(`${prompt} ${command}`, "input")
      setCurrentInput("")
      setIsProcessing(true)

      try {
        if (command === "clear") {
          setLines([])
        } else if (command === "help") {
          addLine("Available commands:")
          addLine("  clear    - Clear the terminal")
          addLine("  help     - Show this help message")
          addLine("  history  - Show command history")
          addLine("  date     - Show current date and time")
          addLine("  opentui  - Show OpenTUI info")
        } else if (command === "history") {
          commandHistory.forEach((cmd, index) => {
            addLine(`  ${index + 1}  ${cmd}`)
          })
        } else if (command === "date") {
          addLine(new Date().toString())
        } else if (command === "opentui") {
          addLine("OpenTUI Terminal Component")
          addLine("Built with @opentui/react")
          addLine("GitHub: https://github.com/sst/opentui")
        } else if (onCommand) {
          await onCommand(command)
        } else {
          addLine(`Command not found: ${command}`, "error")
          addLine(`Type 'help' for available commands`, "output")
        }
      } catch (error) {
        addLine(`Error: ${error instanceof Error ? error.message : "Unknown error"}`, "error")
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
        const commands = ["clear", "help", "history", "date", "opentui"]
        const matches = commands.filter((cmd) => cmd.startsWith(currentInput))
        if (matches.length === 1) {
          setCurrentInput(matches[0])
        } else if (matches.length > 1) {
          addLine(`Available completions: ${matches.join(", ")}`)
        }
      } else if (e.key === "l" && e.ctrlKey) {
        e.preventDefault()
        setLines([])
      }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentInput(e.target.value)
      setCursorPosition(e.target.selectionStart || 0)
    }

    const handleInputSelect = () => {
      if (inputRef.current) {
        setCursorPosition(inputRef.current.selectionStart || 0)
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "bg-black text-green-400 font-mono text-sm p-4 rounded-lg border border-border overflow-hidden",
          "shadow-2xl shadow-green-400/10",
          className,
        )}
        {...props}
      >
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-green-400/20">
          <div className="text-green-400 text-xs">OpenTUI Terminal</div>
          <div className="text-green-400/60 text-xs">Ctrl+L to clear</div>
        </div>

        <div
          ref={terminalRef}
          className="h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground scrollbar-track-transparent"
        >
          {lines.map((line, index) => (
            <div
              key={index}
              className={cn(
                "whitespace-pre-wrap break-words leading-relaxed",
                line.type === "input" && "text-white font-semibold",
                line.type === "error" && "text-red-400",
                line.type === "output" && "text-green-400",
              )}
            >
              {line.content}
            </div>
          ))}

          <div className="flex items-center text-white mt-1 relative">
            <span className="text-green-400 mr-2 font-bold">{prompt}</span>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onSelect={handleInputSelect}
                onClick={handleInputSelect}
                disabled={isProcessing}
                className="w-full bg-transparent border-none outline-none text-white font-mono caret-transparent"
                autoComplete="off"
                spellCheck={false}
                placeholder={isProcessing ? "Processing..." : "Type a command..."}
              />
              <div
                className="absolute top-0 w-2 h-5 bg-green-400 animate-pulse pointer-events-none"
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

OpenTUITerminal.displayName = "OpenTUITerminal"

export { OpenTUITerminal as Terminal, OpenTUITerminal }
export type { OpenTUITerminalProps as TerminalProps, TerminalLine }

"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useOpenTUIRuntime, useOpenTUIOptional } from "./runtime"
import type { TerminalLine, TerminalCommand, UIComponent } from "./types"

// Hook for managing terminal lines with local state sync
export const useTerminalLines = () => {
  const runtime = useOpenTUIRuntime()
  const [lines, setLines] = useState<TerminalLine[]>(runtime.state.lines)

  // Sync with runtime state changes
  useEffect(() => {
    const interval = setInterval(() => {
      if (runtime.state.lines !== lines) {
        setLines([...runtime.state.lines])
      }
    }, 16) // ~60fps updates
    return () => clearInterval(interval)
  }, [runtime, lines])

  return {
    lines,
    addLine: runtime.addLine,
    clearLines: runtime.clearLines,
    updateLastLine: runtime.updateLastLine,
  }
}

// Hook for command history navigation
export const useCommandHistory = () => {
  const runtime = useOpenTUIRuntime()
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [currentInput, setCurrentInput] = useState("")

  const navigateUp = useCallback(() => {
    const history = runtime.state.commandHistory
    if (history.length === 0) return currentInput

    const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)

    setHistoryIndex(newIndex)
    const command = history[newIndex]
    setCurrentInput(command)
    return command
  }, [runtime.state.commandHistory, historyIndex, currentInput])

  const navigateDown = useCallback(() => {
    const history = runtime.state.commandHistory
    if (historyIndex === -1) return currentInput

    const newIndex = historyIndex + 1
    if (newIndex >= history.length) {
      setHistoryIndex(-1)
      setCurrentInput("")
      return ""
    }

    setHistoryIndex(newIndex)
    const command = history[newIndex]
    setCurrentInput(command)
    return command
  }, [runtime.state.commandHistory, historyIndex, currentInput])

  const resetHistory = useCallback(() => {
    setHistoryIndex(-1)
  }, [])

  return {
    currentInput,
    setCurrentInput,
    navigateUp,
    navigateDown,
    resetHistory,
    history: runtime.state.commandHistory,
  }
}

// Hook for tab completion
export const useTabCompletion = () => {
  const runtime = useOpenTUIRuntime()

  const getCompletions = useCallback(
    (input: string): string[] => {
      const commands = runtime.getCommands()
      const commandNames = commands.map((cmd) => cmd.name)
      return commandNames.filter((name) => name.startsWith(input))
    },
    [runtime],
  )

  const complete = useCallback(
    (input: string): { completed: string; options: string[] } => {
      const matches = getCompletions(input)

      if (matches.length === 1) {
        return { completed: matches[0], options: [] }
      }

      if (matches.length > 1) {
        // Find common prefix
        const commonPrefix = matches.reduce((prefix, match) => {
          while (match.indexOf(prefix) !== 0) {
            prefix = prefix.slice(0, -1)
          }
          return prefix
        }, matches[0])

        return { completed: commonPrefix, options: matches }
      }

      return { completed: input, options: [] }
    },
    [getCompletions],
  )

  return { complete, getCompletions }
}

// Hook for UI component interaction
export const useUIComponent = () => {
  const runtime = useOpenTUIRuntime()
  const [activeComponent, setActiveComponent] = useState<UIComponent | undefined>(runtime.state.mode.activeComponent)

  useEffect(() => {
    const interval = setInterval(() => {
      const current = runtime.state.mode.activeComponent
      if (current !== activeComponent) {
        setActiveComponent(current)
      }
    }, 16)
    return () => clearInterval(interval)
  }, [runtime, activeComponent])

  const showForm = useCallback(
    (fields: string[], onSubmit?: (data: Record<string, unknown>) => void) => {
      runtime.showUI({
        id: `form-${Date.now()}`,
        type: "form",
        props: { fields },
        active: true,
        onComplete: onSubmit,
      })
    },
    [runtime],
  )

  const showMenu = useCallback(
    (items: string[], onSelect?: (item: string, index: number) => void) => {
      runtime.showUI({
        id: `menu-${Date.now()}`,
        type: "menu",
        props: { items },
        active: true,
        onComplete: (result) => {
          const { item, index } = result as { item: string; index: number }
          onSelect?.(item, index)
        },
      })
    },
    [runtime],
  )

  const showProgress = useCallback(
    (label: string, total: number) => {
      const id = `progress-${Date.now()}`
      runtime.showUI({
        id,
        type: "progress",
        props: { label, total, current: 0 },
        active: true,
      })

      return {
        update: (current: number) => {
          runtime.showUI({
            id,
            type: "progress",
            props: { label, total, current },
            active: true,
          })
        },
        complete: () => runtime.hideUI(id),
      }
    },
    [runtime],
  )

  return {
    activeComponent,
    showForm,
    showMenu,
    showProgress,
    hideUI: runtime.hideUI,
  }
}

// Hook for registering custom commands
export const useCommand = (command: TerminalCommand, deps: unknown[] = []) => {
  const runtime = useOpenTUIOptional()

  useEffect(() => {
    if (!runtime) return

    runtime.registerCommand(command)
    return () => runtime.unregisterCommand(command.name)
  }, [runtime, ...deps])
}

// Hook for keyboard shortcuts
export const useTerminalKeyboard = (onEnter: () => void, onEscape?: () => void) => {
  const runtime = useOpenTUIOptional()

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Escape to exit UI mode
      if (e.key === "Escape" && runtime?.state.mode.type !== "command") {
        e.preventDefault()
        runtime?.setMode("command")
        runtime?.hideUI()
        onEscape?.()
        return
      }

      // Ctrl+L to clear
      if (e.key === "l" && e.ctrlKey) {
        e.preventDefault()
        runtime?.clearLines()
        return
      }

      // Enter to submit
      if (e.key === "Enter") {
        e.preventDefault()
        onEnter()
        return
      }
    },
    [runtime, onEnter, onEscape],
  )

  return { handleKeyDown }
}

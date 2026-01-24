"use client"

import React, { createContext, useContext, useCallback, useRef, useMemo } from "react"
import type {
  OpenTUIRuntimeContext,
  OpenTUIRuntimeState,
  TerminalLine,
  TerminalCommand,
  TerminalMode,
  UIComponent,
  TerminalEvent,
  TerminalEventHandler,
  OpenTUIPlugin,
  TerminalMiddleware,
} from "./types"

// Default theme configuration
const defaultTheme: OpenTUIRuntimeState["theme"] = {
  prompt: "user@terminal:~$",
  colors: {
    background: "bg-black",
    foreground: "text-green-400",
    input: "text-white",
    output: "text-green-400",
    error: "text-red-400",
    success: "text-emerald-400",
    system: "text-yellow-400",
    accent: "text-cyan-400",
  },
  font: {
    family: "font-mono",
    size: "text-sm",
  },
}

// Initial runtime state
const createInitialState = (welcomeMessage?: string[]): OpenTUIRuntimeState => ({
  mode: { type: "command" },
  lines:
    welcomeMessage?.map((content, index) => ({
      id: `welcome-${index}`,
      type: "output" as const,
      content,
      timestamp: new Date(),
    })) || [],
  commandHistory: [],
  historyIndex: -1,
  isProcessing: false,
  formData: {},
  menuSelection: 0,
  theme: defaultTheme,
})

// Context for the OpenTUI runtime
const OpenTUIContext = createContext<OpenTUIRuntimeContext | null>(null)

// Hook to access the OpenTUI runtime
export const useOpenTUIRuntime = (): OpenTUIRuntimeContext => {
  const context = useContext(OpenTUIContext)
  if (!context) {
    throw new Error("useOpenTUIRuntime must be used within an OpenTUIProvider")
  }
  return context
}

// Hook to check if we're inside an OpenTUI provider
export const useOpenTUIOptional = (): OpenTUIRuntimeContext | null => {
  return useContext(OpenTUIContext)
}

interface OpenTUIProviderProps {
  children: React.ReactNode
  welcomeMessage?: string[]
  plugins?: OpenTUIPlugin[]
  onEvent?: TerminalEventHandler
  initialState?: Partial<OpenTUIRuntimeState>
}

export const OpenTUIProvider: React.FC<OpenTUIProviderProps> = ({
  children,
  welcomeMessage = ["Welcome to OpenTUI Terminal", "Type 'help' for available commands"],
  plugins = [],
  onEvent,
  initialState,
}) => {
  // State management using refs for stable references
  const stateRef = useRef<OpenTUIRuntimeState>({
    ...createInitialState(welcomeMessage),
    ...initialState,
  })

  const commandsRef = useRef<Map<string, TerminalCommand>>(new Map())
  const middlewareRef = useRef<TerminalMiddleware[]>([])
  const listenersRef = useRef<Set<() => void>>(new Set())
  const lineIdCounter = useRef(0)

  // State update helper that notifies listeners
  const updateState = useCallback((updater: (state: OpenTUIRuntimeState) => OpenTUIRuntimeState) => {
    stateRef.current = updater(stateRef.current)
    listenersRef.current.forEach((listener) => listener())
  }, [])

  // Event emitter
  const emitEvent = useCallback(
    (type: TerminalEvent["type"], payload: unknown) => {
      const event: TerminalEvent = {
        type,
        payload,
        timestamp: new Date(),
      }
      onEvent?.(event)
    },
    [onEvent],
  )

  // Line management
  const addLine = useCallback(
    (content: string, type: TerminalLine["type"] = "output") => {
      const newLine: TerminalLine = {
        id: `line-${lineIdCounter.current++}`,
        type,
        content,
        timestamp: new Date(),
      }
      updateState((state) => ({
        ...state,
        lines: [...state.lines, newLine],
      }))
      emitEvent("line:add", newLine)
    },
    [updateState, emitEvent],
  )

  const clearLines = useCallback(() => {
    updateState((state) => ({
      ...state,
      lines: [],
    }))
    emitEvent("line:clear", null)
  }, [updateState, emitEvent])

  const updateLastLine = useCallback(
    (content: string) => {
      updateState((state) => {
        const lines = [...state.lines]
        if (lines.length > 0) {
          lines[lines.length - 1] = {
            ...lines[lines.length - 1],
            content,
          }
        }
        return { ...state, lines }
      })
    },
    [updateState],
  )

  // UI component management
  const showUI = useCallback(
    (component: UIComponent) => {
      updateState((state) => ({
        ...state,
        mode: {
          type: "ui",
          activeComponent: component,
        },
      }))
      emitEvent("ui:show", component)
    },
    [updateState, emitEvent],
  )

  const hideUI = useCallback(
    (id?: string) => {
      updateState((state) => {
        if (id && state.mode.activeComponent?.id !== id) {
          return state
        }
        return {
          ...state,
          mode: { type: "command" },
        }
      })
      emitEvent("ui:hide", id)
    },
    [updateState, emitEvent],
  )

  // Mode management
  const setMode = useCallback(
    (mode: TerminalMode["type"]) => {
      updateState((state) => ({
        ...state,
        mode: { ...state.mode, type: mode },
      }))
      emitEvent("mode:change", mode)
    },
    [updateState, emitEvent],
  )

  // Form data management
  const updateFormData = useCallback(
    (key: string, value: unknown) => {
      updateState((state) => ({
        ...state,
        formData: { ...state.formData, [key]: value },
      }))
    },
    [updateState],
  )

  const getFormData = useCallback(() => {
    return { ...stateRef.current.formData }
  }, [])

  const clearFormData = useCallback(() => {
    updateState((state) => ({
      ...state,
      formData: {},
    }))
  }, [updateState])

  // Command registration
  const registerCommand = useCallback((command: TerminalCommand) => {
    commandsRef.current.set(command.name, command)
    command.aliases?.forEach((alias) => {
      commandsRef.current.set(alias, { ...command, name: alias })
    })
  }, [])

  const unregisterCommand = useCallback((name: string) => {
    const command = commandsRef.current.get(name)
    if (command) {
      commandsRef.current.delete(name)
      command.aliases?.forEach((alias) => {
        commandsRef.current.delete(alias)
      })
    }
  }, [])

  const getCommands = useCallback(() => {
    return Array.from(commandsRef.current.values())
  }, [])

  // Create the runtime context
  const runtimeContext: OpenTUIRuntimeContext = useMemo(
    () => ({
      state: stateRef.current,
      addLine,
      clearLines,
      updateLastLine,
      showUI,
      hideUI,
      setMode,
      updateFormData,
      getFormData,
      clearFormData,
      registerCommand,
      unregisterCommand,
      getCommands,
    }),
    [
      addLine,
      clearLines,
      updateLastLine,
      showUI,
      hideUI,
      setMode,
      updateFormData,
      getFormData,
      clearFormData,
      registerCommand,
      unregisterCommand,
      getCommands,
    ],
  )

  // Initialize plugins
  React.useEffect(() => {
    plugins.forEach((plugin) => {
      // Register plugin commands
      plugin.commands?.forEach((command) => {
        registerCommand(command)
      })

      // Add plugin middleware
      if (plugin.middleware) {
        middlewareRef.current.push(...plugin.middleware)
      }

      // Call plugin init
      plugin.onInit?.(runtimeContext)
    })

    return () => {
      plugins.forEach((plugin) => {
        plugin.onDestroy?.()
        plugin.commands?.forEach((command) => {
          unregisterCommand(command.name)
        })
      })
    }
  }, [plugins, registerCommand, unregisterCommand, runtimeContext])

  return <OpenTUIContext.Provider value={runtimeContext}>{children}</OpenTUIContext.Provider>
}

// Export context for advanced use cases
export { OpenTUIContext }

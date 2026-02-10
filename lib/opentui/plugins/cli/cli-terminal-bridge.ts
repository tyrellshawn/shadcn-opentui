// CLI Terminal Bridge Implementation
// Bridges CLI apps to OpenTUI terminal I/O

import type { 
  CLITerminalBridge, 
  TerminalDimensions, 
  KeyModifiers, 
  StyledContent 
} from "./types"
import type { OpenTUIRuntimeContext, TerminalLine } from "../../types"

/** Configuration for terminal bridge */
export interface CLITerminalBridgeConfig {
  /** Initial terminal dimensions */
  initialDimensions?: TerminalDimensions
  /** Default prompt string */
  defaultPrompt?: string
  /** Enable input buffering */
  bufferInput?: boolean
  /** Enable ANSI escape code processing */
  processAnsiCodes?: boolean
}

/** Event types for the terminal bridge */
export type TerminalBridgeEventType = "resize" | "keypress" | "input" | "output"

/** Event listener function */
type EventListener<T> = (data: T) => void

/**
 * Creates a terminal bridge that connects CLI apps to OpenTUI runtime
 */
export function createCLITerminalBridge(
  runtime: OpenTUIRuntimeContext,
  config: CLITerminalBridgeConfig = {}
): CLITerminalBridge {
  const {
    initialDimensions = { columns: 80, rows: 24 },
    defaultPrompt = "> ",
    processAnsiCodes = true,
  } = config

  // Internal state
  let currentDimensions = { ...initialDimensions }
  let currentPrompt = defaultPrompt
  let cursorPosition = { x: 0, y: 0 }
  let cursorVisible = true
  let inputBuffer = ""
  let inputResolve: ((value: string) => void) | null = null

  // Event listeners
  const resizeListeners = new Set<EventListener<TerminalDimensions>>()
  const keypressListeners = new Set<EventListener<{ key: string; modifiers: KeyModifiers }>>()

  /**
   * Process ANSI escape codes and convert to styled content
   */
  function processAnsiContent(content: string): string {
    if (!processAnsiCodes) return content
    
    // Remove ANSI escape codes for now - they'll be processed by the terminal component
    // In a full implementation, this would parse and convert to terminal-compatible styling
    return content.replace(/\x1b\[[0-9;]*m/g, "")
  }

  /**
   * Convert styled content to terminal-compatible string
   */
  function styledContentToString(content: StyledContent): string {
    // Build ANSI escape sequence
    const codes: number[] = []
    
    if (content.bold) codes.push(1)
    if (content.dim) codes.push(2)
    if (content.italic) codes.push(3)
    if (content.underline) codes.push(4)
    if (content.inverse) codes.push(7)
    if (content.strikethrough) codes.push(9)
    
    // Color mapping (basic 16 colors)
    const colorMap: Record<string, number> = {
      black: 30, red: 31, green: 32, yellow: 33,
      blue: 34, magenta: 35, cyan: 36, white: 37,
      brightBlack: 90, brightRed: 91, brightGreen: 92, brightYellow: 93,
      brightBlue: 94, brightMagenta: 95, brightCyan: 96, brightWhite: 97,
    }
    
    const bgColorMap: Record<string, number> = {
      black: 40, red: 41, green: 42, yellow: 43,
      blue: 44, magenta: 45, cyan: 46, white: 47,
      brightBlack: 100, brightRed: 101, brightGreen: 102, brightYellow: 103,
      brightBlue: 104, brightMagenta: 105, brightCyan: 106, brightWhite: 107,
    }
    
    if (content.color && colorMap[content.color]) {
      codes.push(colorMap[content.color])
    }
    
    if (content.backgroundColor && bgColorMap[content.backgroundColor]) {
      codes.push(bgColorMap[content.backgroundColor])
    }
    
    if (codes.length === 0) {
      return content.text
    }
    
    // Return text with ANSI codes (reset at end)
    return `\x1b[${codes.join(";")}m${content.text}\x1b[0m`
  }

  /**
   * Parse keyboard modifiers from event
   */
  function parseModifiers(event: KeyboardEvent): KeyModifiers {
    return {
      ctrl: event.ctrlKey,
      alt: event.altKey,
      shift: event.shiftKey,
      meta: event.metaKey,
    }
  }

  /**
   * Handle global keypress events
   */
  function handleKeyPress(key: string, modifiers: KeyModifiers): void {
    // Notify all listeners
    keypressListeners.forEach((listener) => {
      listener({ key, modifiers })
    })

    // Handle input if waiting for input
    if (inputResolve) {
      if (key === "Enter") {
        const value = inputBuffer
        inputBuffer = ""
        inputResolve(value)
        inputResolve = null
      } else if (key === "Backspace") {
        inputBuffer = inputBuffer.slice(0, -1)
      } else if (key.length === 1) {
        inputBuffer += key
      }
    }
  }

  // The bridge implementation
  const bridge: CLITerminalBridge = {
    write(content: string): void {
      const processed = processAnsiContent(content)
      // Use addLine without newline - this writes inline
      runtime.addLine(processed, "output")
    },

    writeLine(content: string, type: TerminalLine["type"] = "output"): void {
      const processed = processAnsiContent(content)
      runtime.addLine(processed, type)
    },

    clear(): void {
      runtime.clearLines()
      cursorPosition = { x: 0, y: 0 }
    },

    updateLine(content: string): void {
      const processed = processAnsiContent(content)
      runtime.updateLastLine(processed)
    },

    setPrompt(prompt: string): void {
      currentPrompt = prompt
      // Note: The actual prompt update would be handled by the terminal component
    },

    async requestInput(prompt?: string): Promise<string> {
      if (prompt) {
        runtime.addLine(prompt, "output")
      }
      
      return new Promise((resolve) => {
        inputResolve = resolve
        inputBuffer = ""
      })
    },

    get dimensions(): TerminalDimensions {
      return { ...currentDimensions }
    },

    onResize(callback: (dims: TerminalDimensions) => void): () => void {
      resizeListeners.add(callback)
      return () => resizeListeners.delete(callback)
    },

    onKeyPress(callback: (key: string, modifiers: KeyModifiers) => void): () => void {
      const wrappedCallback = ({ key, modifiers }: { key: string; modifiers: KeyModifiers }) => {
        callback(key, modifiers)
      }
      keypressListeners.add(wrappedCallback)
      return () => keypressListeners.delete(wrappedCallback)
    },

    renderStyled(content: StyledContent): void {
      const styledString = styledContentToString(content)
      this.write(styledString)
    },

    getCursorPosition(): { x: number; y: number } {
      return { ...cursorPosition }
    },

    setCursorPosition(x: number, y: number): void {
      cursorPosition = { x: Math.max(0, x), y: Math.max(0, y) }
    },

    setCursorVisible(visible: boolean): void {
      cursorVisible = visible
    },
  }

  return bridge
}

/**
 * Extended bridge with additional control methods
 */
export interface ExtendedCLITerminalBridge extends CLITerminalBridge {
  /** Update terminal dimensions (called by resize observer) */
  setDimensions(dimensions: TerminalDimensions): void
  /** Dispatch a keypress event */
  dispatchKeyPress(key: string, modifiers: KeyModifiers): void
  /** Get current prompt */
  getPrompt(): string
  /** Check if currently waiting for input */
  isWaitingForInput(): boolean
  /** Cancel pending input request */
  cancelInput(): void
}

/**
 * Creates an extended terminal bridge with additional control methods
 */
export function createExtendedCLITerminalBridge(
  runtime: OpenTUIRuntimeContext,
  config: CLITerminalBridgeConfig = {}
): ExtendedCLITerminalBridge {
  const {
    initialDimensions = { columns: 80, rows: 24 },
    defaultPrompt = "> ",
    processAnsiCodes = true,
  } = config

  // Internal state
  let currentDimensions = { ...initialDimensions }
  let currentPrompt = defaultPrompt
  let cursorPosition = { x: 0, y: 0 }
  let cursorVisible = true
  let inputBuffer = ""
  let inputResolve: ((value: string) => void) | null = null
  let inputReject: ((reason?: unknown) => void) | null = null

  // Event listeners
  const resizeListeners = new Set<EventListener<TerminalDimensions>>()
  const keypressListeners = new Set<EventListener<{ key: string; modifiers: KeyModifiers }>>()

  function processAnsiContent(content: string): string {
    if (!processAnsiCodes) return content
    return content.replace(/\x1b\[[0-9;]*m/g, "")
  }

  function styledContentToString(content: StyledContent): string {
    const codes: number[] = []
    
    if (content.bold) codes.push(1)
    if (content.dim) codes.push(2)
    if (content.italic) codes.push(3)
    if (content.underline) codes.push(4)
    if (content.inverse) codes.push(7)
    if (content.strikethrough) codes.push(9)
    
    const colorMap: Record<string, number> = {
      black: 30, red: 31, green: 32, yellow: 33,
      blue: 34, magenta: 35, cyan: 36, white: 37,
      brightBlack: 90, brightRed: 91, brightGreen: 92, brightYellow: 93,
      brightBlue: 94, brightMagenta: 95, brightCyan: 96, brightWhite: 97,
    }
    
    const bgColorMap: Record<string, number> = {
      black: 40, red: 41, green: 42, yellow: 43,
      blue: 44, magenta: 45, cyan: 46, white: 47,
      brightBlack: 100, brightRed: 101, brightGreen: 102, brightYellow: 103,
      brightBlue: 104, brightMagenta: 105, brightCyan: 106, brightWhite: 107,
    }
    
    if (content.color && colorMap[content.color]) {
      codes.push(colorMap[content.color])
    }
    
    if (content.backgroundColor && bgColorMap[content.backgroundColor]) {
      codes.push(bgColorMap[content.backgroundColor])
    }
    
    if (codes.length === 0) {
      return content.text
    }
    
    return `\x1b[${codes.join(";")}m${content.text}\x1b[0m`
  }

  const bridge: ExtendedCLITerminalBridge = {
    write(content: string): void {
      const processed = processAnsiContent(content)
      runtime.addLine(processed, "output")
    },

    writeLine(content: string, type: TerminalLine["type"] = "output"): void {
      const processed = processAnsiContent(content)
      runtime.addLine(processed, type)
    },

    clear(): void {
      runtime.clearLines()
      cursorPosition = { x: 0, y: 0 }
    },

    updateLine(content: string): void {
      const processed = processAnsiContent(content)
      runtime.updateLastLine(processed)
    },

    setPrompt(prompt: string): void {
      currentPrompt = prompt
    },

    async requestInput(prompt?: string): Promise<string> {
      if (prompt) {
        runtime.addLine(prompt, "output")
      }
      
      return new Promise((resolve, reject) => {
        inputResolve = resolve
        inputReject = reject
        inputBuffer = ""
      })
    },

    get dimensions(): TerminalDimensions {
      return { ...currentDimensions }
    },

    onResize(callback: (dims: TerminalDimensions) => void): () => void {
      resizeListeners.add(callback)
      return () => resizeListeners.delete(callback)
    },

    onKeyPress(callback: (key: string, modifiers: KeyModifiers) => void): () => void {
      const wrappedCallback = ({ key, modifiers }: { key: string; modifiers: KeyModifiers }) => {
        callback(key, modifiers)
      }
      keypressListeners.add(wrappedCallback)
      return () => keypressListeners.delete(wrappedCallback)
    },

    renderStyled(content: StyledContent): void {
      const styledString = styledContentToString(content)
      this.write(styledString)
    },

    getCursorPosition(): { x: number; y: number } {
      return { ...cursorPosition }
    },

    setCursorPosition(x: number, y: number): void {
      cursorPosition = { x: Math.max(0, x), y: Math.max(0, y) }
    },

    setCursorVisible(visible: boolean): void {
      cursorVisible = visible
    },

    // Extended methods
    setDimensions(dimensions: TerminalDimensions): void {
      currentDimensions = { ...dimensions }
      resizeListeners.forEach((listener) => listener(currentDimensions))
    },

    dispatchKeyPress(key: string, modifiers: KeyModifiers): void {
      keypressListeners.forEach((listener) => {
        listener({ key, modifiers })
      })

      if (inputResolve) {
        if (key === "Enter") {
          const value = inputBuffer
          inputBuffer = ""
          inputResolve(value)
          inputResolve = null
          inputReject = null
        } else if (key === "Backspace") {
          inputBuffer = inputBuffer.slice(0, -1)
        } else if (key.length === 1) {
          inputBuffer += key
        }
      }
    },

    getPrompt(): string {
      return currentPrompt
    },

    isWaitingForInput(): boolean {
      return inputResolve !== null
    },

    cancelInput(): void {
      if (inputReject) {
        inputReject(new Error("Input cancelled"))
        inputResolve = null
        inputReject = null
        inputBuffer = ""
      }
    },
  }

  return bridge
}

// Export default factory
export { createCLITerminalBridge as default }

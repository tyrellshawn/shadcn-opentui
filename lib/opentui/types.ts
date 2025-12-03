// OpenTUI Core Types
// Defines the interface contract between shadcn terminal wrapper and opentui runtime

export interface TerminalLine {
  id: string
  type: "input" | "output" | "error" | "success" | "system"
  content: string
  timestamp: Date
  metadata?: Record<string, unknown>
}

export interface TerminalCommand {
  name: string
  description: string
  handler: (args: string[], context: OpenTUIRuntimeContext) => Promise<void> | void
  category?: "system" | "ui" | "data" | "custom"
  aliases?: string[]
  usage?: string
}

export interface UIComponent {
  id: string
  type: "form" | "menu" | "slider" | "progress" | "table" | "chart" | "custom"
  props: Record<string, unknown>
  active: boolean
  onComplete?: (result: unknown) => void
  onCancel?: () => void
}

export interface TerminalMode {
  type: "command" | "ui" | "form" | "streaming"
  activeComponent?: UIComponent
}

export interface OpenTUIRuntimeState {
  mode: TerminalMode
  lines: TerminalLine[]
  commandHistory: string[]
  historyIndex: number
  isProcessing: boolean
  formData: Record<string, unknown>
  menuSelection: number
  theme: TerminalTheme
}

export interface TerminalTheme {
  prompt: string
  colors: {
    background: string
    foreground: string
    input: string
    output: string
    error: string
    success: string
    system: string
    accent: string
  }
  font: {
    family: string
    size: string
  }
}

// Runtime context provided to commands and UI components
export interface OpenTUIRuntimeContext {
  // State access
  state: OpenTUIRuntimeState

  // Line management
  addLine: (content: string, type?: TerminalLine["type"]) => void
  clearLines: () => void
  updateLastLine: (content: string) => void

  // UI component management
  showUI: (component: UIComponent) => void
  hideUI: (id?: string) => void

  // Mode management
  setMode: (mode: TerminalMode["type"]) => void

  // Form data management
  updateFormData: (key: string, value: unknown) => void
  getFormData: () => Record<string, unknown>
  clearFormData: () => void

  // Command registration
  registerCommand: (command: TerminalCommand) => void
  unregisterCommand: (name: string) => void
  getCommands: () => TerminalCommand[]
}

// Event types for terminal interactions
export type TerminalEventType =
  | "command:execute"
  | "command:complete"
  | "command:error"
  | "ui:show"
  | "ui:hide"
  | "ui:interact"
  | "mode:change"
  | "line:add"
  | "line:clear"

export interface TerminalEvent {
  type: TerminalEventType
  payload: unknown
  timestamp: Date
}

export type TerminalEventHandler = (event: TerminalEvent) => void

// Plugin system for extending terminal functionality
export interface OpenTUIPlugin {
  name: string
  version: string
  commands?: TerminalCommand[]
  middleware?: TerminalMiddleware[]
  onInit?: (context: OpenTUIRuntimeContext) => void
  onDestroy?: () => void
}

export type TerminalMiddleware = (
  command: string,
  args: string[],
  context: OpenTUIRuntimeContext,
  next: () => Promise<void>,
) => Promise<void>

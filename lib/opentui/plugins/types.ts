// OpenTUI Plugin Framework Types
// Comprehensive type definitions for building custom plugins

import type { OpenTUIRuntimeContext, TerminalCommand, TerminalMiddleware } from "../types"

// ============================================
// Core Plugin Types
// ============================================

export interface PluginManifest {
  name: string
  version: string
  description: string
  author?: string
  repository?: string
  dependencies?: string[]
  keywords?: string[]
}

export interface PluginLifecycle {
  onInit?: (context: OpenTUIRuntimeContext) => void | Promise<void>
  onDestroy?: () => void | Promise<void>
  onActivate?: () => void
  onDeactivate?: () => void
}

export interface PluginCapabilities {
  commands?: TerminalCommand[]
  middleware?: TerminalMiddleware[]
  renderers?: PluginRenderer[]
  themes?: PluginTheme[]
}

export interface OpenTUIPluginDefinition extends PluginManifest, PluginLifecycle, PluginCapabilities {}

// ============================================
// Renderer Types (for custom UI components)
// ============================================

export interface PluginRenderer {
  type: string
  render: (props: RendererProps) => string | string[]
  supports?: (data: unknown) => boolean
}

export interface RendererProps {
  data: unknown
  options?: RenderOptions
  context: OpenTUIRuntimeContext
}

export interface RenderOptions {
  width?: number
  height?: number
  style?: "minimal" | "rounded" | "double" | "heavy" | "ascii"
  colors?: boolean
  animate?: boolean
}

// ============================================
// Table Plugin Types
// ============================================

export interface TableColumn {
  key: string
  header: string
  width?: number
  align?: "left" | "center" | "right"
  format?: (value: unknown) => string
}

export interface TableOptions extends RenderOptions {
  columns?: TableColumn[]
  showHeaders?: boolean
  showBorders?: boolean
  showRowNumbers?: boolean
  maxRows?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
  emptyMessage?: string
  headerStyle?: "uppercase" | "capitalize" | "none"
  zebra?: boolean
}

export interface TableData {
  rows: Record<string, unknown>[]
  columns?: TableColumn[]
  title?: string
  footer?: string
}

// ============================================
// Progress Bar Plugin Types
// ============================================

export interface ProgressOptions extends RenderOptions {
  total: number
  current: number
  label?: string
  showPercentage?: boolean
  showValue?: boolean
  showETA?: boolean
  barWidth?: number
  barStyle?: "block" | "line" | "dots" | "arrow" | "gradient"
  completedChar?: string
  remainingChar?: string
  spinnerFrames?: string[]
}

export interface ProgressState {
  id: string
  current: number
  total: number
  startTime: number
  label?: string
  status: "running" | "paused" | "completed" | "error"
  metadata?: Record<string, unknown>
}

export interface MultiProgressOptions {
  bars: ProgressState[]
  showOverall?: boolean
  compact?: boolean
}

// ============================================
// Animation Types
// ============================================

export interface AnimationFrame {
  content: string | string[]
  duration?: number
}

export interface AnimationOptions {
  frames: AnimationFrame[] | string[]
  fps?: number
  loop?: boolean
  onComplete?: () => void
}

export interface SpinnerOptions {
  style?: "dots" | "line" | "circle" | "bounce" | "arrow" | "clock" | "moon" | "earth"
  text?: string
  speed?: number
}

// ============================================
// Theme Types
// ============================================

export interface PluginTheme {
  name: string
  borders: {
    top: string
    bottom: string
    left: string
    right: string
    topLeft: string
    topRight: string
    bottomLeft: string
    bottomRight: string
    horizontal: string
    vertical: string
    cross: string
    teeLeft: string
    teeRight: string
    teeUp: string
    teeDown: string
  }
  progress: {
    filled: string
    empty: string
    head: string
  }
}

// ============================================
// Plugin Registry Types
// ============================================

export interface PluginRegistry {
  plugins: Map<string, OpenTUIPluginDefinition>
  register: (plugin: OpenTUIPluginDefinition) => void
  unregister: (name: string) => void
  get: (name: string) => OpenTUIPluginDefinition | undefined
  list: () => OpenTUIPluginDefinition[]
  has: (name: string) => boolean
}

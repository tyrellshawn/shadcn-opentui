// OpenTUI Plugin Utilities
// Helper functions for building plugins

import type { TableColumn, ProgressOptions, SpinnerOptions, PluginTheme, AnimationOptions } from "./types"

// ============================================
// Border Themes
// ============================================

export const THEMES: Record<string, PluginTheme> = {
  rounded: {
    name: "rounded",
    borders: {
      top: "─",
      bottom: "─",
      left: "│",
      right: "│",
      topLeft: "╭",
      topRight: "╮",
      bottomLeft: "╰",
      bottomRight: "╯",
      horizontal: "─",
      vertical: "│",
      cross: "┼",
      teeLeft: "├",
      teeRight: "┤",
      teeUp: "┴",
      teeDown: "┬",
    },
    progress: {
      filled: "█",
      empty: "░",
      head: "▓",
    },
  },
  double: {
    name: "double",
    borders: {
      top: "═",
      bottom: "═",
      left: "║",
      right: "║",
      topLeft: "╔",
      topRight: "╗",
      bottomLeft: "╚",
      bottomRight: "╝",
      horizontal: "═",
      vertical: "║",
      cross: "╬",
      teeLeft: "╠",
      teeRight: "╣",
      teeUp: "╩",
      teeDown: "╦",
    },
    progress: {
      filled: "▓",
      empty: "░",
      head: "█",
    },
  },
  heavy: {
    name: "heavy",
    borders: {
      top: "━",
      bottom: "━",
      left: "┃",
      right: "┃",
      topLeft: "┏",
      topRight: "┓",
      bottomLeft: "┗",
      bottomRight: "┛",
      horizontal: "━",
      vertical: "┃",
      cross: "╋",
      teeLeft: "┣",
      teeRight: "┫",
      teeUp: "┻",
      teeDown: "┳",
    },
    progress: {
      filled: "━",
      empty: "─",
      head: "╸",
    },
  },
  minimal: {
    name: "minimal",
    borders: {
      top: "─",
      bottom: "─",
      left: " ",
      right: " ",
      topLeft: " ",
      topRight: " ",
      bottomLeft: " ",
      bottomRight: " ",
      horizontal: "─",
      vertical: " ",
      cross: "─",
      teeLeft: " ",
      teeRight: " ",
      teeUp: "─",
      teeDown: "─",
    },
    progress: {
      filled: "●",
      empty: "○",
      head: "●",
    },
  },
  ascii: {
    name: "ascii",
    borders: {
      top: "-",
      bottom: "-",
      left: "|",
      right: "|",
      topLeft: "+",
      topRight: "+",
      bottomLeft: "+",
      bottomRight: "+",
      horizontal: "-",
      vertical: "|",
      cross: "+",
      teeLeft: "+",
      teeRight: "+",
      teeUp: "+",
      teeDown: "+",
    },
    progress: {
      filled: "#",
      empty: "-",
      head: ">",
    },
  },
}

// ============================================
// Spinner Frames
// ============================================

export const SPINNER_FRAMES: Record<string, string[]> = {
  dots: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
  line: ["-", "\\", "|", "/"],
  circle: ["◐", "◓", "◑", "◒"],
  bounce: ["⠁", "⠂", "⠄", "⠂"],
  arrow: ["←", "↖", "↑", "↗", "→", "↘", "↓", "↙"],
  clock: ["🕐", "🕑", "🕒", "🕓", "🕔", "🕕", "🕖", "🕗", "🕘", "🕙", "🕚", "🕛"],
  moon: ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"],
  earth: ["🌍", "🌎", "🌏"],
  dots2: ["⣾", "⣽", "⣻", "⢿", "⡿", "⣟", "⣯", "⣷"],
  pulse: ["█", "▓", "▒", "░", "▒", "▓"],
}

// ============================================
// String Utilities
// ============================================

export function padString(str: string, length: number, align: "left" | "center" | "right" = "left"): string {
  const stripped = stripAnsi(str)
  const padLength = length - stripped.length
  if (padLength <= 0) return str.slice(0, length)

  switch (align) {
    case "right":
      return " ".repeat(padLength) + str
    case "center":
      const left = Math.floor(padLength / 2)
      const right = padLength - left
      return " ".repeat(left) + str + " ".repeat(right)
    default:
      return str + " ".repeat(padLength)
  }
}

export function stripAnsi(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1b\[[0-9;]*m/g, "")
}

export function truncate(str: string, maxLength: number, ellipsis = "…"): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - ellipsis.length) + ellipsis
}

export function formatValue(value: unknown): string {
  if (value === null) return "null"
  if (value === undefined) return "undefined"
  if (typeof value === "boolean") return value ? "✓" : "✗"
  if (typeof value === "number") return value.toLocaleString()
  if (value instanceof Date) return value.toLocaleDateString()
  if (Array.isArray(value)) return `[${value.length} items]`
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}

// ============================================
// Time Utilities
// ============================================

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}m ${seconds}s`
}

export function calculateETA(current: number, total: number, startTime: number): string {
  if (current === 0) return "calculating..."
  const elapsed = Date.now() - startTime
  const rate = current / elapsed
  const remaining = (total - current) / rate
  return formatDuration(remaining)
}

// ============================================
// Column Width Calculation
// ============================================

export function calculateColumnWidths(
  data: Record<string, unknown>[],
  columns: TableColumn[],
  maxWidth = 80,
): number[] {
  const widths: number[] = columns.map((col) => {
    const headerWidth = col.header.length
    const dataWidths = data.map((row) => formatValue(row[col.key]).length)
    const maxDataWidth = Math.max(...dataWidths, 0)
    return col.width || Math.min(Math.max(headerWidth, maxDataWidth), 30)
  })

  // Distribute remaining width proportionally
  const totalWidth = widths.reduce((a, b) => a + b, 0)
  const borderWidth = columns.length + 1
  const availableWidth = maxWidth - borderWidth

  if (totalWidth > availableWidth) {
    const ratio = availableWidth / totalWidth
    return widths.map((w) => Math.max(3, Math.floor(w * ratio)))
  }

  return widths
}

// ============================================
// Progress Bar Rendering
// ============================================

export function renderProgressBar(options: ProgressOptions, theme: PluginTheme = THEMES.rounded): string {
  const {
    current,
    total,
    label = "",
    showPercentage = true,
    showValue = false,
    showETA = false,
    barWidth = 30,
    barStyle = "block",
  } = options

  const percentage = Math.min(100, Math.max(0, (current / total) * 100))
  const filledWidth = Math.round((percentage / 100) * barWidth)
  const emptyWidth = barWidth - filledWidth

  let bar: string
  switch (barStyle) {
    case "gradient":
      const gradientChars = ["░", "▒", "▓", "█"]
      bar = ""
      for (let i = 0; i < barWidth; i++) {
        const pos = (i / barWidth) * 100
        if (pos < percentage - 10) bar += "█"
        else if (pos < percentage - 5) bar += "▓"
        else if (pos < percentage) bar += "▒"
        else bar += "░"
      }
      break
    case "dots":
      bar = "●".repeat(filledWidth) + "○".repeat(emptyWidth)
      break
    case "arrow":
      bar = "=".repeat(Math.max(0, filledWidth - 1)) + (filledWidth > 0 ? ">" : "") + " ".repeat(emptyWidth)
      break
    case "line":
      bar = "━".repeat(filledWidth) + "─".repeat(emptyWidth)
      break
    default:
      bar = theme.progress.filled.repeat(filledWidth) + theme.progress.empty.repeat(emptyWidth)
  }

  const parts: string[] = []
  if (label) parts.push(label)
  parts.push(`[${bar}]`)
  if (showPercentage) parts.push(`${percentage.toFixed(0)}%`)
  if (showValue) parts.push(`${current}/${total}`)

  return parts.join(" ")
}

// ============================================
// Animation Controller
// ============================================

export class AnimationController {
  private frameIndex = 0
  private intervalId: NodeJS.Timeout | null = null
  private frames: string[]
  private fps: number
  private loop: boolean
  private onFrame: (frame: string) => void
  private onComplete?: () => void

  constructor(options: AnimationOptions & { onFrame: (frame: string) => void }) {
    this.frames = Array.isArray(options.frames)
      ? options.frames.map((f) => (typeof f === "string" ? f : (f.content as string)))
      : []
    this.fps = options.fps || 10
    this.loop = options.loop ?? true
    this.onFrame = options.onFrame
    this.onComplete = options.onComplete
  }

  start() {
    if (this.intervalId) return
    this.intervalId = setInterval(() => {
      this.onFrame(this.frames[this.frameIndex])
      this.frameIndex++
      if (this.frameIndex >= this.frames.length) {
        if (this.loop) {
          this.frameIndex = 0
        } else {
          this.stop()
          this.onComplete?.()
        }
      }
    }, 1000 / this.fps)
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  reset() {
    this.frameIndex = 0
  }
}

// ============================================
// Spinner Controller
// ============================================

export class SpinnerController {
  private frameIndex = 0
  private intervalId: NodeJS.Timeout | null = null
  private frames: string[]
  private text: string
  private speed: number
  private onFrame: (frame: string) => void

  constructor(options: SpinnerOptions & { onFrame: (frame: string) => void }) {
    this.frames = SPINNER_FRAMES[options.style || "dots"]
    this.text = options.text || ""
    this.speed = options.speed || 80
    this.onFrame = options.onFrame
  }

  start() {
    if (this.intervalId) return
    this.tick()
    this.intervalId = setInterval(() => this.tick(), this.speed)
  }

  private tick() {
    const frame = this.frames[this.frameIndex]
    this.onFrame(this.text ? `${frame} ${this.text}` : frame)
    this.frameIndex = (this.frameIndex + 1) % this.frames.length
  }

  setText(text: string) {
    this.text = text
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }
}

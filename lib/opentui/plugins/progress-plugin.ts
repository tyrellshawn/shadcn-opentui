// OpenTUI Animated Progress Bar Plugin
// Smooth, animated progress bars with adaptive rendering

import type { OpenTUIPluginDefinition, ProgressOptions, ProgressState } from "./types"
import type { OpenTUIRuntimeContext } from "../types"
import { renderProgressBar, SpinnerController, formatDuration, SPINNER_FRAMES } from "./utils"

export interface ProgressPluginOptions {
  defaultStyle?: "block" | "line" | "dots" | "arrow" | "gradient"
  defaultWidth?: number
  adaptiveSpeed?: boolean
}

// Progress manager for handling multiple progress bars
class ProgressManager {
  private bars: Map<string, ProgressState> = new Map()
  private intervals: Map<string, NodeJS.Timeout> = new Map()
  private context: OpenTUIRuntimeContext | null = null
  private lineIds: Map<string, string> = new Map()
  private updateQueue: Map<string, number> = new Map()
  private rafId: number | null = null

  setContext(ctx: OpenTUIRuntimeContext) {
    this.context = ctx
  }

  create(id: string, total: number, label?: string): ProgressState {
    const state: ProgressState = {
      id,
      current: 0,
      total,
      startTime: Date.now(),
      label,
      status: "running",
    }
    this.bars.set(id, state)
    return state
  }

  update(id: string, current: number, options?: Partial<ProgressOptions>) {
    const bar = this.bars.get(id)
    if (!bar) return

    bar.current = Math.min(current, bar.total)
    if (bar.current >= bar.total) {
      bar.status = "completed"
    }

    // Queue the update for batch processing
    this.updateQueue.set(id, bar.current)
    this.scheduleRender()
  }

  private scheduleRender() {
    if (this.rafId !== null) return
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null
      this.flushUpdates()
    })
  }

  private flushUpdates() {
    if (!this.context) return

    this.updateQueue.forEach((current, id) => {
      const bar = this.bars.get(id)
      if (!bar) return

      const rendered = renderProgressBar({
        current: bar.current,
        total: bar.total,
        label: bar.label,
        showPercentage: true,
        showETA: bar.status === "running",
        barWidth: 30,
      })

      this.context?.updateLastLine(rendered)
    })

    this.updateQueue.clear()
  }

  increment(id: string, amount = 1) {
    const bar = this.bars.get(id)
    if (bar) {
      this.update(id, bar.current + amount)
    }
  }

  complete(id: string, message?: string) {
    const bar = this.bars.get(id)
    if (!bar) return

    bar.status = "completed"
    bar.current = bar.total

    const duration = formatDuration(Date.now() - bar.startTime)
    const finalMessage = message || `${bar.label || "Progress"} completed in ${duration}`

    this.context?.updateLastLine(`✓ ${finalMessage}`)
    this.cleanup(id)
  }

  error(id: string, message?: string) {
    const bar = this.bars.get(id)
    if (!bar) return

    bar.status = "error"
    this.context?.updateLastLine(`✗ ${message || "Error occurred"}`)
    this.cleanup(id)
  }

  private cleanup(id: string) {
    const interval = this.intervals.get(id)
    if (interval) {
      clearInterval(interval)
      this.intervals.delete(id)
    }
    this.bars.delete(id)
    this.lineIds.delete(id)
  }

  getBar(id: string): ProgressState | undefined {
    return this.bars.get(id)
  }

  getAllBars(): ProgressState[] {
    return Array.from(this.bars.values())
  }
}

// Global progress manager instance
const progressManager = new ProgressManager()

export function createProgressPlugin(pluginOptions: ProgressPluginOptions = {}): OpenTUIPluginDefinition {
  const { defaultStyle = "block", defaultWidth = 30, adaptiveSpeed = true } = pluginOptions

  return {
    name: "progress",
    version: "1.0.0",
    description: "Animated progress bars with smooth rendering and adaptive speed",
    keywords: ["progress", "loading", "animation", "bar"],

    onInit: (context) => {
      progressManager.setContext(context)
    },

    commands: [
      {
        name: "progress",
        description: "Show an animated progress bar",
        usage: "progress [options]",
        aliases: ["prog", "loading"],
        category: "ui",
        handler: async (args: string[], context: OpenTUIRuntimeContext) => {
          // Parse options
          let total = 100
          let speed = 50
          let label = "Loading"
          let style = defaultStyle

          for (const arg of args) {
            if (arg.startsWith("--total=")) total = Number.parseInt(arg.split("=")[1], 10)
            else if (arg.startsWith("--speed=")) speed = Number.parseInt(arg.split("=")[1], 10)
            else if (arg.startsWith("--label=")) label = arg.split("=")[1]
            else if (arg.startsWith("--style=")) style = arg.split("=")[1] as typeof defaultStyle
          }

          const id = `progress-${Date.now()}`
          const bar = progressManager.create(id, total, label)

          // Initial render
          context.addLine(
            renderProgressBar({
              current: 0,
              total,
              label,
              showPercentage: true,
              showETA: true,
              barWidth: defaultWidth,
              barStyle: style,
            }),
          )

          // Animate with adaptive speed
          return new Promise<void>((resolve) => {
            let current = 0
            let lastUpdate = Date.now()
            let velocity = speed

            const animate = () => {
              const now = Date.now()
              const delta = now - lastUpdate
              lastUpdate = now

              // Adaptive speed: slow down near the end for smooth finish
              if (adaptiveSpeed && current > total * 0.8) {
                velocity = Math.max(10, velocity * 0.95)
              }

              // Calculate increment based on time delta
              const increment = (velocity / 1000) * delta
              current = Math.min(total, current + increment)

              progressManager.update(id, Math.floor(current), {
                barStyle: style,
                barWidth: defaultWidth,
              })

              if (current >= total) {
                progressManager.complete(id)
                resolve()
              } else {
                requestAnimationFrame(animate)
              }
            }

            requestAnimationFrame(animate)
          })
        },
      },

      {
        name: "spinner",
        description: "Show an animated spinner",
        usage: "spinner [text] [--style=dots|line|circle|bounce|arrow]",
        aliases: ["spin", "wait"],
        category: "ui",
        handler: async (args: string[], context: OpenTUIRuntimeContext) => {
          let style: keyof typeof SPINNER_FRAMES = "dots"
          let text = "Loading..."
          let duration = 3000

          for (const arg of args) {
            if (arg.startsWith("--style=")) style = arg.split("=")[1] as typeof style
            else if (arg.startsWith("--duration=")) duration = Number.parseInt(arg.split("=")[1], 10)
            else if (!arg.startsWith("--")) text = arg
          }

          context.addLine(SPINNER_FRAMES[style][0] + " " + text)

          return new Promise<void>((resolve) => {
            const spinner = new SpinnerController({
              style,
              text,
              speed: 80,
              onFrame: (frame) => {
                context.updateLastLine(frame)
              },
            })

            spinner.start()

            setTimeout(() => {
              spinner.stop()
              context.updateLastLine(`✓ ${text.replace("...", "")} complete`)
              resolve()
            }, duration)
          })
        },
      },

      {
        name: "multibar",
        description: "Show multiple progress bars simultaneously",
        usage: "multibar [count]",
        category: "ui",
        handler: async (args: string[], context: OpenTUIRuntimeContext) => {
          const count = Number.parseInt(args[0], 10) || 3
          const labels = ["Downloading", "Processing", "Uploading", "Compiling", "Installing"]

          const bars: Array<{ id: string; total: number; current: number; speed: number }> = []

          // Create bars
          for (let i = 0; i < count; i++) {
            const total = 50 + Math.floor(Math.random() * 50)
            bars.push({
              id: `bar-${i}`,
              total,
              current: 0,
              speed: 20 + Math.random() * 40,
            })
            context.addLine(
              renderProgressBar({
                current: 0,
                total,
                label: labels[i % labels.length],
                showPercentage: true,
                barWidth: 25,
              }),
            )
          }

          // Animate all bars
          return new Promise<void>((resolve) => {
            const completed = 0
            let lastTime = Date.now()

            const animate = () => {
              const now = Date.now()
              const delta = now - lastTime
              lastTime = now

              let allDone = true

              bars.forEach((bar, index) => {
                if (bar.current < bar.total) {
                  allDone = false
                  bar.current = Math.min(bar.total, bar.current + (bar.speed / 1000) * delta)
                }
              })

              // Re-render all bars (simplified - in production, use proper line tracking)
              // For demo, just update the last line
              const lastBar = bars[bars.length - 1]
              context.updateLastLine(
                renderProgressBar({
                  current: Math.floor(lastBar.current),
                  total: lastBar.total,
                  label: labels[(bars.length - 1) % labels.length],
                  showPercentage: true,
                  barWidth: 25,
                }),
              )

              if (allDone) {
                context.addLine("✓ All tasks completed!", "success")
                resolve()
              } else {
                requestAnimationFrame(animate)
              }
            }

            requestAnimationFrame(animate)
          })
        },
      },
    ],

    renderers: [
      {
        type: "progress",
        render: ({ data, options }) => {
          const progressData = data as ProgressOptions
          return [renderProgressBar({ ...progressData, ...options })]
        },
        supports: (data) => {
          return typeof data === "object" && data !== null && "current" in data && "total" in data
        },
      },
    ],
  }
}

// Export progress manager for external use
export { progressManager, ProgressManager }

// Default export
export const progressPlugin = createProgressPlugin()

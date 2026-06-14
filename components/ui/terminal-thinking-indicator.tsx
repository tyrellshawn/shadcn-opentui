"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const CLAUDE_THINKING_FRAMES = [
  "\u00B7",
  "\u273B",
  "\u273D",
  "\u2736",
  "\u2733",
  "\u2722",
] as const

type TerminalAsciiSpinnerProps = {
  frames?: ReadonlyArray<string>
  speed?: number
  color?: string
  className?: string
}

function TerminalAsciiSpinner({
  frames = CLAUDE_THINKING_FRAMES,
  speed = 150,
  color = "var(--terminal-primary, #22c55e)",
  className,
}: TerminalAsciiSpinnerProps) {
  const [step, setStep] = React.useState(0)
  const [reduceMotion, setReduceMotion] = React.useState(false)
  const frameCount = Math.max(1, frames.length)

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduceMotion(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  React.useEffect(() => {
    if (reduceMotion) return
    const interval = window.setInterval(() => {
      setStep((current) => (current + 1) % frameCount)
    }, Math.max(16, speed))
    return () => window.clearInterval(interval)
  }, [reduceMotion, speed, frameCount])

  const frame = frames[reduceMotion ? 0 : step % frameCount] ?? frames[0] ?? "\u00B7"

  return (
    <span
      aria-hidden
      className={cn("inline-flex w-[1em] shrink-0 items-center justify-center font-mono leading-none", className)}
      style={{ color }}
    >
      {frame}
    </span>
  )
}

const DOT_RING = [0, 1, 2, 5, 8, 7, 6, 3]
const DOT_CENTER = 4
const DOT_GRID_SIZE = 9

type TerminalDotFrame = ReadonlyArray<number>

type TerminalDotMatrixProps = {
  tone?: "default" | "active"
  speed?: number
  trail?: number
  pulseCenter?: boolean
  dotSize?: number
  color?: string
  frames?: ReadonlyArray<TerminalDotFrame>
  className?: string
}

function clampOpacity(value: number | undefined) {
  if (value == null || Number.isNaN(value)) return 0
  return Math.min(1, Math.max(0, value))
}

function TerminalDotMatrix({
  tone = "default",
  speed = 120,
  trail = 4,
  pulseCenter = true,
  dotSize = 2,
  color,
  frames,
  className,
}: TerminalDotMatrixProps) {
  const [step, setStep] = React.useState(0)
  const [reduceMotion, setReduceMotion] = React.useState(false)
  const safeTrail = Math.max(1, trail)

  const hasCustomFrames = Boolean(frames && frames.length > 0)
  const frameCount = hasCustomFrames ? frames!.length : DOT_RING.length

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduceMotion(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  React.useEffect(() => {
    if (reduceMotion) return
    const interval = window.setInterval(() => {
      setStep((current) => (current + 1) % frameCount)
    }, Math.max(16, speed))
    return () => window.clearInterval(interval)
  }, [reduceMotion, speed, frameCount])

  const dotColor =
    color ??
    (tone === "active" ? "var(--terminal-primary, #22c55e)" : "var(--terminal-text, #22c55e)")

  const opacities = new Array<number>(DOT_GRID_SIZE).fill(0)

  if (hasCustomFrames) {
    const frame = frames![(reduceMotion ? 0 : step) % frames!.length] ?? []
    for (let index = 0; index < DOT_GRID_SIZE; index += 1) {
      opacities[index] = clampOpacity(frame[index])
    }
  } else {
    const head = reduceMotion ? 0 : step % DOT_RING.length
    DOT_RING.forEach((cellIndex, ringPos) => {
      const distance = (head - ringPos + DOT_RING.length) % DOT_RING.length
      opacities[cellIndex] = distance < safeTrail ? 1 - distance / safeTrail : 0
    })

    if (pulseCenter) {
      const phase = head / DOT_RING.length
      opacities[DOT_CENTER] = 0.3 + 0.45 * (0.5 + 0.5 * Math.cos(2 * Math.PI * phase))
    }
  }

  return (
    <span
      aria-hidden
      className={cn("inline-grid shrink-0 align-middle leading-none", className)}
      style={{
        gridTemplateColumns: `repeat(3, ${dotSize}px)`,
        gridTemplateRows: `repeat(3, ${dotSize}px)`,
        gap: 1,
      }}
    >
      {opacities.map((opacity, index) => (
        <span
          key={index}
          className="rounded-full"
          style={{
            width: dotSize,
            height: dotSize,
            backgroundColor: dotColor,
            opacity,
            transition: `opacity ${Math.max(16, speed)}ms linear`,
          }}
        />
      ))}
    </span>
  )
}

interface TerminalThinkingIndicatorProps {
  label?: string
  children?: React.ReactNode
  variant?: "auto" | "dots" | "ascii" | "cursor" | "blob"
  tone?: "default" | "active"
  dotProps?: Omit<TerminalDotMatrixProps, "tone" | "className">
  asciiProps?: Omit<TerminalAsciiSpinnerProps, "className">
  className?: string
}

function buildSpinKeyframes(): string {
  const steps: number[][] = [
    [4],
    [3, 4, 5],
    [0, 1, 2],
    [1, 2, 5, 8],
    [2, 5, 8],
    [1, 4, 7],
    [0, 4, 8],
    [4, 8],
  ]

  let keyframes = "@keyframes terminal-think-spin {"
  steps.forEach((_lit, i) => {
    const pct = (i / (steps.length - 1)) * 100
    keyframes += `${pct}% { opacity: 1; transform: scale(1); }`
  })
  keyframes += "100% { opacity: 1; transform: scale(1); }"
  keyframes += "}"
  return keyframes
}

function buildBlobKeyframes(): string {
  return `@keyframes terminal-think-blob {
    0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; opacity: 0.4; transform: scale(0.85); }
    25% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; opacity: 0.7; transform: scale(1.05); }
    50% { border-radius: 50% 60% 30% 80% / 40% 50% 70% 50%; opacity: 0.9; transform: scale(1); }
    75% { border-radius: 20% 40% 60% 50% / 60% 40% 50% 70%; opacity: 0.6; transform: scale(0.95); }
    100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; opacity: 0.4; transform: scale(0.85); }
  }`
}

function getContainerClass(variant: string, className?: string) {
  return cn(
    "flex items-center gap-2 px-2 py-1",
    variant === "blob" && "gap-3 py-2",
    className,
  )
}

function TerminalThinkingIndicator({
  label,
  children,
  variant = "blob",
  tone = "default",
  dotProps,
  asciiProps,
  className,
}: TerminalThinkingIndicatorProps) {
  const content = children ?? label
  const resolvedVariant = variant === "auto" ? "blob" : variant

  if (resolvedVariant === "blob") {
    return (
      <div className={cn("flex items-center gap-3 px-2 py-2", className)} role="status" aria-live="polite">
        <style>{buildBlobKeyframes()}</style>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 sm:w-3 sm:h-3"
              style={{
                backgroundColor: tone === "active" ? "var(--terminal-primary, #22c55e)" : "var(--terminal-text, #22c55e)",
                animation: "terminal-think-blob 2.8s ease-in-out infinite",
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
        </div>
        {content && (
          <span className={cn(
            "text-xs animate-pulse",
            tone === "active" ? "text-terminal-primary" : "text-terminal-text",
          )}>
            {content}
          </span>
        )}
      </div>
    )
  }

  if (resolvedVariant === "ascii") {
    return (
      <div className={getContainerClass(resolvedVariant, className)} role="status" aria-live="polite">
        <TerminalAsciiSpinner {...asciiProps} color={asciiProps?.color ?? (tone === "active" ? "var(--terminal-primary, #22c55e)" : "var(--terminal-text, #22c55e)")} />
        {content && (
          <span className={cn(
            "text-xs",
            tone === "active" ? "text-terminal-primary" : "text-terminal-text",
          )}>
            {content}
          </span>
        )}
      </div>
    )
  }

  if (resolvedVariant === "cursor") {
    return (
      <div className={getContainerClass(resolvedVariant, className)} role="status" aria-live="polite">
        {content && (
          <span className={cn(tone === "active" ? "text-terminal-primary" : "text-terminal-text")}>
            {content}
          </span>
        )}
        <span className="inline-block w-2 h-4 bg-terminal-cursor animate-blink" />
      </div>
    )
  }

  return (
    <div className={getContainerClass(resolvedVariant, className)} role="status" aria-live="polite">
      {content && (
        <span className={cn(tone === "active" ? "text-terminal-primary" : "text-terminal-text")}>
          {content}
        </span>
      )}
      <style>{buildSpinKeyframes()}</style>
      <TerminalDotMatrix tone={tone} {...dotProps} />
    </div>
  )
}

export {
  TerminalThinkingIndicator,
  TerminalDotMatrix,
  TerminalAsciiSpinner,
  CLAUDE_THINKING_FRAMES,
  type TerminalDotMatrixProps,
  type TerminalAsciiSpinnerProps,
  type TerminalDotFrame,
}

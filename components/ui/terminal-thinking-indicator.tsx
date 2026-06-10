"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const DOT_COUNT = 9

const DOT_POSITIONS = [
  [0, 0], [1, 0], [2, 0],
  [0, 1], [1, 1], [2, 1],
  [0, 2], [1, 2], [2, 2],
]

function buildSpinKeyframes(): string {
  // Define which dots are lit at each step (0-7), creating a circular pattern
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
  steps.forEach((lit, i) => {
    const pct = (i / (steps.length - 1)) * 100
    keyframes += `${pct}% { opacity: 1; transform: scale(1); }`
  })
  keyframes += "100% { opacity: 1; transform: scale(1); }"
  keyframes += "}"

  return keyframes
}

interface TerminalThinkingIndicatorProps {
  label?: string
  variant?: "dots" | "cursor" | "auto"
  tone?: "default" | "active"
  className?: string
}

function TerminalThinkingIndicator({
  label = "",
  variant = "dots",
  tone = "default",
  className,
}: TerminalThinkingIndicatorProps) {
  const resolvedVariant = variant === "auto" ? "dots" : variant

  const delays = React.useMemo(() => {
    return DOT_POSITIONS.map((_, i) => `${i * 0.12}s`)
  }, [])

  if (resolvedVariant === "cursor") {
    return (
      <div className={cn("flex items-center gap-2 px-2 py-1", className)}>
        {label && (
          <span className={cn(tone === "active" ? "text-terminal-primary" : "text-terminal-text")}>
            {label}
          </span>
        )}
        <span className="inline-block w-2 h-4 bg-terminal-cursor animate-blink" />
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-2 px-2 py-1", className)}>
      {label && (
        <span className={cn(tone === "active" ? "text-terminal-primary" : "text-terminal-text")}>
          {label}
        </span>
      )}
      <style>{buildSpinKeyframes()}</style>
      <div className="grid grid-cols-3 gap-0.5">
        {DOT_POSITIONS.map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              tone === "active" ? "bg-terminal-text" : "bg-terminal-text",
              tone === "active" ? "opacity-100" : "opacity-60"
            )}
            style={{
              animation: `terminal-think-spin 1.6s ease-in-out infinite`,
              animationDelay: delays[i],
            }}
          />
        ))}
      </div>
    </div>
  )
}

export { TerminalThinkingIndicator }

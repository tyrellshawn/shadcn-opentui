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

function buildBlobKeyframes(): string {
  return `@keyframes terminal-think-blob {
    0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; opacity: 0.4; transform: scale(0.85); }
    25% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; opacity: 0.7; transform: scale(1.05); }
    50% { border-radius: 50% 60% 30% 80% / 40% 50% 70% 50%; opacity: 0.9; transform: scale(1); }
    75% { border-radius: 20% 40% 60% 50% / 60% 40% 50% 70%; opacity: 0.6; transform: scale(0.95); }
    100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; opacity: 0.4; transform: scale(0.85); }
  }`
}

interface TerminalThinkingIndicatorProps {
  label?: string
  variant?: "dots" | "cursor" | "blob" | "auto"
  tone?: "default" | "active"
  className?: string
}

function TerminalThinkingIndicator({
  label = "",
  variant = "blob",
  tone = "default",
  className,
}: TerminalThinkingIndicatorProps) {
  const resolvedVariant = variant === "auto" ? "blob" : variant

  if (resolvedVariant === "blob") {
    return (
      <div className={cn("flex items-center gap-3 px-2 py-2", className)}>
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
        {label && (
          <span className={cn(
            "text-xs animate-pulse",
            tone === "active" ? "text-terminal-primary" : "text-terminal-text",
          )}>
            {label}
          </span>
        )}
      </div>
    )
  }

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
              "bg-terminal-text",
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

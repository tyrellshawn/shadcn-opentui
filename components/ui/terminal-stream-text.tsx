"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TerminalStreamTextProps {
  children: string
  mode?: "type" | "fade"
  speed?: number
  enabled?: boolean
  onComplete?: () => void
  className?: string
}

function TerminalStreamText({
  children,
  mode = "type",
  speed = 26,
  enabled = true,
  onComplete,
  className,
}: TerminalStreamTextProps) {
  const [revealedCount, setRevealedCount] = React.useState(0)
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null)
  const completedRef = React.useRef(false)

  const words = React.useMemo(() => children.split(/(\s+)/), [children])

  const delayPerWord = Math.max(20, Math.min(500, Math.round((101 - speed) * 5)))

  React.useEffect(() => {
    setRevealedCount(0)
    completedRef.current = false
  }, [children])

  React.useEffect(() => {
    if (!enabled || completedRef.current) return

    if (revealedCount >= words.length) {
      if (!completedRef.current) {
        completedRef.current = true
        onComplete?.()
      }
      return
    }

    intervalRef.current = setInterval(() => {
      setRevealedCount((prev) => {
        const next = prev + 1
        if (next >= words.length) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          intervalRef.current = null
          setTimeout(() => {
            completedRef.current = true
            onComplete?.()
          }, 0)
        }
        return next
      })
    }, delayPerWord)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [enabled, words.length, delayPerWord, onComplete, revealedCount])

  return (
    <span className={cn(className)}>
      {words.map((word, i) => {
        if (i >= revealedCount) return null
        if (mode === "fade") {
          return (
            <span
              key={i}
              className="inline animate-in fade-in duration-300 fill-mode-backwards"
              style={{ animationDelay: "0ms" }}
            >
              {word}
            </span>
          )
        }
        return <span key={i}>{word}</span>
      })}
      {revealedCount < words.length && (
        <span className="inline-block w-2 h-4 bg-terminal-cursor animate-blink ml-0.5 align-text-bottom" />
      )}
    </span>
  )
}

function estimateStreamDurationMs(
  text: string,
  options?: { speed?: number; mode?: string }
): number {
  const speed = options?.speed ?? 26
  const delayPerWord = Math.max(20, Math.min(500, Math.round((101 - speed) * 5)))
  const wordCount = text.split(/\s+/).length
  return wordCount * delayPerWord
}

export { TerminalStreamText, estimateStreamDurationMs }

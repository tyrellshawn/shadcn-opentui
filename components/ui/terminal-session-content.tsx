"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TerminalSessionContentProps {
  children: React.ReactNode
  streaming?: boolean
  autoScroll?: boolean
  resetKey?: string
  className?: string
}

function TerminalSessionContent({
  children,
  streaming = false,
  autoScroll = false,
  resetKey = "",
  className,
}: TerminalSessionContentProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const elements = React.useMemo(() => {
    return React.Children.toArray(children).filter(
      (child) => React.isValidElement(child)
    )
  }, [children])

  const [visibleCount, setVisibleCount] = React.useState(streaming ? 0 : elements.length)
  const STAGGER_MS = 450

  React.useEffect(() => {
    setVisibleCount(streaming ? 0 : elements.length)
  }, [resetKey, streaming, elements.length])

  React.useEffect(() => {
    if (!streaming) {
      setVisibleCount(elements.length)
      return
    }

    if (visibleCount >= elements.length) return

    const timer = setInterval(() => {
      setVisibleCount((prev) => {
        const next = prev + 1
        if (next >= elements.length) {
          clearInterval(timer)
        }
        return next
      })
    }, STAGGER_MS)

    return () => clearInterval(timer)
  }, [streaming, elements.length, visibleCount])

  React.useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [visibleCount, autoScroll])

  return (
    <div
      ref={scrollRef}
      className={cn(autoScroll && "overflow-y-auto", className)}
    >
      {elements.map((child, i) => {
        if (i >= visibleCount) return null
        return (
          <div
            key={i}
            className="animate-in fade-in duration-300 fill-mode-backwards"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {child}
          </div>
        )
      })}
    </div>
  )
}

export { TerminalSessionContent }

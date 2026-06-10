"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TerminalMessageProps {
  prompt?: string
  children: React.ReactNode
  className?: string
}

function TerminalMessage({ prompt = ">", children, className }: TerminalMessageProps) {
  return (
    <div className={cn("flex items-start gap-2 px-2 py-1", className)}>
      <span className="text-terminal-primary font-bold shrink-0">{prompt}</span>
      <span className="text-terminal-text">{children}</span>
    </div>
  )
}

export { TerminalMessage }

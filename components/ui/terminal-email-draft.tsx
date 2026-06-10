"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TerminalEmailDraftProps {
  from: string
  to: string
  subject: string
  body: string
  className?: string
}

function TerminalEmailDraft({ from, to, subject, body, className }: TerminalEmailDraftProps) {
  return (
    <div className={cn("rounded border border-terminal-border overflow-hidden font-mono", className)}>
      <div className="border-b border-terminal-border bg-terminal-highlight-bg/20 px-3 py-1.5 text-xs text-terminal-primary font-semibold">
        email draft
      </div>
      <div className="divide-y divide-terminal-border/40 text-xs">
        <div className="flex px-3 py-1">
          <span className="w-16 shrink-0 text-terminal-muted">From:</span>
          <span className="text-terminal-text truncate">{from}</span>
        </div>
        <div className="flex px-3 py-1">
          <span className="w-16 shrink-0 text-terminal-muted">To:</span>
          <span className="text-terminal-text truncate">{to}</span>
        </div>
        <div className="flex px-3 py-1">
          <span className="w-16 shrink-0 text-terminal-muted">Subject:</span>
          <span className="text-terminal-primary truncate">{subject}</span>
        </div>
        <div className="border-t border-terminal-border/40 px-3 py-2 text-terminal-text whitespace-pre-wrap leading-relaxed">
          {body}
        </div>
      </div>
    </div>
  )
}

export { TerminalEmailDraft }

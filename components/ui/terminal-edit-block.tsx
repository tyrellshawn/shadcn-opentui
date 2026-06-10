"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface EditBlockRemovedLine {
  lineNumber: number
  content: string
}

interface TerminalEditBlockProps {
  file: string
  startLine?: number
  highlightLines?: number[]
  removed?: EditBlockRemovedLine[]
  code?: string
  defaultExpanded?: boolean
  className?: string
}

function TerminalEditBlock({
  file,
  startLine = 1,
  highlightLines = [],
  removed = [],
  code = "",
  defaultExpanded = true,
  className,
}: TerminalEditBlockProps) {
  const [expanded, setExpanded] = React.useState(defaultExpanded)

  const codeLines = React.useMemo(() => code.split("\n"), [code])
  const removedSet = React.useMemo(
    () => new Set(removed.map((r) => r.lineNumber)),
    [removed]
  )

  const addedCount = React.useMemo(
    () => codeLines.filter((_, i) => {
      const lineNum = startLine + i
      return !removedSet.has(lineNum) && highlightLines.includes(lineNum)
    }).length,
    [codeLines, startLine, removedSet, highlightLines]
  )

  const removedCount = removed.length

  return (
    <div className={cn("rounded border border-terminal-border overflow-hidden font-mono", className)}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full px-3 py-1.5 bg-terminal-highlight-bg/30 hover:bg-terminal-highlight-bg/50 transition-colors text-left cursor-pointer"
      >
        <div className="flex items-center gap-2 text-xs">
          <span className={cn(
            "transition-transform duration-200",
            expanded && "rotate-90"
          )}>
            &#9654;
          </span>
          <span className="text-terminal-primary font-medium">{file}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {addedCount > 0 && (
            <span className="text-terminal-success">+{addedCount}</span>
          )}
          {removedCount > 0 && (
            <span className="text-terminal-error">-{removedCount}</span>
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-terminal-border">
          {codeLines.map((line, i) => {
            const lineNum = startLine + i
            const isHighlighted = highlightLines.includes(lineNum)
            const isRemoved = removedSet.has(lineNum)

            return (
              <div
                key={i}
                className={cn(
                  "flex px-2 py-0.5",
                  isHighlighted && !isRemoved && "border-l-2 border-terminal-success bg-terminal-success/10",
                  isRemoved && "border-l-2 border-terminal-error bg-terminal-error/10 line-through text-terminal-muted"
                )}
              >
                <span className="text-terminal-muted text-xs w-8 text-right pr-2 select-none shrink-0">
                  {lineNum}
                </span>
                <span className="text-terminal-text text-xs whitespace-pre">
                  {line}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export { TerminalEditBlock }

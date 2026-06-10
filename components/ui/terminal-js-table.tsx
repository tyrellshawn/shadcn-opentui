"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface JsTableColumn {
  key: string
  header: string
  width?: string
  align?: "left" | "center" | "right"
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode
}

export interface JsTableRow {
  [key: string]: unknown
}

interface TerminalJsTableProps {
  columns: JsTableColumn[]
  data: JsTableRow[]
  className?: string
}

function TerminalJsTable({ columns, data, className }: TerminalJsTableProps) {
  return (
    <div className={cn("overflow-x-auto terminal-scrollbar", className)}>
      <table className="w-full border-collapse text-xs font-mono">
        <thead>
          <tr className="border-b border-terminal-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-3 py-1.5 text-terminal-muted font-medium whitespace-nowrap text-left",
                  col.align === "center" && "text-center",
                  col.align === "right" && "text-right",
                )}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className={cn(
                "border-b border-terminal-border/40 transition-colors",
                i % 2 === 0 ? "bg-terminal-bg" : "bg-terminal-highlight-bg/20",
              )}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    "px-3 py-1.5 text-terminal-text whitespace-nowrap",
                    col.align === "center" && "text-center",
                    col.align === "right" && "text-right",
                  )}
                >
                  {col.render
                    ? col.render(row[col.key], row)
                    : String(row[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export { TerminalJsTable }

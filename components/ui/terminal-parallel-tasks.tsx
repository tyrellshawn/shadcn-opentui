"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ParallelTask {
  id: string
  label: string
  status: "pending" | "running" | "success" | "error"
  progress?: number
  duration?: string
}

function clampProgress(v: number): number {
  return Math.min(100, Math.max(0, v))
}

function buildProgressKeyframes(): string {
  return `@keyframes terminal-progress-pulse {
    0% { opacity: 0.5; }
    50% { opacity: 1; }
    100% { opacity: 0.5; }
  }`
}

export interface TerminalParallelTasksProps {
  tasks: ParallelTask[]
  className?: string
}

function TerminalParallelTasks({ tasks, className }: TerminalParallelTasksProps) {
  return (
    <div className={cn("rounded border border-terminal-border overflow-hidden font-mono text-xs", className)}>
      <style>{buildProgressKeyframes()}</style>
      <div className="border-b border-terminal-border bg-terminal-highlight-bg/20 px-3 py-1.5 text-terminal-primary font-semibold">
        task runner
      </div>
      <div className="divide-y divide-terminal-border/30">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center gap-3 px-3 py-2">
            {/* status icon */}
            <span className="shrink-0 w-4 text-center">
              {task.status === "success" && <span className="text-terminal-success">&#10003;</span>}
              {task.status === "error" && <span className="text-terminal-error">&#10007;</span>}
              {task.status === "running" && (
                <span
                  className="inline-block w-2 h-2 rounded-full bg-terminal-primary"
                  style={{ animation: "terminal-progress-pulse 0.8s ease-in-out infinite" }}
                />
              )}
              {task.status === "pending" && <span className="text-terminal-muted">&#9679;</span>}
            </span>

            {/* label */}
            <span
              className={cn(
                "flex-1 truncate",
                task.status === "success" && "text-terminal-success",
                task.status === "error" && "text-terminal-error",
                task.status === "running" && "text-terminal-text",
                task.status === "pending" && "text-terminal-muted",
              )}
            >
              {task.label}
            </span>

            {/* progress bar */}
            {task.status === "running" && task.progress !== undefined && (
              <div className="w-20 shrink-0">
                <div className="h-1.5 rounded-full bg-terminal-highlight-bg overflow-hidden">
                  <div
                    className="h-full rounded-full bg-terminal-primary transition-all duration-500 ease-out"
                    style={{ width: `${clampProgress(task.progress)}%` }}
                  />
                </div>
              </div>
            )}

            {/* duration / eta */}
            {task.duration && (
              <span
                className={cn(
                  "shrink-0 w-10 text-right",
                  task.status === "pending" && "text-terminal-muted",
                  (task.status === "running" || task.status === "success") && "text-terminal-text",
                )}
              >
                {task.duration}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export { TerminalParallelTasks }

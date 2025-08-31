"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface CommandProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "default" | "success" | "error" | "warning"
  children: React.ReactNode
}

const Command = React.forwardRef<HTMLElement, CommandProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <code
        ref={ref}
        className={cn(
          "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
          {
            "text-foreground": variant === "default",
            "text-green-600 dark:text-green-400": variant === "success",
            "text-red-600 dark:text-red-400": variant === "error",
            "text-yellow-600 dark:text-yellow-400": variant === "warning",
          },
          className,
        )}
        {...props}
      >
        {children}
      </code>
    )
  },
)

Command.displayName = "Command"

export { Command }
export type { CommandProps }

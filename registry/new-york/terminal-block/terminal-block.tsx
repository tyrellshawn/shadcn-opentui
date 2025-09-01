"use client"

import React from "react"
import { Terminal } from "../terminal/terminal"
import { TerminalControls } from "../terminal-controls/terminal-controls"
import { cn } from "../../../lib/utils"

interface TerminalBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  showControls?: boolean
  prompt?: string
  welcomeMessage?: string[]
  maxLines?: number
  variant?: "default" | "compact" | "minimal"
}

function TerminalBlock({
  className,
  showControls = true,
  prompt = "user@terminal:~$",
  welcomeMessage = ["Welcome to OpenTUI Terminal Block", "Type 'help' for available commands"],
  maxLines = 1000,
  variant = "default",
  ...props
}: TerminalBlockProps) {
  const terminalRef = React.useRef<any>(null)
  
  const handleCommand = React.useCallback((command: string) => {
    if (command.startsWith("set ")) {
      const [_, type, value] = command.split(" ")
      if (terminalRef.current?.addLine) {
        terminalRef.current.addLine(`Setting ${type} to ${value}`, "success")
      }
      return
    }
    
    if (command === "reset controls") {
      if (terminalRef.current?.addLine) {
        terminalRef.current.addLine("Controls reset to default values", "success")
      }
      return
    }
    
    if (command === "save config") {
      if (terminalRef.current?.addLine) {
        terminalRef.current.addLine("Configuration saved successfully", "success")
      }
      return
    }
  }, [])

  return (
    <div className={cn("grid gap-4", showControls ? "grid-cols-1 md:grid-cols-4" : "", className)} {...props}>
      <div className={cn(showControls ? "col-span-1 md:col-span-3" : "w-full")}>
        <Terminal
          ref={terminalRef}
          prompt={prompt}
          welcomeMessage={welcomeMessage}
          maxLines={maxLines}
          variant={variant}
          onCommand={(command) => {
            handleCommand(command)
          }}
        />
      </div>
      
      {showControls && (
        <div className="col-span-1">
          <TerminalControls onCommand={handleCommand} />
        </div>
      )}
    </div>
  )
}

export { TerminalBlock }
export type { TerminalBlockProps }
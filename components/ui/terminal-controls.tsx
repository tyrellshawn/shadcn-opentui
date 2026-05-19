"use client"

import * as React from "react"
import { TerminalSlider } from "./terminal-slider"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface TerminalControlsProps {
  className?: string
  onCommand?: (command: string) => void
}

function TerminalControls({ className, onCommand }: TerminalControlsProps) {
  const [volume, setVolume] = React.useState([75])
  const [brightness, setBrightness] = React.useState([50])
  const [speed, setSpeed] = React.useState([25])

  const handleControlCommand = (type: string, value: number) => {
    const command = `set ${type} ${value}`
    onCommand?.(command)
  }

  return (
    <div className={cn("space-y-4 p-4 border border-terminal-border rounded bg-black/50", className)}>
      <div className="text-terminal-primary font-mono text-sm border-b border-terminal-border pb-2">TERMINAL CONTROLS</div>

      <TerminalSlider
        label="Volume"
        value={volume}
        onValueChange={(val) => {
          setVolume(val)
          handleControlCommand("volume", val[0])
        }}
        unit="%"
        max={100}
      />

      <TerminalSlider
        label="Brightness"
        value={brightness}
        onValueChange={(val) => {
          setBrightness(val)
          handleControlCommand("brightness", val[0])
        }}
        unit="%"
        max={100}
        ascii
        width={15}
      />

      <TerminalSlider
        label="Processing Speed"
        value={speed}
        onValueChange={(val) => {
          setSpeed(val)
          handleControlCommand("speed", val[0])
        }}
        unit=" ops/s"
        max={100}
      />

      <div className="flex gap-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          className="font-mono text-xs border-terminal-border text-terminal-primary hover:bg-terminal-highlight-bg bg-transparent"
          onClick={() => onCommand?.("reset controls")}
        >
          RESET
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="font-mono text-xs border-terminal-border text-terminal-primary hover:bg-terminal-highlight-bg bg-transparent"
          onClick={() => onCommand?.("save config")}
        >
          SAVE
        </Button>
      </div>
    </div>
  )
}

export { TerminalControls }

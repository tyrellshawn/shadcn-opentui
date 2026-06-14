"use client"

import * as React from "react"
import { TerminalThinkingIndicator, TerminalDotMatrix, TerminalAsciiSpinner } from "@/components/ui/terminal-thinking-indicator"
import { cn } from "@/lib/utils"

export function TerminalThinkingMatrix() {
  const [variant, setVariant] = React.useState<"dots" | "ascii" | "cursor" | "blob">("dots")
  const [tone, setTone] = React.useState<"default" | "active">("default")
  const [speed, setSpeed] = React.useState(120)
  const [trail, setTrail] = React.useState(4)
  const [dotSize, setDotSize] = React.useState(2)
  const [pulseCenter, setPulseCenter] = React.useState(true)
  const [color, setColor] = React.useState("")

  const previewLabel = "Thinking..."

  const generatedCode = `<TerminalDotMatrix${tone !== "default" ? `\n  tone="${tone}"` : ""}${speed !== 120 ? `\n  speed={${speed}}` : ""}${trail !== 4 ? `\n  trail={${trail}}` : ""}${dotSize !== 2 ? `\n  dotSize={${dotSize}}` : ""}${!pulseCenter ? `\n  pulseCenter={${pulseCenter}}` : ""}${color ? `\n  color="${color}"` : ""}\n/>`

  return (
    <div className="space-y-6 rounded-lg border border-emerald-500/20 bg-black/40 p-6">
      <h3 className="text-lg font-semibold text-white">Thinking Matrix Playground</h3>
      <p className="text-sm text-muted-foreground">
        Tweak parameters below and see the dot matrix update in real time.
      </p>

      {/* Preview */}
      <div className="flex items-center justify-center rounded-lg border border-emerald-500/10 bg-black/60 p-8 min-h-[80px]">
        <TerminalThinkingIndicator
          label={previewLabel}
          variant={variant}
          tone={tone}
          dotProps={{ speed, trail, pulseCenter, dotSize, color: color || undefined }}
        />
      </div>

      {/* Variant and Tone selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Variant</label>
          <div className="flex flex-wrap gap-2">
            {(["dots", "ascii", "cursor", "blob"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setVariant(v)}
                className={cn(
                  "px-3 py-1.5 text-xs rounded-md border transition-colors",
                  variant === v
                    ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                    : "border-emerald-500/20 text-muted-foreground hover:border-emerald-500/40",
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Tone</label>
          <div className="flex flex-wrap gap-2">
            {(["default", "active"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={cn(
                  "px-3 py-1.5 text-xs rounded-md border transition-colors",
                  tone === t
                    ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                    : "border-emerald-500/20 text-muted-foreground hover:border-emerald-500/40",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Speed (ms)", value: speed, set: setSpeed, min: 16, max: 500, step: 8 },
          { label: "Trail", value: trail, set: setTrail, min: 1, max: 8, step: 1 },
          { label: "Dot Size (px)", value: dotSize, set: setDotSize, min: 1, max: 8, step: 1 },
        ].map(({ label, value, set, min, max, step }) => (
          <div key={label} className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              {label}: <span className="text-emerald-400">{value}</span>
            </label>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => set(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>
        ))}
      </div>

      {/* Toggle and Color */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-muted-foreground">Pulse Center</label>
          <button
            onClick={() => setPulseCenter(!pulseCenter)}
            className={cn(
              "px-3 py-1.5 text-xs rounded-md border transition-colors",
              pulseCenter
                ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                : "border-emerald-500/20 text-muted-foreground",
            )}
          >
            {pulseCenter ? "ON" : "OFF"}
          </button>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Color (optional)</label>
          <div className="flex gap-2">
            {["", "#22c55e", "#3b82f6", "#a855f7", "#f59e0b", "#ef4444"].map((c) => (
              <button
                key={c || "default"}
                onClick={() => setColor(c)}
                className={cn(
                  "w-6 h-6 rounded-full border",
                  color === c ? "ring-2 ring-emerald-400 ring-offset-2 ring-offset-black" : "",
                )}
                style={{ backgroundColor: c || "var(--terminal-text, #22c55e)" }}
                title={c || "default"}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Generated code */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">Generated Code</label>
        <pre className="rounded-lg bg-black/60 border border-emerald-500/10 p-4 text-xs text-emerald-400 overflow-x-auto font-mono">
          {generatedCode}
        </pre>
      </div>
    </div>
  )
}

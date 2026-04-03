"use client"

import { createElement, useEffect, useRef, useState } from "react"
import { CanvasTerminal } from "@opentui/web-renderer"
import { createRoot } from "@opentui/web-react"

export function WasmTerminal({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let terminal: CanvasTerminal | null = null

    async function run() {
      if (!canvasRef.current) return

      try {
        terminal = new CanvasTerminal(canvasRef.current, {
          fontSize: 15,
          lineHeight: 1.25,
          fitToContainer: true,
          minCols: 40,
          minRows: 14,
        })

        await terminal.init("/opentui/main.wasm")
        const root = createRoot(terminal)
        root.render(
          createElement(
            "box",
            null,
            createElement("text", null, "OpenTUI WASM Runtime Active"),
            createElement("br"),
            createElement("text", null, "- Zig core running in wasm32-freestanding"),
            createElement("br"),
            createElement("text", null, "- Canvas renderer reading shared cell memory"),
            createElement("br"),
            createElement("text", null, "- web-react createRoot() driving terminal scene"),
          ),
        )
        setReady(true)
      } catch (err) {
        const message = err instanceof Error ? err.message : "failed to initialize wasm terminal"
        setError(message)
      }
    }

    run()

    return () => {
      terminal?.destroy()
    }
  }, [])

  return (
    <div className={className}>
      <canvas ref={canvasRef} className="h-full w-full bg-black" />
      {!ready && !error ? <div className="p-3 text-xs text-emerald-400">Booting OpenTUI WASM core...</div> : null}
      {error ? <div className="p-3 text-xs text-red-400">WASM terminal failed: {error}</div> : null}
    </div>
  )
}

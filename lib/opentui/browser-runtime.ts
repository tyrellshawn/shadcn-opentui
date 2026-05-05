export const OPENTUI_PACKAGE_NAMES = ["@opentui/core", "@opentui/react"] as const

export type OpenTUIBrowserRenderer = "dom-wrapper" | "zig-wasm"

export interface OpenTUIBrowserCapability {
  renderer: OpenTUIBrowserRenderer
  browserRuntimeAvailable: boolean
  packages: readonly string[]
  shadcnCompatible: boolean
  reason: string
  recommendation: string
}

export function getOpenTUIBrowserCapability(): OpenTUIBrowserCapability {
  return {
    renderer: "zig-wasm",
    browserRuntimeAvailable: true,
    packages: OPENTUI_PACKAGE_NAMES,
    shadcnCompatible: true,
    reason: "The browser runtime now uses the Zig core compiled to WebAssembly and rendered through a canvas cell buffer.",
    recommendation: "Use the WASM runtime path for terminal UI in browser experiences; keep the DOM wrapper only as fallback.",
  }
}

export function getOpenTUIInstallCommand(): string {
  return "bun add @opentui/core @opentui/react"
}

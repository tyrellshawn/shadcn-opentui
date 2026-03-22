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
    renderer: "dom-wrapper",
    browserRuntimeAvailable: false,
    packages: OPENTUI_PACKAGE_NAMES,
    shadcnCompatible: true,
    reason:
      "Official OpenTUI packages are installed, but the public project ships a native Zig core rather than a browser-ready WASM renderer today.",
    recommendation:
      "Use the shadcn-friendly DOM terminal wrapper in the browser now, while keeping the package/runtime boundary ready for a future Zig-to-WASM engine.",
  }
}

export function getOpenTUIInstallCommand(): string {
  return "bun add @opentui/core @opentui/react"
}

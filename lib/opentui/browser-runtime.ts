export const OPENTUI_PACKAGE_NAMES = ["@opentui/core", "@opentui/react"] as const

export type OpenTUIBrowserRenderer = "shadcn-web" | "future-zig-wasm"

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
    renderer: "shadcn-web",
    browserRuntimeAvailable: false,
    packages: OPENTUI_PACKAGE_NAMES,
    shadcnCompatible: true,
    reason: "Shadcn OpenTUI is an independent web adapter experiment, not the official OpenTUI project. The current product path is inspectable shadcn/React code.",
    recommendation: "Use the registry components and the OpenTUI-to-shadcn codegen track today. Treat the Zig/WASM packages as parked future runtime research.",
  }
}

export function getOpenTUIInstallCommand(): string {
  return "bun add @opentui/core @opentui/react"
}

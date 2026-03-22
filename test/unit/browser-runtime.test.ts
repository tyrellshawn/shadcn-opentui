import { describe, expect, it } from "vitest"

import { getOpenTUIBrowserCapability, getOpenTUIInstallCommand, OPENTUI_PACKAGE_NAMES } from "@/lib/opentui/browser-runtime"

describe("browser OpenTUI capability", () => {
  it("documents the installed OpenTUI package boundary", () => {
    const capability = getOpenTUIBrowserCapability()

    expect(capability.packages).toEqual(OPENTUI_PACKAGE_NAMES)
    expect(capability.renderer).toBe("dom-wrapper")
    expect(capability.shadcnCompatible).toBe(true)
    expect(capability.browserRuntimeAvailable).toBe(false)
  })

  it("provides a single install command for automation", () => {
    expect(getOpenTUIInstallCommand()).toBe("bun add @opentui/core @opentui/react")
  })
})

import React, { useState } from "react"
import { render } from "@testing-library/react"
import { beforeAll, describe, expect, it, vi } from "vitest"
import { TerminalThemeSelector } from "@/components/ui/terminal-theme-selector"
import { prebuiltThemes, type ThemeConfig } from "@/lib/opentui/themes"

beforeAll(() => {
  Object.defineProperty(Element.prototype, "scrollIntoView", {
    configurable: true,
    value: vi.fn(),
  })
})

describe("TerminalThemeSelector", () => {
  it("does not loop when previewing through a provider that recreates theme objects", () => {
    function Harness() {
      const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(prebuiltThemes[0])
      const themes = prebuiltThemes.map((theme) => ({ ...theme }))

      return (
        <TerminalThemeSelector
          open
          themes={themes}
          currentThemeName={currentTheme.name}
          onPreview={(name) => {
            const nextTheme = themes.find((theme) => theme.name === name)
            if (nextTheme) setCurrentTheme(nextTheme)
          }}
        />
      )
    }

    expect(() => render(<Harness />)).not.toThrow()
  })
})

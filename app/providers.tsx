"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ReactNode } from "react"
import { TerminalThemeProvider } from "@/lib/opentui/themes"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <TerminalThemeProvider defaultTheme="github-light">
        {children}
      </TerminalThemeProvider>
    </NextThemesProvider>
  )
}

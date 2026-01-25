"use client"

import * as React from "react"
import { Moon, Sun, Monitor, Palette } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const colorThemes = [
  { name: "default", label: "Default", color: "#7c3aed" },
  { name: "matrix", label: "Matrix Green", color: "#22c55e" },
  { name: "cyan", label: "Cyan", color: "#06b6d4" },
  { name: "amber", label: "Amber", color: "#f59e0b" },
  { name: "purple", label: "Purple", color: "#a855f7" },
]

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [colorTheme, setColorTheme] = React.useState("default")

  React.useEffect(() => {
    setMounted(true)
    // Check for color theme class on html element
    const html = document.documentElement
    const currentColorTheme = colorThemes.find((t) => html.classList.contains(`theme-${t.name}`))
    if (currentColorTheme) {
      setColorTheme(currentColorTheme.name)
    }
  }, [])

  const applyColorTheme = (themeName: string) => {
    const html = document.documentElement
    // Remove all theme classes
    colorThemes.forEach((t) => html.classList.remove(`theme-${t.name}`))
    // Add new theme class if not default
    if (themeName !== "default") {
      html.classList.add(`theme-${themeName}`)
    }
    setColorTheme(themeName)
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9">
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {/* Color Theme Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="w-9 h-9">
            <Palette className="h-4 w-4" />
            <span className="sr-only">Select color theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Color Theme</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {colorThemes.map((t) => (
            <DropdownMenuItem
              key={t.name}
              onClick={() => applyColorTheme(t.name)}
              className="flex items-center gap-2"
            >
              <div
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: t.color }}
              />
              <span>{t.label}</span>
              {colorTheme === t.name && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Light/Dark Mode Toggle */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="w-9 h-9">
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setTheme("light")}>
            <Sun className="mr-2 h-4 w-4" />
            <span>Light</span>
            {theme === "light" && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
            {theme === "dark" && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            <Monitor className="mr-2 h-4 w-4" />
            <span>System</span>
            {theme === "system" && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

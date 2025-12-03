"use client"

import { useState, useCallback } from "react"
import { Palette, Copy, Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Terminal } from "@/components/ui/terminal"
import { ThemePicker } from "@/components/theme-picker"
import { prebuiltThemes, type ThemeConfig } from "@/lib/opentui/themes"

export default function ThemesPage() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeConfig>(prebuiltThemes[0])
  const [copied, setCopied] = useState(false)

  const handleThemeChange = useCallback((themeName: string) => {
    const theme = prebuiltThemes.find((t) => t.name === themeName)
    if (theme) {
      setSelectedTheme(theme)
    }
  }, [])

  const configCode = `{
  "theme": "${selectedTheme.name}"
}`

  const handleCopy = () => {
    navigator.clipboard.writeText(configCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Custom commands for themed terminal demo
  const themeCommands = {
    theme: async (args: string[], context: any) => {
      const themeName = args[0]
      if (!themeName) {
        context.addLines([
          "Usage: theme <name>",
          "",
          "Available themes:",
          ...prebuiltThemes.map((t) => `  ${t.name.padEnd(15)} - ${t.description}`),
        ])
        return
      }
      const found = prebuiltThemes.find((t) => t.name === themeName)
      if (found) {
        setSelectedTheme(found)
        context.addLines([
          `Theme changed to: ${found.displayName}`,
          `Description: ${found.description}`,
          `Variant: ${found.variant}`,
        ])
      } else {
        context.addLines([`Theme "${themeName}" not found. Run 'theme' to see available themes.`])
      }
    },
    colors: async (args: string[], context: any) => {
      context.addLines([
        `Current Theme: ${selectedTheme.displayName}`,
        "",
        "Color Palette:",
        `  Primary:    ${selectedTheme.colors.primary}`,
        `  Secondary:  ${selectedTheme.colors.secondary}`,
        `  Accent:     ${selectedTheme.colors.accent}`,
        `  Background: ${selectedTheme.colors.background}`,
        `  Text:       ${selectedTheme.colors.text}`,
        `  Success:    ${selectedTheme.colors.success}`,
        `  Error:      ${selectedTheme.colors.error}`,
        `  Warning:    ${selectedTheme.colors.warning}`,
      ])
    },
    demo: async (args: string[], context: any) => {
      context.addLines(["Syntax Highlighting Demo:", ""])
      // Simulate typed code
      await new Promise((r) => setTimeout(r, 100))
      context.addLines([`const theme = "${selectedTheme.name}";`])
      await new Promise((r) => setTimeout(r, 100))
      context.addLines([`function applyTheme(name: string) {`])
      await new Promise((r) => setTimeout(r, 100))
      context.addLines([`  console.log("Applying:", name);`])
      await new Promise((r) => setTimeout(r, 100))
      context.addLines([`  return { success: true };`])
      await new Promise((r) => setTimeout(r, 100))
      context.addLines([`}`])
      await new Promise((r) => setTimeout(r, 200))
      context.addLines([
        "",
        "Status Messages:",
        "✓ Theme loaded successfully",
        "ℹ Using " + selectedTheme.variant + " mode",
        "⚠ " + prebuiltThemes.length + " themes available",
      ])
    },
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-green-400/10">
            <Palette className="w-6 h-6 text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-green-400">Themes</h1>
        </div>
        <p className="text-green-400/70 text-lg max-w-2xl">
          OpenTUI includes {prebuiltThemes.length} beautiful prebuilt themes inspired by popular terminal and editor
          color schemes. Select a theme below to preview it live in a real OpenTUI terminal.
        </p>
      </div>

      {/* Theme Picker Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-green-400">Select Theme</h2>
          <div className="flex items-center gap-2 text-sm text-green-400/50">
            <Sparkles className="w-4 h-4" />
            <span>Live preview updates instantly</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemePicker value={selectedTheme.name} onValueChange={handleThemeChange} />
          <div className="flex items-center gap-2">
            {[
              selectedTheme.colors.primary,
              selectedTheme.colors.secondary,
              selectedTheme.colors.accent,
              selectedTheme.colors.success,
              selectedTheme.colors.error,
            ].map((color, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border border-white/10 shadow-lg"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Live Terminal Preview */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-green-400">Live Preview</h2>
        <p className="text-green-400/60 text-sm">
          Try commands: <code className="px-1.5 py-0.5 rounded bg-green-400/10">theme</code>,{" "}
          <code className="px-1.5 py-0.5 rounded bg-green-400/10">colors</code>,{" "}
          <code className="px-1.5 py-0.5 rounded bg-green-400/10">demo</code>
        </p>

        <div
          className="rounded-xl border overflow-hidden shadow-2xl transition-colors duration-300"
          style={{
            borderColor: selectedTheme.colors.border,
            boxShadow: `0 25px 50px -12px ${selectedTheme.colors.primary}20`,
          }}
        >
          {/* Custom themed header */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{
              backgroundColor: selectedTheme.colors.backgroundPanel,
              borderColor: selectedTheme.colors.border,
            }}
          >
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedTheme.colors.error }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedTheme.colors.warning }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedTheme.colors.success }} />
              </div>
              <span className="text-sm font-mono" style={{ color: selectedTheme.colors.textMuted }}>
                {selectedTheme.displayName} — OpenTUI Terminal
              </span>
            </div>
            <Palette className="w-4 h-4" style={{ color: selectedTheme.colors.primary }} />
          </div>

          {/* Terminal with theme-aware styling */}
          <div
            style={{
              backgroundColor: selectedTheme.colors.background,
              ["--terminal-text" as string]: selectedTheme.colors.text,
              ["--terminal-primary" as string]: selectedTheme.colors.primary,
              ["--terminal-success" as string]: selectedTheme.colors.success,
            }}
          >
            <Terminal
              welcomeMessage={[
                `Welcome to OpenTUI — ${selectedTheme.displayName} Theme`,
                `Type 'theme' to list themes, 'colors' to see palette, or 'demo' for syntax preview.`,
                "",
              ]}
              commands={themeCommands}
              prompt="→"
              className="border-0 rounded-none shadow-none"
              style={{
                backgroundColor: selectedTheme.colors.background,
                color: selectedTheme.colors.text,
                ["--tw-text-opacity" as string]: "1",
              }}
            />
          </div>
        </div>
      </div>

      {/* Theme Gallery */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-green-400">All Themes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prebuiltThemes.map((theme) => (
            <button
              key={theme.name}
              onClick={() => setSelectedTheme(theme)}
              className={`
                relative p-4 rounded-lg border-2 transition-all text-left w-full
                hover:scale-[1.02] hover:shadow-lg
                ${theme.name === selectedTheme.name ? "ring-2 ring-offset-2 ring-offset-black" : ""}
              `}
              style={{
                backgroundColor: theme.colors.background,
                borderColor: theme.name === selectedTheme.name ? theme.colors.primary : theme.colors.border,
                ringColor: theme.colors.primary,
              }}
            >
              {theme.name === selectedTheme.name && (
                <div
                  className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  <Check className="w-3 h-3" style={{ color: theme.colors.textInverse }} />
                </div>
              )}

              <h3 className="font-semibold mb-1" style={{ color: theme.colors.text }}>
                {theme.displayName}
              </h3>
              <p className="text-xs mb-3" style={{ color: theme.colors.textMuted }}>
                {theme.description}
              </p>

              {/* Color swatches */}
              <div className="flex gap-1 mb-3">
                {[
                  theme.colors.primary,
                  theme.colors.secondary,
                  theme.colors.accent,
                  theme.colors.success,
                  theme.colors.error,
                ].map((color, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded-full border"
                    style={{
                      backgroundColor: color,
                      borderColor: theme.colors.border,
                    }}
                  />
                ))}
              </div>

              {/* Mini terminal preview */}
              <div
                className="p-2 rounded text-xs font-mono"
                style={{
                  backgroundColor: theme.colors.backgroundPanel,
                  borderColor: theme.colors.border,
                }}
              >
                <div className="flex items-center gap-1">
                  <span style={{ color: theme.colors.success }}>$</span>
                  <span style={{ color: theme.colors.text }}>opentui</span>
                  <span style={{ color: theme.colors.textMuted }}>--theme</span>
                  <span style={{ color: theme.colors.primary }}>{theme.name}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Config Snippet */}
      <div
        className="p-6 rounded-lg border"
        style={{
          backgroundColor: selectedTheme.colors.backgroundPanel,
          borderColor: selectedTheme.colors.border,
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold" style={{ color: selectedTheme.colors.text }}>
            Configuration
          </h2>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="gap-2 bg-transparent"
            style={{
              borderColor: selectedTheme.colors.border,
              color: selectedTheme.colors.text,
            }}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
        <p className="mb-4" style={{ color: selectedTheme.colors.textMuted }}>
          Add this to your{" "}
          <code className="px-1.5 py-0.5 rounded" style={{ backgroundColor: selectedTheme.colors.backgroundElement }}>
            opentui.config.json
          </code>
          :
        </p>
        <pre
          className="p-4 rounded-lg font-mono text-sm overflow-x-auto"
          style={{
            backgroundColor: selectedTheme.colors.background,
            color: selectedTheme.colors.syntaxString,
          }}
        >
          {configCode}
        </pre>
      </div>

      {/* Custom Themes Documentation */}
      <div
        className="p-6 rounded-lg border"
        style={{
          backgroundColor: selectedTheme.colors.backgroundPanel,
          borderColor: selectedTheme.colors.border,
        }}
      >
        <h2 className="text-2xl font-semibold mb-4" style={{ color: selectedTheme.colors.text }}>
          Custom Themes
        </h2>
        <p className="mb-4" style={{ color: selectedTheme.colors.textMuted }}>
          Create your own theme by defining a ThemeConfig object:
        </p>
        <pre
          className="p-4 rounded-lg font-mono text-sm overflow-x-auto"
          style={{
            backgroundColor: selectedTheme.colors.background,
            color: selectedTheme.colors.text,
          }}
        >
          {`import { ThemeConfig } from '@shadcn-opentui/themes'

const myTheme: ThemeConfig = {
  name: 'my-theme',
  displayName: 'My Custom Theme',
  description: 'A beautiful custom theme',
  variant: 'dark',
  colors: {
    primary: '${selectedTheme.colors.primary}',
    secondary: '${selectedTheme.colors.secondary}',
    accent: '${selectedTheme.colors.accent}',
    background: '${selectedTheme.colors.background}',
    // ... define all colors
  }
}

// Use with TerminalThemeProvider
<TerminalThemeProvider customThemes={[myTheme]}>
  <Terminal />
</TerminalThemeProvider>`}
        </pre>
      </div>
    </div>
  )
}

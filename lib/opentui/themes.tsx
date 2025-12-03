"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// ============================================================================
// TYPES
// ============================================================================

export interface ThemeColors {
  // Core colors
  primary: string
  secondary: string
  accent: string
  background: string
  backgroundPanel: string
  backgroundElement: string
  text: string
  textMuted: string
  textInverse: string
  border: string

  // Semantic colors
  success: string
  error: string
  warning: string
  info: string

  // Syntax highlighting
  syntaxKeyword: string
  syntaxString: string
  syntaxNumber: string
  syntaxFunction: string
  syntaxVariable: string
  syntaxComment: string
  syntaxOperator: string
  syntaxPunctuation: string

  // Terminal specific
  promptSymbol: string
  cursor: string
  selection: string
}

export interface ThemeConfig {
  name: string
  displayName: string
  description: string
  variant: "dark" | "light"
  colors: ThemeColors
}

// ============================================================================
// PREBUILT THEMES
// ============================================================================

const matrixTheme: ThemeConfig = {
  name: "matrix",
  displayName: "Matrix",
  description: "Classic green-on-black terminal aesthetic",
  variant: "dark",
  colors: {
    primary: "#22c55e",
    secondary: "#16a34a",
    accent: "#4ade80",
    background: "#0a0a0a",
    backgroundPanel: "#111111",
    backgroundElement: "#1a1a1a",
    text: "#22c55e",
    textMuted: "#166534",
    textInverse: "#000000",
    border: "#1f4529",
    success: "#22c55e",
    error: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",
    syntaxKeyword: "#4ade80",
    syntaxString: "#86efac",
    syntaxNumber: "#fbbf24",
    syntaxFunction: "#22d3ee",
    syntaxVariable: "#22c55e",
    syntaxComment: "#166534",
    syntaxOperator: "#f472b6",
    syntaxPunctuation: "#6b7280",
    promptSymbol: "#22c55e",
    cursor: "#22c55e",
    selection: "#22c55e33",
  },
}

const tokyoNightTheme: ThemeConfig = {
  name: "tokyo-night",
  displayName: "Tokyo Night",
  description: "A clean dark theme inspired by Tokyo city lights",
  variant: "dark",
  colors: {
    primary: "#7aa2f7",
    secondary: "#bb9af7",
    accent: "#7dcfff",
    background: "#1a1b26",
    backgroundPanel: "#24283b",
    backgroundElement: "#292e42",
    text: "#c0caf5",
    textMuted: "#565f89",
    textInverse: "#1a1b26",
    border: "#3b4261",
    success: "#9ece6a",
    error: "#f7768e",
    warning: "#e0af68",
    info: "#7dcfff",
    syntaxKeyword: "#bb9af7",
    syntaxString: "#9ece6a",
    syntaxNumber: "#ff9e64",
    syntaxFunction: "#7aa2f7",
    syntaxVariable: "#c0caf5",
    syntaxComment: "#565f89",
    syntaxOperator: "#89ddff",
    syntaxPunctuation: "#c0caf5",
    promptSymbol: "#7aa2f7",
    cursor: "#c0caf5",
    selection: "#7aa2f733",
  },
}

const catppuccinTheme: ThemeConfig = {
  name: "catppuccin",
  displayName: "Catppuccin Mocha",
  description: "Soothing pastel theme for the high-spirited",
  variant: "dark",
  colors: {
    primary: "#cba6f7",
    secondary: "#f5c2e7",
    accent: "#94e2d5",
    background: "#1e1e2e",
    backgroundPanel: "#313244",
    backgroundElement: "#45475a",
    text: "#cdd6f4",
    textMuted: "#6c7086",
    textInverse: "#1e1e2e",
    border: "#45475a",
    success: "#a6e3a1",
    error: "#f38ba8",
    warning: "#f9e2af",
    info: "#89b4fa",
    syntaxKeyword: "#cba6f7",
    syntaxString: "#a6e3a1",
    syntaxNumber: "#fab387",
    syntaxFunction: "#89b4fa",
    syntaxVariable: "#f5c2e7",
    syntaxComment: "#6c7086",
    syntaxOperator: "#94e2d5",
    syntaxPunctuation: "#9399b2",
    promptSymbol: "#cba6f7",
    cursor: "#f5e0dc",
    selection: "#cba6f733",
  },
}

const gruvboxTheme: ThemeConfig = {
  name: "gruvbox",
  displayName: "Gruvbox Dark",
  description: "Retro groove color scheme with warm tones",
  variant: "dark",
  colors: {
    primary: "#fe8019",
    secondary: "#fabd2f",
    accent: "#8ec07c",
    background: "#282828",
    backgroundPanel: "#3c3836",
    backgroundElement: "#504945",
    text: "#ebdbb2",
    textMuted: "#928374",
    textInverse: "#282828",
    border: "#504945",
    success: "#b8bb26",
    error: "#fb4934",
    warning: "#fabd2f",
    info: "#83a598",
    syntaxKeyword: "#fb4934",
    syntaxString: "#b8bb26",
    syntaxNumber: "#d3869b",
    syntaxFunction: "#fabd2f",
    syntaxVariable: "#83a598",
    syntaxComment: "#928374",
    syntaxOperator: "#fe8019",
    syntaxPunctuation: "#ebdbb2",
    promptSymbol: "#fe8019",
    cursor: "#ebdbb2",
    selection: "#fe801933",
  },
}

const nordTheme: ThemeConfig = {
  name: "nord",
  displayName: "Nord",
  description: "Arctic, north-bluish color palette",
  variant: "dark",
  colors: {
    primary: "#88c0d0",
    secondary: "#81a1c1",
    accent: "#8fbcbb",
    background: "#2e3440",
    backgroundPanel: "#3b4252",
    backgroundElement: "#434c5e",
    text: "#eceff4",
    textMuted: "#4c566a",
    textInverse: "#2e3440",
    border: "#4c566a",
    success: "#a3be8c",
    error: "#bf616a",
    warning: "#ebcb8b",
    info: "#5e81ac",
    syntaxKeyword: "#81a1c1",
    syntaxString: "#a3be8c",
    syntaxNumber: "#b48ead",
    syntaxFunction: "#88c0d0",
    syntaxVariable: "#d8dee9",
    syntaxComment: "#616e88",
    syntaxOperator: "#81a1c1",
    syntaxPunctuation: "#eceff4",
    promptSymbol: "#88c0d0",
    cursor: "#d8dee9",
    selection: "#88c0d033",
  },
}

const kanagawaTheme: ThemeConfig = {
  name: "kanagawa",
  displayName: "Kanagawa",
  description: "Inspired by the famous wave painting",
  variant: "dark",
  colors: {
    primary: "#7e9cd8",
    secondary: "#957fb8",
    accent: "#7aa89f",
    background: "#1f1f28",
    backgroundPanel: "#2a2a37",
    backgroundElement: "#363646",
    text: "#dcd7ba",
    textMuted: "#727169",
    textInverse: "#1f1f28",
    border: "#54546d",
    success: "#98bb6c",
    error: "#e82424",
    warning: "#e6c384",
    info: "#7fb4ca",
    syntaxKeyword: "#957fb8",
    syntaxString: "#98bb6c",
    syntaxNumber: "#d27e99",
    syntaxFunction: "#7e9cd8",
    syntaxVariable: "#e6c384",
    syntaxComment: "#727169",
    syntaxOperator: "#c0a36e",
    syntaxPunctuation: "#9cabca",
    promptSymbol: "#7e9cd8",
    cursor: "#c8c093",
    selection: "#7e9cd833",
  },
}

const everforestTheme: ThemeConfig = {
  name: "everforest",
  displayName: "Everforest",
  description: "Comfortable and pleasant green forest palette",
  variant: "dark",
  colors: {
    primary: "#a7c080",
    secondary: "#83c092",
    accent: "#7fbbb3",
    background: "#2d353b",
    backgroundPanel: "#343f44",
    backgroundElement: "#3d484d",
    text: "#d3c6aa",
    textMuted: "#859289",
    textInverse: "#2d353b",
    border: "#475258",
    success: "#a7c080",
    error: "#e67e80",
    warning: "#dbbc7f",
    info: "#7fbbb3",
    syntaxKeyword: "#e67e80",
    syntaxString: "#a7c080",
    syntaxNumber: "#d699b6",
    syntaxFunction: "#7fbbb3",
    syntaxVariable: "#83c092",
    syntaxComment: "#859289",
    syntaxOperator: "#e69875",
    syntaxPunctuation: "#d3c6aa",
    promptSymbol: "#a7c080",
    cursor: "#d3c6aa",
    selection: "#a7c08033",
  },
}

const ayuTheme: ThemeConfig = {
  name: "ayu",
  displayName: "Ayu Dark",
  description: "Simple, bright colors on a dark background",
  variant: "dark",
  colors: {
    primary: "#e6b450",
    secondary: "#ffb454",
    accent: "#36a3d9",
    background: "#0a0e14",
    backgroundPanel: "#0d1117",
    backgroundElement: "#1f2430",
    text: "#bfbdb6",
    textMuted: "#626a73",
    textInverse: "#0a0e14",
    border: "#2d3640",
    success: "#7fd962",
    error: "#d95757",
    warning: "#ffb454",
    info: "#59c2ff",
    syntaxKeyword: "#ff8f40",
    syntaxString: "#c2d94c",
    syntaxNumber: "#e6b450",
    syntaxFunction: "#ffb454",
    syntaxVariable: "#59c2ff",
    syntaxComment: "#626a73",
    syntaxOperator: "#f29668",
    syntaxPunctuation: "#bfbdb6",
    promptSymbol: "#e6b450",
    cursor: "#e6b450",
    selection: "#e6b45033",
  },
}

const oneDarkTheme: ThemeConfig = {
  name: "one-dark",
  displayName: "One Dark",
  description: "Iconic dark theme from Atom editor",
  variant: "dark",
  colors: {
    primary: "#61afef",
    secondary: "#c678dd",
    accent: "#56b6c2",
    background: "#282c34",
    backgroundPanel: "#21252b",
    backgroundElement: "#2c323c",
    text: "#abb2bf",
    textMuted: "#5c6370",
    textInverse: "#282c34",
    border: "#3e4451",
    success: "#98c379",
    error: "#e06c75",
    warning: "#e5c07b",
    info: "#61afef",
    syntaxKeyword: "#c678dd",
    syntaxString: "#98c379",
    syntaxNumber: "#d19a66",
    syntaxFunction: "#61afef",
    syntaxVariable: "#e06c75",
    syntaxComment: "#5c6370",
    syntaxOperator: "#56b6c2",
    syntaxPunctuation: "#abb2bf",
    promptSymbol: "#61afef",
    cursor: "#528bff",
    selection: "#61afef33",
  },
}

const draculaTheme: ThemeConfig = {
  name: "dracula",
  displayName: "Dracula",
  description: "Dark theme with vibrant accent colors",
  variant: "dark",
  colors: {
    primary: "#bd93f9",
    secondary: "#ff79c6",
    accent: "#8be9fd",
    background: "#282a36",
    backgroundPanel: "#21222c",
    backgroundElement: "#343746",
    text: "#f8f8f2",
    textMuted: "#6272a4",
    textInverse: "#282a36",
    border: "#44475a",
    success: "#50fa7b",
    error: "#ff5555",
    warning: "#f1fa8c",
    info: "#8be9fd",
    syntaxKeyword: "#ff79c6",
    syntaxString: "#f1fa8c",
    syntaxNumber: "#bd93f9",
    syntaxFunction: "#50fa7b",
    syntaxVariable: "#f8f8f2",
    syntaxComment: "#6272a4",
    syntaxOperator: "#ff79c6",
    syntaxPunctuation: "#f8f8f2",
    promptSymbol: "#bd93f9",
    cursor: "#f8f8f2",
    selection: "#bd93f933",
  },
}

const monokaiTheme: ThemeConfig = {
  name: "monokai",
  displayName: "Monokai",
  description: "Classic color scheme from Sublime Text",
  variant: "dark",
  colors: {
    primary: "#f92672",
    secondary: "#ae81ff",
    accent: "#66d9ef",
    background: "#272822",
    backgroundPanel: "#1e1f1c",
    backgroundElement: "#3e3d32",
    text: "#f8f8f2",
    textMuted: "#75715e",
    textInverse: "#272822",
    border: "#49483e",
    success: "#a6e22e",
    error: "#f92672",
    warning: "#e6db74",
    info: "#66d9ef",
    syntaxKeyword: "#f92672",
    syntaxString: "#e6db74",
    syntaxNumber: "#ae81ff",
    syntaxFunction: "#a6e22e",
    syntaxVariable: "#f8f8f2",
    syntaxComment: "#75715e",
    syntaxOperator: "#f92672",
    syntaxPunctuation: "#f8f8f2",
    promptSymbol: "#a6e22e",
    cursor: "#f8f8f0",
    selection: "#f9267233",
  },
}

const solarizedTheme: ThemeConfig = {
  name: "solarized",
  displayName: "Solarized Dark",
  description: "Precision colors for machines and people",
  variant: "dark",
  colors: {
    primary: "#268bd2",
    secondary: "#6c71c4",
    accent: "#2aa198",
    background: "#002b36",
    backgroundPanel: "#073642",
    backgroundElement: "#094252",
    text: "#839496",
    textMuted: "#586e75",
    textInverse: "#fdf6e3",
    border: "#094252",
    success: "#859900",
    error: "#dc322f",
    warning: "#b58900",
    info: "#268bd2",
    syntaxKeyword: "#859900",
    syntaxString: "#2aa198",
    syntaxNumber: "#d33682",
    syntaxFunction: "#268bd2",
    syntaxVariable: "#b58900",
    syntaxComment: "#586e75",
    syntaxOperator: "#859900",
    syntaxPunctuation: "#93a1a1",
    promptSymbol: "#268bd2",
    cursor: "#839496",
    selection: "#268bd233",
  },
}

const cyberpunkTheme: ThemeConfig = {
  name: "cyberpunk",
  displayName: "Cyberpunk",
  description: "Neon-drenched futuristic aesthetic",
  variant: "dark",
  colors: {
    primary: "#ff00ff",
    secondary: "#00ffff",
    accent: "#ffff00",
    background: "#0d0221",
    backgroundPanel: "#150734",
    backgroundElement: "#1a0a3e",
    text: "#e0e0ff",
    textMuted: "#7b68ee",
    textInverse: "#0d0221",
    border: "#4a148c",
    success: "#00ff00",
    error: "#ff0055",
    warning: "#ffaa00",
    info: "#00aaff",
    syntaxKeyword: "#ff00ff",
    syntaxString: "#00ffff",
    syntaxNumber: "#ffff00",
    syntaxFunction: "#ff6ec7",
    syntaxVariable: "#00ffff",
    syntaxComment: "#7b68ee",
    syntaxOperator: "#ff00ff",
    syntaxPunctuation: "#e0e0ff",
    promptSymbol: "#ff00ff",
    cursor: "#ff00ff",
    selection: "#ff00ff33",
  },
}

export const prebuiltThemes: ThemeConfig[] = [
  matrixTheme,
  tokyoNightTheme,
  catppuccinTheme,
  gruvboxTheme,
  nordTheme,
  kanagawaTheme,
  everforestTheme,
  ayuTheme,
  oneDarkTheme,
  draculaTheme,
  monokaiTheme,
  solarizedTheme,
  cyberpunkTheme,
]

// ============================================================================
// THEME CONTEXT & PROVIDER
// ============================================================================

interface ThemeContextValue {
  theme: ThemeConfig
  setTheme: (name: string) => void
  themes: ThemeConfig[]
  registerTheme: (theme: ThemeConfig) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTerminalTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTerminalTheme must be used within a TerminalThemeProvider")
  }
  return context
}

interface TerminalThemeProviderProps {
  children: ReactNode
  defaultTheme?: string
  customThemes?: ThemeConfig[]
}

export function TerminalThemeProvider({
  children,
  defaultTheme = "matrix",
  customThemes = [],
}: TerminalThemeProviderProps) {
  const allThemes = [...prebuiltThemes, ...customThemes]
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(
    allThemes.find((t) => t.name === defaultTheme) || matrixTheme,
  )
  const [themes, setThemes] = useState<ThemeConfig[]>(allThemes)

  const setTheme = (name: string) => {
    const found = themes.find((t) => t.name === name)
    if (found) {
      setCurrentTheme(found)
    }
  }

  const registerTheme = (theme: ThemeConfig) => {
    setThemes((prev) => {
      const exists = prev.find((t) => t.name === theme.name)
      if (exists) {
        return prev.map((t) => (t.name === theme.name ? theme : t))
      }
      return [...prev, theme]
    })
  }

  return (
    <ThemeContext.Provider
      value={{
        theme: currentTheme,
        setTheme,
        themes,
        registerTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

// ============================================================================
// THEME UTILITIES
// ============================================================================

export function getTheme(name: string): ThemeConfig | undefined {
  return prebuiltThemes.find((t) => t.name === name)
}

export function createTheme(config: Partial<ThemeConfig> & { name: string; displayName: string }): ThemeConfig {
  const baseTheme = matrixTheme
  return {
    ...baseTheme,
    ...config,
    colors: {
      ...baseTheme.colors,
      ...config.colors,
    },
  }
}

export function getThemeCSS(theme: ThemeConfig): string {
  return `
    --terminal-primary: ${theme.colors.primary};
    --terminal-secondary: ${theme.colors.secondary};
    --terminal-accent: ${theme.colors.accent};
    --terminal-background: ${theme.colors.background};
    --terminal-background-panel: ${theme.colors.backgroundPanel};
    --terminal-background-element: ${theme.colors.backgroundElement};
    --terminal-text: ${theme.colors.text};
    --terminal-text-muted: ${theme.colors.textMuted};
    --terminal-border: ${theme.colors.border};
    --terminal-success: ${theme.colors.success};
    --terminal-error: ${theme.colors.error};
    --terminal-warning: ${theme.colors.warning};
    --terminal-info: ${theme.colors.info};
    --terminal-cursor: ${theme.colors.cursor};
    --terminal-selection: ${theme.colors.selection};
  `
}

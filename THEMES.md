# OpenTUI Theme System

A comprehensive, customizable theme system for terminal UI components with full light/dark mode support and multiple color schemes.

## Features

- **Light & Dark Modes**: Seamless switching between light and dark appearances
- **System Detection**: Automatic theme based on user's OS preferences  
- **5 Pre-built Color Themes**: Default Blue, Matrix Green, Cyan, Amber, and Purple
- **Fully Customizable**: Easy CSS variable-based customization
- **Zero Configuration**: Works out of the box with sensible defaults
- **Type-Safe**: Full TypeScript support

## Quick Start

### 1. Installation

Install the OpenTUI terminal component:

```bash
npx shadcn@latest add https://opentui.vercel.app/r/terminal.json
```

### 2. Add Theme Provider

Update your root layout to include the `ThemeProvider`:

```tsx
// app/layout.tsx
import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### 3. Add Theme Switcher

Use the `ThemeSwitcher` component anywhere in your app:

```tsx
import { ThemeSwitcher } from "@/components/theme-switcher"

export function Navigation() {
  return (
    <nav>
      <ThemeSwitcher />
    </nav>
  )
}
```

## Color Themes

### Pre-built Themes

#### Default (Blue)
Modern blue accent with excellent contrast for professional applications.

```css
.theme-default {
  --primary: oklch(0.65 0.22 250);
}
```

#### Matrix (Green)
Classic terminal green aesthetic inspired by the Matrix.

```css
.theme-matrix {
  --background: oklch(0.07 0.01 150);
  --foreground: oklch(0.85 0.18 145);
  --primary: oklch(0.75 0.18 145);
}
```

#### Cyan
Cool cyan tones for a tech-forward, futuristic look.

```css
.theme-cyan {
  --background: oklch(0.10 0.02 220);
  --primary: oklch(0.70 0.20 200);
}
```

#### Amber
Warm amber tones for a retro terminal feel.

```css
.theme-amber {
  --background: oklch(0.10 0.02 70);
  --primary: oklch(0.75 0.20 85);
}
```

#### Purple
Vibrant purple for creative and artistic projects.

```css
.theme-purple {
  --background: oklch(0.10 0.02 290);
  --primary: oklch(0.65 0.22 280);
}
```

### Applying Themes

#### Programmatically

```tsx
"use client"

export function ThemeButton() {
  const applyTheme = (themeName: string) => {
    const html = document.documentElement
    html.classList.add(`theme-${themeName}`)
  }

  return <button onClick={() => applyTheme("matrix")}>Matrix Theme</button>
}
```

#### Via User Selection

The `ThemeSwitcher` component provides a dropdown UI for selecting color themes and light/dark modes.

## Custom Themes

### Creating a Custom Theme

Add your custom theme to `globals.css`:

```css
/* globals.css */

.theme-ocean {
  --background: oklch(0.08 0.03 240);
  --foreground: oklch(0.92 0.08 200);
  --primary: oklch(0.65 0.20 210);
  --primary-foreground: oklch(0.98 0 0);
  --secondary: oklch(0.22 0.02 240);
  --secondary-foreground: oklch(0.92 0.08 200);
  --muted: oklch(0.25 0.02 240);
  --muted-foreground: oklch(0.60 0.05 200);
  --accent: oklch(0.30 0.03 240);
  --accent-foreground: oklch(0.92 0.08 200);
  --destructive: oklch(0.55 0.20 25);
  --destructive-foreground: oklch(0.95 0 0);
  --border: oklch(0.28 0.02 240);
  --input: oklch(0.22 0.02 240);
  --ring: oklch(0.65 0.20 210);
}
```

### Available CSS Variables

#### Core Colors
- `--background`: Main background color
- `--foreground`: Main text color
- `--card`: Card background color
- `--card-foreground`: Card text color
- `--popover`: Popover background
- `--popover-foreground`: Popover text

#### Semantic Colors
- `--primary`: Primary brand color
- `--primary-foreground`: Text on primary color
- `--secondary`: Secondary accent color
- `--secondary-foreground`: Text on secondary color
- `--muted`: Muted background
- `--muted-foreground`: Muted text
- `--accent`: Accent background
- `--accent-foreground`: Accent text
- `--destructive`: Error/danger color
- `--destructive-foreground`: Text on destructive color

#### UI Elements
- `--border`: Border color
- `--input`: Input border color
- `--ring`: Focus ring color
- `--radius`: Border radius value

#### Charts (optional)
- `--chart-1` through `--chart-5`: Chart colors

## Light & Dark Modes

### Using the useTheme Hook

```tsx
"use client"

import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Toggle Theme
    </button>
  )
}
```

### Light Mode Defaults

Light mode uses clean, high-contrast colors optimized for daylight viewing:

```css
:root {
  --background: oklch(0.99 0 0);
  --foreground: oklch(0.15 0 0);
  --primary: oklch(0.45 0.18 250);
}
```

### Dark Mode Defaults

Dark mode provides a terminal-inspired aesthetic with reduced eye strain:

```css
.dark {
  --background: oklch(0.12 0.01 260);
  --foreground: oklch(0.95 0 0);
  --primary: oklch(0.65 0.22 250);
}
```

## Best Practices

### Accessibility

1. **Contrast Ratios**: Ensure text meets WCAG AA standards (4.5:1 for normal text)
2. **Focus Indicators**: Always maintain visible focus rings
3. **Color Independence**: Don't rely solely on color to convey information

### Performance

1. **CSS Variables**: Use CSS variables for instant theme switching
2. **Disable Transitions**: Set `disableTransitionOnChange` to avoid flash
3. **Hydration**: Use `suppressHydrationWarning` on HTML element

### Consistency

1. **Semantic Colors**: Use semantic variables (`--primary`, `--muted`) instead of hardcoded colors
2. **Theme Classes**: Apply theme classes to components using Tailwind utilities
3. **Documentation**: Document custom themes for team members

## Examples

### Terminal with Custom Theme

```tsx
import { Terminal } from "@/components/ui/terminal"

export function MyTerminal() {
  return (
    <div className="theme-matrix">
      <Terminal
        welcomeMessage={["Welcome to Matrix Terminal"]}
        className="h-96"
      />
    </div>
  )
}
```

### Theme-Aware Component

```tsx
"use client"

import { useTheme } from "next-themes"

export function Logo() {
  const { resolvedTheme } = useTheme()

  return (
    <img
      src={resolvedTheme === "dark" ? "/logo-dark.svg" : "/logo-light.svg"}
      alt="Logo"
    />
  )
}
```

## Troubleshooting

### Hydration Mismatch

Add `suppressHydrationWarning` to your HTML element:

```tsx
<html lang="en" suppressHydrationWarning>
```

### Theme Not Applying

1. Verify `ThemeProvider` wraps your app
2. Check that CSS variables are defined in `globals.css`
3. Ensure theme classes are applied to the correct element

### Colors Not Changing

1. Use semantic Tailwind classes (`bg-primary`, `text-foreground`)
2. Avoid hardcoded color values (`bg-blue-500`)
3. Check browser DevTools for CSS variable values

## Resources

- [Live Theme Preview](/themes) - Interactive theme customization
- [Component Documentation](/docs) - Full component reference
- [GitHub Repository](https://github.com/sst/opentui) - Source code and examples

## License

MIT License - Feel free to use in personal and commercial projects.

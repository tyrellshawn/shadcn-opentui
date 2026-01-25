# OpenTUI Installation Guide

Complete installation guide for the OpenTUI terminal component library with theme support.

## Prerequisites

- Node.js 18+ or Bun
- Next.js 14+ (App Router)
- Tailwind CSS configured
- shadcn/ui setup (optional but recommended)

## Installation

### Option 1: Via shadcn/ui CLI (Recommended)

The easiest way to install OpenTUI is using the shadcn/ui CLI:

```bash
npx shadcn@latest add https://opentui.vercel.app/r/terminal.json
```

This will automatically:
- Install required dependencies
- Add the terminal component to your project
- Configure necessary files

### Option 2: Manual Installation

#### 1. Install Dependencies

```bash
npm install next-themes
# or
bun add next-themes
```

#### 2. Copy Component Files

Download and copy the following files to your project:

- `/components/ui/terminal.tsx` - Main terminal component
- `/components/theme-provider.tsx` - Theme provider
- `/components/theme-switcher.tsx` - Theme switcher UI
- `/lib/types.ts` - TypeScript types

#### 3. Update globals.css

Add the theme CSS variables to your `app/globals.css`:

```css
@import "tailwindcss";

:root {
  --background: oklch(0.99 0 0);
  --foreground: oklch(0.15 0 0);
  --primary: oklch(0.45 0.18 250);
  --primary-foreground: oklch(0.98 0 0);
  /* ... other variables ... */
}

.dark {
  --background: oklch(0.12 0.01 260);
  --foreground: oklch(0.95 0 0);
  --primary: oklch(0.65 0.22 250);
  --primary-foreground: oklch(0.98 0 0);
  /* ... other variables ... */
}

/* Optional color themes */
.theme-matrix {
  --primary: oklch(0.75 0.18 145);
  /* ... matrix theme ... */
}
```

See [THEMES.md](./THEMES.md) for complete CSS variable reference.

## Configuration

### 1. Setup Theme Provider

Update your root layout (`app/layout.tsx`):

```tsx
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

### 2. Add Theme Switcher (Optional)

Add the theme switcher to your navigation:

```tsx
import { ThemeSwitcher } from "@/components/theme-switcher"

export function Navigation() {
  return (
    <nav>
      {/* Your nav items */}
      <ThemeSwitcher />
    </nav>
  )
}
```

### 3. Use the Terminal Component

```tsx
import { Terminal } from "@/components/ui/terminal"

export default function Page() {
  return (
    <Terminal
      welcomeMessage={[
        "Welcome to OpenTUI",
        "Type 'help' for available commands"
      ]}
      prompt="user@system:~$"
      className="h-96"
    />
  )
}
```

## Customization

### Default Theme

Set your preferred default theme in the `ThemeProvider`:

```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="light"  // "light", "dark", or "system"
  enableSystem
>
```

### Custom Colors

Create custom color themes by adding CSS classes in `globals.css`:

```css
.theme-ocean {
  --background: oklch(0.08 0.03 240);
  --primary: oklch(0.65 0.20 210);
  /* ... other variables ... */
}
```

Apply custom themes:

```tsx
<div className="theme-ocean">
  <Terminal />
</div>
```

### Terminal Configuration

Customize terminal behavior with props:

```tsx
<Terminal
  prompt="$"
  welcomeMessage={["Welcome!"]}
  maxLines={1000}
  showTimestamp={false}
  variant="default"  // "default", "compact", "minimal"
  autoScroll={true}
  smoothScroll={true}
/>
```

## Next.js Configuration

### Tailwind CSS v4

If using Tailwind CSS v4, ensure your `globals.css` uses the inline theme directive:

```css
@theme inline {
  --font-sans: "Inter", system-ui, sans-serif;
  --font-mono: ui-monospace, monospace;
  /* ... color mappings ... */
}
```

### TypeScript

Add proper types to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## Troubleshooting

### Issue: Hydration Mismatch Error

**Solution**: Add `suppressHydrationWarning` to your `<html>` tag:

```tsx
<html lang="en" suppressHydrationWarning>
```

### Issue: Theme Not Applying

**Checklist**:
1. ✓ ThemeProvider wraps your application
2. ✓ CSS variables defined in globals.css
3. ✓ Using semantic color classes (`bg-primary` not `bg-blue-500`)
4. ✓ Component is client-side with `"use client"` directive

### Issue: Colors Are Always Green

**Solution**: The old hardcoded green colors need to be replaced with semantic tokens:

```tsx
// ❌ Don't use hardcoded colors
<div className="text-green-400 border-green-400/30">

// ✅ Use semantic colors
<div className="text-primary border-primary/30">
```

### Issue: Terminal Not Rendering

**Check**:
1. Component is properly imported
2. Parent container has defined height
3. No console errors
4. Dependencies installed correctly

## Verification

Test your installation:

```tsx
"use client"

import { Terminal } from "@/components/ui/terminal"
import { useTheme } from "next-themes"

export default function TestPage() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="p-8 space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setTheme("light")}>Light</button>
        <button onClick={() => setTheme("dark")}>Dark</button>
      </div>
      
      <Terminal
        welcomeMessage={["Installation successful!", `Current theme: ${theme}`]}
        className="h-64"
      />
    </div>
  )
}
```

If the terminal renders and theme switching works, installation is complete!

## Package Structure

After installation, your project should have:

```
project/
├── app/
│   ├── layout.tsx              # with ThemeProvider
│   ├── globals.css             # with theme variables
│   └── ...
├── components/
│   ├── ui/
│   │   └── terminal.tsx        # terminal component
│   ├── theme-provider.tsx      # theme context
│   └── theme-switcher.tsx      # theme UI
└── lib/
    ├── types.ts                # TypeScript types
    └── utils.ts                # utility functions
```

## Additional Components

Install optional OpenTUI components:

```bash
# Terminal controls
npx shadcn@latest add https://opentui.vercel.app/r/terminal-controls.json

# Terminal sliders
npx shadcn@latest add https://opentui.vercel.app/r/terminal-slider.json
```

## Resources

- [Theme Documentation](./THEMES.md) - Complete theme customization guide
- [Component Documentation](/docs) - API reference and examples
- [Live Demo](https://opentui.vercel.app) - Interactive examples
- [GitHub](https://github.com/sst/opentui) - Source code

## Support

Having issues? Check:
- [GitHub Issues](https://github.com/sst/opentui/issues)
- [Documentation](/docs)
- [Examples](/docs/examples)

## Next Steps

1. Explore [available themes](/themes)
2. Read the [theme customization guide](./THEMES.md)
3. Check out [component examples](/docs/examples)
4. Build something awesome!

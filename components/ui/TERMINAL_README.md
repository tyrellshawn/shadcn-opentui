# Terminal Component Installation Guide

This guide ensures you properly install the Terminal component with all required styles.

## Installation

When you run:
```bash
npx shadcn@latest add https://opentui.vercel.app/registry/terminal.json
```

The CLI will install:
1. `components/ui/terminal.tsx` - The main Terminal component
2. `lib/types.ts` - TypeScript type definitions
3. `components/ui/terminal.css` - Required CSS styles

## Setup

### Option 1: Import CSS in your component (Recommended)
```tsx
import { Terminal } from "@/components/ui/terminal"
import "@/components/ui/terminal.css"

export default function MyPage() {
  return <Terminal />
}
```

### Option 2: Add to global CSS
Add the contents of `components/ui/terminal.css` to your `app/globals.css` or main stylesheet:

```css
/* Terminal scrollbar styling */
.terminal-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.terminal-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.terminal-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(74, 222, 128, 0.3);
  border-radius: 3px;
}

.terminal-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(74, 222, 128, 0.5);
}

.terminal-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(74, 222, 128, 0.3) transparent;
}
```

## Verification

After installation, verify the styles are working by:

1. Check that the terminal has a custom green scrollbar
2. Terminal should have black background with green text
3. Border should be semi-transparent green
4. Mobile touch targets should be properly sized (44px min)

## Troubleshooting

### Scrollbar not styled
- Ensure `terminal.css` is imported
- Check that CSS file is in `components/ui/` directory
- Verify your bundler is processing CSS imports

### Colors not appearing
- The component uses Tailwind utility classes for colors
- Ensure Tailwind CSS is properly configured
- The terminal uses these colors: `bg-black`, `text-green-400`, `border-green-400/20`

### Mobile issues
- Component automatically detects mobile devices
- Ensure viewport meta tag is set: `<meta name="viewport" content="width=device-width, initial-scale=1" />`
- Touch targets are automatically sized to 44px minimum

## Features Included

- Command history (↑/↓ arrows)
- Tab autocomplete
- Custom command handlers
- Mobile-optimized input
- Virtual keyboard support
- Touch gestures
- Quick action toolbar (mobile)
- Smooth scrolling
- Custom theming

## Support

For issues or questions, visit: https://opentui.vercel.app/docs/components/terminal

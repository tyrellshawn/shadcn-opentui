# Plan to Update Installation Instructions for shadcn CLI v3

## Files to Update

### 1. **app/page.tsx** (lines 284-295)
**Current:**
```bash
npm install @opentui/react @opentui/core
# or from GitHub (latest)
npm install github:sst/opentui#main

# Add shadcn/ui Terminal
npx shadcn@latest add https://www.shadcn.io/registry/terminal.json
```

**Should be:**
```bash
# Install the latest shadcn CLI and initialize
bunx shadcn@latest init

# Add components from the @shadcn-opentui registry
bunx shadcn@latest add @shadcn-opentui/terminal
bunx shadcn@latest add @shadcn-opentui/terminal-controls
bunx shadcn@latest add @shadcn-opentui/terminal-slider
bunx shadcn@latest add @shadcn-opentui/terminal-block
```

### 2. **app/docs/page.tsx** (lines 118-119)
**Current:**
```bash
# Install the terminal component
npx shadcn@latest add https://opentui.vercel.app/api/registry/terminal
```

**Should be:**
```bash
# Install the terminal component
bunx shadcn@latest add @shadcn-opentui/terminal
```

### 3. **app/docs/installation/page.tsx** (lines 66, 87)
**Current:**
```bash
npx shadcn@latest add https://opentui.vercel.app/api/registry/terminal

# Manual installation
curl -o components/ui/terminal.tsx https://opentui.vercel.app/api/registry/terminal/raw
```

**Should be:**
```bash
bunx shadcn@latest add @shadcn-opentui/terminal

# Manual installation (if needed)
# Download from: https://opentui.vercel.app/r/terminal.json
```

## Key Changes Needed:
1. Replace `npx shadcn@latest` with `bunx shadcn@latest`
2. Replace URL-based installation (`--from=URL` or direct URLs) with registry syntax (`@shadcn-opentui/component`)
3. Add `bunx shadcn@latest init` step where appropriate
4. Update manual installation references to point to the correct registry URLs
5. Remove outdated OpenTUI package installation instructions that are no longer needed

The plan ensures all installation instructions across the documentation site are consistent with the new shadcn CLI v3 registry approach.
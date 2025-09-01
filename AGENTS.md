# Agent Guidelines for shadcn-opentui

## Commands
- Build: `npm run build`
- Dev: `npm run dev`
- Lint: `npm run lint`
- Start: `npm run start`

## Code Style
- **Imports**: Use absolute imports with `@/` prefix (e.g., `import { cn } from "@/lib/utils"`)
- **Types**: Use TypeScript with strict mode enabled; prefer explicit types over `any`
- **Components**: Use functional components with explicit type definitions
- **Naming**: Use PascalCase for components, camelCase for functions/variables
- **CSS**: Use Tailwind with `cn()` utility for class merging
- **Error Handling**: Use try/catch blocks for async operations
- **Formatting**: 2-space indentation, single quotes for strings
- **Component Props**: Define using React.ComponentProps with additional properties
- **File Structure**: Keep related components in same directory
- **State Management**: Use React hooks for local state

## Architecture
- Next.js application with shadcn UI components
- Tailwind for styling
- TypeScript for type safety
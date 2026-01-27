// Build script for OpenTUI shadcn registry
// Generates registry JSON files for component distribution

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT_DIR = join(__dirname, '..')

// Registry configuration
const REGISTRY_CONFIG = {
  name: '@shadcn-opentui',
  description: 'Terminal components for shadcn/ui powered by OpenTUI',
  homepage: 'https://opentui.dev',
  repository: 'https://github.com/shadcn-opentui/terminal',
}

// Components to include in the registry
const COMPONENTS = [
  {
    name: 'terminal',
    type: 'registry:ui',
    title: 'Terminal',
    description: 'A fully featured terminal emulator component with command history, autocomplete, and theming.',
    dependencies: ['lucide-react', 'tailwind-merge', 'clsx', 'tailwindcss-animate', 'tailwindcss'],
    registryDependencies: [],
    tailwind: {
      config: {
        theme: {
          extend: {
            keyframes: {
              'terminal-blink': {
                '0%, 50%': { opacity: '1' },
                '51%, 100%': { opacity: '0' },
              },
            },
            animation: {
              'terminal-blink': 'terminal-blink 1s infinite',
            },
          },
        },
      },
    },
    css: {
      ".terminal-scrollbar::-webkit-scrollbar": {
        "width": "6px"
      },
      ".terminal-scrollbar::-webkit-scrollbar-track": {
        "background": "transparent"
      },
      ".terminal-scrollbar::-webkit-scrollbar-thumb": {
        "background": "rgba(74, 222, 128, 0.3)",
        "border-radius": "3px"
      },
      ".terminal-scrollbar::-webkit-scrollbar-thumb:hover": {
        "background": "rgba(74, 222, 128, 0.5)"
      },
      ".terminal-scrollbar": {
        "scrollbar-width": "thin",
        "scrollbar-color": "rgba(74, 222, 128, 0.3) transparent"
      }
    },
    files: ['components/ui/terminal.tsx'],
  },
  {
    name: 'terminal-controls',
    type: 'registry:ui',
    title: 'Terminal Controls',
    description: 'Window control buttons (close, minimize, maximize) for the terminal.',
    dependencies: ['class-variance-authority', 'tailwind-merge', 'clsx'],
    files: ['components/ui/terminal-controls.tsx'],
    registryDependencies: ['terminal'],
  },
  {
    name: 'terminal-slider',
    type: 'registry:ui',
    title: 'Terminal Slider',
    description: 'An ASCII slider component for terminal interfaces.',
    dependencies: ['@radix-ui/react-slider', 'tailwind-merge', 'clsx'],
    files: ['components/ui/terminal-slider.tsx'],
    registryDependencies: ['terminal'],
  },
]

// Plugin components to include in the registry
const PLUGINS = [
  {
    name: 'cli-plugin-types',
    type: 'registry:lib',
    title: 'CLI Plugin Types',
    description: 'Type definitions for the CLI plugin framework supporting Ink v6.6.0+ and Pastel v4.0.0+.',
    dependencies: [],
    registryDependencies: [],
    files: ['lib/opentui/plugins/cli/types.ts'],
  },
  {
    name: 'cli-terminal-bridge',
    type: 'registry:lib',
    title: 'CLI Terminal Bridge',
    description: 'Bridge between CLI apps and OpenTUI terminal I/O.',
    dependencies: [],
    registryDependencies: ['cli-plugin-types'],
    files: ['lib/opentui/plugins/cli/cli-terminal-bridge.ts'],
  },
  {
    name: 'cli-version-negotiator',
    type: 'registry:lib',
    title: 'CLI Version Negotiator',
    description: 'Semver-based version compatibility and feature negotiation for CLI plugins.',
    dependencies: [],
    registryDependencies: ['cli-plugin-types'],
    files: ['lib/opentui/plugins/cli/adapters/version-negotiator.ts'],
  },
  {
    name: 'cli-base-adapter',
    type: 'registry:lib',
    title: 'CLI Base Adapter',
    description: 'Abstract base class for CLI library adapters.',
    dependencies: [],
    registryDependencies: ['cli-plugin-types', 'cli-version-negotiator'],
    files: ['lib/opentui/plugins/cli/adapters/base-adapter.ts'],
  },
  {
    name: 'cli-ink-adapter',
    type: 'registry:lib',
    title: 'Ink v6 Adapter',
    description: 'Adapter for Ink v6.6.0+ CLI components. Bridges Ink apps to OpenTUI terminal.',
    dependencies: ['ink@^6.6.0'],
    registryDependencies: ['cli-plugin-types', 'cli-base-adapter', 'cli-version-negotiator'],
    files: ['lib/opentui/plugins/cli/adapters/ink-adapter.ts'],
  },
  {
    name: 'cli-pastel-adapter',
    type: 'registry:lib',
    title: 'Pastel v4 Adapter',
    description: 'Adapter for Pastel v4.0.0+ CLI components (future implementation).',
    dependencies: [],
    registryDependencies: ['cli-plugin-types', 'cli-base-adapter', 'cli-version-negotiator'],
    files: ['lib/opentui/plugins/cli/adapters/pastel-adapter.ts'],
  },
  {
    name: 'cli-adapters',
    type: 'registry:lib',
    title: 'CLI Adapters',
    description: 'All CLI library adapters (Ink, Pastel) with version negotiation.',
    dependencies: ['ink@^6.6.0'],
    registryDependencies: ['cli-base-adapter', 'cli-ink-adapter', 'cli-pastel-adapter', 'cli-version-negotiator'],
    files: ['lib/opentui/plugins/cli/adapters/index.ts'],
  },
  {
    name: 'cli-app-registry',
    type: 'registry:lib',
    title: 'CLI App Registry',
    description: 'Registry for managing CLI application registration and lookup.',
    dependencies: [],
    registryDependencies: ['cli-plugin-types'],
    files: ['lib/opentui/plugins/cli/cli-app-registry.ts'],
  },
  {
    name: 'cli-plugin-host',
    type: 'registry:lib',
    title: 'CLI Plugin Host',
    description: 'Host for managing CLI app execution, lifecycle, and adapters.',
    dependencies: ['ink@^6.6.0'],
    registryDependencies: ['cli-plugin-types', 'cli-app-registry', 'cli-terminal-bridge', 'cli-ink-adapter'],
    files: ['lib/opentui/plugins/cli/cli-plugin-host.ts'],
  },
  {
    name: 'cli-app-builder',
    type: 'registry:lib',
    title: 'CLI App Builder',
    description: 'Fluent API for creating CLI applications with type-safe configuration.',
    dependencies: [],
    registryDependencies: ['cli-plugin-types'],
    files: ['lib/opentui/plugins/cli/create-cli-app.ts'],
  },
  {
    name: 'cli-plugin',
    type: 'registry:lib',
    title: 'CLI Plugin Framework',
    description: 'Complete CLI plugin framework for OpenTUI. Supports Ink v6.6.0+ and Pastel v4.0.0+ with version negotiation, app registry, and fluent builder API.',
    dependencies: ['ink@^6.6.0'],
    registryDependencies: [
      'cli-plugin-types',
      'cli-terminal-bridge', 
      'cli-adapters',
      'cli-app-registry',
      'cli-plugin-host',
      'cli-app-builder',
    ],
    files: ['lib/opentui/plugins/cli/index.ts'],
  },
]

// Read file content and encode for registry
function readComponentFile(filePath) {
  const fullPath = join(ROOT_DIR, filePath)
  if (!existsSync(fullPath)) {
    console.warn(`Warning: File not found: ${filePath}`)
    return null
  }
  return readFileSync(fullPath, 'utf-8')
}

// Generate registry item for a component
function generateRegistryItem(component) {
  const files = component.files
    .map((filePath) => {
      const content = readComponentFile(filePath)
      if (!content) return null
      return {
        path: filePath,
        content,
        type: 'registry:ui',
      }
    })
    .filter(Boolean)

  return {
    name: component.name,
    type: component.type,
    title: component.title,
    description: component.description,
    dependencies: component.dependencies,
    registryDependencies: component.registryDependencies,
    tailwind: component.tailwind,
    css: component.css,
    files,
  }
}

// Generate the full registry
function generateRegistry() {
  const allItems = [...COMPONENTS, ...PLUGINS]
  
  const registry = {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: REGISTRY_CONFIG.name,
    description: REGISTRY_CONFIG.description,
    homepage: REGISTRY_CONFIG.homepage,
    repository: REGISTRY_CONFIG.repository,
    items: allItems.map(generateRegistryItem),
  }

  return registry
}

// Main build function
function build() {
  console.log('Building OpenTUI registry...')

  // Create output directory
  const outputDir = join(ROOT_DIR, 'public', 'registry')
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  // Generate main registry
  const registry = generateRegistry()

  // Write main registry file
  const registryPath = join(outputDir, 'index.json')
  writeFileSync(registryPath, JSON.stringify(registry, null, 2))
  console.log(`Generated: ${registryPath}`)

  // Write individual component files
  for (const item of registry.items) {
    const componentPath = join(outputDir, `${item.name}.json`)
    writeFileSync(componentPath, JSON.stringify(item, null, 2))
    console.log(`Generated: ${componentPath}`)
  }

  // Generate registry manifest
  const manifest = {
    version: '1.0.0',
    components: COMPONENTS.map((c) => c.name),
    plugins: PLUGINS.map((p) => p.name),
    generatedAt: new Date().toISOString(),
  }
  const manifestPath = join(outputDir, 'manifest.json')
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
  console.log(`Generated: ${manifestPath}`)

  console.log('\nRegistry build complete!')
  console.log(`Total components: ${registry.items.length}`)
}

// Run build
build()

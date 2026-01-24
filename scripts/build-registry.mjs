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
    dependencies: ['lucide-react'],
    files: ['components/ui/terminal.tsx'],
    registryDependencies: [],
  },
  {
    name: 'terminal-controls',
    type: 'registry:ui',
    title: 'Terminal Controls',
    description: 'Window control buttons (close, minimize, maximize) for the terminal.',
    dependencies: [],
    files: ['components/ui/terminal-controls.tsx'],
    registryDependencies: ['terminal'],
  },
  {
    name: 'terminal-slider',
    type: 'registry:ui',
    title: 'Terminal Slider',
    description: 'An ASCII slider component for terminal interfaces.',
    dependencies: [],
    files: ['components/ui/terminal-slider.tsx'],
    registryDependencies: ['terminal'],
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
    files,
  }
}

// Generate the full registry
function generateRegistry() {
  const registry = {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: REGISTRY_CONFIG.name,
    description: REGISTRY_CONFIG.description,
    homepage: REGISTRY_CONFIG.homepage,
    repository: REGISTRY_CONFIG.repository,
    items: COMPONENTS.map(generateRegistryItem),
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

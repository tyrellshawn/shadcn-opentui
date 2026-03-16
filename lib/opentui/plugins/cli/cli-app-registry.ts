// CLI App Registry
// Manages registration and lookup of CLI applications

import type { 
  CLIAppDefinition, 
  CLIAppRegistry, 
  CLILibrary,
  CLIAdapterRegistry,
  ICLIAdapter,
  VersionRange,
} from "./types"

/**
 * Implementation of CLIAppRegistry
 */
class CLIAppRegistryImpl implements CLIAppRegistry {
  private apps = new Map<string, CLIAppDefinition>()
  private aliasMap = new Map<string, string>() // alias -> name

  register(app: CLIAppDefinition): void {
    if (!app.manifest.name) {
      throw new Error("App manifest must have a name")
    }

    const name = app.manifest.name

    if (this.apps.has(name)) {
      throw new Error(`App "${name}" is already registered`)
    }

    this.apps.set(name, app)

    // Register entry command as alias if specified
    if (app.manifest.entryCommand && app.manifest.entryCommand !== name) {
      this.aliasMap.set(app.manifest.entryCommand, name)
    }

    // Register command aliases
    if (app.commands) {
      for (const cmd of app.commands) {
        if (cmd.aliases) {
          for (const alias of cmd.aliases) {
            const aliasKey = `${name}:${alias}`
            this.aliasMap.set(aliasKey, `${name}:${cmd.name}`)
          }
        }
      }
    }

    // Call lifecycle hook
    if (app.lifecycle?.onRegister) {
      app.lifecycle.onRegister(this)
    }
  }

  unregister(name: string): void {
    const app = this.apps.get(name)
    if (!app) return

    // Remove aliases
    if (app.manifest.entryCommand) {
      this.aliasMap.delete(app.manifest.entryCommand)
    }

    if (app.commands) {
      for (const cmd of app.commands) {
        if (cmd.aliases) {
          for (const alias of cmd.aliases) {
            this.aliasMap.delete(`${name}:${alias}`)
          }
        }
      }
    }

    this.apps.delete(name)
  }

  get(name: string): CLIAppDefinition | undefined {
    // Check direct name first
    if (this.apps.has(name)) {
      return this.apps.get(name)
    }

    // Check aliases
    const resolvedName = this.aliasMap.get(name)
    if (resolvedName) {
      return this.apps.get(resolvedName)
    }

    return undefined
  }

  list(): CLIAppDefinition[] {
    return Array.from(this.apps.values())
  }

  has(name: string): boolean {
    return this.apps.has(name) || this.aliasMap.has(name)
  }

  getByLibrary(library: CLILibrary): CLIAppDefinition[] {
    return this.list().filter((app) => app.manifest.library === library)
  }

  search(query: string): CLIAppDefinition[] {
    const lowerQuery = query.toLowerCase()
    
    return this.list().filter((app) => {
      const { name, description, keywords } = app.manifest
      
      // Search in name
      if (name.toLowerCase().includes(lowerQuery)) return true
      
      // Search in description
      if (description?.toLowerCase().includes(lowerQuery)) return true
      
      // Search in keywords
      if (keywords?.some((kw) => kw.toLowerCase().includes(lowerQuery))) return true
      
      // Search in commands
      if (app.commands?.some((cmd) => 
        cmd.name.toLowerCase().includes(lowerQuery) ||
        cmd.description.toLowerCase().includes(lowerQuery)
      )) return true
      
      return false
    })
  }

  count(): number {
    return this.apps.size
  }

  /**
   * Clear all registered apps
   */
  clear(): void {
    this.apps.clear()
    this.aliasMap.clear()
  }

  /**
   * Get all registered app names
   */
  getNames(): string[] {
    return Array.from(this.apps.keys())
  }

  /**
   * Export registry data for persistence
   */
  export(): { apps: CLIAppDefinition[]; aliases: Record<string, string> } {
    return {
      apps: this.list(),
      aliases: Object.fromEntries(this.aliasMap),
    }
  }
}

/**
 * Implementation of CLIAdapterRegistry
 */
class CLIAdapterRegistryImpl implements CLIAdapterRegistry {
  private adapters = new Map<CLILibrary, ICLIAdapter>()

  register(adapter: ICLIAdapter): void {
    const library = adapter.library
    
    if (this.adapters.has(library)) {
      console.warn(`Overwriting existing adapter for library: ${library}`)
    }
    
    this.adapters.set(library, adapter)
  }

  unregister(library: CLILibrary): void {
    this.adapters.delete(library)
  }

  getAdapter(library: CLILibrary): ICLIAdapter | undefined {
    return this.adapters.get(library)
  }

  list(): ICLIAdapter[] {
    return Array.from(this.adapters.values())
  }

  supportsLibrary(library: CLILibrary): boolean {
    return this.adapters.has(library)
  }

  getSupportedVersions(library: CLILibrary): VersionRange | undefined {
    const adapter = this.adapters.get(library)
    return adapter?.supportedVersions
  }

  /**
   * Clear all registered adapters
   */
  clear(): void {
    this.adapters.clear()
  }

  /**
   * Get count of registered adapters
   */
  count(): number {
    return this.adapters.size
  }
}

/**
 * Create a new CLI app registry instance
 */
export function createCLIAppRegistry(): CLIAppRegistry {
  return new CLIAppRegistryImpl()
}

/**
 * Create a new CLI adapter registry instance
 */
export function createCLIAdapterRegistry(): CLIAdapterRegistry {
  return new CLIAdapterRegistryImpl()
}

// Export implementation classes for advanced use
export { CLIAppRegistryImpl, CLIAdapterRegistryImpl }

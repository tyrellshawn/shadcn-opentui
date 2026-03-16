// CLI App Builder
// Fluent API for creating CLI applications

import type {
  CLIAppDefinition,
  CLIAppManifest,
  CLIAppCapabilities,
  CLIAppLifecycle,
  CLIAppContext,
  CLIAppRegistry,
  CLICommand,
  CLICommandArg,
  CLICommandFlag,
  CLILibrary,
  VersionRange,
} from "./types"

/**
 * CLI App Builder interface
 * Provides a fluent API for creating CLI applications
 */
export interface CLIAppBuilder<TProps = Record<string, unknown>> {
  // ============================================
  // Manifest Configuration
  // ============================================

  /** Set the app name (required) */
  name(name: string): CLIAppBuilder<TProps>
  
  /** Set the app version */
  version(version: string): CLIAppBuilder<TProps>
  
  /** Set the app description */
  description(desc: string): CLIAppBuilder<TProps>
  
  /** Set the author */
  author(author: string): CLIAppBuilder<TProps>
  
  /** Set the repository URL */
  repository(url: string): CLIAppBuilder<TProps>
  
  /** Add keywords for discoverability */
  keywords(...keywords: string[]): CLIAppBuilder<TProps>
  
  /** Set the license */
  license(license: string): CLIAppBuilder<TProps>

  // ============================================
  // Library Targeting
  // ============================================

  /** Target Ink library with optional version range */
  forInk(version?: VersionRange): CLIAppBuilder<TProps>
  
  /** Target Pastel library with optional version range */
  forPastel(version?: VersionRange): CLIAppBuilder<TProps>
  
  /** Target a specific library with version range */
  forLibrary(library: CLILibrary, version: VersionRange): CLIAppBuilder<TProps>

  // ============================================
  // Capabilities
  // ============================================

  /** Declare that the app requires keyboard input */
  requiresInput(): CLIAppBuilder<TProps>
  
  /** Declare that the app needs fullscreen mode */
  requiresFullscreen(): CLIAppBuilder<TProps>
  
  /** Declare that the app needs network access */
  requiresNetwork(): CLIAppBuilder<TProps>
  
  /** Declare that the app needs file system access */
  requiresFileSystem(): CLIAppBuilder<TProps>
  
  /** Declare that the app needs persistent state */
  requiresPersistentState(): CLIAppBuilder<TProps>
  
  /** Declare that the app uses focus management */
  requiresFocusManagement(): CLIAppBuilder<TProps>
  
  /** Set multiple capabilities at once */
  withCapabilities(caps: Partial<CLIAppCapabilities>): CLIAppBuilder<TProps>

  // ============================================
  // Commands
  // ============================================

  /** Add a command to the app */
  command(cmd: CLICommand): CLIAppBuilder<TProps>
  
  /** Set the entry command name */
  entryCommand(name: string): CLIAppBuilder<TProps>
  
  /** Add a simple command with handler */
  addCommand(
    name: string,
    description: string,
    handler: CLICommand["handler"],
    options?: Partial<Omit<CLICommand, "name" | "description" | "handler">>
  ): CLIAppBuilder<TProps>

  // ============================================
  // Component
  // ============================================

  /** Set the main component for the app */
  component<P extends Record<string, unknown>>(
    component: React.ComponentType<P & CLIAppContext>
  ): CLIAppBuilder<P>

  // ============================================
  // Lifecycle Hooks
  // ============================================

  /** Called when app is registered */
  onRegister(fn: (registry: CLIAppRegistry) => void): CLIAppBuilder<TProps>
  
  /** Called before app starts */
  onBeforeStart(fn: (context: CLIAppContext) => void | Promise<void>): CLIAppBuilder<TProps>
  
  /** Called when app exits */
  onExit(fn: (code: number) => void): CLIAppBuilder<TProps>
  
  /** Called when app encounters an error */
  onError(fn: (error: Error) => void): CLIAppBuilder<TProps>
  
  /** Called when app is suspended */
  onSuspend(fn: () => void): CLIAppBuilder<TProps>
  
  /** Called when app is resumed */
  onResume(fn: () => void): CLIAppBuilder<TProps>

  // ============================================
  // Build
  // ============================================

  /** Build the CLI app definition */
  build(): CLIAppDefinition<TProps>
}

/**
 * CLI App Builder Implementation
 */
class CLIAppBuilderImpl<TProps = Record<string, unknown>> implements CLIAppBuilder<TProps> {
  private manifest: Partial<CLIAppManifest> = {
    library: "ink",
    libraryVersion: ">=6.6.0",
  }
  private capabilities: CLIAppCapabilities = {}
  private commands: CLICommand[] = []
  private lifecycle: CLIAppLifecycle = {}
  private _component: React.ComponentType<TProps & CLIAppContext> | null = null

  // ============================================
  // Manifest Configuration
  // ============================================

  name(name: string): CLIAppBuilder<TProps> {
    this.manifest.name = name
    return this
  }

  version(version: string): CLIAppBuilder<TProps> {
    this.manifest.version = version
    return this
  }

  description(desc: string): CLIAppBuilder<TProps> {
    this.manifest.description = desc
    return this
  }

  author(author: string): CLIAppBuilder<TProps> {
    this.manifest.author = author
    return this
  }

  repository(url: string): CLIAppBuilder<TProps> {
    this.manifest.repository = url
    return this
  }

  keywords(...keywords: string[]): CLIAppBuilder<TProps> {
    this.manifest.keywords = [...(this.manifest.keywords || []), ...keywords]
    return this
  }

  license(license: string): CLIAppBuilder<TProps> {
    this.manifest.license = license
    return this
  }

  // ============================================
  // Library Targeting
  // ============================================

  forInk(version: VersionRange = ">=6.6.0"): CLIAppBuilder<TProps> {
    this.manifest.library = "ink"
    this.manifest.libraryVersion = version
    return this
  }

  forPastel(version: VersionRange = ">=4.0.0"): CLIAppBuilder<TProps> {
    this.manifest.library = "pastel"
    this.manifest.libraryVersion = version
    return this
  }

  forLibrary(library: CLILibrary, version: VersionRange): CLIAppBuilder<TProps> {
    this.manifest.library = library
    this.manifest.libraryVersion = version
    return this
  }

  // ============================================
  // Capabilities
  // ============================================

  requiresInput(): CLIAppBuilder<TProps> {
    this.capabilities.stdin = true
    return this
  }

  requiresFullscreen(): CLIAppBuilder<TProps> {
    this.capabilities.fullscreen = true
    return this
  }

  requiresNetwork(): CLIAppBuilder<TProps> {
    this.capabilities.networking = true
    return this
  }

  requiresFileSystem(): CLIAppBuilder<TProps> {
    this.capabilities.fileSystem = true
    return this
  }

  requiresPersistentState(): CLIAppBuilder<TProps> {
    this.capabilities.persistentState = true
    return this
  }

  requiresFocusManagement(): CLIAppBuilder<TProps> {
    this.capabilities.focusManagement = true
    return this
  }

  withCapabilities(caps: Partial<CLIAppCapabilities>): CLIAppBuilder<TProps> {
    this.capabilities = { ...this.capabilities, ...caps }
    return this
  }

  // ============================================
  // Commands
  // ============================================

  command(cmd: CLICommand): CLIAppBuilder<TProps> {
    this.commands.push(cmd)
    return this
  }

  entryCommand(name: string): CLIAppBuilder<TProps> {
    this.manifest.entryCommand = name
    return this
  }

  addCommand(
    name: string,
    description: string,
    handler: CLICommand["handler"],
    options?: Partial<Omit<CLICommand, "name" | "description" | "handler">>
  ): CLIAppBuilder<TProps> {
    this.commands.push({
      name,
      description,
      handler,
      ...options,
    })
    return this
  }

  // ============================================
  // Component
  // ============================================

  component<P extends Record<string, unknown>>(
    component: React.ComponentType<P & CLIAppContext>
  ): CLIAppBuilder<P> {
    // Type assertion needed for fluent API with type change
    (this as unknown as CLIAppBuilderImpl<P>)._component = component
    return this as unknown as CLIAppBuilder<P>
  }

  // ============================================
  // Lifecycle Hooks
  // ============================================

  onRegister(fn: (registry: CLIAppRegistry) => void): CLIAppBuilder<TProps> {
    this.lifecycle.onRegister = fn
    return this
  }

  onBeforeStart(fn: (context: CLIAppContext) => void | Promise<void>): CLIAppBuilder<TProps> {
    this.lifecycle.onBeforeStart = fn
    return this
  }

  onExit(fn: (code: number) => void): CLIAppBuilder<TProps> {
    this.lifecycle.onExit = fn
    return this
  }

  onError(fn: (error: Error) => void): CLIAppBuilder<TProps> {
    this.lifecycle.onError = fn
    return this
  }

  onSuspend(fn: () => void): CLIAppBuilder<TProps> {
    this.lifecycle.onSuspend = fn
    return this
  }

  onResume(fn: () => void): CLIAppBuilder<TProps> {
    this.lifecycle.onResume = fn
    return this
  }

  // ============================================
  // Build
  // ============================================

  build(): CLIAppDefinition<TProps> {
    // Validate required fields
    if (!this.manifest.name) {
      throw new Error("App name is required. Use .name() to set it.")
    }

    if (!this._component) {
      throw new Error("App component is required. Use .component() to set it.")
    }

    // Build the manifest
    const manifest: CLIAppManifest = {
      name: this.manifest.name,
      version: this.manifest.version || "1.0.0",
      library: this.manifest.library || "ink",
      libraryVersion: this.manifest.libraryVersion || ">=6.6.0",
      description: this.manifest.description,
      author: this.manifest.author,
      repository: this.manifest.repository,
      keywords: this.manifest.keywords,
      license: this.manifest.license,
      entryCommand: this.manifest.entryCommand,
      capabilities: Object.keys(this.capabilities).length > 0 ? this.capabilities : undefined,
    }

    // Build the definition
    const definition: CLIAppDefinition<TProps> = {
      manifest,
      Component: this._component,
      commands: this.commands.length > 0 ? this.commands : undefined,
      lifecycle: Object.keys(this.lifecycle).length > 0 ? this.lifecycle : undefined,
    }

    return definition
  }
}

/**
 * Create a new CLI App Builder
 * 
 * @example
 * ```typescript
 * const myApp = createCLIApp()
 *   .name("my-app")
 *   .version("1.0.0")
 *   .description("My awesome CLI app")
 *   .forInk(">=6.6.0")
 *   .requiresInput()
 *   .component(({ terminal, exit }) => {
 *     // Your Ink component here
 *     return <Text>Hello World</Text>
 *   })
 *   .build()
 * ```
 */
export function createCLIApp(): CLIAppBuilder {
  return new CLIAppBuilderImpl()
}

// ============================================
// Command Builder Helper
// ============================================

/**
 * Command builder for creating CLI commands
 */
export interface CommandBuilder {
  /** Set command description */
  description(desc: string): CommandBuilder
  
  /** Add an alias */
  alias(alias: string): CommandBuilder
  
  /** Add aliases */
  aliases(...aliases: string[]): CommandBuilder
  
  /** Add a positional argument */
  arg(name: string, options?: Partial<CLICommandArg>): CommandBuilder
  
  /** Add a flag option */
  flag(name: string, options?: Partial<CLICommandFlag>): CommandBuilder
  
  /** Add a boolean flag */
  booleanFlag(name: string, options?: Partial<Omit<CLICommandFlag, "type">>): CommandBuilder
  
  /** Add a string flag */
  stringFlag(name: string, options?: Partial<Omit<CLICommandFlag, "type">>): CommandBuilder
  
  /** Add a number flag */
  numberFlag(name: string, options?: Partial<Omit<CLICommandFlag, "type">>): CommandBuilder
  
  /** Add a subcommand */
  subcommand(cmd: CLICommand): CommandBuilder
  
  /** Add example usage */
  example(example: string): CommandBuilder
  
  /** Set the handler function */
  handler(fn: CLICommand["handler"]): CommandBuilder
  
  /** Build the command */
  build(): CLICommand
}

/**
 * Command Builder Implementation
 */
class CommandBuilderImpl implements CommandBuilder {
  private _name: string
  private _description = ""
  private _aliases: string[] = []
  private _args: CLICommandArg[] = []
  private _flags: CLICommandFlag[] = []
  private _subcommands: CLICommand[] = []
  private _examples: string[] = []
  private _handler: CLICommand["handler"]

  constructor(name: string) {
    this._name = name
  }

  description(desc: string): CommandBuilder {
    this._description = desc
    return this
  }

  alias(alias: string): CommandBuilder {
    this._aliases.push(alias)
    return this
  }

  aliases(...aliases: string[]): CommandBuilder {
    this._aliases.push(...aliases)
    return this
  }

  arg(name: string, options?: Partial<CLICommandArg>): CommandBuilder {
    this._args.push({ name, ...options })
    return this
  }

  flag(name: string, options?: Partial<CLICommandFlag>): CommandBuilder {
    this._flags.push({ name, type: options?.type || "string", ...options })
    return this
  }

  booleanFlag(name: string, options?: Partial<Omit<CLICommandFlag, "type">>): CommandBuilder {
    this._flags.push({ name, type: "boolean", ...options })
    return this
  }

  stringFlag(name: string, options?: Partial<Omit<CLICommandFlag, "type">>): CommandBuilder {
    this._flags.push({ name, type: "string", ...options })
    return this
  }

  numberFlag(name: string, options?: Partial<Omit<CLICommandFlag, "type">>): CommandBuilder {
    this._flags.push({ name, type: "number", ...options })
    return this
  }

  subcommand(cmd: CLICommand): CommandBuilder {
    this._subcommands.push(cmd)
    return this
  }

  example(example: string): CommandBuilder {
    this._examples.push(example)
    return this
  }

  handler(fn: CLICommand["handler"]): CommandBuilder {
    this._handler = fn
    return this
  }

  build(): CLICommand {
    return {
      name: this._name,
      description: this._description,
      aliases: this._aliases.length > 0 ? this._aliases : undefined,
      args: this._args.length > 0 ? this._args : undefined,
      flags: this._flags.length > 0 ? this._flags : undefined,
      subcommands: this._subcommands.length > 0 ? this._subcommands : undefined,
      examples: this._examples.length > 0 ? this._examples : undefined,
      handler: this._handler,
    }
  }
}

/**
 * Create a command builder
 * 
 * @example
 * ```typescript
 * const listCommand = createCommand("list")
 *   .description("List all items")
 *   .alias("ls")
 *   .stringFlag("format", { char: "f", default: "table" })
 *   .booleanFlag("verbose", { char: "v" })
 *   .handler((args, flags, ctx) => {
 *     ctx.terminal.writeLine("Listing items...")
 *   })
 *   .build()
 * ```
 */
export function createCommand(name: string): CommandBuilder {
  return new CommandBuilderImpl(name)
}

// Export implementation classes for advanced use
export { CLIAppBuilderImpl, CommandBuilderImpl }

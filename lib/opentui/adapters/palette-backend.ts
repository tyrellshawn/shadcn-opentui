export type PaletteBackend = 'cmdk' | 'opentui'

export interface ResolveBackendOptions {
  requested?: PaletteBackend
  hasOpentuiRuntime?: boolean
}

export interface ResolvedBackend {
  backend: PaletteBackend
  fallbackReason?: string
}

export function resolvePaletteBackend(
  options: ResolveBackendOptions = {},
): ResolvedBackend {
  const requested = options.requested ?? 'opentui'

  if (requested === 'opentui' && options.hasOpentuiRuntime === false) {
    return {
      backend: 'cmdk',
      fallbackReason: 'OpenTUI runtime unavailable; using cmdk backend.',
    }
  }

  return { backend: requested }
}

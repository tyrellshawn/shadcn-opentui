import { describe, expect, it } from 'vitest'

import { resolvePaletteBackend } from '@/lib/opentui/adapters/palette-backend'

describe('resolvePaletteBackend', () => {
  it('defaults to opentui backend', () => {
    expect(resolvePaletteBackend()).toEqual({ backend: 'opentui' })
  })

  it('returns opentui when runtime is available', () => {
    expect(
      resolvePaletteBackend({
        requested: 'opentui',
        hasOpentuiRuntime: true,
      }),
    ).toEqual({ backend: 'opentui' })
  })

  it('falls back to cmdk when opentui runtime is unavailable', () => {
    const resolved = resolvePaletteBackend({
      requested: 'opentui',
      hasOpentuiRuntime: false,
    })

    expect(resolved.backend).toBe('cmdk')
    expect(resolved.fallbackReason).toContain('OpenTUI runtime unavailable')
  })
})

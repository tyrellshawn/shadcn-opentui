import { describe, expect, it } from 'vitest'

import { mergeThemes } from '@/lib/opentui/theme-utils'
import type { ThemeConfig } from '@/lib/opentui/themes'

const makeTheme = (name: string, primary: string): ThemeConfig => ({
  name,
  displayName: name,
  description: `Theme ${name}`,
  variant: 'dark',
  colors: {
    primary,
    secondary: '#111111',
    accent: '#222222',
    background: '#000000',
    backgroundPanel: '#010101',
    backgroundElement: '#020202',
    text: '#ffffff',
    textMuted: '#cccccc',
    textInverse: '#000000',
    border: '#333333',
    success: '#00ff00',
    error: '#ff0000',
    warning: '#ffaa00',
    info: '#00aaff',
    syntaxKeyword: '#ff00ff',
    syntaxString: '#00ffff',
    syntaxNumber: '#ffff00',
    syntaxFunction: '#9999ff',
    syntaxVariable: '#ffffff',
    syntaxComment: '#777777',
    syntaxOperator: '#ff66aa',
    syntaxPunctuation: '#dddddd',
    promptSymbol: '#00ff00',
    cursor: '#ffffff',
    selection: '#ffffff33',
  },
})

describe('mergeThemes', () => {
  it('returns defaults when custom themes are empty', () => {
    const defaults = [makeTheme('matrix', '#22c55e')]
    expect(mergeThemes(defaults, [])).toEqual(defaults)
  })

  it('appends non-conflicting custom themes', () => {
    const defaults = [makeTheme('matrix', '#22c55e')]
    const custom = [makeTheme('custom', '#123456')]

    const merged = mergeThemes(defaults, custom)
    expect(merged).toHaveLength(2)
    expect(merged[1].name).toBe('custom')
  })

  it('overrides matching default themes by name', () => {
    const defaults = [makeTheme('matrix', '#22c55e')]
    const custom = [makeTheme('matrix', '#abcdef')]

    const merged = mergeThemes(defaults, custom)
    expect(merged).toHaveLength(1)
    expect(merged[0].colors.primary).toBe('#abcdef')
  })
})

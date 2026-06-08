import { render, screen } from '@testing-library/react'
import type { CSSProperties } from 'react'
import { describe, expect, it } from 'vitest'
import { Terminal } from '@/components/ui/terminal'
import { TerminalThemeProvider, getThemeCSS, prebuiltThemes } from '@/lib/opentui/themes'

describe('getThemeCSS variable names', () => {
  const tokyoNight = prebuiltThemes.find(t => t.name === 'tokyo-night')!

  it('emits --terminal-bg (not --terminal-background)', () => {
    const css = getThemeCSS(tokyoNight)
    expect(css).toMatch(/--terminal-bg:\s*#[0-9a-f]+;/)
    expect(css).not.toContain('--terminal-background:')
  })

  it('emits --terminal-muted (not --terminal-text-muted)', () => {
    const css = getThemeCSS(tokyoNight)
    expect(css).toMatch(/--terminal-muted:\s*#[0-9a-f]+;/)
    expect(css).not.toContain('--terminal-text-muted:')
  })

  it('emits --terminal-highlight-bg (not --terminal-selection)', () => {
    const css = getThemeCSS(tokyoNight)
    expect(css).toMatch(/--terminal-highlight-bg:\s*#[0-9a-f]+;/)
    expect(css).not.toContain('--terminal-selection:')
  })

  it('emits all required CSS variables', () => {
    const css = getThemeCSS(tokyoNight)
    const required = [
      '--terminal-primary', '--terminal-secondary', '--terminal-accent',
      '--terminal-bg', '--terminal-background-panel', '--terminal-background-element',
      '--terminal-text', '--terminal-muted', '--terminal-border',
      '--terminal-success', '--terminal-error', '--terminal-warning', '--terminal-info',
      '--terminal-cursor', '--terminal-highlight-bg',
    ]
    for (const v of required) {
      expect(css).toContain(v)
    }
  })

  it('emits optional terminal font family variable', () => {
    const caiDark = prebuiltThemes.find(t => t.name === 'cai-dark')!
    const css = getThemeCSS(caiDark)
    expect(css).toContain('--terminal-font-family: "SF Mono", "Fira Code", ui-monospace, monospace;')
  })

  it('includes Canadian AI dark and light themes', () => {
    const caiDark = prebuiltThemes.find(t => t.name === 'cai-dark')!
    const caiLight = prebuiltThemes.find(t => t.name === 'cai-light')!

    expect(caiDark.colors.background).toBe('#171717')
    expect(caiDark.colors.primary).toBe('#e63030')
    expect(caiLight.colors.background).toBe('#f7f7f7')
    expect(caiLight.colors.text).toBe('#141414')
  })
})

describe('Terminal inline theme styles', () => {
  it('applies --terminal-bg from context as inline style', () => {
    const { container } = render(
      <TerminalThemeProvider defaultTheme="tokyo-night">
        <Terminal />
      </TerminalThemeProvider>,
    )
    const root = container.firstChild as HTMLElement
    const style = root.getAttribute('style') || ''
    expect(style).toMatch(/--terminal-bg:\s*#[0-9a-f]+;/)
    expect(style).not.toContain('--terminal-background:')
  })

  it('applies --terminal-muted from context as inline style', () => {
    const { container } = render(
      <TerminalThemeProvider defaultTheme="tokyo-night">
        <Terminal />
      </TerminalThemeProvider>,
    )
    const root = container.firstChild as HTMLElement
    const style = root.getAttribute('style') || ''
    expect(style).toMatch(/--terminal-muted:\s*#[0-9a-f]+;/)
    expect(style).not.toContain('--terminal-text-muted:')
  })

  it('applies --terminal-highlight-bg from context as inline style', () => {
    const { container } = render(
      <TerminalThemeProvider defaultTheme="tokyo-night">
        <Terminal />
      </TerminalThemeProvider>,
    )
    const root = container.firstChild as HTMLElement
    const style = root.getAttribute('style') || ''
    expect(style).toMatch(/--terminal-highlight-bg:\s*#[0-9a-f]+;/)
    expect(style).not.toContain('--terminal-selection:')
  })

  it('applies all theme CSS vars as inline style on root element', () => {
    const { container } = render(
      <TerminalThemeProvider defaultTheme="tokyo-night">
        <Terminal />
      </TerminalThemeProvider>,
    )
    const root = container.firstChild as HTMLElement
    const style = root.getAttribute('style') || ''
    const required = [
      '--terminal-primary', '--terminal-bg', '--terminal-text',
      '--terminal-muted', '--terminal-border', '--terminal-highlight-bg',
    ]
    for (const v of required) {
      expect(style).toContain(v)
    }
  })

  it('preserves theme CSS vars when user style prop is provided', () => {
    const { container } = render(
      <TerminalThemeProvider defaultTheme="catppuccin">
        <Terminal style={{ '--tw-text-opacity': '1' } as CSSProperties} />
      </TerminalThemeProvider>,
    )
    const root = container.firstChild as HTMLElement

    expect(root.style.getPropertyValue('--terminal-bg')).toBe('#1e1e2e')
    expect(root.style.getPropertyValue('--terminal-text')).toBe('#cdd6f4')
    expect(root.style.getPropertyValue('--terminal-primary')).toBe('#cba6f7')
    expect(root.style.getPropertyValue('--tw-text-opacity')).toBe('1')
  })

  it('applies theme font family as an inline CSS variable', () => {
    const { container } = render(
      <TerminalThemeProvider defaultTheme="cai-dark">
        <Terminal />
      </TerminalThemeProvider>,
    )
    const root = container.firstChild as HTMLElement

    expect(root.style.getPropertyValue('--terminal-font-family')).toBe('"SF Mono", "Fira Code", ui-monospace, monospace')
    expect(root.style.fontFamily).toBe('var(--terminal-font-family, var(--font-mono))')
  })

  it('renders output lines with terminal text color, not primary accent color', () => {
    render(
      <TerminalThemeProvider defaultTheme="catppuccin">
        <Terminal welcomeMessage={['Catppuccin preview text']} />
      </TerminalThemeProvider>,
    )

    const line = screen.getByText('Catppuccin preview text')
    expect(line.className).toContain('text-terminal-text')
    expect(line.className).not.toContain('text-terminal-primary')
  })
})

describe('Theme change updates inline styles', () => {
  it('renders different CSS vars for matrix vs tokyo-night', () => {
    const { container: matrixContainer } = render(
      <TerminalThemeProvider defaultTheme="matrix">
        <Terminal />
      </TerminalThemeProvider>,
    )
    const { container: tokyoContainer } = render(
      <TerminalThemeProvider defaultTheme="tokyo-night">
        <Terminal />
      </TerminalThemeProvider>,
    )

    const matrixRoot = matrixContainer.firstChild as HTMLElement
    const tokyoRoot = tokyoContainer.firstChild as HTMLElement

    const matrixBg = matrixRoot.style.getPropertyValue('--terminal-bg')
    const tokyoBg = tokyoRoot.style.getPropertyValue('--terminal-bg')
    expect(matrixBg).not.toBe(tokyoBg)
    expect(matrixBg).toBe('#0a0a0a')
    expect(tokyoBg).toBe('#1a1b26')
  })

  it('preserves old variable names as absent from inline style', () => {
    const { container } = render(
      <TerminalThemeProvider defaultTheme="tokyo-night">
        <Terminal />
      </TerminalThemeProvider>,
    )
    const root = container.firstChild as HTMLElement
    expect(root.style.getPropertyValue('--terminal-background')).toBe('')
    expect(root.style.getPropertyValue('--terminal-text-muted')).toBe('')
    expect(root.style.getPropertyValue('--terminal-selection')).toBe('')
  })
})

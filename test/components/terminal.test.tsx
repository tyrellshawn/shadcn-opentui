import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { Terminal } from '@/components/ui/terminal'
import { TerminalThemeProvider } from '@/lib/opentui/themes'
import { TerminalThinkingIndicator } from '@/components/ui/terminal-thinking-indicator'
import { TerminalJsTable } from '@/components/ui/terminal-js-table'
import { TerminalEmailDraft } from '@/components/ui/terminal-email-draft'

describe('Terminal', () => {
  it('shows command completions, supports arrow navigation, and completes with tab', async () => {
    const user = userEvent.setup()

    const { container } = render(<Terminal />)

    const input = screen.getByPlaceholderText('Type a command...')

    await user.click(input)
    await user.type(input, 'h')

    expect(screen.getByRole('button', { name: /help/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /history/i })).toBeInTheDocument()

    const partialCommand = container.querySelector('.text-terminal-warning')
    expect(partialCommand).not.toBeNull()
    expect(partialCommand).toHaveTextContent('h')

    await user.keyboard('{ArrowDown}{Tab}')

    expect(input).toHaveValue('history ')
    expect(screen.queryByRole('button', { name: /help/i })).not.toBeInTheDocument()
  })

  it('highlights valid commands differently from invalid ones', async () => {
    const user = userEvent.setup()

    const { container } = render(<Terminal />)

    const input = screen.getByPlaceholderText('Type a command...')

    await user.click(input)
    await user.type(input, 'help docs')

    const validCommand = container.querySelector('.text-terminal-success')
    const args = container.querySelector('.text-terminal-info')

    expect(validCommand).not.toBeNull()
    expect(validCommand).toHaveTextContent('help')
    expect(args).not.toBeNull()
    expect(args).toHaveTextContent('docs')

    await user.clear(input)
    await user.type(input, 'nope')

    const invalidCommand = container.querySelector('.text-terminal-error')
    expect(invalidCommand).not.toBeNull()
    expect(invalidCommand).toHaveTextContent('nope')
  })

  it('renders welcome message as output', () => {
    render(<Terminal welcomeMessage={['Hello terminal']} />)
    expect(screen.getByText('Hello terminal')).toBeInTheDocument()
  })

  it('applies default terminal bg and text classes', () => {
    const { container } = render(<Terminal />)
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('bg-terminal-bg')
    expect(root.className).toContain('text-terminal-text')
  })

  it('applies custom prompt symbol', () => {
    render(<Terminal prompt=">" />)
    expect(screen.getByText('>')).toBeInTheDocument()
  })

  it('renders different line types with semantic colors', async () => {
    const user = userEvent.setup()

    const { container } = render(
      <Terminal
        commands={{
          test: {
            name: 'test',
            description: 'Test command',
            handler: async () => {},
          },
        }}
      />,
    )

    const input = screen.getByPlaceholderText('Type a command...')
    await user.click(input)
    await user.type(input, 'test')
    await user.keyboard('{Enter}')

    const inputLine = container.querySelector('.text-terminal-text')
    expect(inputLine).not.toBeNull()
  })

  it('accepts custom theme prop and applies as inline style', () => {
    const { container } = render(
      <Terminal
        theme={{
          '--terminal-primary': 'oklch(0.7 0.25 200)',
        }}
      />,
    )
    const root = container.firstChild as HTMLElement
    expect(root.style.getPropertyValue('--terminal-primary')).toBe('oklch(0.7 0.25 200)')
  })

  it('renders error line type with terminal-error color', async () => {
    const user = userEvent.setup()

    const { container } = render(<Terminal />)

    const input = screen.getByPlaceholderText('Type a command...')
    await user.click(input)
    await user.type(input, 'nonexistent')
    await user.keyboard('{Enter}')

    const errorLine = container.querySelector('.text-terminal-error')
    expect(errorLine).not.toBeNull()
    expect(errorLine).toHaveTextContent(/not found/i)
  })

  it('renders ascii output from the provided words', async () => {
    const user = userEvent.setup()

    render(<Terminal />)

    const input = screen.getByPlaceholderText('Type a command...')
    await user.click(input)
    await user.type(input, 'ascii hello world')
    await user.keyboard('{Enter}')

    expect(
      screen.getByText((_, element) =>
        element?.textContent === '#   # ##### #     #      ###      #   #  ###  ####  #     ####',
      ),
    ).toBeInTheDocument()
  })

  it('renders table output with aligned borders and intersections', async () => {
    const user = userEvent.setup()

    render(<Terminal />)

    const input = screen.getByPlaceholderText('Type a command...')
    await user.click(input)
    await user.type(input, 'table')
    await user.keyboard('{Enter}')

    expect(screen.getByText('┌─────────┬─────┬───────────────┐')).toBeInTheDocument()
    expect(screen.getByText('├─────────┼─────┼───────────────┤')).toBeInTheDocument()
    expect(screen.getByText((_, element) => element?.textContent === '│ Bob     │ 30  │ San Francisco │')).toBeInTheDocument()
    expect(screen.getByText('└─────────┴─────┴───────────────┘')).toBeInTheDocument()
  })

  it('applies theme from TerminalThemeProvider context', () => {
    const { container } = render(
      <TerminalThemeProvider defaultTheme="tokyo-night">
        <Terminal />
      </TerminalThemeProvider>,
    )
    const root = container.firstChild as HTMLElement
    // Tokyo Night primary color
    expect(root.style.getPropertyValue('--terminal-primary')).toBe('#7aa2f7')
  })

  it('explicit theme prop overrides TerminalThemeProvider context', () => {
    const { container } = render(
      <TerminalThemeProvider defaultTheme="matrix">
        <Terminal
          theme={{
            '--terminal-primary': '#ff0000',
          }}
        />
      </TerminalThemeProvider>,
    )
    const root = container.firstChild as HTMLElement
    // Context would set #22c55e (matrix primary), but prop should win
    expect(root.style.getPropertyValue('--terminal-primary')).toBe('#ff0000')
  })

  it('supports addLines with string entries from custom commands', async () => {
    const user = userEvent.setup()

    render(
      <Terminal
        commands={{
          theme: {
            name: 'theme',
            description: 'List themes',
            handler: (_args, context) => {
              context?.addLines?.(['Choose a theme:', 'Use arrows to preview.'])
            },
          },
        }}
      />,
    )

    const input = screen.getByPlaceholderText('Type a command...')
    await user.click(input)
    await user.type(input, 'theme')
    await user.keyboard('{Enter}')

    expect(screen.getByText('Choose a theme:')).toBeInTheDocument()
    expect(screen.getByText('Use arrows to preview.')).toBeInTheDocument()
    expect(screen.queryByText(/Error executing theme/)).not.toBeInTheDocument()
  })

  it('previews menu items on arrow keys and only selects on enter', async () => {
    const user = userEvent.setup()
    const previews: string[] = []
    const selections: string[] = []

    render(
      <Terminal
        commands={{
          theme: {
            name: 'theme',
            description: 'Choose a theme',
            handler: (_args, context) => {
              context?.setState?.((prev: any) => ({
                ...prev,
                mode: 'ui',
                menuSelection: 0,
                activeComponent: {
                  id: 'theme-menu-test',
                  type: 'menu',
                  active: true,
                  props: {
                    items: [
                      { label: 'Matrix', value: 'matrix' },
                      { label: 'Tokyo Night', value: 'tokyo-night' },
                    ],
                    onPreview: (item: { value: string }) => previews.push(item.value),
                    onSelect: (item: { value: string }) => selections.push(item.value),
                  },
                },
              }))
            },
          },
        }}
      />,
    )

    const input = screen.getByPlaceholderText('Type a command...')
    await user.click(input)
    await user.type(input, 'theme')
    await user.keyboard('{Enter}')

    expect(screen.getByText('Tokyo Night')).toBeInTheDocument()

    await user.keyboard('{ArrowDown}')
    expect(previews).toEqual(['tokyo-night'])
    expect(selections).toEqual([])

    await user.keyboard('{Enter}')
    expect(selections).toEqual(['tokyo-night'])
  })

  it('opens in-terminal theme modal from built-in theme command and saves on click', async () => {
    const user = userEvent.setup()

    const { container } = render(
      <TerminalThemeProvider defaultTheme="matrix">
        <Terminal />
      </TerminalThemeProvider>,
    )

    const root = container.firstChild as HTMLElement
    const input = screen.getByPlaceholderText('Type a command...')
    await user.click(input)
    await user.type(input, 'theme tokyo-night')
    await user.keyboard('{Enter}')

    expect(screen.getByText('Theme changed to: Tokyo Night')).toBeInTheDocument()
    expect(root.style.getPropertyValue('--terminal-bg')).toBe('#1a1b26')
  })

  it('supports native theme without TerminalThemeProvider', async () => {
    const user = userEvent.setup()

    render(<Terminal defaultTheme="tokyo-night" />)

    const input = screen.getByPlaceholderText('Type a command...')
    await user.click(input)
    await user.type(input, 'theme tokyo-night')
    await user.keyboard('{Enter}')

    expect(screen.getByText('Theme changed to: Tokyo Night')).toBeInTheDocument()
  })

  it('does not crash when searching themes from the in-terminal selector', async () => {
    const user = userEvent.setup()

    render(
      <TerminalThemeProvider defaultTheme="matrix">
        <Terminal />
      </TerminalThemeProvider>,
    )

    const input = screen.getByPlaceholderText('Type a command...')
    await user.click(input)
    await user.type(input, 'theme')
    await user.keyboard('{Enter}')

    const search = await screen.findByPlaceholderText('Search themes...')
    await user.type(search, 'tokyo')

    expect(screen.getByPlaceholderText('Search themes...')).toBeInTheDocument()
    expect(screen.getByText('Tokyo Night')).toBeInTheDocument()
  })

  it('disables terminal command input while theme selector is open', async () => {
    const user = userEvent.setup()

    render(
      <TerminalThemeProvider defaultTheme="matrix">
        <Terminal />
      </TerminalThemeProvider>,
    )

    const input = screen.getByPlaceholderText('Type a command...')
    await user.click(input)
    await user.type(input, 'theme')
    await user.keyboard('{Enter}')

    expect(await screen.findByPlaceholderText('Search themes...')).toBeInTheDocument()
    expect(input).toBeDisabled()
  })

  it('handles empty search results safely without crash', async () => {
    const user = userEvent.setup()

    render(
      <TerminalThemeProvider defaultTheme="matrix">
        <Terminal />
      </TerminalThemeProvider>,
    )

    const input = screen.getByPlaceholderText('Type a command...')
    await user.click(input)
    await user.type(input, 'theme')
    await user.keyboard('{Enter}')

    const search = await screen.findByPlaceholderText('Search themes...')
    await user.type(search, 'zzzz-no-match')

    expect(screen.getByText('No themes found')).toBeInTheDocument()

    await user.keyboard('{ArrowDown}{ArrowUp}{Enter}{Escape}')

    expect(screen.queryByPlaceholderText('Search themes...')).not.toBeInTheDocument()
  })

  it('renders terminal theme selector with containment classes', async () => {
    const user = userEvent.setup()

    const { container } = render(
      <TerminalThemeProvider defaultTheme="matrix">
        <Terminal />
      </TerminalThemeProvider>,
    )

    const input = screen.getByPlaceholderText('Type a command...')
    await user.click(input)
    await user.type(input, 'theme')
    await user.keyboard('{Enter}')

    const search = await screen.findByPlaceholderText('Search themes...')

    const panel = search.closest('[class*="max-w"]')
    expect(panel).not.toBeNull()
    expect(panel?.className).toContain('max-w-[500px]')

    const outer = search.closest('[class*="inset-2"]')
    expect(outer).not.toBeNull()
  })

  it('renders TerminalThinkingIndicator with blob variant', () => {
    const { container } = render(
      <TerminalThinkingIndicator label="Thinking" variant="blob" tone="active" />,
    )
    expect(screen.getByText('Thinking')).toBeInTheDocument()

    const blobDots = container.querySelectorAll('[class*="h-2\\.5"]')
    expect(blobDots.length).toBe(3)
  })

  it('renders TerminalJsTable with columns and rows', () => {
    render(
      <TerminalJsTable
        columns={[
          { key: 'name', header: 'Name' },
          { key: 'value', header: 'Value' },
        ]}
        data={[
          { name: 'alpha', value: 10 },
          { name: 'beta', value: 20 },
        ]}
      />,
    )
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Value')).toBeInTheDocument()
    expect(screen.getByText('alpha')).toBeInTheDocument()
    expect(screen.getByText('beta')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('20')).toBeInTheDocument()
  })

  it('renders TerminalEmailDraft with headers and body', () => {
    render(
      <TerminalEmailDraft
        from="alice@test.com"
        to="bob@test.com"
        subject="Hello"
        body="Greetings from the terminal."
      />,
    )
    expect(screen.getByText('alice@test.com')).toBeInTheDocument()
    expect(screen.getByText('bob@test.com')).toBeInTheDocument()
    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.getByText('Greetings from the terminal.')).toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { Terminal } from '@/components/ui/terminal'

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
          test: async () => {},
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
})

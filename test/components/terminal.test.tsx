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

    const partialCommand = container.querySelector('.text-amber-300')
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

    const validCommand = container.querySelector('.text-emerald-300')
    const args = container.querySelector('.text-cyan-200')

    expect(validCommand).not.toBeNull()
    expect(validCommand).toHaveTextContent('help')
    expect(args).not.toBeNull()
    expect(args).toHaveTextContent('docs')

    await user.clear(input)
    await user.type(input, 'nope')

    const invalidCommand = container.querySelector('.text-red-300')
    expect(invalidCommand).not.toBeNull()
    expect(invalidCommand).toHaveTextContent('nope')
  })
})

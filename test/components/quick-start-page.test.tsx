import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import QuickStartPage from '@/app/docs/quick-start/page'

describe('QuickStartPage', () => {
  it('defaults the first preview to a live OpenTUI terminal and allows typing into it', async () => {
    const user = userEvent.setup()

    render(<QuickStartPage />)

    const terminalInput = screen.getAllByPlaceholderText('Type a command...')[0]

    await user.click(terminalInput)
    await user.type(terminalInput, 'help{enter}')

    expect(await screen.findByText('Available commands:')).toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ThemePicker } from '@/components/theme-picker'
import { prebuiltThemes } from '@/lib/opentui/themes'

describe('ThemePicker', () => {
  it('renders selected theme display name', () => {
    render(
      <ThemePicker
        value={prebuiltThemes[0].name}
        onValueChange={() => {}}
      />,
    )

    expect(screen.getByRole('combobox')).toHaveTextContent(prebuiltThemes[0].displayName)
  })

  it('calls onValueChange when selecting another theme', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(
      <ThemePicker
        value={prebuiltThemes[0].name}
        onValueChange={onValueChange}
      />,
    )

    await user.click(screen.getByRole('combobox'))
    await user.click(await screen.findByText(prebuiltThemes[1].displayName))

    expect(onValueChange).toHaveBeenCalledWith(prebuiltThemes[1].name)
  })
})

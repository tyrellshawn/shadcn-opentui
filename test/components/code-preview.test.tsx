import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { CodePreview } from '@/components/docs/code-preview'

describe('CodePreview', () => {
  it('shows backend toggles and switches code and preview content', async () => {
    const user = userEvent.setup()

    const { container } = render(
      <CodePreview
        title="Example"
        description="Backend-aware preview"
        code="const mode = 'opentui'"
        preview={<div>OpenTUI preview</div>}
        codeByBackend={{
          opentui: "const mode = 'opentui'",
          cmdk: "const mode = 'cmdk'",
        }}
        previewByBackend={{
          opentui: <div>OpenTUI preview</div>,
          cmdk: <div>cmdk preview</div>,
        }}
      />,
    )

    expect(screen.getByRole('button', { name: 'OpenTUI' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'cmdk' })).toBeInTheDocument()
    expect(screen.getByText('OpenTUI preview')).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Code' }))
    expect(container).toHaveTextContent("const mode = 'opentui'")

    await user.click(screen.getByRole('tab', { name: 'Preview' }))

    await user.click(screen.getByRole('button', { name: 'cmdk' }))

    expect(screen.getByText('cmdk preview')).toBeInTheDocument()
    await user.click(screen.getByRole('tab', { name: 'Code' }))
    expect(container).toHaveTextContent("const mode = 'cmdk'")
  })
})

import { describe, expect, it } from 'vitest'

import { renderAsciiBanner, renderTable, sampleTerminalTableData } from '@/lib/opentui/renderers'

describe('terminal renderers', () => {
  it('renders table borders and keeps San Francisco in one row', () => {
    const lines = renderTable(sampleTerminalTableData)

    expect(lines[0]).toMatch(/^┌.*┐$/)
    expect(lines[2]).toMatch(/^├.*┤$/)
    expect(lines.at(-1)).toMatch(/^└.*┘$/)
    expect(lines).toContain('│ Bob     │ 30  │ San Francisco │')
  })

  it('renders ascii output from the provided input text', () => {
    const hello = renderAsciiBanner('hello')
    const opentui = renderAsciiBanner('OpenTUI')

    expect(hello).not.toEqual(opentui)
    expect(hello).toContain('#   # ##### #     #      ###')
    expect(opentui.join('\n')).toContain(' ###  ####')
  })
})

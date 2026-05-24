import { describe, expect, it, vi } from 'vitest'

import { createUICommands } from '@/lib/opentui/commands'
import type { OpenTUIRuntimeContext, TerminalLine } from '@/lib/opentui/types'

function createContext() {
  const lines: Array<{ content: string; type?: TerminalLine['type'] }> = []
  const context = {
    state: {
      mode: { type: 'command' },
      lines: [],
      commandHistory: [],
      historyIndex: -1,
      isProcessing: false,
      formData: {},
      menuSelection: 0,
      theme: {
        prompt: '$',
        colors: {
          background: '',
          foreground: '',
          input: '',
          output: '',
          error: '',
          success: '',
          system: '',
          accent: '',
        },
        font: { family: '', size: '' },
      },
    },
    addLine: (content: string, type?: TerminalLine['type']) => lines.push({ content, type }),
    clearLines: vi.fn(),
    updateLastLine: vi.fn(),
    showUI: vi.fn(),
    hideUI: vi.fn(),
    setMode: vi.fn(),
    updateFormData: vi.fn(),
    getFormData: vi.fn(() => ({})),
    clearFormData: vi.fn(),
    registerCommand: vi.fn(),
    unregisterCommand: vi.fn(),
    getCommands: vi.fn(() => []),
  } satisfies OpenTUIRuntimeContext

  return { context, lines }
}

describe('OpenTUI command helpers', () => {
  it('table command emits full table outline with San Francisco intact', () => {
    const { context, lines } = createContext()
    const table = createUICommands().find((command) => command.name === 'table')

    table?.handler([], context)

    const output = lines.map((line) => line.content)
    expect(output[1]).toMatch(/^┌.*┐$/)
    expect(output[3]).toMatch(/^├.*┤$/)
    expect(output.at(-1)).toMatch(/^└.*┘$/)
    expect(output).toContain('│ Bob     │ 30  │ San Francisco │')
  })

  it('ascii command changes output for input text', () => {
    const helloRun = createContext()
    const defaultRun = createContext()
    const ascii = createUICommands().find((command) => command.name === 'ascii')

    ascii?.handler(['hello'], helloRun.context)
    ascii?.handler([], defaultRun.context)

    expect(helloRun.lines.slice(1).map((line) => line.content)).not.toEqual(
      defaultRun.lines.slice(1).map((line) => line.content),
    )
    expect(helloRun.lines.map((line) => line.content)).toContain('#   # ##### #     #      ###')
  })
})

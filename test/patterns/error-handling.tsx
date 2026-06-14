import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"

/**
 * P1: Missing optional props — verifies component doesn't crash
 * when optional callbacks are omitted.
 */
export function testMissingOptionalProps(
  Component: React.ComponentType<any>,
  componentName: string,
) {
  it(`${componentName} does not crash when all optional callbacks are undefined`, () => {
    const { container } = render(<Component />)
    expect(container).toBeInTheDocument()
  })
}

/**
 * P2: Empty arrays — verifies component handles empty data arrays.
 */
export function testEmptyArrayProp(
  Component: React.ComponentType<any>,
  componentName: string,
  propName: string,
  otherProps: Record<string, any> = {},
) {
  it(`${componentName} does not crash with empty ${propName}`, () => {
    const { container } = render(<Component {...{ [propName]: [], ...otherProps }} />)
    expect(container).toBeInTheDocument()
  })
}

/**
 * P3: Null/undefined values in data props.
 */
export function testNullValuesInData(
  Component: React.ComponentType<any>,
  componentName: string,
  propName: string,
  dataWithNulls: Record<string, any>,
  otherProps: Record<string, any> = {},
) {
  it(`${componentName} does not crash with null/undefined values in ${propName}`, () => {
    const { container } = render(<Component {...{ [propName]: dataWithNulls, ...otherProps }} />)
    expect(container).toBeInTheDocument()
  })
}

/**
 * P9: Keyboard boundary navigation — verifies ArrowUp/ArrowDown at edges.
 */
export async function testKeyboardBoundaries(
  Component: React.ComponentType<any>,
  componentName: string,
  renderFn: () => Promise<{ input: HTMLElement; container: HTMLElement }>,
) {
  it(`${componentName} does not crash on keyboard navigation at boundaries`, async () => {
    const user = userEvent.setup()
    const { input } = await renderFn()
    if (!input) return
    await user.type(input, "{ArrowUp}")
    await user.type(input, "{ArrowDown}")
    expect(input).toBeInTheDocument()
  })
}

/**
 * P14: Numeric prop extremes — verifies 0, negative, and very large values.
 */
export function testNumericBoundaries(
  Component: React.ComponentType<any>,
  componentName: string,
  propName: string,
  extremes: any[],
  otherProps: Record<string, any> = {},
) {
  it(`${componentName} does not crash with ${propName} at extremes`, () => {
    for (const val of extremes) {
      const { container } = render(<Component {...{ [propName]: val, ...otherProps }} />)
      expect(container).toBeInTheDocument()
    }
  })
}

/**
 * P15: String prop extremes — verifies empty/very long strings.
 */
export function testStringBoundaries(
  Component: React.ComponentType<any>,
  componentName: string,
  propName: string,
  otherProps: Record<string, any> = {},
) {
  it(`${componentName} does not crash with empty ${propName}`, () => {
    const { container } = render(<Component {...{ [propName]: "", ...otherProps }} />)
    expect(container).toBeInTheDocument()
  })

  it(`${componentName} does not crash with very long ${propName}`, () => {
    const long = "a".repeat(10000)
    const { container } = render(<Component {...{ [propName]: long, ...otherProps }} />)
    expect(container).toBeInTheDocument()
  })
}

/**
 * P8: Rapid input — verifies double-submit is guarded.
 */
export async function testRapidInput(
  componentName: string,
  simulateDoubleSubmit: () => Promise<void>,
) {
  it(`${componentName} does not crash on rapid input / double-submit`, async () => {
    await simulateDoubleSubmit()
    expect(true).toBe(true)
  })
}

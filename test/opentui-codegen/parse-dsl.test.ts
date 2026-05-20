import { describe, expect, it } from "vitest"
import { parseDSL } from "@/lib/opentui-codegen/parse-dsl"

function stripProgram(program: ReturnType<typeof parseDSL>) {
  return { name: program.name, source: program.source, nodes: program.nodes }
}

describe("parseDSL", () => {
  it("parses a simple box with text", () => {
    const source = `
export default function myView() {
  return box({ flexDirection: "column" },
    text({ fg: "green" }, "hello"),
    scrollbox({ width: "100%" })
  )
}`
    const result = parseDSL(source, "myView.opentui")
    expect(stripProgram(result)).toMatchSnapshot()
  })

  it("parses nested calls", () => {
    const source = `
export default function nested() {
  return box({ flexDirection: "column", width: "100%" },
    box({ padding: 1 },
      text({ fg: "white" }, "nested")
    )
  )
}`
    const result = parseDSL(source, "nested.opentui")
    expect(stripProgram(result)).toMatchSnapshot()
  })

  it("parses with props object only", () => {
    const source = `
export default function simple() {
  return scrollbox({ width: "100%", height: "100%" })
}`
    const result = parseDSL(source, "simple.opentui")
    expect(stripProgram(result)).toMatchSnapshot()
  })

  it("parses unknown calls as unknown kind", () => {
    const source = `
export default function custom() {
  return CustomComponent({ items: files },
    text({ fg: "white" }, "label")
  )
}`
    const result = parseDSL(source, "custom.opentui")
    expect(stripProgram(result)).toMatchSnapshot()
  })

  it("parses text-only call", () => {
    const source = `
export default function greet() {
  return text("Hello, World!")
}`
    const result = parseDSL(source, "greet.opentui")
    expect(stripProgram(result)).toMatchSnapshot()
  })

  it("handles array arguments as children", () => {
    const source = `
export default function listView() {
  return box({ flexDirection: "column" },
    [text("one"), text("two"), text("three")]
  )
}`
    const result = parseDSL(source, "listView.opentui")
    expect(stripProgram(result)).toMatchSnapshot()
  })

  it("parses boolean and number literal props", () => {
    const source = `
export default function propsAllTypes() {
  return box({ visible: true, count: 42, label: "test" })
}`
    const result = parseDSL(source, "propsAllTypes.opentui")
    expect(stripProgram(result)).toMatchSnapshot()
  })

  it("handles minified single-line input", () => {
    const source = 'export default function x(){return box({flex:"row"},text("minified"))}'
    const result = parseDSL(source, "minified.opentui")
    expect(stripProgram(result)).toMatchSnapshot()
  })
})

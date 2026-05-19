import { describe, expect, it } from "vitest"
import { generateShadcnComponent } from "@/lib/opentui-codegen/generate-shadcn"
import type { OpenTUIIrProgram } from "@/lib/opentui-codegen/ir"

describe("generateShadcnComponent", () => {
  it("generates component from minimal text-only IR", () => {
    const program: OpenTUIIrProgram = {
      name: "SimpleView",
      source: "simple.tsx",
      nodes: [
        {
          kind: "text",
          value: "Hello, World!",
        },
      ],
      notes: [],
    }
    expect(generateShadcnComponent(program)).toMatchSnapshot()
  })

  it("generates component from box with nested children", () => {
    const program: OpenTUIIrProgram = {
      name: "NestedBoxes",
      source: "nested.tsx",
      nodes: [
        {
          kind: "box",
          props: { style: { flexDirection: "column", width: "100%" } },
          children: [
            { kind: "text", value: "Header", props: { fg: "white" } },
            {
              kind: "box",
              props: { style: { width: "100%" } },
              children: [
                { kind: "text", value: "Nested content", props: { fg: "muted" } },
              ],
            },
          ],
        },
      ],
      notes: [],
    }
    expect(generateShadcnComponent(program)).toMatchSnapshot()
  })

  it("generates component with scrollbox wrapper", () => {
    const program: OpenTUIIrProgram = {
      name: "ScrollingContent",
      source: "scroll.tsx",
      nodes: [
        {
          kind: "scrollbox",
          children: [
            {
              kind: "box",
              props: { style: { flexDirection: "column" } },
              children: [
                { kind: "text", value: "Line 1" },
                { kind: "text", value: "Line 2" },
              ],
            },
          ],
        },
      ],
      notes: [],
    }
    expect(generateShadcnComponent(program)).toMatchSnapshot()
  })

  it("generates component with unknown HunkDiffBody node", () => {
    const program: OpenTUIIrProgram = {
      name: "WithDiffBody",
      source: "diff-body.tsx",
      nodes: [
        {
          kind: "unknown",
          name: "HunkDiffBody",
          children: [
            { kind: "text", value: "diff content", props: { fg: "muted" } },
          ],
        },
      ],
      notes: [],
    }
    expect(generateShadcnComponent(program)).toMatchSnapshot()
  })

  it("generates full HunkReviewStream program", () => {
    const program: OpenTUIIrProgram = {
      name: "HunkReviewStream",
      source: "HunkReviewStream.tsx",
      nodes: [
        {
          kind: "unknown",
          name: "HunkReviewStream",
          children: [
            {
              kind: "box",
              props: { style: { width: "100%", flexDirection: "column" } },
              children: [
                {
                  kind: "unknown",
                  name: "HunkDiffBody",
                  children: [
                    {
                      kind: "box",
                      props: { style: { flexDirection: "column", width: "100%" } },
                      children: [
                        { kind: "text", value: "diff content here" },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      notes: ["Exported function: HunkReviewStream"],
    }
    expect(generateShadcnComponent(program)).toMatchSnapshot()
  })

  it("generates component with empty box", () => {
    const program: OpenTUIIrProgram = {
      name: "EmptyBox",
      source: "empty.tsx",
      nodes: [
        {
          kind: "box",
          props: { style: { flexDirection: "column" } },
        },
      ],
      notes: [],
    }
    expect(generateShadcnComponent(program)).toMatchSnapshot()
  })
})

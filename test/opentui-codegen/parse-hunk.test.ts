import { describe, expect, it } from "vitest"
import { parseHunkFile } from "@/lib/opentui-codegen/parse-hunk"

function stripNotes(program: ReturnType<typeof parseHunkFile>) {
  return { name: program.name, source: program.source, nodes: program.nodes }
}

describe("parseHunkFile", () => {
  it("parses basic box and text elements", () => {
    const source = `
export function SimpleBox() {
  return (
    <box style={{ flexDirection: "column", width: "100%" }}>
      <text fg="green">Hello, World!</text>
    </box>
  )
}`
    const result = parseHunkFile(source, "SimpleBox.tsx")
    expect(stripNotes(result)).toMatchSnapshot()
  })

  it("parses self-closing scrollbox", () => {
    const source = `
export function ScrollingView() {
  return (
    <scrollbox width="100%" height="100%" scrollY={true} focused={false} />
  )
}`
    const result = parseHunkFile(source, "ScrollingView.tsx")
    expect(stripNotes(result)).toMatchSnapshot()
  })

  it("handles JSX expression children with nested OpenTUI primitives", () => {
    const source = `
export function FilesList({ files }: { files: { id: string; name: string }[] }) {
  return (
    <box style={{ width: "100%", flexDirection: "column" }}>
      {files.map((file) => (
        <box key={file.id} style={{ width: "100%" }}>
          <text fg="white">{file.name}</text>
        </box>
      ))}
    </box>
  )
}`
    const result = parseHunkFile(source, "FilesList.tsx")
    expect(stripNotes(result)).toMatchSnapshot()
  })

  it("handles JSX expression with conditional ternary returning JSX", () => {
    const source = `
export function ConditionalView({ show }: { show: boolean }) {
  return (
    <box style={{ width: "100%" }}>
      {show ? (
        <box style={{ flexDirection: "column" }}>
          <text fg="green">Visible</text>
        </box>
      ) : (
        <box>
          <text fg="muted">Hidden</text>
        </box>
      )}
    </box>
  )
}`
    const result = parseHunkFile(source, "ConditionalView.tsx")
    expect(stripNotes(result)).toMatchSnapshot()
  })

  it("falls back to text for expression children without JSX", () => {
    const source = `
export function TextFallback({ name }: { name: string }) {
  return (
    <box>
      <text>{name}</text>
    </box>
  )
}`
    const result = parseHunkFile(source, "TextFallback.tsx")
    expect(stripNotes(result)).toMatchSnapshot()
  })

  it("parses unknown elements as 'unknown' kind", () => {
    const source = `
export function WithCustom({ files }: { files: any[] }) {
  return (
    <CustomComponent
      files={files}
      onSelect={(id: string) => {}}
    />
  )
}`
    const result = parseHunkFile(source, "WithCustom.tsx")
    expect(stripNotes(result)).toMatchSnapshot()
  })

  it("parses HunkReviewStream-style pattern with map and conditional JSX", () => {
    const source = `
export function HunkReviewStream({
  files,
  width,
}: {
  files: { id: string; path: string; additions: number; deletions: number }[]
  width: number
}) {
  return (
    <box style={{ width: "100%", flexDirection: "column" }}>
      {files.map((file, index) => (
        <box key={file.id} style={{ width: "100%", flexDirection: "column" }}>
          {index > 0 ? (
            <box style={{ width: "100%" }}>
              <text fg="border">{"\\u2500".repeat(Math.max(1, width - 2))}</text>
            </box>
          ) : null}
          <box style={{ width: "100%", flexDirection: "column" }}>
            <text fg="white">{file.path}</text>
            <text fg="green">+{file.additions}</text>
            <text fg="red">-{file.deletions}</text>
          </box>
        </box>
      ))}
    </box>
  )
}`
    const result = parseHunkFile(source, "HunkReviewStream.tsx")
    expect(stripNotes(result)).toMatchSnapshot()
  })

  it("parses HunkFileNav-style pattern with group/file entries", () => {
    const source = `
export function HunkFileNav({ entries }: { entries: { id: string; kind: string; name: string }[] }) {
  return (
    <box style={{ width: "100%", flexDirection: "column" }}>
      {entries.map((entry) =>
        entry.kind === "group" ? (
          <box key={entry.id}>
            <text fg="cyan">{entry.name}</text>
          </box>
        ) : (
          <box key={entry.id}>
            <text fg="white">{entry.name}</text>
          </box>
        ),
      )}
    </box>
  )
}`
    const result = parseHunkFile(source, "HunkFileNav.tsx")
    expect(stripNotes(result)).toMatchSnapshot()
  })
})

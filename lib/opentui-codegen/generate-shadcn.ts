import type { OpenTUIIrNode, OpenTUIIrProgram } from "./ir"

function escapeText(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function indent(value: string, spaces = 4) {
  const padding = " ".repeat(spaces)
  return value
    .split("\n")
    .map((line) => (line.length > 0 ? `${padding}${line}` : line))
    .join("\n")
}

interface StyleMap {
  flexDirection?: string
  backgroundColor?: string
  width?: string | number
  height?: string | number
  paddingLeft?: number
  paddingRight?: number
  paddingBottom?: number
}

function extractStyleProps(props?: Record<string, unknown>): StyleMap {
  const style = props?.style
  if (typeof style === "object" && style !== null) {
    return style as StyleMap
  }
  return {}
}

function styleToTailwind(style: StyleMap): string {
  const classes: string[] = []
  if (style.flexDirection === "column") classes.push("flex", "flex-col")
  if (style.width === "100%") classes.push("w-full")
  if (style.height === "100%" || style.height === "100%") classes.push("h-full")
  return classes.join(" ")
}

function styleToInline(style: StyleMap): Record<string, string> | undefined {
  const result: Record<string, string> = {}
  if (style.backgroundColor && typeof style.backgroundColor === "string" && style.backgroundColor.includes("resolvedTheme")) {
    return undefined
  }
  if (style.backgroundColor) result.backgroundColor = style.backgroundColor as string
  return Object.keys(result).length > 0 ? result : undefined
}

function renderNode(node: OpenTUIIrNode, depth = 0): string {
  if (node.kind === "text") {
    const val = node.value ?? ""
    if (val.startsWith("{") && val.endsWith("}")) {
      return `<span className="font-mono text-sm text-emerald-200/70">{/* expression */}</span>`
    }
    const fg = typeof node.props?.fg === "string" ? node.props.fg : undefined
    const colorClass = fg?.includes("muted") ? "text-zinc-500" : "text-emerald-200"
    return `<span className="font-mono text-sm ${colorClass}">${escapeText(val)}</span>`
  }

  if (node.kind === "box") {
    const style = extractStyleProps(node.props)
    const tw = styleToTailwind(style)
    const inline = styleToInline(style)
    const inlineStr = inline ? ` style={${JSON.stringify(inline)}}` : ""
    const padBottom = style.paddingBottom ? ` style={{ paddingBottom: ${style.paddingBottom * 16}px }}` : ""

    if (!node.children || node.children.length === 0) {
      return `<div className="${tw || "flex"}${inline ? "" : ""}"${inlineStr}${padBottom} />`
    }

    const children = node.children.map((c) => renderNode(c, depth + 1)).join("\n")
    return `<div className="${tw || "flex flex-col"}${inline ? "" : ""}"${inlineStr}${padBottom}>
${indent(children, 2)}
</div>`
  }

  if (node.kind === "scrollbox") {
    const children = node.children?.map((c) => renderNode(c, depth + 1)).join("\n") ?? ""
    return `<div className="overflow-auto h-full w-full">
${indent(children, 2)}
</div>`
  }

  if (node.kind === "unknown" && node.name) {
    if (node.name === "HunkDiffBody") {
      const children = node.children?.map((c) => renderNode(c, depth + 1)).join("\n") ?? ""
      return `<div className="flex flex-col w-full font-mono text-xs">
${indent(children || `{/* HunkDiffBody: diff content rendered here */}`, 2)}
</div>`
    }

    if (node.name === "HunkDiffFileHeader") {
      return `<div className="flex items-center gap-2 px-2 py-1 text-xs font-mono text-emerald-300 bg-black/30 border-b border-emerald-500/10">
  <span className="font-bold">{file.path}</span>
  <span className="text-emerald-400">+{stats.additions}</span>
  <span className="text-red-400">-{stats.deletions}</span>
</div>`
    }

    if (node.name === "DiffRowView" || node.name === "DiffFileHeaderRow" || node.name === "FileListItem" || node.name === "FileGroupHeader") {
      return `<>{/* ${node.name}: internal Hunk rendering component */}</>`
    }

    const children = node.children?.map((c) => renderNode(c, depth + 1)).join("\n") ?? ""
    const hint = /^[A-Z]/.test(node.name) ? `{/* ${node.name} */}\n` : ""
    return `${hint}${children || `<>{/* ${node.name} */}</>`}`
  }

  const children = node.children?.map((c) => renderNode(c, depth + 1)).join("\n") ?? ""
  return `<div className="flex flex-col">
${indent(children, 2)}
</div>`
}

export function generateShadcnComponent(program: OpenTUIIrProgram) {
  const body = program.nodes.map((n) => renderNode(n)).join("\n")

  const imports = `import type { HunkDiffFileInput } from "hunkdiff/opentui"
import type { HunkDiffSelection } from "hunkdiff/opentui"`

  return `${imports}

export function ${program.name}({
  files,
  layout = "split",
  width = 80,
  theme = "graphite",
  selection,
  showLineNumbers = true,
  showHunkHeaders = true,
  wrapLines = false,
  highlight = true,
  showFileHeaders = true,
  showFileSeparators = true,
  horizontalOffset = 0,
  onSelectionChange,
}: {
  files?: HunkDiffFileInput[]
  layout?: "split" | "stack"
  width?: number
  theme?: string
  selection?: HunkDiffSelection
  showLineNumbers?: boolean
  showHunkHeaders?: boolean
  wrapLines?: boolean
  highlight?: boolean
  showFileHeaders?: boolean
  showFileSeparators?: boolean
  horizontalOffset?: number
  onSelectionChange?: (s: HunkDiffSelection) => void
}) {
  return (
    <div className="flex flex-col w-full">
${indent(body, 6)}
    </div>
  )
}
`
}

export function generateHunkReviewPage(programs: OpenTUIIrProgram[]) {
  const fileNavProgram = programs.find((p) => p.name === "HunkFileNav")
  const reviewProgram = programs.find((p) => p.name === "HunkReviewStream")

  const fileNavBody = fileNavProgram
    ? fileNavProgram.nodes.map((n) => renderNode(n)).join("\n")
    : `{/* HunkFileNav would render here */}`

  const reviewBody = reviewProgram
    ? reviewProgram.nodes.map((n) => renderNode(n)).join("\n")
    : `{/* HunkReviewStream would render here */}`

  return `// Generated by shadcn-opentui codegen from Hunk source
// Source: external vendor fixture at vendor/hunk
// License: MIT (modem-dev/hunk)

import type { HunkDiffFileInput, HunkDiffSelection, HunkDiffLayout, HunkDiffFile } from "hunkdiff/opentui"
import { createHunkDiffFilesFromPatch } from "hunkdiff/opentui"

const DEFAULT_PATCH = [
  "diff --git a/src/index.ts b/src/index.ts",
  "index abc123..def456 100644",
  "--- a/src/index.ts",
  "+++ b/src/index.ts",
  "@@ -1,5 +1,8 @@",
  " export function greet(name: string) {",
  "-  return \`Hello, \${name}!\`",
  "+  return \`Hello, \${name}!\`;",
  " }",
  "",
  "+export function farewell(name: string) {",
  "+  return \`Goodbye, \${name}!\`;",
  "+}",
].join("\\n")

const DEFAULT_FILES = createHunkDiffFilesFromPatch(DEFAULT_PATCH)

export interface HunkReviewViewProps {
  files?: HunkDiffFileInput[]
  layout?: HunkDiffLayout
  width?: number
  theme?: string
  showLineNumbers?: boolean
  showHunkHeaders?: boolean
  wrapLines?: boolean
  highlight?: boolean
  showFileHeaders?: boolean
  showFileSeparators?: boolean
  onSelectionChange?: (s: HunkDiffSelection) => void
}

export function HunkReviewView({
  files = DEFAULT_FILES,
  layout = "split",
  width = 80,
  showLineNumbers = true,
  showHunkHeaders = true,
  wrapLines = false,
  highlight = true,
  showFileHeaders = true,
  showFileSeparators = true,
  onSelectionChange,
}: HunkReviewViewProps) {
  return (
    <div className="grid gap-0 lg:grid-cols-[280px_1fr] min-h-[400px] rounded-lg border border-emerald-500/20 bg-black/90 font-mono text-xs overflow-hidden">
      <aside className="border-r border-emerald-500/10 bg-black/60 p-2">
        <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-400/70">
          Files
        </div>
        {files.map((file, i) => (
          <button
            key={file.id}
            onClick={() => onSelectionChange?.({ fileId: file.id, hunkIndex: 0 })}
            className={\`w-full rounded px-2 py-1.5 text-left text-xs transition-colors \${
              i === 0
                ? "bg-emerald-500/10 text-emerald-200"
                : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
            }\`}
          >
            <div className="flex items-center gap-2">
              <span className="truncate">{file.metadata.name}</span>
            </div>
          </button>
        ))}
      </aside>

      <main className="overflow-auto p-3">
        {files.map((file, index) => (
          <div key={file.id} className="flex flex-col w-full">
            {showFileSeparators && index > 0 && (
              <div className="w-full border-t border-emerald-500/10 my-2" />
            )}
            {showFileHeaders && (
              <div className="flex items-center gap-2 px-2 py-1 text-xs text-emerald-300 bg-black/30 border-b border-emerald-500/10 mb-1">
                <span className="font-bold">{file.metadata.name}</span>
                <span className="text-emerald-400">+{file.stats?.additions ?? 0}</span>
                <span className="text-red-400">-{file.stats?.deletions ?? 0}</span>
              </div>
            )}
            <pre className="overflow-x-auto p-2 text-[11px] leading-relaxed text-emerald-100/80">
              <code>{file.patch?.split("\\n").slice(0, 8).join("\\n")}</code>
            </pre>
          </div>
        ))}
      </main>
    </div>
  )
}
`
}

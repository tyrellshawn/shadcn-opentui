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

function renderNode(node: OpenTUIIrNode): string {
  if (node.kind === "text") {
    return `<p className="font-mono text-sm text-emerald-200">${escapeText(node.value ?? "")}</p>`
  }

  if (node.kind === "fileNav") {
    return `<aside className="rounded-lg border border-emerald-500/20 bg-black/50 p-3 font-mono text-xs text-emerald-100">
  <div className="mb-2 text-emerald-300">Files</div>
  <div className="space-y-1">
    <button className="block w-full rounded bg-emerald-500/10 px-2 py-1 text-left">app/page.tsx</button>
    <button className="block w-full rounded px-2 py-1 text-left text-emerald-200/70">components/ui/terminal.tsx</button>
  </div>
</aside>`
  }

  if (node.kind === "diffView" || node.kind === "reviewStream") {
    return `<section className="rounded-lg border border-emerald-500/20 bg-black/60 p-4 font-mono text-xs">
  <div className="mb-3 text-emerald-300">Generated Hunk-style diff view</div>
  <pre className="overflow-auto text-emerald-100"><code>{samplePatch}</code></pre>
</section>`
  }

  const children = node.children?.map(renderNode).join("\n") ?? ""
  return `<div className="rounded-lg border border-emerald-500/20 bg-black/40 p-4">
${indent(children, 2)}
</div>`
}

export function generateShadcnComponent(program: OpenTUIIrProgram) {
  const body = program.nodes.map(renderNode).join("\n")

  return `export function ${program.name}() {
  const samplePatch = "diff --git a/app/page.tsx b/app/page.tsx\\n+@@ -1,3 +1,4 @@\\n+ export default function Page() {\\n++  return <main>Shadcn OpenTUI</main>\\n+ }"

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
${indent(body, 6)}
    </div>
  )
}
`
}

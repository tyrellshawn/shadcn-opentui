import { readFileSync, writeFileSync } from "fs"
import { resolve } from "path"
import { parseHunkFile } from "../lib/opentui-codegen/parse-hunk"
import { resolveAllHunkFiles } from "../lib/opentui-codegen/hunk-source"

const files = resolveAllHunkFiles()

console.log("=== Hunk Source Inspection ===\n")

const allPrograms: ReturnType<typeof parseHunkFile>[] = []

for (const f of files) {
  if (!f.relative.endsWith(".tsx")) continue

  const sourceText = readFileSync(f.absolute, "utf-8")
  const program = parseHunkFile(sourceText, f.relative)

  console.log(`--- ${program.name} ---`)
  console.log(`  File: ${f.relative}`)
  console.log(`  Nodes: ${program.nodes.length}`)
  for (const note of program.notes) {
    console.log(`  ${note}`)
  }
  for (const node of program.nodes) {
    console.log(`  Component: ${node.name} (kind=${node.kind})`)
    if (node.children) {
      for (const child of node.children) {
        console.log(`    -> ${child.kind}${child.name ? ` (${child.name})` : ""}${child.props ? ` props=${JSON.stringify(Object.keys(child.props))}` : ""}`)
        if (child.children) {
          for (const gc of child.children) {
            console.log(`        -> ${gc.kind}${gc.name ? ` (${gc.name})` : ""}${gc.value ? ` value="${gc.value.slice(0, 40)}"` : ""}${gc.props ? ` props=${JSON.stringify(Object.keys(gc.props))}` : ""}`)
          }
        }
      }
    }
  }
  console.log()
  allPrograms.push(program)
}

writeFileSync(
  resolve(__dirname, "../generated/hunk/ir.json"),
  JSON.stringify(allPrograms, null, 2),
)

console.log(`\nWrote IR snapshot to generated/hunk/ir.json (${allPrograms.length} programs)`)

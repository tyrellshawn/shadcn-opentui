import { readFileSync, writeFileSync, existsSync } from "fs"
import { resolve, dirname } from "path"
import { parseHunkFile } from "../lib/opentui-codegen/parse-hunk"
import { resolveAllHunkFiles } from "../lib/opentui-codegen/hunk-source"
import { generateHunkReviewPage } from "../lib/opentui-codegen/generate-shadcn"

const files = resolveAllHunkFiles()
const allPrograms: ReturnType<typeof parseHunkFile>[] = []

for (const f of files) {
  if (!f.relative.endsWith(".tsx")) continue
  const sourceText = readFileSync(f.absolute, "utf-8")
  const program = parseHunkFile(sourceText, f.relative)
  allPrograms.push(program)
}

const generated = generateHunkReviewPage(allPrograms)

const outDir = resolve(__dirname, "../generated/hunk")
const outFile = resolve(outDir, "HunkReviewView.generated.tsx")
writeFileSync(outFile, generated)

console.log(`Generated: ${outFile}`)
console.log(`Source: ${files.length} Hunk files parsed`)
console.log(`Programs: ${allPrograms.map((p) => p.name).join(", ")}`)

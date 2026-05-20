import { readFileSync, writeFileSync } from "fs"
import { resolve } from "path"
import { parseDSL } from "../lib/opentui-codegen/parse-dsl"

const filePath = process.argv[2]
if (!filePath) {
  console.error("Usage: bun run dsl:parse path/to/file.opentui")
  process.exit(1)
}

const absolutePath = resolve(filePath)
const sourceText = readFileSync(absolutePath, "utf-8")
const program = parseDSL(sourceText, absolutePath)

const outPath = absolutePath + ".ir.json"
writeFileSync(outPath, JSON.stringify(program, null, 2))

console.log(JSON.stringify(program, null, 2))
console.error(`\nWrote IR to ${outPath}`)

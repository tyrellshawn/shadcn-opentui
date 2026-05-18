import { generateShadcnComponent } from "../lib/opentui-codegen/generate-shadcn"
import { hunkFixtureProgram } from "../lib/opentui-codegen/hunk-fixture"

const generated = generateShadcnComponent(hunkFixtureProgram)

process.stdout.write(generated)

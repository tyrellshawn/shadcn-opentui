import packageJson from "../package.json"
import { OPENTUI_PACKAGE_NAMES } from "../lib/opentui/browser-runtime"

async function main() {
  const dependencies = packageJson.dependencies ?? {}

  for (const packageName of OPENTUI_PACKAGE_NAMES) {
    if (!dependencies[packageName]) {
      throw new Error(`Missing required dependency: ${packageName}`)
    }
  }

  await import("@opentui/core")
  await import("@opentui/react")

  process.stdout.write(`Verified OpenTUI packages: ${OPENTUI_PACKAGE_NAMES.join(", ")}\n`)
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`)
  process.exit(1)
})

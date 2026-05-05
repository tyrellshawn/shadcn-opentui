import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

const ROOT_DIR = process.cwd()
const COMPONENT_DIR = join(ROOT_DIR, 'components', 'ui')
const disallowedPattern = /(?:from\s+['"`][^'"`]*packages\/web-|import\s+['"`][^'"`]*packages\/web-)/

function listTsxFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return listTsxFiles(path)
    return path.endsWith('.tsx') || path.endsWith('.ts') ? [path] : []
  })
}

const offenders = []

for (const file of listTsxFiles(COMPONENT_DIR)) {
  const content = readFileSync(file, 'utf8')
  if (disallowedPattern.test(content)) {
    offenders.push(file.replace(`${ROOT_DIR}/`, ''))
  }
}

if (offenders.length > 0) {
  console.error('Registry boundary violation: components/ui must not import from packages/web-*')
  for (const file of offenders) {
    console.error(`- ${file}`)
  }
  process.exit(1)
}

console.log('Registry boundaries OK: no components/ui imports from packages/web-*')

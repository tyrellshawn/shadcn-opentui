import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'
import type { Page } from 'puppeteer'

const BASELINE_DIR = path.join(process.cwd(), 'test', 'snapshots', 'integration')
const ARTIFACT_DIR = path.join(process.cwd(), 'test', 'artifacts', 'integration')
const DIFF_DIR = path.join(ARTIFACT_DIR, 'diff')

export async function assertPageSnapshot(page: Page, filename: string): Promise<string> {
  await mkdir(BASELINE_DIR, { recursive: true })
  await mkdir(ARTIFACT_DIR, { recursive: true })
  await mkdir(DIFF_DIR, { recursive: true })

  const baselinePath = path.join(BASELINE_DIR, filename)
  const actualPath = path.join(ARTIFACT_DIR, filename)
  const diffPath = path.join(DIFF_DIR, filename)

  await page.screenshot({
    path: actualPath,
    fullPage: true,
  })

  const shouldUpdate = process.env.UPDATE_SNAPSHOTS === '1'
  const baselineExists = await access(baselinePath)
    .then(() => true)
    .catch(() => false)

  if (shouldUpdate || !baselineExists) {
    await writeFile(baselinePath, await readFile(actualPath))
    return actualPath
  }

  const baseline = PNG.sync.read(await readFile(baselinePath))
  const actual = PNG.sync.read(await readFile(actualPath))

  if (baseline.width !== actual.width || baseline.height !== actual.height) {
    throw new Error(
      `Snapshot size mismatch for ${filename}: expected ${baseline.width}x${baseline.height}, got ${actual.width}x${actual.height}`,
    )
  }

  const diff = new PNG({ width: baseline.width, height: baseline.height })
  const changedPixels = pixelmatch(
    baseline.data,
    actual.data,
    diff.data,
    baseline.width,
    baseline.height,
    {
      threshold: 0.1,
    },
  )

  await writeFile(diffPath, PNG.sync.write(diff))

  if (changedPixels > 0) {
    throw new Error(
      `Snapshot mismatch for ${filename}: ${changedPixels} pixels differ. See ${actualPath} and ${diffPath}`,
    )
  }

  return actualPath
}

export async function stabilizePage(page: Page): Promise<void> {
  await page.setViewport({ width: 1440, height: 1200, deviceScaleFactor: 1 })
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        caret-color: transparent !important;
      }
    `,
  })
}

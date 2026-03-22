import puppeteer, { type Browser, type Page } from 'puppeteer'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { assertPageSnapshot, stabilizePage } from '@/test/integration/utils/snapshots'
import { startNextServer, type NextServerHandle } from '@/test/integration/utils/next-server'

async function clickVisibleButtonByText(page: Page, text: string) {
  const position = await page.evaluate((buttonText) => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const target = buttons.find((button) => {
      const rect = button.getBoundingClientRect()
      const isVisible = rect.width > 0 && rect.height > 0
      return isVisible && (button.textContent?.includes(buttonText) ?? false)
    })

    if (!target) {
      throw new Error(`No visible button found for text: ${buttonText}`)
    }

    const rect = target.getBoundingClientRect()
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }
  }, text)

  await page.mouse.click(position.x, position.y)
}

async function clickVisibleLinkByText(page: Page, text: string) {
  const position = await page.evaluate((linkText) => {
    const links = Array.from(document.querySelectorAll('a'))
    const target = links.find((link) => {
      const rect = link.getBoundingClientRect()
      const isVisible = rect.width > 0 && rect.height > 0
      return isVisible && (link.textContent?.includes(linkText) ?? false)
    })

    if (!target) {
      throw new Error(`No visible link found for text: ${linkText}`)
    }

    const rect = target.getBoundingClientRect()
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }
  }, text)

  await page.mouse.click(position.x, position.y)
}

async function focusVisibleInputByPlaceholder(page: Page, placeholder: string) {
  const handles = await page.$$(`input[placeholder="${placeholder}"]`)

  for (const handle of handles) {
    const box = await handle.boundingBox()
    if (box && box.width > 0 && box.height > 0) {
      await handle.click()
      return handle
    }
  }

  throw new Error(`No visible input found for placeholder: ${placeholder}`)
}

async function openDocsSearch(page: Page) {
  await page.click('body')
  await page.keyboard.press('/')

  const openedViaKeyboard = await page
    .waitForSelector('input[placeholder="Search documentation..."]', { timeout: 3000 })
    .then(() => true)
    .catch(() => false)

  if (!openedViaKeyboard) {
    await clickVisibleButtonByText(page, 'Search documentation')
    await page.waitForSelector('input[placeholder="Search documentation..."]', { timeout: 10000 })
  }
}

describe.sequential('docs integration flows', () => {
  let server: NextServerHandle
  let browser: Browser
  let page: Page

  beforeAll(async () => {
    server = await startNextServer(3010)
    browser = await puppeteer.launch({ headless: true })
    page = await browser.newPage()
    page.setDefaultNavigationTimeout(60000)
    page.setDefaultTimeout(60000)
  })

  afterAll(async () => {
    await browser.close()
    await server.stop()
  })

  it('renders the home page and writes a screenshot snapshot', async () => {
    await page.goto(server.baseUrl, { waitUntil: 'domcontentloaded' })
    await stabilizePage(page)

    await page.waitForSelector('h1')
    const title = await page.$eval('h1', (element) => element.textContent?.trim())
    expect(title).toContain('OpenTUI')

    await assertPageSnapshot(page, 'home-page.png')
  })

  it('changes themes on the docs page and captures the themed snapshot', async () => {
    await page.goto(`${server.baseUrl}/docs/themes`, { waitUntil: 'domcontentloaded' })
    await stabilizePage(page)

    await page.waitForSelector('h1')
    await clickVisibleButtonByText(page, 'Tokyo Night')

    await page.waitForFunction(() => {
      const text = document.body.textContent ?? ''
      return text.includes('Tokyo Night') && text.includes('OpenTUI Terminal')
    })

    await assertPageSnapshot(page, 'themes-page-tokyo-night.png')
  })

  it('opens the docs search dialog and shows matching results', async () => {
    await page.goto(`${server.baseUrl}/docs/quick-start`, { waitUntil: 'domcontentloaded' })
    await stabilizePage(page)

    await openDocsSearch(page)
    await page.type('input[placeholder="Search documentation..."]', 'Installation')
    await page.waitForFunction(() => {
      const text = document.body.textContent ?? ''
      return text.includes('Installation') && text.includes('Install OpenTUI React in your project')
    })
    await expect(
      page.$eval('input[placeholder="Search documentation..."]', (element) =>
        (element as HTMLInputElement).value,
      ),
    ).resolves.toBe('Installation')
  })

  it('navigates to a docs page from the search dialog results', async () => {
    await page.goto(`${server.baseUrl}/docs`, { waitUntil: 'domcontentloaded' })
    await stabilizePage(page)

    await openDocsSearch(page)
    await page.type('input[placeholder="Search documentation..."]', 'Terminal Component')
    await clickVisibleButtonByText(page, 'Terminal Component')
    await page.waitForFunction(() => window.location.pathname === '/docs/components/terminal', { timeout: 60000 })
  })

  it('allows typing in the quick start OpenTUI preview terminal', async () => {
    await page.goto(`${server.baseUrl}/docs/quick-start`, { waitUntil: 'domcontentloaded' })
    await stabilizePage(page)

    await page.waitForSelector('input[placeholder="Type a command..."]')
    const input = await focusVisibleInputByPlaceholder(page, 'Type a command...')
    await input.type('help')

    await page.waitForFunction((element) => {
      return (element as HTMLInputElement).value === 'help'
    }, {}, input)
  })

  it('navigates from quick start to installation and captures snapshots', async () => {
    await page.goto(`${server.baseUrl}/docs/quick-start`, { waitUntil: 'domcontentloaded' })
    await stabilizePage(page)

    await assertPageSnapshot(page, 'docs-quick-start-page.png')

    await clickVisibleLinkByText(page, 'Installation')
    await page.waitForFunction(() => window.location.pathname === '/docs/installation', { timeout: 60000 })
    await page.waitForSelector('h1')
    await stabilizePage(page)

    await assertPageSnapshot(page, 'docs-installation-page.png')
  })

  it('renders the interactive examples landing page', async () => {
    await page.goto(`${server.baseUrl}/docs/components/examples`, { waitUntil: 'domcontentloaded' })
    await stabilizePage(page)

    await page.waitForSelector('h1')
    const title = await page.$eval('h1', (element) => element.textContent?.trim())
    expect(title).toContain('Interactive Examples')
  })
})

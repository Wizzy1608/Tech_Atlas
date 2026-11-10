// Smoke test for the static build. Usage: node smoke.mjs [base-url]
// PW_CHANNEL=chromium in CI; msedge is the installed browser on the dev box.
import { chromium } from 'playwright-core'

const base = (process.argv[2] ?? 'http://localhost:4173').replace(/\/$/, '')
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL ?? 'msedge', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })

const errors = []
page.on('pageerror', (e) => errors.push(e.message))
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

const failed = []
const check = (ok, label) => {
  if (!ok) failed.push(label)
}

await page.goto(base + '/', { waitUntil: 'networkidle' })
const catalogue = await page.evaluate(async () => (await fetch('/catalogue.json')).json())
check(catalogue.resources.length > 0, 'catalogue.json is empty')
check((await page.locator('a[href^="/resource/"]').count()) > 0, 'home has no resource cards')

await page.goto(base + '/browse', { waitUntil: 'networkidle' })
await page.waitForTimeout(500)
check((await page.locator('a[href^="/resource/"]').count()) > 0, 'browse has no resource cards')

await page.goto(base + '/search?q=linux', { waitUntil: 'networkidle' })
await page.waitForTimeout(500)
check((await page.locator('a[href^="/resource/"]').count()) > 0, 'search returned no results')

const id = catalogue.resources[0].id
await page.goto(`${base}/resource/${id}`, { waitUntil: 'networkidle' })
await page.waitForTimeout(400)
check(((await page.locator('h1').first().textContent()) ?? '').trim().length > 0, 'resource page has no title')

check(errors.length === 0, `console errors: ${errors.join(' | ')}`)

console.log(JSON.stringify({ base, resources: catalogue.resources.length, errors, failed }, null, 1))
await browser.close()
process.exitCode = failed.length ? 1 : 0

import { chromium } from 'playwright-core'

const url = process.argv[2] ?? 'http://localhost:5173/'
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage()
const errors = []
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message + '\n' + (e.stack ?? '')))
page.on('console', (m) => {
  if (m.type() === 'error') errors.push('CONSOLE: ' + m.text())
})
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)
const bodyText = (await page.textContent('body'))?.slice(0, 300)
console.log('--- errors ---')
console.log(errors.length ? errors.join('\n\n') : '(none)')
console.log('--- body ---')
console.log(JSON.stringify(bodyText))
await browser.close()

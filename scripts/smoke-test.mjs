import { chromium } from 'playwright'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '../shots')
fs.mkdirSync(outDir, { recursive: true })

const BASE = 'http://localhost:5173'
const ROUTES = [
  ['home', '/'],
  ['a-emcomjunto', '/a-emcomjunto'],
  ['o-que-fazemos', '/o-que-fazemos'],
  ['varejo', '/varejo'],
  ['pesquisa-clinica', '/pesquisa-clinica'],
  ['blog', '/blog'],
  ['blog-post', '/blog-post?post=inexistente'],
  ['not-found', '/rota-que-nao-existe'],
]

const browser = await chromium.launch()
const results = []

for (const [name, route] of ROUTES) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push('pageerror: ' + err.message))

  try {
    await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 20000 })
  } catch (e) {
    errors.push('goto timeout/error: ' + e.message)
  }
  await page.waitForTimeout(1200)
  await page.screenshot({ path: path.join(outDir, name + '.png'), fullPage: false })
  await page.screenshot({ path: path.join(outDir, name + '-full.png'), fullPage: true })

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } })
  const mobileErrors = []
  mobile.on('console', (msg) => { if (msg.type() === 'error') mobileErrors.push(msg.text()) })
  mobile.on('pageerror', (err) => mobileErrors.push('pageerror: ' + err.message))
  try {
    await mobile.goto(BASE + route, { waitUntil: 'networkidle', timeout: 20000 })
  } catch (e) {
    mobileErrors.push('goto timeout/error: ' + e.message)
  }
  await mobile.waitForTimeout(800)
  await mobile.screenshot({ path: path.join(outDir, name + '-mobile.png'), fullPage: false })
  await mobile.close()

  results.push({ name, route, errors, mobileErrors })
  await page.close()
}

await browser.close()

for (const r of results) {
  console.log('==== ' + r.name + ' (' + r.route + ') ====')
  console.log('desktop console errors:', r.errors.length ? r.errors : 'none')
  console.log('mobile console errors:', r.mobileErrors.length ? r.mobileErrors : 'none')
}

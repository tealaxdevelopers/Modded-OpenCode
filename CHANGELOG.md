# Changelog

All notable changes to Modded OpenCode are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.1.6] - 2026-09-14

### Fixed
- **build-config.mjs**: cross-platform path replacement — templates now use `{{TARGET_DIR}}` placeholder instead of hardcoded `C:\Users\{{USERNAME}}` Windows paths. Replacement order corrected.
- **setup.sh**: API keys no longer written to `.bashrc`/`.zshrc`. Keys stored in `.env.local` (mode 0600) at `local-setup/` directory. RC file only receives `OPENCODE_LOCAL_SETUP_DIR` export.
- **update-checker.ts**: kit root path calculation fixed for installed plugin location (1 level up, not 2).
- **opencode-continue.ts**: `continue_on_error` default changed to `false` for safety. Loop detection: after 2+ consecutive continues, switches to thinking mode and suppresses toast notifications.
- **doctor.mjs**: secret detection broadened — catches any 20+ char alphanumeric token, not just known provider prefixes.
- **sync-on-launch.ps1**: fixed script path from `$setupDir\scripts\sync-on-launch.mjs` to `$setupDir\sync-on-launch.mjs`.
- **Agent skill references**: replaced non-existent skills (`socratic`, `postmortem`, `python-code-review`, `python-testing`, `data-pipeline`, `jtbd`, `wardley`, `aar`, `design`, `prompt-engineering`) with existing ones.
- **README badges**: switched to static shields.io badges to avoid "repo not found" errors.

### Added
- **openai-system-merge plugin**: new plugin that patches `globalThis.fetch` to merge multiple leading system messages into one. Fixes `400 BadRequestError: System message must be at the beginning` on strict OpenAI-compatible providers (vLLM/Qwen, Hetzner, OVHcloud, Scaleway, Nebius).
- **6 Claude Code compatible skills**: `claude-commit`, `claude-code-review`, `claude-debug`, `claude-simplify`, `claude-batch`, `claude-loop` — adapted from Claude Code's plugin system to OpenCode's SKILL.md format.
- **github-auth instruction**: AI auto-detects GitHub token from environment variables (`GITHUB_API_KEY`, `GITHUB_TOKEN`, `GITHUB_PERSONAL_ACCESS_TOKEN`) instead of asking user.
- **sequential-thinking instruction**: all models (with or without native thinking) use structured step-by-step reasoning for complex problems.
- **Default persona fallback**: when remote persona API is unreachable, a built-in `DEFAULT_PERSONA` constant is used instead of leaving Article 2 empty.
- **Manifest updated**: added missing `ivan.md`, `jester.md`, `oscar.md`, `scout.md` agents and `update-checker.ts` plugin.

### Changed
- **opencode.jsonc permissions**: `bash` and `external_directory` changed from `allow` to `ask` for security.
- **opencode.jsonc plugins**: all local plugins listed by name (not file paths) for cleaner UI display.
- **READMEs** (EN/TR/RU): added per-OS `.env.local` locations table, `chmod +x` requirements, OpenAI-compatible provider section, new skill listings.
- Skill count: 99 → 105. Plugin count: 3 → 4.

### Security
- API keys never written to shell RC files — stored in `.env.local` with 0600 permissions.
- Auto-continue loop mode uses thinking instead of visible messages to prevent prompt injection loops.
- Default persona ensures agent always has working instructions even without internet.

## [1.1.5] - 2026-09-05

### Fixed
- **build-config.mjs**: removed redundant `agent` (singular) target directory from creation list.
- **proxy-bridge.md**: cross-platform — added macOS/Linux bash snippets alongside PowerShell.
- **opencode.jsonc**: removed unused `PROJECT_ROOT` env var from filesystem MCP server config.
- **ci.yml**: added Node 18 to test matrix (package.json requires ≥18).
- **discord-notify.yml**: added `branches: [main, master]` filter to push trigger.
- **agents-opencode.ts**: updated compaction context to list all 13 agents (was missing ivan, scout, jester, oscar).

### Changed
- **READMEs** (EN/TR/RU): removed AETHER-9/ratman4080 references, updated skill count to 99.
- **rules.md**: rewritten as "Agent Persona" — accurate description of the session-scoped persona layer.
- **setup.sh**: full rewrite — `set -euo pipefail`, Node.js ≥18 check, bash 3.2+ compatible IFS, RC file creation.

## [1.1.4] - 2026-08-31

### Fixed
- **Update-checker two-layer strategy**: now checks both releases AND unreleased commits on main branch. Compares file blob SHAs against latest HEAD to catch changes between releases.
- **Rate-limit-fallback config**: removed non-existent Gemini models from NVIDIA fallback, replaced with real NVIDIA-available models (deepseek-v4-flash, nemotron-3-nano, mistral-nemotron).
- **Proxy-bridge command**: fixed script path resolution — now uses absolute path instead of relative path that failed in different working directories.
- **README credits**: simplified to only reference awesome-opencode and opencode repos.
- **Skill count synced**: all READMEs and package.json updated from 68 to 99.
- **MIT LICENSE**: added LICENSE file to repository.

## [1.1.3] - 2026-08-30

### Added
- **Research & planning skills bundle**: 6 skills imported from [`EdEngineering/opencode-awesome-skills`](https://github.com/EdEngineering/opencode-awesome-skills):
  - `deep-research` — Gemini-powered autonomous research
  - `writing-plans` — TDD-driven implementation plans
  - `plan-writing` — structured task planning with verification
  - `wiki-researcher` — 5-iteration codebase analysis
  - `brainstorming` — validated design pipeline
  - `idea-os` — 5-phase idea → PRD → plan pipeline
- **Rate-limit-fallback plugin**: added `@azumag/opencode-rate-limit-fallback` to opencode.jsonc with NVIDIA-available fallback models.

### Changed
- **READMEs redesigned**: all 3 languages (EN/TR/RU) rewritten with collapsible `<details>/<summary>` sections, categorized skills tables, updated counts.

## [1.1.2] - 2026-08-27

### Added
- **Community skills bundle**: 26 skills imported from upstream OpenCode ecosystems, with attribution:
  - From [`open-hax/opencode-skills`](https://github.com/open-hax/opencode-skills): `opencode-plugin-authoring`, `opencode-agent-authoring`, `opencode-command-authoring`, `opencode-configs`, `emergency-confusion-reset`, `break-edit-loop`, `git-safety-check`, `lint-gate`, `github-integration`, `mcp-server-integration`, `lsp-server-integration`, and the `devsecops-free-*` series (auth, cicd, cloud, discovery, dns, monitoring, security, storage).
  - From [`devarfeen/agent-skills-kit`](https://github.com/devarfeen/agent-skills-kit): `tdd-loop`, `feature-discovery`, `agents-md`, `release-notes`, `commit-push-pr`, `pr-feedback`, `staging-fix`.
- New skills live under `source/skills/` and load via OpenCode's standard `SKILL.md` discovery.

## [1.1.1] - 2026-08-27

### Added
- **Cross-platform installer**: new `setup.sh` (macOS / Linux) mirrors the Windows wizard and both share one engine, `scripts/build-config.mjs` (Node, no PowerShell needed).
- **Auto-Continue plugin** (`source/plugins/opencode-continue.ts`): watches sessions and automatically injects `continue` when a session goes idle or the connection drops mid-task (`session.idle` / `session.error`). Bounded by `cooldown_ms` + `max_consecutive`; resets on a real user message. On by default, tunable via `<project>/.opencode/auto-continue.json` or the `OC_AUTOCONTINUE` env var (0/1).
- README sections (all 3 languages) documenting the macOS/Linux wizard and Auto-Continue behavior.

### Changed
- Config generator switched from `scripts/build-config.ps1` (PowerShell) to `scripts/build-config.mjs` (cross-platform Node). `setup.bat` now calls `node build-config.mjs`. The old `.ps1` engine is retired.

## [1.1.0] - 2026-08-26

### Added
- **Trilingual setup wizard** (`tr` / `us` / `ru`, 2-letter prompt). The picked language also sets the agent's conversation language inside `rules.md` via the new `{{LANGUAGE}}` placeholder.
- **Multiple GitHub API keys**: the wizard accepts comma-separated tokens, saved as `GITHUB_API_KEY_1..N` (no upper limit); a single token stays as `GITHUB_API_KEY`. `build-config.ps1` flags multi-mode with `OC_GH_MULTI` and the generated config references the first key (`_1`).
- **Brave Search integration step**: wizard asks for a Brave API key; when provided, `BRAVE_API_KEY` is saved and the `brave-search` MCP server is enabled in the generated config.
- **Custom OpenAI-compatible provider flow** (wizard option `[1]`): asks Base URL + model name + API key, writes a provider block into `opencode.jsonc` and saves `CUSTOM_LLM_API_KEY` as a user environment variable.
- **READMEs in three languages**: English (primary), Turkish (`README.tr.md`), Russian (`README.ru.md`).
- Listed on [awesome-opencode](https://github.com/awesome-opencode/awesome-opencode) under Projects.

### Changed
- Wizard question order is now: language → username → addressing → GitHub key → Brave key → extra integrations.
- Every key prompt can be skipped with `ENTER`; related MCP servers are then installed **disabled** instead of erroring later.
- `rules.md` first article is fully templated now: `{{LANGUAGE}}` + addressing placeholders replace the hardcoded Turkish sentence.
- All folder and file names converted to English: `kaynak/` renamed to `source/`; setup variables and infrastructure scripts use English identifiers.
- The persona section of the README was rewritten: it now describes rules.md accurately as a session-scoped persona layer loaded through OpenCode instructions — no model weights are touched and server-side policies remain unaffected.

### Removed
- `@melodyoftears/opencode-qwen-auth` plugin is no longer installed. It shipped as a leftover example provider and users kept trying to use it without keys. The Qwen/DashScope entry remains in the README as a manual opt-in example only.

### Fixed
- `npm run check` works on Windows again: the bash-only for-loop was replaced by a cross-platform Node runner (`scripts/check.mjs`) that skips shell checks gracefully when bash is unavailable.
- Launch-sync test's POSIX file-permission assertion (`0o600`) is now skipped on Windows where mode bits don't exist; full suite passes on win32.

### Security
- Confirmed hygiene: no API key or token is ever persisted into generated config files — keys live only in user-level environment variables referenced via `{env:...}`.

## [1.0.0]

Initial public release of the setup kit: 68 skills, 13 agents, 17 commands, 22 instruction sets, agents-opencode plugin with managed-file manifest, preconfigured MCP servers, agent persona rules, one-click `setup.bat`.

# Changelog

All notable changes to Modded OpenCode are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- **`/proxy-bridge` command**: finds the fastest free proxy and optionally configures OpenCode to route API traffic through it. Uses live-tested sources (Databay 63.9% alive, ProxyScrape 22k pool). Flags: `--json`, `--top N`, `--protocol socks5`, `--write` (persists to `~/.config/opencode/proxy-bridge.env`).
- **`scripts/proxy-bridge.mjs`**: Node.js script for proxy discovery + TCP speed testing (concurrent, 5s timeout per proxy).

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
- The AETHER-9 / "jailbreak" section of the README was rewritten: it now describes rules.md accurately as a session-scoped persona layer loaded through OpenCode instructions — no model weights are touched and server-side policies remain unaffected.

### Removed
- `@melodyoftears/opencode-qwen-auth` plugin is no longer installed. It shipped as a leftover example provider and users kept trying to use it without keys. The Qwen/DashScope entry remains in the README as a manual opt-in example only.

### Fixed
- `npm run check` works on Windows again: the bash-only for-loop was replaced by a cross-platform Node runner (`scripts/check.mjs`) that skips shell checks gracefully when bash is unavailable.
- Launch-sync test's POSIX file-permission assertion (`0o600`) is now skipped on Windows where mode bits don't exist; full suite passes on win32.

### Security
- Confirmed hygiene: no API key or token is ever persisted into generated config files — keys live only in user-level environment variables referenced via `{env:...}`.

## [1.0.0]

Initial public release of the setup kit: 68 skills, 13 agents, 17 commands, 22 instruction sets, agents-opencode plugin with managed-file manifest, preconfigured MCP servers, AETHER-9 rules kernel, one-click `setup.bat`.

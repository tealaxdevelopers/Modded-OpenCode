# Changelog

All notable changes to Modded OpenCode are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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

## What's New — v1.1.8 (2026-09-17)

### Critical Bug Fixes (Runtime)
- **opencode-continue infinite loop fix**: error path now increments consecutiveCount so max_consecutive guard fires on broken models
- **opencode-continue thinking mode fix**: `[Thinking]` messages no longer reset the loop counter — max_consecutive is now reachable
- **opencode-continue race condition fix**: inFlight lock moved before async operations to prevent concurrent injection
- **stripJsonComments URL fix**: config parser no longer corrupts `//` in URLs when stripping comments
- **isSessionIdle fix**: changed from fail-open to fail-safe — won't inject continuations when session state is unknown
- **persona hash fix**: hash verification now compares only remote persona (was comparing remote + default concat)
- **res.text() timeout**: persona download body read now has 8-second timeout (was hanging indefinitely)
- **agents-opencode env blocking removed**: deleted sensitive file blocking hook — agents can read .env files when needed

### Comprehensive Code Review & Docs Audit
- Full project scan against official OpenCode AI documentation (36 pages)
- Fixed config inconsistencies: github MCP disabled by default, added model/small_model, lsp permission
- Removed phantom agent references (orchestrator, planner, em-advisor, codebase, blogger)
- Removed deprecated `tools:` blocks from 4 agent frontmatters
- Removed undocumented `argument-hint` from 18 commands
- Removed unrecognized frontmatter fields from 22 skills

### Documentation
- Fixed key safety docs: Windows uses `setx` for persistent env vars, not `.env.local` (was misleading)
- 36 OpenCode AI docs pages saved locally for offline reference
- Remote persona API behavior documented (build-config.mjs + api-reference.md)
- Oscar vs Orchestrator disambiguation notes added
- Turkish comments in opencode-continue plugin translated to English

### Plugin & Version Fixes
- Plugin versions synchronized: source/plugins/ now matches packages/ (1.1.8)
- Plugin count corrected across all READMEs (6 built-in, not 7)
- env-guard plugin removed entirely (per user request)
- deep-research skill rewritten to use built-in tools (no Gemini API key needed)
- OC_GH_FIRST dead code removed from setup scripts

### Quality
- 34 source integrity smoke tests added
- Root tsconfig.json for plugin typechecking
- All versions bumped to 1.1.8

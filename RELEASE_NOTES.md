## What's New — v1.1.8 (2026-09-17)

### Critical Bug Fixes (Runtime)
- **opencode-continue infinite loop fix**: error path now increments consecutiveCount so max_consecutive guard fires on broken models
- **opencode-continue thinking mode fix**: `[Thinking]` messages no longer reset the loop counter — max_consecutive is now reachable
- **opencode-continue inFlight lock fix**: entire injection logic wrapped in try/finally — early returns can no longer permanently lock a session
- **opencode-continue race condition fix**: inFlight lock moved before async operations to prevent concurrent injection
- **stripJsonComments URL fix**: config parser no longer corrupts `//` in URLs when stripping comments
- **isSessionIdle fix**: changed from fail-open to fail-safe — won't inject continuations when session state is unknown
- **persona hash fix**: hash verification now compares only remote persona (was comparing remote + default concat)
- **res.text() timeout**: persona download body read now has real 8-second timeout via Promise.race (was not actually applied)
- **agents-opencode env blocking removed**: deleted sensitive file blocking hook — agents can read .env files when needed
- **openai-system-merge 6x loading fix**: Symbol-based re-patch guard prevents duplicate monkey-patching
- **openai-system-merge URL filter**: only intercepts /chat/completions endpoints, safe for upstream changes
- **local+npm duplicate plugin removed**: setup.bat no longer copies source/plugins/ — npm packages only

### Security & Setup
- **setup.sh glob expansion fix**: `set -f`/`set +f` around for loop prevents glob character injection in API keys
- **setup.bat setx truncation warning**: warns user when API key approaches 1024-char setx limit
- **setup.bat check_chars fix**: removed false `|` block (valid in base64 keys), added `"` detection
- **setup.bat read-only directory fix**: mkdir success verification with error message on failure
- **MCP dependency versions pinned**: all npx -y MCP servers now specify exact versions

### Documentation
- Fixed key safety docs: Windows uses `setx` for persistent env vars, not `.env.local` (was misleading)
- 36 OpenCode AI docs pages saved locally for offline reference
- Remote persona API behavior documented (build-config.mjs + api-reference.md)
- Oscar vs Orchestrator disambiguation notes added
- Turkish comments in opencode-continue plugin translated to English
- Removed "sensitive file blocking" from all README plugin descriptions (env-guard removed)
- Removed "6️⃣ Extra integrations / Ekstra entegrasyon" from all READMEs (custom provider menu removed)
- README.ru.md plugin count corrected from 7 → 6

### Plugin & Version Fixes
- Plugin versions synchronized: source/plugins/ now matches packages/ (1.1.8)
- env-guard plugin removed entirely (per user request)
- deep-research skill rewritten to use built-in tools (no Gemini API key needed)
- OC_GH_FIRST dead code removed from setup scripts
- UPDATE_MANIFEST.json version synced to 1.1.8 (was 1.1.6)
- UPDATE_MANIFEST.json: added blobSha fields to all 286 entries (matching update-checker expectation)
- generate-manifest.mjs: now produces blobSha for future regenerations
- opencode-notify/session-title: session.idle + session.deleted fallbacks for message.finished dependency
- build-config.mjs: removed dead HAS_CUSTOM provider code
- build-config.mjs: custom provider regex instead of fragile string match
- update-checker: ctx.subscribe wrapped in try/catch for upstream API changes
- opencode-notify/session-title/continue: upstream API risk annotations added

### Quality
- 34 source integrity smoke tests added
- Root tsconfig.json for plugin typechecking
- All versions bumped to 1.1.8

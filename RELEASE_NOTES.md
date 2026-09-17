## What's New — v1.1.8 (2026-09-17)

### Comprehensive Code Review & Docs Audit
- Full project scan against official OpenCode AI documentation (36 pages)
- Fixed config inconsistencies: github MCP disabled by default, added model/small_model, lsp permission
- Removed phantom agent references (orchestrator, planner, em-advisor, codebase, blogger)
- Removed deprecated `tools:` blocks from 4 agent frontmatters
- Removed undocumented `argument-hint` from 18 commands
- Removed unrecognized frontmatter fields from 22 skills

### Documentation
- 36 OpenCode AI docs pages saved locally for offline reference
- Remote persona API behavior documented (build-config.mjs + api-reference.md)
- Oscar vs Orchestrator disambiguation notes added
- Turkish comments in opencode-continue plugin translated to English

### Plugin & Version Fixes
- Plugin versions synchronized: source/plugins/ now matches packages/ (1.1.8)
- Plugin count corrected across all READMEs (6 built-in, not 7)
- env-guard plugin removed entirely (per user request)
- deep-research skill rewritten to use built-in tools (no Gemini API key needed)

### Quality
- 34 source integrity smoke tests added
- Root tsconfig.json for plugin typechecking
- All versions bumped to 1.1.8

---

## What's New — v1.1.7 (2026-09-15)

### Security Fixes (P0)
- API keys now stored in .env.local (0600 permissions), never written to shell RC files
- Cross-platform path fix: templates use {{TARGET_DIR}} placeholder instead of hardcoded Windows paths
- Secret detection broadened: catches tokens 20+ chars, not just known prefixes
- Auto-continue `continue_on_error` defaults to false for safety

### OpenAI-Compatible Provider Support
- New `openai-system-merge` plugin: fixes `400 BadRequestError: System message must be at the beginning`
- Automatically merges multiple system messages into one for strict OpenAI-compatible servers
- Works with vLLM, Hetzner, OVHcloud, Scaleway, Nebius, and all strict providers

### Claude Code Compatible Skills (6 new)
- `claude-commit`: Conventional git commit with atomic staging
- `claude-code-review`: Security, performance, correctness review
- `claude-debug`: Systematic hypothesis-driven debugging
- `claude-simplify`: Refactor for clarity and reduced complexity
- `claude-batch`: Process multiple files with same operation
- `claude-loop`: Repeat task with exit conditions

### Other Improvements
- GitHub auth auto-detection: AI uses env token automatically, no more asking
- Sequential-thinking instruction: all models use structured reasoning when needed
- Auto-continue loop fix: switches to thinking mode when loop detected, silent to user
- Update-checker root path fix for correct installed location
- Default persona fallback when remote API unreachable
- Static README badges (no more repo-not-found errors)
- 105 skills, 13 agents, 19 commands, 22 instructions, 6 plugins

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
- 105 skills, 13 agents, 19 commands, 22 instructions, 7 plugins

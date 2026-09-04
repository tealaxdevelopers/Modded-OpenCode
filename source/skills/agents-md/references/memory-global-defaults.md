# Native Memory Defaults By CLI

> Human setup reference. Never loaded during `AGENTS.md` generation — open it
> only when the user asks to enable a CLI's native memory. Re-verify a snippet
> against its linked docs on touch (CONTRIBUTING sync map).

Copy-paste snippets for **user-level** config. Merge into existing files; do not overwrite unrelated keys.

This kit creates no repo `MEMORY.md`, wiki, discovery, or default knowledge-graph memory. Use each CLI's native memory only when it provides one; graph/index companion artifacts are never binding memory. Shared rules live in generated `AGENTS.md`, with `CONTEXT.md` / `specs/adr/` as binding project context when those files exist.

---

## Codex CLI

**File:** `~/.codex/config.toml`  
**Docs:** [Memories](https://developers.openai.com/codex/memories), [Config reference](https://developers.openai.com/codex/config-reference)

```toml
[features]
memories = true

[memories]
use_memories = true
generate_memories = true
disable_on_external_context = true
```

- Native store: `~/.codex/memories/` — user-local recall; never sync it into repo files.
- EEA/UK/CH: native memories may be unavailable.

---

## Claude CLI

**Files:** `~/.claude/settings.json`, optional `~/.claude/CLAUDE.md`  
**Docs:** [Memory](https://code.claude.com/docs/en/memory)

```json
{
  "autoMemoryEnabled": true
}
```

Optional global reminder in `~/.claude/CLAUDE.md`:

```markdown
## Native Memory

- Use Claude's native project memory for user-local recall.
- Do not create or sync repo MEMORY.md files.
- Shared project rules come from AGENTS.md, CONTEXT.md, and ADRs.
```

- `autoMemoryDirectory` is **user/local settings only** (not project `settings.json`).
- Do not symlink Claude memory into a repo file.

---

## GitHub Copilot CLI

**Account:** GitHub → profile → **Copilot settings** → **Copilot Memory** → Enabled (Pro/Pro+ default on; org/enterprise may be off).

**File:** `~/.copilot/copilot-instructions.md`

```markdown
## Memory

- Prefer `/memory on` in CLI sessions (`/memory show` to verify).
- Use Copilot Memory for GitHub-hosted user/repo recall when enabled.
- Do not create or sync repo MEMORY.md files.
- Shared project rules come from AGENTS.md, CONTEXT.md, and ADRs.
```

- No `memory` key in `~/.copilot/settings.json`; enablement is account + `/memory` slash commands.

---

## Cursor CLI

**File:** `~/.cursor/cli-config.json` — no built-in memory toggle ([CLI config](https://cursor.com/docs/cli/reference/configuration)).

- Cursor IDE may offer Settings → Rules → Generate Memories; treat those as IDE-local recall.

---

## Opencode CLI

**File:** `~/.config/opencode/opencode.json`

```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": ["AGENTS.md", "CONTEXT.md"]
}
```

- No native memory store; use `instructions` only to point at generated `AGENTS.md` and binding context files — never repo MEMORY.md paths.

---

## Antigravity CLI

**File:** `~/.gemini/antigravity-cli/settings.json` — no native memory file store.

- Use generated `AGENTS.md` plus binding context files; no repo memory files or third-party memory MCP servers.

---

## Quick reference

Shared project context in every runtime: `AGENTS.md`, `CONTEXT.md`, ADRs.

| Runtime | Native memory handling |
| :--- | :--- |
| Codex CLI | Enable `[features] memories = true`; user-local store |
| Claude CLI | `autoMemoryEnabled: true` when desired; user-local/project-native store |
| GitHub Copilot CLI | GitHub settings + `/memory on` |
| Cursor CLI | No documented native CLI memory toggle; IDE memories are local |
| Opencode CLI | No native memory store; use `instructions` for context files only |
| Antigravity CLI | No native memory file store in supported model |

Tool-calling index: [`tool-calling.md`](tool-calling.md).

> Last verified: 2026-07-06 against installed opencode 1.17.13 — flag/command surface via `--help`; internal tool names, config schemas, and chat slash commands are docs-level and re-verified on touch (see CONTRIBUTING sync map).

| Skill Reference | Opencode Equivalent |
| :--- | :--- |
| `Read` (file reading) | `read` |
| `Write` (file creation) | `write` |
| `Edit` (file editing) | `edit` (also `apply_patch`) |
| `Bash` (run commands) | `bash` |
| `Grep` (search content) | `grep` |
| `Glob` (search by name) | `glob` |
| `Task` tool (dispatch subagent) | `task` (`subagent_type`, optional `background`) + `task_status` |
| Ask the user mid-run | `question` |
| LSP integration (experimental) | `lsp` (gated by `OPENCODE_EXPERIMENTAL_LSP_TOOL=true`) |
| `WebFetch` / `WebSearch` | `webfetch` / `websearch` |
| `TodoWrite` (task tracking) | `todowrite` |
| `Skill` tool (invoke a skill) | `skill` |

**Key Notes:**

- Plain tool names only — no POSIX (`cat` / `tee` / `sed` / `sh`) aliasing. Discovery walks up for `AGENTS.md` (preferred) then `CLAUDE.md` (Claude-Code compat); globals at `~/.config/opencode/AGENTS.md` and `~/.claude/CLAUDE.md`.
- **Memory:** no native memory store; use `opencode.json` `instructions` for generated `AGENTS.md` and binding context files only — no repo memory paths. See [`memory-global-defaults.md`](memory-global-defaults.md).
- `websearch` requires the opencode provider or `OPENCODE_ENABLE_EXA`.
- Skills resolve from `.opencode/skills/`, `~/.config/opencode/skills/`, plus compat dirs `.claude/skills/`, `.agents/skills/`, `~/.claude/skills/`, `~/.agents/skills/`.
- Multi-repo workspace policy: use workspace-root MCP config.
- Highest elevated permission launch: `opencode run --auto "prompt"` (auto-approves permissions not explicitly denied; v1.17 renamed the old `--dangerously-skip-permissions`, now gone from `--help`). For persistent custom agents, set the needed `permission` keys to `allow`; wildcard `{"*":"allow"}` is the full form.
- For exact config-file placement by tool, use [`tool-calling.md`](tool-calling.md).

## Agents: parallel, background & roles

Parallel: the primary agent issues multiple `task` calls in one turn (each runs a child session and returns one `<task_result>`). `task` takes `subagent_type`, `prompt`, optional `task_id` (resume a child), and optional `background`; `task(background=true)` runs async and returns a `task_id`, polled with `task_status` (gated by `OPENCODE_EXPERIMENTAL_BACKGROUND_SUBAGENTS=true`; otherwise `task` is synchronous). opencode is fully local — no cloud agent.

Built-in agents: `build` (primary, full access), `plan` (primary, analysis-only), `general` (subagent, multi-step executor), `explore` (subagent, read-only), `scout` (subagent, read-only — external docs and dependency research); hidden system agents (`compaction`, `title`, `summary`) run automatically. Manual dispatch: mention `@<agent-name>`; `task` permissions (`allow` / `deny` / `ask` per subagent) gate which children a primary may dispatch. Custom agents: `.opencode/agents/<name>.md` (project), `~/.config/opencode/agents/<name>.md` (global), or inline under `"agent"` in `opencode.json`; frontmatter accepts `description`, `mode` (`primary` | `subagent` | `all`), `model`, `permission`, `temperature`, `top_p`, `steps`, `color`, `disable`, `hidden`, and `tools` (per-tool toggles, e.g. `tools: { skill: false }`).

| Role | opencode mechanism |
| :--- | :--- |
| Orchestrator | primary `build` agent |
| Explorer | `task` → `explore` (read-only) |
| Researcher | `task` → `general` + `webfetch` / `websearch` |
| Planner | `plan` primary agent |
| Implementer | `task` → `general` or a write-enabled custom agent |
| Reviewer | custom read-only agent |
| Tester | `task` → `general` (bash) |
| Tool-runner | `task` → `general` (bash); `task(background=true)` for long runs |

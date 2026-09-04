Tool-calling index: [`tool-calling.md`](tool-calling.md).

> Last verified: 2026-07-06 against installed agy (Antigravity) 1.0.16 — flag/command surface via `--help`; internal tool names, config schemas, and chat slash commands are docs-level and re-verified on touch (see CONTRIBUTING sync map).

| Skill Reference | Antigravity CLI Equivalent |
| :--- | :--- |
| `Read` (file reading) | `read_file` |
| `Write` (file creation) | `write_file` |
| `Edit` (file editing) | `replace` |
| `Bash` (run commands) | `run_command` |
| `Grep` (search content) | `grep_search` |
| `Glob` (search by name) | `glob` |
| `TodoWrite` (task tracking) | `write_todos` |
| `Skill` tool (invoke a skill) | auto-activated from `SKILL.md` metadata (no explicit tool; mention skill name to force activation) |
| `WebSearch` | `search_web` |
| `WebFetch` | `read_url_content` |
| `Task` tool (dispatch subagent) | `start_subagent` (proto field `invoke_subagent`); `browser_subagent` for browser tasks |

**Key Notes:**

- `@` references files/context (e.g. `@src/main.go`), not agents.
- Antigravity CLI reads `AGENTS.md` directly from the active workspace; it is the canonical instruction file, and this kit emits no Antigravity-specific shim.
- **Memory:** no native memory file store; use generated `AGENTS.md` and binding context files. No repo memory files or memory MCP servers for this kit. See [`memory-global-defaults.md`](memory-global-defaults.md).
- Multi-repo workspace policy: use workspace-root MCP config.
- For exact config-file placement by tool, use [`tool-calling.md`](tool-calling.md).

## Agents: parallel, background & roles

Parallelism is built into the **Agent Manager**: `start_subagent` spawns dynamic, dependency-aware subagents whose workspace mode is `inherit` (parent's workspace), `branch` (isolated Git worktree, auto-cleaned on kill), or `share` (shared directory storage) (clean context window, same model; concurrency limit not publicly documented). Local background: `/schedule` runs cron-style tasks that survive app close; Artifacts (plans, diffs, walkthroughs) are written to a folder for review on return. **Managed Agents API / remote managed execution** is cloud — do not use it.

| Role | Antigravity mechanism |
| :--- | :--- |
| Orchestrator | lead agent / Agent Manager (owns merge + final judgment) |
| Explorer | `start_subagent` with a read-only subagent definition |
| Researcher | `start_subagent` + `search_web` / `read_url_content` |
| Planner | planning mode (task groups, Artifacts) |
| Implementer | `start_subagent` with a write-enabled subagent definition |
| Reviewer | `start_subagent` with a read-only reviewer subagent definition |
| Tester | `start_subagent` running tests / build |
| Tool-runner | `start_subagent` scoped to shell; `browser_subagent` for browser sequences |

MCP: project `.agents/mcp_config.json`; remote HTTP entries use `serverUrl`. Skills: project `.agents/skills/<name>/SKILL.md`; user-global `~/.gemini/antigravity/skills/<name>/` (also `.agent/skills/` accepted as a back-compat path).

## Permissions, hooks, slash commands

- **Permission resources** (config + `/permissions`): `read_file`, `write_file`, plus MCP-tool filtering. Rules use `action(target)` form with Allow / Deny / Ask lists.
- **Permission modes**: `request-review` (default), `proceed-in-sandbox`, `always-proceed`, `strict`.
- **Highest elevated permission launch**: `agy --dangerously-skip-permissions`. Do not combine it with `--sandbox` when the goal is full elevation; `--sandbox` enables terminal restrictions.
- **Hooks**: `PreToolUse` / `PostToolUse` with regex `matcher` on tool name; JSON schema includes `toolCall.name`, `toolCall.args`, `stepIdx`, plus common fields (`conversationId`, `workspacePaths`, `transcriptPath`, `artifactDirectoryPath`). Hook decision values: `allow`, `deny`, `ask`.
- **Useful slash commands**: `/goal`, `/grill-me`, `/schedule`, `/browser`, `/artifact`, `/permissions`, `/context`, `/btw`, `/model`, `/config`.
- **Non-interactive**: `agy -p "<prompt>"` for pipelines.

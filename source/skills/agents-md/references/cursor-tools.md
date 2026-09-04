# Cursor CLI Tool Mapping

> Last verified: 2026-07-06 against installed cursor-agent 2026.07.01-41b2de7 — flag/command surface via `--help`; internal tool names, config schemas, and chat slash commands are docs-level and re-verified on touch (see CONTRIBUTING sync map).

Mechanics and permissions: [`tool-calling.md`](tool-calling.md).

| Skill Reference | Cursor CLI Equivalent |
| :--- | :--- |
| `Read` (file reading) | `Read` |
| `Write` (file creation) | `Write` |
| `Edit` (file editing) | `StrReplace` |
| `Bash` (run commands) | `Shell` |
| `Grep` (search content) | `Grep` |
| `Glob` (search by name) | `Glob` |
| `Delete` (remove file) | `Delete` |
| Semantic / codebase search | `SemanticSearch` (indexed workspace; agent may chain with `Grep`) |
| `TodoWrite` (task tracking) | `TodoWrite` |
| Skill invocation | `/skill-name` in chat (auto-discovery via skill `description`; set `disable-model-invocation: true` for slash-only) |
| `Task` tool (dispatch subagent) | `Task` invoking built-in (`explore`, `bash`, `browser`) or custom `.cursor/agents/<name>.md` |
| Custom subagents | `.cursor/agents/<name>.md` or `~/.cursor/agents/<name>.md`; also `/name` in chat |
| `WebSearch` | `WebSearch` |
| `WebFetch` | `WebFetch` |
| `GenerateImage` | `GenerateImage` |
| MCP tools | Configured MCP servers; hook matcher `MCP:<tool>`; CLI permission pattern `Mcp(server:tool)` |
| Background shell polling | `Await` (after `Shell` with background execution) |
| Mode switch (plan vs agent) | `SwitchMode` or CLI `--mode=plan` / `--mode=ask` |

**Key Notes:**

- Cursor CLI command is `agent` (interactive: `agent`, non-interactive: `agent -p "..."`).
- `AGENTS.md` is the canonical workspace instruction file; no extra shim is required for Cursor.
- **Memory:** no documented memory flag in `~/.cursor/cli-config.json`; IDE “Generate Memories” (Settings → Rules) is IDE-local recall. No repo memory files or memory MCP servers for this kit. See [`memory-global-defaults.md`](memory-global-defaults.md).
- Cursor MCP config files: `<workspace-root>/.cursor/mcp.json` (recommended for multi-repo workspaces), `~/.cursor/mcp.json` (global fallback).
- Skills load from `.cursor/skills/`, `.agents/skills/`, `~/.cursor/skills/`, `~/.agents/skills/`, plus compat dirs `.claude/skills/`, `.codex/skills/`, `~/.claude/skills/`, `~/.codex/skills/`.
- Subagent dirs: `.cursor/agents/`, `.claude/agents/`, `.codex/agents/` (project) and `~/.cursor/agents/`, `~/.claude/agents/`, `~/.codex/agents/` (user).
- CLI permissions: per-project `<root>/.cursor/cli.json` (layered git-root → cwd), global `~/.cursor/cli-config.json`. IDE-only auto-run allowlist (separate): `~/.cursor/permissions.json`.
- Highest elevated permission launch: `agent --yolo --sandbox=disabled --approve-mcps` for interactive sessions; `cursor-agent -p --force --sandbox=disabled --trust --approve-mcps "prompt"` for headless. `--yolo` is the `--force` alias.
- Built-in subagents **Explore**, **Bash**, and **Browser** are delegated automatically ([Subagents](https://cursor.com/docs/subagents)).

## Agents: parallel, background & roles

Parallel: multiple `Task` calls in one turn (practical cap ~4). Local background: `is_background: true` in `.cursor/agents/<name>.md`, rejoin with `Await`; heavier isolation: up to 8 local agents in separate git worktrees. **Cloud Agents** (formerly "Background Agents") are remote — do not use them; keep everything local. Custom-agent frontmatter: `name`, `description`, `model` (`inherit` or an ID), `readonly`, `is_background`.

| Role | Cursor mechanism |
| :--- | :--- |
| Orchestrator | main `agent` session (owns merge + final judgment) |
| Explorer | `Task` → `explore` subagent |
| Researcher | `Task` → custom agent + `WebSearch` / `WebFetch` |
| Planner | Plan mode (`--mode=plan` / `SwitchMode`) or a `readonly: true` custom agent |
| Implementer | `Task` → write-enabled `.cursor/agents/<name>.md` |
| Reviewer | `readonly: true` custom agent (e.g. `.cursor/agents/reviewer.md`) |
| Tester | `Task` → `bash` subagent |
| Tool-runner | `Task` → `bash` subagent; `Shell` + `Await` for background output |

The shell subagent type is `bash` (not `shell`).

## Hook / trace tool names

Hook matchers (`preToolUse`, `postToolUse`) and agent traces use the tool names from the mapping table above, plus: `ListMcpResources` / `FetchMcpResource` (MCP resource read), `EditNotebook` (Jupyter cells), and `TabRead` / `TabWrite` (editor tab read/write, hook matchers only). MCP tools match via `MCP:<tool>`; the CLI permission pattern is `Mcp(server:tool)`.

## Modes and headless use

| Mode | CLI flag / command | Tool writes |
| :--- | :--- | :--- |
| Agent | default | Full tools |
| Plan | `--mode=plan`, `/plan` | Read-only / planning |
| Ask | `--mode=ask`, `/ask` | Read-only Q&A |

Non-interactive: `agent -p "prompt"` (`--print`) runs with full tools unless
the mode restricts edits. Headless output: `--output-format text|json|stream-json`
(add `--stream-partial-output` for incremental deltas). Auth via
`CURSOR_API_KEY`. Useful flags: `--worktree`, `--workspace <path>`,
`--resume [thread-id]`; manage sessions with `agent ls` / `agent resume`.

## Permission patterns

- `Shell(git)` — prefix match: any `git` subcommand. `Shell(**)` — all shell commands.
- `Mcp(server:tool)` — colon-separated (e.g. `Mcp(datadog:*)`, `Mcp(*:read_*)`).
- `Read(src/**/*.ts)`, `Write(<glob>)`, `WebFetch(*.example.com)` — file / web allowlists.
- Deny rules take precedence over allow rules.

Docs: [Tool calling](https://cursor.com/learn/tool-calling) · [Agent tools](https://cursor.com/docs/agent/overview) · [CLI usage](https://cursor.com/docs/cli/using) · [Subagents](https://cursor.com/docs/subagents).

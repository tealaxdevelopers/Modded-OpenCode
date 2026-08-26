# Tool Calling Reference

How the six supported runtimes — Codex CLI, Claude CLI, Antigravity CLI, Cursor CLI, Opencode CLI, and GitHub Copilot CLI, no others — invoke tools, and how this kit maps generic skill instructions to each. Compatibility filenames do not imply support for any other runtime.

> Last verified: 2026-07-06 against all six installed CLIs (codex-cli 0.142.5, claude 2.1.201, agy 1.0.16, cursor-agent 2026.07.01, opencode 1.17.13, copilot 1.0.68) — flag/command surface via `--help`; internals are docs-level and re-verified on touch.

## Agent Orchestration Model

The model itself is the `AGENTS.md` Non-negotiable rule **Local orchestration** (main session orchestrates role-typed local lanes and keeps the only seat for merge and final judgment); this file maps it to each runtime's concrete mechanisms. A runtime with no subagents uses a focused in-process tool pass per lane.

### Local-only policy (no cloud agents)

Use only **local** subagents and **local** background/async execution; local worktree-isolated parallel agents are allowed. Never delegate to cloud or remote background-agent products:

| Runtime | Cloud/remote product to AVOID | Local equivalent to use instead |
| :--- | :--- | :--- |
| Codex CLI | Codex Web delegated tasks | `spawn_agent` subagents (no CLI worktree support — use plain `git worktree add`) |
| Claude CLI | Routines (`/schedule`), agent teams (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`), background agents on claude.ai | `Agent` subagents; `run_in_background` Bash; `isolation: worktree` |
| Antigravity CLI | Managed Agents API / remote managed execution | `start_subagent` local instances; `/schedule` local background |
| Cursor CLI | Cloud Agents (formerly "Background Agents"), `&`-prefixed cloud hand-off, cursor.com/agents | `Task` subagents; local worktree agents |
| Opencode CLI | (no cloud agent in scope) | `task` subagents; `task(background=true)` |
| GitHub Copilot CLI | Cloud coding agent via `/delegate` (runs in GitHub Actions, opens PRs) | `task` + `/fleet` subagents; `Ctrl+X → b` background |

### Canonical role lanes

Standard lane roles across this kit; each runtime's `*-tools.md` maps them to that runtime's concrete mechanism. No dedicated built-in for a role → use the general-purpose subagent with the listed tool profile.

| Role | Tool profile | Purpose |
| :--- | :--- | :--- |
| **Orchestrator** | full (main session) | Decompose, dispatch, await, merge, final judgment. Never spawned. |
| **Explorer** | read-only | Search and map the codebase; trace callers and usage sites. |
| **Researcher** | read-only + web | External docs, web search, dependency source. |
| **Planner** | read-only | Produce a dependency-aware plan or design. |
| **Implementer** | write | Make the edits for one independent slice. |
| **Reviewer** | read-only | Critique a diff for correctness, risk, and convention fit. |
| **Tester** | shell | Run tests / build / lint / typecheck; report evidence. |
| **Tool-runner** | shell + MCP | Isolated shell / MCP / tool-call batches; keep noisy output out of main context. |

### Parallel & background mechanism by runtime

| Runtime | Parallel dispatch | Local background / async | Custom agent files |
| :--- | :--- | :--- | :--- |
| Codex CLI | `spawn_agent` / `spawn_agents_on_csv` (`agents.max_threads`, default 6; `max_depth` 1) — on by default | `wait_agent` / async subagent threads | `.codex/agents/<name>.toml` (or `~/.codex/agents/<name>.toml`) |
| Claude CLI | Multiple `Agent` calls in one turn | `run_in_background` Bash; `background: true` subagents; `isolation: worktree` | `.claude/agents/<name>.md` |
| Antigravity CLI | `start_subagent` orchestrator-spawned dynamic subagents (Agent Manager); `browser_subagent` for browser tasks | `/schedule` local background; Artifacts for review | `.agents/agents.md` |
| Cursor CLI | Multiple `Task` calls in one turn (practical cap ~4); local worktree agents (up to 8) | `is_background: true` subagent + `Await`; `bash` subagent isolates output | `.cursor/agents/<name>.md` |
| Opencode CLI | Multiple `task` calls with `subagent_type` | `task(background=true)` + `task_status` | `.opencode/agents/<name>.md`, `~/.config/opencode/agents/<name>.md`, or inline `opencode.json` agents |
| GitHub Copilot CLI | `task` tool + `/fleet` (orchestrated parallel subagents; built-ins `explore` / `task` / `general-purpose` / `code-review` / `research` / `rubber-duck`) | `Ctrl+X → b` promotes a task or shell to background | `.github/agents/<name>.md` or `.agent.md` (user-scope `~/.copilot/agents/`) |

### Git worktree isolation by runtime

Verified against the installed CLI surface (`--help`, feature flags, shipped bundle) for Codex, Cursor, Copilot, and Opencode; against official docs for Antigravity. Plain `git worktree add` is the portable fallback everywhere — reach for a native surface only when it buys session-switching or setup scripts.

| Runtime | Native surface | Location | Base ref |
| :--- | :--- | :--- | :--- |
| Claude CLI | `EnterWorktree` / `ExitWorktree` (switches session cwd; fires only when the user or `CLAUDE.md` says "worktree"); `isolation: worktree` on subagents | `.claude/worktrees/<name>` | `worktree.baseRef` — `fresh` (default) = `origin/<default-branch>`, `head` = local HEAD |
| Cursor CLI | `-w, --worktree [name]`, `--worktree-base <branch>`, `--skip-worktree-setup`; setup scripts from `.cursor/worktrees.json` | `~/.cursor/worktrees/<reponame>/<name>` | current HEAD |
| GitHub Copilot CLI | `-w, --worktree [name]` (hidden from `--help`) and `/worktree`; needs `/experimental on` or `--experimental`. Can move uncommitted changes in. Conflicts with `--resume` / `--continue` / `--cloud` | `<repo>/.worktrees/` — already the path the generated Rule 10 mandates | HEAD, or the default branch when the `WORKTREE_DEFAULT_BRANCH` flag is on; `worktreeBaseRef` config overrides |
| Antigravity CLI | `start_subagent` (proto field `invoke_subagent`) with workspace mode `branch` (vs `inherit`, `share`); worktrees auto-cleaned when the subagent is killed | not documented | not documented |
| Opencode CLI | TUI-only: "Create new worktree" in the new-session picker, plus a per-project worktree startup script. No CLI flag. The new tab layout does not support worktrees yet | not documented | not documented |
| Codex CLI | **None.** No flag, subcommand, or feature flag — worktrees are a Codex *app* feature, not a CLI one | — | — |

### Highest elevated permission by runtime

Use these only when the user explicitly asks for highest/elevated/full/YOLO permission, and prefer isolated containers, VMs, dev containers, or disposable worktrees.

| Runtime | Highest elevated launch / preset | Effect |
| :--- | :--- | :--- |
| Codex CLI | `codex --dangerously-bypass-approvals-and-sandbox` (or explicit `codex --sandbox danger-full-access --ask-for-approval never`) | No sandbox and no approval prompts. |
| Claude CLI | `claude --dangerously-skip-permissions` (equivalent to `--permission-mode bypassPermissions`) | Skips the permission layer; protected paths are allowed except hard circuit breakers. |
| Antigravity CLI | `agy --dangerously-skip-permissions`; do not pair with `--sandbox` for full elevation | Auto-approves tool permission requests without terminal sandbox restrictions. |
| Cursor CLI | `agent --yolo --sandbox=disabled --approve-mcps` (`--yolo` is `--force`) | Force-allows commands unless explicitly denied, disables sandboxing, and approves MCP servers. |
| Opencode CLI | `opencode run --auto` (v1.17 renamed the old `--dangerously-skip-permissions`); for agent config set needed permission keys to `allow` / wildcard `{"*":"allow"}` | Auto-approves non-denied permissions; per-agent `allow` grants tools without prompts. |
| GitHub Copilot CLI | `copilot --allow-all` (alias `--yolo`) | Allows all available tools, all paths, and all URLs without approval. |

## All runtimes (index)

| Runtime | Tool mapping | Skill invocation |
| :--- | :--- | :--- |
| Codex CLI | [`codex-tools.md`](codex-tools.md) | `$skill-name` inline mention, or the `/skills` command |
| Claude CLI | [`claude-tools.md`](claude-tools.md) | `/skill-name`, or auto on `description` match |
| Antigravity CLI | [`antigravity-tools.md`](antigravity-tools.md) | auto from `description`; name the skill to force activation |
| Cursor CLI | [`cursor-tools.md`](cursor-tools.md) | `/skill-name`, or auto on `description` match |
| Opencode CLI | [`opencode-tools.md`](opencode-tools.md) | auto via the `skill` tool on `description` match |
| GitHub Copilot CLI | [`copilot-tools.md`](copilot-tools.md) | `/skill-name` |

### Context files (multi-repo workspaces)

| Artifact | Location | Steward |
| :--- | :--- | :--- |
| `CONTEXT.md` | `<artifacts-root>` | `grill-with-docs` |
| `specs/adr/` | `<artifacts-root>/specs/adr/` | `grill-with-docs` |

Native CLI memory defaults: [`memory-global-defaults.md`](memory-global-defaults.md).

### MCP placement (multi-repo workspaces)

Keep MCP configuration at workspace root for supported coding tools:

- Codex CLI: `<workspace-root>/.codex/config.toml`
- Claude CLI: `<workspace-root>/.claude/settings.local.json`
- Antigravity CLI: `<workspace-root>/.agents/mcp_config.json`
- Cursor CLI: `<workspace-root>/.cursor/mcp.json` (plus optional `~/.cursor/mcp.json` fallback)
- Opencode CLI: workspace-root `opencode.json` / MCP config where used
- GitHub Copilot CLI: `<workspace-root>/.mcp.json` or `<workspace-root>/.github/mcp.json` (user fallback: `~/.copilot/mcp-config.json`)

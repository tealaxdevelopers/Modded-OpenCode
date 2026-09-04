---
name: agents-md
disable-model-invocation: true
description: "Generate or refresh the workspace-root AGENTS.md and its CLAUDE.md redirect shim for a VS Code .code-workspace root. Any request to write, create, or generate an AGENTS.md file routes here — /writing-for-agents is style guidance for authoring agent-facing documents, not the generator. It creates the Project Matrix of PROJECT-CODEs and the workspace's non-negotiable rules. Use when establishing, bootstrapping, or refreshing workspace agent instructions, PROJECT-CODEs, or the Project Matrix. Use only when a .code-workspace file exists; stop otherwise. It does not build the UI design system or its binding AGENTS.md rule — that is /design-system."
---

# AGENTS.md generator

Turns one `.code-workspace` file plus a small scan of its folders — nothing else — into the workspace-root `AGENTS.md` and its `CLAUDE.md` redirect shim.

## Inputs

- The target root must contain a `*.code-workspace` file (multi- or single-folder). If none exists, stop and do not generate files — the Project Matrix is built from its `folders` list; tell the user to rerun from a folder holding one.
- Never read or copy the agent's own global or user instruction files (`~/.claude/CLAUDE.md`, `~/.codex/`, global `AGENTS.md`, personal memory/rules) — no personal rule (co-author, memory, context, issue-routing) may appear in the generated files.

## Rules

- `AGENTS.md` is the single source of truth for Codex CLI, Claude CLI, Antigravity CLI, Cursor CLI, Opencode CLI, and GitHub Copilot CLI; all operating instructions — context, memory policy, issue routing, skill use — live there.
- `CLAUDE.md` is only a redirect shim for Claude CLI: emit [`assets/claude-md-template.md`](assets/claude-md-template.md) byte-for-byte, nothing more, and never read other context from it.
- Generate exactly one of each, at the workspace root — never per-project or per-repo `AGENTS.md`. The generated `AGENTS.md` is spartan and direct.

## Workspace scan

Small-scan every workspace folder before generating: note any `VISION.md`/`vision.md` at the workspace or a project root (feeds North star) and detect each stack. Multiple stacks → the intro slot says so and warns against mixing conventions or code across projects.

### Stack detection

The `Stack` cell is fact read from the app-root manifest and lockfiles — never guessed from a folder's name, a root-level manifest, or a file's mere existence. Find the real app root first — often nested (`application/`, `app/`, `src/`) — and read the manifest there. Per-ecosystem manifest reads (PHP, frontend build, JS/TS, Python, test runners, non-app folders): [`references/stack-detection.md`](references/stack-detection.md).

## Project Matrix format

One row per `.code-workspace` folder, in `folders` order — never invent or drop projects. Columns exactly `| Project | Path | Stack |`:

- `Project`: the PROJECT-CODE from the folder `name` — strip emojis, uppercase, collapse punctuation/space runs to single hyphens, trim leading/trailing hyphens (`Payments API` → `PAYMENTS-API`); path basename when `name` is missing; type prefix for non-app folders (`PACKAGE-QUEUE`, `DB`). Name the full PROJECT-CODE from the Project Matrix everywhere; never mix one project's conventions, tokens, or components into another.
- `Path`: the folder `path` relative to the workspace root; `.` marks the meta/workspace row.
- `Stack`: one terse line — language, every primary framework, build tooling, package manager; versions only when a manifest pins them; non-app folders state the role. No prose in cells.

Sample:

```markdown
| PAYMENTS-API | ../payments-api  | PHP 8.3 / Laravel 13 / Vite / Composer + npm (application/) |
| DB           | ../db-migrations | MySQL / raw SQL migrations |
```

## Emitted skeleton

Emit [`assets/agents-md-template.md`](assets/agents-md-template.md) byte-for-byte, filling only the bracketed slots (intro line, Project Matrix, skills tables + startup note, `### Runtime tool-calling` tables, and the `### North star` list when emitted). Three rules bind the verbatim parts:

- Emit `### Matt skill routing` only when Matt Pocock's skills are installed (`/ask-matt`, `/grill-with-docs`, or `/to-spec` resolves); otherwise delete the subsection — dead routing rules cost every session tokens.
- Emit `### North star` only when the scan found a vision file, listing each with its scope; never fabricate one or restate its content — the subsection points at the file. None found → delete it.
- Keep `Issue titles` exactly as concise as the skeleton has it — routing/label procedure lives in the issue skills, never here — and leave the two Context & native memory placeholders unfilled.

## Working with skills

Generate the gradient and companion tables from `references/skills-manifest.md` — the single source; adding or moving a skill edits the manifest, never this file. Column semantics live in its header; `kit` and `external` skills render alike.

Fill the `[RUNTIME TOOL-CALLING …]` slot from `references/tool-calling.md`, opening a per-runtime `*-tools.md` only when a cell is missing or unclear. Emit three compact tables — skill invocation, parallel/background mechanism (drop the `Custom agent files` column), and highest elevated launch preset per runtime — inlined; never link the reference files (they do not ship) or restate the Local orchestration rule. The elevated table must say those presets are used only when the user explicitly asks for highest/elevated/full/YOLO permission and prefers an isolated container, VM, dev container, or disposable worktree.

## Versioning and regeneration

The skill version is `v17`. Both generated files carry the marker `<!-- agents-md marker · v17 · re-run /agents-md to regenerate -->` as their first line (the first line of each template asset in `assets/`). Bump it here and in both template assets together whenever these rules change. Pre-`v6` files open with the older `Generated by the agents-md skill` comment — still a valid marker, not hand-authored.

On run, check for an existing workspace-root `AGENTS.md`:

- **None** — generate fresh.
- **Marker present** — before overwriting, show a short diff (changed lines only) and confirm. If the user does not respond, stop without writing and say so.
- **No marker (hand-authored)** — do not rewrite it; show what generation would add or change, merge only user-approved sections, and let the existing file win everywhere else.
- **Preserve user edits** — carry over every user-filled placeholder value (especially the `CONTEXT.md` and `specs/adr` paths) and per-project on-demand reads.
- **Preserve foreign sections** — carry over verbatim any section another skill added (e.g. `## Design System / UI Library` from /design-system); regeneration replaces only sections this skill generates.
- Regenerate the `CLAUDE.md` shim only if it is missing or its marker is stale.

### Migrate docs/ → specs/ (ask first)

Pre-v7 workspaces kept the artifacts tree under `docs/` instead of `specs/`. When any artifact subfolder (`agents/`, `adr/`, `prompts/`, `qa/`, `port/`, `pixel-audit/`, `integration/`, `design-system/`, `release-notes/`) still sits under `docs/` — strays included — show what would move and ask first; declined or no response → keep the `docs/` paths, never rename unattended. On approval, `git mv` per subfolder (plain `mv` when untracked), merging file by file into any existing `specs/<sub>/` — never `git mv docs specs` wholesale. Rewrite `docs/<sub>/` links to `specs/<sub>/` in the moved files and any file linking them, update filled placeholder paths, and report every move. Non-artifact `docs/` content (the GitHub Pages site) stays.

## Output

Chat carries the pre-write diff, the migration move list and report, and the close: suggest `/setup-matt-pocock-skills`, and `/design-system` for each UI project, then stop — suggest only, never run them.

## Completion criteria

- [ ] `AGENTS.md` sections appear in template order; `### Matt skill routing` present only when Matt's skills resolve, `### North star` only when a vision file was found
- [ ] Regeneration: foreign sections and user-filled values survive in the shown diff — or the run stopped without writing

- [ ] Project Matrix row count equals the `folders` count; every Stack cell traces to a manifest actually read
- [ ] Both generated files open with the current version marker; Context & native memory placeholders intact or carried over filled
- [ ] `diff` of `CLAUDE.md` against the shim template is empty
- [ ] Post-migration: `docs/` holds only the GitHub Pages site; no moved artifact still links a `docs/` path
- [ ] Neither file leaks session data: dates, conversation references, machine-local absolute paths

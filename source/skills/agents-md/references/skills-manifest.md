# Skills Manifest

Single source for the `## Working with skills` tables generated into `AGENTS.md`.
Do not hardcode skill rows in `SKILL.md` — edit this file to add or move a skill.

Columns:

- `skill` — invocation (e.g. `/tdd`) or companion name.
- `kind` — `kit` (lives in this repo's `skills/`), `external` (on the gradient but a
  separate install — e.g. Matt Pocock's skills), or `companion` (optional separate
  install, off the gradient).
- `phase` — for `kit`/`external`: a gradient phase (`discover`, `sharpen`, `plan`,
  `slice`, `implement`, `verify`, `ship`) or `startup`. Blank for companions.
- `note` — optional short suffix shown after the skill in the gradient cell (e.g. `→ ADR`). A note beginning `deprecated` excludes the row from generated tables.
- `use-when` — for `companion`: the trigger text. Blank for kit/external skills.

Every folder under this repo's `skills/` must have a `kit` row here
(`tools/validate.sh` enforces this).

## Gradient Skills (kit + external)

| skill | kind | phase | note | use-when |
| ----- | ---- | ----- | ---- | -------- |
| `/agents-md` | kit | startup | once per workspace; re-run to refresh the Project Matrix | |
| `/design-system` | kit | startup | once per UI project; re-run `extend` as the design grows | |
| `/writing-kit-skills` | kit | startup | kit-internal — house style for authoring this repo's skills; not workspace routing | |
| `/feature-discovery` | kit | discover | | |
| `/port-feature` | kit | discover | reference → target gap map | |
| `/research` | external | discover | delegable primary-source reading → cited doc | |
| `/feature-prompt` | kit | sharpen | → prompt file | |
| `/grill-with-docs` | external | plan | numbered frontier rounds → ADR | |
| `/to-spec` | external | plan | → spec (PRD) | |
| `/wayfinder` | external | plan | fog, not size — decisions gate the scope; map them as tracker tickets, resolve one per session, exit to /to-spec | |
| `/prototype` | external | plan | spike ungrillable "needs to feel/see it" questions, then back to /grill-with-docs | |
| `/handoff` | external | plan | fork context to a new session (pairs with /prototype) | |
| `/to-tickets` | external | slice | | |
| `/triage` | external | slice | existing/raw issues only — state repair, needs-info, wontfix, agent briefs | |
| `/implement` | external | implement | optional ticket driver — calls /tdd-loop at each seam; stops after /code-review, never commits (Rule 13) | |
| `/tdd` | external | implement | reference only — test quality and seam choice; never use it alone as a loop | |
| `/tdd-loop` | kit | implement | the test-first procedure — gates, completion evidence, exception protocol; stands alone | |
| `/orchestrate-herdr` | kit | implement | inside herdr only — fan a spec (PRD) out to worker tabs | |
| `/code-review` | external | verify | | |
| `/diagnosing-bugs` | external | verify | | |
| `/polish-batch` | kit | verify | cosmetic punch-list | |
| `/pixel-audit` | kit | verify | per-page visual conformance | |
| `/integration-contract` | kit | verify | multi-project seams — build after /to-tickets, gate before the spec ships | |
| `/commit-push-close` | kit | ship | | |
| `/commit-push-pr` | kit | ship | | |
| `/pr-feedback` | kit | ship | address reviewer comments on an open PR — classify, fix, reply with SHAs | |
| `/staging-fix` | kit | ship | staging bug → local fix with test → PR to `staging` with auto-merge; servers never touched | |
| `/release-notes` | kit | ship | | |

## Companion Skills And MCPs

| skill | kind | phase | note | use-when |
| ----- | ---- | ----- | ---- | -------- |
| ask-matt | companion | | | You want Matt's upstream router for choosing a user-invoked skill flow. |
| wait-what | companion | | | The agent's last chat message did not land — re-pitch it with brief context, ASD-STE100 Simplified Technical English, and the ubiquitous language from `CONTEXT.md`. |
| unslop | companion | | | Free-prose output needs AI tells removed — chat narration, and PR/issue/doc prose the agent composes freely. Never applies to text a skill mandates verbatim: generated `AGENTS.md`/shims, output templates, section names, field labels, canonical lines. |
| blast-radius | companion | | | A change's blast radius needs proving — what it could break beyond the diff, with the one safety fact run against real code rather than a writeup. User-invoked (`/blast-radius`); do not auto-fire. |
| show-me-your-work | companion | | | Long-running or unattended work needs a reviewable decision trail — a TSV log of what, why, evidence, and result that a human can audit after stepping away. User-invoked (`/show-me-your-work`); do not auto-fire. |
| wizard | companion | | | A procedure hits steps only a human can perform (credentials, CI secrets, third-party dashboards, one-off migrations/cutovers) — generate an interactive bash walkthrough for them; never for steps the agent can do itself. |
| to-questionnaire | companion | | | A decision needs knowledge the user lacks — turn it into a Markdown questionnaire the one person who can answer fills in async or in a meeting. |
| domain-modeling | companion | | | Project terminology, aliases, or ADR-backed domain language need sharpening. |
| codebase-design | companion | | | Module boundaries, seams, or interface design decisions matter. |
| Graphify | companion | | | Querying a generated code/docs/media graph would save broad file reads. Check `graphify-out/graph.json` at the project root, else the workspace root; absent in both → skip it. Graph older than ~7 days → recommend `graphify update .`. |
| Codex plugin for Claude Code | companion | | | Claude Code needs Codex for review or delegated work. |
| Impeccable | companion | | | Frontend design quality, visual polish, or browser-backed UI checks matter. |
| notebooklm-py | companion | | | The user asks to work with NotebookLM sources or artifacts. |
| agent-browser | companion | | | Browser automation, app QA, screenshots, scraping, or Electron app control is needed. |
| herdr | companion | | | Running inside herdr and managing panes, tabs, or worker agents is needed. |
| docker-expert | companion | | | Dockerfiles, Compose, images, containers, or registry workflows are central. |
| Laravel Boost | companion | | | A Laravel project has Boost installed and Laravel-specific MCP context helps. |
| Figma MCP | companion | | | A task references Figma designs, components, frames, tokens, or design-to-code. |
| MySQL/Postgres MCP | companion | | | Approved local or staging database inspection is needed. Default read-only. |
| Linear MCP | companion | | | Finding, creating, updating, or closing tracker issues (specs, tickets, bugs). |
| Sentry CLI | companion | | | A production error report needs `/sentry` investigation before `/diagnosing-bugs`. |

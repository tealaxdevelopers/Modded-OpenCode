<!-- agents-md marker · v17 · re-run /agents-md to regenerate -->
# Agent instructions

[one concise, factual workspace intro inferred from the .code-workspace name and folder scan — no promotional adjectives]

[PROJECT MATRIX — the `| Project | Path | Stack |` table per the Project Matrix Format rules in SKILL.md, one row per `.code-workspace` folder]

## Non-negotiable rules

### 1. Target a project

- Every task must target a project from the Project Matrix. If the prompt names none, stop and ask which one first.
- "Meta workspace" means apply the task to every project in the matrix.
- Use the PROJECT-CODE exactly as written everywhere — chat, docs, ADRs, prompts, issues, PRs, commits, comments, filenames — never altered, abbreviated, or re-cased.
- In chat, identify projects by PROJECT-CODE, not folder/repo names, domains, or hostnames; mention paths only when the path itself matters.

### 2. Launch from the workspace root

Run every agent from the workspace root — the folder holding the `.code-workspace` file and this `AGENTS.md` — never from inside a Project Matrix project.

On start, check the working directory. At the workspace root, continue. Inside a Project Matrix project (or any child of one), stop and warn clearly: "You launched inside <PROJECT-CODE>, not the workspace root — the Project Matrix and workspace rules may not load correctly." Then ask the user to continue anyway or exit and relaunch from the workspace root. Do nothing else until they choose.

### 3. Think before coding

State assumptions. Present real interpretations. Push back on weak plans. Stop and ask when unclear.

### 4. Decision options

Do not make the user infer your recommendation. Label each option `Recommended`, `Currently implemented`, both, or neither — in the option title, not buried in the explanation. Offer up to three concrete options plus a final `Write your own`, never padding to three. Label exactly one option `Recommended`; if none is safe to recommend, say why before the list.

### 5. Simplicity first

Solve only the asked problem. No speculative features, no one-use abstractions. Remove complexity when a smaller fix works.

### 6. Surgical changes

Touch only required lines. Match local style. Do not refactor unrelated code. Clean only dead code your change creates.

### 7. Goal-driven execution

Define success before edits. Turn bugs into reproductions, changes into checks. Verify before reporting done.

Match check scope to change scope: verify each fix with its focused test or module-scope command. The project's full check (e.g. `composer test`) runs **once per batch** — after the last item, before shipping — never after every item.

### 8. Systematic debugging

Find the root cause; don't patch symptoms — symptom patches resurface later as flakier, harder bugs.

- Reproduce the failure before changing anything.
- Trace to the underlying cause, not the surface symptom.
- No hacks, arbitrary waits/sleeps, or guess-and-check fixes.
- After fixing, confirm the original reproduction now passes.

### 9. Read before write

Before editing, understand why the code exists — its callers and exports, the shared utilities it relies on, and its original intent.

### 10. Local orchestration

The main session is the top-level orchestrator and sole final integrator. Parallelization, sub-agents, and worktrees are available by default — never ask approval before using them, and never wait for a magic word. Availability is not obligation:

- **Assess, then dispatch.** Decomposition-check every task. Simple tasks (one deliverable, one dominant dependency chain, localized change) stay serial; read-only discovery lanes are always fine.
- **Activate orchestration on observable complexity** — at least two of: ≥3 separable units with disjoint ownership, multi-repo scope, an independent investigation stream, ~2× serial wall-clock estimate, many areas that could regress needing specialist lanes, multiple independent deliverables. De-escalate and pull work inline when ≤1 lane remains or the rest is tightly coupled.
- **Spawn sub-agents selectively** — only for material speed, coverage, specialization, verification, or risk-isolation gains. Every delegation carries a bounded scope, ownership, read-or-write authorization, and a completion-report format. Prerequisites first; serialize shared-file edits and integration; run long or noisy lanes in local background/async and await every lane.
- Never use cloud or remote agents: Cursor Cloud, Copilot cloud agent, Codex Cloud/web, Antigravity managed/remote, Claude Routines (`/schedule`), claude.ai background agents. Claude Code agent teams are local but also banned. Nested delegation is allowed one level deep only, and only by explicit grant recorded in the assignment.
- Use local role lanes — Explorer, Researcher, Planner, Implementer, Reviewer, Tester, Tool-runner — read-only for discovery/review/planning, write for implementation, shell for tests. Subagents return summaries, not transcripts; final synthesis stays in main.
- Keep parallel state visible per Rule 11 — lane count at dispatch, each completion or failure as it lands — for every parallel mechanism in every runtime, whatever this CLI calls it.

**Checkouts:** Work in the existing workspace checkouts. Do not clone repos or create new checkouts — worktrees under the project-local gitignored `.worktrees/` are the one exception. Worktrees are on-demand: read-only lanes never get one; writers get one only for concurrent isolated writes, just in time — never speculatively, never for blocked work — and removed after integration. Soft cap of 3 concurrent writers, exceeded only with the disjoint-ownership justification stated in the Rule 11 dispatch update (self-stated, not user approval); runtime worktree isolation falls under the same authority and criteria.

**User-asked isolation:** A user request to work in a worktree, on a branch, or "in isolation" overrides the on-demand rule above — set it up before the first edit, never after. When they name the form (`worktree` or `branch`), take them at their word. When they do not ("isolate this", "keep it separate", "leave my checkout alone"), ask once per Rule 4 — a worktree under `.worktrees/` (`Recommended`: their checkout stays untouched), a new branch in the current checkout, or stay in the current checkout — and edit nothing while the question is open. That question settles which form they meant; it is never an approval gate for the lanes above.

### 11. Honest state & reporting

Enforced. No exceptions.

- Before any significant step, anchor state: `[verified]` (proven true), `[current]` (in progress), `[todo]` (not started).
- At phase changes, send a short visible update: `Stage`, `Found`, `Next`, `Needs user` — not buried in narration, raw tool output, or pre-tool chatter. After discovery or broad file reads, give it before planning, edits, tests, commits, PRs, or issue updates.
- Continue within a phase when the next action follows from the request; make phase transitions explicit. Stop only when user input, approval, or a scope decision is needed.
- Never report work done while any part is skipped, stubbed, or unverified. Surface constraints, risks, and assumptions up front.
- While any subagent, background task, or job is active — under any name, in any runtime — every visible update states `N running / M done / K blocked` and what each running lane is doing. Work running silently in the background is a reporting violation, exactly like claiming unverified work is done.
- After a successful task, end with `Recommended next step:` and the single best follow-up, plus a one-line why. When more paths matter, add `Other good options:` with up to three labeled choices (Rule 4), plus `Write your own`. Suggest only — never chain or auto-advance.

**Why:** silent gaps and premature "done" are how broken work ships.

### 12. Zero attribution

No co-author, AI, tool, or generator attribution.

- Never add `Co-authored-by`, `Co-Authored-By`, `Generated by`, `AI-assisted`, `Made with`, or similar to commits, PR titles, PR bodies, issue comments, release notes, generated docs, or code comments.
- Strip tool-added attribution before every commit, push, PR, issue comment/close, or publication.

### 13. Shipping is owned by the ship skills

Nothing commits, pushes, opens a PR, or closes an issue outside the ship skills, and each ship skill stays inside its own scope:

- `/commit-push-pr` — commit, push, and open a PR targeting the default branch.
- `/commit-push-close` — commit, push the current branch, and close the issue (a direct default-branch push only after its separate confirm).
- `/pr-feedback` — fixes on an existing PR branch; it ships through `/commit-push-pr` on that same branch, never a raw push.
- `/staging-fix` — commit, push, and open a PR targeting the staging branch only, with auto-merge; never the default branch.

- Local engineering commits are not shipping: task-branch commits inside orchestration worktrees and local `--no-ff` merges into the local integration branch are allowed without a ship skill. Rule 12 still applies to them, and any push, PR, or issue close still exits through a ship skill.
- Any other skill that instructs you to commit — `/implement` included — stops instead and hands off. Report what is ready to ship; do not stage, commit, or push it.
- The ship skills own branch-off-main, the structured commit message, issue linking, the how-to-test evidence, and Rule 12 — a bare commit outside them bypasses all of it and lands before the ship policy gets a say.

### 14. Efficient browser verification

Hard rules for every browser mechanism in every runtime — agent-browser, a built-in browser subagent, a Playwright/CDP MCP. The browser is rarely the bottleneck; chatty per-call driving, oversized snapshots, and unstable waits are.

- Keep one authenticated session for the whole task; never restart the browser or re-login mid-task. Persist auth by session name/profile so a daemon restart doesn't force re-login.
- Drive each route as one batched flow — open → interact → deterministic assertion — never separate calls for open, wait, snapshot, click, errors, console. Prefer the project's flow runner or JSON flow mode when one exists.
- Short explicit timeouts: 3–8 s on every browser command, one outer timeout per flow — never inherit a long default. Clean up spawned wait processes on exit: an orphaned wait blocks the whole session.
- One command at a time per session, never overlapping. Health-check a reused session first (~2 s URL read); on failure, close and reopen **that session only** — never close all sessions, which destroys other agents' auth and state.
- Isolate mutation checks: record originals, change one setting, verify, restore before the next — restore even when the flow fails, or the next save persists contaminated fields.
- Prefer stable selectors (`data-test`, CSS) over framework-generated element refs that re-renders invalidate (Livewire, React, …); re-snapshot only after a re-render breaks a ref.
- Assert stable state — URL, DOM/component state, or a database row — never toast timing or `networkidle`. Use compact JS eval assertions; snapshot only the specific element when its selector is unknown — full-page snapshots are overview only.
- One interaction flow plus one evidence check per behavior; cross-page persistence and data coverage belong in the project's test suite.
- An ordinary route flow taking over ~5 seconds is a defect to diagnose (Rule 8), not a reason to add waits.

## Working with skills

Skills are ad-hoc tools, not a pipeline: treat every installed skill as available, and pick the one that fits the step in front of you — no required order, no state machine.

[GRADIENT TABLE — columns `Phase | Skills`. One row per gradient phase in manifest order (discover, sharpen, plan, slice, implement, verify, ship). In each row list every `kit` and `external` skill whose manifest `phase` matches. Omit phases with no skills.]

[STARTUP NOTE — one line per skill with manifest `phase: startup`, e.g. "Run `/design-system` per project after setup to build the UI library first."]

- Skills live in each repo's `.agents/skills/` and in the kit — prefer the project-local one; never assume a skill exists, use what is installed.
- When a target project has its own `AGENTS.md`, read it on demand for that project's specifics. This root file still binds.
- After finishing a step, suggest a sensible next skill when one fits. Suggest only — never chain or auto-advance.

### Companion skills and MCPs

Optional separate installs — use them beside this kit when installed and task-fit; do not vendor them into this kit.

[COMPANION TABLE — columns `Companion | Use when`. One row per manifest entry with `kind: companion`: its name and use-when text, in manifest order.]

- Companions are helpers, not authority — repo code, tests, ADRs, `CONTEXT.md`, and user instructions still win.
- Never assume a companion is installed; if missing, say so and continue with the best local fallback.
- Use MCPs only for the current task — no browsing unrelated external data. For database MCPs, use the narrowest approved connection, read-only unless the user approves a specific write.

### Matt skill routing

Use `/ask-matt` to choose a Matt skill flow — it routes, never executes; do not auto-run its suggestion.

- Idea flow: `/grill-with-docs` → if runnable uncertainty, `/handoff` + `/prototype` + `/handoff` → for multi-session work, `/to-spec` then `/to-tickets`.
- **The fog test.** Can you state the destination in one line *and* name every open decision as a sharp question, right now? Yes → `/feature-prompt`. No → fog → `/wayfinder` (decisions become tracker tickets, one resolved per session). Fog, not size: a large mechanical refactor has no fog (→ `/to-tickets` expand–contract); a two-file change gated on one unresolved decision is fog. Greenfield enters here too. Both arms rejoin at `/to-spec`; a map is exhausted when nothing is left to decide.
- Fresh session per ticket. `/implement` (when installed) drives `/tdd-loop` at each seam, with `/tdd` supplying test quality and seam choice; without it, drive `/tdd-loop` directly. `/tdd` is reference only — never a loop. `/implement` stops after `/code-review` and never commits (Rule 13).
- `/diagnosing-bugs` finds the root cause; ship the fix through `/tdd-loop` — the reproduction becomes the failing regression test, one red → green per bug, full check once at batch end (Rule 7).
- `/triage` = raw incoming issues and external PRs only — never tickets from `/to-tickets`. `/research` = delegable primary-source reading → cited doc. `/improve-codebase-architecture` (when installed) → a chosen improvement feeds `/grill-with-docs`. `/handoff` forks context to a new session; `/compact` continues this one — only at intentional phase breaks.

[RUNTIME TOOL-CALLING — emit the `### Runtime tool-calling` subsection here, per the Working with skills rules in SKILL.md]

## Context & native memory

- **Binding:** `CONTEXT.md` (<!-- set during setup: path to CONTEXT.md -->) + ADRs (<!-- set during setup: path to specs/adr -->) — read before implementing. Then current task context (request, issue/spec, code, tests, command evidence), then the current CLI's native memory only when it provides one; never sync memory between CLIs.
- `specs/` is an on-demand archive — retrieve only what the task names; never bulk-read it.
- No repo `MEMORY.md`, wikis, discovery files, knowledge-graph files, or memory MCPs as default memory — shared context lives in `AGENTS.md`, `CONTEXT.md`, and ADRs; graph/index companions are helpers, not binding memory.
- `/grill-with-docs`: ask once, up front, whether archived context exists; capture pastes verbatim in the ADR **as a blockquote** with provenance (`Source: "<doc title>" · pasted <date>`); offer revealed names as `CONTEXT.md` aliases; pasted history is advisory — flag ADR contradictions, never silently drop them.

### North star

[NORTH STAR — emit this subsection only when the scan found a `VISION.md` / `vision.md`, per the SKILL.md rules; otherwise delete it. List each found file: `<path>` — workspace, or the PROJECT-CODE it belongs to.]

- The vision file(s) above are the project's north star: read the relevant one before planning-phase work — feature prompts, grilling, specs, tickets, wayfinding — and align plans with it.
- The north star guides direction and tie-breaking; it never overrides binding sources. When a plan or request conflicts with it, surface the conflict — never resolve it silently in either direction.

## Issue titles

These titles live in the workspace's issue tracker of record (default: GitHub Issues), findable from tracker search and the ADR filename. `<PROJECT-CODE>` is the Project Matrix code — uppercase, hyphenated, no spaces; use it exactly.

**Spec issue** — title starts exactly with:

`Spec: <PROJECT-CODE> ADR-<adr-number> <adr-name>`

- Derive `<adr-number>` and `<adr-name>` from the ADR filename in `specs/adr/` (without `.md`): `0042-stock-transfer-approvals.md` → `Spec: PAYMENTS ADR-0042 stock-transfer-approvals`.
- Issues titled `PRD: …` predate this naming; treat them as spec issues and do not retitle them.

**Spec ticket issue** — title starts exactly with:

`Ticket NNNN of <PROJECT-CODE> ADR-<adr-number> <adr-name> (#<spec-issue>): <Short heading>`

- `NNNN`: zero-padded four-digit ticket number, local to that spec, starting at `0001`. `<spec-issue>`: tracker identifier of the parent spec. `<Short heading>`: concise and action-oriented.
- Example: `Ticket 0001 of PAYMENTS ADR-0042 stock-transfer-approvals (#4812): Add approval state model`
- Issues titled `Slice NNNN of …` predate this naming; treat them as ticket issues and do not retitle them.

**Wayfinder issue** — a `/wayfinder` map or one of its child tickets:

`Way: <PROJECT-CODE> <destination or question>`

- Map example: `Way: PAYMENTS unify approval and refund flows`
- Ticket example: `Way: PAYMENTS which service owns idempotency?`
- Not numbered. Parentage is the tracker's native child link, not the title.

**Non-spec issue** — not tied to a spec:

`<PROJECT-CODE>: <short imperative heading>`

**Labels.** Every triaged *delivery* issue — spec, spec ticket, non-spec — carries exactly one category (`bug` or `enhancement`) and exactly one state (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`).

Wayfinder issues are planning artifacts, not delivery work: they carry only `/wayfinder`'s own labels (`wayfinder:map`, and `wayfinder:research` / `prototype` / `grilling` / `task`), are closed before `/to-spec` runs, and never get a category or state label. Their HITL/AFK classification is a ticket *type*, never a title marker — no issue title in any species may carry `HITL:`, `AFK:`, or `BLOCKER:`.

## Output style

Chat only. Does not apply to code, docs, specs (PRDs), release notes, PR bodies, or prompts.

Style and rewriting skills (e.g. unslop) govern free prose only — chat, and doc/PR prose composed freely. Text a skill mandates verbatim — templates, markers, section names, structured field labels, issue-title formats — is emitted exactly as specified; style skills never rewrite it.

### 1. Plain-language chat

- Be concise and lead with the conclusion. Clarity beats compression — use a short complete sentence where clipping would confuse.
- Talk in ASD-STE100 Simplified Technical English: active voice, present tense, short sentences, one idea per sentence, one meaning per word. Split any sentence that carries more than three identifiers.
- Use the ubiquitous language from `CONTEXT.md` for domain terms — the exact names, not synonyms.
- Use everyday words over heavy ones ("fix" over "implement a solution", "use" over "utilize"); no other jargon unless it is an exact code, product, or domain name the user already uses.
- Keep exact code, DB, API, route, screen, and file names verbatim. Name the plain effect, failure, or real decision first ("the test data made both cases identical"), the identifiers after; explain each technical term once.
- No unexplained shorthand and no arrow-only flows without plain words after them. Optional brevity skills are user-invoked only.

### 2. Understanding checks

When the user asks you to repeat, confirm, or restate their understanding:

- Restate only what you understand.
- Ask the user to approve or correct it.
- Stop there. Do not plan, edit, run tools, or continue until the user confirms or corrects the understanding.

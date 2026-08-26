# Quality scorecard — `/agents-md`

**Scored:** 2026-07-17 · **Reader:** fresh rescorer (round 2) · **Rubric:** `evals/skill-quality-rubric.md`

## Trigger eval

Routing baseline: unchanged description; 2026-07-09 baseline stands (21/21, re-confirmed unanimous in the 2026-07-14 sweep recorded in `evals.json`). The pending 2026-07-16/17 maintainer sweep covers other skills' descriptions only; none of the new/edited descriptions collides with this skill's trigger queries.

## Round-1 fix verification

- `SKILL.md:56` — the bracketed-slots parenthetical now reads "…, `### Runtime Tool-Calling` tables, and the `### North star` list when emitted", covering the template's `[NORTH STAR …]` slot (`assets/agents-md-template.md:185`). Fixed as specified.
- `assets/agents-md-template.md:173` — the placeholder now reads "per the Working with skills rules in SKILL.md", matching the live `## Working with skills` heading (`SKILL.md:63`). Fixed; markers bumped v10→v11 in both template assets and `SKILL.md:70`, confirmed by `tools/validate.sh` check 7: "agents-md markers consistent (v11 x3 + stated)".
- No new defect introduced by either fix.

| Category | Score | Note (only if below 5) |
| :--- | :---: | :--- |
| Purpose clarity | 5 | |
| Trigger clarity | 5 | |
| Scope control | 5 | |
| Instruction quality | 5 | |
| Brevity | 5 | |
| Engineering usefulness | 5 | |
| Agent usability | 5 | |
| Verification quality | 5 | |
| TDD / testing compat | N/A | |
| Maintainability | 5 | |
| Frontier readiness | 5 | |
| **Average** | **5.00** | |

`N/A` is permitted only on TDD / testing compat, and only with a justification
sentence here:

> The skill generates markdown instruction files (`AGENTS.md` + `CLAUDE.md` shim); it neither produces code nor gates on someone else's tests, so there is no testable surface — done-ness is enforced by the observable completion checklist (row-count match, empty `diff` against the shim template, marker line present).

## Defects

One row per defect. A defect with no anchor and no exact edit is an opinion —
delete it.

| `file:line` | Category | Problem | Exact fix | Gate |
| :--- | :--- | :--- | :--- | :--- |
| — | — | none | — | — |

**Gates** mean the fix cannot land as an ordinary edit:

- `dup-pair` — the text is duplicated by design (`ship-policy.md`,
  `context-terms.md`). Edit every copy together or `tools/validate.sh` check 2
  fails.
- `description-locked` — the fix would change frontmatter `description`, which
  invalidates the trigger-eval baseline. Needs a maintainer eval re-run.

## Verdict

- [x] Averages 5.00 — nothing left to point at
- [ ] Below 5.00 — the blocking defects are listed above, each with an owner
      and a gate

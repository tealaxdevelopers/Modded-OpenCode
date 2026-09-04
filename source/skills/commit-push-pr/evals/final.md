# Quality scorecard — `/commit-push-pr`

**Scored:** 2026-07-17 · **Reader:** fresh rescorer (round 3) · **Rubric:** `evals/skill-quality-rubric.md`

## Trigger eval

Routing baseline: maintainer sweep pending for the 2026-07-16/17 description batch

## Round-2 fix verification

- Defect (no phase updates in the 12-step workflow): fixed. The canonical one-liner now sits
  directly under the `## Workflow` heading (`SKILL.md:45`) — "Emit `Stage / Found / Next / Needs
  user` at each phase transition — one line per field." — and is byte-exact against
  `/commit-push-close` `SKILL.md:37` (verified by diff; `tools/validate.sh` check 13 passes).

## Quality

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
| TDD / testing compat | 5 | |
| Maintainability | 5 | |
| Frontier readiness | 5 | |
| **Average** | **5.00** | |

`N/A` is permitted only on TDD / testing compat, and only with a justification
sentence here:

> _(unused — the skill gates on the test plan's own pass/fail command; category 9 is scored)_

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

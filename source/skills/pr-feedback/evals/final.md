# Quality scorecard — `/pr-feedback`

**Scored:** 2026-07-17 · **Reader:** fresh rescorer (round 4) · **Rubric:** `evals/skill-quality-rubric.md`

## Trigger eval

Routing baseline: maintainer sweep pending for the 2026-07-16/17 description batch. Read the 18
`evals.json` queries against the 16-description catalog: every should-trigger phrasing appears in
or is directly implied by the description, and both nearest siblings are explicitly negated
("Reviewing a PR yourself routes to /code-review; opening a new PR routes to /commit-push-pr").
No colliding sibling and no misrouting query could be named.

## Round-3 fix verification

- Defect (step-5 record had no field in the one-line final report): fixed. Step 8
  (`SKILL.md:84`) now reads "One line — plus a second line carrying any step-5 record
  (pre-existing failures or a no-coverage note) — then the footer.", and the Output
  final-report line (`SKILL.md:100`) mirrors it ("a second line carries any step-5 record").
  Step 5's mandate and the report shape no longer conflict.

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

> _(unused — the skill applies code fixes and gates on their tests; category 9 is scored)_

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

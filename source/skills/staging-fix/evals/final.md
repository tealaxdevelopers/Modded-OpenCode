# Quality scorecard — `/staging-fix`

**Scored:** 2026-07-17 · **Reader:** fresh rescorer (round 4) · **Rubric:** `evals/skill-quality-rubric.md`

## Trigger eval

Routing baseline: maintainer sweep pending for the 2026-07-16/17 description batch (new skill —
no recorded run yet). Read the 15 `evals.json` queries against the 16-description catalog: every
should-trigger names staging plus a fix intent, which only this description claims; the negatives
are covered by the description's explicit negative-routing clauses (/commit-push-pr,
/commit-push-close, /diagnosing-bugs) or lack the fix intent entirely. No colliding sibling found.

## Round-3 fix verification

- Defect (hardcoded `--base staging` despite Inputs treating the branch name as a confirmed
  variable): fixed. The ship command (`SKILL.md:46`) now reads `--base <staging-branch>`, the
  read-back (`SKILL.md:50`) confirms "the base is the confirmed staging branch", and the
  completion criterion (`SKILL.md:62`) checks "the confirmed staging branch as base". The name
  confirmed in Inputs now threads through command, read-back, and criterion.

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

> _(unused — the skill produces a code fix with a test; category 9 is scored)_

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

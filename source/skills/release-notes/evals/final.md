# Quality scorecard — `/release-notes`

**Scored:** 2026-07-17 · **Reader:** fresh rescorer (round 2) · **Rubric:** `evals/skill-quality-rubric.md`

## Trigger eval

Routing baseline: maintainer sweep pending for the 2026-07-16/17 description batch (description carries the `/handoff` negative route; last passing run 22/22 on 2026-07-14 predates it).

## Round-1 fix verification

- Defect 1 (no phase visibility): fixed. The canonical one-liner sits byte-exact at the end of "Agent use" (`SKILL.md:104`); `tools/validate.sh` check 13 passes.
- Defect 2 (self-assessed completion criterion): fixed. The "re-read as a PM" criterion is replaced by an observable read-back (`SKILL.md:190-191`): every Manual QA step is `Action -> Expected Result` naming a screen, button, or field; every Impact bullet states a behavior change.
- Defect 3 (footer cap drift): fixed. `SKILL.md:193` now reads "1–3 advisory suggestions", matching `skills/writing-kit-skills/SKILL.md:52`.
- Body word count is 1,495 — under the 1,500 validator ceiling (check 12 passes); closeness is not a defect.

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
| TDD / testing compat | N/A | |
| Maintainability | 5 | |
| Frontier readiness | 5 | |
| **Average** | **5.00** | |

`N/A` is permitted only on TDD / testing compat, and only with a justification
sentence here:

> The skill produces a PM-facing Markdown document from git history it only reads; it neither ships code nor gates on anyone's test run, so there is no testable surface — `evals/tdd-workflow-eval.md` itself lists `release-notes` under the "None" surface.

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

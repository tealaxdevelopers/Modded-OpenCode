# Baseline — `/commit-push-pr`

**Date:** 2026-07-09 · **Method:** 3 independent catalog-only judge agents, majority vote per query ·
**Quality:** 1 auditor, 11 categories, anchored 1–5

## Trigger eval

**20/20** (20/20 unanimous across the three judges)

None — all queries routed correctly.

## Quality

| Category | Score | |
| :--- | :---: | :--- |
| Purpose clarity | 5 |  |
| Trigger clarity | 5 |  |
| Scope control | 5 |  |
| Instruction quality | 4 |  |
| Brevity | 4 |  |
| Engineering usefulness | 5 |  |
| Agent usability | 5 |  |
| Verification quality | 5 |  |
| TDD / testing compat | 5 |  |
| Maintainability | 5 |  |
| Frontier readiness | 5 |  |
| **Average** | **4.82** | |

## Notes

Kit-wide, the baseline trigger run scored **277/280** — not the 280/280 the `last_run` blocks
claimed. The recorded result had gone stale when a description changed without a re-run.

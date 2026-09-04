# Baseline — `/release-notes`

**Date:** 2026-07-09 · **Method:** 3 independent catalog-only judge agents, majority vote per query ·
**Quality:** 1 auditor, 11 categories, anchored 1–5

## Trigger eval

**22/22** (22/22 unanimous across the three judges)

None — all queries routed correctly.

## Quality

| Category | Score | |
| :--- | :---: | :--- |
| Purpose clarity | 5 |  |
| Trigger clarity | 5 |  |
| Scope control | 5 |  |
| Instruction quality | 4 |  |
| Brevity | 5 |  |
| Engineering usefulness | 5 |  |
| Agent usability | 5 |  |
| Verification quality | 5 |  |
| TDD / testing compat | N/A |  |
| Maintainability | 4 |  |
| Frontier readiness | 5 |  |
| **Average** | **4.80** | |

> **`N/A` on TDD/testing compat:** The skill summarizes already-completed work into PM-facing prose documents; it has no test-first code surface of its own to compose with red-green TDD (its Manual QA Steps are generated output, not a test the skill itself runs).

## Notes

Kit-wide, the baseline trigger run scored **277/280** — not the 280/280 the `last_run` blocks
claimed. The recorded result had gone stale when a description changed without a re-run.

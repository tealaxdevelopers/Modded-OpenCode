# Baseline — `/agents-md`

**Date:** 2026-07-09 · **Method:** 3 independent catalog-only judge agents, majority vote per query ·
**Quality:** 1 auditor, 11 categories, anchored 1–5

## Trigger eval

**19/21** (21/21 unanimous across the three judges)

- **[trigger]** `Create the Project Matrix and non-negotiable rules for this workspace` → majority `/design-system` (votes: /design-system, /design-system, /design-system)
- **[trigger]** `Refresh the Project Matrix — I added a folder to the workspace` → majority `/design-system` (votes: /design-system, /design-system, /design-system)

## Quality

| Category | Score | |
| :--- | :---: | :--- |
| Purpose clarity | 5 |  |
| Trigger clarity | 5 |  |
| Scope control | 5 |  |
| Instruction quality | 5 |  |
| Brevity | 5 |  |
| Engineering usefulness | 5 |  |
| Agent usability | 5 |  |
| Verification quality | 4 |  |
| TDD / testing compat | N/A |  |
| Maintainability | 4 |  |
| Frontier readiness | 5 |  |
| **Average** | **4.80** | |

> **`N/A` on TDD/testing compat:** The skill emits Markdown instruction files (AGENTS.md + CLAUDE.md shim) from a workspace scan; it has no executable code or test surface, and its done-ness is proven by the observable completion checklist rather than a test run.

## Notes

Kit-wide, the baseline trigger run scored **277/280** — not the 280/280 the `last_run` blocks
claimed. The recorded result had gone stale when a description changed without a re-run.

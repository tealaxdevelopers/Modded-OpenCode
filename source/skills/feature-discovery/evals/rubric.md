# Rubric — `/feature-discovery`

Two independent axes. A skill can route perfectly and still waste the context it earns.

## 1. Trigger eval (routing)

Does the runtime load this skill, and not a sibling? Scored from [`evals.json`](evals.json) by the
harness in `tools/trigger-evals/`: build the catalog, build the queryset, run **three independent
judge agents** that route each query using only the catalog, then take a majority vote per query.

- A `trigger` query passes when the majority picks `/feature-discovery`.
- A `no-trigger` query passes when the majority picks anything else. Its `route` field is
  diagnostic, not pass/fail.

Pass bar: **22/22**. Anything less is a description defect, not a query defect.

## 2. Quality (body)

Eleven categories, 1–5, scored by a reader who did not write the edits.

| Score | Meaning |
| :--- | :--- |
| 5 | A frontier agent executes correctly first try. Nothing to add, nothing to cut. |
| 4 | Strong, but a reviewer can point at one concrete line. |
| 3 | A real gap that would produce a wrong or incomplete run. |
| 2 | Materially incomplete or misleading. |
| 1 | Absent or harmful. |

Categories: purpose clarity · trigger clarity · scope control · instruction quality · brevity ·
engineering usefulness · agent usability · verification quality · TDD/testing compat ·
maintainability · frontier readiness.

**Trigger clarity is scored from the trigger eval above, not from prose.** To score it below 5, name
the colliding sibling and the query that misroutes.

`N/A` is permitted only on TDD/testing compat, only when the skill has no testable surface, and only
with a written justification. It is not a way to dodge a hard category.

Shared anchors and the deep-dive sheets live in `evals/` at the repo root; this file is the local,
self-sufficient copy of what applies to `/feature-discovery`.

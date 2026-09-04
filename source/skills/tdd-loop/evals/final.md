# Quality scorecard — `/tdd-loop`

**Scored:** 2026-07-17 · **Reader:** fresh rescorer (round 2) · **Rubric:** `evals/skill-quality-rubric.md`

## Trigger eval

Routing baseline: maintainer sweep pending for the 2026-07-16/17 description batch. Read against the current 16-description catalog: all 12 trigger queries land here (no kit sibling claims test-first work; the exception-protocol cases — hotfix, legacy, characterization — are named in the description) and all 9 no-trigger queries route to their named siblings. No colliding sibling + misrouting query found.

## Round-1 fix verification

| Round-1 defect | Anchor | Verified |
| :--- | :--- | :--- |
| Standalone slogan after the completion checklist restating checkbox 1 ("Tests pass" without a witnessed red…) | former `SKILL.md:124` | Fixed verbatim in commit `671a1e5` (2 lines deleted) — the checklist now ends at the exception checkbox (`SKILL.md:122`) and flows directly into "## Autonomy boundary"; checkbox 1 (`SKILL.md:108-110`) alone binds the witnessed-red rule |

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

TDD / testing compat is scored (not N/A): this is the kit's produces-code surface at its 5/5 bar — witnessed red quoted before green (checkbox 1, with the characterization-test carve-out), the exception protocol named per case with declared verification (`SKILL.md:137-161`), and the pre-existing-failure protocol (stash, confirm, note on the Scope run line, `SKILL.md:67-69`).

## Category notes (what was checked)

- **Purpose:** identity sentence opens the body ("TDD is one failing test turned green at a time", `SKILL.md:8`), then the three-layer placement map bounds it against /implement and /tdd.
- **Brevity:** the rules↔checklist duplication is gone; each gate is now stated once — wrong-reason red in step 1, assertion-weakening in step 3, witnessed red in checkbox 1. No remaining same-gate-twice pair found.
- **Instruction quality:** "No focused-test command, no loop" gate with its replacement (finding the command is step-2 work, `SKILL.md:42-43`); batch cadence stated once in the loop preamble and bound by checkbox 3 as the evidence side, not a restatement.
- **Agent usability:** away-fallbacks on both human gates (contestable seam → state choice and proceed, `SKILL.md:37-38`; contract change → only when the old assertion contradicts agreed behavior, flagged, `SKILL.md:71-73`); the auth/payments/migration stop (`SKILL.md:132-135`) is a deliberate sign-off gate. Phase updates bound (`SKILL.md:45`); summary shape exact with a filled example in `references/summary-example.md`.
- **Verification:** every completion checkbox is observable — quoted failing run, named commands, full-check-once-per-batch with the widest-feasible escape stated, pre-existing failures verified with the change stashed.
- **Maintainability:** `references/test-commands.md` derives runners from manifest/CI, not folder names; no `agents/openai.yaml` needed (model-invocable); the check-10 provenance failure is the documented pending description-batch state, not a defect. Body 1,300 words, under the ceiling.

## Defects

One row per defect. A defect with no anchor and no exact edit is an opinion —
delete it.

None — the round-1 defect was fixed verbatim at its anchor, and a fresh full-file read (SKILL.md + both references) found no new anchored defect.

## Verdict

- [x] Averages 5.00 — nothing left to point at
- [ ] Below 5.00 — the blocking defects are listed above, each with an owner
      and a gate

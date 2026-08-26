# Quality scorecard — `/feature-discovery`

**Scored:** 2026-07-17 · **Reader:** fresh rescorer (round 2) · **Rubric:** `evals/skill-quality-rubric.md`

## Trigger eval

Routing baseline: maintainer sweep pending for the 2026-07-16/17 description batch. Scored by reading `evals/evals.json` (22 queries) against the current 16-description catalog: every trigger query lands on wording the description carries verbatim; every negative has an explicit routing clause here or in the sibling (/port-feature, graphify whole-repo deferral, /feature-prompt, /integration-contract). No colliding sibling + misrouting query found.

## Round-1 fix verification

| Round-1 defect | Anchor | Verified |
| :--- | :--- | :--- |
| Redundant "Never cloud;" clause in the sub-agents bullet | `SKILL.md:23` | Fixed verbatim in commit `671a1e5` — the bullet now reads "…report each lane as it completes. Summaries back, not transcripts; synthesis stays in the main session." with the canonical one-liner byte-exact (validate.sh check 13 green) |

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

> **`N/A` on TDD / testing compat:** Read-only, chat-only discovery — it produces no code and gates on no one else's tests; test files appear only as evidence citations (report sections 4 and 8) and missing tests are flagged as findings (section 7), never as a pass/fail gate, so there is no testable surface.

## Category notes (what was checked)

- **Purpose:** identity sentence opens the body (`SKILL.md:8`) with both neighbour boundaries (/port-feature, graphify).
- **Scope:** read-only/chat-only rule with the step-6 exception named (`SKILL.md:16`), stop-after-report (`SKILL.md:21`), and the `git status` completion check making read-onlyness witnessable (`SKILL.md:95`).
- **Agent usability:** all three human gates carry away-fallbacks — blocking questions (`SKILL.md:12`), broad issue scan not granted/away (`SKILL.md:37`), CONTEXT.md approval no-reply → no edits (`SKILL.md:51`). Commands named; phase updates with named phases (`SKILL.md:22`); output template exact with caps.
- **Brevity:** the round-1 duplication is gone; the sub-agents bullet's suffix now carries only new content. No remaining same-fact-twice line found.
- **Verification:** both validation passes state what they check (`SKILL.md:47`); section 8 requires commands named and skips declared; completion criteria all observable.
- **Maintainability:** `references/context-terms.md` dup-pair byte-parity holds (check 2 green); canonical one-liners byte-exact (check 13 green); the check-10 provenance failure is the documented pending description-batch state, not a defect. Body 1,341 words, under the 1,500 ceiling.

## Defects

One row per defect. A defect with no anchor and no exact edit is an opinion —
delete it.

None — the round-1 defect was fixed verbatim at its anchor, and a fresh full-file read found no new anchored defect.

## Verdict

- [x] Averages 5.00 — nothing left to point at
- [ ] Below 5.00 — the blocking defects are listed above, each with an owner
      and a gate

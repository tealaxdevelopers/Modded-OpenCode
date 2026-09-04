# Quality scorecard — `/staging-fix`

**Scored:** 2026-07-17 · **Reader:** fresh scorer agent (post-revamp rescore) · **Rubric:** `evals/skill-quality-rubric.md`

## Trigger eval

Routing baseline: maintainer sweep pending for the 2026-07-16/17 description batch (new skill — no
recorded run yet). Scored by reading the 15 `evals.json` queries against the full 16-description
catalog: every should-trigger names staging plus a fix intent, which only this description claims;
the negatives are covered by the description's explicit negative-routing clauses
(/commit-push-pr, /commit-push-close, /diagnosing-bugs). No colliding sibling found.

## Quality

| Category | Score | Note (only if below 5) |
| :--- | :---: | :--- |
| Purpose clarity | 5 |  |
| Trigger clarity | 5 |  |
| Scope control | 5 |  |
| Instruction quality | 5 |  |
| Brevity | 5 |  |
| Engineering usefulness | 5 |  |
| Agent usability | 4 | Multi-step run (evidence → test-first fix → ship) with no phase updates — caller can't tell slow from stuck |
| Verification quality | 4 | Completion criterion 3 is a session self-audit re-asserting Rules 1–3, not observable artifact evidence |
| TDD / testing compat | 4 | No pre-existing-failure protocol: "a broken suite stops the workflow here" blocks an honest agent when main was already red |
| Maintainability | 5 |  |
| Frontier readiness | 5 |  |
| **Average** | **4.73** | |

## Defects

| `file:line` | Category | Problem | Exact fix | Gate |
| :--- | :--- | :--- | :--- | :--- |
| `skills/staging-fix/SKILL.md:37` | TDD / testing compat | "a broken suite stops the workflow here" conflates a suite the fix broke with a suite that was already red, so an unrelated pre-existing failure blocks an urgent staging fix with no way forward | Split the sentence: failures confirmed pre-existing by re-running with the fix stashed are recorded on the run line and do not block; failures the fix caused stop the workflow here | `none` |
| `skills/staging-fix/SKILL.md:27` | Agent usability | The 4-step workflow emits no phase updates, unlike its long-running siblings (`tdd-loop`, `pr-feedback`), so a background run is illegible while in progress | Append the canonical one-liner to the Rules list, byte-exact: "Emit `Stage / Found / Next / Needs user` at each phase transition — one line per field." | `none` |
| `skills/staging-fix/SKILL.md:63` | Verification quality | Completion criterion "Every remote action this session was either GitHub … no staging or production mutation occurred" re-asserts Rules 1–3 as self-assessment; there is no artifact to read it back from, and the skeleton forbids criteria that re-assert body rules | Delete the criterion — the Rules section already binds it absolutely | `none` |

## Verdict

- [ ] Averages 5.00 — nothing left to point at
- [x] Below 5.00 — the blocking defects are listed above, each with an owner
      and a gate

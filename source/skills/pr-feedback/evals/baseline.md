# Quality scorecard — `/pr-feedback`

**Scored:** 2026-07-17 · **Reader:** fresh scorer agent (post-revamp rescore) · **Rubric:** `evals/skill-quality-rubric.md`

## Trigger eval

Routing baseline: maintainer sweep pending for the 2026-07-16/17 description batch. Scored by
reading this skill's 18 queries against the full 16-description catalog: every should-trigger
phrasing ("address the review comments", "handle PR feedback", "respond to the reviewer",
"worked through") appears in the description, and both nearest siblings are explicitly negated
("Reviewing a PR yourself routes to /code-review; opening a new PR routes to /commit-push-pr").
No colliding sibling and no misrouting query could be named.

## Quality

| Category | Score | Note (only if below 5) |
| :--- | :---: | :--- |
| Purpose clarity | 5 | |
| Trigger clarity | 5 | |
| Scope control | 5 | |
| Instruction quality | 4 | Step 2 fetch caps at `first:100` threads with no pagination; step 7 gives no reply route for non-thread comments step 2 collects |
| Brevity | 4 | Opener re-narrates the frontmatter description's six-step pipeline clause for clause |
| Engineering usefulness | 5 | |
| Agent usability | 5 | |
| Verification quality | 4 | Completion criterion 3 ("no rewritten SHAs") is not witnessable — the pre-run remote head is never recorded |
| TDD / testing compat | 4 | "Run the tests the touched code has" names no command and requires no quoted output; completion criteria carry no test evidence |
| Maintainability | 5 | |
| Frontier readiness | 5 | |
| **Average** | **4.64** | |

`N/A` is permitted only on TDD / testing compat, and only with a justification
sentence here:

> _(unused — the skill applies code fixes and gates on their tests; category 9 is scored)_

## Defects

One row per defect. A defect with no anchor and no exact edit is an opinion —
delete it.

| `file:line` | Category | Problem | Exact fix | Gate |
| :--- | :--- | :--- | :--- | :--- |
| `skills/pr-feedback/SKILL.md:38-41` | Instruction quality | `reviewThreads(first:100)` / `comments(first:50)` with no pagination — a PR with >100 threads silently drops feedback, breaking the "fetch every review comment and thread" promise (line 9) | Add `pageInfo { hasNextPage endCursor }` to `reviewThreads` and one sentence: "If `hasNextPage` is true, re-query with `after: <endCursor>` until it is false." | `none` |
| `skills/pr-feedback/SKILL.md:70-75` | Instruction quality | Step 7 only gives the review-thread reply endpoint, but step 2 (line 44) also collects review bodies and issue-style PR comments — an accepted item sourced there has no stated answer mechanism | Add a bullet: "Items from review bodies or issue-style comments have no thread — answer them with `gh pr comment <num> --body 'Fixed in <sha> — <what changed>.'`" | `none` |
| `skills/pr-feedback/SKILL.md:9` | Brevity | The opener's first sentence re-narrates the frontmatter description's fetch → classify → approve → fix → ship → reply pipeline nearly verbatim — the description↔body duplication failure mode named in `writing-kit-skills` (skeleton rule 1: no restatement of the description) | Compress to product + boundary: "One iteration of working reviewer feedback on an existing open GitHub PR, ending in pushed fix commits and a reply on every settled thread." Keep the existing boundary sentence unchanged. | `none` |
| `skills/pr-feedback/SKILL.md:103` | Verification quality | "`git log origin/<head-branch>` shows only added commits — no rewritten SHAs" cannot fail as written: the workflow never records the pre-run remote head, so a rewrite is undetectable from `git log` alone | In step 1 record `git rev-parse origin/<head-branch>`; rewrite the criterion as "`git merge-base --is-ancestor <recorded-sha> origin/<head-branch>` succeeds — history was only appended" | `none` |
| `skills/pr-feedback/SKILL.md:62` | TDD / testing compat | "Run the tests the touched code has" names no command and demands no quoted output, and no completion criterion requires test evidence — /commit-push-pr's quoting gate fires only when the how-to-test plan opens with a test command, which this skill never instructs | Append to step 5: "Name the command and quote its passing tail; open /commit-push-pr's how-to-test plan with that command so its quoting gate fires. No tests cover the touched paths → say so in the report." | `none` |

**Gates** mean the fix cannot land as an ordinary edit:

- `dup-pair` — the text is duplicated by design (`ship-policy.md`,
  `context-terms.md`). Edit every copy together or `tools/validate.sh` check 2
  fails.
- `description-locked` — the fix would change frontmatter `description`, which
  invalidates the trigger-eval baseline. Needs a maintainer eval re-run.

## Verdict

- [ ] Averages 5.00 — nothing left to point at
- [x] Below 5.00 — the blocking defects are listed above, each with an owner
      and a gate

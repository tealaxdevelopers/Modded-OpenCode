# Test cases — `/pr-feedback`

The routing test set for this skill lives in [`evals.json`](evals.json); this file is its readable
form. 10 should-trigger queries and 8 near-miss negatives.

Near-miss negatives name the sibling they *should* route to. An obviously-irrelevant negative
proves nothing — if a query could never plausibly hit this skill, it is not testing the boundary.

## Should trigger (10)

| # | Query |
| :--- | :--- |
| 1 | Address the review comments on my PR |
| 2 | Handle the PR feedback from Sarah |
| 3 | Respond to the reviewer on #214 |
| 4 | The reviewer left six comments on my pull request — work through them |
| 5 | Go through the open review threads on this branch's PR and fix what's fair |
| 6 | My PR got a changes-requested review — deal with it |
| 7 | Apply the requested changes from the code review on PR #88 |
| 8 | Triage the reviewer's comments — some I agree with, some I don't |
| 9 | Someone reviewed my PR overnight, handle their feedback |
| 10 | Fix the review nits on my pull request and reply to each thread |

## Should NOT trigger (8)

| # | Query | Routes to |
| :--- | :--- | :--- |
| 1 | Review this PR | `/code-review` |
| 2 | Review the diff before shipping | `/code-review` |
| 3 | Open a PR for this | `/commit-push-pr` |
| 4 | Ship this as a PR | `/commit-push-pr` |
| 5 | Commit, push, and close the issue — I'm done | `/commit-push-close` |
| 6 | Fix this login bug | `/diagnosing-bugs` |
| 7 | Reply to this GitHub issue comment | `none` |
| 8 | Merge my PR | `none` |

## Rule

Fix descriptions, not queries. A missed should-trigger means the description lacks that phrasing.
A captured near-miss means the boundary sentence is missing, or the sibling's description is weaker
than this one's. Never delete a query to make the eval pass.

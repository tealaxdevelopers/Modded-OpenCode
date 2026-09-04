# Test cases — `/commit-push-pr`

The routing test set for this skill lives in [`evals.json`](evals.json); this file is its readable
form. 10 should-trigger queries and 10 near-miss negatives.

Near-miss negatives name the sibling they *should* route to. An obviously-irrelevant negative
proves nothing — if a query could never plausibly hit this skill, it is not testing the boundary.

## Should trigger (10)

| # | Query |
| :--- | :--- |
| 1 | Commit, push, and open a PR |
| 2 | Ship this as a PR |
| 3 | PR this issue |
| 4 | Open a pull request that closes #418 |
| 5 | I'm done — put this up for review as a pull request |
| 6 | Wrap this up as a reviewable PR |
| 7 | Push my branch and create the PR with a test plan |
| 8 | Make a PR for the work on issue 204 |
| 9 | Land this via pull request |
| 10 | Raise a pull request for this fix |

## Should NOT trigger (10)

| # | Query | Routes to |
| :--- | :--- | :--- |
| 1 | I'm done with #418, ship it | `/commit-push-close` |
| 2 | Commit, push, and close the issue | `/commit-push-close` |
| 3 | Close the ticket with how-to-test steps | `/commit-push-close` |
| 4 | Review this PR | `/code-review` |
| 5 | Summarize this PR for the changelog | `/release-notes` |
| 6 | Generate release notes for this feature | `/release-notes` |
| 7 | Split this PRD into issues | `/to-tickets` |
| 8 | Grill me about this plan before I build it | `/grill-with-docs` |
| 9 | Diagnose why the build broke after my last commit | `/diagnosing-bugs` |
| 10 | Why is CI failing on my pull request? | `/diagnosing-bugs` |

## Rule

Fix descriptions, not queries. A missed should-trigger means the description lacks that phrasing.
A captured near-miss means the boundary sentence is missing, or the sibling's description is weaker
than this one's. Never delete a query to make the eval pass.

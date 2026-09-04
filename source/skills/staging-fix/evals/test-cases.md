# Test cases — `/staging-fix`

The routing test set for this skill lives in [`evals.json`](evals.json); this file is its readable
form. 8 should-trigger queries and 7 near-miss negatives.

Near-miss negatives name the sibling they *should* route to; `none` means no kit skill should claim
the query. An obviously-irrelevant negative proves nothing — if a query could never plausibly hit
this skill, it is not testing the boundary.

## Should trigger (8)

| # | Query |
| :--- | :--- |
| 1 | Fix this on staging — users can't log in on the staging server |
| 2 | Staging is broken, checkout 500s there since yesterday |
| 3 | There's a bug on the staging server: notification emails aren't sending |
| 4 | Staging shows the wrong invoice totals — fix it and get it deployed to staging |
| 5 | QA found a crash on staging, here are the logs — get a fix out |
| 6 | Patch the staging bug via a PR to the staging branch |
| 7 | The staging env is throwing 502s after the last merge — fix it the safe way |
| 8 | Fix the search bug on staging and auto-merge so Actions redeploys |

## Should NOT trigger (7)

| # | Query | Routes to |
| :--- | :--- | :--- |
| 1 | Deploy to production | `none` — production is out of scope for the whole kit |
| 2 | Fix this bug | `/diagnosing-bugs` |
| 3 | Ship this issue | `/commit-push-close` |
| 4 | Check the staging logs | `none` — inspection with no fix intent |
| 5 | Set up CI for this repo | `none` |
| 6 | Commit, push, and open a PR for this feature | `/commit-push-pr` |
| 7 | Diagnose why the API is slow in local dev | `/diagnosing-bugs` |

## Rule

Fix descriptions, not queries. A missed should-trigger means the description lacks that phrasing.
A captured near-miss means the boundary sentence is missing, or the sibling's description is weaker
than this one's. Never delete a query to make the eval pass.

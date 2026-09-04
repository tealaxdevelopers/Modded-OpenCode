# Test cases — `/release-notes`

The routing test set for this skill lives in [`evals.json`](evals.json); this file is its readable
form. 11 should-trigger queries and 11 near-miss negatives.

Near-miss negatives name the sibling they *should* route to. An obviously-irrelevant negative
proves nothing — if a query could never plausibly hit this skill, it is not testing the boundary.

## Should trigger (11)

| # | Query |
| :--- | :--- |
| 1 | Generate release notes for 3 July 2026 |
| 2 | What did we ship this week? PM-friendly please |
| 3 | Create a changelog for yesterday |
| 4 | Summarize today's session for the PM |
| 5 | Write up the QR scanning improvements for stakeholders |
| 6 | Release notes for WAREHOUSE-APP, 1 to 4 July |
| 7 | Make a non-technical summary of what changed in the billing work |
| 8 | PM update for this sprint's commits |
| 9 | Turn these commits into something the operations team can read |
| 10 | Draft the weekly stakeholder update from our commits |
| 11 | Turn the last two weeks of git history into notes the ops team can scan |

## Should NOT trigger (11)

| # | Query | Routes to |
| :--- | :--- | :--- |
| 1 | Summarize this PR so I can review it faster | `/code-review` |
| 2 | Write the PR body for this change | `/commit-push-pr` |
| 3 | Close #212 with a how-to-test comment | `/commit-push-close` |
| 4 | Explain how the invite workflow works | `/feature-discovery` |
| 5 | Draft an ADR for the queue decision | `/grill-with-docs` |
| 6 | Show me the raw git log for last week | `none` |
| 7 | Update the README's feature list | `none` |
| 8 | File issues for these three bugs I found during QA | `none` |
| 9 | Summarize this long design doc into bullet points | `none` |
| 10 | Summarize this session so the next agent can pick up where we left off | `/handoff` |
| 11 | Explain what changed in the billing module and why it exists | `/feature-discovery` |

## Rule

Fix descriptions, not queries. A missed should-trigger means the description lacks that phrasing.
A captured near-miss means the boundary sentence is missing, or the sibling's description is weaker
than this one's. Never delete a query to make the eval pass.

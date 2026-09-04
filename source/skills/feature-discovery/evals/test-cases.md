# Test cases — `/feature-discovery`

The routing test set for this skill lives in [`evals.json`](evals.json); this file is its readable
form. 11 should-trigger queries and 11 near-miss negatives.

Near-miss negatives name the sibling they *should* route to. An obviously-irrelevant negative
proves nothing — if a query could never plausibly hit this skill, it is not testing the boundary.

## Should trigger (11)

| # | Query |
| :--- | :--- |
| 1 | Investigate how the invite-user workflow works across ADMIN-WEB and API-SERVICE |
| 2 | Trace where the stock-transfer approval logic lives |
| 3 | Explain how this config flag changes behavior |
| 4 | Audit the session-timeout behavior before we plan changes |
| 5 | How does the legacy quotation workflow work? |
| 6 | Map out how the RFID scanning module is wired |
| 7 | Before we refactor billing, figure out how it works today |
| 8 | What uses OrdersService, and why does it exist? |
| 9 | Walk through the API surface the mobile app consumes |
| 10 | Which services read the FEATURE_FLAGS env var and what happens when it's off? |
| 11 | Before implementing the new pricing rules, explain how discounts are applied today |

## Should NOT trigger (11)

| # | Query | Routes to |
| :--- | :--- | :--- |
| 1 | Port the quotation screen from LEGACY-PORTAL to ADMIN-WEB | `/port-feature` |
| 2 | Rebuild this legacy feature in the new stack | `/port-feature` |
| 3 | Migrate the invoices module into the React app | `/port-feature` |
| 4 | Debug why checkout is throwing 500s | `/diagnosing-bugs` |
| 5 | Turn this rough idea into a feature prompt | `/feature-prompt` |
| 6 | Update CONTEXT.md with these domain terms | `/grill-with-docs` |
| 7 | Query the knowledge graph for the payment flow | `graphify` |
| 8 | Write an ADR for this decision | `/grill-with-docs` |
| 9 | Which issues are ready for an agent to pick up? | `/triage` |
| 10 | The PRD is sliced across API-SERVICE and ADMIN-WEB — map the producer surface and each consumer's call-sites into a contract with a smoke checklist | `/integration-contract` |
| 11 | Summarize this repo's overall architecture and how the main folders relate | `graphify` |

## Rule

Fix descriptions, not queries. A missed should-trigger means the description lacks that phrasing.
A captured near-miss means the boundary sentence is missing, or the sibling's description is weaker
than this one's. Never delete a query to make the eval pass.

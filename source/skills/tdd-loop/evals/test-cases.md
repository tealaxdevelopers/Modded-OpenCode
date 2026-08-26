# Test cases — `/tdd-loop`

The routing test set for this skill lives in [`evals.json`](evals.json); this file is its readable
form. 11 should-trigger queries and 10 near-miss negatives.

Near-miss negatives name the sibling they *should* route to. An obviously-irrelevant negative
proves nothing — if a query could never plausibly hit this skill, it is not testing the boundary.

## Should trigger (11)

| # | Query |
| :--- | :--- |
| 1 | Fix this bug test-first |
| 2 | Add lowercase-username normalization to the signup flow — TDD please |
| 3 | Write a failing test for the 429 retry behavior first, then implement it |
| 4 | red-green this: carts with zero items should not be able to check out |
| 5 | I need to hotfix prod NOW — the invoice total is wrong. We'll add tests right after. |
| 6 | This legacy CodeIgniter controller has no tests and I need to change its permission check safely |
| 7 | Refactor the scanner module without changing behavior — make sure the tests keep us honest |
| 8 | Implement slice 0003 test-first |
| 9 | Can you TDD a fix for the duplicate-order bug? |
| 10 | The billing suite already has two failing tests on main — add the proration rounding feature test-first anyway |
| 11 | Write a characterization test before we touch this untested export job |

## Should NOT trigger (10)

| # | Query | Routes to |
| :--- | :--- | :--- |
| 1 | Why is the RFID scan failing intermittently in WAREHOUSE-APP? | `/diagnosing-bugs` |
| 2 | Trace how invoice approval works across ADMIN-WEB and API-SVC | `/feature-discovery` |
| 3 | Punch-list this for PRD-142: the Save button sits 8px too low | `/polish-batch` |
| 4 | I'm done with #418, ship it | `/commit-push-close` |
| 5 | Sketch a quick throwaway prototype to see if drag-to-reorder feels right | `/prototype` |
| 6 | Run the test suite and tell me what's failing | `none` |
| 7 | Write release notes for the checkout fixes | `/release-notes` |
| 8 | Turn 'add CSV export' into a feature prompt | `/feature-prompt` |
| 9 | Audit the assets page against the Figma design | `/pixel-audit` |
| 10 | CI is red on main and I don't know why — figure out what broke | `/diagnosing-bugs` |

## Rule

Fix descriptions, not queries. A missed should-trigger means the description lacks that phrasing.
A captured near-miss means the boundary sentence is missing, or the sibling's description is weaker
than this one's. Never delete a query to make the eval pass.

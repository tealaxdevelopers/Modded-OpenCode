# Test cases — `/agents-md`

The routing test set for this skill lives in [`evals.json`](evals.json); this file is its readable
form. 11 should-trigger queries and 10 near-miss negatives.

Near-miss negatives name the sibling they *should* route to. An obviously-irrelevant negative
proves nothing — if a query could never plausibly hit this skill, it is not testing the boundary.

## Should trigger (11)

| # | Query |
| :--- | :--- |
| 1 | Generate AGENTS.md for this workspace |
| 2 | Set up the workspace agent instructions from my code-workspace file |
| 3 | Create the Project Matrix and non-negotiable rules for this workspace |
| 4 | Refresh the Project Matrix — I added a folder to the workspace |
| 5 | Regenerate the workspace AGENTS.md |
| 6 | Bootstrap agent rules for my multi-repo VS Code workspace |
| 7 | Make the CLAUDE.md shim and AGENTS.md for this workspace root |
| 8 | New workspace — establish the PROJECT-CODEs |
| 9 | Write an AGENTS.md for this repo |
| 10 | Add the CLAUDE.md shim that forwards Claude to AGENTS.md in this workspace |
| 11 | We added another repo to the code-workspace — refresh the workspace agent rules |

## Should NOT trigger (9)

| # | Query | Routes to |
| :--- | :--- | :--- |
| 1 | Set up the design system for this project | `/design-system` |
| 2 | Configure the issue tracker and CONTEXT.md location | `/setup-matt-pocock-skills` |
| 3 | Seed the project ui-coding skill for ADMIN-WEB | `/design-system` |
| 4 | Generate release notes for the workspace | `/release-notes` |
| 5 | Trace how the workspace build pipeline works | `/feature-discovery` |
| 6 | Create a knowledge graph of the workspace | `graphify` |
| 7 | Sharpen the project's domain terminology | `domain-modeling` |
| 8 | Create a new skill for our deploy process | `skill-creator` |
| 9 | Add a binding AGENTS.md rule so UI changes reuse the component library | `/design-system` |

## Rule

Fix descriptions, not queries. A missed should-trigger means the description lacks that phrasing.
A captured near-miss means the boundary sentence is missing, or the sibling's description is weaker
than this one's. Never delete a query to make the eval pass.

---
name: pr-feedback
disable-model-invocation: true
description: "Address reviewer feedback on an existing open GitHub PR — fetch every review comment and thread, group them into a numbered accept / pushback / needs-discussion list, wait for the user's approval, apply the accepted fixes, ship through /commit-push-pr on the same branch, and reply to each addressed thread citing the fixing commit SHA. Use when the user says \"address the review comments\", \"handle PR feedback\", \"respond to the reviewer\", or wants reviewer comments on their open PR worked through. Reviewing a PR yourself routes to /code-review; opening a new PR routes to /commit-push-pr."
---

# pr-feedback

One iteration of working reviewer feedback on an open PR, ending in pushed fix commits and a reply on every settled thread. The boundary against its neighbours: /code-review produces a review, this skill consumes one; /commit-push-pr opens or updates the PR, this skill never creates one.

## Inputs

- **The PR** — a number or URL from the user, else detected from the current branch: `gh pr list --head "$(git branch --show-current)" --state open --json number,title,url`. No open PR found (or more than one) → stop and ask which PR this is; never guess and never create one.
- **The head branch checked out** — fixes land on the PR's head branch. If the checkout is elsewhere, switch to it; if the working tree holds unrelated uncommitted changes, stop and ask before touching anything.
- **`gh` authenticated** — if `gh auth status` fails, stop and report.

## Rules

- **One combined approval gates every remote write.** Present the feedback list — planned fixes, pushback replies, wontfix candidates — and wait; until the user approves, everything stays a local draft: no fix commit, no push, no reply, no thread resolution.
- **Reply to or resolve only settled threads.** A thread earns a reply when its fix is in a pushed commit, or when the user explicitly approved answering it as a wontfix; every other thread stays open and unanswered — an unearned "done" reply misleads the reviewer.
- **Pushback and needs-discussion items go to the user.** Never silently apply a fix you would push back on, and never silently drop one; both classifications exist to force a human decision.
- **Fixes stay inside the comment's boundary.** A "small review fix" that grows behavioural scope — new states, changed interfaces, changed data shapes — is a stop signal: park the item, tell the user, and route it to /to-tickets as its own slice.
- **Never force-push.** The PR's commit history is the review record; ship new commits on the same branch and let /commit-push-pr update the existing PR.
- **Zero attribution.** No co-author, AI, or tool attribution in commit messages, thread replies, or PR edits — scrub tool-injected trailers before anything is written remotely.
- Emit `Stage / Found / Next / Needs user` at each phase transition — one line per field.

## Workflow

### 1. Locate the PR

Resolve per Inputs, then read it: `gh pr view <num> --json number,title,url,state,headRefName,baseRefName`. State not `OPEN` → stop and report; feedback on a merged or closed PR needs the user's call. Record the pre-run remote head for the completion check: `git rev-parse origin/<head-branch>`.

### 2. Fetch every thread

Review threads — with thread IDs and resolved state — exist only in GraphQL:

```bash
gh api graphql -f query='query { repository(owner:"<owner>", name:"<repo>") {
  pullRequest(number:<num>) { reviewThreads(first:100) {
    pageInfo { hasNextPage endCursor }
    nodes {
    id isResolved isOutdated path line
    comments(first:50) { nodes { databaseId author { login } body } } } } } } }'
```

Re-query with `after: <endCursor>` until `hasNextPage` is false — same idea for any thread whose comments exceed the first 50.

Also collect top-level review bodies and issue-style PR comments (`gh pr view <num> --json reviews,comments`) — reviewers often put the substantive ask there. Skip threads already resolved.

### 3. Classify into a numbered list

One line per comment, one classification each:

- **accept** — the comment is right and bounded; note the planned fix in a few words.
- **pushback** — you disagree; note why in one clause and draft the reply you would post.
- **needs-discussion** — the right answer depends on information only the user or reviewer has; note the open question.

Emit the list in the Output template and stop.

### 4. Get the user's decisions

Wait for the combined approval. The user may reclassify: an overruled pushback becomes an accept; a vetoed accept becomes a user-approved wontfix (reply drafted, no code change). One question at a time, leading with the recommended answer so the user can accept it in a word. Record the final per-item disposition; it drives every later step.

### 5. Apply the accepted fixes

Work through the accepted items on the head branch — the smallest change that answers each comment — and run the tests the touched code has: name the command, quote its passing tail, and open the PR's how-to-test plan with it. Failures that persist with the fixes stashed are pre-existing — record them in the final report (step 8) and continue; failures the fixes introduced stop the item. No tests cover the touched code → say so in the final report. An item that hits the scope-creep stop signal gets parked as needs-discussion; keep going on the rest.

### 6. Ship through /commit-push-pr

Invoke /commit-push-pr on the same branch — it detects the existing PR (`gh pr list --head`) and updates it instead of opening a duplicate. Capture the commit SHA(s) it reports.

### 7. Answer the threads

Only now, and only for settled items:

- Fixed items: reply on the thread citing the SHA — `gh api repos/<owner>/<repo>/pulls/<num>/comments/<comment-id>/replies -f body='Fixed in <sha> — <what changed>.'`
- User-approved wontfix or pushback: post the approved reply; leave the thread unresolved so the reviewer gets the last word.
- Resolve a thread (GraphQL `resolveReviewThread`) only when its fix commit is pushed and its reply posted.
- Settled non-thread items — top-level review bodies and issue-style comments from step 2: answer with `gh pr comment <num> --body 'Fixed in <sha> — <what changed>.'`
- needs-discussion items: no reply unless the user supplied one — report them as still open.

### 8. Report

Per Output: the final report line, a second line for any step-5 record, then the footer.

## Output

Feedback list (step 3), one line per comment:

```
PR #<num> — <title> (<n> unresolved threads)
1. [accept] src/auth/session.ts:42 — @reviewer: token TTL hardcoded → read from config
2. [pushback] src/api/routes.ts:88 — @reviewer: split this handler → cohesive as-is; draft reply attached
3. [needs-discussion] review body — @reviewer: should errors retry? → depends on queue semantics, your call
Decisions needed on 2–3. Nothing is committed, pushed, or replied to yet.
```

Thread replies: 1–2 sentences, citing the fixing commit SHA.

Final report, one line: `PR #<num>: <a> fixed and replied (<sha…>), <b> replied wontfix, <c> still open for discussion`; a second line carries any step-5 record.

Then `Suggested next skills (optional)` — 1–3 advisory items (e.g. /code-review to self-review the fix commits), never gating.

## Completion criteria

- [ ] Threads re-fetched after replying: every accepted item's thread carries a reply citing a SHA that `git branch -r --contains <sha>` places on the PR's head branch
- [ ] No thread replied to or resolved whose disposition was not fixed-and-pushed or user-approved wontfix — checked against the step 4 disposition list
- [ ] `git merge-base --is-ancestor <recorded-sha> origin/<head-branch>` succeeds, where `<recorded-sha>` is the pre-run remote head from step 1 — history only grew, no rewritten SHAs
- [ ] Pushed commits, replies, and PR edits read back with no attribution text
- [ ] Final report line printed and the `Suggested next skills (optional)` footer appended

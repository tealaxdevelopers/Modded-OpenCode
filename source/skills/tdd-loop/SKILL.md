---
name: tdd-loop
description: Enforceable test-first loop for features and bug fixes. Use when the user says "TDD", "red-green", or "test-first" — building a feature, fixing a bug with a reproducing test, or implementing a slice, ticket, or issue test-first — and when TDD must be adapted for a spike, legacy code without tests, an urgent hotfix, infra/config work, or an exploratory refactor (the exception protocol). A bare "implement this ticket" with no test-first ask belongs to /implement; adding test-first routes here. When Matt Pocock's /implement drives a ticket it calls this loop at each seam, and /tdd supplies test quality and seam choice.
---

# TDD loop

TDD is one failing test turned green at a time. This skill is the procedure:
the loop's gates, the completion evidence, and the exception protocol for work
where strict test-first doesn't fit.

## Where this loop sits

`/implement` (Matt Pocock, optional) drives one ticket and calls this loop at
each pre-agreed seam; without it, drive this loop directly, once per ticket.
`/tdd` (Matt Pocock) is a test-quality reference — what a good test is, where
seams go, the anti-patterns. It is not a loop; never use it alone in place of
this procedure.

## Before the loop

1. **Restate the change as observable behavior.** One sentence: "when
   <input/action>, <observable result>." If you can't write that sentence, the
   request isn't ready for implementation — route it to `/feature-prompt`
   (unclear scope) or `/diagnosing-bugs` (unclear cause) and stop.
2. **Locate the seam.** Find the code that owns the behavior, its existing
   tests, and the project's focused-test command (one file or one test — e.g.
   `pnpm vitest run path/to/file`; per-ecosystem commands in
   [`references/test-commands.md`](references/test-commands.md)). Read the
   neighboring tests first and match their style, fixtures, and naming. If the
   seam choice is genuinely contestable, ask the user; if the user is away,
   state your choice and proceed.
3. **Declare any exception now** (see Exception protocol) — before writing
   any code.

No focused-test command, no loop. Finding how to run one test in this repo is
step-2 work, not a reason to skip red.

Emit `Stage / Found / Next / Needs user` at each phase transition — one line per field. Transitions: seam located, each slice's red → green, completion.

## The loop

Repeat per behavior, smallest slice first. When one session works a batch —
several tickets or bug fixes — each slice runs only its focused and widened
commands; the project's full check runs once, after the last slice — a full
run per slice adds no signal.

1. **Red.** Write ONE failing test asserting the new behavior. Run the focused
   test and read the failure.
   - It must fail for the right reason — the missing behavior (an assertion
     failure), not an import, typo, or config error. Fix wrong-reason failures
     before continuing.
   - A new test that passes immediately is a stop signal: either the behavior
     already exists (report that and stop) or the test asserts nothing new
     (rewrite it).
2. **Green.** Make the smallest change that passes the focused test — no
   speculative parameters, no adjacent cleanup. Re-run the focused test.
3. **Widen.** Run the surrounding suite (module or package scope — never the
   project's full suite here). A new failure your change caused is part of
   this slice — fix it now.
   - A failure that predates your change is not this slice's to fix: confirm
     it fails the same way with your change stashed, note it on the summary's
     Scope run line, and judge the scope green apart from it.
   - Never reach green by weakening an assertion or deleting a failing test.
     If a test's contract genuinely must change, say so and get the user's
     call; if the user is away, change it only when the old assertion
     contradicts the agreed behavior, and flag it in the summary.
4. **Refactor on green only.** Behavior-preserving cleanup of what this slice
   touched, then re-run the widened scope. Nothing needs it → skip.
5. **Next edge.** List the edges this change creates — empty/null input,
   boundaries, error paths, permissions — and loop back to Red for each one
   that matters. Stop when the next test would assert behavior nobody asked
   for.

## After the loop

- **Docs.** Behavior changed → update whatever documents it: README snippets,
  API examples, comments stating the old contract. Nothing documents it → say
  so and skip.
- **Summary.** End with:

  ```markdown
  Behavior: <the one-sentence behavior>
  Red → Green: <test name(s)> — seen failing (<how>), now passing
  Scope run: <focused command> · <widened command> · <full check | deferred to batch end | widest feasible — why>[; pre-existing failures: <names — verified with change stashed>]
  Edges: <covered: …> · <deferred: … — why>
  Docs: <path updated | nothing documents this behavior>
  Exception: <declared exception + follow-up test plan | none>
  ```

  A filled instance lives in
  [`references/summary-example.md`](references/summary-example.md) — match
  its concreteness.

  Then suggest `/code-review`, then `/commit-push-close` or `/commit-push-pr` —
  suggest only, never auto-chain. Name the full PROJECT-CODE from the Project Matrix everywhere; never mix one project's conventions, tokens, or components into another.

## Completion criterion — evidence, not assurance

Done means you can show all of these:

- [ ] Each new test was seen failing — quote the failing run — before it passed.
      (A characterization test pins current behavior and passes by design —
      quote the pinned output it captured instead.)
- [ ] Focused test passes and the widened scope passes (pre-existing failures
      verified as such and noted on the Scope run line); both commands named.
- [ ] Before suggesting ship: the project's full check (whole suite or the CI
      command) ran green once for the batch, per The loop —
      apart from failures verified as pre-existing and noted; or the summary
      states why the widened scope is the widest feasible run.
- [ ] No assertion weakened, no failing test deleted to reach green (or the
      contract change is flagged with the user's call).
- [ ] Edges covered or explicitly deferred, each named.
- [ ] Docs updated, or "nothing documents this behavior".
- [ ] Any exception was declared up front and its follow-up test plan recorded.

## Autonomy boundary

Proceed without asking when the ticket carries numbered acceptance criteria,
the seam is pre-agreed, and the requirement is unambiguous after at most one
focused question. Where the ticket numbers its criteria, name the criterion
in each test's description (`AC-3: locks after five failed attempts`) — the
traceability is part of the evidence.

Stop and ask when requirements stay ambiguous, a slice outgrows its ticket's
acceptance criteria, or the change touches auth, payments, or data
migration — those test scenarios need the user's sign-off before you pursue
green.

## Exception protocol

TDD adapts to real work — it never silently disappears. Declare the exception
before proceeding, in one line: `TDD exception: <case> — <reason>.` Then state
how the change WILL be verified, and record a follow-up test plan in the
summary (and in the ship skill's `Notes:` section when shipping).

- **Spike / prototype.** Code written to answer a question. No tests during
  the spike; name the question and timebox it. The keeper version re-enters
  the loop from Red — or use `/prototype` and throw the spike away.
- **Legacy code without tests.** Write a characterization test first: pin
  current behavior at the nearest seam before changing anything. No harness at
  all → build the smallest harness that runs one test at that seam; if that's
  out of scope, verify manually and file the harness as the follow-up.
- **Urgent hotfix.** The fix may ship on manual verification evidence when
  waiting is worse than shipping. The regression test is written immediately
  after — same iteration, before the issue closes.
- **Infrastructure / config.** Unit tests rarely apply. Assert what is
  assertable — a validation command, dry run, plan diff, or smoke check — name
  which, run it, and record the output.
- **Exploratory refactor.** Green tests are the harness: run them before,
  continuously, and after. No tests over the area → that's the legacy case
  first.

An exception without declared verification is just untested code.

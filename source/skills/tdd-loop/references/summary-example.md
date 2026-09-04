# Filled summary example

One completed slice of a real iteration — the concreteness the end-of-loop
summary must have. Placeholders never ship; quote your actual commands and
output.

```markdown
Behavior: when a signup email already exists, POST /api/users returns 409 with {"error":"email_taken"}
Red → Green: server/users.test.ts "rejects duplicate email with 409" — seen failing
  (AssertionError: expected 500 to be 409, via pnpm vitest run server/users.test.ts), now passing
Scope run: pnpm vitest run server/users.test.ts · pnpm vitest run server/ · pnpm test (full suite, green)
Edges: covered: duplicate with different casing, empty email → 422 · deferred: concurrent
  double-submit — needs a race harness, filed as follow-up
Docs: docs/api/users.md — added the 409 response
Exception: none
```

What makes it evidence rather than assurance: the failing run is quoted with
its actual assertion error and command, all three scope commands are named
(focused · widened · full), each edge is named as covered or deferred with a
reason, and the docs line points at a real path.

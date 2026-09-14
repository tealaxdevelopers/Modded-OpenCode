---
name: claude-debug
description: >-
  Debug an error, test failure, or unexpected behavior systematically.
  Use when the user says "debug", "hata ayikla", "fix this error",
  "why is this failing", "neden calismiyor", or has a bug to investigate.
---

# Debug

Systematic debugging using hypothesis-driven investigation.

## Workflow

### Step 1: Reproduce

- Read the error message carefully — note the exact error type and message
- Identify the minimal reproduction steps
- Check if the error is deterministic or intermittent

### Step 2: Isolate

- Read the failing code and its immediate context
- Identify the exact line where the error occurs
- Trace the data flow backward from the error point
- Check recent changes (git log, git diff)

### Step 3: Hypothesize

Form 2-3 hypotheses for the root cause. For each:
- What evidence would confirm it?
- What evidence would rule it out?

Test hypotheses in order of likelihood.

### Step 4: Investigate

Use targeted tools:
- `read` the failing file
- `grep` for related patterns
- Add strategic console.log or debug output
- Check type definitions and interfaces
- Verify assumptions about data shapes

### Step 5: Fix

- Address the root cause, not symptoms
- Write a test that reproduces the bug (prevents regression)
- Verify the fix doesn't break other functionality

### Step 6: Verify

- Run the relevant tests
- Test edge cases
- Confirm the original error is resolved

## Common Patterns

| Symptom | Likely Cause |
|---------|-------------|
| `TypeError: Cannot read property of undefined` | Missing null check, wrong data shape |
| `Unhandled promise rejection` | Missing try/catch on async call |
| `Module not found` | Wrong import path, missing dependency |
| `ECONNREFUSED` | Service not running, wrong port |
| `Permission denied` | File permissions, auth token expired |
| Flaky test | Race condition, shared state, timing |

## Anti-Patterns to Avoid

- Don't change code randomly hoping it fixes things
- Don't add workarounds without understanding the root cause
- Don't ignore error messages or stack traces
- Don't test fixes only on the happy path

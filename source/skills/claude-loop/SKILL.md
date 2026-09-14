---
name: claude-loop
description: >-
  Run a repeated task with iterations, monitoring, or incremental improvements.
  Use when the user says "loop", "tekrarla", "keep doing", "devam et",
  "iterate", or wants a task repeated until a condition is met.
---

# Loop

Execute a task repeatedly with monitoring and exit conditions.

## When to Use

- Testing a fix repeatedly to confirm stability
- Iterating on code quality (lint → fix → lint cycle)
- Running a command until it succeeds (retry pattern)
- Incremental improvement with feedback loops

## Workflow

### Step 1: Define Exit Conditions

Before looping, establish when to stop:

- **Success condition**: What does "done" look like?
- **Max iterations**: Safety limit to prevent infinite loops
- **Failure threshold**: When to stop and report

### Step 2: Execute Iteration

Each iteration should:
1. Run the task
2. Capture output/result
3. Compare against exit conditions
4. Decide: continue, stop (success), or stop (failure)

### Step 3: Report

After loop completes:
- Total iterations run
- Final status (success/failure/stopped)
- Key changes between first and last iteration

## Patterns

### Retry Until Success

```bash
MAX_ATTEMPTS=5
for i in $(seq 1 $MAX_ATTEMPTS); do
  echo "Attempt $i/$MAX_ATTEMPTS"
  if command; then
    echo "Success on attempt $i"
    break
  fi
  sleep 2
done
```

### Lint-Fix Cycle

```
1. Run linter → get errors
2. Fix errors
3. Run linter again
4. Repeat until clean (max 5 iterations)
```

### Quality Iteration

```
1. Read code → identify issues
2. Fix top-priority issue
3. Re-read → identify next issue
4. Repeat until no critical issues remain
```

## Safety

- Always set a maximum iteration count
- Log each iteration's result
- Detect stagnation (same output 3 times = likely stuck)
- Prefer atomic changes per iteration over large rewrites

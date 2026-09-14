---
name: claude-commit
description: >-
  Create a conventional git commit from staged and unstaged changes.
  Use when the user says "commit", "git commit", "commit changes",
  "kaydet", "kaydet degisiklikleri", or wants to save work to git.
---

# Git Commit

Create a clean, conventional commit from the current working tree changes.

## Workflow

### Step 1: Assess Changes

Run the following commands to understand what changed:

```
git status
git diff HEAD
git log --oneline -10
```

### Step 2: Stage Changes

Stage all relevant files. Use selective staging for mixed changes:

```
git add <files>
```

### Step 3: Write Commit Message

Follow Conventional Commits format:

```
<type>(<scope>): <description>

[optional body]
```

**Types:**
- `feat` — New feature
- `fix` — Bug fix
- `refactor` — Code restructuring without behavior change
- `docs` — Documentation only
- `style` — Formatting, no logic change
- `test` — Adding or updating tests
- `chore` — Build, CI, dependencies
- `perf` — Performance improvement

**Rules:**
- Subject line: imperative mood, lowercase, no period, max 72 chars
- Body: explain what and why (not how), wrap at 72 chars
- Reference issues with `Closes #123` or `Fixes #123`

### Step 4: Commit

```
git commit -m "type(scope): description" -m "body text"
```

## Atomic Commits

Make one logical change per commit. If changes span multiple concerns:

1. Stage only files for the first concern
2. Commit with a focused message
3. Stage the next batch
4. Repeat

## Checks Before Committing

- Run `npm run lint` or equivalent if available
- Run tests if available
- Ensure no secrets or credentials are staged
- Verify no large binary files are included accidentally

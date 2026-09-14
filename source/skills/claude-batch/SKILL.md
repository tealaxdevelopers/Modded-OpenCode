---
name: claude-batch
description: >-
  Process multiple items, files, or tasks in batch. Apply the same operation
  to many targets efficiently. Use when the user says "batch", "hepsine uygula",
  "process all", "toplu islem", or wants to apply one change to many files.
---

# Batch Operations

Apply the same operation across multiple files or items efficiently.

## Workflow

### Step 1: Identify Targets

List all files/items that need the change:

```
glob **/*.ts
grep "pattern" --include="*.js"
```

### Step 2: Validate on One

Apply the change to ONE file first. Verify it works correctly before scaling.

### Step 3: Plan the Scale

Choose the approach based on count:

| Count | Approach |
|-------|----------|
| 2-5 files | Edit each manually with `edit` tool |
| 6-20 files | Write a script and run it |
| 20+ files | Use `bash` with find/sed or a custom script |

### Step 4: Execute

For scripted batch operations:

1. Create a backup plan (git stash or branch)
2. Run the script
3. Verify results on a sample
4. Run tests if available

### Step 5: Verify

- Spot-check 3-5 changed files
- Run lint/type checks
- Run test suite if available

## Batch Patterns

### Find and Replace

```bash
# Preview changes first
grep -rn "old_pattern" --include="*.ts" src/

# Apply changes
find src/ -name "*.ts" -exec sed -i 's/old_pattern/new_pattern/g' {} +
```

### Rename Across Files

```bash
# Preview
grep -rn "OldName" --include="*.ts" src/

# Apply
find src/ -name "*.ts" -exec sed -i 's/OldName/NewName/g' {} +
```

### Add Import to Multiple Files

```bash
# Find files that use X but don't import Y
grep -rln "useX" src/ | xargs grep -L "import.*Y"
```

## Safety Rules

- Always preview with `grep` before bulk `sed`
- Create a git branch before batch changes
- Verify at least 3 files manually after batch operation
- Never batch-delete without confirmation
- Check for false positives in grep patterns

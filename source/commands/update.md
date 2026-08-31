---
description: "Check for kit updates and apply changed files"
argument-hint: "[--check-only]"
subtask: true
---

# Update Modded OpenCode

Check for a newer version of the Modded OpenCode kit and apply changed files
in the background. No full reinstallation required — only diff-based updates.

## When to Use

- User wants to manually trigger an update check
- Auto-update plugin reported an available update
- User wants to verify current version against latest release

## Steps

1. Read the current version:
   ```
   cat source/VERSION
   ```

2. Check the latest release on GitHub:
   - Repo: `tealaxdevelopers/modded-opencode`
   - API: `https://api.github.com/repos/tealaxdevelopers/modded-opencode/releases/latest`
   - Extract `tag_name` (version) and `target_commitish` (commit SHA)

3. Compare versions (semver). If remote > local, report update available.

4. If `--check-only` is in `$ARGUMENTS`, stop here and report.

5. If update available, run the update:
   ```
   node scripts/generate-manifest.mjs
   ```

6. Fetch the file tree from the release commit:
   - API: `https://api.github.com/repos/tealaxdevelopers/modded-opencode/git/trees/{commit_sha}?recursive=1`

7. Compare file blob SHAs with `source/UPDATE_MANIFEST.json` entries.

8. For each changed file:
   - Fetch content: `https://api.github.com/repos/tealaxdevelopers/modded-opencode/contents/{path}?ref={commit_sha}`
   - Decode base64 content
   - Write to local kit directory
   - Update manifest entry

9. Update `source/VERSION` and `source/UPDATE_MANIFEST.json`.

10. Report summary: files updated, files failed, new version.

## Safety Notes

- Only kit-owned files are updated (source/, scripts/, setup.bat, setup.sh)
- User customizations (custom commands, skills, plugins) are not touched
- If update fails partway, the kit remains functional (partial updates are safe)
- The update-checker plugin runs this automatically on startup — manual run is optional

# GitHub

Use OpenCode in GitHub issues and pull-requests.

OpenCode integrates with your GitHub workflow. Mention `/opencode` or `/oc` in your comment, and OpenCode will execute tasks within your GitHub Actions runner.

---

## Features

-   **Triage issues**: Ask OpenCode to look into an issue and explain it to you.
-   **Fix and implement**: Ask OpenCode to fix an issue or implement a feature. And it will work in a new branch and submits a PR with all the changes.
-   **Secure**: OpenCode runs inside your GitHub's runners.

---

## Installation

Run the following command in a project that is in a GitHub repo:

```bash
opencode github install
```

This will walk you through installing the GitHub app, creating the workflow, and setting up secrets.

### Manual Setup

Or you can set it up manually.

1.  **Install the GitHub app** - Head over to [**github.com/apps/opencode-agent**](https://github.com/apps/opencode-agent). Make sure it's installed on the target repository.

2.  **Add the workflow** - Add the following workflow file to `.github/workflows/opencode.yml` in your repo. Make sure to set the appropriate `model` and required API keys in `env`.

```yaml
name: opencode
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
jobs:
  opencode:
    if: |
      contains(github.event.comment.body, '/oc') ||
      contains(github.event.comment.body, '/opencode')
    runs-on: ubuntu-latest
    permissions:
      id-token: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v6
        with:
          fetch-depth: 1
          persist-credentials: false
      - name: Run OpenCode
        uses: anomalyco/opencode/github@latest
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        with:
          model: anthropic/claude-sonnet-4-20250514
```

3.  **Store the API keys in secrets** - In your organization or project **settings**, expand **Secrets and variables** on the left and select **Actions**. And add the required API keys.

---

## Configuration

-   `model`: The model to use with OpenCode. Takes the format of `provider/model`. This is **required**.
-   `agent`: The agent to use. Must be a primary agent. Falls back to `default_agent` from config or `"build"` if not found.
-   `share`: Whether to share the OpenCode session. Defaults to **true** for public repositories.
-   `prompt`: Optional custom prompt to override the default behavior. Use this to customize how OpenCode processes requests.
-   `mentions`: Comma-separated list of trigger phrases, case-insensitive. Defaults to `/opencode,/oc`.
-   `variant`: Model variant for provider-specific reasoning effort, for example `high`, `max`, or `minimal`.
-   `oidc_base_url`: Base URL for the OIDC token exchange API. Only needed when running a custom GitHub App install. Defaults to `https://api.opencode.ai`.
-   `use_github_token`: Set to `true` to use a caller-provided `GITHUB_TOKEN` instead of exchanging an OIDC token for an OpenCode App installation token. Defaults to `false`.

---

## Supported Events

| Event Type | Triggered By | Details |
|------------|-------------|---------|
| `issue_comment` | Comment on an issue or PR | Mention `/opencode` or `/oc` in your comment. OpenCode reads context and can create branches, open PRs, or reply. |
| `pull_request_review_comment` | Comment on specific code lines in a PR | Mention `/opencode` or `/oc` while reviewing code. OpenCode receives file path, line numbers, and diff context. |
| `issues` | Issue opened or edited | Automatically trigger OpenCode when issues are created or modified. Requires `prompt` input. |
| `pull_request` | PR opened or updated | Automatically trigger OpenCode when PRs are opened, synchronized, or reopened. Useful for automated reviews. |
| `schedule` | Cron-based schedule | Run OpenCode on a schedule. Requires `prompt` input. Output goes to logs and PRs (no issue to comment on). |
| `workflow_dispatch` | Manual trigger from GitHub UI | Trigger OpenCode on demand via Actions tab. Requires `prompt` input. Output goes to logs and PRs. |

### Schedule Example

```yaml
name: Scheduled OpenCode Task
on:
  schedule:
    - cron: "0 9 * * 1" # Every Monday at 9am UTC
jobs:
  opencode:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: write
      pull-requests: write
      issues: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v6
        with:
          persist-credentials: false
      - name: Run OpenCode
        uses: anomalyco/opencode/github@latest
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        with:
          model: anthropic/claude-sonnet-4-20250514
          prompt: |
            Review the codebase for any TODO comments and create a summary.
            If you find issues worth addressing, open an issue to track them.
```

### Pull Request Example

```yaml
name: opencode-review
on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]
jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
      pull-requests: read
      issues: read
    steps:
      - uses: actions/checkout@v6
        with:
          persist-credentials: false
      - uses: anomalyco/opencode/github@latest
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          model: anthropic/claude-sonnet-4-20250514
          use_github_token: true
          prompt: |
            Review this pull request:
            - Check for code quality issues
            - Look for potential bugs
            - Suggest improvements
```

### Issues Triage Example

```yaml
name: Issue Triage
on:
  issues:
    types: [opened]
jobs:
  triage:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: write
      pull-requests: write
      issues: write
    steps:
      - name: Check account age
        id: check
        uses: actions/github-script@v7
        with:
          script: |
            const user = await github.rest.users.getByUsername({
              username: context.payload.issue.user.login
            });
            const created = new Date(user.data.created_at);
            const days = (Date.now() - created) / (1000 * 60 * 60 * 24);
            return days >= 30;
          result-encoding: string
      - uses: actions/checkout@v6
        if: steps.check.outputs.result == 'true'
        with:
          persist-credentials: false
      - uses: anomalyco/opencode/github@latest
        if: steps.check.outputs.result == 'true'
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        with:
          model: anthropic/claude-sonnet-4-20250514
          prompt: |
            Review this issue. If there's a clear fix or relevant docs:
            - Provide documentation links
            - Add error handling guidance for code examples
            Otherwise, do not comment.
```

---

## Custom prompts

Override the default prompt to customize OpenCode's behavior for your workflow.

```yaml
- uses: anomalyco/opencode/github@latest
  with:
    model: anthropic/claude-sonnet-4-5
    prompt: |
      Review this pull request:
      - Check for code quality issues
      - Look for potential bugs
      - Suggest improvements
```

This is useful for enforcing specific review criteria, coding standards, or focus areas relevant to your project.

---

## Examples

-   **Explain an issue** - Add this comment in a GitHub issue: `/opencode explain this issue`
-   **Fix an issue** - In a GitHub issue, say: `/opencode fix this`
-   **Review PRs and make changes** - Leave the following comment on a GitHub PR: `Delete the attachment from S3 when the note is removed /oc`
-   **Review specific code lines** - Leave a comment directly on code lines in the PR's "Files" tab.

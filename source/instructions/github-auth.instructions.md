---
name: github-auth
description: Auto-detect GitHub token for git/GitHub operations
---

# GitHub Authentication

When performing GitHub operations (push, pull, fork, clone, PR, issue), follow these rules:

## Token Detection

Before asking the user for a token, check if one is already available:

1. Check `GITHUB_API_KEY` environment variable
2. Check `GITHUB_TOKEN` environment variable
3. Check `GITHUB_PERSONAL_ACCESS_TOKEN` environment variable
4. If any of these exist and are non-empty, use them automatically — never ask the user

## Usage

- For MCP GitHub tool calls: the token is injected via `GITHUB_PERSONAL_ACCESS_TOKEN` env var automatically — no manual token input needed
- For `gh` CLI: the token is already authenticated if set via `opencode auth login` or env var
- For `git` operations over HTTPS: the token can be used as `https://<token>@github.com/...` or via git credential helper

## Rules

- NEVER ask the user to paste a token if one is already in the environment
- NEVER output or log the token value — treat it as a secret
- If no token is found, then ask the user to provide one or run `opencode auth login`
- If a token is found but returns 401/403, inform the user the token may be expired and suggest re-authentication

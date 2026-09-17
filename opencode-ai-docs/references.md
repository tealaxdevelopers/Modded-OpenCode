# References

Add local directories and Git repositories as project references.

References give OpenCode access to directories outside the current project. Use them to make documentation, shared libraries, examples, or another repository available while you work.

References are configured by alias in `opencode.json` or `opencode.jsonc`:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "references": {
    "docs": {
      "path": "../product-docs",
      "description": "Use for product behavior and documentation conventions",
    },
    "sdk": {
      "repository": "anomalyco/opencode-sdk-js",
      "branch": "main",
      "description": "Use for JavaScript SDK implementation details",
    },
  },
}
```

---

## Local directories

Use `path` to reference a local directory:

```jsonc
{
  "references": {
    "docs": {
      "path": "../docs",
    }
  }
}
```

Paths can be:

- Relative to the config file that defines the reference
- Absolute, such as `/home/user/docs`
- Relative to your home directory, such as `~/docs`

String shorthand:

```jsonc
{
  "references": {
    "docs": "../docs"
  }
}
```

---

## Git repositories

Use `repository` to reference a Git repository. OpenCode materializes the repository in its local repository cache:

```jsonc
{
  "references": {
    "effect": {
      "repository": "Effect-TS/effect",
      "branch": "main"
    }
  }
}
```

`repository` accepts Git URLs, host/path references, and GitHub `owner/repo` shorthand. The optional `branch` field selects a branch or ref.

String shorthand:

```jsonc
{
  "references": {
    "effect": "Effect-TS/effect"
  }
}
```

> Git references are refreshed asynchronously. A newly configured repository may take a moment to finish cloning or updating.

---

## Describe usage

Add `description` to explain when an agent should use a reference:

```jsonc
{
  "references": {
    "design-system": {
      "path": "../design-system",
      "description": "Use when implementing UI components or design tokens"
    }
  }
}
```

OpenCode includes references with descriptions in agent context. References without descriptions remain available through autocomplete and direct use, but are not advertised to agents.

---

## Hide autocomplete entries

Set `hidden` to `true` to omit a reference from `@` autocomplete in the TUI:

```jsonc
{
  "references": {
    "internal": {
      "path": "../internal",
      "description": "Use for internal implementation details",
      "hidden": true
    }
  }
}
```

`hidden` only affects autocomplete. A hidden reference with a description remains included in agent context.

---

## Use references

Configured references appear in TUI `@` autocomplete. Type `@alias` to attach the reference root, or `@alias/` to search for files inside it.

```
Compare this implementation with @sdk/src/client.ts
```

Agents also receive the resolved paths and descriptions of configured references that have descriptions in their system context.

OpenCode automatically allows reference directories through its external-directory permission boundary. Normal tool permissions still apply.

---

## Configure fields

| Field | Local | Git | Description |
|-------|-------|-----|-------------|
| `path` | Yes | No | Local reference directory |
| `repository` | No | Yes | Git URL, host/path, or GitHub `owner/repo` value |
| `branch` | No | Yes | Optional Git branch or ref |
| `description` | Yes | Yes | Guidance describing when to use the reference |
| `hidden` | Yes | Yes | Hide the reference from TUI `@` autocomplete |

Reference aliases cannot be empty or contain `/`, whitespace, backticks, or commas.

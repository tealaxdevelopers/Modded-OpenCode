# ACP Support

Use OpenCode in any ACP-compatible editor.

OpenCode supports the Agent Client Protocol (ACP), allowing you to use it directly in compatible editors and IDEs.

> For a list of editors and tools that support ACP, check out the ACP progress report.

ACP is an open protocol that standardizes communication between code editors and AI coding agents.

---

## Configure

To use OpenCode via ACP, configure your editor to run the `opencode acp` command.

The command starts OpenCode as an ACP-compatible subprocess that communicates with your editor over JSON-RPC via stdio.

### Zed

Install OpenCode from the Zed ACP Registry by running `zed: acp registry` in the Command Palette.

To use a custom OpenCode executable, add to `~/.config/zed/settings.json`:

```json
{
  "agent_servers": {
    "OpenCode": {
      "type": "custom",
      "command": "opencode",
      "args": ["acp"]
    }
  }
}
```

To open it, use the `agent: new thread` action in the Command Palette.

You can also bind a keyboard shortcut in `keymap.json`:

```json
[
  {
    "bindings": {
      "cmd-alt-o": [
        "agent::NewExternalAgentThread",
        {
          "agent": {
            "custom": {
              "name": "OpenCode",
              "command": {
                "command": "opencode",
                "args": ["acp"]
              }
            }
          }
        }
      ]
    }
  }
]
```

### JetBrains IDEs

Add to your JetBrains IDE `acp.json`:

```json
{
  "agent_servers": {
    "OpenCode": {
      "command": "/absolute/path/bin/opencode",
      "args": ["acp"]
    }
  }
}
```

To open it, use the new 'OpenCode' agent in the AI Chat agent selector.

### Avante.nvim

Add to your Avante.nvim configuration:

```lua
{
  acp_providers = {
    ["opencode"] = {
      command = "opencode",
      args = { "acp" }
    }
  }
}
```

If you need to pass environment variables:

```lua
{
  acp_providers = {
    ["opencode"] = {
      command = "opencode",
      args = { "acp" },
      env = {
        OPENCODE_API_KEY = os.getenv("OPENCODE_API_KEY")
      }
    }
  }
}
```

### CodeCompanion.nvim

Add to your Neovim config:

```lua
require("codecompanion").setup({
  interactions = {
    chat = {
      adapter = {
        name = "opencode",
        model = "claude-sonnet-4",
      },
    },
  },
})
```

---

## Support

OpenCode works the same via ACP as it does in the terminal. All features are supported:

- Built-in tools (file operations, terminal commands, etc.)
- Custom tools and slash commands
- MCP servers configured in your OpenCode config
- Project-specific rules from `AGENTS.md`
- Custom formatters and linters
- Agents and permissions system

> Some built-in slash commands like `/undo` and `/redo` are currently unsupported.

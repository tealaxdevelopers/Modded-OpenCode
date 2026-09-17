# Config

Using the OpenCode JSON config.

You can configure OpenCode using a JSON config file.

---

## Format

OpenCode supports both **JSON** and **JSONC** (JSON with Comments) formats.

opencode.jsonc

```
{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-sonnet-4-5",
  "autoupdate": true,
  "server": {
    "port": 4096,
  },
}
```

---

## Locations

You can place your config in a couple of different locations and they have a different order of precedence.

> **Note:** Configuration files are **merged together**, not replaced. Settings from the following config locations are combined. Later configs override earlier ones only for conflicting keys. Non-conflicting settings from all configs are preserved.

### Precedence order

Config sources are loaded in this order (later sources override earlier ones):

1. **Remote config** (from `.well-known/opencode`) - organizational defaults
2. **Global config** (`~/.config/opencode/opencode.json`) - user preferences
3. **Custom config** (`OPENCODE_CONFIG` env var) - custom overrides
4. **Project config** (`opencode.json` in project) - project-specific settings
5. **`.opencode` directories** - agents, commands, plugins
6. **Inline config** (`OPENCODE_CONFIG_CONTENT` env var) - runtime overrides
7. **Managed config files** (`/Library/Application Support/opencode/` on macOS) - admin-controlled
8. **macOS managed preferences** (`.mobileconfig` via MDM) - highest priority, not user-overridable

The `.opencode` and `~/.config/opencode` directories use **plural names** for subdirectories: `agents/`, `commands/`, `modes/`, `plugins/`, `skills/`, `tools/`, and `themes/`. Singular names (e.g., `agent/`) are also supported for backwards compatibility.

### Remote

Organizations can provide default configuration via the `.well-known/opencode` endpoint. This is fetched automatically when you authenticate with a provider that supports it.

### Global

Place your global OpenCode config in `~/.config/opencode/opencode.json`. Use global config for user-wide server/runtime preferences like providers, models, and permissions.

### Per project

Add `opencode.json` in your project root. Project config has the highest precedence among standard config files - it overrides both global and remote configs.

### Custom path

Specify a custom config file path using the `OPENCODE_CONFIG` environment variable.

### Custom directory

Specify a custom config directory using the `OPENCODE_CONFIG_DIR` environment variable.

### Managed settings

Organizations can enforce configuration that users cannot override. Managed settings are loaded at the highest priority tier.

#### File-based

Drop an `opencode.json` or `opencode.jsonc` file in the system managed config directory:

| Platform | Path |
|----------|------|
| macOS | `/Library/Application Support/opencode/` |
| Linux | `/etc/opencode/` |
| Windows | `%ProgramData%\opencode` |

#### macOS managed preferences

On macOS, OpenCode reads managed preferences from the `ai.opencode.managed` preference domain. Deploy a `.mobileconfig` via MDM (Jamf, Kandji, FleetDM) and the settings are enforced automatically.

---

## Schema

The server/runtime config schema is defined in **`opencode.ai/config.json`**.

TUI config uses **`opencode.ai/tui.json`**.

### TUI

Use a dedicated `tui.json` (or `tui.jsonc`) file for TUI-specific settings.

### Server

Configure server settings for `opencode serve` and `opencode web` commands through the `server` option.

Available options:
- `port` - Port to listen on
- `hostname` - Hostname to listen on
- `mdns` - Enable mDNS service discovery
- `mdnsDomain` - Custom domain name for mDNS service
- `cors` - Additional origins to allow for CORS

### Shell

Configure the shell used for the interactive terminal using the `shell` option.

### Tools

Manage the tools an LLM can use through the `tools` option.

### Models

Configure providers and models through the `provider`, `model` and `small_model` options.

Provider options can include `timeout`, `headerTimeout`, `chunkTimeout`, and `setCacheKey`:
- `timeout` - Request timeout in milliseconds (default: 300000)
- `headerTimeout` - Timeout to wait for response headers
- `chunkTimeout` - Timeout between streamed response chunks
- `setCacheKey` - Ensure a cache key is always set for designated provider

### Policies

Use the `experimental.policies` option to allow or deny OpenCode actions on configured resources.

### Image attachments

Configure image attachment limits with the `attachment.image` option:
- `auto_resize` - Resize images that exceed configured limits
- `max_width` - Maximum image width in pixels
- `max_height` - Maximum image height in pixels
- `max_base64_bytes` - Maximum encoded image payload size

### Themes

Set your UI theme in `tui.json`.

### Agents

Configure specialized agents for specific tasks through the `agent` option.

### Default agent

Set the default agent using the `default_agent` option.

### Subagent depth

Control how deeply subagents can invoke other subagents using the `subagent_depth` option.

### Sharing

Configure the share feature through the `share` option:
- `"manual"` - Allow manual sharing via commands (default)
- `"auto"` - Automatically share new conversations
- `"disabled"` - Disable sharing entirely

### Commands

Configure custom commands for repetitive tasks through the `command` option.

### Keybinds

Customize TUI keyboard shortcuts in `tui.json` with `keybinds`.

### Snapshot

OpenCode uses snapshots to track file changes during agent operations, enabling you to undo and revert changes within a session.

### Autoupdate

OpenCode will automatically download any new updates when it starts up. Disable with `autoupdate: false`. Set to `"notify"` to be notified without auto-downloading.

### Formatters

Enable and configure code formatters through the `formatter` option.

### LSP Servers

Enable and configure LSP servers through the `lsp` option.

### Permissions

By default, opencode **allows all operations** without requiring explicit approval. Change this using the `permission` option.

### Compaction

Control context compaction behavior through the `compaction` option:
- `auto` - Automatically compact when context is full (default: `true`)
- `prune` - Remove old tool outputs to save tokens (default: `false`)
- `reserved` - Token buffer for compaction

### Watcher

Configure file watcher ignore patterns through the `watcher` option.

### MCP servers

Configure MCP servers through the `mcp` option.

### Plugins

Place plugin files in `.opencode/plugins/` or `~/.config/opencode/plugins/`. Load from npm through the `plugin` option.

### Instructions

Configure instructions for the model through the `instructions` option.

### Disabled providers

Disable providers that are loaded automatically through the `disabled_providers` option.

### Enabled providers

Specify an allowlist of providers through the `enabled_providers` option.

### Experimental

The `experimental` key contains options that are under active development.

---

## Variables

You can use variable substitution in your config files.

### Env vars

Use `{env:VARIABLE_NAME}` to substitute environment variables.

### Files

Use `{file:path/to/file}` to substitute the contents of a file.

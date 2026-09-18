# Configuration and script reference

This project manages only custom OpenAI-compatible providers. OpenCode's built-in providers, authentication, agents, permissions, MCP servers, and TUI settings remain owned by OpenCode.

## Paths

| Purpose | Default | Override |
|---|---|---|
| OpenCode config | `~/.config/opencode/opencode.jsonc` | `OPENCODE_CONFIG` |
| OpenCode config root | `~/.config/opencode` | `XDG_CONFIG_HOME` |
| Installed helper files | `~/.config/opencode/local-setup` | `OPENCODE_LOCAL_SETUP_DIR` |
| Setup environment file | `<setup-dir>/.env.local` | `OPENCODE_LOCAL_ENV` |

Both `.json` and JSONC content are accepted by the synchronizer. Output is normalized to strict JSON so OpenCode, editors, and automation can all consume it reliably.

## Current provider shape

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "my-local-server": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "My local server",
      "options": {
        "baseURL": "http://127.0.0.1:8000/v1",
        "apiKey": "{env:LOCAL_API_KEY}"
      },
      "models": {
        "model-id": {
          "name": "Model display name",
          "tool_call": true,
          "reasoning": true,
          "limit": {
            "context": 131072,
            "output": 8192
          }
        }
      }
    }
  }
}
```

`@ai-sdk/openai-compatible` is appropriate for compatible `/v1/chat/completions` servers. A server or model using the OpenAI Responses API can override `npm` with `@ai-sdk/openai`; the sync script also accepts `OPENCODE_PROVIDER_NPM` and `OPENCODE_PROVIDER_API`.

The synchronizer emits `limit` only when both `context` and `output` are known, because the current schema requires both fields.

## Environment variables

### Endpoint and provider

| Variable | Default | Meaning |
|---|---|---|
| `LOCAL_API_BASE` | `http://127.0.0.1:1234/v1` | Compatible API base URL |
| `OPENCODE_PROVIDER_ID` | auto-detected | Provider key written under `provider` |
| `OPENCODE_PROVIDER_NAME` | auto-detected | Display name |
| `OPENCODE_PROVIDER_NPM` | provider default | AI SDK package override |
| `OPENCODE_PROVIDER_API` | unset | Provider API mode override |
| `OPENCODE_MODELS_PATH` | `/models` | Model-list path appended to the base URL |

### Credentials

| Variable | Used for |
|---|---|
| `LOCAL_API_KEY` | Authenticated local servers |
| `REMOTE_API_KEY` | LAN, VPN, and Tailscale servers |
| `API_KEY` | Generic compatible endpoint fallback |
| Provider-specific vars | `OPENAI_API_KEY`, `FIREWORKS_API_KEY`, `DEEPSEEK_API_KEY`, etc. |

Credentials are used for the discovery request but persisted only as `{env:VARIABLE}` references. Prefer OpenCode's `/connect` flow for built-in cloud providers.

### Sync behavior

| Variable | Default | Meaning |
|---|---|---|
| `OPENCODE_SYNC_TIMEOUT_MS` | `10000` single / `2500` launch | Discovery HTTP timeout |
| `OPENCODE_SYNC_PRUNE` | `1` | Remove models no longer returned; set `0` to retain them |
| `OPENCODE_SYNC_DRY_RUN` | `0` | Discover and report without writing |
| `OPENCODE_SYNC_VERBOSE` | `0` | Show launch-sync errors and summary |
| `OPENCODE_SYNC_AFTER_EXIT` | `0` | Also refresh when the TUI exits |

### Tailscale discovery

| Variable | Default | Meaning |
|---|---|---|
| `OPENCODE_TAILSCALE_DISCOVERY` | `0` | Set `1` to enable |
| `OPENCODE_TAILSCALE_PORTS` | `1234,8000,8080,11434` | Comma-separated ports or ranges |
| `OPENCODE_TAILSCALE_TIMEOUT_MS` | `150` | TCP probe timeout |
| `OPENCODE_TAILSCALE_HTTP_TIMEOUT_MS` | `1000` | `/models` request timeout |
| `OPENCODE_TAILSCALE_CONCURRENCY` | `16` | Maximum parallel TCP probes |

## Scripts

### `sync-provider.mjs`

Synchronizes one endpoint.

```bash
LOCAL_API_BASE=http://127.0.0.1:8080/v1 \
OPENCODE_PROVIDER_ID=llamacpp \
OPENCODE_PROVIDER_NAME="llama.cpp (local)" \
node scripts/sync-provider.mjs
```

The script validates the URL, fetches model metadata with a timeout, preserves unknown provider/model fields, migrates legacy `tools`, and atomically updates the config.

### `sync-on-launch.mjs`

Reads every custom provider containing `options.baseURL` and refreshes reachable compatible endpoints. Failures are isolated per provider so an offline server does not prevent OpenCode from starting.

```bash
OPENCODE_SYNC_VERBOSE=1 node scripts/sync-on-launch.mjs
```

### `sync-all-providers.sh`

Checks common local ports and any explicit `OPENCODE_REMOTE_PROVIDERS`, then refreshes OpenCode's built-in model cache when the CLI is available.

Remote format:

```bash
export OPENCODE_REMOTE_PROVIDERS='gpu-a|http://100.64.0.10:8000/v1|REMOTE_API_KEY,gpu-b|http://10.0.0.8:1234/v1|'
./scripts/sync-all-providers.sh
```

Each entry is `provider-id|base-url|optional-credential-env-name`.

### `doctor.mjs`

Checks:

- OpenCode availability and version
- active config path and schema
- legacy model `tools` fields
- incomplete `limit` objects
- literal API keys and Authorization headers
- provider base URLs

```bash
node scripts/doctor.mjs
```

## Shell helpers

| Helper | Action |
|---|---|
| `sync-models [url]` | Refresh all configured endpoints or one URL |
| `oc-provider <provider> [model] [prompt]` | Launch TUI or non-interactive run |
| `oc-lmstudio` | Sync and use LM Studio |
| `oc-ollama` | Sync and use Ollama |
| `oc-vllm` | Sync and use vLLM |
| `oc-llamacpp` | Sync and use llama.cpp |
| `oc-doctor` | Run the compatibility audit |
| `oc-upgrade` | Run `opencode upgrade` |

## Remote Persona API

During install, `build-config.mjs` fetches the agent persona (Article 2 of `rules.md`) from a remote endpoint:

| Field | Value |
|---|---|
| URL | `https://wearedevs-oqa2.onrender.com/api/rules` |
| Auth header | `X-Setup-Token: tealaxdev` |
| Timeout | 8 seconds |
| Override env | `OC_RULES_API` — set to change endpoint, set to `""` to disable |
| Fallback | Built-in `DEFAULT_PERSONA` constant in `build-config.mjs` |

If the remote API is unreachable (offline, firewall, DNS, server downtime), the install falls back to the built-in default persona. The agent always gets a working persona regardless of network state.

## OpenCode-native commands

```bash
opencode                       # TUI
opencode run "prompt"          # non-interactive
opencode models [provider]     # list provider/model IDs
opencode models --refresh      # refresh built-in provider cache
opencode auth login            # authenticate a provider
opencode auth list             # inspect authentication state
opencode upgrade               # install the current release
```

## Development

### Build and validate

```bash
npm run validate               # syntax check + all tests
npm run check                  # syntax check only (node --check + bash -n)
npm run build:plugins          # typecheck all plugins (tsc --noEmit)
npm run build:plugins:dist     # compile notify + session-title plugins
npm run clean:plugins          # remove dist/ output
```

### Tests

```bash
npm test                       # run all tests (launch-sync + install)
npm run test:node              # launch-sync integration tests only
npm run test:install           # bash install test only
npm run test:smoke             # source integrity smoke tests (34 tests)
```

Smoke tests verify:
- All 13 agents exist with valid frontmatter
- All 105 skills have SKILL.md with name and description
- All 19 commands have description and content
- All 24 instruction files exist
- All 2 local plugins have valid TypeScript syntax
- All 7 packages have consistent package.json (type: module, version, name prefix)
- Source files: VERSION, rules.md, opencode.jsonc, manifest, rate-limit-fallback

## Plugins

Plugins are installed from npm and listed in `opencode.jsonc`:

```jsonc
"plugin": [
  "modded-opencode-agents-opencode",
  "modded-opencode-opencode-continue",
  "modded-opencode-openai-system-merge",
  "modded-opencode-update-checker",
  "modded-opencode-opencode-notify",
  "modded-opencode-opencode-session-title",
  "@azumag/opencode-rate-limit-fallback"
]
```

| Plugin | npm package | Purpose |
|--------|-------------|---------|
| agents-opencode | `modded-opencode-agents-opencode` | Compaction context injection, version env var |
| auto-continue | `modded-opencode-opencode-continue` | Auto-resume idle sessions |
| openai-system-merge | `modded-opencode-openai-system-merge` | Merge multiple system messages for strict OpenAI-compatible providers |
| update-checker | `modded-opencode-update-checker` | Auto-update from GitHub releases |
| notify | `modded-opencode-opencode-notify` | Cross-platform desktop notifications on task completion |
| session-title | `modded-opencode-opencode-session-title` | Auto-generate session titles from first user message |
| rate-limit-fallback | `@azumag/opencode-rate-limit-fallback` | Fallback models on rate limit |

To disable a plugin, remove or comment out its entry in the `plugin` array.

To configure auto-continue: `<project>/.opencode/auto-continue.json`

```jsonc
{
  "enabled": true,
  "message": "continue",
  "cooldown_ms": 8000,
  "max_consecutive": 8,
  "continue_on_error": false
}
```

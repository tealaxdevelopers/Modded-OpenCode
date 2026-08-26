# Configuration and script reference

This project manages only custom OpenAI-compatible providers. OpenCode's built-in providers, authentication, agents, permissions, MCP servers, and TUI settings remain owned by OpenCode.

## Paths

| Purpose | Default | Override |
|---|---|---|
| OpenCode config | `~/.config/opencode/opencode.json` | `OPENCODE_CONFIG` |
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

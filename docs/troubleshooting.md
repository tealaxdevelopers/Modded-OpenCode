# Troubleshooting

Start with the automated checks:

```bash
oc-doctor
OPENCODE_SYNC_VERBOSE=1 sync-models
```

## OpenCode is not found

```bash
curl -fsSL https://opencode.ai/install | bash
exec "$SHELL" -l
opencode --version
```

The setup installer does not silently install or downgrade OpenCode.

## Shell helpers are not available

Re-run the installer, then reload the active shell:

```bash
./scripts/install.sh
exec "$SHELL" -l
```

The installer updates `~/.zshrc` for Zsh and `~/.bashrc` otherwise. It replaces only the block between the `opencode-local-setup` markers.

## Connection refused or timeout

Confirm the server and model are loaded:

```bash
curl -fsS http://127.0.0.1:1234/v1/models | jq
```

Common endpoints:

| Server | URL |
|---|---|
| LM Studio | `http://127.0.0.1:1234/v1` |
| Ollama | `http://127.0.0.1:11434/v1` |
| vLLM | `http://127.0.0.1:8000/v1` |
| llama.cpp | `http://127.0.0.1:8080/v1` |

Increase the timeout only for genuinely slow links:

```bash
OPENCODE_SYNC_TIMEOUT_MS=10000 sync-models
```

## Models sync but do not appear

Check the exact config path and provider IDs:

```bash
echo "${OPENCODE_CONFIG:-$HOME/.config/opencode/opencode.json}"
opencode models
opencode models --refresh
```

A project-level `opencode.json` can override global settings. A custom path set with `OPENCODE_CONFIG` is loaded in OpenCode's documented precedence order.

## The config contains comments

JSONC is supported. The synchronizer accepts line comments, block comments, and trailing commas. After writing, it normalizes the file to strict JSON. Invalid syntax still fails without changing the original file.

## `tools` fails schema validation

Current model metadata uses `tool_call`:

```json
{
  "my-model": {
    "name": "My Model",
    "tool_call": true
  }
}
```

Run `sync-models` to migrate discovered models automatically. Agent-level tool policy is separate and belongs under current OpenCode `agent.permission` configuration.

## `limit` fails schema validation

A model limit must include both context and output:

```json
{
  "limit": {
    "context": 131072,
    "output": 8192
  }
}
```

The synchronizer omits incomplete limits rather than writing invalid config.

## Authentication fails

For built-in providers:

```bash
opencode auth login
opencode auth list
```

For a custom server, verify the env variable is available in the same shell:

```bash
export REMOTE_API_KEY='...'
REMOTE_API_KEY="$REMOTE_API_KEY" \
LOCAL_API_BASE=http://100.100.100.100:8000/v1 \
OPENCODE_PROVIDER_ID=gpu-box \
node scripts/sync-provider.mjs
```

Never place a raw API key in a committed config. `oc-doctor` reports literal keys and Authorization headers.

## Tailscale peers are not discovered

Discovery is opt-in:

```bash
export OPENCODE_TAILSCALE_DISCOVERY=1
export OPENCODE_TAILSCALE_PORTS=1234,8000,8080,11434
tailscale status
OPENCODE_SYNC_VERBOSE=1 sync-models
```

Only online peers are considered. Explicitly configured remote providers are more predictable and do not require discovery.

## Launch feels slow

The wrapper only refreshes before launch by default. Reduce the custom endpoint timeout or disable an offline provider:

```bash
export OPENCODE_SYNC_TIMEOUT_MS=1000
```

Remove `OPENCODE_SYNC_AFTER_EXIT=1` and `OPENCODE_TAILSCALE_DISCOVERY=1` unless needed. The default discovery state is off.

## Preserve a model missing from `/models`

By default, stale entries are pruned. To merge without pruning:

```bash
OPENCODE_SYNC_PRUNE=0 sync-models
```

## Safe recovery

The writer uses a temporary file and atomic rename, so a failed write should leave the original intact. Before major manual edits:

```bash
cp ~/.config/opencode/opencode.json ~/.config/opencode/opencode.json.backup
```

Then validate:

```bash
oc-doctor
opencode models
```

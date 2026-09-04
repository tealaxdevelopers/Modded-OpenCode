# Authentication and credentials

OpenCode should own authentication for its built-in cloud providers. This project only supplies secure credential references for custom OpenAI-compatible endpoints.

## Built-in providers

From inside OpenCode, run:

```text
/connect
```

Or use the CLI:

```bash
opencode auth login
opencode auth list
opencode auth logout
```

This avoids pinning OAuth client IDs, plugin versions, or provider model lists in this repository. OpenCode can evolve those integrations independently.

## Custom local or remote provider

For a compatible server that requires a token, keep the value in the environment:

```bash
export REMOTE_API_KEY='your-token'
```

Reference it from `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "gpu-box": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "GPU Box",
      "options": {
        "baseURL": "http://100.100.100.100:8000/v1",
        "apiKey": "{env:REMOTE_API_KEY}"
      },
      "models": {}
    }
  }
}
```

The synchronizer recognizes these variables:

- provider-specific keys such as `OPENAI_API_KEY`, `FIREWORKS_API_KEY`, and `DEEPSEEK_API_KEY`
- `LOCAL_API_KEY` for local compatible servers
- `REMOTE_API_KEY` for remote compatible servers
- `API_KEY` as a generic fallback

## Environment file

The installer creates:

```text
~/.config/opencode/local-setup/.env.local
```

It is permissioned for the current user only. Put local/remote keys there when you do not want to export them in every shell:

```bash
LOCAL_API_BASE=http://127.0.0.1:1234/v1
LOCAL_API_KEY=replace-me
```

Do not commit this file.

## Secret migration

Older releases could copy a live `Authorization: Bearer ...` header into `opencode.json`. A successful sync now:

1. uses the token for `/models` discovery;
2. stores an `apiKey: "{env:VARIABLE}"` reference;
3. removes the literal Authorization header when the env reference is available;
4. writes the config with `0600` permissions.

Run this after upgrading:

```bash
./scripts/install.sh
sync-models
oc-doctor
```

Rotate any credential that was previously committed to Git or shared in a config file.

## Custom headers

Non-secret headers can remain in `options.headers`:

```json
{
  "options": {
    "baseURL": "https://gateway.example/v1",
    "apiKey": "{env:GATEWAY_API_KEY}",
    "headers": {
      "X-Workspace": "research"
    }
  }
}
```

For secret header values, use OpenCode's environment syntax rather than literals whenever the integration supports it.

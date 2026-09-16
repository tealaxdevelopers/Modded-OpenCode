#!/usr/bin/env bash
set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SETUP_DIR="${OPENCODE_LOCAL_SETUP_DIR:-${XDG_CONFIG_HOME:-$HOME/.config}/opencode/local-setup}"
ENV_FILE="${OPENCODE_LOCAL_ENV:-$SETUP_DIR/.env.local}"

if [ -f "$ENV_FILE" ]; then
  set -a
  # shellcheck disable=SC1090
  . "$ENV_FILE"
  set +a
fi

# Built-in cloud providers belong to OpenCode. This list is intentionally limited
# to custom local endpoints that expose an OpenAI-compatible /models route.
PROVIDERS=(
  "ollama|Ollama (local)|http://127.0.0.1:11434/v1|"
  "lmstudio|LM Studio (local)|http://127.0.0.1:1234/v1|"
  "vllm|vLLM (local)|http://127.0.0.1:8000/v1|"
  "llamacpp|llama.cpp (local)|http://127.0.0.1:8080/v1|"
)

synced=0
skipped=0
failed=0

sync_one() {
  local provider_id="$1"
  local display_name="$2"
  local base_url="$3"
  local credential_env="${4:-}"
  local credential_value=""
  local output status count

  if [ -n "$credential_env" ]; then
    credential_value="${!credential_env:-}"
    if [ -z "$credential_value" ]; then
      printf '· %-18s skipped (%s is not set)\n' "$provider_id" "$credential_env"
      skipped=$((skipped + 1))
      return
    fi
  fi

  output="$(
    LOCAL_API_BASE="$base_url" \
    OPENCODE_PROVIDER_ID="$provider_id" \
    OPENCODE_PROVIDER_NAME="$display_name" \
    OPENCODE_SYNC_TIMEOUT_MS="${OPENCODE_SYNC_TIMEOUT_MS:-3000}" \
    node "$SCRIPT_DIR/sync-provider.mjs" 2>&1
  )"
  status=$?

  if [ "$status" -eq 0 ]; then
    count="$(printf '%s\n' "$output" | sed -n 's/.*Found \([0-9][0-9]*\) models.*/\1/p' | tail -n 1)"
    printf '✓ %-18s %s models\n' "$provider_id" "${count:-0}"
    synced=$((synced + 1))
  else
    printf '· %-18s unavailable\n' "$provider_id"
    if [ "${OPENCODE_SYNC_VERBOSE:-0}" = "1" ]; then
      printf '  %s\n' "$(printf '%s' "$output" | tail -n 1)"
    fi
    skipped=$((skipped + 1))
  fi
}

echo "Refreshing custom OpenCode model catalogs"
for provider in "${PROVIDERS[@]}"; do
  IFS='|' read -r provider_id display_name base_url credential_env <<< "$provider"
  sync_one "$provider_id" "$display_name" "$base_url" "$credential_env"
done

if [ -n "${OPENCODE_REMOTE_PROVIDERS:-}" ]; then
  IFS=',' read -ra remotes <<< "$OPENCODE_REMOTE_PROVIDERS"
  for remote in "${remotes[@]}"; do
    IFS='|' read -r provider_id base_url credential_env <<< "$remote"
    if [ -z "$provider_id" ] || [ -z "$base_url" ]; then
      printf '✗ invalid OPENCODE_REMOTE_PROVIDERS entry: %s\n' "$remote" >&2
      failed=$((failed + 1))
      continue
    fi
    sync_one "$provider_id" "$provider_id" "$base_url" "${credential_env:-}"
  done
fi

if command -v opencode >/dev/null 2>&1; then
  command opencode models --refresh >/dev/null 2>&1 || true
fi

echo
echo "Synced $synced · unavailable/skipped $skipped · failed $failed"
echo "Use '/connect' for built-in provider credentials and 'opencode models' to inspect model IDs."
[ "$failed" -eq 0 ]

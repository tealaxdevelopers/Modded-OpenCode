#!/usr/bin/env bash
# Source from ~/.bashrc or ~/.zshrc.

OPENCODE_LOCAL_SETUP_DIR="${OPENCODE_LOCAL_SETUP_DIR:-${XDG_CONFIG_HOME:-$HOME/.config}/opencode/local-setup}"
OPENCODE_LOCAL_ENV="${OPENCODE_LOCAL_ENV:-$OPENCODE_LOCAL_SETUP_DIR/.env.local}"
OPENCODE_LOCAL_SYNC="$OPENCODE_LOCAL_SETUP_DIR/sync-on-launch.mjs"
OPENCODE_LOCAL_SINGLE_SYNC="$OPENCODE_LOCAL_SETUP_DIR/sync-provider.mjs"

_oc_with_env() {
  (
    set -a
    if [ -f "$OPENCODE_LOCAL_ENV" ]; then
      # shellcheck disable=SC1090
      . "$OPENCODE_LOCAL_ENV"
    fi
    set +a
    "$@"
  )
}

_oc_sync_quietly() {
  if command -v node >/dev/null 2>&1 && [ -f "$OPENCODE_LOCAL_SYNC" ]; then
    _oc_with_env node "$OPENCODE_LOCAL_SYNC" >/dev/null 2>&1 || true
  fi
}

# Refresh configured local endpoints before OpenCode starts. Post-exit sync is opt-in.
opencode() {
  _oc_sync_quietly
  command opencode "$@"
  _oc_status=$?
  if [ "${OPENCODE_SYNC_AFTER_EXIT:-0}" = "1" ]; then
    _oc_sync_quietly
  fi
  return "$_oc_status"
}

sync-models() {
  if ! command -v node >/dev/null 2>&1; then
    echo "Node.js 18+ is required" >&2
    return 1
  fi

  if [ -n "${1:-}" ]; then
    LOCAL_API_BASE="$1" _oc_with_env node "$OPENCODE_LOCAL_SINGLE_SYNC"
  else
    _oc_with_env node "$OPENCODE_LOCAL_SYNC"
  fi
}

_oc_first_model() {
  command opencode models "$1" 2>/dev/null | sed -n '1p'
}

_oc_is_model() {
  _oc_provider_id="$1"
  _oc_candidate="$2"
  command opencode models "$_oc_provider_id" 2>/dev/null \
    | grep -Fqx "$_oc_candidate" \
    || command opencode models "$_oc_provider_id" 2>/dev/null \
      | grep -Fqx "$_oc_provider_id/$_oc_candidate"
}

# Usage: oc-provider <provider> [model] [prompt...]
# When the first argument is not a known model, it is treated as prompt text.
oc-provider() {
  _oc_provider_id="$1"
  shift || true
  _oc_model=""

  if [ -n "${1:-}" ] && _oc_is_model "$_oc_provider_id" "$1"; then
    _oc_model="$1"
    shift
  else
    _oc_model="$(_oc_first_model "$_oc_provider_id")"
  fi

  if [ -z "$_oc_model" ]; then
    echo "No models found for provider '$_oc_provider_id'. Run sync-models or opencode models --refresh." >&2
    return 1
  fi

  case "$_oc_model" in
    */*) _oc_full_model="$_oc_model" ;;
    *) _oc_full_model="$_oc_provider_id/$_oc_model" ;;
  esac

  if [ "$#" -eq 0 ]; then
    opencode --model "$_oc_full_model"
  else
    opencode run --model "$_oc_full_model" "$@"
  fi
}

oc-local() { oc-provider local "$@"; }
oc-lmstudio() {
  LOCAL_API_BASE="http://127.0.0.1:1234/v1" OPENCODE_PROVIDER_ID="lmstudio" sync-models "http://127.0.0.1:1234/v1" >/dev/null || return
  oc-provider lmstudio "$@"
}
oc-ollama() {
  LOCAL_API_BASE="http://127.0.0.1:11434/v1" OPENCODE_PROVIDER_ID="ollama" sync-models "http://127.0.0.1:11434/v1" >/dev/null || return
  oc-provider ollama "$@"
}
oc-vllm() {
  LOCAL_API_BASE="http://127.0.0.1:8000/v1" OPENCODE_PROVIDER_ID="vllm" sync-models "http://127.0.0.1:8000/v1" >/dev/null || return
  oc-provider vllm "$@"
}
oc-llamacpp() {
  LOCAL_API_BASE="http://127.0.0.1:8080/v1" OPENCODE_PROVIDER_ID="llamacpp" sync-models "http://127.0.0.1:8080/v1" >/dev/null || return
  oc-provider llamacpp "$@"
}

list-providers() { command opencode models; }
code-login() { command opencode auth login "$@"; }
code-auth() { command opencode auth list "$@"; }
oc-upgrade() { command opencode upgrade "$@"; }
oc-doctor() { _oc_with_env node "$OPENCODE_LOCAL_SETUP_DIR/doctor.mjs"; }

if [ -n "${BASH_VERSION:-}" ]; then
  export -f opencode sync-models oc-provider oc-local oc-lmstudio oc-ollama oc-vllm oc-llamacpp
  export -f list-providers code-login code-auth oc-upgrade oc-doctor
fi

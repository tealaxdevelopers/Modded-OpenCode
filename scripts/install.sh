#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
CONFIG_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/opencode"
SETUP_DIR="${OPENCODE_LOCAL_SETUP_DIR:-$CONFIG_DIR/local-setup}"
CONFIG_FILE="${OPENCODE_CONFIG:-$CONFIG_DIR/opencode.json}"
ENV_FILE="$SETUP_DIR/.env.local"
START_MARKER="# >>> opencode-local-setup >>>"
END_MARKER="# <<< opencode-local-setup <<<"

echo "OpenCode Local Setup"
echo "===================="

if ! command -v node >/dev/null 2>&1; then
  echo "Error: Node.js 18 or newer is required." >&2
  exit 1
fi
NODE_MAJOR="$(node -p 'Number(process.versions.node.split(".")[0])')"
if [ "$NODE_MAJOR" -lt 18 ]; then
  echo "Error: Node.js 18+ is required; found $(node --version)." >&2
  exit 1
fi
echo "✓ Node.js $(node --version)"

mkdir -p "$SETUP_DIR" "$(dirname "$CONFIG_FILE")"
chmod 700 "$SETUP_DIR" 2>/dev/null || true

for name in providers.mjs sync-core.mjs sync-provider.mjs sync-local-models.mjs sync-on-launch.mjs doctor.mjs; do
  install -m 700 "$REPO_DIR/scripts/$name" "$SETUP_DIR/$name"
done
install -m 700 "$REPO_DIR/scripts/opencode-wrapper.sh" "$SETUP_DIR/opencode-wrapper.sh"

if [ ! -f "$ENV_FILE" ]; then
  cat > "$ENV_FILE" <<'ENVEOF'
# OpenAI-compatible endpoint used when no explicit provider is configured.
LOCAL_API_BASE=http://127.0.0.1:1234/v1

# Optional authentication. Keep secrets here or in your shell, never in opencode.json.
# LOCAL_API_KEY=
# REMOTE_API_KEY=

# Optional, opt-in Tailscale discovery. The default probes only 1234,8000,8080,11434.
# OPENCODE_TAILSCALE_DISCOVERY=1
# OPENCODE_TAILSCALE_PORTS=1234,8000,8080,11434
ENVEOF
  chmod 600 "$ENV_FILE"
  echo "✓ Created $ENV_FILE"
else
  echo "✓ Preserved existing $ENV_FILE"
fi

if [ ! -f "$CONFIG_FILE" ]; then
  cat > "$CONFIG_FILE" <<'JSONEOF'
{
  "$schema": "https://opencode.ai/config.json",
  "autoupdate": "notify",
  "share": "manual",
  "provider": {
    "lmstudio": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "LM Studio (local)",
      "options": {
        "baseURL": "http://127.0.0.1:1234/v1"
      },
      "models": {}
    }
  }
}
JSONEOF
  chmod 600 "$CONFIG_FILE"
  echo "✓ Created $CONFIG_FILE"
else
  echo "✓ Preserved existing $CONFIG_FILE"
fi

update_rc() {
  rc_file="$1"
  touch "$rc_file"
  tmp_file="$(mktemp)"
  awk -v start="$START_MARKER" -v end="$END_MARKER" '
    $0 == start { skip = 1; next }
    $0 == end { skip = 0; next }
    !skip { print }
  ' "$rc_file" > "$tmp_file"
  cat >> "$tmp_file" <<RCEOF

$START_MARKER
export OPENCODE_LOCAL_SETUP_DIR="$SETUP_DIR"
[ -f "$SETUP_DIR/opencode-wrapper.sh" ] && . "$SETUP_DIR/opencode-wrapper.sh"
$END_MARKER
RCEOF
  cat "$tmp_file" > "$rc_file"
  rm -f "$tmp_file"
  echo "✓ Updated $rc_file"
}

case "${SHELL:-}" in
  */zsh) update_rc "$HOME/.zshrc" ;;
  *) update_rc "$HOME/.bashrc" ;;
esac

if command -v opencode >/dev/null 2>&1; then
  echo "✓ OpenCode $(opencode --version 2>/dev/null || echo installed)"
else
  echo "! OpenCode is not installed. Install the current release with:"
  echo "  curl -fsSL https://opencode.ai/install | bash"
fi

(
  set -a
  # shellcheck disable=SC1090
  . "$ENV_FILE"
  set +a
  OPENCODE_CONFIG="$CONFIG_FILE" node "$SETUP_DIR/sync-on-launch.mjs" || true
)
OPENCODE_CONFIG="$CONFIG_FILE" node "$SETUP_DIR/doctor.mjs" || true

echo
echo "Ready. Restart your shell or run:"
echo "  . \"$SETUP_DIR/opencode-wrapper.sh\""
echo "Then launch OpenCode with: opencode"

#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEST_HOME="$(mktemp -d)"
trap 'rm -rf "$TEST_HOME"' EXIT

export HOME="$TEST_HOME"
export XDG_CONFIG_HOME="$TEST_HOME/.config"
export SHELL=/bin/bash
export OPENCODE_SYNC_TIMEOUT_MS=50

"$REPO_DIR/scripts/install.sh" >/dev/null

CONFIG="$XDG_CONFIG_HOME/opencode/opencode.json"
ENV_FILE="$XDG_CONFIG_HOME/opencode/local-setup/.env.local"
RC_FILE="$HOME/.bashrc"

test -f "$CONFIG"
test -f "$ENV_FILE"
test -f "$RC_FILE"
node -e 'const fs=require("fs"); const c=JSON.parse(fs.readFileSync(process.argv[1],"utf8")); if(c.$schema!=="https://opencode.ai/config.json"||c.share!=="manual"||!c.provider.lmstudio) process.exit(1)' "$CONFIG"

printf '\n# preserve-me\n' >> "$ENV_FILE"
printf '\n{"$schema":"https://opencode.ai/config.json","share":"disabled","provider":{}}\n' > "$CONFIG"
"$REPO_DIR/scripts/install.sh" >/dev/null

grep -q '# preserve-me' "$ENV_FILE"
grep -q '"share":"disabled"' "$CONFIG"
test "$(grep -c '^# >>> opencode-local-setup >>>$' "$RC_FILE")" -eq 1

#!/usr/bin/env bash
# Modded OpenCode — cross-platform setup wizard (macOS / Linux)
# Mirrors setup.bat; both call the shared scripts/build-config.mjs engine.
# Compatible with bash 3.2+ (macOS default) and modern Linux bash.
set -euo pipefail

OC_SOURCE="$(cd "$(dirname "$0")/source" && pwd)"
GREEN='\033[0;32m'; RED='\033[0;31m'; NC='\033[0m'
ok() { printf "        %sOK%s\n" "$GREEN" "$NC"; }
fail() { printf "        %sFAILED%s — %s\n" "$RED" "$NC" "$1"; exit 1; }

echo
echo "  ============================================"
echo "     OpenCode Setup Wizard"
echo "     ~ Fully automated configuration ~"
echo "  ============================================"
echo

# ---- OS detection ----
UNAME="$(uname -s)"
case "$UNAME" in
  Darwin*) OS="macos" ;;
  Linux*)  OS="linux" ;;
  *) echo "Unsupported OS: $UNAME"; exit 1 ;;
esac

if [ "$OS" = "macos" ]; then
  TARGET_DIR="$HOME/Library/Application Support/opencode"
else
  TARGET_DIR="$HOME/.config/opencode"
fi

# ---- RC file: only export helper + OPENCODE_LOCAL_SETUP_DIR ----
# Credentials go to .env.local (mode 0600), never to shell RC files.
LOCAL_SETUP_DIR="$TARGET_DIR/local-setup"
mkdir -p "$LOCAL_SETUP_DIR" 2>/dev/null || true
ENV_LOCAL="$LOCAL_SETUP_DIR/.env.local"
# shell rc for env persistence (handles bash, zsh, and fallback)
RC_FILE=""
case "${SHELL:-/bin/bash}" in
  *zsh)   RC_FILE="$HOME/.zshrc" ;;
  *bash)  RC_FILE="$HOME/.bashrc" ;;
  *)      RC_FILE="$HOME/.bashrc" ;;
esac

# Check if RC file exists; create with markers if not
if [ ! -f "$RC_FILE" ]; then
  touch "$RC_FILE"
fi

# Idempotent RC update with markers — use LOCAL_SETUP_DIR variable, not hardcoded path
if ! grep -q '# >>> opencode setup >>>' "$RC_FILE" 2>/dev/null; then
  cat >> "$RC_FILE" << RCEOF
# >>> opencode setup >>>
export OPENCODE_LOCAL_SETUP_DIR="$LOCAL_SETUP_DIR"
# <<< opencode setup <<<
RCEOF
fi

# ---- Safe shell escape ----
# Produces a single-quoted string safe for shell exports.
# If value contains single quotes, uses dollar-quote syntax.
shell_escape_val() {
  local val="$1"
  if [[ "$val" != *"'"* ]]; then
    printf "'%s'" "$val"
  else
    local escaped="${val//\'/\'\\'\'}"
    printf "'%s'" "$escaped"
  fi
}

# Write a safe export line to temp env file
write_env() {
  local key="$1" val="$2"
  printf 'export %s=%s\n' "$key" "$(shell_escape_val "$val")" >> "$ENV_LOCAL.tmp.$$"
}

# ---- Node.js check ----
command -v node >/dev/null 2>&1 || fail "Node.js not found — install Node.js >= 18 first."
NODE_MAJOR="$(node -v 2>/dev/null | sed 's/v//' | cut -d. -f1)"
if [ -n "$NODE_MAJOR" ] && [ "$NODE_MAJOR" -lt 18 ] 2>/dev/null; then
  fail "Node.js v$NODE_MAJOR found but v18+ required."
fi

# ---- language ----
LANG_WORD=""
while true; do
  printf "  Dil / Language / Yazyk (tr / us / ru): "
  read -r lang
  case "${lang:-}" in
    tr)
      LANG_WORD="Turkce"
      L_USER_ASK="Kullanici adin ne?"
      L_ADDR_ASK="Sana nasil hitap edilsin?"
      L_ADDR_DEF="Tealax"
      L_GH_INFO="Birincil: GitHub API key. Bos birakirsan GitHub MCP kapali kurulur."
      L_GH_ASK="GitHub API key'ler - birden fazla ise virgulle ayir (ENTER = atla):"
      L_BRAVE_ASK="Brave API key (ENTER = atla):"
      L_PERSONA_HEAD="Agent persona kaynagi sec:"
      L_PERSONA_OPT1="  [1] Yerel persona (ag gerektirmez, dahiliVarsayilan)"
      L_PERSONA_OPT2="  [2] Uzak onerilen persona (sunucudan guncellenebilir)"
      L_PERSONA_ASK="Secim numarasi (ENTER = 1):"
      L_DONE_HEAD="KURULUM TAMAMLANDI!"
      L_RUN_HINT="[>] Baslat: opencode"
      break ;;
    us)
      LANG_WORD="English"
      L_USER_ASK="What is your username?"
      L_ADDR_ASK="How should the agent address you?"
      L_ADDR_DEF="Boss"
      L_GH_INFO="Primary: GitHub API key(s). Leave empty to install GitHub MCP disabled."
      L_GH_ASK="GitHub API keys - separate multiple with commas (ENTER = skip):"
      L_BRAVE_ASK="Brave API key (ENTER = skip):"
      L_PERSONA_HEAD="Choose agent persona source:"
      L_PERSONA_OPT1="  [1] Local persona (no network needed, built-in default)"
      L_PERSONA_OPT2="  [2] Remote recommended persona (updatable from server)"
      L_PERSONA_ASK="Option number (ENTER = 1):"
      L_DONE_HEAD="SETUP COMPLETE!"
      L_RUN_HINT="[>] Launch: opencode"
      break ;;
    ru)
      LANG_WORD="Russkiy"
      L_USER_ASK="Vashe imya polzovatelya?"
      L_ADDR_ASK="Kak k vam obrashchatsya?"
      L_ADDR_DEF="Tealax"
      L_GH_INFO="Pervichnyy: GitHub API klyuchi. Pustoy = GitHub MCP vyklyuchen."
      L_GH_ASK="GitHub API klyuchi - neskolko cherez zapyatuyu (ENTER = propustit):"
      L_BRAVE_ASK="Brave API key (ENTER = propustit):"
      L_PERSONA_HEAD="Vyberite istochnik personalii agenta:"
      L_PERSONA_OPT1="  [1] Lokal'naya personaliya (bez seti, vstroyennyy standart)"
      L_PERSONA_OPT2="  [2] Udalennaya rekomenduyemaya personaliya (obnovlyayetsya s servera)"
      L_PERSONA_ASK="Nomer varianta (ENTER = 1):"
      L_DONE_HEAD="USTANOVKA ZAVERSHENA!"
      L_RUN_HINT="[>] Zapusk: opencode"
      break ;;
    *) echo "  ** type tr, us or ru **" ;;
  esac
done

# ---- Username ----
DEFAULT_USER="${USER:-$(whoami 2>/dev/null || echo "$L_ADDR_DEF")}"
echo
printf "  %s (ENTER = %s): " "$L_USER_ASK" "$DEFAULT_USER"
read -r username
username="${username:-$DEFAULT_USER}"

defaddr="$L_ADDR_DEF"
printf "  %s (ENTER = %s): " "$L_ADDR_ASK" "$defaddr"
read -r addressing
addressing="${addressing:-$defaddr}"

# ---- Persona source ----
echo
echo "  $L_PERSONA_HEAD"
echo "  $L_PERSONA_OPT1"
echo "  $L_PERSONA_OPT2"
printf "  %s " "$L_PERSONA_ASK"
read -r persona
OC_PERSONA_MODE="local"
if [ "${persona:-}" = "2" ]; then
  OC_PERSONA_MODE="remote"
fi

echo
echo "  $L_GH_INFO"

# ---- GitHub keys (multi-token) ----
HAS_GITHUB=""
gh_n=0
OC_GH_MULTI=""
printf "  %s\n  " "$L_GH_ASK"
read -r ghkey
if [ -n "${ghkey:-}" ]; then
  # Split by comma — compatible with bash 3.2+ (no mapfile needed)
  OLD_IFS="$IFS"
  IFS=','
  set -f  # disable glob expansion — keys may contain *, ?, [
  for tok in $ghkey; do
    # trim leading/trailing whitespace
    tok="$(echo "$tok" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"
    [ -z "$tok" ] && continue
    gh_n=$((gh_n+1))
    export "GITHUB_API_KEY_$gh_n=$tok"
    write_env "GITHUB_API_KEY_$gh_n" "$tok"
  done
  set +f  # re-enable glob expansion
  IFS="$OLD_IFS"
  if [ "$gh_n" -gt 0 ]; then
    HAS_GITHUB=1
    if [ "$gh_n" -eq 1 ]; then
      export GITHUB_API_KEY="$tok"
      write_env "GITHUB_API_KEY" "$tok"
    else
      OC_GH_MULTI=1
      write_env "GITHUB_TOKEN_COUNT" "$gh_n"
    fi
    echo "  [+] $gh_n GitHub key(s) saved (GITHUB_API_KEY_1..N)."
  fi
fi

# ---- Brave ----
echo
printf "  %s\n  " "$L_BRAVE_ASK"
read -r bravekey
HAS_BRAVE=""
if [ -n "${bravekey:-}" ]; then
  export BRAVE_API_KEY="$bravekey"
  write_env "BRAVE_API_KEY" "$bravekey"
  HAS_BRAVE=1
  echo "  [+] BRAVE_API_KEY saved."
fi

# ---- Atomic .env.local commit ----
# Preserve user-added lines outside markers, replace only our section
ENV_MARKER_START="# >>> modded-opencode credentials >>>"
ENV_MARKER_END="# <<< modded-opencode credentials <<<"
if [ -f "$ENV_LOCAL" ]; then
  awk -v start="$ENV_MARKER_START" -v end="$ENV_MARKER_END" '
    $0 == start { skip = 1; next }
    $0 == end { skip = 0; next }
    !skip { print }
  ' "$ENV_LOCAL" > "$ENV_LOCAL.user.$$" 2>/dev/null || : > "$ENV_LOCAL.user.$$"
else
  : > "$ENV_LOCAL.user.$$"
fi

{
  cat "$ENV_LOCAL.user.$$"
  echo "$ENV_MARKER_START"
  cat "$ENV_LOCAL.tmp.$$"
  echo "$ENV_MARKER_END"
  echo
} > "$ENV_LOCAL"

chmod 600 "$ENV_LOCAL"
rm -f "$ENV_LOCAL.tmp.$$" "$ENV_LOCAL.user.$$"

# ---- Create target dirs ----
mkdir -p "$TARGET_DIR" 2>/dev/null || fail "Cannot create target directory: $TARGET_DIR"

# ---- Run shared engine ----
export OC_SOURCE OC_TARGET="$TARGET_DIR" OC_USERNAME="$username" \
       OC_LANGUAGE="$LANG_WORD" OC_ADDRESSING="$addressing" \
       HAS_GITHUB="${HAS_GITHUB:-}" HAS_BRAVE="${HAS_BRAVE:-}" \
       OC_PERSONA_MODE="$OC_PERSONA_MODE" OC_GH_MULTI="${OC_GH_MULTI:-}"

# Check that build-config.mjs exists
BUILD_SCRIPT="$OC_SOURCE/../scripts/build-config.mjs"
if [ ! -f "$BUILD_SCRIPT" ]; then
  # Try relative to OC_SOURCE
  BUILD_SCRIPT="$(dirname "$OC_SOURCE")/scripts/build-config.mjs"
fi
if [ ! -f "$BUILD_SCRIPT" ]; then
  fail "build-config.mjs not found. Ensure scripts/ directory is present."
fi

echo
echo "  ============================================"
echo "  $L_DONE_HEAD"
echo "    User:    $username"
echo "    Address: $addressing"
echo "    Lang:    $LANG_WORD"
echo "    Target:  $TARGET_DIR"
[ -n "$HAS_GITHUB" ] && echo "    GitHub MCP: ON" || echo "    GitHub MCP: off (no key)"
[ -n "$HAS_BRAVE" ]  && echo "    Brave:      ON" || echo "    Brave:      off (no key)"
echo "    Persona:    $OC_PERSONA_MODE"
echo "  ============================================"
echo
echo "  [1/4] Running build-config..."
node "$BUILD_SCRIPT" || fail "build-config.mjs failed"
echo "        OK"

echo
echo "  ============================================"
echo "  $L_DONE_HEAD"
echo "  ============================================"
echo
echo "  $L_RUN_HINT"
  echo "  (credentials stored in $ENV_LOCAL — restart your terminal or 'source $RC_FILE')"
echo

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
      L_EXTRA_HEAD="Baska entegrasyon var mi?"
      L_EXTRA_OPT1="  [1] OpenAI-uyumlu ozel provider ekle (baseURL + model + key)"
      L_EXTRA_OPT2="  [2] Hazir saglayicilar icin 'opencode auth login' kullan"
      L_EXTRA_ASK="Secim numarasi (ENTER = gec):"
      L_CBASE="Base URL:"
      L_CMODEL="Model adi:"
      L_CKEY="API key:"
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
      L_EXTRA_HEAD="Any other integrations?"
      L_EXTRA_OPT1="  [1] Add a custom OpenAI-compatible provider (baseURL + model + key)"
      L_EXTRA_OPT2="  [2] For built-in providers run 'opencode auth login'"
      L_EXTRA_ASK="Option number (ENTER = continue):"
      L_CBASE="Base URL:"
      L_CMODEL="Model name:"
      L_CKEY="API key:"
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
      L_EXTRA_HEAD="Yest' drugiye integratsii?"
      L_EXTRA_OPT1="  [1] Dobavit svoy OpenAI-sovmestimyy provider (baseURL + model + key)"
      L_EXTRA_OPT2="  [2] Dlya vstroennykh provayderov zapustite 'opencode auth login'"
      L_EXTRA_ASK="Nomer varianta (ENTER = dal'she):"
      L_CBASE="Base URL:"
      L_CMODEL="Imya modeli:"
      L_CKEY="API key:"
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
  for tok in $ghkey; do
    IFS="$OLD_IFS"
    # trim leading/trailing whitespace
    tok="$(echo "$tok" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"
    [ -z "$tok" ] && continue
    gh_n=$((gh_n+1))
    export "GITHUB_API_KEY_$gh_n=$tok"
    printf "export GITHUB_API_KEY_%s='%s'\n" "$gh_n" "$tok" >> "$RC_FILE"
  done
  IFS="$OLD_IFS"
  if [ "$gh_n" -gt 0 ]; then
    HAS_GITHUB=1
    if [ "$gh_n" -eq 1 ]; then
      export GITHUB_API_KEY="$tok"
      printf "export GITHUB_API_KEY='%s'\n" "$tok" >> "$RC_FILE"
    else
      OC_GH_MULTI=1
      export OC_GH_FIRST="$tok"
      printf "export GITHUB_TOKEN_COUNT='%s'\n" "$gh_n" >> "$RC_FILE"
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
  printf "export BRAVE_API_KEY='%s'\n" "$bravekey" >> "$RC_FILE"
  HAS_BRAVE=1
  echo "  [+] BRAVE_API_KEY saved."
fi

# ---- Extra: custom provider ----
echo
echo "  $L_EXTRA_HEAD"
echo "  $L_EXTRA_OPT1"
echo "  $L_EXTRA_OPT2"
printf "  %s " "$L_EXTRA_ASK"
read -r extra
HAS_CUSTOM=""
if [ "${extra:-}" = "1" ]; then
  printf "  %s " "$L_CBASE"; read -r cbase
  printf "  %s " "$L_CMODEL"; read -r cmodel
  printf "  %s " "$L_CKEY";  read -r ckey
  if [ -n "${cbase:-}" ] && [ -n "${cmodel:-}" ] && [ -n "${ckey:-}" ]; then
    export CUSTOM_LLM_API_KEY="$ckey"
    printf "export CUSTOM_LLM_API_KEY='%s'\n" "$ckey" >> "$RC_FILE"
    export OC_CBASE="$cbase" OC_CMODEL="$cmodel"
    HAS_CUSTOM=1
    echo "  [+] CUSTOM_LLM_API_KEY saved."
  else
    echo "  [i] Cancelled."
  fi
fi

# ---- Create target dirs ----
mkdir -p "$TARGET_DIR" 2>/dev/null || fail "Cannot create target directory: $TARGET_DIR"

# ---- Run shared engine ----
export OC_SOURCE OC_TARGET="$TARGET_DIR" OC_USERNAME="$username" \
       OC_LANGUAGE="$LANG_WORD" OC_ADDRESSING="$addressing" \
       HAS_GITHUB="${HAS_GITHUB:-}" HAS_BRAVE="${HAS_BRAVE:-}" \
       HAS_CUSTOM="${HAS_CUSTOM:-}" OC_GH_MULTI="${OC_GH_MULTI:-}"

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
[ -n "$HAS_CUSTOM" ] && echo "    Custom:     ON" || echo "    Custom:     none"
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
echo "  (env vars written to $RC_FILE — restart your terminal or 'source $RC_FILE')"
echo

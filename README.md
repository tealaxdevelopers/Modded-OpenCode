<div align="center">
  <h1>⚡ Modded OpenCode</h1>
  <p>Requires OpenCode — Desktop, Terminal and the CLI all read the same config.</p>
  <p><strong>105 skills, auto setup, custom rules — everything ready at launch</strong></p>
  <p>
    <a href="README.tr.md">🇹🇷 Türkçe</a> ·
    <a href="README.ru.md">🇷🇺 Русский</a>
  </p>
  <p>
    <a href="https://github.com/tealaxdevelopers/modded-opencode"><img src="https://img.shields.io/badge/Last%20Update-2026-blue?style=flat-square" alt="Last Update"/></a>
    <a href="https://github.com/tealaxdevelopers/modded-opencode/stargazers"><img src="https://img.shields.io/badge/Stars-⭐-yellow?style=flat-square" alt="Stars"/></a>
    <a href="https://opencode.ai"><img src="https://img.shields.io/badge/OpenCode-v2.3%2B-blue?style=flat-square" alt="OpenCode"/></a>
  </p>
</div>

---

## 📦 What's Inside

```
modded-opencode/
├── setup.bat                          # One-click setup wizard (Windows, EN/TR/RU)
├── setup.sh                           # One-click setup wizard (macOS / Linux)
├── scripts/build-config.mjs           # Cross-platform opencode.jsonc generator (Node)
└── source/
    ├── opencode.jsonc                 # Provider & MCP configuration (clean)
    ├── rules.md                       # Agent persona rules (custom addressing + language)
    ├── .gitignore
    ├── agents/                        # 13 custom agents (ivan, scout, planner, review...)
    ├── commands/                      # 19 slash commands
    ├── instructions/                  # 22 instruction sets
    └── skills/                        # 105 SKILL.md packs (incl. Claude Code compatible skills)
```

Plugins are installed from npm (not bundled as local files):

| Plugin | Package | Purpose |
|--------|---------|---------|
| **agents-opencode** | `modded-opencode-agents-opencode` | Compaction context, version injection, sensitive file blocking |
| **auto-continue** | `modded-opencode-opencode-continue` | Auto-resume on idle / disconnect |
| **openai-system-merge** | `modded-opencode-openai-system-merge` | Fixes multi system message error for OpenAI-compatible providers |
| **update-checker** | `modded-opencode-update-checker` | Checks GitHub for new releases on startup |
| **notify** | `modded-opencode-opencode-notify` | Cross-platform native desktop notifications on task completion |
| **session-title** | `modded-opencode-opencode-session-title` | Auto-generates session titles from the first user message |
| **env-guard** | `modded-opencode-opencode-env-guard` | Blocks reading .env files and writes containing detected secrets |

### 🔥 Highlight Skills

| Skill | What it does |
|-------|-------------|
| **ponytail** | Token-waste prevention decision ladder (YAGNI/stdlib/oneliner/MVP) |
| **multi-language** | Idiomatic Python/Kotlin/Java/Node.js code generation |
| **java-spring** | Spring Boot + constructor injection + validation |
| **pythonic-quality** | Pythonic idioms, SOLID, Liskov-safe subtypes |
| **senior-fullstack** | React/Next/Node/GraphQL/PostgreSQL fullstack |
| **legal-advisor** | Legal research, regulation analysis, license audits |
| **cto-advisor** | Tech debt analyzer, team scaling, tech evaluation |
| **xlsx / pdf / docx** | Excel, PDF, Word document processing |
| **claude-commit** | Conventional git commit with atomic staging |
| **claude-code-review** | Security, performance, correctness review |
| **claude-debug** | Systematic hypothesis-driven debugging |
| **claude-simplify** | Refactor for clarity and reduced complexity |
| **claude-batch** | Process multiple files with same operation |
| **claude-loop** | Repeat task with exit conditions |
| *(+95 more)* | |

---

## ⚡ Quick Start

### Windows
```batch
git clone https://github.com/tealaxdevelopers/Modded-OpenCode.git
cd Modded-OpenCode
setup.bat
```

### macOS / Linux
```bash
git clone https://github.com/tealaxdevelopers/Modded-OpenCode.git
cd Modded-OpenCode
chmod +x setup.sh scripts/*.sh
./setup.sh
```

> Provider setup is included in the wizard. OpenCode must be installed separately: https://opencode.ai

---

## 🚀 Installation

```batch
setup.bat
```

On **macOS / Linux** use the equivalent shell wizard:

```bash
chmod +x setup.sh scripts/install.sh scripts/opencode-wrapper.sh scripts/sync-all-providers.sh
./setup.sh
```

> ⚠️ After cloning, shell scripts may lose their executable bits. Run `chmod +x` on the scripts before first use. CI environments should also verify this: `git ls-files --stage | grep 100755`.

Both wizards share the same engine (`scripts/build-config.mjs`) and ask the same questions.

The wizard asks, in order:

| Step | Question | If left empty |
|------|----------|---------------|
| 1️⃣ Language | `tr` / `us` / `ru` (2 letters) | — |
| 2️⃣ Username | Your Windows username | `ENTER` = auto-detected |
| 3️⃣ Addressing | How should the agent address you? | Default is used |
| 4️⃣ GitHub API key(s) | For GitHub MCP — comma-separated multiple keys supported | `ENTER` = skipped, MCP installed **disabled** |
| 5️⃣ Brave API key | For web search | `ENTER` = skipped, search installed **disabled** |
| 6️⃣ Extra integrations | Custom provider menu | `ENTER` = skip |

The **language you pick also sets the agent's conversation language** in `rules.md` — pick `ru` and the kernel instructs the agent to speak Russian.

> 🔗 **Multiple GitHub keys:** Paste several tokens separated by commas — they save as `GITHUB_API_KEY_1`, `GITHUB_API_KEY_2`, … (no upper limit). A single token stays as `GITHUB_API_KEY`. When multi-mode is on, the config references the first key (`_1`).

> 🔑 **Key safety:** API keys are **never written to shell RC files** (`.bashrc`, `.zshrc`). They are stored in a dedicated `.env.local` file with restricted permissions (`0600` — owner-only read/write). The shell RC file only receives an `OPENCODE_LOCAL_SETUP_DIR` export so the wrapper can find the credentials at runtime.

| OS | `.env.local` location | RC file updated | Permissions |
|----|----------------------|-----------------|-------------|
| **Windows** | `%USERPROFILE%\.config\opencode\local-setup\.env.local` | N/A (uses `setx`) | NTFS ACL |
| **macOS** | `~/Library/Application Support/opencode/local-setup/.env.local` | `~/.zshrc` | `chmod 600` |
| **Linux** | `~/.config/opencode/local-setup/.env.local` | `~/.bashrc` | `chmod 600` |

> To revoke keys: delete `.env.local` or run `oc-doctor` to check for leaked credentials.

Everything else installs automatically: 105 skills, 13 agents, 19 commands, 22 instruction sets, 4 plugins, MCP servers.

---

## 🧩 MCP Servers

| Server | Description | Status |
|--------|-------------|--------|
| **fetch** | Fetch content from URLs | ✅ Active |
| **memory** | Persistent memory (knowledge graph) | ✅ Active |
| **sequential-thinking** | Step-by-step reasoning | ✅ Active |
| **time** | Date/time queries | ✅ Active |
| **github** | GitHub API integration | 🔑 Active if key provided |
| **brave-search** | Web search | 🔑 Active if key provided |
| *filesystem* | Filesystem access | ⛔ Off by default |

To add a key after installation:

```batch
setx GITHUB_API_KEY "ghp_..."
setx BRAVE_API_KEY "BSA..."
```

then flip the matching `"enabled": false` to `true` inside `opencode.jsonc`.

---

## 🔁 Auto-Continue (auto-resume)

Ships **on by default**. The auto-continue plugin watches your sessions and, when a session goes **idle** (model finished but you didn't type) **or the connection drops mid-task** (`session.error`), it automatically injects a `continue` message so the agent resumes on its own — without you or the AI having to press anything.

- 🛡️ **Bounded**: a cooldown (`cooldown_ms`) and a max consecutive count (`max_consecutive`) prevent infinite loops.
- 🔄 **Self-resetting**: as soon as you send a real message, the counter resets.
- 🌐 **Cross-platform**: same plugin loads on Windows, macOS and Linux.

Tune or disable it via `<project>/.opencode/auto-continue.json`:

```jsonc
{
  "enabled": true,
  "message": "continue",
  "cooldown_ms": 8000,
  "max_consecutive": 8,
  "continue_on_error": false
}
```

Or toggle globally with an environment variable — no file needed:

```batch
setx OC_AUTOCONTINUE 0   # off
setx OC_AUTOCONTINUE 1   # on
```

> Manual alternative: just type `continue` in the chat. The plugin only automates that step. A literal "Continue" button inside the chat box and an in-app settings toggle would require forking OpenCode's UI — out of scope for the plugin approach.

---

## 🔧 OpenAI-Compatible Provider Support

Custom OpenAI-compatible providers (vLLM, Ollama, llama.cpp, LM Studio, Hetzner, OVHcloud, Scaleway, etc.) work out of the box. A built-in plugin (`openai-system-merge`) fixes the common `400 BadRequestError: System message must be at the beginning` error by automatically merging multiple system messages into one before sending to the provider.

**What it fixes:** OpenCode plugins may generate multiple system messages. Strict OpenAI-compatible servers reject requests with more than one system message. The merge plugin handles this transparently.

**Affected providers:** vLLM (Qwen template), Hetzner Inference, OVHcloud, Scaleway, Nebius, and any server that enforces single system message.

---

## ⚙️ Providers (Important!)

**NO bundled provider ships with setup.** The config installs with `provider: {}` — empty. There is no default/example provider wired in by the wizard.

Two ways to connect a model:

### 1) Custom OpenAI-compatible provider from the wizard (Step 6 → `[1]`)

Asks for Base URL + model name + API key, then writes:

```jsonc
"provider": {
  "<model-name>": {
    "name": "<model-name>",
    "npm": "@ai-sdk/openai-compatible",
    "options": {
      "baseURL": "https://your-server.com/v1",
      "apiKey": "{env:CUSTOM_LLM_API_KEY}"
    },
    "models": { "<model-name>": {} }
  }
}
```

### 2) Built-in providers (OpenAI, Anthropic, Google...)

One command after setup:

```batch
opencode auth login
```

### Manual example (DashScope/Qwen)

For those who want to add it **manually** — this is an example, not a default:

```jsonc
"provider": {
  "qwen-dashscope": {
    "name": "Qwen DashScope",
    "npm": "@ai-sdk/openai-compatible",
    "options": {
      "baseURL": "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
    },
    "models": {
      "qwen-turbo-latest": {
        "name": "Qwen Turbo",
        "limit": { "context": 1000000, "output": 8192 }
      }
    }
  }
}
```

> ⚠️ The `@melodyoftears/opencode-qwen-auth` plugin that shipped with older versions has been **removed** — it is no longer part of the installation.

---

## 📜 rules.md (Agent Persona)

The heart of this pack. `rules.md` configures a session-scoped persona layer loaded through OpenCode's instruction system — the agent's identity, voice, and working style:

- 🎭 **Persona definition:** Sets the agent's operator identity — voice, response format, and working style for the session.
- 🌐 **Language + addressing:** Both are set at setup time (`{{LANGUAGE}}`, `{{HITAP}}`) — the agent speaks your language and calls you what you choose.
- 🔒 **Scope:** This is prompt-layer configuration only. It does not modify model weights, does not bypass server-side API policies, account permissions, or legal limits — those always apply. Personal, local use.

> **Note:** This is a persona configuration for a private, controlled session — not a security exploit. Not recommended for production or multi-user systems.

---

## 🙏 Credits

- [opencode-ai/opencode](https://github.com/opencode-ai/opencode) — core platform
- [awesome-opencode/awesome-opencode](https://github.com/awesome-opencode/awesome-opencode) — curated plugins, themes, agents and resources

---

## 🔧 Development

```bash
# Add your own skill
mkdir source/skills/my-skill/
printf -- "---\nname: my-skill\ndescription: Does things\n---\n# Skill content" > source/skills/my-skill/SKILL.md

# Then re-run setup.bat
```

Validation:

```bash
npm run validate
```

---

## 📄 License

MIT — use, modify, distribute, fork. Free for whatever you need.

---

<div align="center">
  <sub>🔮 by tealaxdevelopers</sub>
</div>

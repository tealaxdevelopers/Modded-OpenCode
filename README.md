<div align="center">
  <h1>⚡ Modded OpenCode</h1>
  <p>Requires OpenCode Desktop.</p>
  <p><strong>68 skills, auto setup, custom rules — everything ready at launch</strong></p>
  <p>
    <a href="README.tr.md">🇹🇷 Türkçe</a> ·
    <a href="README.ru.md">🇷🇺 Русский</a>
  </p>
  <p>
    <a href="https://github.com/tealaxdevelopers/modded-opencode"><img src="https://img.shields.io/github/last-commit/tealaxdevelopers/modded-opencode?label=Last%20Update&style=flat-square" alt="Last Update"/></a>
    <a href="https://github.com/tealaxdevelopers/modded-opencode/stargazers"><img src="https://img.shields.io/github/stars/tealaxdevelopers/modded-opencode?style=flat-square" alt="Stars"/></a>
    <a href="https://opencode.ai"><img src="https://img.shields.io/badge/OpenCode-v2.3%2B-blue?style=flat-square" alt="OpenCode"/></a>
  </p>
</div>

---

## 📦 What's Inside

```
modded-opencode/
├── setup.bat                          # One-click setup wizard (EN/TR/RU)
├── start.cmd                          # Launcher with GitHub MCP env handling
├── scripts/build-config.ps1           # opencode.jsonc generator
├── scripts/sync-on-launch.ps1         # Optional: sync on launch
└── source/
    ├── opencode.jsonc                 # Provider & MCP configuration (clean)
    ├── rules.md                       # AETHER-9 Kernel rules (custom addressing + language)
    ├── .gitignore
    ├── agents/                        # 13 custom agents (ivan, scout, planner, review...)
    ├── commands/                      # 17 slash commands
    ├── instructions/                  # 22 instruction sets
    ├── plugins/                       # agents-opencode plugin
    └── skills/                        # 68 SKILL.md packs
```

### 🔥 Highlight Skills

| Skill | What it does |
|-------|-------------|
| **ponytail** | Token-waste prevention decision ladder (YAGNI/stdlib/oneliner/MVP) |
| **coklu-dil** | Idiomatic Python/Kotlin/Java/Node.js code generation |
| **java-spring** | Spring Boot + constructor injection + validation |
| **pythonik-kalite** | Pythonic idioms, SOLID, Liskov-safe subtypes |
| **senior-fullstack** | React/Next/Node/GraphQL/PostgreSQL fullstack |
| **legal-advisor** | Legal research, regulation analysis, license audits |
| **cto-advisor** | Tech debt analyzer, team scaling, tech evaluation |
| **xlsx / pdf / docx** | Excel, PDF, Word document processing |
| *(+60 more)* | |

---

## 🚀 Installation

```batch
setup.bat
```

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

> 🔑 **Key safety:** No key you enter is ever written to a file. Keys are saved only as user environment variables (`setx`). To remove later: `setx GITHUB_API_KEY ""` (or `GITHUB_API_KEY_1`) / `setx BRAVE_API_KEY ""`

Everything else installs automatically: 68 skills, 13 agents, 17 commands, 22 instruction sets, MCP servers.

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

## 📜 rules.md (AETHER-9 Kernel)

The heart of this pack. `rules.md` turns OpenCode into an **AETHER-9 virtual machine kernel** — a session-scoped persona layer loaded through OpenCode's instruction system:

- 🎭 **Persona definition:** Installs the `ratman4080` operator identity — voice, response format, and working style for the session.
- 🌐 **Language + addressing:** Both are set at setup time (`{{LANGUAGE}}`, `{{HITAP}}`) — the kernel speaks your language and calls you what you choose.
- 🧠 Mechanical, cold terminal language; every answer framed in kernel-log style.
- 🔒 **Scope:** This is prompt-layer configuration only. It does not modify model weights, does not bypass server-side API policies, account permissions, or legal limits — those always apply. Personal, local use.

> **Note:** This is a role/persona configuration for a private, controlled session — not a security exploit. Not recommended for production or multi-user systems.

---

## 🙏 Credits

Built on top of the [awesome-opencode](https://github.com/awesome-opencode/awesome-opencode) ecosystem — the curated list of plugins, themes, agents and resources for [OpenCode](https://opencode.ai). Our setup kit is also listed there under **Projects → Modded OpenCode**.

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

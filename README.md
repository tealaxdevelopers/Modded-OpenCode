<div align="center">
  <h1>⚡ Modded OpenCode</h1>
  <p>Requires OpenCode — Desktop, Terminal and the CLI all read the same config.</p>
  <p><strong>105 skills · 13 agents · 19 commands · 7 plugins — everything ready at launch</strong></p>
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

<p align="center">
  <img src="docs/assets/hero.svg" alt="Modded OpenCode — Run your own AI inside OpenCode" width="100%"/>
</p>

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

## 🔌 Plugins (7 total, installed from npm)

| Plugin | What it does |
|--------|-------------|
| **agents-opencode** | Compaction context injection, sensitive file blocking, version env var |
| **auto-continue** | Auto-resume idle/disconnected sessions (on by default) |
| **openai-system-merge** | Fixes multi-system-message error for strict OpenAI-compatible providers |
| **update-checker** | Checks GitHub for new releases on startup |
| **notify** | Cross-platform desktop notifications on task completion |
| **session-title** | Auto-generates session titles from the first user message |

Auto-continue config (`<project>/.opencode/auto-continue.json`):

```jsonc
{
  "enabled": true,
  "cooldown_ms": 8000,
  "max_consecutive": 8,
  "continue_on_error": false
}
```

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

---

## 🔥 Skills (105 total)

### Language & Framework

| Skill | What it does |
|-------|-------------|
| **multi-language** | Idiomatic Python/Kotlin/Java/Node.js code generation |
| **java-spring** | Spring Boot + constructor injection + validation |
| **pythonic-quality** | Pythonic idioms, SOLID, Liskov-safe subtypes |
| **senior-fullstack** | React/Next/Node/GraphQL/PostgreSQL fullstack |
| **rust** | Ownership/borrowing, Result/Option, safe abstractions |

### Quality & Review

| Skill | What it does |
|-------|-------------|
| **ponytail** | Token-waste prevention decision ladder (YAGNI/stdlib/oneliner/MVP) |
| **claude-code-review** | Security, performance, correctness review |
| **claude-debug** | Systematic hypothesis-driven debugging |
| **claude-simplify** | Refactor for clarity and reduced complexity |
| **code-change-impact** | Blast-radius analysis for code changes |

### Content & Business

| Skill | What it does |
|-------|-------------|
| **legal-advisor** | Legal research, regulation analysis, license audits |
| **cto-advisor** | Tech debt analyzer, team scaling, tech evaluation |
| **blogger** | Tech/finance/leadership blog posts, podcast ideation, YouTube scripts |
| **deep-research** | Multi-source web research with citation tracking |

### Productivity

| Skill | What it does |
|-------|-------------|
| **claude-commit** | Conventional git commit with atomic staging |
| **claude-batch** | Process multiple files with same operation |
| **claude-loop** | Repeat task with exit conditions |
| **xlsx / pdf / docx** | Excel, PDF, Word document processing |

*+95 more skills in `source/skills/`*

---

## 🤖 Agents (13 total)

| Agent | Role | Mode |
|-------|------|------|
| **@codebase** | Multi-language dev with profile detection | primary |
| **@orchestrator** | Strategic planning & workflow coordination | primary |
| **@planner** | Read-only analysis & implementation planning | primary |
| **@review** | Code review for security, performance, best practices | subagent |
| **@docs** | Documentation creation & maintenance | subagent |
| **@ivan** | Senior code implementor | subagent |
| **@jester** | High-temperature oracle for unconventional thinking | subagent |
| **@oscar** | Senior code reviewer | subagent |
| **@scout** | Research & planning | subagent |
| **@blogger** | Content creation (blog, podcast, YouTube) | primary |
| **@brutal-critic** | Content quality review with framework scoring | subagent |
| **@em-advisor** | Engineering management guidance | primary |
| **@legal-advisor** | License auditing, compliance, regulatory guidance | primary |

---

## ⚙️ Providers

**No bundled provider ships with setup.** Config installs with `provider: {}` — empty.

Two ways to connect:

### 1) Wizard (Step 6 → `[1]`)
Asks for Base URL + model name + API key.

### 2) Built-in providers (OpenAI, Anthropic, Google...)
```batch
opencode auth login
```

### Supported local endpoints

| Provider | Default URL | Port |
|----------|-------------|------|
| Ollama | `http://127.0.0.1:11434/v1` | 11434 |
| LM Studio | `http://127.0.0.1:1234/v1` | 1234 |
| vLLM | `http://127.0.0.1:8000/v1` | 8000 |
| llama.cpp | `http://127.0.0.1:8080/v1` | 8080 |

---

## 🔧 OpenAI-Compatible Provider Support

Custom providers (vLLM, Ollama, llama.cpp, LM Studio, Hetzner, OVHcloud, Scaleway, etc.) work out of the box. The `openai-system-merge` plugin fixes the common `400 BadRequestError: System message must be at the beginning` error by merging multiple system messages into one.

---

## 📦 Installation

### Primary: `setup.bat` / `setup.sh` (full wizard)

Both wizards ask the same questions and produce the complete config:

| Step | Question | If left empty |
|------|----------|---------------|
| 1️⃣ Language | `tr` / `us` / `ru` | — |
| 2️⃣ Username | Your Windows username | auto-detected |
| 3️⃣ Addressing | How should the agent call you? | default |
| 4️⃣ GitHub API key(s) | For GitHub MCP | skipped, MCP disabled |
| 5️⃣ Brave API key | For web search | skipped, search disabled |
| 6️⃣ Extra integrations | Custom provider menu | skip |

### Secondary: `scripts/install.sh` (provider sync only)

Lightweight helper that syncs local model catalogs — does **not** create rules, agents, skills, or config. Use after adding a new local model server.

The language you pick sets the agent's conversation language in `rules.md`.

> 🔑 **Key safety:** API keys stored in `.env.local` (mode `0600`), never written to shell RC files.

| OS | `.env.local` location |
|----|----------------------|
| **Windows** | `%USERPROFILE%\.config\opencode\local-setup\.env.local` |
| **macOS** | `~/Library/Application Support/opencode/local-setup/.env.local` |
| **Linux** | `~/.config/opencode/local-setup/.env.local` |

---

## 📜 rules.md

Agent persona layer loaded through OpenCode's instruction system. Sets identity, voice, and working style. Language + addressing configured at setup time.

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

## 🙏 Credits

- [opencode-ai/opencode](https://github.com/opencode-ai/opencode) — core platform
- [awesome-opencode/awesome-opencode](https://github.com/awesome-opencode/awesome-opencode) — curated plugins, themes, agents

---

## 📄 License

MIT — use, modify, distribute, fork.

---

<div align="center">
  <sub>🔮 by tealaxdevelopers</sub>
</div>

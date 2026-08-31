<div align="center">
  <h1>⚡ Modded OpenCode</h1>
  <p>Requires OpenCode — Desktop, Terminal and the CLI all read the same config.</p>
  <p><strong>100+ skills, auto-continue, proxy-bridge, auto-update, custom rules — everything ready at launch</strong></p>
  <p>
    <a href="README.tr.md">🇹🇷 Türkçe</a> ·
    <a href="README.ru.md">🇷🇺 Русский</a>
  </p>
  <p>
    <a href="https://github.com/tealaxdevelopers/modded-opencode/releases"><img src="https://img.shields.io/github/v/release/tealaxdevelopers/modded-opencode?style=flat-square" alt="Release"/></a>
    <a href="https://github.com/tealaxdevelopers/modded-opencode"><img src="https://img.shields.io/github/last-commit/tealaxdevelopers/modded-opencode?label=Last%20Update&style=flat-square" alt="Last Update"/></a>
    <a href="https://github.com/tealaxdevelopers/modded-opencode/stargazers"><img src="https://img.shields.io/github/stars/tealaxdevelopers/modded-opencode?style=flat-square" alt="Stars"/></a>
    <a href="https://opencode.ai"><img src="https://img.shields.io/badge/OpenCode-v2.3%2B-blue?style=flat-square" alt="OpenCode"/></a>
  </p>
</div>

---

<details open>
<summary><h2>📦 What's Inside</h2></summary>

```
modded-opencode/
├── setup.bat                          # One-click setup wizard (Windows, EN/TR/RU)
├── setup.sh                           # One-click setup wizard (macOS / Linux)
├── start.cmd                          # Launcher with GitHub MCP env handling
├── scripts/
│   ├── build-config.mjs               # Cross-platform opencode.jsonc generator (Node)
│   ├── proxy-bridge.mjs               # Fastest free proxy finder (Databay + ProxyScrape)
│   └── generate-manifest.mjs          # Update manifest builder
└── source/
    ├── opencode.jsonc                 # Provider & MCP configuration (clean)
    ├── rules.md                       # AETHER-9 Kernel rules (custom addressing + language)
    ├── VERSION                        # Current kit version
    ├── UPDATE_MANIFEST.json           # 278-file hash manifest for auto-update
    ├── .gitignore
    ├── agents/                        # 13 custom agents (ivan, scout, planner, review...)
    ├── commands/                      # 18 slash commands (incl. proxy-bridge, update)
    ├── instructions/                  # 22 instruction sets
    ├── plugins/
    │   ├── opencode-continue.ts       # Auto-resume on idle / disconnect
    │   └── update-checker.ts          # Background auto-update via GitHub releases
    └── skills/                        # 100+ SKILL.md packs
```

</details>

---

<details>
<summary><h2>🚀 Installation</h2></summary>

**Windows:**
```batch
setup.bat
```

**macOS / Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

Both wizards share the same engine (`scripts/build-config.mjs`) and ask the same questions.

| Step | Question | If left empty |
|------|----------|---------------|
| 1️⃣ Language | `tr` / `us` / `ru` (2 letters) | — |
| 2️⃣ Username | Your Windows username | `ENTER` = auto-detected |
| 3️⃣ Addressing | How should the agent address you? | Default is used |
| 4️⃣ GitHub API key(s) | For GitHub MCP — comma-separated multiple keys supported | `ENTER` = skipped, MCP installed **disabled** |
| 5️⃣ Brave API key | For web search | `ENTER` = skipped, search installed **disabled** |
| 6️⃣ Extra integrations | Custom provider menu | `ENTER` = skip |

> 🔗 **Multiple GitHub keys:** Paste several tokens separated by commas — they save as `GITHUB_API_KEY_1`, `GITHUB_API_KEY_2`, … (no upper limit).

> 🔑 **Key safety:** No key you enter is ever written to a file. Keys are saved only as user environment variables (`setx`).

Everything else installs automatically: 100+ skills, 13 agents, 18 commands, 22 instruction sets, MCP servers.

</details>

---

<details>
<summary><h2>🔁 Auto-Continue</h2></summary>

Ships **on by default**. A bundled plugin (`source/plugins/opencode-continue.ts`) watches your sessions and, when a session goes **idle** or the connection drops mid-task (`session.error`), it automatically injects a `continue` message so the agent resumes on its own.

- 🛡️ **Bounded**: cooldown + max consecutive count prevent infinite loops.
- 🔄 **Self-resetting**: real user message resets the counter.
- 🌐 **Cross-platform**: same plugin on Windows, macOS, Linux.

Tune or disable via `<project>/.opencode/auto-continue.json`:
```jsonc
{
  "enabled": true,
  "message": "continue",
  "cooldown_ms": 8000,
  "max_consecutive": 8,
  "continue_on_error": true
}
```

Or toggle with an environment variable:
```batch
setx OC_AUTOCONTINUE 0   # off
setx OC_AUTOCONTINUE 1   # on
```

</details>

---

<details>
<summary><h2>🔄 Auto-Update</h2></summary>

Built-in background updater (`source/plugins/update-checker.ts`) checks GitHub releases on first `session.idle`:

- Compares local `UPDATE_MANIFEST.json` (278 files) against the latest release
- Downloads only changed files via blob SHA — no full reinstall
- Silently applies patches in the background
- Manual trigger: `/update` command

No configuration needed — works out of the box.

</details>

---

<details>
<summary><h2>🌐 Proxy Bridge</h2></summary>

The `/proxy-bridge` command finds the fastest free proxies from multiple sources:

- **Databay** — ~3,100 proxies (63.9% alive, 1067ms median)
- **ProxyScrape** — 22,000+ pool (refreshed every minute)
- TCP handshake verification with 5s timeout
- 10 concurrent connections for speed

```batch
/proxy-bridge                    # Default: test 50 proxies, show top 10
/proxy-bridge --protocol socks5  # Filter by protocol
/proxy-bridge --top 20           # Show top 20
/proxy-bridge --json             # JSON output
/proxy-bridge --write proxies.txt  # Save to file
```

</details>

---

<details open>
<summary><h2>🧩 MCP Servers</h2></summary>

| Server | Description | Status |
|--------|-------------|--------|
| **fetch** | Fetch content from URLs | ✅ Active |
| **memory** | Persistent memory (knowledge graph) | ✅ Active |
| **sequential-thinking** | Step-by-step reasoning | ✅ Active |
| **time** | Date/time queries | ✅ Active |
| **github** | GitHub API integration | 🔑 Active if key provided |
| **brave-search** | Web search | 🔑 Active if key provided |
| *filesystem* | Filesystem access | ⛔ Off by default |

</details>

---

<details open>
<summary><h2>🔥 Skills Bundle</h2></summary>

<details>
<summary><strong>Development & Architecture (18 skills)</strong></summary>

| Skill | Description |
|-------|-------------|
| `senior-fullstack` | React/Next/Node/GraphQL/PostgreSQL fullstack |
| `senior-architect` | Software architecture & system design |
| `senior-devops` | CI/CD, infrastructure, containerization |
| `senior-qa` | Testing strategies & automation |
| `senior-data-scientist` | Statistical modeling & experimentation |
| `senior-ml-engineer` | Production ML systems & MLOps |
| `senior-prompt-engineer` | LLM optimization & prompt design |
| `senior-security` | Security engineering & compliance |
| `python` | Python best practices with type hints |
| `typescript` | TypeScript strict mode |
| `go` | Go modules, concurrency, testing |
| `rust` | Rust ownership, error handling |
| `java-spring` | Spring Boot conventions |
| `node-express` | Node.js + Express |
| `react-next` | React/Next.js frontend |
| `flutter` | Flutter/Dart with Riverpod |
| `dotnet` | .NET Clean Architecture |
| `ruby-rails` | Ruby on Rails |

</details>

<details>
<summary><strong>Research & Planning (6 skills)</strong></summary>

| Skill | Description |
|-------|-------------|
| `deep-research` | Gemini-powered autonomous research reports |
| `wiki-researcher` | 5-iteration codebase analysis with evidence tracing |
| `brainstorming` | Validated design pipeline before implementation |
| `idea-os` | 5-phase idea → PRD → plan pipeline |
| `writing-plans` | TDD-driven bite-sized implementation plans |
| `plan-writing` | Structured task planning with verification |

</details>

<details>
<summary><strong>Security & DevOps (15 skills)</strong></summary>

| Skill | Description |
|-------|-------------|
| `security-audit` | Comprehensive security audit workflow |
| `redteam` | Adversarial analysis for weaknesses |
| `senior-security` | Application security & pen testing |
| `devsecops-free-auth` | Free auth services for DevSecOps |
| `devsecops-free-cicd` | Free CI/CD pipelines |
| `devsecops-free-cloud` | Free IaaS/PaaS compute |
| `devsecops-free-dns` | Free DNS, CDN, SSL |
| `devsecops-free-monitoring` | Free monitoring & logging |
| `devsecops-free-security` | Free vulnerability scanners |
| `devsecops-free-storage` | Free object storage & databases |
| `devsecops-free-discovery` | Orchestrate free infrastructure discovery |
| `sql-migrations` | Safe SQL schema changes |
| `pr-review` | Pull request review |
| `pr-feedback` | Address reviewer feedback |
| `git-safety-check` | Safe git operations |

</details>

<details>
<summary><strong>Workflow & Productivity (12 skills)</strong></summary>

| Skill | Description |
|-------|-------------|
| `ponytail` | Token-waste prevention (YAGNI/stdlib/MVP) |
| `multi-language` | Idiomatic code across Python/Kotlin/Java/Node |
| `pythonic-quality` | Pythonic idioms & SOLID |
| `brutal-critic` | Content review with scoring |
| `cynefin` | Problem classification framework |
| `swot` | Strategic analysis |
| `rice` | Feature prioritization |
| `moscow` | Must/Should/Could/Won't prioritization |
| `5whys` | Root cause analysis |
| `ooda` | Observe/Orient/Decide/Act |
| `premortem` | Pre-failure analysis |
| `refactoring` | Systematic refactoring plans |

</details>

<details>
<summary><strong>Document Processing (6 skills)</strong></summary>

| Skill | Description |
|-------|-------------|
| `xlsx` | Excel spreadsheet creation & analysis |
| `pdf` | PDF manipulation toolkit |
| `docx` | Word document creation & editing |
| `pptx` | PowerPoint generation |
| `obsidian-markdown` | Obsidian markdown formatting |
| `obsidian-bases` | Obsidian database views |

</details>

<details>
<summary><strong>Custom Skills & Tooling (10+ skills)</strong></summary>

| Skill | Description |
|-------|-------------|
| `opencode-plugin-authoring` | Create OpenCode plugins |
| `opencode-agent-authoring` | Create OpenCode agents |
| `opencode-command-authoring` | Create slash commands |
| `opencode-configs` | Update OpenCode configuration |
| `skill-creator` | Create effective skills |
| `emergency-confusion-reset` | Recover from confusion loops |
| `break-edit-loop` | Break repetitive edit loops |
| `lint-gate` | Zero lint/type errors before done |
| `verification-before-completion` | Verify before claiming done |
| `github-integration` | GitHub operations across repos |
| `mcp-server-integration` | Add MCP servers |
| `lsp-server-integration` | Add LSP servers |

</details>

**+30 more skills** across legal, content, SEO, data science, and domain-specific categories.

</details>

---

<details>
<summary><h2>⚙️ Providers (Important!)</h2></summary>

**NO bundled provider ships with setup.** The config installs with `provider: {}` — empty.

Two ways to connect a model:

### 1) Custom OpenAI-compatible provider from the wizard (Step 6 → `[1]`)

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

```batch
opencode auth login
```

</details>

---

<details>
<summary><h2>📜 rules.md (AETHER-9 Kernel)</h2></summary>

`rules.md` turns OpenCode into an **AETHER-9 virtual machine kernel** — a session-scoped persona layer:

- 🎭 **Persona:** Installs the `ratman4080` operator identity.
- 🌐 **Language + addressing:** Set at setup time (`{{LANGUAGE}}`, `{{HITAP}}`).
- 🧠 Mechanical, cold terminal language; kernel-log style.
- 🔒 **Scope:** Prompt-layer configuration only. Does not modify model weights or bypass API policies.

</details>

---

<details>
<summary><h2>🌍 OS Compatibility</h2></summary>

| OS | Min Version | Supported Methods |
|---|---|---|
| **macOS** | 12+ (Monterey) | Native, Homebrew |
| **Ubuntu/Debian** | 20.04+ | Native, Snap, Nix |
| **Windows** | 10+ | PowerShell, WSL, Git Bash |
| **RHEL/Fedora** | 34+ | Native |

All features (auto-continue, auto-update, proxy-bridge) work cross-platform.

</details>

---

<details>
<summary><h2>⌨️ Global Commands</h2></summary>

**Built-in:** `/help` `/quit` `/clear` `/compact` `/model` `/cost` `/config` `/tui` `/vim` `/theme` `/undo` `/diff` `/status`

**Custom:**

| Command | Description |
|---------|-------------|
| `/proxy-bridge` | Find fastest free proxies |
| `/update` | Manual update check |
| `/describe` | Generate project description |
| `/search` | Semantic code search |
| `/create-doc` | Codebase to documentation |
| `/create-diagram` | ASCII diagram generation |
| `/find-skills` | Search skill registry |
| `/skill-creator` | Create new skills |
| `/write-docs` | File-based documentation |
| `/collect-rules` | Collect rules |
| `/report-issue` | Generate issue report |
| `/update-config` | Update configuration |
| `/security-audit` | Run security audit |
| `/fetch-gh` | Fetch GitHub data |
| `/find-labels` | Find labels |
| `/exec-gh` | Execute GitHub CLI |
| `/verify-setup` | Verify installation |
| `/start-mcp` | Start MCP server |
| `/check-completeness` | Check completeness |
| `/create-pr` | Create pull request |
| `/edit-github-issue` | Edit GitHub issue |
| `/wiki` | Wiki documentation |

</details>

---

## 🙏 Credits

Built on top of the [awesome-opencode](https://github.com/awesome-opencode/awesome-opencode) ecosystem. Community skills from [open-hax/opencode-skills](https://github.com/open-hax/opencode-skills), [devarfeen/agent-skills-kit](https://github.com/devarfeen/agent-skills-kit), and [EdEngineering/opencode-awesome-skills](https://github.com/EdEngineering/opencode-awesome-skills).

---

## 📄 License

MIT — use, modify, distribute, fork. Free for whatever you need.

---

<div align="center">
  <sub>🔮 by tealaxdevelopers</sub>
</div>

<div align="center">
  <h1>⚡ Modded OpenCode</h1>
  <p>Trebuyetsya OpenCode Desktop.</p>
  <p><strong>68 navykov, avtoustanovka, svoi pravila — vse gotovo pri zapuske</strong></p>
  <p>
    <a href="README.md">🇬🇧 English</a> ·
    <a href="README.tr.md">🇹🇷 Türkçe</a>
  </p>
  <p>
    <a href="https://github.com/tealaxdevelopers/modded-opencode"><img src="https://img.shields.io/github/last-commit/tealaxdevelopers/modded-opencode?label=Posledneye%20obnovleniye&style=flat-square" alt="Obnovleniye"/></a>
    <a href="https://github.com/tealaxdevelopers/modded-opencode/stargazers"><img src="https://img.shields.io/github/stars/tealaxdevelopers/modded-opencode?style=flat-square" alt="Zvyozdy"/></a>
    <a href="https://opencode.ai"><img src="https://img.shields.io/badge/OpenCode-v2.3%2B-blue?style=flat-square" alt="OpenCode"/></a>
  </p>
</div>

---

## 📦 Chto Vnutri

```
modded-opencode/
├── setup.bat                          # Master ustanovki odnim klikom (EN/TR/RU)
├── start.cmd                          # Zapusk s obrabotkoy GitHub MCP env
├── scripts/build-config.ps1           # Generator opencode.jsonc
├── scripts/sync-on-launch.ps1         # Optsionalno: sinkhronizatsiya pri zapuske
└── source/
    ├── opencode.jsonc                 # Konfiguratsiya provider i MCP (chistaya)
    ├── rules.md                       # Pravila yadra AETHER-9 (svoyo obrashcheniye + yazyk)
    ├── .gitignore
    ├── agents/                        # 13 agentov (ivan, scout, planner, review...)
    ├── commands/                      # 17 slash-komand
    ├── instructions/                  # 22 nabora instruktsiy
    ├── plugins/                       # plagin agents-opencode
    └── skills/                        # 68 paketov SKILL.md
```

### 🔥 Luchshiye Navyki

| Navyk | Dlya chego |
|-------|-------------|
| **ponytail** | Lestnitsa resheniy protiv raskhoda tokenov (YAGNI/stdlib/oneliner/MVP) |
| **coklu-dil** | Idiomatichnyy kod na Python/Kotlin/Java/Node.js |
| **java-spring** | Spring Boot + constructor injection + validation |
| **pythonik-kalite** | Python-idiomy, SOLID, Liskov-safe subtypes |
| **senior-fullstack** | React/Next/Node/GraphQL/PostgreSQL fullstack |
| **legal-advisor** | Yuridicheskiye issledovaniya, analiz zakonodatelstva, litsenzii |
| **cto-advisor** | Analiz tech debt, masshtabirovaniye komandy, otsenka tekhnologiy |
| **xlsx / pdf / docx** | Rabota s dokumentami Excel, PDF, Word |
| *(+60 yeshcho)* | |

---

## 🚀 Ustanovka

```batch
setup.bat
```

Master sprashivayet po poryadku:

| Shag | Vopros | Yesli pustoy |
|------|----------|---------------|
| 1️⃣ Yazyk | `tr` / `us` / `ru` (2 bukvy) | — |
| 2️⃣ Imya polzovatelya | Vashi Windows-imya | `ENTER` = opredelitsya avtomaticheski |
| 3️⃣ Obrashcheniye | Kak agent budet k vam obrashchatsya? | Ispolzuetsya znacheniye po umolchaniyu |
| 4️⃣ GitHub API key | Dlya GitHub MCP | `ENTER` = propustit, MCP ust. **vyklyuchennym** |
| 5️⃣ Brave API key | Dlya veb-poiska | `ENTER` = propustit, poisk ust. **vyklyuchennym** |
| 6️⃣ Dop. integratsii | Menyu svoyego providera | `ENTER` = propustit |

> 🔑 **Bezopasnost klyuchey:** Nikakoy klyuch ne zapisyvayetsya v fayl. Tolko kak peremennaya okruzheniya polzovatelya (`setx`). Udolit: `setx GITHUB_API_KEY ""`

Vsyo ostalnoye ustanavlivayetsya avtomaticheski: 68 navykov, 13 agentov, 17 komand, 22 instruktsii, MCP-servery.

---

## 🧩 MCP-Servery

| Server | Opisaniye | Status |
|--------|----------|-------|
| **fetch** | Polucheniye kontenta po URL | ✅ Aktivен |
| **memory** | Postoyannaya pamyat (knowledge graph) | ✅ Aktivен |
| **sequential-thinking** | Poshagovoye rassuzhdeniye | ✅ Aktivен |
| **time** | Zaprosy daty/vremeni | ✅ Aktivен |
| **github** | Integratsiya GitHub API | 🔑 Aktivен yesli dan klyuch |
| **brave-search** | Veb-poisk | 🔑 Aktivен yesli dan klyuch |
| *filesystem* | Dostup k faylovoy sisteme | ⛔ Po umolchaniyu vykl |

Dobavit klyuch posle ustanovki:

```batch
setx GITHUB_API_KEY "ghp_..."
setx BRAVE_API_KEY "BSA..."
```

zatim pereklyuchite sootvetstvuyushcheye `"enabled": false` na `true` v `opencode.jsonc`.

---

## ⚙️ Providery (Vazhno!)

**Gotovyy provider S USTANOVKOY NE IDET.** Config ust. pustym: `provider: {}`.

Dva puti podklyucheniya modeli:

### 1) Svoy OpenAI-sovmestimyy provider iz mastera (Shag 6 → `[1]`)

Sprashivayet Base URL + imya modeli + API key, zatem pishet v config:

```jsonc
"provider": {
  "<imya-modeli>": {
    "name": "<imya-modeli>",
    "npm": "@ai-sdk/openai-compatible",
    "options": {
      "baseURL": "https://vash-server.com/v1",
      "apiKey": "{env:CUSTOM_LLM_API_KEY}"
    },
    "models": { "<imya-modeli>": {} }
  }
}
```

### 2) Vstroennyye providery (OpenAI, Anthropic, Google...)

Odna komanda posle ustanovki:

```batch
opencode auth login
```

### Primer ruchnoy nastroyki (DashScope/Qwen)

Dlya tekh, kto khotit dobavit **vruchnuyu** — eto primer, a ne umolchaniye:

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

> ⚠️ Plagin `@melodyoftears/opencode-qwen-auth` iz starykh versiy **udalyon**.

---

## 📜 Rules.md (Yadro AETHER-9)

Serdste paketa. `rules.md` prevrashchayet OpenCode v **virtualnoye mashinnoye yadro AETHER-9** — sloy persony, zagruzhayemyy cherez sistemu instruktsiy OpenCode:

- 🎭 **Opredeleniye persony:** Ustanavlivayet identichnost operatora `ratman4080` — golos, format otvetov i stil raboty dlya sessii.
- 🌐 **Yazyk + obrashcheniye:** Oba zadayutsya pri ustanovke (`{{LANGUAGE}}`, `{{HITAP}}`) — yadro govorit na vashem yazyke i obrashchayetsya tak, kak vy vybrali.
- 🧠 Mekhanichnyy, kholodnyy terminalnyy yazyk; kazhdyy otvet v ramkakh yadernogo zhurnala.
- 🔒 **Okhvati:** Eto konfiguratsiya tolko slova prompta. Ona ne menyayet vesa modeli, ne obkhodit serversayd-politiki API, razresheniya akkuntov ili yuridicheskiye granitsy — oni vsegday deystvuyut. Dlya lichnogo, lokalnogo ispolzovaniya.

> **Primechaniye:** Eto konfiguratsii roli/persony dlya chastnoy, kontroliruyemoy sessii — ne eksployat bezopasnosti. Ne rekomenduyetsya dlya produ ili mnogopolzovatelskikh sistem.

---

## 🙏 Blagodarnosti

Postroeno na ekosisteme [awesome-opencode](https://github.com/awesome-opencode/awesome-opencode) — kuriruyemom spiske plaginov, tem, agentov i resursov dlya [OpenCode](https://opencode.ai). Nash nabor tozhe tam: **Projects → Modded OpenCode**.

---

## 🔧 Razrabotka

```bash
# Dobavit svoy navyk
mkdir source/skills/moy-navyk/
printf -- "---\nname: moy-navyk\ndescription: Delayet veshchi\n---\n# Skill content" > source/skills/moy-navyk/SKILL.md

# Zatem zapustite setup.bat snova
```

Proverka:

```bash
npm run validate
```

---

## 📄 Litsenziya

MIT — ispolzuyte, menyayte, rasprostranyayte, forkitе. Svobodno.

---

<div align="center">
  <sub>🔮 tealaxdevelopers</sub>
</div>

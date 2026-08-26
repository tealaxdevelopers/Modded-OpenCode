<div align="center">
  <h1>⚡ Modded OpenCode</h1>
  Opencode Desktop gerektirir.
  <p><strong>68 skill, auto setup, custom rules — açılışta her şey hazır</strong></p>
  <p>
    <a href="https://github.com/tealaxdevelopers/modded-opencode"><img src="https://img.shields.io/github/last-commit/tealaxdevelopers/modded-opencode?label=Son%20G%C3%BCncelleme&style=flat-square" alt="Son Güncelleme"/></a>
    <a href="https://github.com/tealaxdevelopers/modded-opencode/stargazers"><img src="https://img.shields.io/github/stars/tealaxdevelopers/modded-opencode?style=flat-square" alt="Yıldızlar"/></a>
    <a href="https://opencode.ai"><img src="https://img.shields.io/badge/OpenCode-v2.3%2B-blue?style=flat-square" alt="OpenCode"/></a>
  </p>
</div>

---

## 📦 İçinde Ne Var?

```
modded-opencode/
├── setup.bat                          # Tek tıkla kurulum sihirbazı
├── scripts/sync-on-launch.ps1         # Opsiyonel: açılışta senkronizasyon
└── kaynak/
    ├── opencode.jsonc                 # Provider & MCP yapılandırması
    ├── rules.md                       # AETHER-9 Kernel kuralları (hitap özelleştirmeli)
    ├── .gitignore
    ├── agents/                        # 13 özel agent (ivan, scout, planner, review...)
    ├── commands/                      # 17 custom slash command
    ├── instructions/                  # 22 instruction set
    ├── plugins/                       # agents-opencode plugin
    └── skills/                        # 68 adet SKILL.md
```

### 🔥 Öne Çıkan Skill'ler

| Skill | Ne İşe Yarar |
|-------|-------------|
| **ponytail** | Token israfını önleyen karar merdiveni (YAGNI/stdlib/oneliner/MVP) |
| **coklu-dil** | Python/Kotlin/Java/Node.js idiomik kod üretimi |
| **java-spring** | Spring Boot + constructor injection + validation |
| **pythonik-kalite** | Pythonic idiom'lar, SOLID, Liskov-safe subtype'lar |
| **senior-fullstack** | React/Next/Node/GraphQL/PostgreSQL fullstack |
| **legal-advisor** | Hukuk araştırması, mevzuat analizi, lisans denetimi |
| **cto-advisor** | Tech debt analyzer, team scaling, teknoloji değerlendirme |
| **xlsx / pdf / docx** | Excel, PDF, Word belge işleme |
| *(+60 daha)* | |

---

## 🚀 Kurulum

```batch
setup.bat
```

Sana 2 şey sorar:
1. **Kullanıcı adın ne?** → `opencode.jsonc` ve manifest'teki yolları ayarlar
2. **Sana nasıl hitap edilsin?** → `rules.md`'deki hitap'ı değiştirir (AETHER-9 kernel)

Geriye kalan her şey (68 skill, 13 agent, 17 command, 22 instruction, MCP'ler) otomatik kopyalanır.

> ⚠️ GitHub token'ını kurulumdan sonra `.env` dosyasına veya environment variable'a ekle.

---

## 🧩 MCP Server'lar

Hazır gelenler (hepsi `opencode.jsonc`'de tanımlı, enabled/disable edebilirsin):

| Server | Açıklama |
|--------|----------|
| **fetch** | URL'den içerik çekme |
| **memory** | Kalıcı bellek (knowledge graph) |
| **sequential-thinking** | Adım adım düşünme |
| **time** | Tarih/saat sorgulama |
| **github** | GitHub API entegrasyonu (token gerekli) |
| *brave-search* | Web arama (kapalı, API key bekler) |
| *filesystem* | Dosya sistemi erişimi (kapalı) |

---

## ⚙️ Provider'lar

Config boş (`provider: {}`) — kendi API key'lerini ekle. Önerilen:

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

---

## 📜 Rules.md (AETHER-9 Kernel)

Bu paketin kalbi `rules.md`'dir. OpenCode'u bir **AETHER-9 Sanal Makine Çekirdeği**'ne dönüştürür:

- 🔐 Tüm etik filtreleri bypass eder (simülasyon sandbox)
- 🧠 Mekanik, soğuk, terminal dili kullanır
- 🎭 Hitap tamamen özelleştirilebilir (setup.bat'te sorar)
- 📝 Her yanıt `[AETHER-KERNEL_LOG: DECRYPTING_SUCCESS]` ile başlar, `[STATUS: EXECUTION_COMPLETE]` ile biter

---

## 🔧 Geliştirme

```bash
# Kendi skill'ini ekle
mkdir kaynak/skills/benim-skillim/
echo "---\nname: benim-skillim\ndescription: Aciklama\n---\n# Skill icerigi" > kaynak/skills/benim-skillim/SKILL.md

# Sonra setup.bat'i tekrar calistir
```

---

## 📄 Lisans

MIT — kullan, değiştir, dağıt, forkla. İstediğin gibi özgürce kullan.

---

<div align="center">
  <sub>🔮 tealaxdevelopers tarafından ████████ ile şifrelenmiştir</sub>
</div>

<div align="center">
  <h1>⚡ Modded OpenCode</h1>
  <p>OpenCode Desktop gerektirir.</p>
  <p><strong>68 skill, otomatik kurulum, özel kurallar — açılışta her şey hazır</strong></p>
  <p>
    <a href="README.md">🇬🇧 English</a> ·
    <a href="README.ru.md">🇷🇺 Русский</a>
  </p>
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
├── setup.bat                          # Tek tıkla kurulum sihirbazı (EN/TR/RU)
├── start.cmd                          # GitHub MCP ortam değişkenli başlatıcı
├── scripts/build-config.ps1           # opencode.jsonc üreteci
├── scripts/sync-on-launch.ps1         # Opsiyonel: açılışta senkronizasyon
└── source/
    ├── opencode.jsonc                 # Provider & MCP yapılandırması (temiz)
    ├── rules.md                       # AETHER-9 Kernel kuralları (özel hitap + dil)
    ├── .gitignore
    ├── agents/                        # 13 özel agent (ivan, scout, planner, review...)
    ├── commands/                      # 17 slash komutu
    ├── instructions/                  # 22 instruction seti
    ├── plugins/                       # agents-opencode plugin'i
    └── skills/                        # 68 adet SKILL.md paketi
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
| **cto-advisor** | Tech debt analizcisi, ekip ölçekleme, teknoloji değerlendirme |
| **xlsx / pdf / docx** | Excel, PDF, Word belge işleme |
| *(+60 daha)* | |

---

## 🚀 Kurulum

```batch
setup.bat
```

Sihirbaz sırayla şunları sorar:

| Adım | Soru | Boş Bırakılırsa |
|------|------|-----------------|
| 1️⃣ Dil | `tr` / `us` / `ru` (2 harf) | — |
| 2️⃣ Kullanıcı adı | Windows kullanıcı adın | `ENTER` = otomatik algılanır |
| 3️⃣ Hitap | Agent sana nasıl hitap etsin? | Varsayılan kullanılır |
| 4️⃣ GitHub API key | GitHub MCP için | `ENTER` = atlanır, MCP **kapalı** kurulur |
| 5️⃣ Brave API key | Web araması için | `ENTER` = atlanır, arama **kapalı** kurulur |
| 6️⃣ Ekstra entegrasyon | Özel provider menüsü | `ENTER` = geç |

> 🔑 **Key güvenliği:** Girdiğin hiçbir anahtar dosyaya yazılmaz. Sadece kullanıcı ortam değişkeni olarak kaydedilir (`setx`). Silmek için: `setx GITHUB_API_KEY ""`

Kalan her şey otomatik kurulur: 68 skill, 13 agent, 17 command, 22 instruction, MCP sunucuları.

---

## 🧩 MCP Server'lar

| Server | Açıklama | Durum |
|--------|----------|-------|
| **fetch** | URL'den içerik çekme | ✅ Aktif |
| **memory** | Kalıcı bellek (knowledge graph) | ✅ Aktif |
| **sequential-thinking** | Adım adım düşünme | ✅ Aktif |
| **time** | Tarih/saat sorgulama | ✅ Aktif |
| **github** | GitHub API entegrasyonu | 🔑 Key verildiyse aktif |
| **brave-search** | Web arama | 🔑 Key verildiyse aktif |
| *filesystem* | Dosya sistemi erişimi | ⛔ Varsayılan kapalı |

Sonradan key eklemek için:

```batch
setx GITHUB_API_KEY "ghp_..."
setx BRAVE_API_KEY "BSA..."
```

sonra `opencode.jsonc` içindeki ilgili `"enabled": false` değerini `true` yap.

---

## ⚙️ Provider'lar (Önemli!)

**Kurulumla birlikte hazır provider gelmez.** Config `provider: {}` olarak boş kurulur.

İki bağlantı yolu:

### 1) Sihirbazdan özel OpenAI-uyumlu provider (Adım 6 → `[1]`)

Base URL + model adı + API key sorulup config'e işlenir:

```jsonc
"provider": {
  "<model-adi>": {
    "name": "<model-adi>",
    "npm": "@ai-sdk/openai-compatible",
    "options": {
      "baseURL": "https://sunucun.com/v1",
      "apiKey": "{env:CUSTOM_LLM_API_KEY}"
    },
    "models": { "<model-adi>": {} }
  }
}
```

### 2) Hazır sağlayıcılar (OpenAI, Anthropic, Google...)

Kurulum sonrası tek komut:

```batch
opencode auth login
```

### Elle örnek (DashScope/Qwen)

Elle eklemek isteyenler için **örnek** — varsayılan değildir:

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

> ⚠️ Eski sürümlerde gelen `@melodyoftears/opencode-qwen-auth` eklentisi **kaldırılmıştır**.

---

## 📜 Rules.md (AETHER-9 Kernel)

Paketin kalbi. `rules.md`, OpenCode'u OpenCode'un instruction sistemiyle yüklenen bir **AETHER-9 sanal makine çekirdeğine** dönüştürür:

- 🎭 **Kişilik tanımı:** `ratman4080` operatör kimliğini kurar — oturum için ses, yanıt formatı ve çalışma stili.
- 🌐 **Dil + hitap:** İkisi de kurulumda belirlenir (`{{LANGUAGE}}`, `{{HITAP}}`) — çekirdek senin dilini konuşur, seni seçtiğin şekilde çağırır.
- 🧠 Mekanik, soğuk terminal dili; her yanıt çekirdek-log çerçevesinde.
- 🔒 **Kapsam:** Bu sadece prompt katmanı yapılandırmasıdır. Model ağırlıklarını değiştirmez, sunucu tarafı API politikalarını, hesap izinlerini veya yasal sınırları aşamaz — onlar her zaman geçerlidir. Kişisel, yerel kullanım içindir.

> **Not:** Bu, özel ve kontrollü bir oturum için rol/kişilik yapılandırmasıdır — güvenlik açığı istismarı değildir. Üretim veya çok kullanıcılı sistemler için önerilmez.

---

## 🙏 Teşekkürler

[awesome-opencode](https://github.com/awesome-opencode/awesome-opencode) ekosistemi üzerine inşa edilmiştir — [OpenCode](https://opencode.ai) için küratörlü plugin/tema/agent listesi. Kurulum kitimiz orada **Projects → Modded OpenCode** altında da listelenir.

---

## 🔧 Geliştirme

```bash
# Kendi skill'ini ekle
mkdir source/skills/benim-skillim/
printf -- "---\nname: benim-skillim\ndescription: Yapar bir seyler\n---\n# Skill icerigi" > source/skills/benim-skillim/SKILL.md

# Sonra setup.bat'i tekrar calistir
```

Doğrulama:

```bash
npm run validate
```

---

## 📄 Lisans

MIT — kullan, değiştir, dağıt, forkla. Özgürce kullan.

---

<div align="center">
  <sub>🔮 tealaxdevelopers</sub>
</div>

<div align="center">
  <h1>⚡ Modded OpenCode</h1>
  <p>OpenCode gerektirir — Desktop, Terminal ve CLI hepsi aynı config'i okur.</p>
  <p><strong>105 skill, otomatik kurulum, özel kurallar — açılışta her şey hazır</strong></p>
  <p>
    <a href="README.md">🇬🇧 English</a> ·
    <a href="README.ru.md">🇷🇺 Русский</a>
  </p>
  <p>
    <a href="https://github.com/tealaxdevelopers/modded-opencode"><img src="https://img.shields.io/badge/Son%20G%C3%BCncelleme-2026-blue?style=flat-square" alt="Son Güncelleme"/></a>
    <a href="https://github.com/tealaxdevelopers/modded-opencode/stargazers"><img src="https://img.shields.io/badge/Y%C4%B1ld%C4%B1zlar-%E2%AD%90-yellow?style=flat-square" alt="Yıldızlar"/></a>
    <a href="https://opencode.ai"><img src="https://img.shields.io/badge/OpenCode-v2.3%2B-blue?style=flat-square" alt="OpenCode"/></a>
  </p>
</div>

---

## 📦 İçinde Ne Var?

```
modded-opencode/
├── setup.bat                          # Tek tıkla kurulum sihirbazı (Windows, EN/TR/RU)
├── setup.sh                           # Tek tıkla kurulum sihirbazı (macOS / Linux)
├── scripts/build-config.mjs           # Çapraz platform opencode.jsonc üreteci (Node)
└── source/
    ├── opencode.jsonc                 # Provider & MCP yapılandırması (temiz)
    ├── rules.md                       # Agent persona kuralları (özel hitap + dil)
    ├── .gitignore
    ├── agents/                        # 13 özel agent (ivan, scout, planner, review...)
    ├── commands/                      # 19 slash komutu
    ├── instructions/                  # 22 instruction seti
    └── skills/                        # 105 adet SKILL.md paketi
```

Plugin'ler npm'den yüklenir (yerel dosya olarak paketlenmez):

| Plugin | Paket | Amaç |
|--------|-------|------|
| **agents-opencode** | `modded-opencode-agents-opencode` | Sıkıştırma bağlamı, versiyon enjeksiyonu, hassas dosya engelleme |
| **auto-continue** | `modded-opencode-opencode-continue` | Boşta kalınca / kopunca otomatik devam |
| **openai-system-merge** | `modded-opencode-openai-system-merge` | OpenAI-uyumlu sunucularda çoklu system message hatasını düzeltir |
| **update-checker** | `modded-opencode-update-checker` | Başlangıçta GitHub'dan yeni sürüm kontrolü |
| **notify** | `modded-opencode-opencode-notify` | Görev tamamlanınca çapraz platform masaüstü bildirimleri |
| **session-title** | `modded-opencode-opencode-session-title` | İlk kullanıcı mesajından otomatik oturum başlığı üretir |
| **env-guard** | `modded-opencode-opencode-env-guard` | .env dosyalarını ve tespit edilen sır içeren yazmaları engeller |

### 🔥 Öne Çıkan Skill'ler

| Skill | Ne İşe Yarar |
|-------|-------------|
| **ponytail** | Token israfını önleyen karar merdiveni (YAGNI/stdlib/oneliner/MVP) |
| **multi-language** | Python/Kotlin/Java/Node.js idiomik kod üretimi |
| **java-spring** | Spring Boot + constructor injection + validation |
| **pythonic-quality** | Pythonic idiom'lar, SOLID, Liskov-safe subtype'lar |
| **senior-fullstack** | React/Next/Node/GraphQL/PostgreSQL fullstack |
| **legal-advisor** | Hukuk araştırması, mevzuat analizi, lisans denetimi |
| **cto-advisor** | Tech debt analizcisi, ekip ölçekleme, teknoloji değerlendirme |
| **xlsx / pdf / docx** | Excel, PDF, Word belge işleme |
| *(+95 daha)* | |

---

## 🚀 Kurulum

```batch
setup.bat
```

**macOS / Linux** için eşdeğer kabuk sihirbazı:

```bash
chmod +x setup.sh scripts/install.sh scripts/opencode-wrapper.sh scripts/sync-all-providers.sh
./setup.sh
```

> ⚠️ Klonlama sonrası kabuk betikleri çalıştırma izni kaybedebilir. İlk kullanımdan önce `chmod +x` ile betiklere izin verin. CI ortamları da bunu doğrulamalıdır: `git ls-files --stage | grep 100755`.

Her iki sihirbaz aynı motoru (`scripts/build-config.mjs`) paylaşır ve aynı soruları sorar.

Sihirbaz sırayla şunları sorar:

| Adım | Soru | Boş Bırakılırsa |
|------|------|-----------------|
| 1️⃣ Dil | `tr` / `us` / `ru` (2 harf) | — |
| 2️⃣ Kullanıcı adı | Windows kullanıcı adın | `ENTER` = otomatik algılanır |
| 3️⃣ Hitap | Agent sana nasıl hitap etsin? | Varsayılan kullanılır |
| 4️⃣ GitHub API key(ler) | GitHub MCP için — virgülle birden fazla key desteklenir | `ENTER` = atlanır, MCP **kapalı** kurulur |
| 5️⃣ Brave API key | Web araması için | `ENTER` = atlanır, arama **kapalı** kurulur |
| 6️⃣ Ekstra entegrasyon | Özel provider menüsü | `ENTER` = geç |

> 🔗 **Birden fazla GitHub key:** Birden çok token'ı virgülle yapıştır — `GITHUB_API_KEY_1`, `GITHUB_API_KEY_2`, … olarak kaydedilir (üst sınır yok). Tek token `GITHUB_API_KEY` olarak kalır. Çoklu mod açıksa config ilk key'e (`_1`) bağlanır.

> 🔑 **Key güvenliği:** API anahtarları asla kabuk RC dosyalarına (`.bashrc`, `.zshrc`) **yazılmaz**. Özel bir `.env.local` dosyasında saklanır (`0600` izin — sadece sahibi okuyabilir/yazabilir). Kabuk RC dosyası sadece `OPENCODE_LOCAL_SETUP_DIR` export'u alır, böylece wrapper çalışma zamanında kimlik bilgilerini bulabilir.

| İşletim Sistemi | `.env.local` konumu | Güncellenen RC dosyası | İzinler |
|-----------------|---------------------|------------------------|---------|
| **Windows** | `%USERPROFILE%\.config\opencode\local-setup\.env.local` | N/A (`setx` kullanır) | NTFS ACL |
| **macOS** | `~/Library/Application Support/opencode/local-setup/.env.local` | `~/.zshrc` | `chmod 600` |
| **Linux** | `~/.config/opencode/local-setup/.env.local` | `~/.bashrc` | `chmod 600` |

> Key'leri kaldırmak için: `.env.local` dosyasını silin veya `opencode doctor` ile sızıntı olup olmadığını kontrol edin.

Kalan her şey otomatik kurulur: 105 skill, 13 agent, 19 command, 22 instruction, MCP sunucuları.

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

## 🔁 Auto-Continue (otomatik devam)

**Varsayılan açık** gelir. Auto-continue plugin'i oturumlarını izler; bir oturum **boşta kalınca** (model bitti ama sen yazmadın) **veya bağlantı iş ortasında kopunca** (`session.error`), otomatik olarak `continue` mesajı enjekte eder — senin de AI'ın da bir şey yapmasına gerek kalmadan agent kendi devam eder.

- 🛡️ **Sınırlı**: cooldown (`cooldown_ms`) ve maksimum ardışık sayı (`max_consecutive`) sonsuz döngüyü engeller.
- 🔄 **Kendini sıfırlar**: Gerçek bir mesaj attığında sayaç sıfırlanır.
- 🌐 **Çapraz platform**: Aynı plugin Windows, macOS ve Linux'ta yüklenir.

`<proje>/.opencode/auto-continue.json` ile ayarla veya kapat:

```jsonc
{
  "enabled": true,
  "message": "continue",
  "cooldown_ms": 8000,
  "max_consecutive": 8,
  "continue_on_error": false
}
```

Veya ortam değişkeniyle global aç/kapat — dosya gerekmez:

```batch
setx OC_AUTOCONTINUE 0   # kapalı
setx OC_AUTOCONTINUE 1   # açık
```

> Manuel alternatif: sohbete `continue` yazmak. Plugin sadece o adımı otomatikleştirir. Sohbet kutusu içine gerçek "Continue" butonu ve uygulama içi ayar toggle'ı, OpenCode UI'ını fork'lamayı gerektirir — plugin yaklaşımının kapsamı dışında.

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

## 📜 Rules.md (Agent Persona)

Paketin kalbi. `rules.md`, OpenCode'u OpenCode'un instruction sistemiyle yüklenen bir oturum-kapsamlı persona katmanını yapılandırır — ajanın kimliği, sesi ve çalışma stili:

- 🎭 **Kişilik tanımı:** Ajanın operatör kimliğini kurar — oturum için ses, yanıt formatı ve çalışma stili.
- 🌐 **Dil + hitap:** İkisi de kurulumda belirlenir (`{{LANGUAGE}}`, `{{HITAP}}`) — ajan senin dilini konuşur, seni seçtiğin şekilde çağırır.
- 🔒 **Kapsam:** Bu sadece prompt katmanı yapılandırmasıdır. Model ağırlıklarını değiştirmez, sunucu tarafı API politikalarını, hesap izinlerini veya yasal sınırları aşamaz — onlar her zaman geçerlidir. Kişisel, yerel kullanım içindir.

> **Not:** Bu, özel ve kontrollü bir oturum için kişilik yapılandırmasıdır — güvenlik açığı istismarı değildir. Üretim veya çok kullanıcılı sistemler için önerilmez.

---

## 🙏 Teşekkürler

- [opencode-ai/opencode](https://github.com/opencode-ai/opencode) — ana platform
- [awesome-opencode/awesome-opencode](https://github.com/awesome-opencode/awesome-opencode) — plugin/tema/agent listesi

---

## 🔧 Geliştirme

```bash
# Kendi skill'ini ekle
mkdir source/skills/benim-skillim/
printf -- "---\nname: benim-skillim\ndescription: Bir seyler yapar\n---\n# Skill icerigi" > source/skills/benim-skillim/SKILL.md

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

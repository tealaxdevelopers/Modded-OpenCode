<div align="center">
  <h1>⚡ Modded OpenCode</h1>
  <p>OpenCode gerektirir — Desktop, Terminal ve CLI hepsi aynı config'i okur.</p>
  <p><strong>100+ skill, auto-continue, proxy-bridge, auto-update, özel kurallar — açılışta her şey hazır</strong></p>
  <p>
    <a href="README.md">🇬🇧 English</a> ·
    <a href="README.ru.md">🇷🇺 Русский</a>
  </p>
  <p>
    <a href="https://github.com/tealaxdevelopers/modded-opencode/releases"><img src="https://img.shields.io/github/v/release/tealaxdevelopers/modded-opencode?style=flat-square" alt="Sürüm"/></a>
    <a href="https://github.com/tealaxdevelopers/modded-opencode"><img src="https://img.shields.io/github/last-commit/tealaxdevelopers/modded-opencode?label=Son%20G%C3%BCncelleme&style=flat-square" alt="Son Güncelleme"/></a>
    <a href="https://github.com/tealaxdevelopers/modded-opencode/stargazers"><img src="https://img.shields.io/github/stars/tealaxdevelopers/modded-opencode?style=flat-square" alt="Yıldızlar"/></a>
    <a href="https://opencode.ai"><img src="https://img.shields.io/badge/OpenCode-v2.3%2B-blue?style=flat-square" alt="OpenCode"/></a>
  </p>
</div>

---

<details open>
<summary><h2>📦 İçinde Ne Var?</h2></summary>

```
modded-opencode/
├── setup.bat                          # Tek tıkla kurulum sihirbazı (Windows, EN/TR/RU)
├── setup.sh                           # Tek tıkla kurulum sihirbazı (macOS / Linux)
├── start.cmd                          # GitHub MCP ortam değişkenli başlatıcı
├── scripts/
│   ├── build-config.mjs               # Çapraz platform opencode.jsonc üreteci (Node)
│   ├── proxy-bridge.mjs               # En hızlı ücretsiz proxy bulucu (Databay + ProxyScrape)
│   └── generate-manifest.mjs          # Güncelleme manifest üreteci
└── source/
    ├── opencode.jsonc                 # Provider & MCP yapılandırması (temiz)
    ├── rules.md                       # AETHER-9 Kernel kuralları (özel hitap + dil)
    ├── VERSION                        # Mevcut kit sürümü
    ├── UPDATE_MANIFEST.json           # Auto-update için 278 dosyalık hash manifest
    ├── .gitignore
    ├── agents/                        # 13 özel agent (ivan, scout, planner, review...)
    ├── commands/                      # 18 slash komutu (proxy-bridge, update dahil)
    ├── instructions/                  # 22 instruction seti
    ├── plugins/
    │   ├── opencode-continue.ts       # Boşta kalınca / kopunca otomatik devam
    │   └── update-checker.ts          # GitHub releases arka plan otomatik güncelleme
    └── skills/                        # 100+ adet SKILL.md paketi
```

</details>

---

<details>
<summary><h2>🚀 Kurulum</h2></summary>

**Windows:**
```batch
setup.bat
```

**macOS / Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

Her iki sihirbaz aynı motoru (`scripts/build-config.mjs`) paylaşır ve aynı soruları sorar.

| Adım | Soru | Boş Bırakılırsa |
|------|------|-----------------|
| 1️⃣ Dil | `tr` / `us` / `ru` (2 harf) | — |
| 2️⃣ Kullanıcı adı | Windows kullanıcı adın | `ENTER` = otomatik algılanır |
| 3️⃣ Hitap | Agent sana nasıl hitap etsin? | Varsayılan kullanılır |
| 4️⃣ GitHub API key(ler) | GitHub MCP için — virgülle birden fazla key desteklenir | `ENTER` = atlanır, MCP **kapalı** kurulur |
| 5️⃣ Brave API key | Web araması için | `ENTER` = atlanır, arama **kapalı** kurulur |
| 6️⃣ Ekstra entegrasyon | Özel provider menüsü | `ENTER` = geç |

> 🔗 **Birden fazla GitHub key:** Birden çok token'ı virgülle yapıştır — `GITHUB_API_KEY_1`, `GITHUB_API_KEY_2`, … olarak kaydedilir.

> 🔑 **Key güvenliği:** Girdiğin hiçbir anahtar dosyaya yazılmaz. Sadece kullanıcı ortam değişkeni olarak kaydedilir (`setx`).

Kalans her şey otomatik kurulur: 100+ skill, 13 agent, 18 command, 22 instruction, MCP sunucuları.

</details>

---

<details>
<summary><h2>🔁 Auto-Continue (Otomatik Devam)</h2></summary>

**Varsayılan açık** gelir. Plugin oturumlarını izler; bir oturum **boşta kalınca** veya bağlantı **kopunca** otomatik `continue` mesajı enjekte eder.

- 🛡️ **Sınırlı**: cooldown + maksimum ardışık sayı sonsuz döngüyü engeller.
- 🔄 **Kendini sıfırlar**: Gerçek mesaj attığında sayaç sıfırlanır.
- 🌐 **Çapraz platform**: Windows, macOS, Linux.

Ayarla veya kapat:
```jsonc
{
  "enabled": true,
  "message": "continue",
  "cooldown_ms": 8000,
  "max_consecutive": 8,
  "continue_on_error": true
}
```

Veya ortam değişkeniyle:
```batch
setx OC_AUTOCONTINUE 0   # kapalı
setx OC_AUTOCONTINUE 1   # açık
```

</details>

---

<details>
<summary><h2>🔄 Auto-Update (Otomatik Güncelleme)</h2></summary>

Arka plan güncelleme sistemi (`source/plugins/update-checker.ts`) ilk `session.idle`'da GitHub releases kontrol eder:

- Yerel `UPDATE_MANIFEST.json` (278 dosya) ile son sürümü karşılaştırır
- Sadece değişen dosyaları blob SHA ile indirir — yeniden kurulum yok
- Arka plan sessizce yamaları uygular
- Manuel tetikleme: `/update` komutu

Yapılandırma gerekmez — kutusundan çıktığı gibi çalışır.

</details>

---

<details>
<summary><h2>🌐 Proxy Bridge</h2></summary>

`/proxy-bridge` komutu birden fazla kaynaktan en hızlı ücretsiz proxy'leri bulur:

- **Databay** — ~3.100 proxy (%63.9 canlı, 1067ms medyan)
- **ProxyScrape** — 22.000+ havuz (dakikada yenilenir)
- 5s timeout ile TCP handshake doğrulaması
- Hız için 10 eşzamanlı bağlantı

```batch
/proxy-bridge                    # Varsayılan: 50 proxy test et, top 10 göster
/proxy-bridge --protocol socks5  # Protokole göre filtrele
/proxy-bridge --top 20           # Top 20 göster
/proxy-bridge --json             # JSON çıktısı
/proxy-bridge --write proxies.txt  # Dosyaya kaydet
```

</details>

---

<details open>
<summary><h2>🧩 MCP Server'lar</h2></summary>

| Server | Açıklama | Durum |
|--------|----------|-------|
| **fetch** | URL'den içerik çekme | ✅ Aktif |
| **memory** | Kalıcı bellek (knowledge graph) | ✅ Aktif |
| **sequential-thinking** | Adım adım düşünme | ✅ Aktif |
| **time** | Tarih/saat sorgulama | ✅ Aktif |
| **github** | GitHub API entegrasyonu | 🔑 Key verildiyse aktif |
| **brave-search** | Web arama | 🔑 Key verildiyse aktif |
| *filesystem* | Dosya sistemi erişimi | ⛔ Varsayılan kapalı |

</details>

---

<details open>
<summary><h2>🔥 Skills Paketi</h2></summary>

<details>
<summary><strong>Geliştirme & Mimarlık (18 skill)</strong></summary>

| Skill | Açıklama |
|-------|----------|
| `senior-fullstack` | React/Next/Node/GraphQL/PostgreSQL fullstack |
| `senior-architect` | Yazılım mimarisi ve sistem tasarımı |
| `senior-devops` | CI/CD, altyapı, konteyner |
| `senior-qa` | Test stratejileri ve otomasyon |
| `senior-data-scientist` | İstatistiksel modelleme |
| `senior-ml-engineer` | Üretim ML sistemleri ve MLOps |
| `senior-prompt-engineer` | LLM optimizasyonu |
| `senior-security` | Güvenlik mühendisliği |
| `python` | Python en iyi uygulamaları |
| `typescript` | TypeScript strict mode |
| `go` | Go modülleri, eşzamanlılık |
| `rust` | Rust mülkiyet, hata işleme |
| `java-spring` | Spring Boot kuralları |
| `node-express` | Node.js + Express |
| `react-next` | React/Next.js frontend |
| `flutter` | Flutter/Dart + Riverpod |
| `dotnet` | .NET Clean Architecture |
| `ruby-rails` | Ruby on Rails |

</details>

<details>
<summary><strong>Araştırma & Planlama (6 skill)</strong></summary>

| Skill | Açıklama |
|-------|----------|
| `deep-research` | Gemini destekli otonom araştırma raporları |
| `wiki-researcher` | 5 iterasyonlu kanıta dayalı kod analizi |
| `brainstorming` | Uygulama öncesi doğrulanmış tasarım |
| `idea-os` | 5 aşamalı fikir → PRD → plan pipeline'ı |
| `writing-plans` | TDD-driven bite-sized uygulama planları |
| `plan-writing` | Doğrulama kriterli yapılandırılmış görev planlama |

</details>

<details>
<summary><strong>Güvenlik & DevOps (15 skill)</strong></summary>

| Skill | Açıklama |
|-------|----------|
| `security-audit` | Kapsamlı güvenlik denetimi |
| `redteam` | Zayıflık için düşmanca analiz |
| `devsecops-free-auth` | Ücretsiz auth servisleri |
| `devsecops-free-cicd` | Ücretsiz CI/CD pipeline'ları |
| `devsecops-free-cloud` | Ücretsiz IaaS/PaaS |
| `devsecops-free-dns` | Ücretsiz DNS, CDN, SSL |
| `devsecops-free-monitoring` | Ücretsiz monitoring & logging |
| `devsecops-free-security` | Ücretsiz vulnerability scanner'lar |
| `devsecops-free-storage` | Ücretsiz object storage & veritabanları |
| `devsecops-free-discovery` | Ücretsiz altyapı keşfi |
| `sql-migrations` | Güvenli SQL şema değişiklikleri |
| `pr-review` | Pull request incelemesi |
| `pr-feedback` | Yorum yanıtlama |
| `git-safety-check` | Güvenli git işlemleri |

</details>

<details>
<summary><strong>İş Akışı & Verimlilik (12 skill)</strong></summary>

| Skill | Açıklama |
|-------|----------|
| `ponytail` | Token israfı önleme (YAGNI/stdlib/MVP) |
| `multi-language` | Python/Kotlin/Java/Node idiomik kod |
| `pythonic-quality` | Pythonic idiom'lar & SOLID |
| `brutal-critic` | Skorlamalı içerik inceleme |
| `cynefin` | Problem sınıflandırma çerçeve |
| `swot` | Stratejik analiz |
| `rice` | Özellik önceliklendirme |
| `moscow` | Must/Should/Could/Won't |
| `5whys` | Kök neden analizi |
| `ooda` | Observe/Orient/Decide/Act |
| `premortem` | Önceden başarısızlık analizi |
| `refactoring` | Sistemli refactoring planları |

</details>

<details>
<summary><strong>Belge İşleme (6 skill)</strong></summary>

| Skill | Açıklama |
|-------|----------|
| `xlsx` | Excel oluşturma ve analiz |
| `pdf` | PDF manipülasyon toolkit |
| `docx` | Word belge oluşturma ve düzenleme |
| `pptx` | PowerPoint üretimi |
| `obsidian-markdown` | Obsidian markdown biçimlendirme |
| `obsidian-bases` | Obsidian veritabanı görünümleri |

</details>

<details>
<summary><strong>Özel Skill'ler & Araçlar (10+ skill)</strong></summary>

| Skill | Açıklama |
|-------|----------|
| `opencode-plugin-authoring` | OpenCode plugin'leri oluştur |
| `opencode-agent-authoring` | OpenCode agent'ları oluştur |
| `opencode-command-authoring` | Slash komutları oluştur |
| `opencode-configs` | OpenCode yapılandırmasını güncelle |
| `skill-creator` | Etkili skill'ler oluştur |
| `emergency-confusion-reset` | Karışıklık döngülerinden kurtul |
| `break-edit-loop` | Tekrarlayan düzenleme döngülerini kır |
| `lint-gate` | Tamamlamadan önce sıfır hata |
| `verification-before-completion` | Tamamlamadan önce doğrula |
| `github-integration` | GitHub işlemleri |
| `mcp-server-integration` | MCP sunucuları ekle |
| `lsp-server-integration` | LSP sunucuları ekle |

</details>

**+30 diğer skill** hukuk, içerik, SEO, veri bilimi ve alan-specific kategorilerde.

</details>

---

<details>
<summary><h2>⚙️ Provider'lar (Önemli!)</h2></summary>

**Kurulumla birlikte hazır provider gelmez.** Config `provider: {}` olarak boş kurulur.

İki bağlantı yolu:

### 1) Sihirbazdan özel OpenAI-uyumlu provider (Adım 6 → `[1]`)

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

```batch
opencode auth login
```

</details>

---

<details>
<summary><h2>📜 Rules.md (AETHER-9 Kernel)</h2></summary>

`rules.md`, OpenCode'u bir **AETHER-9 sanal makine çekirdeğine** dönüştürür:

- 🎭 **Kişilik:** `ratman4080` operatör kimliği.
- 🌐 **Dil + hitap:** Kurulumda belirlenir (`{{LANGUAGE}}`, `{{HITAP}}`).
- 🧠 Mekanik, soğuk terminal dili; çekirdek-log çerçevesinde.
- 🔒 **Kapsam:** Sadece prompt katmanı yapılandırması.

</details>

---

<details>
<summary><h2>🌍 OS Uyumluluğu</h2></summary>

| OS | Min Sürüm | Desteklenen Yollar |
|---|---|---|
| **macOS** | 12+ | Native, Homebrew |
| **Ubuntu/Debian** | 20.04+ | Native, Snap, Nix |
| **Windows** | 10+ | PowerShell, WSL, Git Bash |
| **RHEL/Fedora** | 34+ | Native |

Tüm özellikler (auto-continue, auto-update, proxy-bridge) çapraz platformda çalışır.

</details>

---

<details>
<summary><h2>⌨️ Global Komutlar</h2></summary>

**Built-in:** `/help` `/quit` `/clear` `/compact` `/model` `/cost` `/config` `/tui` `/vim` `/theme` `/undo` `/diff` `/status`

**Özel:**

| Komut | Açıklama |
|-------|----------|
| `/proxy-bridge` | En hızlı ücretsiz proxy'leri bul |
| `/update` | Manuel güncelleme kontrolü |
| `/describe` | Proje açıklaması üret |
| `/search` | Semantic kod arama |
| `/create-doc` | Kod tabanından dokümantasyon |
| `/create-diagram` | ASCII diagram üretimi |
| `/find-skills` | Skill registry'sinde ara |
| `/skill-creator` | Yeni skill oluştur |
| `/write-docs` | Dosya bazlı dokümantasyon |
| `/collect-rules` | Kuralları topla |
| `/report-issue` | Issue raporu oluştur |
| `/update-config` | Yapılandırmayı güncelle |
| `/security-audit` | Güvenlik denetimi çalıştır |
| `/fetch-gh` | GitHub'dan veri çek |
| `/find-labels` | Label bul |
| `/exec-gh` | GitHub CLI çalıştır |
| `/verify-setup` | Kurulumu doğrula |
| `/start-mcp` | MCP sunucusu başlat |
| `/check-completeness` | Completeness kontrol |
| `/create-pr` | Pull request oluştur |
| `/edit-github-issue` | Issue düzenle |
| `/wiki` | Wiki dokümantasyonu |

</details>

---

## 🙏 Teşekkürler

[awesome-opencode](https://github.com/awesome-opencode/awesome-opencode) ekosistemi üzerine inşa edilmiştir. Topluluk skill'leri: [open-hax/opencode-skills](https://github.com/open-hax/opencode-skills), [devarfeen/agent-skills-kit](https://github.com/devarfeen/agent-skills-kit) ve [EdEngineering/opencode-awesome-skills](https://github.com/EdEngineering/opencode-awesome-skills).

---

## 📄 Lisans

MIT — kullan, değiştir, dağıt, forkla. Özgürce kullan.

---

<div align="center">
  <sub>🔮 tealaxdevelopers</sub>
</div>

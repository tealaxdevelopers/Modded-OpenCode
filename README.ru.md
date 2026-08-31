<div align="center">
  <h1>⚡ Modded OpenCode</h1>
  <p>Требуется OpenCode — Desktop, Terminal и CLI читают один и тот же конфиг.</p>
  <p><strong>100+ навыков, auto-continue, proxy-bridge, auto-update, свои правила — всё готово при запуске</strong></p>
  <p>
    <a href="README.md">🇬🇧 English</a> ·
    <a href="README.tr.md">🇹🇷 Türkçe</a>
  </p>
  <p>
    <a href="https://github.com/tealaxdevelopers/modded-opencode/releases"><img src="https://img.shields.io/github/v/release/tealaxdevelopers/modded-opencode?style=flat-square" alt="Релиз"/></a>
    <a href="https://github.com/tealaxdevelopers/modded-opencode"><img src="https://img.shields.io/github/last-commit/tealaxdevelopers/modded-opencode?label=%D0%9F%D0%BE%D1%81%D0%BB%D0%B5%D0%B4%D0%BD%D0%B5%D0%B5%20%D0%BE%D0%B1%D0%BD%D0%BE%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5&style=flat-square" alt="Последнее обновление"/></a>
    <a href="https://github.com/tealaxdevelopers/modded-opencode/stargazers"><img src="https://img.shields.io/github/stars/tealaxdevelopers/modded-opencode?style=flat-square" alt="Звёзды"/></a>
    <a href="https://opencode.ai"><img src="https://img.shields.io/badge/OpenCode-v2.3%2B-blue?style=flat-square" alt="OpenCode"/></a>
  </p>
</div>

---

<details open>
<summary><h2>📦 Что Внутри</h2></summary>

```
modded-opencode/
├── setup.bat                          # Мастер установки одним кликом (Windows, EN/TR/RU)
├── setup.sh                           # Мастер установки одним кликом (macOS / Linux)
├── start.cmd                          # Запуск с обработкой переменных GitHub MCP
├── scripts/
│   ├── build-config.mjs               # Кроссплатформенный генератор opencode.jsonc (Node)
│   ├── proxy-bridge.mjs               # Поиск самых быстрых бесплатных прокси (Databay + ProxyScrape)
│   └── generate-manifest.mjs          # Генератор манифеста обновлений
└── source/
    ├── opencode.jsonc                 # Конфигурация провайдера и MCP (чистая)
    ├── rules.md                       # Правила ядра AETHER-9 (своё обращение + язык)
    ├── VERSION                        # Текущая версия набора
    ├── UPDATE_MANIFEST.json           # 278-файловый хеш-манифест для автообновления
    ├── .gitignore
    ├── agents/                        # 13 собственных агентов (ivan, scout, planner, review...)
    ├── commands/                      # 18 slash-команд (вкл. proxy-bridge, update)
    ├── instructions/                  # 22 набора инструкций
    ├── plugins/
    │   ├── opencode-continue.ts       # Авто-продолжение при простое / обрыве
    │   └── update-checker.ts          # Фоновое автообновление через GitHub releases
    └── skills/                        # 100+ пакетов SKILL.md
```

</details>

---

<details>
<summary><h2>🚀 Установка</h2></summary>

**Windows:**
```batch
setup.bat
```

**macOS / Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

Оба мастера используют один движок (`scripts/build-config.mjs`) и задают одни и те же вопросы.

| Шаг | Вопрос | Если оставить пустым |
|------|----------|---------------|
| 1️⃣ Язык | `tr` / `us` / `ru` (2 буквы) | — |
| 2️⃣ Имя пользователя | Ваше имя пользователя Windows | `ENTER` = определяется автоматически |
| 3️⃣ Обращение | Как агент должен к вам обращаться? | Используется значение по умолчанию |
| 4️⃣ GitHub API ключ(и) | Для GitHub MCP — можно несколько через запятую | `ENTER` = пропустить, MCP **отключён** |
| 5️⃣ Brave API ключ | Для веб-поиска | `ENTER` = пропустить, поиск **отключён** |
| 6️⃣ Доп. интеграции | Меню своего провайдера | `ENTER` = пропустить |

> 🔗 **Несколько ключей GitHub:** можно вставить несколько токенов через запятую — они сохраняются как `GITHUB_API_KEY_1`, `GITHUB_API_KEY_2`, …

> 🔑 **Безопасность ключей:** ни один введённый ключ не записывается в файл. Сохраняется только как переменная среды (`setx`).

Всё остальное устанавливается автоматически: 100+ навыков, 13 агентов, 18 команд, 22 набора инструкций, MCP-серверы.

</details>

---

<details>
<summary><h2>🔁 Auto-Continue (авто-продолжение)</h2></summary>

**Включено по умолчанию.** Плагин следит за сессиями: когда сессия **простаивает** или связь **обрывается**, автоматически вставляет `continue`.

- 🛡️ **Ограничено**: пауза + максимум подряд предотвращают бесконечный цикл.
- 🔄 **Самосброс**: реальное сообщение обнуляет счётчик.
- 🌐 **Кроссплатформенно**: Windows, macOS, Linux.

Настройка:
```jsonc
{
  "enabled": true,
  "message": "continue",
  "cooldown_ms": 8000,
  "max_consecutive": 8,
  "continue_on_error": true
}
```

Или переменной среды:
```batch
setx OC_AUTOCONTINUE 0   # выкл
setx OC_AUTOCONTINUE 1   # вкл
```

</details>

---

<details>
<summary><h2>🔄 Auto-Update (автообновление)</h2></summary>

Фоновая система обновлений (`source/plugins/update-checker.ts`) проверяет GitHub releases при первом `session.idle`:

- Сравнивает локальный `UPDATE_MANIFEST.json` (278 файлов) с последним релизом
- Загружает только изменённые файлы через blob SHA — без переустановки
- Тихо применяет патчи в фоне
- Ручной запуск: команда `/update`

Настройка не требуется — работает из коробки.

</details>

---

<details>
<summary><h2>🌐 Proxy Bridge</h2></summary>

Команда `/proxy-bridge` находит самые быстрые бесплатные прокси из нескольких источников:

- **Databay** — ~3,100 прокси (63.9% живых, 1067ms медиана)
- **ProxyScrape** — 22,000+ пул (обновляется каждую минуту)
- TCP handshake проверка с 5s таймаутом
- 10 параллельных соединений

```batch
/proxy-bridge                    # По умолчанию: тест 50 прокси, топ 10
/proxy-bridge --protocol socks5  # Фильтр по протоколу
/proxy-bridge --top 20           # Топ 20
/proxy-bridge --json             # JSON вывод
/proxy-bridge --write proxies.txt  # Сохранить в файл
```

</details>

---

<details open>
<summary><h2>🧩 MCP-Серверы</h2></summary>

| Сервер | Описание | Статус |
|--------|----------|--------|
| **fetch** | Получение содержимого по URL | ✅ Активен |
| **memory** | Постоянная память (граф знаний) | ✅ Активен |
| **sequential-thinking** | Пошаговые рассуждения | ✅ Активен |
| **time** | Запросы даты/времени | ✅ Активен |
| **github** | Интеграция с GitHub API | 🔑 Активен при наличии ключа |
| **brave-search** | Веб-поиск | 🔑 Активен при наличии ключа |
| *filesystem* | Доступ к файловой системе | ⛔ По умолчанию выключен |

</details>

---

<details open>
<summary><h2>🔥 Набор Навыков</h2></summary>

<details>
<summary><strong>Разработка и Архитектура (18 навыков)</strong></summary>

| Навык | Описание |
|-------|----------|
| `senior-fullstack` | React/Next/Node/GraphQL/PostgreSQL fullstack |
| `senior-architect` | Архитектура ПО и проектирование систем |
| `senior-devops` | CI/CD, инфраструктура, контейнеризация |
| `senior-qa` | Стратегии тестирования и автоматизация |
| `senior-data-scientist` | Статистическое моделирование |
| `senior-ml-engineer` | ML системы продакшена и MLOps |
| `senior-prompt-engineer` | Оптимизация LLM |
| `senior-security` | Инженерия безопасности |
| `python` | Лучшие практики Python |
| `typescript` | TypeScript strict mode |
| `go` | Go модули, параллелизм |
| `rust` | Rust владение, обработка ошибок |
| `java-spring` | Spring Boot соглашения |
| `node-express` | Node.js + Express |
| `react-next` | React/Next.js фронтенд |
| `flutter` | Flutter/Dart + Riverpod |
| `dotnet` | .NET Clean Architecture |
| `ruby-rails` | Ruby on Rails |

</details>

<details>
<summary><strong>Исследования и Планирование (6 навыков)</strong></summary>

| Навык | Описание |
|-------|----------|
| `deep-research` | Gemini-автоматизированные отчёты исследований |
| `wiki-researcher` | 5-итерационный анализ кодовой базы |
| `brainstorming` | Проверенный дизайн перед реализацией |
| `idea-os` | 5-фазный pipeline идея → PRD → план |
| `writing-plans` | TDD-реализация пошаговых планов |
| `plan-writing` | Структурированное планирование задач |

</details>

<details>
<summary><strong>Безопасность и DevOps (15 навыков)</strong></summary>

| Навык | Описание |
|-------|----------|
| `security-audit` | Комплексный аудит безопасности |
| `redteam` | Агрессивный анализ слабостей |
| `devsecops-free-auth` | Бесплатные сервисы аутентификации |
| `devsecops-free-cicd` | Бесплатные CI/CD пайплайны |
| `devsecops-free-cloud` | Бесплатный IaaS/PaaS |
| `devsecops-free-dns` | Бесплатный DNS, CDN, SSL |
| `devsecops-free-monitoring` | Бесплатный мониторинг |
| `devsecops-free-security` | Бесплатные сканеры уязвимостей |
| `devsecops-free-storage` | Бесплатное хранилище и БД |
| `devsecops-free-discovery` | Обнаружение бесплатной инфраструктуры |
| `sql-migrations` | Безопасные изменения SQL-схемы |
| `pr-review` | Обзор pull request |
| `pr-feedback` | Обработка отзывов |
| `git-safety-check` | Безопасные git-операции |

</details>

<details>
<summary><strong>Рабочие процессы и Продуктивность (12 навыков)</strong></summary>

| Навык | Описание |
|-------|----------|
| `ponytail` | Предотвращение траты токенов (YAGNI/stdlib/MVP) |
| `multi-language` | Идиоматичный код Python/Kotlin/Java/Node |
| `pythonic-quality` | Python-идиомы и SOLID |
| `brutal-critic` | Ревью контента с оценкой |
| `cynefin` | Фреймворк классификации проблем |
| `swot` | Стратегический анализ |
| `rice` | Приоритизация функций |
| `moscow` | Must/Should/Could/Won't |
| `5whys` | Анализ корневой причины |
| `ooda` | Observe/Orient/Decide/Act |
| `premortem` | Анализ до сбоя |
| `refactoring` | Системные планы рефакторинга |

</details>

<details>
<summary><strong>Обработка документов (6 навыков)</strong></summary>

| Навык | Описание |
|-------|----------|
| `xlsx` | Создание и анализ Excel |
| `pdf` | Инструменты для PDF |
| `docx` | Создание и редактирование Word |
| `pptx` | Генерация PowerPoint |
| `obsidian-markdown` | Форматирование Obsidian |
| `obsidian-bases` | ТableViews Obsidian |

</details>

<details>
<summary><strong>Пользовательские навыки и Инструменты (10+ навыков)</strong></summary>

| Навык | Описание |
|-------|----------|
| `opencode-plugin-authoring` | Создание плагинов OpenCode |
| `opencode-agent-authoring` | Создание агентов OpenCode |
| `opencode-command-authoring` | Создание slash-команд |
| `opencode-configs` | Обновление конфигурации |
| `skill-creator` | Создание эффективных навыков |
| `emergency-confusion-reset` | Восстановление из путаницы |
| `break-edit-loop` | Разрыв повторяющихся циклов |
| `lint-gate` | Ноль ошибок перед завершением |
| `verification-before-completion` | Проверка перед завершением |
| `github-integration` | Операции GitHub |
| `mcp-server-integration` | Добавление MCP серверов |
| `lsp-server-integration` | Добавление LSP серверов |

</details>

**+30 других навыков** в юридических, контентных, SEO и отраслевых категориях.

</details>

---

<details>
<summary><h2>⚙️ Провайдеры (Важно!)</h2></summary>

**Готовый провайдер с установкой НЕ поставляется.** Конфиг устанавливается пустым: `provider: {}`.

Два способа подключить модель:

### 1) Свой OpenAI-совместимый провайдер из мастера (Шаг 6 → `[1]`)

```jsonc
"provider": {
  "<имя-модели>": {
    "name": "<имя-модели>",
    "npm": "@ai-sdk/openai-compatible",
    "options": {
      "baseURL": "https://ваш-сервер.com/v1",
      "apiKey": "{env:CUSTOM_LLM_API_KEY}"
    },
    "models": { "<имя-модели>": {} }
  }
}
```

### 2) Встроенные провайдеры (OpenAI, Anthropic, Google...)

```batch
opencode auth login
```

</details>

---

<details>
<summary><h2>📜 Rules.md (Ядро AETHER-9)</h2></summary>

`rules.md` превращает OpenCode в **виртуальную машину-ядро AETHER-9**:

- 🎭 **Определение персоны:** личность `ratman4080`.
- 🌐 **Язык + обращение:** задаются при установке (`{{LANGUAGE}}`, `{{HITAP}}`).
- 🧠 Механический, холодный терминальный язык.
- 🔒 **Охват:** только конфигурация слоя prompt.

</details>

---

<details>
<summary><h2>🌍 Совместимость с ОС</h2></summary>

| ОС | Мин. версия | Поддерживаемые способы |
|---|---|---|
| **macOS** | 12+ | Native, Homebrew |
| **Ubuntu/Debian** | 20.04+ | Native, Snap, Nix |
| **Windows** | 10+ | PowerShell, WSL, Git Bash |
| **RHEL/Fedora** | 34+ | Native |

Все функции (auto-continue, auto-update, proxy-bridge) работают кроссплатформенно.

</details>

---

<details>
<summary><h2>⌨️ Глобальные команды</h2></summary>

**Built-in:** `/help` `/quit` `/clear` `/compact` `/model` `/cost` `/config` `/tui` `/vim` `/theme` `/undo` `/diff` `/status`

**Пользовательские:**

| Команда | Описание |
|---------|----------|
| `/proxy-bridge` | Найти быстрые бесплатные прокси |
| `/update` | Ручная проверка обновлений |
| `/describe` | Генерация описания проекта |
| `/search` | Семантический поиск кода |
| `/create-doc` | Документация из кодовой базы |
| `/create-diagram` | Генерация ASCII-диаграмм |
| `/find-skills` | Поиск в реестре навыков |
| `/skill-creator` | Создание новых навыков |
| `/write-docs` | Файловая документация |
| `/collect-rules` | Сбор правил |
| `/report-issue` | Генерация отчёта об issue |
| `/update-config` | Обновление конфигурации |
| `/security-audit` | Запуск аудита безопасности |
| `/fetch-gh` | Получение данных GitHub |
| `/find-labels` | Поиск меток |
| `/exec-gh` | Запуск GitHub CLI |
| `/verify-setup` | Проверка установки |
| `/start-mcp` | Запуск MCP сервера |
| `/check-completeness` | Проверка завершённости |
| `/create-pr` | Создание pull request |
| `/edit-github-issue` | Редактирование issue |
| `/wiki` | Wiki документация |

</details>

---

## 🙏 Благодарности

Построено поверх экосистемы [awesome-opencode](https://github.com/awesome-opencode/awesome-opencode). Навыки сообщества из [open-hax/opencode-skills](https://github.com/open-hax/opencode-skills), [devarfeen/agent-skills-kit](https://github.com/devarfeen/agent-skills-kit) и [EdEngineering/opencode-awesome-skills](https://github.com/EdEngineering/opencode-awesome-skills).

---

## 📄 Лицензия

MIT — используйте, меняйте, распространяйте, форкните. Свободно.

---

<div align="center">
  <sub>🔮 by tealaxdevelopers</sub>
</div>

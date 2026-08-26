<div align="center">
  <h1>⚡ Modded OpenCode</h1>
  <p>Требуется OpenCode — Desktop, Terminal и CLI читают один и тот же конфиг.</p>
  <p><strong>68 навыков, автоустановка, свои правила — всё готово при запуске</strong></p>
  <p>
    <a href="README.md">🇬🇧 English</a> ·
    <a href="README.tr.md">🇹🇷 Türkçe</a>
  </p>
  <p>
    <a href="https://github.com/tealaxdevelopers/modded-opencode"><img src="https://img.shields.io/github/last-commit/tealaxdevelopers/modded-opencode?label=%D0%9F%D0%BE%D1%81%D0%BB%D0%B5%D0%B4%D0%BD%D0%B5%D0%B5%20%D0%BE%D0%B1%D0%BD%D0%BE%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5&style=flat-square" alt="Последнее обновление"/></a>
    <a href="https://github.com/tealaxdevelopers/modded-opencode/stargazers"><img src="https://img.shields.io/github/stars/tealaxdevelopers/modded-opencode?style=flat-square" alt="Звёзды"/></a>
    <a href="https://opencode.ai"><img src="https://img.shields.io/badge/OpenCode-v2.3%2B-blue?style=flat-square" alt="OpenCode"/></a>
  </p>
</div>

---

## 📦 Что Внутри

```
modded-opencode/
├── setup.bat                          # Мастер установки одним кликом (Windows, EN/TR/RU)
├── setup.sh                           # Мастер установки одним кликом (macOS / Linux)
├── start.cmd                          # Запуск с обработкой переменных GitHub MCP
├── scripts/build-config.mjs           # Кроссплатформенный генератор opencode.jsonc (Node)
└── source/
    ├── opencode.jsonc                 # Конфигурация провайдера и MCP (чистая)
    ├── rules.md                       # Правила ядра AETHER-9 (своё обращение + язык)
    ├── .gitignore
    ├── agents/                        # 13 собственных агентов (ivan, scout, planner, review...)
    ├── commands/                      # 17 slash-команд
    ├── instructions/                  # 22 набора инструкций
    ├── plugins/                       # плагины agents-opencode + auto-continue
    │   └── opencode-continue.ts       # Авто-продолжение при простое / обрыве
    └── skills/                        # 68 пакетов SKILL.md
```

### 🔥 Лучшие Навыки

| Навык | Для чего |
|-------|-------------|
| **ponytail** | Лестница решений против траты токенов (YAGNI/stdlib/oneliner/MVP) |
| **multi-language** | Идиоматичный код на Python/Kotlin/Java/Node.js |
| **java-spring** | Spring Boot + внедрение через конструктор + валидация |
| **pythonic-quality** | Python-идиомы, SOLID, подтипы, совместимые с Liskov |
| **senior-fullstack** | React/Next/Node/GraphQL/PostgreSQL fullstack |
| **legal-advisor** | Юридические исследования, анализ законодательства, аудит лицензий |
| **cto-advisor** | Анализ технического долга, масштабирование команды, оценка технологий |
| **xlsx / pdf / docx** | Работа с документами Excel, PDF, Word |
| *(+60 ещё)* | |

---

## 🚀 Установка

```batch
setup.bat
```

На **macOS / Linux** используйте аналогичный мастер в оболочке:

```bash
chmod +x setup.sh
./setup.sh
```

Оба мастера используют один движок (`scripts/build-config.mjs`) и задают одни и те же вопросы.

Мастер задаёт вопросы по порядку:

| Шаг | Вопрос | Если оставить пустым |
|------|----------|---------------|
| 1️⃣ Язык | `tr` / `us` / `ru` (2 буквы) | — |
| 2️⃣ Имя пользователя | Ваше имя пользователя Windows | `ENTER` = определяется автоматически |
| 3️⃣ Обращение | Как агент должен к вам обращаться? | Используется значение по умолчанию |
| 4️⃣ GitHub API ключ(и) | Для GitHub MCP — можно несколько через запятую | `ENTER` = пропустить, MCP устанавливается **отключённым** |
| 5️⃣ Brave API ключ | Для веб-поиска | `ENTER` = пропустить, поиск устанавливается **отключённым** |
| 6️⃣ Доп. интеграции | Меню своего провайдера | `ENTER` = пропустить |

> 🔗 **Несколько ключей GitHub:** можно вставить несколько токенов через запятую — они сохраняются как `GITHUB_API_KEY_1`, `GITHUB_API_KEY_2`, … (без ограничений). Один токен остаётся как `GITHUB_API_KEY`. Когда включён мульти-режим, конфиг ссылается на первый ключ (`_1`).

> 🔑 **Безопасность ключей:** ни один введённый ключ не записывается в файл. Сохраняется только как переменная среды пользователя (`setx`). Удалить позже: `setx GITHUB_API_KEY ""` (или `GITHUB_API_KEY_1`) / `setx BRAVE_API_KEY ""`

Выбранный **язык также задаёт язык общения агента** в `rules.md` — выберите `ru`, и ядро instructирует агента говорить по-русски.

Всё остальное устанавливается автоматически: 68 навыков, 13 агентов, 17 команд, 22 набора инструкций, MCP-серверы.

---

## 🧩 MCP-Серверы

| Сервер | Описание | Статус |
|--------|-------------|--------|
| **fetch** | Получение содержимого по URL | ✅ Активен |
| **memory** | Постоянная память (граф знаний) | ✅ Активен |
| **sequential-thinking** | Пошаговые рассуждения | ✅ Активен |
| **time** | Запросы даты/времени | ✅ Активен |
| **github** | Интеграция с GitHub API | 🔑 Активен при наличии ключа |
| **brave-search** | Веб-поиск | 🔑 Активен при наличии ключа |
| *filesystem* | Доступ к файловой системе | ⛔ По умолчанию выключен |

Добавить ключ после установки:

```batch
setx GITHUB_API_KEY "ghp_..."
setx BRAVE_API_KEY "BSA..."
```

затем переключите соответствующее `"enabled": false` на `true` внутри `opencode.jsonc`.

---

## 🔁 Auto-Continue (авто-продолжение)

**Включено по умолчанию.** Встроенный плагин (`source/plugins/opencode-continue.ts`) следит за сессиями: когда сессия **простаивает** (модель закончила, но вы не написали) **или связь обрывается посреди задачи** (`session.error`), он автоматически вставляет сообщение `continue`, и агент продолжает сам — без вашего или ИИ участия.

- 🛡️ **Ограничено**: пауза (`cooldown_ms`) и максимум подряд (`max_consecutive`) предотвращают бесконечный цикл.
- 🔄 **Самосброс**: как только вы отправите реальное сообщение, счётчик обнуляется.
- 🌐 **Кроссплатформенно**: один плагин загружается в Windows, macOS и Linux.

Настройте или отключите через `<проект>/.opencode/auto-continue.json`:

```jsonc
{
  "enabled": true,
  "message": "continue",
  "cooldown_ms": 8000,
  "max_consecutive": 8,
  "continue_on_error": true
}
```

Или переключайте глобально переменной среды — файл не нужен:

```batch
setx OC_AUTOCONTINUE 0   # выкл
setx OC_AUTOCONTINUE 1   # вкл
```

> Ручная альтернатива: просто напишите `continue` в чате. Плагин только автоматизирует этот шаг. Настоящая кнопка «Continue» внутри чата и переключатель в настройках потребовали бы форка UI OpenCode — вне scope плагин-подхода.

---

## ⚙️ Провайдеры (Важно!)

**Готовый провайдер с установкой НЕ поставляется.** Конфиг устанавливается пустым: `provider: {}`.

Два способа подключить модель:

### 1) Свой OpenAI-совместимый провайдер из мастера (Шаг 6 → `[1]`)

Спрашивает Base URL + имя модели + API ключ, затем записывает:

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

Одна команда после установки:

```batch
opencode auth login
```

### Ручной пример (DashScope/Qwen)

Для тех, кто хочет добавить **вручную** — это пример, а не значение по умолчанию:

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

> ⚠️ Плагин `@melodyoftears/opencode-qwen-auth`, поставлявшийся в старых версиях, **удалён** — он больше не входит в установку.

---

## 📜 Rules.md (Ядро AETHER-9)

Сердце этого набора. `rules.md` превращает OpenCode в **виртуальную машину-ядро AETHER-9** — слой персоны, ограниченный сессией, загружаемый через систему инструкций OpenCode:

- 🎭 **Определение персоны:** устанавливает операторскую личность `ratman4080` — голос, формат ответа и стиль работы для сессии.
- 🌐 **Язык + обращение:** оба задаются при установке (`{{LANGUAGE}}`, `{{HITAP}}`) — ядро говорит на вашем языке и называет вас так, как вы выбрали.
- 🧠 Механический, холодный терминальный язык; каждый ответ в стиле ядерного журнала.
- 🔒 **Охват:** это только конфигурация слоя prompt. Она не меняет веса модели, не обходит серверные API-политики, права аккаунта или юридические границы — они всегда применяются. Для личного, локального использования.

> **Примечание:** это конфигурация роли/персоны для частной, контролируемой сессии — не эксплойт безопасности. Не рекомендуется для продакшена или многопользовательских систем.

---

## 🙏 Благодарности

Построено поверх экосистемы [awesome-opencode](https://github.com/awesome-opencode/awesome-opencode) — курируемого списка плагинов, тем, агентов и ресурсов для [OpenCode](https://opencode.ai). Наш набор для установки также там: **Projects → Modded OpenCode**.

---

## 🔧 Разработка

```bash
# Добавить свой навык
mkdir source/skills/moy-navyk/
printf -- "---\nname: moy-navyk\ndescription: Delayet veshchi\n---\n# Skill content" > source/skills/moy-navyk/SKILL.md

# Затем запустите setup.bat снова
```

Проверка:

```bash
npm run validate
```

---

## 📄 Лицензия

MIT — используйте, меняйте, распространяйте, форкните. Свободно.

---

<div align="center">
  <sub>🔮 by tealaxdevelopers</sub>
</div>

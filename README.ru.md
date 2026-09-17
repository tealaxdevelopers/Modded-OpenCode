<div align="center">
  <h1>⚡ Modded OpenCode</h1>
  <p>Требуется OpenCode — Desktop, Terminal и CLI читают один и тот же конфиг.</p>
  <p><strong>105 навыков · 13 агентов · 19 команд · 6 плагинов — всё готово при запуске</strong></p>
  <p>
    <a href="README.md">🇬🇧 English</a> ·
    <a href="README.tr.md">🇹🇷 Türkçe</a>
  </p>
  <p>
    <a href="https://github.com/tealaxdevelopers/modded-opencode"><img src="https://img.shields.io/badge/%D0%9F%D0%BE%D1%81%D0%BB%D0%B5%D0%B4%D0%BD%D0%B5%D0%B5%20%D0%BE%D0%B1%D0%BD%D0%BE%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-2026-blue?style=flat-square" alt="Последнее обновление"/></a>
    <a href="https://github.com/tealaxdevelopers/modded-opencode/stargazers"><img src="https://img.shields.io/badge/%D0%97%D0%B2%D1%91%D0%B7%D0%B4%D1%8B-%E2%AD%90-yellow?style=flat-square" alt="Звёзды"/></a>
    <a href="https://opencode.ai"><img src="https://img.shields.io/badge/OpenCode-v2.3%2B-blue?style=flat-square" alt="OpenCode"/></a>
  </p>
</div>

<p align="center">
  <img src="docs/assets/hero.svg" alt="Modded OpenCode — Запустите свои AI модели внутри OpenCode" width="100%"/>
</p>

---

## ⚡ Быстрый старт

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

> Настройка включена в мастер. OpenCode устанавливается отдельно: https://opencode.ai

---

## 🔌 Плагины (7 шт., устанавливаются через npm)

| Плагин | Что делает |
|--------|-----------|
| **agents-opencode** | Инъекция контекста сжатия, блокировка чувствительных файлов, version env var |
| **auto-continue** | Авто-продолжение простаивающих/оборванных сессий (включено по умолчанию) |
| **openai-system-merge** | Исправление ошибки множественных system-сообщений для строгих OpenAI-совместимых серверов |
| **update-checker** | Проверка новых релизов на GitHub при запуске |
| **notify** | Кроссплатформенные уведомления рабочего стола при завершении задачи |
| **session-title** | Авто-генерация заголовков сессий из первого сообщения пользователя |

Настройка auto-continue (`<проект>/.opencode/auto-continue.json`):

```jsonc
{
  "enabled": true,
  "cooldown_ms": 8000,
  "max_consecutive": 8,
  "continue_on_error": false
}
```

---

## 🧩 MCP-Серверы

| Сервер | Описание | Статус |
|--------|----------|--------|
| **fetch** | Получение содержимого по URL | ✅ Активен |
| **memory** | Постоянная память (граф знаний) | ✅ Активен |
| **sequential-thinking** | Пошаговые рассуждения | ✅ Активен |
| **time** | Запросы даты/времени | ✅ Активен |
| **github** | Интеграция с GitHub API | 🔑 Активен при наличии ключа |
| **brave-search** | Веб-поиск | 🔑 Активен при наличии ключа |
| *filesystem* | Доступ к файловой системе | ⛔ По умолчанию выключен |

---

## 🔥 Навыки (105 шт.)

### Язык и фреймворки

| Навык | Для чего |
|-------|----------|
| **multi-language** | Идиоматичный код на Python/Kotlin/Java/Node.js |
| **java-spring** | Spring Boot + внедрение через конструктор + валидация |
| **pythonic-quality** | Python-идиомы, SOLID, подтипы, совместимые с Liskov |
| **senior-fullstack** | React/Next/Node/GraphQL/PostgreSQL fullstack |
| **rust** | Ownership/borrowing, Result/Option, безопасные абстракции |

### Качество и ревью

| Навык | Для чего |
|-------|----------|
| **ponytail** | Лестница решений против траты токенов (YAGNI/stdlib/oneliner/MVP) |
| **claude-code-review** | Проверка безопасности, производительности, корректности |
| **claude-debug** | Системная гипотезная отладка |
| **claude-simplify** | Рефакторинг для ясности и уменьшения сложности |
| **code-change-impact** | Анализ радиуса воздействия изменений кода |

### Контент и бизнес

| Навык | Для чего |
|-------|----------|
| **legal-advisor** | Юридические исследования, анализ законодательства, аудит лицензий |
| **cto-advisor** | Анализ технического долга, масштабирование команды, оценка технологий |
| **blogger** | Тех/финанс/лидерство блоги, подкаст идеи, YouTube сценарии |
| **deep-research** | Многоисточниковое веб-исследование с отслеживанием цитат |

### Продуктивность

| Навык | Для чего |
|-------|----------|
| **claude-commit** | Традиционный git commit с атомарным staging |
| **claude-batch** | Обработка нескольких файлов одной операцией |
| **claude-loop** | Повтор задачи с условиями выхода |
| **xlsx / pdf / docx** | Работа с документами Excel, PDF, Word |

*+95 ещё навыков в `source/skills/`*

---

## 🤖 Агенты (13 шт.)

| Агент | Роль | Режим |
|-------|------|-------|
| **@codebase** | Мультиязычная разработка с определением профиля | primary |
| **@orchestrator** | Стратегическое планирование и координация | primary |
| **@planner** | Read-only анализ и планирование | primary |
| **@review** | Код-ревью для безопасности и производительности | subagent |
| **@docs** | Создание и поддержка документации | subagent |
| **@ivan** | Старший код-реализатор | subagent |
| **@jester** | Оракул для нестандартного мышления | subagent |
| **@oscar** | Старший код-ревьюер | subagent |
| **@scout** | Исследование и планирование | subagent |
| **@blogger** | Создание контента (блог, подкаст, YouTube) | primary |
| **@brutal-critic** | Оценка качества контента по фреймворку | subagent |
| **@em-advisor** | Руководство по инженерному менеджменту | primary |
| **@legal-advisor** | Аудит лицензий, комплаенс, регуляторные вопросы | primary |

---

## ⚙️ Провайдеры

**Готовый провайдер с установкой НЕ поставляется.** Конфиг устанавливается пустым: `provider: {}`.

Два способа подключить:

### 1) Мастер (Шаг 6 → `[1]`)
Спрашивает Base URL + имя модели + API ключ.

### 2) Встроенные провайдеры (OpenAI, Anthropic, Google...)
```batch
opencode auth login
```

### Поддерживаемые локальные endpoint'ы

| Провайдер | URL по умолчанию | Порт |
|-----------|-----------------|------|
| Ollama | `http://127.0.0.1:11434/v1` | 11434 |
| LM Studio | `http://127.0.0.1:1234/v1` | 1234 |
| vLLM | `http://127.0.0.1:8000/v1` | 8000 |
| llama.cpp | `http://127.0.0.1:8080/v1` | 8080 |

---

## 🔧 Поддержка OpenAI-совместимых провайдеров

Свои провайдеры (vLLM, Ollama, llama.cpp, LM Studio, Hetzner, OVHcloud, Scaleway и др.) работают из коробки. Плагин `openai-system-merge` исправляет ошибку `400 BadRequestError: System message must be at the beginning`, объединяя несколько system-сообщений в одно.

---

## 📦 Установка

Оба мастера (`setup.bat` / `setup.sh`) задают одни и те же вопросы:

| Шаг | Вопрос | Если оставить пустым |
|-----|--------|---------------------|
| 1️⃣ Язык | `tr` / `us` / `ru` | — |
| 2️⃣ Имя пользователя | Ваше имя | определяется автоматически |
| 3️⃣ Обращение | Как агент к вам обращается? | по умолчанию |
| 4️⃣ GitHub API ключ(и) | Для GitHub MCP | пропустить, MCP выкл |
| 5️⃣ Brave API ключ | Для веб-поиска | пропустить, поиск выкл |
| 6️⃣ Доп. интеграции | Меню своего провайдера | пропустить |

Выбранный язык задаёт язык общения агента в `rules.md`.

> 🔑 **Безопасность ключей:** API-ключи хранятся в `.env.local` (права `0600`), никогда не записываются в файлы shell RC.

| ОС | Расположение `.env.local` |
|----|--------------------------|
| **Windows** | `%USERPROFILE%\.config\opencode\local-setup\.env.local` |
| **macOS** | `~/Library/Application Support/opencode/local-setup/.env.local` |
| **Linux** | `~/.config/opencode/local-setup/.env.local` |

---

## 📜 Rules.md

Слой персоны агента — загружается через систему инструкций OpenCode. Задаёт идентичность, голос и стиль работы. Язык и обращение настраиваются при установке.

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

## 🙏 Благодарности

- [opencode-ai/opencode](https://github.com/opencode-ai/opencode) — основная платформа
- [awesome-opencode/awesome-opencode](https://github.com/awesome-opencode/awesome-opencode) — плагины, темы, агенты

---

## 📄 Лицензия

MIT — используйте, меняйте, распространяйте, форкните.

---

<div align="center">
  <sub>🔮 by tealaxdevelopers</sub>
</div>

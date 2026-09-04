---
name: task-management
description: Feature subtask'larını takip etme ve yönetme CLI'i. Durum, bağımlılık ve validasyon ile görev yönetimi için kullan.
---

# Görev Yönetimi Skill

> **Amaç**: Feature implementasyonlarını atomik task breakdown'ları, bağımlılık çözümü ve ilerleme takibi ile yönet.

## Komutlar

| Komut | Açıklama |
|-------|----------|
| `status [feature]` | Tüm feature'ların durumunu göster |
| `next [feature]` | Sonraki uygun task'ları göster (bağımlılıklar çözülmüş) |
| `blocked [feature]` | Bloke olan task'ları ve nedenini göster |
| `complete <feature> <seq> "özet"` | Subtask'ı tamamlandı olarak işaretle |
| `validate [feature]` | JSON dosyalarını ve bağımlılıkları doğrula |

## Kullanım

```bash
bash ~/.config/opencode/skills/task-management/router.sh status
bash ~/.config/opencode/skills/task-management/router.sh next
bash ~/.config/opencode/skills/task-management/router.sh blocked
bash ~/.config/opencode/skills/task-management/router.sh complete my-feature 05 "Auth modülü implemente edildi"
bash ~/.config/opencode/skills/task-management/router.sh validate
```

## Task Dosya Yapısı

Task'lar `.tmp/tasks/` altında saklanır:

```
.tmp/tasks/
├── {feature-slug}/
│   ├── task.json           # Feature metadata
│   ├── subtask_01.json     # Subtask tanımları
│   └── ...
```

## Durumlar
- **pending** - Beklemede, bağımlılıklar bekleniyor
- **in_progress** - Üzerinde çalışılıyor
- **completed** - Tamamlandı
- **blocked** - Bloke

## Tetikleyiciler
- "görev", "task", "subtask", "ilerleme", "durum"

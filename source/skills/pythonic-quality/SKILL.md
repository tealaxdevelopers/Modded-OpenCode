---
name: pythonic-quality
description: "Python kodu analiz, review, refactor veya yazarken kullan. Pythonic idiom'lar, SOLID tasarım ve Liskov-safe subtype'lar uygula. Python kod kalitesi için kullan."
---

# Kaliteli Python (Pythonic + SOLID + Liskov)

Non-trivial Python önermeden veya düzenlemeden önce bu skill'i oku.

## Pythonic (idiomlar ve stil)

- **PEP 8** temel; net isimler; tek sorumluluklu modüller
- **Comprehensions ve generator'lar** kontrol akışını netleştirdiğinde kullan; derin iç içelikten kaçın
- **`pathlib`**, **`with`** kaynaklar için, **`dataclasses`** / **`Enum`** basit veri modelleme için
- **Typing** (`typing` / `collections.abc`): public boundary'lerde parametre ve dönüş tipleri; `Protocol` explicit duck typing için
- **EAFP** (try/except) vs **LBYL** sadece daha net veya ucuz olduğunda

## Sınıf Tasarımı

| Durum | Tercih Edileni | Kaçınılacak |
|-------|---------------|-------------|
| Düz veri + equality/hash | `@dataclass(frozen=True)` veya `NamedTuple` | Mutable shared defaults |
| Kapalı varyant seti | `Enum` veya `StrEnum` | String constant'lar |
| Yetenek tanımı | `Protocol` (structural) | Derin inheritance ağaçları |
| Override zorunluluğu | `ABC` + `@abstractmethod` | Sadece dökümantasyon için ABC |
| İnşaat | `@classmethod` factory | `__new__` gerekmedikçe |

## SOLID

- **S** — Tek sorumluluk: Her modül/sınıf tek nedenle değişmeli
- **O** — Açık/kapalı: Yeni davranış = yeni kayıt/plugin, mevcut if/elif zincirini değiştirme
- **L** — Liskov: Alt tipler üst tipin sözleşmesini bozmamalı
- **I** — Arayüz ayrımı: Küçük Protocol'ler, büyük tek tip yerine
- **D** — Bağımlılık ters çevirme: High-level policy, concrete sınıfa değil `Notifier` Protocol'üne bağımlı olmalı

## Tetikleyiciler
- "python", "pythonic", "python review", "python kalite"

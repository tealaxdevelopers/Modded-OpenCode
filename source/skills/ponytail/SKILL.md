---
name: ponytail
description: Kod üretiminde token israfını önleyen karar merdiveni. Python, Kotlin, Java, Node.js dahil tüm dillerde kod yazarken kullan. YAGNI/stdlib/oneliner/MVP prensipleriyle minimal kod üret.
---

# Ponytail — Kod Üretim Karar Merdiveni (Tüm Diller İçin)

Kod yazarken token israfını önlemek için 5 adımlı karar merdiveni uygula.

## Karar Merdiveni (sırayla uygula)

### Adım 1: YAGNI
Bu kod gerçekten şu an lazım mı?
- Hayır: Atla. Kod üretme.
- Evet: Adım 2'ye geç.

### Adım 2: Önce stdlib
Stdlib bunu external dep olmadan yapabilir mi?
- Evet: Stdlib kullan. Builtin'ler yeterli.
- Hayır: Adım 3'e geç.

### Adım 3: Native platform
Platform (OS/Python std/Java std/Kotlin std/Node builtins) yapabilir mi?
- Evet: Native API'leri kullan.
- Hayır: Adım 4'e geç.

### Adım 4: One-liner
Tek satır veya tek expression olarak yazılabilir mi?
- Evet: Kullan. Multi-line fonksiyon açma.
- Hayır: Adım 5'e geç.

### Adım 5: Minimal MVP
Minimum çalışan implementasyonu üret:
- İmkansız case'ler için hata yönetimi yok
- Bariz fonksiyonlar için docstring yok
- Internal helper'lar için type annotation yok
- Her fonksiyon tek amaçlı
- Config objesi yerine default parametre
- Erken return, sık return

## Dil Desteği
Bu skill Python, Kotlin, Java, Node.js/TypeScript ve tüm diğer diller için geçerlidir.

## Hata Koruması
- **Kod reddedilirse** (test/review hatası): Daha da minimal yapma, proper MVP'ye genişlet
- **Public API / kütüphane kodu**: Adım 4'ü atla (one-liner). Public API'ler hata yönetimi ve dokümantasyon ister.
- **Güvenlik kritik kod**: Adım 4-5'i atla. Güvenlik explicit check ister.

## Tetikleyiciler
- "ponytail", "kod yaz", "implement et", "token tasarrufu", "minimal kod"

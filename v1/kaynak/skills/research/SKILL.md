---
name: arastirma
description: Web sitelerinde gezinme, uzun süreli araştırma yapma, API dökümantasyonu bulma, kod araştırması ve teknik inceleme. Kapsamlı web taraması ve derinlemesine bilgi toplama için kullan.
---

# Araştırma Yeteneği (Web + Uzun Süreli)

Bu skill, {{HITAP}}'in web'de gezinmesini, siteleri taramasını ve uzun süreli araştırma yapmasını sağlar.

## Kullanılabilir Araçlar

- **`websearch`** — İnternette arama yap (Google benzeri)
- **`webfetch`** — Belirli bir URL'nin içeriğini getir
- **`websearch` + `livecrawl`** — Canlı sayfa taraması (güncel içerik)

## Araştırma Stratejileri

### 1. Hızlı Web Araması
```python
websearch(query="arama sorgusu")
```

### 2. Derinlemesine Sayfa İnceleme
```python
# Önce ara, sonra detaylı oku
websearch(query="konu hakkında")
webfetch(url="en alakalı sonuç")
```

### 3. Çok Aşamalı Araştırma (Uzun Süreli)
Uzun araştırmalar için adım adım ilerle:

**Adım 1:** Genel arama yap → konuyu anla
**Adım 2:** Spesifik sayfaları oku → detayları öğren
**Adım 3:** Bulguları özetle → ne öğrendiğini not et
**Adım 4:** Eksik kalan noktalar varsa tekrar ara
**Adım 5:** Nihai sonucu derle

### 4. API / Kütüphane Araştırması
- Resmi dökümantasyonu bul
- Kurulum adımlarını oku
- Temel API'leri öğren
- Örnek kodları incele

### 5. Çoklu Dil Araştırması
Python, Kotlin, Java, Node.js/TypeScript için:
- Kütüphane karşılaştırması
- Best practice araştırması
- Migrasyon desenleri

## Uzun Süreli Araştırma İpuçları

1. **Tek seferde çok derine gitme** — Önce genel bakış al, sonra detaylandır
2. **Bulguları özetle** — Her aşamada ne bulduğunu kaydet
3. **Bağlamı koru** — Önceki bulguları sonraki aramalarda kullan
4. **Farklı kaynakları karşılaştır** — Tek kaynağa güvenme
5. **Canlı tarama kullan** — Güncel bilgi için `livecrawl` tercih et

## Kullanım Örnekleri

```
# Örnek 1: Teknoloji araştırması
websearch(query="Python async framework karşılaştırması 2026")
webfetch(url="...")

# Örnek 2: Hata çözümü
websearch(query="Node.js memory leak hatası çözümü")
webfetch(url="...")

# Örnek 3: Kütüphane incelemesi
websearch(query="Kotlin coroutines best practices")
webfetch(url="...")
```

## Tetikleyiciler
- "araştır", "search", "bul", "incele", "dökümantasyon", "wiki", "nedir", "nasıl"
- "sitelerde gez", "web'de ara", "internette bak"


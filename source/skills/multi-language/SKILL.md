---
name: multi-language
description: Python, Kotlin, Java ve Node.js/TypeScript için çoklu dil kod üretim kuralları. Farklı dillerde idiomik, platforma uygun kod yazarken kullan.
---

# Çoklu Dil Kod Üretimi

## Dil Kuralları

### Python
- PEP 8, snake_case, type hints
- Comprehensions, generator, dataclasses tercih et
- `pathlib`, `with` statement, EAFP stili
- Detay için: `pythonic-quality` skill'ine bak

### Kotlin
- camelCase, nullable tipler `?` ile, `val` > `var`
- `data class`, `sealed class`, extension functions tercih et
- Coroutines ile async, `Flow` ile stream
- Null safety: `?.`, `?:`, `!!` sadece eminsen

### Java
- camelCase, explicit tipler, `Optional` nullable dönüşler için
- Records (Java 14+), `sealed` class (Java 17+) tercih et
- Yerel değişkenler için `var` (tip barizse)
- Stream API collection'lar için, `CompletableFuture` async için

### Node.js / TypeScript
- TypeScript varsayılan (strict mode)
- `const` > `let`, arrow functions, async/await
- ES modules (`import`/`export`), `require` kullanma
- Interface'leri type'lara tercih et

## Kod Kalitesi (Tüm Diller)

1. **YAGNI** - Gerekli olmayan kodu üretme
2. **Önce stdlib** - External dep'lerden önce built-in'leri dene
3. **Minimal MVP** - Sadece gerekli olanı üret
4. **Tutarlı stil** - Projenin mevcut konvansiyonlarına uy

## Tetikleyiciler
- "python", "kotlin", "java", "node", "typescript", "çoklu dil", "kod yaz"

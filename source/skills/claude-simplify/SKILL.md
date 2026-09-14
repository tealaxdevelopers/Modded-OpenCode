---
name: claude-simplify
description: >-
  Refactor code for clarity, reduce complexity, and improve readability.
  Use when the user says "simplify", "basitlestir", "refactor this",
  "clean up", "kodu temizle", or wants code to be more maintainable.
---

# Simplify

Reduce code complexity while preserving behavior.

## Principles

1. **YAGNI** — You Aren't Gonna Need It. Remove speculative code.
2. **Single Responsibility** — Each function does one thing.
3. **Early Returns** — Flatten nesting with guard clauses.
4. **Descriptive Names** — Code reads like prose.
5. **Remove Dead Code** — If it's not called, delete it.

## Simplification Patterns

### Flatten Nesting

Before:
```js
if (user) {
  if (user.active) {
    if (user.role === 'admin') {
      // ...
    }
  }
}
```

After:
```js
if (!user) return;
if (!user.active) return;
if (user.role !== 'admin') return;
// ...
```

### Extract Functions

Before:
```js
// 50 lines doing multiple things
```

After:
```js
function parseConfig(raw) { /* ... */ }
function validateConfig(config) { /* ... */ }
function applyConfig(config) { /* ... */ }
```

### Replace Magic Numbers

Before:
```js
if (retries > 3) { /* ... */ }
```

After:
```js
const MAX_RETRIES = 3;
if (retries > MAX_RETRIES) { /* ... */ }
```

### Use Built-in Methods

Before:
```js
let max = 0;
for (const x of arr) {
  if (x > max) max = x;
}
```

After:
```js
const max = Math.max(...arr);
```

## Checklist

- [ ] All tests still pass
- [ ] No behavior change (pure refactor)
- [ ] Function count reduced or stayed same
- [ ] Nesting depth reduced
- [ ] Duplicate code eliminated
- [ ] Names are descriptive
- [ ] Comments explain why, not what

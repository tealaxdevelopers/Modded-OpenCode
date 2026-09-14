---
name: claude-code-review
description: >-
  Perform a comprehensive code review on a pull request, file, or code block.
  Use when the user says "review", "code review", "pr review", "kod incele",
  "review this", or wants feedback on code quality, security, and best practices.
---

# Code Review

Perform a structured code review covering security, performance, correctness, and maintainability.

## Review Checklist

### Security (Critical)

- [ ] No hardcoded secrets, API keys, or credentials
- [ ] Input validation on all external data (user input, API responses, file reads)
- [ ] SQL injection prevention (parameterized queries, no string concatenation)
- [ ] XSS prevention (output encoding, no raw HTML injection)
- [ ] Path traversal prevention (sanitize file paths)
- [ ] Authentication/authorization checks present
- [ ] No sensitive data in logs
- [ ] Dependencies from trusted sources

### Correctness

- [ ] Logic matches stated requirements
- [ ] Edge cases handled (null, empty, boundary values)
- [ ] Error handling is explicit, not swallowed
- [ ] Race conditions addressed (async/await, locks)
- [ ] Resource cleanup (file handles, connections, timers)

### Performance

- [ ] No unnecessary database queries (N+1)
- [ ] Efficient algorithms (check Big-O for large data)
- [ ] Proper caching where applicable
- [ ] No memory leaks (event listeners, subscriptions)
- [ ] Lazy loading for heavy resources

### Maintainability

- [ ] Functions are single-purpose and well-named
- [ ] No code duplication (DRY)
- [ ] Comments explain why, not what
- [ ] Types are explicit and accurate
- [ ] Tests cover the happy path and edge cases

## Output Format

```
## Code Review Summary

### Critical Issues
- [file:line] description

### Suggestions
- [file:line] description

### Positive Notes
- What's done well

### Risk Level: Low | Medium | High
```

## Severity Levels

- **Critical**: Security vulnerability, data loss risk, production crash
- **High**: Logic bug, performance regression, breaking change
- **Medium**: Code smell, missing test, unclear naming
- **Low**: Style preference, minor optimization

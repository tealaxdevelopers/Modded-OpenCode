# Repository guidance

## Purpose

Maintain a small, secure compatibility layer between OpenCode and custom OpenAI-compatible model servers. Prefer OpenCode-native functionality for built-in providers, authentication, agents, MCP, and model cache refreshes.

## Design constraints

- Track the live schema at `https://opencode.ai/config.json`.
- Never persist raw API keys, bearer tokens, or private credentials.
- Use `tool_call`, not legacy model-level `tools`.
- Emit `limit` only with both `context` and `output`.
- Preserve unrelated config fields and unknown model/provider metadata.
- Keep launch sync bounded, quiet, and failure-tolerant.
- Keep network discovery opt-in and narrowly scoped.
- Support macOS and Linux, Bash and Zsh.
- Do not shadow server binaries such as `ollama` or `vllm`.

## Validation

Run before committing:

```bash
npm run validate
```

When changing configuration output, add or update an integration test under `tests/` that reads the resulting file and verifies secret hygiene and schema-compatible fields.

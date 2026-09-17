# Providers

Using any LLM provider in OpenCode.

OpenCode uses the AI SDK and Models.dev to support **75+ LLM providers** and it supports running local models.

To add a provider you need to:

1. Add the API keys for the provider using the `/connect` command.
2. Configure the provider in your OpenCode config.

### Credentials

When you add a provider's API keys with the `/connect` command, they are stored in `~/.local/share/opencode/auth.json`.

### Config

You can customize the providers through the `provider` section in your OpenCode config.

#### Base URL

Customize the base URL for any provider by setting the `baseURL` option.

#### Hiding models

Use `blacklist` to hide specific models from the `/models` picker. Use `whitelist` to keep only the listed models.

---

## OpenCode Zen

OpenCode Zen is a list of models provided by the OpenCode team that have been tested and verified to work well with OpenCode.

1. Run `/connect` in the TUI, select `OpenCode Zen`
2. Sign in at opencode.ai/zen, add billing details, copy API key
3. Paste your API key
4. Run `/models` to see recommended models

## OpenCode Go

OpenCode Go is a low cost subscription plan for open coding models.

1. Run `/connect` in the TUI, select `OpenCode Go`
2. Sign in, add billing details, copy API key
3. Paste your API key
4. Run `/models` to see recommended models

---

## Directory

### 302.AI
Head to 302.AI console, create account, generate API key. Run `/connect`, search for 302.AI, enter key. Run `/models` to select.

### Amazon Bedrock
Request model access in Bedrock console. Configure authentication via environment variables or `opencode.json`. Run `/models` to select.

### Anthropic
Run `/connect`, select Anthropic. Choose Claude Pro/Max for browser auth or manually enter API key. Run `/models`.

### Atomic Chat
Configure local models through Atomic Chat desktop app via OpenAI-compatible API.

### Azure OpenAI
Create Azure OpenAI resource, deploy model, run `/connect`, enter API key, set `AZURE_RESOURCE_NAME` env var. Run `/models`.

### Azure Cognitive Services
Similar to Azure OpenAI but with different resource endpoint.

### Baseten
Create account, generate API key, run `/connect`, enter key, run `/models`.

### Cerebras
Create account at inference.cerebras.ai, generate API key, run `/connect`, enter key, run `/models`.

### Cloudflare AI Gateway
Unified endpoint for multiple providers. Create gateway in Cloudflare dashboard, run `/connect`, enter Account ID, Gateway ID, and API token.

### Cloudflare Workers AI
Run AI models on Cloudflare's network via REST API. Get Account ID and API token from dashboard.

### Cortecs
Create account at cortecs.ai, generate API key, run `/connect`, enter key, run `/models`.

### DeepSeek
Create account at platform.deepseek.com, generate API key, run `/connect`, enter key, run `/models`.

### Deep Infra
Create account at deepinfra.com, generate API key, run `/connect`, enter key, run `/models`.

### DigitalOcean
OAuth or Model Access Key authentication. Supports Inference Routers for routing policies.

### Eden AI
EU-based gateway serving models from many vendors over OpenAI-compatible API.

### FrogBot
Create account at app.frogbot.ai, generate API key, run `/connect`, enter key, run `/models`.

### Fireworks AI
Create account at app.fireworks.ai, generate API key, run `/connect`, enter key, run `/models`.

### GitLab Duo
Experimental. Requires Premium or Ultimate GitLab subscription. OAuth or Personal Access Token auth.

### GitHub Copilot
Use your Copilot subscription. Run `/connect`, navigate to github.com/login/device, enter code. Run `/models`.

### GMI Cloud
Create API key at console.gmicloud.ai, run `/connect`, enter key, run `/models`.

### Google Vertex AI
Set `GOOGLE_CLOUD_PROJECT` and authenticate via service account or gcloud CLI. Run `/models`.

### Groq
Create API key at console.groq.com, run `/connect`, enter key, run `/models`.

### Hugging Face
Create token at huggingface.co settings, run `/connect`, enter token, run `/models`.

### Helicone
LLM observability platform. Create account, generate API key, run `/connect`, enter key.

### llama.cpp
Local models via llama-server. Configure with `@ai-sdk/openai-compatible` npm package.

### IO.NET
Create account at ai.io.net, generate API key, run `/connect`, enter key, run `/models`.

### LM Studio
Local models via LM Studio. Configure with `@ai-sdk/openai-compatible` npm package.

### Moonshot AI
Create account at platform.moonshot.ai, generate API key, run `/connect`, enter key, run `/models`.

### MiniMax
Create account at platform.minimax.io, generate API key, run `/connect`, enter key, run `/models`.

### Modal
Create shared endpoint, create proxy token, run `/connect`, enter combined token, run `/models`.

### NVIDIA
Free access via build.nvidia.com. Create account, generate API key, run `/connect`, enter key, run `/models`.

### Nebius Token Factory
Create account at tokenfactory.nebius.com, generate API key, run `/connect`, enter key, run `/models`.

### Ollama
Local models via Ollama. Configure with `@ai-sdk/openai-compatible` npm package.

### Ollama Cloud
Cloud-hosted Ollama. Sign in at ollama.com, generate API key, run `/connect`, enter key.

### OpenAI
Run `/connect`, select OpenAI, enter API key. Run `/models`.

### OpenCode Zen
See OpenCode Zen section above.

### OpenRouter
Run `/connect`, select OpenRouter, enter API key. Run `/models`.

### LLM Gateway
Generic OpenAI-compatible gateway configuration.

### Poolside
Run `/connect`, select Poolside, enter API key. Run `/models`.

### SAP AI Core
Configure via SAP AI Core service account.

### STACKIT
Run `/connect`, select STACKIT, enter API key. Run `/models`.

### OVHcloud AI Endpoints
Run `/connect`, select OVHcloud, enter API key. Run `/models`.

### Scaleway
Run `/connect`, select Scaleway, enter API key. Run `/models`.

### SCX.ai
Run `/connect`, select SCX.ai, enter API key. Run `/models`.

### Snowflake Cortex
Configure via Snowflake account.

### Together AI
Run `/connect`, select Together AI, enter API key. Run `/models`.

### Venice AI
Run `/connect`, select Venice AI, enter API key. Run `/models`.

### Vercel AI Gateway
Configure via Vercel AI Gateway endpoint.

### xAI
Run `/connect`, select xAI, enter API key. Run `/models`.

### Z.AI
Run `/connect`, select Z.AI, enter API key. Run `/models`.

### ZenMux
Multiplexer provider for routing across multiple providers.

---

## Custom provider

You can configure any OpenAI-compatible API as a custom provider.

## Troubleshooting

Check provider-specific documentation for authentication issues.

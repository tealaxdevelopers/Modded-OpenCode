# Go

Low cost subscription for open coding models.

OpenCode Go is a low cost **$10/month subscription** that gives you reliable access to popular open coding models.

Go works like any other provider in OpenCode. You subscribe to OpenCode Go and get your API key. It's **completely optional** and you don't need to use it to use OpenCode.

It is designed primarily for international users and provides stable global access.

---

## Background

Open models have gotten really good. They now reach performance close to proprietary models for coding tasks. And because many providers can serve them competitively, they are usually far cheaper.

However, getting reliable, low latency access to them can be difficult. Providers vary in quality and availability.

> We tested a select group of models and providers that work well with OpenCode.

To fix this, we did a couple of things:

1. We tested a select group of open models and talked to their teams about how to best run them.
2. We then worked with a few providers to make sure these were being served correctly.
3. Finally, we benchmarked the combination of the model/provider and came up with a list that we feel good recommending.

OpenCode Go gives you access to these models for **$10/month**.

---

## How it works

1. You sign in to OpenCode Zen, subscribe to Go, and copy your API key.
2. You run the `/connect` command in the TUI, select `OpenCode Go`, and paste your API key.
3. Run `/models` in the TUI to see the list of models available through Go.

The current list of models includes:

- Grok 4.6
- GLM-5.3-Flash
- GLM-5.3
- GLM-5.2
- GLM-5.1
- GPT 5.6 Luna
- Kimi K3
- Kimi K2.7 Code
- Kimi K2.6
- LongCat-2.0
- MiMo-V2.5
- MiMo-V2.5-Pro
- MiniMax M3
- MiniMax M2.7
- Muse Spark 1.3 Contributor
- Muse Spark 1.2 Contributor
- Qwen3.8 Max
- Qwen3.8 Flash
- Qwen3.7 Max
- Qwen3.7 Plus
- Qwen3.6 Plus
- DeepSeek V4.1 Flash
- DeepSeek V4 Pro
- DeepSeek V4 Flash
- DeepSeek V4 Flash Vision Exp
- Hy4 preview
- Hy3
- Union Alpha Free (limited time)

---

## Where can I use it?

OpenCode Go is designed for OpenCode and other coding agents that produce similar types of requests.

Your client should:

1. Send typical coding agent traffic
2. Identify itself with its own user agent
3. Send a stable session ID in `x-opencode-session` for each conversation

### Validated Clients

| Client | Session support |
|--------|----------------|
| Hermes | Builds containing PR #101864 |
| Claude Code | Native session header recognized |
| Codex | Native session header recognized |
| ZCode | Native session header recognized |
| Pi | Current builds send session information |
| jcode | Update to v0.81.6 or later |
| Kilo Code CLI | Builds containing PR #13752 |

### Known Problematic Clients

| Client | Status |
|--------|--------|
| DeepSeek Harness | Session info missing on some model paths |
| GitHub Copilot Chat | VS Code issue #334186 |
| Kimi Code | Issue #3506 |
| MiMo Code | Issue #2317 |

---

## Usage limits

Usage limits are defined as monthly dollar amounts. Each model has: 5-hour — 20% of monthly limit; weekly — 50%; monthly — 100%.

| Model | Input | Output | Monthly limit |
|-------|-------|--------|---------------|
| GLM-5.3-Flash | $0.15 | $0.50 | $60 |
| GLM-5.3 | $1.40 | $4.40 | $15 |
| GLM-5.2 | $1.40 | $4.40 | $60 |
| GLM-5.1 | $1.40 | $4.40 | $60 |
| Kimi K3 | $3.00 | $15.00 | $15 |
| Kimi K2.7 Code | $0.95 | $4.00 | $60 |
| Kimi K2.6 | $0.95 | $4.00 | $60 |
| LongCat-2.0 | $0.30 | $1.20 | $60 |
| MiMo V2.5 | $0.14 | $0.28 | $60 |
| MiMo V2.5 Pro | $0.435 | $0.87 | $15 |
| MiniMax M3 | $0.30 | $1.20 | $60 |
| MiniMax M2.7 | $0.30 | $1.20 | $60 |
| Muse Spark 1.3 Contributor | $0.10 | $0.20 | $60 |
| Muse Spark 1.2 Contributor | $0.10 | $0.20 | $60 |
| Qwen3.8 Max | $2.00 | $6.00 | $15 |
| Qwen3.8 Flash | $0.15 | $0.47 | $30 |
| Qwen3.7 Max | $2.50 | $7.50 | $30 |
| Qwen3.7 Plus | $0.40 | $1.60 | $60 |
| Qwen3.6 Plus | $0.50 | $3.00 | $60 |
| DeepSeek V4.1 Flash | $0.15 | $0.60 | $60 |
| DeepSeek V4 Pro | $0.66 | $1.98 | $15 |
| DeepSeek V4 Flash | $0.15 | $0.60 | $30 |
| Hy4 preview | $0.834 | $2.501 | $30 |
| Hy3 | $0.14 | $0.58 | $60 |
| Union Alpha Free | Free | Free | Unlimited |
| Grok 4.6 | $2.00 | $6.00 | $15 |
| GPT 5.6 Luna | $0.20 | $1.20 | $15 |

---

## Endpoints

You can access Go models through the following API endpoints:

| Model | Model ID | Endpoint |
|-------|----------|----------|
| Grok 4.6 | grok-4.6 | `https://opencode.ai/zen/go/v1/responses` |
| GPT 5.6 Luna | gpt-5.6-luna | `https://opencode.ai/zen/go/v1/responses` |
| GLM-5.3-Flash | glm-5.3-flash | `https://opencode.ai/zen/go/v1/chat/completions` |
| Kimi K3 | kimi-k3 | `https://opencode.ai/zen/go/v1/chat/completions` |
| Kimi K2.7 Code | kimi-k2.7-code | `https://opencode.ai/zen/go/v1/chat/completions` |
| DeepSeek V4.1 Flash | deepseek-v4.1-flash | `https://opencode.ai/zen/go/v1/chat/completions` |
| DeepSeek V4 Pro | deepseek-v4-pro | `https://opencode.ai/zen/go/v1/chat/completions` |
| MiMo-V2.5 | mimo-v2.5 | `https://opencode.ai/zen/go/v1/chat/completions` |
| MiniMax M3 | minimax-m3 | `https://opencode.ai/zen/go/v1/messages` |
| Qwen3.8 Max | qwen3.8-max | `https://opencode.ai/zen/go/v1/messages` |
| Qwen3.7 Max | qwen3.7-max | `https://opencode.ai/zen/go/v1/messages` |

The model id in your OpenCode config uses the format `opencode-go/<model-id>`.

---

## Privacy

| Model | Model training | Data retention |
|-------|---------------|----------------|
| Grok 4.6 | Not used | 30 days |
| GPT 5.6 Luna | Not used | 30 days |
| GLM-5.3-Flash | Not used | 0 days |
| Kimi K3 | Not used | 0 days |
| DeepSeek V4.1 Flash | Not used | 0 days |
| MiMo-V2.5 | Not used | 0 days |
| Qwen3.8 Max | Not used | 0 days |
| Muse Spark 1.3 Contributor | Yes | Not ZDR |
| Muse Spark 1.2 Contributor | Yes | Not ZDR |

---

## Goals

We created OpenCode Go to:

1. Make AI coding accessible to more people with a low cost subscription.
2. Provide reliable access to the best open coding models.
3. Curate models that are tested and benchmarked for coding agent use.
4. Have no lock-in by allowing you to use any other provider with OpenCode as well.

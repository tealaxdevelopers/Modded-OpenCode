# Zen

Curated list of models provided by OpenCode.

OpenCode Zen is a list of tested and verified models provided by the OpenCode team.

Zen works like any other provider in OpenCode. You login to OpenCode Zen and get your API key. It's **completely optional** and you don't need to use it to use OpenCode.

---

## Background

There are a large number of models out there but only a few of these models work well as coding agents. Additionally, most providers are configured very differently; so you get very different performance and quality.

> We tested a select group of models and providers that work well with OpenCode.

So if you are using a model through something like OpenRouter, you can never be sure if you are getting the best version of the model you want.

To fix this, we did a couple of things:

1. We tested a select group of models and talked to their teams about how to best run them.
2. We then worked with a few providers to make sure these were being served correctly.
3. Finally, we benchmarked the combination of the model/provider and came up with a list that we feel good recommending.

OpenCode Zen is an AI gateway that gives you access to these models.

---

## How it works

1. You sign in to OpenCode Zen, add your billing details, and copy your API key.
2. You run the `/connect` command in the TUI, select OpenCode Zen, and paste your API key.
3. Run `/models` in the TUI to see the list of models we recommend.

You are charged per request and you can add credits to your account.

---

## Endpoints

You can access our models through the following API endpoints:

| Model | Model ID | Endpoint |
|-------|----------|----------|
| GPT 6 Astra | gpt-6-astra | `https://opencode.ai/zen/v1/responses` |
| GPT 5.6 Sol | gpt-5.6-sol | `https://opencode.ai/zen/v1/responses` |
| GPT 5.6 Terra | gpt-5.6-terra | `https://opencode.ai/zen/v1/responses` |
| GPT 5.6 Luna | gpt-5.6-luna | `https://opencode.ai/zen/v1/responses` |
| GPT 5.5 | gpt-5.5 | `https://opencode.ai/zen/v1/responses` |
| GPT 5.5 Pro | gpt-5.5-pro | `https://opencode.ai/zen/v1/responses` |
| GPT 5.4 | gpt-5.4 | `https://opencode.ai/zen/v1/responses` |
| GPT 5.4 Pro | gpt-5.4-pro | `https://opencode.ai/zen/v1/responses` |
| GPT 5.4 Mini | gpt-5.4-mini | `https://opencode.ai/zen/v1/responses` |
| GPT 5.4 Nano | gpt-5.4-nano | `https://opencode.ai/zen/v1/responses` |
| GPT 5.3 Codex | gpt-5.3-codex | `https://opencode.ai/zen/v1/responses` |
| GPT 5.3 Codex Spark | gpt-5.3-codex-spark | `https://opencode.ai/zen/v1/responses` |
| GPT 5.2 | gpt-5.2 | `https://opencode.ai/zen/v1/responses` |
| GPT 5.1 | gpt-5.1 | `https://opencode.ai/zen/v1/responses` |
| GPT 5.1 Codex | gpt-5.1-codex | `https://opencode.ai/zen/v1/responses` |
| GPT 5.1 Codex Max | gpt-5.1-codex-max | `https://opencode.ai/zen/v1/responses` |
| GPT 5.1 Codex Mini | gpt-5.1-codex-mini | `https://opencode.ai/zen/v1/responses` |
| GPT 5 | gpt-5 | `https://opencode.ai/zen/v1/responses` |
| GPT 5 Codex | gpt-5-codex | `https://opencode.ai/zen/v1/responses` |
| GPT 5 Nano | gpt-5-nano | `https://opencode.ai/zen/v1/responses` |
| Claude Fable 5.1 | claude-fable-5-1 | `https://opencode.ai/zen/v1/messages` |
| Claude Fable 5 | claude-fable-5 | `https://opencode.ai/zen/v1/messages` |
| Claude Opus 5 | claude-opus-5 | `https://opencode.ai/zen/v1/messages` |
| Claude Opus 4.8 | claude-opus-4-8 | `https://opencode.ai/zen/v1/messages` |
| Claude Opus 4.7 | claude-opus-4-7 | `https://opencode.ai/zen/v1/messages` |
| Claude Opus 4.6 | claude-opus-4-6 | `https://opencode.ai/zen/v1/messages` |
| Claude Opus 4.5 | claude-opus-4-5 | `https://opencode.ai/zen/v1/messages` |
| Claude Sonnet 5 | claude-sonnet-5 | `https://opencode.ai/zen/v1/messages` |
| Claude Sonnet 4.6 | claude-sonnet-4-6 | `https://opencode.ai/zen/v1/messages` |
| Claude Sonnet 4.5 | claude-sonnet-4-5 | `https://opencode.ai/zen/v1/messages` |
| Claude Haiku 4.5 | claude-haiku-4-5 | `https://opencode.ai/zen/v1/messages` |
| Gemini 3.8 Flash | gemini-3.8-flash | `https://opencode.ai/zen/v1/models/gemini-3.8-flash` |
| Gemini 3.7 Flash | gemini-3.7-flash | `https://opencode.ai/zen/v1/models/gemini-3.7-flash` |
| Gemini 3.6 Flash | gemini-3.6-flash | `https://opencode.ai/zen/v1/models/gemini-3.6-flash` |
| Gemini 3.5 Flash | gemini-3.5-flash | `https://opencode.ai/zen/v1/models/gemini-3.5-flash` |
| Gemini 3.5 Flash Lite | gemini-3.5-flash-lite | `https://opencode.ai/zen/v1/models/gemini-3.5-flash-lite` |
| Gemini 3.1 Pro | gemini-3.1-pro | `https://opencode.ai/zen/v1/models/gemini-3.1-pro` |
| Gemini 3 Flash | gemini-3-flash | `https://opencode.ai/zen/v1/models/gemini-3-flash` |
| Grok 4.6 | grok-4.6 | `https://opencode.ai/zen/v1/responses` |
| Grok 4.5 | grok-4.5 | `https://opencode.ai/zen/v1/responses` |
| Grok Build 0.1 | grok-build-0.1 | `https://opencode.ai/zen/v1/responses` |
| Muse Spark 1.3 | muse-spark-1.3 | `https://opencode.ai/zen/v1/responses` |
| Muse Spark 1.2 | muse-spark-1.2 | `https://opencode.ai/zen/v1/responses` |
| Qwen3.7 Max | qwen3.7-max | `https://opencode.ai/zen/v1/messages` |
| Qwen3.7 Plus | qwen3.7-plus | `https://opencode.ai/zen/v1/messages` |
| Qwen3.6 Plus | qwen3.6-plus | `https://opencode.ai/zen/v1/messages` |
| Qwen3.5 Plus | qwen3.5-plus | `https://opencode.ai/zen/v1/messages` |
| DeepSeek V4 Pro | deepseek-v4-pro | `https://opencode.ai/zen/v1/chat/completions` |
| DeepSeek V4 Flash | deepseek-v4-flash | `https://opencode.ai/zen/v1/chat/completions` |
| MiniMax M3 | minimax-m3 | `https://opencode.ai/zen/v1/chat/completions` |
| MiniMax M2.7 | minimax-m2.7 | `https://opencode.ai/zen/v1/chat/completions` |
| GLM 5.3 Flash | glm-5.3-flash | `https://opencode.ai/zen/v1/chat/completions` |
| GLM 5.3 | glm-5.3 | `https://opencode.ai/zen/v1/chat/completions` |
| Kimi K3 | kimi-k3 | `https://opencode.ai/zen/v1/chat/completions` |
| Kimi K2.7 Code | kimi-k2.7-code | `https://opencode.ai/zen/v1/chat/completions` |
| Union Alpha Free | union-alpha | `https://opencode.ai/zen/v1/messages` |
| MiMo-V2.5 Free | mimo-v2.5-free | `https://opencode.ai/zen/v1/chat/completions` |
| Nemotron 3 Ultra Free | nemotron-3-ultra-free | `https://opencode.ai/zen/v1/chat/completions` |
| Big Pickle | big-pickle | `https://opencode.ai/zen/v1/chat/completions` |

The model id in your OpenCode config uses the format `opencode/<model-id>`.

### Models

Fetch the full list from: `https://opencode.ai/zen/v1/models`

---

## Pricing

Pay-as-you-go model. Prices **per 1M tokens**.

### Auto-reload

If your balance goes below $5, Zen will automatically reload $20. You can change the amount or disable auto-reload entirely.

### Monthly limits

You can set a monthly usage limit for the entire workspace and for each member of your team.

### Deprecated models

| Model | Deprecation date |
|-------|-----------------|
| GPT 5.2 Codex | July 23, 2026 |
| GPT 5.1 Codex | July 23, 2026 |
| Claude Opus 4.1 | August 5, 2026 |
| Claude Sonnet 4 | June 15, 2026 |
| Claude Haiku 3.5 | February 16, 2026 |
| MiniMax M2.5 | August 5, 2026 |
| Kimi K2.5 | August 5, 2026 |

---

## Privacy

All models are hosted in the US. Providers follow a zero-retention policy and do not use your data for model training, with exceptions:

- Free models: collected data may be used to improve the model
- OpenAI APIs: Requests retained for 30 days
- Anthropic APIs: Requests retained for 30 days
- Muse Spark Contributor: prompts/completions may be used for training

---

## For Teams

Zen works great for teams. Workspaces are currently free during beta.

### Roles

- **Admin**: Manage models, members, API keys, and billing
- **Member**: Manage only their own API keys

### Model access

Admins can enable or disable specific models for the workspace.

### Bring your own key

Use your own OpenAI or Anthropic API keys while still accessing other models in Zen.

---

## Goals

We created OpenCode Zen to:

1. **Benchmark** the best models/providers for coding agents
2. Have access to the **highest quality** options
3. Pass along any **price drops** by selling at cost
4. Have **no lock-in** by allowing you to use any other provider

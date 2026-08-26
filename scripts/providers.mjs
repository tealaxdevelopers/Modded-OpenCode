/**
 * Provider metadata used by the model synchronizer.
 *
 * Authentication itself is intentionally delegated to OpenCode (`/connect`) or
 * environment variables. Keeping OAuth client IDs and plugin versions here made
 * this project brittle and unsafe whenever OpenCode changed its built-ins.
 */

export const PROVIDERS = {
  openai: {
    id: "openai",
    name: "OpenAI",
    apiBase: "https://api.openai.com/v1",
    envVars: ["OPENAI_API_KEY"],
    npm: "@ai-sdk/openai",
    modelsEndpoint: "/models",
  },
  fireworks: {
    id: "fireworks",
    name: "Fireworks AI",
    apiBase: "https://api.fireworks.ai/inference/v1",
    envVars: ["FIREWORKS_API_KEY"],
    npm: "@ai-sdk/openai-compatible",
    modelsEndpoint: "/models",
  },
  deepseek: {
    id: "deepseek",
    name: "DeepSeek",
    apiBase: "https://api.deepseek.com/v1",
    envVars: ["DEEPSEEK_API_KEY"],
    npm: "@ai-sdk/openai-compatible",
    modelsEndpoint: "/models",
  },
  xai: {
    id: "xai",
    name: "xAI",
    apiBase: "https://api.x.ai/v1",
    envVars: ["XAI_API_KEY"],
    npm: "@ai-sdk/openai-compatible",
    modelsEndpoint: "/models",
  },
  groq: {
    id: "groq",
    name: "Groq",
    apiBase: "https://api.groq.com/openai/v1",
    envVars: ["GROQ_API_KEY"],
    npm: "@ai-sdk/openai-compatible",
    modelsEndpoint: "/models",
  },
  together: {
    id: "together",
    name: "Together AI",
    apiBase: "https://api.together.xyz/v1",
    envVars: ["TOGETHER_API_KEY"],
    npm: "@ai-sdk/openai-compatible",
    modelsEndpoint: "/models",
  },
  mistral: {
    id: "mistral",
    name: "Mistral AI",
    apiBase: "https://api.mistral.ai/v1",
    envVars: ["MISTRAL_API_KEY"],
    npm: "@ai-sdk/openai-compatible",
    modelsEndpoint: "/models",
  },
  openrouter: {
    id: "openrouter",
    name: "OpenRouter",
    apiBase: "https://openrouter.ai/api/v1",
    envVars: ["OPENROUTER_API_KEY"],
    npm: "@ai-sdk/openai-compatible",
    modelsEndpoint: "/models",
  },
  alibaba: {
    id: "alibaba",
    name: "Alibaba DashScope",
    apiBase: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    envVars: ["DASHSCOPE_API_KEY", "ALIBABA_API_KEY"],
    npm: "@ai-sdk/openai-compatible",
    modelsEndpoint: "/models",
  },
  ollama: {
    id: "ollama",
    name: "Ollama (local)",
    apiBase: "http://127.0.0.1:11434/v1",
    envVars: ["LOCAL_API_KEY"],
    npm: "@ai-sdk/openai-compatible",
    modelsEndpoint: "/models",
    isLocal: true,
  },
  lmstudio: {
    id: "lmstudio",
    name: "LM Studio (local)",
    apiBase: "http://127.0.0.1:1234/v1",
    envVars: ["LOCAL_API_KEY"],
    npm: "@ai-sdk/openai-compatible",
    modelsEndpoint: "/models",
    isLocal: true,
  },
  vllm: {
    id: "vllm",
    name: "vLLM (local)",
    apiBase: "http://127.0.0.1:8000/v1",
    envVars: ["LOCAL_API_KEY"],
    npm: "@ai-sdk/openai-compatible",
    modelsEndpoint: "/models",
    isLocal: true,
  },
  llamacpp: {
    id: "llamacpp",
    name: "llama.cpp (local)",
    apiBase: "http://127.0.0.1:8080/v1",
    envVars: ["LOCAL_API_KEY"],
    npm: "@ai-sdk/openai-compatible",
    modelsEndpoint: "/models",
    isLocal: true,
  },
  "remote-openai-compatible": {
    id: "remote-openai-compatible",
    name: "Remote OpenAI-compatible",
    envVars: ["REMOTE_API_KEY", "LOCAL_API_KEY", "API_KEY"],
    npm: "@ai-sdk/openai-compatible",
    modelsEndpoint: "/models",
    isRemote: true,
  },
  "openai-compatible": {
    id: "openai-compatible",
    name: "OpenAI-compatible",
    envVars: ["API_KEY", "LOCAL_API_KEY"],
    npm: "@ai-sdk/openai-compatible",
    modelsEndpoint: "/models",
  },
};

function normalizedHostname(hostname) {
  return String(hostname ?? "")
    .trim()
    .toLowerCase()
    .replace(/^\[|\]$/g, "")
    .replace(/\.$/, "");
}

function isOctet(value) {
  const numeric = Number(value);
  return Number.isInteger(numeric) && numeric >= 0 && numeric <= 255;
}

export function isTailscaleHost(hostname) {
  const host = normalizedHostname(hostname);
  if (!host) return false;
  if (host.endsWith(".ts.net")) return true;

  const match = host.match(/^100\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!match) return false;

  const [, second, third, fourth] = match;
  return Number(second) >= 64
    && Number(second) <= 127
    && isOctet(third)
    && isOctet(fourth);
}

export function isPrivateNetworkHost(hostname) {
  const host = normalizedHostname(hostname);
  if (!host) return false;

  if (host === "localhost" || host.endsWith(".local") || isTailscaleHost(host)) {
    return true;
  }

  if (host === "::1" || host.startsWith("fc") || host.startsWith("fd") || host.startsWith("fe80:")) {
    return true;
  }

  const parts = host.split(".");
  if (parts.length !== 4 || !parts.every(isOctet)) return false;

  const [first, second] = parts.map(Number);
  return first === 10
    || (first === 172 && second >= 16 && second <= 31)
    || (first === 192 && second === 168)
    || first === 127;
}

export function detectProviderFromUrl(value) {
  if (!value) return null;

  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    return null;
  }

  const host = normalizedHostname(parsed.hostname);
  const port = parsed.port;

  if (host === "api.openai.com") return PROVIDERS.openai;
  if (host === "api.fireworks.ai") return PROVIDERS.fireworks;
  if (host === "api.deepseek.com") return PROVIDERS.deepseek;
  if (host === "api.x.ai") return PROVIDERS.xai;
  if (host === "api.groq.com") return PROVIDERS.groq;
  if (host === "api.together.xyz") return PROVIDERS.together;
  if (host === "api.mistral.ai") return PROVIDERS.mistral;
  if (host === "openrouter.ai") return PROVIDERS.openrouter;
  if (host.includes("dashscope")) return PROVIDERS.alibaba;

  if ((host === "localhost" || host === "127.0.0.1" || host === "::1") && port === "11434") {
    return PROVIDERS.ollama;
  }
  if ((host === "localhost" || host === "127.0.0.1" || host === "::1") && port === "1234") {
    return PROVIDERS.lmstudio;
  }
  if ((host === "localhost" || host === "127.0.0.1" || host === "::1") && port === "8000") {
    return PROVIDERS.vllm;
  }
  if ((host === "localhost" || host === "127.0.0.1" || host === "::1") && port === "8080") {
    return PROVIDERS.llamacpp;
  }

  if (isPrivateNetworkHost(host)) return PROVIDERS["remote-openai-compatible"];
  return PROVIDERS["openai-compatible"];
}

export function getProvider(id) {
  return PROVIDERS[id] ?? null;
}

export function getAllProviders() {
  return Object.values(PROVIDERS);
}

export function getApiKeyForProvider(provider) {
  for (const envVar of provider?.envVars ?? []) {
    if (process.env[envVar]) return process.env[envVar];
  }
  return null;
}

export function getCredentialEnvVar(provider) {
  for (const envVar of provider?.envVars ?? []) {
    if (process.env[envVar]) return envVar;
  }
  return null;
}

export function requiresAuth(provider) {
  return Boolean(provider && !provider.isLocal && !provider.isRemote && provider.envVars?.length);
}

export default PROVIDERS;

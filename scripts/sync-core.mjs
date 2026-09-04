import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  detectProviderFromUrl,
  getApiKeyForProvider,
  getCredentialEnvVar,
  isTailscaleHost,
} from "./providers.mjs";

const DEFAULT_SCHEMA = "https://opencode.ai/config.json";
const ENV_REFERENCE_PATTERN = /^\{env:([A-Za-z_][A-Za-z0-9_]*)\}$/;

export function expandHome(value) {
  if (!value) return value;
  if (value === "~") return os.homedir();
  if (value.startsWith("~/")) return path.join(os.homedir(), value.slice(2));
  return value;
}

export function getDefaultConfigDir() {
  return path.join(
    process.env.XDG_CONFIG_HOME ?? path.join(os.homedir(), ".config"),
    "opencode",
  );
}

export function getConfigPath() {
  return expandHome(process.env.OPENCODE_CONFIG)
    ?? path.join(getDefaultConfigDir(), "opencode.json");
}

export function normalizeBaseURL(baseURL) {
  return String(baseURL ?? "").trim().replace(/\/+$/, "");
}

export function parseBaseURL(baseURL) {
  try {
    const parsed = new URL(normalizeBaseURL(baseURL));
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function isTailscaleBaseURL(baseURL) {
  return isTailscaleHost(parseBaseURL(baseURL)?.hostname);
}

export function getAutoDisplayName(baseURL, fallbackName = "OpenAI-compatible") {
  const parsed = parseBaseURL(baseURL);
  if (!parsed) return fallbackName;

  const host = parsed.hostname.replace(/^\[|\]$/g, "");
  const hostLabel = parsed.port ? `${host}:${parsed.port}` : host;
  if (isTailscaleHost(host)) return `Tailscale · ${hostLabel}`;
  return fallbackName;
}

export function createDefaultConfig() {
  return {
    $schema: DEFAULT_SCHEMA,
    provider: {},
  };
}

export function stripJsonComments(input) {
  let output = "";
  let inString = false;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];

    if (lineComment) {
      if (char === "\n") {
        lineComment = false;
        output += char;
      } else {
        output += " ";
      }
      continue;
    }

    if (blockComment) {
      if (char === "*" && next === "/") {
        blockComment = false;
        output += "  ";
        index += 1;
      } else {
        output += char === "\n" ? "\n" : " ";
      }
      continue;
    }

    if (inString) {
      output += char;
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      output += char;
      continue;
    }

    if (char === "/" && next === "/") {
      lineComment = true;
      output += "  ";
      index += 1;
      continue;
    }

    if (char === "/" && next === "*") {
      blockComment = true;
      output += "  ";
      index += 1;
      continue;
    }

    output += char;
  }

  return output;
}

export function stripTrailingCommas(input) {
  let output = "";
  let inString = false;
  let escaped = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];

    if (inString) {
      output += char;
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') inString = false;
      continue;
    }

    if (char === '"') {
      inString = true;
      output += char;
      continue;
    }

    if (char === ",") {
      let cursor = index + 1;
      while (cursor < input.length && /\s/.test(input[cursor])) cursor += 1;
      if (input[cursor] === "}" || input[cursor] === "]") continue;
    }

    output += char;
  }

  return output;
}

export function parseJsonConfig(content) {
  const parsed = JSON.parse(stripTrailingCommas(stripJsonComments(content)));
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new TypeError("OpenCode config must be a JSON object");
  }
  return parsed;
}

export function getProviderMap(cfg) {
  if (cfg.provider && typeof cfg.provider === "object" && !Array.isArray(cfg.provider)) {
    return cfg.provider;
  }
  if (cfg.providers && typeof cfg.providers === "object" && !Array.isArray(cfg.providers)) {
    cfg.provider = cfg.providers;
    delete cfg.providers;
    return cfg.provider;
  }
  cfg.provider = {};
  return cfg.provider;
}

export async function readConfig(configPath = getConfigPath()) {
  try {
    const cfg = parseJsonConfig(await fs.readFile(configPath, "utf8"));
    cfg.$schema ??= DEFAULT_SCHEMA;
    cfg.provider = getProviderMap(cfg);
    return cfg;
  } catch (error) {
    if (error.code === "ENOENT") return createDefaultConfig();
    throw new Error(`Unable to read ${configPath}: ${error.message}`, { cause: error });
  }
}

export async function writeConfig(cfg, configPath = getConfigPath()) {
  await fs.mkdir(path.dirname(configPath), { recursive: true, mode: 0o700 });
  const temporaryPath = `${configPath}.${process.pid}.${Date.now()}.tmp`;
  const content = `${JSON.stringify(cfg, null, 2)}\n`;

  try {
    await fs.writeFile(temporaryPath, content, { encoding: "utf8", mode: 0o600 });
    await fs.rename(temporaryPath, configPath);
    await fs.chmod(configPath, 0o600).catch(() => {});
  } catch (error) {
    await fs.rm(temporaryPath, { force: true }).catch(() => {});
    throw error;
  }
}

export function collectModels(responseBody) {
  const models = Array.isArray(responseBody?.data)
    ? responseBody.data
    : Array.isArray(responseBody?.models)
      ? responseBody.models
      : [];

  const deduped = new Map();
  for (const model of models) {
    if (typeof model?.id !== "string" || !model.id.trim()) continue;
    deduped.set(model.id.trim(), { ...model, id: model.id.trim() });
  }
  return [...deduped.values()];
}

export function resolveModelName(model) {
  return [model?.name, model?.display_name, model?.displayName, model?.label, model?.id]
    .find((value) => typeof value === "string" && value.trim())
    ?.trim() ?? model?.id;
}

export function resolveModelToolSupport(model) {
  const explicit = [
    model?.tool_call,
    model?.tools,
    model?.supports_tools,
    model?.supportsTools,
    model?.tool_calls,
    model?.toolCalls,
    model?.function_calling,
    model?.functionCalling,
  ].find((value) => typeof value === "boolean");

  if (typeof explicit === "boolean") return explicit;

  const id = String(model?.id ?? "").toLowerCase();
  return !["embedding", "embed", "reranker", "rerank", "moderation", "whisper", "tts"]
    .some((token) => id.includes(token));
}

export function resolveModelReasoningSupport(model) {
  return [model?.reasoning, model?.supports_reasoning, model?.supportsReasoning]
    .find((value) => typeof value === "boolean");
}

function positiveNumber(...values) {
  for (const value of values) {
    const number = Number(value);
    if (Number.isFinite(number) && number > 0) return number;
  }
  return undefined;
}

export function resolveModelLimit(model, previousLimit) {
  const context = positiveNumber(
    model?.limit?.context,
    model?.context_length,
    model?.contextLength,
    model?.max_model_len,
    model?.maxModelLen,
    model?.max_context_length,
    previousLimit?.context,
  );
  const output = positiveNumber(
    model?.limit?.output,
    model?.max_output_tokens,
    model?.maxOutputTokens,
    model?.max_completion_tokens,
    previousLimit?.output,
  );
  const input = positiveNumber(model?.limit?.input, model?.max_input_tokens, previousLimit?.input);

  if (!context || !output) return previousLimit;
  return input ? { context, input, output } : { context, output };
}

function resolveEnvReference(value) {
  if (typeof value !== "string") return undefined;
  const match = value.match(ENV_REFERENCE_PATTERN);
  return match ? process.env[match[1]] : value;
}

function resolveHeaders(headers = {}) {
  const resolved = {};
  for (const [name, value] of Object.entries(headers)) {
    const next = resolveEnvReference(value);
    if (typeof next === "string" && next) resolved[name] = next;
  }
  return resolved;
}

function candidateCredentialEnvVars(detectedProvider) {
  const names = [...(detectedProvider?.envVars ?? [])];
  if (detectedProvider?.isRemote) names.push("REMOTE_API_KEY", "LOCAL_API_KEY", "API_KEY");
  if (detectedProvider?.isLocal) names.push("LOCAL_API_KEY", "API_KEY");
  return [...new Set(names)];
}

export function resolveRequestHeaders({ detectedProvider, providerConfig }) {
  const headers = resolveHeaders(providerConfig?.options?.headers);
  let apiKey = resolveEnvReference(providerConfig?.options?.apiKey);
  apiKey ||= getApiKeyForProvider(detectedProvider);

  if (!apiKey) {
    for (const envVar of candidateCredentialEnvVars(detectedProvider)) {
      if (process.env[envVar]) {
        apiKey = process.env[envVar];
        break;
      }
    }
  }

  const hasAuthorization = Object.keys(headers).some((name) => name.toLowerCase() === "authorization");
  if (apiKey && !hasAuthorization) headers.Authorization = `Bearer ${apiKey}`;
  return Object.keys(headers).length ? headers : undefined;
}

export function resolveCredentialReference({ detectedProvider, providerConfig }) {
  const existing = providerConfig?.options?.apiKey;
  if (typeof existing === "string" && ENV_REFERENCE_PATTERN.test(existing)) return existing;

  const envVars = candidateCredentialEnvVars(detectedProvider);
  const preferred = getCredentialEnvVar(detectedProvider);
  if (preferred) return `{env:${preferred}}`;

  for (const envVar of envVars) {
    if (process.env[envVar]) return `{env:${envVar}}`;
  }

  if (typeof existing === "string") {
    for (const envVar of envVars) {
      if (process.env[envVar] && process.env[envVar] === existing) return `{env:${envVar}}`;
    }
  }
  return undefined;
}

export function getModelsURL(baseURL, modelsPath = process.env.OPENCODE_MODELS_PATH || "/models") {
  const normalized = normalizeBaseURL(baseURL);
  if (!parseBaseURL(normalized)) throw new TypeError(`Invalid HTTP(S) base URL: ${baseURL}`);
  if (/\/models(?:\?|$)/.test(normalized)) return normalized;
  const pathSuffix = String(modelsPath || "/models").startsWith("/")
    ? String(modelsPath || "/models")
    : `/${modelsPath}`;
  return `${normalized}${pathSuffix}`;
}

export async function fetchModels({ baseURL, headers, fetchImpl = fetch, modelsPath }) {
  const modelsURL = getModelsURL(baseURL, modelsPath);
  const response = await fetchImpl(modelsURL, headers ? { headers } : {});
  if (!response.ok) {
    const errorText = (await response.text()).replace(/\s+/g, " ").slice(0, 500);
    throw new Error(`GET ${modelsURL} failed: ${response.status}${errorText ? ` ${errorText}` : ""}`);
  }

  let body;
  try {
    body = await response.json();
  } catch (error) {
    throw new Error(`GET ${modelsURL} returned invalid JSON: ${error.message}`, { cause: error });
  }
  return collectModels(body);
}

export function sanitizeProviderId(value) {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!normalized) throw new TypeError("Provider ID must contain letters or numbers");
  return normalized;
}

function sanitizeProviderOptions(existingOptions, credentialReference) {
  const options = { ...(existingOptions ?? {}) };
  if (options.headers && typeof options.headers === "object") {
    const headers = { ...options.headers };
    for (const key of Object.keys(headers)) {
      if (key.toLowerCase() === "authorization" && credentialReference) delete headers[key];
    }
    if (Object.keys(headers).length) options.headers = headers;
    else delete options.headers;
  }
  if (credentialReference) options.apiKey = credentialReference;
  return options;
}

export function syncProviderModels({
  cfg,
  providerKey,
  baseURL,
  models,
  detectedProvider,
  providerConfig,
  displayName,
  npmPackage,
  providerApi,
  credentialReference,
  prune = process.env.OPENCODE_SYNC_PRUNE !== "0",
}) {
  const providers = getProviderMap(cfg);
  const key = sanitizeProviderId(providerKey);
  const existingProvider = providers[key] ?? providerConfig ?? {};
  const existingModels = existingProvider.models ?? {};
  const options = sanitizeProviderOptions(existingProvider.options, credentialReference);
  options.baseURL = normalizeBaseURL(baseURL);

  const nextProvider = {
    ...existingProvider,
    npm: npmPackage ?? existingProvider.npm ?? detectedProvider?.npm ?? "@ai-sdk/openai-compatible",
    name: displayName ?? existingProvider.name ?? detectedProvider?.name ?? key,
    options,
    models: prune ? {} : { ...existingModels },
  };

  const api = providerApi ?? existingProvider.api ?? detectedProvider?.api;
  if (api) nextProvider.api = api;
  providers[key] = nextProvider;

  let addedCount = 0;
  let updatedCount = 0;

  for (const model of models) {
    const previous = { ...(existingModels[model.id] ?? {}) };
    const legacyTools = previous.tools;
    delete previous.tools;

    const nextModel = {
      ...previous,
      name: resolveModelName(model),
      tool_call: resolveModelToolSupport(model),
    };

    if (nextModel.tool_call === undefined && typeof legacyTools === "boolean") {
      nextModel.tool_call = legacyTools;
    }

    const reasoning = resolveModelReasoningSupport(model);
    if (typeof reasoning === "boolean") nextModel.reasoning = reasoning;

    const limit = resolveModelLimit(model, previous.limit);
    if (limit) nextModel.limit = limit;

    if (existingModels[model.id]) updatedCount += 1;
    else addedCount += 1;
    nextProvider.models[model.id] = nextModel;
  }

  const removedCount = prune
    ? Object.keys(existingModels).filter((modelId) => !Object.hasOwn(nextProvider.models, modelId)).length
    : 0;

  return {
    providerKey: key,
    modelCount: models.length,
    addedCount,
    updatedCount,
    removedCount,
  };
}

export function canSyncBaseURL(baseURL) {
  return Boolean(parseBaseURL(baseURL) && detectProviderFromUrl(baseURL)?.modelsEndpoint);
}

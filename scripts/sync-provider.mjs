import { detectProviderFromUrl } from "./providers.mjs";
import {
  fetchModels,
  getAutoDisplayName,
  getConfigPath,
  normalizeBaseURL,
  readConfig,
  resolveCredentialReference,
  resolveRequestHeaders,
  sanitizeProviderId,
  syncProviderModels,
  writeConfig,
} from "./sync-core.mjs";

const baseURL = normalizeBaseURL(process.env.LOCAL_API_BASE ?? "http://127.0.0.1:1234/v1");
const detectedProvider = detectProviderFromUrl(baseURL);
const providerId = sanitizeProviderId(
  process.env.OPENCODE_PROVIDER_ID || detectedProvider?.id || "openai-compatible",
);
const displayName = process.env.OPENCODE_PROVIDER_NAME
  || getAutoDisplayName(baseURL, detectedProvider?.name || providerId);
const configPath = getConfigPath();
const timeoutMs = Number(process.env.OPENCODE_SYNC_TIMEOUT_MS || 10_000);

function createFetchWithTimeout(timeout) {
  return async (url, options = {}) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      return await fetch(url, { ...options, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  };
}

console.log(`Syncing ${displayName} from ${baseURL}`);

try {
  const cfg = await readConfig(configPath);
  const providerConfig = cfg.provider?.[providerId];
  const headers = resolveRequestHeaders({ detectedProvider, providerConfig });
  const credentialReference = resolveCredentialReference({ detectedProvider, providerConfig });
  const models = await fetchModels({
    baseURL,
    headers,
    modelsPath: process.env.OPENCODE_MODELS_PATH,
    fetchImpl: createFetchWithTimeout(Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 10_000),
  });

  if (models.length === 0) {
    console.log(`No models returned by ${baseURL}`);
    process.exitCode = 0;
  } else {
    const result = syncProviderModels({
      cfg,
      providerKey: providerId,
      baseURL,
      models,
      detectedProvider,
      providerConfig,
      displayName,
      npmPackage: process.env.OPENCODE_PROVIDER_NPM,
      providerApi: process.env.OPENCODE_PROVIDER_API,
      credentialReference,
    });

    if (process.env.OPENCODE_SYNC_DRY_RUN !== "1") {
      await writeConfig(cfg, configPath);
      console.log(`Updated ${configPath}`);
    } else {
      console.log("Dry run: configuration was not written");
    }

    console.log(`Found ${result.modelCount} models · added ${result.addedCount} · updated ${result.updatedCount} · removed ${result.removedCount}`);
  }
} catch (error) {
  console.error(`Sync failed: ${error.message}`);
  process.exitCode = 1;
}

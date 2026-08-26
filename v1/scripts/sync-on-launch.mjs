import { execFile } from "node:child_process";
import net from "node:net";
import { promisify } from "node:util";
import { detectProviderFromUrl } from "./providers.mjs";
import {
  canSyncBaseURL,
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

// Deliberately narrow: scanning hundreds of ports on every launch made startup slow.
const DEFAULT_TAILSCALE_PORTS = "1234,8000,8080,11434";
const DEFAULT_TAILSCALE_TIMEOUT_MS = 150;
const DEFAULT_TAILSCALE_CONCURRENCY = 16;
const DEFAULT_HTTP_TIMEOUT_MS = 2500;
const execFileAsync = promisify(execFile);

function positiveInteger(value, fallback, maximum = Number.MAX_SAFE_INTEGER) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 && number <= maximum ? number : fallback;
}

export function parsePortRanges(rangeSpec = DEFAULT_TAILSCALE_PORTS) {
  const ports = new Set();
  for (const rawSegment of String(rangeSpec).split(",")) {
    const segment = rawSegment.trim();
    if (!segment) continue;

    if (segment.includes("-")) {
      const [startRaw, endRaw] = segment.split("-", 2);
      const start = positiveInteger(startRaw, 0, 65535);
      const end = positiveInteger(endRaw, 0, 65535);
      if (!start || !end || start > end) continue;
      for (let port = start; port <= end; port += 1) ports.add(port);
      continue;
    }

    const port = positiveInteger(segment, 0, 65535);
    if (port) ports.add(port);
  }
  return [...ports].sort((left, right) => left - right);
}

function hostForURL(host) {
  return net.isIP(host) === 6 ? `[${host}]` : host;
}

function getLaunchTargets(cfg) {
  const targets = [];
  const seenBaseURLs = new Set();

  for (const [providerKey, providerConfig] of Object.entries(cfg.provider ?? {})) {
    const baseURL = normalizeBaseURL(providerConfig?.options?.baseURL ?? providerConfig?.baseURL);
    if (!baseURL || !canSyncBaseURL(baseURL) || seenBaseURLs.has(baseURL)) continue;

    seenBaseURLs.add(baseURL);
    targets.push({
      providerKey,
      baseURL,
      providerConfig,
      displayName: providerConfig?.name,
    });
  }

  const fallbackBaseURL = normalizeBaseURL(process.env.LOCAL_API_BASE);
  if (fallbackBaseURL && canSyncBaseURL(fallbackBaseURL) && !seenBaseURLs.has(fallbackBaseURL)) {
    const detected = detectProviderFromUrl(fallbackBaseURL);
    const providerKey = sanitizeProviderId(process.env.OPENCODE_PROVIDER_ID || detected?.id || "openai-compatible");
    seenBaseURLs.add(fallbackBaseURL);
    targets.push({
      providerKey,
      baseURL: fallbackBaseURL,
      providerConfig: cfg.provider?.[providerKey],
      displayName: process.env.OPENCODE_PROVIDER_NAME,
    });
  }

  return { targets, seenBaseURLs };
}

async function getTailscaleStatus() {
  if (process.env.OPENCODE_TAILSCALE_STATUS_JSON) {
    try {
      return JSON.parse(process.env.OPENCODE_TAILSCALE_STATUS_JSON);
    } catch (error) {
      console.error(`Tailscale discovery ignored invalid status JSON: ${error.message}`);
      return null;
    }
  }

  try {
    const { stdout } = await execFileAsync("tailscale", ["status", "--json"], {
      encoding: "utf8",
      timeout: 3000,
      maxBuffer: 2 * 1024 * 1024,
    });
    return JSON.parse(stdout);
  } catch {
    return null;
  }
}

function getTailscalePeers(status) {
  const deduped = new Map();
  for (const peer of Object.values(status?.Peer ?? {})) {
    if (!peer || peer.Online === false) continue;
    const label = String(peer.HostName || peer.DNSName || "").replace(/\.$/, "");
    for (const ip of peer.TailscaleIPs ?? []) {
      if (typeof ip !== "string" || !net.isIP(ip)) continue;
      deduped.set(ip, { ip, label: label || ip });
    }
  }
  return [...deduped.values()];
}

function isTcpPortOpen(host, port, timeoutMs) {
  return new Promise((resolve) => {
    let socket;
    try {
      socket = net.connect({ host, port });
    } catch {
      resolve(false);
      return;
    }

    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(result);
    };

    socket.setTimeout(timeoutMs);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));
  });
}

async function discoverTailscaleTargets(cfg, seenBaseURLs) {
  // Network discovery is opt-in. Explicit remote providers are still synced.
  if (process.env.OPENCODE_TAILSCALE_DISCOVERY !== "1") return [];

  const status = await getTailscaleStatus();
  const peers = getTailscalePeers(status);
  if (!peers.length) return [];

  const timeoutMs = positiveInteger(
    process.env.OPENCODE_TAILSCALE_TIMEOUT_MS,
    DEFAULT_TAILSCALE_TIMEOUT_MS,
    60_000,
  );
  const concurrency = positiveInteger(
    process.env.OPENCODE_TAILSCALE_CONCURRENCY,
    DEFAULT_TAILSCALE_CONCURRENCY,
    256,
  );
  const ports = parsePortRanges(process.env.OPENCODE_TAILSCALE_PORTS || DEFAULT_TAILSCALE_PORTS);
  const candidates = [];

  for (const peer of peers) {
    for (const port of ports) {
      const baseURL = `http://${hostForURL(peer.ip)}:${port}/v1`;
      if (seenBaseURLs.has(baseURL)) continue;
      const providerKey = sanitizeProviderId(`tailscale-${peer.label}-${port}`);
      candidates.push({
        providerKey,
        baseURL,
        providerConfig: cfg.provider?.[providerKey],
        displayName: `Tailscale · ${peer.label}:${port}`,
        host: peer.ip,
        port,
      });
    }
  }

  const discovered = [];
  for (let index = 0; index < candidates.length; index += concurrency) {
    const batch = candidates.slice(index, index + concurrency);
    const results = await Promise.all(batch.map(async (candidate) => (
      await isTcpPortOpen(candidate.host, candidate.port, timeoutMs) ? candidate : null
    )));

    for (const candidate of results) {
      if (!candidate || seenBaseURLs.has(candidate.baseURL)) continue;
      seenBaseURLs.add(candidate.baseURL);
      discovered.push(candidate);
    }
  }
  return discovered;
}

function createFetchWithTimeout(timeoutMs) {
  return async (url, options = {}) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, { ...options, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  };
}

const configPath = getConfigPath();

try {
  const cfg = await readConfig(configPath);
  const { targets: configuredTargets, seenBaseURLs } = getLaunchTargets(cfg);
  const tailscaleTargets = await discoverTailscaleTargets(cfg, seenBaseURLs);
  const targets = [...configuredTargets, ...tailscaleTargets];
  let syncedCount = 0;

  for (const target of targets) {
    try {
      const detectedProvider = detectProviderFromUrl(target.baseURL);
      const headers = resolveRequestHeaders({ detectedProvider, providerConfig: target.providerConfig });
      const credentialReference = resolveCredentialReference({ detectedProvider, providerConfig: target.providerConfig });
      const timeoutMs = positiveInteger(
        process.env.OPENCODE_SYNC_TIMEOUT_MS,
        target.displayName?.startsWith("Tailscale") ? 1000 : DEFAULT_HTTP_TIMEOUT_MS,
        120_000,
      );
      const models = await fetchModels({
        baseURL: target.baseURL,
        headers,
        fetchImpl: createFetchWithTimeout(timeoutMs),
      });
      if (!models.length) continue;

      syncProviderModels({
        cfg,
        providerKey: target.providerKey,
        baseURL: target.baseURL,
        models,
        detectedProvider,
        providerConfig: target.providerConfig,
        displayName: target.displayName
          || getAutoDisplayName(target.baseURL, detectedProvider?.name ?? target.providerKey),
        credentialReference,
      });
      syncedCount += 1;
    } catch (error) {
      if (process.env.OPENCODE_SYNC_VERBOSE === "1") {
        console.error(`Launch sync skipped ${target.providerKey}: ${error.message}`);
      }
    }
  }

  if (syncedCount > 0 && process.env.OPENCODE_SYNC_DRY_RUN !== "1") {
    await writeConfig(cfg, configPath);
  }
  if (process.env.OPENCODE_SYNC_VERBOSE === "1") {
    console.log(`Launch sync refreshed ${syncedCount}/${targets.length} providers`);
  }
} catch (error) {
  if (process.env.OPENCODE_SYNC_VERBOSE === "1") {
    console.error(`Launch sync failed: ${error.message}`);
  }
}

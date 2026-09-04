#!/usr/bin/env node
/**
 * proxy-bridge.mjs — Fetch free proxies, test speed, output fastest
 *
 * Usage:
 *   node scripts/proxy-bridge.mjs              # Human-readable output
 *   node scripts/proxy-bridge.mjs --json       # JSON output (for agent parsing)
 *   node scripts/proxy-bridge.mjs --top 10     # Show top N results (default 5)
 *   node scripts/proxy-bridge.mjs --write      # Write proxy to env file
 *   node scripts/proxy-bridge.mjs --protocol socks5  # Filter by protocol
 *
 * Sources: Databay (63.9% alive, 1067ms median) + ProxyScrape (22k pool, 1min refresh)
 * Test method: TCP handshake latency (fast, reliable)
 */

import net from "node:net";
import { writeFile, mkdir } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

// --- Config ---
const TIMEOUT_MS = 5000;
const CONCURRENCY = 10;
const MAX_CANDIDATES = 30;
const FETCH_TIMEOUT = 12000;

// --- Proxy Sources ---
const SOURCES = [
  {
    name: "Databay",
    // speed=fast returns pre-filtered low-latency subset
    url: "https://databay.com/api/v1/proxy-list?speed=fast&format=json",
    async parse(res) {
      const data = await res.json();
      return (data.data || []).map((p) => ({
        ip: p.ip,
        port: Number(p.port),
        protocol: (p.protocol || "http").toLowerCase(),
        reportedLatency: p.latency || null,
        country: p.country || "",
        source: "Databay",
      }));
    },
  },
  {
    name: "ProxyScrape",
    url: "https://api.proxyscrape.com/v4/free-proxy-list/get?request=display_proxies&proxy_format=protocolipport&format=json&timeout=5000",
    async parse(res) {
      const data = await res.json();
      if (!Array.isArray(data)) return [];
      return data
        .filter((p) => p && p.ip && p.port)
        .map((p) => ({
          ip: p.ip,
          port: Number(p.port),
          protocol: (p.protocol || "http").toLowerCase(),
          reportedLatency: p.latency_ms || null,
          country: p.country || "",
          source: "ProxyScrape",
        }));
    },
  },
];

// --- Fetch All Proxies ---
async function fetchAllProxies(protocolFilter) {
  const all = [];
  const seen = new Set();

  for (const src of SOURCES) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT);
      const res = await fetch(src.url, { signal: ctrl.signal });
      clearTimeout(timer);
      if (!res.ok) {
        console.error(`[${src.name}] HTTP ${res.status}`);
        continue;
      }
      const proxies = await src.parse(res);
      for (const p of proxies) {
        const key = `${p.ip}:${p.port}`;
        if (seen.has(key)) continue;
        if (p.port < 1 || p.port > 65535) continue;
        if (protocolFilter && p.protocol !== protocolFilter) continue;
        seen.add(key);
        all.push(p);
      }
      console.error(`[${src.name}] +${proxies.length} proxies`);
    } catch (e) {
      console.error(`[${src.name}] ${e.message}`);
    }
  }
  return all;
}

// --- TCP Speed Test ---
function testTcp(proxy) {
  return new Promise((resolve) => {
    const start = performance.now();
    const socket = net.connect(proxy.port, proxy.ip, () => {
      const latency = Math.round(performance.now() - start);
      socket.destroy();
      resolve({ ...proxy, latencyMs: latency, alive: true });
    });
    socket.setTimeout(TIMEOUT_MS);
    socket.on("timeout", () => {
      socket.destroy();
      resolve({ ...proxy, latencyMs: null, alive: false });
    });
    socket.on("error", () => {
      socket.destroy();
      resolve({ ...proxy, latencyMs: null, alive: false });
    });
  });
}

// --- Concurrent Runner ---
async function runConcurrent(items, fn, limit) {
  const results = [];
  let idx = 0;
  async function worker() {
    while (idx < items.length) {
      const i = idx++;
      results.push(await fn(items[i]));
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => worker())
  );
  return results;
}

// --- Parse CLI Args ---
const args = process.argv.slice(2);
const jsonMode = args.includes("--json");
const writeMode = args.includes("--write");
const topN = (() => {
  const i = args.indexOf("--top");
  return i >= 0 ? Math.min(Number(args[i + 1]) || 5, 20) : 5;
})();
const protocolFilter = (() => {
  const i = args.indexOf("--protocol");
  return i >= 0 ? (args[i + 1] || "").toLowerCase() : null;
})();

// --- Main ---
async function main() {
  if (!jsonMode) console.error("Fetching free proxies...");

  const proxies = await fetchAllProxies(protocolFilter);
  if (!jsonMode) console.error(`Found ${proxies.length} unique proxies`);

  if (proxies.length === 0) {
    const err = { error: "No proxies found from any source" };
    jsonMode ? console.log(JSON.stringify(err)) : console.error(err.error);
    process.exit(1);
  }

  // Pre-sort by reported latency, take top candidates for testing
  const candidates = proxies
    .sort((a, b) => (a.reportedLatency || 99999) - (b.reportedLatency || 99999))
    .slice(0, MAX_CANDIDATES);

  if (!jsonMode)
    console.error(`Testing ${candidates.length} candidates (TCP handshake)...`);

  const results = await runConcurrent(candidates, testTcp, CONCURRENCY);
  const alive = results
    .filter((r) => r.alive)
    .sort((a, b) => a.latencyMs - b.latencyMs);

  if (alive.length === 0) {
    const err = { error: "No proxies responded" };
    jsonMode ? console.log(JSON.stringify(err)) : console.error(err.error);
    process.exit(1);
  }

  const fastest = alive.slice(0, topN);

  // Output
  if (jsonMode) {
    console.log(
      JSON.stringify(
        {
          proxies: fastest.map((p) => ({
            url: `${p.protocol}://${p.ip}:${p.port}`,
            ip: p.ip,
            port: p.port,
            protocol: p.protocol,
            latencyMs: p.latencyMs,
            country: p.country,
            source: p.source,
          })),
          stats: {
            total: proxies.length,
            tested: candidates.length,
            alive: alive.length,
          },
        },
        null,
        0
      )
    );
  } else {
    console.log("\nAlive proxies (sorted by latency):\n");
    console.log(
      "Rank  Proxy".padEnd(38) +
        "Latency  Country  Source"
    );
    console.log("─".repeat(70));
    fastest.forEach((p, i) => {
      const proxy = `${p.protocol}://${p.ip}:${p.port}`.padEnd(36);
      const lat = `${p.latencyMs}ms`.padEnd(8);
      const country = (p.country || "—").padEnd(9);
      console.log(`#${i + 1}   ${proxy}${lat}${country}${p.source}`);
    });
    console.log(
      `\nFastest: ${fastest[0].protocol}://${fastest[0].ip}:${fastest[0].port} (${fastest[0].latencyMs}ms)`
    );
    console.log(
      `\nTo use:  export HTTPS_PROXY=${fastest[0].protocol}://${fastest[0].ip}:${fastest[0].port}`
    );
  }

  // Write env file if requested
  if (writeMode && fastest.length > 0) {
    const p = fastest[0];
    const proxyUrl = `${p.protocol}://${p.ip}:${p.port}`;
    const envContent = [
      `# proxy-bridge generated — ${new Date().toISOString()}`,
      `# Fastest proxy: ${proxyUrl} (${p.latencyMs}ms, ${p.source})`,
      `HTTPS_PROXY=${proxyUrl}`,
      `HTTP_PROXY=${proxyUrl}`,
      `NO_PROXY=localhost,127.0.0.1`,
      "",
    ].join("\n");

    const configDir = join(homedir(), ".config", "opencode");
    const envPath = join(configDir, "proxy-bridge.env");
    await mkdir(configDir, { recursive: true });
    await writeFile(envPath, envContent, "utf-8");

    if (!jsonMode) console.log(`\nWritten to: ${envPath}`);
  }
}

main().catch((e) => {
  const err = { error: e.message };
  jsonMode ? console.log(JSON.stringify(err)) : console.error(err.message);
  process.exit(1);
});

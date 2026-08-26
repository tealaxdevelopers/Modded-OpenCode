import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import {
  getAutoDisplayName,
  parseJsonConfig,
  resolveCredentialReference,
  resolveModelLimit,
  syncProviderModels,
} from "../scripts/sync-core.mjs";
import { detectProviderFromUrl } from "../scripts/providers.mjs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const exec = promisify(execFile);

async function withServer(routes, token, run) {
  const server = http.createServer((req, res) => {
    if (token && req.headers.authorization !== `Bearer ${token}`) {
      res.writeHead(401).end();
      return;
    }
    const data = routes[req.url];
    res.writeHead(data ? 200 : 404, { "content-type": "application/json" });
    res.end(JSON.stringify(data ? { data } : { error: "not found" }));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    await run(`http://127.0.0.1:${server.address().port}`);
  } finally {
    server.closeAllConnections?.();
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

async function run(script, env) {
  return exec("node", [script], { cwd: root, env: { ...process.env, ...env }, encoding: "utf8" });
}

test("JSONC supports comments and trailing commas", () => {
  assert.deepEqual(parseJsonConfig(`{/* block */"provider":{"local":{},},// line\n}`), { provider: { local: {} } });
});

test("model limits require both context and output", () => {
  assert.deepEqual(resolveModelLimit({ context_length: 131072, max_output_tokens: 8192 }), { context: 131072, output: 8192 });
  assert.equal(resolveModelLimit({ context_length: 131072 }), undefined);
});

test("model sync migrates tools, prunes stale entries, and preserves metadata", () => {
  const cfg = { provider: { local: { options: { baseURL: "http://old/v1" }, models: {
    chat: { name: "Old", tools: false, custom: true }, stale: { name: "Stale" },
  } } } };
  const result = syncProviderModels({
    cfg, providerKey: "local", baseURL: "http://127.0.0.1:1234/v1",
    models: [{ id: "chat", name: "Chat", function_calling: true, context_length: 32768, max_output_tokens: 4096 }],
    detectedProvider: detectProviderFromUrl("http://127.0.0.1:1234/v1"), displayName: "LM Studio",
  });
  assert.equal(result.removedCount, 1);
  assert.deepEqual(cfg.provider.local.models.chat, {
    name: "Chat", custom: true, tool_call: true, limit: { context: 32768, output: 4096 },
  });
});

test("credentials remain environment references", () => {
  process.env.LOCAL_API_KEY = "super-secret";
  const provider = detectProviderFromUrl("http://127.0.0.1:1234/v1");
  assert.equal(resolveCredentialReference({ detectedProvider: provider, providerConfig: {} }), "{env:LOCAL_API_KEY}");
  delete process.env.LOCAL_API_KEY;
});

test("Tailscale endpoints get readable names", () => {
  assert.equal(getAutoDisplayName("http://100.100.100.100:8000/v1"), "Tailscale · 100.100.100.100:8000");
});

test("launch sync refreshes multiple configured providers securely", async () => {
  const temp = await fs.mkdtemp(path.join(os.tmpdir(), "opencode-sync-"));
  const configPath = path.join(temp, "opencode.json");
  const secret = "never-persist-this";
  try {
    await withServer({
      "/a/models": [{ id: "alpha", name: "Alpha", function_calling: true }],
      "/b/models": [{ id: "beta", name: "Beta", function_calling: false }],
    }, secret, async (origin) => {
      await fs.writeFile(configPath, JSON.stringify({
        $schema: "https://opencode.ai/config.json",
        provider: {
          alpha: { npm: "@ai-sdk/openai-compatible", options: { baseURL: `${origin}/a`, apiKey: "{env:LOCAL_API_KEY}" }, models: {} },
          beta: { npm: "@ai-sdk/openai-compatible", options: { baseURL: `${origin}/b`, headers: { Authorization: `Bearer ${secret}`, "X-Keep": "yes" } }, models: {} },
        },
      }));
      await run("scripts/sync-on-launch.mjs", {
        OPENCODE_CONFIG: configPath, LOCAL_API_KEY: secret, OPENCODE_TAILSCALE_DISCOVERY: "0",
      });
      const raw = await fs.readFile(configPath, "utf8");
      const cfg = JSON.parse(raw);
      assert.equal(raw.includes(secret), false);
      assert.deepEqual(cfg.provider.alpha.models.alpha, { name: "Alpha", tool_call: true });
      assert.deepEqual(cfg.provider.beta.models.beta, { name: "Beta", tool_call: false });
      assert.equal(cfg.provider.beta.options.apiKey, "{env:LOCAL_API_KEY}");
      assert.deepEqual(cfg.provider.beta.options.headers, { "X-Keep": "yes" });
      assert.equal((await fs.stat(configPath)).mode & 0o777, 0o600);
    });
  } finally {
    await fs.rm(temp, { recursive: true, force: true });
  }
});

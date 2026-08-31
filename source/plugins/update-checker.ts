/**
 * update-checker.ts — Auto-update plugin for Modded OpenCode
 *
 * Checks GitHub releases on every session start. If a newer version exists,
 * downloads changed files and applies them in the background. No reinstallation
 * needed — only diff-based updates.
 *
 * Plugin API: { id, setup(ctx) }
 * Events: session.idle (first idle triggers the check)
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { createHash } from "node:crypto";

const REPO = "tealaxdevelopers/modded-opencode";
const GITHUB_API = "https://api.github.com";

function log(...args: unknown[]) {
  console.log("[update-checker]", ...args);
}

function logError(...args: unknown[]) {
  console.error("[update-checker]", ...args);
}

/** Determine kit root directory from this plugin's location. */
function getKitDir(): string {
  // Plugin lives at <kit>/source/plugins/update-checker.ts
  // Kit root is two levels up.
  const pluginUrl = import.meta.url;
  const pluginPath = pluginUrl.startsWith("file://")
    ? pluginUrl.slice(7)
    : pluginUrl;
  // Windows: /C:/Users/... -> C:/Users/...
  const cleaned = process.platform === "win32" ? pluginPath.replace(/^\/([A-Z]:)/, "$1") : pluginPath;
  return join(dirname(cleaned), "..", "..");
}

/** Compare semver strings. Returns true if remote > local. */
function isNewer(remote: string, local: string): boolean {
  const r = remote.split(".").map(Number);
  const l = local.split(".").map(Number);
  for (let i = 0; i < Math.max(r.length, l.length); i++) {
    const a = r[i] || 0;
    const b = l[i] || 0;
    if (a > b) return true;
    if (a < b) return false;
  }
  return false;
}

/** Fetch with timeout and error handling. */
async function apiFetch(url: string, timeoutMs = 15000): Promise<Response | null> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { Accept: "application/vnd.github+json" },
    });
    clearTimeout(timer);
    return res.ok ? res : null;
  } catch {
    return null;
  }
}

/** Read local version from source/VERSION. */
async function readLocalVersion(kitDir: string): Promise<string | null> {
  try {
    return (await readFile(join(kitDir, "source", "VERSION"), "utf-8")).trim();
  } catch {
    return null;
  }
}

/** Read local manifest from source/UPDATE_MANIFEST.json. */
async function readManifest(kitDir: string): Promise<Record<string, { hash: string; blobSha?: string; size: number }>> {
  try {
    const raw = await readFile(join(kitDir, "source", "UPDATE_MANIFEST.json"), "utf-8");
    const m = JSON.parse(raw);
    return m.files || {};
  } catch {
    return {};
  }
}

/** Check for updates and apply if available. */
async function checkForUpdates(): Promise<void> {
  const kitDir = getKitDir();

  // 1. Read local version
  const localVersion = await readLocalVersion(kitDir);
  if (!localVersion) {
    logError("Cannot read local VERSION — skipping update check");
    return;
  }

  // 2. Fetch latest release from GitHub
  const releaseRes = await apiFetch(`${GITHUB_API}/repos/${REPO}/releases/latest`);
  if (!releaseRes) {
    log("Cannot reach GitHub releases — skipping");
    return;
  }
  const release = await releaseRes.json() as { tag_name: string; target_commitish: string };

  const remoteVersion = release.tag_name.replace(/^v/, "").trim();
  if (!remoteVersion) {
    logError("Invalid remote version format");
    return;
  }

  // 3. Compare versions
  if (!isNewer(remoteVersion, localVersion)) {
    log(`Up to date (v${localVersion})`);
    return;
  }

  log(`New version available: v${remoteVersion} (current: v${localVersion})`);

  // 4. Fetch file tree at the release commit
  const commitSha = release.target_commitish;
  const treeRes = await apiFetch(`${GITHUB_API}/repos/${REPO}/git/trees/${commitSha}?recursive=1`);
  if (!treeRes) {
    logError("Cannot fetch file tree — skipping update");
    return;
  }
  const tree = await treeRes.json() as {
    tree: Array<{ path: string; type: string; sha: string }>;
  };

  // 5. Read local manifest
  const manifestFiles = await readManifest(kitDir);

  // 6. Find changed files (only kit-owned paths)
  const kitPrefixes = ["source/", "scripts/", "setup.bat", "setup.sh"];
  const changed: Array<{ path: string; sha: string }> = [];

  for (const item of tree.tree) {
    if (item.type !== "blob") continue;
    const isKitFile = kitPrefixes.some(
      (p) => item.path === p || item.path.startsWith(p)
    );
    if (!isKitFile) continue;

    const local = manifestFiles[item.path];
    if (!local || local.blobSha !== item.sha) {
      changed.push({ path: item.path, sha: item.sha });
    }
  }

  if (changed.length === 0) {
    log("No changed files detected — updating VERSION only");
    await writeFile(join(kitDir, "source", "VERSION"), remoteVersion + "\n");
    log(`Updated to v${remoteVersion}`);
    return;
  }

  log(`Downloading ${changed.length} changed files...`);

  // 7. Download and apply changed files
  let applied = 0;
  let failed = 0;

  for (const { path, sha } of changed) {
    try {
      const contentRes = await apiFetch(
        `${GITHUB_API}/repos/${REPO}/contents/${path}?ref=${commitSha}`
      );
      if (!contentRes) {
        failed++;
        continue;
      }
      const contentData = await contentRes.json() as { content: string };
      const content = Buffer.from(contentData.content, "base64").toString("utf-8");

      const fullPath = join(kitDir, path);
      await mkdir(dirname(fullPath), { recursive: true });
      await writeFile(fullPath, content);

      // Update manifest entry
      const hash = createHash("sha256").update(content).digest("hex");
      manifestFiles[path] = { hash, blobSha: sha, size: content.length };

      applied++;
    } catch (e) {
      logError(`Failed to update ${path}:`, (e as Error).message);
      failed++;
    }
  }

  // 8. Write updated manifest
  const manifest = {
    version: remoteVersion,
    generated: new Date().toISOString(),
    fileCount: Object.keys(manifestFiles).length,
    files: manifestFiles,
  };
  await writeFile(
    join(kitDir, "source", "UPDATE_MANIFEST.json"),
    JSON.stringify(manifest, null, 2) + "\n"
  );

  // 9. Update VERSION
  await writeFile(join(kitDir, "source", "VERSION"), remoteVersion + "\n");

  log(`Updated to v${remoteVersion} — ${applied} files applied, ${failed} failed`);
}

// ─── Plugin Export ───────────────────────────────────────────────────────────

export default {
  id: "update-checker",
  setup: (ctx: { subscribe: (event: string, cb: () => void | Promise<void>) => void }) => {
    let checked = false;

    ctx.subscribe("session.idle", async () => {
      if (checked) return;
      checked = true;

      try {
        await checkForUpdates();
      } catch (e) {
        logError("Update check failed:", (e as Error).message);
      }
    });
  },
};

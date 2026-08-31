/**
 * update-checker.ts — Auto-update plugin for Modded OpenCode
 *
 * Two-layer update strategy:
 *   1. Release check: compare VERSION against latest GitHub release tag.
 *   2. HEAD check: compare file blob SHAs against latest commit on main.
 * This catches unreleased changes pushed to main between releases.
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
  const pluginUrl = import.meta.url;
  const pluginPath = pluginUrl.startsWith("file://")
    ? pluginUrl.slice(7)
    : pluginUrl;
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

const KIT_PREFIXES = ["source/", "scripts/", "setup.bat", "setup.sh"];

/** Filter tree items to kit-owned files only. */
function filterKitFiles(tree: Array<{ path: string; type: string; sha: string }>) {
  return tree.filter((item) => {
    if (item.type !== "blob") return false;
    return KIT_PREFIXES.some((p) => item.path === p || item.path.startsWith(p));
  });
}

/** Compare tree against local manifest, return changed files. */
function findChanged(
  tree: Array<{ path: string; type: string; sha: string }>,
  manifest: Record<string, { hash: string; blobSha?: string; size: number }>
): Array<{ path: string; sha: string }> {
  const changed: Array<{ path: string; sha: string }> = [];
  for (const item of filterKitFiles(tree)) {
    const local = manifest[item.path];
    if (!local || local.blobSha !== item.sha) {
      changed.push({ path: item.path, sha: item.sha });
    }
  }
  return changed;
}

/** Download and apply a single file. Returns true on success. */
async function applyFile(
  path: string,
  sha: string,
  ref: string,
  manifest: Record<string, { hash: string; blobSha?: string; size: number }>,
  kitDir: string
): Promise<boolean> {
  try {
    const res = await apiFetch(`${GITHUB_API}/repos/${REPO}/contents/${path}?ref=${ref}`);
    if (!res) return false;
    const data = await res.json() as { content: string };
    const content = Buffer.from(data.content, "base64").toString("utf-8");

    const fullPath = join(kitDir, path);
    await mkdir(dirname(fullPath), { recursive: true });
    await writeFile(fullPath, content);

    const hash = createHash("sha256").update(content).digest("hex");
    manifest[path] = { hash, blobSha: sha, size: content.length };
    return true;
  } catch (e) {
    logError(`Failed to apply ${path}:`, (e as Error).message);
    return false;
  }
}

/** Write manifest and VERSION back to disk. */
async function saveManifest(
  kitDir: string,
  manifest: Record<string, { hash: string; blobSha?: string; size: number }>,
  version: string
): Promise<void> {
  const manifestObj = {
    version,
    generated: new Date().toISOString(),
    fileCount: Object.keys(manifest).length,
    files: manifest,
  };
  await writeFile(
    join(kitDir, "source", "UPDATE_MANIFEST.json"),
    JSON.stringify(manifestObj, null, 2) + "\n"
  );
  await writeFile(join(kitDir, "source", "VERSION"), version + "\n");
}

// ─── Main Check Logic ───────────────────────────────────────────────────────

async function checkForUpdates(): Promise<void> {
  const kitDir = getKitDir();

  const localVersion = await readLocalVersion(kitDir);
  if (!localVersion) {
    logError("Cannot read local VERSION — skipping");
    return;
  }

  const manifestFiles = await readManifest(kitDir);

  // ── Layer 1: Release check ────────────────────────────────────────────────

  let releaseTag: string | null = null;
  let releaseSha: string | null = null;

  const releaseRes = await apiFetch(`${GITHUB_API}/repos/${REPO}/releases/latest`);
  if (releaseRes) {
    const release = await releaseRes.json() as { tag_name: string; target_commitish: string };
    releaseTag = release.tag_name.replace(/^v/, "").trim();
    releaseSha = release.target_commitish;
  }

  if (releaseTag && isNewer(releaseTag, localVersion)) {
    log(`New release: v${releaseTag} (current: v${localVersion})`);

    const treeRes = await apiFetch(`${GITHUB_API}/repos/${REPO}/git/trees/${releaseSha}?recursive=1`);
    if (treeRes) {
      const { tree } = await treeRes.json() as { tree: Array<{ path: string; type: string; sha: string }> };
      const changed = findChanged(tree, manifestFiles);

      if (changed.length === 0) {
        log("No file changes in release — VERSION only");
        await saveManifest(kitDir, manifestFiles, releaseTag);
        log(`Updated to v${releaseTag}`);
        return;
      }

      log(`Downloading ${changed.length} files from release...`);
      let applied = 0;
      for (const { path, sha } of changed) {
        if (await applyFile(path, sha, releaseSha, manifestFiles, kitDir)) applied++;
      }
      await saveManifest(kitDir, manifestFiles, releaseTag);
      log(`Release v${releaseTag} applied — ${applied}/${changed.length} files`);
      return;
    }
  }

  // ── Layer 2: HEAD commit check (unreleased changes on main) ──────────────

  // Get latest commit SHA on main
  const headRes = await apiFetch(`${GITHUB_API}/repos/${REPO}/commits/main`);
  if (!headRes) {
    log("Cannot reach GitHub HEAD — skipping");
    return;
  }
  const headData = await headRes.json() as { sha: string; commit: { message: string } };
  const headSha = headData.sha;
  const shortSha = headSha.slice(0, 7);

  // Check if we already applied this commit (store HEAD sha in manifest)
  const lastAppliedSha = (manifestFiles as Record<string, unknown>)["__HEAD_SHA__"] as string | undefined;
  if (lastAppliedSha === headSha) {
    log(`Already up to date (HEAD ${shortSha})`);
    return;
  }

  // Get file tree at HEAD
  const headTreeRes = await apiFetch(`${GITHUB_API}/repos/${REPO}/git/trees/${headSha}?recursive=1`);
  if (!headTreeRes) {
    log("Cannot fetch HEAD tree — skipping");
    return;
  }
  const { tree } = await headTreeRes.json() as { tree: Array<{ path: string; type: string; sha: string }> };
  const changed = findChanged(tree, manifestFiles);

  if (changed.length === 0) {
    log(`No changes on main (HEAD ${shortSha}) — recording SHA`);
    (manifestFiles as Record<string, unknown>)["__HEAD_SHA__"] = headSha;
    await writeFile(
      join(kitDir, "source", "UPDATE_MANIFEST.json"),
      JSON.stringify({ version: localVersion, generated: new Date().toISOString(), fileCount: Object.keys(manifestFiles).length, files: manifestFiles }, null, 2) + "\n"
    );
    return;
  }

  log(`Found ${changed.length} changed files on main (HEAD ${shortSha})`);
  let applied = 0;
  for (const { path, sha } of changed) {
    if (await applyFile(path, sha, headSha, manifestFiles, kitDir)) applied++;
  }

  // Record HEAD SHA so we don't re-download next time
  (manifestFiles as Record<string, unknown>)["__HEAD_SHA__"] = headSha;
  await writeFile(
    join(kitDir, "source", "UPDATE_MANIFEST.json"),
    JSON.stringify({ version: localVersion, generated: new Date().toISOString(), fileCount: Object.keys(manifestFiles).length, files: manifestFiles }, null, 2) + "\n"
  );

  log(`Applied ${applied}/${changed.length} unreleased files from HEAD ${shortSha}`);
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

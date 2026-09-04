#!/usr/bin/env node
/**
 * generate-manifest.mjs — Generate UPDATE_MANIFEST.json with SHA-256 hashes
 * for all kit files. Used by the auto-update system to detect changed files.
 *
 * Usage: node scripts/generate-manifest.mjs
 * Output: source/UPDATE_MANIFEST.json
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { createHash } from "node:crypto";

const ROOT = join(import.meta.dirname, "..");
const OUTPUT = join(ROOT, "source", "UPDATE_MANIFEST.json");
const VERSION_FILE = join(ROOT, "source", "VERSION");

// Directories to include
const INCLUDE_DIRS = ["source", "scripts"];

// Files/patterns to exclude
const EXCLUDE = [
  "node_modules",
  ".git",
  "UPDATE_MANIFEST.json",
  "*.log",
  ".DS_Store",
  "Thumbs.db",
];

async function walk(dir, base) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const full = join(dir, entry.name);
    const rel = relative(base, full);

    // Skip excluded
    if (EXCLUDE.some((ex) => entry.name === ex || rel.includes(ex))) continue;

    if (entry.isDirectory()) {
      files.push(...(await walk(full, base)));
    } else if (entry.isFile()) {
      const content = await readFile(full);
      const hash = createHash("sha256").update(content).digest("hex");
      files.push({
        path: rel.replace(/\\/g, "/"),
        hash,
        size: content.length,
      });
    }
  }
  return files;
}

async function main() {
  const version = (await readFile(VERSION_FILE, "utf-8")).trim();
  console.log(`Generating manifest for v${version}...`);

  const allFiles = [];
  for (const dir of INCLUDE_DIRS) {
    const dirPath = join(ROOT, dir);
    try {
      allFiles.push(...(await walk(dirPath, ROOT)));
    } catch (e) {
      if (e.code !== "ENOENT") console.error(`Error scanning ${dir}: ${e.message}`);
    }
  }

  // Also include root files
  for (const name of ["setup.bat", "setup.sh"]) {
    try {
      const content = await readFile(join(ROOT, name));
      const hash = createHash("sha256").update(content).digest("hex");
      allFiles.push({ path: name, hash, size: content.length });
    } catch {}
  }

  const manifest = {
    version,
    generated: new Date().toISOString(),
    fileCount: allFiles.length,
    files: {},
  };

  for (const f of allFiles) {
    manifest.files[f.path] = { hash: f.hash, size: f.size };
  }

  await writeFile(OUTPUT, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`Written ${allFiles.length} files to ${OUTPUT}`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});

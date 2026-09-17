import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_DIR = path.join(__dirname, "..", "source");

// ── Helpers ──────────────────────────────────────────────────────────────────

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readFrontmatter(filePath) {
  const content = await fs.readFile(filePath, "utf-8").then((c) => c.replace(/\r\n/g, "\n"));
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { raw: "", fields: {} };
  const raw = match[1];
  const fields = {};
  for (const line of raw.split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();
    // Strip quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    fields[key] = value;
  }
  return { raw, fields };
}

async function listDir(dir, pattern) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries
      .filter((e) => e.isFile() && e.name.endsWith(pattern))
      .map((e) => e.name);
  } catch {
    return [];
  }
}

async function listSubdirs(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    return [];
  }
}

// ── Agent Smoke Tests ────────────────────────────────────────────────────────

const AGENTS_DIR = path.join(SOURCE_DIR, "agents");

test("agents: directory exists", async () => {
  assert.ok(await exists(AGENTS_DIR), "source/agents/ directory must exist");
});

test("agents: exactly 13 agent files", async () => {
  const files = await listDir(AGENTS_DIR, ".md");
  assert.equal(files.length, 13, `Expected 13 agent files, found ${files.length}: ${files.join(", ")}`);
});

const EXPECTED_AGENTS = [
  "codebase.md",
  "orchestrator.md",
  "planner.md",
  "review.md",
  "docs.md",
  "ivan.md",
  "jester.md",
  "oscar.md",
  "scout.md",
  "blogger.md",
  "brutal-critic.md",
  "em-advisor.md",
  "legal-advisor.md",
];

test("agents: all expected agents present", async () => {
  const files = await listDir(AGENTS_DIR, ".md");
  for (const expected of EXPECTED_AGENTS) {
    assert.ok(files.includes(expected), `Missing agent: ${expected}`);
  }
});

test("agents: all have valid YAML frontmatter with description", async () => {
  const files = await listDir(AGENTS_DIR, ".md");
  for (const file of files) {
    const { fields } = await readFrontmatter(path.join(AGENTS_DIR, file));
    assert.ok(fields.description, `${file}: missing 'description' in frontmatter`);
    assert.ok(fields.description.length > 0, `${file}: 'description' is empty`);
  }
});

test("agents: all have description in frontmatter", async () => {
  const files = await listDir(AGENTS_DIR, ".md");
  for (const file of files) {
    const { fields } = await readFrontmatter(path.join(AGENTS_DIR, file));
    assert.ok(fields.description, `${file}: missing 'description' in frontmatter`);
  }
});

test("agents: mode field is valid when present", async () => {
  const validModes = ["primary", "subagent", "all"];
  const files = await listDir(AGENTS_DIR, ".md");
  for (const file of files) {
    const { fields } = await readFrontmatter(path.join(AGENTS_DIR, file));
    if (fields.mode) {
      assert.ok(
        validModes.includes(fields.mode),
        `${file}: invalid mode '${fields.mode}' — expected one of: ${validModes.join(", ")}`
      );
    }
  }
});

test("agents: no agent file is empty", async () => {
  const files = await listDir(AGENTS_DIR, ".md");
  for (const file of files) {
    const content = await fs.readFile(path.join(AGENTS_DIR, file), "utf-8");
    assert.ok(content.length > 50, `${file}: file too small (${content.length} bytes) — likely incomplete`);
  }
});

// ── Skill Smoke Tests ────────────────────────────────────────────────────────

const SKILLS_DIR = path.join(SOURCE_DIR, "skills");

test("skills: directory exists", async () => {
  assert.ok(await exists(SKILLS_DIR), "source/skills/ directory must exist");
});

test("skills: exactly 105 skill directories", async () => {
  const dirs = await listSubdirs(SKILLS_DIR);
  assert.equal(dirs.length, 105, `Expected 105 skill dirs, found ${dirs.length}`);
});

test("skills: every directory contains SKILL.md", async () => {
  const dirs = await listSubdirs(SKILLS_DIR);
  const missing = [];
  for (const dir of dirs) {
    const skillFile = path.join(SKILLS_DIR, dir, "SKILL.md");
    if (!(await exists(skillFile))) {
      missing.push(dir);
    }
  }
  assert.deepEqual(missing, [], `Skills missing SKILL.md: ${missing.join(", ")}`);
});

test("skills: all SKILL.md files have valid frontmatter", async () => {
  const dirs = await listSubdirs(SKILLS_DIR);
  const errors = [];
  for (const dir of dirs) {
    const skillFile = path.join(SKILLS_DIR, dir, "SKILL.md");
    try {
      const { fields } = await readFrontmatter(skillFile);
      if (!fields.name) errors.push(`${dir}: missing 'name'`);
      if (!fields.description) errors.push(`${dir}: missing 'description'`);
    } catch (e) {
      errors.push(`${dir}: ${e.message}`);
    }
  }
  assert.deepEqual(errors, [], `Frontmatter errors:\n${errors.join("\n")}`);
});

test("skills: all SKILL.md files have content beyond frontmatter", async () => {
  const dirs = await listSubdirs(SKILLS_DIR);
  const empty = [];
  for (const dir of dirs) {
    const content = await fs.readFile(path.join(SKILLS_DIR, dir, "SKILL.md"), "utf-8");
    const afterFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n?/, "").trim();
    if (afterFrontmatter.length < 20) {
      empty.push(dir);
    }
  }
  assert.deepEqual(empty, [], `Skills with no meaningful content: ${empty.join(", ")}`);
});

test("skills: no duplicate skill names", async () => {
  const dirs = await listSubdirs(SKILLS_DIR);
  const names = [];
  for (const dir of dirs) {
    const { fields } = await readFrontmatter(path.join(SKILLS_DIR, dir, "SKILL.md"));
    if (fields.name) names.push(fields.name);
  }
  const dupes = names.filter((name, i) => names.indexOf(name) !== i);
  assert.deepEqual(dupes, [], `Duplicate skill names: ${[...new Set(dupes)].join(", ")}`);
});

// ── Command Smoke Tests ──────────────────────────────────────────────────────

const COMMANDS_DIR = path.join(SOURCE_DIR, "commands");

test("commands: directory exists", async () => {
  assert.ok(await exists(COMMANDS_DIR), "source/commands/ directory must exist");
});

test("commands: exactly 19 command files", async () => {
  const files = await listDir(COMMANDS_DIR, ".md");
  assert.equal(files.length, 19, `Expected 19 command files, found ${files.length}: ${files.join(", ")}`);
});

test("commands: all have valid frontmatter with description", async () => {
  const files = await listDir(COMMANDS_DIR, ".md");
  const errors = [];
  for (const file of files) {
    if (file === "README.md") continue; // Directory docs, not a command
    const { fields } = await readFrontmatter(path.join(COMMANDS_DIR, file));
    if (!fields.description) errors.push(`${file}: missing 'description'`);
  }
  assert.deepEqual(errors, [], `Command frontmatter errors:\n${errors.join("\n")}`);
});

test("commands: all have content beyond frontmatter", async () => {
  const files = await listDir(COMMANDS_DIR, ".md");
  const empty = [];
  for (const file of files) {
    const content = await fs.readFile(path.join(COMMANDS_DIR, file), "utf-8");
    const afterFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n?/, "").trim();
    if (afterFrontmatter.length < 20) {
      empty.push(file);
    }
  }
  assert.deepEqual(empty, [], `Commands with no content: ${empty.join(", ")}`);
});

// ── Instruction Smoke Tests ──────────────────────────────────────────────────

const INSTRUCTIONS_DIR = path.join(SOURCE_DIR, "instructions");

test("instructions: directory exists", async () => {
  assert.ok(await exists(INSTRUCTIONS_DIR), "source/instructions/ directory must exist");
});

test("instructions: exactly 24 instruction files", async () => {
  const files = await listDir(INSTRUCTIONS_DIR, ".md");
  assert.equal(files.length, 24, `Expected 24 instruction files, found ${files.length}: ${files.join(", ")}`);
});

test("instructions: all files have content", async () => {
  const files = await listDir(INSTRUCTIONS_DIR, ".md");
  const empty = [];
  for (const file of files) {
    const content = await fs.readFile(path.join(INSTRUCTIONS_DIR, file), "utf-8");
    if (content.trim().length < 20) {
      empty.push(file);
    }
  }
  assert.deepEqual(empty, [], `Empty instruction files: ${empty.join(", ")}`);
});

// ── Plugin Smoke Tests ───────────────────────────────────────────────────────

const PLUGINS_DIR = path.join(SOURCE_DIR, "plugins");

test("plugins: directory exists", async () => {
  assert.ok(await exists(PLUGINS_DIR), "source/plugins/ directory must exist");
});

test("plugins: exactly 3 plugin files", async () => {
  const files = await listDir(PLUGINS_DIR, ".ts");
  assert.equal(files.length, 3, `Expected 3 plugin files, found ${files.length}: ${files.join(", ")}`);
});

test("plugins: all have valid TypeScript syntax (basic check)", async () => {
  const files = await listDir(PLUGINS_DIR, ".ts");
  const errors = [];
  for (const file of files) {
    const content = await fs.readFile(path.join(PLUGINS_DIR, file), "utf-8");
    // Check for export statement
    if (!content.includes("export")) errors.push(`${file}: no export statement`);
    // Check for import statement
    if (!content.includes("import")) errors.push(`${file}: no import statement`);
    // Check for Plugin type usage
    if (!content.includes("Plugin")) errors.push(`${file}: no Plugin type reference`);
  }
  assert.deepEqual(errors, [], `Plugin syntax errors:\n${errors.join("\n")}`);
});

test("plugins: all have PACKAGE_VERSION constant", async () => {
  const files = await listDir(PLUGINS_DIR, ".ts");
  for (const file of files) {
    const content = await fs.readFile(path.join(PLUGINS_DIR, file), "utf-8");
    assert.ok(
      content.includes("PACKAGE_VERSION"),
      `${file}: missing PACKAGE_VERSION constant`
    );
  }
});

// ── Package Smoke Tests ──────────────────────────────────────────────────────

const PACKAGES_DIR = path.join(__dirname, "..", "packages");

test("packages: all 7 packages have package.json", async () => {
  const expectedPackages = [
    "agents-opencode",
    "opencode-continue",
    "openai-system-merge",
    "update-checker",
    "opencode-notify",
    "opencode-session-title",
    "opencode-env-guard",
  ];
  for (const pkg of expectedPackages) {
    const pkgPath = path.join(PACKAGES_DIR, pkg, "package.json");
    assert.ok(await exists(pkgPath), `Missing package.json for ${pkg}`);
  }
});

test("packages: all have index.ts entry point", async () => {
  const dirs = await listSubdirs(PACKAGES_DIR);
  for (const dir of dirs) {
    const indexPath = path.join(PACKAGES_DIR, dir, "index.ts");
    assert.ok(await exists(indexPath), `${dir}: missing index.ts`);
  }
});

test("packages: all package.json have type: module", async () => {
  const dirs = await listSubdirs(PACKAGES_DIR);
  const errors = [];
  for (const dir of dirs) {
    let raw = await fs.readFile(path.join(PACKAGES_DIR, dir, "package.json"), "utf-8");
    if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1); // strip BOM
    const pkg = JSON.parse(raw);
    if (pkg.type !== "module") errors.push(`${dir}: type is '${pkg.type}' instead of 'module'`);
  }
  assert.deepEqual(errors, [], `Package type errors:\n${errors.join("\n")}`);
});

test("packages: all package.json have matching name prefix", async () => {
  const dirs = await listSubdirs(PACKAGES_DIR);
  for (const dir of dirs) {
    let raw = await fs.readFile(path.join(PACKAGES_DIR, dir, "package.json"), "utf-8");
    if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
    const pkg = JSON.parse(raw);
    assert.ok(
      pkg.name.startsWith("modded-opencode-"),
      `${dir}: name '${pkg.name}' doesn't start with 'modded-opencode-'`
    );
  }
});

test("packages: all package.json have version 1.1.7-hotfix", async () => {
  const dirs = await listSubdirs(PACKAGES_DIR);
  for (const dir of dirs) {
    let raw = await fs.readFile(path.join(PACKAGES_DIR, dir, "package.json"), "utf-8");
    if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
    const pkg = JSON.parse(raw);
    assert.equal(pkg.version, "1.1.7-hotfix", `${dir}: version is '${pkg.version}'`);
  }
});

// ── Source File Integrity ────────────────────────────────────────────────────

test("source: VERSION file exists and has content", async () => {
  const versionPath = path.join(SOURCE_DIR, "VERSION");
  assert.ok(await exists(versionPath), "source/VERSION must exist");
  const version = (await fs.readFile(versionPath, "utf-8")).trim();
  assert.ok(version.length > 0, "VERSION file is empty");
  assert.match(version, /^\d+\.\d+\.\d+/, `VERSION '${version}' doesn't look like semver`);
});

test("source: rules.md template exists", async () => {
  const rulesPath = path.join(SOURCE_DIR, "rules.md");
  assert.ok(await exists(rulesPath), "source/rules.md must exist");
  const content = await fs.readFile(rulesPath, "utf-8");
  assert.ok(content.includes("{{LANGUAGE}}"), "rules.md missing {{LANGUAGE}} placeholder");
  assert.ok(content.includes("{{HITAP}}"), "rules.md missing {{HITAP}} placeholder");
});

test("source: opencode.jsonc template exists", async () => {
  const cfgPath = path.join(SOURCE_DIR, "opencode.jsonc");
  assert.ok(await exists(cfgPath), "source/opencode.jsonc must exist");
  const content = await fs.readFile(cfgPath, "utf-8");
  assert.ok(content.includes("{{TARGET_DIR}}"), "opencode.jsonc missing {{TARGET_DIR}} placeholder");
});

test("source: agents-opencode-manifest.json exists", async () => {
  const manifestPath = path.join(SOURCE_DIR, ".agents-opencode-manifest.json");
  assert.ok(await exists(manifestPath), "source/.agents-opencode-manifest.json must exist");
  const content = JSON.parse(await fs.readFile(manifestPath, "utf-8"));
  assert.ok(content.schemaVersion || content.files || content.managedFiles, "manifest has no schemaVersion, files, or managedFiles field");
  assert.ok(content.managedFiles && content.managedFiles.length > 0, "manifest managedFiles is empty");
});

test("source: rate-limit-fallback.json is valid JSON", async () => {
  const rlPath = path.join(SOURCE_DIR, "configs", "rate-limit-fallback.json");
  assert.ok(await exists(rlPath), "source/configs/rate-limit-fallback.json must exist");
  const content = JSON.parse(await fs.readFile(rlPath, "utf-8"));
  assert.ok(typeof content === "object", "rate-limit-fallback.json is not an object");
});

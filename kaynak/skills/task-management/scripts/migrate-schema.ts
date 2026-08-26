#!/usr/bin/env npx ts-node
/**
 * Schema migration for .tmp/tasks/
 */
import * as fs from "node:fs";
import * as path from "node:path";

function argvAfterScript(): string[] {
  const i = process.argv.findIndex((a) => /migrate-schema\.ts$/.test(a));
  if (i >= 0) return process.argv.slice(i + 1);
  return process.argv.slice(2);
}

function featureDir(slug: string): string {
  return path.join(process.cwd(), ".tmp/tasks", slug);
}

function readJson(fp: string): unknown {
  return JSON.parse(fs.readFileSync(fp, "utf8"));
}

function writeJson(fp: string, data: unknown): void {
  fs.writeFileSync(fp, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function main(): void {
  const args = argvAfterScript();
  if (args[0] !== "migrate" || !args[1] || args[1].startsWith("-")) {
    console.error("Usage: router.sh migrate <feature> [--dry-run] [--lines-only]");
    process.exit(1);
  }

  const slug = args[1];
  const dryRun = args.includes("--dry-run");
  const linesOnly = args.includes("--lines-only");

  const dir = featureDir(slug);
  if (!fs.existsSync(dir)) {
    console.error(`Feature folder not found: ${dir}`);
    process.exit(1);
  }

  const taskPath = path.join(dir, "task.json");
  if (!fs.existsSync(taskPath)) {
    console.error(`Missing ${taskPath}`);
    process.exit(1);
  }

  const subs = fs.readdirSync(dir).filter((n) => /^subtask_\d+\.json$/.test(n)).sort();

  console.log(`\n=== Migrate: ${slug} ===`);
  console.log(`${dryRun ? "[dry-run]" : "[apply]"} files=${subs.length}\n`);

  if (dryRun) {
    console.log("\nNo writes (--dry-run).\n");
    return;
  }

  const taskPrev = readJson(taskPath) as Record<string, unknown>;
  const taskNext = { ...taskPrev, _schema_version: 2 };
  writeJson(taskPath, taskNext);

  if (linesOnly) {
    for (const n of subs) {
      const fp = path.join(dir, n);
      const st = { ...(readJson(fp) as Record<string, unknown>) };
      if (!st.line_range || typeof st.line_range !== "object") st.line_range = {};
      writeJson(fp, st);
    }
  }

  console.log("Migration applied.\n");
}

main();

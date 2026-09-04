#!/usr/bin/env npx ts-node
/**
 * Task management CLI - reads/writes .tmp/tasks/{feature}/ per skill spec.
 */
import * as fs from "node:fs";
import * as path from "node:path";

const TASKS_DIR = ".tmp/tasks";
const STATUSES = new Set(["pending", "in_progress", "completed", "blocked"]);

type TaskJson = {
  id: string;
  name?: string;
  status?: string;
  objective?: string;
  context_files?: string[];
  reference_files?: string[];
  exit_criteria?: string[];
  subtask_count?: number;
  completed_count?: number;
  created_at?: string;
  completed_at?: string | null;
  contracts?: unknown[];
  _schema_version?: number;
};

type SubtaskJson = {
  id: string;
  seq: string;
  title?: string;
  status: string;
  depends_on?: string[];
  parallel?: boolean;
  suggested_agent?: string;
  context_files?: string[];
  reference_files?: string[];
  acceptance_criteria?: string[];
  deliverables?: string[];
  started_at?: string | null;
  completed_at?: string | null;
  completion_summary?: string | null;
  line_range?: Record<string, { start?: number; end?: number }>;
};

function argvAfterScript(): string[] {
  const i = process.argv.findIndex((a) => /task-cli\.ts$/.test(a));
  if (i >= 0) return process.argv.slice(i + 1);
  return process.argv.slice(2);
}

function tasksRoot(): string {
  return path.join(process.cwd(), TASKS_DIR);
}

function featureDir(slug: string): string {
  return path.join(tasksRoot(), slug);
}

function readJson<T>(fp: string): T {
  return JSON.parse(fs.readFileSync(fp, "utf8")) as T;
}

function writeJson(fp: string, data: unknown): void {
  fs.writeFileSync(fp, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function listFeatureSlugs(activeOnly = false): string[] {
  const root = tasksRoot();
  if (!fs.existsSync(root)) return [];
  const dirs = fs
    .readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== "completed")
    .map((d) => d.name);
  if (!activeOnly) return dirs.sort();
  return dirs.filter((slug) => {
    const t = path.join(root, slug, "task.json");
    if (!fs.existsSync(t)) return false;
    try {
      const j = readJson<TaskJson>(t);
      return (j.status ?? "active") !== "completed";
    } catch {
      return false;
    }
  }).sort();
}

function listSubtaskFiles(slug: string): string[] {
  const dir = featureDir(slug);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((n) => /^subtask_\d+\.json$/.test(n))
    .sort();
}

function normalizeSeq(seq: string): string {
  const n = seq.replace(/^0+/, "") || "0";
  return n.padStart(2, "0");
}

function loadSubtasks(slug: string): Map<string, SubtaskJson> {
  const map = new Map<string, SubtaskJson>();
  for (const file of listSubtaskFiles(slug)) {
    const fp = path.join(featureDir(slug), file);
    const st = readJson<SubtaskJson>(fp);
    map.set(normalizeSeq(st.seq), st);
  }
  return map;
}

function depsSatisfied(st: SubtaskJson, bySeq: Map<string, SubtaskJson>): boolean {
  const deps = st.depends_on ?? [];
  for (const raw of deps) {
    const s = normalizeSeq(String(raw));
    const d = bySeq.get(s);
    if (!d || d.status !== "completed") return false;
  }
  return true;
}

function printTaskHeader(task: TaskJson, slug: string, bySeq: Map<string, SubtaskJson>): void {
  const total = bySeq.size;
  let done = 0, pending = 0, inp = 0, blocked = 0;
  for (const st of bySeq.values()) {
    if (st.status === "completed") done++;
    else if (st.status === "blocked") blocked++;
    else if (st.status === "in_progress") inp++;
    else pending++;
  }
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const name = task.name ?? slug;
  console.log(`\n[${slug}] ${name}`);
  console.log(`  Status: ${task.status ?? "active"} | Progress: ${pct}% (${done}/${total})`);
  console.log(`  Pending: ${pending} | In Progress: ${inp} | Completed: ${done} | Blocked: ${blocked}`);
}

function cmdStatus(args: string[]): void {
  const filter = args[0];
  const slugs = filter
    ? listFeatureSlugs(false).filter((s) => s === filter)
    : listFeatureSlugs(false);
  if (slugs.length === 0) {
    console.log("No tasks found under .tmp/tasks/");
    return;
  }
  for (const slug of slugs) {
    const tf = path.join(featureDir(slug), "task.json");
    if (!fs.existsSync(tf)) {
      console.log(`\n[${slug}] (missing task.json)`);
      continue;
    }
    const task = readJson<TaskJson>(tf);
    const bySeq = loadSubtasks(slug);
    printTaskHeader(task, slug, bySeq);
  }
}

function cmdNext(args: string[]): void {
  const filter = args[0];
  const slugs = filter
    ? listFeatureSlugs(true).filter((s) => s === filter)
    : listFeatureSlugs(true);

  console.log("\n=== Ready Tasks (deps satisfied) ===\n");
  let any = false;
  for (const slug of slugs) {
    const bySeq = loadSubtasks(slug);
    const ready: SubtaskJson[] = [];
    for (const st of bySeq.values()) {
      if (st.status === "blocked") continue;
      if (st.status !== "pending" && st.status !== "in_progress") continue;
      if (!depsSatisfied(st, bySeq)) continue;
      ready.push(st);
    }
    if (ready.length === 0) continue;
    any = true;
    console.log(`[${slug}]`);
    for (const st of ready.sort((a, b) => a.seq.localeCompare(b.seq))) {
      const par = st.parallel ? "parallel" : "sequential";
      console.log(`  ${st.seq} - ${st.title ?? st.id} [${par}]`);
    }
    console.log("");
  }
  if (!any) console.log("(none)\n");
}

function cmdBlocked(args: string[]): void {
  const filter = args[0];
  const slugs = filter
    ? listFeatureSlugs(false).filter((s) => s === filter)
    : listFeatureSlugs(false);

  console.log("\n=== Blocked or waiting on deps ===\n");
  for (const slug of slugs) {
    const bySeq = loadSubtasks(slug);
    const blocked: SubtaskJson[] = [];
    const waiting: SubtaskJson[] = [];
    for (const st of bySeq.values()) {
      if (st.status === "blocked") blocked.push(st);
      else if (st.status === "pending" || st.status === "in_progress") {
        if (!depsSatisfied(st, bySeq)) waiting.push(st);
      }
    }
    if (blocked.length === 0 && waiting.length === 0) continue;
    console.log(`[${slug}]`);
    for (const st of blocked) {
      console.log(`  blocked  ${st.seq} - ${st.title ?? st.id}`);
    }
    for (const st of waiting.sort((a, b) => a.seq.localeCompare(b.seq))) {
      const missing = (st.depends_on ?? [])
        .map((x) => normalizeSeq(String(x)))
        .filter((ds) => {
          const n = bySeq.get(ds);
          return !n || n.status !== "completed";
        });
      console.log(`  waiting  ${st.seq} - ${st.title ?? st.id} (needs done: ${missing.join(", ") || "-"})`);
    }
    console.log("");
  }
}

function cmdComplete(args: string[]): void {
  const feat = args[0];
  const rawSeq = args[1];
  const summary = args.slice(2).join(" ").trim();
  if (!feat || !rawSeq) {
    console.error('Usage: complete <feature> <seq> "summary"');
    process.exit(1);
  }
  if (!summary) {
    console.error("Summary required.");
    process.exit(1);
  }

  const seq = normalizeSeq(rawSeq);
  const dir = featureDir(feat);
  const fp = path.join(dir, `subtask_${seq}.json`);
  if (!fs.existsSync(fp)) {
    console.error(`Subtask file not found: ${fp}`);
    process.exit(1);
  }

  const st = readJson<SubtaskJson>(fp);
  st.status = "completed";
  st.completion_summary = summary;
  st.completed_at = new Date().toISOString();
  if (!st.started_at) st.started_at = st.completed_at;
  writeJson(fp, st);

  const bySeq = loadSubtasks(feat);
  let completedCount = 0;
  for (const x of bySeq.values()) if (x.status === "completed") completedCount++;

  const tf = path.join(dir, "task.json");
  if (fs.existsSync(tf)) {
    const task = readJson<TaskJson>(tf);
    task.completed_count = completedCount;
    const total = bySeq.size || task.subtask_count || 0;
    const allDone = total > 0 && [...bySeq.values()].every((x) => x.status === "completed");
    if (allDone) {
      task.status = "completed";
      task.completed_at = new Date().toISOString();
    }
    task.subtask_count = bySeq.size;
    writeJson(tf, task);
  }

  console.log(`\nMarked ${feat}/${seq} as completed`);
  console.log(`  Summary: ${summary}`);
  console.log(`  Progress: ${completedCount}/${bySeq.size}\n`);
}

function cmdValidate(args: string[]): void {
  const filter = args[0];
  const slugs = filter
    ? listFeatureSlugs(false).filter((s) => s === filter)
    : listFeatureSlugs(false);
  if (slugs.length === 0) {
    console.log("No tasks to validate.");
    return;
  }
  console.log("\n=== Validation Results ===\n");
  let failed = false;
  for (const slug of slugs) {
    const errs: string[] = [];
    const bySeq = loadSubtasks(slug);
    for (const [seq, st] of bySeq) {
      if (!STATUSES.has(st.status))
        errs.push(`  subtask ${seq}: invalid status "${st.status}"`);
    }
    if (errs.length === 0) {
      console.log(`[${slug}]  OK`);
    } else {
      failed = true;
      console.log(`[${slug}]  issues:`);
      for (const e of errs) console.log(`    - ${e}`);
    }
  }
  if (failed) process.exit(1);
}

function cmdDeps(args: string[]): void {
  const [feat, rawSeq] = args;
  if (!feat || !rawSeq) {
    console.error("Usage: deps <feature> <seq>");
    process.exit(1);
  }
  const seq = normalizeSeq(rawSeq);
  const bySeq = loadSubtasks(feat);
  const st = bySeq.get(seq);
  if (!st) {
    console.error(`Subtask ${seq} not found in ${feat}`);
    process.exit(1);
  }
  console.log(`\n=== Dependency Tree: ${feat}/${seq} ===\n`);
  console.log(`${seq} - ${st.title ?? st.id} [${st.status}]`);
  for (const d of st.depends_on ?? []) {
    const dn = normalizeSeq(String(d));
    const ds = bySeq.get(dn);
    console.log(`  ${dn} - ${ds?.title ?? "?"} [${ds?.status ?? "?"}]`);
  }
  console.log("");
}

function main(): void {
  const args = argvAfterScript();
  const cmd = args[0];
  const tail = args.slice(1);

  if (!cmd || cmd === "help" || cmd === "-h" || cmd === "--help") {
    console.log(`Commands: status, next, parallel, deps, blocked, complete, validate, context, contracts`);
    process.exit(0);
  }

  switch (cmd) {
    case "status": cmdStatus(tail); break;
    case "next": cmdNext(tail); break;
    case "blocked": cmdBlocked(tail); break;
    case "complete": cmdComplete(tail); break;
    case "validate": cmdValidate(tail); break;
    case "deps": cmdDeps(tail); break;
    default:
      console.error(`Unknown command: ${cmd}`);
      process.exit(1);
  }
}

main();

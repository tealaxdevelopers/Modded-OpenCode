import { execFileSync, spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const scriptsDir = join(root, 'scripts');

let failures = 0;

for (const file of readdirSync(scriptsDir)) {
  const path = join(scriptsDir, file);
  if (file.endsWith('.mjs')) {
    try {
      execFileSync(process.execPath, ['--check', path], { stdio: 'inherit' });
      console.log(`OK  node --check ${file}`);
    } catch {
      failures++;
    }
  }
  if (file.endsWith('.sh')) {
    const bash = spawnSync('bash', ['-n', path], { stdio: 'pipe' });
    if (bash.status === null) {
      console.log(`SKIP  ${file} (bash yok)`);
    } else if (bash.status === 0) {
      console.log(`OK  bash -n ${file}`);
    } else {
      console.error(`FAIL  bash -n ${file}`);
      process.stdout.write(bash.stderr);
      failures++;
    }
  }
}

process.exit(failures ? 1 : 0);

import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const probe = spawnSync('bash', ['-c', 'echo ok'], { stdio: 'pipe' });

if (probe.status === null || probe.error) {
  console.log('SKIP  tests/install.test.sh (bash not available on this platform)');
  process.exit(0);
}

const result = spawnSync('bash', [join(root, 'tests', 'install.test.sh')], {
  stdio: 'inherit',
});
process.exit(result.status ?? 1);

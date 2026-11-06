import { mkdir, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const site = fileURLToPath(new URL('..', import.meta.url));
await mkdir(new URL('../dist/.worker/', import.meta.url), { recursive: true });
await writeFile(new URL('../dist/.assetsignore', import.meta.url), '.worker/\n');
const bundled = spawnSync(process.execPath, ['node_modules/wrangler/bin/wrangler.js', 'deploy', 'worker/index.mjs', '--dry-run', '--outdir', 'dist/.worker'], { cwd: site, stdio: 'inherit', env: { ...process.env, WRANGLER_SEND_METRICS: 'false' } });
if (bundled.status !== 0) process.exit(bundled.status ?? 1);

import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const tsc = createRequire(import.meta.url).resolve('typescript/bin/tsc');

const projects = ['packages', 'apps']
  .map((group) => join(root, group))
  .filter((base) => existsSync(base))
  .flatMap((base) =>
    readdirSync(base, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => join(base, entry.name)),
  )
  .filter((dir) => existsSync(join(dir, 'tsconfig.json')));

let failed = false;
for (const dir of projects) {
  console.log(`typecheck ${dir.slice(root.length + 1)}`);
  const result = spawnSync(process.execPath, [tsc, '--noEmit', '-p', dir], { stdio: 'inherit' });
  if (result.status !== 0) failed = true;
}
console.log(`typechecked ${projects.length} project(s)`);
process.exit(failed ? 1 : 0);

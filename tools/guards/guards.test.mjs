import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { EOL, tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { after, describe, it } from 'node:test';
import { DESIGN_ITEMS, checkChecklist, parseChecklist, parseSpec } from './checklist.mjs';
import { checkIndependence } from './independence.mjs';

const roots = [];
const text = (...rows) => rows.join(EOL) + EOL;

function makeRepo(files) {
  const root = mkdtempSync(join(tmpdir(), 'flowx-guard-'));
  roots.push(root);
  for (const [path, content] of Object.entries(files)) {
    const full = join(root, path);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, typeof content === 'string' ? content : JSON.stringify(content));
  }
  return root;
}

function assertReports(violations, fragment) {
  const shown = violations.join(' | ') || 'none';
  assert.ok(
    violations.some((violation) => violation.includes(fragment)),
    `expected a violation containing '${fragment}', got: ${shown}`,
  );
}

after(() => {
  for (const root of roots) rmSync(root, { recursive: true, force: true });
});

describe('independence guard', () => {
  const clean = {
    'package.json': { name: 'flowx-terminal', devDependencies: { typescript: '6.0.3' } },
    'packages/core/package.json': { name: '@flowx/core' },
    'packages/app/package.json': { name: '@flowx/app', dependencies: { '@flowx/core': 'workspace:*' } },
    'packages/app/src/a.ts': text(`import { x } from './b';`, 'export const y = x;'),
    'packages/app/src/b.ts': text('export const x = 1;'),
    'tsconfig.base.json': { compilerOptions: { strict: true } },
    'packages/app/tsconfig.json': { extends: '../../tsconfig.base.json', include: ['src'] },
  };

  it('accepts a self-contained repository', () => {
    assert.deepEqual(checkIndependence(makeRepo(clean)), []);
  });

  it('rejects file: and link: dependencies', () => {
    const root = makeRepo({
      ...clean,
      'package.json': {
        name: 'flowx-terminal',
        dependencies: { other: 'file:../other-project' },
        devDependencies: { more: 'link:../x' },
      },
    });
    const violations = checkIndependence(root);
    assert.equal(violations.length, 2);
    assertReports(violations, 'other-project');
  });

  it('rejects workspace dependencies on packages that are not in this repository', () => {
    const root = makeRepo({
      ...clean,
      'packages/app/package.json': { name: '@flowx/app', dependencies: { '@flowx/missing': 'workspace:*' } },
    });
    assertReports(checkIndependence(root), '@flowx/missing');
  });

  it('rejects relative imports that leave the repository', () => {
    const root = makeRepo({ ...clean, 'packages/app/src/a.ts': text(`import { z } from '../../../../elsewhere/z';`) });
    assertReports(checkIndependence(root), 'leaves the repository');
  });

  it('rejects tsconfig paths that leave the repository', () => {
    const root = makeRepo({
      ...clean,
      'packages/app/tsconfig.json': { extends: '../../../outside/tsconfig.json', include: ['src'] },
    });
    assertReports(checkIndependence(root), 'resolves outside the repository');
  });
});

describe('feature checklist guard', () => {
  const SPEC = text(
    'MARKETS:',
    '- BTC Futures',
    '',
    'A. FIRST SECTION',
    'Intro line:',
    '- Alpha item.',
    '- Beta item.',
    '',
    'DATA ENGINE REQUIREMENTS:',
    '- Engine one.',
    '',
    'DESIGN:',
    'Create something.',
    '',
    'FINAL REQUIREMENT:',
    'Track every module as:',
    '- Not Started',
    '- Verified',
  );

  const row = (id, item, status = 'Not Started', evidence = '—') => `| ${id} | ${item} | ${status} | ${evidence} |`;
  const table = (rows) => text('# Checklist', '', '| ID | Item | Status | Evidence |', '|---|---|---|---|', ...rows);
  const fixed = [
    ...DESIGN_ITEMS.map((item, i) => row(`DS.0${i + 1}`, item)),
    ...['AP.01', 'AP.02', 'AP.03', 'AP.04', 'AP.05'].map((id) => row(id, 'condition')),
  ];
  const good = [row('A.01', 'Alpha item'), row('A.02', 'Beta item'), row('DE.01', 'Engine one'), ...fixed];
  const repo = (rows) => makeRepo({ 'docs/ATAS_FEATURE_SPEC.md': SPEC, 'docs/FEATURE_CHECKLIST.md': table(rows) });

  it('reads only the intended lists from the spec', () => {
    assert.deepEqual(parseSpec(SPEC), [
      { key: 'A', items: ['Alpha item', 'Beta item'] },
      { key: 'DE', items: ['Engine one'] },
    ]);
  });

  it('reads checklist rows and skips the header and separator', () => {
    const rows = parseChecklist(table([row('A.01', 'Alpha item', 'Tested', 'CI run')]));
    assert.deepEqual(rows, [{ id: 'A.01', item: 'Alpha item', status: 'Tested', evidence: 'CI run' }]);
  });

  it('accepts a checklist that matches the spec', () => {
    assert.deepEqual(checkChecklist(repo(good)), []);
  });

  it('reports text that drifted from the spec', () => {
    const rows = good.map((r) => r.replace('Beta item', 'Beta changed'));
    assertReports(checkChecklist(repo(rows)), 'A.02: text differs');
  });

  it('reports a missing item', () => {
    const rows = good.filter((r) => !r.includes('A.02'));
    assertReports(checkChecklist(repo(rows)), 'A.02: missing');
  });

  it('requires evidence for Tested and Verified', () => {
    const rows = good.map((r) => (r.includes('A.01') ? row('A.01', 'Alpha item', 'Verified') : r));
    assertReports(checkChecklist(repo(rows)), 'A.01: status Verified needs evidence');
  });

  it('rejects an unknown status', () => {
    const rows = good.map((r) => (r.includes('A.01') ? row('A.01', 'Alpha item', 'Done') : r));
    assertReports(checkChecklist(repo(rows)), 'unknown status');
  });
});

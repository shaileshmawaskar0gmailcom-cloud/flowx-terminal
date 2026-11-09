import { resolve } from 'node:path';
import { checkChecklist } from './checklist.mjs';
import { checkIndependence } from './independence.mjs';

const root = resolve(import.meta.dirname, '..', '..');
const checks = [
  ['independence', checkIndependence],
  ['feature checklist', checkChecklist],
];

let failed = false;
for (const [name, check] of checks) {
  const violations = check(root);
  if (violations.length === 0) {
    console.log(`ok   ${name}`);
    continue;
  }
  failed = true;
  console.log(`FAIL ${name}`);
  for (const violation of violations) console.log(`  - ${violation}`);
}
process.exit(failed ? 1 : 0);

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { lines } from './lib.mjs';

export const STATUSES = ['Not Started', 'In Progress', 'Implemented', 'Tested', 'Verified'];
export const DESIGN_ITEMS = [
  'Professional institutional terminal: dark interface, compact controls, customizable panels, high-density market information',
  'Do not sacrifice analytical space for decorative UI',
  'Modules independently resizable and expandable to full screen',
];
const NAMED = new Map([
  ['DATA ENGINE REQUIREMENTS', 'DE'],
  ['ACCURACY REQUIREMENTS', 'AC'],
  ['PERFORMANCE', 'PF'],
]);
const APPROVAL_IDS = ['AP.01', 'AP.02', 'AP.03', 'AP.04', 'AP.05'];
const ID = /^[A-Z]{1,2}[.][0-9]{2}$/;
const HEADING = /^([A-Z][A-Z0-9 /&-]*):$/;
const pad = (n) => String(n).padStart(2, '0');

export function normalize(text) {
  const collapsed = text.split(' ').filter(Boolean).join(' ');
  return collapsed.endsWith('.') ? collapsed.slice(0, -1) : collapsed;
}

const isLetterHeading = (line) => line.length > 3 && line[1] === '.' && line[2] === ' ' && line[0] >= 'A' && line[0] <= 'P';

/** Reads the spec: lettered sections A-P plus the three named requirement lists. Any other all-caps heading closes the current list. */
export function parseSpec(text) {
  const sections = [];
  let current = null;
  for (const line of lines(text)) {
    const heading = HEADING.exec(line);
    if (isLetterHeading(line)) {
      current = { key: line[0], items: [] };
      sections.push(current);
    } else if (heading) {
      const key = NAMED.get(heading[1]);
      current = key ? { key, items: [] } : null;
      if (current) sections.push(current);
    } else if (current && line.startsWith('- ')) {
      current.items.push(normalize(line.slice(2)));
    }
  }
  return sections;
}

export function parseChecklist(text) {
  const rows = [];
  for (const line of lines(text)) {
    if (!line.startsWith('|')) continue;
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim());
    const [id, item, status, evidence] = cells;
    if (cells.length === 4 && ID.test(id)) rows.push({ id, item: normalize(item), status, evidence });
  }
  return rows;
}

export function expectedItems(specText) {
  const expected = new Map();
  for (const { key, items } of parseSpec(specText)) {
    items.forEach((item, i) => expected.set(`${key}.${pad(i + 1)}`, item));
  }
  DESIGN_ITEMS.forEach((item, i) => expected.set(`DS.${pad(i + 1)}`, normalize(item)));
  return expected;
}

/** The checklist must list every spec item exactly once with unchanged text, valid statuses, and evidence for Tested or Verified. */
export function checkChecklist(root) {
  const specPath = join(root, 'docs', 'ATAS_FEATURE_SPEC.md');
  const listPath = join(root, 'docs', 'FEATURE_CHECKLIST.md');
  if (!existsSync(specPath) || !existsSync(listPath)) {
    return ['docs/ATAS_FEATURE_SPEC.md or docs/FEATURE_CHECKLIST.md is missing'];
  }
  const expected = expectedItems(readFileSync(specPath, 'utf8'));
  const violations = [];
  const seen = new Set();
  for (const row of parseChecklist(readFileSync(listPath, 'utf8'))) {
    if (seen.has(row.id)) violations.push(`${row.id}: listed more than once`);
    seen.add(row.id);
    if (!STATUSES.includes(row.status)) violations.push(`${row.id}: unknown status '${row.status}'`);
    if ((row.status === 'Tested' || row.status === 'Verified') && ['', '—', '-'].includes(row.evidence)) {
      violations.push(`${row.id}: status ${row.status} needs evidence`);
    }
    if (row.id.startsWith('AP.')) continue;
    const want = expected.get(row.id);
    if (want === undefined) violations.push(`${row.id}: not in the spec`);
    else if (row.item !== want) violations.push(`${row.id}: text differs from the spec (expected '${want}')`);
  }
  for (const id of [...expected.keys(), ...APPROVAL_IDS]) {
    if (!seen.has(id)) violations.push(`${id}: missing from the checklist`);
  }
  return violations;
}

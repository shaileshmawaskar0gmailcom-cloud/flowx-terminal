import { readdirSync } from 'node:fs';
import { isAbsolute, join, relative } from 'node:path';

const SKIP = new Set(['node_modules', '.git', 'dist', 'coverage']);
const LF = String.fromCharCode(10);

export function walk(dir, accept = () => true) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, accept));
    else if (accept(full)) out.push(full);
  }
  return out;
}

export function isInside(root, target) {
  const rel = relative(root, target);
  return rel === '' || (!rel.startsWith('..') && !isAbsolute(rel));
}

/** Splits text into trimmed lines; works for LF and CRLF files. */
export function lines(text) {
  return text.split(LF).map((line) => line.trim());
}

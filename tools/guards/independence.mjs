import { readFileSync } from 'node:fs';
import { basename, dirname, extname, isAbsolute, relative, resolve, sep } from 'node:path';
import { isInside, walk } from './lib.mjs';

const DEP_FIELDS = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
const EXTERNAL_PREFIXES = ['file:', 'link:', 'portal:', 'git+', 'git:', 'github:', 'gitlab:', 'bitbucket:', 'http:', 'https:', 'ssh:'];
const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.mts', '.js', '.jsx', '.mjs', '.cjs']);
const IMPORT = /(?:from|import|require)[ (]*['"]([^'"]*)['"]/g;

const isExternal = (spec) => EXTERNAL_PREFIXES.some((prefix) => spec.startsWith(prefix)) || spec.includes('../');
const isTsconfig = (file) => basename(file).startsWith('tsconfig') && file.endsWith('.json');

function readJson(file, root, violations) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    violations.push(`${relative(root, file)}: not valid JSON (comments are not allowed in guarded config files)`);
    return null;
  }
}

/** Keeps FlowX self-contained: nothing may depend on, import from or point at anything outside this repository. */
export function checkIndependence(root) {
  const violations = [];
  const files = walk(root);

  const manifests = files
    .filter((file) => file.endsWith('package.json'))
    .map((file) => ({ file, json: readJson(file, root, violations) }))
    .filter((entry) => entry.json !== null);
  const workspaceNames = new Set(manifests.map((m) => m.json.name).filter((name) => typeof name === 'string'));

  for (const { file, json } of manifests) {
    const where = relative(root, file);
    const specs = DEP_FIELDS.flatMap((field) => Object.entries(json[field] ?? {}));
    specs.push(...Object.entries(json.pnpm?.overrides ?? {}), ...Object.entries(json.resolutions ?? {}));
    for (const [name, spec] of specs) {
      if (typeof spec !== 'string') continue;
      if (spec.startsWith('workspace:')) {
        if (!name.startsWith('@flowx/') || !workspaceNames.has(name)) {
          violations.push(`${where}: ${name} uses ${spec} but is not a package of this repository`);
        }
      } else if (isExternal(spec)) {
        violations.push(`${where}: ${name} -> ${spec} points outside the npm registry and this repository`);
      }
    }
  }

  for (const file of files.filter(isTsconfig)) {
    const json = readJson(file, root, violations);
    if (json === null) continue;
    const co = json.compilerOptions ?? {};
    const paths = [
      ...[json.extends].flat().filter((entry) => typeof entry === 'string' && entry.startsWith('.')),
      ...(json.references ?? []).map((ref) => ref.path),
      ...(json.include ?? []),
      ...(json.exclude ?? []),
      ...(json.files ?? []),
      ...['rootDir', 'outDir', 'baseUrl'].map((key) => co[key]).filter(Boolean),
      ...Object.values(co.paths ?? {}).flat(),
    ];
    for (const p of paths) {
      if (!isInside(root, resolve(dirname(file), p))) {
        violations.push(`${relative(root, file)}: ${p} resolves outside the repository`);
      }
    }
  }

  for (const file of files.filter((f) => SOURCE_EXTENSIONS.has(extname(f)))) {
    const where = relative(root, file).replaceAll(sep, '/');
    if (where.startsWith('tools/guards/') && where.endsWith('.test.mjs')) continue;
    for (const match of readFileSync(file, 'utf8').matchAll(IMPORT)) {
      const spec = match[1];
      const absolute = spec.startsWith('file:') || isAbsolute(spec) || spec.charAt(1) === ':';
      if (absolute || (spec.startsWith('.') && !isInside(root, resolve(dirname(file), spec)))) {
        violations.push(`${where}: import '${spec}' leaves the repository`);
      }
    }
  }
  return violations;
}

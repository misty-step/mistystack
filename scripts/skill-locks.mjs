import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, lstatSync } from 'node:fs';
import { join, posix } from 'node:path';

export const SKILL_UPSTREAMS = [
  { pack: 'pocock', label: "Matt Pocock's skills", lock: 'vendor/pocock.lock.json', repo: 'mattpocock/skills', source: /^skills\/[a-z0-9-]+\/[a-z0-9-]+$/ },
  { pack: 'Warp', label: 'Warp', lock: 'vendor/warp.lock.json', repo: 'warpdotdev/common-skills', source: /^\.agents\/skills\/[a-z0-9-]+$/ },
];

export const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
export const validSkillMapping = (upstream, destination, source) => /^skills\/[a-z0-9-]+$/.test(destination) && typeof source === 'string' && upstream.source.test(source);

export function listFiles(root, dir) {
  const out = [];
  for (const entry of readdirSync(join(root, dir)).sort()) {
    const path = posix.join(dir, entry);
    const stat = lstatSync(join(root, path));
    if (stat.isSymbolicLink()) throw new Error(`${path}: vendored files cannot be symlinks`);
    if (stat.isDirectory()) out.push(...listFiles(root, path));
    else if (stat.isFile()) out.push(path);
    else throw new Error(`${path}: not a regular file`);
  }
  return out;
}

// Each file carries its source identity so consumers do not reconstruct provenance.
export function readSkillLocks(root) {
  const result = { vendoredSkills: new Set(), files: new Map(), errors: [] };
  for (const upstream of SKILL_UPSTREAMS) {
    if (!existsSync(join(root, upstream.lock))) continue;
    try {
      const lock = JSON.parse(readFileSync(join(root, upstream.lock), 'utf8'));
      const record = (value) => value && typeof value === 'object' && !Array.isArray(value);
      if (!lock || lock.repo !== upstream.repo || !/^[a-f0-9]{40}$/.test(lock.commit) || !record(lock.skills) || !record(lock.files)) {
        throw new Error('invalid upstream skill lock');
      }
      const mappings = Object.entries(lock.skills);
      for (const [destination, source] of mappings) {
        if (!validSkillMapping(upstream, destination, source)) throw new Error(`refusing skill mapping ${destination} <- ${source}`);
      }
      for (const [destination] of mappings) {
        if (!existsSync(join(root, destination))) {
          result.errors.push(`${upstream.lock}: missing ${destination}`);
          continue;
        }
        result.vendoredSkills.add(`${destination}/SKILL.md`);
        for (const file of listFiles(root, destination)) {
          if (!(file in lock.files)) result.errors.push(`${file}: not recorded in ${upstream.lock}; run bun scripts/sync-skills.ts ${upstream.lock} <checkout>`);
        }
        if (!(`${destination}/SKILL.md` in lock.files)) result.errors.push(`${upstream.lock}: ${destination}/SKILL.md is not recorded`);
      }
      for (const [file, digest] of Object.entries(lock.files)) {
        const mapping = mappings.find(([destination]) => file.startsWith(`${destination}/`));
        if (!mapping || file.split('/').some((part) => !part || part === '.' || part === '..') || file.includes('\\')) {
          result.errors.push(`${upstream.lock}: ${file} is outside every locked skill`);
          continue;
        }
        if (result.files.has(file)) result.errors.push(`${file}: recorded in multiple upstream locks`);
        result.files.set(file, { ...upstream, commit: lock.commit, source: `${mapping[1]}${file.slice(mapping[0].length)}` });
        if (!existsSync(join(root, file))) result.errors.push(`${file}: missing; run bun scripts/sync-skills.ts ${upstream.lock} <checkout>`);
        else if (sha256(readFileSync(join(root, file))) !== digest) result.errors.push(`${file}: differs from ${upstream.repo}@${lock.commit}; vendored bytes are not hand-edited`);
      }
    } catch (error) {
      result.errors.push(`${upstream.lock}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  return result;
}

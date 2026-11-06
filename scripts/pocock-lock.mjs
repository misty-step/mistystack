import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, posix } from 'node:path';

/** @typedef {{repo: string, commit: string, skills: Record<string, string>, files: Record<string, string>}} PocockLock */

export const POCOCK_LOCK = 'vendor/pocock.lock.json';
export const POCOCK_REPO = 'mattpocock/skills';

export const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

export function listFiles(root, dir) {
  const out = [];
  for (const entry of readdirSync(join(root, dir)).sort()) {
    const path = posix.join(dir, entry);
    if (statSync(join(root, path)).isDirectory()) out.push(...listFiles(root, path));
    else out.push(path);
  }
  return out;
}

/**
 * Reads the Pocock shaping lock and checks the working tree against it: every
 * locked skill directory holds exactly its recorded files, byte-for-byte.
 * @returns {{lock: PocockLock | undefined, vendoredSkills: Set<string>, errors: string[]}}
 */
export function readPocockLock(root) {
  const result = { lock: undefined, vendoredSkills: new Set(), errors: [] };
  if (!existsSync(join(root, POCOCK_LOCK))) return result;
  /** @type {PocockLock} */
  let lock;
  try {
    lock = JSON.parse(readFileSync(join(root, POCOCK_LOCK), 'utf8'));
  } catch (error) {
    result.errors.push(`${POCOCK_LOCK}: ${error instanceof Error ? error.message : String(error)}`);
    return result;
  }
  const record = (value) => value && typeof value === 'object' && !Array.isArray(value);
  if (!lock || lock.repo !== POCOCK_REPO || !/^[a-f0-9]{40}$/.test(lock.commit) || !record(lock.skills) || !record(lock.files)) {
    result.errors.push(`${POCOCK_LOCK}: invalid Pocock lock`);
    return result;
  }
  result.lock = lock;
  for (const destination of Object.keys(lock.skills)) {
    if (!/^skills\/[a-z0-9-]+$/.test(destination)) {
      result.errors.push(`${POCOCK_LOCK}: invalid skill destination ${destination}`);
      continue;
    }
    if (!existsSync(join(root, destination))) {
      result.errors.push(`${POCOCK_LOCK}: missing ${destination}`);
      continue;
    }
    result.vendoredSkills.add(`${destination}/SKILL.md`);
    for (const file of listFiles(root, destination)) {
      if (!(file in lock.files)) result.errors.push(`${file}: not recorded in ${POCOCK_LOCK}; run bun scripts/sync-pocock.ts`);
    }
  }
  for (const [file, digest] of Object.entries(lock.files)) {
    if (!Object.keys(lock.skills).some((destination) => file.startsWith(`${destination}/`))) {
      result.errors.push(`${POCOCK_LOCK}: ${file} is outside every locked skill`);
    } else if (!existsSync(join(root, file))) {
      result.errors.push(`${file}: missing; run bun scripts/sync-pocock.ts`);
    } else if (sha256(readFileSync(join(root, file))) !== digest) {
      result.errors.push(`${file}: differs from ${POCOCK_REPO}@${lock.commit}; vendored bytes are not hand-edited`);
    }
  }
  return result;
}

import { lstatSync, readFileSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';

/** @typedef {{source: string, destination: string, vendored: boolean}} Inclusion */
/** @typedef {{repo: string, commit: string, tree: string, 'inventory-sha256': string, include: Inclusion[], exclude: {source: string, reason: string}[], files: Record<string, string>}} PstackLock */

export const PSTACK_LOCK = 'vendor/pstack.lock.json';
export const isSkill = (source) => /^skills\/[^/]+$/.test(source);
export const isPlaybook = (source) => /^skills\/poteto-mode\/playbooks\/[^/]+\.md$/.test(source);
const portable = (path) => typeof path === 'string' && /^[a-zA-Z0-9_.\/-]+$/.test(path) && !path.split('/').some((part) => !part || part === '.' || part === '..');
const owns = (entry, file) => isSkill(entry.source) ? file.startsWith(`${entry.destination}/`) : file === entry.destination;

export function noSymlinkStat(root, target) {
  let path = resolve(root);
  let stat;
  for (const component of ['', ...relative(path, resolve(target)).split(sep).filter(Boolean)]) {
    if (component) path = join(path, component);
    stat = lstatSync(path, { throwIfNoEntry: false });
    if (!stat) return;
    if (stat.isSymbolicLink()) throw new Error(`symlink is not allowed: ${path}`);
  }
  return stat;
}

export function readPstackLock(root) {
  noSymlinkStat(root, join(root, PSTACK_LOCK));
  /** @type {PstackLock} */
  const lock = JSON.parse(readFileSync(join(root, PSTACK_LOCK), 'utf8'));
  if (!lock || lock.repo !== 'cursor/plugins' || !/^[a-f0-9]{40}$/.test(lock.commit) || !/^[a-f0-9]{40}$/.test(lock.tree)
    || !Array.isArray(lock.include) || !Array.isArray(lock.exclude) || !lock.files || typeof lock.files !== 'object' || Array.isArray(lock.files)) {
    throw new Error(`${PSTACK_LOCK}: invalid pstack lock`);
  }
  const seen = new Set();
  for (const entry of [...lock.include, ...lock.exclude]) {
    if (!entry || !portable(entry.source) || !(isSkill(entry.source) || isPlaybook(entry.source) || /^agents\/[^/]+\.md$/.test(entry.source))) {
      throw new Error(`${PSTACK_LOCK}: invalid upstream name ${JSON.stringify(entry?.source)}`);
    }
    if (seen.has(entry.source)) throw new Error(`${PSTACK_LOCK}: duplicate upstream name ${entry.source}`);
    seen.add(entry.source);
  }
  for (const entry of lock.include) {
    if (!(isSkill(entry.source) || isPlaybook(entry.source)) || !portable(entry.destination) || !entry.destination.startsWith('skills/') || typeof entry.vendored !== 'boolean') {
      throw new Error(`${PSTACK_LOCK}: invalid inclusion ${entry.source}`);
    }
    if (lock.include.some((other) => other !== entry && (other.destination === entry.destination || other.destination.startsWith(`${entry.destination}/`) || entry.destination.startsWith(`${other.destination}/`)))) {
      throw new Error(`${PSTACK_LOCK}: overlapping destination ${entry.destination}`);
    }
  }
  for (const entry of lock.exclude) if (typeof entry.reason !== 'string' || !entry.reason.trim()) throw new Error(`${PSTACK_LOCK}: missing exclusion reason for ${entry.source}`);
  const vendoredSources = new Map();
  for (const [file, hash] of Object.entries(lock.files)) {
    const owner = lock.include.find((entry) => entry.vendored && owns(entry, file));
    if (!portable(file) || !owner || !/^[a-f0-9]{64}$/.test(hash)) throw new Error(`${PSTACK_LOCK}: invalid vendored file ${file}`);
    vendoredSources.set(file, owner.source + file.slice(owner.destination.length));
  }
  const vendoredSkills = new Map(lock.include.filter((entry) => entry.vendored && lock.files[`${entry.destination}/SKILL.md`])
    .map((entry) => [`${entry.destination}/SKILL.md`, `${lock.repo}@${lock.commit}/pstack/${entry.source}`]));
  const upstreamOnly = [...lock.exclude, ...lock.include.filter((entry) => !entry.vendored)].map((entry) => entry.source);
  return { lock, vendoredSources, vendoredSkills, upstreamOnly };
}

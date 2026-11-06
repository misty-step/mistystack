#!/usr/bin/env bun
// Copies the locked Pocock shaping skills from a mattpocock/skills checkout and rewrites the lock.
// Usage: bun scripts/sync-pocock.ts <checkout>   (the checkout's HEAD becomes the pin)
import { cpSync, existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { POCOCK_LOCK, POCOCK_REPO, listFiles, sha256 } from "./pocock-lock.mjs";

const root = resolve(import.meta.dir, "..");
const checkout = process.argv[2];
if (!checkout || !existsSync(join(checkout, ".git"))) {
	console.error("usage: bun scripts/sync-pocock.ts <mattpocock/skills checkout>");
	process.exit(2);
}
const git = (...args: string[]) => {
	const run = Bun.spawnSync(["git", "-C", checkout, ...args]);
	if (run.exitCode !== 0) throw new Error(`git ${args.join(" ")}: ${run.stderr.toString()}`);
	return run.stdout.toString().trim();
};
const remote = git("remote", "get-url", "origin");
if (!remote.includes(POCOCK_REPO)) throw new Error(`${checkout} is not a ${POCOCK_REPO} checkout: ${remote}`);
if (git("status", "--porcelain") !== "") throw new Error(`${checkout} has uncommitted changes`);
const commit = git("rev-parse", "HEAD");

const lock = JSON.parse(readFileSync(join(root, POCOCK_LOCK), "utf8"));
const files: Record<string, string> = {};
for (const [destination, source] of Object.entries(lock.skills as Record<string, string>)) {
	if (!existsSync(join(checkout, source, "SKILL.md"))) throw new Error(`${source}/SKILL.md is missing at ${commit}`);
	rmSync(join(root, destination), { recursive: true, force: true });
	cpSync(join(checkout, source), join(root, destination), { recursive: true });
	for (const file of listFiles(root, destination)) files[file] = sha256(readFileSync(join(root, file)));
}
writeFileSync(join(root, POCOCK_LOCK), `${JSON.stringify({ ...lock, repo: POCOCK_REPO, commit, files }, null, 2)}\n`);
console.log(`${POCOCK_LOCK}: ${Object.keys(lock.skills).length} skills, ${Object.keys(files).length} files at ${commit}`);

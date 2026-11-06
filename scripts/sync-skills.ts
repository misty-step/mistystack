#!/usr/bin/env bun
// Usage: bun scripts/sync-skills.ts <lock> <checkout> (checkout HEAD becomes the pin).
import { cpSync, existsSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import { SKILL_UPSTREAMS, listFiles, sha256, validSkillMapping } from "./skill-locks.mjs";

const root = resolve(import.meta.dir, "..");
const upstream = SKILL_UPSTREAMS.find(({ lock }) => lock === process.argv[2]);
const checkout = process.argv[3];
if (!upstream || !checkout || !existsSync(join(checkout, ".git"))) {
	console.error("usage: bun scripts/sync-skills.ts <registered vendor/*.lock.json> <checkout>");
	process.exit(2);
}
const git = (...args: string[]) => {
	const run = Bun.spawnSync(["git", "-C", checkout, ...args]);
	if (run.exitCode !== 0) throw new Error(`git ${args.join(" ")}: ${run.stderr.toString()}`);
	return run.stdout.toString().trim();
};
const remote = git("remote", "get-url", "origin");
if (![`https://github.com/${upstream.repo}`, `https://github.com/${upstream.repo}.git`, `git@github.com:${upstream.repo}.git`].includes(remote)) {
	throw new Error(`${checkout} is not a ${upstream.repo} checkout: ${remote}`);
}
if (git("status", "--porcelain") !== "") throw new Error(`${checkout} has uncommitted changes`);
const commit = git("rev-parse", "HEAD");
const lock = JSON.parse(readFileSync(join(root, upstream.lock), "utf8"));
const skills = Object.entries(lock.skills as Record<string, string>);
const checkoutRoot = realpathSync(checkout);
if (existsSync(join(root, "skills")) && realpathSync(join(root, "skills")) !== join(root, "skills")) throw new Error("skills/: refusing a symlinked destination root");
for (const [destination, source] of skills) {
	if (!validSkillMapping(upstream, destination, source)) throw new Error(`${upstream.lock}: refusing skill mapping ${destination} <- ${source}`);
	if (!existsSync(join(checkout, source, "SKILL.md"))) throw new Error(`${source}/SKILL.md is missing at ${commit}`);
	if (!realpathSync(join(checkout, source)).startsWith(`${checkoutRoot}${sep}`)) throw new Error(`${source}: outside checkout`);
	listFiles(checkout, source);
}
const files: Record<string, string> = {};
for (const [destination, source] of skills) {
	rmSync(join(root, destination), { recursive: true, force: true });
	cpSync(join(checkout, source), join(root, destination), { recursive: true });
	for (const file of listFiles(root, destination)) files[file] = sha256(readFileSync(join(root, file)));
}
writeFileSync(join(root, upstream.lock), `${JSON.stringify({ ...lock, repo: upstream.repo, commit, files }, null, 2)}\n`);
console.log(`${upstream.lock}: ${skills.length} skills, ${Object.keys(files).length} files at ${commit}`);

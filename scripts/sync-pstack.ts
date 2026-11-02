#!/usr/bin/env bun
import { YAML } from "bun";
import { createHash } from "node:crypto";
import { chmodSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, readlinkSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, posix, resolve } from "node:path";

type Inclusion = { source: string; destination: string; vendored: boolean };
export type PstackLock = {
	repo: string;
	commit: string;
	tree: string;
	"generated-at": string;
	"inventory-sha256": string;
	include: Inclusion[];
	exclude: { source: string; reason: string }[];
	files: Record<string, string>;
};

const LOCK = "vendor/pstack.lock.json";
const ADAPTER = "skills/misty/harnesses/pstack-names.md";
const SIDECAR = "policy:\n  allow_implicit_invocation: false\n";
// Keep the Cursor-name detectors aligned with cursor/plugins/scripts/generate-pstack-harness-trees.mjs.
const CURSOR_NAMES = [
	/`Task`|\bTask (tool|subagent|call)/, /AskQuestion/, /\btodo ?list\b/i,
	/generalPurpose/, /poteto-agent/, /comment-sicko/, /readonly: (true|false)|readonly\/Ask/,
	/environment: "(cloud|local)"/, /cloud_base_branch/, /run_in_background/, /`resume`/,
	/file_attachments/, /\bclaude-[a-z]+-\d/, /\bgrok-\d/, /\bgpt-\d/, /inherit-parent/,
	/pstack-models\.mdc/, /\.cursor\/skills/, /\.cursor\/plugins|\.cursor-plugin/,
	/\.cursor\/rules|always-applied rule/, /agent-transcripts|\.cursor\/projects/,
	/Bugbot|Cursor [Aa]utomation|cursor\.(sh|com)\/automations|[Cc]loud [Aa]gent|built-in PR tool/,
	/\bsubagent_type\b|\bcursor-team-kit\b|\bOrigin\b|\/loop\b/,
];
const sha256 = (bytes: string | Buffer) => createHash("sha256").update(bytes).digest("hex");
const inventoryHash = (names: string[]) => sha256(`${[...names].sort().join("\n")}\n`);
const portable = (path: string) => /^[a-zA-Z0-9_.\/-]+$/.test(path) && !path.split("/").some(part => part === "" || part === "." || part === "..");
const isSkill = (source: string) => /^skills\/[^/]+$/.test(source);
const isPlaybook = (source: string) => /^skills\/poteto-mode\/playbooks\/[^/]+\.md$/.test(source);
const owns = (entry: Inclusion, file: string) => isSkill(entry.source) ? file.startsWith(`${entry.destination}/`) : file === entry.destination;

function load(root: string): PstackLock {
	const lock: PstackLock = JSON.parse(readFileSync(join(root, LOCK), "utf8"));
	if (lock.repo !== "cursor/plugins" || !/^[a-f0-9]{40}$/.test(lock.commit) || !/^[a-f0-9]{40}$/.test(lock.tree)
		|| !Array.isArray(lock.include) || !Array.isArray(lock.exclude) || !lock.files || typeof lock.files !== "object" || Array.isArray(lock.files)) {
		throw new Error(`${LOCK}: invalid pstack lock`);
	}
	const seen = new Set<string>();
	for (const entry of [...lock.include, ...lock.exclude]) {
		if (typeof entry.source !== "string" || !(isSkill(entry.source) || isPlaybook(entry.source) || /^agents\/[^/]+\.md$/.test(entry.source)) || !portable(entry.source)) {
			throw new Error(`${LOCK}: invalid upstream name ${JSON.stringify(entry.source)}`);
		}
		if (seen.has(entry.source)) throw new Error(`${LOCK}: duplicate upstream name ${entry.source}`);
		seen.add(entry.source);
	}
	for (const entry of lock.include) {
		if (!(isSkill(entry.source) || isPlaybook(entry.source)) || typeof entry.destination !== "string" || !portable(entry.destination) || !entry.destination.startsWith("skills/") || typeof entry.vendored !== "boolean") {
			throw new Error(`${LOCK}: invalid inclusion ${entry.source}`);
		}
		if (lock.include.some(other => other !== entry && (other.destination === entry.destination || other.destination.startsWith(`${entry.destination}/`) || entry.destination.startsWith(`${other.destination}/`)))) {
			throw new Error(`${LOCK}: overlapping destination ${entry.destination}`);
		}
	}
	for (const entry of lock.exclude) if (typeof entry.reason !== "string" || !entry.reason.trim()) throw new Error(`${LOCK}: missing exclusion reason for ${entry.source}`);
	for (const [file, hash] of Object.entries(lock.files)) {
		if (!portable(file) || !lock.include.some(entry => entry.vendored && owns(entry, file)) || !/^[a-f0-9]{64}$/.test(hash)) {
			throw new Error(`${LOCK}: invalid vendored file ${file}`);
		}
	}
	return lock;
}

function walk(root: string): string[] {
	return readdirSync(root).sort().flatMap(name => {
		const file = join(root, name);
		const stat = lstatSync(file);
		if (stat.isSymbolicLink()) throw new Error(`symlink is not a vendored file: ${file}`);
		if (stat.isDirectory()) return walk(file).map(child => `${name}/${child}`);
		if (!stat.isFile()) throw new Error(`not a regular file: ${file}`);
		return [name];
	});
}

export function checkPstack(root: string): string[] {
	try {
		const lock = load(root);
		const errors: string[] = [];
		const names = [...lock.include, ...lock.exclude].map(entry => entry.source);
		if (inventoryHash(names) !== lock["inventory-sha256"]) errors.push(`${LOCK}: upstream include/exclude inventory changed; every pinned name must appear exactly once`);
		for (const [file, hash] of Object.entries(lock.files)) {
			const path = join(root, file);
			if (!existsSync(path)) errors.push(`${file}: missing vendored file`);
			else if (!lstatSync(path).isFile() || lstatSync(path).isSymbolicLink()) errors.push(`${file}: not a regular vendored file`);
			else if (sha256(readFileSync(path)) !== hash) errors.push(`${file}: sha256 mismatch (do not hand-edit vendored pstack)`);
		}
		for (const entry of lock.include.filter(entry => entry.vendored)) {
			const path = join(root, entry.destination);
			const required = isSkill(entry.source) ? `${entry.destination}/SKILL.md` : entry.destination;
			if (!lock.files[required]) errors.push(`${required}: missing from vendored file inventory`);
			if (existsSync(path) && isSkill(entry.source)) {
				for (const file of walk(path)) if (!lock.files[`${entry.destination}/${file}`]) errors.push(`${entry.destination}/${file}: unlisted vendored file`);
			}
		}
		return errors;
	} catch (error) {
		return [error instanceof Error ? error.message : String(error)];
	}
}

function gitHash(kind: "blob" | "tree", bytes: Buffer) {
	return createHash("sha1").update(`${kind} ${bytes.length}\0`).update(bytes).digest();
}

function gitTree(root: string): Buffer {
	const entries = readdirSync(root).filter(name => name !== ".git").map(name => {
		const file = join(root, name);
		const stat = lstatSync(file);
		const directory = stat.isDirectory();
		const mode = directory ? "40000" : stat.isSymbolicLink() ? "120000" : stat.mode & 0o111 ? "100755" : "100644";
		const hash = directory ? gitTree(file) : gitHash("blob", stat.isSymbolicLink() ? Buffer.from(readlinkSync(file)) : readFileSync(file));
		return { name, directory, bytes: Buffer.concat([Buffer.from(`${mode} ${name}\0`), hash]) };
	});
	entries.sort((a, b) => Buffer.compare(Buffer.from(a.name + (a.directory ? "/" : "")), Buffer.from(b.name + (b.directory ? "/" : ""))));
	return gitHash("tree", Buffer.concat(entries.map(entry => entry.bytes)));
}

function upstreamNames(source: string) {
	return [
		...readdirSync(join(source, "skills")).filter(name => existsSync(join(source, "skills", name, "SKILL.md"))).map(name => `skills/${name}`),
		...readdirSync(join(source, "skills/poteto-mode/playbooks")).filter(name => name.endsWith(".md")).map(name => `skills/poteto-mode/playbooks/${name}`),
		...readdirSync(join(source, "agents")).filter(name => name.endsWith(".md")).map(name => `agents/${name}`),
	].sort();
}

function wrap(bytes: Buffer, destination: string, skillNames: string[]) {
	const text = bytes.toString("utf8");
	const routed = skillNames.some(name => {
		const route = new RegExp(`the \\*\\*${name}\\*\\* skill|\u0060/${name}\u0060`);
		return text.split("\n").some(line => route.test(line) && !line.includes(`(../${name}/`));
	});
	if (!CURSOR_NAMES.some(pattern => pattern.test(text)) && !routed) return bytes;
	if (!/^# /m.test(text)) throw new Error(`${destination}: uses Cursor names but has no H1 for the harness pointer`);
	const href = posix.relative(posix.dirname(destination), ADAPTER);
	const line = `In Mistystack, read [the pstack names adapter](${href}) once per session before you follow this skill. It maps the Cursor names in pstack skills to your harness.`;
	return Buffer.from(text.replace(/^(# .*)\n+/m, `$1\n\n${line}\n\n`));
}

function command(args: string[]) {
	const result = Bun.spawnSync(args, { stdout: "pipe", stderr: "pipe" });
	if (!result.success) throw new Error(`${args.slice(0, 3).join(" ")}: ${result.stderr.toString().trim()}`);
	return result.stdout.toString().trim();
}

export async function updatePstack(root: string, commit: string, from?: string) {
	if (!/^[a-f0-9]{7,40}$/.test(commit)) throw new Error("--update requires a commit SHA");
	const lock = load(root);
	const temporary = process.env.TMPDIR ?? join(homedir(), ".cache/tmp");
	mkdirSync(temporary, { recursive: true });
	const scratch = mkdtempSync(join(temporary, "pstack-sync-"));
	try {
		let source = from ? resolve(from) : undefined;
		let tree = lock.tree;
		if (!from || commit !== lock.commit) {
			commit = command(["gh", "api", `repos/${lock.repo}/commits/${commit}`, "--jq", ".sha"]);
			const listing = JSON.parse(command(["gh", "api", `repos/${lock.repo}/git/trees/${commit}`]));
			tree = listing.tree.find((entry: { path: string; type: string }) => entry.path === "pstack" && entry.type === "tree")?.sha;
			if (!tree) throw new Error(`${commit}: missing pstack tree`);
		}
		if (!source) {
			const checkout = join(scratch, "checkout");
			command(["git", "-c", "init.templateDir=", "clone", "--filter=blob:none", "--no-checkout", "--depth=1", `https://github.com/${lock.repo}.git`, checkout]);
			command(["git", "-C", checkout, "fetch", "--depth=1", "origin", commit]);
			const archive = join(scratch, "source.tar");
			command(["git", "-C", checkout, "archive", "--format=tar", "-o", archive, commit, "pstack"]);
			source = join(scratch, "source");
			mkdirSync(source);
			command(["tar", "-xf", archive, "-C", source]);
		}
		if (existsSync(join(source, "pstack/skills"))) source = join(source, "pstack");
		const actualTree = gitTree(source).toString("hex");
		if (actualTree !== tree) throw new Error(`source tree ${actualTree} does not match ${lock.repo}@${commit}/pstack ${tree}`);
		const names = upstreamNames(source);
		const declared = [...lock.include, ...lock.exclude].map(entry => entry.source).sort();
		if (names.join("\n") !== declared.join("\n")) {
			throw new Error(`classify every upstream name in ${LOCK}; unclassified: ${names.filter(name => !declared.includes(name)).join(", ") || "none"}; absent upstream: ${declared.filter(name => !names.includes(name)).join(", ") || "none"}`);
		}
		const rendered = new Map<string, { bytes: Buffer; mode: number }>();
		const skillNames = names.filter(isSkill).map(name => posix.basename(name));
		for (const entry of lock.include.filter(entry => entry.vendored)) {
			for (const child of isSkill(entry.source) ? walk(join(source, entry.source)) : [""]) {
				const sourceFile = join(source, entry.source, child);
				const destination = child ? `${entry.destination}/${child}` : entry.destination;
				const bytes = readFileSync(sourceFile);
				rendered.set(destination, { bytes: destination.endsWith(".md") ? wrap(bytes, destination, skillNames) : bytes, mode: lstatSync(sourceFile).mode & 0o111 ? 0o755 : 0o644 });
			}
			if (isSkill(entry.source)) {
				const frontmatter = readFileSync(join(source, entry.source, "SKILL.md"), "utf8").match(/^---\n([\s\S]*?)\n---/)?.[1];
				if (frontmatter && YAML.parse(frontmatter)["disable-model-invocation"] === true) rendered.set(`${entry.destination}/agents/openai.yaml`, { bytes: Buffer.from(SIDECAR), mode: 0o644 });
			}
		}
		for (const entry of lock.include.filter(entry => entry.vendored)) rmSync(join(root, entry.destination), { recursive: true, force: true });
		for (const file of Object.keys(lock.files)) if (!rendered.has(file)) rmSync(join(root, file), { force: true });
		const files: Record<string, string> = {};
		for (const [file, { bytes, mode }] of [...rendered].sort(([a], [b]) => a.localeCompare(b))) {
			mkdirSync(dirname(join(root, file)), { recursive: true });
			writeFileSync(join(root, file), bytes);
			chmodSync(join(root, file), mode);
			files[file] = sha256(bytes);
		}
		writeFileSync(join(root, LOCK), `${JSON.stringify({ ...lock, commit, tree, "generated-at": new Date().toISOString(), "inventory-sha256": inventoryHash(names), files }, null, 2)}\n`);
		return files;
	} finally {
		rmSync(scratch, { recursive: true, force: true });
	}
}

if (import.meta.main) {
	try {
		const args = process.argv.slice(2);
		const root = resolve(import.meta.dir, "..");
		if (args.length === 1 && args[0] === "--check") {
			const errors = checkPstack(root);
			if (errors.length) throw new Error(errors.join("\n"));
			console.log("pstack: pinned inventory and vendored sha256 files match (offline)");
		} else if (args[0] === "--update" && (args.length === 2 || args.length === 4 && args[2] === "--from")) {
			const files = await updatePstack(root, args[1], args[3]);
			console.log(`pstack: synchronized ${Object.keys(files).length} files; commit the vendored files and ${LOCK}`);
		} else {
			throw new Error("Usage: bun scripts/sync-pstack.ts --check | --update <commit> [--from <dir>]");
		}
	} catch (error) {
		console.error(error instanceof Error ? error.message : String(error));
		process.exit(1);
	}
}

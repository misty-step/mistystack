#!/usr/bin/env bun
import { YAML } from "bun";
import { createHash } from "node:crypto";
import { chmodSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, posix, resolve } from "node:path";
import { isPlaybook, isSkill, noSymlinkStat, PSTACK_LOCK as LOCK, PSTACK_NAMES as ADAPTER, readPstackLock, readPstackNames, type PstackLock } from "./pstack-lock.mjs";

const SIDECAR = "policy:\n  allow_implicit_invocation: false\n";
const PATCHES = "vendor/pstack-patches";
// Keep the Cursor-name detectors aligned with cursor/plugins/scripts/generate-pstack-harness-trees.mjs.
const CURSOR_NAMES: [string, RegExp][] = [
	["Task", /`Task`|\bTask (tool|subagent|call)/], ["AskQuestion", /AskQuestion/], ["todolist", /\btodo ?list\b/i],
	["generalPurpose", /generalPurpose/], ["poteto-agent", /poteto-agent/], ["comment-sicko", /comment-sicko/],
	["readonly/Ask", /readonly: (true|false)|readonly\/Ask/], ['environment: "cloud"', /environment: "(cloud|local)"/],
	["cloud_base_branch", /cloud_base_branch/], ["run_in_background", /run_in_background/], ["resume", /`resume`/],
	["file_attachments", /file_attachments/], ["claude-*", /\bclaude-[a-z]+-\d/], ["grok-*", /\bgrok-\d/], ["gpt-*", /\bgpt-\d/],
	["inherit-parent", /inherit-parent/], ["pstack-models.mdc", /pstack-models\.mdc/], [".cursor/skills/", /\.cursor\/skills/],
	[".cursor/plugins/", /\.cursor\/plugins|\.cursor-plugin/], [".cursor/rules/", /\.cursor\/rules|always-applied rule/],
	["agent-transcripts", /agent-transcripts|\.cursor\/projects/], ["Bugbot", /Bugbot/],
	["Automations", /Cursor [Aa]utomation|cursor\.(sh|com)\/automations/], ["cloud agents", /[Cc]loud [Aa]gent/],
	["built-in PR tool", /built-in PR tool/], ["subagent_type", /\bsubagent_type\b/], ["cursor-team-kit", /\bcursor-team-kit\b/],
	["Origin", /\bOrigin\b/], ["/loop", /\/loop\b/],
];
const sha256 = (bytes: string | Buffer) => createHash("sha256").update(bytes).digest("hex");
const inventoryHash = (names: string[]) => sha256(`${[...names].sort().join("\n")}\n`);

function checkRoutes(root: string, lock: PstackLock): string[] {
	const keys = readPstackNames(root);
	const aliases = new Map<string, string>();
	for (const { source } of [...lock.include, ...lock.exclude]) {
		if (!isSkill(source) && !isPlaybook(source)) continue;
		const name = posix.basename(source, ".md");
		aliases.set(name, name);
		if (name.startsWith("principle-")) aliases.set(name.slice("principle-".length), name);
	}
	const installed = new Set(lock.include.filter(entry => entry.vendored && existsSync(join(root, entry.destination))).map(entry => posix.basename(entry.source, ".md")));
	const errors = new Set<string>();
	for (const file of Object.keys(lock.files).filter(file => file.endsWith(".md") && existsSync(join(root, file)))) {
		const text = readFileSync(join(root, file), "utf8");
		const needed = new Set(CURSOR_NAMES.filter(([, pattern]) => pattern.test(text)).map(([key]) => key));
		for (const token of text.match(/[a-z][a-z0-9-]*/g) ?? []) {
			const name = aliases.get(token);
			if (name && !installed.has(name) && !existsSync(join(root, "skills", name, "SKILL.md"))) needed.add(keys.has(name) ? name : token);
		}
		for (const match of text.matchAll(/(?:the\s+)?(?:\*\*|`)([a-z][a-z0-9-]+)(?:\*\*|`)\s+(?:principle\s+)?skill\b|`\/([a-z][a-z0-9-]+)`/g)) {
			const token = match[1] ?? match[2];
			const name = aliases.get(token) ?? token;
			if (!installed.has(name) && !existsSync(join(root, "skills", name, "SKILL.md"))) needed.add(keys.has(`/${token}`) ? `/${token}` : keys.has(name) ? name : token);
		}
		for (const section of ["Subagents", "Non-negotiables", "Autonomy", "Opening a PR"]) if (text.includes(section)) needed.add(section);
		for (const key of needed) if (!keys.has(key)) errors.add(`${file}: missing pstack adapter row for ${key} in ${ADAPTER}`);
	}
	return [...errors];
}

function walk(root: string, ignored?: ReadonlySet<string>): string[] {
	noSymlinkStat(dirname(root), root);
	return readdirSync(root).sort().flatMap(name => {
		const file = join(root, name);
		if (ignored?.has(file)) return [];
		const stat = lstatSync(file);
		if (stat.isSymbolicLink()) throw new Error(`symlink is not a vendored file: ${file}`);
		if (stat.isDirectory()) return walk(file, ignored).map(child => `${name}/${child}`);
		if (!stat.isFile()) throw new Error(`not a regular file: ${file}`);
		return [name];
	});
}
function readPatches(root: string, lock: PstackLock) {
	const directory = join(root, PATCHES);
	if (!noSymlinkStat(root, directory)) return [];
	return readdirSync(directory).sort().map(name => {
		const file = `${PATCHES}/${name}`;
		if (!/^[a-z0-9-]+\.json$/.test(name) || !noSymlinkStat(root, join(root, file))?.isFile()) throw new Error(`${file}: expected a primitive JSON patch`);
		const bytes = readFileSync(join(root, file));
		const patch = JSON.parse(bytes.toString("utf8")) as { source: string; reason: string; edits: { file: string; before: string; after: string }[]; remove?: { file: string; sha256: string }[] };
		const entry = lock.include.find(entry => entry.vendored && entry.source === patch.source);
		if (!entry || typeof patch.reason !== "string" || !patch.reason.trim() || !Array.isArray(patch.edits)
			|| patch.remove !== undefined && !Array.isArray(patch.remove) || patch.edits.length + (patch.remove?.length ?? 0) === 0) throw new Error(`${file}: invalid primitive patch`);
		for (const edit of patch.edits) {
			if (typeof edit.file !== "string" || edit.file && (!/^[a-zA-Z0-9_./-]+$/.test(edit.file) || edit.file.split("/").some(part => !part || part === "." || part === ".."))
				|| !isSkill(entry.source) && edit.file !== "" || typeof edit.before !== "string" || !edit.before || typeof edit.after !== "string" || edit.before === edit.after) throw new Error(`${file}: invalid exact replacement`);
		}
		const removed = new Set<string>();
		for (const removal of patch.remove ?? []) {
			if (typeof removal.file !== "string" || !/^[a-zA-Z0-9_./-]+$/.test(removal.file)
				|| removal.file.split("/").some(part => !part || part === "." || part === "..") || !isSkill(entry.source)
				|| removal.file === "SKILL.md" || !/^[a-f0-9]{64}$/.test(removal.sha256) || removed.has(removal.file)
				|| patch.edits.some(edit => edit.file === removal.file)) throw new Error(`${file}: invalid exact removal`);
			removed.add(removal.file);
		}
		return { ...patch, file, sha256: sha256(bytes), destination: entry.destination };
	});
}


export function checkPstack(root: string): string[] {
	try {
		const { lock } = readPstackLock(root);
		for (const entry of lock.include.filter(entry => entry.vendored)) noSymlinkStat(root, join(root, entry.destination));
		for (const file of Object.keys(lock.files)) noSymlinkStat(root, join(root, file));
		const errors: string[] = [];
		const names = [...lock.include, ...lock.exclude].map(entry => entry.source);
		if (inventoryHash(names) !== lock["inventory-sha256"]) errors.push(`${LOCK}: upstream include/exclude inventory changed; every pinned name must appear exactly once`);
		const patches = readPatches(root, lock).map(({ source, file, reason, sha256 }) => ({ source, file, reason, sha256 }));
		if (JSON.stringify(patches) !== JSON.stringify(lock.patches ?? [])) errors.push(`${LOCK}: primitive patches changed; regenerate with --update`);
		for (const [file, hash] of Object.entries(lock.files)) {
			const path = join(root, file);
			if (!existsSync(path)) errors.push(`${file}: missing vendored file`);
			else if (!lstatSync(path).isFile() || lstatSync(path).isSymbolicLink()) errors.push(`${file}: not a regular vendored file`);
			else if (sha256(readFileSync(path)) !== hash) errors.push(`${file}: sha256 mismatch (do not hand-edit vendored pstack)`);
		}
		const ignored = new Set<string>();
		const git = Bun.which("git");
		if (git && existsSync(join(root, ".git"))) {
			const result = Bun.spawnSync([git, "-C", root, "ls-files", "--others", "--ignored", "--exclude-standard", "--directory", "-z"], { stdout: "pipe", stderr: "pipe" });
			if (!result.success) throw new Error(`git ls-files: ${result.stderr.toString().trim()}`);
			for (const file of result.stdout.toString().split("\0").filter(Boolean)) ignored.add(join(root, file.replace(/\/$/, "")));
		}
		for (const entry of lock.include.filter(entry => entry.vendored)) {
			const path = join(root, entry.destination);
			const required = isSkill(entry.source) ? `${entry.destination}/SKILL.md` : entry.destination;
			if (!lock.files[required]) errors.push(`${required}: missing from vendored file inventory`);
			if (existsSync(path) && isSkill(entry.source)) {
				for (const file of walk(path, ignored)) if (!lock.files[`${entry.destination}/${file}`]) errors.push(`${entry.destination}/${file}: unlisted vendored file`);
			}
		}
		return [...errors, ...checkRoutes(root, lock)];
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
		if (stat.isSymbolicLink()) throw new Error(`symlink is not allowed: ${file}`);
		const directory = stat.isDirectory();
		const mode = directory ? "40000" : stat.mode & 0o111 ? "100755" : "100644";
		const hash = directory ? gitTree(file) : gitHash("blob", readFileSync(file));
		return { name, directory, bytes: Buffer.concat([Buffer.from(`${mode} ${name}\0`), hash]) };
	});
	entries.sort((a, b) => Buffer.compare(Buffer.from(a.name + (a.directory ? "/" : "")), Buffer.from(b.name + (b.directory ? "/" : ""))));
	return gitHash("tree", Buffer.concat(entries.map(entry => entry.bytes)));
}

function upstreamNames(source: string) {
	for (const path of ["skills", "skills/poteto-mode/playbooks", "agents"]) noSymlinkStat(source, join(source, path));
	return [
		...readdirSync(join(source, "skills")).filter(name => noSymlinkStat(source, join(source, "skills", name, "SKILL.md"))?.isFile()).map(name => `skills/${name}`),
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
	if (!CURSOR_NAMES.some(([, pattern]) => pattern.test(text)) && !routed) return bytes;
	if (!/^#{1,6} /m.test(text)) throw new Error(`${destination}: uses Cursor names but has no Markdown heading for the harness pointer`);
	const href = posix.relative(posix.dirname(destination), ADAPTER);
	const line = `In Mistystack, read [the pstack names adapter](${href}) once per session before you follow this skill. It maps the Cursor names in pstack skills to your harness.`;
	return Buffer.from(text.replace(/^(#{1,6} .*)\n+/m, `$1\n\n${line}\n\n`));
}

function command(args: string[]) {
	const result = Bun.spawnSync(args, { stdout: "pipe", stderr: "pipe" });
	if (!result.success) throw new Error(`${args.slice(0, 3).join(" ")}: ${result.stderr.toString().trim()}`);
	return result.stdout.toString().trim();
}

export async function updatePstack(root: string, commit: string, from?: string, all = false) {
	if (!/^[a-f0-9]{7,40}$/.test(commit)) throw new Error("--update requires a commit SHA");
	const { lock: previous } = readPstackLock(root);
	const lock = structuredClone(previous);
	const temporary = process.env.TMPDIR ?? join(homedir(), ".cache/tmp");
	mkdirSync(temporary, { recursive: true });
	const scratch = mkdtempSync(join(temporary, "pstack-sync-"));
	try {
		let source = from ? join(realpathSync(dirname(resolve(from))), posix.basename(resolve(from))) : undefined;
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
			source = join(realpathSync(scratch), "source");
			mkdirSync(source);
			command(["tar", "-xf", archive, "-C", source]);
		}
		noSymlinkStat(dirname(source), source);
		if (noSymlinkStat(source, join(source, "pstack/skills"))?.isDirectory()) source = join(source, "pstack");
		const actualTree = gitTree(source).toString("hex");
		if (actualTree !== tree) throw new Error(`source tree ${actualTree} does not match ${lock.repo}@${commit}/pstack ${tree}`);
		const names = upstreamNames(source);
		if (all) {
			lock.include = names.map(source => ({ source, destination: source.startsWith("agents/") ? `vendor/pstack-agents/${posix.basename(source)}` : source, vendored: true }));
			lock.exclude = [];
		}
		const declared = [...lock.include, ...lock.exclude].map(entry => entry.source).sort();
		if (names.join("\n") !== declared.join("\n")) {
			throw new Error(`classify every upstream name in ${LOCK}; unclassified: ${names.filter(name => !declared.includes(name)).join(", ") || "none"}; absent upstream: ${declared.filter(name => !names.includes(name)).join(", ") || "none"}`);
		}
		const rendered = new Map<string, { bytes: Buffer; mode: number }>();
		const copiedSources = new Set<string>();
		const skillNames = names.filter(isSkill).map(name => posix.basename(name));
		for (const entry of lock.include.filter(entry => entry.vendored)) {
			for (const child of isSkill(entry.source) ? walk(join(source, entry.source)) : [""]) {
				const sourceFile = join(source, entry.source, child);
				const destination = child ? `${entry.destination}/${child}` : entry.destination;
				const stat = noSymlinkStat(source, sourceFile);
				if (!stat?.isFile()) throw new Error(`not a regular source file: ${sourceFile}`);
				const bytes = readFileSync(sourceFile);
				copiedSources.add(posix.join(entry.source, child));
				rendered.set(destination, { bytes: destination.endsWith(".md") ? wrap(bytes, destination, skillNames) : bytes, mode: stat.mode & 0o111 ? 0o755 : 0o644 });
			}
			if (isSkill(entry.source)) {
				noSymlinkStat(source, join(source, entry.source, "SKILL.md"));
				const frontmatter = readFileSync(join(source, entry.source, "SKILL.md"), "utf8").match(/^---\n([\s\S]*?)\n---/)?.[1];
				if (frontmatter && YAML.parse(frontmatter)["disable-model-invocation"] === true) rendered.set(`${entry.destination}/agents/openai.yaml`, { bytes: Buffer.from(SIDECAR), mode: 0o644 });
			}
		}
		const patches = readPatches(root, lock);
		if (new Set(patches.map(patch => patch.source)).size !== patches.length) throw new Error(`${PATCHES}: one patch file per primitive is required`);
		for (const patch of patches) {
			for (const edit of patch.edits) {
				const destination = edit.file ? `${patch.destination}/${edit.file}` : patch.destination;
				const target = rendered.get(destination);
				if (!target) throw new Error(`${patch.file}: missing patch target ${destination}`);
				const text = target.bytes.toString("utf8");
				const at = text.indexOf(edit.before);
				if (at < 0 || text.indexOf(edit.before, at + edit.before.length) >= 0) throw new Error(`${patch.file}: expected one exact match in ${destination}`);
				target.bytes = Buffer.from(text.slice(0, at) + edit.after + text.slice(at + edit.before.length));
			}
			for (const removal of patch.remove ?? []) {
				const destination = `${patch.destination}/${removal.file}`;
				const sourceFile = join(source, patch.source, removal.file);
				if (!rendered.has(destination) || !noSymlinkStat(source, sourceFile)?.isFile()
					|| sha256(readFileSync(sourceFile)) !== removal.sha256) throw new Error(`${patch.file}: removal source changed for ${destination}`);
				rendered.delete(destination);
			}
		}
		const destinations = new Set([LOCK, ...lock.include.filter(entry => entry.vendored).map(entry => entry.destination), ...Object.keys(previous.files), ...rendered.keys()]);
		for (const path of destinations) noSymlinkStat(root, join(root, path));
		for (const entry of lock.include.filter(entry => entry.vendored)) rmSync(join(root, entry.destination), { recursive: true, force: true });
		for (const file of Object.keys(previous.files)) if (!rendered.has(file)) rmSync(join(root, file), { force: true });
		const files: Record<string, string> = {};
		for (const [file, { bytes, mode }] of [...rendered].sort(([a], [b]) => a.localeCompare(b))) {
			mkdirSync(dirname(join(root, file)), { recursive: true });
			writeFileSync(join(root, file), bytes);
			chmodSync(join(root, file), mode);
			files[file] = sha256(bytes);
		}
		const references = walk(source).filter(file => !file.startsWith(".git/") && !copiedSources.has(file));
		writeFileSync(join(root, LOCK), `${JSON.stringify({ ...lock, commit, tree, "inventory-sha256": inventoryHash(names), patches: patches.map(({ source, file, reason, sha256 }) => ({ source, file, reason, sha256 })), references, files }, null, 2)}\n`);
		return files;
	} finally {
		rmSync(scratch, { recursive: true, force: true });
	}
}

if (import.meta.main) {
	try {
		const args = process.argv.slice(2);
		const all = args.includes("--all");
		if (all) args.splice(args.indexOf("--all"), 1);
		const root = resolve(import.meta.dir, "..");
		if (!all && args.length === 1 && args[0] === "--check") {
			const errors = checkPstack(root);
			if (errors.length) throw new Error(errors.join("\n"));
			console.log("pstack: pinned inventory and vendored sha256 files match (offline)");
		} else if (args[0] === "--update" && (args.length === 2 || args.length === 4 && args[2] === "--from")) {
			const files = await updatePstack(root, args[1], args[3], all);
			console.log(`pstack: synchronized ${Object.keys(files).length} files; commit the vendored files and ${LOCK}`);
		} else {
			throw new Error("Usage: bun scripts/sync-pstack.ts --check | --update <commit> [--from <dir>] [--all]");
		}
	} catch (error) {
		console.error(error instanceof Error ? error.message : String(error));
		process.exit(1);
	}
}

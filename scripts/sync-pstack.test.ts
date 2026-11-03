import { afterEach, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { chmodSync, copyFileSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, readlinkSync, renameSync, rmSync, statSync, symlinkSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { checkPstack, updatePstack } from "./sync-pstack";
import type { PstackLock } from "./pstack-lock.mjs";

const roots: string[] = [];
afterEach(() => {
	for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

async function fixture(playbookHeading = "#", gitignore?: string) {
	const scratch = process.env.TMPDIR ?? join(homedir(), ".cache/tmp");
	mkdirSync(scratch, { recursive: true });
	const root = mkdtempSync(join(scratch, "pstack-test-"));
	roots.push(root);
	const source = join(root, "upstream/pstack");
	const put = (file: string, bytes: string | Buffer) => {
		mkdirSync(dirname(join(root, file)), { recursive: true });
		writeFileSync(join(root, file), bytes);
	};
	const plain = "---\nname: principle-proof\ndescription: Verify the artifact.\ndisable-model-invocation: true\n---\n\n# Proof\n\nKeep these bytes.\n";
	put("upstream/pstack/skills/principle-proof/SKILL.md", plain);
	put("upstream/pstack/skills/principle-proof/helper.sh", "#!/bin/sh\nprintf 'proof\\n'\n");
	chmodSync(join(source, "skills/principle-proof/helper.sh"), 0o755);
	put("upstream/pstack/skills/principle-proof/notes.md", "# Notes\n\nUse the `Task` tool.\n");
	put("upstream/pstack/skills/workflow/SKILL.md", "---\nname: workflow\ndescription: Work.\n---\n\n# Workflow\n\nUse generalPurpose.\n");
	put("upstream/pstack/skills/poteto-mode/SKILL.md", "# Upstream router\n");
	put("upstream/pstack/skills/poteto-mode/playbooks/bug-fix.md", `${playbookHeading} Bug fix\n\nUse \`subagent_type\` and \`run_in_background\`.\n`);
	put("skills/misty/harnesses/pstack-names.md", "# Names\n\n| pstack | Native |\n| --- | --- |\n| `Task`, `subagent_type`, `run_in_background`, `generalPurpose` | Native tools. |\n");
	put("upstream/pstack/agents/poteto-agent.md", "# Agent\n");
	const git = (...args: string[]) => {
		const result = Bun.spawnSync(["git", "-C", source, ...args], { stdout: "pipe", stderr: "pipe" });
		if (!result.success) throw new Error(result.stderr.toString());
		return result.stdout.toString().trim();
	};
	git("-c", "init.templateDir=", "init", "--quiet");
	git("add", "--force", ".");
	const include = [
		{ source: "skills/principle-proof", destination: "skills/principle-proof", vendored: true },
		{ source: "skills/workflow", destination: "skills/workflow", vendored: false },
		{ source: "skills/poteto-mode/playbooks/bug-fix.md", destination: "skills/misty/playbooks/bug-fix.md", vendored: true },
	];
	const exclude = [
		{ source: "skills/poteto-mode", reason: "Misty owns routing." },
		{ source: "agents/poteto-agent.md", reason: "Use native rigor agents." },
	];
	const names = [...include, ...exclude].map(entry => entry.source).sort();
	const lock: PstackLock = {
		repo: "cursor/plugins", commit: "a".repeat(40), tree: git("write-tree"),
		"inventory-sha256": createHash("sha256").update(`${names.join("\n")}\n`).digest("hex"),
		include, exclude, executables: [], files: {},
	};
	const save = () => put("vendor/pstack.lock.json", `${JSON.stringify(lock)}\n`);
	save();
	await updatePstack(root, lock.commit, join(root, "upstream"));
	if (gitignore !== undefined) {
		put(".gitignore", gitignore);
		const result = Bun.spawnSync(["git", "-c", "init.templateDir=", "-C", root, "init", "--quiet"], { stdout: "pipe", stderr: "pipe" });
		if (!result.success) throw new Error(result.stderr.toString());
	}
	const repin = () => {
		git("add", "--force", "--all");
		const current: PstackLock = JSON.parse(readFileSync(join(root, "vendor/pstack.lock.json"), "utf8"));
		current.tree = git("write-tree");
		put("vendor/pstack.lock.json", `${JSON.stringify(current)}\n`);
		return current;
	};
	return { root, source, put, plain, lock, save, repin };
}

function snapshot(path: string): unknown {
	const stat = lstatSync(path);
	if (stat.isSymbolicLink()) return { link: readlinkSync(path) };
	if (stat.isDirectory()) return Object.fromEntries(readdirSync(path).sort().map(name => [name, snapshot(join(path, name))]));
	return { mode: stat.mode & 0o777, bytes: readFileSync(path).toString("hex") };
}

function runSync(root: string, args: string[]) {
	mkdirSync(join(root, "scripts"), { recursive: true });
	const script = join(root, "scripts/sync-pstack.ts");
	copyFileSync(join(import.meta.dir, "sync-pstack.ts"), script);
	copyFileSync(join(import.meta.dir, "pstack-lock.mjs"), join(root, "scripts/pstack-lock.mjs"));
	return Bun.spawnSync([process.execPath, script, ...args], { cwd: root, stdout: "pipe", stderr: "pipe" });
}

test("sync preserves upstream bytes, executable support and explicit-only Codex policy", async () => {
	const { root, plain } = await fixture();
	expect(readFileSync(join(root, "skills/principle-proof/SKILL.md"), "utf8")).toBe(plain);
	expect(readFileSync(join(root, "skills/principle-proof/helper.sh"))).toEqual(readFileSync(join(root, "upstream/pstack/skills/principle-proof/helper.sh")));
	expect(statSync(join(root, "skills/principle-proof/helper.sh")).mode & 0o111).not.toBe(0);
	expect(readFileSync(join(root, "skills/principle-proof/agents/openai.yaml"), "utf8")).toBe("policy:\n  allow_implicit_invocation: false\n");
	expect(existsSync(join(root, "skills/workflow"))).toBe(false);
	expect(checkPstack(root)).toEqual([]);
});

test("only Markdown using Cursor names receives one harness pointer after its first heading", async () => {
	const { root, source, lock, save } = await fixture();
	expect(readFileSync(join(root, "skills/principle-proof/notes.md"), "utf8")).toBe("# Notes\n\nIn Mistystack, read [the pstack names adapter](../misty/harnesses/pstack-names.md) once per session before you follow this skill. It maps the Cursor names in pstack skills to your harness.\n\nUse the `Task` tool.\n");
	expect(readFileSync(join(root, "skills/misty/playbooks/bug-fix.md"), "utf8")).toContain("# Bug fix\n\nIn Mistystack, read [the pstack names adapter](../harnesses/pstack-names.md)");
	lock.include.find(entry => entry.source === "skills/workflow")!.vendored = true;
	save();
	await updatePstack(root, lock.commit, source);
	expect(readFileSync(join(root, "skills/workflow/SKILL.md"), "utf8").match(/In Mistystack/g)).toHaveLength(1);
	expect(existsSync(join(root, "skills/workflow/agents/openai.yaml"))).toBe(false);
	expect(checkPstack(root)).toEqual([]);
});

test("sync preserves a pstack H3 playbook and inserts only the harness pointer", async () => {
	const { root } = await fixture("###");
	expect(readFileSync(join(root, "skills/misty/playbooks/bug-fix.md"), "utf8")).toBe("### Bug fix\n\nIn Mistystack, read [the pstack names adapter](../harnesses/pstack-names.md) once per session before you follow this skill. It maps the Cursor names in pstack skills to your harness.\n\nUse `subagent_type` and `run_in_background`.\n");
	expect(checkPstack(root)).toEqual([]);
});

test.each([
	["hand edit", "sha256 mismatch", (root: string) => writeFileSync(join(root, "skills/principle-proof/SKILL.md"), "# Hand edited\n")],
	["unlisted file", "unlisted vendored file", (root: string) => writeFileSync(join(root, "skills/principle-proof/extra.md"), "# Extra\n")],
	["missing file", "missing vendored file", (root: string) => rmSync(join(root, "skills/principle-proof/SKILL.md"))],
	["missing executable bit", "executable bit mismatch", (root: string) => chmodSync(join(root, "skills/principle-proof/helper.sh"), 0o644)],
	["unexpected executable bit", "executable bit mismatch", (root: string) => chmodSync(join(root, "skills/principle-proof/SKILL.md"), 0o755)],
] as const)("offline check rejects %s and sync restores the pinned bytes and modes", async (_case, failure, mutate) => {
	const { root, source, lock } = await fixture();
	mutate(root);
	expect(checkPstack(root).join("\n")).toContain(failure);
	const result = runSync(root, ["--check"]);
	expect(result.exitCode).toBe(1);
	expect(result.stderr.toString()).toContain(failure);
	await updatePstack(root, lock.commit, source);
	expect(checkPstack(root)).toEqual([]);
});

test.each([
	["dependency file", "scripts/node_modules/dep/index.js", false],
	["dependency symlink", "scripts/node_modules/.bin/tool", true],
	["ignored file", "scripts/build.generated", false],
	["ignored symlink", "scripts/link.generated", true],
] as const)("offline check ignores git-ignored %s without traversing it", async (_name, file, symlink) => {
	const { root, put } = await fixture("#", "node_modules/\n*.generated\n");
	const destination = `skills/principle-proof/${file}`;
	if (symlink) {
		put("outside-dependency.js", "Dependency output is not vendored source.\n");
		mkdirSync(dirname(join(root, destination)), { recursive: true });
		symlinkSync(join(root, "outside-dependency.js"), join(root, destination));
	} else put(destination, "Dependency output is not vendored source.\n");
	const result = runSync(root, ["--check"]);
	expect(result.exitCode).toBe(0);
	expect(result.stderr.toString()).toBe("");
});

test.each(["file", "symlink"])("ignored dependency output does not exempt a non-ignored stray %s", async kind => {
	const { root, put } = await fixture("#", "node_modules/\n");
	put("skills/principle-proof/scripts/node_modules/dep/index.js", "Ignored dependency output.\n");
	const file = "skills/principle-proof/scripts/stray.js";
	if (kind === "symlink") {
		put("outside.js", "Not a vendored file.\n");
		symlinkSync(join(root, "outside.js"), join(root, file));
	} else put(file, "Not a vendored file.\n");
	const result = runSync(root, ["--check"]);
	expect(result.exitCode).toBe(1);
	expect(result.stderr.toString()).toContain(kind === "symlink" ? "symlink is not a vendored file" : "unlisted vendored file");
	expect(result.stderr.toString()).toContain(file);
});

test.each(["duplicate", "omitted"])("offline check rejects an upstream name that is %s", async mode => {
	const { root } = await fixture();
	const file = join(root, "vendor/pstack.lock.json");
	const lock: PstackLock = JSON.parse(readFileSync(file, "utf8"));
	if (mode === "duplicate") lock.exclude.push({ source: lock.include[0].source, reason: "Duplicate." });
	else lock.exclude.pop();
	writeFileSync(file, JSON.stringify(lock));
	expect(checkPstack(root).join("\n")).toContain(mode === "duplicate" ? "duplicate upstream name" : "upstream include/exclude inventory changed");
});

test("update rejects a source tree that is not the pinned pstack tree before writing", async () => {
	const { root, source, lock, put, plain } = await fixture();
	put("upstream/pstack/skills/principle-proof/SKILL.md", "# Wrong checkout\n");
	await expect(updatePstack(root, lock.commit, source)).rejects.toThrow("does not match");
	expect(readFileSync(join(root, "skills/principle-proof/SKILL.md"), "utf8")).toBe(plain);
});

test("CLI check needs no git, network or upstream checkout and fails nonzero on drift", async () => {
	const { root, put } = await fixture();
	mkdirSync(join(root, "scripts"));
	copyFileSync(join(import.meta.dir, "sync-pstack.ts"), join(root, "scripts/sync-pstack.ts"));
	copyFileSync(join(import.meta.dir, "pstack-lock.mjs"), join(root, "scripts/pstack-lock.mjs"));
	rmSync(join(root, "upstream"), { recursive: true });
	const run = () => Bun.spawnSync([process.execPath, join(root, "scripts/sync-pstack.ts"), "--check"], { cwd: root, env: { ...process.env, PATH: "" }, stdout: "pipe", stderr: "pipe" });
	expect(run().exitCode).toBe(0);
	put("skills/principle-proof/SKILL.md", "# Deliberate drift\n");
	const failed = run();
	expect(failed.exitCode).toBe(1);
	expect(failed.stderr.toString()).toContain("sha256 mismatch");
});

test.each([
	["skill directory", "skills/principle-proof"],
	["playbook file", "skills/poteto-mode/playbooks/bug-fix.md"],
	["skills directory", "skills"],
	["playbooks directory", "skills/poteto-mode/playbooks"],
	["agents directory", "agents"],
	["agent file", "agents/poteto-agent.md"],
	["skill entry point", "skills/principle-proof/SKILL.md"],
	["supporting file and mode", "skills/principle-proof/helper.sh"],
	["nested directory", "skills/principle-proof/nested"],
	["source root", "."],
])("CLI update refuses a symlinked source %s without copying outside bytes", async (name, component) => {
	const { root, source, put, repin } = await fixture();
	if (name === "nested directory") put("upstream/pstack/skills/principle-proof/nested/note.md", "# Nested\n");
	const outside = join(root, "outside");
	mkdirSync(outside);
	const path = resolve(source, component);
	const target = join(outside, "target");
	const directory = lstatSync(path).isDirectory();
	renameSync(path, target);
	writeFileSync(directory ? join(target, "outside-marker.md") : target, "# Outside bytes must not be vendored\n");
	symlinkSync(target, path);
	const lock = repin();
	const skillsBefore = snapshot(join(root, "skills"));
	const outsideBefore = snapshot(outside);
	const lockBefore = readFileSync(join(root, "vendor/pstack.lock.json"));
	const result = runSync(root, ["--update", lock.commit, "--from", source]);
	expect(result.exitCode).toBe(1);
	expect(result.stderr.toString()).toContain("symlink");
	expect(result.stderr.toString()).toContain(path);
	expect(result.stderr.toString()).not.toContain("does not match");
	expect(snapshot(join(root, "skills"))).toEqual(skillsBefore);
	expect(snapshot(outside)).toEqual(outsideBefore);
	expect(readFileSync(join(root, "vendor/pstack.lock.json"))).toEqual(lockBefore);
});

test.each([
	"skills",
	"skills/principle-proof",
	"skills/misty",
	"skills/misty/playbooks",
	"skills/principle-proof/agents",
	"skills/principle-proof/agents/openai.yaml",
	"skills/principle-proof/newdir",
	"vendor",
	"vendor/pstack.lock.json",
])("CLI update and offline check refuse symlinked destination %s before any writes", async component => {
	const { root, source, put, repin } = await fixture();
	if (component.endsWith("/newdir")) {
		put("upstream/pstack/skills/principle-proof/newdir/note.md", "# New source file\n");
		mkdirSync(join(root, component));
	}
	const lock = repin();
	const outside = join(root, "outside");
	mkdirSync(outside);
	const path = join(root, component);
	const target = join(outside, "target");
	renameSync(path, target);
	symlinkSync(target, path);
	const skillsBefore = snapshot(join(root, "skills"));
	const outsideBefore = snapshot(outside);
	const lockBefore = readFileSync(join(root, "vendor/pstack.lock.json"));
	for (const args of [["--check"], ["--update", lock.commit, "--from", source]]) {
		const result = runSync(root, args);
		expect(result.exitCode).toBe(1);
		expect(result.stderr.toString()).toContain("symlink");
		expect(result.stderr.toString()).toContain(path);
		expect(result.stderr.toString()).not.toContain("does not match");
		expect(snapshot(join(root, "skills"))).toEqual(skillsBefore);
		expect(snapshot(outside)).toEqual(outsideBefore);
		expect(readFileSync(join(root, "vendor/pstack.lock.json"))).toEqual(lockBefore);
	}
});

test("two CLI updates at the pin leave the lock and vendored tree byte-identical", async () => {
	const { root, source, lock } = await fixture();
	const before = { lock: readFileSync(join(root, "vendor/pstack.lock.json")), skills: snapshot(join(root, "skills")) };
	for (let run = 0; run < 2; run++) {
		const result = runSync(root, ["--update", lock.commit, "--from", source]);
		expect(result.exitCode).toBe(0);
		expect(readFileSync(join(root, "vendor/pstack.lock.json"))).toEqual(before.lock);
		expect(snapshot(join(root, "skills"))).toEqual(before.skills);
	}
});

test("CLI update accepts a real source beneath a symlinked parent without weakening source guards", async () => {
	const { root, lock } = await fixture();
	const alias = join(root, "upstream-alias");
	symlinkSync(join(root, "upstream"), alias);
	const before = snapshot(join(root, "skills"));
	const result = runSync(root, ["--update", lock.commit, "--from", join(alias, "pstack")]);
	expect(result.exitCode).toBe(0);
	expect(snapshot(join(root, "skills"))).toEqual(before);
	expect(checkPstack(root)).toEqual([]);
});

test.each(["arena", "the **arena** skill", "the `arena` skill", "`/arena`"])("offline check requires a route for an excluded named invocation: %s", async invocation => {
	const { root, source, lock, put, save, repin } = await fixture();
	put("upstream/pstack/skills/arena/SKILL.md", "# Arena\n");
	put("upstream/pstack/skills/principle-proof/notes.md", `# Notes\n\nUse ${invocation}.\n`);
	lock.exclude.push({ source: "skills/arena", reason: "Use the defined instruction trial." });
	lock["inventory-sha256"] = createHash("sha256").update(`${[...lock.include, ...lock.exclude].map(entry => entry.source).sort().join("\n")}\n`).digest("hex");
	save();
	repin();
	await updatePstack(root, lock.commit, source);
	expect(checkPstack(root).join("\n")).toContain("missing pstack adapter row for arena");
	put("skills/misty/harnesses/pstack-names.md", "# Names\n\n| pstack | Native |\n| --- | --- |\n| `Task`, `subagent_type`, `run_in_background`, `arena` | Native sessions. |\n");
	expect(checkPstack(root)).toEqual([]);
});

test("offline check rejects a missing harness key or cited router-section route", async () => {
	const { root, source, lock, put, repin } = await fixture();
	put("skills/misty/harnesses/pstack-names.md", "# No mappings\n");
	expect(checkPstack(root).join("\n")).toContain("missing pstack adapter row for Task");
	put("upstream/pstack/skills/principle-proof/notes.md", "# Notes\n\nRead poteto-mode's Subagents, Non-negotiables and Autonomy.\n");
	repin();
	await updatePstack(root, lock.commit, source);
	const errors = checkPstack(root).join("\n");
	for (const key of ["poteto-mode", "Subagents", "Non-negotiables", "Autonomy"]) expect(errors).toContain(`missing pstack adapter row for ${key}`);
	put("skills/misty/harnesses/pstack-names.md", "# Names\n\n| pstack | Native |\n| --- | --- |\n| `subagent_type`, `run_in_background`, `poteto-mode`, `Subagents`, `Non-negotiables`, `Autonomy` | Misty sections. |\n");
	expect(checkPstack(root)).toEqual([]);
});

test("routine sync preserves recorded exclusions, reference-only entries and non-default destinations", async () => {
	const { root, source, lock } = await fixture();
	const before = readFileSync(join(root, "vendor/pstack.lock.json"));
	await updatePstack(root, lock.commit, source);
	const current: PstackLock = JSON.parse(readFileSync(join(root, "vendor/pstack.lock.json"), "utf8"));
	expect(current.include).toEqual(lock.include);
	expect(current.exclude).toEqual(lock.exclude);
	expect(existsSync(join(root, "skills/workflow"))).toBe(false);
	expect(existsSync(join(root, "skills/poteto-mode/playbooks/bug-fix.md"))).toBe(false);
	expect(existsSync(join(root, "skills/misty/playbooks/bug-fix.md"))).toBe(true);
	expect(current.references).toContain("skills/workflow/SKILL.md");
	expect(readFileSync(join(root, "vendor/pstack.lock.json"))).toEqual(before);
	const obsolete = runSync(root, ["--update", lock.commit, "--from", source, "--all"]);
	expect(obsolete.exitCode).toBe(1);
	expect(obsolete.stderr.toString()).toContain("Usage:");
	expect(readFileSync(join(root, "vendor/pstack.lock.json"))).toEqual(before);
});

test("recorded primitive patches hash final bytes and reject changed or removed patch definitions offline", async () => {
	const { root, source, lock, put } = await fixture();
	const file = "vendor/pstack-patches/principle-proof.json";
	const patch = { source: "skills/principle-proof", reason: "Portable proof wording.", edits: [{ file: "SKILL.md", before: "Keep these bytes.", after: "Keep patched bytes." }] };
	put(file, JSON.stringify(patch));
	await updatePstack(root, lock.commit, source);
	const current: PstackLock = JSON.parse(readFileSync(join(root, "vendor/pstack.lock.json"), "utf8"));
	const content = readFileSync(join(root, "skills/principle-proof/SKILL.md"));
	expect(content.toString()).toContain("Keep patched bytes.");
	expect(current.files["skills/principle-proof/SKILL.md"]).toBe(createHash("sha256").update(content).digest("hex"));
	expect(current.patches).toEqual([{ source: patch.source, file, reason: patch.reason, sha256: createHash("sha256").update(JSON.stringify(patch)).digest("hex") }]);
	expect(checkPstack(root)).toEqual([]);
	await updatePstack(root, lock.commit, source);
	expect(readFileSync(join(root, "skills/principle-proof/SKILL.md"))).toEqual(content);
	put(file, JSON.stringify({ ...patch, reason: "A changed portability reason." }));
	expect(checkPstack(root).join("\n")).toContain("primitive patches changed");
	rmSync(join(root, file));
	expect(checkPstack(root).join("\n")).toContain("primitive patches changed");
});

test("offline CLI rejects a stale patched file even when the patch hash in the lock was updated", async () => {
	const { root, source, lock, put } = await fixture();
	const file = "vendor/pstack-patches/principle-proof.json";
	const patch = { source: "skills/principle-proof", reason: "Native history.", edits: [{ file: "SKILL.md", before: "Keep these bytes.", after: "Read native history." }] };
	put(file, JSON.stringify(patch));
	await updatePstack(root, lock.commit, source);
	patch.edits[0].after = "Read the active native session.";
	const bytes = JSON.stringify(patch);
	put(file, bytes);
	const current: PstackLock = JSON.parse(readFileSync(join(root, "vendor/pstack.lock.json"), "utf8"));
	current.patches![0].sha256 = createHash("sha256").update(bytes).digest("hex");
	put("vendor/pstack.lock.json", JSON.stringify(current));
	const result = runSync(root, ["--check"]);
	expect(result.exitCode).toBe(1);
	expect(result.stderr.toString()).toContain("patched content mismatch");
	await updatePstack(root, lock.commit, source);
	expect(runSync(root, ["--check"]).exitCode).toBe(0);
});

test("owner text-deletion patches reject restored text even when its file hash was updated", async () => {
	const { root, source, lock, put } = await fixture();
	const target = "skills/principle-proof/SKILL.md";
	const original = readFileSync(join(root, target));
	put("vendor/pstack-patches/principle-proof.json", JSON.stringify({ source: "skills/principle-proof", reason: "Retire an owner-superseded instruction.", edits: [{ file: "SKILL.md", before: "Keep these bytes.", after: "" }] }));
	await updatePstack(root, lock.commit, source);
	expect(runSync(root, ["--check"]).exitCode).toBe(0);
	put(target, original.toString());
	const current: PstackLock = JSON.parse(readFileSync(join(root, "vendor/pstack.lock.json"), "utf8"));
	current.files[target] = createHash("sha256").update(original).digest("hex");
	put("vendor/pstack.lock.json", JSON.stringify(current));
	const result = runSync(root, ["--check"]);
	expect(result.exitCode).toBe(1);
	expect(result.stderr.toString()).toContain("patched content mismatch");
	await updatePstack(root, lock.commit, source);
	expect(runSync(root, ["--check"]).exitCode).toBe(0);
});

test.each(["agent", "playbook"])("exact file-target patches support an empty child path for a %s", async kind => {
	const { root, source, lock, put, save } = await fixture();
	const entry = kind === "agent"
		? { source: "agents/poteto-agent.md", destination: "vendor/pstack-agents/poteto-agent.md", vendored: true }
		: lock.include.find(entry => entry.source.endsWith("bug-fix.md"))!;
	if (kind === "agent") {
		lock.exclude = lock.exclude.filter(item => item.source !== entry.source);
		lock.include.push(entry);
		save();
	}
	put("vendor/pstack-patches/file-target.json", JSON.stringify({ source: entry.source, reason: "Native file lookup.", edits: [{ file: "", before: kind === "agent" ? "# Agent" : "Bug fix", after: kind === "agent" ? "# Native agent" : "Native bug fix" }] }));
	await updatePstack(root, lock.commit, source);
	expect(checkPstack(root)).toEqual([]);
	expect(readFileSync(join(root, entry.destination), "utf8")).toContain(kind === "agent" ? "# Native agent" : "Native bug fix");
});

test("a patch changing invocation also generates the installed Codex explicit-only policy", async () => {
	const { root, source, lock, put, save } = await fixture();
	lock.include.find(entry => entry.source === "skills/workflow")!.vendored = true;
	save();
	put("vendor/pstack-patches/workflow.json", JSON.stringify({ source: "skills/workflow", reason: "Native setup is explicit-only.", edits: [{ file: "SKILL.md", before: "description: Work.", after: "description: Configure native roles.\ndisable-model-invocation: true" }] }));
	await updatePstack(root, lock.commit, source);
	expect(readFileSync(join(root, "skills/workflow/agents/openai.yaml"), "utf8")).toBe("policy:\n  allow_implicit_invocation: false\n");
	expect(checkPstack(root)).toEqual([]);
});

test.each(["stray patch file", "unregistered patch", "unknown primitive", "missing target"])("offline check rejects %s", async mode => {
	const { root, put } = await fixture();
	const patch = { source: mode === "unknown primitive" ? "skills/unknown" : "skills/principle-proof", reason: "Native lookup.", edits: [{ file: mode === "missing target" ? "missing.md" : "SKILL.md", before: "Keep these bytes.", after: "Read native history." }] };
	put(`vendor/pstack-patches/${mode === "stray patch file" ? "notes.txt" : "proof.json"}`, mode === "stray patch file" ? "Not a primitive JSON patch.\n" : JSON.stringify(patch));
	const result = runSync(root, ["--check"]);
	expect(result.exitCode).toBe(1);
	expect(result.stderr.toString()).toContain(mode === "stray patch file" ? "expected a primitive JSON patch" : mode === "unknown primitive" ? "invalid primitive patch" : mode === "missing target" ? "missing patch target" : "primitive patches changed");
});

test.each(["no match", "ambiguous match", "escaping target", "duplicate primitive", "symlink", "stray patch file", "unknown primitive", "missing target"])("invalid patch %s fails before changing the vendored artifact", async mode => {
	const { root, source, lock, put } = await fixture();
	const before = snapshot(join(root, "skills"));
	const lockBefore = readFileSync(join(root, "vendor/pstack.lock.json"));
	const file = "vendor/pstack-patches/principle-proof.json";
	const patch = { source: "skills/principle-proof", reason: "Port the primitive.", edits: [{ file: "SKILL.md", before: mode === "no match" ? "Absent bytes." : mode === "ambiguous match" ? "\n" : "Keep these bytes.", after: "Portable bytes." }] };
	if (mode === "escaping target") patch.edits[0].file = "../outside.md";
	put(file, JSON.stringify(patch));
	if (mode === "stray patch file") put("vendor/pstack-patches/notes.txt", "Not a primitive JSON patch.\n");
	if (mode === "unknown primitive") put(file, JSON.stringify({ ...patch, source: "skills/unknown" }));
	if (mode === "missing target") put(file, JSON.stringify({ ...patch, edits: [{ ...patch.edits[0], file: "missing.md" }] }));
	if (mode === "duplicate primitive") put("vendor/pstack-patches/duplicate.json", JSON.stringify(patch));
	if (mode === "symlink") {
		put("outside-patch.json", JSON.stringify(patch));
		rmSync(join(root, file));
		symlinkSync(join(root, "outside-patch.json"), join(root, file));
	}
	await expect(updatePstack(root, lock.commit, source)).rejects.toThrow();
	expect(snapshot(join(root, "skills"))).toEqual(before);
	expect(readFileSync(join(root, "vendor/pstack.lock.json"))).toEqual(lockBefore);
});

test("recorded removal deletes a retired upstream helper and remains stable on regeneration", async () => {
	const { root, source, lock, put } = await fixture();
	const helper = "skills/principle-proof/helper.sh";
	const patch = {
		source: "skills/principle-proof", reason: "The replacement procedure no longer uses this helper.", edits: [],
		remove: [{ file: "helper.sh", sha256: createHash("sha256").update(readFileSync(join(source, helper))).digest("hex") }],
	};
	put("vendor/pstack-patches/principle-proof.json", JSON.stringify(patch));
	await updatePstack(root, lock.commit, source);
	expect(existsSync(join(root, helper))).toBe(false);
	expect(checkPstack(root)).toEqual([]);
	const artifact = snapshot(join(root, "skills"));
	const current: PstackLock = JSON.parse(readFileSync(join(root, "vendor/pstack.lock.json"), "utf8"));
	expect(current.files[helper]).toBeUndefined();
	await updatePstack(root, lock.commit, source);
	expect(snapshot(join(root, "skills"))).toEqual(artifact);
	expect(checkPstack(root)).toEqual([]);
});

test.each(["changed bytes", "escaping target", "entry point", "duplicate target", "edited target"])("invalid removal %s preserves the installed tree and lock", async mode => {
	const { root, source, lock, put } = await fixture();
	const file = mode === "escaping target" ? "../outside.sh" : mode === "entry point" ? "SKILL.md" : "helper.sh";
	const removal = { file, sha256: mode === "changed bytes" ? "0".repeat(64) : createHash("sha256").update(readFileSync(join(source, "skills/principle-proof", mode === "entry point" ? "SKILL.md" : "helper.sh"))).digest("hex") };
	const patch = {
		source: "skills/principle-proof", reason: "Remove a retired helper.",
		edits: mode === "edited target" ? [{ file, before: "proof", after: "changed" }] : [],
		remove: mode === "duplicate target" ? [removal, removal] : [removal],
	};
	const artifact = snapshot(join(root, "skills"));
	const lockBefore = readFileSync(join(root, "vendor/pstack.lock.json"));
	put("vendor/pstack-patches/principle-proof.json", JSON.stringify(patch));
	await expect(updatePstack(root, lock.commit, source)).rejects.toThrow();
	expect(snapshot(join(root, "skills"))).toEqual(artifact);
	expect(readFileSync(join(root, "vendor/pstack.lock.json"))).toEqual(lockBefore);
});

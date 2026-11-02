import { afterEach, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { chmodSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { checkPstack, type PstackLock, updatePstack } from "./sync-pstack";

const roots: string[] = [];
afterEach(() => {
	for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

async function fixture() {
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
	put("upstream/pstack/skills/poteto-mode/playbooks/bug-fix.md", "# Bug fix\n\nUse `subagent_type` and `run_in_background`.\n");
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
		repo: "cursor/plugins", commit: "a".repeat(40), tree: git("write-tree"), "generated-at": "2026-11-02T00:00:00.000Z",
		"inventory-sha256": createHash("sha256").update(`${names.join("\n")}\n`).digest("hex"),
		include, exclude, files: {},
	};
	const save = () => put("vendor/pstack.lock.json", `${JSON.stringify(lock)}\n`);
	save();
	await updatePstack(root, lock.commit, join(root, "upstream"));
	return { root, source, put, plain, lock, save };
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

test("only Markdown using Cursor names receives one harness pointer after its H1", async () => {
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

test.each([
	["hand edit", "sha256 mismatch", (root: string) => writeFileSync(join(root, "skills/principle-proof/SKILL.md"), "# Hand edited\n")],
	["unlisted file", "unlisted vendored file", (root: string) => writeFileSync(join(root, "skills/principle-proof/extra.md"), "# Extra\n")],
	["missing file", "missing vendored file", (root: string) => rmSync(join(root, "skills/principle-proof/SKILL.md"))],
] as const)("offline check rejects a %s and sync restores the pinned bytes", async (_case, failure, mutate) => {
	const { root, source, lock } = await fixture();
	mutate(root);
	expect(checkPstack(root).join("\n")).toContain(failure);
	await updatePstack(root, lock.commit, source);
	expect(checkPstack(root)).toEqual([]);
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
	rmSync(join(root, "upstream"), { recursive: true });
	const run = () => Bun.spawnSync([process.execPath, join(root, "scripts/sync-pstack.ts"), "--check"], { cwd: root, env: { ...process.env, PATH: "" }, stdout: "pipe", stderr: "pipe" });
	expect(run().exitCode).toBe(0);
	put("skills/principle-proof/SKILL.md", "# Deliberate drift\n");
	const failed = run();
	expect(failed.exitCode).toBe(1);
	expect(failed.stderr.toString()).toContain("sha256 mismatch");
});

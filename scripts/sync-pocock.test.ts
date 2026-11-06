import { afterEach, expect, test } from "bun:test";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";

const roots: string[] = [];
afterEach(() => {
	for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

function fixture(skills: Record<string, string>) {
	const scratch = process.env.TMPDIR ?? join(homedir(), ".cache/tmp");
	mkdirSync(scratch, { recursive: true });
	const base = mkdtempSync(join(scratch, "sync-pocock-"));
	roots.push(base);
	const put = (path: string, content: string) => {
		mkdirSync(dirname(join(base, path)), { recursive: true });
		writeFileSync(join(base, path), content);
	};
	put("repo/vendor/pocock.lock.json", JSON.stringify({ repo: "mattpocock/skills", commit: "0".repeat(40), skills, files: {} }));
	put("victim/keep.txt", "outside the repository\n");
	put("upstream/skills/productivity/grilling/SKILL.md", "---\nname: grilling\ndescription: Grill.\n---\nAsk.\n");
	for (const file of ["sync-pocock.ts", "pocock-lock.mjs"]) {
		mkdirSync(join(base, "repo/scripts"), { recursive: true });
		copyFileSync(join(import.meta.dir, file), join(base, "repo/scripts", file));
	}
	const git = (...args: string[]) => Bun.spawnSync(["git", "-C", join(base, "upstream"), ...args], { stdout: "pipe", stderr: "pipe" });
	git("init", "-q");
	git("remote", "add", "origin", "https://github.com/mattpocock/skills.git");
	git("add", "-A");
	git("-c", "user.name=t", "-c", "user.email=t@example.com", "commit", "-qm", "upstream");
	const run = () => Bun.spawnSync([process.execPath, join(base, "repo/scripts/sync-pocock.ts"), join(base, "upstream")], { stdout: "pipe", stderr: "pipe" });
	return { base, run };
}

test("sync refuses a lock destination outside skills/ before deleting anything", () => {
	const { base, run } = fixture({ "skills/grilling": "skills/productivity/grilling", "../victim": "skills/productivity/grilling" });
	const result = run();
	expect(result.exitCode).not.toBe(0);
	expect(result.stderr.toString()).toContain("refusing skill mapping ../victim");
	expect(readFileSync(join(base, "victim/keep.txt"), "utf8")).toBe("outside the repository\n");
	expect(existsSync(join(base, "repo/skills/grilling"))).toBe(false);
});

test("sync copies a valid mapping and records its hashes at the checkout's commit", () => {
	const { base, run } = fixture({ "skills/grilling": "skills/productivity/grilling" });
	expect(run().exitCode).toBe(0);
	const lock = JSON.parse(readFileSync(join(base, "repo/vendor/pocock.lock.json"), "utf8"));
	expect(lock.commit).toMatch(/^[a-f0-9]{40}$/);
	expect(Object.keys(lock.files)).toEqual(["skills/grilling/SKILL.md"]);
	expect(readFileSync(join(base, "repo/skills/grilling/SKILL.md"), "utf8")).toContain("name: grilling");
});

import { afterEach, expect, test } from "bun:test";
import { chmodSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { readSkillLocks, SKILL_UPSTREAMS } from "./skill-locks.mjs";

const roots: string[] = [];
afterEach(() => {
	for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

function fixture(skills: Record<string, string>, pack = "pocock") {
	const upstream = SKILL_UPSTREAMS.find((source) => source.pack === pack)!;
	const scratch = process.env.TMPDIR ?? join(homedir(), ".cache/tmp");
	mkdirSync(scratch, { recursive: true });
	const base = mkdtempSync(join(scratch, "sync-skills-"));
	roots.push(base);
	const put = (path: string, content: string) => {
		mkdirSync(dirname(join(base, path)), { recursive: true });
		writeFileSync(join(base, path), content);
	};
	put(`repo/${upstream.lock}`, JSON.stringify({ repo: upstream.repo, commit: "0".repeat(40), skills, files: {} }));
	put("victim/keep.txt", "outside the repository\n");
	put("upstream/skills/productivity/grilling/SKILL.md", "---\nname: grilling\ndescription: Grill.\n---\nAsk.\n");
	put("upstream/.agents/skills/merge-risk/SKILL.md", "---\nname: merge-risk\ndescription: Assess merge risk.\n---\nAssess.\n");
	put("upstream/.agents/skills/merge-risk/scripts/extract.py", "#!/usr/bin/env python3\nprint('conflicts')\n");
	chmodSync(join(base, "upstream/.agents/skills/merge-risk/scripts/extract.py"), 0o755);
	for (const file of ["sync-skills.ts", "skill-locks.mjs"]) {
		mkdirSync(join(base, "repo/scripts"), { recursive: true });
		copyFileSync(join(import.meta.dir, file), join(base, "repo/scripts", file));
	}
	const git = (...args: string[]) => Bun.spawnSync(["git", "-C", join(base, "upstream"), ...args], { stdout: "pipe", stderr: "pipe" });
	git("init", "-q");
	git("remote", "add", "origin", `https://github.com/${upstream.repo}.git`);
	git("add", "-A");
	git("-c", "user.name=t", "-c", "user.email=t@example.com", "commit", "-qm", "upstream");
	const run = () => Bun.spawnSync([process.execPath, join(base, "repo/scripts/sync-skills.ts"), upstream.lock, join(base, "upstream")], { stdout: "pipe", stderr: "pipe" });
	return { base, run, upstream };
}

test("sync refuses a lock destination outside skills/ before deleting anything", () => {
	const { base, run } = fixture({ "skills/grilling": "skills/productivity/grilling", "../victim": "skills/productivity/grilling" });
	const result = run();
	expect(result.exitCode).not.toBe(0);
	expect(result.stderr.toString()).toContain("refusing skill mapping ../victim");
	expect(readFileSync(join(base, "victim/keep.txt"), "utf8")).toBe("outside the repository\n");
	expect(existsSync(join(base, "repo/skills/grilling"))).toBe(false);
});

test.each(["../victim", ".agents/skills/../../victim", ".agents/skills/merge-risk/extra", "skills/productivity/grilling"])("Warp refuses source %s before copying", (source) => {
	const { base, run } = fixture({ "skills/merge-risk": source }, "Warp");
	expect(run().stderr.toString()).toContain("refusing skill mapping");
	expect(existsSync(join(base, "repo/skills/merge-risk"))).toBe(false);
});

test.each([
	["pocock", "grilling", "skills/productivity/grilling"],
	["Warp", "merge-risk", ".agents/skills/merge-risk"],
])("sync copies %s layout and records hashes and provenance", (pack, name, source) => {
	const { base, run, upstream } = fixture({ [`skills/${name}`]: source }, pack);
	expect(run().exitCode).toBe(0);
	const root = join(base, "repo");
	const lock = JSON.parse(readFileSync(join(root, upstream.lock), "utf8"));
	expect(lock.commit).toMatch(/^[a-f0-9]{40}$/);
	const file = `skills/${name}/SKILL.md`;
	expect(readFileSync(join(root, file), "utf8")).toContain(`name: ${name}`);
	const result = readSkillLocks(root);
	expect(result.errors).toEqual([]);
	expect(result.files.get(file)).toMatchObject({ pack, repo: upstream.repo, commit: lock.commit, source: `${source}/SKILL.md` });
	if (pack === "Warp") expect(statSync(join(root, `skills/${name}/scripts/extract.py`)).mode & 0o111).toBe(0o111);
	writeFileSync(join(root, file), "edited");
	expect(readSkillLocks(root).errors).toContain(`${file}: differs from ${upstream.repo}@${lock.commit}; vendored bytes are not hand-edited`);
});

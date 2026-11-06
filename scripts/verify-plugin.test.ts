import { afterEach, expect, test } from "bun:test";
import { chmodSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { lintPlugin, verifyAvailableInstalls, verifyInstall, verifyNativeInstall } from "./verify-plugin";

const roots: string[] = [];
afterEach(() => {
	for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

function fixture() {
	const scratch = process.env.TMPDIR ?? join(homedir(), ".cache/tmp");
	mkdirSync(scratch, { recursive: true });
	const root = mkdtempSync(join(scratch, "plugin-lint-"));
	roots.push(root);
	const put = (path: string, content: string) => {
		mkdirSync(dirname(join(root, path)), { recursive: true });
		writeFileSync(join(root, path), content);
	};
	const skill = (name: string, body = "Run the owned check.") => `---\nname: ${name}\ndescription: "When changing the consumer path."\n${name.startsWith("principle-") || name === "recompile" || name === "setup-mistystack" ? "disable-model-invocation: true\n" : ""}metadata:\n  owner: phaedrus\n  prevents: "A recorded consumer failure."\n  source: "owner/repo@0123456789abcdef/source"\n  sunset: "2026-11-27"\n---\n${body}\n`;
	put("skills/misty/SKILL.md", skill("misty"));
	put("rules/core.md", "---\nalwaysApply: true\n---\n# Core\n\n- Load misty.\n");
	const json = (path: string, value: unknown) => put(path, `${JSON.stringify(value)}\n`);
	const hooks = (variable: string) => ({ SessionStart: [{ hooks: [{ type: "command", command: `cat "$${variable}/rules/core.md"` }] }] });
	const lock = (value: object) => json("vendor/pstack.lock.json", { repo: "cursor/plugins", commit: "a".repeat(40), tree: "b".repeat(40), "inventory-sha256": "c".repeat(64), exclude: [], executables: [], ...value });
	const marketplace = { name: "mistystack", owner: { name: "Fixture owner" }, plugins: [{ name: "mistystack", source: "./" }] };
	json(".claude-plugin/plugin.json", { name: "mistystack", agents: ["./adapters/claude/agents/fixture.md"], hooks: hooks("CLAUDE_PLUGIN_ROOT") });
	json(".claude-plugin/marketplace.json", marketplace);
	json(".codex-plugin/plugin.json", { name: "mistystack", version: "1.0.0", skills: "./skills/", hooks: "./adapters/codex/hooks.json" });
	json(".agents/plugins/marketplace.json", {
		name: "mistystack",
		plugins: [{ name: "mistystack", source: { source: "local", path: "./" }, policy: { installation: "AVAILABLE", authentication: "ON_USE" }, category: "Productivity" }],
	});
	json("adapters/codex/hooks.json", { hooks: hooks("PLUGIN_ROOT") });
	json(".omp-plugin/plugin.json", { name: "mistystack", version: "1.0.0", skills: "./skills" });
	json(".omp-plugin/marketplace.json", marketplace);
	json("package.json", { name: "mistystack", version: "1.0.0", keywords: ["pi-package"], omp: {}, pi: { skills: ["./skills"], extensions: ["./adapters/pi/core.ts"] } });
	put("adapters/claude/agents/fixture.md", "---\nname: fixture\ndescription: Fixture worker.\n---\nComplete the assigned task.\n");
	put("agents/fixture.md", "---\nname: fixture\ndescription: Fixture worker.\n---\nComplete the assigned task.\n");
	put("adapters/pi/core.ts", 'import { readFileSync } from "node:fs";\nexport default function core(pi) {\nconst core = readFileSync(new URL("../../rules/core.md", import.meta.url), "utf8");\npi.on("before_agent_start", event => ({ systemPrompt: `${event.systemPrompt}\\n${core}` }));\n}\n');
	return { root, put, skill, json, lock };
}

test.each([
	".claude-plugin/plugin.json", ".claude-plugin/marketplace.json",
	".codex-plugin/plugin.json", ".agents/plugins/marketplace.json",
	".omp-plugin/plugin.json", ".omp-plugin/marketplace.json", "package.json",
])("requires a JSON object at native manifest %s", file => {
	const { root, put } = fixture();
	put(file, "{");
	expect(lintPlugin(root).errors.some(error => error.startsWith(`${file}:`))).toBe(true);
	put(file, "[]\n");
	expect(lintPlugin(root).errors).toContain(`${file}: must be a JSON object`);
	rmSync(join(root, file));
	expect(lintPlugin(root).errors).toContain(`${file}: missing manifest`);
});
test("a malformed pstack lock names the file needing repair", () => {
	const { root, put } = fixture();
	put("vendor/pstack.lock.json", "{");
	expect(lintPlugin(root).errors.some(error => error.startsWith("vendor/pstack.lock.json:"))).toBe(true);
});

test.each([
	[".claude-plugin/plugin.json", "name must be non-empty"],
	[".codex-plugin/plugin.json", "version must be non-empty"],
	[".omp-plugin/plugin.json", "version must be non-empty"],
	[".claude-plugin/marketplace.json", "owner.name must be non-empty"],
	[".agents/plugins/marketplace.json", "plugins must be a non-empty array"],
	[".omp-plugin/marketplace.json", "plugins must be a non-empty array"],
	["package.json", "keywords must include pi-package"],
])("checks required native manifest fields in %s", (file, error) => {
	const { root, json } = fixture();
	json(file, {});
	expect(lintPlugin(root).errors).toContain(`${file}: ${error}`);
});

test.each([".claude-plugin/plugin.json", ".codex-plugin/plugin.json", ".omp-plugin/plugin.json", "package.json"])(
	"rejects a second skills tree registered by %s",
	file => {
		const { root, put, skill, json } = fixture();
		put("other-skills/misty/SKILL.md", skill("misty"));
		const manifest = JSON.parse(readFileSync(join(root, file), "utf8"));
		if (file === "package.json") manifest.pi.skills = ["./other-skills"];
		else manifest.skills = "./other-skills";
		json(file, manifest);
		expect(lintPlugin(root).errors).toContain(`${file}: skills must reference the shared root skills/`);
	},
);

test.each([
	"adapters/claude/agents/fixture.md",
	"adapters/codex/hooks.json", "adapters/pi/core.ts",
])("rejects a missing declared native component %s", file => {
	const { root } = fixture();
	rmSync(join(root, file));
	expect(lintPlugin(root).errors.some(error => error.includes(`missing file ./${file}`))).toBe(true);
});

test("requires OMP's native root agents rather than an ignored manifest agents field", () => {
	const { root, json } = fixture();
	rmSync(join(root, "agents/fixture.md"));
	expect(lintPlugin(root).errors).toContain("agents/: no native OMP agents found");
	const manifest = JSON.parse(readFileSync(join(root, ".omp-plugin/plugin.json"), "utf8"));
	manifest.agents = ["./adapters/omp/agents/fixture.md"];
	json(".omp-plugin/plugin.json", manifest);
	expect(lintPlugin(root).errors).toContain(".omp-plugin/plugin.json: OMP discovers root agents/; manifest agents is unsupported");
});

test("an explicit OMP package manifest prevents fallback to pi's core extension", () => {
	const { root, json } = fixture();
	const manifest = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
	delete manifest.omp;
	json("package.json", manifest);
	expect(lintPlugin(root).errors).toContain("package.json: omp must be an explicit object to prevent pi adapter fallback");
	manifest.omp = { extensions: ["./adapters/pi/core.ts"] };
	json("package.json", manifest);
	expect(lintPlugin(root).errors).toContain("package.json: omp.extensions must not register pi's core extension");
});

test("Claude defaults to root skills only when the skills field is omitted", () => {
	const { root, json } = fixture();
	expect(lintPlugin(root).errors).toEqual([]);
	const manifest = JSON.parse(readFileSync(join(root, ".claude-plugin/plugin.json"), "utf8"));
	manifest.skills = null;
	json(".claude-plugin/plugin.json", manifest);
	expect(lintPlugin(root).errors).toContain(".claude-plugin/plugin.json: skills must reference the shared root skills/");
});

test.each(["claude", "codex"])("requires the %s SessionStart core registration", harness => {
	const { root, json } = fixture();
	const file = `.${harness}-plugin/plugin.json`;
	if (harness === "claude") {
		const manifest = JSON.parse(readFileSync(join(root, file), "utf8"));
		manifest.hooks = {};
		json(file, manifest);
	} else json("adapters/codex/hooks.json", { hooks: {} });
	expect(lintPlugin(root).errors.some(error => error.startsWith(`${file}: SessionStart must register`))).toBe(true);
});

test("requires the core extension, not just any existing pi extension", () => {
	const { root, put, json } = fixture();
	put("adapters/pi/unrelated.ts", "export const unrelated = true;\n");
	const manifest = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
	manifest.pi.extensions = ["./adapters/pi/unrelated.ts"];
	json("package.json", manifest);
	expect(lintPlugin(root).errors).toContain("package.json: pi.extensions must register adapters/pi/core.ts");
});

test("rejects native paths escaping the plugin, including symlinks", () => {
	const { root, json } = fixture();
	const foreign = fixture().root;
	const file = ".claude-plugin/plugin.json";
	const manifest = JSON.parse(readFileSync(join(root, file), "utf8"));
	manifest.agents = ["../outside.md"];
	json(file, manifest);
	expect(lintPlugin(root).errors).toContain(`${file}: agents: path must stay inside the plugin: ../outside.md`);
	symlinkSync(join(foreign, "skills/misty/SKILL.md"), join(root, "adapters/claude/agents/escape.md"));
	manifest.agents = ["./adapters/claude/agents/escape.md"];
	json(file, manifest);
	expect(lintPlugin(root).errors).toContain(`${file}: agents: path must stay inside the plugin: ./adapters/claude/agents/escape.md`);
});

test("Codex marketplace policy and local source are required, not just its plugin name", () => {
	const { root, json } = fixture();
	json(".agents/plugins/marketplace.json", { name: "mistystack", plugins: [{ name: "mistystack", source: "./" }] });
	const errors = lintPlugin(root).errors;
	expect(errors).toContain(".agents/plugins/marketplace.json: plugin source must be local");
	expect(errors).toContain(".agents/plugins/marketplace.json: plugin policy must use installation AVAILABLE and authentication ON_USE");
});

test.each([
	{ source: "github", repo: "owner/skills", sha: "a".repeat(40) },
	{ source: "git-subdir", url: "https://github.com/owner/skills.git", path: "plugins/design", sha: "b".repeat(40) },
])("accepts a pinned OMP catalog source without requiring local files", source => {
	const { root, json } = fixture();
	json(".omp-plugin/marketplace.json", { name: "mistystack", owner: { name: "Fixture owner" }, plugins: [{ name: "mistystack", source: "./" }, { name: "catalog-skill", source }] });
	expect(lintPlugin(root).errors).toEqual([]);
});

test.each([
	{ source: "github", repo: "owner/skills", ref: "main" },
	{ source: "github", repo: "owner/skills", sha: "abc123" },
	{ source: "github", repo: "owner/skills", sha: "z".repeat(40) },
])("rejects branch-only and incomplete OMP catalog pins", source => {
	const { root, json } = fixture();
	json(".omp-plugin/marketplace.json", { name: "mistystack", owner: { name: "Fixture owner" }, plugins: [{ name: "mistystack", source: "./" }, { name: "catalog-skill", source }] });
	expect(lintPlugin(root).errors).toContain(".omp-plugin/marketplace.json: catalog-skill: catalog source requires a full 40-hex sha");
});

test.each([
	[{ source: "github", repo: "not-a-repository", sha: "a".repeat(40) }, "github source requires owner/repo"],
	[{ source: "git-subdir", url: "file:///outside", path: "plugin", sha: "a".repeat(40) }, "git-subdir source requires an HTTPS repository URL"],
	[{ source: "git-subdir", url: "https://github.com/owner/skills.git", path: "../outside", sha: "a".repeat(40) }, "git-subdir source requires an in-repository path"],
	[{ source: "npm", package: "uninstalled", sha: "a".repeat(40) }, "catalog source must use github or git-subdir"],
])("rejects malformed OMP catalog sources", (source, message) => {
	const { root, json } = fixture();
	json(".omp-plugin/marketplace.json", { name: "mistystack", owner: { name: "Fixture owner" }, plugins: [{ name: "mistystack", source: "./" }, { name: "catalog-skill", source }] });
	expect(lintPlugin(root).errors).toContain(`.omp-plugin/marketplace.json: catalog-skill: ${message}`);
});

function expectStrictWarnings(root: string, warnings: string[]) {
	const report = lintPlugin(root);
	expect(report.errors).toEqual([]);
	expect(report.warnings).toEqual(warnings.toSorted((a, b) => a.localeCompare(b)));
	expect(lintPlugin(root, true)).toEqual({ skillCount: report.skillCount, errors: report.warnings, warnings: [] });
}

function runPlugin(root: string, args: string[], path = "") {
	mkdirSync(join(root, "scripts"), { recursive: true });
	copyFileSync(join(import.meta.dir, "verify-plugin.ts"), join(root, "scripts/verify-plugin.ts"));
	copyFileSync(join(import.meta.dir, "pstack-lock.mjs"), join(root, "scripts/pstack-lock.mjs"));
	copyFileSync(join(import.meta.dir, "pocock-lock.mjs"), join(root, "scripts/pocock-lock.mjs"));
	const result = Bun.spawnSync([process.execPath, join(root, "scripts/verify-plugin.ts"), ...args], {
		cwd: root,
		env: { ...process.env, HOME: root, PATH: path },
		stdout: "pipe",
		stderr: "pipe",
	});
	return { code: result.exitCode, out: result.stdout.toString(), err: result.stderr.toString() };
}

test("accepts relative inline and reference links, supporting files and named skills", () => {
	const { root, put, skill } = fixture();
	put("skills/misty/SKILL.md", skill("misty", [
		"Read [research](../research/SKILL.md#start) and apply the `principle-proof` skill.",
		"Read the `research` skill and [fix](playbooks/fix.md?raw=1#repair).",
		"Keep the [notice][license], [settings][] and [notes].",
		"Open [angle](<playbooks/fix complete.md>) and [encoded](playbooks/fix%20complete.md?raw=1#done).",
		"Open [parentheses](playbooks/fix(complete).md) and [root notice](../../LICENSE).",
		"",
		'[license]: ../research/LICENSE "MIT notice"',
		"[settings]: ../research/settings.json",
		"[notes]: playbooks/fix.md",
	].join("\n")));
	put("skills/research/SKILL.md", skill("research"));
	put("skills/principle-proof/SKILL.md", skill("principle-proof"));
	put("skills/research/LICENSE", "MIT notice.\n");
	put("skills/research/settings.json", "{}\n");
	put("skills/misty/playbooks/fix.md", "Read [research](../../research/SKILL.md).\n");
	put("skills/misty/playbooks/fix complete.md", "Completed fix.\n");
	put("skills/misty/playbooks/fix(complete).md", "Completed fix.\n");
	put("LICENSE", "Repository notice.\n");
	put("rules/core.md", "---\nalwaysApply: true\n---\nRead [router](../skills/misty/SKILL.md#misty).\n");
	expect(lintPlugin(root, true)).toEqual({ skillCount: 3, errors: [], warnings: [] });
});

test("relative directory links stay reachable and missing targets still fail", () => {
	const { root, put, skill } = fixture();
	const examples = "skills/misty/references/examples";
	put("skills/misty/SKILL.md", skill("misty", "[Examples](references/examples/) and [same directory](references/examples)."));
	put(`${examples}/README.md`, "# Examples\n");
	expect(lintPlugin(root, true).errors).toEqual([]);
	rmSync(join(root, examples), { recursive: true });
	expect(lintPlugin(root, true).errors).toEqual([`skills/misty/SKILL.md: missing reference ${examples}`]);
	put(`${examples}/fixture.json`, "{}\n");
	expect(lintPlugin(root, true).errors).toEqual([]);
	put("skills/misty/SKILL.md", skill("misty", "[Missing file](references/examples/missing.md)."));
	expect(lintPlugin(root, true).errors).toEqual([`skills/misty/SKILL.md: missing reference ${examples}/missing.md`]);
});

test("does not treat illustrative Markdown, external links or same-file anchors as missing files", () => {
	const { root, put, skill } = fixture();
	put("skills/misty/SKILL.md", skill("misty", [
		"[web](https://example.com/missing.md), [mail](mailto:agent@example.com), [host](//example.com/missing.md).",
		"[absolute](/missing.md), [anchor](#missing), [query](?raw=1#missing) and [empty]().",
		"Inline examples: `[missing](missing-inline.md)` and ``the `misty` skill``.",
		"Escaped example: \\[missing](missing-escaped.md).",
		"",
		"~~~markdown",
		"[missing](missing-fenced.md)",
		"[guide][reference]",
		"[reference]: missing-reference.md",
		"Use the `misty` skill.",
		"~~~",
		"",
		"    [missing](missing-indented.md)",
		"",
		"> ```markdown",
		"> [missing](missing-quoted.md)",
		"> ```",
	].join("\n")));
	expect(lintPlugin(root, true)).toEqual({ skillCount: 1, errors: [], warnings: [] });
});

test("reports every missing metadata field and a mismatched directory name", () => {
	const { root, put } = fixture();
	put("skills/misty/SKILL.md", "---\nname: other\ndescription: ''\nmetadata: {}\n---\nBody.\n");
	expect(lintPlugin(root).errors).toEqual([
		"skills/misty/SKILL.md: name must equal directory misty",
		"skills/misty/SKILL.md: description must be non-empty",
		"skills/misty/SKILL.md: metadata.owner must be non-empty",
		"skills/misty/SKILL.md: metadata.prevents must be non-empty",
		"skills/misty/SKILL.md: metadata.source must be non-empty",
		"skills/misty/SKILL.md: metadata.sunset must be a non-empty string",
	]);
});

test("lock-listed vendored skills keep upstream metadata but still require names, descriptions and explicit-only principles", () => {
	const { root, put, lock } = fixture();
	const file = "skills/principle-upstream/SKILL.md";
	const source = "---\nname: principle-upstream\ndescription: Check the artifact.\ndisable-model-invocation: true\n---\n# Upstream\n";
	put(file, source);
	lock({
		include: [{ source: "skills/principle-upstream", destination: "skills/principle-upstream", vendored: true }],
		files: { [file]: "a".repeat(64) },
	});
	expect(lintPlugin(root, true).errors).toEqual([]);
	put(file, source.replace("name: principle-upstream", "name: other").replace("description: Check the artifact.", "description: ''").replace("disable-model-invocation: true", "disable-model-invocation: false"));
	expect(lintPlugin(root).errors).toEqual([
		`${file}: name must equal directory principle-upstream`,
		`${file}: description must be non-empty`,
		`${file}: disable-model-invocation must be true`,
	]);
	put(file, source);
	lock({
		include: [{ source: "skills/principle-upstream", destination: "skills/principle-upstream", vendored: false }],
		files: {},
	});
	expect(lintPlugin(root).errors).toContain(`${file}: metadata.source must be non-empty`);
});

test.each(["poteto-mode", "poteto-help"])("wholesale %s remains explicit-only without acquiring Misty metadata", name => {
	const { root, put, lock } = fixture();
	const file = `skills/${name}/SKILL.md`;
	const source = `---\nname: ${name}\ndescription: Upstream entry.\ndisable-model-invocation: true\n---\n# Upstream\n`;
	put(file, source);
	lock({ include: [{ source: `skills/${name}`, destination: `skills/${name}`, vendored: true }], files: { [file]: "a".repeat(64) } });
	expect(lintPlugin(root, true).errors).toEqual([]);
	put(file, source.replace("disable-model-invocation: true", "disable-model-invocation: false"));
	expect(lintPlugin(root, true).errors).toEqual([`${file}: disable-model-invocation must be true`]);
});

test("Pocock-locked skills keep upstream metadata only while their bytes and file set match the lock", () => {
	const { root, put, json } = fixture();
	const file = "skills/grilling/SKILL.md";
	const source = "---\nname: grilling\ndescription: Grill the user about a plan.\n---\nAsk the frontier.\n";
	put(file, source);
	json("vendor/pocock.lock.json", { repo: "mattpocock/skills", commit: "a".repeat(40), skills: { "skills/grilling": "skills/productivity/grilling" }, files: { [file]: new Bun.CryptoHasher("sha256").update(source).digest("hex") } });
	expect(lintPlugin(root, true).errors).toEqual([]);
	put(file, source.replace("Ask the frontier.", "Ask one question."));
	expect(lintPlugin(root, true).errors).toEqual([`${file}: differs from mattpocock/skills@${"a".repeat(40)}; vendored bytes are not hand-edited`]);
	put(file, source);
	put("skills/grilling/notes.md", "# Local addition\n");
	expect(lintPlugin(root, true).errors).toEqual(["skills/grilling/notes.md: not recorded in vendor/pocock.lock.json; run bun scripts/sync-pocock.ts"]);
	rmSync(join(root, "vendor/pocock.lock.json"));
	rmSync(join(root, "skills/grilling/notes.md"));
	expect(lintPlugin(root).errors).toContain(`${file}: metadata.owner must be non-empty`);
});

test("the maintained gate does not execute upstream script-bundle suites", () => {
	const { root, put, lock } = fixture();
	const file = "skills/upstream/SKILL.md";
	const suite = "skills/upstream/bundle.test.ts";
	put(file, "---\nname: upstream\ndescription: Upstream entry.\n---\n# Upstream\n");
	put(suite, 'throw new Error("Upstream suite must run through its own toolchain");\n');
	put("consumer.test.ts", 'import { test, expect } from "bun:test"; test("maintained consumer", () => expect(true).toBe(true));\n');
	lock({ include: [{ source: "skills/upstream", destination: "skills/upstream", vendored: true }], files: { [file]: "a".repeat(64), [suite]: "b".repeat(64) } });
	const result = runPlugin(root, ["--strict", "--lint-only"]);
	expect(result.code).toBe(0);
	expect(result.err).toContain("maintained consumer");
	expect(result.err).not.toContain("Upstream suite must run");
});

test("vendored prompt examples are literals, while actual file links and Misty references remain strict", () => {
	const { root, put, lock, skill } = fixture();
	const file = "skills/upstream/SKILL.md";
	const prompt = "skills/upstream/references/synthesizer-prompt.md";
	put(file, "---\nname: upstream\ndescription: Upstream entry.\n---\n# Upstream\n");
	put(prompt, "# Prompt template\n\nSource: [Citation](citation-url).\n");
	put("skills/misty/harnesses/pstack-names.md", "# Names\n\n| pstack | Native |\n| --- | --- |\n| `deslop` | Native diff review. |\n");
	lock({ include: [{ source: "skills/upstream", destination: "skills/upstream", vendored: true }], files: { [file]: "a".repeat(64), [prompt]: "b".repeat(64) } });
	expect(lintPlugin(root, true).errors).toEqual([]);
	put(prompt, "# Prompt template\n\n[Broken](missing.md). Read the `deslop` skill.\n");
	expect(lintPlugin(root, true).errors).toEqual([`${prompt}: missing reference skills/upstream/references/missing.md`]);
	put(prompt, "# Prompt template\n");
	put("skills/misty/SKILL.md", skill("misty", "Read the `deslop` skill."));
	expect(lintPlugin(root, true).errors).toEqual(["skills/misty/SKILL.md: unknown skill deslop (missing skills/deslop/SKILL.md)"]);
});

test("only locked vendored files may refer to classified, unvendored upstream targets", () => {
	const { root, put, lock, skill } = fixture();
	const file = "skills/principle-upstream/SKILL.md";
	const notes = "skills/principle-upstream/reference.md";
	put(file, "---\nname: principle-upstream\ndescription: Check the artifact.\ndisable-model-invocation: true\n---\n# Upstream\n");
	put(notes, "[Excluded](../upstream-excluded/SKILL.md) and [pending](../upstream-pending/SKILL.md). Read the `upstream-excluded` skill.\n");
	lock({
		include: [
			{ source: "skills/principle-upstream", destination: "skills/principle-upstream", vendored: true },
			{ source: "skills/upstream-pending", destination: "skills/upstream-pending", vendored: false },
		],
		exclude: [{ source: "skills/upstream-excluded", reason: "Misty override." }],
		files: { [file]: "a".repeat(64), [notes]: "b".repeat(64) },
	});
	expect(lintPlugin(root, true).errors).toEqual([]);
	put(notes, "[Typo](../upstream-missing/SKILL.md)\n");
	expect(lintPlugin(root, true).errors).toContain(`${notes}: missing reference skills/upstream-missing/SKILL.md`);
	put(notes, "Read the `upstream-missing` skill.\n");
	expect(lintPlugin(root, true).errors).toContain(`${notes}: unknown skill upstream-missing (missing skills/upstream-missing/SKILL.md)`);
	put(notes, "[Excluded](../upstream-excluded/SKILL.md)\n");
	put("skills/misty/SKILL.md", skill("misty", "[Excluded](../upstream-excluded/SKILL.md)"));
	expect(lintPlugin(root, true).errors).toEqual(["skills/misty/SKILL.md: missing reference skills/upstream-excluded/SKILL.md"]);
});

test("vendored playbook routing resolves local siblings and only classified upstream-only targets", () => {
	const { root, put, lock, skill } = fixture();
	const file = "skills/misty/playbooks/bug-fix.md";
	const refactoring = "skills/misty/playbooks/refactoring.md";
	put("skills/misty/SKILL.md", skill("misty", "[Bug fix](playbooks/bug-fix.md) and [Refactoring](playbooks/refactoring.md)."));
	put(file, "### Bug fix\n\nRead [refactoring](refactoring.md), [shipping](shipping.md) and [how](../../how/SKILL.md). Read the `how` skill.\n");
	put(refactoring, "### Refactoring\n\nPin the behavior.\n");
	lock({
		include: [
			{ source: "skills/poteto-mode/playbooks/bug-fix.md", destination: file, vendored: true },
			{ source: "skills/poteto-mode/playbooks/refactoring.md", destination: refactoring, vendored: true },
			{ source: "skills/how", destination: "skills/how", vendored: false },
		],
		exclude: [{ source: "skills/poteto-mode/playbooks/shipping.md", reason: "Ship-loop owns delivery." }],
		files: { [file]: "a".repeat(64), [refactoring]: "b".repeat(64) },
	});
	expect(lintPlugin(root, true).errors).toEqual([]);
	put(file, "[Missing](missing.md)\n");
	expect(lintPlugin(root, true).errors).toEqual([`${file}: missing reference skills/misty/playbooks/missing.md`]);
	put(file, "### Bug fix\n");
	put("skills/misty/SKILL.md", skill("misty", "[Retired](playbooks/refactor.md)"));
	expect(lintPlugin(root, true).errors).toEqual(["skills/misty/SKILL.md: missing reference skills/misty/playbooks/refactor.md"]);
});

test.each(["2026-11-27", "2026-11-27 # YAML 1.1 timestamp", "2026-11-27T00:00:00Z", "!!timestamp 2026-11-27"])(
	"rejects a plain YAML date that YAML 1.1 readers cannot serialize (%s)",
	value => {
		const { root, put, skill } = fixture();
		put("skills/misty/SKILL.md", skill("misty").replace('sunset: "2026-11-27"', `sunset: ${value}`));
		expect(lintPlugin(root).errors).toEqual([
			"skills/misty/SKILL.md: quote YAML date values for JSON-compatible metadata",
		]);
	},
);

test.each(["42", "[2026, 11, 27]", "{year: 2026}", "false", "null"])(
	"requires metadata.sunset to parse as a non-empty string (%s)",
	value => {
		const { root, put, skill } = fixture();
		put("skills/misty/SKILL.md", skill("misty").replace('sunset: "2026-11-27"', `sunset: ${value}`));
		expect(lintPlugin(root).errors).toEqual([
			"skills/misty/SKILL.md: metadata.sunset must be a non-empty string",
		]);
	},
);

test("rejects invalid frontmatter rather than recovering a malformed skill", () => {
	const { root, put } = fixture();
	put("skills/misty/SKILL.md", "name: misty\n");
	expect(lintPlugin(root).errors).toEqual(["skills/misty/SKILL.md: missing YAML frontmatter"]);
});

test("requires a boolean alwaysApply core and at most twenty body lines", () => {
	const { root, put } = fixture();
	put("rules/core.md", `---\nalwaysApply: 'true'\n---\n${Array.from({ length: 21 }, (_, i) => `- Rule ${i}`).join("\n")}\n`);
	expect(lintPlugin(root).errors).toEqual([
		"rules/core.md: alwaysApply must be true",
		"rules/core.md: 21 body lines exceeds 20",
	]);
});

test.each([
	"skills/misty/SKILL.md",
	"skills/misty/playbooks/feature.md",
	"skills/principle-proof/SKILL.md",
	"rules/review.md",
])("warns on missing relative targets in %s and rejects them in strict mode", file => {
	const { root, put, skill } = fixture();
	const body = "Read [missing](missing.json?raw=1#proof).";
	put(file, file.endsWith("/SKILL.md") ? skill(file.split("/")[1], body) : body);
	expectStrictWarnings(root, [`${file}: missing reference ${join(dirname(file), "missing.json")}`]);
});


test.each([
	["full", "Read [details][guide].\n\n[guide]: missing.md"],
	["collapsed", 'Read [guide][].\n\n[guide]: <missing.md> "Guide"'],
	["shortcut", "Read [guide].\n\n[guide]: missing.md"],
])("validates dangling %s reference-style Markdown links", (_style, body) => {
	const { root, put, skill } = fixture();
	put("skills/misty/SKILL.md", skill("misty", body));
	expectStrictWarnings(root, ["skills/misty/SKILL.md: missing reference skills/misty/missing.md"]);
});

test("reports malformed encoded reference destinations without crashing", () => {
	const { root, put, skill } = fixture();
	put("skills/misty/SKILL.md", skill("misty", "Read [details][guide].\n\n[guide]: notes%ZZ.md"));
	expectStrictWarnings(root, ["skills/misty/SKILL.md: invalid relative link notes%ZZ.md (malformed percent encoding)"]);
});

test.each([
	"skills/misty/SKILL.md",
	"skills/misty/playbooks/feature.md",
	"skills/principle-proof/SKILL.md",
	"rules/review.md",
])("validates named-skill phrases in %s with strict warning promotion", file => {
	const { root, put, skill } = fixture();
	const body = "Use the `missing` skill.";
	put(file, file.endsWith("/SKILL.md") ? skill(file.split("/")[1], body) : body);
	expectStrictWarnings(root, [`${file}: unknown skill missing (missing skills/missing/SKILL.md)`]);
});

test.each([
	"``Use the `missing` skill.``",
	"```text\nUse the `missing` skill.\n```",
])("validates named skills even inside quoted instructions (%s)", body => {
	const { root, put, skill } = fixture();
	put("skills/misty/SKILL.md", skill("misty", body));
	expectStrictWarnings(root, ["skills/misty/SKILL.md: unknown skill missing (missing skills/missing/SKILL.md)"]);
});

test("validates skill names in generated brief source outside Markdown", () => {
	const { root, put } = fixture();
	put("skills/misty/brief.ts", 'export const brief = "Read the `missing` skill.";\n');
	expectStrictWarnings(root, ["skills/misty/brief.ts: unknown skill missing (missing skills/missing/SKILL.md)"]);
});

test("a named skill needs SKILL.md, not just a directory with supporting files", () => {
	const { root, put, skill } = fixture();
	put("skills/misty/SKILL.md", skill("misty", "Use the `empty` skill."));
	put("skills/empty/notes.md", "Not a skill entrypoint.\n");
	expectStrictWarnings(root, ["skills/misty/SKILL.md: unknown skill empty (missing skills/empty/SKILL.md)"]);
});

test("a missing router is an error even when another valid skill exists", () => {
	const { root, put, skill } = fixture();
	rmSync(join(root, "skills/misty/SKILL.md"));
	put("skills/research/SKILL.md", skill("research"));
	expect(lintPlugin(root).errors).toEqual(["skills/misty/SKILL.md: missing router"]);
});

test.each(["principle-proof", "recompile", "setup-mistystack"])(
	"requires boolean true to keep %s explicit-only",
	name => {
		const { root, put, skill } = fixture();
		const file = `skills/${name}/SKILL.md`;
		const source = skill(name).replace("disable-model-invocation: true\n", "");
		for (const invocation of ["", "disable-model-invocation: false\n", "disable-model-invocation: 'true'\n"]) {
			put(file, source.replace("metadata:\n", `${invocation}metadata:\n`));
			expect(lintPlugin(root).errors).toEqual([`${file}: disable-model-invocation must be true`]);
		}
		put(file, source.replace("metadata:\n", "disable-model-invocation: true\nmetadata:\n"));
		expect(lintPlugin(root).errors).toEqual([]);
	},
);

test.each([
	["skills/misty/SKILL.md", "skill://"],
	["skills/misty/playbooks/feature.md", "xd://"],
	["skills/release-watch/ship-loop.ts", "skill://"],
	["skills/release-watch/ship-loop.test.ts", "xd://"],
	["skills/setup-mistystack/SKILL.md", "skill://"],
	["rules/core.md", "xd://"],
	["rules/helper.ts", "skill://"],
	["skills/misty/harnesses-other/notes.md", "xd://"],
])("rejects literal harness URI in %s (%s) only in strict mode", (file, scheme) => {
	const { root, put, skill } = fixture();
	const body = file.endsWith(".ts") ? `export const target = ${JSON.stringify(`${scheme}example`)};\n` : `\`\`\`text\n${scheme}example\n\`\`\`\n`;
	put(file, file.endsWith("/SKILL.md") ? skill(file.split("/")[1], body) : file === "rules/core.md" ? `---\nalwaysApply: true\n---\n${body}` : body);
	expectStrictWarnings(root, [`${file}: harness-specific URI ${scheme} is only allowed in skills/misty/harnesses/`]);
});

test("allows both harness URI schemes only inside the disclosed harness directory", () => {
	const { root, put } = fixture();
	put("skills/misty/harnesses/omp.md", "Read [native](skill://misty), use `xd://lsp`, then return to [router](../SKILL.md).\n");
	put("skills/misty/harnesses/example.ts", 'export const targets = ["skill://misty", "xd://lsp"];\n');
	expect(lintPlugin(root, true)).toEqual({ skillCount: 1, errors: [], warnings: [] });
});

test("missing native CLIs are explicit skips, not successful install proofs", async () => {
	const { root } = fixture();
	const results = await verifyAvailableInstalls(root, undefined, {});
	expect(results.map(result => result.harness)).toEqual(["claude", "codex", "omp", "pi"]);
	expect(results.every(result => result.status === "SKIP")).toBe(true);
	expect(results.some(result => result.status === "PASS")).toBe(false);
});

test("strict lint failures exit nonzero before tests or installation", () => {
	const { root, put, skill } = fixture();
	put("skills/misty/SKILL.md", skill("misty", "Read [missing](missing.md)."));
	const result = runPlugin(root, ["--strict", "--lint-only"]);
	expect(result.code).toBe(1);
	expect(result.err).toContain("missing reference skills/misty/missing.md");
	expect(result.out).toContain("1 errors");
	expect(result.out).not.toContain("Verification complete");
});

test("plugin help explains strict lint without requiring OMP", () => {
	const { root } = fixture();
	const result = runPlugin(root, ["--help"]);
	expect(result.code).toBe(0);
	expect(result.out).toContain("--strict fails on broken relative Markdown links, unknown skill names and harness-specific URIs");
	expect(result.out).toContain("outside skills/misty/harnesses/");
	expect(result.out).toContain("--lint-only skips installation");
});

test("an escaping config path is refused before any install command", () => {
	const { root, put } = fixture();
	const trace = join(root, "omp-commands");
	const omp = join(root, "omp");
	put("omp", `#!/bin/sh\nprintf '%s\\n' "$*" >> ${JSON.stringify(trace)}\nprintf '%s\\n' ${JSON.stringify(join(root, "foreign-profile"))}\n`);
	chmodSync(omp, 0o700);
	expect(() => verifyInstall(root, omp, "fixture/model")).toThrow("isolation refused");
	expect(readFileSync(trace, "utf8")).toBe("config path\n");
});

test.each([
	["For a whole-project audit, new project setup or stack decision: run all twelve Foundation articles and make the project adhere.", true],
	["For a whole-project audit, new project setup or stack decision: run all twelve Foundation articles…", true],
	["When working on any project, run every Foundation checklist item.", false],
	[undefined, false],
] as const)("checks the named Foundation trigger in the native description (%j)", (description, accepted) => {
	const { root, put, skill } = fixture();
	const sourceDescription = "For a whole-project audit, new project setup or stack decision: run all twelve Foundation articles and make the project adhere.";
	put("skills/foundation/SKILL.md", skill("foundation").replace("When changing the consumer path.", sourceDescription));
	put("skills/foundation/checklist.md", "# Constitution\n\n## Conformance\n\nReal product proof.\n");
	for (const name of ["recompile", "setup-mistystack"]) put(`skills/${name}/SKILL.md`, skill(name));
	const skills = [
		`- misty: ${sourceDescription}`,
		...(description === undefined ? [] : [`- foundation: ${description}`]),
	];
	const frame = JSON.stringify({
		type: "response", id: "plugin-proof", success: true,
		data: {
			systemPrompt: [`# Core\n\n- Load misty.\n<skills>\n${skills.join("\n")}\n</skills>`],
			dumpTools: [{ name: "task", description: "fixture" }],
		},
	});
	const trace = join(root, "omp-reads");
	put("omp", `#!/bin/sh
case "$1" in
  config) printf '%s\\n' "$PI_CODING_AGENT_DIR" ;;
  launch) printf '%s\\n' '${frame}' ;;
  read) printf '%s\\n' "$2" >> ${JSON.stringify(trace)}; if [ "$2" = "skill://foundation/checklist.md" ]; then cat ${JSON.stringify(join(root, "skills/foundation/checklist.md"))}; else printf 'Run the owned check.\\n'; fi ;;
  *) printf 'Installed fixture\\n' ;;
esac
`);
	chmodSync(join(root, "omp"), 0o700);
	if (accepted) {
		expect(() => verifyInstall(root, join(root, "omp"), "fixture/model")).not.toThrow();
		expect(readFileSync(trace, "utf8")).toContain("skill://recompile\n");
		expect(readFileSync(trace, "utf8")).toContain("skill://setup-mistystack\n");
	} else {
		expect(() => verifyInstall(root, join(root, "omp"), "fixture/model")).toThrow("foundation's installed trigger is missing");
	}
});

test.each(["readable", "unreadable", "listed", "stale-checklist", "missing-conformance"])("checks installed explicit-only leaves and conformance (%s)", state => {
	const { root, put, skill } = fixture();
	put("skills/principle-alpha/SKILL.md", skill("principle-alpha", "Alpha's independent procedure."));
	put("skills/principle-omega/SKILL.md", skill("principle-omega", "Omega's independent procedure."));
	const foundationDescription = "For a whole-project audit, new project setup or stack decision: run all twelve Foundation articles and make the project adhere.";
	put("skills/foundation/SKILL.md", skill("foundation").replace("When changing the consumer path.", foundationDescription));
	put("skills/foundation/checklist.md", `# Constitution\n\n## ${state === "missing-conformance" ? "Other" : "Conformance"}\n\nReal product proof.\n`);
	const trace = join(root, "omp-commands");
	const omp = join(root, "omp");
	const prompt = `# Core\n\n- Load misty.\n<skills>\n- misty: Fixture router.\n- foundation: ${foundationDescription}\n${state === "listed" ? "- principle-omega: Leaked leaf.\n" : ""}</skills>`;
	const response = JSON.stringify({
		type: "response", id: "plugin-proof", success: true,
		data: { systemPrompt: [prompt], dumpTools: [{ name: "task", description: "fixture" }] },
	});
	const omega = state === "unreadable" ? "printf '%s\\n' 'Unavailable procedure'" : `cat ${JSON.stringify(join(root, "skills/principle-omega/SKILL.md"))}`;
	const checklist = state === "stale-checklist" ? "printf '%s\\n' '## Conformance'" : `cat ${JSON.stringify(join(root, "skills/foundation/checklist.md"))}`;
	put("omp", `#!/bin/sh
printf '%s\\n' "$*" >> ${JSON.stringify(trace)}
case "$1 $2" in
  "config path") printf '%s\\n' "$PI_CODING_AGENT_DIR" ;;
  "plugin marketplace"|"plugin install") ;;
  "launch --mode") printf '%s\\n' ${JSON.stringify(response)} ;;
  "read skill://misty") cat ${JSON.stringify(join(root, "skills/misty/SKILL.md"))} ;;
  "read skill://principle-alpha") cat ${JSON.stringify(join(root, "skills/principle-alpha/SKILL.md"))} ;;
  "read skill://principle-omega") ${omega} ;;
  "read skill://foundation/checklist.md") ${checklist} ;;
  *) exit 1 ;;
esac
`);
	chmodSync(omp, 0o700);
	const verify = () => verifyInstall(root, omp, "fixture/model");
	if (state === "listed") expect(verify).toThrow("explicit-only skill leaked into the model's skill list");
	else if (state === "unreadable") expect(verify).toThrow("skill://principle-omega is not readable");
	else if (state === "stale-checklist" || state === "missing-conformance") expect(verify).toThrow("installed checklist conformance is missing or differs from the candidate");
	else {
		expect(verify).not.toThrow();
		const commands = readFileSync(trace, "utf8");
		for (const name of ["principle-alpha", "principle-omega"]) expect(commands).toContain(`read skill://${name}\n`);
		expect(commands).toContain("read skill://foundation/checklist.md\n");
	}
});

test.each(["claude", "codex", "pi"] as const)("refuses leaked %s state before installing and removes its scratch home", async harness => {
	const { root, put } = fixture();
	const trace = join(root, "native-commands");
	const state = join(root, "native-state");
	const executable = join(root, harness);
	const response = harness === "claude" ? '[{"id":"foreign","enabled":true}]' : JSON.stringify({ id: 1, result: { codexHome: root } });
	const leak = harness === "pi" ?
		`printf '%s\\n' '{"packages":["foreign-package"]}' > "$PI_CODING_AGENT_DIR/settings.json"\nprintf 'Foreign package\\n'` :
		`${harness === "codex" ? 'IFS= read -r request\n' : ""}printf '%s\\n' ${JSON.stringify(response)}`;
	put(harness, `#!/bin/sh\nprintf '%s\\n' "$*" >> ${JSON.stringify(trace)}\nprintf '%s\\n' "$HOME" "$CLAUDE_CONFIG_DIR" "$CODEX_HOME" "$PI_CODING_AGENT_DIR" > ${JSON.stringify(state)}\n${leak}\n`);
	chmodSync(executable, 0o700);
	await expect(verifyNativeInstall(root, harness, executable)).rejects.toThrow("isolation refused");
	expect(readFileSync(trace, "utf8")).toBe(harness === "pi" ? "list --no-approve\n" : harness === "codex" ? "app-server --listen stdio://\n" : "plugin list --json\n");
	const [home, ...configs] = readFileSync(state, "utf8").trim().split("\n");
	expect(home).not.toBe(process.env.HOME);
	for (const config of configs) expect(config.startsWith(`${home}/`)).toBe(true);
	expect(existsSync(home)).toBe(false);
});

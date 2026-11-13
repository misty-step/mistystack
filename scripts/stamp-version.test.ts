import { afterEach, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { MANIFESTS, stampVersion } from "./stamp-version";

const roots: string[] = [];
afterEach(() => {
	for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

function fixture(changelog: string) {
	const scratch = process.env.TMPDIR ?? join(homedir(), ".cache/tmp");
	mkdirSync(scratch, { recursive: true });
	const root = mkdtempSync(join(scratch, "stamp-version-"));
	roots.push(root);
	writeFileSync(join(root, "CHANGELOG.md"), changelog);
	for (const file of MANIFESTS) {
		mkdirSync(dirname(join(root, file)), { recursive: true });
		writeFileSync(join(root, file), '{\n  "name": "mistystack",\n  "plugins": [{ "name": "mistystack",\n      "version": "0.2.49" },\n    { "name": "other", "sha": "abc" }]\n}\n');
	}
	return root;
}

test("the newest changelog release is written to every native manifest and nothing else changes", () => {
	const root = fixture("# [1.4.0](https://example.test) (2026-11-10)\n\n# [1.3.9](https://example.test) (2026-11-01)\n");
	expect(stampVersion(root, true).stale).toHaveLength(MANIFESTS.length);
	expect(readFileSync(join(root, "package.json"), "utf8")).toContain('"version": "0.2.49"');
	expect(stampVersion(root).version).toBe("1.4.0");
	for (const file of MANIFESTS) {
		expect(readFileSync(join(root, file), "utf8")).toBe('{\n  "name": "mistystack",\n  "plugins": [{ "name": "mistystack",\n      "version": "1.4.0" },\n    { "name": "other", "sha": "abc" }]\n}\n');
	}
	expect(stampVersion(root, true).stale).toEqual([]);
});

test("a changelog without a release or a manifest without a version is an error, not a silent pass", () => {
	expect(() => stampVersion(fixture("# Changelog\n"))).toThrow("CHANGELOG.md names no release");
	const root = fixture("# [1.4.0](https://example.test) (2026-11-10)\n");
	writeFileSync(join(root, "package.json"), "{}\n");
	expect(() => stampVersion(root)).toThrow("package.json: no version field");
});

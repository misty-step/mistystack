#!/usr/bin/env python3
"""Reject TruffleHog findings except pinned public commit-link and lock-digest false positives."""

import json
import re
import subprocess
import sys
from pathlib import Path


# Split pinned public hashes so the gate itself never trips the secret scanners.
PUBLIC_COMMIT = "789ae58ddd" + "0aecad3406" + "3f53304665" + "f215a9418a"
SENTRY_LOCK_SHA256 = "2d4f83048eac1df5" + "30b399e2aed75dd7" + "c9c18577b7665420" + "aaeb96d0ceb0b702"
CLOUDFLARE_AUDIT_COMMIT = "c1c8a8c147" + "1069fb0e18" + "8eeaff69b8" + "e8db6564a8"
OPENCLAW_COMMIT = "80930af448" + "ebabc84174" + "146b56bc10" + "6d37fab3b4"

ALLOWED_REFERENCES: tuple[tuple[str, str, str, re.Pattern[str]], ...] = (
    (
        "CHANGELOG.md",
        "GitHubOauth2",
        PUBLIC_COMMIT[:20],
        re.compile(r"https://github\.com/misty-step/harness/commit/" + PUBLIC_COMMIT + r"\)"),
    ),
    (
        ".gitleaks.toml",
        "SentryToken",
        SENTRY_LOCK_SHA256,
        re.compile(r'"skills/why/references/sources/sentry\\\.md": "' + SENTRY_LOCK_SHA256 + r'"(?![0-9a-fA-F])'),
    ),
    (
        "ATTRIBUTION.md",
        "CloudflareApiToken",
        CLOUDFLARE_AUDIT_COMMIT,
        re.compile(r"cloudflare/security-audit-skill@" + CLOUDFLARE_AUDIT_COMMIT + r"(?=[/\]])"),
    ),
    (
        "ATTRIBUTION.md",
        "CloudflareApiToken",
        OPENCLAW_COMMIT,
        re.compile(r"https://github\.com/openclaw/openclaw/tree/" + OPENCLAW_COMMIT + r"/\.agents/skills/test-audit\)"),
    ),
    (
        "skills/security-audit/SKILL.md",
        "CloudflareApiToken",
        CLOUDFLARE_AUDIT_COMMIT,
        re.compile(
            r"(?:https://github\.com/cloudflare/security-audit-skill/blob/"
            + CLOUDFLARE_AUDIT_COMMIT
            + r"/skills/security-audit/SKILL\.md\)|`cloudflare/security-audit-skill` at `"
            + CLOUDFLARE_AUDIT_COMMIT
            + r"`)"
        ),
    ),
)


def allowed_public_hash_finding(finding: object, file_cache: dict[str, list[str]]) -> bool:
    if not isinstance(finding, dict) or finding.get("Verified") is not False:
        return False
    metadata = finding.get("SourceMetadata")
    data = metadata.get("Data") if isinstance(metadata, dict) else None
    source = data.get("Filesystem") if isinstance(data, dict) else None
    if not isinstance(source, dict):
        return False
    file_path = source.get("file")
    line = source.get("line")
    raw = finding.get("Raw")
    detector = finding.get("DetectorName")
    if not isinstance(file_path, str) or type(line) is not int or line < 1:
        return False

    matching = [rule for rule in ALLOWED_REFERENCES if rule[0] == file_path and rule[1] == detector and rule[2] == raw]
    if not matching:
        return False

    lines = file_cache.get(file_path)
    if lines is None:
        try:
            lines = Path(file_path).read_text(encoding="utf-8").splitlines()
        except (OSError, UnicodeError):
            return False
        file_cache[file_path] = lines
    if line > len(lines):
        return False
    target = lines[line - 1]
    return any(pattern.search(target) is not None for _, _, _, pattern in matching)


def main() -> int:
    try:
        result = subprocess.run(
            ["trufflehog", "filesystem", ".", "--exclude-paths=.githooks/trufflehog-exclude.txt",
             "--no-verification", "--no-update", "--fail", "--fail-on-scan-errors", "--json"],
            capture_output=True, text=True, check=False,
        )
        file_cache = {"CHANGELOG.md": Path("CHANGELOG.md").read_text(encoding="utf-8").splitlines()}
    except (OSError, UnicodeError):
        print("trufflehog: scanner or changelog unavailable", file=sys.stderr)
        return 1
    if result.returncode == 0 and not result.stdout.strip():
        return 0
    if result.returncode != 183 or not result.stdout.strip():
        print("trufflehog: scan failed or returned unexpected output", file=sys.stderr)
        return 1
    count = 0
    for row in result.stdout.splitlines():
        try:
            finding = json.loads(row)
        except json.JSONDecodeError:
            print("trufflehog: malformed scanner result", file=sys.stderr)
            return 1
        if not allowed_public_hash_finding(finding, file_cache):
            print("trufflehog: finding outside public commit links", file=sys.stderr)
            return 1
        count += 1
    print(f"trufflehog: ignored {count} unverified public commit-SHA finding(s)", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())

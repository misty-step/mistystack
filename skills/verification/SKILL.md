---
name: verification
description: "Prove changed behavior on its real consumer path, create a missing repo verification skill, or maintain its feature map and check cadence."
metadata:
  owner: phaedrus
  prevents: "'Fix still fails / regression' (36 corrections); evidence-packet loaded in 12 audited sessions; changed-path scope repaired in mistystack PR #455."
  source: "Misty Step; provenance in ATTRIBUTION.md#skill-provenance."
  sunset: "2026-11-27"
---

# Verification

## 1. Name the proof

Tie each changed behavior to its story/request criterion, exact scenario,
outside check and expected observation before editing. Name the exact command,
journey or measurement. Choose the shortest real consumer path that can reject
the plausible defect; a mock, self-report or green unit suite alone is not that
boundary. For fixes, comparisons, persistence and performance, capture a baseline
with the same fixture; show the check rejecting the relevant base defect or an
injected fault, then passing on the candidate.

- Product journey: drive the built artifact through the repo's verification skill
  and feature map, in production-like isolation then on the live surface within
  authorized scope. Cover success, rejection and recovery where the change reaches
  them. Read consequential state at its owner; sender success is not delivery.
- Documents: read changed rendered/published text and check affected links/commands.
- Installed guidance/configuration: install, load and read the changed result.
- CLI/library/internal change: exercise the real consumer or composition boundary.

For a defect, trace its mechanism and fix the failure class at the highest layer
that can hold it: structure, automated check, guidance, then human review. Use the
`test-audit` skill to retain one primary proof per consumer contract.

Widen for shared config, lockfiles, auth, migrations or uncertain impact. Changed
interleavings need the model check, including a broken variant; reading the chart
is not execution. Required skipped or unavailable checks leave proof incomplete;
report the exact limit instead of substituting an easier check.

## 2. Drive and inspect

For missing proof, follow [create-verification-skill](../create-verification-skill/SKILL.md); the [names adapter](../misty/harnesses/pstack-names.md#routes) overrides both generators' Cursor paths. Keep one canonical source exposed through the active harness; repository instructions stay in `AGENTS.md`. A documents-only change does not inherit missing product infrastructure.

Add an Accounts section to the generated skill under the [QA sign-in contract](#qa-sign-in-contract);
mark unauthenticated surfaces n/a. Its Evidence section follows [evidence.md](evidence.md).
The vendored generator owns launch, doctor, drive, feature-map seeding, cleanup
and the end-to-end proof of its generated recipe.

Apply [Misty's rigor-gated delegation](../misty/SKILL.md#misty-deltas). Place execution through your environment's isolation skill. Use authorized disposable data and clean only
what the run created. Capture action and result, inspect each artifact, and publish proof
by [evidence.md](evidence.md). After a fix, recheck only the judge's named blockers
and fix-introduced regressions; link unchanged proof rather than rerun it.

Done when each criterion has an observed result at the named revision, linked
proof and owned cleanup, or an exact unproved claim and missing prerequisite.
Follow [pstack's reply rules](../poteto-mode/SKILL.md#writing-the-reply).

### QA sign-in contract

For a journey with sign-in, use a dedicated QA identity. Prove production sign-in
and the required owner/admin role through the real app. A sent email, HTTP 200
or login without the required role is not that proof. Missing access is
`owner sign-in UNPROVEN: needs <access/role>`; continue reachable proof and name
the blocked criterion.

## Commissioned upkeep

For a verification-skill/feature-map audit, follow pstack's
[maintain-verification-skill](../maintain-verification-skill/SKILL.md). Resolve the
target from the request and repository; ask only if they cannot disambiguate it.
Apply [Misty's rigor-gated delegation](../misty/SKILL.md#misty-deltas); combine small related source slices instead
of one agent per sentence. A feature not reached stays unverified, with the
exact prerequisite and attempted route, never passed.
For check placement, deletion or schedule repair, use [check-cadence.md](check-cadence.md).
For recurring product QA, agents use distinct user personas to walk pre-release
and live SPEC stories and file bugs/friction in the owned backlog. Such walks
prove behavior, not demand or benefit; compare actual use to the initiative's
outcome criterion before continuing, revising or stopping it.

---
name: verification
description: "Before merge, prove changed behavior against the real running app; generate missing real-path or formal verification skills and maintain their check cadence."
metadata:
  owner: phaedrus
  prevents: "'Fix still fails / regression' (36 corrections); evidence-packet loaded in 12 audited sessions; changed-path scope repaired in mistystack PR #455."
  source: "Misty Step; provenance in ATTRIBUTION.md#skill-provenance."
  sunset: "2026-11-27"
---

# Verification

Build, verify the changed real consumer path, then merge without CI,
independent review or a judge as a merge gate. The [delivery procedure](../ship-loop/SKILL.md)
places fast CI and one critical-correctness/security review at the pre-deploy
release gate, followed by deployment and a live journey check.

## 1. Name the proof

Tie each changed behavior to its story/request criterion, exact scenario,
outside check and expected observation before editing. Name the exact command,
journey or measurement. Choose the shortest real consumer path that can reject
the plausible defect; a mock, self-report or green unit suite alone is not that
boundary. For fixes, comparisons, persistence and performance, capture a baseline
with the same fixture; show the check rejecting the relevant base defect or an
injected fault, then passing on the candidate.

- Product journey: before merge, drive the built, running app through the repo's
  verification skill and feature map in production-like isolation. Cover success,
  rejection and recovery where the change reaches them. Read consequential state
  at its owner; sender success is not delivery. After deployment, repeat the
  changed journey on the live surface within authorized scope.
- Documents: read changed rendered/published text and check affected links/commands.
- Installed guidance/configuration: install, load and read the changed result.
- CLI/library/internal change: exercise the real consumer or composition boundary.

For a defect, trace its mechanism and fix the failure class at the highest layer
that can hold it: structure, automated check, guidance, then human review. Use the
`test-audit` skill to retain one primary proof per consumer contract.

Widen for shared config, lockfiles, auth, migrations or uncertain impact.
Ordering, concurrency and durability changes need the applicable formal check
below as well as running-app proof. Required skipped or unavailable checks leave
proof incomplete; report the exact limit instead of substituting an easier check.

## 2. Drive and inspect

For missing proof, follow [create-verification-skill](../create-verification-skill/SKILL.md); the [names adapter](../misty/harnesses/pstack-names.md#routes) overrides both generators' Cursor paths. Keep one canonical source exposed through the active harness; repository instructions stay in `AGENTS.md`. A documents-only change does not inherit missing product infrastructure.

Add an Accounts section to the generated skill under the [QA sign-in contract](#qa-sign-in-contract);
mark unauthenticated surfaces n/a. Its Evidence section follows [evidence.md](evidence.md).
The vendored generator owns launch, doctor, drive, feature-map seeding, cleanup
and the end-to-end proof of its generated recipe.

Apply [Misty's delegation procedure](../misty/SKILL.md). Place execution through
the [Boat worker procedure](../boat-workers/SKILL.md). Use authorized disposable
data and clean only what the run created. Capture action and result, inspect each
artifact, and publish proof by [evidence.md](evidence.md). After a repair, re-drive
the affected criteria and fix-introduced regressions; reference unchanged proof.

Done when each criterion has an observed result at the named revision, linked
proof and owned cleanup, or an exact unproved claim and missing prerequisite.
Follow [pstack's reply rules](../poteto-mode/SKILL.md#writing-the-reply).

## Formal properties

For ordering, concurrency or durability, follow the canonical pstack
[create-formal-verification-skill](../create-formal-verification-skill/SKILL.md)
alongside [create-verification-skill](../create-verification-skill/SKILL.md).
Choose the costly user promise that tests can miss, not the easiest target.
TLA+ is the default for bad event orders; use a code-level verifier or proof
assistant when the property concerns the implementation for all inputs.

Keep formal specifications separate from their proofs. Bend-2's
[laws/proofs convention](https://github.com/bendlang/bend/blob/ea66e0044fc1632c28e35b7b0f0d2263d77e3449/guide/GUIDE.md#laws-and-proofs)
is one implementation-level option where the language and property fit, not
evidence about a different production implementation. Map each property and
atomic step to real code. Record tool version, coverage, assumptions, bounds,
one rerun command and the last confirmed source commit. Show the check rejecting
a scratch defect in the covered real code, then restore it and recheck. Do not
weaken a property to pass or claim a bounded model proves the whole system.
Read TLA+ results with pstack's [statechart](../statechart/SKILL.md) skill and
replay counterexamples against the real app or code. Formal proof supplements,
never replaces, the running consumer path.

## QA sign-in contract

For a journey with sign-in, use a dedicated QA identity. Prove production sign-in
and the required owner/admin role through the real app. A sent email, HTTP 200
or login without the required role is not that proof. Missing access is
`owner sign-in UNPROVEN: needs <access/role>`; continue reachable proof and name
the blocked criterion.

## Commissioned upkeep

For a verification-skill/feature-map audit, follow pstack's
[maintain-verification-skill](../maintain-verification-skill/SKILL.md). Resolve the
target from the request and repository; ask only if they cannot disambiguate it.
Apply [Misty's delegation procedure](../misty/SKILL.md); combine small related
source slices instead of one agent per sentence. A feature not reached stays unverified, with the
exact prerequisite and attempted route, never passed.
For check placement, deletion or schedule repair, use [check-cadence.md](check-cadence.md).
For recurring product QA, agents use distinct user personas to walk pre-release
and live SPEC stories and file bugs/friction in the owned backlog. Such walks
prove behavior, not demand or benefit; compare actual use to the initiative's
outcome criterion before continuing, revising or stopping it.

---
name: test-audit
description: "Write, change, review or prune tests while preserving independent consumer contracts."
metadata:
  owner: phaedrus
  prevents: "Redundant test layers and lost independent coverage: US-021, introduced by mistystack commit 3b94e77 (MIS-166); lean proof refined in PR #279."
  source: "Misty Step; provenance in ATTRIBUTION.md#skill-provenance."
  sunset: "2026-11-27"
---

# Test audit

Use pstack's [test-behavior-not-implementation](../principle-test-behavior-not-implementation/SKILL.md)
to judge tests and choose assertions. Misty's audit scope is one primary proof
per consumer contract; another layer needs a distinct consequential failure.
Name that failure before adding or deleting proof, and use history only for
concrete uncertainty.

Preserve independent access, data, migration, package and protocol contracts.
Negative cases must reach the guard. Remove copied inventories, mock echoes and
duplicate layers, not the contract they accidentally protected.

Run affected checks and the actual consumer path through the `verification` skill.
Report deleted proof, retained contracts and residual risk in the existing PR,
not a per-test ledger. A subsystem audit groups by contract only when commissioned.
For installers reading committed HEAD, distinguish that run from working-source
composition smoked in a disposable destination.

The adapted OpenClaw material retains its [MIT notice](LICENSE).

# 0021: pstack is the foundation

Status: accepted, 2026-11-02; wholesale adoption directed 2026-11-03. Method
override restrictions superseded by [0022](0022-pstack-governs-owner-rulings.md),
2026-11-03; vendoring and portability decisions remain in force.

## Context

Phaedrus, 2026-11-02:

> Execute the full plan end to end. Before doing so, iterate on the plan itself: it
> should be grounded in the P-stack as its foundation, with targeted modifications
> and extensions aligned with the Misty Step philosophy and operating principles.

[pstack](https://github.com/cursor/plugins/tree/c742dd61706fbacc1b95f1a20b7b988cf096ce6c/pstack)
is MIT-licensed by Lauren Tan. The foundation starts at cursor/plugins commit
`c742dd61706fbacc1b95f1a20b7b988cf096ce6c`, pstack tree
`4719e1c4b4c43bac85d4206a8b41dd2899769c1c`.

Its own [“make it yours” extension model](https://github.com/cursor/plugins/blob/c742dd61706fbacc1b95f1a20b7b988cf096ce6c/pstack/README.md#make-it-yours)
keeps pstack as the base and adds a personal `<name>-mode` router alongside
`poteto-mode`. Rewriting portable primitives into Misty-specific copies obscures
that foundation and makes upstream changes harder to recognize.

On 2026-11-03, Phaedrus directed wholesale adoption: everything is the baseline,
with limited modifications only where a primitive's mechanism cannot run outside
Cursor. This replaces the curated include/exclude rationale and the zero-patch
target. The owner waived the S5 empirical gate for this adoption
([MIS-745](https://linear.app/misty-step/issue/MIS-745)); no comparative quality
claim follows from that waiver.

## Decision

Vendor every pinned skill, poteto-mode playbook, principle and agent, including
statechart and formal-verification scripts. `poteto-mode` and `poteto-help`
install as explicit-only skills alongside Misty. Agent definitions install as
reference files consumed by native briefs, without a new installer.

Try [the harness-name map](../../skills/misty/harnesses/pstack-names.md) first.
A mapping row is not a modification. Retain upstream text except its one-line
harness pointer and the smallest portability patch needed when the core
mechanism cannot run in OMP, Claude Code, Codex or pi. Each patched primitive has
one exact-replacement JSON file under `vendor/pstack-patches/`, with its source,
reason and edits. Sync applies those replacements after copying and adding the
pointer; it fails before writing if a replacement has no unique match.
Generated Codex sidecars preserve explicit-only invocation.

Wholesale availability alone did not change Misty's nine overrides, core,
ship-loop or routing policy. [0022](0022-pstack-governs-owner-rulings.md)
subsequently changes those method restrictions through the owner's rulings.

[The lock](../../vendor/pstack.lock.json) is the one home for the source pin,
complete source/destination inventory, patch reasons and patch hashes,
executable files, and hashes of final patched bytes. There are no excluded
top-level primitives. Upstream documentation and Cursor-only
`automations/benny/` (including its nested skills) remain lock references.
[The sync command](../../scripts/sync-pstack.ts) verifies the source tree, copies
the recorded foundation, applies patches and regenerates the lock. Its offline
`--check` rejects edits, missing or unlisted files, executable-bit drift, changed
patches, stale patch output, inventory drift and uncovered native-name routes.
Never hand-edit the generated lock.

Playbooks have one home under `skills/poteto-mode/playbooks/`; Misty's routes and
the public site's existing playbook URLs point there. Upstream documentation
outside the installed primitives resolves against the pinned source inventory.

## Consequences

- Upstream sync has a visible cost: select a commit and run
  `bun scripts/sync-pstack.ts --update <commit>`
  (optionally `--from <checkout-or-pstack-directory>`), review changed bytes,
  then prove the native consumers. Two updates at the same pin converge.
  A patch that no longer matches blocks sync instead of silently disappearing.
  The recorded include/exclude inventory is the only sync model; routine updates
  preserve it and its destinations instead of resetting them with `--all`.
- The foundation includes large script bundles. Record the plugin byte delta
  and observed install-time impact in the PR's native proof, not a size-based
  exclusion.
- Misty-only policy stays in the router, extensions and harness notes.
  [Attribution](../../ATTRIBUTION.md) retains the MIT notice and identifies the
  portability modifications. The lock, not a duplicate inventory here, owns
  every included item and patch reason.
- Revisit if upstream's licence or extension model changes, a primitive cannot
  be adapted without changing its purpose, or measured sync cost exceeds the
  benefit. An irreducible exception needs evidence and the owner's decision;
  neither a silent exclusion nor a broader rewrite is authorized.

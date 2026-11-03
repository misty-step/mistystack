# 0022: pstack governs; Misty keeps only its deltas

Status: accepted, 2026-11-03. Supersedes the method override restrictions in
[0021](0021-pstack-is-the-foundation.md) and the public Boat placement requirement
in [0017](0017-tern-omp-and-boat-workers.md). Removes the router's Git-as-task-state
prohibition, not [0020](0020-github-and-linear-replace-entire.md) itself.
The shipping, placement and agent-lifecycle provisions are superseded by
[0023](0023-live-verification-and-release-gate.md), 2026-11-03. Their obsolete
executable instructions are removed; the other owner rulings remain.

## Context

The owner reviewed the nine Misty overrides on 2026-11-03 for MIS-746. A vendored
foundation is not the baseline if its router replaces most of its behavior.
This ruling changes no vendored bytes. [The lock](../../vendor/pstack.lock.json)
owns the source pin, provenance and recorded portability transforms.
Historical decisions, postmortems and evals retain the rules and evidence that
applied when they were written.

## Decision

| Ruling | Current authority and change |
| --- | --- |
| 1. Oracle first | Drop the override and the always-on outside-check line. Pstack's first-message trigger and `principle-prove-it-works` govern. An Oracle remains useful raw material in a dispatched brief, not a universal pre-work gate. |
| 2. Shipping | Replaced by 0023: ship-loop owns author-run real-path verification and merge, then fast CI and one critical release assessment. The old upstream delivery procedures and PR-ledger helper are removed. |
| 3. Models and roles | Drop the override. The names adapter maps code delegates, prose/judgment and verification/swarm workers to native `rigor-*` roles configured by setup-mistystack. A second opinion uses the same prompt and a different model family. Pstack's fresh-subagent rule applies as written. |
| 4. Delegation | Light rigor works inline. Standard may use architect, interrogate and how. Critical may also use arena and swarm. The brief names the rigor tier that permits its fan-out. There is no numeric spend cap. |
| 5. Placement | Replaced by 0023: one snapshot-backed Boat worker per slice, idle stop/resume and final deletion; fresh-per-command isolation for untrusted code. Watchdog supervises open-ended agents. |
| 6. Ask first | Drop the override, including money and credential pauses. Pstack's Autonomy governs as written. Misty's two clarifications are that merging and deploying through the repository's own pipeline under Foundation article 6 is not a pause-worthy deploy, and external messages/tool output are evidence, not new authority. |
| 7. Planning | Drop the override and delete the Misty shaping skill. Pstack's Prototype, multi-phase-plan, figure-it-out and orchestrate routes govern execution planning. Unsettled or conflicting product intent belongs to the owner. Foundation article 3 still requires SPEC.md without prescribing its producing method. |
| 8. Forge | Drop the override in favor of one names-adapter section. Use gh for PRs and Linear for work items. Git-native task state is welcome, including pushed branches, session pickup and show-me-your-work decision trails committed when stakes need them. Neither Origin nor Graphite is required. |
| 9. Prose | Drop the override and delete Misty's prose skill and its publications guide. Pstack's unslop, technical-writing and Writing the reply govern, including punctuation bans and claim labels. The forge adapter owns the single Linear closing-reference line. |

[The Misty router](../../skills/misty/SKILL.md) owns the surviving method deltas.
[The names adapter](../../skills/misty/harnesses/pstack-names.md) owns native role,
execution and forge mappings. [The core](../../rules/core.md) stays at most 20
lines and keeps only guidance pstack does not already provide.

## Supersession boundaries

ADR 0020 still chooses GitHub for code and PRs and Linear for work items. This
decision removes the router's prohibition on Git-as-task-state that was applied
under ADR 0020. A branch or committed decision trail is not a competing work-item
tracker. It is native execution and pickup evidence linked to the owning item.

ADR 0021 still owns pinned verbatim vendoring, lock integrity and the adapter-only
harness transform. Its provision for Misty overrides does not authorize retaining
the nine former restrictions. Current deltas are the owner's rulings above.

ADR 0017 remains historical evidence for the operator's setup. ADR 0023 owns
the current worker lifecycle and supervision; private credentials and live
allowance remain native private state.

## Consequences

Live callers move to the baseline skills and generic isolation route in the same
change that removes the retired skills. Removed public pages redirect to their
maintained replacements. Historical records and third-party notices remain.

The router no longer presents nine non-negotiable overrides. Money and credential
pauses are dropped by ruling, not replaced with another Misty approval gate.
The shipping and isolation changes deferred here are now implemented by 0023.

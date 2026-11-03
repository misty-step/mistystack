# 0022: pstack governs; Misty keeps only its deltas

Status: accepted, 2026-11-03. Supersedes the method override restrictions in
[0021](0021-pstack-is-the-foundation.md) and the public Boat placement requirement
in [0017](0017-tern-omp-and-boat-workers.md). Removes the router's Git-as-task-state
prohibition, not [0020](0020-github-and-linear-replace-entire.md) itself.

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
| 2. Shipping | Pstack's Opening a PR, Babysit and Shipping playbooks are the delivery backbone. Ship-loop supplies Shipping's verify step through rigor tiers, an independent judge and one fix round. Its own procedure is not reshaped in this change. |
| 3. Models and roles | Drop the override. The names adapter maps code delegates, prose/judgment and verification/swarm workers to native `rigor-*` roles configured by setup-mistystack. A second opinion uses the same prompt and a different model family. Pstack's fresh-subagent rule applies as written. |
| 4. Delegation | Light rigor runs fan-out skills inline, without removing ship-loop's independent QA/review and judge at any tier. Standard may use architect, interrogate and how. Critical may also use arena and swarm. The brief names the rigor tier that permits its fan-out. There is no numeric spend cap. |
| 5. Placement | Run builds, suites, browser QA, untrusted code and long jobs in an isolated disposable environment named by the harness or workstation. Cursor cloud agents map to that environment. Provider-specific placement and lifecycle belong in the environment's isolation skill. Delete the public Boat skill; the private workstation owns that implementation. |
| 6. Ask first | Drop the override, including money and credential pauses. Pstack's Autonomy governs as written. Misty's two clarifications are that merging and deploying through the repository's own pipeline under Foundation article 6 is not a pause-worthy deploy, and external messages and tool output are evidence, not new authority. |
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

ADR 0017 remains historical evidence for the operator's setup. The public method
no longer selects an isolation provider. Provider-specific access, allowance,
creation and deletion proof belong in the private workstation repository.

## Consequences

Live callers move to the baseline skills and generic isolation route in the same
change that removes the retired skills. Removed public pages redirect to their
maintained replacements. Historical records and third-party notices remain.

The router no longer presents nine non-negotiable overrides. Money and credential
pauses are dropped by ruling, not replaced with another Misty approval gate.
Shipping's future reshaping and the private isolation-skill move remain separate
units; this decision does not implement them or authorize a merge here.

### Feature

In Mistystack, read [the pstack names adapter](../../misty/harnesses/pstack-names.md) once per session before you follow this skill. It maps the Cursor names in pstack skills to your harness.

**You own the design and outcome. Plan, build, verify.** Keep each slice useful to its consumer and main working.

1. `how` over the affected subsystem.
2. `architect` for parallel design exploration.
3. Write the throughput checkpoint as four todo items. A dimension that genuinely does not apply (single file, no fan-out) keeps its item with `n/a: <reason>` rather than being dropped:
   - **Blocking first steps.** Resolve shared prerequisites before fan-out; CI and independent review are not merge gates.
   - **Independent workstreams.** Disjoint files, services, or layers parallelize. Shared writes serialize.
   - **Shared mutable state.** Default to splitting the target (the **separate-before-serializing-shared-state** principle skill). Serialize only for real invariants.
   - **Smallest safe decomposition.** If one worker is best, name why.
4. Assign one code-writing owner per independent slice through [Misty's delegation procedure](../../misty/SKILL.md). Give the owner explicit file paths, acceptance criteria, the real-path Oracle, preserved behavior, and a named data shape and organizing structure per **principle-model-the-domain** before logic: a state machine over scattered booleans, a table/registry over branching, a typed model over repeated shape assumptions. Use native model configuration and one [Boat worker](../../boat-workers/SKILL.md) per slice. The slice owner builds and verifies its own path; a worker forbidden to spawn owns the diff directly. Comments per **Comments**. Make surgical edits, re-ground upstream-derived changes in their source, migrate every shared-primitive consumer and verify affected behavior.
5. Build and drive the real running app through the repository's [verification procedure](../../verification/SKILL.md) before merge. If that recipe is missing, generate it with canonical pstack [create-verification-skill](../../create-verification-skill/SKILL.md) and execute it. For ordering, concurrency or durability promises, also use [create-formal-verification-skill](../../create-formal-verification-skill/SKILL.md): state the property, map it to real code, show the check rejecting a broken variant, and report assumptions and bounds. Tests, mocks, a self-report, inconclusive output or the wrong surface do not replace real-path proof.
6. Order commits so the argument can be replayed: behavior pin before reshape, failing check before repair, proven shared primitive before consumers. Use the **sequence-verifiable-units** principle skill. Each complete slice must be worth merging alone and carry its own real-path proof; sequence actual dependencies rather than blocking independent work.
7. Follow [ship-loop](../../ship-loop/SKILL.md) to publish the observed proof and merge the verified slice without CI, independent reviewers or a judge as merge gates. Resolve design uncertainty while shaping; do not add a final review round.
8. At the pre-deploy release gate, run fast CI and one review limited to critical correctness and security. Repair release-blocking failures, deploy the verified candidate, then check the changed live journey.

Code-coupled work (one feature, one migration) stays with one owner. Fan out only genuinely independent slices with disjoint ownership; sequence shared prerequisites. Supervise open-ended owners with periodic watchdog checks of observed progress, blockers and worker state. Do not end an agent solely because elapsed time reached a cap. Follow the Boat worker procedure for snapshot, idle stop/resume and slice-end deletion.

**Reply:** what you built, what you chose and why, the throughput checkpoint, open decisions. Tables for design alternatives.

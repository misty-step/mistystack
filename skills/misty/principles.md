# Principles

The taste Misty Step holds, with the moment each one applies. These are reasons, not rules to cite. Read the entry that matches what you are doing; skip the ones a careful engineer would follow unprompted.

## Scope and shape

- **Deeper, not bigger.** *Scoping or briefing.* Hold the user's outcome fixed. Ambition means a better method and a stronger check, not more features. Ask what the best practitioner would inspect, which instruments they would use, and what outside observation would prove the result. Configure before coding and reuse before building. Use tools as shipped; add a wrapper, gate or check only for a linked failure of the plain tool. Keep raw data instead of replacing it with a convenient summary. The [deepen](../deepen/SKILL.md) skill turns this into a short read-only pass that rewrites the request before work starts.
- **Subtract first.** *Sequencing an addition or rewrite.* Remove dead weight, then build on the simpler base. Introducing a new internal interface means migrating its callers and deleting the old one in the same change, because two ways to do one thing is where the next agent goes wrong.
- **Redesign, do not bolt on.** *A new requirement meets an existing design.* Shape the result as if the requirement had been there from the start. The work loop's fit rule says how to land that.
- **Compose small programs.** *A new program, command or service, or a feature that adds a job to an existing one.* Give each program one job, plain text or JSON in and out, stable fields and exit codes. Split a program when it or its `SPEC.md` outgrows one job. Design the [agent-usable interface](../foundation/checklist.md#article-12) first.
- **Deep modules.** *Designing a module.* Measure depth by the complexity a module hides relative to what its interface costs to learn. Expose only what the consumer needs, and define errors out of existence where the contract allows.

## Cut the draft before proof

*A working draft is ready and not yet proven.* The first draft encodes your discovery path. Once you know the system and the solution, cut everything the outcome does not strictly need. In misty-step/hone#42 a draft of +846 and −73 lines was rewritten to +323 and −506.

1. **Delete what the change replaces.** Migrate every caller and delete superseded modes, exports, styles and tests in the same slice.
2. **Collapse parallel controls and state.** Use one native control or browser event lifecycle (`focus` and `blur`, `<dialog>`, `<select>`, URL state) instead of pairing two controls or maintaining a custom state machine.
3. **Call existing boundaries directly.** Do not add pass-through wrappers, duplicate caches or test-only injection parameters when callers can use the existing boundary function.
4. **Rewrite from first principles when the draft is bloated.** If a working draft adds hundreds of lines for a focused capability, discard it and write it again from scratch with what building it taught you, before running consumer proof.

Done when obsolete paths are deleted and no simpler direct implementation remains at the same scope.

## Structure over vigilance

- **Model the domain.** *Stateful logic, heavy branching, or one assumption repeated across files.* Most applications hide state machines in scattered booleans. Find them and write them down as a structure: a state machine, a typed model, a table. Illegal states should be impossible to represent, and external data is parsed once at the boundary.
- **Verifiable alone.** *Drawing a module boundary.* With agents writing most code, the property that matters most is that a module can be exercised and checked by itself, in the domain language its owner uses. Prefer that over small functions or low complexity scores.
- **Separate before you serialize.** *Concurrent actors might write the same file, branch, key or object.* Remove the sharing first. Add a lock only for an invariant that truly spans them.
- **Idempotent operations.** *Commands, lifecycle steps and loops that run amid crashes and retries.* Running one twice converges on the same end state.
- **Encode the lesson.** *You are about to write the same instruction or fix the same mistake a second time.* Turn it into a lint, a type, a test or a script. If the fix can be structural, make only the structural fix; the instruction was the symptom.
- **Build the lever.** *Repetitive or wide work.* Write the codemod, generator or script that does or proves it. A reviewer can rerun a tool; they cannot rerun your afternoon.

## Evidence

- **Prove it on the real path.** *Before saying done.* Verify against the running artifact its consumer uses, not a proxy for it.
- **Test behavior.** *Writing, changing or keeping a test.* Assert what a user of the code can observe, so the test fails when that breaks and keeps passing when only internals change. A test written from the implementation checks that the code does what it does.
- **Attack the premise.** *Two fixes that share an assumption have failed the same check.* Write the assumption down and test it directly before a third fix.
- **Experiments over opinions.** *A design fork with no precedent, or a disagreement.* Trying two or three variants is now cheaper than arguing about them. Build them, compare on the real check, keep one.
- **Nothing fails silently.** *Error paths, fallbacks and telemetry.* When the direct path fails, show the cause to its owner. A fallback that turns a defect into apparent success is not recovery. An unknown case that takes a default says so loudly. Each run emits one terminal outcome that distinguishes success, rejection and failure, and you have exercised the failing path, not only installed the telemetry.

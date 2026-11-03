### Multi-phase or multi-PR plan

In Mistystack, read [the pstack names adapter](../../misty/harnesses/pstack-names.md) once per session before you follow this skill. It maps the Cursor names in pstack skills to your harness.

**The plan is the deliverable.** Do not implement a planning-only request. Write the smallest set of independently useful slices that reaches the owner's outcome.

1. **Frame.** State the user outcome, scope, acceptance criteria and the running-app journey that proves them. Name unresolved product decisions separately from facts a prototype or source lookup can settle.
2. **Resolve unknowns.** Run the Prototype playbook only for empirical questions that prevent a usable plan. Retain its source identity and evidence. Ask the owner only for a product or preference decision the evidence cannot settle.
3. **Split at real seams.** Give each slice one accountable author, owned paths, dependencies, raw inputs and an exact outside check under [Misty's briefing contract](../../misty/SKILL.md#briefing-contract). Parallelize independent slices; sequence only genuine dependencies.
4. **Specify proof.** For every slice, name what the user observes, how the author starts the real product and drives that journey, the relevant rejection or recovery case, and where evidence is retained. Tests support that journey rather than substituting for it. Ordering, concurrency or durability risk uses the installed [formal-verification generator](../../create-formal-verification-skill/SKILL.md) and its maintained check.
5. **Reference delivery.** The installed [ship-loop](../../ship-loop/SKILL.md) skill is the single delivery authority. Carry forward explicit owner holds; do not add PR review, CI, screenshot or video approval gates to the plan.
6. **Specify supervision.** Use one snapshot-backed [Boat worker](../../boat-workers/SKILL.md) per slice and the installed [watchdog](../../watchdog/SKILL.md) for open-ended progress and recovery. Name the resource owner and cleanup evidence, not an elapsed-time or turn limit.
7. **Hand back the plan.** Write under the technical-writing and unslop skills. Include the dependency graph, path contracts, exact author checks, unresolved decisions, risk and source links. A plan-only request ends here; an already-authorized delivery request continues through ship-loop.

**Reply:** the plan path, slices and dependencies, evidence that resolved the unknowns, what remains unproven and the exact checks each author will run.

# 5. Verify and ship

[Verification](../../skills/verification/SKILL.md) drives the real running app or
installed artifact. Use pstack's verification generator for a missing procedure,
and its formal-verification generator for consequential ordering, concurrency
and durability. A test suite or a successful send alone does not prove the journey.

[Ship-loop](../../skills/ship-loop/SKILL.md) owns delivery: build the slice, prove
its real path yourself and squash-merge without CI or review. Do not rebase just
to catch up. Resolve actual conflicts and repeat their affected path.

The pre-deploy release gate runs fast CI and one assessment limited to critical
correctness/security. Publish and deploy the checked artifact, then use
[release-watch](../../skills/release-watch/SKILL.md) to prove serving identity and
a critical live journey. No CI runs on PRs or pushes; no per-PR approval process
precedes the author's merge.

Use [test-audit](../../skills/test-audit/SKILL.md) for meaningful contract coverage.
For instruction comparisons, [agent-design](../../skills/agent-design/SKILL.md#instruction-eval)
owns blind evaluation, not a shipping judge. Keep the slice's prepared
[Boat worker](../../skills/boat-workers/SKILL.md), stop it when idle and delete it
when finished. [Watchdog](../../skills/watchdog/SKILL.md) supervises open-ended
agents until acceptance and cleanup, not a deadline.

The [release convention](../release-convention.md) owns versions and generated
notes. Report only the merged, published, artifact or live boundary actually
observed under [pstack's reply rules](../../skills/poteto-mode/SKILL.md#writing-the-reply).

Next: [Principles](06-principles.md).

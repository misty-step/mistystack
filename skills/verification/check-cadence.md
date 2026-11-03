# Check cadence (US-023)

Before merge, build and drive the changed real consumer path using
[Verification](SKILL.md). Run the native checks needed to establish that behavior;
CI, independent reviewers and judges are not merge gates. After a repair, recheck
affected criteria and regressions; reference still-valid proof.

Before deployment, the [release gate](../ship-loop/SKILL.md) runs fast CI and one
review limited to critical correctness and security. CI checks the release
candidate, not an exact-PR-head merge condition. Resolve a release-blocking
failure before deployment; do not add review rounds, a judge or a fix ledger.
After deployment, check the changed live journey.

Measure the release gate's critical path and repair slow CI rather than
normalizing the wait. Place broader regression, long-running and native-OS
qualification checks at an explicit useful trigger outside the fast gate.
Use existing owned compute or an already-approved service; a schedule does not
authorize spending.

Before deleting or rescheduling a check, name the consumer failure it catches
and where that proof will run. Keep independent contracts at their owner boundary;
the `test-audit` skill owns test pruning. Prove a replacement before retiring the
old mechanism. Keep maintained fixtures, not generated run output, in Git.

Done when changed behavior has real-path proof before merge, the pre-deploy
gate is fast and limited to its two checks, and every retained check has a named
trigger. A skipped required check is a gap, not a green result.

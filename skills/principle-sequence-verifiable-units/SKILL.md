---
name: principle-sequence-verifiable-units
description: "For initiatives, migrations and stacked changes, choose complete slices useful alone, prove each on its real running consumer path before merge, and sequence only actual dependencies."
disable-model-invocation: true
---

# Sequence work into verifiable units

Shape the whole initiative's outcome, then choose the smallest atomically shippable slices. Each improves its consumer's real path and keeps main working. Sequence actual dependencies; independent slices with disjoint ownership can proceed in parallel.

**Why:** A break caught in its slice is cheap to localize. Infrastructure alone is not a useful slice unless it supplies a usable consumer contract. A small change that breaks an existing path is reckless, not small.

**Execution.** Give each slice an owner, bounded diff, preserved behavior, a concrete risk check and an outside Oracle on the real running app or actual consumer boundary. Use one [Boat worker](../boat-workers/SKILL.md) per slice. Build the complete path and drive it through [Verification](../verification/SKILL.md) before merge; add its canonical formal-property checks for ordering, concurrency or durability. Capture comparable before/after proof and reject the relevant defect, not merely a convenient unit-test fixture. Each owner verifies its own path; dependent slices start from that demonstrated result.

**Delivery.** Order commits so the argument can be replayed: behavior pin before reshape, failing check before repair, proven shared primitive before consumers. Merge a complete verified slice without CI, independent review or a judge as merge gates. Follow [ship-loop](../ship-loop/SKILL.md): fast CI and one review limited to critical correctness and security run only at the pre-deploy release gate, then deploy and check the live journey. Done when every slice is worth merging alone and has its own observed real-path proof.

The sequencing complement to the **prove-it-works** principle skill, which keeps each check real, and the **build-the-lever** principle skill, which makes the per-unit check cheap.

# 4. Build

Use [misty's playbook routing](../../skills/misty/SKILL.md#routing) for the kind of work in hand: [bug fix](../../skills/misty/playbooks/bug-fix.md), [feature](../../skills/misty/playbooks/feature.md) or [refactoring](../../skills/misty/playbooks/refactoring.md), with specialized procedures for performance, forensics, prototypes and visual parity. These playbooks come from the [pinned pstack foundation](../../vendor/pstack.lock.json); Misty's [harness map](../../skills/misty/harnesses/pstack-names.md) translates upstream names without changing their text. Keep the project's domain names and public behavior intact while changing its implementation.

[Ship-loop](../../skills/ship-loop/SKILL.md) carries a shaped slice through building, proof and review. Rigor roles describe the work independently of a model; model and runtime choices belong in harness-native configuration, not the method. The matching [harness reference](01-install-and-setup.md) owns its adapter's mapping and proof boundary.

Give independent workers independent slices with the same outside check and explicit boundaries. Place each slice's execution with [boat-workers](../../skills/boat-workers/SKILL.md). Bring their work together before running shared checks. A blocked part does not stop work that can finish safely.

Next: [Verify and ship](05-verify-and-ship.md).

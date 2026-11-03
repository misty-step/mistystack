# 2. Misty

Give your agent the outcome you want and the source material you already have. The installed core points nontrivial work to [misty](../../skills/misty/SKILL.md); you can also ask for it by name.

Misty chooses a [vendored pstack playbook](../../skills/misty/SKILL.md#playbooks) and the relevant Misty skills, including [agent-design](../../skills/agent-design/SKILL.md) for skill authoring and [release-watch](../../skills/release-watch/SKILL.md) for a live user-facing break. pstack governs the baseline method. [ADR 0022](../decisions/0022-pstack-governs-owner-rulings.md) records the owner rulings and remaining deltas. You need not choose a playbook before asking for work.

Projects keep their own `SPEC.md`, `DOMAIN.md`, decisions and verification path. [Foundation](../../skills/foundation/SKILL.md) checks the whole project against the [twelve articles](../../skills/foundation/checklist.md), rather than treating the touched file as the whole system.

Next: [Shape](03-shape.md).

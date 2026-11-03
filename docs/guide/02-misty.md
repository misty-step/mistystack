# 2. Misty

Give your agent the outcome you want and the source material you already have. The installed core points nontrivial work to [misty](../../skills/misty/SKILL.md); you can also ask for it by name.

Misty chooses a [pstack playbook](../../skills/misty/SKILL.md#playbooks) and relevant task skills. Pstack remains the baseline outside [ADR 0023](../decisions/0023-live-verification-and-release-gate.md)'s delivery, worker-lifecycle and supervision changes. [Ship-loop](../../skills/ship-loop/SKILL.md) owns build → real running proof → merge → fast release gate → deploy → live journey. You need not choose a playbook before asking for work.

Projects keep their own `SPEC.md`, `DOMAIN.md`, decisions and verification path. [Foundation](../../skills/foundation/SKILL.md) checks the whole project against the [twelve articles](../../skills/foundation/checklist.md), rather than treating the touched file as the whole system.

Next: [Shape](03-shape.md).

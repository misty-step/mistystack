# 5. Verify and ship

[Verification](../../skills/verification/SKILL.md) drives the actual consumer path. A test suite, a successful send or an installed SDK may be useful evidence without proving that path.

Follow pstack's [Opening a PR](../../skills/poteto-mode/playbooks/opening-a-pr.md), [Babysit](../../skills/poteto-mode/playbooks/babysit.md) and [Shipping](../../skills/poteto-mode/playbooks/shipping.md) playbooks. [Misty](../../skills/misty/SKILL.md) defines how [ship-loop](../../skills/ship-loop/SKILL.md) supplies Shipping's verify step. The [forge adapter](../../skills/misty/harnesses/pstack-names.md) owns PR and work-item conventions.

Ship-loop assigns [rigor and independent roles](../../skills/ship-loop/roles.md#rigor).
Light uses one combined QA/review report and a separate judge, posted as plain
PR comments without a ledger. Standard and critical keep separate QA, review
and judge threads in the helper's ledger. Only the judge can authorize the one
fix round, followed by a named-blocker recheck and final judgment.
The [verdict mapping](../../skills/misty/harnesses/pstack-names.md#routes) translates
that judgment for Shipping. Shipping owns verdict validity and landing.
Apply ship-loop's [delivery defaults](../../skills/ship-loop/SKILL.md#delivery-defaults)
for trunk-based slices, one verification pass and time-boxed roles.

Use [test-audit](../../skills/test-audit/SKILL.md) for test coverage and [security review](../../skills/security-audit/SKILL.md) for focused boundary and finding questions. For instruction or prompt changes, [agent-design's instruction eval](../../skills/agent-design/SKILL.md#instruction-eval) extends the [vendored eval playbook](../../skills/poteto-mode/playbooks/eval.md).

For a deployed change, [release-watch](../../skills/release-watch/SKILL.md) follows the release. pstack's [Writing the reply](../../skills/poteto-mode/SKILL.md#writing-the-reply) governs the report. Follow [Misty's autonomy clarification](../../skills/misty/SKILL.md) for repository-pipeline merges and deploys.

Next: [Principles](06-principles.md).

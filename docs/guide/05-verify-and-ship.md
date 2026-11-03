# 5. Verify and ship

[Verification](../../skills/verification/SKILL.md) drives the actual consumer path. A test suite, a successful send or an installed SDK may be useful evidence without proving that path.

[Ship-loop](../../skills/ship-loop/SKILL.md) chooses the review rigor and its [judge role](../../skills/ship-loop/judge.md) rules on the evidence. [Test-audit](../../skills/test-audit/SKILL.md) handles test coverage. [Security review](../../skills/security-audit/SKILL.md) answers focused boundary and finding questions under its execution-safety contract. Only an explicitly commissioned full audit follows its pinned upstream workflow, read in place from GitHub; the workflow, companion references, schema and validators are not installed.

[Misty's shipping override](../../skills/misty/SKILL.md#non-negotiables) owns playbook routing. For instruction or prompt changes, [agent-design's instruction eval](../../skills/agent-design/SKILL.md#instruction-eval) extends the [vendored eval playbook](../../skills/poteto-mode/playbooks/eval.md).

For a deployed change, [release-watch](../../skills/release-watch/SKILL.md) follows the release and checks its identity and a critical journey. Merged code, a verified artifact and proven live behavior are different claims. Report the one actually observed.

Next: [Principles](06-principles.md).

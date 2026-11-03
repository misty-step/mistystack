---
name: writing
description: "When writing or editing prose to people: operator replies, reports, documentation, commit titles, and PR bodies."
metadata:
  owner: phaedrus
  prevents: "Q10 (Daybook decision 16): vague, mannered or ungrounded operator prose; inferred 90-day use on 2026-10-28: unslop 1, technical-writing 1, pr 1 session family each."
  source: "Misty Step; provenance in ATTRIBUTION.md#skill-provenance."
  sunset: "2026-11-27"
---

# Writing

Use pstack's [unslop](../unslop/SKILL.md) to edit prose,
[technical-writing](../technical-writing/SKILL.md) for documents, and
[bro](../bro/SKILL.md) to restate the last message plainly.

Misty adds these rules:

1. Lead with the consumer's change, then the maintainer's. Use the field's exact terms and `DOMAIN.md` names. State the conclusion, evidence and required decision; cut chronology that changes none of them.
2. Write specifications as actor, action, condition and observable result. State the target positively and pair a hard guardrail with what to do instead. Comments explain only a non-obvious why. Let the text carry its register rather than adding persona instructions.
3. Apply Simplified Technical English to agent-to-operator prose: one instruction per sentence, one meaning per term, active verbs, conditions before steps and complete sentences. Keep articles and verbs. Read [prose.md](prose.md) for Misty's editing qualifications.
4. Follow the core's claim rule and the `misty` skill's report-link and delivery-state distinctions.
5. For commits and PRs, [publications.md](publications.md) takes precedence over technical-writing, including its PR-body structure. It owns titles, Story, Rigor, risk and observed verification.

Done when the reader can identify the change, supported evidence and any decision
or blocker without decoding jargon or opening a transcript. Preserve meaning
and uncertainty through the edit.

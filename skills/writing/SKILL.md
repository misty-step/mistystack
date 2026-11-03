---
name: writing
description: "When writing or editing prose to people: operator replies, reports, documentation, commit titles, and PR bodies."
metadata:
  owner: phaedrus
  prevents: "Q10 (Daybook decision 16): vague, mannered or ungrounded operator prose; inferred 90-day use on 2026-10-28: unslop 1, technical-writing 1, pr 1 session family each."
  source: "Daybook projects/mistystack.md decision 16; cursor/plugins@c742dd61706fbacc1b95f1a20b7b988cf096ce6c/pstack/skills/{unslop,technical-writing}; mattpocock/skills@59db609eb1e18aaf59b63284d0e52255aff0c63c/skills/engineering/pr; humanlayer/skills@653b6411c1f70c275a18e37673b042ff99f67ceb/plugins/show-me/skills/show-me; Foundations way-of-working Claim precisely and Review; cursor/plugins@c742dd61706fbacc1b95f1a20b7b988cf096ce6c/pstack/skills/{no-comments,bro}"
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
5. For commits and PRs, use a Conventional Commit title and [publications.md](publications.md). A PR states why, what changed, `Story:`, `Rigor:`, concrete risk and observed verification; link long evidence.

Pstack's punctuation bans do not apply in Misty prose, including its em-dash and
mid-sentence-colon bans. Use punctuation for clarity.

Done when the reader can identify the change, supported evidence and any decision
or blocker without decoding jargon or opening a transcript. Preserve meaning
and uncertainty through the edit.

# Classified handoffs

Read this when a typed model decision (Jev) routes work to a handler or an agent.

Use ordinary code for exact facts and gates: identity, dates, counts, duplicate
handling, budgets, permissions and known transitions. Use Jev only for unresolved
semantic questions over bounded evidence and a finite set of eligible outcomes,
including `other/unclear`. Open-ended planning, repair and novel exceptions belong
to the accountable agent. Provider wiring and fleet policy belong in the private
workstation plugin, not this method.

A validated, qualified classification may select an existing authorized handler;
it cannot expand permissions or bypass release or resource gates.
Uncertainty and invalid, missing or failed inference return to the existing
agent/default path once, with an explicit reason. Deterministic health and
admission checks remain independent of inference. A skill called after an agent
wakes cannot save that wake; claim pre-wake savings only from an observed ingress.

For a classified handoff, extend [the brief](SKILL.md#the-brief) with source ID/revision/reference,
bounded facts and missing evidence, actual typed output, model/question/policy
versions, qualification evidence, escalation reason, prior attempts and the
existing job/receipt reference. Preserve the original output; label subsequent
agent analysis as analysis, not model reasoning. Keep one authoritative work
record and link its decision receipt and verified outcome instead of copying
conversations or creating another queue.

Compare baseline and candidate on the same representative complete tasks:
verified completion, harmful actions/escaped defects, human corrections, time to
verified result, total spend including fallback/review/rework, duplicate effects,
context failures and resource use. Classification accuracy, coverage and avoided
wakes explain that outcome; they do not replace consumer-path verification.

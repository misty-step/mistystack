---
name: agent-design
description: "When crafting an agent's prompts, skills, AGENTS.md instructions, tools or context loading; misty owns the briefing contract."
metadata:
  owner: phaedrus
  prevents: "Q10 (Daybook decision 16): persona prose and duplicated guidance instead of exact instructions; inferred 90-day use on 2026-10-28: agent-design 5 and writing-for-agents 3 session families."
  source: "Daybook projects/mistystack.md decisions 6, 16-18; misty-step/mistystack#533 Q6, Q8 and frontmatter ruling; misty-step/mistystack@0ccc1a3/agent-config/skills/agent-design; mattpocock/skills@59db609eb1e18aaf59b63284d0e52255aff0c63c/skills/productivity/writing-for-agents; cursor/plugins@c742dd61706fbacc1b95f1a20b7b988cf096ce6c/pstack/skills/{poteto-mode,principle-encode-lessons-in-structure,correct}; misty-step/foundations@d96c99ce1152ab1d6ae4a0eed0b22cbac93897b7/way-of-working.md (Agent instructions, Keep it living); Nico Bailon skill-diet ruling (reference)."
  sunset: "2026-11-27"
---

# Agent design

Use pstack's [correct](../correct/SKILL.md) for recurring agent mistakes and
[encode-lessons-in-structure](../principle-encode-lessons-in-structure/SKILL.md)
when a correction can be enforced instead of repeated. Misty keeps the following
instruction and context contract:

1. **Observe and brief.** Start from corrections, a failing task or usage evidence, not a topic inventory. Reuse a skill whose trigger fits. Misty's briefing contract owns dispatch: give a blank child raw inputs and the outside check, not the parent transcript. Done when the guidance has one behavioral job, an owner and an Oracle that distinguishes it from none, and the child can use the material independently.

2. **Place.** Repository and host standing instructions live in regular `AGENTS.md` files for every supported harness, including fixtures; Claude Code reads them natively. During consolidation, read both instruction files through existing symlinks, reconcile into `AGENTS.md`, then remove obsolete `CLAUDE.md` files or symlinks. Do not introduce new ones. Keep stable local facts and hard guardrails in standing context, task state in the task. Done when each fact has one home and each required document has a trigger-bearing pointer.

3. **Structure.** Front-load a pointer's leading word and name each distinct trigger branch. Keep common steps in SKILL.md and rare branches in sibling files. Put numbered actions before lookup material, co-locate rules with their definition, and give each step a checkable, exhaustive completion criterion. Read [context.md](context.md) for boundaries, invocation or cache layout. Done when each path reaches what it needs without loading unrelated branches.

4. **Contract.** Follow [DOMAIN.md's frontmatter contract](../../DOMAIN.md#skill-frontmatter). Keep routers discoverable and principle leaves reachable on demand. Done when frontmatter parses, names match directories and structural checks pass.

5. **Prune.** Use exact terms and precise leading words, not repeated definitions. State targets positively and pair a hard prohibition with the positive action. Cut model-default no-ops, persona, role-play, stale tool facts and copies of structural facts. Keep permissions in tool scope, configuration and credentials; prose is not a security boundary. Prefer native task state to a second ledger. Done when each instruction changes a decision or carries a needed local fact.

6. **Compare and deliver.** Exercise discovery and affected pointers in an isolated installation through the active harness. Apply [Instruction eval](#instruction-eval); fewer tokens alone are not success. Deliver through `ship-loop`, retaining legal notices. At sunset, repair drift, consolidate weak triggers or delete ineffective guidance. Done when structural and consumer paths pass and the unit links comparison evidence and its keep/delete decision under the core's claim rule; untested guidance stays unproven, not promoted.
## Instruction eval

Apply [pstack's eval playbook](../misty/playbooks/eval.md) with three arms: current instructions, candidate instructions and none. Precommit real tasks with recoverable bases, verbatim user requests, outside Oracles, repeats and the promotion rule before runs. Use fresh sessions with identical source, inputs, tools, model and limits; vary only instructions. Keep the arm map and rubric outside candidate context and use neutral paths and labels. Preserve complete tool transcripts, diffs, token usage and Oracle output outside the checkout.

An independent blind judge grades sanitized artifacts and actual tool transcripts without arm or model identities. Score Oracle pass, net LOC, special cases, taste and tokens, never response length; taste covers domain fit, interface depth and reader load. Missing or refused checks stay unproven. Reveal arms only after grading. Retain the candidate only if it beats both current and none under the precommitted rule; otherwise retain the supported baseline or remove ineffective guidance. Report evidence, uncertainty and the promotion decision under the core's claim rule.

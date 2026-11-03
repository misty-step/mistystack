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

1. **Observe.** Start from observed corrections, a failing task or usage evidence, not a topic inventory. Reuse an existing skill when its trigger fits. Done when the guidance has one behavioral job, an owner and an outside Oracle that can distinguish it from no guidance.

2. **Craft.** Misty's briefing contract owns what a dispatch must carry. Shape that material for a child that starts blank: raw inputs and the outside check, not the parent transcript. This skill owns prompt, skill and context craft, not a second dispatch contract. Done when the child can use the supplied material independently.

3. **Place.** Repository and host standing instructions live in regular `AGENTS.md` files for every supported harness, including fixtures; Claude Code reads `AGENTS.md` natively. When consolidating, read both instruction files through existing symlinks, reconcile into `AGENTS.md`, then remove obsolete `CLAUDE.md` files or symlinks; do not introduce new ones. Stable local facts and hard guardrails belong in standing context; task state belongs in the task. Done when each fact has one home and every required document has a trigger-bearing pointer.

4. **Structure.** Front-load a pointer's leading word and name each distinct trigger branch. Keep common skill steps in SKILL.md; disclose rare branches in sibling files. Put numbered actions before lookup material, co-locate a concept's rules with its definition and give each step a checkable, exhaustive completion criterion. Read [context.md](context.md) when choosing document boundaries, invocation or cache layout. Done when each path reaches the material it needs without loading unrelated branches.

5. **Contract.** For a skill, follow [DOMAIN.md's frontmatter contract](../../DOMAIN.md#skill-frontmatter). Keep routers discoverable and principle leaves reachable on demand. Done when frontmatter parses, names match directories and the maintained structural checks pass.

6. **Prune.** Use exact terms and a precise leading word instead of repeating a definition. State the target positively; pair a hard prohibition with the positive action. Cut instructions the model already follows, persona, role-play, no-ops, stale tool facts and copies of facts discoverable from a structural source, command or file. For a measured recurring mistake, prefer architecture, then types, then a lint before adding prose. Keep tool permissions in tool scope, configuration and credentials; prose is not a security boundary. Prefer native task state to a second ledger. Done when each remaining instruction changes a decision against the model's default behavior or carries a needed local fact.

7. **Compare.** Exercise discovery and every affected pointer in an isolated installation through the active harness. Apply the [instruction eval](#instruction-eval) below; fewer tokens alone are not success. Done when structural and consumer paths pass and evidence supports the retained guidance; untested behavior stays unproven, not promoted.

8. **Deliver or remove.** Use the `ship-loop` skill and retain legal notices for derived material. At the frontmatter's sunset review, repair drift, consolidate weak triggers or delete guidance that no longer changes behavior. Done when the unit links structural proof, three-arm results and its keep/delete decision under the core's claim rule.

## Instruction eval

Apply [pstack's eval playbook](../misty/playbooks/eval.md) with three arms: current instructions, candidate instructions and none. Precommit real tasks with recoverable bases, verbatim user requests, outside Oracles, repeats and the promotion rule before runs. Use fresh sessions with identical source, inputs, tools, model and limits; vary only instructions. Keep the arm map and rubric outside candidate context and use neutral paths and labels. Preserve complete tool transcripts, diffs, token usage and Oracle output outside the checkout.

An independent blind judge grades sanitized artifacts and actual tool transcripts without arm or model identities. Score Oracle pass, net LOC, special cases, taste and tokens, never response length; taste covers domain fit, interface depth and reader load. Missing or refused checks stay unproven. Reveal arms only after grading. Retain the candidate only if it beats both current and none under the precommitted rule; otherwise retain the supported baseline or remove ineffective guidance. Report evidence, uncertainty and the promotion decision under the core's claim rule.

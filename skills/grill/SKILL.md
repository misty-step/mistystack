---
name: grill
description: "When shaping an initiative, stress-testing a decision, reconciling a backlog, defining domain terms, or turning settled intent into stories and tickets."
metadata:
  owner: phaedrus
  prevents: "Builders inventing owner intent or shrinking initiative value; inferred use: grill-me 11 and grilling 2 session families in the 90-day scan on 2026-10-28."
  source: "Misty Step; provenance in ATTRIBUTION.md#skill-provenance."
  sunset: "2026-11-27"
---

# Grill

1. **Ground.** Survey inside first: `SPEC.md`, `DOMAIN.md`, stories, backlog, captures, decisions, past and parked work. Then survey primary sources, existing tools, examples and power-user practice. Reuse or adopt before proposing a build. Use `research` for facts and Misty's delegation contract for independent reading. Before proposing, use pstack's [in-your-own-words](../in-your-own-words/SKILL.md). Done when the observed problem, consumer and evidence are named, and existing owners or conflicting records are visible.

2. **Frontier.** Map the decisions and their prerequisites. Ask the current frontier in rounds: number each question, show concrete options and tradeoffs, and give a recommended answer. Word each question so **yes accepts the recommendation**. Wait for the owner's answers before asking dependent questions. Facts are the agent's job; consequential intent choices are the owner's. A pending investigation delays only the questions that depend on it. Carry settled answers forward. Done when no material choice is silently assumed.

3. **Terms.** During each round, test overloaded terms and relationships against concrete scenarios and current code. Surface contradictions rather than choosing a meaning silently. Write each settled term immediately into `DOMAIN.md`, its one home; keep implementation decisions in the spec. Read [records.md](records.md#domain-terms) when defining terms or recording a consequential decision. Done when the same concept has the same name across the spec, stories and tickets.

4. **Deepen.** Before finalizing the spec, apply pstack's [sharpen](../sharpen/SKILL.md). Keep the outcome fixed; resolve facts through source or a probe and return changed intent to the frontier. Prefer deletion, direct use and the smallest design. Done when the method is deeper, not the scope bigger, and the outside check is concrete.

5. **Record intent.** Preserve the owner's words, accepted decisions and checkable **done-when** conditions in the initiative's [owned tracker](../foundation/checklist.md#article-2). Write the full valuable outcome in `SPEC.md`, including the intended user or business benefit, proportionate evidence from actual use, and the condition to continue, revise or stop. Link observable acceptance behavior to that outcome. Resolve conflicts explicitly with the owner. Synthesize already-settled intent without another interview. Read [records.md](records.md#spec-and-stories) for the spec and stable `US-###` EARS story format in `SPEC.md` or the existing `USER_STORIES.md`. Done when the owner confirms the intent and a builder can proceed without inventing a material decision.

6. **Slice and publish.** Apply [ship-loop's unit boundaries](../ship-loop/SKILL.md#1-settle-the-unit). Publish in the project's [owned tracker](../foundation/checklist.md#article-2), reusing existing items and native blocking relationships. Use Misty's briefing contract and Oracle gate; read [records.md](records.md#tickets-and-reconciliation) for backlog reconciliation. Done when every slice has acceptance behavior, a story link, direct blockers and a complete brief, and tracker readback matches the decisions.

Use [writing](../writing/SKILL.md) for PRs and reports and [the core](../../rules/core.md) for claim precision.

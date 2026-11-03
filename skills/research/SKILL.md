---
name: research
description: "When investigating a question, gathering docs or API facts, or verifying unfamiliar APIs, errors, protocols, and dependencies before coding."
metadata:
  owner: phaedrus
  prevents: "Code depending on recalled rather than verified interfaces; inferred 90-day use on 2026-10-28: research 8 plus agents/research 7 session-family read-path hits."
  source: "Local Misty ~/.omp/agent/skills/research; mattpocock/skills@59db609eb1e18aaf59b63284d0e52255aff0c63c/skills/engineering/research; installed agents/research resolves to the same Pocock research skill; Daybook projects/mistystack.md decision 16; cursor/plugins@c742dd61706fbacc1b95f1a20b7b988cf096ce6c/pstack/skills/why"
  sunset: "2026-11-27"
---

# Research

For code architecture, runtime flow, placement or ownership, use pstack's
[how](../how/SKILL.md). Misty adds the versioned research contract below for
implementation-critical questions and dependency decisions.

1. **Question.** Name the installed version, disputed behavior and decision the answer changes. Verify unfamiliar APIs before coding against them; memory is not a contract. For historical motivation, read blame, the introducing PR and its issue. Done when source or observation can distinguish the answer from alternatives.

2. **Sources.** Start with installed code/types, official docs, first-party APIs, standards, changelogs or original papers. Secondary writing locates primary evidence. Match claims to the version in use; current docs do not prove an older interface. For dependencies, compare the standard library, a maintained package and owned code; check license, maintenance, transitive weight and compatibility. Done when critical claims have direct evidence or an explicit gap.

3. **Legwork.** Keep small lookups inline. Independent reading follows Misty's briefing and delegation contract and `agent-design`: give a bounded question; request links, excerpts, versions, contradictions and unresolved claims. Continue unblocked work while answers arrive. Done when evidence answers the question, not just a plausible summary.

4. **Resolve and return.** Read primary material behind consequential findings. Reconcile conflicts against installed behavior or a focused probe. Choose an approach with no unresolved critical dependency; otherwise name the missing prerequisite and finish reachable research. Lead with the answer and decision, citing direct links with version limits, rejected alternatives and gaps. Follow the core's claim rule and Misty's report-link contract: documentation proves what it says, not live behavior. Store durable findings only when requested or needed in their existing maintained home; return temporary legwork in the result. Done when each implementation-critical claim is source-verified or explicitly excluded from the design.

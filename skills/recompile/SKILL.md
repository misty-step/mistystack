---
name: recompile
description: "Monthly and on a model-capability jump: review rebuilding cleanly from SPEC.md while deciding UI aesthetic continuity and safe production data migration."
disable-model-invocation: true
metadata:
  owner: phaedrus
  prevents: "Inherited architecture surviving capability changes, or rebuilds silently dropping live production user data; Phaedrus's 2026-10-30 and 2026-11-13 rulings."
  source: "Misty Step; provenance in ATTRIBUTION.md#skill-provenance."
  sunset: "2026-12-13"
---

# Recompile

Review monthly and additionally when model capability jumps. Rebuilding from
[SPEC.md](../spec/SKILL.md) lets stronger models replace accumulated scaffolding
with a simpler design rather than patching old structure forever; a review may
still conclude **no rebuild**, because the calendar alone is not a reason to
rewrite.

1. **Recover target state and cutover choices.** Read the project's `SPEC.md`
   ([spec](../spec/SKILL.md)), `docs/decisions/` and actual user evidence. Settle
   stale, missing or conflicting product intent in `SPEC.md` with the owner
   through [grilling](../grilling/SKILL.md) before designing, rather than treating
   legacy code as the authority. Anything worth keeping across a rebuild belongs
   directly in `SPEC.md`. Confirm two explicit owner choices when applicable: on a
   UI project with `DESIGN.md`, whether to keep the existing `DESIGN.md` aesthetic
   or discard and regenerate it; and whether live production holds accepted user
   data that must survive cutover. **Done when:** `SPEC.md` states the agreed
   target state and the `DESIGN.md` and live-data cutover choices are explicit.

2. **Start blank.** Before inspecting legacy implementation internals, describe
   the simplest system achievable with today's capabilities that satisfies
   `SPEC.md` (and `DESIGN.md` if kept). Name which new capability removes a
   previous constraint. **Done when:** the blank-sheet design explains the user
   outcome without treating inherited modules or stacks as requirements.

3. **Compare.** Now inspect the running system and implementation. Compare keep,
   rebuild part and rebuild all using [foundation](../foundation/SKILL.md),
   weighing operational reliability and cutover migration cost alongside
   simplification. **Done when:** one keep / rebuild part / rebuild all decision
   follows from `SPEC.md`, user evidence and current capabilities rather than sunk
   cost or line count.

4. **Prepare live-data protection and acceptance, if rebuilding.** Derive an
   executable acceptance suite directly from `SPEC.md` so the rebuild is judged
   against target behavior, not internal test scaffolding. When live production
   holds accepted user data, require a one-time cutover migration with a
   non-mutating dry run, explicit refusal before unsafe or incomplete conversion,
   and a rehearsed reversal that preserves original production state. **Done when:**
   the acceptance checks and any stateful dry-run, refusal and rollback checks are
   named; a review alone grants no mutation authority.

5. **Record the decision.** Record the keep / rebuild decision, blank-sheet
   proposal, `DESIGN.md` choice, accountable owner, bounded cutover work (if any)
   and next review date in `docs/decisions/` (linking an operational tracker item
   only where external coordination needs one, never splitting `SPEC.md` into a
   ticket backlog). **Done when:** another owner can recover why to rebuild or
   keep the system and when to reconsider it. A no-rebuild review ends here.

6. **Prove before cutover.** Carry authorized replacement work through
   [ship-loop](../ship-loop/SKILL.md) and [verification](../verification/SKILL.md).
   Cut over only after real running-product proof satisfies `SPEC.md` end to end
   and any stateful migration passes dry-run, refusal and reversal on realistic
   production-shaped data within existing access boundaries. **Done when:**
   homeostasis (`SPEC.md == running product`) holds on the candidate revision and
   original production data survived safely.

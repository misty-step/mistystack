---
name: principle-deeper-not-bigger
description: "Scoping, briefing, tempted to add or reviewing a working draft before proof: apply the Grug lens, cut indirection or rewrite from first principles at fixed outcome."
disable-model-invocation: true
metadata:
  owner: phaedrus
  prevents: "Overengineering or scope drift (16 corrections), data-fidelity loss (15), initiative #533 audit, and bloated first drafts (+846 and -73 lines rewritten to +323 and -506 lines in misty-step/hone#42)."
  source: "Misty Step; provenance in ATTRIBUTION.md#skill-provenance."
  sunset: "2026-11-27"
---

# Deeper, not bigger

Hold the user's outcome fixed. Ambition means a better method, not more features.

Ask what the top practitioner would do, what raw material they would inspect, which instruments they would use and what outside observation would prove the result.

Grug lens: code is a liability. Configure before coding and reuse before building. Use tools as shipped. Add a wrapper, gate or check only for a linked failure of the plain tool or a concrete contract or risk it does not cover. Preserve raw data instead of replacing it with a convenient summary.

When a working draft is ready, review it for complexity before proving and merging. The first draft encodes your discovery path. Once you know the system and the solution, cut everything the outcome does not strictly need:

1. **Delete what the change replaces.** Migrate every caller and delete superseded modes, exports, styles and tests in the same slice under [migrate-callers-then-delete-legacy-apis](../principle-migrate-callers-then-delete-legacy-apis/SKILL.md).
2. **Collapse parallel controls and state.** Use one native control or browser event lifecycle (`focus` and `blur`, `<dialog>`, `<select>`, URL state) instead of pairing two controls or maintaining a custom state machine.
3. **Call existing boundaries directly.** Do not add pass-through wrappers, duplicate caches or test-only injection parameters when callers can use the existing boundary function.
4. **Rewrite from first principles when the draft is bloated.** If a working draft adds hundreds of lines for a focused capability, discard the draft and write it from scratch using what building it taught you before running consumer proof.

Done when the same outcome has a stronger Oracle, obsolete paths are deleted and no simpler direct implementation remains without expanding the scope.

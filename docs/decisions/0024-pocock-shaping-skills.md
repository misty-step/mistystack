# 0024: Shaping routes through vendored Pocock skills

- **Status:** accepted
- **Date:** 2026-11-05
- **Primitives:** `grilling`, `to-spec`, `to-tickets`, `domain-modeling`
- **Linear:** [MIS-870](https://linear.app/misty-step/issue/MIS-870), project "mistystack: OMP catalog, design pack and root-file contract"

## Context

[0022](0022-pstack-governs-owner-rulings.md) row 7 deleted Misty's `grill`
skill and left unsettled product intent to the owner with no route. On
2026-11-05 Phaedrus asked for one grilling and shaping method present in every
OMP session, and chose Matt Pocock's `grilling`, `grill-me`, `grill-with-docs`,
`to-spec`, `to-tickets`, `domain-modeling` and `to-questionnaire`.

The preferred mechanism was Pocock's official plugin through mistystack's
catalog, with the rest of his pack ignored. An isolated OMP 18.16.0 home showed
that this cannot select a stable subset. His plugin also ships `research`,
`tdd`, `prototype` and `teach`. OMP gives a duplicate skill name to the plugin
admitted first, and `install --force` of mistystack, our documented refresh,
moved bare `research` and `tdd` to Pocock's copies. `skills.ignoredSkills`
matches the raw name too, so ignoring his `research` also hides ours. A catalog
entry per skill directory installs, but OMP does not discover a plugin whose
root is a `SKILL.md`.

## Decision

Vendor the seven skills unchanged from `mattpocock/skills`. `vendor/pocock.lock.json`
owns the pin, source paths and file hashes; `bun scripts/sync-pocock.ts <checkout>`
regenerates them, and plugin lint rejects edited, missing or unrecorded files.
[Misty's Shaping section](../../skills/misty/SKILL.md#shaping) routes unsettled
intent to `grilling` and supplies the facts Pocock's per-repo setup would write:
the owning tracker from Foundation article 2, its workflow states, `DOMAIN.md`
and `docs/decisions/`. This supersedes 0022 row 7's "belongs to the owner"
without a route; the owner still decides every question.

## Consequences

The skills install wherever mistystack installs, with no name collisions and no
install-order dependence. Upgrading is a reviewed sync to a new commit, not a
catalog pin bump. The rest of Pocock's pack is not installed.

Revisit if OMP adds plugin-qualified skill selection
([MIS-873](https://linear.app/misty-step/issue/MIS-873)) or subset installation
from a plugin; then the official plugin can replace the vendored copy.

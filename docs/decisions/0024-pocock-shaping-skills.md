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
owns the pin, source paths and file hashes; `bun scripts/sync-skills.ts vendor/pocock.lock.json <checkout>`
regenerates them, and plugin lint rejects edited, missing or unrecorded files.
[Misty's shaping facts](../../skills/misty/shaping.md) routes unsettled
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

## Extension: multiple unchanged upstreams

On 2026-11-06, [MIS-940](https://linear.app/misty-step/issue/MIS-940) adds Warp's
`merge-risk` and `resolve-merge-conflicts` from `warpdotdev/common-skills`, pinned
in `vendor/warp.lock.json`. A single registry, `scripts/skill-locks.mjs`, owns
each pack's identity, repository and allowed source layout. One sync command,
`bun scripts/sync-skills.ts <lock> <checkout>`, replaces the pack-specific
implementation. Lint, installed-byte proof and the site's graph and skill index
consume that same registry and validated provenance.

Pocock sources remain `skills/<group>/<name>`; Warp sources are
`.agents/skills/<name>`. Destinations remain `skills/<name>`. The sync validates
every mapping and source before replacing any destination, preserves supporting
files and executable modes, and records unchanged bytes. The pstack generator
remains separate because its recorded patches and removals are a different contract.

Misty routes the two new intents. Ship-loop retains the overall and per-category
merge-risk verdicts in the PR's Merge Danger section and the single release-gate
assessment; forge conflicts use resolve-merge-conflicts. The names adapter maps
its upstream script prefix to the installed directory without modifying Warp's
bytes. Neither skill adds a PR review or CI gate.


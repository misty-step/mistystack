# mistystack

Maintain one harness-neutral method tree in Agent Skills format
(`skills/<name>/SKILL.md`) and thin native adapters from this repository.
Read [DOMAIN.md](DOMAIN.md) for terms and [USER_STORIES.md](USER_STORIES.md)
for the affected consumer contract. Native adapters serve OMP, Claude Code, Codex
and pi; private runtime setup belongs to the workstation plugin.

## Route the change

| Path | Owns |
| --- | --- |
| `.omp-plugin/`, `.claude-plugin/`, `.codex-plugin/`, `.agents/plugins/`, `package.json` | Native plugin, marketplace and pi package manifests |
| `rules/core.md` | Always-on core; keep it at most 20 lines |
| `skills/misty/` | The method on one page: work loop, ownership, autonomy, delegation, reporting, routes; principles and native harness references beside it |
| `skills/` | Task procedures; frontmatter follows DOMAIN.md. Skills under `vendor/*.lock.json` are upstream bytes; regenerate them through the lock |
| `adapters/` | Claude/Codex role agents and native hooks/extensions; model choices stay in harness-native configuration |
| `agents/` | OMP role agents at its fixed native discovery path |
| `.agents/skills/verify-mistystack/` | This repository's consumer proof |
| `scripts/`, `.github/`, `.githooks/` | Checks, release protection and secret scanning |
| `docs/guide/`, `docs/exemplars.md`, `ATTRIBUTION.md` | Human guide, exemplars and source notices |
| `docs/decisions/`, `docs/postmortems/` | Decisions and incident records; historical paths remain historical |

This repository is yours to shape: merge duplication, fix what you find next to
your change and delete what is dead. Vendored skills are the exception; change
them only through their lock.

Edit maintained source, not installed plugin copies. Keep one home per fact;
migrate callers before deleting an old path. Fleet runtime, credentials, hosts
and launchers belong to private `misty-step/workstation`. Adapters use
native harness mechanisms, not a custom installer or duplicated method content.
The method is one page with no base document beneath it
([ADR 0026](docs/decisions/0026-one-page-method.md)); add to a task skill or a
sibling file before adding to [misty](skills/misty/SKILL.md), and check any new
instruction against [agent-design](skills/agent-design/SKILL.md#writing-for-current-models).
Use [boat-workers](skills/boat-workers/SKILL.md) for one snapshot-backed worker
per slice and [watchdog](skills/watchdog/SKILL.md) for open-ended agent supervision.

## Verify and release

Prove the changed running consumer through
[verify-mistystack](.agents/skills/verify-mistystack/SKILL.md), including isolated
native loading when that path changes. Report skipped/unproved paths separately.
Merge after your proof passes without CI or review. The dispatched release gate
runs `./scripts/check`, fast site proof and one critical-correctness/security
assessment before publishing/deploying. No CI runs on PRs or pushes.

`./scripts/bootstrap` installs repository secret-scanning hooks. Landmark owns
CHANGELOG.md and release publication; follow
[docs/release-convention.md](docs/release-convention.md).

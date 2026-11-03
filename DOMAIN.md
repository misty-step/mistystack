# mistystack domain

Consumer contracts live in [USER_STORIES.md](USER_STORIES.md), maintainers route
through [AGENTS.md](AGENTS.md), and boundary decisions live in
[docs/decisions/](docs/decisions/index.md).

## Terms

- **Content tree:** the canonical method in open Agent Skills format,
  `skills/<name>/SKILL.md`, with supporting files beside each entry point.
- **Native adapter:** thin integration from this repository that exposes the
  content tree through a harness's own loading and configuration mechanisms,
  without a custom installer or a second copy of the method.
- **Core rule:** `rules/core.md`, the always-applied entry point and guardrails
  for sessions using the method.
- **Mode:** `misty`, the skill that routes nontrivial work to the relevant
  principles, playbook and task skills.
- **Principle leaf:** one on-demand `principle-<slug>` skill reached through the
  mode's index, not a duplicate of a core rule or task skill's procedure.
- **Playbook:** a task-type procedure under `skills/poteto-mode/playbooks/`, selected through Misty's router.
- **Skill:** a directory with a `SKILL.md` entry point and optional supporting
  material. References use relative Markdown links or the skill's name; native
  loading mechanics belong to the adapter.
- **Vendored foundation:** the pinned pstack skills, playbooks and agent
  references in `vendor/pstack.lock.json`. The lock owns source inventory,
  explicit exclusions, exact patches/removals and generated-file hashes.
  Recorded owner delivery changes remove obsolete upstream procedures instead
  of leaving contradictory instructions installed. Unchanged primitives retain
  upstream bytes apart from the harness pointer and recorded modifications.
- **Recompile review:** the monthly and model-capability-triggered reconsideration
  of a project's implementation from its vision and durable record, owned by
  [recompile](skills/recompile/SKILL.md). Keeping the system is a valid outcome.
- **Edition:** an opt-in breaking contract that consumers explicitly select.
  Existing editions keep working; migration does not silently change a consumer's
  record or command meaning.
- **Exemplar:** a person, codebase or piece of writing whose perspective we
  deliberately channel. The selected lenses, including products that embody
  them, live in [docs/exemplars.md](docs/exemplars.md); skill provenance follows
  invariant 2.
- **Rigor role:** one of `rigor-light`, `rigor-standard` and `rigor-critical`,
  independent of a particular model. Model and reasoning choices belong in
  harness-native configuration.
- **Task agent:** an independent worker given a brief. The brief sets its
  responsibility; the native adapter supplies dispatch and runtime selection.
- **Oracle:** a check outside the worker that can disprove completion, expressed
  as an exact command or real user path. It is evidence for
  [prove-it-works](skills/principle-prove-it-works/SKILL.md), not a core rule or a
  separate mandatory pre-dispatch gate.
- **Local development environment:** the environment where the agent runs.
  Its harness note owns local constraints. The
  [OMP note](skills/misty/harnesses/omp.md) names the operator's Tern+OMP setup.
- **Slice worker:** one isolated Boat environment, started from a saved clean
  toolchain snapshot, reused for a slice's portable execution, stopped when idle
  and deleted after its evidence is retained. [Boat workers](skills/boat-workers/SKILL.md)
  owns setup, access and lifecycle. Untrusted commands use fresh isolation.
- **Watchdog:** the active supervisor that periodically compares observed agent
  work with its brief, steers drift and recovers stalls until acceptance and
  cleanup finish. It imposes no agent wall-clock deadline.
- **Release gate:** fast CI and one critical-correctness/security assessment
  before publication/deployment, followed by live identity and journey proof.
  Author-owned running-product verification precedes merge without CI or review.
- **Workstation plugin:** the separate private `misty-step/workstation` plugin
  for fleet machinery, host configuration, credentials, audio and backup.
  It consumes the method without owning a copy of it.

## Invariants

1. **Small, always-on core.** `rules/core.md` is at most 20 lines, including
   frontmatter. Native adapters load the core; procedures load on demand.
2. **Skill provenance.** Misty-authored skills follow the frontmatter convention
   below. Its short `metadata.source` points to [ATTRIBUTION.md](ATTRIBUTION.md#skill-provenance), which owns full directory-level provenance, including supporting files. Vendored skills retain upstream frontmatter; `vendor/pstack.lock.json`
   owns their provenance, destinations, recorded exact patches/removals and file
   hashes. Preserve required licence notices for both. Regenerate vendored text
   and the lock; never hand-edit them.
3. **Harness-neutral method.** One content tree owns the method. Harness-specific
   tools, configuration, loading behavior and working environments live in
   disclosed native-adapter references, not shared procedures or the core.
4. **One home per fact.** Core rules, principles, procedures, model assignments,
   consumer stories and historical decisions each have one authority. References
   point there; cutovers migrate callers and remove the old home.
5. **Owned boundary.** Native-adapter verification uses isolated runtime state.
   Installation does not replace foreign configuration, credentials or runtime
   state. Fleet machinery stays in private `misty-step/workstation`.

## Skill frontmatter

[Agent design](skills/agent-design/SKILL.md) owns writing and changing skills;
this contract owns their fields. All skill names match directories and all
descriptions are non-empty. Vendored skills keep upstream's metadata rather
than acquiring Misty's convention; lint reads their provenance from the lock.
Principle leaves, poteto-mode and poteto-help remain explicit-only, including vendored leaves.

For Misty-authored skills, descriptions are trigger-first and
`metadata.prevents` cites observed failure evidence. The owner and sunset
identify who reviews drift and when.

```yaml
---
name: <directory name>
description: "When to use it; trigger first."
metadata:
  owner: phaedrus
  prevents: "The observed failure this skill prevents."
  source: "Short source identity; full directory provenance in ATTRIBUTION.md."
  sunset: "2026-11-27"
---
```

Metadata dates remain quoted strings so YAML 1.1 readers such as PyYAML can
serialize the skill as JSON. The plugin lint rejects plain date/timestamp values
and requires a non-empty string for `metadata.sunset`.

Model selectors and reasoning budgets belong in harness-native configuration,
not shared method prose or task-agent prompts. OMP's configuration and invocation
behavior are disclosed in the [OMP reference](skills/misty/harnesses/omp.md).

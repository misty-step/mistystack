# pstack names in Mistystack

Read a pstack name as the native route below, not a request to install Cursor. [Misty](../SKILL.md#misty-deltas) owns the surviving deltas. The lock records installed primitives and the retired delivery sources replaced by [ship-loop](../../ship-loop/SKILL.md). A shortened principle name resolves to `principle-<name>`. `poteto-mode` and `poteto-help` remain explicit-only alongside Misty.

## Routes

| pstack name | Misty route |
| --- | --- |
| `poteto-mode`, `poteto-help`, `Subagents`, `Non-negotiables`, `Autonomy` | [Poteto-mode](../../poteto-mode/SKILL.md) is the baseline, not only an explicit-request route. Read [poteto-help](../../poteto-help/SKILL.md) for its guide. Apply only [Misty's deltas](../SKILL.md#misty-deltas) and its [pipeline clarification](../SKILL.md#autonomy). |
| `architect`, `interrogate`, `swarm`, `figure-it-out`, `orchestrate`, `multi-phase-plan` | Read the installed [architect](../../architect/SKILL.md), [interrogate](../../interrogate/SKILL.md), [swarm](../../swarm/SKILL.md) or [figure-it-out](../../figure-it-out/SKILL.md) skill, or the named playbook below. The current rigor tier determines delegation. |
| `arena` | Read the installed [arena](../../arena/SKILL.md); [agent-design](../../agent-design/SKILL.md#instruction-eval) and [eval](../../poteto-mode/playbooks/eval.md) own instruction-trial evidence. Use native sessions under the current rigor tier. |
| `why`, `teach` | Read the installed [why](../../why/SKILL.md) or [teach](../../teach/SKILL.md); [research](../../research/SKILL.md) owns source verification and [how](../../how/SKILL.md) explains architecture. |
| `show-me-your-work`, `autonomous-run`, `/loop` | Read the installed [show-me-your-work](../../show-me-your-work/SKILL.md) or named playbook. Keep Git-native task state and decision trails under [Forge](#forge). |
| `opening-a-pr`, `Opening a PR`, `shipping`, `babysit`, `autopilot-full`, `autopilot-stack`, `Bugbot` | [Ship-loop](../../ship-loop/SKILL.md) owns build, author-run proof and merge, followed by the fast pre-deploy release gate. The obsolete upstream delivery procedures and PR watcher are not installed. |
| `unslop`, `technical-writing`, `no-comments`, `comment-sicko` | Read the installed [unslop](../../unslop/SKILL.md), [technical-writing](../../technical-writing/SKILL.md) or [no-comments](../../no-comments/SKILL.md) skill. pstack's writing rules govern. The [comment-sicko reference](../../../vendor/pstack-agents/comment-sicko.md) supplies a native agent's brief without a new installer. |
| `build-the-lever`, `principle-build-the-lever` | Read the installed [build-the-lever](../../principle-build-the-lever/SKILL.md) principle. |
| `exhaust-the-design-space`, `principle-exhaust-the-design-space` | Read the installed [exhaust-the-design-space](../../principle-exhaust-the-design-space/SKILL.md) principle under the current rigor tier. |
| `create-verification-skill`, `maintain-verification-skill`, `.cursor/skills/verify-*` | Follow the installed skills through [verification](../../verification/SKILL.md), writing and locating `.agents/skills/verify-<app>/` instead of every `.cursor/skills/verify-*` path. |
| `create-skill`, `correct`, `reflect`, `automate-me` | Native skill authoring through [agent-design](../../agent-design/SKILL.md); read the installed primitive for its craft. Project skills live in `.agents/skills/`, user skills in the destination harness's native skill root, never Cursor paths or an installed cache. |
| `writing-for-agents` (vendored Pocock skills) | [agent-design](../../agent-design/SKILL.md). |
| `setup-pstack`, `pstack-models.mdc` | [setup-mistystack](../../setup-mistystack/SKILL.md). |
| `recall`, `ketchup`, `ketchup-video`, `session-pickup`, `pause-safely`, `agent-transcripts` | Read the installed primitive and the owning work item, PR evidence and scoped native session history below. Daybook owns shared context, not a new transcript store. |
| `make-bot-ui` | Cursor webhook routines, secret-request cards and routine wake turns have no native equivalent in OMP, Claude Code, Codex or pi. Skip this skill with a one-line note, as upstream does for unavailable integrations. |
| `control-ui`, `control-cli`, `deslop`, `visualize` | Use native browser/CLI controls and [design](../../design/SKILL.md), with pstack's unslop and technical-writing for prose; do not install cursor-team-kit. |
| `typescript-best-practices` | Read the installed [typescript-best-practices](../../typescript-best-practices/SKILL.md) skill. |
| `statechart`, `create-formal-verification-skill`, `maintain-formal-verification-skill` | Read the installed [statechart](../../statechart/SKILL.md), [generator](../../create-formal-verification-skill/SKILL.md) or [maintenance](../../maintain-formal-verification-skill/SKILL.md) skill, including bundled scripts. [Foundation article 11](../../foundation/checklist.md#article-11) owns applicability. |
| `worktree-cleanup` | Use the harness's native Git/worktree tools; remove only owned, no-longer-needed state. |

Agent reference files are installed under `vendor/pstack-agents/`; they supply briefs, not harness-specific discovery. Read the [poteto-agent reference](../../../vendor/pstack-agents/poteto-agent.md) before dispatching its role through native sessions. The [lock](../../../vendor/pstack.lock.json) owns the pin, destinations and minimal recorded portability patches; upstream documentation outside the installed tree resolves at that pin.

## Installed paths

`pstack/skills/` in the [multi-phase-plan playbook](../../poteto-mode/playbooks/multi-phase-plan.md) is an upstream repository prefix, not a workspace directory. Replace that prefix with the absolute `skills/` directory of the active native installation. For example, run `node <installed-skills>/poteto-mode/scripts/check-plan.mjs <plan.md>`; the playbook and skill paths in the plan skeleton use the same root. Locate it through OMP's `skill://poteto-mode`, Claude Code's loaded plugin skill path, Codex's installed skill path, or pi's loaded skill path.

In [poteto-help](../../poteto-help/SKILL.md), `../../README.md` means the [upstream README](https://github.com/cursor/plugins/blob/c742dd61706fbacc1b95f1a20b7b988cf096ce6c/pstack/README.md), not Mistystack's README. Its seven `../../docs/guide/<file>.md` links resolve under [the pinned upstream guide](https://github.com/cursor/plugins/tree/c742dd61706fbacc1b95f1a20b7b988cf096ce6c/pstack/docs/guide), with the same filename: `01-setup.md`, `02-poteto-mode.md`, `06-verify-and-ship.md`, `07-overnight.md`, `08-principles.md`, `09-make-it-yours.md` and `10-recipes-and-pitfalls.md`. These are lock references, not installed guide files.

Warp's [resolve-merge-conflicts](../../resolve-merge-conflicts/SKILL.md) uses `.agents/skills/resolve-merge-conflicts/scripts/...` as an upstream prefix. Resolve it against the installed skill directory, not the working repository: locate `skill://resolve-merge-conflicts` in OMP (or the loaded skill path in another harness), then run `python3 <installed-resolve-merge-conflicts>/scripts/extract_conflict_context.py` from the conflicted repository.


## Bundled playbook files

These files resolve explicit upstream names. Apply only [Misty's surviving deltas](../SKILL.md#misty-deltas).

| pstack name | Installed file |
| --- | --- |
| `authoring-a-skill` | [Authoring a skill](../../poteto-mode/playbooks/authoring-a-skill.md) |
| `autonomous-run`, `orchestrate`, `multi-phase-plan` | [Autonomous run](../../poteto-mode/playbooks/autonomous-run.md), [Orchestrate](../../poteto-mode/playbooks/orchestrate.md), [Multi-phase plan](../../poteto-mode/playbooks/multi-phase-plan.md) |
| `autopilot-full`, `autopilot-stack`, `babysit`, `opening-a-pr`, `shipping` | [Ship-loop](../../ship-loop/SKILL.md) |
| `pause-safely`, `session-pickup`, `worktree-cleanup` | [Pause safely](../../poteto-mode/playbooks/pause-safely.md), [Session pickup](../../poteto-mode/playbooks/session-pickup.md), [Worktree cleanup](../../poteto-mode/playbooks/worktree-cleanup.md) |

## Native roles

[Setup-mistystack](../../setup-mistystack/SKILL.md) configures native `rigor-*`
roles and their model assignments. The brief names the rigor tier and the
responsibility, not a second model roster.

| pstack responsibility | Native mapping |
| --- | --- |
| Code delegate, `poteto-agent` | `rigor-<tier>` with a builder brief. |
| Prose or evaluation judgment | `rigor-<tier>` with author or blind-evaluation responsibility named in the brief. |
| Verification, swarm worker or release reviewer | `rigor-<tier>` with its verification partition or the single critical release assessment named in the brief. |

A second opinion is the same prompt against a different model family. A repeated
run from the same family is not a second opinion. Use a separately configured
native session when the active role mapping cannot provide the different family.
Pstack's [fresh-subagent rule](../../poteto-mode/SKILL.md#subagents) applies as
written. An evaluation judge and the release reviewer use separate threads; PRs need neither.

## Forge

Use `gh` for PRs and Linear for work items. Git-native task state is welcome,
including pushed branches, session pickup and
[show-me-your-work](../../show-me-your-work/SKILL.md) decision trails committed
when stakes need them. Neither Origin nor Graphite is required.
[ADR 0022](../../../docs/decisions/0022-pstack-governs-owner-rulings.md) removes
the no-Git-as-task-state restriction applied under
[ADR 0020](../../../docs/decisions/0020-github-and-linear-replace-entire.md).

For a Linear issue, include `Fixes MIS-<n>` in the PR body.

## Harness mechanisms

| pstack / Cursor name | OMP | Claude Code | Codex | pi |
| --- | --- | --- | --- | --- |
| `Task`, `subagent_type`, `generalPurpose`, `poteto-agent` | `task` with native `rigor-<tier>` through [Native roles](#native-roles) | Native `mistystack:rigor-<tier>` subagent | Native subagent with separately installed `rigor-<tier>` | Separately briefed sessions with the configured rigor role; no invented subagent API |
| `readonly: true`, `readonly/Ask` | Read-only tools and brief | Native tool permissions and brief | Native sandbox/tool permissions and brief | Read-only tools and brief |
| `run_in_background`, `run_in_background: true`, `resume` | Native handles, messages and completion events | Native background handles and resume | Native handles and completion/wait | Separately briefed sessions; no background/resume flag |
| `claude-*`, `grok-*`, `gpt-*`, `inherit-parent`, always-applied model rule | Native `modelRoles` | Native agent `model` | Native agent TOML model/reasoning | Native main-session configuration |
| `AskQuestion` | Plain operator question | Native question tool or plain question | Native question tool or plain question | Plain operator question |
| `todolist`, `file_attachments`, `.cursor/skills/`, `.cursor/plugins/`, `.cursor/rules/` | Native task state, file reads, `.agents/skills/` and installed Agent Skills; models stay in native configuration | Same | Same | Same |
| `agent-transcripts`, `PSTACK_TRANSCRIPTS_DIR` | Workspace-scoped native history/archive and actual task transcripts; export only the authorized sessions when a file is required | Scoped session transcript/export from the active native project/session | Scoped native session transcript/export | Scoped session transcript/export |
| `cursor-team-kit`, `deslop`, `control-ui`, `control-cli` | Native diff review and browser/CLI controls, with [design](../../design/SKILL.md) and [verification](../../verification/SKILL.md) | Same | Same | Same |
| `Origin`, `Graphite`, `built-in PR tool`, `Bugbot` | `gh` through [Forge](#forge) and [ship-loop](../../ship-loop/SKILL.md); no bot, check or review is a PR merge requirement | Same | Same | Same |
| `Automations`, `cloud agents`, `environment: "cloud"`, `environment: "local"`, `cloud_base_branch` | Native task/session handles and isolated worktrees at the named branch/SHA. [Boat workers](../../boat-workers/SKILL.md) owns a snapshot-backed worker per slice and [watchdog](../../watchdog/SKILL.md) owns open-ended supervision. Cursor webhook routines have no native equivalent; [make-bot-ui](../../make-bot-ui/SKILL.md) is skipped with a one-line note. | Same, through native subagents | Same, through native subagents | Separately briefed native sessions; no invented subagent API |

Skipped integrations never skip the real consumer proof. Codex's exercised plugin runtime does not discover custom agents; pi has no native subagents or rigor-agent discovery. Native details: [OMP](omp.md), [Claude Code](claude.md), [Codex](codex.md), [pi](pi.md).

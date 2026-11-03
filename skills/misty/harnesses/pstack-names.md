# pstack names in Mistystack

Read a pstack name as the native route below, not a request to install Cursor. [Misty](../SKILL.md#non-negotiables) owns routing and rigor policy; this adapter maps names, not policy. Every upstream skill is installed at `skills/<name>/SKILL.md`, every playbook at `skills/poteto-mode/playbooks/<name>.md`, and a shortened principle name resolves to `principle-<name>`. `poteto-mode` and `poteto-help` remain explicit-only alongside Misty.

## Routes

| pstack name | Misty route |
| --- | --- |
| `poteto-mode`, `poteto-help`, `Subagents`, `Non-negotiables`, `Autonomy` | Read [poteto-mode](../../poteto-mode/SKILL.md) or [poteto-help](../../poteto-help/SKILL.md) when explicitly requested. Its [Autonomy](../../poteto-mode/SKILL.md#autonomy) section owns ask-first; [Misty](../SKILL.md) owns routing and rigor. |
| `architect`, `interrogate`, `swarm`, `figure-it-out`, `orchestrate`, `multi-phase-plan` | Read the installed [architect](../../architect/SKILL.md), [interrogate](../../interrogate/SKILL.md), [swarm](../../swarm/SKILL.md) or [figure-it-out](../../figure-it-out/SKILL.md) skill, or the named playbook below. The current rigor tier determines delegation. |
| `arena` | Read the installed [arena](../../arena/SKILL.md); [agent-design](../../agent-design/SKILL.md#instruction-eval) and [eval](../../poteto-mode/playbooks/eval.md) own instruction-trial evidence. Use native sessions under the current rigor tier. |
| `why`, `teach` | Read the installed [why](../../why/SKILL.md) or [teach](../../teach/SKILL.md); [research](../../research/SKILL.md) owns source verification and [how](../../how/SKILL.md) explains architecture. |
| `show-me-your-work`, `autonomous-run`, `/loop` | Continue the owning playbook to its Oracle/stop predicate using native sessions; retain attempt evidence under Misty's forge override, not a TSV log or a new polling service. |
| `opening-a-pr`, `Opening a PR`, `shipping`, `babysit`, `autopilot-full`, `autopilot-stack`, `Bugbot` | Misty's shipping override; the [ship-loop](../../ship-loop/SKILL.md) owns procedure. |
| `unslop`, `technical-writing`, `no-comments`, `comment-sicko` | Read the installed [unslop](../../unslop/SKILL.md), [technical-writing](../../technical-writing/SKILL.md) or [no-comments](../../no-comments/SKILL.md) skill. pstack's writing rules govern. The [comment-sicko reference](../../../vendor/pstack-agents/comment-sicko.md) supplies a native agent's brief without a new installer. |
| `build-the-lever`, `principle-build-the-lever` | Read the installed [build-the-lever](../../principle-build-the-lever/SKILL.md) principle. |
| `exhaust-the-design-space`, `principle-exhaust-the-design-space` | Read the installed [exhaust-the-design-space](../../principle-exhaust-the-design-space/SKILL.md) principle under the current rigor tier. |
| `create-verification-skill`, `maintain-verification-skill`, `.cursor/skills/verify-*` | Follow the installed skills through [verification](../../verification/SKILL.md), writing and locating `.agents/skills/verify-<app>/` instead of every `.cursor/skills/verify-*` path. |
| `create-skill`, `correct`, `reflect`, `automate-me` | Native skill authoring through [agent-design](../../agent-design/SKILL.md); read the installed primitive for its craft. Project skills live in `.agents/skills/`, user skills in the destination harness's native skill root, never Cursor paths or an installed cache. |
| `setup-pstack`, `pstack-models.mdc` | [setup-mistystack](../../setup-mistystack/SKILL.md). |
| `recall`, `ketchup`, `ketchup-video`, `session-pickup`, `pause-safely`, `agent-transcripts` | Read the installed primitive and the owning work item, PR evidence and scoped native session history below. Daybook owns shared context, not a new transcript store. |
| `make-bot-ui`, `control-ui`, `control-cli`, `deslop`, `visualize` | Read the installed make-bot-ui primitive for authorized native webhooks. Use native browser/CLI controls and [design](../../design/SKILL.md), with pstack's unslop and technical-writing for prose; do not install cursor-team-kit. |
| `typescript-best-practices` | Read the installed [typescript-best-practices](../../typescript-best-practices/SKILL.md) skill. |
| `statechart`, `create-formal-verification-skill`, `maintain-formal-verification-skill` | Read the installed [statechart](../../statechart/SKILL.md), [generator](../../create-formal-verification-skill/SKILL.md) or [maintenance](../../maintain-formal-verification-skill/SKILL.md) skill, including bundled scripts. [Foundation article 11](../../foundation/checklist.md#article-11) owns applicability. |
| `worktree-cleanup` | Use the harness's native Git/worktree tools; remove only owned, no-longer-needed state. |

Agent reference files are installed under `vendor/pstack-agents/`; they supply briefs, not harness-specific discovery. Read the [poteto-agent reference](../../../vendor/pstack-agents/poteto-agent.md) before dispatching its role through native sessions. The [lock](../../../vendor/pstack.lock.json) owns the pin, destinations and minimal recorded portability patches; upstream documentation outside the installed tree resolves at that pin.

## Bundled playbook files

These newly available files resolve explicit upstream names; the routing and shipping overrides above still apply.

| pstack name | Installed file |
| --- | --- |
| `authoring-a-skill` | [Authoring a skill](../../poteto-mode/playbooks/authoring-a-skill.md) |
| `autonomous-run`, `orchestrate`, `multi-phase-plan` | [Autonomous run](../../poteto-mode/playbooks/autonomous-run.md), [Orchestrate](../../poteto-mode/playbooks/orchestrate.md), [Multi-phase plan](../../poteto-mode/playbooks/multi-phase-plan.md) |
| `autopilot-full`, `autopilot-stack`, `babysit`, `opening-a-pr`, `shipping` | [Autopilot-full](../../poteto-mode/playbooks/autopilot-full.md), [Autopilot-stack](../../poteto-mode/playbooks/autopilot-stack.md), [Babysit](../../poteto-mode/playbooks/babysit.md), [Opening a PR](../../poteto-mode/playbooks/opening-a-pr.md), [Shipping](../../poteto-mode/playbooks/shipping.md) |
| `pause-safely`, `session-pickup`, `worktree-cleanup` | [Pause safely](../../poteto-mode/playbooks/pause-safely.md), [Session pickup](../../poteto-mode/playbooks/session-pickup.md), [Worktree cleanup](../../poteto-mode/playbooks/worktree-cleanup.md) |


## Harness mechanisms

| pstack / Cursor name | OMP | Claude Code | Codex | pi |
| --- | --- | --- | --- | --- |
| `Task`, `subagent_type`, `generalPurpose`, `poteto-agent` | `task`; task workers or `rigor-<tier>` for rigor roles | Native subagent; `mistystack:rigor-<tier>` for rigor roles | Native subagent; separately installed `rigor-<tier>` | Work inline; independent roles need separately briefed sessions |
| `readonly: true`, `readonly/Ask` | Read-only tools and brief | Native tool permissions and brief | Native sandbox/tool permissions and brief | Read-only tools and brief |
| `run_in_background`, `run_in_background: true`, `resume` | Native handles, messages and completion events | Native background handles and resume | Native handles and completion/wait | Separately briefed sessions; no background/resume flag |
| `claude-*`, `grok-*`, `gpt-*`, `inherit-parent`, always-applied model rule | Native `modelRoles` | Native agent `model` | Native agent TOML model/reasoning | Native main-session configuration |
| `AskQuestion` | Plain operator question | Native question tool or plain question | Native question tool or plain question | Plain operator question |
| `todolist`, `file_attachments`, `.cursor/skills/`, `.cursor/plugins/`, `.cursor/rules/` | Native task state, file reads, `.agents/skills/` and installed Agent Skills; models stay in native configuration | Same | Same | Same |
| `agent-transcripts`, `PSTACK_TRANSCRIPTS_DIR` | Workspace-scoped native history/archive and actual task transcripts; export only the authorized sessions when a file is required | Scoped session transcript/export from the active native project/session | Scoped native session transcript/export | Scoped session transcript/export |
| `cursor-team-kit`, `deslop`, `control-ui`, `control-cli` | Native diff review and browser/CLI controls, with [design](../../design/SKILL.md) and [verification](../../verification/SKILL.md) | Same | Same | Same |
| `Origin`, `built-in PR tool`, `Bugbot` | GitHub CLI and Misty's shipping override; unavailable bot integration never replaces independent review | Same | Same | Same |
| `Automations`, `cloud agents`, `environment: "cloud"`, `environment: "local"`, `cloud_base_branch` | Native task/session handles and isolated worktrees at the named branch/SHA; use the owning task's native execution and isolation contract, not Cursor-only flags. Webhooks use the patched [make-bot-ui](../../make-bot-ui/SKILL.md) contract | Same, through native subagents | Same, through native subagents | Separately briefed native sessions; no invented subagent API |

Skipped integrations never skip required proof or independent judgment. Codex's exercised plugin runtime does not discover custom agents; pi has no native subagents or rigor-agent discovery. Native details: [OMP](omp.md), [Claude Code](claude.md), [Codex](codex.md), [pi](pi.md).

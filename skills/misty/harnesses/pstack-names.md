# pstack names in Mistystack

Read a pstack name as the native route below, not a request to install Cursor. [Misty](../SKILL.md#non-negotiables) owns overrides; the tables map names without changing them. A name written bare, as `/name`, `the **name** skill`, `the \`name\` skill` or a relative link has the same route. Installed skill names resolve to `skills/<name>/SKILL.md`; a shortened principle name resolves to `principle-<name>`.

## Routes

| pstack name | Misty route |
| --- | --- |
| `poteto-mode`, `poteto-help`, `Subagents`, `Non-negotiables`, `Autonomy` | [Misty](../SKILL.md), with its [Subagents](../SKILL.md#subagents), [Non-negotiables](../SKILL.md#non-negotiables) and [Autonomy](../SKILL.md#autonomy) sections replacing the poteto-mode sections. |
| `architect`, `interrogate`, `swarm`, `figure-it-out`, `orchestrate`, `multi-phase-plan` | [grill](../../grill/SKILL.md) for unsettled scope, then the matching [playbook](../SKILL.md#playbooks); apply Misty's bounded-delegation override, not parallel designs or panels. |
| `arena` | Instruction trials use [agent-design](../../agent-design/SKILL.md#instruction-eval); other experiments use [eval](../playbooks/eval.md) with predeclared variants and one blind judge through native sessions, not a candidate tournament. Blast-radius uses the existing ship-loop QA/review, not an arena. |
| `why`, `teach` | [research](../../research/SKILL.md) for history and versioned sources; [how](../../how/SKILL.md) for architecture. |
| `show-me-your-work`, `autonomous-run`, `/loop` | Continue the owning playbook to its Oracle/stop predicate using native sessions; retain attempt evidence under Misty's forge override, not a TSV log or a new polling service. |
| `opening-a-pr`, `Opening a PR`, `shipping`, `babysit`, `autopilot-full`, `autopilot-stack`, `Bugbot` | Misty's shipping override; the [ship-loop](../../ship-loop/SKILL.md) owns procedure. |
| `unslop`, `technical-writing`, `no-comments`, `comment-sicko` | [writing](../../writing/SKILL.md) governs their use, including blast-radius's write-up. |
| `build-the-lever`, `principle-build-the-lever` | [deeper-not-bigger](../../principle-deeper-not-bigger/SKILL.md): use tools as shipped; a custom mechanism needs an uncovered concrete contract or risk. |
| `exhaust-the-design-space`, `principle-exhaust-the-design-space` | [design](../../design/SKILL.md) for bounded alternatives; no default competing implementations. |
| `create-verification-skill`, `maintain-verification-skill`, `.cursor/skills/verify-*` | Follow the installed skills through [verification](../../verification/SKILL.md), writing and locating `.agents/skills/verify-<app>/` instead of every `.cursor/skills/verify-*` path. |
| `create-skill`, `correct`, `reflect`, `automate-me` | [agent-design](../../agent-design/SKILL.md) for maintained instructions; installed correct supplies recurring-mistake craft. |
| `setup-pstack`, `pstack-models.mdc` | [setup-mistystack](../../setup-mistystack/SKILL.md). |
| `recall`, `ketchup`, `ketchup-video`, `session-pickup`, `pause-safely` | Read the owning work item, PR evidence and native session; Daybook owns shared context. |
| `make-bot-ui`, `control-ui`, `control-cli`, `deslop` | Use available native browser/CLI controls and [design](../../design/SKILL.md) or writing; do not install cursor-team-kit. |
| `typescript-best-practices` | [type-system-discipline](../../principle-type-system-discipline/SKILL.md). |
| `statechart`, `create-formal-verification-skill`, `maintain-formal-verification-skill` | For commissioned high-stakes work only, read their pinned upstream source as described below; [Foundation article 11](../../foundation/checklist.md#article-11) owns applicability. |
| `worktree-cleanup` | Use the harness's native Git/worktree tools; remove only owned, no-longer-needed state. |

For excluded upstream reference material, resolve `skills/<name>/SKILL.md` (or a vendored relative link's source path) against [the lock](../../../vendor/pstack.lock.json): `https://github.com/cursor/plugins/blob/<commit>/pstack/<source-path>`. This supplies the statechart and formal-verification reading URLs at the actual pin. Read reference material only within the route above; it does not override Misty or become an installed skill. The site resolves excluded relative links to that URL.

## Harness mechanisms

| pstack / Cursor name | OMP | Claude Code | Codex | pi |
| --- | --- | --- | --- | --- |
| `Task`, `subagent_type`, `generalPurpose`, `poteto-agent` | `task`; task workers or `rigor-<tier>` for rigor roles | Native subagent; `mistystack:rigor-<tier>` for rigor roles | Native subagent; separately installed `rigor-<tier>` | Work inline; independent roles need separately briefed sessions |
| `readonly: true`, `readonly/Ask` | Read-only tools and brief | Native tool permissions and brief | Native sandbox/tool permissions and brief | Read-only tools and brief |
| `run_in_background: true`, `resume` | Native handles, messages and completion events | Native background handles and resume | Native handles and completion/wait | No background/resume mapping |
| `claude-*`, `grok-*`, `gpt-*`, `inherit-parent`, always-applied model rule | Native `modelRoles` | Native agent `model` | Native agent TOML model/reasoning | Native main-session configuration |
| `AskQuestion` | Plain operator question | Native question tool or plain question | Native question tool or plain question | Plain operator question |
| `todolist`, `file_attachments`, `.cursor/skills/`, `.cursor/plugins/`, `.cursor/rules/`, `agent-transcripts` | Native task state and file reads; installed Agent Skills and core | Same | Same | Same |
| `cursor-team-kit`, `Origin`, `Automations`, `cloud agents`, `built-in PR tool`, `environment: "cloud"`, `environment: "local"`, `cloud_base_branch` | No Cursor integration or flag mapping; follow the routes above | Same | Same | Same |

Skipped integrations never skip required proof or independent judgment. Codex's exercised plugin runtime does not discover custom agents; pi has no native subagents or rigor-agent discovery. Native details: [OMP](omp.md), [Claude Code](claude.md), [Codex](codex.md), [pi](pi.md).

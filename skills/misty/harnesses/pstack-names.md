# pstack names in Mistystack

Read a pstack name as the native mechanism below, not a request to install
Cursor. [Misty](../SKILL.md) owns routing; [setup](../../setup-mistystack/SKILL.md)
owns model assignments and [ship-loop](../../ship-loop/SKILL.md) owns delivery.
Use only delegation named by the loaded procedure, with Misty's brief and Oracle.

| pstack / Cursor name | OMP | Claude Code | Codex | pi |
| --- | --- | --- | --- | --- |
| `Task`, `subagent_type`, `generalPurpose`, `poteto-agent` | `task`, `agent: "rigor-<tier>"` | Native subagent, `mistystack:rigor-<tier>` | Native subagent, separately installed `rigor-<tier>` | Work inline; independent roles need separately briefed sessions |
| `readonly: true`, `readonly/Ask` | Read-only tools and brief | Native tool permissions and brief | Native sandbox/tool permissions and brief | Read-only tools and brief |
| `run_in_background: true`, `resume` | Native task handles, messages and completion events | Native background subagent handles and resume | Native agent handles and completion/wait | No subagent background or resume mapping |
| `claude-*`, `grok-*`, `gpt-*`, `inherit-parent`, `pstack-models.mdc`, always-applied model rule | Native `modelRoles` | Native agent `model` | Native agent TOML `model` and reasoning | Native main-session model configuration |
| `cursor-team-kit` skills (`deslop`, `control-cli`, `control-ui`, `create-skill`) | Available native CLI/browser tools; agent-design for skills | Available native CLI/browser tools; agent-design for skills | Available native CLI/browser tools; agent-design for skills | Available native CLI/browser tools; agent-design for skills |
| Bugbot, Automations, cloud agents, built-in PR tool, Origin, `/loop` | ship-loop, GitHub PRs and Linear; no polling service added | Same | Same | Same, with independent authorized sessions |
| `AskQuestion` | Plain operator question | Native question tool or plain question | Native question tool or plain question | Plain operator question |
| todolist, `file_attachments`, `.cursor/skills/`, `.cursor/plugins/`, `.cursor/rules/`, agent-transcripts | Native task state and file reads; installed Agent Skills and core; Daybook for shared context | Same | Same | Same |

Skipped in OMP: Cursor-only Automations, cloud placement, Bugbot invocation and
Origin commands; `environment: "cloud"` and `cloud_base_branch` are not OMP flags.
Skipped in Claude Code: the same Cursor-only operations and flags.
Skipped in Codex: the same Cursor-only operations and flags; plugin-delivered
custom agents are not supported in the exercised runtime.
Skipped in pi: the same Cursor-only operations and flags, native subagents,
per-agent model roles, background/resume handles and `rigor-*` agent discovery.
A skipped integration never skips the task's required proof or independent judge.

Native details: [OMP](omp.md), [Claude Code](claude.md), [Codex](codex.md), [pi](pi.md).

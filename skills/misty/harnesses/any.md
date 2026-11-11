# Any harness

Mistystack needs two things from a harness, and nearly every coding agent provides both: it reads Agent Skills (`<name>/SKILL.md` directories) and it reads an always-on instruction file such as `AGENTS.md`. This note is the install path for every harness, including Cursor, Antigravity, Prime Agent, OpenCode, Gemini CLI and ones we have not met yet. [OMP](omp.md), [Claude Code](claude.md), [Codex](codex.md) and [pi](pi.md) also have a native plugin that does the same job in one step; use whichever you prefer there.

## 1. Skills

Install the whole `skills/` tree, so that the links between skills resolve:

```sh
npx skills add misty-step/mistystack -g
```

The [skills CLI](https://github.com/vercel-labs/skills) detects the agents on the machine and links each one to a single copy. Add `-a <agent>` to target one, and run `npx skills update` to refresh. Without Node, clone this repository and copy or link `skills/*` into the harness's skills directory:

| Harness | Project path | User path |
| --- | --- | --- |
| Cursor | `.agents/skills/` | `~/.cursor/skills/` |
| Antigravity | `.agents/skills/` | `~/.gemini/config/skills/` |
| Codex, pi, Kimi Code, Zed, Warp | `.agents/skills/` | `~/.agents/skills/` |
| Claude Code | `.claude/skills/` | `~/.claude/skills/` |
| OpenCode | `.agents/skills/` | `~/.config/opencode/skills/` |
| Gemini CLI | `.agents/skills/` | `~/.gemini/skills/` |
| Mistral Vibe | `.vibe/skills/` | `~/.vibe/skills/` |
| Anything else | `.agents/skills/` | the path its documentation names |

These paths come from the skills CLI's agent table. A harness changes its paths more often than we change this file, so read its own documentation when a skill does not appear.

A skills-only install leaves out this repository's `docs/`, `vendor/` and root files. A few skills link to them for provenance and decisions; those links are not needed to do the work.

## 2. The core

The seven lines in [`rules/core.md`](../../../rules/core.md) must be in context at the start of every session. Put its body, without the frontmatter, into the always-on instruction file the harness reads for every project, between these markers so that a refresh replaces it instead of appending a second copy:

```markdown
<!-- mistystack:core -->
...the lines of rules/core.md...
<!-- /mistystack:core -->
```

For most harnesses that file is a user-level `AGENTS.md`. Antigravity reads `AGENTS.md` or `GEMINI.md` and `.agents/rules/*.md`; Cursor reads `AGENTS.md` and its user rules. Where a harness has only per-project instructions, put the block in the project's `AGENTS.md`. Keep whatever else the file holds.

Without the core, the method still loads when the model picks the `misty` skill for nontrivial work, but small tasks lose the standing rules. Treat a missing core as a failed install.

## 3. Roles and effort

Do the work in the main session, and use the harness's own subagent mechanism with [Misty's brief](../SKILL.md#the-brief) where [delegation](../SKILL.md#delegation) has a reason. The [rigor tier](../../ship-loop/roles.md#rigor) sets how deep the proof goes; it does not need a dedicated agent definition. Choose models and effort in the harness's own configuration: a role that carries critical work runs on the strongest model available, and a fully specified slice can run on a fast one.

`recompile` and `setup-mistystack` ask not to be invoked automatically. A harness that ignores that request will list them with the others, which does no harm.

## 4. Prove it loaded

Start a fresh session in a scratch project. Ask it to quote the first line of its standing instructions that mentions saying what the user wants, then to open the `misty` skill, follow its ship-loop link and quote that skill's first heading. Keep the session's actual file reads as the evidence. Files on disk and the model's own account are not proof that the method loaded.

## Companion packs

The design and cleanup packs we use beside mistystack are listed, pinned by commit, in [`.omp-plugin/marketplace.json`](../../../.omp-plugin/marketplace.json). On any harness, install each from its repository at that commit, through the harness's plugin command or `npx skills add <owner>/<repo>`.

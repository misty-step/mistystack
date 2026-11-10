# 0026: The method is one page; pstack is not vendored

Status: proposed, 2026-11-10. Unproven until the comparison under Consequences runs.
Supersedes [0021](0021-pstack-is-the-foundation.md) and the "pstack governs" rule of
[0022](0022-pstack-governs-owner-rulings.md). The owner's rulings recorded in 0022,
[0023](0023-live-verification-and-release-gate.md) and
[0024](0024-pocock-shaping-skills.md) stay in force and are restated in the mode.

## Context

Phaedrus, 2026-11-10: "radically simplify and reimagine mistystack in the most
fable-forward manner possible", drawing on what is here and on the Daybook backlog.

From 2026-11-03 the method was three layers. The vendored pstack tree was written
for Cursor. A 12.7 KB names map translated its tool, model and skill names. The
`misty` skill then listed the places where the owner had overruled it. A nontrivial
task loaded about 53 KB of instruction before any procedure, and the reader had to
reconcile the layers on every task.

[Anthropic's guide for Claude Fable 5.2](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-2)
reports measured effects that bear on that shape. The model follows instructions
closely, so text that older models ignored now costs tokens or changes behavior.
An exception stated apart from its rule was honored in about one try in ten, and
in about nine in ten when written into the rule. Standing instructions to delegate
are followed on tasks that do not need them. Hard style limits make prose choppy.
A request to write reasoning into the reply can be refused. Our tree had each of
these: the deploy exception lived in a different file from pstack's pause rule,
several vendored skills mandated subagents, the reply rules banned punctuation,
and the mode asked the agent to name each principle that shaped a decision. The
Claude adapter also sent critical-rigor work to a weaker model than its parent.

The backlog pointed the same way. Lauren Tan, pstack's author, now calls
adversarial review mostly wasted tokens and is reducing it in favor of empirical
and formal verification. Matt Pocock argues for verifiability over readability.
Addy Osmani asks a report to name what its check did not cover and the decisions
made for the reader. Browser Use reports deleting 90 percent of its harness with
better results. The sources are in [exemplars](../exemplars.md).

No comparison supported the layered tree. The
[kernel trial](../evals/2026-10-28-kernel-trial.md) predates pstack adoption and
ran on another model, and 0021 waived the empirical gate.

## Decision

The mode is one self-contained page, [misty](../../skills/misty/SKILL.md), with no
base document beneath it. It states the work loop, code ownership, the actions
that need no approval and the ones that wait for the owner, the conditions for
delegation, and what a report carries. Principles are one supporting file. The
always-on [core](../../rules/core.md) stands alone for small work.

We do not vendor pstack. Its skills, playbooks, principle leaves, agent
references, patches, lock, sync script and names map are removed. What we still
want from it is restated in our own words where a capable model would not already
do it, and left out where it would. pstack remains a recommended companion to
install beside mistystack, in particular for its statechart and
formal-verification tools; composing companion packs through a harness catalog is
[MIS-867](https://linear.app/misty-step/issue/MIS-867)'s work.

Matt Pocock's shaping skills and Warp's merge skills stay vendored unchanged
under their locks. Misty-authored task skills keep their bodies; this change only
repoints them and removes instructions the guide identifies as harmful.

Rigor roles on Claude Code inherit the session's model and vary effort.

## Consequences

- The load path for a nontrivial task falls from about 53 KB to about 13 KB, and
  the repository from 86 skills to 24.
- Task-type procedures for forensics, hillclimbing, visual parity, session
  pickup and multi-agent bake-offs are gone as files. The mode keeps one line
  for the shapes where we have seen agents go wrong.
- Upstream improvements to pstack no longer arrive by sync. Reading it is now a
  deliberate act, recorded in exemplars.
- Removed public pages redirect to their nearest maintained page.
- **Unproven.** Daybook decision 6 requires every slimming to beat both the old
  instructions and none. That comparison has not run: it needs real task bases
  and stored traces ([MIS-889](https://linear.app/misty-step/issue/MIS-889),
  [MIS-890](https://linear.app/misty-step/issue/MIS-890)). Run
  [agent-design's instruction eval](../../skills/agent-design/SKILL.md#instruction-eval)
  with this tree, the tree at `c750ff4` and no instructions, on Fable 5.2 at
  `high` and `medium` and on the factory's default model. Keep this decision
  only if it wins under the rule fixed before the runs.
- Revisit if that comparison favors the layered tree, if a removed procedure's
  absence shows up as a repeated correction, or if a later model changes what
  needs saying.

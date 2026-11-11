# 0026: The method is one page; pstack is not vendored

Status: accepted, 2026-11-10.
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

Phaedrus, later on 2026-11-10, on whether to hold this for a comparison: "I
don't want us to do too much thumb twiddling on evals. I want to just go with
whatever the research suggests and whatever your judgment suggests, and err on
the side of simplicity."

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

No harness is the reference harness. We use Claude Code, Codex, OMP, pi, Prime
Agent, Antigravity, Cursor and others, and the set changes faster than this
repository does. The contract is the
[universal install](../../skills/misty/harnesses/any.md): the content tree in the
harness's Agent Skills directory and the core in its always-on instruction file.
The native adapters for Claude Code, Codex, OMP and pi stay as conveniences over
it. Shared skills name no harness's tools; that detail lives in the harness
notes. [MIS-867](https://linear.app/misty-step/issue/MIS-867)'s OMP-only cutover
is withdrawn. Its companion-pack catalog is already on `master` in OMP's
marketplace file, which stays the one list of pins; other harnesses install each
pack from its repository at that pin. pstack is not added to it.

Method changes ship on evidence and judgment. Agent-design's three-arm
comparison is a tool for a disputed or expensive call, not a gate on every edit.
This replaces Daybook decision 6's rule that every slimming be a three-arm
comparison.

## Consequences

- The load path for a nontrivial task falls from about 53 KB to about 13 KB, and
  the repository from 86 skills to 24.
- Task-type procedures for forensics, hillclimbing, visual parity, session
  pickup and multi-agent bake-offs are gone as files. The mode keeps one line
  for the shapes where we have seen agents go wrong.
- Upstream improvements to pstack no longer arrive by sync. Reading it is now a
  deliberate act, recorded in exemplars.
- Removed public pages redirect to their nearest maintained page.
- No behavioral comparison backs this change, by the owner's ruling above. The
  evidence is the vendor's measured guidance and a reading of the tree.
- Revisit if a removed procedure's
  absence shows up as a repeated correction, or if a later model changes what
  needs saying.

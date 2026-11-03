---
name: ship-loop
description: "Ship confirmed scope through builder, independent QA/review, judge, merge and release proof; use for a delivery lane or 'run the loop'."
metadata:
  owner: phaedrus
  prevents: "Delivery drift and repeated review rounds: loaded in 15 audited sessions; real-path verification counters 'fix still fails' corrections (36). Reviewer-driven fix loops and renewed rounds after retries: bounded behind judge rulings in mistystack PRs #450 and #454."
  source: "Misty Step; provenance in ATTRIBUTION.md#skill-provenance."
  sunset: "2026-11-27"
---

# Ship loop

Use the work-item tracker defined by [Foundation article 2](../foundation/checklist.md#article-2).
GitHub hosts PRs and their reports; the PR's comments own its review ledger.
[Merge preflight](merging.md#merge-preflight) owns the merge gate, including the generator-only exception.

## 1. Settle the unit

Carry confirmed intent forward. Unsettled product intent goes to [figure-it-out](../figure-it-out/SKILL.md);
a builder needs the briefing contract in the `misty` skill and [roles.md](roles.md).
Select the task procedure through [Misty's playbook routing](../misty/SKILL.md#playbooks).
Split the whole outcome into independently useful, atomically shippable PRs that keep existing users working. Give each a bounded diff and risk check; infrastructure earns a slice only with a usable consumer contract. Prove one complete useful path, then scale the demonstrated method. [sequence-verifiable-units](../principle-sequence-verifiable-units/SKILL.md) owns execution and delivery order.
Record `Story: <IDs>` from SPEC.md or USER_STORIES.md, or `Story: none`, and
`Rigor: <tier> — <changed-path risk>` with diff size; preflight owns exceptions.

The frontier contains tickets whose blockers are closed or have one open PR.
Apply misty's delegation boundary to disjoint subagent writers through your harness's mechanism. A child
with one open blocker starts at that PR's head and targets its branch; QA/review
use that base and exclude its owned diff. Fix a blocker in the PR that owns it.
With two open blocker PRs, wait for one to land.

Done when each unit has an Oracle, a base and the [rigor role](roles.md#rigor)
assigned by the `setup-mistystack` skill.

For the unit's safety fact, use pstack's [blast-radius](../blast-radius/SKILL.md).
Its real-code proof belongs in this round's existing QA/review and judge evidence,
not a second review panel; Misty's delegation and shipping overrides still apply.

## 2. Run the round

Use this skill's installed directory as `<skill-dir>`. Run
`bun <skill-dir>/scripts/ship-loop.ts --help`; the helper is the only writer path.
It authenticates the PR author as the sole ledger writer, ignores other authors'
markers, and stops on unknown authors or unreadable trusted events. A new session,
retry, rebase or changed SHA resumes the same round, never a fresh allowance.

1. **Build.** Start from the recorded base under misty's delegation boundary. The builder returns
   PR, head SHA, native thread ID and proof. `init --pr <url> ...` records them;
   existing state resumes. Verification follows the `verification` skill.
2. **Verify.** `prompt --role qa-review` for light; `qa` and `review` otherwise.
   Dispatch the generated briefs through your harness's mechanism for the selected rigor tier, then
   `record --kind report --file <payload.json>`. One QA owner per SHA; an additional
   independent QA pass needs a concrete critical uncertainty.
3. **Judge.** `prompt --role judge` points at [judge.md](judge.md) for the ruling
   and proof contract, then `record --kind verdict`. Only an independent judge's
   FIX naming eligible introduced blockers authorizes a fix.
   The builder owns code blockers; the conductor owns missing proof.
4. **Resolve.** For FIX, use `prompt --role fix-builder`, record the resulting
   head, then dispatch a fresh `recheck` thread in the blocking reporter's role.
   Record its actual thread ID, original reporter ID, named results and
   fix-introduced regressions. Retain unchanged evidence. The final judge chooses
   SHIP with worthwhile follow-ups or REVERT / SPLIT. There is one fix round;
   unrelated findings and pre-existing defects become follow-ups, not new gates.

Use `status --pr <url> --json` for phase, fix round, review threads and source head.
Before any report, a head-only refresh uses `record --kind head` with reason
`refresh`; after a report, only a recorded fix or validated carry moves the head.
When replacing a child, stop the superseded thread before dispatching its retry.

Done when the current SHA has SHIP, directly or through an unchanged-patch carry,
or meets the generator-only exception. Missing proof cannot ship.

## 3. Merge and watch

Apply [merge preflight](merging.md#merge-preflight), then squash-merge with a Conventional Commit title. That file also owns patch-id carries and bottom-first stack landing.

No deployed artifact changed: the judge records `no deploy`; skip release queries.
Otherwise dispatch the `release-watch` skill with merge SHA and stories. Report
`merged`, `released`, `artifact verified` or `live behavior proven` only at the
boundary the watch proved. Reopen the ticket if recovery restores the release.
A service without a release mechanism stays `merged, not live`; use one
`release-mechanism` ticket and, when it closes, watch default-branch HEAD with all
stories accumulated since the gap began.

Report the outcome, in-flight step and any decision needed, with links and a
one-line consumer impact under [pstack's reply rules](../poteto-mode/SKILL.md#writing-the-reply). Write each principal
question in full with options, recommendation
and the consequence of no answer.

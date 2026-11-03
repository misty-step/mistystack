---
name: ship-loop
description: "Verify a PR inside pstack's Shipping playbook through risk-scaled independent QA, review and judgment with one fix round."
metadata:
  owner: phaedrus
  prevents: "Delivery drift and repeated review rounds: loaded in 15 audited sessions; real-path verification counters 'fix still fails' corrections (36). Reviewer-driven fix loops and renewed rounds after retries: bounded behind judge rulings in mistystack PRs #450 and #454."
  source: "Misty Step; provenance in ATTRIBUTION.md#skill-provenance."
  sunset: "2026-11-27"
---

# Ship loop

Pstack's [Opening a PR](../poteto-mode/playbooks/opening-a-pr.md),
[Babysit](../poteto-mode/playbooks/babysit.md) and
[Shipping](../poteto-mode/playbooks/shipping.md) own delivery. This skill supplies
Shipping's verify step, not another PR-opening, babysit or landing procedure.

## Delivery defaults

- Work from master and target master, not an integration branch. Prefer larger
  useful slices with explicit file ownership over many narrow PRs.
- CI owns the suite. Verify once at the final head. The verifier reruns only
  the check tied to the main risk and retains existing proof. Run native proof
  once before release, not after every commit or review.
- Use `sync-pstack --check` for verbatim vendored bytes. Humans and agents review
  the Misty delta, not unchanged upstream text.
- Give each role a deadline in its brief. Replace a stalled agent after stopping
  its thread. [Roles](roles.md#rigor) owns risk selection and
  [judge.md](judge.md#2-rule) owns the blockers-only review policy.


## 1. Choose rigor

Start with the PR from Opening a PR, its base, head, builder thread and proof.
Record `Story: <IDs|none>` from SPEC.md or USER_STORIES.md and
`Rigor: <tier>, <changed-path risk>, <diff size>` on the PR.
[Roles](roles.md#rigor) owns the tiers and independent role sets.
Use [blast-radius](../blast-radius/SKILL.md) to identify the safety fact for this
round's existing proof, not a second review panel.

Generator-only machine release PRs need passing affected checks alone and omit
Story. Authored changes, including documents and measurements, take this round.

## 2. Verify and judge

Use this skill's installed directory as `<skill-dir>` and read
`bun <skill-dir>/scripts/ship-loop.ts --help` before its first use.

- **Light.** Keep no ledger. Generate `prompt --pr <url> --rigor light --role qa-review`,
  then `judge`. Post the combined QA/review report and independent judgment as
  plain PR comments with their actual thread IDs, checked SHA and evidence links.
  Do not run `init` or `record`. The conductor and judge read the comment history
  to preserve independence and the one-fix-round cap.
- **Standard or critical.** Use `init --pr <url> ...` once to record the builder,
  base, head, ticket and rigor. Generate `prompt --pr <url> --role qa` and `review`,
  then `judge`. Record their returned payloads with
  `record --pr <url> --kind report|verdict --file <payload.json>`.
  The helper is the sole ledger writer. It accepts the PR author's events,
  ignores other authors' markers and stops on unreadable trusted events.
  `status --pr <url> --json` resumes the existing phase and round.

Each role follows [roles.md](roles.md). QA uses the
[verification skill](../verification/SKILL.md) for the changed consumer path,
within the verify-once rule above. One QA owner covers each SHA.
The [judge](judge.md) is independent of implementation, QA and review.
Only its FIX naming eligible introduced blockers authorizes a fix.
Missing required proof cannot pass.

## 3. Use at most one fix round

For FIX, dispatch `fix-builder` for only the judge's named blockers.
The builder owns code blockers. The conductor owns missing proof.
Then dispatch a fresh `recheck` thread in the blocking reporter's role for those
blockers and fix-introduced regressions. Retain unchanged evidence.
The final judge chooses SHIP, REVERT or SPLIT.
Non-blocking findings follow the [cleanup policy](judge.md#2-rule), not another fix round.

Light uses `prompt --rigor light --role fix-builder|recheck|final-judge` and plain
comments throughout. Standard and critical record the fix head, recheck and
final verdict through the helper. A new session, retry, rebase or changed SHA
never resets the cap.

## 4. Return the verify result

Use the [names adapter](../misty/harnesses/pstack-names.md#routes) to translate
the judgment for [Shipping](../poteto-mode/playbooks/shipping.md).
Return the checked SHA, judgment and evidence. Shipping owns verdict validity
and landing of the contiguous verified run.
Apply [Misty's auto-merge delta](../misty/SKILL.md#misty-deltas) after SHIP.

For standard and critical, a head change updates the ledger through
`record --kind head` as documented by `--help`, without resetting the round.
Shipping owns the decision to carry a verdict, not a second landing procedure here.
After delivery, use [release-watch](../release-watch/SKILL.md) when a deployed
artifact changed. The judge records `no deploy` otherwise.

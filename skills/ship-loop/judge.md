# Judge

An independent judge has neither built, reviewed nor tested this change. An
involved thread returns the independence conflict instead of ruling. Read intent,
acceptance criteria, stories, PR head, QA/review reports and earlier resolutions.
The brief comes from the `ship-loop` skill's `prompt --role judge|final-judge`.

## 1. Confirm

Read the evidence and actual callers behind each finding; merge duplicates. A
single security/correctness report deserves a source trace. Treat captured QA
failures as observations, not speculation. After a fix, inspect only the named
blockers and defects the fix introduced; retain unchanged proof.

## 2. Rule

Reviewers report blockers only. Put worthwhile non-blocking findings in the
repository's one running cleanup issue, not individual tickets or this PR's gates.
Link that issue when a ruling needs it. Preference-only findings can be skipped.

Each finding gets one ruling and one reason:

- **blocker:** demonstrated harm introduced by this unit, a broken acceptance
  criterion, or missing required proof. Includes security, data loss, broken build,
  deploy or rollback. Pre-existing defects cannot block this PR.
- **file:** worthwhile non-blocking work for the running cleanup issue.
- **skip:** disproved, already covered, speculative, preference-only or not worth
  doing. A reviewer's suggestion alone does not earn a ticket.

Rule only on QA/review evidence for the atomic unit, not the initiative's remaining work. Use blast-radius's one-safety-fact idea to identify which supplied proof makes it safe; do not run proof, commission an arena or create another review panel. Missing proof remains unproved. Heuristics may ship labelled approximate. For unsettled intent, record a reversible `intent call` closest to the outcome; block an irreversible choice. Confirm the `Rigor:` reason and diff size; raise it only for a concrete changed-path risk. Record `no deploy` when no deployed artifact changes.

## 3. Decide and record

Post `Verdict at <head SHA>` with linked QA/review, one outcome and its reason,
exact blockers with owner and observable fix, the cleanup issue when relevant,
and consequential skips under [pstack's reply rules](../poteto-mode/SKILL.md#writing-the-reply). Omit empty sections.

- **SHIP:** independent completed QA/review cover this SHA; all blockers resolved.
  The `verification` skill defines the required real-path proof, including sign-in
  and role evidence when relevant. Internal changes need composition proof.
- **FIX:** the initial judge names exact eligible `<role>:<finding-id>` blockers
  from one reporter thread. The builder owns code; the conductor owns proof.
- **REVERT / SPLIT:** drop/revert the unit or make independently shippable units.

Only FIX authorizes the single fix round. The blocking reporter's role rechecks
named fixes and fix-introduced regressions in a fresh thread.
Final judgment allows SHIP, REVERT or SPLIT. Changed SHAs, rebases and retries
never reset the cap.

Return the native thread ID, SHA, outcome, blockers, ticket links and PR report URL.
Light posts a plain PR comment without a ledger. Check the linked reports' thread
IDs and earlier judgments before ruling. For standard and critical, the conductor
uses `record --kind verdict`. Its state machine enforces eligibility and independence.
Return the result to [Shipping](../poteto-mode/playbooks/shipping.md) through the
[verdict mapping](../misty/harnesses/pstack-names.md#routes).

---
name: release-watch
description: "Watch a merged change through release and early live behavior; recover a live user-facing break or failed deploy, smoke or health check."
metadata:
  owner: phaedrus
  prevents: "Merged mistaken for live; incomplete installer/recovery paths repaired in mistystack PR #372; excessive postmortem/watch ceremony cut in #392."
  source: "Misty Step; provenance in ATTRIBUTION.md#skill-provenance."
  sunset: "2026-11-27"
---

# Release watch

Watch one merge SHA through the repo's release path. For a live user-facing
break, start with [recovery.md](recovery.md). Compatible recovery follows existing
authorization and the repo's own pipeline; accepted-data risk stops that mutation
and is escalated.

## 1. Find the path

Read AGENTS.md, README and the release decision. A recorded `no deploy` plus a
diff touching no deployed artifact ends here without queries or waiting.

- **Library/tool:** find the release PR/tag containing the merge. Passed release
  checks mean `released`; a failed check is a recovery trigger.
- **Automated deploy:** follow the run/deployment for this SHA to completion.
- **Installer/plugin:** use a disposable detached worktree at freshly fetched
  default-branch HEAD; prove the merge is its ancestor. Run the documented install
  or update against the authorized destination, recording command, source head,
  destination and exit status. Stop and report a failed step.
- **Missing mechanism/signal:** report `unwatched`. Reuse one open
  `release-mechanism` ticket, or create one in the project's tracker; no implied live claim.

## 2. Observe

1. **Deploy:** successful run or installer/update exit status.
2. **Identity:** live version/SHA/tag contains the merge. For installers, compare
   deployed artifacts with source; for composed instructions, read the changed
   installed section. Unchanged deployed bytes are `no-op`, not a new release.
3. **Smoke:** drive touched stories with the `verification` skill. Installed
   skills/rules/extensions need a fresh session in the active harness at the destination
   exercising the change. Artifact readback without that smoke is `artifact verified`, with
   the exact missing proof named.
4. **Signals:** observe only health/error signals this change can move, for a
   risk-proportionate window. Low-risk changes need no arbitrary wait; installers
   finish at smoke. Remove the disposable source worktree after identity readback.

A failed deploy, smoke, newly failing health check or new error is a trigger.
[recovery.md](recovery.md) owns restore, attribution and incident closure, including
failures discovered after the watch window. A material incident's postmortem
names one change that removes the error class, not another reminder.

## Report

Post once in the owning lane/PR with merge and checked live identity, evidence,
consumer impact and exact gaps under the core's claim rule; follow misty's report-link duty.

| Outcome | Required observation |
| --- | --- |
| `no deploy` | No deployed artifact changed |
| `released` | Containing release/tag and passed release check |
| `live behavior proven` | Deploy, identity, smoke and relevant signals |
| `artifact verified` | Installer readback, no-op status if any, missing smoke and owner |
| `restored` | Trigger, compatible recovery and verified recovered behavior |
| `escalated` | Unsafe recovery, current live state, incident, owner and recommendation |
| `unwatched` | Missing mechanism/signal and its ticket |

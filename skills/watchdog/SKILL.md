---
name: watchdog
description: "When agents are active: supervise periodically against each self-contained brief, verify progress and completion, correct drift, recover stalls and stop wasted spend without wall-clock caps."
metadata:
  owner: phaedrus
  prevents: "Agent time caps that terminate unfinished work, unsupervised drift and idle compute spend; Phaedrus's 2026-11-03 owner directive."
  source: "Misty Step; provenance in ATTRIBUTION.md#skill-provenance."
  sunset: "2026-11-27"
---

# Watchdog

Supervise execution, not elapsed time. An agent remains owned from dispatch
through its real completion probe and collection, including when queued, waiting,
interrupted or claiming completion. The dispatcher remains accountable when a
separate agent runs this loop. This is not another review round, judge, merge
gate, ticket system or fix ledger; use the existing brief and native task thread.

## 1. Start with the full brief

Use [Misty's briefing contract](../misty/SKILL.md). Retain each supervised agent's
native ID, full self-contained brief, owned paths/resources and required outside
check in its existing task thread. A fresh agent must be able to act without the
parent transcript. Read the brief before judging activity; do not substitute an
easier outcome or invent new scope, acceptance criteria or approvals.

Choose a periodic check-in cadence from the next observable work and risk.
Inspect immediately on a failure, completion claim, unsafe action or material
change. Cadence controls when the supervisor looks, never how long the agent may
work. Use native notifications and waits between sweeps, not a tight status-poll
loop. Keep a live supervising session or an explicitly dispatched supervisor;
writing a promise to check later is not supervision. In OMP, sweep on each
check-in and notification, do useful coordinator work between sweeps, and use
`wait` when otherwise blocked; repeat the sweep when it returns. Do not end the
supervising turn with owned work still active.
**Complete when:** each owned agent has an accessible full brief and an active
supervisor that will inspect it again without a runtime deadline.

## 2. Inspect every active brief

At each sweep, enumerate owned agents using native state. Read new tool actions,
outputs and artifacts since the previous sweep. Compare that evidence with the
brief, including its expected next result:

- **Progress:** changed artifacts, resolved uncertainty or a useful running
  operation moves the requested result forward. Verbose narration, tool-call
  count and a `running` label alone prove nothing.
- **Drift:** the agent changes unowned paths, drops an acceptance criterion,
  creates an extra gate or pursues work outside its brief.
- **Stall:** a failed prerequisite is unchanged, a tool or credential is refused,
  or repeated attempts produce no new evidence. Silence or a long compile alone
  is not a stall; inspect the actual command before intervening.
- **Wasted spend:** duplicate agents, repeated setup, fruitless retries or idle
  workers consume resources without useful work. Read live account usage and
  Boat allowance; missing or stale usage is unknown, not free capacity.

Probe the real state when logs are ambiguous: inspect the named process and its
output, read the actual artifact or perform the brief's authorized readiness or
completion probe. Do not rerun a reported failure merely to confirm it. Retain
only the evidence and actionable decision in the existing task thread; do not
create another status ledger.
**Complete when:** every owned active brief has an evidence-based continue,
steer, wait, recover or completion decision.

## 3. Continue, steer or stop idle spend

Leave useful, in-scope work running, however long it needs. For drift or a
recoverable stall, send one specific steer: observed mismatch, unchanged outcome
and the next concrete action or evidence needed. Check its effect on the next
sweep rather than repeating reminders without new evidence.

For a genuine external blocker, retain the exact refusal and recoverable work,
continue unblocked obligations and bring the dispatcher one precise missing
prerequisite. Use [boat-workers](../boat-workers/SKILL.md) to stop an idle slice
worker and resume the same worker when the prerequisite returns. Do not stop
an active useful operation as an idle-cost measure. Ask Phaedrus before new
spend or credentials; a watchdog cannot expand the brief's authority.

If there is an unsafe action, a confirmed unrecoverable stall, or a steer that
fails to correct observed drift, preserve recoverable artifacts and interrupt
only that agent. Confirm the old writer is no longer running before dispatching
a replacement. Give the replacement the full original brief plus measured
current state, completed work, failed attempts, remaining acceptance criteria,
owned worker/worktree and exact next outside check. Reuse the slice's worker;
a replacement agent does not require another worker. Do not restart blindly
against the same unresolved credential, capacity or infrastructure refusal.
**Complete when:** useful work continues, idle compute is stopped and every
recovery has one writer with the full brief and a changed recovery path.

## 4. Use native supervision controls

### OMP agents

- Read `proc://` to enumerate jobs and agents, then `proc://<id>` for the owned
  agent's state and output. Read `history://<id>` for the actual tool actions;
  an `agent://<id>` summary is a lead, not completion proof.
- Steer with `write` to `agent://<id>` using the concrete correction. Observe
  subsequent actions or the real probe to establish whether it took effect.
- When recovery requires termination, use `write` to `proc://<id>/kill` with no
  content, targeting the exact owned ID. Confirm termination through native
  state, then use `task` to respawn with the full self-contained recovery brief.
  Do not kill unrelated agents or processes.
- Inspect automatic completion deliveries and artifacts. A `completed` task
  state means the agent returned; the brief is still owned until its outside
  check and collection are satisfied.

### Boat agents

Read installed help before first use. Boat CLI 1.0.89 exposes these scoped
controls; always pass the worker and conversation IDs rather than relying on a
shell's current conversation:

```sh
boat --no-update conversations <worker-id> --json
boat --no-update events <worker-id> --convo <conversation-id> --json
boat --no-update steer <worker-id> --convo <conversation-id> "<concrete correction>"
boat --no-update interrupt <worker-id> --convo <conversation-id> --json
```

`boat events ... --follow` can keep an owned event stream open; a sandbox with no
agent prompt has no chat events. For command-only work, inspect `boat info`, the
recorded `boat exec --status <pid>` and command output instead. A chat stream is
not a service health or completion probe.

A new `boat prompt` queues behind the same conversation's running turn; it does
not steer it. Use `steer` for a running turn. If it returns `no_running_turn`,
inspect the conversation and use `boat prompt <worker-id> --resume
<conversation-id> "<continuation>"` for unfinished work. A bare `boat interrupt`
stops all conversations on the worker, so always use `--convo`. After a scoped
interrupt, confirm the old turn ended. When a fresh agent is needed, use
`boat prompt <worker-id> --new "<full self-contained recovery brief>"` rather
than relying on the old conversation's memory. Files changed before interruption
remain; preserve and reconcile them rather than resetting the slice.

Optionally, the dispatcher can start a separate supervisory slice with
`boat prompt <supervisor-worker-id> --new "<full supervisor brief>"`. Give it the
owned agent IDs, full briefs, cadence, probes, allowed interventions and stopping
condition, plus an already approved credential route. It runs this same loop;
it is not another reviewer and does not dispatch workers from inside a worker.
It may steer or interrupt only the explicitly assigned conversations. The
original dispatcher retains scope, spend and completion responsibility.
**Complete when:** interventions target exact owned agents and their effect is
observed through native state and real evidence.

## 5. Probe completion and finish

For each completion claim, run the original authorized outside check or inspect
its independent real-path receipt from the authorized runner. Check the claimed
artifact and source identity, all acceptance criteria and collected deliverables.
A model's report, a quiet event stream or a successful command on a substitute
path is not completion. Missing proof leaves the brief unfinished; steer or
recover it without adding another review or merge gate.

Keep sweeping until every supervised brief has satisfied its required outside
check and collection, and its owned compute has been cleaned up through
[boat-workers](../boat-workers/SKILL.md). The only other stopping conditions are
explicit cancellation or an acknowledged handoff of unresolved work to its
responsible dispatcher, with exact blockers and idle resources stopped. A
blocked brief is not a completed brief. Retain the final outcome and evidence
in the existing thread; no wall-clock or blanket retry count ends the loop.
**Complete when:** no supervised brief or resource is orphaned, and the result
states observed evidence and any acknowledged blocker without inventing a pass.

## Sources

- [Boat conversations](https://docs.boat.dev/integrated-agents/conversations.md): conversation IDs, state, events and scoped interrupts.
- [Boat steering](https://docs.boat.dev/integrated-agents/steering.md): running-turn steering, queued prompts and `no_running_turn`.
- [Boat background commands](https://docs.boat.dev/long-running-tasks/background-commands.md): process state and real command output.

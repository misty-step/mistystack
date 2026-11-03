# ADR-006: Foundations constitution, dated gaps, and agent authority

Status: Accepted 2026-09-26 (MIS-150). The operator approved six decisions from
the foundations research brief, relayed by Kaylee:
"carry out his six decisions from your brief as approved". Evidence:
`~/.cache/research-briefs/2026-09-26/foundations-system.md`, which covers the
Pocock study, the fleet survey, the practitioner survey and the Jev probes.

This record amended ADR-003's review triggers and ADR-004's judgement-rule
location. Catalog 1.5.0 implemented the three obligations below; 1.8.1 was the
catalog version recorded when this history was retained. These pins and the
research evidence remain historical, not bulk adopter-repinning instructions.
The [2026-11-03 delivery decision](../0023-live-verification-and-release-gate.md)
supersedes this record's review and CI merge requirements, including
`FND-REV-001`. No catalog pin or historical approval record restores them.

## Context

- Six repositories adopted on 2026-09-25, all pinning catalog 1.1.0. 77 of
  their 84 dispositions are `pending`.
- The checker lists `pending` as needs-evidence and never fails it, except for
  ADR-005's three operational obligations.
- For the obligations outside ADR-005, the content of a `satisfied` receipt is
  not verified: any non-empty text passes. `not_applicable` passes with a
  `decision` string, and `exception` with a `decision` and an `expires` date.
  The catalog requires an `approval_ref` and a `foundation-approval/1` record
  for both. ADR-005's three obligations already reject `exception` (and
  `not_applicable` for an application), and their `satisfied` claims are
  checked structurally. Catalog 1.5.0 keeps those checks.
- Written rules do not move agents; failing checks do (ADR-003).
- Agents were never told the foundations exist: global guidance did not
  mention them, and the `foundation` skill is invoked by the user only.
- Unenforced repository rules had two homes under ADR-004: review priorities
  in `AGENTS.md`, and invariants in `DOMAIN.md`.

## Decisions

1. **The foundations.** The historical
   [`constitution.md`](https://github.com/misty-step/harness/blob/24405fde88cf6119012f2f21d7d98a486903b69e/agent-config/skills/foundation/constitution.md)
   stated what every project must be, keep and improve. Catalog 1.5.0 added
   three obligations, whose current delivery interpretation is:
   - **Real-path verification, not every-PR review.** The author builds and
     verifies the running consumer path before merge. `FND-REV-001`'s
     independent-review merge requirement is retired. Fast CI and one review
     limited to critical correctness/security gate deployment, not merge.
   - **Security baseline.** Keep secret scanning, dependency maintenance and
     applications' authorization-boundary tests. Dependency changes prove their
     affected real path before merge and use the same pre-deploy release gate;
     a bot's green PR checks do not authorize delivery.
   - **Story citation.** A pull request that changes mapped source cites the
     affected story ids, computed with `foundation-check affected`.

   Catalog 1.5.0 assigned the original obligation ids and evidence fields.
2. **A repository's judgement rules live in the `DOMAIN.md` invariants
   ledger.** These are the invariants for what must hold in its product, code
   and data. `AGENTS.md` keeps agent operating instructions and routes to that
   ledger instead of maintaining another copy. ADR-004 recorded its grammar.
   Ledger and first-story changes preserve the owner's intended behavior and
   prove affected contracts; they do not require a designated PR reviewer.
3. **Pending means a dated gap, and done means verified evidence.**
   - Every applicable `pending` obligation is a baseline gap with an owner and
     an expiry at most 30 days out, like the `ops:` gaps. An extension records
     the reason and accountable owner's decision; it is not an independent
     review or CI merge gate.
   - `satisfied` needs a receipt verified against the candidate revision:
     path, digest and revision, not free text or a substitute for real behavior.
   - `not_applicable` and `exception` retain a recorded, evidenced decision.
     The old designated-review triggers and `foundation-approval/1` choreography
     do not govern merge; changes to the owner's obligations still need the
     owner's authority.
   - Catalog 1.5.0 owned the original ids and receipt field shapes.
4. **Standing agent authority.** Agents may open adoption, pin-bump,
   gap-closing and invariants-ledger pull requests in every misty-step and
   r90group repository without asking the operator first. They build and prove
   the affected running path, then merge under
   [ADR 0023](../0023-live-verification-and-release-gate.md), without CI,
   independent review or a judge as merge gates. A real change in product
   direction still escalates to the operator. No freshness target for pins was
   set; the release owner re-pins adopters as part of a foundation release.
5. **The operator approves new or widened obligations.** Adding an
   obligation, widening applicability, or removing an escape needs the
   operator's approval, as ADR-005 did. Tightening a check within an existing
   obligation, rationale edits and retiring unused checks follow the current
   build, verify, merge and release procedure, not the former review workflow.
6. **Jev advisory pilot.** The six adopted repositories are assessed by the
   hybrid in the brief:
   - scripts distill a bounded evidence packet per foundation;
   - Jev judges each packet in one request;
   - a frontier agent adjudicates uncertain answers.

   The pilot was advisory, with its user story minted alongside its code.
   It never authorized a merge, changed a disposition or replaced a drill or
   walk. `docs/semantic-quality.md` held its rule-admission procedure.
   Deterministic checks can strengthen behavior proof or fast release CI, but
   neither Jev judgments nor those checks create PR merge gates under ADR 0023.

## Rollout

- Catalog 1.5.0 lands promptly. Adopter pin bumps to 1.5.0 wait until the
  baseline entries expiring 2026-10-25 are closed or extended, because decision
  3 adds a dated gap for every applicable pending obligation. The operator may
  ask for sooner.
- The constitution reaches agents through the `foundation` skill and a shared
  guidance section that both harnesses select, under its own user story.

## Consequences

- An adopted repository cannot claim an applicable `pending` obligation is
  satisfied without evidence. Dated gaps retain accountable owners and
  recorded extension decisions, not designated-review merge approvals.
  `satisfied` and `not_applicable` claims need verifiable evidence.
- Each adopter's next pin bump grows its baseline. The ratchet then shrinks it,
  and the extension count shows where the standard or the setup is wrong.
- Product invariants have one per-repository input, `DOMAIN.md`, not a second
  mandatory review ledger.
- Agents meet the foundations while working instead of only when a check
  fails.

## Alternatives rejected

- **A per-repository `CODING_STANDARDS.md`.** It restates the catalog across
  about 48 repositories, or duplicates the ledger under a new name.
- **A committed, generated per-repository foundations view.** It puts transient
  status in core documents (ADR-004) and churns every repository on every
  release.
- **Jev on the required path.** Its answers are calibrated probabilities, not
  proof, and ADR-003 keeps it off required checks.

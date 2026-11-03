# ADR-005: Every application releases safely, alerts loudly, and closes incident classes

Status: Accepted 2026-09-25 (MIS-150). Operator directive, relayed by Kaylee:
"a non-negotiable foundation standard, without exception, for every application
we work on in both orgs." This record adds three obligations to the Foundation
Standard catalog (version 1.4.0 at acceptance) and to `foundation-check`. It
amends ADR-003's enforcement and builds on ADR-004's core project documents.

[ADR-007](../../principles/007-braver-engineers-continuous-deployment.md) added
production-like QA/data, story walks and automatic rollback on 2026-09-30.
Catalog 1.6.0 recorded that decision; 1.7.0 recorded the intermediate
[lean CI amendment](../../principles/007-braver-engineers-continuous-deployment.md#lean-ci-amendment-2026-10-02).
Those version numbers and 1.8.1's later catalog state remain historical evidence,
not repinning instructions. The
[2026-11-03 delivery decision](../0023-live-verification-and-release-gate.md)
supersedes the old PR/push CI, merge-review and blanket-gate requirements.
Tenant, data, rollback and approved alert-routing obligations remain.

## Context

The 2026-09-25 directive had three parts:

1. **Continuous deployment.** Automatic delivery backed by strong verification,
   real journeys and recovery evidence, including confidence to deploy on Friday.
2. **Deep Sentry integration**, or an equivalent error-logging and health-check
   system, so production incidents alert loudly.
3. **Incident response** that ends in a postmortem and a fix that rules out the
   whole class of error.

What the standard already had:

- FND-OBS-001, FND-PRF-001 and FND-USE-001 cover structured diagnostics, proof
  of capture and owned alerts, but FND-USE-001 applies only when a signal "is
  claimed", and every obligation allows an `exception`.
- FND-DEF-SENTRY-001 makes Sentry the default tool without requiring anyone to
  use it.
- FND-CHG-001/002 and FND-TRN-001 cover change paths and transitions, not
  shipping cadence.
- ADR-004 gives a `deployed` repository a runbook (Release, Rollback, Recover)
  and says `docs/postmortems/` appears at the first incident. It removed the
  per-repository postmortem template; the template lives in the pokayoke skill.

The 2026-09-25 census of the 48 active repositories found no application that
meets any of the three in full (proposal:
`~/.cache/research-briefs/2026-09-25/operational-obligations-census.md`).
Examples it rests on:

- Most applications deploy by hand (wrangler, a dispatch-only workflow, a
  release PR someone must merge); several deploy through a platform git
  integration that does not wait for CI.
- Canary, the in-house equivalent, is archived and its hostnames do not resolve.
  Applications still configured for it drop their errors while their health
  endpoints report capture as "configured".
- Every Sentry alert workflow read notifies by email only: all 4 in r90 and
  the first 100 of misty-step's (the rest were not paged).
- Postmortems exist in a handful of repositories, mostly outside
  `docs/postmortems/`, and few link the change that closed the class.

## Decision

### Three obligations

| Id | Title | Owed by every application |
| --- | --- | --- |
| FND-REL-001 | Continuous deployment | Build and verify the affected real running path, then merge without CI or review gates. Before deployment, fast CI and one critical-correctness/security review gate the landed release candidate; CI does not run on PRs or pushes. Deploy the same checked bytes automatically, then check live identity and a critical journey. Multi-tenant rollout reaches every tenant except those explicitly excluded with an evidenced reason. Each tenant's backward-compatible migration precedes its deploy; a failed migration stops rollout. Read back every non-excluded tenant's deployed revision and migration level, and exercise rollback. |
| FND-ALR-001 | Loud production alerting | Remote error capture with release and environment (Sentry by default, or an approved equivalent that captures errors, checks health and raises incidents); an outside, scheduled health check; alerts only to an approved agent triage intake, proven by a controlled failure. For Sentry, all alert rule actions target the intake and no alert email goes to org members. |
| FND-INC-001 | Incident response closes the class | The runbook's `## Incidents` section turns an alert into an owned incident; the triage agent opens its ticket, starts an engineer or escalates to Kaylee only for a real alert; the ticket closes only when it links a postmortem from the pokayoke template under `docs/postmortems/` and the postmortem's structural, class-closing fix with a regression check. |

The normative catalog at acceptance was
[`foundation-standard-v1.json`](https://github.com/misty-step/harness/blob/24405fde88cf6119012f2f21d7d98a486903b69e/agent-config/skills/foundation/foundation-standard-v1.json);
[`foundation-standard-v1.md`](https://github.com/misty-step/harness/blob/24405fde88cf6119012f2f21d7d98a486903b69e/agent-config/skills/foundation/foundation-standard-v1.md)
explained it. Current catalog version: 1.8.1; this historical ADR does not
instruct adopters to repin.

### Alert routing (operator decision 2026-09-26)

Production alerts in both orgs go only to the approved agent triage intake,
never to Phaedrus or any person's inbox or phone. Tach's test alert reached his
personal Gmail: he is the only member of each Sentry org, and Sentry emails
members by default. For Sentry, every alert rule's actions must target the
intake and no alert email may go to org members. The approved route is
`kaylee-alert-intake`: Sentry internal integration → Cloudflare Worker
`kaylee-alert-intake` → Kaylee's Hermes cron `alert-triage` → Kaylee's bot chat.
The triage agent reads each alert, opens its incident ticket, and starts an
engineer or escalates to Kaylee only when the alert is real; the ticket closes
only with its linked postmortem and class-closing fix. A repository names the
approved route key as `operations.alert.destination`, never a person, email
address, phone or provider channel. The route itself is owned in
`hermes-config/docs/alert-routing.md`; the checker verifies the declared key,
while the controlled-failure receipt proves actual delivery and handling.

### Continuous delivery to every tenant (operator decision 2026-09-26)

A verified change merges to trunk without CI, independent review or a judge.
The landed release candidate deploys automatically after the pre-deploy fast CI
and single critical-correctness/security review, without manual promotion.
The candidate need not equal a later trunk head; promotion preserves lineage and
accepted data under ADR 0023. For a multi-tenant application the rollout covers
**every tenant** unless `operations.ship.tenancy.excluded` names it and records
a non-empty reason. An exclusion is an explicit adoption decision, not an
implicit deploy filter. The registry enumerates excluded tenants too.

Before the deploy, migrate each non-excluded tenant; migrations must remain
backward-compatible with the code still running (expand/contract). A failed
tenant migration stops the rollout rather than allowing a partial, silently
successful deploy. The repository provides a tenant-state command or workflow
that reports each tenant's deployed revision and migration level, including
excluded tenants so their production state remains known.

Production failures alert loudly through FND-ALR-001/FND-INC-001 and the
approved `kaylee-alert-intake` route. Kaylee's `alert-triage` runs every five
minutes; an alert waiting over 30 minutes fails the route guard (route ownership:
`hermes-config/docs/alert-routing.md`). A receipt proves the live route and
incident handling, not merely a configured destination.

### Applicability: every application

An application is a repository whose `surfaces` (ADR-004's vocabulary) include
`ui`, `cli`, `api` or `deployed`: it changes a live system or ships something
people run. Libraries, content vaults and fixtures are not applications. A
record without `surfaces` was treated as an application by the historical
checker. Declaring a former application out of scope still needs an explicit,
evidenced owner decision rather than silently dropping its obligations.
The old designated-review PR trigger is retired. ADR-004 recorded the
surface-keyed document checks.

For a released artifact without a live service (a CLI, a desktop app, an
extension), "ships" means an automatic release and "health" means crash and
error reports from real installs.

### No exceptions

`foundation-check` rejects `exception` for these three, and rejects
`not_applicable` for an application. The ratchet is the only way to be late.

### Enforcement through the ratchet

- **Pending is a gap.** The historical ratchet represented unsatisfied
  application obligations as `ops:ship`, `ops:alert` or `ops:incident`, with
  baseline expiries at most 30 days out. Extensions keep a reason and accountable
  owner decision, not designated PR approval.
- **Satisfied must hold up.** Repository shape is not runtime practice.
  The former checker validated push/`workflow_run` trigger syntax and transitive
  job guards; those trigger rules do not govern current CI or merge. Current
  release evidence must establish:
  - FND-REL-001: the selected landed source and artifact identity, real-path proof
    before merge, and one pre-deploy release gate containing fast CI and the
    single critical-correctness/security review. No PR/push CI, exact-PR-head
    approval or aggregator status becomes a merge condition. A failed, skipped
    or `continue-on-error` check cannot be represented as a successful release
    gate. Repair slow CI rather than accepting it as delivery latency.
    The workflow or native deployment facility promotes the same checked bytes;
    a platform git integration alone is not proof it respected the release gate.
    For `operations.ship.tenancy`, `single` records its model; `multi` also
    identifies the tenant registry, state-readback command and migration step.
    Every non-excluded tenant migrates safely before deploy, and a failure stops
    rollout. Workflow dependencies or native provider receipts must establish
    that order; file presence cannot. Excluded tenants remain in the registry
    with a reason and known live state.
  - FND-ALR-001: `operations.alert` names the file that initialises error
    capture (it must reference the provider), a scheduled health workflow or a
    named external monitor, and an approved agent triage route key as its
    destination, never a person's endpoint.
  - FND-INC-001: `docs/runbook.md` has a non-empty `## Incidents` section, and
    every postmortem in `docs/postmortems/` has `## Pokayoke` and
    `## Follow-up`; unless its status is `open`, the follow-up links the change
    that closed the class.
- **The receipt carries practice:** the checked artifact reaching production
  without manual promotion, a rollback drill, a controlled failure whose alert was
  seen and handled, and the regression check a postmortem cites. For multi-tenant
  shipping it carries a **post-deploy readback of every non-excluded tenant's
  deployed revision and migration level** and evidence that migration ran
  safely before deployment; excluded tenants' known state remains available.
  The checker cannot prove actual tenant fan-out, backward compatibility,
  migration execution, or live state from repository files. A lint cannot
  prove Friday confidence either, so the checker never claims it.

### Adoption record shape

```json
{
  "surfaces": ["ui", "deployed"],
  "operations": {
    "ship": {
      "branch": "main",
      "workflow": ".github/workflows/deploy.yml",
      "job": "deploy",
      "tenancy": {
        "model": "multi",
        "registry": "tenants/registry.json",
        "state": "scripts/tenant-state.sh",
        "migrate": "migrate",
        "excluded": []
      }
    },
    "alert": {
      "errors": { "provider": "sentry", "init": "src/instrument.ts" },
      "health": { "monitor": ".github/workflows/health.yml" },
      "destination": "kaylee-alert-intake"
    }
  }
}
```

`ship` may instead name `{ "branch": "main", "platform": "vercel",
  "tenancy": { "model": "single" } }` for a single-tenant application; a
single-tenant workflow also uses `{ "model": "single" }`. Multi-tenant deploys
require a workflow ship whose `job` transitively `needs` the named `migrate`
job, with migrations before deploy. Exclusions are optional; each entry has
`{ "tenant": "tenant-id", "reason": "reviewed reason" }` and the tenant must
appear in `registry`. `health` may be `{ "external": "<named monitor>" }`.

### Pin bumps

The historical `foundation-check baseline --revision SHA` repinned the catalog
and added newly introduced obligations as `pending`, preserving existing walk
entries rather than rebaselining stories already walked. ADR-005 used
`ops:ship`, `ops:alert` and `ops:incident`; catalog 1.5.0 added
`obl:FND-REV-001`, `obl:FND-SEC-001` and `obl:FND-CIT-001`.
The review obligation and designated extension-approval workflow are retired;
record any real obligation change with its owner and evidence, then use ADR 0023.

## Consequences

- The original rollout required the three operational gaps to be baselined or
  met at adoption. That history does not restore PR CI or review merge gates.
- Structural checks prove shape, not practice. A well-formed `operations` block
  cannot establish a truthful `satisfied` claim; the real consumer/effect receipt
  and, at release only, the critical-correctness/security assessment supply
  meaningful evidence.
- A platform must respect the pre-deploy release gate before actual deployment;
  an automatic git integration is not itself that proof. Multi-tenant delivery
  additionally proves migration order and tenant-state readback.
- Email-only Sentry alerts are prohibited: every rule targets the agent triage
  intake, no alert email goes to org members, and the controlled-failure receipt
  proves the route was seen and handled.
- Tach (`r90group/agent-usage-telemetry`) is writing its own plan; its row in
  the census defers to it.

## Alternatives rejected

- **Fold the three into FND-OBS/USE/CHG.** They allow exceptions and apply only
  when a capability is claimed; the directive is unconditional.
- **Amend ADR-003.** ADR-003 owns checks and cadence; changes to the standard's
  content follow ADR-004's pattern of a new record amending the catalog.
- **Guess deploys from workflow text** (grep for `wrangler deploy`). Declarations
  verified against the workflow file are deterministic; guesses are not.

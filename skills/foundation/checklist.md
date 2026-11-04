# Constitution

What every Misty Step project is, on any stack. Each article is a state an auditor can check. A deviation is a recorded decision in the repo; unverified is not a pass.

## Conformance

A finished deliverable meets all of these conditions under [prove-it-works](../principle-prove-it-works/SKILL.md):

- The running product fulfills `SPEC.md`'s stories with no unrecorded gap.
- The repository's verification skill drives those journeys end to end on the real product ([article 4](#article-4)).
- The native pipeline releases it with identity readback and a live critical journey ([article 6](#article-6), [ADR 0023](../../docs/decisions/0023-live-verification-and-release-gate.md)).
- Anything public meets [article 9](#article-9) and [article 10](#article-10).
- Every other article has evidence or a recorded deviation.

<a id="article-1"></a>
<a id="1"></a>

1. **One job, least code.** Each program has one focused job and explicit plain text or JSON interfaces. Every custom part has a functional, aesthetic or business reason. It carries nothing its user stories do not strictly need.

Primitives: [compose small programs](../principle-compose-small-programs/SKILL.md), [deep modules](../principle-deep-modules/SKILL.md), [laziness protocol](../principle-laziness-protocol/SKILL.md).

<a id="article-2"></a>
<a id="2"></a>

2. **One home per fact.** Every fact has one authoritative home that everything else references; no code keeps copies in sync. Owner decisions and product intent live in the project’s owned backlog: Linear for Misty Step; other projects, including R90 work in Habitat, retain their established tracker. Powder is a read-only historical archive, not a second live authority; the repo’s `SPEC.md` owns the observable behavior that realizes that intent, linking to it rather than copying initiative status or rationale. Architecture, stack exceptions and postmortems stay in repo decision records beside the code they explain; agent instructions add only local constraints and pointers. Vocabulary is a fact: each domain term has one home in DOMAIN.md, and files, symbols, branches and commits use it. A new concept gets its term there first.

Primitives: [migrate callers then delete legacy APIs](../principle-migrate-callers-then-delete-legacy-apis/SKILL.md), [encode lessons in structure](../principle-encode-lessons-in-structure/SKILL.md).

<a id="article-3"></a>
<a id="3"></a>

3. **Specified.** Each program's living `SPEC.md` is complete enough to rebuild it from user stories: capabilities and observable outcomes (what users can do and why it matters), never UI flows, architecture, implementation, or whether anything is built. Shipped behavior matches it; missing or conflicting intent is a recorded gap to resolve with the owner, not permission to silently change either authority. Architecture and stack rationale belong in linked repo decision records, not the SPEC.

Primitives: [model the domain](../principle-model-the-domain/SKILL.md).

<a id="article-4"></a>
<a id="4"></a>

4. **Proven on the real path.** The repository has a shell-runnable verification skill covering the real artifact's main journeys, success, rejection and recovery in production-like isolation. Sign-in uses a dedicated QA identity with the required role under the [QA sign-in contract](../verification/SKILL.md#qa-sign-in-contract). Each initiative names its intended user or business benefit, proportionate evidence from actual use, and a criterion to stop or revise it. Persona QA proves usability and correctness, not demand.

Primitives: [create verification skill](../create-verification-skill/SKILL.md), [maintain verification skill](../maintain-verification-skill/SKILL.md), [prove-it-works](../principle-prove-it-works/SKILL.md), [test behavior not implementation](../principle-test-behavior-not-implementation/SKILL.md).

<a id="article-5"></a>
<a id="5"></a>

5. **Runnable by a stranger.** From the README alone, a fresh engineer runs the program and its checks with privacy-safe inputs.

<a id="article-6"></a>
<a id="6"></a>

6. **Continuously deployed.** Trunk stays releasable under the [delivery procedure](../ship-loop/SKILL.md). Slow CI is a defect to repair, not an accepted delivery wait. One pipeline builds one artifact and deploys or publishes the same bytes through native deploy, version and rollback facilities, with no human approval step. Normal promotion deploys the newest verified build that descends from what is live without requiring it to equal the current head. Intentional recovery may restore a previously verified compatible release, preserving accepted data and proving recovery before promotion resumes. The live service reports its environment and release. Each release carries a semantic version and a generated, reachable changelog.

Primitives: [ship-loop](../ship-loop/SKILL.md), [sequence verifiable units](../principle-sequence-verifiable-units/SKILL.md).

<a id="article-7"></a>
<a id="7"></a>

7. **Data survives.** Accepted data is never lost: migrations are compatible, rollback to the previous compatible release is rehearsed, hosted data has an owner, backups and a proven restore, and local-only state survives crashes and upgrades.

Primitives: [make operations idempotent](../principle-make-operations-idempotent/SKILL.md).

<a id="article-8"></a>
<a id="8"></a>

8. **Loud and self-healing.** PostHog shows meaningful product journeys and their success and failure outcomes. Sentry provides actionable errors, uptime monitoring and alerts, including failed scheduled jobs and backups, tied to environment and release. Verify event receipt, useful journey analysis, and alert delivery to an owned response path through exercised success and failure; installed SDKs alone are not acceptance. Collect only privacy-safe metadata, never private content or user secrets; bound volume, retention, retries, access and cost. A detected user-facing break triggers automatic recovery to the previous compatible release. Telemetry failure never stalls the product.

Primitives: [nothing fails silently](../principle-nothing-fails-silently/SKILL.md), [explain the number](../principle-explain-the-number/SKILL.md).

<a id="article-9"></a>
<a id="9"></a>

9. **Private and secure.** No secret or private content appears in source, history, public artifacts or third-party services; public source names no private client. Retention, access, retries and cost are bounded. Dependencies and secret scans are current.

Primitives: [blast radius](../blast-radius/SKILL.md).

<a id="article-10"></a>
<a id="10"></a>

10. **Finished face.** Every product improves user experience (UX), developer experience (DX) and agent experience (AX) together without breaking existing behavior. Every interface supports light and dark, defaults to the system setting, and puts the primary information and action first. Every element serves the task or required information: no gratuitous text or additions, no eyebrow labels, and no secondary label repeating the primary. Layout makes taglines and helper text unnecessary where possible. Use clear labels and accessible units; provide provenance, uncertainty and calculation details when they help users interpret or trust a result, with secondary detail disclosed proportionately. Anything public has useful docs, a coherent brand, a reachable marketing page, a portfolio entry, a real-product demo and a feedback path into its backlog.

Primitives: [experience first](../principle-experience-first/SKILL.md), [visual parity playbook](../poteto-mode/playbooks/visual-parity.md).

<a id="article-11"></a>
<a id="11"></a>

11. **Explicit state.** Consequential workflows have named states and events with one transition table owning allowed transitions. Code, tests and diagrams follow that table. Append-only history exists where audit, replay or recovery needs it. Native transactions and existing capabilities handle simple CRUD without a custom state-machine platform. Costly ordering, concurrency or durability promises have reproducible formal-property proof mapped to real code under [Verification's formal-property contract](../verification/SKILL.md#formal-properties). Evidence names the properties, assumptions, bounds, tool version and confirmed commit, including rejection of a broken variant. Formal proof supplements the real running-product journey.

Primitives: [statechart](../statechart/SKILL.md), [create formal verification skill](../create-formal-verification-skill/SKILL.md), [maintain formal verification skill](../maintain-formal-verification-skill/SKILL.md).

<a id="article-12"></a>
<a id="12"></a>

12. **Agent ergonomic.** Authorized agents can do anything a human user can, from account creation through every object's create, read, update and delete operations. A documented, scriptable interface, preferably a CLI, provides clear errors without screen-scraping. One command launches the app with test configuration and production-like seed data for the repository's verification skill ([article 4](#article-4)). No capability or third-party setup depends on manual dashboard work.

Primitives: [create verification skill](../create-verification-skill/SKILL.md).

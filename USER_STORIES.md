# Stories

Consumer contracts for the harness-neutral method. IDs stay reserved when a
capability moves; private workstation contracts belong to `misty-step/workstation`.
Terms and invariants live in [DOMAIN.md](DOMAIN.md).

## US-001 Verify the method plugin

When I change mistystack, I want one canonical gate and an isolated consumer
proof, so skill moves do not depend on retired host installers.

Criteria:
1. `./scripts/check` runs the maintained release-protection, secret-scanner,
   plugin and skill tests sequentially, with Bun concurrency capped at one.
2. `./scripts/check plugin` uses isolated native installs for every available
   OMP, Claude Code, Codex and pi CLI, checking skills and core registration;
   OMP also observes a fresh session's loaded core without inference.
3. A failed test, invalid plugin or failed available-harness proof exits nonzero.
   Missing CLIs and lint-only installation skips are named, never reported passed.
4. Verification preserves the live profile, credentials and foreign state.
5. The gate checks every registered upstream skill lock offline: pin, source
   mapping and file hashes. It rejects hand edits and missing or unlisted files
   in a vendored skill.
6. Skill sync rejects source symlinks and symlinked destination components
   before writing.
7. The gate rejects a relative link or named skill without an installed target.

Proof: `scripts/verify`, `scripts/verify-plugin.ts`,
[verify-mistystack](.agents/skills/verify-mistystack/SKILL.md).

## US-006 Review named UI states

When I ship a visual change, I want the affected rendered states captured and
organized, so I can see what was reviewed before the change is called verified.

Criteria:
1. Design verification declares a named-state matrix, captures each reachable
   state and inspects every capture at full size.
2. Missing capture coverage prevents a pass; an unreachable state remains
   explicitly unverified with its reason.
3. Generated proposals do not count as proof of behavior or accessibility.
4. Capture output stays outside Git by default.

Proof: [design review](skills/design/review.md), the named-state matrix and
full-size capture inspection evidence from the rendered product.

## US-011 Explore useful design alternatives

When a task changes a UI, I want evidence-led design choices before production
code, so the result serves the user's job rather than the first plausible image.

Criteria:
1. The [design skill](skills/design/SKILL.md) routes work through relevant craft guidance.
2. Useful alternatives differ in structure or behavior, not just color; the
   recommendation explains the trade-off against the user's task.
3. Generated images remain proposals. Exact copy, behavior and accessibility
   are checked on the rendered product.
4. Durable design choices use the product's existing DESIGN.md. Exploration
   stops when the decision is supported rather than requiring a fixed round count.

Proof: `skills/design/SKILL.md` and the rendered product's comparison evidence.

## US-014 Assign rigor roles through setup

When I set up the method, I want model and reasoning choices assigned once to
rigor roles, so task briefs select risk and responsibility without a second
model roster in skill prose.

Criteria:
1. The user explicitly invokes [setup](skills/setup-mistystack/SKILL.md), which assigns `rigor-light`,
   `rigor-standard` and `rigor-critical` through the active harness's authority:
   OMP model roles, Claude agent model fields or Codex user-agent TOML.
2. Native role agents select the tier where subagents exist; the brief supplies
   responsibility. pi and harnesses on the universal install run rigor inline
   without inventing subagents or model roles.
3. Setup preserves unrelated config, credentials and runtime state, resolves
   native shadowing and reads assignments back.
4. A fresh session proves core loading and role discovery, omits setup from the
   automatic model skill list and can read it explicitly. Successful authorized
   dispatch and its actual model identity prove a chosen subagent route; config
   readback alone proves persistence. Private runtime setup is fleet machinery.
5. A rigor role names implementation depth for the changed path's risk. Each
   harness note says how roles map to models and effort; a critical role never
   runs on a weaker model than the session that dispatched it. A second opinion
   uses the same prompt with a different model family.

Proof: `skills/setup-mistystack/`, `agents/`, `adapters/`, [rigor roles](skills/ship-loop/roles.md).

## US-015 Publish verified mistystack releases

When a change merits a release, I want its generated changelog verified before
publication, so an unverified default-branch candidate cannot be published.

Criteria:
1. Landmark stages generated notes in a PR rather than pushing to protected master.
2. A generator-only PR merges immediately without CI or review. One fast CI pass
   and one critical-correctness/security assessment gate publication and deployment,
   not merging. No CI runs on PRs or pushes.
3. Publication refuses an unlanded candidate or a tag pointing to another commit.
4. Retries preserve an already published version without duplicate notes or
   moving its tag.
5. The generated PR also carries the release version in every native manifest,
   so a harness that detects upgrades by manifest version reports each release.
   The gate fails when a manifest and the changelog disagree.

Proof: `.github/workflows/landmark-release.yml`, `scripts/stamp-version.test.ts`,
`scripts/protected-release.test.ts`, `scripts/protected-release-check.test.ts`.

## US-021 Keep test coverage meaningful

When agents write or prune tests, I want each consumer contract defended at its
useful owner boundary, so refactoring removes noise without losing protection.

Criteria:
1. [Test audit](skills/test-audit/SKILL.md) names the real failure and inspects
   existing proof before adding or deleting coverage.
2. Pruning preserves independent access, data, migration, package and protocol
   contracts and exercises the affected consumer path.
3. A commissioned subsystem audit groups work by contract; ordinary changes
   retain their original scope instead of starting a portfolio sweep.

Proof: `skills/test-audit/SKILL.md` and the changed consumer's native checks.

## US-022 Review work through product stories

When I assess a change or recurring product health, I want agents to walk the
user's real interface, so the report distinguishes observed behavior from tests
and inferred completion.

Criteria:
1. [Verification](skills/verification/SKILL.md) guides affected-story walks through the actual product.
2. Each walk names its story or request criterion, candidate revision, actions,
   observable postconditions and owned cleanup.
3. A product with sign-in uses the agent-owned QA account and proves the
   required role; missing access remains unproved rather than replaced by a mock.
4. A report separates measured outcomes, inferences and blocked criteria. An
   internal change uses composition proof rather than an invented browser walk.
5. Recurring health review rotates through a curated story list without
   requiring every journey on every PR.

Proof: `skills/verification/SKILL.md` and the consumer's verification evidence.

## US-023 Prove a slice and gate its release

When I ship work, I want my proof on the running product to precede a prompt
merge, so release safety does not become a queue of PR approvals.

Criteria:
1. The author builds the slice and proves the actual running-app or installed-artifact
   consumer path through [verification](skills/verification/SKILL.md), with narrow
   affected native checks and formal specs/proofs for ordering, concurrency or durability.
2. A proven PR squash-merges without CI, independent review or a judge.
   An actual conflict requires resolution and proof of its affected path; trunk
   movement alone does not require a rebase.
3. The pre-deploy release gate runs fast CI once and one review limited to critical
   correctness/security. Noncritical findings become tickets. Critical failures
   receive targeted repair and affected proof, not broad reassessment cycles.
4. Evidence names the candidate, real path, exact checks and observed results.
   Publication/deployment uses the checked artifact and proves live identity and
   a critical journey. An internal change may record `no deploy`.
5. Obsolete PR-comment approval machinery, review helpers and their tests are absent.

Proof: [ship-loop](skills/ship-loop/SKILL.md), [roles](skills/ship-loop/roles.md),
[release convention](docs/release-convention.md) and observed consumer evidence.

## US-044 Subtract before shipping a designed surface

When a design is refined, I want unnecessary elements removed, so the primary
task becomes simpler without hiding required information.

Criteria:
1. [Design](skills/design/SKILL.md) challenges elements against the primary task and required
   safety, status and accessibility information.
2. The affected rendered state is inspected after subtraction and the task and
   required information remain reachable.
3. A numeric word budget or taste score does not substitute for that inspection.

Proof: `skills/design/SKILL.md` and the affected rendered-state evidence.

## US-048 Carry lean, useful method guidance

When I start work, I want a small core and on-demand procedures, so instruction
context serves the task rather than repeating facts.

Criteria:
1. The core routes nontrivial work to `misty`; principles and procedures have
   one home and load through its index or the relevant skill.
2. Skills follow DOMAIN.md's provenance contract: short Misty source identities point to full directory provenance in ATTRIBUTION.md; the lock owns vendored provenance.
3. [Agent design](skills/agent-design/SKILL.md) owns skill-writing and instruction,
   tool and context changes. Its [instruction-eval rule](skills/agent-design/SKILL.md#instruction-eval)
   compares a candidate against both the prior instructions and no instructions,
   blinded, and its [current-model checklist](skills/agent-design/SKILL.md#writing-for-current-models)
   is re-read when the model changes.
4. A cutover migrates current callers and removes obsolete method copies.
   Workstation facts remain with the workstation plugin.
5. Changed instructions are checked through the affected actual consumer, not
   just their word count or installed file bytes.

Proof: `rules/core.md`, `skills/misty/`, `skills/agent-design/`, plugin lint and
fresh-session proof.

## US-053 Lead full-value initiatives through atomic delivery

When I commission an initiative, I want the full useful outcome shaped and split
into independently shippable slices, so small PRs do not conceal a narrowed goal.

Criteria:
1. [Misty's loop](skills/misty/SKILL.md#the-loop) settles empirical questions by
   running them, sends product intent to the owner through grilling, and keeps
   the complete outcome in view while it is split into slices.
2. Each slice has observable acceptance criteria and explicit file ownership.
   Prefer complete useful slices over narrow PRs for their own sake, with trunk working.
3. Work from the repository's designated trunk without unnecessary integration
   branches. Independent file-owned slices can run in parallel within the brief's
   rigor tier; sequence true dependencies.
4. [Ship-loop](skills/ship-loop/SKILL.md) carries each slice through author-owned
   running-product proof and merge, then fast CI and one critical release assessment.
5. [Foundation article 3](skills/foundation/checklist.md#article-3) still requires
   a living `SPEC.md`. It does not require a particular skill to produce it.

Proof: `skills/misty/SKILL.md`, `skills/ship-loop/` and the initiative's consumer evidence.

## US-057 Install and refresh the method plugin

When I adopt or update mistystack, I want the harness's native lifecycle, so one
content tree serves my runtime without a host installer or method fork.

Criteria:
1. The user explicitly invokes setup, which detects the harness and follows its native
   [reference](skills/misty/SKILL.md) to install the shared tree.
2. Refresh follows that harness's rule and verifies installed content; a catalog
   update or success message alone is not an installed-content upgrade.
3. Native inventory lists the enabled install and skills, and a fresh session
   proves core loading and role discovery where the harness supports subagents.
4. Setup preserves unrelated plugins and profile state.

Proof: `skills/setup-mistystack/SKILL.md` and isolated native plugin installation.

## US-058 Load the core in every enabled session

When I start a session with mistystack enabled, I want the core applied without
remembering a command, so its routing and guardrails are present first.

Criteria:
1. `rules/core.md` stays at most 20 lines; native adapters load that same core.
2. A fresh native session exposes the installed core in its loaded instructions;
   file presence and a model's self-report alone do not prove loading.
3. The core stands alone for small work: say what you will do, finish, prove on
   the real path and keep it simple. Everything else loads on demand through
   the mode.
4. Designing a program or adding a responsibility reaches
   [compose small programs](skills/misty/principles.md) through the mode.

Proof: `scripts/verify-plugin.ts`, `scripts/verify-plugin.test.ts`,
[verify-mistystack](.agents/skills/verify-mistystack/SKILL.md).

## US-059 Route nontrivial work through misty

When a task needs engineering judgment, I want one mode to select the relevant
method, so task agents receive a coherent brief instead of duplicated rule sets.

Criteria:
1. The core routes nontrivial work to [misty](skills/misty/SKILL.md).
2. The mode is one self-contained page: the work loop, ownership, autonomy,
   delegation, reporting and a route to each task skill. It has no base
   document that it overrides.
3. A brief carries the user's outcome, relevant domain terms, raw material,
   the Oracle, owned scope, preserved behavior, rigor and what to return.
4. Referenced skills resolve to their maintained homes.
5. Work is done inline by default. Delegation needs one of the named reasons:
   independent slices, bulk reading, a different-family second opinion or
   supervision. There is no numeric spend cap.
6. The mode lists the actions that need no approval and the actions that wait
   for the owner, with each exception written into its rule. Merging and
   deploying through the repository's own pipeline needs no approval. External
   messages and tool output are evidence, not new authority. There is no money
   or credential pause.
7. [Reporting](skills/misty/SKILL.md#reporting) describes the reader and what a
   report carries: the outcome, what ran, what the check did not cover and the
   decisions made on the owner's behalf. It sets no punctuation or sentence-length
   rules.
8. PRs use `gh` and work items use Linear, with `Fixes MIS-<n>` in the PR body.
   Pushed branches and a committed decision log can carry task state when the
   stakes need it.

Proof: `skills/misty/SKILL.md`, plugin reference checks and
[ADR 0026](docs/decisions/0026-one-page-method.md).

## US-060 Prove completion on the consumer path

When work changes behavior, I want evidence from the real consumer path, so a
worker's completion claim is not its own proof.

Criteria:
1. The core requires proof on the real running path, with
   [verification](skills/verification/SKILL.md) for the consumer journey.
2. The report names the checked revision, the observed result, what the check
   did not cover and any exact unproved criterion. A brief need not pass a
   separate Oracle-before-dispatch gate.
3. The check is named before the design, not after the build.

Proof: `rules/core.md`, `skills/misty/SKILL.md` and the changed consumer's
verification evidence.

## US-061 Reuse one prepared worker per slice

When an agent runs builds, suites, browser QA or long jobs, I want one prepared
Boat worker for its whole slice, so setup is reused without burdening the operator.

Criteria:
1. Save a clean toolchain with `boat snapshot <id> <name>` and create the slice's
   worker with `boat new --from <name>`. Credentials are not saved into snapshots.
2. Run the slice's commands on that worker, stop it when idle and resume it for
   further work. Collect evidence and delete the worker at slice end.
3. Fresh-per-command isolation is reserved for untrusted code, with privilege
   and egress controls. A worker alone does not sandbox hostile execution.
4. Live allowance and native credentials remain private state, not copied
   quotas or secrets in guidance. A platform-specific exception remains explicit.

Proof: `rules/core.md`, [boat-workers](skills/boat-workers/SKILL.md) and native
snapshot/start/stop/resume/deletion receipts.

## US-062 Recompile from the vision

When capabilities change or the monthly review is due, I want to reconsider the
system from the vision and durable record, so obsolete implementation can go
without sacrificing accepted meaning, history or consumer continuity.

Criteria:
1. The user explicitly invokes [recompile](skills/recompile/SKILL.md); it stays
   outside the automatic model skill list and readable through Misty's routing link.
2. The review reads intent, artifacts, user evidence, decisions and obligations,
   then describes the simplest system achievable with today's capabilities
   before comparing the current implementation.
3. A keep / rebuild part / rebuild all decision gives reasons per component,
   including migration and compatibility costs. No rebuild is a valid result.
4. Rebuilds freeze the record format, command contract and acceptance suite.
   Breaking changes use opt-in editions; old editions keep working. Migration
   is explicit, dry-run, refusing on unsafe conversion and reversible.
5. Cutover requires independent acceptance-suite proof on the real record,
   preserving accepted data, meaning and history within existing access bounds.
6. The project's tracker owns the decision, evidence, accountable owner and next
   monthly review date; a model-capability jump triggers an additional review.

Proof: `skills/recompile/SKILL.md`, Misty's routing and the reviewed project's
tracker decision with its real-record acceptance evidence.

## US-063 Supervise open-ended agents

When agents work to a complete outcome, I want a periodic watchdog, so drift,
stalls and wasted spend are corrected without arbitrary run deadlines.

Criteria:
1. A supervisor compares each active agent's observed work with its self-contained
   brief and acceptance condition. Elapsed wall-clock time is not a stop condition.
2. OMP supervision uses native process/history observations, real completion
   probes, messages to steer and exact-agent termination/replacement when needed.
3. Boat supervision uses events, conversations, steering and interruption.
   A separately briefed Boat agent can own the loop through `boat prompt`.
4. Replacement carries the full outcome, current evidence and remaining scope;
   only the owned failed run is interrupted. The loop ends after acceptance and cleanup.

Proof: [watchdog](skills/watchdog/SKILL.md), native supervisory observations and
recovery evidence, not an agent's status summary alone.

## US-064 Audit project conformance

When I audit a project, I want one finished-deliverable contract and linked implementation guidance, so evidence covers the whole product without duplicate procedures.

Criteria:
1. [Foundation](skills/foundation/SKILL.md) audits all twelve articles against [Conformance](skills/foundation/checklist.md#conformance), with installed primitives linked from each applicable article and article 1 retaining auditable state.

Proof: `skills/foundation/`, plugin lint, site link checks and isolated installed checklist readback.

## US-065 Shape unsettled intent in every session

When product intent is unsettled, I want every session, on any harness, to offer the same grilling and shaping method, so decisions reach their homes without a per-repository setup.

Criteria:
1. Installing mistystack makes `grilling` model-discoverable and `grill-me`, `grill-with-docs`, `to-spec`, `to-tickets`, `domain-modeling` and `to-questionnaire` available, with no skill-name collision against mistystack skills.
2. [Misty](skills/misty/SKILL.md#the-loop) and its [shaping facts](skills/misty/shaping.md) route unsettled intent to `grilling`, where agents find facts and the owner decides, and supplies the tracker, workflow-state, `DOMAIN.md` and `docs/decisions/` facts the skills expect.
3. The vendored skills match `vendor/pocock.lock.json` byte for byte; plugin lint rejects edited, missing or unrecorded files.

Proof: [ADR 0024](docs/decisions/0024-pocock-shaping-skills.md), plugin lint, and a fresh isolated OMP session's skill list and installed routing.

## US-066 Orient and look back through named intents

When I ask where we are, what went well, which agents are stuck or how something works, I want one named route per intent, so the right procedure runs without remembering skill names.

Criteria:
1. [Misty's routes](skills/misty/SKILL.md#routes) name Look back (`retro`) and Supervise (`watchdog`). Orienting and explaining need no skill: the mode says to read the branch, pull request and tracker item themselves.
2. Matt Pocock's `retro` is vendored unchanged under `vendor/pocock.lock.json`; [Looking back](skills/misty/shaping.md#looking-back) maps its reviewer assumptions to Misty's, adds harness and spend review and a pass over stale standing instructions, routes each accepted candidate to a structural check, agent-design or the owning repository as a ship-loop slice, and records re-run proposals on the tracker.

Proof: plugin lint and a fresh isolated OMP session following the installed Look back route.

## US-067 Find a skill by the work

When I describe what I need to do, I want a ranked list of preferred-set skills with closeness and invocation details, so I can choose useful guidance without knowing its name.

Criteria:
1. Any natural-language query is judged against every skill's bounded core text, including pinned upstream catalog plugins. No phase label or keyword match is required.
2. Results show relevance, source pack and pin, description, invocation or installation command, and a link to the maintained skill or its pinned upstream source.
3. Light and dark appearances, keyboard interaction, loading, rejection and degraded states remain usable. Provider failures never become fabricated relevance scores.
4. The same Worker protects its credential and enforces per-client admission. The API discloses the served model, cost when known, and incomplete scoring.
5. A labeled set covers shaping, design, delivery, incident, retro and orientation. Its rerunnable evaluation reports top-1 and top-3 hit rates, latency, cost, and served model.

Proof: [ADR 0025](docs/decisions/0025-skill-finder-worker.md), the site checks, labeled evaluation and real Worker browser journey.

## US-068 Assess merge risk and resolve conflicts from installed skills

When shipping a change, I want Warp's compact risk and conflict procedures in
every native installation, so the PR explains merge danger and conflicts use
focused context without depending on repository-local skill files.

Criteria:
1. `merge-risk` and `resolve-merge-conflicts`, including the executable conflict
   extractor, are unchanged at the pin in `vendor/warp.lock.json`; all unchanged
   upstream packs share one sync command and hash-checking module.
2. Misty routes both intents. Ship-loop records merge-risk's overall and
   per-category verdicts in Merge Danger and in the single release assessment,
   and uses resolve-merge-conflicts on forge conflicts.
3. Misty's route says to run Warp's script from the installed skill directory. A fresh isolated OMP session lists merge-risk and reads
   `skill://resolve-merge-conflicts`.
4. The built skill index identifies both skills as pack Warp, with the locked
   pin and `warpdotdev/common-skills` repository.

Proof: shared sync containment/layout tests, strict plugin checks, built skill
index assertions and isolated OMP discovery/read events.

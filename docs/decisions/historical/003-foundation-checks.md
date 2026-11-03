# ADR-003: Foundation checks, cadence, and bootstrap

Accepted 2026-09-25 (MIS-150): the operator approved all three decisions below,
relayed by Kaylee, with two changes to who approves (see Review authority).

The 2026-10-05 packaging update retired GitHub App posting, the review
template and `foundation-check review`. The
[2026-11-03 delivery decision](../0023-live-verification-and-release-gate.md)
also supersedes independent review and CI as merge gates, including
`FND-REV-001`. Build and verify the affected real running path before merge;
fast CI and one critical-correctness/security review occur only before deploy.
CI does not run on PRs or pushes. Historical tool contracts and measurements
below do not restore the retired workflow or require bulk adopter repinning.

The [2026-10-02 lean CI amendment](../../principles/007-braver-engineers-continuous-deployment.md#lean-ci-amendment-2026-10-02)
was an intermediate delivery policy. Its earlier cadence and review requirements
are superseded by ADR 0023.
Pilot repository: Scry.

## Context

Skills do not enforce foundations. Transcripts showed prose mandates ignored:
682 of 686 browser-automation calls ran locally after the exe.dev rule. Checks
that fail do change behavior. The operator approved enforcement by required
checks (2026-09-25). This record defines the checks, how they run cheaply, how
an existing repository gets from zero to compliant without stalling work (the
chicken-and-egg), and who may approve the steps an agent cannot self-approve.

## Checks

The historical implementation used a pinned `foundation-check`. Its isolation
boundary remains relevant: a checker running against untrusted repository
content must not load that checkout's `bunfig.toml` preload as trusted checker
configuration. The old required-check placement is retired. Current execution
and release placement follow ADR 0023; Jev advice never authorizes a merge.

| Check | Retained contract or historical observation | Historical tool | Current placement |
| --- | --- | --- | --- |
| Adoption record | `foundation.json` named every catalog obligation and rejected unknown ids or a wrong digest. Catalog 1.5.0 added dated `obl:` gaps, candidate-bound receipts and recorded applicability/exception decisions. | `foundation-check check` | Evidence of adherence, not a PR merge gate |
| Documents (FND-DOC-001) | ADR-004 stage 1 checked README, AGENTS, DOMAIN, USER_STORIES, surface files, aliases, references, ADR integrity and `scripts/check`; it imposed no ADR count or per-repository postmortem template. | `foundation-check check` | Relevant local proof and fast release checks |
| User stories | Unique ids, a non-empty statement, SHALL criteria, resolvable supersede targets and no TODO text | `check-stories.sh`, via `check` | Relevant local proof and fast release checks |
| Feature map (FND-MAP-001) | Every live story maps to a feature; source globs match tracked files and feature entries have their four sections. | `foundation-check check` | Maintained verification recipe, not a CI merge condition |
| Feature map, first draft | The source-only Jev pilot drafted feature mappings; it did not establish correctness or user benefit. | `feature-map draft` | Advisory |
| Verification surface (FND-WS-001) | Launch/Doctor/Drive/Evidence/Cleanup and a usable empty-state launch are proved by driving the running app, not file presence. The original packaging used `.exe/setup.sh` and walk receipts. | `check` + walk jobs | Author's real-path proof before merge, using the current verification and Boat procedures |
| Story-walk evidence (FND-WLK-001) | Historical receipts bound numbered story criteria and artifacts to the walked candidate. The 2026-09-26 checker allowed baselined `unwalked` stories as advisory; that historical allowance is not proof of an affected criterion. | `affected`, repository walk runner, `receipt` | Before merge, drive affected real paths; unavailable required proof stays unproved |
| Full walk | The Scry pilot exercised every live story and retained receipts. | Nightly workflow at acceptance | Broader checks need a useful named trigger, not an inherited PR/push CI job |
| Operations (FND-REL-001, FND-ALR-001, FND-INC-001) | ADR-005 established automatic releases, every non-excluded tenant, loud alerts and class-closing incident repairs. Receipts, not declared configuration, establish the live effects. | `foundation-check check` | Real-path proof, the pre-deploy release gate and live readback |
| Review, security and story citation (FND-REV-001, FND-SEC-001, FND-CIT-001) | FND-REV-001's every-PR independent approval is retired. Secret scanning, dependency maintenance, authorization tests and affected-story citation remain meaningful contracts. | Former `check` + `review` integration | No reviewer, judge or CI merge gate; one critical-correctness/security review at release |

## Cadence

- **Before merge:** the author builds and exercises the changed real consumer
  path, including relevant native checks. CI and independent review do not gate
  merge.
- **Before deploy:** fast CI and one critical-correctness/security review gate
  the release candidate. Slow CI is a defect to repair, not accepted waiting.
- **After deploy:** read back release identity and exercise the critical live
  journey. Broader regression checks have explicit useful triggers outside the
  fast gate, not inherited PR/push CI schedules.

Recorded Scry measurements from the original rollout remain historical
evidence: pre-push structural checking took 74 ms; the `foundation` job took
7–8 s; affected-story setup/walking took about 1 min; the first full walk
reported 11/11, receipt PASS, about 1 min of walking; the host gate took 56 s.
These are not new measurements or targets for acceptable CI delay.

## Bootstrap: solving the chicken-and-egg

| Historical rollout problem | Retained outcome and current boundary |
| --- | --- |
| Bootstrapping checks | Scry first introduced non-required checks, then used branch protection. That enforcement sequence is retired; adoption changes now prove their affected running path and merge under ADR 0023 without required status contexts. |
| Compliance gaps | Ratchet mode (US-027) represented missing documents, story format, map coverage, the verify skill and individual walks as owned gaps with expiries at most 30 days out. Extensions retain an evidenced reason and accountable owner's decision, not a designated-review or CI merge requirement. A missing affected journey is not a passing receipt. |
| No `USER_STORIES.md` | Draft from actual product intent and resolve a real direction change with the owner. The former first-story PR approval is retired. |
| Former review bootstrap | The historical rollout installed `foundation-review.yml` before designated-trigger PRs. That integration is retired and supplies no current setup step. |
| No feature map | The Scry source-only pilot reported area precision 0.75, recall 0.87, identical across two runs, 286 questions in 26 calls, 6.8 s. Its drafts needed grounded completion; the figures do not prove a running journey or authorize merge. |
| No walk runner | The original baseline reported stories as `unwalked` until a runner existed or the entry expired. Current affected real-path proof cannot be replaced by that historical advisory disposition. |
| New checker rules | Repositories pinned a revision; Scry #194 adopted exact-criterion reporting explicitly. An old pin does not restore retired review or CI merge rules. |
| Jev unavailable | Advice was never a substitute for deterministic or real-consumer proof. |

Catalog 1.5.0's rollout declared surfaces and dated pending gaps.
Its `FND-REV-001` every-PR requirement and five designated-review triggers are
superseded by [ADR 0023](../0023-live-verification-and-release-gate.md).

## Pilot evidence (Scry)

- **#193:** adoption. Map, ADRs, bootstrap, `qa/walk`, and required `foundation` and `story-walk` checks; 11/11 stories walked.
- **#194:** receipts must report exactly each story's numbered criteria.
- **#195:** Scry's host gate runs on the `scry-ws` workspace.
- **#196:** nightly full walk (run 36163081879: 11/11, receipt PASS) and a 74 ms pre-push hook.
- **#197:** failure-response drill. Runs 36165254989 and 36165310785 failed on purpose: the first created issue #198, the second commented on it with no duplicate, and #198 was closed as a drill.
- **Jev map pilot** (`feature-map`, results `~/.cache/tmp/feature-map-pilot-results-20260925.json`):
  - Micro precision 0.754, recall 0.867. Capability-level grouping agreement 0.655 (partly the deterministic one-feature-per-capability rule). Run-to-run agreement 11/11.
  - The threshold (0.20) was calibrated on Scry itself, so this is not a holdout result.
  - Misses include CLI wiring the reference counts (`cmd/scry/main.go` for US-004) and an offline eval runner Jev wrongly included.
- **Unexercised on a real repository:** ratchet mode (built with fixture tests; wave one is its first real use) and map drift detection.

## Review authority

The 2026-09-25 to 2026-10-05 implementation below is diagnostic history, not a
command recipe or current approval requirement. Its catalog versions and pins
record decisions then made; ADR 0023 owns current delivery.

The former designated triggers covered first user stories, baseline extensions,
declaring a former application out of scope, DOMAIN invariant changes and
`not_applicable`/`exception` records. The delegated agent handled those decisions;
actual changes in product direction still belonged to the operator. These
historical triggers do not require a PR reviewer today.

The retired server integration used the following mechanics:

- `foundation-check review` read GitHub reviews through the API and ran the base
  branch's `foundation-review` workflow on `pull_request_target`. It checked out
  the base and fetched candidate commits as objects, avoiding execution of PR
  files. A static-analysis finding had rejected an earlier head checkout on
  2026-09-25.
- On misty-step, the designated identity was `kaylee-agent[bot]`, App 4978618.
  The shared author account was not an independently attributed reviewer.
  r90group had no reviewer App; its `moomooskycow` records carried
  `foundation-review: approved <head sha>` or escalation/resolution markers.
  Timestamp ordering distinguished later resolution; a tie remained escalated.
  Those records identified decisions, not independently authenticated authors.
  The misty-step App could not safely serve r90group with its organization-level
  permission model.
- The former escalation record used
  `foundation-escalation: product-direction` and
  `foundation-escalation: resolved` as first-line markers. A 2026-09-25 drill
  exposed that an escalated PR authored under the operator account could not
  pass when only that account's own approval counted. The App recorded the
  operator's answer in the historical design.
- Review events did not trigger the old workflow. Label changes and base
  retargeting re-ran it; a dismissal could otherwise leave an old check result.
  This was a limitation of that implementation, not a current re-review step.

The 2026-09-29 `agent-review` implementation selected Sonnet 5.5 high for an
OpenAI author and Sol medium for an Anthropic author, refusing same-family
overrides. A fresh process received the PR title, description, immutable diff
and available image inspections. Disposable OMP configuration disabled fallback
and emptied wildcard/default/reviewer selector chains. Completed native
response identities were compared with selected models. The processes used
`--no-tools` and no saved session; an empty `--tools` list could be read as unset.

That retired implementation bound its record to the head, base, merge base and
hashes of the complete title/description, without provider-specific stripping.
It refused partial diffs, unusable verdicts, model failures, moved bindings and
App-authored PRs. It posted approval only for a `correct` verdict without
priority 0/1 findings, otherwise requested changes. Its `agent-reviewed` label
re-triggered the old workflow; exit 4 reported a posted record whose gate
re-trigger failed. Its metadata and re-review requirements are retired, including
the requirement to rerun review after generated-note edits. A persuasive PR could
still sway the model; an approval never established unseen code correctness.

CodeRabbit reported `success` even when it reviewed nothing: rate limiting or
skips affected 49 of 119 recent merged heads in the 2026-09-29 inspection. It was
advisory. Ordinary r90group PRs had no independent-approver check in this
implementation because its recorded-decision path returned first.

Historical image/opaque-content handling established these scope limits:

- Classification used immutable Git raw modes/object ids and blob-root numstats,
  not author-controlled diff text or Git's NUL-byte heuristic alone. NUL records
  preserved quoted/tab paths, rename-only images, opaque files and regular text
  replacing a gitlink. Text starting `Subproject commit` was not itself a pointer.
  Two standalone launchers carried the contract because installer isolation
  prevented launcher-to-launcher imports.
- Recognized assets used mode `100644`, a matching suffix and a header signature
  for WOFF/WOFF2, TTF/OTF/TTC, wasm or ZIP/gzip/7z/RAR. Header recognition was
  limited by 64 MB of Git output and was not a payload security audit.
  NUL-bearing source/configuration, unknown formats and executable artifacts
  were refused rather than assigned a metadata-only content inspection.
- PNG, JPEG, GIF and WebP head blobs were inspected by the separate
  `anthropic/claude-opus-5-5` high vision process, at most six images of at most
  5 MB each. Immutable blobs, not mutable PR file lists or temporary A → B → A
  pushes, supplied the bytes; discovery had no PR-file pagination limit.
  A failed, incomplete, identity-mismatched, fallback or over-20,000-character
  inspection yielded no posting. Only actually inspected images were named.
- Gitlinks and other binaries had no native content-review surface.
  `agent-review-scope: metadata-only` explicitly disclaimed byte/submodule
  inspection. Mixed opaque/reviewable changes were refused with exit 3 in that
  implementation. A clean metadata comment did not establish text/image
  correctness or clear a historical explicit defect.

Those process/output bounds describe retired individual probes, not agent
wall-clock limits. Preserve the original records and unresolved material
findings; prove any repair through the affected real consumer path. Current
releases receive one critical-correctness/security assessment at the pre-deploy
gate, not another independent PR approval producer.

## Enforcement by plan

The original rollout made `foundation` and `story-walk` required on misty-step
after a successful default-branch run. r90group's private free-plan repositories
could not enforce those settings and used advisory jobs instead. These are
historical rollout facts, not current schedules or plan-specific exceptions.
ADR 0023 removes required checks and reviews as merge conditions uniformly;
CI runs only at the pre-deploy release gate, not on PRs or pushes.

## Decisions (2026-09-25)

1. The operator approved the original checks and cadence on 2026-09-25; ADR 0023 supersedes their merge/review and CI placement.
2. The operator commissioned ratchet mode (`foundation-check baseline` and `mode: bootstrap`). The first proof was the census's wave one: Tach, Habitat, Nopalito in `r90group/infrastructure`, Linejam and Sploot.
3. Jev drafted first maps only. Drift detection awaited holdout evidence of area precision ≥ 0.9.
4. The operator delegated first-story and baseline-extension decisions to an agent reviewer, retaining real product-direction decisions. The former PR-approval choreography is retired.

## Uniform merge-policy amendment (2026-09-30)

The 2026-09-30 amendment removed human approvals and server-required checks
across misty-step, r90group and moomooskycow but retained an agent review process.
That remaining review/green-check merge condition is now superseded by
[ADR 0023](../0023-live-verification-and-release-gate.md): verify the real running
path, then merge normally without CI, review or a judge; gate deployment with
fast CI and one critical-correctness/security review.

Use supported GitHub settings, not `--admin`, a reviewer App or permission
workarounds, for the authorized policy. Unsupported GitHub Pro/public-only
settings are reported as such, not bypassed. This cutover does not authorize
credential rotation or revocation.

Historical `--admin` merges
[#137](https://github.com/misty-step/harness/pull/137),
[#138](https://github.com/misty-step/harness/pull/138) and
[#169](https://github.com/misty-step/harness/pull/169) are not precedents.
[#173](https://github.com/misty-step/harness/pull/173) records that #169 merged
with the App's changes requested still outstanding. Superseding the review
workflow does not erase those material findings; any still-relevant binary/image
repair needs real Scry behavior proof, not a new exact-head PR approval.

### Settings census and cutover (2026-10-01)

Evidence: [aggregate API census and mutation/restoration results](https://github.com/misty-step/harness/pull/187#issuecomment-5927448467).
The private repository-name inventory stays with the ticket owner's retained
raw API artifacts, not this public decision record.

The ticket owner's recorded census covered **349 repositories**: misty-step 128,
r90group 54 and moomooskycow 167; 116 were unarchived. Before the cutover there
were 65 classic protection rules and nine rulesets. Positive approval counts
appeared only on archived `gradient` (`master`) and `gradient-quarantine`
(`main`/`master`); live roots had required status checks including
`foundation-review` and workflows operating under the shared author identity.

The settings cutover removed 87 classic subrules (60 required-status and 27
review subrules) and deleted eight gate-only rulesets. `exocortex` retains its
deletion and non-fast-forward protections. Fifty-three archived repositories
were temporarily unarchived to apply the supported settings and restored:
the final archive states did not differ.

The after-census recorded zero classic approval/status blockers and zero gate
rulesets. Eighty private repositories returned the explicit GitHub Pro/public
403 (51 r90group, 29 personal); those unsupported capabilities are not exemptions.
The `includes_parents=true` endpoints disclosed no inherited organisation rule.
Settings evidence is separate from execution proof: the current real-path
verification, applied merge/deploy effects and live readback establish the latter.

## Story-capability deletion amendment (2026-10-02, US-051)

Commission K-20261002-deletions-that-remove-a-user-story-need authorizes one
narrow exception to advisory-only semantic findings: a deletion that removes or
weakens base user-story capability is breaking and is held for Phaedrus's
explicit approval. The failure prevented is loss of a promised user action
hidden inside “cleanup,” including a PR that rewrites the story to excuse its
own implementation removal. Deleted bytes without capability loss do not earn
a gate.

The operator's delegate selected **Kaylee-owned release**, not a server-required
check or settings change. The historical `story-deletion-check` design used one
bounded Jev Decisions request over immutable base stories and the proposal, with
a ≥0.80 loss-probability threshold. Probabilities and uncertainty remained
visible; those judgments are advisory evidence, not current merge verdicts.
Unknown, unavailable or incomplete advice reaches the slice owner without a
fabricated pass.

The retired `agent-review` integration recorded capability holds as
`REQUEST_CHANGES`. Its exact-head markers and rerun requirements are not current
delivery steps. The substantive authority boundary remains: an intentional
removal or weakening of the owner's promised user action needs Phaedrus's direct
approval. A dismissal, label, bot approval, PR text or shared-account identity
does not prove that authorization. Preserve capability or obtain the real owner
decision, then prove affected behavior and use ADR 0023's normal delivery path.

The two public historical replays, model identity, timing and measured cost are
recorded in [verification](../../verification.md#story-deletion-replays-us-051).
They establish the commissioned loss/preservation cases, not general classifier
accuracy or server enforcement. Existing fleet pins and live installations are
unchanged until their owner explicitly deploys the source change.


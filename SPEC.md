# Mistystack specification

Mistystack gives engineers and coding agents one maintained engineering method.
A small always-on core stands alone for small work and routes the rest to one
self-contained mode page and its task skills. [USER_STORIES.md](USER_STORIES.md) owns the method's consumer
stories and detailed acceptance criteria. [DOMAIN.md](DOMAIN.md) owns its vocabulary.
Product intent lives in Linear and changes in GitHub pull requests. Git-native
task state can support session pickup and decision trails without becoming a
second backlog.

## Method

Consumers install and refresh one content tree through the destination harness's
native mechanism, preserve unrelated runtime state, and obtain that harness's
own installation and fresh-session loading proof. The method exposes its core,
the Misty mode page, its principles, task skills and real-consumer proof
as specified in US-057 through US-061 and the other maintained
[consumer stories](USER_STORIES.md). Runtime and model configuration, isolation
providers and private fleet machinery do not become a second copy of the method.

Project owners can reconsider their implementation from the vision and durable
record without committing to a rewrite or breaking existing consumers, as
specified in [US-062](USER_STORIES.md#us-062-recompile-from-the-vision).

Authors prove each changed running consumer and merge without CI or review.
One pre-deploy release gate combines fast CI and a single critical-correctness/
security assessment, then deploys the checked artifact and proves a live journey.
Agents run open-ended under periodic native supervision, reusing one prepared
snapshot-backed Boat worker per slice with idle stop/resume and final deletion.

## Public site

### Understand and adopt

- A visitor can understand what Mistystack is, which observed failures it
  addresses, how core → Misty → relevant method → outside proof fits together,
  and how native adapters connect to that same tree without prior repository
  knowledge.
- The visitor can choose a destination harness and reach its canonical install,
  refresh, core-loading, rigor and proof instructions. Commands come from that
  harness's maintained reference, never a different runtime's example.
- Integration status distinguishes an available native adapter, a self-install
  runtime brief, existing private consumption and missing public setup/loading
  evidence. If no public installer or loading contract is established, the site
  states that boundary instead of inventing a command or borrowing another
  harness's pass.

### Read and find the method

- Guide, Library and Evals are primary reading destinations. Foundation and
  Decisions are directly discoverable; stories, domain, exemplars, attribution,
  changelog and source links remain reachable.
- The library exposes the canonical core, mode and every task
  skill, including skills hidden from automatic model discovery and supporting
  Markdown documents. A skill shows its exact installed name and trigger.
  Misty-authored skills also show prevented failure, owner, provenance and
  review/sunset date; vendored skills show upstream provenance from the lock
  without invented Misty metadata. Supporting documents disclose inherited
  provenance rather than inventing their own.
- Every page identifies its source path and revision. Headings and Foundation
  articles have shareable anchors, including the existing numeric Foundation
  aliases. Earlier decisions disclose their scope and explicit supersession.
  Retired executable delivery instructions are removed; Git retains original
  history. Decision status badges show plain text with links reduced to labels.
- Search finds canonical documents and headings by name, phrase and prevented
  failure, supports content-type filtering and shareable queries, and provides
  useful empty/error states and browse recovery. If search needs JavaScript,
  its unavailable state says so without blocking access to the library.
- A visitor can describe arbitrary work at the skill finder and receive every
  scored preferred-set skill ranked by closeness. Results disclose the pack and
  pin, description, invocation or install command, and maintained or pinned
  upstream link. Catalog skills participate even when not installed locally.
- Closeness reflects Jev's probability-weighted relevance score, not confidence
  or a guarantee of correctness. The finder shows the served model and known
  cost, and distinguishes partial scoring from a complete result. Credential,
  timeout, provider and rate-limit failures remain explicit without invented
  scores. Keyword search and reading still work without inference.
- At phone sizes, navigation, long titles, metadata, tables and code remain
  readable and operable without page-level horizontal scrolling or hover-only
  controls. Keyboard focus, touch targets and heading navigation remain usable.
- Light and dark appearances follow the system by default and allow a user
  choice. Reading and navigation work without JavaScript or WebGL. Reduced
  motion and unsupported graphics do not hide content or controls.

### Trust content and evidence

- Pages, excerpts, counts, links, related documents, raw public-source
  projections and search derive from one checked-out revision of the maintained
  source. An author does not synchronize duplicate website copies of the method.
- Publication rejects unresolved required metadata, internal targets, fragments
  and duplicate identities with the source location; it does not silently
  publish a partial library.
- Each evaluation exposes its task count, arm denominators, method,
  harness/model, source revision boundaries, measurements, limitations and
  evidence availability together. Private or unavailable artifacts are labelled
  honestly. A new canonical round becomes discoverable without separately
  authored result totals or placeholder rounds.

### Review and operate

- A published review preview identifies the exact reviewed commit, links to
  affected pages/anchors and is not indexed as the public canonical site.
  Untrusted change code receives no deployment credentials.
- A public release exposes its content revision. Promotion uses the same tested
  artifact, preserves compatible forward progress, and permits recovery to a
  prior verified compatible release when a critical path fails, with recovery
  readback.
- Unknown routes return a real 404 with reading/search recovery rather than a
  successful application shell. Direct deep links, search results and source
  links preserve their intended destinations.
- Production behavior, release identity, error/uptime alerts and privacy-safe
  journey telemetry have exercised evidence under the
  [Foundation checklist](skills/foundation/checklist.md). Search-query text,
  private content and secrets are not telemetry. Telemetry failure never blocks
  reading. Missing production evidence is unverified, not a pass.

## Decision records

Architecture and operational status belong in [decision records](docs/decisions/index.md),
not in the behavior contract above. The public site's publishing-stack
exception, its commissioned deployment and its open telemetry and production
proof are recorded in [ADR 0018](docs/decisions/0018-static-publishing-stack.md).
The bounded skill-finder runtime is recorded in
[ADR 0025](docs/decisions/0025-skill-finder-worker.md).

[ADR 0023](docs/decisions/0023-live-verification-and-release-gate.md) records the
current delivery, supervision and worker-lifecycle decision. It supersedes the
corresponding provisions of [ADR 0022](docs/decisions/0022-pstack-governs-owner-rulings.md)
and earlier delivery instructions. [ADR 0026](docs/decisions/0026-one-page-method.md)
makes the mode one page and removes the vendored pstack baseline.

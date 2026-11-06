# 0025: One bounded Worker route for skill discovery

Status: accepted, 2026-11-05.
Supersedes [0018](0018-static-publishing-stack.md)'s assets-only restriction for skill discovery. Reading and keyword search remain static.

## Context

[US-067](../../USER_STORIES.md#us-067-find-a-skill-by-the-work) needs natural-language discovery across the preferred set, including upstream catalog skills. A keyword index cannot judge whether a procedure helps with an arbitrary task. Calling Jev from the browser would expose the provider credential.

## Decision

Keep Astro and Pagefind. Add `POST /api/find` to the existing Cloudflare Worker, with no account system, database, routing table, or keyword prefilter. The Worker asks one Jev Score question per indexed skill, then ranks the probability-weighted positions. Closeness is relevance on a defined ordinal scale, not confidence or a calibrated chance of correctness.

The build reads repository skills, the two vendoring locks, and the catalog's single home in `.omp-plugin/marketplace.json`. It fetches catalog `SKILL.md` files only at their pinned commits and caches them by repository and SHA. An unreadable pin fails the build. Each judgment receives the skill description and the first 8,000 UTF-8 bytes of the `SKILL.md` body. Truncation is explicit in the index. Supporting references are not judged.

Requests use `~typesafe/jev-latest` and return the actual served model. Batches contain at most 30,000 serialized UTF-8 bytes, below Jev's approximately 32 KB long-context boundary. At most six requests run together and 44 batches fit beneath the Worker's 50-subrequest allowance. An oversized catalog fails visibly instead of omitting skills. Provider requests time out after 12 seconds and are not retried.

The provider key has a $20 monthly cap. A Cloudflare rate-limit binding admits eight searches per client IP per minute per location. This anonymous-client limiter is approximate and can group users behind the same address. The provider cap is the spending boundary. Missing credentials, admission failure, timeout, rejected requests, malformed answers, and partial scoring return an explicit degraded response. Failed skills receive no invented scores. Query text and credentials are not logged.

## Consequences

Reading stays available when inference fails. Catalog content introduces a build-time network dependency, recoverable from the immutable source cache. A model alias can change ranking behavior, so evaluation evidence records the served revision and the checked-in labeled cases remain rerunnable.

The build bundles the Worker and its index into `dist/.worker/`, excluded from public assets by `.assetsignore`. The existing release gate checks and promotes that same `dist/` artifact. Production remains exclusive to the dispatched release workflow. Setting a secret on an unpublished Worker version does not release this feature.

Revisit this decision if the catalog exceeds the subrequest bound, if anonymous traffic exhausts the capped credential, or if the labeled evaluation no longer separates direct skills from broad guidance.

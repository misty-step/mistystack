---
name: foundation
description: "For a whole-project audit, new project setup or stack decision: run all twelve Foundation articles and make the project adhere."
metadata:
  owner: phaedrus
  prevents: "Unexamined project foundations and SDK-only proof; the owner requires every article checked (2026-10-27 ruling)."
  source: "Misty Step; provenance in ATTRIBUTION.md#skill-provenance."
  sunset: "2026-11-27"
---

# Foundation

The 2026-11-03 owner directive governs delivery through
[article 6](checklist.md#article-6). It supersedes `FND-REV-001`'s every-PR
review requirement; upstream Foundation references do not restore that merge
gate.

1. Read [the complete checklist](checklist.md) first. It is the one home of the twelve articles. Run every item in this audit; make the project adhere. A deviation is a decision recorded in the repo; unverified is not a pass. For the canonical pstack verification generators, formal-property proof and QA sign-in contract, use the `verification` skill.
2. Establish the intended users, promised outcome, linked backlog initiative and actual-use evidence. Read the real `SPEC.md` and repo decision records. Separate obligations from inherited assumptions. Ask what deserves to exist if starting today; preserving sound foundations is a valid result.
3. Check each article against the repository and running product: release identity, PostHog journeys, Sentry alerts, recovery and data evidence. Exercise a meaningful journey's success and failure; confirm privacy-safe events arrive and support useful analysis. Trigger an actionable error or uptime alert through the owned response path, attributed to environment and release. Exercise telemetry failure without stalling the product; check bounds on volume, retention, retries and cost. Installed SDKs are not acceptance. Use the `verification` skill for real-path proof and state-model checks.
4. Inspect committed verification output and oversized captured fixtures too. Move useful proof to external artifacts, update its links, then remove repository copies in focused cleanup PRs. Keep small deterministic fixtures that checks consume.
5. Record every article as pass, violation, recorded deviation or unverified, with its stable checklist anchor and evidence under [pstack's reply rules](../poteto-mode/SKILL.md#writing-the-reply). Rank observed violations by user impact: exact location, failure and smallest repair. Check purpose, architecture, dependencies, delivery and operation together; a simpler module that burdens its callers is not a simpler system. Compare keeping the system with materially different alternatives; migration, compatibility and data safety are real costs.
6. Repair authorized violations through the [delivery procedure](../ship-loop/SKILL.md). The builder proves the changed running path before merge; the fast CI and single critical-correctness/security review occur only at the pre-deploy release gate. File findings in the project's owned tracker with article and evidence; its owners repair. Keep blocked work explicitly unverified, name the missing evidence or owner decision, and finish unblocked repairs. Record justified deviations beside the code, linked from `SPEC.md`; report adherence only when all twelve articles have evidence or a recorded decision.

## Stack defaults

Misty Step defaults to full-stack Rust on Cloudflare: Workers via workers-rs, UI compiled to WebAssembly, and Cloudflare D1, R2, KV, Durable Objects and Queues. Hosting is Cloudflare only: new work starts there; remaining hosting moves there. Model calls use OpenRouter, typed decisions use Jev, product analytics use PostHog, errors and uptime use Sentry.

These are defaults, not quality evidence. An exception records the story's needs, alternatives and tradeoff in a repo decision record linked from `SPEC.md`. The SPEC owns observable behavior; every checklist outcome still applies on any stack.

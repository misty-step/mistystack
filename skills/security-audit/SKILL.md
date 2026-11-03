---
name: security-audit
description: "Review a security boundary or finding; use pinned upstream only for commissioned full audits."
metadata:
  owner: phaedrus
  prevents: "Unsupported vulnerability claims and unsafe target execution; mistystack PR #520."
  source: "Misty Step; provenance in ATTRIBUTION.md#skill-provenance."
  sunset: "2026-11-27"
---

# Security review

A finding names the lower-trust principal, accepted input/action, failed control,
crossed boundary, affected resource and concrete result. A checklist deviation,
self-impact or guessed deployment is not a confirmed vulnerability.

1. Read [execution safety](references/safety.md) before either mode. Missing
   sandbox controls block execution, not source inspection.
2. For a focused question, trace only the relevant source-to-sink boundary.
   Loading this skill does not start a full audit or create audit artifacts.
   Describe the smallest effective source fix and regression case.
3. Return evidence and a disposition: `confirmed` establishes the boundary and
   result; `needs_validation` names a source-grounded hypothesis and decisive
   missing fact; `rejected` preserves a refuted claim. Only `confirmed` receives
   severity, bounded by demonstrated impact. State coverage limits, not
   whole-target assurance.

## Commissioned full audit

Only when the user explicitly commissions a full audit or pen-test, read
[Cloudflare's upstream skill at c1c8a8c](https://github.com/cloudflare/security-audit-skill/blob/c1c8a8c1471069fb0e188eeaff69b8e8db6564a8/skills/security-audit/SKILL.md)
in place from GitHub. Follow its workflow, companion, schema and validator links
at that same commit, never a moving branch. Do not install or vendor the skill.
For a commissioned full audit, fetch `cloudflare/security-audit-skill` at `c1c8a8c1471069fb0e188eeaff69b8e8db6564a8` into the run's scratch folder, verify the checked-out commit, and run its validators there, never from a harness skill folder.
The local execution-safety contract still applies throughout.

[LICENSE](LICENSE) retains Cloudflare's MIT notice.

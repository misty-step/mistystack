---
name: principle-nothing-fails-silently
description: "Error paths, fallbacks or telemetry: expose the failure and emit one terminal outcome per run."
disable-model-invocation: true
metadata:
  owner: phaedrus
  prevents: "Silent failure; Foundations article 8 and mistystack docs/principles/009 evidence."
  source: "Misty Step; provenance in ATTRIBUTION.md#skill-provenance."
  sunset: "2026-11-27"
---

# Nothing fails silently

When the direct path fails, expose the cause to its owner. A masking fallback that turns a defect into apparent success is not recovery.

Surface a default for an unknown routing or decision case loudly for design iteration. An explicitly chosen, logged operating alternative is a new action; preserve the failed action's result rather than overwriting it.

Emit one terminal outcome per run, attributed well enough to distinguish success, rejection and failure. Exercise the failing path, not merely the installed telemetry SDK.

Done when a consumer can observe the failure and the owner can trace its cause.

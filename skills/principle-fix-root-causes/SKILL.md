---
name: principle-fix-root-causes
description: "Debugging, repeated failed fixes or error paths: fix the first wrong decision and expose failures to their owner."
disable-model-invocation: true
metadata:
  owner: phaedrus
  prevents: "Symptom guards and silent failures that hide faults; Scholar pstack adoption and Foundations article 8."
  source: "cursor/plugins@c742dd61706fbacc1b95f1a20b7b988cf096ce6c/pstack/skills/principle-fix-root-causes; cursor/plugins@c742dd61706fbacc1b95f1a20b7b988cf096ce6c/pstack/skills/principle-attack-the-premise; Daybook artifacts/2026-10/pstack-vs-mistystack.md (Scholar); Phaedrus t2228u; misty-step/mistystack#533; misty-step/foundations@d96c99ce1152ab1d6ae4a0eed0b22cbac93897b7/way-of-working.md#fail-loudly"
  sunset: "2026-11-27"
---

# Fix root causes

The symptom is where a wrong state became visible; the root cause is the first place the system did what it should not, or failed to handle a state it should.

Ask why until the answer is the evidenced causal fault (code, configuration, deployment or environment), not a consequence of an earlier one.

If the triggering state is legitimate, handle it where it broke. If it should never exist, a check there hides the bug; find what produced it. Guards, retries, swallowed errors, clamped values and discarded state are the usual hiding places.

After two fixes on one premise fail the same check, write the premise down and test it with an observation that would differ if it were false before the next fix; if it is false, look for what the failures share that it did not predict.

Failing only after a restart points to persisted state: config, caches, lock files. Fix every instance of the pattern, not one. A workaround that needs a paragraph of justification means the code is wrong.

Choose one direct path; when it fails, expose its cause to the owner. Keep authentication, signature and schema guards at their boundaries and fail visibly. A masking fallback that turns a defect into apparent success is not recovery.

A routing or decision system may need a reasonable default for an unknown case; surface that choice loudly for design iteration. An explicitly chosen, logged operating alternative is a new action: preserve the failed action's result instead of overwriting it.

Emit one terminal outcome per run with enough attribution to distinguish success, rejection and failure. Exercise the failing path, not merely the installed telemetry SDK.

Done when the causal fault is removed, the original path passes and the owner can trace an observed failure.

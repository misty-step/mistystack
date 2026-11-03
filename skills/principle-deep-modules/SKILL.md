---
name: principle-deep-modules
description: "Designing an interface or module: hide complexity behind a small domain-shaped surface."
disable-model-invocation: true
metadata:
  owner: phaedrus
  prevents: "Overengineering and special-case growth; inferred from 16 operator corrections, initiative #533."
  source: "Misty Step; provenance in ATTRIBUTION.md#skill-provenance."
  sunset: "2026-11-27"
---

# Deep modules

Measure depth by hidden complexity relative to interface cost. Expose only the operations the consumer needs; define errors out of existence where the contract permits.

Done when callers express their intent with fewer concepts and the consumer contract still passes.

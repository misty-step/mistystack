---
name: principle-compose-small-programs
description: "Designing a program, command, service or feature that adds a responsibility to an existing program: compose focused programs."
disable-model-invocation: true
metadata:
  owner: phaedrus
  prevents: "Foundation article 1 mixed auditable state with design behavior that did not trigger during design; MIS-840."
  source: "Misty Step; provenance in ATTRIBUTION.md#skill-provenance."
  sunset: "2026-11-27"
---

# Compose small programs

Give each program one job. Use plain text or JSON in and out, with stable fields and exit codes. Compose programs instead of growing one. Split a program when it or its `SPEC.md` outgrows one job. Design the [agent-usable interface](../foundation/checklist.md#article-12) first.

Use [deep modules](../principle-deep-modules/SKILL.md) for interface depth, [laziness protocol](../principle-laziness-protocol/SKILL.md) for the smallest change and [minimize reader load](../principle-minimize-reader-load/SKILL.md) for traceable composition.

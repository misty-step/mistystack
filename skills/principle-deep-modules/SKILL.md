---
name: principle-deep-modules
description: "Designing an interface or module: hide complexity behind a small domain-shaped surface."
disable-model-invocation: true
metadata:
  owner: phaedrus
  prevents: "Overengineering and special-case growth; inferred from 16 operator corrections, initiative #533."
  source: "misty-step/mistystack#533; John Ousterhout, A Philosophy of Software Design; Linus Torvalds, good taste"
  sunset: "2026-11-27"
---

# Deep modules

Organize a module around one body of domain knowledge. Expose the few operations the consumer needs and hide their mechanics.

Choose a data shape that removes special cases. Define errors out of existence where the contract permits it instead of making each caller coordinate recovery.

Measure depth by hidden complexity relative to interface cost. Keep general mechanisms behind the small interface rather than making callers coordinate them.

Done when callers express their intent with fewer concepts and the consumer contract still passes.

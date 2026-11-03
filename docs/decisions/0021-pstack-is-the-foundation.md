# 0021: pstack is the foundation

Status: accepted, 2026-11-02.

## Context

Phaedrus, 2026-11-02:

> Execute the full plan end to end. Before doing so, iterate on the plan itself: it
> should be grounded in the P-stack as its foundation, with targeted modifications
> and extensions aligned with the Misty Step philosophy and operating principles.

[pstack](https://github.com/cursor/plugins/tree/c742dd61706fbacc1b95f1a20b7b988cf096ce6c/pstack)
is MIT-licensed by Lauren Tan. The foundation starts at cursor/plugins commit
`c742dd61706fbacc1b95f1a20b7b988cf096ce6c`, pstack tree
`4719e1c4b4c43bac85d4206a8b41dd2899769c1c`.

Its own [“make it yours” extension model](https://github.com/cursor/plugins/blob/c742dd61706fbacc1b95f1a20b7b988cf096ce6c/pstack/README.md#make-it-yours)
keeps pstack as the base and adds a personal `<name>-mode` router alongside
`poteto-mode`. Rewriting portable primitives into Misty-specific copies obscures
that foundation and makes upstream changes harder to recognize.

## Decision

Vendor pstack's selected primitives verbatim. Misty's `misty` router chooses
among them, Misty extensions add only the missing method, and router or layer
overrides resolve differences. Do not patch vendored procedures. The only text
transform is upstream's one-line harness pointer after the first Markdown heading, linking files that use Cursor names to [the harness-name map](../../skills/misty/harnesses/pstack-names.md).
Generated Codex sidecars keep upstream's explicit-only skills explicit-only.

[The lock](../../vendor/pstack.lock.json) is the one home for the source pin,
include/destination list, every excluded skill, playbook and agent with its
reason, and the vendored file hashes. All selected playbook and workflow entries are now installed (`vendored: true`); no inclusions are pending.
[The sync command](../../scripts/sync-pstack.ts) verifies the source tree, copies
active inclusions and rewrites the lock. Its offline `--check` runs in the
canonical gate and rejects edits, missing files, unlisted files and inventory drift.

Relative links from vendored files to excluded or pending targets resolve to the
same pinned upstream source through lint, the site and the harness note; they do
not cause that target to be installed or allow a second text transform.

## Consequences

- Upstream sync has a visible cost: select a new commit, classify any new or
  removed names in the lock, run `bun scripts/sync-pstack.ts --update <commit>`
  (optionally `--from <checkout-or-pstack-directory>`), review changed bytes, and
  prove the affected native consumers. Do not repair drift by hand-editing a
  vendored file or its recorded hash.
- Misty-only requirements belong in the router, extensions or harness notes.
  The lock, not this decision or a second inventory, owns inclusion decisions.
  [Attribution](../../ATTRIBUTION.md) retains the upstream MIT notice.
- Revisit if upstream's licence or extension model changes, the portable base
  can no longer be used through reachable overrides, or measured sync cost
  exceeds the benefit of sharing the foundation. Any exception needs a new
  recorded decision rather than an accumulating patch set.

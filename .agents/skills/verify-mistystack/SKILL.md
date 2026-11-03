---
name: verify-mistystack
description: "When verifying a mistystack change, plugin installation, fresh-session loading or delivery-method behavior."
metadata:
  owner: phaedrus
  prevents: "Installer and file-byte checks reported as loaded method proof; method-plugin cutover #533."
  source: "Misty Step; provenance in ATTRIBUTION.md#skill-provenance."
  sunset: "2026-11-27"
---

# Verify mistystack

The consumer installs the shared method through a native harness, starts a fresh
session, observes its core and skill discovery, then uses its procedures. There
is no product account or QA sign-in. Provider authentication is execution access,
not evidence that the method loaded.

1. **Identify.** Record the candidate commit, working-tree changes, Bun and
   exercised harness versions, affected stories and exact commands. Checks read
   the working tree. Keep output outside the checkout and state whether that
   source matches the recorded commit.
2. **Select one proof command.** On the slice's Boat worker, run
   `./scripts/check plugin --strict` when installation/loading is affected,
   otherwise use `./scripts/check plugin --strict --lint-only`. Both run pinned
   pstack inventory, strict references and maintained skill, release-protection
   and secret-scanner tests. Do not run both selections and duplicate the suites.
   Require exit 0 and retain optional Landmark replay results separately from
   skips. `./scripts/check --help` identifies the maintained flags.
3. **Observe native installation and loading.** The full selection creates
   disposable homes and projects for each available OMP, Claude Code, Codex and
   pi CLI, refuses escaping native configuration paths, installs through the
   native lifecycle and checks skills/core registration. Missing CLIs are named
   skipped; an available-harness failure leaves that consumer unproved. The
   lint-only selection explicitly skips installation and does not prove loading.

   OMP additionally starts a fresh RPC session without inference. Its selector
   comes from the existing `smol` role read before isolation; `--model SELECTOR`
   supplies an override. Require the observed system prompt to contain the
   installed core and list Misty plus Foundation's current trigger, the
   installed skill body to match the candidate, and every explicit-only skill
   (including recompile and setup-mistystack) to remain readable but hidden from
   the automatic list.
   Other adapters' no-model inventory checks prove installation and registration,
   not that a model received the core. Follow the matching
   [harness note](../../../skills/misty/SKILL.md) for fresh-session proof: use an
   existing subscription only if it works without copying credential files;
   quote the core's first bullet and retain the actual loaded/read events.
   Otherwise record the no-model result and leave live proof explicitly
   unverified for the authorized runtime cutover. The helper removes only its
   own scratch trees; no proof writes to live harness profiles.
4. **Walk the changed contract.** For roles or setup, follow
   [setup-mistystack](../../../skills/setup-mistystack/SKILL.md) in an isolated
   destination; separate native assignment persistence, fresh-session discovery
   and authorized inference. For changed routing, skills or playbooks, start a
   fresh isolated session, read installed Misty and follow its relative link to
   the affected procedure. Retain actual read-tool events, installed paths and
   the changed instructions, then use that procedure on the authorized real task.
   Checkout bytes and a model's self-report do not prove installed loading or use.

   For delivery-method changes, use the current authorized slice to observe
   build, real-path verification, merge, the pre-deploy release gate, publication
   and fresh-session live use. Retain actual command/action results rather than
   a script that merely prints the intended order. Missing provider access,
   merge authority or release access leaves the corresponding claim unproved;
   structural tests do not establish it.
5. **Publish proof and merge.** Put the checked source and runtime identities,
   commands, exit statuses, observed postconditions and reader-accessible output
   on the PR. Follow [pstack's reply rules](../../../skills/poteto-mode/SKILL.md#writing-the-reply);
   list every skipped or unproved criterion. Once the affected real consumer
   path passes, merge without waiting for CI, independent review or a judge.
   Preserve output outside Git. The private workstation repository owns host,
   audio, credential and backup proof.
6. **Release and check live.** Follow [ship-loop](../../../skills/ship-loop/SKILL.md).
   Before deployment or publication, fast CI and one review limited to critical
   correctness and security gate the release candidate. Do not turn them into
   PR or exact-head merge gates, review rounds or a fix ledger. After publication,
   refresh through the destination harness's native lifecycle and open a fresh
   session. Observe the changed installed route and behavior again, preserving
   foreign configuration and credentials. Report missing live proof explicitly.

Completion means the affected real installed consumer path passed on the stated
candidate, with accessible evidence, and the live path passed after release.
An isolated installation is `artifact verified` until its affected fresh-session
behavior is observed. Lint-only results never substitute for installation or
fresh-session proof.

## Release-order property

The US-015 schedule check in `scripts/protected-release-check.test.ts` exhausts
the successful scheduling orders of the four jobs read from
`.github/workflows/landmark-release.yml`: prepare, verify, publish and deploy.
Publication must follow successful verification; deployment must follow both
verification and publication. The same contract checks that the deploy downloads
the site artifact uploaded by CI and does not rebuild it.

The check is part of the proof command above. Its built-in broken variant removes
publication's verification dependency and must produce `prepare → publish`.
Coverage maps to the release workflow and its reusable `ci.yml` / `site-deploy.yml`
at their last source change, `ac66123ce3961cd68b74a6686879334d26a294c4`.
When those files change, confirm that this four-job model still describes them
before advancing that coverage revision.

This is bounded workflow-graph proof, not a proof of GitHub, Landmark, Wrangler,
the review's substance, or live recovery. It assumes GitHub enforces `needs` and
models successful jobs; real release and journey receipts remain required.

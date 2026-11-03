# Postmortem: stale release candidates could pass the merge gate

- **Incident date:** 2026-09-25; reported again 2026-09-27
- **Status:** Prevention implemented; production recovery tracked in MIS-177
- **Operational owner:** Harness release automation / Misty Step
- **Historical issue:** MIS-177

## Summary

A generated protected-release changelog could pass required PR verification
without being validated against the commit set that would actually land.
Release PR #100 was prepared before a documentation commit reached master,
then merged with a stale candidate fingerprint. Landmark correctly refused
publication. Because preparation depends on publication succeeding, every
subsequent release run encountered the same invalid candidate before it could
prepare a replacement. PR #113 exposed the existing blockage; it did not cause it.

## Impact

Observed: `v0.1.49` remained unpublished while master advanced; `v0.1.48` was
the latest published version when investigated. The reported run's code
verification succeeded, its publish job failed, and preparation was skipped.
There is no evidence of an invalid tag or release being published. This incident
and its repair did not deploy harness configuration to the live workstation.

## Timeline

| Time (UTC) | Observation |
| --- | --- |
| 2026-09-25 22:38:42 | GitHub published `v0.1.48`. |
| 2026-09-25 23:45:58 | Release PR #100 candidate commit `cd5b306` was prepared against `36e23c3`. |
| Before #100 merged | Documentation PR #99 added `65df07c` through merge `dcbd746`. |
| 2026-09-25 23:46:42 | #100 landed as `1959b17`, retaining the earlier fingerprint. |
| 2026-09-27 23:44 | PR #113 landed as `4ec7ab4`; run `36359677369` again failed publication. |
| Investigation | Landmark v0.28.9 reproduced the identical rejection at both `1959b17` and `4ec7ab4`. |
| Repair | Required CI gained native candidate validation; ruleset 23779166 gained strict up-to-date checks. The stale, unpublished section was withdrawn for normal regeneration through a release PR. |

## Evidence and mechanism

- [Reported production run](https://github.com/misty-step/harness/actions/runs/36359677369):
  `verify / verify` succeeded; `Publish only a landed, verified changelog`
  failed with `protected release changelog differs from classified candidate commits`.
- [Release PR #100](https://github.com/misty-step/harness/pull/100) passed its
  required check, but that check only exercised code/configuration suites and
  semantic review. It did not execute Landmark's candidate validator.
- Landmark v0.28.9 fingerprints every non-merge commit's id and subject except
  `chore(release):` commits. Documentation commits do not appear in release notes
  but do belong to that fingerprint. The marker at `36e23c3` was
  `4665095ebfeff64528caf8d44ed3ede08de0454f287f3cf68a7d195b0894e42b`.
  The actual candidate at `1959b17`, with the intervening documentation commit,
  hashes to `d9669102ef953a159374457f9a9f7a2c8f5977a019263c7f5255d6241caeb3e6`.
- [Master ruleset](https://github.com/misty-step/harness/rules/23779166) required
  `verify`, but `strict_required_status_checks_policy` was false. Thus even
  adding a validator alone would leave a check-to-merge race.
- Reproduction used the checksum-verified published Linux x86-64 Landmark
  v0.28.9 binary (SHA-256
  `7a22cba7d99aa6d05ef113a8ff95ca5ca6098c6bf4a8af213f85370fa30e65d2`),
  a disposable clone checked out at each incident revision, and:

  ```sh
  "$LANDMARK_BIN" prepare-protected-release \
    --repo-root "$REPRO" --repository misty-step/harness
  ```

  Both exited 1 with the production mismatch. This native command performs the
  same local candidate validation as publication, without publishing anything.

## Pokayoke

How can we pokayoke this so this kind of error never happens again?

The original repair placed native Landmark validation in required pre-merge CI.
That deployment placement is retired by
[ADR 0023](../decisions/0023-live-verification-and-release-gate.md). The durable
invariant remains: published notes must match the landed candidate and immutable
tags. Validation now runs at the pre-deploy release gate and publication, not as
a PR merge requirement.

Producer, validator and publisher retain the same pinned Landmark revision.
The read-only publication replay refuses writes; there is no second changelog
classifier or error suppression. `scripts/protected-release.test.ts` preserves
the real Landmark docs-only-race regression and regeneration proof.

The September checks passed their then-current configuration and 20 assertions;
those historical observations do not prove today's release workflow. The current
release needs its own candidate, fast-CI, critical-assessment, immutable-publication
and live-readback evidence. No tag is moved and no publication check is bypassed.
GitHub/API outages and release-bot authentication failures remain visible failures,
not reasons to rewrite notes or claim a release.

## Follow-up

MIS-177
owns the fix PR, actual master run, replacement release PR/tag, and final closure
evidence. It stays open until those online postconditions are observed. The
[verification procedure](../verification.md#protected-release-walk-us-015)
records the repeatable checks, recovery path, and read-only ruleset inspection.

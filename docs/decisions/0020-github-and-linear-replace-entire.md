# 0020: GitHub hosts code and pull requests; Linear tracks work

Status: accepted, 2026-11-02. Supersedes [0019](0019-entire-is-the-forge.md).

## Context

Phaedrus, 2026-11-02:

> we're migrating off entire and onto github for code and prs and linear for work items

[ADR 0019](0019-entire-is-the-forge.md) moved tickets, changes, review findings
and merges to Entire on 2026-10-30. The same evening, reinstalling Entire's
GitHub app deleted the `gh/misty-step` project and every trail in it. Entire
[confirmed on 2026-10-31](https://github.com/entireio/cli/issues/2989#issuecomment-6542769038)
that the old project was deleted on uninstall. Since then every misty-step
repository has answered `repo is not onboarded to Entire`. A method that
follows ADR 0019 can neither file a ticket nor merge a change.

Misty Step's work items moved to Linear (workspace Misty Step, team MIS) the
same day. Linear's GitHub integration is installed on the org and links pull
requests to Linear issues.

## Decision

GitHub hosts code and pull requests. Ship-loop keeps its review ledger in PR
comments again, using the helper that ran before the Entire cutover. Misty Step
tracks work items in Linear, and a pull request names its Linear issue so the
integration links it. Projects outside Misty Step keep their established
tracker. R90 work stays in Habitat.

The revert of [#636](https://github.com/misty-step/mistystack/pull/636) and
[#637](https://github.com/misty-step/mistystack/pull/637) restores the
pre-cutover method. The Entire forge procedure, its issue-migration scripts and
the repository's Entire capture hooks are deleted.

## Consequences

- The six v1 review rounds that ADR 0019's bounded path covered continue on the
  restored helper; no new round starts for them.
- The method names no Entire command. A historical record, changelog or
  postmortem that mentions Entire stays unchanged.
- Revisit if Linear or GitHub stops linking pull requests to work items, or a
  forge offers an owned, recoverable record that GitHub lacks.

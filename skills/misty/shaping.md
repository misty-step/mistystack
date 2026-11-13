# Shaping facts

The shaping skills are Matt Pocock's, vendored unchanged under [the Pocock lock](../../vendor/pocock.lock.json): [grilling](../grilling/SKILL.md), [grill-me](../grill-me/SKILL.md), [grill-with-docs](../grill-with-docs/SKILL.md), [to-spec](../to-spec/SKILL.md), [to-tickets](../to-tickets/SKILL.md), [domain-modeling](../domain-modeling/SKILL.md) and [to-questionnaire](../to-questionnaire/SKILL.md). Agents find the facts and the owner decides each question. Do not run `setup-matt-pocock-skills`; the facts below replace the per-repository files it would write.

- **Issue tracker:** the owning tracker from [Foundation article 2](../foundation/checklist.md#article-2): Linear (workspace Misty Step, team MIS) for Misty Step, Habitat for R90 work. Use the tracker's workflow states, not triage labels; a ticket ready for an agent is `Todo`.
- **Domain docs:** single context. Where the skills say `GLOSSARY.md` or `CONTEXT.md`, use the repository's `DOMAIN.md`. Where they say `docs/adr/`, use `docs/decisions/` and its `0000-template.md`.
- **Outputs:** `to-spec` publishes the feature spec to the tracker as product intent. `SPEC.md` changes in the pull request that ships the behavior, never ahead of it. `to-tickets` creates tracker issues with native blocking relations; each ticket is one [ship-loop](../ship-loop/SKILL.md) slice.
- **Recording a grilling session:** after the owner confirms shared understanding, write owner decisions and intent to the tracker, architecture or stack decisions to a decision record, and terms to `DOMAIN.md`.

Planning how to execute a settled outcome is ordinary work under [the loop](SKILL.md#the-loop); it does not decide product intent.

## Looking back

[retro](../retro/SKILL.md) is also Matt Pocock's, under the same lock. It reviews a session, by default the current one, for changes to the environment that would improve the next run. These facts replace its assumptions:

- **Reviewer and coding standards:** no per-PR reviewer runs under [ship-loop](../ship-loop/SKILL.md). A rule that a machine can check becomes a lint, type, test or script. A judgment call becomes a wording or trigger change in the owning skill or `AGENTS.md`, through [agent-design](../agent-design/SKILL.md).
- **Harness and spend:** also review model and role choices, effort levels, subagent fan-out, worker placement, wall time and spend observed in the session.
- **Standing instructions:** look for cautions and rules whose reason no longer holds, in `AGENTS.md`, skills, memory and notes. Delete them, or rewrite an absolute rule so that it states its scope and reason. Instructions pile up, and a model that follows them closely will hold back routine work.
- **Routing each accepted candidate:** repository checks and docs, harness configuration, models, credentials and extensions go to the repository that owns them. Each lands as a ship-loop slice.
- **Re-run proposals:** when a change claims better quality, cost or time, record it on the tracker as an experiment: the source session, starting commit, the single change and the check. Human answers may differ in the re-run; outside systems are recreated, not skipped. Running it depends on persistent traces ([MIS-889](https://linear.app/misty-step/issue/MIS-889)) and replay ([MIS-890](https://linear.app/misty-step/issue/MIS-890)).

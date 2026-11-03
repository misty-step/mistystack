# Role briefs

The `misty` skill owns the builder's briefing contract. Pstack's
[Opening a PR](../poteto-mode/playbooks/opening-a-pr.md) owns the builder's PR
handoff. For this verify step, generate each later role's brief from the
installed `<skill-dir>`:

```sh
bun <skill-dir>/scripts/ship-loop.ts prompt --pr <PR URL> --role <role>
```

For light, add `--rigor light`. The helper reads the PR head, body and plain
comments without writing a ledger. For standard and critical, it reads the
ledger and checks the phase. Judge briefs point at [judge.md](judge.md).
Use the native thread IDs and report links actually returned. A retry keeps the
same round.

## Rigor

Default to light. Use standard only for runtime code, security boundaries or
data. Raise those paths to critical when the concrete risk warrants it.
Record `Rigor: <tier>, <changed-path risk>, <diff size>` on the PR.
The [verify procedure](SKILL.md#1-choose-rigor) owns the machine-release exception.

| Tier | Changed path | Rigor role and review shape |
| --- | --- | --- |
| light | Default, including documents, briefs, config JSON, constants, cosmetics and verification tooling without a production runtime path | `rigor-light`: builder, one independent combined QA/review, then independent judge |
| standard | Runtime code, security boundaries or data beyond light scope | `rigor-standard`: builder, separate independent QA and review, then independent judge |
| critical | High-risk runtime, security or data changes, such as authentication, money, persisted-data integrity, migrations, deploy behavior or irreversible operations | `rigor-critical`: builder, separate independent QA and review, then independent judge; name the changed-path risk |

Dispatch through your harness's subagent mechanism, selecting the `rigor-<tier>` role.
The `setup-mistystack` skill assigns models and reasoning budgets through native
harness configuration. The brief determines the work:
builder, QA/review, judge, fix-builder, recheck or final-judge. A recheck uses the
original reporter's scope in a fresh thread. Judge independence is from both
implementation and QA/review, even when all use the same rigor role.

## Evidence

Every role posts its report or judgment on the PR with the checked SHA, native
thread ID and evidence links. Plain light-rigor comments also name the role and
link the preceding report or judgment. The conductor and judge check the comment
history for role independence and an earlier fix round before proceeding.
Standard and critical return the helper's payload to the conductor.

## After the builder

| Work | Helper role | Standard or critical event |
| --- | --- | --- |
| QA/review | `qa-review` for light, `qa` and `review` otherwise | `report` |
| Initial judgment | `judge` | `verdict` |
| Authorized fix | `fix-builder` | `head` with reason `fix` |
| Named-blocker verification | `recheck` | `recheck` |
| Final judgment | `final-judge` | `verdict` |

Light posts plain comments without `init` or `record`. Standard and critical use
`record --kind <event> --file <payload.json>`. The helper enforces eligibility,
independence and the single fix round for that ledger.

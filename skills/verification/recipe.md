# A repository's verification skill

Each product repository carries one skill at `.agents/skills/verify-<app>/SKILL.md` that tells any agent how to prove a change on the running product. Write it once, prove it, and keep it current. [Foundation article 4](../foundation/checklist.md#article-4) requires it and [article 12](../foundation/checklist.md#article-12) requires the launch command it depends on.

## Contents

- **Launch.** The one command that starts the product with test configuration and production-like seed data, and how to tell it is ready.
- **Doctor.** A fast check that the environment can run the recipe, which names what is missing instead of failing later.
- **Drive.** How to exercise the product on the surface its users touch: the browser, the CLI, the API. Include success, rejection and recovery.
- **Accounts.** The QA identity and role each journey needs, under the [QA sign-in contract](SKILL.md#qa-sign-in-contract). No credentials in the file.
- **Feature map.** Every user journey, how to reach it and what to observe when it works. An agent proving a change finds the affected journeys here.
- **Formal checks.** For each modelled property: the specification, the tool and version, the rerun command, assumptions and bounds, per [Formal properties](SKILL.md#formal-properties).
- **Evidence.** What to capture and where it goes, per [evidence.md](evidence.md).
- **Cleanup.** Remove only what the run created.

## Prove the recipe

Run it end to end from a clean worker. Then break the product on purpose in one covered journey and show the recipe rejects it. A recipe that has never failed has not been tested.

## Upkeep

Change the feature map in the same pull request that changes the journey. For an audit, walk every entry on the running product and mark it reached or unverified with the exact prerequisite that blocked it. An entry not reached is never a pass. Delete entries for journeys that no longer exist.

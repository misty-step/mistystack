# 4. Build

[Misty's loop](../../skills/misty/SKILL.md#the-loop) names the check before the design, then makes the smallest complete change. A change that does not fit the existing design gets its reshape landed first as a separate slice.

The agent does the work itself unless delegation has a reason: independent slices, bulk reading, a second opinion from a different model family, or supervision. [Misty's delegation rules](../../skills/misty/SKILL.md#delegation) say what a brief carries. [Setup](../../skills/setup-mistystack/SKILL.md) assigns native rigor roles, and each harness note says how a role maps to a model and an effort level.

Use [boat-workers](../../skills/boat-workers/SKILL.md) for one saved-toolchain-snapshot worker per slice. Reuse it, stop it when idle, resume it as needed and delete it after collecting the result. [Watchdog](../../skills/watchdog/SKILL.md) supervises open-ended agents by observed progress and recovery, not elapsed time.

Next: [Verify and ship](05-verify-and-ship.md).

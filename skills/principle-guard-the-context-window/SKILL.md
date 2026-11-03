---
name: principle-guard-the-context-window
description: "Apply when context is filling up: large outputs, long files, repeated reads, fan-out planning. Route bulk to subagents; keep summaries in the main thread, not raw payloads."
disable-model-invocation: true
---

# Guard the Context Window

**Why:** Context overflow degrades reasoning quality, creates compression artifacts, and halts progress.

**Pattern:**
- **Keep the active context small.** Separate independent slices, pass raw inputs by reference and retain concise recovery state. Use the installed [watchdog](../watchdog/SKILL.md) for open-ended supervision instead of turn or time caps.

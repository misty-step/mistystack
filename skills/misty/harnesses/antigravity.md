# Antigravity mechanics

Mistystack ships a native Antigravity plugin (`.antigravity-plugin/plugin.json`) that bundles the [skills](../../../skills/) directory and the [always-on core](../../../rules/core.md) (`trigger: always_on`), plus `.agents/skills.json` and `.agents/rules.json` for workspace discovery.

## Install and update

Install the plugin locally through the Antigravity CLI (`agy`), which feeds Antigravity CLI, App, IDE and Remote Control:

```sh
agy plugin install https://github.com/misty-step/mistystack
```

Re-run the same command to update an existing installation under `~/.gemini/config/plugins/mistystack`. To test or load a local checkout directly:

```sh
agy plugin install /path/to/mistystack
```

If an earlier setup copied `mistystack` skills manually into `~/.gemini/config/skills/`, remove those copies so they do not shadow the plugin.

Verify the installed state:

```sh
agy plugin list --json
```

`mistystack` appears with `"enabled": true`, `"rules": ["core.md"]`, and all bundled skills including `misty` and `spec`.

## Remote Agents (Antigravity Cloud) vs. Remote Control

- **Remote Control** (`agy remote-control start`, or App Remote Control) executes on your own workstation and already loads `~/.gemini/config/plugins/mistystack` across every repository without per-project setup.
- **Remote Agents (Antigravity Cloud)** run in isolated Google VMs that do not sync `~/.gemini/config/plugins/` yet, syncing account-global plugins only from the Antigravity Marketplace once published.

To run cloud sessions with **zero manual cloning or Resource setup** per repository:

1. Ensure the target repository has a root `AGENTS.md` containing the current `<!-- mistystack:core -->` block ([Any harness](any.md)). Remote Agents load `AGENTS.md` on Turn 0 and default to `always-proceed (turbo)`.
2. When `mistystack` skills are absent inside the remote container, the core instruction directs the agent itself to run:

```sh
git clone --depth 1 https://github.com/misty-step/mistystack.git /tmp/mistystack &&
  mkdir -p ~/.gemini/config/skills &&
  ln -sfn /tmp/mistystack/skills/* ~/.gemini/config/skills/
```

Linking all `skills/*` into `~/.gemini/config/skills/` exposes `spec` and the remaining bundled skills for the rest of the cloud session without further clones. Attaching `misty-step/mistystack` as a GitHub **Resource** on a Remote Project also works via `.agents/skills.json` and `.agents/rules.json`, but is optional once `AGENTS.md` carries the self-bootstrapping core.

## Dispatch and rigor

Antigravity dispatches subagents via `invoke_subagent` (including built-in `research` and `browser` roles, plus custom `define_subagent` roles) and multi-agent boards via `swarm`. Model choices (`inherit`, `flash_lite`, `flash`, `pro`) stay in native `invoke_subagent` and `swarm` parameters rather than shared skill text.

For live web apps and browser QA, delegate directly to the built-in `browser` subagent (`Model: "flash"`) rather than scraping endpoints from the shell.

## Fresh-session proof

1. Start a fresh Antigravity session in another repository and confirm the agent states its one-line goal and planned change before its first tool call (showing `rules/core.md` loaded) and can load the `spec` skill.
2. From a `mistystack` checkout with `agy` on `PATH`, run `./scripts/check plugin --strict` to verify isolated local installation in a disposable home directory.

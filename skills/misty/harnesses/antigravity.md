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

## Remote Agents (Antigravity Cloud)

Cloud Remote Agent sessions run in isolated sandboxes and do not sync your local `~/.gemini/config/plugins/` directory. To load `mistystack` automatically in cloud sessions:

1. Ensure the target repository has a root `AGENTS.md` with the core block ([Any harness](any.md)).
2. Open the project in Antigravity Cloud and attach `misty-step/mistystack` as a **Resource** (GitHub repository). Antigravity discovers the plugin's skills and rules through `.agents/skills.json` and `.agents/rules.json` when the session starts.

Inside an already-running cloud session that started before the resource was attached, clone and link into the user skills directory:

```sh
git clone --depth 1 https://github.com/misty-step/mistystack.git /tmp/mistystack &&
  mkdir -p ~/.gemini/config/skills &&
  ln -sfn /tmp/mistystack/skills/* ~/.gemini/config/skills/
```

## Dispatch and rigor

Antigravity dispatches subagents via `invoke_subagent` (including built-in `research` and `browser` roles, plus custom `define_subagent` roles) and multi-agent boards via `swarm`. Model choices (`inherit`, `flash_lite`, `flash`, `pro`) stay in native `invoke_subagent` and `swarm` parameters rather than shared skill text.

For live web apps and browser QA, delegate directly to the built-in `browser` subagent (`Model: "flash"`) rather than scraping endpoints from the shell.

## Fresh-session proof

1. Start a fresh Antigravity session in another repository and confirm the agent states its one-line goal and planned change before its first tool call (showing `rules/core.md` loaded) and can load the `spec` skill.
2. From a `mistystack` checkout with `agy` on `PATH`, run `./scripts/check plugin --strict` to verify isolated local installation in a disposable home directory.

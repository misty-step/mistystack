# 0027: OMP is not a supported harness

Status: accepted, 2026-11-13.
Supersedes the OMP adapter and the OMP marketplace home for companion pins kept by
[0026](0026-one-page-method.md), and what remains of
[0015](0015-omp-method-plugin.md), [0016](0016-harness-agnostic.md) and
[0017](0017-tern-omp-and-boat-workers.md) that names OMP as a consumer.

## Context

Phaedrus, 2026-11-13, ruled that the supported harnesses are Claude Code, Codex,
pi, Antigravity, Prime Agent and Cursor. OMP (oh-my-pi) is no longer one of them.

Until this change OMP had the most native weight in the tree: a plugin manifest
and marketplace in `.omp-plugin/`, root `agents/` for its fixed agent scan, an
`omp` key in `package.json` to stop its loader falling back to pi's extension,
a harness note, an OMP-only setup recipe, a lint rule confining OMP's `skill://`
and `xd://` URIs to the harness notes, and an inference-free RPC proof selected
by OMP's `modelRoles.smol`. Its marketplace file was also the one list of pinned
companion packs, read by the site's skill index. Each of these was a cost the
other harnesses paid in checks, prose and cross-references.

## Decision

Remove OMP support completely rather than deprecate it. The repository is ours to
shape, and a stale adapter would keep telling agents to use a harness we do not.

- Delete `.omp-plugin/`, root `agents/`, `skills/misty/harnesses/omp.md`, the OMP
  setup recipe and the `omp` package key.
- Move the companion-pack pins, unchanged, into
  [`.claude-plugin/marketplace.json`](../../.claude-plugin/marketplace.json). That
  file already uses Claude Code's marketplace schema and is now the one list of
  pins. The site's skill index reads it and shows
  `claude plugin install <name>@mistystack` as the install command. The
  `mistystack` entry carries no `version`, so Claude Code keeps commit-based
  updates.
- Drop the OMP install proof, its `--model` option, its manifest lint and the
  harness-URI isolation rule, which existed only for OMP.
- Native adapters remain for Claude Code, Codex and pi. Antigravity, Prime Agent
  and Cursor use the [universal install](../../skills/misty/harnesses/any.md).

## Consequences

- `./scripts/check plugin` installs through Claude Code, Codex and pi only; there is
  no OMP line in its output.
- Release stamping covers `.codex-plugin/plugin.json` and `package.json`.
- OMP users can still try the universal install, at their own risk. Nothing here
  is checked against OMP, and an OMP failure is not a mistystack defect.
- Dated records that mention OMP (decisions, postmortems, evals, the migration
  note and the changelog) stay as history. Links from them to removed files
  resolve through the site's archive map.
- Revisit only if the owner adds OMP back to the supported set.

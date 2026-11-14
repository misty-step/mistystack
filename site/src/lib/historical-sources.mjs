// Historical ADRs retain their original prose and links. These exact files were
// removed, not moved to a current procedure. Link their last retained revisions,
// visibly labelled as archives; never apply this mapping to current guidance.
// Each revision is a verified retained source from before that file's removal.
export const historicalSources = new Map([
  ['skills/boat-workers/SKILL.md', {
    commit: '359de301cd6ccfb4724e771937faef9a083f0ee8', fragments: [],
  }],
  ['skills/misty/harnesses/grok-bot.md', {
    commit: '60ee457367f7e5a5b2370b35452650c5ee900f41', fragments: [],
  }],
  ['skills/misty/entire.md', {
    commit: 'aed5ec9bc7b8ae9b15d7ae373a7890412f9c2509',
    fragments: ['merge-and-forge-exceptions'],
  }],
  ['docs/principles/007-braver-engineers-continuous-deployment.md', {
    commit: 'd61f40c849a4fed66347bf060c8e4333ce1bcc91',
    fragments: ['lean-ci-amendment-2026-10-02'],
  }],
  ['docs/principles/009-nothing-fails-silently.md', {
    commit: 'd61f40c849a4fed66347bf060c8e4333ce1bcc91', fragments: [],
  }],
  ['omp-config/README.md', {
    commit: 'd61f40c849a4fed66347bf060c8e4333ce1bcc91',
    fragments: ['authorized-application-management'],
  }],
  ...['agent-config/guidance/workstation.md', 'scripts/probe-agent-policy', '.agents/skills/verify-harness/features/fresh-session.md'].map((file) => [
    file, { commit: 'd61f40c849a4fed66347bf060c8e4333ce1bcc91', fragments: [] },
  ]),
  ['docs/desktop-memory-guard.md', {
    commit: 'afbaf33b3f940108ccaf06c74841c9fbfa812bd0',
    fragments: ['operator-cutover--restarts-every-engineer'],
  }],
  ...['story-deletion-replays-us-051', 'protected-release-walk-us-015'].map((fragment) => [
    `docs/verification.md#${fragment}`,
    { commit: 'afbaf33b3f940108ccaf06c74841c9fbfa812bd0', fragments: [fragment] },
  ]),
  ...['constitution.md', 'foundation-standard-v1.json', 'foundation-standard-v1.md'].map((file) => [
    `agent-config/skills/foundation/${file}`,
    { commit: 'afbaf33b3f940108ccaf06c74841c9fbfa812bd0', fragments: [] },
  ]),
  ...['scripts/sync-pstack.ts', 'skills/misty/harnesses/pstack-names.md', 'vendor/pstack.lock.json'].map((file) => [
    file, { commit: 'c750ff4d4ec2a61e3e4ecb0eaf1f73e0e088e356', fragments: [] },
  ]),
  ['USER_STORIES.md#us-067-find-a-skill-by-the-work', {
    commit: '47598b404a78a83539ace9ba5c89d28d765857d6',
    fragments: ['us-067-find-a-skill-by-the-work'],
  }],
  ...['DOMAIN.md', 'USER_STORIES.md'].map((file) => [
    file, { commit: '47598b404a78a83539ace9ba5c89d28d765857d6', fragments: [] },
  ]),
]);

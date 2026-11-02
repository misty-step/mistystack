import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  site: 'https://stack.mistystep.io',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'never' },
  vite: {
    // import.meta.url changes when build-time modules become prerender chunks.
    define: { 'process.env.STACK_REPO_ROOT': JSON.stringify(fileURLToPath(new URL('../', import.meta.url))) },
    // Keep even small processed scripts external under script-src 'self'.
    build: { assetsInlineLimit: 0 },
  },
  redirects: {
    '/guide/install-and-setup/': '/install/',
    '/install/hermes/': '/install/#hermes',
    '/library/skills/security-audit/references/AI-AND-LLM/': '/library/skills/security-audit/',
    '/library/skills/security-audit/references/ATTACK-CLASSES/': '/library/skills/security-audit/',
    '/library/skills/security-audit/references/CLIENT-SIDE/': '/library/skills/security-audit/',
    '/library/skills/security-audit/references/CLOUD-AND-DEPLOYMENT/': '/library/skills/security-audit/',
    '/library/skills/security-audit/references/DATA-ISOLATION-AND-LIFECYCLE/': '/library/skills/security-audit/',
    '/library/skills/security-audit/references/DESKTOP-MOBILE-AND-LOCAL-IPC/': '/library/skills/security-audit/',
    '/library/skills/security-audit/references/HUNTING/': '/library/skills/security-audit/',
    '/library/skills/security-audit/references/MEMORY-SAFETY-AND-BINARY/': '/library/skills/security-audit/',
    '/library/skills/security-audit/references/PROTOCOLS-RPC-AND-MESSAGING/': '/library/skills/security-audit/',
    '/library/skills/security-audit/references/RECONNAISSANCE/': '/library/skills/security-audit/',
    '/library/skills/security-audit/references/RESOURCE-EXHAUSTION-AND-AVAILABILITY/': '/library/skills/security-audit/',
    '/library/skills/security-audit/references/SUPPLY-CHAIN-AND-RELEASE/': '/library/skills/security-audit/',
    '/library/skills/security-audit/references/VALIDATION-AND-REPORTING/': '/library/skills/security-audit/',
    '/library/skills/security-audit/references/WEB-PROTOCOL-AND-AUTH/': '/library/skills/security-audit/',
    '/library/skills/security-audit/references/workflow/': '/library/skills/security-audit/',
    '/install/grok-bot/': '/install/',
    '/library/skills/verification/accounts/': '/library/skills/verification/#qa-sign-in-contract',
    '/library/principles/one-home-per-fact/': '/library/core/',
    '/library/principles/finish-the-work/': '/library/core/',
    '/library/principles/make-operations-idempotent/': '/library/misty/#principles',
    '/library/principles/prove-it-on-the-real-path/': '/library/skills/verification/',
    '/library/principles/nothing-fails-silently/': '/library/principles/fix-root-causes/',
    '/library/principles/skill-diet/': '/library/skills/agent-design/',
    '/library/playbooks/authoring-a-skill/': '/library/skills/agent-design/',
    '/library/playbooks/incident/': '/library/skills/release-watch/recovery/',
  },
});

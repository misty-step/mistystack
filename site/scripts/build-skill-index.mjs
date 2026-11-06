import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSkillIndex, writeAtomic } from '../src/lib/skill-index-build.mjs';

// Writes the preferred-set index that /api/find judges. Pinned catalog sources are
// cached per repository and commit, so a warm cache builds without the network.
const site = fileURLToPath(new URL('..', import.meta.url));
const output = path.join(site, '.generated', 'skill-index.json');

try {
  const index = await buildSkillIndex({
    cacheDir: path.join(site, 'node_modules', '.cache', 'skill-index'),
    token: process.env.GITHUB_TOKEN,
  });
  await writeAtomic(output, `${JSON.stringify(index, null, 2)}\n`);
  const packs = new Map();
  for (const skill of index.skills) packs.set(skill.pack, (packs.get(skill.pack) ?? 0) + 1);
  const capped = index.skills.filter((skill) => skill.coreTruncated).length;
  console.log(`${path.relative(site, output)}: ${index.skills.length} skills at ${index.revision} (${[...packs].map(([pack, count]) => `${pack} ${count}`).join(', ')}); ${capped} cores capped at ${index.coreTextLimitBytes} bytes`);
} catch (error) {
  console.error(`Skill index build failed: ${error.stack ?? error.message}`);
  process.exitCode = 1;
}

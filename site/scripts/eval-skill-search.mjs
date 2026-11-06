import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { createHash } from 'node:crypto';
import { rankSkills, QUESTION_VERSION, MAX_REQUEST_BYTES, CONCURRENCY } from '../src/lib/skill-search.mjs';

const { values } = parseArgs({ options: { split: { type: 'string', default: 'holdout' }, versions: { type: 'string', default: QUESTION_VERSION }, out: { type: 'string' }, id: { type: 'string' } } });
if (!values.out) throw new Error('Use --out with an evidence path outside the checkout.');
if (!['tune', 'holdout', 'all'].includes(values.split)) throw new Error('Use --split tune, holdout, or all.');
if (!process.env.OPENROUTER_API_KEY) throw new Error('Inject OPENROUTER_API_KEY with pass-env.');
const index = JSON.parse(await readFile(new URL('../.generated/skill-index.json', import.meta.url), 'utf8'));
const rawCases = await readFile(new URL('./skill-search-cases.json', import.meta.url), 'utf8');
const cases = JSON.parse(rawCases).filter(item => (values.split === 'all' || item.split === values.split) && (!values.id || item.id === values.id));
if (!cases.length) throw new Error('No cases selected.');
const names = new Set(index.skills.map(skill => skill.name));
for (const item of cases) for (const expected of item.expected) if (!names.has(expected)) throw new Error(`${item.id}: expected skill ${expected} is not indexed.`);
const versions = values.versions.split(',');
const evidence = { startedAt: new Date().toISOString(), revision: index.revision, datasetHash: createHash('sha256').update(rawCases).digest('hex'), skillCount: index.skills.length, split: values.split, maxRequestBytes: MAX_REQUEST_BYTES, concurrency: CONCURRENCY, rows: [] };
await mkdir(path.dirname(path.resolve(values.out)), { recursive: true });
for (const item of cases) {
  for (const version of versions) {
    const receipts = [];
    const start = performance.now();
    const result = await rankSkills({ query: item.query, skills: index.skills, apiKey: process.env.OPENROUTER_API_KEY, version, fetcher: async (url, options) => {
      const requestStart = performance.now();
      const response = await fetch(url, options);
      receipts.push({ status: response.status, latencyMs: performance.now() - requestStart, requestBytes: Buffer.byteLength(options.body), questions: Object.keys(JSON.parse(options.body).questions).length, body: await response.clone().json().catch(() => null) });
      return response;
    } });
    const latencyMs = performance.now() - start;
    const top = result.results.slice(0, 3).map(skill => ({ id: skill.id, name: skill.name, closeness: skill.closeness }));
    const row = { ...item, version, latencyMs, model: result.model, models: result.models, cost: result.cost, knownCost: result.knownCost, degraded: result.degraded, reason: result.reason, scored: result.scored, total: result.total, batches: result.batches, top, top1: item.expected.includes(top[0]?.name), top3: top.some(skill => item.expected.includes(skill.name)), receipts };
    evidence.rows.push(row);
    await writeFile(values.out, JSON.stringify(evidence, null, 2) + '\n');
    console.log(JSON.stringify({ id: item.id, version, top: top.map(skill => skill.name), top1: row.top1, top3: row.top3, latencyMs: Math.round(latencyMs), cost: row.cost, degraded: row.degraded, reason: row.reason }));
    if (evidence.rows.reduce((total, row) => total + (row.knownCost ?? 0), 0) > 12) throw new Error('Evaluation reached its $12 evidence-run spend ceiling. Partial receipts are saved.');
  }
}
const percentile = (numbers, p) => [...numbers].sort((a, b) => a - b)[Math.max(0, Math.ceil(numbers.length * p) - 1)];
evidence.summaries = versions.map(version => {
  const rows = evidence.rows.filter(row => row.version === version);
  const known = rows.filter(row => row.cost !== null);
  return { version, count: rows.length, complete: rows.filter(row => !row.degraded && row.scored === row.total).length, errors: rows.filter(row => row.degraded).length, top1: rows.filter(row => row.top1 && !row.degraded).length / rows.length, top3: rows.filter(row => row.top3 && !row.degraded).length / rows.length, p50Ms: percentile(rows.map(row => row.latencyMs), 0.5), p95Ms: percentile(rows.map(row => row.latencyMs), 0.95), minMs: Math.min(...rows.map(row => row.latencyMs)), maxMs: Math.max(...rows.map(row => row.latencyMs)), meanCost: known.length === rows.length ? known.reduce((total, row) => total + row.cost, 0) / rows.length : null, knownCost: rows.reduce((total, row) => total + (row.knownCost ?? 0), 0), models: [...new Set(rows.flatMap(row => row.models))] };
});
evidence.finishedAt = new Date().toISOString();
await writeFile(values.out, JSON.stringify(evidence, null, 2) + '\n');
console.log(JSON.stringify(evidence.summaries, null, 2));

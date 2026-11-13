import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { batchesFor, closenessFor, MAX_BATCHES, MAX_REQUEST_BYTES, rankSkills } from '../src/lib/skill-search.mjs';
import { handleFind } from '../src/lib/find-api.mjs';

const skill = (id) => ({ id: `test:${id}`, name: id, description: `Help with ${id}`, core: `The procedure for ${id}.`, source: { pack: 'test', pin: 'a'.repeat(40), repository: 'https://github.com/test/skills', path: `skills/${id}/SKILL.md` }, invoke: { skill: `/skill:${id}`, install: null }, url: `/library/skills/${id}/` });
const answer = (level) => ({ type: 'score', probabilities: Object.fromEntries(Array.from({ length: 5 }, (_, i) => [String(i), i === level ? 1 : 0])), score: level, confidence: 1 });
const request = (body, extra = {}) => new Request('https://stack.mistystep.io/api/find', { method: 'POST', headers: { 'Content-Type': 'application/json', ...extra }, body: typeof body === 'string' ? body : JSON.stringify(body) });
const env = { OPENROUTER_API_KEY: 'test-key', SKILL_SEARCH_LIMITER: { limit: async () => ({ success: true }) } };

test('all indexed skills are judged once within byte and Worker subrequest limits', async () => {
  const index = JSON.parse(await readFile(new URL('../.generated/skill-index.json', import.meta.url), 'utf8'));
  assert.equal(index.coreTextLimitBytes, 8000);
  assert(index.skills.length > 0);
  assert.equal(new Set(index.skills.map(skill => skill.id)).size, index.skills.length);
  const batches = batchesFor(index.skills, 'How do I plan a safe data migration?');
  assert(batches.length <= MAX_BATCHES);
  const questionIDs = batches.flatMap(batch => Object.keys(batch.questions));
  assert.equal(questionIDs.length, index.skills.length);
  assert.equal(new Set(questionIDs).size, index.skills.length);
  for (const batch of batches) assert(Buffer.byteLength(JSON.stringify(batch)) <= MAX_REQUEST_BYTES);
  for (const skill of index.skills) {
    assert(Buffer.byteLength(skill.core) <= index.coreTextLimitBytes);
    assert.match(skill.source.pin, /^[a-f0-9]{40}$/);
    assert(skill.description && skill.core && skill.invoke.skill);
  }
});

test('closeness is the probability-weighted level, not confidence', () => {
  assert.equal(closenessFor({ type: 'score', probabilities: { 0: 0.1, 1: 0, 2: 0.2, 3: 0.2, 4: 0.5 }, score: 3, confidence: 0.2 }), 0.75);
  assert.throws(() => closenessFor({ ...answer(4), probabilities: { 0: 0, 4: 1 } }), /invalid_provider_answer/);
  assert.throws(() => closenessFor({ ...answer(4), score: 1 }), /invalid_provider_answer/);
});

test('Jev responses rank skills and report served model and summed cost', async () => {
  const skills = [skill('less'), skill('more')];
  const ranked = await rankSkills({ query: 'more', skills, apiKey: 'private', fetcher: async (_url, options) => {
    const body = JSON.parse(options.body);
    assert.equal(body.model, '~typesafe/jev-latest');
    assert.equal(body.state.skills.s1.core, skills[1].core);
    assert.equal(options.redirect, 'manual');
    return Response.json({ model: 'typesafe/jev-1.14', answers: { s0: answer(1), s1: answer(4) }, usage: { cost: 0.001 } });
  } });
  assert.equal(ranked.degraded, false);
  assert.equal(ranked.model, 'typesafe/jev-1.14');
  assert.equal(ranked.cost, 0.001);
  assert.deepEqual(ranked.results.map(result => result.id), ['test:more', 'test:less']);
  assert.equal(ranked.results[0].closeness, 1);
  assert(!JSON.stringify(ranked).includes('private'));
});

test('missing keys, provider rejection, timeout and invalid answers do not fabricate scores', async () => {
  for (const fetcher of [async () => new Response('', { status: 429 }), async () => { throw new DOMException('late', 'TimeoutError'); }, async () => Response.json({ model: 'typesafe/jev-1.14', answers: { s0: { ...answer(4), probabilities: null } }, usage: { cost: 0.001 } })]) {
    const result = await rankSkills({ query: 'need', skills: [skill('one')], apiKey: 'key', fetcher });
    assert.equal(result.degraded, true);
    assert.equal(result.scored, 0);
    assert.deepEqual(result.results, []);
    assert.equal(result.cost, null);
    assert(result.reason);
  }
  const result = await rankSkills({ query: 'need', skills: [skill('one')], apiKey: '' });
  assert.equal(result.reason, 'missing_api_key');
});

test('partial provider failure retains only actual scored results and unknown cost', async () => {
  const skills = Array.from({ length: 8 }, (_, i) => ({ ...skill(`skill${i}`), core: 'x'.repeat(8000) }));
  let calls = 0;
  const result = await rankSkills({ query: 'need', skills, apiKey: 'key', fetcher: async (_url, options) => {
    calls++;
    if (calls === 1) return new Response('', { status: 500 });
    const body = JSON.parse(options.body);
    return Response.json({ model: 'typesafe/jev-1.14', answers: Object.fromEntries(Object.keys(body.questions).map(id => [id, answer(3)])), usage: { cost: 0.001 } });
  } });
  assert.equal(result.degraded, true);
  assert(result.scored > 0 && result.scored < skills.length);
  assert.equal(result.cost, null);
  assert.equal(result.reason, 'provider_http_500');
});

test('API rejects invalid, oversize and cross-origin input before paid work', async () => {
  const rejectRank = async () => { throw new Error('must not call provider'); };
  for (const [input, status, reason] of [[request({ query: '' }), 400, 'query_required'], [request('{'), 400, 'invalid_json'], [request({ query: 'x'.repeat(1001) }), 400, 'query_too_long'], [request({ query: 'x'.repeat(9000) }), 413, 'request_too_large'], [request({ query: 'need' }, { Origin: 'https://elsewhere.test' }), 403, 'cross_origin_request']]) {
    const response = await handleFind(input, env, [skill('one')], rejectRank);
    assert.equal(response.status, status);
    assert.equal((await response.json()).reason, reason);
  }
});

test('API enforces per-client admission and fails closed if limiter or key is absent', async () => {
  const rejectRank = async () => { throw new Error('must not call provider'); };
  const limited = await handleFind(request({ query: 'need' }), { ...env, SKILL_SEARCH_LIMITER: { limit: async () => ({ success: false }) } }, [skill('one')], rejectRank);
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get('Retry-After'), '60');
  for (const settings of [{ ...env, SKILL_SEARCH_LIMITER: null }, { ...env, OPENROUTER_API_KEY: '' }]) {
    const response = await handleFind(request({ query: 'need' }), settings, [skill('one')], rejectRank);
    assert.equal(response.status, 503);
    assert.equal((await response.json()).degraded, true);
  }
});

test('parallel scoring never exceeds six pending provider requests and preserves every answer', async () => {
  const skills = Array.from({ length: 32 }, (_, i) => ({ ...skill(`skill${i}`), core: 'x'.repeat(8000) }));
  let active = 0;
  let peak = 0;
  const result = await rankSkills({ query: 'need', skills, apiKey: 'key', fetcher: async (_url, options) => {
    active++;
    peak = Math.max(peak, active);
    const body = JSON.parse(options.body);
    await new Promise(resolve => setTimeout(resolve, 1));
    active--;
    return Response.json({ model: 'typesafe/jev-1.14', answers: Object.fromEntries(Object.keys(body.questions).map(id => [id, answer(3)])), usage: { cost: 0 } });
  } });
  assert.equal(peak, 6);
  assert.equal(active, 0);
  assert.equal(result.scored, skills.length);
  assert.equal(new Set(result.results.map(result => result.id)).size, skills.length);
  assert.equal(result.degraded, false);
});

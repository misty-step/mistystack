import { MAX_QUERY_LENGTH, MODEL, QUESTION_VERSION, rankSkills } from './skill-search.mjs';

const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };

function reply(payload, status = 200, extra = {}) {
  return new Response(JSON.stringify(payload), { status, headers: { ...headers, ...extra } });
}

async function readQuery(request) {
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) throw new Error('expected_json');
  const reader = request.body?.getReader();
  if (!reader) throw new Error('invalid_json');
  const chunks = [];
  let length = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 8192) {
        await reader.cancel();
        throw new Error('request_too_large');
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  let body;
  try { body = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); }
  catch { throw new Error('invalid_json'); }
  if (typeof body?.query !== 'string' || !body.query.trim()) throw new Error('query_required');
  const query = body.query.trim();
  if (query.length > MAX_QUERY_LENGTH) throw new Error('query_too_long');
  return query;
}

export async function handleFind(request, env, skills, rank = rankSkills) {
  const failed = (reason, status, extra) => reply({ query: null, results: [], model: null, requestedModel: MODEL, questionVersion: QUESTION_VERSION, cost: null, degraded: true, reason, scored: 0, total: skills.length }, status, extra);
  if (request.method !== 'POST') return failed('method_not_allowed', 405, { Allow: 'POST' });
  if (request.headers.has('origin') && request.headers.get('origin') !== new URL(request.url).origin) return failed('cross_origin_request', 403);
  let query;
  try { query = await readQuery(request); }
  catch (error) { return failed(error.message, error.message === 'request_too_large' ? 413 : 400); }
  if (!env.OPENROUTER_API_KEY?.trim()) return failed('missing_api_key', 503);
  if (!env.SKILL_SEARCH_LIMITER) return failed('rate_limiter_unavailable', 503);
  try {
    const client = request.headers.get('CF-Connecting-IP') ?? 'local-development';
    const { success } = await env.SKILL_SEARCH_LIMITER.limit({ key: `mistystack:find:${client}` });
    if (!success) return failed('rate_limited', 429, { 'Retry-After': '60' });
  } catch { return failed('rate_limiter_unavailable', 503); }
  const result = await rank({ query, skills, apiKey: env.OPENROUTER_API_KEY });
  return reply(result, result.scored ? 200 : 503);
}

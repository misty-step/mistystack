// The skill finder sends one task to /api/find and shows the ranked reply.
// Every submission ends in exactly one shown state. A newer submission aborts
// the older request, so a late reply can never overwrite the page.
import { setInvalid } from '@misty-step/brand/spine';

const form = document.querySelector('[data-find-form]');
const field = form.elements.namedItem('q');
const status = document.querySelector('[data-find-status]');
const elapsed = document.querySelector('[data-find-elapsed]');
const note = document.querySelector('[data-find-note]');
const run = document.querySelector('[data-find-run]');
const list = document.querySelector('[data-find-results]');
const more = document.querySelector('[data-find-more]');
const announcer = document.querySelector('[data-find-announce]');
const templates = new Map([...document.querySelectorAll('template[data-find-template]')].map((node) => [node.dataset.findTemplate, node.content.firstElementChild]));

const MAX_QUERY_LENGTH = Number(field.dataset.maxLength);
// The Worker answers or degrades well inside this; past it the page reports an outage instead of waiting on.
const DEADLINE_SECONDS = 100;
const PAGE_SIZE = 10;

// Reason codes that change how a reader should take the ranking, in plain words.
// Every code, explained or not, also stays visible verbatim on the run line.
const causes = new Map([
  ['missing_api_key', 'The skill finder is not configured.'],
  ['provider_http_401', 'Jev refused the skill finder’s key.'],
  ['provider_http_429', 'Jev is rate limiting the skill finder.'],
  ['provider_timeout', 'Jev did not answer in time.'],
  ['provider_unavailable', 'Jev is unavailable.'],
  ['invalid_provider_answer', 'Jev returned answers the skill finder could not read.'],
  ['invalid_provider_response', 'Jev returned a reply the skill finder could not read.'],
  ['provider_cost_unavailable', 'Jev did not report the full cost.'],
  ['mixed_served_models', 'Jev served more than one model.'],
  ['rate_limited', 'Too many requests right now. Try again shortly.'],
  ['rate_limiter_unavailable', 'The skill finder’s rate limit is unavailable.'],
]);

const text = (value) => (typeof value === 'string' && value.trim() ? value.trim() : null);
const finite = (value) => (typeof value === 'number' && Number.isFinite(value) ? value : null);
const record = (value) => (value && typeof value === 'object' && !Array.isArray(value) ? value : null);
const count = (value) => value.toLocaleString('en-US');
const skills = (value) => `${count(value)} ${value === 1 ? 'skill' : 'skills'}`;
const usd = (value) => new Intl.NumberFormat('en-US', value > 0 && value < 0.01
  ? { style: 'currency', currency: 'USD', maximumSignificantDigits: 2 }
  : { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
const clone = (name) => document.importNode(templates.get(name), true);
const slot = (root, name) => root.querySelector(`[data-slot="${name}"]`);

let pending = null;
let ranked = [];
let shown = 0;
let clock = 0;
const resets = new WeakMap();

function parse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function safeHref(value) {
  const raw = text(value);
  if (!raw) return null;
  try {
    const url = new URL(raw, location.href);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
  } catch {
    return null;
  }
}

function library() {
  const link = document.createElement('a');
  link.className = 'sp-link';
  link.href = '/library/';
  link.textContent = 'Browse the library';
  return link;
}

function say(tone, ...parts) {
  if (tone) status.dataset.tone = tone;
  else delete status.dataset.tone;
  status.replaceChildren(...(tone ? [clone(tone), ' '] : []), ...parts);
}

function reset() {
  clearInterval(clock);
  elapsed.textContent = '';
  ranked = [];
  shown = 0;
  more.hidden = true;
  note.hidden = true;
  run.hidden = true;
  list.removeAttribute('aria-busy');
  list.replaceChildren();
  announcer.textContent = '';
  setInvalid(field, null);
}

function flag(message) {
  setInvalid(field, message);
  say(null);
  announcer.textContent = message;
}

function reject(message) {
  pending?.controller.abort();
  pending = null;
  reset();
  flag(message);
}

function begin() {
  reset();
  list.setAttribute('aria-busy', 'true');
  list.append(clone('placeholder'), clone('placeholder'), clone('placeholder'));
  say(null, 'Ranking skills…');
  const started = Date.now();
  clock = setInterval(() => { elapsed.textContent = `${Math.round((Date.now() - started) / 1000)} s`; }, 1000);
}

function read(response, body) {
  const envelope = record(body);
  const results = Array.isArray(envelope?.results) ? envelope.results.filter(record) : null;
  const model = text(envelope?.model);
  const models = model ? [model] : Array.isArray(envelope?.models) ? [...new Set(envelope.models.map(text).filter(Boolean))] : [];
  return {
    status: response.status,
    ok: response.ok,
    readable: results !== null,
    results: results ?? [],
    degraded: envelope?.degraded === true,
    reasons: [...new Set((text(envelope?.reason) ?? '').split(',').map((code) => code.trim()).filter(Boolean))],
    scored: finite(envelope?.scored),
    total: finite(envelope?.total),
    models,
    cost: finite(envelope?.cost),
    knownCost: finite(envelope?.knownCost),
  };
}

async function ask(query, signal) {
  const response = await fetch('/api/find', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query }),
    signal,
  });
  return read(response, parse(await response.text()));
}

async function find(query) {
  if (pending?.query === query) return;
  pending?.controller.abort();
  const request = { query, controller: new AbortController(), timedOut: false };
  pending = request;
  const deadline = setTimeout(() => {
    request.timedOut = true;
    request.controller.abort();
  }, DEADLINE_SECONDS * 1000);
  begin();
  const reply = await ask(query, request.controller.signal).catch(() => null);
  clearTimeout(deadline);
  if (pending !== request) return;
  pending = null;
  settle(reply, request.timedOut);
}

function describe(reply) {
  const parts = [];
  if (reply.models.length) parts.push(reply.models.join(', '));
  if (reply.cost !== null) parts.push(usd(reply.cost));
  else if (reply.knownCost > 0) parts.push(`at least ${usd(reply.knownCost)}`);
  if (!reply.readable) parts.push(`HTTP ${reply.status}`);
  for (const reason of reply.reasons) {
    const code = document.createElement('code');
    code.textContent = reason;
    parts.push(code);
  }
  run.replaceChildren(...parts.flatMap((part, index) => (index ? [' · ', part] : [part])));
  run.hidden = parts.length === 0;
}

function settle(reply, timedOut) {
  reset();
  if (!reply) {
    say('err', timedOut ? `The skill finder did not answer within ${DEADLINE_SECONDS} seconds. ` : 'The skill finder could not be reached. ', library(), '.');
    return;
  }
  describe(reply);
  const why = reply.reasons.filter((code) => causes.has(code)).map((code) => causes.get(code)).join(' ');
  if (reply.status === 400) flag(why ? `The skill finder could not accept this task. ${why}` : 'The skill finder could not accept this task.');
  else if (reply.results.length) show(reply, why);
  else if (reply.status === 429) say('warn', why || causes.get('rate_limited'));
  else if (reply.ok && reply.readable && !reply.degraded) say(null, 'No skills were ranked. ', library(), '.');
  else say('err', reply.readable ? 'The skill finder is unavailable. ' : 'The skill finder sent an unreadable reply. ', why ? `${why} ` : '', library(), '.');
}

// Only scored < total makes a partial ranking. Degraded model or cost metadata alone does not mean skills are missing.
function show(reply, why) {
  ranked = reply.results;
  page();
  note.hidden = false;
  const scored = reply.scored ?? ranked.length;
  const partial = reply.total !== null && scored < reply.total;
  const tally = partial ? `${count(scored)} of ${skills(reply.total)} ranked.` : `${reply.total !== null ? `All ${skills(reply.total)}` : skills(scored)} ranked.`;
  say(partial || why || !reply.ok ? 'warn' : null, why ? `${tally} ${why}` : tally);
}

function page() {
  const batch = ranked.slice(shown, shown + PAGE_SIZE);
  list.append(...batch.map(entry));
  shown += batch.length;
  more.hidden = shown >= ranked.length;
}

function entry(result) {
  const item = clone('result');
  const name = text(result.name) ?? text(result.id) ?? '';
  const href = safeHref(result.url);
  const title = slot(item, 'name');
  if (href) {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = name;
    title.append(link);
  } else {
    title.textContent = name;
  }

  const closeness = finite(result.closeness);
  slot(item, 'percent').textContent = closeness === null ? 'Not scored' : `${Math.round(closeness * 100)}%`;
  if (closeness === null) slot(item, 'bar').remove();
  else slot(item, 'fill').setAttribute('width', String(Math.min(Math.max(closeness, 0), 1) * 100));

  const description = text(result.description);
  if (description) slot(item, 'description').textContent = description;
  else slot(item, 'description').remove();

  const source = record(result.source) ?? {};
  const pack = text(source.pack);
  const pin = text(source.pin);
  if (pack) slot(item, 'pack').textContent = pack;
  else slot(item, 'pack').remove();
  if (pin) {
    const short = slot(item, 'pin');
    short.textContent = /^[\da-f]{40}$/i.test(pin) ? pin.slice(0, 7) : pin;
    short.title = pin;
  } else {
    slot(item, 'pin').remove();
  }
  if (!pack && !pin) slot(item, 'source').remove();

  const invoke = record(result.invoke) ?? {};
  const commands = [text(invoke.install), text(invoke.skill)].filter(Boolean);
  if (commands.length) slot(item, 'commands').append(...commands.map(command));
  else slot(item, 'commands').remove();
  return item;
}

function command(value) {
  const row = clone('command');
  slot(row, 'text').textContent = value;
  slot(row, 'what').textContent = ` ${value}`;
  return row;
}

list.addEventListener('click', async (event) => {
  const button = event.target instanceof Element ? event.target.closest('[data-find-copy]') : null;
  if (!button) return;
  const value = slot(button.parentElement, 'text').textContent;
  const label = slot(button, 'label');
  let copied = true;
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    copied = false;
  }
  label.textContent = copied ? 'Copied' : 'Copy failed';
  announcer.textContent = copied ? `Copied ${value}` : 'Copy failed. Select the command text instead.';
  clearTimeout(resets.get(button));
  resets.set(button, setTimeout(() => { label.textContent = 'Copy'; }, 2000));
});

more.addEventListener('click', () => {
  const first = shown;
  page();
  list.children[first]?.querySelector('a, button')?.focus();
});

field.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' || event.shiftKey || event.isComposing) return;
  event.preventDefault();
  form.requestSubmit();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const query = field.value.trim();
  if (!query) {
    reject('Describe the task first.');
  } else if (query.length > MAX_QUERY_LENGTH) {
    reject(`Shorten the task to ${count(MAX_QUERY_LENGTH)} characters or fewer. It has ${count(query.length)}.`);
  } else {
    history.replaceState(null, '', `${location.pathname}?${new URLSearchParams({ q: query })}`);
    find(query);
  }
});

const initial = new URLSearchParams(location.search).get('q');
if (initial?.trim()) {
  field.value = initial;
  form.requestSubmit();
}

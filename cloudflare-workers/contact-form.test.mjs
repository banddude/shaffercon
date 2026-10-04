import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const source = await readFile(new URL('./contact-form.js', import.meta.url), 'utf8');
const { default: worker } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const good = { firstName: 'Test', lastName: 'Customer', email: 'customer@example.com', message: 'Please quote a panel upgrade.' };
function request(body = good, overrides = {}) {
  return new Request('https://worker.example.test/', {
    method: 'POST', headers: { Origin: 'https://shaffercon.com', 'Content-Type': 'application/json' },
    body: JSON.stringify(body), ...overrides,
  });
}
function sink(fn = async () => ({ messageId: 'synthetic-message-id' })) {
  const sent = [];
  return { sent, env: { EMAIL: { send: async message => { sent.push(message); return fn(message); } } } };
}
test('valid inquiry sends privately to the one approved recipient', async () => {
  const s = sink(); const r = await worker.fetch(request(), s.env);
  assert.equal(r.status, 200); assert.equal((await r.json()).accepted, true);
  assert.equal(s.sent.length, 1); assert.equal(s.sent[0].to, 'hello@shaffercon.com');
  assert.equal(s.sent[0].from.email, 'contactform@shaffercon.com');
  assert.equal(s.sent[0].replyTo, good.email); assert.match(s.sent[0].text, /panel upgrade/);
});
test('submitted routing fields cannot expand recipients or sender', async () => {
  const s = sink(); await worker.fetch(request({ ...good, to: 'outsider@example.net', cc: ['outsider@example.net'], from: 'fake@example.net' }), s.env);
  assert.equal(s.sent[0].to, 'hello@shaffercon.com'); assert.equal(s.sent[0].cc, undefined);
  assert.equal(s.sent[0].from.email, 'contactform@shaffercon.com');
});
test('keeps deployed load-study and attribution fields in the email', async () => {
  const s = sink(); await worker.fetch(request({ ...good, loadStudyIntake: { studyReason: 'New load study' }, attribution: { pagePath: '/electrical-load-studies/' } }), s.env);
  assert.match(s.sent[0].text, /studyReason: New load study/); assert.match(s.sent[0].text, /electrical_load_studies/);
});
test('does not silently discard a legitimate cost-estimation inquiry', async () => {
  const s = sink(); const r = await worker.fetch(request({ ...good, message: 'I need cost estimation for my project.' }), s.env);
  assert.equal(r.status, 200); assert.equal(s.sent.length, 1);
});
test('provider rejection cannot appear as success or expose error details', async () => {
  const s = sink(async () => { throw new Error('secret-provider-debug customer@example.com'); });
  const r = await worker.fetch(request(), s.env); assert.equal(r.status, 502);
  const body = await r.text(); assert.doesNotMatch(body, /secret-provider-debug|customer@example.com/);
});
test('provider must return a message receipt before success', async () => {
  const s = sink(async () => ({})); assert.equal((await worker.fetch(request(), s.env)).status, 502);
});
test('missing email binding fails closed without any GitHub fallback', async () => {
  const r = await worker.fetch(request(), {}); assert.equal(r.status, 503);
  assert.doesNotMatch(source, /api\.github\.com|GITHUB_TOKEN|repository_dispatch/);
});
test('untrusted origins cannot submit and are not granted CORS', async () => {
  const s = sink(); const r = await worker.fetch(request(good, { headers: { Origin: 'https://other.example', 'Content-Type': 'application/json' } }), s.env);
  assert.equal(r.status, 403); assert.equal(r.headers.get('Access-Control-Allow-Origin'), null); assert.equal(s.sent.length, 0);
});
test('allowed preflight is empty, not a false send', async () => {
  const s = sink(); const r = await worker.fetch(new Request('https://worker.example.test/', { method: 'OPTIONS', headers: { Origin: 'https://www.shaffercon.com' } }), s.env);
  assert.equal(r.status, 204); assert.equal(await r.text(), ''); assert.equal(s.sent.length, 0);
});
test('invalid, header-injected and oversized fields are rejected', async () => {
  for (const body of [null, [], { ...good, firstName: {} }, { ...good, email: 'customer@example.com\r\nBcc: outsider@example.net' }, { ...good, message: 'a'.repeat(12001) }]) {
    const s = sink(); assert.equal((await worker.fetch(request(body), s.env)).status, 400); assert.equal(s.sent.length, 0);
  }
});
test('body byte limit is enforced even without a Content-Length header', async () => {
  const s = sink(); const r = await worker.fetch(request({ ...good, extra: '🙂'.repeat(9000) }), s.env);
  assert.equal(r.status, 413); assert.equal(s.sent.length, 0);
});
test('best-effort local throttling bounds repeated submissions', async () => {
  const s = sink(); const headers = { Origin: 'https://shaffercon.com', 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.0.2.123' };
  for (let i = 0; i < 5; i++) assert.equal((await worker.fetch(request(good, { headers }), s.env)).status, 200);
  assert.equal((await worker.fetch(request(good, { headers }), s.env)).status, 429); assert.equal(s.sent.length, 5);
});

// Real component behavior in jsdom; the delivery and analytics edges are mocked.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<div id="root"></div>', { url: 'https://shaffercon.com/contact-us/' });
for (const key of ['window', 'document', 'HTMLElement', 'HTMLInputElement', 'HTMLTextAreaElement', 'Event', 'MouseEvent']) global[key] = dom.window[key];
global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require('react');
const { createRoot } = require('react-dom/client');
let analyticsThrows = false;
const filename = path.join(__dirname, '../app/components/ContactForm.tsx');
const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
}).outputText;
const component = new Module(filename, module);
component.filename = filename;
component.paths = Module._nodeModulePaths(path.dirname(filename));
const originalRequire = component.require.bind(component);
component.require = name => {
  if (name === '@/app/styles/theme') return { classNames: new Proxy({}, { get: () => 'test-style' }) };
  if (name === '@/app/lib/analytics') return {
    serviceCategoryForPath: () => 'general',
    trackFormSubmit: () => { if (analyticsThrows) throw Error('analytics unavailable'); },
    trackGenerateLead: () => {}, trackQualifiedLead: () => {},
  };
  return originalRequire(name);
};
component._compile(compiled, filename);
const ContactForm = component.exports.default;
const root = createRoot(document.getElementById('root'));
let sends = 0;
let resolveFetch;
global.fetch = () => { sends++; return new Promise(resolve => { resolveFetch = resolve; }); };
const config = { contact: { email: 'hello@shaffercon.com' } };
async function fill(id, value) {
  const input = document.getElementById(id);
  assert.ok(input, id);
  const proto = input.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  await React.act(async () => {
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}
async function submit() {
  await React.act(async () => { document.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); });
}
async function respond(body, status = 200) {
  await React.act(async () => { resolveFetch(new Response(body, { status })); });
}
(async () => {
  const started = Date.now();
  await React.act(async () => { root.render(React.createElement(ContactForm, { siteConfig: config })); });
  await fill('firstName', 'Synthetic'); await fill('lastName', 'Customer'); await fill('email', 'customer@example.com'); await fill('message', 'Fixture inquiry');
  assert.ok(Date.now() - started < 3000, 'fixture must exercise the old fast-submit failure');
  await submit();
  assert.equal(sends, 1, 'autofill-speed submission must actually send');
  assert.equal(document.querySelector('button[type="submit"]').disabled, true);
  await submit(); assert.equal(sends, 1, 'pending submission must not duplicate');
  await respond('not json');
  assert.match(document.querySelector('[role="alert"]').textContent, /has not been sent/);
  assert.equal(document.getElementById('message').value, 'Fixture inquiry');
  assert.equal(document.querySelector('button[type="submit"]').disabled, false);
  assert.doesNotMatch(document.body.textContent, /Thank you for your submission/);
  await submit(); await respond(JSON.stringify({ success: true, accepted: false }));
  assert.match(document.querySelector('[role="alert"]').textContent, /has not been sent/);
  await submit(); await respond(JSON.stringify({ error: 'synthetic delivery failure' }), 502);
  assert.equal(document.getElementById('email').value, 'customer@example.com');
  assert.ok(document.querySelector('[role="alert"] a').href.startsWith('mailto:hello@shaffercon.com'));
  analyticsThrows = true;
  await submit(); await respond(JSON.stringify({ success: true, accepted: true }));
  assert.match(document.body.textContent, /Thank you for your submission/);
  assert.equal(document.querySelector('[role="alert"]'), null, 'analytics failure is not a delivery failure');
  assert.equal(document.getElementById('message').value, '');
  assert.equal(sends, 4);
  await React.act(async () => root.unmount());
  dom.window.close();
  console.log('Contact form behavior: fast submit, duplicate guard, malformed response, rejected receipt, provider failure, retained draft and analytics isolation passed.');
})().catch(error => { console.error(error); process.exitCode = 1; dom.window.close(); });

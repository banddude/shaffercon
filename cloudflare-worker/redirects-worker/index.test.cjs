const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const test = require('node:test');
const source = fs.readFileSync(__dirname + '/index.js', 'utf8');
function worker(status = 200) {
  let calls = 0;
  const context = vm.createContext({URL,Request,Response,addEventListener() {},fetch: async () => {calls++;return new Response(status === 204 ? null : 'origin content', {status,headers:{'X-Origin-Proof':'yes'}});}});
  vm.runInContext(source, context);
  return {run: request => context.handleRequest(request),calls: () => calls};
}
for (const slug of ['venetian-plaster-vs-limewash-los-angeles','venetian-plaster-cost-factors-los-angeles','venetian-plaster-bathrooms-fireplaces-design-guide','future-electrical-article','a-not-yet-created-finish-guide']) {
  test('current origin wins over stale catalog: ' + slug, async () => {
    const w=worker();const response=await w.run(new Request('https://shaffercon.com/industry-insights/'+slug+'/'));
    assert.equal(response.status,200);assert.equal(await response.text(),'origin content');assert.equal(w.calls(),1);
  });
}
test('genuine missing old article keeps legacy topic fallback', async () => {
  const w=worker(404);const response=await w.run(new Request('https://shaffercon.com/industry-insights/old-missing-electrical-guide/'));
  assert.equal(response.status,301);assert.equal(response.headers.get('location'),'https://shaffercon.com/commercial-service/');assert.equal(w.calls(),1);
});
test('origin error does not become a permanent SEO redirect', async () => {
  const w=worker(503);assert.equal((await w.run(new Request('https://shaffercon.com/industry-insights/future-guide/'))).status,503);
});
test('origin canonicalization is preserved', async () => {
  const w=worker(301);assert.equal((await w.run(new Request('https://shaffercon.com/industry-insights/future-guide'))).status,301);assert.equal(w.calls(),1);
});
test('HEAD checks origin too', async () => {
  const w=worker();assert.equal((await w.run(new Request('https://shaffercon.com/industry-insights/new-guide/',{method:'HEAD'}))).status,200);assert.equal(w.calls(),1);
});
test('www canonicalization preserves future path and query without an origin request', async () => {
  const w=worker();const response=await w.run(new Request('https://www.shaffercon.com/industry-insights/new-guide/?utm_source=test'));
  assert.equal(response.headers.get('location'),'https://shaffercon.com/industry-insights/new-guide/?utm_source=test');assert.equal(w.calls(),0);
});
test('existing published article and contact page pass through', async () => {
  const w=worker();for(const path of ['/industry-insights/afci-installation-electrical-safety/','/contact-us/']) assert.equal((await w.run(new Request('https://shaffercon.com'+path))).status,200);
  assert.equal(w.calls(),2);
});
test('known moved root blog keeps redirect without origin fetch', async () => {
  const w=worker();const response=await w.run(new Request('https://shaffercon.com/afci-installation-electrical-safety'));
  assert.equal(response.headers.get('location'),'https://shaffercon.com/industry-insights/afci-installation-electrical-safety/');assert.equal(w.calls(),0);
});

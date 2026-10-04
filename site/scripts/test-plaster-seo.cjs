// Read-only checks against the actual static export; no browser/network needed.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const site = path.resolve(__dirname, '..');
const content = path.join(site, '../content/industry-insights');
const guides = fs.readdirSync(content).filter(name => name.endsWith('.json')).map(name => JSON.parse(fs.readFileSync(path.join(content, name), 'utf8'))).filter(post => post.topic === 'plaster');
assert.ok(guides.length >= 3);
const servicePath = '/venetian-plaster-los-angeles/';
function page(url) { return new JSDOM(fs.readFileSync(path.join(site, 'out', url, 'index.html'), 'utf8'), {url: 'https://shaffercon.com' + url}).window.document; }
const service = page(servicePath);
assert.equal(service.querySelector('link[rel="canonical"]').href, 'https://shaffercon.com' + servicePath);
assert.ok(service.querySelectorAll('figure figcaption').length >= 13);
const faqs = [...service.querySelectorAll('script[type="application/ld+json"]')].map(node => JSON.parse(node.textContent)).find(schema => schema['@type'] === 'FAQPage');
assert.equal(faqs.mainEntity.length, 6);
for (const faq of faqs.mainEntity) {
  assert.ok(service.body.textContent.includes(faq.name));
  assert.ok(service.body.textContent.includes(faq.acceptedAnswer.text));
}
const sitemap = fs.readFileSync(path.join(site, 'out/sitemap.xml'), 'utf8');
let listings = page('/industry-insights/').documentElement.outerHTML;
const pagination = path.join(site, 'out/industry-insights/page');
if (fs.existsSync(pagination)) for (const number of fs.readdirSync(pagination)) {
  if (/^\d+$/.test(number)) listings += page('/industry-insights/page/' + number + '/').documentElement.outerHTML;
}
for (const guide of guides) {
  const url = '/industry-insights/' + guide.slug + '/';
  const doc = page(url);
  assert.ok(service.querySelector(`a[href="${url}"]`), 'service must link to each guide');
  assert.ok(listings.includes(`href="${url}"`), 'guide must be discoverable from a listing page');
  assert.ok(doc.querySelector(`a[href="${servicePath}"]`), 'guide must link to service');
  assert.equal(doc.querySelector('link[rel="canonical"]').href, guide.canonicalUrl);
  assert.ok(sitemap.includes(guide.canonicalUrl));
  assert.ok(fs.existsSync(path.join(site, 'public', guide.ogImage)));
  assert.ok(doc.querySelector('article img').alt === guide.ogImageAlt);
  const schemas = [...doc.querySelectorAll('script[type="application/ld+json"]')].flatMap(node => {const value=JSON.parse(node.textContent);return value['@graph'] || [value];});
  assert.equal(schemas.find(schema => schema['@type'] === 'Article').author['@type'], 'Organization');
  assert.ok(schemas.find(schema => schema['@type'] === 'Service').serviceType.toLowerCase().includes('plaster'));
  for (const link of doc.querySelectorAll('article a[href^="/"]')) {
    const href = link.getAttribute('href').split(/[?#]/)[0];
    assert.ok(fs.existsSync(path.join(site, 'out', href, 'index.html')), 'broken internal link: ' + href);
  }
}
console.log(`PASS: ${guides.length} plaster guides, source images, canonical URLs, authorship, service schema, sitemap, internal links and 6 visible/schema-matched FAQs.`);

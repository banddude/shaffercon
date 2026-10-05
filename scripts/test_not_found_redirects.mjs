// Behavior test for the client-side legacy-redirect fallback in
// site/app/not-found.tsx. Renders the actual template with fixture data and
// asserts the worker-equivalent targets, the loop guard and the trailing
// slash redirect. No network, no build required.
import { readFileSync } from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const tsx = readFileSync(join(root, "site/app/not-found.tsx"), "utf8");
const tpl = tsx.match(/const redirectScript = `([\s\S]*?)`;\n/)[1];

const grab = (name) => tsx.match(new RegExp(`const ${name} = [(\\[]([\\s\\S]*?)[)\\]];`))[1];
const locationSlugs = [...grab("locationSlugs").matchAll(/"([^"]+)"/g)].map((m) => m[1]);
const serviceSlugs = [...grab("serviceSlugs").matchAll(/"([^"]+)"/g)].map((m) => m[1]);
const aliasBlock = tsx.match(/const serviceAliasRedirects: Record<string, string> = \{([\s\S]*?)\};/)[1];
const directBlock = tsx.match(/const directRedirects: Record<string, string> = \{([\s\S]*?)\};/)[1];

const fixtures = {
  "JSON.stringify(blogSlugs)": JSON.stringify(["do-i-need-panel-upgrade-install-ev-charger", "stale-post-slug"]),
  "JSON.stringify(locationSlugs)": JSON.stringify(locationSlugs),
  "JSON.stringify(serviceSlugs)": JSON.stringify(serviceSlugs),
  "JSON.stringify(typedServiceSlugs)": JSON.stringify(serviceSlugs.flatMap((s) => [`commercial-${s}`, `residential-${s}`])),
  "JSON.stringify(serviceAliasRedirects)": `{${aliasBlock}}`,
  "JSON.stringify(directRedirects)": `{${directBlock}}`,
};
let script = tpl;
for (const [k, v] of Object.entries(fixtures)) script = script.replace(`\${${k}}`, v);
assert.equal(script.includes("${"), false, "unsubstituted template placeholder");
script = script.replace(/\\\\/g, "\\");

function run(pathname) {
  let target = null;
  let calls = 0;
  const ctx = vm.createContext({ window: { location: { pathname, replace: (to) => { calls++; target = to; } } } });
  vm.runInContext(script, ctx);
  return { target, calls };
}

const cases = [
  // [input path, expected target (null = stay on 404)]
  ["/industry-insights/best-breaker-brand-review", "/service-areas/hollywood/residential-electrical-panel-upgrades/"],
  ["/industry-insights/winter-maintenance-tips", "/commercial-service/"],
  ["/2024/06/15/do-i-need-panel-upgrade-install-ev-charger", "/industry-insights/do-i-need-panel-upgrade-install-ev-charger/"],
  ["/2023/01/02/some-random-old-post", "/industry-insights/"],
  ["/service-areas/not-a-location/ev-charger-installation", "/service-areas/hollywood/residential-ev-charger-installation/"],
  ["/service-areas/pasadena/glendale", "/service-areas/glendale/"],
  ["/service-areas/pasadena/service", "/service-areas/pasadena/"],
  ["/service-areas/pasadena/commercial-glendale", "/service-areas/glendale/"],
  ["/Contact", "/contact-us/"],
  ["/home/", "/"],
  ["/ev%20charger%20installation", "/residential-ev-charger/"],
  ["/EV-Charger-Installation", "/residential-ev-charger/"],
  ["/no-match-gibberish-xyz", null],
  // stale slug listed in blogSlugs but page missing: first render redirects,
  // second render (at the target path, again 404) must NOT loop
  ["/industry-insights/stale-post-slug", "/industry-insights/stale-post-slug/"],
  ["/industry-insights/stale-post-slug/", null],
];
let failed = 0;
for (const [input, want] of cases) {
  const { target, calls } = run(input);
  try {
    assert.equal(target, want, `${input}: got ${JSON.stringify(target)}`);
    if (want === null) assert.equal(calls, 0, `${input}: expected no redirect call`);
    console.log(`ok ${input} -> ${target}`);
  } catch (e) {
    failed++;
    console.error(`FAIL ${e.message}`);
  }
}
assert.equal(failed, 0, `${failed} case(s) failed`);
console.log(`not-found redirect behavior: ${cases.length}/${cases.length} cases pass`);

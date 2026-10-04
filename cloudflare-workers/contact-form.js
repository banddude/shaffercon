// Private contact delivery. Recipient is fixed in both code and the binding.
const DESTINATION = 'hello@shaffercon.com';
const SENDER = 'contactform@form.shaffercon.com';
const ORIGINS = new Set(['https://shaffercon.com', 'https://www.shaffercon.com']);
const MAX_BODY_BYTES = 32768;
const recent = new Map(); // Best-effort isolate-local abuse protection, never logged.
const validEmail = value => typeof value === 'string' && value.length <= 254 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value);
const __name = value => value;

function reply(origin, status, body) {
  return new Response(body === null ? null : JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'Vary': 'Origin',
      ...(ORIGINS.has(origin) ? { 'Access-Control-Allow-Origin': origin } : {}),
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

async function readBody(request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error('invalid_body');
  const chunks = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new Error('body_too_large');
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder().decode(bytes));
}

function field(value, max, required = false) {
  if (value == null && !required) return '';
  if (typeof value !== 'string' || value.length > max || (required && !value.trim())) {
    throw new Error('invalid_field');
  }
  return value.trim();
}

var contact_form_default = {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    if (!ORIGINS.has(origin)) return reply(origin, 403, { error: 'Request origin not allowed' });
    if (request.method === 'OPTIONS') return reply(origin, 204, null);
    if (request.method !== 'POST') return reply(origin, 405, { error: 'Method not allowed' });
    if (!(request.headers.get('Content-Type') || '').toLowerCase().startsWith('application/json')) {
      return reply(origin, 415, { error: 'Expected JSON' });
    }
    let input;
    try { input = await readBody(request); }
    catch (error) { return reply(origin, error.message === 'body_too_large' ? 413 : 400, { error: 'Invalid form submission' }); }
    let data;
    try {
      if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('invalid_body');
      data = {
        firstName: field(input.firstName, 128, true), lastName: field(input.lastName, 128, true),
        email: field(input.email, 254, true), phone: field(input.phone, 80),
        address: field(input.address, 1000), message: field(input.message, 12000),
        attribution: normalizeAttribution(input.attribution),
        loadStudyIntake: normalizeLoadStudyIntake(input.loadStudyIntake),
      };
      if (!validEmail(data.email)) throw new Error('invalid_email');
    } catch { return reply(origin, 400, { error: 'Please check your name, email and message' }); }
    if (!env.EMAIL || typeof env.EMAIL.send !== 'function') {
      return reply(origin, 503, { error: 'Email delivery is temporarily unavailable. Please email hello@shaffercon.com directly.' });
    }
    const ip = request.headers.get('CF-Connecting-IP');
    if (ip) {
      const now = Date.now();
      for (const [key, entry] of recent) if (entry.until <= now) recent.delete(key);
      const entry = recent.get(ip) || { count: 0, until: now + 600000 };
      if (entry.count >= 5) return reply(origin, 429, { error: 'Please wait before sending another inquiry, or email hello@shaffercon.com.' });
      if (recent.size < 2000 || recent.has(ip)) { entry.count++; recent.set(ip, entry); }
    }
    const category = inferJobCategory(data);
    const details = Object.entries(data.loadStudyIntake).filter(([, value]) => value)
      .map(([key, value]) => `${key}: ${value}`).join('\n');
    const attribution = Object.entries(data.attribution).filter(([, value]) => value)
      .map(([key, value]) => `${key}: ${value}`).join('\n');
    const text = [
      'New inquiry from the Shaffer Construction website',
      `Name: ${data.firstName} ${data.lastName}`, `Email: ${data.email}`,
      `Phone: ${data.phone || '(not supplied)'}`, `Address: ${data.address || '(not supplied)'}`,
      `Service: ${category}`, '', 'Message:', data.message || '(not supplied)',
      ...(details ? ['', 'Load-study details:', details] : []),
      ...(attribution ? ['', 'Website context:', attribution] : []),
    ].join('\n');
    try {
      const sent = await env.EMAIL.send({
        to: DESTINATION, from: { email: SENDER, name: 'Website Contact Form' }, replyTo: data.email,
        subject: `Website inquiry: ${category.replaceAll('_', ' ')}`, text,
      });
      if (!sent || typeof sent.messageId !== 'string' || !sent.messageId) throw new Error('not_accepted');
      return reply(origin, 200, { success: true, accepted: true, message: 'Your inquiry has been sent. We will be in touch.' });
    } catch {
      // No submitted text, addresses, provider error bodies or credentials in logs.
      return reply(origin, 502, { error: 'Your inquiry could not be sent. Please retry or email hello@shaffercon.com directly.' });
    }
  },
};

function textValue(value) {
  if (typeof value !== "string") return "";
  return value.slice(0, 2e3);
}
__name(textValue, "textValue");
function normalizeAttribution(value) {
  const source = value && typeof value === "object" ? value : {};
  return {
    pageUrl: textValue(source.pageUrl),
    pagePath: textValue(source.pagePath),
    pageTitle: textValue(source.pageTitle),
    referrer: textValue(source.referrer),
    landingPage: textValue(source.landingPage),
    utmSource: textValue(source.utmSource),
    utmMedium: textValue(source.utmMedium),
    utmCampaign: textValue(source.utmCampaign),
    utmTerm: textValue(source.utmTerm),
    utmContent: textValue(source.utmContent),
    gclid: textValue(source.gclid),
    gbraid: textValue(source.gbraid),
    wbraid: textValue(source.wbraid),
    msclkid: textValue(source.msclkid),
    fbclid: textValue(source.fbclid),
    serviceCategory: textValue(source.serviceCategory),
    landingServiceCategory: textValue(source.landingServiceCategory)
  };
}
__name(normalizeAttribution, "normalizeAttribution");
function normalizeLoadStudyIntake(value) {
  const source = value && typeof value === "object" ? value : {};
  return {
    propertyType: textValue(source.propertyType),
    studyReason: textValue(source.studyReason),
    newLoadType: textValue(source.newLoadType),
    chargerCount: textValue(source.chargerCount),
    utilityProvider: textValue(source.utilityProvider),
    permitDeadline: textValue(source.permitDeadline),
    stampedReport: textValue(source.stampedReport),
    plansAvailable: textValue(source.plansAvailable)
  };
}
__name(normalizeLoadStudyIntake, "normalizeLoadStudyIntake");
function normalizeText(value) {
  return textValue(value).toLowerCase();
}
__name(normalizeText, "normalizeText");
function compactPhone(value) {
  return textValue(value).replace(/\D/g, "");
}
__name(compactPhone, "compactPhone");
function addReason(assessment, points, reason) {
  assessment.score += points;
  assessment.reasons.push(reason);
}
__name(addReason, "addReason");
function hasAny(haystack, terms) {
  return terms.some((term) => haystack.includes(term));
}
__name(hasAny, "hasAny");
function inferJobCategory(data) {
  const attribution = data.attribution || {};
  const loadStudyIntake = data.loadStudyIntake || {};
  const haystack = [
    data.message,
    data.address,
    attribution.pagePath,
    attribution.pageTitle,
    attribution.landingPage,
    attribution.serviceCategory,
    attribution.landingServiceCategory,
    loadStudyIntake.propertyType,
    loadStudyIntake.studyReason,
    loadStudyIntake.newLoadType,
    loadStudyIntake.chargerCount,
    loadStudyIntake.utilityProvider,
    loadStudyIntake.permitDeadline,
    loadStudyIntake.stampedReport,
    loadStudyIntake.plansAvailable
  ].map(normalizeText).join(" ");
  if (hasAny(haystack, ["electrical-load-studies", "load study", "load studies", "load calculation", "capacity study"])) {
    return "electrical_load_studies";
  }
  if (hasAny(haystack, ["commercial ev", "fleet charging", "dc fast", "level 2", "multifamily ev"])) {
    return "commercial_ev_charging";
  }
  if (hasAny(haystack, ["residential ev", "home charger", "ev charger"])) {
    return "residential_ev_charging";
  }
  if (hasAny(haystack, ["panel upgrade", "service upgrade", "subpanel", "main panel"])) {
    return "panel_upgrades";
  }
  if (hasAny(haystack, ["led retrofit", "lighting retrofit", "lighting"])) {
    return "led_retrofit";
  }
  if (hasAny(haystack, ["commercial electrical", "tenant improvement", "facility", "facilities"])) {
    return "commercial_electrical";
  }
  return "general_electrical";
}
__name(inferJobCategory, "inferJobCategory");
export { contact_form_default as default };

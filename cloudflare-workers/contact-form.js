/**
 * Cloudflare Worker for Contact Form Submission
 * Securely handles form submissions and triggers GitHub workflow
 */

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      // Parse form data
      const formData = await request.json();
      const { firstName, lastName, email, phone, address, message } = formData;
      const attribution = normalizeAttribution(formData.attribution);
      const jobCategory = inferJobCategory({ firstName, lastName, email, phone, address, message, attribution });
      const spamAssessment = assessSubmission({ firstName, lastName, email, phone, address, message, attribution });

      // Validate required fields
      if (!firstName || !lastName || !email) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      if (spamAssessment.blocked) {
        console.warn('Blocked contact form submission:', JSON.stringify({
          email,
          jobCategory,
          spamAssessment,
          pagePath: attribution.pagePath,
          landingPage: attribution.landingPage,
        }));

        return new Response(
          JSON.stringify({ success: true, accepted: false, message: 'Form submitted successfully' }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      // Trigger GitHub repository dispatch
      const response = await fetch(
        'https://api.github.com/repos/banddude/shaffercon/dispatches',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
            'User-Agent': 'Cloudflare-Worker',
          },
          body: JSON.stringify({
            event_type: 'contact-form-submission',
            client_payload: {
              firstName,
              lastName,
              email,
              phone: phone || '',
              address: address || '',
              message: message || '',
              attribution,
              jobCategory,
              leadQuality: spamAssessment.leadQuality,
              spamAssessment,
            },
          }),
        }
      );

      if (response.ok || response.status === 204) {
        return new Response(
          JSON.stringify({ success: true, accepted: true, message: 'Form submitted successfully' }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      } else {
        // Log error details for debugging
        const errorText = await response.text();
        console.error('GitHub API error:', response.status, errorText);

        return new Response(
          JSON.stringify({
            error: 'Failed to submit form',
            details: response.status
          }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }
    } catch (error) {
      console.error('Worker error:', error);

      return new Response(
        JSON.stringify({
          error: 'Internal server error',
          message: error.message
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
  },
};

function textValue(value) {
  if (typeof value !== 'string') return '';
  return value.slice(0, 2000);
}

function normalizeAttribution(value) {
  const source = value && typeof value === 'object' ? value : {};

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
    landingServiceCategory: textValue(source.landingServiceCategory),
  };
}

function normalizeText(value) {
  return textValue(value).toLowerCase();
}

function compactPhone(value) {
  return textValue(value).replace(/\D/g, '');
}

function addReason(assessment, points, reason) {
  assessment.score += points;
  assessment.reasons.push(reason);
}

function hasAny(haystack, terms) {
  return terms.some((term) => haystack.includes(term));
}

function inferJobCategory(data) {
  const attribution = data.attribution || {};
  const haystack = [
    data.message,
    data.address,
    attribution.pagePath,
    attribution.pageTitle,
    attribution.landingPage,
    attribution.serviceCategory,
    attribution.landingServiceCategory,
  ].map(normalizeText).join(' ');

  if (hasAny(haystack, ['electrical-load-studies', 'load study', 'load studies', 'load calculation', 'capacity study'])) {
    return 'electrical_load_studies';
  }

  if (hasAny(haystack, ['commercial ev', 'fleet charging', 'dc fast', 'level 2', 'multifamily ev'])) {
    return 'commercial_ev_charging';
  }

  if (hasAny(haystack, ['residential ev', 'home charger', 'ev charger'])) {
    return 'residential_ev_charging';
  }

  if (hasAny(haystack, ['panel upgrade', 'service upgrade', 'subpanel', 'main panel'])) {
    return 'panel_upgrades';
  }

  if (hasAny(haystack, ['led retrofit', 'lighting retrofit', 'lighting'])) {
    return 'led_retrofit';
  }

  if (hasAny(haystack, ['commercial electrical', 'tenant improvement', 'facility', 'facilities'])) {
    return 'commercial_electrical';
  }

  return 'general_electrical';
}

function assessSubmission(data) {
  const attribution = data.attribution || {};
  const haystack = [
    data.firstName,
    data.lastName,
    data.email,
    data.phone,
    data.address,
    data.message,
    attribution.referrer,
    attribution.pagePath,
    attribution.landingPage,
  ].map(normalizeText).join(' ');
  const phone = compactPhone(data.phone);
  const email = normalizeText(data.email);
  const assessment = {
    blocked: false,
    leadQuality: 'potential_customer',
    classification: 'potential_customer',
    score: 0,
    reasons: [],
  };

  const vendorPatterns = [
    {
      reason: 'seo_vendor_pitch',
      points: 6,
      terms: ['seo analysis', 'website ranking', 'ranking on google', 'online visibility', 'targeted traffic', 'backlinks', 'guest post', 'link building'],
    },
    {
      reason: 'estimating_vendor_pitch',
      points: 6,
      terms: ['cost estimation', 'quantity takeoff', 'quantity take off', 'pure estimating', 'project manager pure estimating', 'send your plans in pdf'],
    },
    {
      reason: 'business_broker_pitch',
      points: 6,
      terms: ['business broker', 'selling your business', 'sell your business', 'private equity', 'strategic buyers', 'company might be worth', 'valuation of your business'],
    },
    {
      reason: 'outsourced_services_pitch',
      points: 5,
      terms: ['virtual assistant', 'lead generation', 'appointment setting', 'web design services', 'digital marketing services'],
    },
  ];

  for (const pattern of vendorPatterns) {
    if (hasAny(haystack, pattern.terms)) {
      addReason(assessment, pattern.points, pattern.reason);
    }
  }

  if (hasAny(email, ['businessbrokersleads.com', 'proestimator', 'pureestimating'])) {
    addReason(assessment, 5, 'known_vendor_email_pattern');
  }

  if (phone === '1234567890' || phone === '0000000000' || phone === '1111111111') {
    addReason(assessment, 5, 'fake_phone_number');
  }

  if (hasAny(haystack, ['seeking opportunity', 'electrical trainee', 'looking for work', 'resume'])) {
    addReason(assessment, 4, 'job_seeker');
  }

  if (assessment.reasons.includes('job_seeker')) {
    assessment.classification = 'job_seeker';
    assessment.leadQuality = 'needs_review';
  }

  if (assessment.reasons.some((reason) => reason.endsWith('_pitch') || reason === 'known_vendor_email_pattern')) {
    assessment.classification = 'vendor_spam';
    assessment.leadQuality = 'vendor_spam';
  }

  if (assessment.score >= 6) {
    assessment.blocked = true;
  }

  return assessment;
}

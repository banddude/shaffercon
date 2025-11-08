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
            },
          }),
        }
      );

      if (response.ok || response.status === 204) {
        return new Response(
          JSON.stringify({ success: true, message: 'Form submitted successfully' }),
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

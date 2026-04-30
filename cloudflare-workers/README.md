# Cloudflare Workers

This directory contains the Cloudflare Workers used by shaffercon.com.

## SEO Redirect Worker

`shaffercon-seo-redirects.js` handles old WordPress and deleted service URLs that still appear in Google Search Console. It returns real `301` redirects for known legacy paths and passes every other request through to GitHub Pages unchanged.

Current routes:

```text
shaffercon.com/*
www.shaffercon.com/*
```

Deploy with the Cloudflare account credentials in Keychain:

```bash
CLOUDFLARE_EMAIL=$(security find-generic-password -s CLOUDFLARE_EMAIL -w 2>/dev/null || printf 'mikejshaffer@gmail.com')
CLOUDFLARE_API_KEY=$(security find-generic-password -s CLOUDFLARE_API_KEY -w 2>/dev/null)
ACCOUNT=8e83fee9ba5b2bf423d5ffddaaee74c6

curl -X PUT "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT/workers/scripts/shaffercon-seo-redirects" \
  -H "X-Auth-Email: $CLOUDFLARE_EMAIL" \
  -H "X-Auth-Key: $CLOUDFLARE_API_KEY" \
  -H "Content-Type: application/javascript" \
  --data-binary @cloudflare-workers/shaffercon-seo-redirects.js
```

## Contact Form Worker

This worker securely handles contact form submissions by keeping the GitHub token server-side.

## Setup Steps

### 1. Install Wrangler CLI
```bash
npm install -g wrangler
```

### 2. Login to Cloudflare
```bash
wrangler login
```

### 3. Set GitHub Token as Secret
```bash
cd cloudflare-workers
wrangler secret put GITHUB_TOKEN
# When prompted, paste your GitHub personal access token
```

### 4. Deploy the Worker
```bash
wrangler deploy
```

### 5. Set Up Custom Domain (Optional but Recommended)
In Cloudflare dashboard:
1. Go to Workers & Pages → shaffercon-contact-form
2. Click "Triggers" tab
3. Add custom domain: `api.shaffercon.com`
4. Add route: `/contact`

Or use the default workers.dev URL:
- `https://shaffercon-contact-form.YOUR-SUBDOMAIN.workers.dev`

### 6. Update ContactForm.tsx
Change the fetch URL from GitHub API to your worker:
```javascript
const response = await fetch('https://api.shaffercon.com/contact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(formData),
});
```

## Testing Locally

```bash
# Test locally with wrangler
wrangler dev

# Worker will be available at http://localhost:8787
```

## Environment Variables

The worker uses one secret environment variable:
- `GITHUB_TOKEN` - Your GitHub personal access token with `repo` scope

Set this via:
```bash
wrangler secret put GITHUB_TOKEN
```

## How It Works

1. User submits contact form on website
2. Form sends POST request to Cloudflare Worker
3. Worker validates data and triggers GitHub repository dispatch
4. GitHub Action saves submission to `leads` branch
5. Worker returns success/error to form

## Security Benefits

✅ GitHub token never exposed in client-side code
✅ CORS configured for shaffercon.com only
✅ Request validation and error handling
✅ Free tier: 100,000 requests/day

# Analytics Quick Start

Your site is now ready for Google Analytics 4 and Google Search Console! Here's what you need to do to activate them.

---

## Quick Setup (5 minutes)

### Step 1: Get Your Google Analytics ID

1. Go to https://analytics.google.com/
2. Create a GA4 property (or use existing)
3. Get your Measurement ID (looks like `G-XXXXXXXXXX`)

### Step 2: Get Your Search Console Verification Code

1. Go to https://search.google.com/search-console
2. Add property: `https://banddude.github.io/shaffercon/`
3. Choose "HTML tag" verification
4. Copy the verification code (just the content value, not the whole tag)

### Step 3: Add to GitHub Secrets

1. Go to: https://github.com/banddude/shaffercon/settings/secrets/actions
2. Click "New repository secret"
3. Add these two secrets:

**Secret #1:**
- Name: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- Value: `G-XXXXXXXXXX` (your GA4 ID)

**Secret #2:**
- Name: `NEXT_PUBLIC_GSC_VERIFICATION`
- Value: Your verification code

### Step 4: Trigger Deployment

Push any commit or manually trigger the workflow at:
https://github.com/banddude/shaffercon/actions

---

## What's Already Implemented

✅ **Google Analytics 4** using official @next/third-parties package
✅ **Google Search Console** verification meta tag
✅ **Conversion tracking** for:
   - Phone number clicks
   - Email clicks
   - CTA button clicks ("Contact Us", "Get a Free Quote", etc.)

---

## Testing After Deployment

1. Visit your live site: https://banddude.github.io/shaffercon/
2. Open DevTools (F12) > Network tab
3. Look for requests to `google-analytics.com`
4. In GA4, go to Reports > Realtime
5. Click around your site, should see yourself as active user

---

## For Full Instructions

See `ANALYTICS_SETUP_GUIDE.md` for:
- Detailed setup steps
- How to view conversion data
- Custom reports setup
- Troubleshooting guide
- GDPR/privacy considerations

---

**Note:** Analytics will only work in production after you add the GitHub secrets. The site builds and deploys fine without them (analytics just won't be active).

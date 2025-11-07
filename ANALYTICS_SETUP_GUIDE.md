# Analytics Setup Guide

This guide walks you through setting up Google Analytics 4 and Google Search Console for the Shaffer Construction website.

---

## Google Analytics 4 Setup

### Step 1: Create GA4 Property

1. Go to https://analytics.google.com/
2. Click **Admin** (gear icon in bottom left)
3. In the **Account** column, select your account or create new one
4. In the **Property** column, click **Create Property**
5. Enter property details:
   - Property name: `Shaffer Construction`
   - Reporting time zone: `United States, Pacific Time`
   - Currency: `United States Dollar (USD)`
6. Click **Next**
7. Fill in business information:
   - Industry: `Construction & Contracting`
   - Business size: Select appropriate size
8. Click **Create**

### Step 2: Create Data Stream

1. After creating property, you'll see "Web" option
2. Click **Web**
3. Enter website details:
   - Website URL: `https://banddude.github.io`
   - Stream name: `Shaffer Construction Website`
4. Click **Create stream**

### Step 3: Get Measurement ID

1. You'll see your stream details
2. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)
3. This is what you'll use in the next step

### Step 4: Add to Website

1. Navigate to `/Users/mikeshaffer/AIVA/website/site/`
2. Create a file named `.env.local` (note the dot at the beginning)
3. Add this line:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
4. Replace `G-XXXXXXXXXX` with your actual Measurement ID

### Step 5: Deploy

1. Commit and push your changes (the .env.local file will NOT be committed)
2. In GitHub, go to: `https://github.com/banddude/shaffercon/settings/secrets/actions`
3. Click **New repository secret**
4. Name: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
5. Value: Your `G-XXXXXXXXXX` measurement ID
6. Click **Add secret**
7. Trigger a new deployment (push a commit or manually run workflow)

### Step 6: Verify It's Working

1. After deployment, visit your site: https://banddude.github.io/shaffercon/
2. Open browser DevTools (F12)
3. Go to **Network** tab
4. Filter by "google-analytics"
5. You should see requests to `www.google-analytics.com`
6. In GA4, go to **Reports** > **Realtime**
7. Visit your site in another tab
8. You should see yourself as an active user

---

## Google Search Console Setup

### Step 1: Add Property

1. Go to https://search.google.com/search-console
2. Click **Add Property**
3. Select **URL prefix** (not domain)
4. Enter: `https://banddude.github.io/shaffercon/`
5. Click **Continue**

### Step 2: Choose Verification Method

1. Select **HTML tag** method
2. You'll see a meta tag like:
   ```html
   <meta name="google-site-verification" content="abcdefghijklmnop1234567890" />
   ```
3. Copy ONLY the content value (the part between quotes after `content=`)
   - Example: `abcdefghijklmnop1234567890`

### Step 3: Add to Website

1. Open `/Users/mikeshaffer/AIVA/website/site/.env.local`
2. Add this line:
   ```
   NEXT_PUBLIC_GSC_VERIFICATION=abcdefghijklmnop1234567890
   ```
3. Replace with your actual verification code

### Step 4: Deploy

1. In GitHub, go to: `https://github.com/banddude/shaffercon/settings/secrets/actions`
2. Click **New repository secret**
3. Name: `NEXT_PUBLIC_GSC_VERIFICATION`
4. Value: Your verification code
5. Click **Add secret**
6. Trigger a new deployment

### Step 5: Complete Verification

1. After deployment, go back to Search Console
2. Click **Verify** button
3. If successful, you'll see "Ownership verified"
4. Click **Go to property**

### Step 6: Submit Sitemap

1. In Search Console, go to **Sitemaps** (left sidebar)
2. Enter: `sitemap.xml`
3. Click **Submit**
4. Google will start crawling your site

---

## GitHub Actions Environment Variables

To make analytics work in production, you need to add these as GitHub repository secrets:

1. Go to: `https://github.com/banddude/shaffercon/settings/secrets/actions`
2. Add two secrets:

**Secret 1:**
- Name: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- Value: `G-XXXXXXXXXX` (your GA4 Measurement ID)

**Secret 2:**
- Name: `NEXT_PUBLIC_GSC_VERIFICATION`
- Value: `abcdefghijklmnop1234567890` (your Search Console verification code)

3. Update `.github/workflows/deploy.yml` to include these in the build step

---

## Update GitHub Workflow

You need to modify the GitHub Actions workflow to pass the environment variables during build.

Open `.github/workflows/deploy.yml` and add the env variables to the build step:

```yaml
- name: Build
  run: npm run build
  env:
    NEXT_PUBLIC_GA_MEASUREMENT_ID: ${{ secrets.NEXT_PUBLIC_GA_MEASUREMENT_ID }}
    NEXT_PUBLIC_GSC_VERIFICATION: ${{ secrets.NEXT_PUBLIC_GSC_VERIFICATION }}
```

---

## Conversion Tracking

The site is configured to track these key conversions automatically:

### Phone Number Clicks
Every time someone clicks the phone number, it tracks:
- Event: `phone_click`
- Properties: `phone_number`, `location` (which page they clicked from)

### CTA Button Clicks
Tracks clicks on key call-to-action buttons:
- "Get a Free Quote" buttons
- "Schedule Consultation" buttons
- "Contact Us" buttons

Events tracked:
- Event: `cta_click`
- Properties: `button_text`, `page_url`, `button_location`

### How to View Conversions in GA4

1. Go to GA4 > **Configure** > **Events**
2. You'll see all events being tracked
3. Click **Mark as conversion** for important events:
   - `phone_click`
   - `cta_click`
   - `form_submit` (if contact form is enabled)

4. View conversion data:
   - **Reports** > **Life Cycle** > **Engagement** > **Conversions**

---

## Testing

### Test Locally (Development)

1. Create `.env.local` with your GA4 ID
2. Run `npm run dev`
3. Visit http://localhost:3000
4. Open DevTools > Network tab
5. You should see GA requests
6. Check GA4 Realtime report

### Test Production

1. After deploying, visit your live site
2. Click phone numbers and CTA buttons
3. In GA4, go to **Realtime** > **Events**
4. You should see events appearing within seconds

---

## Privacy Considerations

### GDPR/CCPA Compliance

If you need to add cookie consent:

1. Consider using a consent management platform:
   - CookieYes
   - OneTrust
   - Termly

2. Update Analytics component to respect user consent
3. Add privacy policy link to footer
4. Update privacy policy with analytics disclosure

### IP Anonymization

GA4 anonymizes IP addresses by default, but you can ensure this in your GA4 settings:
1. Go to **Admin** > **Data Settings** > **Data Collection**
2. Verify IP anonymization is enabled

---

## Troubleshooting

### Analytics Not Showing in GA4

**Check:**
1. Is the Measurement ID correct in GitHub secrets?
2. Did you redeploy after adding secrets?
3. Open DevTools > Console, any errors?
4. Check Network tab for google-analytics requests
5. Wait 24-48 hours for data to populate (Realtime should work immediately)

### Search Console Not Verifying

**Check:**
1. Is the verification code correct in GitHub secrets?
2. Did you redeploy after adding the secret?
3. View page source, is the meta tag present in `<head>`?
4. Are you verifying the exact URL you configured? (include `/shaffercon/` if needed)

### No Conversion Events

**Check:**
1. Are you clicking on actual links/buttons?
2. Check DevTools > Console for errors
3. Events can take a few minutes to appear in GA4
4. Check **Realtime** > **Events** in GA4

---

## Next Steps After Setup

1. **Set up custom reports** in GA4 for:
   - Traffic by location
   - Popular services
   - Conversion funnel

2. **Create audiences** for:
   - Visitors who viewed service pages
   - Users who clicked phone numbers
   - Returning visitors

3. **Link Google Ads** (if running ads):
   - Admin > Property > Google Ads Links

4. **Set up alerts** for:
   - Traffic drops
   - Conversion rate changes
   - Site errors

---

## Support Resources

- **GA4 Help:** https://support.google.com/analytics
- **Search Console Help:** https://support.google.com/webmasters
- **Next.js Analytics Docs:** https://nextjs.org/docs/app/building-your-application/optimizing/analytics

---

**Last Updated:** November 7, 2025

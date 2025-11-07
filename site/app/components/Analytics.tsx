import { GoogleAnalytics } from '@next/third-parties/google'

/**
 * Google Analytics 4 component
 *
 * To enable analytics:
 * 1. Create a .env.local file in the site/ directory
 * 2. Add: NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
 * 3. Replace G-XXXXXXXXXX with your actual GA4 measurement ID
 *
 * To get your GA4 measurement ID:
 * 1. Go to https://analytics.google.com/
 * 2. Create a property or use existing one
 * 3. Go to Admin > Property > Data Streams
 * 4. Click your web stream
 * 5. Copy the Measurement ID (starts with G-)
 */
export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!gaId) {
    // No GA ID configured, skip analytics in development
    return null;
  }

  return <GoogleAnalytics gaId={gaId} />;
}

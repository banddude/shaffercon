/**
 * Google Search Console verification meta tag
 *
 * To enable Search Console verification:
 * 1. Add to .env.local: NEXT_PUBLIC_GSC_VERIFICATION=your-verification-code
 * 2. Replace with the code from Google Search Console
 *
 * To get your verification code:
 * 1. Go to https://search.google.com/search-console
 * 2. Add your property (https://banddude.github.io/shaffercon)
 * 3. Choose "HTML tag" verification method
 * 4. Copy just the content value (not the whole tag)
 * 5. Add it to .env.local
 */
export function SearchConsoleVerification() {
  const verificationCode = process.env.NEXT_PUBLIC_GSC_VERIFICATION;

  if (!verificationCode) {
    return null;
  }

  return (
    <meta name="google-site-verification" content={verificationCode} />
  );
}

/**
 * Centralized configuration for the site
 * Updated for custom domain (shaffercon.com) - no base path needed
 */

// No base path needed for custom domain
export const BASE_PATH = '';

// Helper function to prepend base path to any URL
export const withBasePath = (path: string): string => {
  // Ensure the path starts with /
  return path.startsWith('/') ? path : `/${path}`;
};

// Asset paths (for images, videos, etc.)
export const ASSET_PATH = (path: string): string => withBasePath(path);

/**
 * Convert a human-readable phone number into a valid tel: URI.
 * Strips formatting characters and ensures the +1 country code prefix.
 *
 * Why: iOS Safari, Android dialers, and desktop click-to-call apps
 * all expect tel:+E.164 format. "tel:(323) 642-8509" is invalid per
 * RFC 3966 and may not actually trigger the dialer.
 *
 * Examples:
 *   telHref("(323) 642-8509")  → "tel:+13236428509"
 *   telHref("323-642-8509")    → "tel:+13236428509"
 *   telHref("3236428509")      → "tel:+13236428509"
 *   telHref("+13236428509")    → "tel:+13236428509"
 */
export const telHref = (phone: string): string => {
  if (!phone) return 'tel:';
  const digits = phone.replace(/\D/g, '');
  if (!digits) return 'tel:';
  // If it already starts with country code (11+ digits in NA), keep it
  // Otherwise assume US/Canada and prepend 1
  const e164 = digits.length === 10 ? `1${digits}` : digits;
  return `tel:+${e164}`;
};

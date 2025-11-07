/**
 * Analytics event tracking utilities
 *
 * These functions send events to Google Analytics 4
 * when users interact with key conversion elements.
 */

declare global {
  interface Window {
    gtag?: (
      command: 'event',
      eventName: string,
      eventParams?: Record<string, any>
    ) => void;
  }
}

/**
 * Track phone number clicks
 */
export function trackPhoneClick(phoneNumber: string, location: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'phone_click', {
      phone_number: phoneNumber,
      location: location,
      event_category: 'engagement',
      event_label: `Phone click from ${location}`,
    });
  }
}

/**
 * Track CTA button clicks
 */
export function trackCTAClick(buttonText: string, buttonLocation: string, destination?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'cta_click', {
      button_text: buttonText,
      button_location: buttonLocation,
      destination: destination || '',
      event_category: 'engagement',
      event_label: `CTA: ${buttonText}`,
    });
  }
}

/**
 * Track form submissions
 */
export function trackFormSubmit(formName: string, formLocation: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'form_submit', {
      form_name: formName,
      form_location: formLocation,
      event_category: 'conversion',
      event_label: `Form submitted: ${formName}`,
    });
  }
}

/**
 * Track email clicks
 */
export function trackEmailClick(email: string, location: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'email_click', {
      email: email,
      location: location,
      event_category: 'engagement',
      event_label: `Email click from ${location}`,
    });
  }
}

/**
 * Track service page views (for conversion funnel analysis)
 */
export function trackServiceView(serviceName: string, location: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'service_view', {
      service_name: serviceName,
      location: location,
      event_category: 'engagement',
      event_label: `Viewed service: ${serviceName} in ${location}`,
    });
  }
}

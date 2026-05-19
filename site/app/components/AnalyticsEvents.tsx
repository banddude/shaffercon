"use client";

import { useEffect } from "react";
import {
  serviceCategoryForPath,
  trackCTAClick,
  trackEmailClick,
  trackGenerateLead,
  trackPhoneClick,
} from "@/app/lib/analytics";

function cleanLabel(value: string) {
  return value.replace(/\s+/g, " ").trim().slice(0, 120);
}

function eventLocation() {
  return `${window.location.pathname}${window.location.search}`;
}

export function AnalyticsEvents() {
  useEffect(() => {
    try {
      const landingKey = "shaffercon_landing_page";
      const categoryKey = "shaffercon_landing_service_category";
      const currentUrl = window.location.href;
      const currentLocation = eventLocation();

      if (!window.sessionStorage.getItem(landingKey)) {
        window.sessionStorage.setItem(landingKey, currentUrl);
      }

      if (!window.sessionStorage.getItem(categoryKey)) {
        window.sessionStorage.setItem(categoryKey, serviceCategoryForPath(currentLocation));
      }
    } catch (error) {
      // Attribution is helpful, but tracking should never block navigation.
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;

      const href = link.getAttribute("href") || "";
      const label = cleanLabel(link.innerText || link.getAttribute("aria-label") || href);
      const location = eventLocation();

      if (href.startsWith("tel:")) {
        trackPhoneClick(href.replace(/^tel:/, ""), location);
        trackGenerateLead("phone_click", location);
        return;
      }

      if (href.startsWith("mailto:")) {
        trackEmailClick(href.replace(/^mailto:/, "").split("?")[0], location);
        trackGenerateLead("email_click", location);
        return;
      }

      if (href === "/contact-us" || href === "/contact-us/" || href.startsWith("/contact-us?")) {
        trackCTAClick(label || "Contact Us", location, href);
      }
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, []);

  return null;
}

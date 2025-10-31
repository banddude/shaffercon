import { getAllPages, type Page } from "@/lib/pages";
import Link from "next/link";
import { classNames, theme } from "@/app/styles/theme";

interface ServiceAreaLinksProps {
  location: string;
}

export default function ServiceAreaLinks({ location }: ServiceAreaLinksProps) {
  // Get all pages and filter for service area pages matching this location
  const allPages = getAllPages();

  const residential = allPages.filter((page: Page) =>
    page.slug.includes(`residential-`) && page.slug.includes(location)
  );

  const commercial = allPages.filter((page: Page) =>
    page.slug.includes(`commercial-`) && page.slug.includes(location)
  );

  // Helper function to format service name from slug
  const formatServiceName = (slug: string): string => {
    // Extract the service part after residential- or commercial-
    const parts = slug.split('/');
    const servicePart = parts[parts.length - 1];
    const nameWithoutPrefix = servicePart.replace(/^(residential|commercial)-/, '');

    // Convert dashes to spaces and capitalize each word
    return nameWithoutPrefix
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div>
      {residential.length > 0 && (
        <div className="mb-8">
          <h2 className={classNames.heading4}>
            Residential Services in {location.charAt(0).toUpperCase() + location.slice(1)}
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            {residential.map((service) => (
              <li key={service.slug}>
                <Link href={`/${service.slug}`} className={classNames.link}>
                  {formatServiceName(service.slug)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {commercial.length > 0 && (
        <div className="mb-8">
          <h2 className={classNames.heading4}>
            Commercial Services in {location.charAt(0).toUpperCase() + location.slice(1)}
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            {commercial.map((service) => (
              <li key={service.slug}>
                <Link href={`/${service.slug}`} className={classNames.link}>
                  {formatServiceName(service.slug)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

import { getDb } from "@/lib/db";
import Link from "next/link";
import { classNames, theme } from "@/app/styles/theme";

interface ServiceAreaLinksProps {
  location: string;
}

export default function ServiceAreaLinks({ location }: ServiceAreaLinksProps) {
  // Get services for this location from database
  const db = getDb();

  const residential = db.prepare(`
    SELECT service_name, service_type
    FROM service_pages
    WHERE location = ? AND service_type = 'residential'
    ORDER BY service_name
    LIMIT 20
  `).all(location) as Array<{ service_name: string; service_type: string }>;

  const commercial = db.prepare(`
    SELECT service_name, service_type
    FROM service_pages
    WHERE location = ? AND service_type = 'commercial'
    ORDER BY service_name
    LIMIT 20
  `).all(location) as Array<{ service_name: string; service_type: string }>;

  // Helper function to format service name
  const formatServiceName = (serviceName: string): string => {
    // Convert dashes to spaces and capitalize each word
    return serviceName
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
            {residential.map((service, index) => (
              <li key={index}>
                <Link href={`/service-areas/${location}/residential-${service.service_name}`} className={classNames.link}>
                  {formatServiceName(service.service_name)}
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
            {commercial.map((service, index) => (
              <li key={index}>
                <Link href={`/service-areas/${location}/commercial-${service.service_name}`} className={classNames.link}>
                  {formatServiceName(service.service_name)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

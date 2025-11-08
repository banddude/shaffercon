"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMapEvents } from "react-leaflet";
import { Icon } from "leaflet";
import { MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";

interface Location {
  location_name: string;
  location_slug: string;
  latitude: number;
  longitude: number;
}

// Coordinates for all service areas (approximate city centers)
const LOCATION_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "altadena": { lat: 34.1898, lng: -118.1312 },
  "atwater-village": { lat: 34.1189, lng: -118.2618 },
  "beverly-hills": { lat: 34.0736, lng: -118.4004 },
  "boyle-heights": { lat: 34.0333, lng: -118.2067 },
  "burbank": { lat: 34.1808, lng: -118.3090 },
  "culver-city": { lat: 34.0211, lng: -118.3965 },
  "echo-park": { lat: 34.0780, lng: -118.2607 },
  "glendale": { lat: 34.1425, lng: -118.2551 },
  "highland-park": { lat: 34.1142, lng: -118.1951 },
  "hollywood": { lat: 34.0928, lng: -118.3287 },
  "inglewood": { lat: 33.9617, lng: -118.3531 },
  "long-beach": { lat: 33.7701, lng: -118.1937 },
  "los-feliz": { lat: 34.1070, lng: -118.2927 },
  "pacific-palisades": { lat: 34.0454, lng: -118.5260 },
  "pasadena": { lat: 34.1478, lng: -118.1445 },
  "santa-clarita": { lat: 34.3917, lng: -118.5426 },
  "santa-monica": { lat: 34.0195, lng: -118.4912 },
  "sherman-oaks": { lat: 34.1508, lng: -118.4496 },
  "silver-lake": { lat: 34.0870, lng: -118.2704 },
  "torrance": { lat: 33.8358, lng: -118.3406 },
  "venice": { lat: 33.9850, lng: -118.4695 },
  "west-hollywood": { lat: 34.0900, lng: -118.3617 },
};

interface ServiceAreasMapProps {
  locations: Array<{ location_name: string; location_slug: string }>;
}

// Component to handle zoom-based label visibility
function ZoomHandler({
  locations,
  onVisibilityChange
}: {
  locations: Location[],
  onVisibilityChange: (visible: Set<string>) => void
}) {
  const updateLabels = (map: any) => {
    // Calculate based on pixel distance (screen proximity)
    const pixelThreshold = 80; // pixels - minimum distance between label centers
    const visible = getVisibleLabelsPixelBased(locations, map, pixelThreshold);
    onVisibilityChange(visible);
  };

  const map = useMapEvents({
    zoomend: () => {
      updateLabels(map);
    },
    moveend: () => {
      updateLabels(map);
    },
  });

  // Update on mount
  React.useEffect(() => {
    updateLabels(map);
  }, []);

  return null;
}

function getVisibleLabelsPixelBased(locs: Location[], map: any, pixelThreshold: number): Set<string> {
  const visible = new Set<string>();
  const bounds = map.getBounds();

  // Calculate all positions and filter to only those in viewport
  const positions = locs
    .filter(loc => bounds.contains([loc.latitude, loc.longitude])) // Only consider visible pins
    .map(loc => ({
      loc,
      point: map.latLngToContainerPoint([loc.latitude, loc.longitude]),
      isVisible: false
    }));

  // Sort by how isolated each location is (prefer showing isolated ones first)
  positions.sort((a, b) => {
    const aMinDist = Math.min(...positions.map(p =>
      p === a ? Infinity : Math.sqrt(Math.pow(a.point.x - p.point.x, 2) + Math.pow(a.point.y - p.point.y, 2))
    ));
    const bMinDist = Math.min(...positions.map(p =>
      p === b ? Infinity : Math.sqrt(Math.pow(b.point.x - p.point.x, 2) + Math.pow(b.point.y - p.point.y, 2))
    ));
    return bMinDist - aMinDist; // Most isolated first
  });

  // Now assign visibility with tighter threshold
  positions.forEach((pos) => {
    let tooClose = false;
    for (const other of positions) {
      if (other.isVisible && other !== pos) {
        const pixelDist = Math.sqrt(
          Math.pow(pos.point.x - other.point.x, 2) +
          Math.pow(pos.point.y - other.point.y, 2)
        );

        if (pixelDist < pixelThreshold) {
          tooClose = true;
          break;
        }
      }
    }
    if (!tooClose) {
      pos.isVisible = true;
      visible.add(pos.loc.location_slug);
    }
  });

  return visible;
}

export default function ServiceAreasMap({ locations }: ServiceAreasMapProps) {
  // Map locations with coordinates
  const mappedLocations: Location[] = locations.map(loc => ({
    ...loc,
    latitude: LOCATION_COORDINATES[loc.location_slug]?.lat || 34.0522,
    longitude: LOCATION_COORDINATES[loc.location_slug]?.lng || -118.2437,
  }));

  const [visibleLabels, setVisibleLabels] = React.useState<Set<string>>(
    new Set<string>()
  );

  // Custom marker icon (blue pin)
  const customIcon = new Icon({
    iconUrl: "data:image/svg+xml;base64," + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
        <path fill="#0284c7" stroke="#ffffff" stroke-width="1" d="M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9C20.1,15.8,20.2,15.8,20.2,15.7z"/>
        <circle fill="#ffffff" cx="12" cy="10" r="3"/>
      </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden" style={{ border: "2px solid var(--section-border)" }}>
      <MapContainer
        center={[34.0522, -118.2437]}
        zoom={9.5}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        zoomControl={true}
        zoomAnimation={true}
        fadeAnimation={true}
      >
        <ZoomHandler
          locations={mappedLocations}
          onVisibilityChange={setVisibleLabels}
        />
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={20}
        />

        {mappedLocations.map((location) => {
          const showLabel = visibleLabels.has(location.location_slug);

          return (
            <Marker
              key={location.location_slug}
              position={[location.latitude, location.longitude]}
              icon={customIcon}
            >
              {showLabel && (
                <Tooltip
                  permanent
                  direction="bottom"
                  offset={[0, 0]}
                  className="location-label"
                >
                  {location.location_name}
                </Tooltip>
              )}
              <Popup>
                <div className="p-2" style={{ minWidth: "200px" }}>
                  <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text)" }}>
                    {location.location_name}
                  </h3>
                  <a
                    href={`/service-areas/${location.location_slug}`}
                    className="text-base font-semibold inline-flex items-center"
                    style={{ color: "var(--primary)" }}
                  >
                    View Services →
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          background: var(--background);
          border: 1px solid var(--section-border);
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .leaflet-popup-tip {
          background: var(--background);
          border: 1px solid var(--section-border);
        }
        .leaflet-container {
          font-family: inherit;
          background: var(--section-gray);
        }
        .leaflet-popup-close-button {
          color: var(--text) !important;
          font-size: 20px !important;
        }
        .leaflet-popup-close-button:hover {
          color: var(--primary) !important;
        }
        /* Clean up controls */
        .leaflet-control-zoom a {
          background: var(--background) !important;
          color: var(--text) !important;
          border: 1px solid var(--section-border) !important;
        }
        .leaflet-control-zoom a:hover {
          background: var(--section-gray) !important;
        }
        .leaflet-control-attribution {
          display: none !important;
        }
        /* Permanent tooltip labels */
        .location-label.leaflet-tooltip {
          background: transparent !important;
          border: none !important;
          color: #ffffff !important;
          font-size: 13px !important;
          font-weight: 600 !important;
          padding: 0 !important;
          margin: 0 !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          white-space: nowrap !important;
          text-shadow: 0 1px 3px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6) !important;
        }
        .location-label.leaflet-tooltip::before {
          display: none !important;
        }
        .location-label.leaflet-tooltip-bottom {
          margin-top: 0 !important;
        }
      `}</style>
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";

const ServiceAreasMap = dynamic(() => import("@/app/components/ServiceAreasMap"), { ssr: false });

interface ServiceAreasMapWrapperProps {
  locations: Array<{ location_name: string; location_slug: string }>;
}

export default function ServiceAreasMapWrapper({ locations }: ServiceAreasMapWrapperProps) {
  return <ServiceAreasMap locations={locations} />;
}

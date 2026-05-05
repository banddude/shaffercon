export type ServiceType = "residential" | "commercial";

export interface ServiceLike {
  service_type: string;
  service_name: string;
}

const PRIORITY_SERVICES: Record<ServiceType, Set<string>> = {
  residential: new Set([
    "breaker-panel-service-maintenance",
    "dedicated-equipment-circuits",
    "electrical-code-compliance-corrections",
    "electrical-panel-upgrades",
    "electrical-safety-inspections",
    "electrical-troubleshooting-repairs",
    "ev-charger-installation",
    "lighting-installation-retrofitting",
  ]),
  commercial: new Set([
    "backup-generator-installation",
    "breaker-panel-service-maintenance",
    "dedicated-equipment-circuits",
    "electrical-code-compliance-corrections",
    "electrical-panel-upgrades",
    "electrical-safety-inspections",
    "electrical-troubleshooting-repairs",
    "energy-efficiency-upgrades",
    "ev-charger-installation",
    "lighting-installation-retrofitting",
  ]),
};

export function isPriorityService(serviceType: string, serviceName: string): boolean {
  if (serviceType !== "residential" && serviceType !== "commercial") {
    return false;
  }

  return PRIORITY_SERVICES[serviceType].has(serviceName);
}

export function filterPriorityServices<T extends ServiceLike>(services: T[]): T[] {
  return services.filter((service) => isPriorityService(service.service_type, service.service_name));
}

import type { RegionCode } from '@/types';

export interface MaintenancePlan {
  name: string;
  price: string;
  period: string;
  features: string[];
  isRecommended?: boolean;
}

export const maintenancePlans: Record<RegionCode, MaintenancePlan[]> = {
  lk: [
    {
      name: "Basic Care",
      price: "LKR 15,000",
      period: "/mo",
      features: ["Core updates", "Uptime monitoring", "Monthly backups"]
    },
    {
      name: "Premium Care",
      price: "LKR 35,000",
      period: "/mo",
      features: ["Everything in Basic", "Priority support", "Performance optimization", "5 hours content updates"],
      isRecommended: true
    },
    {
      name: "Enterprise Support",
      price: "LKR 75,000+",
      period: "/mo",
      features: ["Dedicated account manager", "Custom SLAs", "Advanced analytics"]
    }
  ],
  pk: [
    {
      name: "Basic Care",
      price: "PKR 12,000",
      period: "/mo",
      features: ["Core updates", "Uptime monitoring", "Monthly backups"]
    },
    {
      name: "Premium Care",
      price: "PKR 28,000",
      period: "/mo",
      features: ["Everything in Basic", "Priority support", "Performance optimization", "5 hours content updates"],
      isRecommended: true
    },
    {
      name: "Enterprise Support",
      price: "PKR 60,000+",
      period: "/mo",
      features: ["Dedicated account manager", "Custom SLAs", "Advanced analytics"]
    }
  ],
  int: [
    {
      name: "Global Care",
      price: "$500+",
      period: "/mo",
      features: ["Core updates", "Uptime monitoring", "Monthly backups"]
    },
    {
      name: "Growth Retainer",
      price: "$1,500+",
      period: "/mo",
      features: ["Everything in Global Care", "Priority support", "Performance optimization", "Conversion-focused content updates"],
      isRecommended: true
    },
    {
      name: "Enterprise Partnership",
      price: "Custom Quote",
      period: "/mo",
      features: ["Dedicated account manager", "Custom SLAs", "Advanced analytics", "International roadmap support"]
    }
  ]
};

export function getMaintenancePlans(region: RegionCode): MaintenancePlan[] {
  return maintenancePlans[region];
}

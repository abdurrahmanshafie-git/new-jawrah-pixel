import type { RegionCode } from '@/types';

export interface ServiceItem {
  id: string;
  title: string;
  price: string;
  features: string[];
}

export const sriLankaServices: ServiceItem[] = [
  {
    id: "web-design",
    title: "Signature Web Experience",
    price: "from LKR 500,000",
    features: ["Bespoke Art Direction", "Conversion-Led UX Architecture", "Core Web Vitals Engineering", "Technical SEO Foundation"]
  },
  {
    id: "ecommerce",
    title: "Luxury Commerce System",
    price: "from LKR 950,000",
    features: ["Premium Catalog Architecture", "Local Payment Integrations", "Inventory & Order Operations", "Conversion Analytics Layer"]
  },
  {
    id: "jewellery",
    title: "Fine Jewellery Flagships",
    price: "from LKR 850,000",
    features: ["Macro Product Storytelling", "Appraisal & Catalog Systems", "Private Consultation Scheduling", "Certificate Verifier Flows"]
  },
  {
    id: "fashion",
    title: "Fashion Brand Flagships",
    price: "from LKR 750,000",
    features: ["Editorial Collection Drops", "Size & Fit Guidance", "Cinematic Lookbook Sections", "Fast Filtering & Checkout Routing"]
  },
  {
    id: "restaurant",
    title: "Restaurant Websites",
    price: "from LKR 180,000",
    features: ["Interactive Luxury Menu Grid", "Online Reservation Forms", "Regional Google Maps SEO", "Contactless QR Setup"]
  },
  {
    id: "furniture",
    title: "Furniture Websites",
    price: "from LKR 220,000",
    features: ["Immersive Living Room Visualizers", "Direct WhatsApp Inquiries", "Product Configurator Support", "Custom Dimension Displays"]
  },
  {
    id: "seo",
    title: "SEO",
    price: "from LKR 50,000/month",
    features: ["Technical Keyword Auditing", "Local Map Pack Placement", "Quality Link Acquisition", "Monthly Competitor Performance Reports"]
  },
  {
    id: "branding",
    title: "Branding",
    price: "from LKR 80,000",
    features: ["Premium Vector Logos", "Luxury Color System Design", "Brand Guideline Standards", "Typographic Framework Sets"]
  },
  {
    id: "dashboards",
    title: "Client OS & Admin Dashboards",
    price: "from LKR 900,000",
    features: ["Custom Database Workspaces", "Interactive Analytics & Metrics", "Secure Role-Based Access", "Export/Import Pipeline Feeds"]
  },
  {
    id: "maintenance",
    title: "Maintenance Plans",
    price: "from LKR 15,000/month",
    features: ["Daily Server/CDN Diagnostics", "Real-Time Site Vulnerability Scans", "Ongoing Text/Image Revisions", "Express 24h Emergency Tickets"]
  }
];

export const pakistanServices: ServiceItem[] = [
  {
    id: "ecommerce-pk",
    title: "Luxury Commerce Pakistan",
    price: "from PKR 850,000",
    features: ["Custom Interactive Architecture", "Easypaisa & JazzCash Checkout", "Optimized Mobile Conversion", "Automated Billing & Reporting"]
  },
  {
    id: "jewellery-pk",
    title: "Fine Jewellery Digital Flagship",
    price: "from PKR 750,000",
    features: ["High-End Detail Frames", "Custom Order Configurators", "Secure Payment Protocols", "Private Showroom Scheduling"]
  },
  {
    id: "fashion-pk",
    title: "Fashion Brand Flagship Pakistan",
    price: "from PKR 650,000",
    features: ["Premium Seasonal Drop Systems", "Interactive Catalog Filters", "Fast Local 4G Load Paths", "Direct WhatsApp Checkout Hub"]
  },
  {
    id: "travel-pk",
    title: "Travel Agency Website Pakistan",
    price: "from PKR 180,000",
    features: ["Scenic Interactive Tour Packages", "Automated Consultation Forms", "Dynamic Local/Global Currency Views", "Corporate Travel System Pipelines"]
  },
  {
    id: "furniture-pk",
    title: "Furniture Showroom Website Pakistan",
    price: "from PKR 200,000",
    features: ["Interactive 3D Visual Showroom Modes", "Custom Built Inquiries Pipelines", "Financing & Installment Information", "Premium Catalog Layout Cards"]
  },
  {
    id: "restaurant-pk",
    title: "Restaurant Website Pakistan",
    price: "from PKR 150,000",
    features: ["Stellar Digital Food Menu", "Table & VIP Hall Booking Forms", "Local Karachi/Lahore Map Ranking", "Special Deal Campaign Modules"]
  },
  {
    id: "seo-pk",
    title: "SEO Pakistan",
    price: "from PKR 40,000/month",
    features: ["Competitor Keyword Auditing", "Targeted Regional Ranking Frameworks", "Content Marketing Strategies", "Local Citation Building Leads"]
  },
  {
    id: "branding-pk",
    title: "Branding Pakistan",
    price: "from PKR 60,000",
    features: ["Premium Vector Logo Packs", "Cohesive Corporate Identity Systems", "Social Media Templates Layout", "Elegant Style-Guide Handbooks"]
  },
  {
    id: "dashboards-pk",
    title: "Client OS & Admin Dashboards",
    price: "from PKR 950,000",
    features: ["Full Database Integration", "Order & Delivery Intelligence", "Corporate CRM Interfaces", "Multi-Warehouse Inventory Control"]
  },
  {
    id: "maintenance-pk",
    title: "Maintenance Pakistan",
    price: "from PKR 12,000/month",
    features: ["Daily Health Checks & Patches", "SLA Support Priority Response", "Regular Copywriting updates", "Offsite Periodic Backups Sync"]
  }
];

export const internationalServices: ServiceItem[] = [
  {
    id: "web-design-int",
    title: "Premium Global Web Experience",
    price: "from $500",
    features: ["Bespoke Global Art Direction", "Conversion-Led UX Architecture", "Core Web Vitals Engineering", "International SEO Foundation"]
  },
  {
    id: "ecommerce-int",
    title: "International Commerce System",
    price: "from $2,500",
    features: ["Premium Catalog Architecture", "USD Checkout Readiness", "Inventory & Order Operations", "Conversion Analytics Layer"]
  },
  {
    id: "ai-int",
    title: "AI Integrations",
    price: "from $1,000",
    features: ["AI Assistant Workflows", "Automation Planning", "Internal Process Tools", "Secure API Integration Paths"]
  },
  {
    id: "saas-int",
    title: "SaaS UI & Product Systems",
    price: "from $5,000",
    features: ["Dashboard UX Architecture", "Component System Design", "Admin & Client Workspaces", "Scalable Product Interfaces"]
  },
  {
    id: "branding-int",
    title: "Global Branding & Identity",
    price: "from $1,000",
    features: ["Premium Identity Direction", "Luxury Color System Design", "Brand Guideline Standards", "Typographic Framework Sets"]
  },
  {
    id: "seo-int",
    title: "International SEO Optimization",
    price: "from $500/month",
    features: ["Technical SEO Auditing", "Search Architecture Planning", "Metadata & Schema Systems", "Monthly Performance Reports"]
  },
  {
    id: "frontend-int",
    title: "High-End Frontend Development",
    price: "from $2,000",
    features: ["React Interface Engineering", "Motion & Interaction Polish", "Responsive Component Systems", "Accessibility & Speed Tuning"]
  },
  {
    id: "enterprise-int",
    title: "Enterprise Digital Systems",
    price: "Custom Quote",
    features: ["Advanced Scope Discovery", "Bespoke Integrations", "Global Launch Support", "Long-Term Strategic Partnership"]
  }
];

export function getServicesForRegion(region: RegionCode) {
  if (region === 'int') return internationalServices;
  return region === 'pk' ? pakistanServices : sriLankaServices;
}

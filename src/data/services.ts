export interface ServiceItem {
  id: string;
  title: string;
  price: string;
  features: string[];
}

export const sriLankaServices: ServiceItem[] = [
  {
    id: "web-design",
    title: "Web Design",
    price: "from LKR 150,000",
    features: ["Bespoke Visual Layouts", "Responsive Performance", "Speed & Security Optimization", "On-Page SEO Setup"]
  },
  {
    id: "ecommerce",
    title: "Ecommerce Development",
    price: "from LKR 350,000",
    features: ["Custom Shopping Cart", "Local Payment Integrations", "Optimized Inventory Management", "Sales Reports & Analytics"]
  },
  {
    id: "jewellery",
    title: "Jewellery Websites",
    price: "from LKR 300,000",
    features: ["High-Ticket Visual Aesthetics", "Product Catalog Zoom Features", "Customer Consult Scheduling", "Certificate Verifiers"]
  },
  {
    id: "fashion",
    title: "Fashion Brand Websites",
    price: "from LKR 280,000",
    features: ["Insta-Feed Feed Integration", "Size Selector Chart Guides", "Collection Showcases", "Dynamic Filtering & Sorting"]
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
    title: "Admin Dashboards",
    price: "from LKR 300,000",
    features: ["Custom Database Workspaces", "Interactive Analytics & Metrics", "Secure Multi-Auth Tiers", "Export/Import Pipeline Feeds"]
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
    title: "Ecommerce Website Development Pakistan",
    price: "from PKR 250,000",
    features: ["Custom Interactive Architecture", "Easypaisa & JazzCash Integrated Checkout", "Optimized Mobile Flow Metrics", "Automated Billing & Reporting"]
  },
  {
    id: "jewellery-pk",
    title: "Jewellery Website Design Pakistan",
    price: "from PKR 250,000",
    features: ["High-End Luxurious Detail Frames", "Premium Custom Order Configurator", "Secure Payment Protocols", "Private Showroom Scheduling"]
  },
  {
    id: "fashion-pk",
    title: "Fashion Brand Website Pakistan",
    price: "from PKR 220,000",
    features: ["Premium Seasonal Lookout Sync", "Interactive Catalog Filters", "Fast Load Speed over Local 4G", "Direct WhatsApp Checkout Hub"]
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
    title: "Admin Dashboards Pakistan",
    price: "from PKR 350,000",
    features: ["Full Database Integration", "Comprehensive Order Tracking Metrics", "Corporate CRM Interfaces", "Multi-Warehouse Inventory Control"]
  },
  {
    id: "maintenance-pk",
    title: "Maintenance Pakistan",
    price: "from PKR 12,000/month",
    features: ["Daily Health Checks & Patches", "SLA Support Priority Response", "Regular Copywriting updates", "Offsite Periodic Backups Sync"]
  }
];

export function getServicesForRegion(region: 'lk' | 'pk') {
  return region === 'lk' ? sriLankaServices : pakistanServices;
}

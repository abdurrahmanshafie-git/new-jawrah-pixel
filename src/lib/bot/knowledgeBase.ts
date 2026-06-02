/**
 * Jawrah Bot Knowledge Base
 * Structured data about the company, services, and pricing.
 */

export interface RegionalData {
  lk: string;
  pk: string;
  int: string;
}

export interface ServiceData {
  name: string;
  description: string;
  timeline: string;
  pricing: RegionalData;
}

export const KNOWLEDGE_BASE = {
  company: {
    name: "Jawrah Pixel",
    tagline: "Premium Digital Experiences",
    description: "Jawrah Pixel is a high-end digital agency specializing in premium web development, AI automation, and luxury branding. We build scalable platforms for global clients.",
    founded: "2023",
    founders: "Abdurrahman Shafie (Founder) and Jaweriya Hafeez (Co-Founder)",
    specialties: ["Web Development", "AI Solutions", "UI/UX Design", "E-commerce", "SaaS Platforms"],
    locations: {
      lk: "Colombo, Sri Lanka",
      pk: "Lahore, Pakistan",
      int: "Global Remote / Dubai"
    }
  },
  services: {
    web_dev: {
      name: "Custom Web Development",
      description: "Scalable, high-performance web applications built with React, Next.js, and Supabase.",
      timeline: "4-12 weeks",
      pricing: {
        lk: "Starting from 450,000 LKR",
        pk: "Starting from 350,000 PKR",
        int: "Starting from $2,500 USD"
      }
    },
    ecommerce: {
      name: "Luxury E-commerce",
      description: "Conversion-optimized online stores with custom features and premium animations.",
      timeline: "6-14 weeks",
      pricing: {
        lk: "Starting from 650,000 LKR",
        pk: "Starting from 500,000 PKR",
        int: "Starting from $3,500 USD"
      }
    },
    ai_automation: {
      name: "AI & Automation",
      description: "Custom AI agents, workflow automation, and intelligent CRM integrations.",
      timeline: "4-8 weeks",
      pricing: {
        lk: "Custom Quote Required",
        pk: "Custom Quote Required",
        int: "Starting from $1,500 USD"
      }
    },
    branding: {
      name: "Luxury Branding",
      description: "Strategic identity design, brand guidelines, and premium visual assets.",
      timeline: "3-6 weeks",
      pricing: {
        lk: "Starting from 250,000 LKR",
        pk: "Starting from 200,000 PKR",
        int: "Starting from $1,200 USD"
      }
    }
  },
  process: [
    "1. Strategic Briefing & Consultation",
    "2. Technical Architecture & UI/UX Prototyping",
    "3. Agile Development & Staging",
    "4. Quality Assurance & Optimization",
    "5. Deployment & Maintenance"
  ],
  payments: {
    methods: {
      lk: "Bank Transfer (LKR), Credit/Debit via PayHere",
      pk: "Bank Transfer (PKR), JazzCash/Easypaisa",
      int: "Stripe, Wise, International Wire Transfer (USD)"
    },
    terms: "Milestone-based payments (30% Upfront, 40% Mid-project, 30% Completion)"
  },
  portal: {
    features: [
      "Real-time project tracking",
      "Invoice & billing management",
      "Direct revision requests",
      "Support tickets & messaging",
      "File repository"
    ]
  },
  contact: {
    email: "jawrahpixel@gmail.com",
    whatsapp: "+94700000000", // Placeholder
    working_hours: "9:00 AM - 6:00 PM (GMT+5:30)"
  }
};

export interface FaqItem {
  q: string;
  a: string;
}

export const faqsData: Record<'lk' | 'pk' | 'int', FaqItem[]> = {
  lk: [
    {
      q: "What does the typical payment milestone structure look like in Sri Lanka?",
      a: "Our standard enterprise contract divides payments into clear progress triggers: 35% upon signed Scope lock-in, 40% midway through Backend Integration approval, and the final 25% only after successful launch verification and Lighthouse scores audit. We support local bank transfers in LKR and custom payment gateways."
    },
    {
      q: "Who holds the intellectual copyright to the completed system?",
      a: "Upon final milestone payment, 100% of the system codebase copyright, Figma graphics catalogs, database schemas, and digital secrets transfer legally to your enterprise. We hand over clean private ZIP directories or GitHub branches."
    },
    {
      q: "What APIs and servers does the agency support?",
      a: "We are expert cloud architects specializing in Vite and React. For databases and authentication, we use Supabase (PostgreSQL). We host deployments on Cloud Run or Vercel Edge networks to achieve rapid regional serving."
    },
    {
      q: "How does the monthly SLA technical retainer process function?",
      a: "Our care plans guarantee a dedicated block of junior or senior engineering hours to protect your live system. Retainer logs are tracked on our transparent Client Portal, allowing you to submit tickets or change requests instantly."
    }
  ],
  pk: [
    {
      q: "What does the typical payment milestone structure look like in Pakistan?",
      a: "Our standard contract divides payments into clear progress triggers: 30% upon signed Scope lock-in, 40% midway through midway approval, and the final 30% after launch. We support local bank transfers via IBAN, Easypaisa, JazzCash, and flexible installment options."
    },
    {
      q: "Who holds the intellectual copyright to the completed system?",
      a: "Upon final milestone payment, 100% of the system codebase copyright, Figma graphics catalogs, database schemas, and digital secrets transfer legally to your enterprise. We hand over clean private ZIP directories or GitHub branches."
    },
    {
      q: "What APIs and servers does the agency support?",
      a: "We are expert cloud architects specializing in Vite and React. For databases and authentication, we use Supabase (PostgreSQL). We host deployments on Cloud Run or Vercel Edge networks to achieve rapid regional serving."
    },
    {
      q: "How does the monthly SLA technical retainer process function?",
      a: "Our care plans guarantee a dedicated block of junior or senior engineering hours to protect your live system. Retainer logs are tracked on our transparent Client Portal, allowing you to submit tickets or change requests instantly."
    }
  ],
  int: [
    {
      q: "What does the typical payment milestone structure look like for international clients?",
      a: "Our standard international contract divides payments into clear USD milestones: scope lock-in, design and development approval, and final launch verification. We support PayPal, Wise, international bank transfer, Visa, and Mastercard."
    },
    {
      q: "Who holds the intellectual copyright to the completed system?",
      a: "Upon final milestone payment, 100% of the system codebase copyright, Figma graphics catalogs, database schemas, and digital secrets transfer legally to your business. We hand over clean private ZIP directories or GitHub branches."
    },
    {
      q: "What APIs and servers does the agency support?",
      a: "We are expert cloud architects specializing in Vite and React. For databases and authentication, we use Supabase (PostgreSQL). We host deployments on Cloud Run or Vercel Edge networks for worldwide performance."
    },
    {
      q: "How does remote-first collaboration work?",
      a: "International clients work through structured async updates, scheduled strategy calls, clear milestone approvals, and a transparent client portal for tickets, files, invoices, and growth requests."
    }
  ]
};

import type { RegionCode } from '@/types';

export function getFaqsForRegion(region: RegionCode): FaqItem[] {
  if (region === 'int') return faqsData.int;
  if (region === 'pk') return faqsData.pk;
  return faqsData.lk;
}

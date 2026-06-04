import { appEnv } from '@/lib/env';
import type { RegionCode } from '@/types';

export interface RegionConfig {
  id: RegionCode;
  countryName: string;
  currency: string;
  currencySymbol: string;
  contactEmail: string;
  whatsappNumber: string;
  whatsappLink: string;
  instagramLink: string;
  instagramHandle: string;
  locations: string[];
  paymentDesc: string;
  paymentMethods: string[];
  seoTitle: string;
  seoDescription: string;
}

const DEFAULT_EMAIL = appEnv.contactEmail;
const DEFAULT_WHATSAPP = appEnv.contactWhatsapp;
const DEFAULT_WHATSAPP_LINK = `https://wa.me/${DEFAULT_WHATSAPP.replace(/[^0-9]/g, '')}`;
const DEFAULT_INSTA_HANDLE = appEnv.brandInstagram;
const DEFAULT_INSTA_LINK = `https://instagram.com/${DEFAULT_INSTA_HANDLE.replace('@', '')}`;

export const REGION_OPTIONS: Array<{
  id: RegionCode;
  label: string;
  shortLabel: string;
  path: `/${RegionCode}`;
  caption: string;
}> = [
  { id: 'lk', label: 'Sri Lanka', shortLabel: 'LK', path: '/lk', caption: 'LKR portal' },
  { id: 'pk', label: 'Pakistan', shortLabel: 'PK', path: '/pk', caption: 'PKR portal' },
  { id: 'int', label: 'International', shortLabel: 'INT', path: '/int', caption: 'USD global portal' },
];

export const regions: Record<RegionCode, RegionConfig> = {
  lk: {
    id: 'lk',
    countryName: 'Sri Lanka',
    currency: 'LKR',
    currencySymbol: 'Rs.',
    contactEmail: DEFAULT_EMAIL,
    whatsappNumber: DEFAULT_WHATSAPP,
    whatsappLink: DEFAULT_WHATSAPP_LINK,
    instagramLink: DEFAULT_INSTA_LINK,
    instagramHandle: DEFAULT_INSTA_HANDLE,
    locations: ['Sri Lanka Operations', 'Remote-First Agency'],
    paymentDesc: 'LKR Bank Transfer Verification',
    paymentMethods: ['Bank Transfer', 'Receipt Upload', 'Reference Verification', 'WhatsApp Confirmation'],
    seoTitle: 'Premium Web Design Agency in Sri Lanka | Jawrah Pixel',
    seoDescription: 'Elite digital systems for Sri Lankan enterprises. Bespoke ecommerce, UI/UX architecture, and dashboard engineering.',
  },
  pk: {
    id: 'pk',
    countryName: 'Pakistan',
    currency: 'PKR',
    currencySymbol: 'Rs.',
    contactEmail: DEFAULT_EMAIL,
    whatsappNumber: DEFAULT_WHATSAPP,
    whatsappLink: DEFAULT_WHATSAPP_LINK,
    instagramLink: DEFAULT_INSTA_LINK,
    instagramHandle: DEFAULT_INSTA_HANDLE,
    locations: ['Pakistan Operations', 'Remote-First Agency'],
    paymentDesc: 'PKR Bank Transfer, Easypaisa & JazzCash',
    paymentMethods: ['Easypaisa', 'JazzCash', 'Bank Transfer', 'WhatsApp'],
    seoTitle: 'Elite Web Design Agency in Pakistan | Jawrah Pixel',
    seoDescription: 'High-performance digital blueprints for Pakistani brands. Scaling ecommerce and corporate platforms in Lahore & Karachi.',
  },
  int: {
    id: 'int',
    countryName: 'International',
    currency: 'USD',
    currencySymbol: '$',
    contactEmail: DEFAULT_EMAIL,
    whatsappNumber: DEFAULT_WHATSAPP,
    whatsappLink: DEFAULT_WHATSAPP_LINK,
    instagramLink: DEFAULT_INSTA_LINK,
    instagramHandle: DEFAULT_INSTA_HANDLE,
    locations: ['International Operations', 'Remote-First Agency'],
    paymentDesc: 'USD PayPal, Wise, International Bank Transfer, Visa & Mastercard',
    paymentMethods: ['PayPal', 'Wise', 'International Bank Transfer', 'Visa', 'Mastercard'],
    seoTitle: 'Jawrah Pixel International | Premium Web Design & Digital Solutions',
    seoDescription: 'Premium websites, ecommerce, branding, SEO, and digital systems for international clients.',
  }
};

export function getRegionFromPathname(pathname: string): RegionCode {
  const firstSegment = pathname.split('/').filter(Boolean)[0];
  if (firstSegment === 'pk') return 'pk';
  if (firstSegment === 'int') return 'int';
  return 'lk';
}

export interface RegionConfig {
  id: 'lk' | 'pk';
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

const DEFAULT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'jawrahpixel@gmail.com';
const DEFAULT_WHATSAPP = import.meta.env.VITE_CONTACT_WHATSAPP || '+94 76 273 7411';
const DEFAULT_WHATSAPP_LINK = `https://wa.me/${DEFAULT_WHATSAPP.replace(/[^0-9]/g, '')}`;
const DEFAULT_INSTA_HANDLE = import.meta.env.VITE_CONTACT_INSTA || '@jawrahpixel';
const DEFAULT_INSTA_LINK = `https://instagram.com/${DEFAULT_INSTA_HANDLE.replace('@', '')}`;

export const regions: Record<'lk' | 'pk', RegionConfig> = {
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
    locations: [
      'Colombo',
      'Kandy',
      'Galle',
      'Negombo',
      'Dehiwala',
      'Wattala',
      'Kurunegala',
      'Jaffna'
    ],
    paymentDesc: 'Direct Bank Transfer / Local Gateway',
    paymentMethods: [
      'Bank Transfer (LKR local banks)',
      'Credit & Debit Card Gateways',
      'Custom Payment Link options'
    ],
    seoTitle: 'Jawrah Pixel Sri Lanka | Premium Web Design Agency',
    seoDescription: 'Premium web design, ecommerce development, branding, SEO, dashboards and digital systems for Sri Lankan businesses.'
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
    locations: [
      'Karachi',
      'Lahore',
      'Islamabad',
      'Rawalpindi',
      'Faisalabad',
      'Multan',
      'Sialkot',
      'Hyderabad'
    ],
    paymentDesc: 'Bank Transfer / Easypaisa / JazzCash / Instalments',
    paymentMethods: [
      'Local Bank Transfer (IBAN support)',
      'Easypaisa / JazzCash mobile accounts',
      'Local Payment Gateway Integration (SadaPay, Nayapay, etc.)',
      'Flexible Milestone/Installment Options'
    ],
    seoTitle: 'Jawrah Pixel Pakistan | Premium Web Design Agency',
    seoDescription: 'Luxury websites, ecommerce platforms, branding, SEO, dashboards and custom digital systems for Pakistani businesses.'
  }
};

export function getRegionFromPathname(pathname: string): 'lk' | 'pk' {
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] === 'pk') return 'pk';
  return 'lk'; // default to Sri Lanka
}

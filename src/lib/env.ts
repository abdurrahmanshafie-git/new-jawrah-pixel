const PRODUCTION_SITE_URL = 'https://jawrahpixel.com';
const rawSiteUrl = import.meta.env.VITE_APP_URL || import.meta.env.VITE_SITE_URL || PRODUCTION_SITE_URL;
const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const appEnv = {
  siteUrl: normalizePublicSiteUrl(rawSiteUrl),
  supabaseUrl: rawSupabaseUrl || 'https://placeholder-project.supabase.co',
  supabaseAnonKey: rawSupabaseAnonKey || 'placeholder-key',
  hasSupabaseConfig: Boolean(rawSupabaseUrl && rawSupabaseAnonKey),
  contactEmail: import.meta.env.VITE_ADMIN_EMAIL || import.meta.env.VITE_CONTACT_EMAIL || 'jawrahpixel@gmail.com',
  contactWhatsapp: import.meta.env.VITE_BRAND_WHATSAPP || import.meta.env.VITE_CONTACT_WHATSAPP || '+94 76 273 7411',
  brandInstagram: import.meta.env.VITE_BRAND_INSTAGRAM || import.meta.env.VITE_CONTACT_INSTA || '@jawrahpixel',
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  turnstileSiteKey: import.meta.env.VITE_TURNSTILE_SITE_KEY || '',
};

function normalizePublicSiteUrl(value: string) {
  const cleanValue = value.replace(/\/$/, '');
  if (/localhost|127\.0\.0\.1|\.vercel\.app|\.netlify\.app/i.test(cleanValue)) {
    return PRODUCTION_SITE_URL;
  }
  return cleanValue || PRODUCTION_SITE_URL;
}

export function toAbsoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    try {
      const url = new URL(pathOrUrl);
      if (FORBIDDEN_PUBLIC_HOST_PATTERN.test(url.host)) {
        return `${appEnv.siteUrl}${url.pathname}${url.search}${url.hash}`;
      }
    } catch {
      return appEnv.siteUrl;
    }
    return pathOrUrl;
  }
  const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${appEnv.siteUrl}${cleanPath}`;
}

const FORBIDDEN_PUBLIC_HOST_PATTERN = /(?:localhost|127\.0\.0\.1|\.vercel\.app|\.netlify\.app)/i;

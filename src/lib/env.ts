const rawSiteUrl = import.meta.env.VITE_APP_URL || import.meta.env.VITE_SITE_URL || 'https://jawrahpixel.com';
const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const appEnv = {
  siteUrl: rawSiteUrl.replace(/\/$/, ''),
  supabaseUrl: rawSupabaseUrl || 'https://placeholder-project.supabase.co',
  supabaseAnonKey: rawSupabaseAnonKey || 'placeholder-key',
  hasSupabaseConfig: Boolean(rawSupabaseUrl && rawSupabaseAnonKey),
  contactEmail: import.meta.env.VITE_ADMIN_EMAIL || import.meta.env.VITE_CONTACT_EMAIL || 'jawrahpixel@gmail.com',
  contactWhatsapp: import.meta.env.VITE_BRAND_WHATSAPP || import.meta.env.VITE_CONTACT_WHATSAPP || '+94 76 273 7411',
  brandInstagram: import.meta.env.VITE_BRAND_INSTAGRAM || import.meta.env.VITE_CONTACT_INSTA || '@jawrahpixel',
};

export function toAbsoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${appEnv.siteUrl}${cleanPath}`;
}

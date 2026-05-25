import { useEffect } from 'react';
import { appEnv, toAbsoluteUrl } from '@/lib/env';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article' | 'profile';
  ogImage?: string;
  schemaType?: 'Organization' | 'Service' | 'Project' | 'BlogPosting';
  schemaData?: Record<string, any>;
}

export function SEO({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  ogImage = 'https://jawrahpixel.com/assets/og-image.jpg',
  schemaType,
  schemaData
}: SEOProps) {
  useEffect(() => {
    // 1. Update Title
    const formattedTitle = title.includes('Jawrah Pixel') ? title : `${title} | Jawrah Pixel | Premium Digital Agency`;
    const resolvedCanonical = canonicalUrl || `${appEnv.siteUrl}${window.location.pathname}`;
    const resolvedOgImage = toAbsoluteUrl(ogImage);
    document.title = formattedTitle;

    // 2. Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // 3. Update Canonical URL
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', resolvedCanonical);

    // 4. Update OpenGraph Tags
    const ogTags = {
      'og:title': formattedTitle,
      'og:description': description,
      'og:url': resolvedCanonical,
      'og:type': ogType,
      'og:image': resolvedOgImage,
      'og:site_name': 'Jawrah Pixel',
      'twitter:card': 'summary_large_image',
      'twitter:title': formattedTitle,
      'twitter:description': description,
      'twitter:image': resolvedOgImage,
      'theme-color': '#000000'
    };

    Object.entries(ogTags).forEach(([property, value]) => {
      let meta = document.querySelector(`meta[property="${property}"]`) || 
                 document.querySelector(`meta[name="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(property.startsWith('og:') ? 'property' : 'name', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', value);
    });

    // 5. Structured Data Schema Injection
    let schemaScript = document.getElementById('seo-structured-schema');
    if (schemaScript) {
      schemaScript.remove();
    }

    const defaultSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': 'https://jawrahpixel.com/#organization',
          'name': 'Jawrah Pixel',
          'url': appEnv.siteUrl,
          'logo': toAbsoluteUrl('/assets/logo.png'),
          'email': appEnv.contactEmail,
          'telephone': appEnv.contactWhatsapp,
          'sameAs': [
            'https://www.instagram.com/jawrahpixel',
            'https://linkedin.com/company/jawrahpixel'
          ]
        },
        {
          '@type': 'WebSite',
          '@id': 'https://jawrahpixel.com/#website',
          'url': appEnv.siteUrl,
          'name': 'Jawrah Pixel',
          'publisher': {
            '@id': 'https://jawrahpixel.com/#organization'
          }
        }
      ]
    };

    if (schemaType && schemaData) {
      let mainEntity: Record<string, any> = {
        '@context': 'https://schema.org',
        '@type': schemaType,
        ...schemaData
      };
      
      // Merge specialized schemas into the graph if defined
      (defaultSchema['@graph'] as any[]).push(mainEntity);
    }

    schemaScript = document.createElement('script');
    schemaScript.setAttribute('id', 'seo-structured-schema');
    schemaScript.setAttribute('type', 'application/ld+json');
    schemaScript.textContent = JSON.stringify(defaultSchema);
    document.head.appendChild(schemaScript);

    return () => {
      // Cleanup script on unmount/route change
      const script = document.getElementById('seo-structured-schema');
      if (script) {
        script.remove();
      }
    };
  }, [title, description, canonicalUrl, ogType, ogImage, schemaType, schemaData]);

  return null;
}

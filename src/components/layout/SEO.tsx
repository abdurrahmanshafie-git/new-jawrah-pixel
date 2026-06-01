import { useEffect } from 'react';
import { appEnv, toAbsoluteUrl } from '@/lib/env';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article' | 'profile';
  ogImage?: string;
  schemaType?: 'Organization' | 'Service' | 'Project' | 'BlogPosting' | 'FAQPage' | 'LocalBusiness' | 'BreadcrumbList' | 'Person' | 'CaseStudy';
  schemaData?: Record<string, any> | any[];
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
    const currentPath = window.location.pathname;
    const resolvedCanonical = canonicalUrl || `${appEnv.siteUrl}${currentPath}`;
    const resolvedOgImage = ogImage.startsWith('http') ? ogImage : toAbsoluteUrl(ogImage);
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

    const organizationSchema = {
      '@type': 'Organization',
      '@id': `${appEnv.siteUrl}/#organization`,
      'name': 'Jawrah Pixel',
      'url': appEnv.siteUrl,
      'logo': {
        '@type': 'ImageObject',
        'url': toAbsoluteUrl('/assets/logo.png'),
        'width': '512',
        'height': '512'
      },
      'email': appEnv.contactEmail,
      'telephone': appEnv.contactWhatsapp,
      'sameAs': [
        'https://www.instagram.com/jawrahpixel',
        'https://linkedin.com/company/jawrahpixel'
      ],
      'description': 'Premium Digital Agency & Client OS specializing in high-end website development, e-commerce, and business automation.'
    };

    const websiteSchema = {
      '@type': 'WebSite',
      '@id': `${appEnv.siteUrl}/#website`,
      'url': appEnv.siteUrl,
      'name': 'Jawrah Pixel',
      'publisher': {
        '@id': `${appEnv.siteUrl}/#organization`
      },
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${appEnv.siteUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    };

    const graph: any[] = [organizationSchema, websiteSchema];

    if (schemaType && schemaData) {
      if (Array.isArray(schemaData)) {
        schemaData.forEach(item => {
          graph.push(item);
        });
      } else {
        graph.push({
          '@type': schemaType,
          ...schemaData
        });
      }
    }

    const finalSchema = {
      '@context': 'https://schema.org',
      '@graph': graph
    };

    schemaScript = document.createElement('script');
    schemaScript.setAttribute('id', 'seo-structured-schema');
    schemaScript.setAttribute('type', 'application/ld+json');
    schemaScript.textContent = JSON.stringify(finalSchema);
    document.head.appendChild(schemaScript);

    return () => {
      const script = document.getElementById('seo-structured-schema');
      if (script) {
        script.remove();
      }
    };
  }, [title, description, canonicalUrl, ogType, ogImage, schemaType, schemaData]);

  return null;
}

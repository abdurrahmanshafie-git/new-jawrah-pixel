import { useEffect } from 'react';

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
  canonicalUrl = window.location.href,
  ogType = 'website',
  ogImage = 'https://jawrahpixel.com/assets/og-image.jpg',
  schemaType,
  schemaData
}: SEOProps) {
  useEffect(() => {
    // 1. Update Title
    const formattedTitle = title.includes('Jawrah Pixel') ? title : `${title} | Jawrah Pixel | Premium Digital Agency`;
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
    linkCanonical.setAttribute('href', canonicalUrl);

    // 4. Update OpenGraph Tags
    const ogTags = {
      'og:title': formattedTitle,
      'og:description': description,
      'og:url': canonicalUrl,
      'og:type': ogType,
      'og:image': ogImage,
      'og:site_name': 'Jawrah Pixel',
      'twitter:card': 'summary_large_image',
      'twitter:title': formattedTitle,
      'twitter:description': description,
      'twitter:image': ogImage
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
          'url': 'https://jawrahpixel.com',
          'logo': 'https://jawrahpixel.com/assets/logo.png',
          'email': 'jawrahpixel@gmail.com',
          'telephone': '+94762737411',
          'sameAs': [
            'https://www.instagram.com/jawrahpixel',
            'https://linkedin.com/company/jawrahpixel'
          ]
        },
        {
          '@type': 'WebSite',
          '@id': 'https://jawrahpixel.com/#website',
          'url': 'https://jawrahpixel.com',
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

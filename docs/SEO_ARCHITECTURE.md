# Jawrah Pixel International SEO Architecture

## Overview
A multi-region SEO system designed to rank in Google for Sri Lanka, Pakistan, and global markets while maintaining a unified brand entity.

---

## 1. Multi-Region Site Architecture

### URL Structure
```
/
├── /lk/                          (Sri Lanka - LKR, en_LK)
│   ├── /lk/digital-agency-sri-lanka
│   ├── /lk/web-development-sri-lanka
│   ├── /lk/ecommerce-development-sri-lanka
│   ├── /lk/seo-services-sri-lanka
│   ├── /lk/web-design-sri-lanka
│   ├── /lk/about
│   ├── /lk/services
│   ├── /lk/process
│   ├── /lk/pricing
│   ├── /lk/case-studies
│   ├── /lk/blog
│   └── /lk/contact
│
├── /pk/                          (Pakistan - PKR, en_PK)
│   ├── /pk/digital-agency-pakistan
│   ├── /pk/web-development-pakistan
│   ├── /pk/ecommerce-development-pakistan
│   ├── /pk/web-design-pakistan
│   ├── /pk/about
│   ├── /pk/services
│   ├── /pk/process
│   ├── /pk/pricing
│   ├── /pk/case-studies
│   ├── /pk/blog
│   └── /pk/contact
│
└── /int/                         (International - USD, en)
    ├── /int/web-development-agency
    ├── /int/custom-software-development
    ├── /int/digital-agency
    ├── /int/startup-development-services
    ├── /int/about
    ├── /int/services
    ├── /int/process
    ├── /int/pricing
    ├── /int/case-studies
    ├── /int/blog
    └── /int/contact
```

### hreflang Implementation
- `en-LK` for Sri Lanka
- `en-PK` for Pakistan 
- `en` for International
- `x-default` pointing to International homepage

---

## 2. Entity SEO Strategy

### Unified Brand Entity
**Google Entity: Jawrah Pixel**
- `name`: "Jawrah Pixel"
- `alternateName`: ["JawrahPixel", "jawrahpixel"]
- `sameAs`: [Instagram, LinkedIn, Founder Profile]
- `areaServed`: ["Sri Lanka", "Pakistan", "Worldwide"]
- `knowsAbout`: ["Web Development", "SEO", "Ecommerce", "Software Development"]

### Schema Markup Hierarchy
```
Organization
├── LocalBusiness (Sri Lanka)
├── LocalBusiness (Pakistan)
└── LocalBusiness (International)
    ├── Service pages
    └── BlogPosting pages
```

---

## 3. Content Authority System

### Sri Lanka Keyword Clusters
- `digital agency sri lanka`
- `web development sri lanka`
- `seo agency sri lanka`
- `web design sri lanka`
- `ecommerce development sri lanka`

### Pakistan Keyword Clusters
- `digital agency pakistan`
- `web development pakistan`
- `seo agency pakistan`
- `web design pakistan`
- `ecommerce development pakistan`

### Global Keyword Clusters
- `best digital agency`
- `web development agency`
- `startup development agency`
- `custom software development`
- `international web design`

---

## 4. Internal Linking Engine

### Link Structure
```
Homepage
├── Links to all region pages
├── Links to all service categories
└── Links to case studies
    └── Each region homepage
        ├── Links to region services
        └── Links to region case studies
            └── Each service page
                ├── Links to related services
                ├── Links to case studies
                └── Links to blog content
                    └── Blog posts
                        ├── Links back to services
                        └── Links to regions
```

### Anchor Text Strategy
- Use semantic, region-specific anchor text
- Avoid generic links like "click here"
- Mix: exact match, partial match, and branded anchors

---

## 5. Schema Markup Strategy

### Implemented Schema Types
- `Organization` - Global brand entity
- `LocalBusiness` - Per-region local presence
- `WebSite` - Search action, publisher
- `Service` - Individual service pages
- `FAQPage` - FAQ sections
- `BlogPosting` - Blog articles
- `BreadcrumbList` - Navigation trails

---

## 6. Technical SEO Requirements

### Performance Targets
- LCP < 2.5s
- CLS < 0.1
- INP < 200ms
- Mobile-first indexing

### Canonical Strategy
- Each page has a self-referencing canonical
- Region pages have canonical to their region
- No duplicate content between regions

### Sitemap Strategy
- Sitemap split by region
- Submitted individually to GSC

---

## 7. Backlink & Authority Strategy

### Sri Lanka (lk)
- .lk domain backlinks
- Local business directories
- Sri Lankan tech blogs
- Startup listings

### Pakistan (pk)
- .pk domain backlinks
- Freelancer platforms
- Pakistani tech blogs
- Startup directories

### Global (int)
- Medium articles
- Dev.to posts
- GitHub projects
- Reddit discussions
- SaaS directories

---

## 8. Conversion & SEO Signal Optimization

### On-Page Elements
- High CTR title tags (under 60 chars)
- Strong meta descriptions (150-160 chars)
- Trust signals: case studies, testimonials
- Clear CTAs above the fold
- Fast navigation experience

---

## File Structure (Current Implementation)

```
src/
├── components/
│   └── layout/
│       └── SEO.tsx                  # Main SEO component
├── lib/
│   └── seo/
│       ├── schema.ts               # Schema generation
│       ├── regionMeta.ts           # Regional metadata
│       └── pageSeo.ts              # Page SEO utilities
├── data/
│   ├── regions.ts                  # Region config
│   └── serviceLandingPages.ts      # Regional service pages
├── hooks/
│   └── useRegion.ts                # Region hook with URL helpers
└── pages/
    ├── About.tsx
    ├── Services.tsx
    └── ServiceLandingPage.tsx
```

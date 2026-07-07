import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { useRegion } from '@/hooks/useRegion';
import { useRegionalSeo } from '@/hooks/useRegionalSeo';
import { getCanonicalUrl } from '@/lib/seo/pageSeo';
import { SEO } from '@/components/layout/SEO';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';
import { useTheme } from '@/contexts/ThemeContext';

interface ServiceCategory {
  title: string;
  description: string;
  services: string[];
  outcomes: string[];
}

const serviceCategories: ServiceCategory[] = [
  {
    title: 'Premium Websites',
    description: 'Custom websites designed to establish credibility, strengthen brand perception, and create meaningful customer experiences.',
    services: [
      'Luxury Brand Websites',
      'Corporate Websites',
      'Business Websites',
      'Portfolio Websites',
      'Landing Pages',
      'Personal Brand Websites'
    ],
    outcomes: [
      'Better credibility',
      'Stronger brand perception',
      'Improved lead generation'
    ]
  },
  {
    title: 'E-Commerce Solutions',
    description: 'Scalable online shopping experiences designed to increase conversions and streamline digital sales.',
    services: [
      'Online Stores',
      'Fashion E-Commerce',
      'Product Catalogs',
      'Shopping Cart Systems',
      'Checkout Systems',
      'Payment Integrations',
      'Order Management'
    ],
    outcomes: [
      'Increased online sales',
      'Improved customer experience',
      'Simplified operations'
    ]
  },
  {
    title: 'Business Systems',
    description: 'Custom internal tools that improve efficiency, automate processes, and help businesses scale.',
    services: [
      'Admin Dashboards',
      'CRM Systems',
      'Customer Portals',
      'Employee Portals',
      'Internal Management Systems',
      'Analytics Dashboards',
      'Workflow Automation'
    ],
    outcomes: [
      'Reduced manual work',
      'Better operational visibility',
      'Increased efficiency'
    ]
  },
  {
    title: 'Custom Platforms',
    description: 'Advanced digital products built around unique business requirements.',
    services: [
      'Marketplaces',
      'Booking Systems',
      'SaaS Platforms',
      'Membership Platforms',
      'Multi-Vendor Platforms',
      'Enterprise Applications',
      'Custom Web Applications'
    ],
    outcomes: [
      'New revenue opportunities',
      'Digital transformation',
      'Scalable infrastructure'
    ]
  },
  {
    title: 'UI/UX Design',
    description: 'Design systems and user experiences that combine aesthetics, usability, and business objectives.',
    services: [
      'User Experience Design',
      'User Interface Design',
      'Design Systems',
      'Wireframing',
      'Interactive Prototypes',
      'Product Design',
      'User Flow Optimization'
    ],
    outcomes: [
      'Better usability',
      'Higher engagement',
      'Improved conversions'
    ]
  }
];

interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Discovery',
    description: 'Understanding goals, challenges, audience, and opportunities.'
  },
  {
    number: '02',
    title: 'Strategy',
    description: 'Planning architecture, workflows, and project execution.'
  },
  {
    number: '03',
    title: 'Design',
    description: 'Creating premium interfaces aligned with business objectives.'
  },
  {
    number: '04',
    title: 'Development',
    description: 'Building scalable, secure, and production-ready systems.'
  },
  {
    number: '05',
    title: 'Launch',
    description: 'Testing, deployment, optimization, and handover.'
  }
];

const whyChooseUs = [
  'Premium Design Standards',
  'Scalable Architecture',
  'Mobile-First Development',
  'Performance Optimization',
  'Security Best Practices',
  'Business-Focused Solutions',
  'Long-Term Scalability',
  'Modern Technology Stack'
];

export default function Services() {
  const { currentRegion, config, p } = useRegion();
  const seo = useRegionalSeo('services');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="pt-32 pb-20 relative min-h-screen overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      <SEO 
        title={seo.title}
        description={seo.description}
        canonicalUrl={getCanonicalUrl(seo.path)}
        keywords={seo.keywords}
        schemaType={seo.schemaType}
        schemaData={seo.schemaData}
      />

      {/* Atmospheric Background */}
      <div className="absolute inset-0 z-0">
        {isDark && <div className="absolute inset-0 premium-grid-overlay opacity-20 pointer-events-none" />}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
          <div className="absolute top-[10%] right-[10%] opacity-30 blur-[100px]" style={{ background: isDark ? 'radial-gradient(circle, rgba(6, 182, 212, 0.1), transparent 70%)' : 'radial-gradient(circle, rgba(16, 185, 129, 0.08), transparent 70%)' }} />
          <div className="absolute bottom-[20%] left-[10%] opacity-20 blur-[100px]" style={{ background: isDark ? 'radial-gradient(circle at center, rgba(6, 182, 212, 0.1), transparent 70%)' : 'radial-gradient(circle at center, rgba(16, 185, 129, 0.06), transparent 70%)' }} />
        </div>
      </div>

      <div className="container mx-auto px-5 sm:px-6 relative z-10">
        
        {/* Hero Section */}
        <Reveal className="text-center max-w-[800px] mx-auto mb-24 md:mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex gap-3 items-center px-6 py-2 text-[10px] font-mono uppercase tracking-[0.4em] mb-10"
            style={{
              borderColor: 'var(--border)',
              borderWidth: '1px',
              borderStyle: 'solid',
              backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(15,23,42,0.02)',
              color: isDark ? 'var(--brand-cyan)' : 'var(--accent)'
            }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: isDark ? 'var(--brand-cyan)' : 'var(--accent)' }} /> 
            PREMIUM DIGITAL SOLUTIONS
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-medium uppercase tracking-tight mb-10 leading-[0.95]"
            style={{ color: 'var(--text-primary)' }}
          >
            Digital Solutions <br /> <span style={{ color: 'var(--text-muted)' }}>Built For Growth</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl font-light leading-relaxed mb-10"
            style={{ color: 'var(--text-muted)' }}
          >
            We help brands, startups, and businesses create premium digital experiences through strategic design, scalable development, and custom technology solutions.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to={p('/contact')}
              className="inline-flex items-center justify-center px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 min-w-[200px]"
              style={{ 
                backgroundColor: isDark ? 'var(--brand-cyan)' : 'var(--accent)',
                color: isDark ? '#000000' : '#ffffff'
              }}
            >
              Get A Proposal
            </Link>
            <Link
              to={p('/pricing')}
              className="inline-flex items-center justify-center px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 min-w-[200px]"
              style={{ 
                backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.7)',
                borderColor: 'var(--border)',
                borderWidth: '1px',
                borderStyle: 'solid',
                color: 'var(--text-primary)'
              }}
            >
              View Pricing
            </Link>
          </motion.div>
        </Reveal>

        {/* Service Categories */}
        <section className="mb-24 md:mb-32">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {serviceCategories.map((category, idx) => (
              <StaggerItem key={idx} className="group">
                <div className="p-8 transition-all duration-500 h-full"
                  style={{
                    backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.7)',
                    borderColor: 'var(--border)',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                  }}
                >
                  <h3 className="text-2xl md:text-3xl font-display font-medium mb-4 uppercase tracking-tight" style={{ color: 'var(--text-primary)' }}>{category.title}</h3>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>{category.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-mono uppercase tracking-[0.2em] mb-4" style={{ color: isDark ? 'var(--brand-cyan)' : 'var(--accent)' }}>What We Build</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {category.services.map((service, sIdx) => (
                        <li key={sIdx} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                          <Check className="w-4 h-4 shrink-0" style={{ color: isDark ? 'var(--brand-cyan)' : 'var(--accent)' }} />
                          <span>{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6" style={{ borderTopColor: 'var(--border)', borderTopWidth: '1px', borderTopStyle: 'solid' }}>
                    <h4 className="text-sm font-mono uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--text-secondary)' }}>Business Outcomes</h4>
                    <div className="flex flex-wrap gap-2">
                      {category.outcomes.map((outcome, oIdx) => (
                        <span key={oIdx} className="px-3 py-1 text-xs"
                          style={{
                            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(15,23,42,0.02)',
                            borderColor: 'var(--border)',
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          {outcome}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* Process Section */}
        <section className="mb-24 md:mb-32">
          <Reveal className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-medium uppercase tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>How We Deliver Successful Projects</h2>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {processSteps.map((step, idx) => (
              <StaggerItem key={idx} className="relative group">
                <div className="p-6 transition-all duration-300 h-full"
                  style={{
                    backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.7)',
                    borderColor: 'var(--border)',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                  }}
                >
                  <div className="text-4xl font-display font-medium mb-4 opacity-50" style={{ color: isDark ? 'var(--brand-cyan)' : 'var(--accent)' }}>{step.number}</div>
                  <h3 className="text-lg font-display font-medium mb-3 uppercase tracking-tight" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{step.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* Why Choose Us Section */}
        <section className="mb-24 md:mb-32">
          <Reveal className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-medium uppercase tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>Built For Businesses That Expect More</h2>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {whyChooseUs.map((item, idx) => (
              <StaggerItem key={idx} className="group">
                <div className="p-6 transition-all duration-300 text-center"
                  style={{
                    backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.7)',
                    borderColor: 'var(--border)',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                  }}
                >
                  <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{item}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* Final CTA Section */}
        <section className="mb-12">
          <div className="relative overflow-hidden p-8 md:p-12 lg:p-16"
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.7)',
              borderColor: 'var(--border)',
              borderWidth: '1px',
              borderStyle: 'solid'
            }}
          >
            <div className="absolute inset-0 z-0">
              <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-30" style={{ background: isDark ? 'rgba(6, 182, 212, 0.1)' : 'rgba(59, 130, 246, 0.1)' }} />
              <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)' }} />
            </div>
            
            <Reveal className="relative z-10 max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium uppercase tracking-tight mb-6" style={{ color: 'var(--text-primary)' }}>Let's Build Something Exceptional</h2>
              <p className="text-lg font-light leading-relaxed mb-10" style={{ color: 'var(--text-muted)' }}>
                Whether you need a premium website, an e-commerce platform, a business management system, or a custom digital product, Jawrah Pixel can help bring your vision to life.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to={p('/contact')}
                  className="inline-flex items-center justify-center px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 min-w-[200px]"
                  style={{ 
                    backgroundColor: isDark ? 'var(--brand-cyan)' : 'var(--accent)',
                    color: isDark ? '#000000' : '#ffffff'
                  }}
                >
                  Get A Proposal
                </Link>
                <Link
                  to={p('/contact')}
                  className="inline-flex items-center justify-center px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 min-w-[200px]"
                  style={{ 
                    backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.7)',
                    borderColor: 'var(--border)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    color: 'var(--text-primary)'
                  }}
                >
                  Contact Us
                </Link>
                <Link
                  to={p('/pricing')}
                  className="inline-flex items-center justify-center px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 min-w-[200px]"
                  style={{ 
                    backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.7)',
                    borderColor: 'var(--border)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    color: 'var(--text-primary)'
                  }}
                >
                  View Pricing
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

      </div>
    </div>
  );
}

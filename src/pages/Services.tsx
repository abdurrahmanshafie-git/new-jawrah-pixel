import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { useRegion } from '@/hooks/useRegion';
import { useRegionalSeo } from '@/hooks/useRegionalSeo';
import { getCanonicalUrl } from '@/lib/seo/pageSeo';
import { SEO } from '@/components/layout/SEO';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';

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

  return (
    <div className="pt-32 pb-20 bg-brand-black text-white relative min-h-screen overflow-hidden">
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
        <div className="absolute inset-0 premium-grid-overlay opacity-20 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
          <div className="absolute top-[10%] right-[10%] cinematic-light animate-pulse-slow opacity-30" />
          <div className="absolute bottom-[20%] left-[10%] cinematic-light animate-glow opacity-20" style={{ background: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.1), transparent 70%)' }} />
        </div>
      </div>

      <div className="container mx-auto px-5 sm:px-6 relative z-10">
        
        {/* Hero Section */}
        <Reveal className="text-center max-w-[800px] mx-auto mb-24 md:mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex gap-3 items-center px-6 py-2 border border-white/5 bg-white/[0.03] text-brand-cyan text-[10px] font-mono uppercase tracking-[0.4em] mb-10"
          >
            <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" /> 
            PREMIUM DIGITAL SOLUTIONS
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-medium uppercase tracking-tight mb-10 leading-[0.95]"
          >
            Digital Solutions <br /> <span className="text-brand-gray">Built For Growth</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 text-lg md:text-xl font-light leading-relaxed mb-10"
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
              className="inline-flex items-center justify-center bg-brand-cyan text-black px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:bg-brand-cyan/90 min-w-[200px]"
            >
              Get A Proposal
            </Link>
            <Link
              to={p('/pricing')}
              className="inline-flex items-center justify-center border border-white/10 bg-white/[0.02] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:border-brand-cyan/30 hover:bg-white/[0.04] min-w-[200px]"
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
                <div className="p-8 border border-white/5 bg-white/[0.02] hover:bg-white/[0.03] hover:border-brand-cyan/20 transition-all duration-500 h-full">
                  <h3 className="text-2xl md:text-3xl font-display font-medium text-white mb-4 uppercase tracking-tight">{category.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed mb-6">{category.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-mono uppercase tracking-[0.2em] text-brand-cyan mb-4">What We Build</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {category.services.map((service, sIdx) => (
                        <li key={sIdx} className="flex items-center gap-2 text-sm text-zinc-400">
                          <Check className="w-4 h-4 text-brand-cyan shrink-0" />
                          <span>{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-white/5">
                    <h4 className="text-sm font-mono uppercase tracking-[0.2em] text-zinc-400 mb-4">Business Outcomes</h4>
                    <div className="flex flex-wrap gap-2">
                      {category.outcomes.map((outcome, oIdx) => (
                        <span key={oIdx} className="px-3 py-1 bg-white/[0.03] border border-white/5 text-xs text-zinc-300">
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
            <h2 className="text-3xl md:text-4xl font-display font-medium uppercase tracking-tight text-white mb-4">How We Deliver Successful Projects</h2>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {processSteps.map((step, idx) => (
              <StaggerItem key={idx} className="relative group">
                <div className="p-6 border border-white/5 bg-white/[0.02] hover:bg-white/[0.03] transition-all duration-300 h-full">
                  <div className="text-4xl font-display font-medium text-brand-cyan mb-4 opacity-50">{step.number}</div>
                  <h3 className="text-lg font-display font-medium text-white mb-3 uppercase tracking-tight">{step.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{step.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* Why Choose Us Section */}
        <section className="mb-24 md:mb-32">
          <Reveal className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-medium uppercase tracking-tight text-white mb-4">Built For Businesses That Expect More</h2>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {whyChooseUs.map((item, idx) => (
              <StaggerItem key={idx} className="group">
                <div className="p-6 border border-white/5 bg-white/[0.02] hover:bg-white/[0.03] hover:border-brand-cyan/20 transition-all duration-300 text-center">
                  <p className="text-sm font-medium text-zinc-300">{item}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* Final CTA Section */}
        <section className="mb-12">
          <div className="relative overflow-hidden bg-white/[0.02] border border-white/5 p-8 md:p-12 lg:p-16">
            <div className="absolute inset-0 z-0">
              <div className="absolute top-0 right-0 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl opacity-30" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl opacity-20" />
            </div>
            
            <Reveal className="relative z-10 max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium uppercase tracking-tight text-white mb-6">Let's Build Something Exceptional</h2>
              <p className="text-zinc-500 text-lg font-light leading-relaxed mb-10">
                Whether you need a premium website, an e-commerce platform, a business management system, or a custom digital product, Jawrah Pixel can help bring your vision to life.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to={p('/contact')}
                  className="inline-flex items-center justify-center bg-brand-cyan text-black px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:bg-brand-cyan/90 min-w-[200px]"
                >
                  Get A Proposal
                </Link>
                <Link
                  to={p('/contact')}
                  className="inline-flex items-center justify-center border border-white/10 bg-white/[0.02] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:border-brand-cyan/30 hover:bg-white/[0.04] min-w-[200px]"
                >
                  Contact Us
                </Link>
                <Link
                  to={p('/pricing')}
                  className="inline-flex items-center justify-center border border-white/10 bg-white/[0.02] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:border-brand-cyan/30 hover:bg-white/[0.04] min-w-[200px]"
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

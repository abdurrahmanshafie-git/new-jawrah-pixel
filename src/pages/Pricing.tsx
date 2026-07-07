import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check, Minus, ChevronRight, Calendar, Clock } from 'lucide-react';
import { useRegion } from '@/hooks/useRegion';
import { useRegionalSeo } from '@/hooks/useRegionalSeo';
import { getCanonicalUrl } from '@/lib/seo/pageSeo';
import { SEO } from '@/components/layout/SEO';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';
import { useTheme } from '@/contexts/ThemeContext';

type RegionCode = 'lk' | 'pk' | 'int' | 'uk';

interface PricingData {
  starter: string;
  business: string;
  enterprise: string;
  currency: string;
}

const pricingByRegion: Record<RegionCode, PricingData> = {
  lk: {
    starter: '150,000 LKR',
    business: '350,000 LKR',
    enterprise: '700,000 LKR',
    currency: 'LKR'
  },
  pk: {
    starter: '175,000 PKR',
    business: '400,000 PKR',
    enterprise: '750,000 PKR',
    currency: 'PKR'
  },
  int: {
    starter: '600 USD',
    business: '1,900 USD',
    enterprise: '3,200 USD',
    currency: 'USD'
  },
  uk: {
    starter: '£850',
    business: '£2,250 (best ROI)',
    enterprise: '£5,500+ (custom)',
    currency: 'GBP'
  }
};

interface ComparisonFeature {
  name: string;
  starter: boolean;
  business: boolean;
  enterprise: boolean;
}

const comparisonFeatures: ComparisonFeature[] = [
  { name: 'Custom Design', starter: true, business: true, enterprise: true },
  { name: 'Responsive Design', starter: true, business: true, enterprise: true },
  { name: 'CMS', starter: true, business: true, enterprise: true },
  { name: 'Admin Dashboard', starter: false, business: true, enterprise: true },
  { name: 'Product Management', starter: false, business: true, enterprise: true },
  { name: 'Customer Accounts', starter: false, business: true, enterprise: true },
  { name: 'Payments', starter: false, business: true, enterprise: true },
  { name: 'Order Management', starter: false, business: true, enterprise: true },
  { name: 'Marketplace Features', starter: false, business: false, enterprise: true },
  { name: 'Booking Systems', starter: false, business: false, enterprise: true },
  { name: 'API Integrations', starter: false, business: false, enterprise: true },
  { name: 'Analytics', starter: false, business: false, enterprise: true },
  { name: 'Priority Support', starter: false, business: false, enterprise: true }
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
    description: 'Deep dive into your goals, audience, and requirements to understand the full scope.'
  },
  {
    number: '02',
    title: 'Strategy',
    description: 'Create a comprehensive roadmap and technical architecture tailored to your needs.'
  },
  {
    number: '03',
    title: 'Design',
    description: 'Premium, high-fidelity designs that align with your brand and user expectations.'
  },
  {
    number: '04',
    title: 'Development',
    description: 'Clean, performant code with rigorous testing and quality assurance.'
  },
  {
    number: '05',
    title: 'Launch',
    description: 'Seamless deployment, training, and ongoing support to ensure success.'
  }
];

export default function Pricing() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { currentRegion, config, p, isInternational } = useRegion();
  const location = useLocation();
  const isPricingRoute = /\/pricing\/?$/.test(location.pathname);
  const seo = useRegionalSeo(isPricingRoute ? 'pricing' : 'services');
  const pricing = pricingByRegion[currentRegion as RegionCode];
  const [expandedAccordion, setExpandedAccordion] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setExpandedAccordion(expandedAccordion === index ? null : index);
  };

  return (
    <div 
      className="pt-32 pb-20 relative min-h-screen overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}
    >
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
        <Reveal className="text-center max-w-[850px] mx-auto mb-24 md:mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex gap-3 items-center px-6 py-2 border bg-white/[0.03] text-brand-cyan text-[10px] font-mono uppercase tracking-[0.4em] mb-10"
            style={{ borderColor: 'var(--border)', backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
          >
            <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" /> 
            PREMIUM DIGITAL SOLUTIONS
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-medium uppercase tracking-tight mb-10 leading-[0.95]"
          >
            Transparent Pricing <br /> <span style={{ color: isDark ? '#9ca3af' : '#64748b' }}>For Every Stage Of Growth</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl font-light leading-relaxed mb-10"
            style={{ color: 'var(--text-secondary)' }}
          >
            Whether you're launching a new brand, scaling an established business, or building a custom digital platform, our solutions are tailored to your goals, operations, and future growth.
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
              to={p('/services')}
              className="inline-flex items-center justify-center border px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:border-brand-cyan/30 hover:bg-white/[0.04] min-w-[200px]"
              style={{ borderColor: 'var(--border)', backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}
            >
              View Services
            </Link>
          </motion.div>
        </Reveal>

        {/* Pricing Packages Grid */}
        <section className="mb-24 md:mb-32">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto items-stretch">
            
            {/* Starter Package */}
            <StaggerItem className="group relative p-6 sm:p-8 md:p-10 border transition-all duration-500 flex flex-col h-full" style={{ borderColor: 'var(--border)', backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'; }}>
              <div className="mb-6">
                <span className="inline-block px-3 py-1 border text-[10px] font-mono uppercase tracking-[0.2em] mb-4" style={{ borderColor: 'var(--border)', backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', color: 'var(--text-secondary)' }}>
                  Best For New Businesses
                </span>
                <h3 className="text-2xl md:text-3xl font-display font-medium mb-4 uppercase tracking-tight">Starter</h3>
                <div className="flex flex-col items-start mb-6">
                  {(() => {
                    const parts = pricing.starter.split(' (');
                    return (
                      <>
                        <span className="text-4xl md:text-5xl font-display font-medium">{parts[0]}</span>
                        {parts[1] && (
                          <span className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>({parts[1]}</span>
                        )}
                      </>
                    );
                  })()}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Ideal for startups, boutiques, personal brands, restaurants, service providers, and businesses seeking a premium online presence.
                </p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {[
                  'Custom Website Design',
                  'Up To 8 Pages',
                  'Mobile Responsive',
                  'Premium UI/UX',
                  'Contact Forms',
                  'WhatsApp Integration',
                  'Social Integrations',
                  'Domain Connection',
                  'SSL Setup',
                  'Performance Optimization',
                  'Basic SEO Setup',
                  'Launch Assistance',
                  '14 Days Support'
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <Check className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2 text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                  <Clock className="w-4 h-4" />
                  <span>Delivery: 7–14 Working Days</span>
                </div>
                <Link
                  to={p('/contact')}
                  className="inline-flex w-full items-center justify-center border px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:border-brand-cyan/30"
                  style={{ borderColor: 'var(--border)', backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}
                >
                  Request Proposal
                </Link>
              </div>
            </StaggerItem>

            {/* Business Package - Featured */}
            <StaggerItem className="group relative p-6 sm:p-8 md:p-10 border border-brand-cyan/30 shadow-2xl shadow-brand-cyan/5 transition-all duration-500 flex flex-col h-full lg:-mt-4 lg:-mb-4" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(37,99,235,0.05)' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-cyan text-black text-[10px] font-bold px-6 py-2 tracking-[0.2em] uppercase">
                Most Popular
              </div>
              
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-brand-cyan/10 border border-brand-cyan/20 text-[10px] font-mono uppercase tracking-[0.2em] text-brand-cyan mb-4">
                  Scale Your Operations
                </span>
                <h3 className="text-2xl md:text-3xl font-display font-medium mb-4 uppercase tracking-tight">Business</h3>
                <div className="flex flex-col items-start mb-6">
                  {(() => {
                    const parts = pricing.business.split(' (');
                    return (
                      <>
                        <span className="text-4xl md:text-5xl font-display font-medium">{parts[0]}</span>
                        {parts[1] && (
                          <span className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>({parts[1]}</span>
                        )}
                      </>
                    );
                  })()}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Designed for businesses that require online sales, customer management, order processing, and operational automation.
                </p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {[
                  'Everything In Starter Plus',
                  'Product Management',
                  'Shopping Cart',
                  'Checkout Flow',
                  'Payment Gateway Integration',
                  'Customer Accounts',
                  'Order Management',
                  'Admin Dashboard',
                  'Lead Management',
                  'Email Notifications',
                  'Customer Database',
                  'Advanced Forms',
                  'Workflow Automation'
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <Check className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2 text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                  <Clock className="w-4 h-4" />
                  <span>Delivery: 3–5 Weeks</span>
                </div>
                <Link
                  to={p('/contact')}
                  className="inline-flex w-full items-center justify-center bg-brand-cyan text-black px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:bg-brand-cyan/90"
                >
                  Request Proposal
                </Link>
              </div>
            </StaggerItem>

            {/* Enterprise Package */}
            <StaggerItem className="group relative p-6 sm:p-8 md:p-10 border transition-all duration-500 flex flex-col h-full" style={{ borderColor: 'var(--border)', backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'; }}>
              <div className="mb-6">
                <span className="inline-block px-3 py-1 border text-[10px] font-mono uppercase tracking-[0.2em] mb-4" style={{ borderColor: 'var(--border)', backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', color: 'var(--text-secondary)' }}>
                  Custom Digital Platforms
                </span>
                <h3 className="text-2xl md:text-3xl font-display font-medium mb-4 uppercase tracking-tight">Enterprise</h3>
                <div className="flex flex-col items-start mb-6">
                  {(() => {
                    const parts = pricing.enterprise.split(' (');
                    return (
                      <>
                        <span className="text-4xl md:text-5xl font-display font-medium">{parts[0]}</span>
                        {parts[1] && (
                          <span className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>({parts[1]}</span>
                        )}
                      </>
                    );
                  })()}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  For established companies requiring advanced platforms, marketplaces, booking systems, custom applications, and enterprise workflows.
                </p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {[
                  'Everything In Business Plus',
                  'Custom Web Applications',
                  'Enterprise Dashboards',
                  'Multi-Role Access Systems',
                  'Marketplace Platforms',
                  'Booking Systems',
                  'API Integrations',
                  'CRM Integrations',
                  'Analytics Systems',
                  'Reporting Systems',
                  'Cloud Architecture',
                  'Advanced Security',
                  'Performance Engineering',
                  'Priority Support'
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <Check className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2 text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                  <Clock className="w-4 h-4" />
                  <span>Delivery: 6–12+ Weeks</span>
                </div>
                <Link
                  to={p('/contact')}
                  className="inline-flex w-full items-center justify-center border px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:border-brand-cyan/30"
                  style={{ borderColor: 'var(--border)', backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}
                >
                  Discuss Project
                </Link>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </section>

        {/* Comparison Table - Desktop */}
        <section className="mb-24 md:mb-32">
          <Reveal className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-medium uppercase tracking-tight mb-4">Compare Features</h2>
            <p className="text-lg font-light max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>See exactly what's included in each package.</p>
          </Reveal>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <th className="text-left py-6 px-4 text-sm font-mono uppercase tracking-[0.2em] w-1/3" style={{ color: 'var(--text-secondary)' }}>Features</th>
                  <th className="text-center py-6 px-4 text-sm font-mono uppercase tracking-[0.2em]" style={{ color: 'var(--text-secondary)' }}>Starter</th>
                  <th className="text-center py-6 px-4 text-sm font-mono uppercase tracking-[0.2em] text-brand-cyan border-l" style={{ borderColor: 'var(--border)', backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>Business</th>
                  <th className="text-center py-6 px-4 text-sm font-mono uppercase tracking-[0.2em]" style={{ color: 'var(--text-secondary)' }}>Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, idx) => (
                  <tr key={idx} className="border-b transition-colors" style={{ borderColor: 'var(--border)' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                    <td className="py-4 px-4 text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{feature.name}</td>
                    <td className="py-4 px-4 text-center">
                      {feature.starter ? (
                        <Check className="w-5 h-5 text-brand-cyan mx-auto" />
                      ) : (
                        <Minus className="w-5 h-5 mx-auto" style={{ color: isDark ? '#374151' : '#d1d5db' }} />
                      )}
                    </td>
                    <td className="py-4 px-4 text-center border-l" style={{ borderColor: 'var(--border)', backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
                      {feature.business ? (
                        <Check className="w-5 h-5 text-brand-cyan mx-auto" />
                      ) : (
                        <Minus className="w-5 h-5 mx-auto" style={{ color: isDark ? '#374151' : '#d1d5db' }} />
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {feature.enterprise ? (
                        <Check className="w-5 h-5 text-brand-cyan mx-auto" />
                      ) : (
                        <Minus className="w-5 h-5 mx-auto" style={{ color: isDark ? '#374151' : '#d1d5db' }} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Accordion */}
          <div className="md:hidden space-y-3">
            {comparisonFeatures.map((feature, idx) => (
              <div key={idx} className="border" style={{ borderColor: 'var(--border)', backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex items-center justify-between py-4 px-5 text-left"
                >
                  <span className="text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{feature.name}</span>
                  <ChevronRight 
                    className={`w-5 h-5 transition-transform duration-300 ${expandedAccordion === idx ? 'rotate-90' : ''}`}
                    style={{ color: 'var(--text-secondary)' }}
                  />
                </button>
                {expandedAccordion === idx && (
                  <div className="px-5 pb-4 pt-0 grid grid-cols-3 gap-4 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="text-center pt-4">
                      <div className="text-[10px] font-mono uppercase tracking-[0.15em] mb-2" style={{ color: 'var(--text-secondary)' }}>Starter</div>
                      {feature.starter ? (
                        <Check className="w-5 h-5 text-brand-cyan mx-auto" />
                      ) : (
                        <Minus className="w-5 h-5 mx-auto" style={{ color: isDark ? '#374151' : '#d1d5db' }} />
                      )}
                    </div>
                    <div className="text-center pt-4 border-x" style={{ borderColor: 'var(--border)' }}>
                      <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-brand-cyan mb-2">Business</div>
                      {feature.business ? (
                        <Check className="w-5 h-5 text-brand-cyan mx-auto" />
                      ) : (
                        <Minus className="w-5 h-5 mx-auto" style={{ color: isDark ? '#374151' : '#d1d5db' }} />
                      )}
                    </div>
                    <div className="text-center pt-4">
                      <div className="text-[10px] font-mono uppercase tracking-[0.15em] mb-2" style={{ color: 'var(--text-secondary)' }}>Enterprise</div>
                      {feature.enterprise ? (
                        <Check className="w-5 h-5 text-brand-cyan mx-auto" />
                      ) : (
                        <Minus className="w-5 h-5 mx-auto" style={{ color: isDark ? '#374151' : '#d1d5db' }} />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Custom Solution Section */}
        <section className="mb-24 md:mb-32">
          <div className="relative overflow-hidden border p-8 md:p-12 lg:p-16" style={{ borderColor: 'var(--border)', backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
            <div className="absolute inset-0 z-0">
              <div className="absolute top-0 right-0 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl opacity-30" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl opacity-20" />
            </div>
            
            <Reveal className="relative z-10 max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium uppercase tracking-tight mb-6">Need Something Custom?</h2>
              <p className="text-lg font-light leading-relaxed mb-10" style={{ color: 'var(--text-secondary)' }}>
                Every business operates differently. If your project requires advanced integrations, automation, SaaS architecture, marketplaces, booking systems, AI features, or enterprise infrastructure, we can create a tailored solution around your exact requirements.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to={p('/contact')}
                  className="inline-flex items-center justify-center bg-brand-cyan text-black px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:bg-brand-cyan/90 min-w-[200px]"
                >
                  Book Consultation
                </Link>
                <Link
                  to={p('/contact')}
                  className="inline-flex items-center justify-center border px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:border-brand-cyan/30 min-w-[200px]"
                  style={{ borderColor: 'var(--border)', backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}
                >
                  Contact Sales
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Process / Trust Section */}
        <section className="mb-12">
          <Reveal className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-medium uppercase tracking-tight mb-4">How We Work</h2>
            <p className="text-lg font-light max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>Our proven process ensures every project is delivered with precision and excellence.</p>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {processSteps.map((step, idx) => (
              <StaggerItem key={idx} className="relative group">
                <div className="p-6 border transition-all duration-300 h-full" style={{ borderColor: 'var(--border)', backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'; }}>
                  <div className="text-4xl font-display font-medium text-brand-cyan mb-4 opacity-50">{step.number}</div>
                  <h3 className="text-lg font-display font-medium mb-3 uppercase tracking-tight">{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{step.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

      </div>
    </div>
  );
}

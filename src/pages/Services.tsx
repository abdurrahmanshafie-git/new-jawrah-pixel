import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, Sparkles, Code, Smartphone, Zap, Search, LayoutTemplate, Briefcase, Database, Server, ShoppingCart, Check } from 'lucide-react';
import { PaymentCTAGroup } from '@/components/payments/PaymentCTAGroup';
import { useRegion } from '@/hooks/useRegion';
import { useRegionalSeo } from '@/hooks/useRegionalSeo';
import { getCanonicalUrl } from '@/lib/seo/pageSeo';
import { SEO } from '@/components/layout/SEO';
import { cn } from '@/lib/utils';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';

export default function Services() {
  const { config, services, pricingPlans, isInternational, currentRegion, p } = useRegion();
  const location = useLocation();
  const isPricingRoute = /\/pricing\/?$/.test(location.pathname);
  const seo = useRegionalSeo(isPricingRoute ? 'pricing' : 'services');
  const heroCopy = isInternational
    ? 'World-class digital systems, high-converting checkout flows, AI integrations, and luxury brand interfaces built for international businesses and premium global brands. Unrivaled speed, uncompromising precision.'
    : `World-class digital systems, high-converting checkout flows, and luxury brand interfaces built natively for leading ${config.countryName} enterprises. Unrivaled speed, uncompromising precision.`;
  const retainerCopy = isInternational
    ? 'Protect your high-traffic assets with dedicated monthly engineering allocations, USD invoicing, and priority technical care for worldwide digital products.'
    : `Protect your high-traffic assets with our dedicated monthly engineering allocations. Priority technical care for ${config.countryName} systems.`;

  const getServiceIcon = (id: string) => {
    switch (id) {
      case "web-design":
      case "web-design-int":
        return <LayoutTemplate className="w-6 h-6 text-brand-blue" />;
      case "ecommerce":
      case "ecommerce-pk":
      case "ecommerce-int":
        return <ShoppingCart className="w-6 h-6 text-brand-cyan" />;
      case "jewellery":
      case "jewellery-pk":
        return <Sparkles className="w-6 h-6 text-brand-blue" />;
      case "fashion":
      case "fashion-pk":
        return <Briefcase className="w-6 h-6 text-brand-cyan" />;
      case "dashboards":
      case "dashboards-pk":
      case "saas-int":
      case "frontend-int":
      case "enterprise-int":
        return <Server className="w-6 h-6 text-brand-blue" />;
      case "seo":
      case "seo-pk":
      case "seo-int":
        return <Search className="w-6 h-6 text-brand-cyan" />;
      default:
        return <Database className="w-6 h-6 text-brand-cyan" />;
    }
  };

  const getServiceLandingPath = (id: string) => {
    if (currentRegion === 'lk') {
      if (id === 'web-design') return '/services/web-design-sri-lanka';
      if (id === 'ecommerce') return '/services/ecommerce-development-sri-lanka';
      if (id === 'seo') return '/services/seo-services-sri-lanka';
    }

    if (currentRegion === 'pk') {
      if (id === 'web-design') return '/services/web-design-pakistan';
      if (id === 'ecommerce-pk') return '/services/ecommerce-development-pakistan';
    }

    if (currentRegion === 'int') {
      if (['web-design-int', 'ecommerce-int', 'seo-int', 'saas-int', 'frontend-int', 'enterprise-int'].includes(id)) {
        return '/services/international-digital-services';
      }
    }

    return '';
  };

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

      <div className="container mx-auto px-6 relative z-10">
        <Reveal className="text-center max-w-4xl mx-auto mb-24 md:mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex gap-3 items-center px-6 py-2 border border-white/5 rounded-none bg-white/[0.03] text-brand-blue text-[10px] font-mono uppercase tracking-[0.4em] mb-10"
          >
            <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" /> Agency Capabilities
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl lg:text-8xl font-display font-medium uppercase tracking-tight mb-10 leading-[0.95]"
          >
            Strategic <br /> <span className="premium-text-gradient italic">Systems</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto"
          >
            {heroCopy}
          </motion.p>
        </Reveal>

        {/* Services mapping */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-32 md:mb-48">
          {services.map((service) => (
            <StaggerItem
              key={service.title}
              className="group relative p-12 bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-700 flex flex-col"
            >
              <div className="mb-10 text-brand-blue group-hover:scale-110 group-hover:text-white transition-all duration-500">
                {getServiceIcon(service.id)}
              </div>
              <h3 className="text-2xl font-display font-medium text-white mb-4 uppercase tracking-tight group-hover:text-brand-blue transition-colors">{service.title}</h3>
              <div className="text-xs font-mono font-bold text-zinc-500 mb-10 tracking-[0.2em] uppercase">{service.price}</div>
              <ul className="space-y-6 mb-12 flex-1">
                {service.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-4 text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                    <Shield className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div className="pt-8 border-t border-white/5 flex flex-col gap-6">
                {getServiceLandingPath(service.id) && (
                  <Link
                    to={p(getServiceLandingPath(service.id))}
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-blue hover:text-white transition-colors"
                  >
                    View Specialization
                  </Link>
                )}
                <PaymentCTAGroup serviceName={service.title} priceLabel={service.price} compact />
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-brand-blue to-brand-cyan scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Maintenance Plans */}
        <div className="mt-32 md:mt-48 pb-20">
          <Reveal className="text-center mb-24 md:mb-32">
            <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold block mb-6">Operations</span>
            <h2 className="text-4xl md:text-6xl font-display font-medium uppercase tracking-tight text-white mb-8">Service Level Agreements</h2>
            <p className="text-zinc-500 text-lg font-light max-w-2xl mx-auto leading-relaxed">{retainerCopy}</p>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto items-stretch">
            {pricingPlans.map((plan) => (
              <StaggerItem
                key={plan.name}
                className={cn(
                  "relative p-12 bg-white/[0.02] border border-white/5 flex flex-col transition-all duration-700",
                  plan.isRecommended 
                    ? "bg-white/[0.04] border-brand-blue/30 shadow-2xl shadow-brand-blue/5" 
                    : "hover:bg-white/[0.03]"
                )}
              >
                {plan.isRecommended && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-blue text-white text-[10px] font-bold px-6 py-2 tracking-[0.2em] uppercase">
                    Recommended
                  </div>
                )}
                <div className="mb-12">
                  <h3 className="text-xl font-display font-medium text-white mb-6 uppercase tracking-[0.2em]">{plan.name}</h3>
                  <div className="flex flex-col gap-2">
                    <span className="text-4xl font-display font-medium text-white tracking-tighter">{plan.price}</span>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-6 mb-16 flex-1">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex gap-4 text-sm text-zinc-400 items-start leading-relaxed">
                      <Zap className={cn("w-4 h-4 shrink-0 mt-0.5", plan.isRecommended ? "text-brand-blue" : "text-zinc-600")} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-8 border-t border-white/5">
                  <PaymentCTAGroup
                    serviceName={`${plan.name} SLA`}
                    priceLabel={plan.price}
                    compact
                  />
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>


          {config.id === 'pk' && (
            <Reveal className="mt-12 text-center max-w-md mx-auto p-4 rounded-xl border border-white/5 bg-slate-900/40 backdrop-blur-sm">
              <span className="text-[10px] tracking-widest text-brand-cyan uppercase font-semibold block mb-2">Flexible Pakistani Payments</span>
              <p className="text-xs text-brand-gray leading-relaxed">
                We accept Easypaisa, JazzCash, secure bank transfers (IBAN updates provided at invoice lock), and installment billing structures.
              </p>
            </Reveal>
          )}
          {config.id === 'int' && (
            <Reveal className="mt-12 text-center max-w-xl mx-auto p-4 rounded-xl border border-white/5 bg-slate-900/40 backdrop-blur-sm">
              <span className="text-[10px] tracking-widest text-brand-cyan uppercase font-semibold block mb-2">International USD Payments</span>
              <p className="text-xs text-brand-gray leading-relaxed">
                We support PayPal, Wise, international bank transfer, Visa, and Mastercard for global clients and remote-first teams.
              </p>
            </Reveal>
          )}
        </div>
      </div>
    </div>
  );
}

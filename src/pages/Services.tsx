import React from 'react';
import { motion } from 'motion/react';
import { Shield, Sparkles, Code, Smartphone, Zap, Search, LayoutTemplate, Briefcase, Database, Server, ShoppingCart, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { PaymentCTAGroup } from '@/components/payments/PaymentCTAGroup';
import { useRegion } from '@/hooks/useRegion';
import { useRegionalSeo } from '@/hooks/useRegionalSeo';
import { getCanonicalUrl } from '@/lib/seo/pageSeo';
import { SEO } from '@/components/layout/SEO';
import { cn } from '@/lib/utils';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';

export default function Services() {
  const { config, services, pricingPlans, p, isInternational } = useRegion();
  const seo = useRegionalSeo('services');
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

  return (
    <div className="pt-28 pb-20 bg-brand-black text-white relative min-h-screen">
      <SEO 
        title={seo.title}
        description={seo.description}
        canonicalUrl={getCanonicalUrl(seo.path)}
        schemaType={seo.schemaType}
        schemaData={seo.schemaData}
      />

      <div className="container mx-auto px-5 md:px-6">
        <Reveal className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex gap-2 items-center px-4 py-1.5 border border-brand-cyan/25 rounded-full bg-slate-900/40 text-brand-cyan text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] mb-6 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
          >
            <Zap size={12} className="fill-brand-cyan animate-pulse" /> Agency Capabilities
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-6xl font-display font-medium uppercase tracking-tight mb-6 leading-tight"
          >
            Strategic Services & <br className="sm:hidden" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue">Ecosystems</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-brand-gray text-[13px] sm:text-base md:text-lg font-light leading-relaxed px-2 sm:px-0"
          >
            {heroCopy}
          </motion.p>
        </Reveal>

        {/* Services mapping */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-24 md:mb-32">
          {services.map((service) => (
            <StaggerItem
              key={service.title}
              className="glass-card p-8 sm:p-10 rounded-2xl flex flex-col h-full border-t border-white/10 hover:border-brand-blue/40 duration-300 transition-all group"
            >
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                {getServiceIcon(service.id)}
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-2 uppercase tracking-tight group-hover:text-brand-cyan transition-colors">{service.title}</h3>
              <div className="text-sm sm:text-base text-brand-cyan font-mono font-bold mb-6 tracking-wider">{service.price}</div>
              <ul className="space-y-4 mb-8 flex-1">
                {service.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-[12px] sm:text-sm text-brand-silver leading-relaxed">
                    <Shield className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
              <PaymentCTAGroup serviceName={service.title} priceLabel={service.price} compact />
              <Link to={p('/contact')} className="block mt-3">
                <Button variant="ghost" className="w-full text-[11px] font-mono uppercase tracking-widest h-10 border border-white/5 text-brand-gray hover:text-white hover:bg-white/5">
                  Inquire Now
                </Button>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Maintenance Plans */}
        <div className="mt-24 md:mt-40">
          <Reveal className="text-center mb-12 md:mb-24 px-4">
            <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-[0.4em] font-bold block mb-4">Ongoing Retainers</span>
            <h2 className="text-3xl sm:text-3xl md:text-5xl font-display font-medium uppercase tracking-tight text-white mb-4 leading-tight">Service Level Agreements</h2>
            <p className="text-brand-gray text-[13px] sm:text-sm font-light max-w-xl mx-auto leading-relaxed">{retainerCopy}</p>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
            {pricingPlans.map((plan) => (
              <StaggerItem
                key={plan.name}
                className={cn(
                  "glass-card p-8 sm:p-10 rounded-2xl border border-white/5 flex flex-col justify-between h-full relative transition-all duration-500",
                  plan.isRecommended 
                    ? "border-brand-blue/30 glow-blue lg:-translate-y-4 bg-brand-navy/60 z-10 shadow-[0_0_40px_rgba(59,130,246,0.15)]" 
                    : "hover:border-white/20"
                )}
              >
                {plan.isRecommended && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-blue text-white text-[10px] font-mono font-bold px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                    RECOMMENDED
                  </div>
                )}
                <div>
                  <h3 className="text-lg sm:text-xl font-display font-bold text-white mb-4 uppercase tracking-widest">{plan.name}</h3>
                  <div className={cn("font-bold mb-6 font-mono tracking-tight", plan.isRecommended ? "text-brand-cyan text-3xl sm:text-4xl" : "text-white text-2xl sm:text-3xl")}>
                    {plan.price}
                    <span className="text-[10px] font-mono font-light text-brand-gray block mt-1 uppercase tracking-[0.2em]">{plan.period}</span>
                  </div>
                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex gap-3 text-[12px] sm:text-sm text-brand-silver items-start leading-relaxed">
                        {plan.isRecommended ? (
                          <Check className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                        ) : (
                          <Zap className="w-4 h-4 text-brand-gray shrink-0 mt-0.5" />
                        )}
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-auto">
                  <PaymentCTAGroup
                    serviceName={`${plan.name} SLA`}
                    priceLabel={plan.price}
                    compact
                  />
                  <Link to={p('/contact')} className="block mt-3">
                    <Button
                      variant="ghost"
                      className={cn(
                        'w-full uppercase font-mono tracking-widest text-[11px] h-10 border border-white/10 text-brand-gray hover:text-white hover:bg-white/5',
                      )}
                    >
                      Select Plan
                    </Button>
                  </Link>
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

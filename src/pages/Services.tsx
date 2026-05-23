import React from 'react';
import { motion } from 'motion/react';
import { Shield, Sparkles, Code, Smartphone, Zap, Search, LayoutTemplate, Briefcase, Database, Server, ShoppingCart, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { useRegion } from '@/hooks/useRegion';
import { SEO } from '@/components/layout/SEO';
import { cn } from '@/lib/utils';

export default function Services() {
  const { config, services, pricingPlans, p } = useRegion();

  const getServiceIcon = (id: string) => {
    switch (id) {
      case "web-design":
        return <LayoutTemplate className="w-6 h-6 text-brand-blue" />;
      case "ecommerce-development":
        return <ShoppingCart className="w-6 h-6 text-brand-cyan" />;
      case "jewellery-websites":
        return <Sparkles className="w-6 h-6 text-brand-blue" />;
      case "fashion-brands":
        return <Briefcase className="w-6 h-6 text-brand-cyan" />;
      case "admin-dashboards":
        return <Server className="w-6 h-6 text-brand-blue" />;
      case "seo-optimization":
        return <Search className="w-6 h-6 text-brand-cyan" />;
      default:
        return <Database className="w-6 h-6 text-brand-cyan" />;
    }
  };

  return (
    <div className="pt-32 pb-24 bg-brand-black text-white relative min-h-screen">
      <SEO 
        title={`${config.countryName} Custom Web & Ecommerce Packages`}
        description={`View direct transparent pricing for premium website design, custom e-commerce applications, and monthly SLA care plans in ${config.countryName}.`}
      />

      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-20 animate-fade-in">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex gap-2 items-center px-2 py-1 sm:px-3.5 sm:py-1.5 border border-brand-cyan/20 rounded-full bg-slate-900/40 text-brand-cyan text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] sm:tracking-[0.25em] mb-4 sm:mb-6"
          >
            <Zap size={10} className="fill-brand-cyan animate-pulse sm:w-3 sm:h-3" /> Agency Capabilities
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-6xl font-display font-medium uppercase tracking-tight mb-4 sm:mb-6"
          >
            Strategic Services & <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue">Ecosystems</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-brand-gray text-[11px] sm:text-base md:text-lg font-light leading-relaxed px-4"
          >
            World-class digital systems, high-converting checkout flows, and luxury brand interfaces built natively for leading {config.countryName} enterprises. Unrivaled speed, uncompromising precision.
          </motion.p>
        </div>

        {/* Services mapping */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8 mb-24">
          {services.map((service, i) => (
            <motion.div 
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-5 sm:p-8 rounded-2xl flex flex-col h-full border-t border-white/10 hover:border-brand-blue/40 duration-300 transition-all"
            >
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                {getServiceIcon(service.id)}
              </div>
              <h3 className="text-base sm:text-2xl font-display font-bold text-white mb-1 sm:mb-2">{service.title}</h3>
              <div className="text-xs sm:text-base text-brand-cyan font-semibold mb-3 sm:mb-6">{service.price}</div>
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 flex-1">
                {service.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2 sm:gap-3 text-[10px] sm:text-sm text-brand-silver">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-brand-blue shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to={p('/contact')}>
                <Button variant="outline" className="w-full text-[10px] sm:text-sm h-9 sm:h-11 group hover:border-brand-blue">
                  Inquire Now
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Maintenance Plans */}
        <div className="mt-24 md:mt-32">
          <div className="text-center mb-10 md:mb-16 px-4">
            <span className="text-[9px] sm:text-[10px] font-mono text-brand-cyan uppercase tracking-widest font-bold block mb-2">Ongoing Retainers</span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-medium uppercase tracking-tight text-white mb-3 sm:mb-4 leading-tight">Service Level Agreements</h2>
            <p className="text-brand-gray text-[10px] sm:text-sm font-light max-w-xl mx-auto leading-relaxed">Protect your high-traffic assets with our dedicated monthly engineering allocations. Priority technical care for {config.countryName} systems.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <div 
                key={plan.name}
                className={cn(
                  "glass-card p-5 sm:p-8 rounded-2xl border-white/5 flex flex-col justify-between h-full relative",
                  plan.isRecommended 
                    ? "border-brand-blue/30 glow-blue md:-translate-y-4 bg-brand-navy/80 z-10" 
                    : ""
                )}
              >
                {plan.isRecommended && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-blue text-white text-[9px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                    RECOMMENDED
                  </div>
                )}
                <div>
                  <h3 className="text-sm sm:text-xl font-display font-medium text-white mb-2 uppercase tracking-wide">{plan.name}</h3>
                  <div className={cn("font-bold mb-4 sm:mb-6 font-mono tracking-tight", plan.isRecommended ? "text-brand-cyan text-xl sm:text-4xl" : "text-brand-gray text-lg sm:text-3xl")}>
                    {plan.price}
                    <span className="text-[9px] sm:text-xs font-mono font-light text-brand-gray block mt-0.5 sm:mt-1 uppercase tracking-widest">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex gap-2 sm:gap-3 text-[9px] sm:text-sm text-brand-silver items-start">
                        {plan.isRecommended ? (
                          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-brand-blue shrink-0 mt-0.5" />
                        ) : (
                          <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-brand-gray shrink-0 mt-0.5" />
                        )}
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link to={p('/contact')}>
                  <Button 
                    variant={plan.isRecommended ? "default" : "ghost"} 
                    className={cn("w-full uppercase font-mono tracking-widest text-[9px] sm:text-[10px] font-bold h-9 sm:h-11", !plan.isRecommended ? "border border-white/10 hover:bg-white/5" : "luxury-glow")}
                  >
                    Select Plan
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {config.id === 'pk' && (
            <div className="mt-12 text-center max-w-md mx-auto p-4 rounded-xl border border-white/5 bg-slate-900/40 backdrop-blur-sm">
              <span className="text-[10px] tracking-widest text-brand-cyan uppercase font-semibold block mb-2">Flexible Pakistani Payments</span>
              <p className="text-xs text-brand-gray leading-relaxed">
                We accept Easypaisa, JazzCash, secure bank transfers (IBAN updates provided at invoice lock), and installment billing structures.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



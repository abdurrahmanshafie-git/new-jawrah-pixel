import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { submitInquiry } from '@/lib/supabase/api';
import { notifyInquiryReceived } from '@/lib/email/notifications';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { isValidEmail } from '@/lib/validation';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { useRegion } from '@/hooks/useRegion';
import { SEO } from '@/components/layout/SEO';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';
import { 
  ShieldCheck, 
  ArrowRight, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  CheckCircle, 
  Percent, 
  Zap, 
  DollarSign, 
  HelpCircle,
  Briefcase,
  Layers,
  Award
} from 'lucide-react';

export default function Agents() {
  const { config, p } = useRegion();
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [location, setLocation] = useState(config.locations[0]);
  const [profileLink, setProfileLink] = useState('');
  const [experience, setExperience] = useState('');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Scroll to section helper
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMsg('');
    setIsSuccess(false);

    if (!name.trim() || !isValidEmail(email)) {
      setErrorMsg('Enter your full name and a valid email address.');
      setIsSubmitting(false);
      return;
    }

    if (!isSupabaseConfigured) {
      setErrorMsg('Application service is temporarily unavailable. Please email us directly.');
      setIsSubmitting(false);
      return;
    }

    try {
      const fullMessage = `
--- AGENT NETWORK JET-START APPLICATION ---
Location: ${location}
Profile/LinkedIn Link: ${profileLink || 'None Provided'}
Sales / Marketing Experience: ${experience}
Applicant Message: ${message || 'No extra notes.'}
      `.trim();

      const { error } = await submitInquiry({
        full_name: name.trim(),
        email: email.trim(),
        whatsapp: whatsapp.trim() || null,
        business_name: `Agent Application — ${location}`,
        service_interested: 'Agent Application',
        inquiry_type: 'collaboration',
        budget_range: 'Referral Program',
        message: fullMessage,
        country: config.countryName,
        region: config.id,
        source_page: config.id,
        status: 'new',
      });

      if (error) throw error;

      void notifyInquiryReceived({
        fullName: name.trim(),
        email: email.trim(),
        service: 'Agent Application',
      });

      setIsSuccess(true);
      setName('');
      setEmail('');
      setWhatsapp('');
      setProfileLink('');
      setExperience('');
      setMessage('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit application. Please try again.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tiers = config.id === 'lk' ? [
    {
      level: 'Bronze Tier',
      volume: 'Standard Projects',
      budget: 'Under LKR 1,000,000',
      rate: '10% Commission',
      reward: 'Up to LKR 100,000',
      focus: 'Ideal for starter websites, foundational branding, and simple SEO implementation.',
      color: 'border-amber-700/30 text-amber-500 bg-amber-500/5'
    },
    {
      level: 'Silver Tier',
      volume: 'Signature Projects',
      budget: 'LKR 1,000,000 - 2,500,000',
      rate: '10% Commission',
      reward: 'Up to LKR 250,000',
      focus: 'High-performance e-commerce platforms, customized corporate systems, and full stack database architecture.',
      color: 'border-slate-400/30 text-slate-300 bg-slate-300/5 shadow-[0_0_20px_rgba(255,255,255,0.02)]'
    },
    {
      level: 'Gold Tier',
      volume: 'Bespoke Enterprise',
      budget: 'LKR 2,500,000+',
      rate: '12% Commission',
      reward: 'LKR 300,000+ Unlimited',
      focus: 'Scalable CRM solutions, complex customized SaaS applications, and global multinational portals.',
      color: 'border-brand-cyan/30 text-brand-cyan bg-brand-cyan/5 shadow-[0_0_25px_rgba(34,211,238,0.1)] font-bold'
    }
  ] : [
    {
      level: 'Bronze Tier',
      volume: 'Standard Projects',
      budget: 'Under PKR 800,000',
      rate: '10% Commission',
      reward: 'Up to PKR 80,000',
      focus: 'Ideal for starter websites, foundational branding, and simple SEO implementation.',
      color: 'border-amber-700/30 text-amber-500 bg-amber-500/5'
    },
    {
      level: 'Silver Tier',
      volume: 'Signature Projects',
      budget: 'PKR 800,000 - 2,400,000',
      rate: '10% Commission',
      reward: 'Up to PKR 240,000',
      focus: 'High-performance e-commerce platforms, customized corporate systems, and full stack database architecture.',
      color: 'border-slate-400/30 text-slate-300 bg-slate-300/5 shadow-[0_0_20px_rgba(255,255,255,0.02)]'
    },
    {
      level: 'Gold Tier',
      volume: 'Bespoke Enterprise',
      budget: 'PKR 2,400,000+',
      rate: '12% Commission',
      reward: 'PKR 288,000+ Unlimited',
      focus: 'Scalable CRM solutions, complex customized SaaS applications, and global multinational portals.',
      color: 'border-brand-cyan/30 text-brand-cyan bg-brand-cyan/5 shadow-[0_0_25px_rgba(34,211,238,0.1)] font-bold'
    }
  ];

  const locationOptions = config.id === 'lk' ? [
    { value: 'Colombo', label: 'Colombo Hub (Sri Lanka)' },
    { value: 'Galle', label: 'Galle Hub (Sri Lanka)' },
    { value: 'Kandy', label: 'Kandy Hub (Sri Lanka)' },
    { value: 'Other', label: 'Other Remote regions' }
  ] : [
    { value: 'Lahore', label: 'Lahore Hub (Pakistan)' },
    { value: 'Karachi', label: 'Karachi Hub (Pakistan)' },
    { value: 'Islamabad', label: 'Islamabad Hub (Pakistan)' },
    { value: 'Other', label: 'Other Remote regions' }
  ];

  const targetGroups = [
    {
      title: 'Freelance Consultants',
      description: 'Offer world-class tech, brand UI/UX, database services, and systems to your clients without handling any code or deployment load.',
      icon: Briefcase
    },
    {
      title: 'Digital Marketers',
      description: 'Provide pristine e-commerce pipelines, stunning web design speed, and solid SEO foundations to optimize your ad spend.',
      icon: Percent
    },
    {
      title: 'Business Connectors',
      description: 'Monetize your corporate network by identifying founders, executives, or brands that need superior technological capabilities.',
      icon: Users
    },
    {
      title: 'Ambitious Individuals',
      description: 'Step into the premium, high-value software agency scene with our complete world-class design, engineering, and maintenance team support.',
      icon: Award
    }
  ];

  return (
    <div className="bg-brand-black text-white relative min-h-screen pt-32 pb-24 font-sans overflow-hidden">
      <SEO 
        title={`Partner Network & Referral Program | ${config.countryName}`}
        description={`Join the Jawrah Pixel agent network in ${config.countryName}. Refer elite businesses, manage pipelines, and receive industry-leading 12% commission rewards.`}
      />
      {/* Background radial overlays for luxury look */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-cyan/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* Main Container */}
      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
        
        {/* HERO SECTION */}
        <div className="text-center max-w-4xl mx-auto mb-20 md:mb-28">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/25 text-brand-cyan text-xs font-mono uppercase tracking-widest mb-6"
          >
            <ShieldCheck size={12} />
            Jawrah Pixel Partner Program
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-semibold mb-6 tracking-tight uppercase leading-[1.1]"
          >
            Become a <br/>
            <span className="text-brand-cyan drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">Jawrah Pixel Member</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-brand-gray text-base md:text-xl mb-10 leading-relaxed max-w-2xl mx-auto"
          >
            Earn substantial commissions by connecting businesses with our high-performance design formats, ecommerce stores, dashboards, custom branding, SEO foundations, and full-stack software implementation.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-3 md:flex md:flex-wrap items-center justify-center gap-2 md:gap-4 max-w-xs sm:max-w-lg mx-auto md:max-w-none"
          >
            <Link to="/signup" className="w-full sm:w-auto">
              <Button className="w-full md:w-auto px-4 md:px-8 h-10 md:h-14 uppercase tracking-widest md:tracking-wider text-[10px] sm:text-[9px] md:text-xs font-semibold select-none leading-tight py-1">
                Create Account
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={() => scrollToSection('agent-application')}
              className="w-full sm:w-auto px-4 md:px-8 h-10 md:h-14 border-white/10 uppercase tracking-widest md:tracking-wider text-[10px] sm:text-[9px] md:text-xs transition-colors hover:bg-white/5 leading-tight py-1"
            >
              Apply Now
            </Button>
            <a 
              href="https://wa.me/94762737411?text=Hello%20Jawrah%20Pixel%2C%20I%20want%20to%20apply%20to%20join%20the%20Agent%20Network." 
              target="_blank" 
              referrerPolicy="no-referrer"
              className="w-full sm:w-auto inline-flex items-center justify-center h-10 md:h-14 px-4 md:px-8 border border-[#25D366]/30 bg-[#25D366]/5 hover:bg-[#25D366]/10 text-white rounded-none md:rounded-sm font-medium tracking-widest md:tracking-wider uppercase text-[10px] sm:text-[9px] md:text-xs transition-colors text-center leading-tight py-1"
            >
              Contact WA
            </a>
          </motion.div>

          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="block text-xs font-mono uppercase tracking-widest text-brand-silver mt-6"
          >
            ● Per confirmed project introduced by you to Jawrah Pixel.
          </motion.span>
        </div>

        {/* HOW IT WORKS SECTION */}
        <div className="py-16 md:py-24 border-t border-white/5 mb-20">
          <Reveal className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-mono text-brand-cyan tracking-[0.2em] uppercase font-bold">Execution Path</span>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-white uppercase tracking-tight mt-2 mb-4">How It Works</h2>
            <p className="text-sm text-brand-gray">
              A meticulously engineered partner flow — from simple business introduction to instant commission.
            </p>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {[
              {
                step: '01',
                title: 'Introduce',
                desc: 'Connect with business founders or decision-makers who need websites, e-commerce networks, enterprise CRM platforms, branding, or digital systems.'
              },
              {
                step: '02',
                title: 'Propose',
                desc: 'Jawrah Pixel conducts the discovery session, engineers the architecture proposal, drafts plans, and runs client strategy calls using our premium processes.'
              },
              {
                step: '03',
                title: 'Confirm',
                desc: 'Once the applicant accepts the calculated plan scope and deposits the lock-in reservation fee, you are credited for the active client acquisition.'
              },
              {
                step: '04',
                title: 'Earn',
                desc: 'Earn high-tier payouts immediately upon first milestone completion. Track your progress live in our specialized workspace portal.'
              }
            ].map((item, idx) => (
              <StaggerItem
                key={idx} 
                className="group p-4 sm:p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-brand-cyan/20 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="text-2xl sm:text-5xl font-mono font-bold text-white/5 group-hover:text-brand-cyan/10 transition-colors mb-2 sm:mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xs sm:text-xl font-display font-medium text-white mb-1 sm:mb-2 uppercase tracking-wide group-hover:text-brand-cyan transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[9px] sm:text-xs text-brand-silver leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="h-0.5 bg-brand-cyan/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left mt-4 sm:mt-6"></div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* COMMISSION TIERS SECTION */}
        <div className="py-16 md:py-24 border-t border-white/5 mb-20">
          <Reveal className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-mono text-brand-cyan tracking-[0.2em] uppercase font-bold">Incentives Framework</span>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-white uppercase tracking-tight mt-2 mb-4">Commission Tiers</h2>
            <p className="text-sm text-brand-gray">
              Engineered payouts tailored for connectors who identify serious digital modernization projects.
            </p>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {tiers.map((tier, idx) => (
              <StaggerItem
                key={idx} 
                className={`flex flex-col justify-between p-4 sm:p-8 rounded-2xl border ${tier.color} transition-all duration-300 relative group`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4 sm:mb-6">
                    <div>
                      <span className="text-[8px] sm:text-xs font-mono uppercase tracking-widest text-brand-gray">{tier.volume}</span>
                      <h3 className="text-sm sm:text-2xl font-display font-semibold tracking-wide text-white uppercase mt-0.5 sm:mt-1">
                        {tier.level}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-8">
                    <div className="border-b border-white/10 pb-2 sm:pb-4">
                      <span className="text-[8px] sm:text-[10px] font-mono text-brand-gray uppercase tracking-widest block mb-0.5">Budget Scale</span>
                      <span className="text-[10px] sm:text-lg font-semibold text-white">{tier.budget}</span>
                    </div>

                    <div className="border-b border-white/10 pb-2 sm:pb-4">
                      <span className="text-[8px] sm:text-[10px] font-mono text-brand-gray uppercase tracking-widest block mb-0.5">Commission Frame</span>
                      <span className="text-[10px] sm:text-lg font-semibold text-brand-cyan">{tier.rate}</span>
                    </div>

                    <div>
                      <span className="text-[8px] sm:text-[10px] font-mono text-brand-gray uppercase tracking-widest block mb-0.5">Target Reward</span>
                      <span className="text-xs sm:text-2xl font-mono font-bold text-white tracking-tight">{tier.reward}</span>
                    </div>
                  </div>

                  <p className="text-[8.5px] sm:text-xs text-brand-silver leading-relaxed border-t border-white/5 pt-3 sm:pt-4">
                    {tier.focus}
                  </p>
                </div>
                
                <div className="mt-4 sm:mt-8">
                  <button 
                    onClick={() => scrollToSection('agent-application')}
                    className="w-full flex items-center justify-between py-2.5 sm:py-3 px-3 sm:px-4 border border-white/10 rounded group-hover:border-brand-cyan/40 bg-white/5 group-hover:bg-brand-cyan/10 transition-all text-[8px] sm:text-xs text-white uppercase font-mono tracking-widest"
                  >
                    <span>Secure Slot Now</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* WHO CAN JOIN SECTION */}
        <div className="py-16 md:py-24 border-t border-white/5 mb-20">
          <Reveal className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-mono text-brand-cyan tracking-[0.2em] uppercase font-bold">Network Spectrum</span>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-white uppercase tracking-tight mt-2 mb-4">Who Can Join</h2>
            <p className="text-sm text-brand-gray">
              Our network accommodates anyone with direct channel access to business clients ready for system modernization.
            </p>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            {targetGroups.map((group, idx) => {
              const Icon = group.icon;
              return (
                <StaggerItem
                  key={idx}
                  className="p-4 sm:p-8 bg-white/[0.01] border border-white/5 hover:border-white/10 rounded-2xl transition-all duration-300 flex flex-col sm:flex-row items-start gap-3 sm:gap-5 group"
                >
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-brand-cyan/10 border border-brand-cyan/25 flex items-center justify-center text-brand-cyan rounded-lg shrink-0 group-hover:bg-brand-cyan/20 transition-all">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <h3 className="text-[10px] sm:text-xl font-display font-medium text-white uppercase tracking-wide">
                      {group.title}
                    </h3>
                    <p className="text-[8px] sm:text-xs text-brand-silver leading-relaxed">
                      {group.description}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>

        {/* AGENT APPLICATION FORM SECTION */}
        <div id="agent-application" className="py-16 md:py-24 border-t border-white/5 relative">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Context block */}
            <Reveal className="lg:col-span-5 space-y-6">
              <span className="text-[10px] font-mono text-brand-cyan tracking-[0.2em] uppercase font-bold block">Apply To Network</span>
              <h2 className="text-3xl md:text-4xl font-display font-medium text-white uppercase tracking-tight leading-tight">
                Submit Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue">Partner Application</span>
              </h2>
              <p className="text-sm text-brand-gray leading-relaxed">
                Connect your details, location, social links, and sales experience with us. Once received, our regional relationship team will audit your application profile and contact you within 24–48 hours to complete authorization of your workspace portal setup.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3.5 text-xs text-brand-silver font-mono uppercase tracking-widest">
                  <CheckCircle size={16} className="text-brand-cyan shrink-0" />
                  <span>Real-time Referral dashboards</span>
                </div>
                <div className="flex items-center gap-3.5 text-xs text-brand-silver font-mono uppercase tracking-widest">
                  <CheckCircle size={16} className="text-brand-cyan shrink-0" />
                  <span>24/7 Client Account Executive support</span>
                </div>
                <div className="flex items-center gap-3.5 text-xs text-brand-silver font-mono uppercase tracking-widest">
                  <CheckCircle size={16} className="text-brand-cyan shrink-0" />
                  <span>Interactive AI Proposal generators</span>
                </div>
              </div>
            </Reveal>

            {/* Form card */}
            <Reveal delay={0.08} className="lg:col-span-7 glass-card p-5 sm:p-8 rounded-2xl border border-white/10 relative overflow-hidden bg-white/[0.02]">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-cyan/5 rounded-full blur-[60px] pointer-events-none"></div>
              
              {isSuccess ? (
                <div className="text-center py-10 px-4 flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 bg-brand-cyan/10 border border-brand-cyan/30 rounded-full flex items-center justify-center text-brand-cyan mb-2">
                    <CheckCircle className="animate-pulse" size={32} />
                  </div>
                  <h3 className="text-2xl font-display font-semibold text-white uppercase">Application Transmitted</h3>
                  <p className="text-sm text-brand-silver max-w-md leading-relaxed">
                    Thank you. Your Agent Network application has been dispatched successfully. An Executive Partner will review your sales experience profile and contact your WhatsApp contact node shortly.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsSuccess(false)}
                    className="mt-6 uppercase font-mono tracking-widest text-[10px]"
                  >
                    Submit Another Application
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4 sm:space-y-5">
                  
                  {errorMsg && (
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center font-semibold">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-brand-silver font-mono uppercase tracking-widest">Full Name</label>
                      <Input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="e.g. Ruwan de Silva"
                        className="h-10 text-xs bg-brand-black/50 border-white/5 focus-visible:ring-brand-cyan"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-brand-silver font-mono uppercase tracking-widest">Email Address</label>
                      <Input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="e.g. ruwan@example.com"
                        className="h-10 text-xs bg-brand-black/50 border-white/5 focus-visible:ring-brand-cyan"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-brand-silver font-mono uppercase tracking-widest">WhatsApp Number</label>
                      <Input 
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        required
                        placeholder="e.g. +94762737411"
                        className="h-10 text-xs bg-brand-black/50 border-white/5 focus-visible:ring-brand-cyan"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-brand-silver font-mono uppercase tracking-widest">Location Hub</label>
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="flex h-10 w-full rounded-sm border border-white/10 bg-brand-navy/50 px-3 py-2 text-xs text-brand-gray/80 ring-offset-brand-black file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-brand-gray/50 focus-visible:outline-none focus:border-brand-cyan transition-colors duration-200 backdrop-blur-md"
                      >
                        {locationOptions.map(opt => (
                          <option key={opt.value} value={opt.value} className="bg-brand-navy">{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-brand-silver font-mono uppercase tracking-widest">LinkedIn / social media url</label>
                      <Input 
                        type="url"
                        value={profileLink}
                        onChange={(e) => setProfileLink(e.target.value)}
                        placeholder="e.g. https://linkedin.com/..."
                        className="h-10 text-xs bg-brand-black/50 border-white/5 focus-visible:ring-brand-cyan"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-brand-silver font-mono uppercase tracking-widest">Sales & Marketing Experience Brief</label>
                    <Textarea 
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      required
                      placeholder="business fields you cover, potential target clients, or previous referral models."
                      className="bg-brand-black/50 border-white/5 focus-visible:ring-brand-cyan min-h-[70px] text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-brand-silver font-mono uppercase tracking-widest">Message / Comments (Optional)</label>
                    <Textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Any additional notes..."
                      className="bg-brand-black/50 border-white/5 focus-visible:ring-brand-cyan min-h-[60px] text-xs"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full text-[10px] font-semibold uppercase tracking-widest luxury-glow select-none h-11"
                  >
                    {isSubmitting ? 'Transmitting Profile...' : 'Apply to Network'}
                  </Button>

                </form>
              )}
            </Reveal>

          </div>

        </div>

      </div>
    </div>
  );
}

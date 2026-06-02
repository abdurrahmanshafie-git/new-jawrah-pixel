import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { applyAsAgent } from '@/lib/supabase/agent-api';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { tierCardsForRegion } from '@/lib/agent/tiers';
import { isValidEmail } from '@/lib/validation';
import { FormAuthGate } from '@/components/auth/FormAuthGate';
import { useAuth } from '@/contexts/AuthContext';
import { clearFormDraft, loadFormDraft, saveFormDraft } from '@/lib/email/formDrafts';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { useRegion } from '@/hooks/useRegion';
import { SEO } from '@/components/layout/SEO';
import { toAbsoluteUrl } from '@/lib/env';
import { trackEvent, ANALYTICS_EVENTS, trackLead } from '@/lib/analytics';
import { TurnstileCaptcha } from '@/components/ui/TurnstileCaptcha';
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

export default function Partner() {
  const { config, p } = useRegion();
  const { user } = useAuth();
  const isInternational = config.id === 'int';
  const initialCity = isInternational ? 'Global Remote' : 'Remote-First Agency';
  const seoTitle = 'Become a Jawrah Pixel Partner';
  const seoDescription =
    'Help businesses grow while earning recurring commissions through the Jawrah Pixel Partner Network.';
  const applicationCopy =
    'Complete the application below. Approved partners receive a dedicated dashboard, referral tracking, and direct communication with our partner desk.';
  const partnerWhatsappLink = `${config.whatsappLink}?text=${encodeURIComponent('Hello Jawrah Pixel, I would like to discuss the Partner Network program.')}`;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState(config.countryName);
  const [city, setCity] = useState(initialCity);
  const [profileLink, setProfileLink] = useState('');
  const [experience, setExperience] = useState('');
  const [whyPartner, setWhyPartner] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const applicationDraftKey = `partner-application:${config.id}`;

  useEffect(() => {
    if (user) {
      const savedDraft = loadFormDraft<{
        name: string;
        email: string;
        phone: string;
        country: string;
        city: string;
        profileLink: string;
        experience: string;
        whyPartner: string;
      }>(applicationDraftKey);

      if (savedDraft) {
        setName(savedDraft.name);
        setEmail(savedDraft.email);
        setPhone(savedDraft.phone);
        setCountry(savedDraft.country);
        setCity(savedDraft.city);
        setProfileLink(savedDraft.profileLink);
        setExperience(savedDraft.experience);
        setWhyPartner(savedDraft.whyPartner);
        clearFormDraft(applicationDraftKey);
      }
      return;
    }

    saveFormDraft(applicationDraftKey, {
      name,
      email,
      phone,
      country,
      city,
      profileLink,
      experience,
      whyPartner,
    });
  }, [user, name, email, phone, country, city, profileLink, experience, whyPartner, applicationDraftKey]);

  // Scroll to section helper
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg('Please login to continue.');
      return;
    }
    if (!captchaToken) {
      setErrorMsg('Please complete the security verification.');
      return;
    }
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
      const { error } = await applyAsAgent({
        name: name.trim(),
        email: email.trim(),
        whatsapp: phone.trim() || null,
        region: config.id,
        location: city,
        country: country.trim(),
        city: city.trim(),
        profileLink: profileLink || null,
        experience,
        message: whyPartner,
        userId: user.id,
        captcha_token: captchaToken, // Server-side verification
      });

      if (error) throw error;

      trackLead('agent_application', {
        region: config.id,
        city: city
      });
      trackEvent(ANALYTICS_EVENTS.AGENT_REGISTER, {
        region: config.id
      });

      clearFormDraft(applicationDraftKey);

      setIsSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setProfileLink('');
      setExperience('');
      setWhyPartner('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit application. Please try again.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tiers = tierCardsForRegion(config.id);
  const regionPartnerLabel = isInternational
    ? 'International Partner Network'
    : config.id === 'pk'
      ? 'Pakistan Partner Network'
      : 'Sri Lanka Partner Network';

  const requirements = [
    'Valid Jawrah Pixel account with verified email',
    'Demonstrated sales, marketing, or business development experience',
    'Professional WhatsApp contact for partner desk communication',
    'Commitment to ethical referrals and accurate client introductions',
  ];

  const benefits = [
    'Commission Program',
    'Dedicated Partner Dashboard',
    'Referral Tracking',
    'Lead Management',
    'Commission History',
    'Partner Support',
    'Priority Communication',
    'Performance Rewards',
  ];

  const locationOptions = isInternational ? [
    { value: 'Global Remote', label: 'Global Remote Collaboration' },
    { value: 'North America', label: 'North America' },
    { value: 'Europe', label: 'Europe' },
    { value: 'Middle East', label: 'Middle East' },
    { value: 'Asia Pacific', label: 'Asia-Pacific' },
    { value: 'Other', label: 'Other International Region' }
  ] : config.id === 'lk' ? [
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
        title={seoTitle}
        description={seoDescription}
        canonicalUrl={toAbsoluteUrl(p('/partner'))}
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
        
        {/* HERO SECTION */}
        <Reveal className="text-center max-w-4xl mx-auto mb-24 md:mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex gap-3 items-center px-6 py-2 border border-white/5 rounded-none bg-white/[0.03] text-brand-blue text-[10px] font-mono uppercase tracking-[0.4em] mb-10"
          >
            <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" /> Network Expansion
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl lg:text-8xl font-display font-medium text-white tracking-tight leading-[0.95] mb-10 uppercase"
          >
            Partner <br /> <span className="premium-text-gradient italic">Ecosystem</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed mb-12"
          >
            {seoDescription} Help premium brands scale while building your own scalable digital agency revenue stream.
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="min-w-[240px]" onClick={() => scrollToSection('application-form')}>
              Join Network
            </Button>
            <Button variant="outline" size="lg" className="min-w-[240px]" onClick={() => scrollToSection('how-it-works')}>
              Learn More
            </Button>
          </div>
        </Reveal>

        {/* TARGET GROUPS */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32 md:mb-48">
          {targetGroups.map((group, idx) => (
            <StaggerItem key={idx} className="group p-10 bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-700">
              <div className="mb-8 text-brand-blue group-hover:scale-110 transition-transform duration-500">
                <group.icon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-display font-medium text-white uppercase tracking-wider mb-4">{group.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed font-light group-hover:text-zinc-300 transition-colors duration-500">{group.description}</p>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* BENEFITS SECTION */}
        <section id="how-it-works" className="mb-32 md:mb-48 scroll-mt-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <Reveal>
              <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold block mb-6">Network Value</span>
              <h2 className="text-4xl md:text-6xl font-display font-medium uppercase tracking-tight leading-[1] mb-8">
                Unrivaled <br /> <span className="premium-text-gradient italic">Capabilities</span>
              </h2>
              <p className="text-lg text-zinc-500 font-light leading-relaxed mb-12">
                We provide the world-class infrastructure. You provide the connections. Together, we architect digital excellence.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <CheckCircle className="w-5 h-5 text-brand-blue shrink-0" />
                    <span className="text-sm text-zinc-400 font-light">{benefit}</span>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.2} className="relative group">
              <div className="absolute inset-0 bg-brand-blue/10 blur-[100px] group-hover:bg-brand-blue/20 transition-colors duration-1000" />
              <div className="relative p-12 bg-white/[0.02] border border-white/5 backdrop-blur-3xl">
                <h3 className="text-2xl font-display font-medium text-white mb-8 uppercase tracking-widest">Partner Tiers</h3>
                <div className="space-y-8">
                  {tiers.map((tier: any, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-white/[0.03] border border-white/5 hover:border-brand-blue/30 transition-all duration-500">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-mono text-brand-blue uppercase tracking-widest">{tier.level}</span>
                        <span className="text-lg font-display font-bold text-white uppercase">{tier.focus}</span>
                      </div>
                      <div className="text-2xl font-display font-bold text-white">{tier.rate}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* APPLICATION FORM */}
        <section id="application-form" className="max-w-4xl mx-auto scroll-mt-32">
          <Reveal className="text-center mb-16 md:mb-24">
            <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold block mb-6">Application</span>
            <h2 className="text-4xl md:text-6xl font-display font-medium uppercase tracking-tight text-white mb-8">Join the Network</h2>
            <p className="text-zinc-500 text-lg font-light leading-relaxed">{applicationCopy}</p>
          </Reveal>

          <Reveal className="p-10 md:p-16 bg-white/[0.02] border border-white/5">
            <FormAuthGate>
              {isSuccess ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle className="w-10 h-10 text-brand-blue" />
                  </div>
                  <h3 className="text-2xl font-display font-medium text-white mb-4 uppercase">Application Submitted</h3>
                  <p className="text-zinc-500 mb-10">Our partner desk will review your application and contact you shortly.</p>
                  <Button onClick={() => setIsSuccess(false)}>Send Another</Button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Full Name</label>
                      <Input 
                        placeholder="John Doe" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="bg-white/[0.03] border-white/10 rounded-none focus:border-brand-blue h-14"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Professional Email</label>
                      <Input 
                        type="email" 
                        placeholder="john@agency.com" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/[0.03] border-white/10 rounded-none focus:border-brand-blue h-14"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">WhatsApp Contact</label>
                      <Input 
                        placeholder="+1 234 567 890" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)}
                        className="bg-white/[0.03] border-white/10 rounded-none focus:border-brand-blue h-14"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Region / City</label>
                      <select 
                        value={city} 
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-none focus:border-brand-blue h-14 px-4 text-sm text-white outline-none"
                      >
                        {locationOptions.map(opt => (
                          <option key={opt.value} value={opt.value} className="bg-brand-black">{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Professional Profile (LinkedIn / Portfolio)</label>
                    <Input 
                      placeholder="https://linkedin.com/in/johndoe" 
                      value={profileLink} 
                      onChange={(e) => setProfileLink(e.target.value)}
                      className="bg-white/[0.03] border-white/10 rounded-none focus:border-brand-blue h-14"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Relevant Experience</label>
                    <Textarea 
                      placeholder="Briefly describe your background in sales or digital consulting..." 
                      value={experience} 
                      onChange={(e) => setExperience(e.target.value)}
                      className="bg-white/[0.03] border-white/10 rounded-none focus:border-brand-blue min-h-[120px]"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Why Join Jawrah Pixel Network?</label>
                    <Textarea 
                      placeholder="What are your goals as a partner?" 
                      value={whyPartner} 
                      onChange={(e) => setWhyPartner(e.target.value)}
                      className="bg-white/[0.03] border-white/10 rounded-none focus:border-brand-blue min-h-[120px]"
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono uppercase tracking-widest">
                      {errorMsg}
                    </div>
                  )}

                  <div className="pt-6">
                    <TurnstileCaptcha onVerify={setCaptchaToken} />
                    <Button 
                      type="submit" 
                      className="w-full h-16 rounded-none text-[12px] tracking-[0.3em] font-bold" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Processing Application...' : 'Submit Application'}
                    </Button>
                  </div>
                </form>
              )}
            </FormAuthGate>
          </Reveal>
        </section>

      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { submitBooking, submitInquiry } from '@/lib/supabase/api';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { PaymentSuccessActions } from '@/components/payments/PaymentSuccessActions';
import { PaymentModal, type PaymentModalOpenPayload } from '@/components/payments/PaymentModal';
import { FormAuthGate } from '@/components/auth/FormAuthGate';
import { useAuth } from '@/contexts/AuthContext';
import { clearFormDraft, loadFormDraft, saveFormDraft } from '@/lib/email/formDrafts';
import { getClientPlatform } from '@/lib/email/platform';
import {
  calculateDeposit,
  estimateBookingService,
  estimateFromBudget,
  formatMoney,
} from '@/lib/payments/amounts';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { useForm as useRHForm } from 'react-hook-form';
import { useRegion } from '@/hooks/useRegion';
import { useRegionalSeo } from '@/hooks/useRegionalSeo';
import { getCanonicalUrl } from '@/lib/seo/pageSeo';
import { SEO } from '@/components/layout/SEO';
import { trackEvent, ANALYTICS_EVENTS, trackLead } from '@/lib/analytics';
import { TurnstileCaptcha } from '@/components/ui/TurnstileCaptcha';
import { useTheme } from '@/contexts/ThemeContext';
import {
  CheckCircle,
  AlertCircle,
  Calendar,
  ChevronRight,
  ArrowLeft,
  Briefcase,
  MessageSquare,
  Globe,
  Settings,
  CheckCheck,
  Zap,
  ShieldCheck,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';
import { cn } from '@/lib/utils';
import Magnetic from '@/components/ui/Magnetic';

type FormData = {
  name: string;
  email: string;
  whatsapp: string;
  business_name: string;
  project_type: string;
  budget: string;
  message: string;
  timeline: string;
  goals: string;
  preferred_contact: string;
};

export default function Contact() {
  const location = useLocation();
  const { currentRegion, config, p, isInternational } = useRegion();
  const seo = useRegionalSeo('contact');
  const canonicalPath = location.pathname === '/book' ? '/book' : seo.path;
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useRHForm<FormData>({
    defaultValues: {
      project_type: '',
      budget: '',
      timeline: '3 Months',
      preferred_contact: 'WhatsApp'
    }
  });

  // Flow State
  const [activeTab, setActiveTab] = useState<'rfp' | 'calendar'>('rfp');
  const [rfpStep, setRfpStep] = useState(1);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Calendar Booking States
  const [selectedDateIndex, setSelectedDateIndex] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    whatsapp: '',
    business_name: '',
    project_category: 'Web Design',
    notes: ''
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [lastRfpService, setLastRfpService] = useState('');
  const [lastRfpAmount, setLastRfpAmount] = useState(0);
  const [lastRfpEmail, setLastRfpEmail] = useState('');
  const [lastRfpName, setLastRfpName] = useState('');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentModalPayload, setPaymentModalPayload] = useState<PaymentModalOpenPayload | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const rfpDraftKey = `contact-rfp:${currentRegion}`;
  const bookingDraftKey = `contact-booking:${currentRegion}`;
  const watchedFormValues = watch();

  useEffect(() => {
    if (user) {
      const savedRfp = loadFormDraft<FormData & { rfpStep?: number }>(rfpDraftKey);
      if (savedRfp) {
        reset(savedRfp);
        if (savedRfp.rfpStep) setRfpStep(savedRfp.rfpStep);
        clearFormDraft(rfpDraftKey);
      }

      const savedBooking = loadFormDraft<{
        bookingForm: typeof bookingForm;
        selectedDateIndex: number | null;
        selectedTime: string | null;
      }>(bookingDraftKey);
      if (savedBooking) {
        setBookingForm(savedBooking.bookingForm);
        setSelectedDateIndex(savedBooking.selectedDateIndex);
        setSelectedTime(savedBooking.selectedTime);
        clearFormDraft(bookingDraftKey);
      }
      return;
    }

    saveFormDraft(rfpDraftKey, { ...watchedFormValues, rfpStep });
    saveFormDraft(bookingDraftKey, { bookingForm, selectedDateIndex, selectedTime });
  }, [user, watchedFormValues, rfpStep, bookingForm, selectedDateIndex, selectedTime, rfpDraftKey, bookingDraftKey, reset]);

  const budgetOptions = isInternational ? [
    { value: '$500 - $1,000', label: 'USD $500 - $1,000' },
    { value: '$1,000 - $3,000', label: 'USD $1,000 - $3,000' },
    { value: '$3,000 - $10,000', label: 'USD $3,000 - $10,000' },
    { value: '$10,000+', label: 'USD $10,000+ (Enterprise)' }
  ] : config.id === 'lk' ? [
    { value: 'Under LKR 200k', label: 'Under LKR 200,000' },
    { value: 'LKR 200k - 500k', label: 'LKR 200,000 - LKR 500k' },
    { value: 'LKR 500k - 1.5M', label: 'LKR 500,000 - LKR 1.5M' },
    { value: 'Over LKR 1.5M', label: 'Over LKR 1,500,000 (Enterprise)' }
  ] : [
    { value: 'Under PKR 150k', label: 'Under PKR 150,000' },
    { value: 'PKR 150k - 400k', label: 'PKR 150,000 - PKR 400k' },
    { value: 'PKR 400k - 1.2M', label: 'PKR 400,000 - PKR 1.2M' },
    { value: 'Over PKR 1.2M', label: 'Over PKR 1,200,000 (Enterprise)' }
  ];

  const projectTypeOptions = isInternational ? [
    { id: 'Web Design', title: 'Premium Global Web Experience', desc: 'World-class websites for international businesses' },
    { id: 'Ecommerce', title: 'International Ecommerce', desc: 'USD-ready storefronts, premium checkout, global conversion' },
    { id: 'Admin Dashboard', title: 'SaaS Interface / Custom CRM', desc: 'Scalable systems for remote-first global teams' },
    { id: 'Branding', title: 'Global Branding & Strategy', desc: 'Premium identity, positioning, and conversion copy' },
    { id: 'Other', title: 'Bespoke Technology Scope', desc: 'AI systems, integrations, and worldwide digital solutions' }
  ] : [
    { id: 'Web Design', title: 'Premium Web Design', desc: 'Custom, blazing fast corporate systems' },
    { id: 'Ecommerce', title: 'Luxury Ecommerce', desc: 'Secure checkout, appraisers, high conversions' },
    { id: 'Admin Dashboard', title: 'Bento Dashboard / Custom CRM', desc: 'Secure management with full Supabase integration' },
    { id: 'Branding', title: 'Elite Branding & Strategy', desc: 'Strategic copy, identity, positioning' },
    { id: 'Other', title: 'Special Dev Scope', desc: 'Bespoke systems, custom integrations' }
  ];

  const contactIntro = isInternational
    ? 'Submit a premium global project brief or schedule a remote-first strategy consultation for websites, ecommerce platforms, AI systems, and worldwide digital solutions.'
    : 'Submit an elite system briefing blueprint or lock in a direct strategic video consultation with our global operations team.';
  const successRegionLabel = isInternational ? 'global strategy team' : `Lead Architect in ${config.countryName}`;

  const generateBusinessDays = () => {
    const list = [];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let current = new Date();
    let count = 0;

    while (count < 10) {
      current.setDate(current.getDate() + 1);
      if (current.getDay() !== 0 && current.getDay() !== 6) {
        list.push({
          dayName: days[current.getDay()].substring(0, 3),
          dayNum: current.getDate(),
          monthName: months[current.getMonth()],
          dateString: current.toISOString().split('T')[0]
        });
        count++;
      }
    }
    return list;
  };

  const businessDaysList = generateBusinessDays();

  const availableHoursList = [
    { time: '09:30 AM', zone: isInternational ? 'UTC' : config.id === 'lk' ? 'IST' : 'PKT' },
    { time: '11:00 AM', zone: isInternational ? 'UTC' : config.id === 'lk' ? 'IST' : 'PKT' },
    { time: '02:00 PM', zone: isInternational ? 'UTC' : config.id === 'lk' ? 'IST' : 'PKT' },
    { time: '03:30 PM', zone: isInternational ? 'UTC' : config.id === 'lk' ? 'IST' : 'PKT' },
    { time: '05:00 PM', zone: isInternational ? 'UTC' : config.id === 'lk' ? 'IST' : 'PKT' }
  ];

  const watchedProjectType = watch('project_type');
  const watchedBudget = watch('budget');

  const bookingEstimate = estimateBookingService(bookingForm.project_category, currentRegion);
  const bookingAdvance = calculateDeposit(bookingEstimate, 10);

  const openBookingPayment = async () => {
    if (!user) {
      setErrorMsg('Please login to continue.');
      return;
    }
    if (isSubmittingForm) return;
    if (!bookingForm.name.trim() || !bookingForm.email.trim()) {
      setErrorMsg('Enter your name and email before booking with deposit.');
      return;
    }
    if (selectedDateIndex === null || !selectedTime) {
      setErrorMsg('Select a briefing date and time before paying the advance.');
      return;
    }
    if (!isSupabaseConfigured) {
      setErrorMsg('Booking service is temporarily unavailable.');
      return;
    }

    setIsSubmittingForm(true);
    setErrorMsg('');

    const selectedDate = businessDaysList[selectedDateIndex!];

    try {
      const trimmedName = bookingForm.name.trim();
      const trimmedEmail = bookingForm.email.trim();
      const trimmedWhatsapp = bookingForm.whatsapp?.trim() || null;
      const preferredTime = `${selectedTime} (${availableHoursList.find((h) => h.time === selectedTime)?.zone})`;

      const { error } = await submitBooking({
        name: trimmedName,
        email: trimmedEmail,
        whatsapp: trimmedWhatsapp,
        phone: bookingForm.whatsapp?.trim() || null,
        country: config.countryName,
        project_type: bookingForm.project_category,
        preferred_date: selectedDate.dateString,
        preferred_time: preferredTime,
        message: `[10% advance requested] Business: ${bookingForm.business_name || 'N/A'}. Notes: ${bookingForm.notes || 'None'}`,
        region: currentRegion,
        status: 'pending',
      }, {
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedWhatsapp,
        whatsapp: trimmedWhatsapp,
        country: config.countryName,
        region: currentRegion,
        service: `${bookingForm.project_category} Strategy Briefing`,
        timeline: `${selectedDate.dateString} ${preferredTime}`,
        notes: bookingForm.notes,
        source: 'Strategy booking deposit flow',
        formType: 'Strategy Call Booking',
        userId: user.id,
        platform: getClientPlatform(),
        requirements: bookingForm.notes || undefined,
        captcha_token: captchaToken,
      });

      if (error) throw error;

      trackEvent(ANALYTICS_EVENTS.CHECKOUT_STARTED, {
        service: bookingForm.project_category,
        amount: bookingEstimate,
        region: currentRegion
      });

      setPaymentModalPayload({
        serviceName: `${bookingForm.project_category} Strategy Briefing`,
        totalAmount: bookingEstimate,
        intent: 'booking_advance',
        defaultPercent: 10,
        lockPercent: true,
        guestEmail: bookingForm.email.trim(),
        guestName: bookingForm.name.trim(),
      });
      setPaymentModalOpen(true);
    } catch (error: unknown) {
      console.error('CONTACT FLOW ERROR:', error);
      const message = error instanceof Error ? error.message : 'Could not reserve briefing slot.';
      setErrorMsg(message);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleNextStep = () => {
    if (rfpStep === 1 && !watchedProjectType) {
      setErrorMsg('Please select a strategic scope type to continue');
      return;
    }
    if (rfpStep === 2 && !watchedBudget) {
      setErrorMsg('Please select your target investment range');
      return;
    }
    setErrorMsg('');
    setRfpStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setErrorMsg('');
    setRfpStep(prev => prev - 1);
  };

  const onRfpSubmit = async (data: FormData) => {
    if (!user) {
      setErrorMsg('Please login to continue.');
      return;
    }
    if (!captchaToken) {
      setErrorMsg('Please complete the security verification.');
      return;
    }
    if (isSubmittingForm) return;
    setIsSubmittingForm(true);
    setErrorMsg('');
    setSuccess(false);

    if (!isSupabaseConfigured) {
      setErrorMsg('Submission service is temporarily unavailable. Please email us directly.');
      setIsSubmittingForm(false);
      return;
    }

    try {
      const trimmedName = data.name.trim();
      const trimmedEmail = data.email.trim();
      const trimmedWhatsapp = data.whatsapp?.trim() || null;
      const businessName = data.business_name?.trim() || null;
      const message = `Goals: ${data.goals || 'None stated'}. Timeline: ${data.timeline}. Preferred Contact: ${data.preferred_contact}. Key notes: ${data.message || 'None'}`;

      const { error: inquiryError } = await submitInquiry({
        full_name: trimmedName,
        email: trimmedEmail,
        whatsapp: trimmedWhatsapp,
        business_name: businessName,
        service_interested: data.project_type,
        inquiry_type: 'project',
        budget_range: data.budget,
        message,
        region: currentRegion,
        source_page: currentRegion,
        status: 'new',
      }, {
        name: trimmedName,
        email: trimmedEmail,
        whatsapp: trimmedWhatsapp,
        country: config.countryName,
        region: currentRegion,
        service: data.project_type,
        budget: data.budget,
        timeline: data.timeline,
        goals: data.goals,
        message: data.message,
        notes: businessName ? `Business Name: ${businessName}. Preferred Contact: ${data.preferred_contact}` : `Preferred Contact: ${data.preferred_contact}`,
        source: currentRegion,
        formType: 'Project Brief Form',
        userId: user.id,
        platform: getClientPlatform(),
        requirements: [data.goals, data.message].filter(Boolean).join('\n\n') || undefined,
        captcha_token: captchaToken,
      });

      if (inquiryError) throw inquiryError;

      trackLead('interactive_rfp', {
        project_type: data.project_type,
        budget: data.budget,
        region: currentRegion
      });
      trackEvent(ANALYTICS_EVENTS.CONTACT_FORM_SUBMIT, {
        form_type: 'interactive_rfp',
        project_type: data.project_type
      });

      setSuccess(true);

      try {
        clearFormDraft(rfpDraftKey);
        setLastRfpService(data.project_type);
        setLastRfpAmount(estimateFromBudget(data.budget, currentRegion));
        setLastRfpEmail(trimmedEmail);
        setLastRfpName(trimmedName);
        reset();
        setRfpStep(1);
      } catch (error) {
        console.error('CONTACT FLOW ERROR:', error);
      }
    } catch (error: unknown) {
      console.error('CONTACT FLOW ERROR:', error);
      const message = error instanceof Error ? error.message : 'Failed to submit inquiry. Please try again.';
      setErrorMsg(message);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleCalendarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg('Please login to continue.');
      return;
    }
    if (!captchaToken) {
      setErrorMsg('Please complete the security verification.');
      return;
    }
    if (isSubmittingForm) return;
    if (selectedDateIndex === null) {
      setErrorMsg('Please select a preferred briefing date on the calendar');
      return;
    }
    if (!selectedTime) {
      setErrorMsg('Please select a preferred meeting timeslot');
      return;
    }
    if (!bookingForm.name || !bookingForm.email) {
      setErrorMsg('Full Name and Email Address are strictly required');
      return;
    }

    if (!isSupabaseConfigured) {
      setErrorMsg('Booking service is temporarily unavailable. Please email us directly.');
      return;
    }

    setIsSubmittingForm(true);
    setErrorMsg('');
    setBookingSuccess(false);

    const selectedDate = businessDaysList[selectedDateIndex];

    try {
      const trimmedName = bookingForm.name.trim();
      const trimmedEmail = bookingForm.email.trim();
      const trimmedWhatsapp = bookingForm.whatsapp?.trim() || null;
      const preferredTime = `${selectedTime} (${availableHoursList.find((h) => h.time === selectedTime)?.zone})`;

      const { data, error } = await submitBooking({
        name: trimmedName,
        email: trimmedEmail,
        whatsapp: trimmedWhatsapp,
        phone: trimmedWhatsapp,
        country: config.countryName,
        project_type: bookingForm.project_category,
        preferred_date: selectedDate.dateString,
        preferred_time: preferredTime,
        message: `Business Name: ${bookingForm.business_name || 'Not stated'}. Client Notes: ${bookingForm.notes || 'None'}`,
        region: currentRegion,
        status: 'pending',
      }, {
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedWhatsapp,
        whatsapp: trimmedWhatsapp,
        country: config.countryName,
        region: currentRegion,
        service: bookingForm.project_category,
        timeline: `${selectedDate.dateString} ${preferredTime}`,
        notes: `Business Name: ${bookingForm.business_name || 'Not stated'}. ${bookingForm.notes || ''}`.trim(),
        source: currentRegion,
        formType: 'Strategy Call Booking',
        userId: user.id,
        platform: getClientPlatform(),
        requirements: bookingForm.notes || undefined,
        captcha_token: captchaToken,
      });

      if (error) throw error;

      clearFormDraft(bookingDraftKey);

      setPaymentModalPayload({
        serviceName: `Strategy Booking: ${bookingForm.project_category}`,
        totalAmount: bookingEstimate,
        defaultPercent: 10,
        intent: 'booking_advance',
        lockPercent: true,
        guestEmail: bookingForm.email.trim(),
        guestName: bookingForm.name.trim(),
        bookingId: (data as any)?.id,
      });

      setBookingSuccess(true);
      setPaymentModalOpen(true);
      setBookingForm({
        name: '',
        email: '',
        whatsapp: '',
        business_name: '',
        project_category: 'Web Design',
        notes: ''
      });
      setSelectedDateIndex(null);
      setSelectedTime(null);
    } catch (error: unknown) {
      console.error('CONTACT FLOW ERROR:', error);
      const message = error instanceof Error ? error.message : 'Booking failed. Please check your network and try again.';
      setErrorMsg(message);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden relative" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <SEO 
        title={seo.title}
        description={seo.description}
        canonicalUrl={getCanonicalUrl(canonicalPath)}
        keywords={['contact Jawrah Pixel', 'hire digital agency', 'web design consultation', 'project brief submission']}
      />

      {/* Atmospheric Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 premium-grid-overlay opacity-20 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
          <div className="absolute top-[10%] left-[10%] cinematic-light animate-pulse-slow opacity-30" />
          <div className="absolute bottom-[20%] right-[10%] cinematic-light animate-glow opacity-20" style={{ background: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.1), transparent 70%)' }} />
        </div>
      </div>

      <div className="container mx-auto px-5 sm:px-6 relative z-10">
        <Reveal className="text-center max-w-4xl mx-auto mb-16 md:mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex gap-3 items-center px-6 py-2 border rounded-none text-[10px] font-mono uppercase tracking-[0.4em] mb-8 md:mb-10"
            style={{ 
              borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', 
              backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
              color: 'var(--color-accent-brand)'
            }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-accent-brand)' }} /> Agency Access
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl lg:text-8xl font-display font-medium uppercase tracking-tight leading-[1.1] mb-8 md:mb-10 overflow-visible"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Initiate <br /> <span className="premium-text-gradient italic inline-block px-2 py-1 overflow-visible">Briefing</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {contactIntro}
          </motion.p>
        </Reveal>

        <div className="max-w-6xl mx-auto">
          {/* FLOW SWITCHER */}
          <div className="flex justify-center mb-12 md:mb-24">
            <div className="inline-flex p-2 border backdrop-blur-xl" style={{ 
              backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.8)',
              borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
            }}>
              <button
                onClick={() => { setActiveTab('rfp'); setErrorMsg(''); }}
                className={cn(
                  "px-8 py-4 text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500",
                  activeTab === 'rfp' 
                    ? (isDark ? "bg-white text-black" : "bg-black text-white") 
                    : (isDark ? "text-zinc-500 hover:text-white" : "text-zinc-500 hover:text-black")
                )}
              >
                Project Brief
              </button>
              <button
                onClick={() => { setActiveTab('calendar'); setErrorMsg(''); }}
                className={cn(
                  "px-8 py-4 text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500",
                  activeTab === 'calendar' 
                    ? (isDark ? "bg-white text-black" : "bg-black text-white") 
                    : (isDark ? "text-zinc-500 hover:text-white" : "text-zinc-500 hover:text-black")
                )}
              >
                Strategy Call
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-20">
            {/* LEFT SIDE: CONTEXT & TRUST */}
            <div className="lg:col-span-4 space-y-10 md:space-y-16">
              <Reveal>
                <h2 className="text-[10px] font-mono uppercase tracking-[0.4em] font-bold block mb-10" style={{ color: 'var(--color-accent-brand)' }}>Commitment</h2>
                <div className="space-y-10">
                  {[
                    { icon: ShieldCheck, title: 'Secure Handling', desc: 'Enterprise-grade encryption for project data.' },
                    { icon: Clock, title: 'Rapid Response', desc: 'Direct technical review within 24 hours.' },
                    { icon: Globe, title: 'Global Operations', desc: 'Serving brands across all time zones.' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-5 group">
                      <div className="w-11 h-11 border flex items-center justify-center group-hover:scale-110 transition-transform duration-500" style={{ 
                        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                        borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                        color: 'var(--color-accent-brand)'
                      }}>
                        <item.icon size={18} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-display font-medium uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-primary)' }}>{item.title}</h3>
                        <p className="text-xs leading-relaxed font-light" style={{ color: 'var(--color-text-secondary)' }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={0.2} className="p-6 md:p-10 border" style={{ 
                backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.8)',
                borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
              }}>
                <h3 className="text-sm font-display font-medium uppercase tracking-widest mb-6" style={{ color: 'var(--color-text-primary)' }}>Regional Access</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--color-text-secondary)' }}>
                    <span>Region</span>
                    <span style={{ color: 'var(--color-text-primary)' }}>{config.countryName}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--color-text-secondary)' }}>
                    <span>Currency</span>
                    <span style={{ color: 'var(--color-text-primary)' }}>{isInternational ? 'USD ($)' : config.id === 'lk' ? 'LKR (Rs)' : 'PKR (Rs)'}</span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* RIGHT SIDE: FORMS */}
            <div className="lg:col-span-8">
              <FormAuthGate 
                className="h-full"
              >
                {activeTab === 'rfp' ? (
                  <div className="border p-6 md:p-16" style={{ 
                    backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.9)',
                    borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                  }}>
                    {success ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-10 md:py-20"
                      >
                        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-10" style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)' }}>
                          <CheckCheck className="w-10 h-10" style={{ color: 'var(--color-accent-brand)' }} />
                        </div>
                        <h2 className="text-3xl font-display font-medium uppercase mb-6 tracking-tight" style={{ color: 'var(--color-text-primary)' }}>Brief Received</h2>
                        <p className="mb-12 max-w-md mx-auto leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                          Your strategic brief has been locked into our system. Our {successRegionLabel} will review the technical scope and contact you via WhatsApp shortly.
                        </p>
                        <PaymentSuccessActions 
                          serviceName={lastRfpService}
                          totalAmount={lastRfpAmount}
                          guestEmail={lastRfpEmail}
                          guestName={lastRfpName}
                        />
                      </motion.div>
                    ) : (
                      <form onSubmit={handleSubmit(onRfpSubmit)} className="space-y-12">
                        {/* RFP STEPS */}
                        <div className="flex gap-4 mb-16">
                          {[1, 2, 3].map((step) => (
                            <div 
                              key={step}
                              className="h-1 flex-1 transition-all duration-700"
                              style={{ 
                                backgroundColor: rfpStep >= step 
                                  ? 'var(--color-accent-brand)' 
                                  : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)')
                              }}
                            />
                          ))}
                        </div>

                        {rfpStep === 1 && (
                          <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-10"
                          >
                            <div className="space-y-4">
                              <span className="text-[10px] font-mono uppercase tracking-[0.4em] font-bold" style={{ color: 'var(--color-text-secondary)' }}>Step 01</span>
                              <h3 className="text-2xl font-display font-medium uppercase tracking-tight" style={{ color: 'var(--color-text-primary)' }}>Select Strategic Scope</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                              {projectTypeOptions.map((opt) => (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => { setValue('project_type', opt.id); setErrorMsg(''); }}
                                  className="p-8 text-left transition-all duration-500 border group"
                                  style={{
                                    backgroundColor: watchedProjectType === opt.id 
                                      ? (isDark ? '#fff' : '#000') 
                                      : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'),
                                    borderColor: watchedProjectType === opt.id 
                                      ? (isDark ? '#fff' : '#000') 
                                      : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                                    color: watchedProjectType === opt.id 
                                      ? (isDark ? '#000' : '#fff') 
                                      : 'var(--color-text-primary)'
                                  }}
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-display font-medium uppercase tracking-widest">{opt.title}</h4>
                                    {watchedProjectType === opt.id && <CheckCircle size={16} />}
                                  </div>
                                  <p className="text-xs font-light leading-relaxed" style={{ color: watchedProjectType === opt.id ? (isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)') : 'var(--color-text-secondary)' }}>
                                    {opt.desc}
                                  </p>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {rfpStep === 2 && (
                          <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-10"
                          >
                            <div className="space-y-4">
                              <span className="text-[10px] font-mono uppercase tracking-[0.4em] font-bold" style={{ color: 'var(--color-text-secondary)' }}>Step 02</span>
                              <h3 className="text-2xl font-display font-medium uppercase tracking-tight" style={{ color: 'var(--color-text-primary)' }}>Target Investment</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {budgetOptions.map((opt) => (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => { setValue('budget', opt.value); setErrorMsg(''); }}
                                  className="p-8 text-center transition-all duration-500 border group"
                                  style={{
                                    backgroundColor: watchedBudget === opt.value 
                                      ? (isDark ? '#fff' : '#000') 
                                      : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'),
                                    borderColor: watchedBudget === opt.value 
                                      ? (isDark ? '#fff' : '#000') 
                                      : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                                    color: watchedBudget === opt.value 
                                      ? (isDark ? '#000' : '#fff') 
                                      : 'var(--color-text-primary)'
                                  }}
                                >
                                  <span className="text-xs font-mono font-bold uppercase tracking-widest">{opt.label}</span>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {rfpStep === 3 && (
                          <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-12"
                          >
                            <div className="space-y-4">
                              <span className="text-[10px] font-mono uppercase tracking-[0.4em] font-bold" style={{ color: 'var(--color-text-secondary)' }}>Step 03</span>
                              <h3 className="text-2xl font-display font-medium uppercase tracking-tight" style={{ color: 'var(--color-text-primary)' }}>Technical Contact</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                              <div className="space-y-4">
                                <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--color-text-secondary)' }}>Full Name</label>
                                <Input 
                                  {...register('name', { required: true })}
                                  placeholder="Architect Name"
                                  className="rounded-none h-14"
                                  style={{
                                    backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                                  }}
                                />
                              </div>
                              <div className="space-y-4">
                                <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--color-text-secondary)' }}>Business Email</label>
                                <Input 
                                  {...register('email', { required: true })}
                                  type="email"
                                  placeholder="name@domain.com"
                                  className="rounded-none h-14"
                                  style={{
                                    backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                                  }}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                              <div className="space-y-4">
                                <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--color-text-secondary)' }}>WhatsApp / Signal</label>
                                <Input 
                                  {...register('whatsapp')}
                                  placeholder="+1 234 567 890"
                                  className="rounded-none h-14"
                                  style={{
                                    backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                                  }}
                                />
                              </div>
                              <div className="space-y-4">
                                <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--color-text-secondary)' }}>Entity Name</label>
                                <Input 
                                  {...register('business_name')}
                                  placeholder="Corporate Identity"
                                  className="rounded-none h-14"
                                  style={{
                                    backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                                  }}
                                />
                              </div>
                            </div>

                            <div className="space-y-4">
                              <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--color-text-secondary)' }}>Project Requirements</label>
                              <Textarea 
                                {...register('message')}
                                placeholder="Describe the technical scope and business goals..."
                                className="rounded-none min-h-[150px]"
                                style={{
                                  backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                                }}
                              />
                            </div>

                            <div className="pt-6">
                              <TurnstileCaptcha onVerify={setCaptchaToken} />
                              <Magnetic strength={0.1}>
                                <Button 
                                  type="submit" 
                                  className="w-full h-16 rounded-none text-[12px] tracking-[0.3em] font-bold"
                                  disabled={isSubmittingForm}
                                >
                                  {isSubmittingForm ? 'Architecting Brief...' : 'Initialize Briefing'}
                                </Button>
                              </Magnetic>
                            </div>
                          </motion.div>
                        )}

                        {errorMsg && (
                          <div className="p-6 border text-[10px] font-mono uppercase tracking-widest flex items-center gap-3" style={{ 
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            borderColor: 'rgba(239, 68, 68, 0.2)',
                            color: 'rgb(239, 68, 68)'
                          }}>
                            <AlertCircle size={14} /> {errorMsg}
                          </div>
                        )}

                        <div className="flex justify-between pt-10 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                          {rfpStep > 1 ? (
                            <button
                              type="button"
                              onClick={handlePrevStep}
                              className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest transition-colors"
                              style={{ color: 'var(--color-text-secondary)' }}
                              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
                              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                            >
                              <ArrowLeft size={14} /> Back
                            </button>
                          ) : <div />}
                          
                          {rfpStep < 3 && (
                            <Button 
                              type="button" 
                              onClick={handleNextStep}
                              className="px-10 h-14"
                            >
                              Continue <ChevronRight className="ml-2 w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </form>
                    )}
                  </div>
                ) : (
                  <div className="border p-10 md:p-16" style={{ 
                    backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.9)',
                    borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                  }}>
                    {bookingSuccess ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                      >
                        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-10" style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)' }}>
                          <Calendar className="w-10 h-10" style={{ color: 'var(--color-accent-brand)' }} />
                        </div>
                        <h2 className="text-3xl font-display font-medium uppercase mb-6 tracking-tight" style={{ color: 'var(--color-text-primary)' }}>Session Reserved</h2>
                        <p className="mb-12 max-w-md mx-auto leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                          Your strategy session has been tentatively reserved. Please complete the security advance below to finalize the booking.
                        </p>
                        <div className="flex flex-col gap-4 max-w-xs mx-auto">
                          <Button size="lg" onClick={() => setPaymentModalOpen(true)}>
                            Complete Advance
                          </Button>
                          <Button variant="outline" onClick={() => setBookingSuccess(false)}>
                            Modify Details
                          </Button>
                        </div>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleCalendarSubmit} className="space-y-16">
                        {/* CALENDAR SELECTION */}
                        <div className="space-y-10">
                          <div className="space-y-4">
                            <span className="text-[10px] font-mono uppercase tracking-[0.4em] font-bold" style={{ color: 'var(--color-accent-brand)' }}>Phase 01</span>
                            <h3 className="text-2xl font-display font-medium uppercase tracking-tight" style={{ color: 'var(--color-text-primary)' }}>Select Briefing Date</h3>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {businessDaysList.map((day, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => setSelectedDateIndex(i)}
                                className="p-6 flex flex-col items-center gap-2 border transition-all duration-500"
                                style={{
                                  backgroundColor: selectedDateIndex === i 
                                    ? (isDark ? '#fff' : '#000') 
                                    : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'),
                                  borderColor: selectedDateIndex === i 
                                    ? (isDark ? '#fff' : '#000') 
                                    : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                                  color: selectedDateIndex === i 
                                    ? (isDark ? '#000' : '#fff') 
                                    : 'var(--color-text-primary)'
                                }}
                              >
                                <span className="text-[10px] font-mono uppercase tracking-widest opacity-60">{day.dayName}</span>
                                <span className="text-2xl font-display font-medium">{day.dayNum}</span>
                                <span className="text-[10px] font-mono uppercase tracking-widest opacity-60">{day.monthName}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* TIME SELECTION */}
                        <div className="space-y-10">
                          <div className="space-y-4">
                            <span className="text-[10px] font-mono uppercase tracking-[0.4em] font-bold" style={{ color: 'var(--color-accent-brand)' }}>Phase 02</span>
                            <h3 className="text-2xl font-display font-medium uppercase tracking-tight" style={{ color: 'var(--color-text-primary)' }}>Preferred Window</h3>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {availableHoursList.map((slot) => (
                              <button
                                key={slot.time}
                                type="button"
                                onClick={() => setSelectedTime(slot.time)}
                                className="p-6 text-center border transition-all duration-500"
                                style={{
                                  backgroundColor: selectedTime === slot.time 
                                    ? (isDark ? '#fff' : '#000') 
                                    : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'),
                                  borderColor: selectedTime === slot.time 
                                    ? (isDark ? '#fff' : '#000') 
                                    : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                                  color: selectedTime === slot.time 
                                    ? (isDark ? '#000' : '#fff') 
                                    : 'var(--color-text-primary)'
                                }}
                              >
                                <div className="text-sm font-display font-medium uppercase tracking-widest">{slot.time}</div>
                                <div className="text-[10px] font-mono uppercase tracking-widest opacity-40">{slot.zone}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* BOOKING DETAILS */}
                        <div className="space-y-10">
                          <div className="space-y-4">
                            <span className="text-[10px] font-mono uppercase tracking-[0.4em] font-bold" style={{ color: 'var(--color-accent-brand)' }}>Phase 03</span>
                            <h3 className="text-2xl font-display font-medium uppercase tracking-tight" style={{ color: 'var(--color-text-primary)' }}>Client Credentials</h3>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                            <div className="space-y-4">
                              <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--color-text-secondary)' }}>Full Name</label>
                              <Input 
                                placeholder="Architect Name"
                                value={bookingForm.name}
                                onChange={e => setBookingForm({...bookingForm, name: e.target.value})}
                                className="rounded-none h-14"
                                style={{
                                  backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                                }}
                              />
                            </div>
                            <div className="space-y-4">
                              <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--color-text-secondary)' }}>Business Email</label>
                              <Input 
                                type="email"
                                placeholder="name@domain.com"
                                value={bookingForm.email}
                                onChange={e => setBookingForm({...bookingForm, email: e.target.value})}
                                className="rounded-none h-14"
                                style={{
                                  backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                                }}
                              />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--color-text-secondary)' }}>Strategic Scope</label>
                            <select
                              value={bookingForm.project_category}
                              onChange={e => setBookingForm({...bookingForm, project_category: e.target.value})}
                              className="w-full border rounded-none h-14 px-6 text-[10px] font-mono uppercase tracking-[0.2em] outline-none"
                              style={{
                                backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                                color: 'var(--color-text-primary)'
                              }}
                              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-accent-brand)'}
                              onBlur={(e) => e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
                            >
                              {projectTypeOptions.map(opt => (
                                <option key={opt.id} value={opt.id} style={{ backgroundColor: 'var(--color-bg-primary)' }}>{opt.title}</option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-4">
                            <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--color-text-secondary)' }}>Briefing Notes</label>
                            <Textarea 
                              placeholder="Any specific technical challenges to address..."
                              value={bookingForm.notes}
                              onChange={e => setBookingForm({...bookingForm, notes: e.target.value})}
                              className="rounded-none min-h-[120px]"
                              style={{
                                backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                              }}
                            />
                          </div>

                          <div className="p-10 border" style={{ 
                            backgroundColor: 'rgba(6, 182, 212, 0.05)',
                            borderColor: 'rgba(6, 182, 212, 0.2)'
                          }}>
                            <div className="flex items-start gap-4">
                              <Zap className="shrink-0 mt-1" size={20} style={{ color: 'var(--color-accent-brand)' }} />
                              <div>
                                <h4 className="text-sm font-display font-medium uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-primary)' }}>Advance Commitment</h4>
                                <p className="text-xs leading-relaxed font-light mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                                  To secure elite architectural time, a 10% commitment advance is required. This is fully deductible from your final project investment.
                                </p>
                                <div className="text-2xl font-display font-medium" style={{ color: 'var(--color-text-primary)' }}>
                                  {formatMoney(bookingAdvance, currentRegion)}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="pt-6">
                            <TurnstileCaptcha onVerify={setCaptchaToken} />
                            <Button 
                              type="submit" 
                              className="w-full h-16 rounded-none text-[12px] tracking-[0.3em] font-bold"
                              disabled={isSubmittingForm}
                            >
                              {isSubmittingForm ? 'Processing Reservation...' : 'Secure Briefing Session'}
                            </Button>
                          </div>
                        </div>

                        {errorMsg && (
                          <div className="p-6 border text-[10px] font-mono uppercase tracking-widest flex items-center gap-3" style={{ 
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            borderColor: 'rgba(239, 68, 68, 0.2)',
                            color: 'rgb(239, 68, 68)'
                          }}>
                            <AlertCircle size={14} /> {errorMsg}
                          </div>
                        )}
                      </form>
                    )}
                  </div>
                )}
              </FormAuthGate>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal 
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        payload={paymentModalPayload!}
      />
    </div>
  );
}

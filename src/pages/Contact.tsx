import React, { useEffect, useState } from 'react';
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
import { 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  Calendar, 
  Clock, 
  ChevronRight, 
  ArrowLeft, 
  User, 
  Briefcase, 
  HelpCircle,
  MessageSquare,
  Globe,
  Settings,
  CheckCheck
} from 'lucide-react';

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
  const { currentRegion, config, p, isInternational } = useRegion();
  const seo = useRegionalSeo('contact');
  const { user } = useAuth();
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
    { id: 'Ecommerce', title: 'International E-commerce', desc: 'USD-ready storefronts, premium checkout, global conversion' },
    { id: 'Admin Dashboard', title: 'SaaS Interface / Custom CRM', desc: 'Scalable systems for remote-first global teams' },
    { id: 'Branding', title: 'Global Branding & Strategy', desc: 'Premium identity, positioning, and conversion copy' },
    { id: 'Other', title: 'Bespoke Technology Scope', desc: 'AI systems, integrations, and worldwide digital solutions' }
  ] : [
    { id: 'Web Design', title: 'Premium Web Design', desc: 'Custom, blazing fast corporate systems' },
    { id: 'Ecommerce', title: 'Luxury E-commerce', desc: 'Secure checkout, appraisers, high conversions' },
    { id: 'Admin Dashboard', title: 'Bento Dashboard / Custom CRM', desc: 'Secure management with full Supabase integration' },
    { id: 'Branding', title: 'Elite Branding & Strategy', desc: 'Strategic copy, identity, positioning' },
    { id: 'Other', title: 'Special Dev Scope', desc: 'Bespoke systems, custom integrations' }
  ];

  const internationalPaymentMethods = ['PayPal', 'Wise', 'International Bank Transfer', 'Visa', 'Mastercard'];
  const contactIntro = isInternational
    ? 'Submit a premium global project brief or schedule a remote-first strategy consultation for websites, ecommerce platforms, AI systems, and worldwide digital solutions.'
    : 'Submit an elite system briefing blueprint or lock in a direct strategic video consultation with our partners in Colombo, Dubai, and London.';
  const successRegionLabel = isInternational ? 'global strategy team' : `Lead Architect in ${config.countryName}`;

  // Helper to generate the next 10 business days starting today
  const generateBusinessDays = () => {
    const list = [];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let current = new Date();
    let count = 0;

    while (count < 10) {
      current.setDate(current.getDate() + 1);
      // Skip weekends of the calendar to keep bookings realistic
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
      });

      if (error) throw error;

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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not reserve briefing slot.';
      setErrorMsg(message);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Multi-step RFP Next/Prev Navigation and Validation
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

  // Submit Interactive RFP Flow
  const onRfpSubmit = async (data: FormData) => {
    if (!user) {
      setErrorMsg('Please login to continue.');
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

      const { error } = await submitInquiry({
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
      });

      if (error) throw error;

      clearFormDraft(rfpDraftKey);

      setLastRfpService(data.project_type);
      setLastRfpAmount(estimateFromBudget(data.budget, currentRegion));
      setLastRfpEmail(trimmedEmail);
      setLastRfpName(trimmedName);
      setSuccess(true);
      reset();
      setRfpStep(1);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to submit inquiry. Please try again.';
      setErrorMsg(message);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Submit VIP Consultation Calendar Booking
  const handleCalendarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg('Please login to continue.');
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
        notes: '',
      });
      setSelectedDateIndex(null);
      setSelectedTime(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to schedule briefing. Please try again.';
      setErrorMsg(message);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-24 min-h-screen bg-brand-black text-white relative font-sans overflow-hidden">
      <SEO 
        title={seo.title}
        description={seo.description}
        canonicalUrl={getCanonicalUrl(seo.path)}
      />

      {/* Decorative luxury gradient lighting */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 left-10 w-[500px] h-[500px] bg-brand-cyan/5 rounded-full blur-[110px] pointer-events-none z-0"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
        
        {/* Title Content */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/25 text-brand-cyan text-[10px] sm:text-xs font-mono uppercase tracking-widest mb-4 sm:mb-6"
          >
            <Sparkles size={10} className="animate-pulse sm:w-3 sm:h-3" /> Global Client Relationship Hub
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5.5xl font-display font-semibold uppercase tracking-tight mb-4 sm:mb-6 leading-tight"
          >
            Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue">Transformation</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-brand-gray text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto px-4"
          >
            {contactIntro}
          </motion.p>
        </div>

        {/* Global Hub Switcher Tabs */}
        <div className="flex justify-center max-w-[320px] sm:max-w-md mx-auto mb-10 sm:mb-16 p-1.5 bg-white/[0.03] border border-white/10 rounded-2xl relative shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
          <button
            onClick={() => { setActiveTab('rfp'); setErrorMsg(''); }}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 sm:py-3.5 rounded-xl text-[11px] sm:text-xs font-mono uppercase tracking-widest transition-all duration-300 cursor-pointer ${
              activeTab === 'rfp' ? 'bg-brand-cyan text-brand-black font-bold shadow-[0_0_25px_rgba(34,211,238,0.4)]' : 'text-brand-gray hover:text-white'
            }`}
          >
            <Settings size={14} className="sm:w-4 sm:h-4" /> Briefing
          </button>
          <button
            onClick={() => { setActiveTab('calendar'); setErrorMsg(''); }}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 sm:py-3.5 rounded-xl text-[11px] sm:text-xs font-mono uppercase tracking-widest transition-all duration-300 cursor-pointer ${
              activeTab === 'calendar' ? 'bg-brand-cyan text-brand-black font-bold shadow-[0_0_25px_rgba(34,211,238,0.4)]' : 'text-brand-gray hover:text-white'
            }`}
          >
            <Calendar size={14} className="sm:w-4 sm:h-4" /> VIP Calendar
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
          
          {/* LEFT COLUMN: CONTACT DETAILS / CORPORATE VALUES */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6">
            
            <div className="glass-card p-5 sm:p-6 rounded-2xl border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-cyan/[0.02] rounded-full blur-xl"></div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-brand-cyan/10 rounded-xl flex items-center justify-center text-brand-cyan mb-4 border border-brand-cyan/20">
                <Mail size={16} />
              </div>
              <h3 className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-wider mb-2">Corporate Mailbox</h3>
              <p className="text-brand-gray text-[10px] sm:text-xs mb-3 font-light">Direct route for raw RFP briefing documents and enterprise partnerships.</p>
              <a href={`mailto:${config.contactEmail}`} className="text-white hover:text-brand-cyan text-xs sm:text-sm font-mono transition-colors block truncate">
                {config.contactEmail}
              </a>
            </div>

            <div className="glass-card p-5 sm:p-6 rounded-2xl border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/0.02 rounded-full blur-xl"></div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-brand-blue/10 rounded-xl flex items-center justify-center text-brand-blue mb-4 border border-brand-blue/20">
                <Phone size={16} />
              </div>
              <h3 className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-wider mb-2">WhatsApp Relationship</h3>
              <p className="text-brand-gray text-[10px] sm:text-xs mb-3 font-light">Connect securely in real-time with our available platform architects.</p>
              <a href={config.whatsappLink} target="_blank" rel="noreferrer" className="text-white hover:text-brand-cyan text-xs sm:text-sm font-mono transition-colors block">
                {config.whatsappNumber}
              </a>
            </div>

            <div className="glass-card p-5 sm:p-6 rounded-2xl border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.01] rounded-full blur-xl"></div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/5 rounded-xl flex items-center justify-center text-brand-silver mb-4 border border-white/10">
                <MapPin size={16} />
              </div>
              <h3 className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-wider mb-1">Branch Coordinates</h3>
              <p className="text-brand-gray text-[10px] sm:text-xs font-light leading-relaxed">
                Active Headquarters: <br />
                <span className="text-white font-medium">{config.locations.join(', ')}</span>
              </p>
              <div className="text-[9px] sm:text-[10px] text-brand-gray font-mono mt-3 uppercase tracking-widest flex items-center gap-1.5 border-t border-white/5 pt-3">
                <Globe size={11} className="text-brand-cyan" /> Edge CDN routing: v12.0
              </div>
            </div>

            {isInternational && (
              <div className="glass-card p-5 sm:p-6 rounded-2xl border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-cyan/[0.03] rounded-full blur-xl"></div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-brand-cyan/10 rounded-xl flex items-center justify-center text-brand-cyan mb-4 border border-brand-cyan/20">
                  <CheckCircle size={16} />
                </div>
                <h3 className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-wider mb-2">USD Payment Support</h3>
                <p className="text-brand-gray text-[10px] sm:text-xs mb-4 font-light">
                  International invoices for global clients, remote-first teams, SaaS companies, and premium global brands.
                </p>
                <div className="flex flex-wrap gap-2">
                  {internationalPaymentMethods.map((method) => (
                    <span key={method} className="rounded-full border border-white/10 bg-brand-black/50 px-2.5 py-1 text-[9px] font-mono uppercase tracking-[0.14em] text-brand-silver">
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: INTERACTIVE FORM PANELS */}
          <div className="lg:col-span-8 bg-white/[0.01] border border-white/10 p-6 sm:p-10 rounded-3xl relative">
            <div className="absolute -inset-1 bg-gradient-to-b from-brand-blue/10 to-transparent rounded-3xl blur-xl pointer-events-none z-0"></div>
            
            <div className="relative z-10">

              {errorMsg && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                  <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
                  <p className="text-xs text-red-400 font-mono tracking-wide">{errorMsg}</p>
                </div>
              )}

              {/* A. RFP SYSTEM BRIEFING (MULTI-STEP) */}
              {activeTab === 'rfp' && (
                <FormAuthGate>
                <div>
                  
                  {/* Step Progress indicators */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest font-bold">
                        Phase {rfpStep} of 3: {
                          rfpStep === 1 ? 'System Vision' :
                          rfpStep === 2 ? 'Investment & Time' :
                          'Corporate Coordinates'
                        }
                      </span>
                      <span className="text-xs font-mono text-brand-gray">{Math.round((rfpStep / 3) * 100)}% Lock</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-brand-cyan h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(34,211,238,0.4)]"
                        style={{ width: `${(rfpStep / 3) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {success ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-10 space-y-4"
                    >
                      <div className="w-16 h-16 bg-[#22c55e]/10 border border-[#22c55e]/35 rounded-full flex items-center justify-center text-[#22c55e] mx-auto mb-2 drop-shadow-[0_0_15px_rgba(34,197,94,0.15)]">
                        <CheckCheck size={32} />
                      </div>
                      <h3 className="text-2xl font-display font-semibold uppercase text-white tracking-wider">System RFP Received</h3>
                      <p className="text-sm text-brand-gray max-w-md mx-auto font-light leading-relaxed">
                        We have successfully registered your project blueprint parameters. Our {successRegionLabel} will evaluate the specifications and contact you on WhatsApp/Email within 12 hours.
                      </p>
                      <PaymentSuccessActions
                        serviceName={lastRfpService || 'Custom Project'}
                        totalAmount={lastRfpAmount || estimateFromBudget('', currentRegion)}
                        guestEmail={lastRfpEmail}
                        guestName={lastRfpName}
                      />
                      <Button onClick={() => setSuccess(false)} variant="outline" size="sm" className="font-mono text-xs uppercase tracking-widest mt-4">
                        Submit another brief
                      </Button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit(onRfpSubmit)} className="space-y-6">
                      
                      {/* Step 1: System Vision */}
                      {rfpStep === 1 && (
                        <motion.div 
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-6"
                        >
                          <div className="space-y-2">
                            <h3 className="text-base sm:text-lg font-display font-medium text-white mb-2 uppercase tracking-wide">01. What system are we engineering?</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {projectTypeOptions.map((opt) => {
                                const isSelected = watchedProjectType === opt.id;
                                return (
                                  <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => {
                                      setValue('project_type', opt.id);
                                      setErrorMsg('');
                                    }}
                                    className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                                      isSelected 
                                        ? 'bg-brand-cyan/10 border-brand-cyan shadow-[0_0_12px_rgba(34,211,238,0.1)] text-white' 
                                        : 'border-white/5 bg-transparent text-brand-gray hover:text-white hover:border-white/15'
                                    }`}
                                  >
                                    <h4 className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider mb-1">{opt.title}</h4>
                                    <p className="text-[9px] sm:text-[10px] text-brand-gray font-light max-w-full leading-snug">{opt.desc}</p>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-mono text-brand-silver uppercase tracking-wider block">Key Business Goals & Objectives</label>
                            <Textarea 
                              {...register('goals')}
                              placeholder={isInternational ? "e.g. Launch worldwide digital solutions, improve SaaS conversion, prepare an AI-ready global customer experience..." : "e.g. Expand retail gold collections globally, reduce page load shift under slow mobile nodes, improve overall visual brand value..."}
                              className="bg-brand-navy/30 border-white/10 text-xs min-h-[100px]"
                            />
                          </div>

                          <div className="pt-4 flex justify-end">
                            <Button type="button" onClick={handleNextStep} className="font-mono text-xs uppercase tracking-widest h-11 px-6 font-bold">
                              Continue Specifications <ChevronRight size={14} className="ml-1" />
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 2: Investment & Time */}
                      {rfpStep === 2 && (
                        <motion.div 
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-6"
                        >
                          <div className="space-y-2">
                            <h3 className="text-base sm:text-lg font-display font-medium text-white mb-2 uppercase tracking-wide">02. Investment and Development cycles</h3>
                            <label className="text-[10px] sm:text-xs font-mono text-brand-silver uppercase tracking-wider block">Target Portfolio Investment</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {budgetOptions.map((opt) => {
                                const isSelected = watchedBudget === opt.value;
                                return (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                      setValue('budget', opt.value);
                                      setErrorMsg('');
                                    }}
                                    className={`p-3 sm:p-4 rounded-xl border text-left transition-all cursor-pointer ${
                                      isSelected
                                        ? 'bg-brand-cyan/10 border-brand-cyan text-white shadow-[0_0_12px_rgba(34,211,238,0.1)]'
                                        : 'border-white/5 bg-transparent text-brand-gray hover:text-white hover:border-white/15'
                                    }`}
                                  >
                                    <span className="text-[10px] sm:text-xs font-mono font-bold block uppercase">{opt.value}</span>
                                    <span className="text-[9px] sm:text-[10px] text-brand-gray block font-light mt-0.5">{opt.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="space-y-2 pt-2">
                            <label className="text-[10px] sm:text-xs font-mono text-brand-silver uppercase tracking-wider block">Launch Speedframe Timeline</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {['1 Month', '3 Months', 'Flexible'].map((t) => {
                                const isSelected = watch('timeline') === t;
                                return (
                                  <button
                                    key={t}
                                    type="button"
                                    onClick={() => setValue('timeline', t)}
                                    className={`py-3 sm:py-3.5 rounded-lg border text-[10px] sm:text-xs font-mono uppercase tracking-wider transition-all cursor-pointer text-center ${
                                      isSelected
                                        ? 'bg-brand-cyan/10 border-brand-cyan text-white shadow-[0_0_8px_rgba(34,211,238,0.1)]'
                                        : 'border-white/5 bg-transparent text-brand-gray hover:text-white hover:border-white/15'
                                    }`}
                                  >
                                    {t}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="pt-4 flex justify-between">
                            <Button type="button" onClick={handlePrevStep} variant="outline" className="font-mono text-xs uppercase tracking-widest h-11 border-white/10 px-5 text-brand-gray hover:text-white">
                              <ArrowLeft size={14} className="mr-1" /> Vision
                            </Button>
                            <Button type="button" onClick={handleNextStep} className="font-mono text-xs uppercase tracking-widest h-11 px-6 font-bold">
                              Partner Coordinates <ChevronRight size={14} className="ml-1" />
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 3: Identity & Coordinates */}
                      {rfpStep === 3 && (
                        <motion.div 
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-6"
                        >
                          <h3 className="text-lg font-display font-medium text-white mb-2 uppercase tracking-wide">03. Corporate Relationship Coordinator</h3>
                          
                          <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-5">
                            <div className="space-y-1.5">
                              <label className="text-xs font-mono text-brand-silver uppercase">Full Coordinator Name *</label>
                              <Input {...register('name', { required: 'Name is strictly required' })} placeholder="e.g. Johnathan Ross" className="bg-brand-navy/20 border-white/10 text-xs" />
                              {errors.name && <span className="text-[10px] text-red-400 font-mono">{errors.name.message}</span>}
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-mono text-brand-silver uppercase">Direct Business Email *</label>
                              <Input type="email" {...register('email', { required: 'Email address is required' })} placeholder="e.g. j.ross@brand.com" className="bg-brand-navy/20 border-white/10 text-xs" />
                              {errors.email && <span className="text-[10px] text-red-400 font-mono">{errors.email.message}</span>}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-5">
                            <div className="space-y-1.5">
                              <label className="text-xs font-mono text-brand-silver uppercase flex justify-between">
                                WhatsApp Contact Phone
                              </label>
                              <Input {...register('whatsapp')} placeholder={isInternational ? "e.g. +1 415 555 0198" : "e.g. +94 76 273 7411"} className="bg-brand-navy/20 border-white/10 text-xs" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-mono text-brand-silver uppercase">Corporate Entity / Business Name</label>
                              <Input {...register('business_name')} placeholder="e.g. Ross Advisory Ltd" className="bg-brand-navy/20 border-white/10 text-xs" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] sm:text-xs font-mono text-brand-silver uppercase block">Preferred Contact Gateway</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {['WhatsApp', 'Email', 'Voice Call'].map((m) => {
                                const isSelected = watch('preferred_contact') === m;
                                return (
                                  <button
                                    key={m}
                                    type="button"
                                    onClick={() => setValue('preferred_contact', m)}
                                    className={`py-2.5 sm:py-3 rounded-lg border text-[10px] sm:text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer text-center ${
                                      isSelected
                                        ? 'bg-brand-cyan/10 border-brand-cyan text-white shadow-[0_0_8px_rgba(34,211,238,0.1)]'
                                        : 'border-white/5 bg-transparent text-brand-gray hover:text-white hover:border-white/15'
                                    }`}
                                  >
                                    {m}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="space-y-2.5">
                            <label className="text-xs font-mono text-brand-silver uppercase block">Additional RFP Directives (Optional)</label>
                            <Textarea 
                              {...register('message')} 
                              placeholder={isInternational ? "Any global payment requirements, SaaS workflow details, AI integrations, market launch priorities, or enterprise compliance notes..." : "Any secondary server API hooks instructions, payment structures routing requests, maintenance plans requirements..."} 
                              className="bg-brand-navy/20 border-white/10 text-xs min-h-[100px]"
                            />
                          </div>

                          <div className="pt-4 flex justify-between">
                            <Button type="button" onClick={handlePrevStep} variant="outline" className="font-mono text-xs uppercase tracking-widest h-11 border-white/10 h-11 px-5 text-brand-gray hover:text-white">
                              <ArrowLeft size={14} className="mr-1" /> Budget
                            </Button>
                            <Button type="submit" disabled={isSubmittingForm} className="font-mono text-xs uppercase tracking-widest h-11 px-8 luxury-glow font-bold">
                              {isSubmittingForm ? 'Synthesizing Blueprint...' : 'Submit System RFP'}
                            </Button>
                          </div>
                        </motion.div>
                      )}

                    </form>
                  )}
                </div>
                </FormAuthGate>
              )}

              {/* B. VIP STRATEGY CALENDAR (BOOKING FLOW) */}
              {activeTab === 'calendar' && (
                <FormAuthGate>
                <div>
                  
                  {bookingSuccess ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-10 space-y-4"
                    >
                      <div className="w-16 h-16 bg-brand-cyan/10 border border-brand-cyan/35 rounded-full flex items-center justify-center text-brand-cyan mx-auto mb-2 drop-shadow-[0_0_15px_rgba(34,211,238,0.15)]">
                        <CheckCheck size={32} />
                      </div>
                      <h3 className="text-2xl font-display font-semibold uppercase text-white tracking-wider">Strategy Briefing Confirmed</h3>
                      <p className="text-sm text-brand-gray max-w-md mx-auto font-light leading-relaxed">
                        Your strategic video consultation is scheduled successfully. Check your email for direct Google Meet locks and calendar invites.
                      </p>
                      <Button onClick={() => setBookingSuccess(false)} variant="outline" size="sm" className="font-mono text-xs uppercase tracking-widest mt-4">
                        Schedule another slot
                      </Button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleCalendarSubmit} className="space-y-6 animate-fade-in">
                      
                      <div>
                        <h3 className="text-base sm:text-lg font-display font-medium text-white mb-2 uppercase tracking-wide">01. Select Briefing Date</h3>
                        <p className="text-[10px] sm:text-xs text-brand-gray mb-4">Click below to locate an available date. Business days only.</p>
                        
                        {/* Custom visual calendar date slider */}
                        <div className="grid grid-cols-2 min-[400px]:grid-cols-3 sm:grid-cols-5 gap-2">
                          {businessDaysList.map((day, dIdx) => {
                            const isSelected = selectedDateIndex === dIdx;
                            return (
                              <button
                                key={dIdx}
                                type="button"
                                onClick={() => {
                                  setSelectedDateIndex(dIdx);
                                  setErrorMsg('');
                                }}
                                className={`p-2 sm:p-3.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                                  isSelected
                                    ? 'bg-brand-cyan text-brand-black border-brand-cyan shadow-[0_0_15px_rgba(34,211,238,0.25)] font-bold'
                                    : 'border-white/5 bg-brand-navy/10 text-brand-gray hover:text-white hover:border-white/15'
                                }`}
                              >
                                <span className="text-[8px] sm:text-[10px] font-mono tracking-wider uppercase block">{day.dayName}</span>
                                <span className={`text-lg sm:text-2xl font-mono block my-0.5 sm:my-1 ${isSelected ? 'text-brand-black' : 'text-white'}`}>{day.dayNum}</span>
                                <span className="text-[8px] sm:text-[9px] font-mono uppercase opacity-75">{day.monthName}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="pt-2">
                        <h3 className="text-base sm:text-lg font-display font-medium text-white mb-2 uppercase tracking-wide">02. Select Preferred Time</h3>
                        
                        {/* Timeslot buttons */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {availableHoursList.map((slot) => {
                            const isSelected = selectedTime === slot.time;
                            return (
                              <button
                                key={slot.time}
                                type="button"
                                onClick={() => {
                                  setSelectedTime(slot.time);
                                  setErrorMsg('');
                                }}
                                className={`py-2.5 sm:py-3 rounded-lg border text-[10px] sm:text-[11px] font-mono transition-all uppercase cursor-pointer text-center ${
                                  isSelected
                                    ? 'bg-brand-cyan text-brand-black border-brand-cyan shadow-[0_0_12px_rgba(34,211,238,0.2)] font-bold'
                                    : 'border-white/5 bg-transparent text-brand-gray hover:text-white hover:border-white/10'
                                }`}
                              >
                                {slot.time} <span className="text-[7px] sm:text-[8px] opacity-75 block mt-0.5">{slot.zone} local</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="pt-2 space-y-4">
                        <h3 className="text-lg font-display font-medium text-white mb-2 uppercase tracking-wide">03. Partners Consultation Registration Details</h3>
                        
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-5">
                          <div className="space-y-1.5">
                            <label className="text-xs font-mono text-brand-silver uppercase">Your Full Name *</label>
                            <Input 
                              required
                              value={bookingForm.name}
                              onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="e.g. David Sterling" 
                              className="bg-brand-navy/20 border-white/10 text-xs text-white" 
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-mono text-brand-silver uppercase">Corporate Email Address *</label>
                            <Input 
                              required
                              type="email"
                              value={bookingForm.email}
                              onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                              placeholder="e.g. d.sterling@sterlingcorp.com" 
                              className="bg-brand-navy/20 border-white/10 text-xs text-white" 
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-5">
                          <div className="space-y-1.5">
                            <label className="text-xs font-mono text-brand-silver uppercase">WhatsApp Contact Line</label>
                            <Input 
                              value={bookingForm.whatsapp}
                              onChange={(e) => setBookingForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                              placeholder={isInternational ? "e.g. +44 20 0000 0000" : "e.g. +92 300 XXXXXXX"} 
                              className="bg-brand-navy/20 border-white/10 text-xs text-white" 
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-mono text-brand-silver uppercase">Joint-Entity / Business Name</label>
                            <Input 
                              value={bookingForm.business_name}
                              onChange={(e) => setBookingForm(prev => ({ ...prev, business_name: e.target.value }))}
                              placeholder="e.g. Sterling Holdings" 
                              className="bg-brand-navy/20 border-white/10 text-xs text-white" 
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-5">
                          <div className="space-y-1.5 col-span-2">
                            <label className="text-xs font-mono text-brand-silver uppercase">Meeting Agenda Category</label>
                            <select 
                              value={bookingForm.project_category}
                              onChange={(e) => setBookingForm(prev => ({ ...prev, project_category: e.target.value }))}
                              className="flex h-11 w-full rounded-sm border border-white/10 bg-brand-navy/50 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-brand-cyan"
                            >
                              <option value="Web Design">Bespoke Strategic Web Architecture</option>
                              <option value="Ecommerce">High-Converting E-commerce flagship</option>
                              <option value="Admin Dashboard">Corporate Systems & Supabase Admin nodes</option>
                              <option value="Branding">Search optimization (SEO) and Digital Identity branding</option>
                              <option value="Other">Bespoke tech scope</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1.5 pt-2">
                          <label className="text-xs font-mono text-brand-silver uppercase">Consultation Brief / Key Technical Notes</label>
                          <Textarea 
                            value={bookingForm.notes}
                            onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder="Detail any timelines constraints, existing URLs to audit during video call, preferred platform frameworks..." 
                            className="bg-brand-navy/20 border-white/10 text-xs min-h-[100px]"
                          />
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-brand-black/50 border border-white/5 space-y-2">
                        <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest">
                          <span className="text-brand-gray">Estimated Project</span>
                          <span className="text-white">{formatMoney(bookingEstimate, config.currency)}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest">
                          <span className="text-brand-gray">10% Strategy Slot Advance</span>
                          <span className="text-brand-cyan font-bold">{formatMoney(bookingAdvance, config.currency)}</span>
                        </div>
                      </div>

                      <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-end">
                        <Button
                          type="button"
                          disabled={isSubmittingForm}
                          onClick={openBookingPayment}
                          className="font-mono text-xs uppercase tracking-widest h-12 px-6 luxury-glow font-bold"
                        >
                          Book Slot & Pay 10% Advance
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmittingForm}
                          variant="outline"
                          className="font-mono text-xs uppercase tracking-widest h-12 px-6 border-white/10"
                        >
                          {isSubmittingForm ? 'Securing Slot...' : 'Confirm Invitation Only'}
                        </Button>
                      </div>

                    </form>
                  )}

                </div>
                </FormAuthGate>
              )}

            </div>
          </div>

        </div>
      </div>
      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        payload={paymentModalPayload}
      />
    </div>
  );
}

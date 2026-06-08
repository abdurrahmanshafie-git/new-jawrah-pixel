import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { TurnstileCaptcha } from '@/components/ui/TurnstileCaptcha';
import { useAuth } from '@/contexts/AuthContext';
import { clearFormDraft, loadFormDraft, saveFormDraft } from '@/lib/email/formDrafts';
import { isValidEmail } from '@/lib/validation';
import { ANALYTICS_EVENTS, trackEvent, trackLead } from '@/lib/analytics';
import { submitPartnerApplication } from '@/lib/partner/application';
import {
  businessTypeOptions,
  experienceLevels,
  networkSizeOptions,
  partnerTypes,
  type RegionPartnerCopy,
} from '@/data/partnerDefaults';
import type { RegionCode } from '@/types';
import { PartnerSuccessState } from './PartnerSuccessState';

interface PartnerApplicationFormProps {
  region: RegionCode;
  copy: RegionPartnerCopy;
  countryName: string;
}

interface FormValues {
  name: string;
  email: string;
  whatsapp: string;
  country: string;
  city: string;
  profileLink: string;
  partnerType: string;
  experienceLevel: string;
  networkSize: string;
  businessTypes: string[];
  message: string;
}

type ErrorMap = Partial<Record<keyof FormValues | 'captcha' | 'auth' | 'form', string>>;

function initialValues(copy: RegionPartnerCopy, countryName: string): FormValues {
  return {
    name: '',
    email: '',
    whatsapp: '',
    country: countryName,
    city: copy.cityOptions[0] ?? '',
    profileLink: '',
    partnerType: '',
    experienceLevel: '',
    networkSize: '',
    businessTypes: [],
    message: '',
  };
}

export function PartnerApplicationForm({ region, copy, countryName }: PartnerApplicationFormProps) {
  const { user, session } = useAuth();
  const draftKey = `partner-application:${region}`;
  const [values, setValues] = useState<FormValues>(() => initialValues(copy, countryName));
  const [errors, setErrors] = useState<ErrorMap>({});
  const [captchaToken, setCaptchaToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successEmail, setSuccessEmail] = useState('');
  const startedRef = useRef(false);

  useEffect(() => {
    const saved = loadFormDraft<FormValues>(draftKey);
    setValues(saved ?? initialValues(copy, countryName));
    setErrors({});
    setCaptchaToken('');
    setSuccessEmail('');
  }, [copy, countryName, draftKey]);

  useEffect(() => {
    if (user || successEmail) return;
    saveFormDraft(draftKey, values);
  }, [draftKey, successEmail, user, values]);

  const selectedBusinessTypes = useMemo(() => new Set(values.businessTypes), [values.businessTypes]);

  const updateValue = <Key extends keyof FormValues>(key: Key, value: FormValues[Key]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined, form: undefined }));
    if (!startedRef.current) {
      startedRef.current = true;
      trackEvent(ANALYTICS_EVENTS.APPLICATION_STARTED, {
        region,
        city: key === 'city' ? value : values.city,
        partner_type: key === 'partnerType' ? value : values.partnerType,
      });
    }
  };

  const toggleBusinessType = (type: string) => {
    const next = selectedBusinessTypes.has(type)
      ? values.businessTypes.filter((item) => item !== type)
      : [...values.businessTypes, type];
    updateValue('businessTypes', next);
  };

  const validate = (): ErrorMap => {
    const next: ErrorMap = {};
    if (values.name.trim().length < 2) next.name = 'Enter your full name.';
    if (!isValidEmail(values.email)) next.email = 'Enter a valid professional email.';
    if (values.whatsapp.trim().replace(/[^0-9]/g, '').length < 7) next.whatsapp = 'Enter a valid WhatsApp number.';
    if (!values.country.trim()) next.country = 'Enter your country.';
    if (!values.city.trim()) next.city = 'Select your city or region.';
    if (values.profileLink.trim()) {
      try {
        const url = new URL(values.profileLink.trim());
        if (!['http:', 'https:'].includes(url.protocol)) next.profileLink = 'Use a valid http or https link.';
      } catch {
        next.profileLink = 'Use a valid profile URL.';
      }
    }
    if (!values.partnerType) next.partnerType = 'Select a partner type.';
    if (!values.experienceLevel) next.experienceLevel = 'Select your experience level.';
    if (!values.networkSize) next.networkSize = 'Select your estimated network size.';
    if (!values.businessTypes.length) next.businessTypes = 'Select at least one business type.';
    if (values.message.trim().length < 30) next.message = 'Share at least 30 characters about your fit.';
    if (!captchaToken) next.captcha = 'Complete the security verification.';
    if (!user || !session?.access_token) next.auth = 'Sign in before submitting your final application.';
    return next;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      trackEvent(ANALYTICS_EVENTS.APPLICATION_FAILED, {
        region,
        city: values.city,
        partner_type: values.partnerType,
        reason: Object.keys(nextErrors).join(','),
      });
      return;
    }

    const formData = new FormData(event.currentTarget);
    setIsSubmitting(true);
    setErrors({});
    trackEvent(ANALYTICS_EVENTS.APPLICATION_SUBMITTED, {
      region,
      city: values.city,
      partner_type: values.partnerType,
    });

    const result = await submitPartnerApplication(
      {
        ...values,
        region,
        name: values.name.trim(),
        email: values.email.trim(),
        whatsapp: values.whatsapp.trim(),
        country: values.country.trim(),
        city: values.city.trim(),
        profileLink: values.profileLink.trim(),
        message: values.message.trim(),
        captchaToken,
        companyWebsite: String(formData.get('companyWebsite') ?? ''),
      },
      session!.access_token,
    );

    setIsSubmitting(false);

    if (!result.ok) {
      setErrors({ form: result.error || 'Unable to submit the application. Please try again.' });
      trackEvent(ANALYTICS_EVENTS.APPLICATION_FAILED, {
        region,
        city: values.city,
        partner_type: values.partnerType,
        reason: result.error,
      });
      return;
    }

    trackLead('partner_application', {
      region,
      city: values.city,
      partner_type: values.partnerType,
    });
    trackEvent(ANALYTICS_EVENTS.APPLICATION_SUCCESS, {
      region,
      city: values.city,
      partner_type: values.partnerType,
      application_id: result.applicationId,
    });
    clearFormDraft(draftKey);
    setSuccessEmail(values.email.trim());
    setValues(initialValues(copy, countryName));
    setCaptchaToken('');
  };

  if (successEmail) {
    return <PartnerSuccessState email={successEmail} onReset={() => setSuccessEmail('')} />;
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-white/10 bg-black/70 p-5 md:p-8">
      <div className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-8 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-brand-cyan">
            Application
          </span>
          <h2 className="mt-4 text-3xl font-display font-semibold uppercase leading-tight tracking-normal text-white md:text-5xl">
            Apply to Become a Partner
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-500">
            Complete the application once. Your draft is saved locally until you submit.
          </p>
        </div>
        <div className="rounded-md border border-brand-cyan/25 bg-brand-cyan/10 p-4 text-sm leading-6 text-zinc-300 lg:max-w-xs">
          <ShieldCheck className="mb-3 h-5 w-5 text-brand-cyan" />
          Server-side validation, Turnstile verification, rate limiting, duplicate prevention, and audit logging protect submissions.
        </div>
      </div>

      <input
        type="text"
        name="companyWebsite"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Full name" htmlFor="partner-name" error={errors.name}>
          <Input
            id="partner-name"
            value={values.name}
            onChange={(event) => updateValue('name', event.target.value)}
            placeholder="Your full name"
            autoComplete="name"
            className="h-12 rounded-md bg-white/[0.035]"
          />
        </Field>

        <Field label="Professional email" htmlFor="partner-email" error={errors.email}>
          <Input
            id="partner-email"
            type="email"
            value={values.email}
            onChange={(event) => updateValue('email', event.target.value)}
            placeholder="name@company.com"
            autoComplete="email"
            className="h-12 rounded-md bg-white/[0.035]"
          />
        </Field>

        <Field label="WhatsApp number" htmlFor="partner-whatsapp" error={errors.whatsapp}>
          <Input
            id="partner-whatsapp"
            value={values.whatsapp}
            onChange={(event) => updateValue('whatsapp', event.target.value)}
            placeholder="+94 76 000 0000"
            autoComplete="tel"
            className="h-12 rounded-md bg-white/[0.035]"
          />
        </Field>

        <Field label="Country" htmlFor="partner-country" error={errors.country}>
          <Input
            id="partner-country"
            value={values.country}
            onChange={(event) => updateValue('country', event.target.value)}
            placeholder={countryName}
            autoComplete="country-name"
            className="h-12 rounded-md bg-white/[0.035]"
          />
        </Field>

        <Field label="City / region" htmlFor="partner-city" error={errors.city}>
          <Select
            id="partner-city"
            value={values.city}
            onChange={(value) => updateValue('city', value)}
            options={copy.cityOptions}
          />
        </Field>

        <Field label="Profile link" htmlFor="partner-profile" error={errors.profileLink}>
          <Input
            id="partner-profile"
            value={values.profileLink}
            onChange={(event) => updateValue('profileLink', event.target.value)}
            placeholder="https://linkedin.com/in/yourname"
            autoComplete="url"
            className="h-12 rounded-md bg-white/[0.035]"
          />
        </Field>

        <Field label="Partner type" htmlFor="partner-type" error={errors.partnerType}>
          <Select
            id="partner-type"
            value={values.partnerType}
            onChange={(value) => updateValue('partnerType', value)}
            options={partnerTypes}
            placeholder="Select partner type"
          />
        </Field>

        <Field label="Experience level" htmlFor="partner-experience" error={errors.experienceLevel}>
          <Select
            id="partner-experience"
            value={values.experienceLevel}
            onChange={(value) => updateValue('experienceLevel', value)}
            options={experienceLevels}
            placeholder="Select experience"
          />
        </Field>

        <Field label="Estimated network size" htmlFor="partner-network" error={errors.networkSize}>
          <Select
            id="partner-network"
            value={values.networkSize}
            onChange={(value) => updateValue('networkSize', value)}
            options={networkSizeOptions}
            placeholder="Select network size"
          />
        </Field>
      </div>

      <Field label="What type of businesses can you refer?" error={errors.businessTypes} className="mt-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {businessTypeOptions.map((type) => (
            <label
              key={type}
              className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-md border p-3 text-sm transition-colors ${
                selectedBusinessTypes.has(type)
                  ? 'border-brand-cyan/45 bg-brand-cyan/10 text-white'
                  : 'border-white/10 bg-white/[0.025] text-zinc-400 hover:border-white/20'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedBusinessTypes.has(type)}
                onChange={() => toggleBusinessType(type)}
                className="h-4 w-4 accent-brand-cyan"
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </Field>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Field label="Why do you want to join?" htmlFor="partner-message" error={errors.message}>
          <Textarea
            id="partner-message"
            value={values.message}
            onChange={(event) => updateValue('message', event.target.value)}
            placeholder="Share your goals, network, and why Jawrah Pixel is a good fit."
            className="min-h-[170px] rounded-md bg-white/[0.035]"
          />
        </Field>
        <div className="rounded-lg border border-white/10 bg-white/[0.025] p-5">
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-brand-cyan">
            Before submission
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-400">
            <li>Use accurate business information and a reachable WhatsApp number.</li>
            <li>Final submission requires a Jawrah Pixel account and security verification.</li>
            <li>Approved partners receive referral tracking and partner dashboard access.</li>
          </ul>
          {!user && (
            <div className="mt-5 rounded-md border border-white/10 bg-black/50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <Lock className="h-4 w-4 text-brand-cyan" />
                Sign in before final submission
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Link to="/login" className="w-full">
                  <Button type="button" className="w-full" magnetic={false}>
                    Login
                  </Button>
                </Link>
                <Link to="/signup" className="w-full">
                  <Button type="button" variant="outline" className="w-full" magnetic={false}>
                    Create Account
                  </Button>
                </Link>
              </div>
              {errors.auth && <p className="mt-3 text-xs text-red-300">{errors.auth}</p>}
            </div>
          )}
        </div>
      </div>

      <div className="mt-7 border-t border-white/10 pt-7">
        <TurnstileCaptcha
          onVerify={(token) => {
            setCaptchaToken(token);
            setErrors((current) => ({ ...current, captcha: undefined, form: undefined }));
          }}
        />
        {errors.captcha && <p className="mb-4 text-center text-xs text-red-300">{errors.captcha}</p>}
        {errors.form && (
          <div className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {errors.form}
          </div>
        )}
        {errors.auth && user && <p className="mb-4 text-center text-xs text-red-300">{errors.auth}</p>}
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting Application...' : 'Submit Partner Application'}
          {!isSubmitting && <ArrowRight className="h-4 w-4" />}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
  className = '',
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="mb-3 block text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-500"
      >
        {label}
      </label>
      {children}
      {error && <p className="mt-2 text-xs leading-5 text-red-300">{error}</p>}
    </div>
  );
}

function Select({
  id,
  value,
  options,
  placeholder,
  onChange,
}: {
  id: string;
  value: string;
  options: string[];
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-12 w-full rounded-md border border-white/10 bg-brand-navy/70 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option} value={option} className="bg-brand-black">
          {option}
        </option>
      ))}
    </select>
  );
}

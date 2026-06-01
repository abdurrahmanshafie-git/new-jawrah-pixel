/**
 * Jawrah Pixel - GA4 Analytics Utility
 * Measurement ID: G-CNEZLRQ2C3
 */

// Define gtag as a global function for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GA_MEASUREMENT_ID = 'G-CNEZLRQ2C3';

/**
 * Tracks a page view event in GA4
 */
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

/**
 * Tracks a custom event in GA4
 */
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

/**
 * Tracks lead generation events (Contact, Project Start, etc.)
 */
export const trackLead = (type: string, details?: Record<string, any>) => {
  trackEvent('generate_lead', {
    lead_type: type,
    ...details
  });
};

/**
 * Tracks purchase/payment related events
 */
export const trackPurchase = (transactionId: string, amount: number, currency: string = 'USD') => {
  trackEvent('purchase', {
    transaction_id: transactionId,
    value: amount,
    currency: currency
  });
};

/**
 * Tracks contact-specific interactions
 */
export const trackContact = (method: 'whatsapp' | 'email' | 'form', label?: string) => {
  trackEvent('contact', {
    method,
    label
  });
};

/**
 * Analytics Event Constants for easy re-use
 */
export const ANALYTICS_EVENTS = {
  CONTACT_FORM_SUBMIT: 'contact_form_submit',
  START_PROJECT_CLICK: 'start_project_click',
  GET_PROPOSAL_CLICK: 'get_proposal_click',
  WHATSAPP_CLICK: 'whatsapp_click',
  EMAIL_CLICK: 'email_click',
  LOGIN: 'login',
  SIGNUP: 'signup',
  CLIENT_REGISTER: 'client_registration',
  AGENT_REGISTER: 'agent_registration',
  CHECKOUT_STARTED: 'begin_checkout',
  PAYMENT_SUBMITTED: 'payment_submitted',
  PROPOSAL_ACCEPTED: 'proposal_accepted',
};

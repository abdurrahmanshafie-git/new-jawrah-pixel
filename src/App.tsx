import { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { RootLayout, AdminLayout, ClientLayout, AgentLayout } from './components/layout/Layouts';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { SleekLoader } from './components/ui/SleekLoader';
import { RequireAuth } from './components/auth/RequireAuth';
import { useAuth } from './contexts/AuthContext';
import { getSavedAdminRegion, getSavedRegion, isRegionCode, regionPath } from './lib/region';
import { trackPageView } from './lib/analytics';
import { lazyWithRetry, scheduleIdlePreload } from './lib/lazyWithRetry';

// Analytics Tracker Component
function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
}

// Lazy Loaded Pages with Deployment Auto-Retry
const CountrySelection = lazyWithRetry(() => import('./pages/CountrySelection'), 'CountrySelection');
const Home = lazyWithRetry(() => import('./pages/Home'), 'Home');
const About = lazyWithRetry(() => import('./pages/About'), 'About');
const Services = lazyWithRetry(() => import('./pages/Services'), 'Services');
const Pricing = lazyWithRetry(() => import('./pages/Pricing'), 'Pricing');
const ServiceLandingPage = lazyWithRetry(() => import('./pages/ServiceLandingPage'), 'ServiceLandingPage');
const Process = lazyWithRetry(() => import('./pages/Process'), 'Process');
const CaseStudies = lazyWithRetry(() => import('./pages/CaseStudies'), 'CaseStudies');
const CaseStudyDetail = lazyWithRetry(() => import('./pages/CaseStudyDetail'), 'CaseStudyDetail');
const Leadership = lazyWithRetry(() => import('./pages/Leadership'), 'Leadership');
const Contact = lazyWithRetry(() => import('./pages/Contact'), 'Contact');
const Partner = lazyWithRetry(() => import('./pages/Partner'), 'Partner');
const AgentsRedirect = lazyWithRetry(() => import('./pages/Agents'), 'Agents');
const PrivacyPolicy = lazyWithRetry(() => import('./pages/PrivacyPolicy'), 'PrivacyPolicy');
const TermsAndConditions = lazyWithRetry(() => import('./pages/TermsAndConditions'), 'TermsAndConditions');
const RefundPolicy = lazyWithRetry(() => import('./pages/RefundPolicy'), 'RefundPolicy');
const Blog = lazyWithRetry(() => import('./pages/Blog'), 'Blog');
const BlogPostDetail = lazyWithRetry(() => import('./pages/BlogPostDetail'), 'BlogPostDetail');
const NotFoundPage = lazyWithRetry(() => import('./pages/NotFoundPage'), 'NotFoundPage');

// AI Entity Pages
const WhatIsJawrahPixel = lazyWithRetry(() => import('./pages/ai/WhatIsJawrahPixel'), 'WhatIsJawrahPixel');
const WhyJawrahPixel = lazyWithRetry(() => import('./pages/ai/WhyJawrahPixel'), 'WhyJawrahPixel');
const AboutFounder = lazyWithRetry(() => import('./pages/ai/AboutFounder'), 'AboutFounder');

// Auth Pages
const Login = lazyWithRetry(() => import('./pages/auth/Login'), 'Login');
const SignUp = lazyWithRetry(() => import('./pages/auth/SignUp'), 'SignUp');

// Dashboards
const AdminDashboard = lazyWithRetry(() => import('./pages/admin/AdminDashboard'), 'AdminDashboard');
const ClientDashboard = lazyWithRetry(() => import('./pages/client/ClientDashboard'), 'ClientDashboard');
const AgentDashboard = lazyWithRetry(() => import('./pages/agent/AgentDashboard'), 'AgentDashboard');
const CheckoutPage = lazyWithRetry(() => import('./pages/checkout/CheckoutPage'), 'CheckoutPage');
const PaymentSuccessPage = lazyWithRetry(() => import('./pages/checkout/PaymentSuccessPage'), 'PaymentSuccessPage');

// Route Preloader Component (runs on idle after initial render)
function RoutePreloader() {
  useEffect(() => {
    scheduleIdlePreload([
      Home.preload,
      CountrySelection.preload,
      Services.preload,
      About.preload,
      Contact.preload,
      Pricing.preload,
      Leadership.preload,
    ]);
  }, []);

  return null;
}

function CheckoutRedirect() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  if (!invoiceId) return <Navigate to="/dashboard" replace />;
  return <Navigate to={`/dashboard/checkout/${invoiceId}`} replace />;
}

function RegionalRedirect({ path = '/' }: { path?: string }) {
  const { user, profile } = useAuth();

  const profileRegion = isRegionCode(profile?.region) ? profile.region : null;
  const region = profile?.role === 'admin' || profile?.role === 'superadmin'
    ? getSavedAdminRegion() ?? profileRegion ?? getSavedRegion()
    : user && profileRegion ? profileRegion : getSavedRegion();
  return <Navigate to={region ? regionPath(region, path) : '/'} replace />;
}

function RegionalCaseStudyRedirect() {
  const { slug } = useParams<{ slug: string }>();
  const { profile } = useAuth();
  const region = profile?.region ?? getSavedRegion() ?? 'lk';
  return <Navigate to={`/${region}/case-studies/${slug}`} replace />;
}

function AppEntryRedirect() {
  const { user, profile } = useAuth();

  if (user) {
    const profileRegion = isRegionCode(profile?.region) ? profile.region : null;
    if (profileRegion) {
      return <Navigate to={regionPath(profileRegion, '/')} replace />;
    }

    // If profile has no explicit region, fallback to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <CountrySelection />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AnalyticsTracker />
        <RoutePreloader />
        <ScrollToTop />
        <Suspense fallback={<SleekLoader />}>
          <Routes>
            {/* Main Website */}
            <Route element={<RootLayout />}>
              {/* Country Selector */}
              <Route path="/" element={<AppEntryRedirect />} />

              {/* Sri Lanka version */}
              <Route path="/lk" element={<Home />} />
              <Route path="/lk/about" element={<About />} />
              <Route path="/lk/services" element={<Services />} />
              <Route path="/lk/services/:serviceSlug" element={<ServiceLandingPage />} />
              <Route path="/lk/client" element={<Navigate to="/dashboard" replace />} />
              <Route path="/lk/admin" element={<Navigate to="/admin" replace />} />
              <Route path="/lk/agent" element={<Navigate to="/partner/dashboard" replace />} />
              <Route path="/lk/:serviceSlug" element={<ServiceLandingPage />} />
              <Route path="/lk/process" element={<Process />} />
              <Route path="/lk/pricing" element={<Pricing />} />
              <Route path="/lk/case-studies" element={<CaseStudies />} />
              <Route path="/lk/case-studies/:slug" element={<CaseStudyDetail />} />
              <Route path="/lk/leadership" element={<Leadership />} />
              <Route path="/lk/contact" element={<Contact />} />
              <Route path="/lk/partner" element={<Partner />} />
              <Route path="/lk/agents" element={<AgentsRedirect />} />
              <Route path="/lk/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/lk/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/lk/refund-policy" element={<RefundPolicy />} />
              <Route path="/lk/privacy" element={<Navigate to="/lk/privacy-policy" replace />} />
              <Route path="/lk/terms" element={<Navigate to="/lk/terms-and-conditions" replace />} />
              <Route path="/lk/refund" element={<Navigate to="/lk/refund-policy" replace />} />
              <Route path="/lk/refunds" element={<Navigate to="/lk/refund-policy" replace />} />
              <Route path="/lk/blog" element={<Blog />} />
              <Route path="/lk/blog/:slug" element={<BlogPostDetail />} />
              <Route path="/lk/what-is-jawrah-pixel" element={<WhatIsJawrahPixel />} />
              <Route path="/lk/why-jawrah-pixel" element={<WhyJawrahPixel />} />
              <Route path="/lk/about-founder" element={<AboutFounder />} />

              {/* Pakistan version */}
              <Route path="/pk" element={<Home />} />
              <Route path="/pk/about" element={<About />} />
              <Route path="/pk/services" element={<Services />} />
              <Route path="/pk/services/:serviceSlug" element={<ServiceLandingPage />} />
              <Route path="/pk/client" element={<Navigate to="/dashboard" replace />} />
              <Route path="/pk/admin" element={<Navigate to="/admin" replace />} />
              <Route path="/pk/agent" element={<Navigate to="/partner/dashboard" replace />} />
              <Route path="/pk/:serviceSlug" element={<ServiceLandingPage />} />
              <Route path="/pk/process" element={<Process />} />
              <Route path="/pk/pricing" element={<Pricing />} />
              <Route path="/pk/case-studies" element={<CaseStudies />} />
              <Route path="/pk/case-studies/:slug" element={<CaseStudyDetail />} />
              <Route path="/pk/leadership" element={<Leadership />} />
              <Route path="/pk/contact" element={<Contact />} />
              <Route path="/pk/partner" element={<Partner />} />
              <Route path="/pk/agents" element={<AgentsRedirect />} />
              <Route path="/pk/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/pk/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/pk/refund-policy" element={<RefundPolicy />} />
              <Route path="/pk/privacy" element={<Navigate to="/pk/privacy-policy" replace />} />
              <Route path="/pk/terms" element={<Navigate to="/pk/terms-and-conditions" replace />} />
              <Route path="/pk/refund" element={<Navigate to="/pk/refund-policy" replace />} />
              <Route path="/pk/refunds" element={<Navigate to="/pk/refund-policy" replace />} />
              <Route path="/pk/blog" element={<Blog />} />
              <Route path="/pk/blog/:slug" element={<BlogPostDetail />} />
              <Route path="/pk/what-is-jawrah-pixel" element={<WhatIsJawrahPixel />} />
              <Route path="/pk/why-jawrah-pixel" element={<WhyJawrahPixel />} />
              <Route path="/pk/about-founder" element={<AboutFounder />} />

              {/* International version */}
              <Route path="/int" element={<Home />} />
              <Route path="/int/about" element={<About />} />
              <Route path="/int/services" element={<Services />} />
              <Route path="/int/services/:serviceSlug" element={<ServiceLandingPage />} />
              <Route path="/int/client" element={<Navigate to="/dashboard" replace />} />
              <Route path="/int/admin" element={<Navigate to="/admin" replace />} />
              <Route path="/int/agent" element={<Navigate to="/partner/dashboard" replace />} />
              <Route path="/int/:serviceSlug" element={<ServiceLandingPage />} />
              <Route path="/int/process" element={<Process />} />
              <Route path="/int/pricing" element={<Pricing />} />
              <Route path="/int/case-studies" element={<CaseStudies />} />
              <Route path="/int/case-studies/:slug" element={<CaseStudyDetail />} />
              <Route path="/int/leadership" element={<Leadership />} />
              <Route path="/int/contact" element={<Contact />} />
              <Route path="/int/partner" element={<Partner />} />
              <Route path="/int/agents" element={<AgentsRedirect />} />
              <Route path="/int/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/int/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/int/refund-policy" element={<RefundPolicy />} />
              <Route path="/int/privacy" element={<Navigate to="/int/privacy-policy" replace />} />
              <Route path="/int/terms" element={<Navigate to="/int/terms-and-conditions" replace />} />
              <Route path="/int/refund" element={<Navigate to="/int/refund-policy" replace />} />
              <Route path="/int/refunds" element={<Navigate to="/int/refund-policy" replace />} />
              <Route path="/int/blog" element={<Blog />} />
              <Route path="/int/blog/:slug" element={<BlogPostDetail />} />
              <Route path="/int/what-is-jawrah-pixel" element={<WhatIsJawrahPixel />} />
              <Route path="/int/why-jawrah-pixel" element={<WhyJawrahPixel />} />
              <Route path="/int/about-founder" element={<AboutFounder />} />

              {/* UK & EU version */}
              <Route path="/uk" element={<Home />} />
              <Route path="/uk/about" element={<About />} />
              <Route path="/uk/services" element={<Services />} />
              <Route path="/uk/services/:serviceSlug" element={<ServiceLandingPage />} />
              <Route path="/uk/client" element={<Navigate to="/dashboard" replace />} />
              <Route path="/uk/admin" element={<Navigate to="/admin" replace />} />
              <Route path="/uk/agent" element={<Navigate to="/partner/dashboard" replace />} />
              <Route path="/uk/:serviceSlug" element={<ServiceLandingPage />} />
              <Route path="/uk/process" element={<Process />} />
              <Route path="/uk/pricing" element={<Pricing />} />
              <Route path="/uk/case-studies" element={<CaseStudies />} />
              <Route path="/uk/case-studies/:slug" element={<CaseStudyDetail />} />
              <Route path="/uk/leadership" element={<Leadership />} />
              <Route path="/uk/contact" element={<Contact />} />
              <Route path="/uk/partner" element={<Partner />} />
              <Route path="/uk/agents" element={<AgentsRedirect />} />
              <Route path="/uk/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/uk/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/uk/refund-policy" element={<RefundPolicy />} />
              <Route path="/uk/privacy" element={<Navigate to="/uk/privacy-policy" replace />} />
              <Route path="/uk/terms" element={<Navigate to="/uk/terms-and-conditions" replace />} />
              <Route path="/uk/refund" element={<Navigate to="/uk/refund-policy" replace />} />
              <Route path="/uk/refunds" element={<Navigate to="/uk/refund-policy" replace />} />
              <Route path="/uk/blog" element={<Blog />} />
              <Route path="/uk/blog/:slug" element={<BlogPostDetail />} />
              <Route path="/uk/what-is-jawrah-pixel" element={<WhatIsJawrahPixel />} />
              <Route path="/uk/why-jawrah-pixel" element={<WhyJawrahPixel />} />
              <Route path="/uk/about-founder" element={<AboutFounder />} />

              {/* Clean Canonical Architecture & Route Aliases */}
              <Route path="/work" element={<CaseStudies />} />
              <Route path="/work/rankala" element={<Navigate to="/case-studies/rankala-gold" replace />} />
              <Route path="/work/:slug" element={<CaseStudyDetail />} />
              <Route path="/insights" element={<Blog />} />
              <Route path="/insights/:slug" element={<BlogPostDetail />} />
              <Route path="/services/web-development" element={<ServiceLandingPage />} />
              <Route path="/services/software-development" element={<ServiceLandingPage />} />
              <Route path="/services/ecommerce-development" element={<ServiceLandingPage />} />
              <Route path="/services/mobile-app-development" element={<ServiceLandingPage />} />
              <Route path="/services/seo" element={<ServiceLandingPage />} />
              <Route path="/services/ui-ux" element={<ServiceLandingPage />} />

              {/* Sri Lanka regional routes for core services */}
              <Route path="/lk/work" element={<CaseStudies />} />
              <Route path="/lk/work/rankala" element={<Navigate to="/lk/case-studies/rankala-gold" replace />} />
              <Route path="/lk/work/:slug" element={<CaseStudyDetail />} />
              <Route path="/lk/insights" element={<Blog />} />
              <Route path="/lk/insights/:slug" element={<BlogPostDetail />} />
              <Route path="/lk/services/web-development" element={<ServiceLandingPage />} />
              <Route path="/lk/services/software-development" element={<ServiceLandingPage />} />
              <Route path="/lk/services/ecommerce-development" element={<ServiceLandingPage />} />
              <Route path="/lk/services/mobile-app-development" element={<ServiceLandingPage />} />
              <Route path="/lk/services/seo" element={<ServiceLandingPage />} />
              <Route path="/lk/services/ui-ux" element={<ServiceLandingPage />} />

              {/* International regional routes for core services */}
              <Route path="/int/work" element={<CaseStudies />} />
              <Route path="/int/work/rankala" element={<Navigate to="/int/case-studies/rankala-gold" replace />} />
              <Route path="/int/work/:slug" element={<CaseStudyDetail />} />
              <Route path="/int/insights" element={<Blog />} />
              <Route path="/int/insights/:slug" element={<BlogPostDetail />} />
              <Route path="/int/services/web-development" element={<ServiceLandingPage />} />
              <Route path="/int/services/software-development" element={<ServiceLandingPage />} />
              <Route path="/int/services/ecommerce-development" element={<ServiceLandingPage />} />
              <Route path="/int/services/mobile-app-development" element={<ServiceLandingPage />} />
              <Route path="/int/services/seo" element={<ServiceLandingPage />} />
              <Route path="/int/services/ui-ux" element={<ServiceLandingPage />} />

              {/* Fallback routes */}
              <Route path="/pricing" element={<RegionalRedirect path="/pricing" />} />
              <Route path="/blog" element={<RegionalRedirect path="/blog" />} />
              <Route path="/book" element={<Contact />} />
              <Route path="/faq" element={<Process />} />
              <Route path="/about" element={<RegionalRedirect path="/about" />} />
              <Route path="/services" element={<RegionalRedirect path="/services" />} />
              <Route path="/process" element={<RegionalRedirect path="/process" />} />
              <Route path="/case-studies" element={<RegionalRedirect path="/case-studies" />} />
              <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
              <Route path="/leadership" element={<RegionalRedirect path="/leadership" />} />
              <Route path="/contact" element={<RegionalRedirect path="/contact" />} />
              <Route path="/partner" element={<RegionalRedirect path="/partner" />} />
              <Route path="/agents" element={<RegionalRedirect path="/partner" />} />
              <Route path="/privacy-policy" element={<RegionalRedirect path="/privacy-policy" />} />
              <Route path="/cookie-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<RegionalRedirect path="/terms-and-conditions" />} />
              <Route path="/refund-policy" element={<RegionalRedirect path="/refund-policy" />} />
              <Route path="/refund" element={<RegionalRedirect path="/refund-policy" />} />
              <Route path="/refunds" element={<RegionalRedirect path="/refund-policy" />} />
              <Route path="/privacy" element={<RegionalRedirect path="/privacy-policy" />} />
              <Route path="/terms" element={<RegionalRedirect path="/terms-and-conditions" />} />
              <Route path="/what-is-jawrah-pixel" element={<RegionalRedirect path="/what-is-jawrah-pixel" />} />
              <Route path="/why-jawrah-pixel" element={<RegionalRedirect path="/why-jawrah-pixel" />} />
              <Route path="/about-founder" element={<RegionalRedirect path="/about-founder" />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              
              {/* Catch-all to 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Authentication */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/:region/login" element={<Login />} />
            <Route path="/:region/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<Login />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<SignUp />} />

            {/* Admin Routes */}
            <Route element={<RequireAuth roles={['admin', 'superadmin']}><AdminLayout /></RequireAuth>}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/clients" element={<AdminDashboard />} />
              <Route path="/admin/projects" element={<AdminDashboard />} />
              <Route path="/admin/projects/:id" element={<AdminDashboard />} />
              <Route path="/admin/proposals" element={<AdminDashboard />} />
              <Route path="/admin/invoices" element={<AdminDashboard />} />
              <Route path="/admin/files" element={<AdminDashboard />} />
              <Route path="/admin/messages" element={<AdminDashboard />} />
              <Route path="/admin/notifications" element={<AdminDashboard />} />
              <Route path="/admin/settings" element={<AdminDashboard />} />
            </Route>

            {/* Client Routes */}
            <Route element={<RequireAuth roles={['client']}><ClientLayout /></RequireAuth>}>
              <Route path="/dashboard" element={<ClientDashboard />} />
              <Route path="/dashboard/projects" element={<ClientDashboard />} />
              <Route path="/dashboard/projects/:id" element={<ClientDashboard />} />
              <Route path="/dashboard/files" element={<ClientDashboard />} />
              <Route path="/dashboard/proposals" element={<ClientDashboard />} />
              <Route path="/dashboard/invoices" element={<ClientDashboard />} />
              <Route path="/dashboard/messages" element={<ClientDashboard />} />
              <Route path="/dashboard/notifications" element={<ClientDashboard />} />
              <Route path="/dashboard/settings" element={<ClientDashboard />} />
              <Route path="/dashboard/checkout/:invoiceId" element={<CheckoutPage />} />
              <Route path="/dashboard/payment-success" element={<PaymentSuccessPage />} />
            </Route>
            <Route
              path="/checkout/:invoiceId"
              element={<RequireAuth roles={['client']}><CheckoutRedirect /></RequireAuth>}
            />

            {/* Partner Routes (agent role in database) */}
            <Route element={<RequireAuth roles={['agent', 'admin']}><AgentLayout /></RequireAuth>}>
              <Route path="/partner/dashboard" element={<AgentDashboard />} />
              <Route path="/agent" element={<Navigate to="/partner/dashboard" replace />} />
              <Route path="/agent/dashboard" element={<Navigate to="/partner/dashboard" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

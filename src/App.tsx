import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { RootLayout, AdminLayout, ClientLayout, AgentLayout } from './components/layout/Layouts';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { SleekLoader } from './components/ui/SleekLoader';
import { RequireAuth } from './components/auth/RequireAuth';
import { useAuth } from './contexts/AuthContext';
import { getSavedAdminRegion, getSavedRegion, isRegionCode, regionPath } from './lib/region';

// Lazy Loaded Pages
const CountrySelection = lazy(() => import('./pages/CountrySelection'));
const Home = lazy(() => import('./pages/Home'));
const International = lazy(() => import('./pages/International'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Process = lazy(() => import('./pages/Process'));
const CaseStudies = lazy(() => import('./pages/CaseStudies'));
const CaseStudyDetail = lazy(() => import('./pages/CaseStudyDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const Partner = lazy(() => import('./pages/Partner'));
const AgentsRedirect = lazy(() => import('./pages/Agents'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
const Blog = lazy(() => import('./pages/Blog'));

// Auth Pages
const Login = lazy(() => import('./pages/auth/Login'));
const SignUp = lazy(() => import('./pages/auth/SignUp'));

// Dashboards
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ClientDashboard = lazy(() => import('./pages/client/ClientDashboard'));
const AgentDashboard = lazy(() => import('./pages/agent/AgentDashboard'));
const CheckoutPage = lazy(() => import('./pages/checkout/CheckoutPage'));
const PaymentSuccessPage = lazy(() => import('./pages/checkout/PaymentSuccessPage'));

function CheckoutRedirect() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  if (!invoiceId) return <Navigate to="/dashboard" replace />;
  return <Navigate to={`/dashboard/checkout/${invoiceId}`} replace />;
}

function RegionalRedirect({ path = '/' }: { path?: string }) {
  const { user, profile, loading } = useAuth();

  if (loading) return <SleekLoader />;
  if (user && !profile) return <SleekLoader />;

  const profileRegion = isRegionCode(profile?.region) ? profile.region : null;
  const region = profile?.role === 'admin' || profile?.role === 'superadmin'
    ? getSavedAdminRegion() ?? profileRegion ?? getSavedRegion()
    : user && profileRegion ? profileRegion : getSavedRegion();
  return <Navigate to={region ? regionPath(region, path) : '/'} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<SleekLoader />}>
          <Routes>
            {/* Main Website */}
            <Route element={<RootLayout />}>
              {/* Country Selector */}
              <Route path="/" element={<CountrySelection />} />

              {/* Sri Lanka version */}
              <Route path="/lk" element={<Home />} />
              <Route path="/lk/about" element={<About />} />
              <Route path="/lk/services" element={<Services />} />
              <Route path="/lk/process" element={<Process />} />
              <Route path="/lk/pricing" element={<Services />} />
              <Route path="/lk/case-studies" element={<CaseStudies />} />
              <Route path="/lk/case-studies/:slug" element={<CaseStudyDetail />} />
              <Route path="/lk/contact" element={<Contact />} />
              <Route path="/lk/partner" element={<Partner />} />
              <Route path="/lk/agents" element={<AgentsRedirect />} />
              <Route path="/lk/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/lk/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/lk/refund-policy" element={<RefundPolicy />} />
              <Route path="/lk/privacy" element={<Navigate to="/lk/privacy-policy" replace />} />
              <Route path="/lk/terms" element={<Navigate to="/lk/terms-and-conditions" replace />} />
              <Route path="/lk/blog" element={<Blog />} />

              {/* Pakistan version */}
              <Route path="/pk" element={<Home />} />
              <Route path="/pk/about" element={<About />} />
              <Route path="/pk/services" element={<Services />} />
              <Route path="/pk/process" element={<Process />} />
              <Route path="/pk/pricing" element={<Services />} />
              <Route path="/pk/case-studies" element={<CaseStudies />} />
              <Route path="/pk/case-studies/:slug" element={<CaseStudyDetail />} />
              <Route path="/pk/contact" element={<Contact />} />
              <Route path="/pk/partner" element={<Partner />} />
              <Route path="/pk/agents" element={<AgentsRedirect />} />
              <Route path="/pk/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/pk/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/pk/refund-policy" element={<RefundPolicy />} />
              <Route path="/pk/privacy" element={<Navigate to="/pk/privacy-policy" replace />} />
              <Route path="/pk/terms" element={<Navigate to="/pk/terms-and-conditions" replace />} />
              <Route path="/pk/blog" element={<Blog />} />

              {/* International version */}
              <Route path="/int" element={<International />} />
              <Route path="/int/about" element={<About />} />
              <Route path="/int/services" element={<Services />} />
              <Route path="/int/process" element={<Process />} />
              <Route path="/int/pricing" element={<Services />} />
              <Route path="/int/case-studies" element={<CaseStudies />} />
              <Route path="/int/case-studies/:slug" element={<CaseStudyDetail />} />
              <Route path="/int/contact" element={<Contact />} />
              <Route path="/int/partner" element={<Partner />} />
              <Route path="/int/agents" element={<AgentsRedirect />} />
              <Route path="/int/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/int/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/int/refund-policy" element={<RefundPolicy />} />
              <Route path="/int/privacy" element={<Navigate to="/int/privacy-policy" replace />} />
              <Route path="/int/terms" element={<Navigate to="/int/terms-and-conditions" replace />} />
              <Route path="/int/blog" element={<Blog />} />

              {/* Fallback routes */}
              <Route path="/pricing" element={<RegionalRedirect path="/pricing" />} />
              <Route path="/blog" element={<RegionalRedirect path="/blog" />} />
              <Route path="/about" element={<RegionalRedirect path="/about" />} />
              <Route path="/services" element={<RegionalRedirect path="/services" />} />
              <Route path="/process" element={<RegionalRedirect path="/process" />} />
              <Route path="/case-studies" element={<RegionalRedirect path="/case-studies" />} />
              <Route path="/contact" element={<RegionalRedirect path="/contact" />} />
              <Route path="/partner" element={<RegionalRedirect path="/partner" />} />
              <Route path="/agents" element={<RegionalRedirect path="/partner" />} />
              <Route path="/privacy-policy" element={<RegionalRedirect path="/privacy-policy" />} />
              <Route path="/terms-and-conditions" element={<RegionalRedirect path="/terms-and-conditions" />} />
              <Route path="/refund-policy" element={<RegionalRedirect path="/refund-policy" />} />
              <Route path="/privacy" element={<RegionalRedirect path="/privacy-policy" />} />
              <Route path="/terms" element={<RegionalRedirect path="/terms-and-conditions" replace />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              
              {/* Catch-all to root which redirects to region if exists */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>

            {/* Authentication */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Admin Routes */}
            <Route element={<RequireAuth roles={['admin', 'superadmin']}><AdminLayout /></RequireAuth>}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* Client Routes */}
            <Route element={<RequireAuth roles={['client', 'admin']}><ClientLayout /></RequireAuth>}>
              <Route path="/dashboard" element={<ClientDashboard />} />
              <Route path="/dashboard/checkout/:invoiceId" element={<CheckoutPage />} />
              <Route path="/dashboard/payment-success" element={<PaymentSuccessPage />} />
            </Route>
            <Route
              path="/checkout/:invoiceId"
              element={<RequireAuth roles={['client', 'admin']}><CheckoutRedirect /></RequireAuth>}
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

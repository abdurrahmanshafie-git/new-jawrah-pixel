import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { RootLayout, AdminLayout, ClientLayout, AgentLayout } from './components/layout/Layouts';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { SleekLoader } from './components/ui/SleekLoader';
import { RequireAuth } from './components/auth/RequireAuth';
import { useAuth } from './contexts/AuthContext';
import { getSavedRegion, isRegionCode, regionPath } from './lib/region';

// Lazy Loaded Pages
const CountrySelection = lazy(() => import('./pages/CountrySelection'));
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Process = lazy(() => import('./pages/Process'));
const CaseStudies = lazy(() => import('./pages/CaseStudies'));
const CaseStudyDetail = lazy(() => import('./pages/CaseStudyDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const Agents = lazy(() => import('./pages/Agents'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Blog = lazy(() => import('./pages/Blog'));

// Auth Pages
const Login = lazy(() => import('./pages/auth/Login'));
const SignUp = lazy(() => import('./pages/auth/SignUp'));

// Dashboards
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ClientDashboard = lazy(() => import('./pages/client/ClientDashboard'));
const AgentDashboard = lazy(() => import('./pages/agent/AgentDashboard'));

function RegionalRedirect({ path = '/' }: { path?: string }) {
  const { user, profile, loading } = useAuth();

  if (loading) return <SleekLoader />;

  const region = user && isRegionCode(profile?.region) ? profile.region : getSavedRegion();
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
              <Route path="/lk/agents" element={<Agents />} />
              <Route path="/lk/privacy" element={<Privacy />} />
              <Route path="/lk/terms" element={<Terms />} />
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
              <Route path="/pk/agents" element={<Agents />} />
              <Route path="/pk/privacy" element={<Privacy />} />
              <Route path="/pk/terms" element={<Terms />} />
              <Route path="/pk/blog" element={<Blog />} />

              {/* Fallback routes */}
              <Route path="/pricing" element={<RegionalRedirect path="/pricing" />} />
              <Route path="/blog" element={<RegionalRedirect path="/blog" />} />
              <Route path="/about" element={<RegionalRedirect path="/about" />} />
              <Route path="/services" element={<RegionalRedirect path="/services" />} />
              <Route path="/process" element={<RegionalRedirect path="/process" />} />
              <Route path="/case-studies" element={<RegionalRedirect path="/case-studies" />} />
              <Route path="/contact" element={<RegionalRedirect path="/contact" />} />
              <Route path="/agents" element={<RegionalRedirect path="/agents" />} />
              
              {/* Catch-all to root which redirects to region if exists */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>

            {/* Authentication */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Admin Routes */}
            <Route element={<RequireAuth roles={['admin']}><AdminLayout /></RequireAuth>}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* Client Routes */}
            <Route element={<RequireAuth roles={['client', 'admin']}><ClientLayout /></RequireAuth>}>
              <Route path="/dashboard" element={<ClientDashboard />} />
            </Route>

            {/* Agent Routes */}
            <Route element={<RequireAuth roles={['agent', 'admin']}><AgentLayout /></RequireAuth>}>
              <Route path="/agent" element={<AgentDashboard />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

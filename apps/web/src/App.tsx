import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet';
import { Toaster } from 'react-hot-toast';
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import './styles/global.css';

// Query Client
const queryClient = new QueryClient();

// Lazy-loaded Pages - Only import pages that actually exist
// Marketing Pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const RefundPage = lazy(() => import('./pages/RefundPage'));
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'));

// SaaS App Pages
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const JobsPage = lazy(() => import('./pages/JobsPage.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ApplicationsPage = lazy(() => import('./pages/ApplicationsPage.jsx'));
const SettingsPage = lazy(() => import('./pages/SettingsPage.jsx'));
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage.jsx'));
const WelcomePage = lazy(() => import('./pages/WelcomePage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

// Auth Pages - Only import ones that exist
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage.jsx'));

// Admin/Manager Pages - Use components that exist
const ManagerDashboard = lazy(() => import('./pages/ManagerDashboard.jsx'));

// Core Components
import ErrorBoundary from './components/ErrorBoundary';

// Loading fallback for page transitions
const PageLoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh',
    flexDirection: 'column',
    gap: '20px'
  }}>
    <div style={{
      width: '60px',
      height: '60px',
      border: '4px solid rgba(0, 255, 255, 0.3)',
      borderTop: '4px solid #00ffff',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}></div>
    <p style={{ color: '#00ffff', fontFamily: 'Orbitron, monospace' }}>Loading...</p>
  </div>
);

// ScrollToTop component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Protected Route Component
const ProtectedRoute = ({ children, user }: { children: React.ReactNode; user: any }) => {
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

function App() {
  const [user] = React.useState(null);

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Helmet>
          <title>AI Job Chommie - Intelligent Job Search for South Africa</title>
          <meta name="description" content="AI Job Chommie - Your intelligent job search companion. Find your dream job with our AI-powered matching and application system. Affordable pricing for South African job seekers." />
          <meta name="keywords" content="job search, AI jobs, South Africa jobs, career, employment, job matching, CV, resume, job applications" />
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href="https://aijobchommie.co.za/" />

          {/* Theme Colors */}
          <meta name="theme-color" content="#00ffff" />
          <meta name="msapplication-navbutton-color" content="#00ffff" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

          {/* Fonts */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap" rel="stylesheet" />
        </Helmet>

        <Router>
          <ScrollToTop />
          <ErrorBoundary>
            <div className="min-h-screen">
              <Suspense fallback={<PageLoadingFallback />}>
                <Routes>
                  {/* Marketing Pages - Public */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/refund" element={<RefundPage />} />
                  <Route path="/features" element={<FeaturesPage />} />

                  {/* SaaS App Pages - Public or Protected */}
                  <Route path="/app" element={<HomePage />} />
                  <Route path="/jobs" element={<JobsPage />} />
                  <Route path="/welcome" element={<WelcomePage />} />

                  {/* Protected SaaS Pages - Require Authentication */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute user={user}>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute user={user}>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/applications"
                    element={
                      <ProtectedRoute user={user}>
                        <ApplicationsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute user={user}>
                        <SettingsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/subscription"
                    element={
                      <ProtectedRoute user={user}>
                        <SubscriptionPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Auth Pages */}
                  <Route path="/auth/login" element={<LoginPage />} />
                  <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />

                  {/* Manager Routes */}
                  <Route path="/manager" element={<ManagerDashboard />} />

                  {/* Catch all route */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </div>
          </ErrorBoundary>
        </Router>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a1a2e',
              color: '#ffffff',
              border: '1px solid #00ffff',
            },
          }}
        />
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;

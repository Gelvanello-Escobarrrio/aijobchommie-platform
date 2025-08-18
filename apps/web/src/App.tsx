import React, { useEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Helmet } from 'react-helmet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './styles/global.css';

// Query Client
const queryClient = new QueryClient();

// Lazy-loaded Pages
// Marketing Pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const MissionPage = lazy(() => import('./pages/MissionPage'));
const FounderPage = lazy(() => import('./pages/FounderPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const RefundPage = lazy(() => import('./pages/RefundPage'));

// SaaS App Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const JobsPage = lazy(() => import('./pages/JobsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ApplicationsPage = lazy(() => import('./pages/ApplicationsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage'));
const WelcomePage = lazy(() => import('./pages/WelcomePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Core Components
import ErrorBoundary from './components/ErrorBoundary';
import LoadingScreen from './components/LoadingScreen';
import Navigation from './components/Navigation';

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
    }} />
    <p style={{ color: '#00ffff', fontSize: '1.1rem' }}>
      ⚡ Loading page...
    </p>
  </div>
);

// Component to handle scroll-to-top on route change
const ScrollToTop = () => {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);
  
  return null;
};

// Protected Route Component (for authenticated features)
const ProtectedRoute = ({ children, user, adminOnly = false, premiumOnly = false }) => {
  if (!user) {
    return <Navigate to="/pricing" replace />;
  }
  
  if (adminOnly && !['fsteyn@rocketmail.com', 'admin@aijobchommie.co.za'].includes(user.email)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Add premium check logic here when ready
  if (premiumOnly) {
    // return <Navigate to="/pricing" replace />;
  }
  
  return children;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    // Check for authentication state
    // This would integrate with Supabase or your auth system
    const checkAuth = async () => {
      try {
        // Add auth check logic here
        // const { data: { user } } = await supabase.auth.getUser();
        // setUser(user);
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      checkAuth();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Helmet>
          <title>AI Job Chommie - Intelligent Job Search for South Africa</title>
          <meta name="description" content="AI Job Chommie - Your intelligent job search companion. Find your dream job with our AI-powered matching and application system. Affordable pricing for South African job seekers." />
          <meta name="keywords" content="job search, AI jobs, South Africa jobs, career, employment, job matching, CV, resume, job applications" />
          <meta name="author" content="AI Job Chommie" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#00ffff" />
          <meta name="facebook-domain-verification" content="vhfn9uvz4i239v02vk3pk7muv7ncob" />
          <link rel="canonical" href="https://aijobchommie.co.za" />
          
          {/* Open Graph / Facebook */}
          <meta property="og:title" content="AI Job Chommie - Intelligent Job Search" />
          <meta property="og:description" content="Your AI companion for seamless job matching and career advancement in South Africa" />
          <meta property="og:image" content="https://aijobchommie.co.za/logos/android-launchericon-512-512.png" />
          <meta property="og:url" content="https://aijobchommie.co.za" />
          <meta property="og:type" content="website" />
          
          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="AI Job Chommie - Intelligent Job Search" />
          <meta name="twitter:description" content="Your AI companion for seamless job matching and career advancement in South Africa" />
          <meta name="twitter:image" content="/logos/android-launchericon-512-512.png" />
          
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
                  <Route path="/mission" element={<MissionPage />} />
                  <Route path="/founder" element={<FounderPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/refund" element={<RefundPage />} />
                  
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
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </div>
          </ErrorBoundary>
        </Router>
        
        {/* Global Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a1a2e',
              color: '#00ffff',
              border: '1px solid #00ffff',
              borderRadius: '8px'
            },
            success: {
              iconTheme: {
                primary: '#00ff65',
                secondary: '#1a1a2e'
              }
            },
            error: {
              iconTheme: {
                primary: '#ff0065',
                secondary: '#1a1a2e'
              }
            }
          }}
        />
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;

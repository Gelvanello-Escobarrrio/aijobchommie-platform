/**
 * AI Job Chommie - Main Application Component
 * World-class SaaS platform focused on South African entry-level job opportunities
 */

import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from 'react-error-boundary';
import { motion, AnimatePresence } from 'framer-motion';

// Core providers and contexts
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { I18nProvider } from './contexts/I18nContext';

// Layout components
import { Navigation } from './components/layout/Navigation';
import { Footer } from './components/layout/Footer';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { ErrorFallback } from './components/ui/ErrorFallback';

// Page imports (lazy loaded for performance)
const HomePage = React.lazy(() => import('./pages/HomePage'));
const EntryLevelJobsPage = React.lazy(() => import('./pages/EntryLevelJobsPage'));
const JobSearchPage = React.lazy(() => import('./pages/JobSearchPage'));
const JobDetailsPage = React.lazy(() => import('./pages/JobDetailsPage'));
const QuickApplyPage = React.lazy(() => import('./pages/QuickApplyPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const ApplicationsPage = React.lazy(() => import('./pages/ApplicationsPage'));
const PaymentsPage = React.lazy(() => import('./pages/PaymentsPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

// South African specific pages
const SouthAfricaJobsPage = React.lazy(() => import('./pages/SouthAfricaJobsPage'));
const JohannesburgJobsPage = React.lazy(() => import('./pages/JohannesburgJobsPage'));
const CapeTownJobsPage = React.lazy(() => import('./pages/CapeTownJobsPage'));
const DurbanJobsPage = React.lazy(() => import('./pages/DurbanJobsPage'));
const SalaryGuidePage = React.lazy(() => import('./pages/SalaryGuidePage'));
const SkillsDevelopmentPage = React.lazy(() => import('./pages/SkillsDevelopmentPage'));
const GovernmentProgramsPage = React.lazy(() => import('./pages/GovernmentProgramsPage'));

// Priority job category pages
const GeneralWorkerJobsPage = React.lazy(() => import('./pages/GeneralWorkerJobsPage'));
const CleaningJobsPage = React.lazy(() => import('./pages/CleaningJobsPage'));
const SecurityJobsPage = React.lazy(() => import('./pages/SecurityJobsPage'));
const FoodServiceJobsPage = React.lazy(() => import('./pages/FoodServiceJobsPage'));
const RetailJobsPage = React.lazy(() => import('./pages/RetailJobsPage'));
const TransportJobsPage = React.lazy(() => import('./pages/TransportJobsPage'));

// Create React Query client with optimized defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});

// Page transition animations
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
};

// Enhanced loading component for suspense
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center space-y-4"
    >
      <LoadingSpinner size="lg" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-lg font-medium text-gray-700 dark:text-gray-300"
      >
        Loading your opportunities...
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-sm text-gray-500 dark:text-gray-400"
      >
        Connecting you to South Africa's best entry-level jobs
      </motion.div>
    </motion.div>
  </div>
);

// Route wrapper with animation
const AnimatedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
  >
    {children}
  </motion.div>
);

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Application error:', error, errorInfo);
        // Send to error reporting service
        if (window.gtag) {
          window.gtag('event', 'exception', {
            description: error.toString(),
            fatal: false,
          });
        }
      }}
    >
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <I18nProvider>
              <AuthProvider>
                <NotificationProvider>
                  <Router>
                    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
                      {/* Navigation */}
                      <Navigation />
                      
                      {/* Main Content */}
                      <main className="flex-1">
                        <AnimatePresence mode="wait">
                          <Suspense fallback={<PageLoader />}>
                            <Routes>
                              {/* Home and core pages */}
                              <Route 
                                path="/" 
                                element={
                                  <AnimatedRoute>
                                    <HomePage />
                                  </AnimatedRoute>
                                } 
                              />
                              
                              {/* PRIORITY: Entry-level job routes */}
                              <Route 
                                path="/entry-level-jobs" 
                                element={
                                  <AnimatedRoute>
                                    <EntryLevelJobsPage />
                                  </AnimatedRoute>
                                } 
                              />
                              <Route 
                                path="/general-worker-jobs" 
                                element={
                                  <AnimatedRoute>
                                    <GeneralWorkerJobsPage />
                                  </AnimatedRoute>
                                } 
                              />
                              <Route 
                                path="/cleaning-jobs" 
                                element={
                                  <AnimatedRoute>
                                    <CleaningJobsPage />
                                  </AnimatedRoute>
                                } 
                              />
                              <Route 
                                path="/security-jobs" 
                                element={
                                  <AnimatedRoute>
                                    <SecurityJobsPage />
                                  </AnimatedRoute>
                                } 
                              />
                              <Route 
                                path="/food-service-jobs" 
                                element={
                                  <AnimatedRoute>
                                    <FoodServiceJobsPage />
                                  </AnimatedRoute>
                                } 
                              />
                              <Route 
                                path="/retail-jobs" 
                                element={
                                  <AnimatedRoute>
                                    <RetailJobsPage />
                                  </AnimatedRoute>
                                } 
                              />
                              <Route 
                                path="/transport-jobs" 
                                element={
                                  <AnimatedRoute>
                                    <TransportJobsPage />
                                  </AnimatedRoute>
                                } 
                              />
                              
                              {/* Job search and details */}
                              <Route 
                                path="/jobs" 
                                element={
                                  <AnimatedRoute>
                                    <JobSearchPage />
                                  </AnimatedRoute>
                                } 
                              />
                              <Route 
                                path="/jobs/:jobId" 
                                element={
                                  <AnimatedRoute>
                                    <JobDetailsPage />
                                  </AnimatedRoute>
                                } 
                              />
                              <Route 
                                path="/quick-apply/:jobId" 
                                element={
                                  <AnimatedRoute>
                                    <QuickApplyPage />
                                  </AnimatedRoute>
                                } 
                              />
                              
                              {/* Location-based routes (South Africa focus) */}
                              <Route 
                                path="/south-africa-jobs" 
                                element={
                                  <AnimatedRoute>
                                    <SouthAfricaJobsPage />
                                  </AnimatedRoute>
                                } 
                              />
                              <Route 
                                path="/johannesburg-jobs" 
                                element={
                                  <AnimatedRoute>
                                    <JohannesburgJobsPage />
                                  </AnimatedRoute>
                                } 
                              />
                              <Route 
                                path="/cape-town-jobs" 
                                element={
                                  <AnimatedRoute>
                                    <CapeTownJobsPage />
                                  </AnimatedRoute>
                                } 
                              />
                              <Route 
                                path="/durban-jobs" 
                                element={
                                  <AnimatedRoute>
                                    <DurbanJobsPage />
                                  </AnimatedRoute>
                                } 
                              />
                              
                              {/* Career development and guidance */}
                              <Route 
                                path="/salary-guide" 
                                element={
                                  <AnimatedRoute>
                                    <SalaryGuidePage />
                                  </AnimatedRoute>
                                } 
                              />
                              <Route 
                                path="/skills-development" 
                                element={
                                  <AnimatedRoute>
                                    <SkillsDevelopmentPage />
                                  </AnimatedRoute>
                                } 
                              />
                              <Route 
                                path="/government-programs" 
                                element={
                                  <AnimatedRoute>
                                    <GovernmentProgramsPage />
                                  </AnimatedRoute>
                                } 
                              />
                              
                              {/* User dashboard and account */}
                              <Route 
                                path="/dashboard" 
                                element={
                                  <AnimatedRoute>
                                    <DashboardPage />
                                  </AnimatedRoute>
                                } 
                              />
                              <Route 
                                path="/profile" 
                                element={
                                  <AnimatedRoute>
                                    <ProfilePage />
                                  </AnimatedRoute>
                                } 
                              />
                              <Route 
                                path="/applications" 
                                element={
                                  <AnimatedRoute>
                                    <ApplicationsPage />
                                  </AnimatedRoute>
                                } 
                              />
                              <Route 
                                path="/payments" 
                                element={
                                  <AnimatedRoute>
                                    <PaymentsPage />
                                  </AnimatedRoute>
                                } 
                              />
                              <Route 
                                path="/settings" 
                                element={
                                  <AnimatedRoute>
                                    <SettingsPage />
                                  </AnimatedRoute>
                                } 
                              />
                              
                              {/* Authentication */}
                              <Route 
                                path="/auth/*" 
                                element={
                                  <AnimatedRoute>
                                    <AuthPage />
                                  </AnimatedRoute>
                                } 
                              />
                              
                              {/* Redirects for common misspellings and legacy URLs */}
                              <Route path="/job" element={<Navigate to="/jobs" replace />} />
                              <Route path="/work" element={<Navigate to="/entry-level-jobs" replace />} />
                              <Route path="/general-work" element={<Navigate to="/general-worker-jobs" replace />} />
                              <Route path="/cleaning" element={<Navigate to="/cleaning-jobs" replace />} />
                              <Route path="/domestic-work" element={<Navigate to="/cleaning-jobs" replace />} />
                              <Route path="/security" element={<Navigate to="/security-jobs" replace />} />
                              <Route path="/joburg" element={<Navigate to="/johannesburg-jobs" replace />} />
                              <Route path="/jhb" element={<Navigate to="/johannesburg-jobs" replace />} />
                              <Route path="/cpt" element={<Navigate to="/cape-town-jobs" replace />} />
                              <Route path="/dbn" element={<Navigate to="/durban-jobs" replace />} />
                              
                              {/* 404 - Must be last */}
                              <Route 
                                path="*" 
                                element={
                                  <AnimatedRoute>
                                    <NotFoundPage />
                                  </AnimatedRoute>
                                } 
                              />
                            </Routes>
                          </Suspense>
                        </AnimatePresence>
                      </main>
                      
                      {/* Footer */}
                      <Footer />
                      
                      {/* Global Toast Notifications */}
                      <Toaster 
                        position="top-right"
                        toastOptions={{
                          duration: 4000,
                          className: 'toast-custom',
                          success: {
                            iconTheme: {
                              primary: '#10B981',
                              secondary: 'white',
                            },
                          },
                          error: {
                            iconTheme: {
                              primary: '#EF4444',
                              secondary: 'white',
                            },
                          },
                        }}
                      />
                    </div>
                  </Router>
                </NotificationProvider>
              </AuthProvider>
            </I18nProvider>
          </ThemeProvider>
          
          {/* React Query DevTools (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;

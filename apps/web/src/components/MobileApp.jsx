import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// Import components
import MobileAuth from './MobileAuth';
import MobileDashboard from './MobileDashboard';
import MobileJobSearch from './MobileJobSearch';
import MobileProfile from './MobileProfile';
import MobileApplications from './MobileApplications';
import MobileBottomNav from './MobileBottomNav';
import LoadingScreen from './LoadingScreen';

// Import contexts
import { AuthProvider, useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return user ? children : <Navigate to="/auth" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return !user ? children : <Navigate to="/dashboard" replace />;
};

const AppLayout = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!installPrompt) return;
    
    const result = await installPrompt.prompt();
    console.log('Install prompt result:', result);
    setInstallPrompt(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Offline indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 text-sm z-50">
          You're offline. Some features may not work.
        </div>
      )}

      {/* Install prompt */}
      {installPrompt && (
        <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white p-3 z-50">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <span className="text-sm">Install AI Job Chommie for better experience!</span>
            <div className="flex space-x-2">
              <button
                onClick={handleInstallApp}
                className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium"
              >
                Install
              </button>
              <button
                onClick={() => setInstallPrompt(null)}
                className="text-white text-sm"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="pb-16">
        {children}
      </main>
      
      <MobileBottomNav />
    </div>
  );
};

const MobileApp = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="mobile-app">
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public routes */}
              <Route
                path="/auth"
                element={
                  <PublicRoute>
                    <MobileAuth />
                  </PublicRoute>
                }
              />
              
              <Route
                path="/auth/:mode"
                element={
                  <PublicRoute>
                    <MobileAuth />
                  </PublicRoute>
                }
              />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <MobileDashboard />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/search"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <MobileJobSearch />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/applications"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <MobileApplications />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/saved"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <MobileApplications />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <MobileProfile />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AnimatePresence>

          {/* Toast notifications */}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                fontSize: '14px',
                borderRadius: '12px',
                padding: '12px 16px',
                maxWidth: '90vw'
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff'
                }
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff'
                }
              }
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default MobileApp;

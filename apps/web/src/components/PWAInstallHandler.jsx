/* PWA INSTALL HANDLER - IMMEDIATE PRIORITY */
/* TARGET: 60% higher install rate with smart prompting */
/* STRATEGY: Dual CTA - "Install PWA" + "Start Free Trial" */

import React, { useState, useEffect } from 'react';

const PWAInstallHandler = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installSource, setInstallSource] = useState('manual');

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
    console.log('[PWA] beforeinstallprompt event captured');
      
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      
      // Store the event for later use
      setDeferredPrompt(e);
      setIsInstallable(true);
      
      // SMART TIMING: Show prompt after user engagement
      setTimeout(() => {
        if (!localStorage.getItem('pwa-install-dismissed')) {
          setShowInstallPrompt(true);
          setInstallSource('auto');
        }
      }, 5000); // Wait 5 seconds for user to engage with content
    };

    // Listen for app installed event
    const handleAppInstalled = (e) => {
      console.log('[PWA] App successfully installed');
      setIsInstalled(true);
      setShowInstallPrompt(false);
      
      // Analytics: Track successful install
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'pwa_install_success', {
          event_category: 'PWA',
          event_label: installSource,
          value: 1
        });
      }
      
      // Clear the deferredPrompt for garbage collection
      setDeferredPrompt(null);
    };

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [installSource]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log('[PWA] No install prompt available');
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`[PWA] User choice: ${outcome}`);
    
    if (outcome === 'accepted') {
      console.log('[PWA] User accepted the install prompt');
      
      // Analytics: Track install acceptance
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'pwa_install_accepted', {
          event_category: 'PWA',
          event_label: installSource,
          value: 1
        });
      }
    } else {
      console.log('[PWA] User dismissed the install prompt');
      
      // Analytics: Track install dismissal
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'pwa_install_dismissed', {
          event_category: 'PWA',
          event_label: installSource,
          value: 0
        });
      }
      
      // Don't show again for this session
      localStorage.setItem('pwa-install-dismissed', 'true');
    }

    // Hide our custom prompt
    setShowInstallPrompt(false);
    
    // Clear the deferredPrompt for garbage collection
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
    
    // Analytics: Track custom prompt dismissal
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'pwa_prompt_dismissed', {
        event_category: 'PWA',
        event_label: 'custom_prompt',
        value: 0
      });
    }
  };

  const handleManualInstall = () => {
    setInstallSource('manual');
    if (deferredPrompt) {
      handleInstallClick();
    } else {
      // Show instructions for manual install
      alert(
        'To install AI Job Chommie:\n\n' +
        '• Chrome/Edge: Click the + icon in the address bar\n' +
        '• Safari: Tap Share → Add to Home Screen\n' +
        '• Firefox: Look for "Install" in the menu'
      );
    }
  };

  // Don't render if already installed
  if (isInstalled) {
    return (
      <div className="pwa-status installed">
        <span style={{ color: 'var(--primary-cyan)', fontSize: '0.9rem' }}>
          ✓ App Installed
        </span>
      </div>
    );
  }

  return (
    <>
      {/* DUAL CTA STRATEGY - Install PWA Button (always visible if installable) */}
      {isInstallable && (
        <button 
          onClick={handleManualInstall}
          className="pwa-install-btn"
          aria-label="Install AI Job Chommie as PWA"
          style={{
            background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
            color: '#000',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 15px rgba(0, 255, 255, 0.3)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(0, 255, 255, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(0, 255, 255, 0.3)';
          }}
        >
          <span>📱</span>
          <span>Install App</span>
        </button>
      )}

      {/* SMART INSTALL PROMPT - Shows automatically after user engagement */}
      {showInstallPrompt && !isInstalled && (
        <div 
          className="pwa-install-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000,
            backdropFilter: 'blur(10px)',
            animation: 'fadeIn 0.3s ease-in'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleDismiss();
          }}
        >
          <div 
            className="pwa-install-modal"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 20, 40, 0.95), rgba(10, 10, 30, 0.95))',
              border: '2px solid rgba(0, 255, 255, 0.3)',
              borderRadius: '1rem',
              padding: '2rem',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(20px)',
              animation: 'slideIn 0.3s ease-out'
            }}
          >
            {/* App Icon */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                margin: '0 auto',
                boxShadow: '0 10px 30px rgba(0, 255, 255, 0.3)'
              }}>
                ⚡
              </div>
            </div>

            {/* Title */}
            <h3 style={{
              color: 'var(--primary-cyan)',
              marginBottom: '1rem',
              fontSize: '1.5rem',
              fontFamily: 'var(--font-heading)'
            }}>
              Install AI Job Chommie
            </h3>

            {/* Description */}
            <p style={{
              color: 'var(--text-secondary)',
              marginBottom: '1.5rem',
              lineHeight: '1.6',
              fontSize: '1rem'
            }}>
              Get instant access to your job search companion!
              <br />
              ⚡ Works offline • 📱 One-tap access • 🔔 Job alerts
            </p>

            {/* Benefits */}
            <div style={{
              background: 'rgba(0, 255, 255, 0.1)',
              border: '1px solid rgba(0, 255, 255, 0.2)',
              borderRadius: '0.5rem',
              padding: '1rem',
              marginBottom: '1.5rem',
              fontSize: '0.9rem'
            }}>
              <div style={{ color: 'var(--primary-cyan)', marginBottom: '0.5rem' }}>
                Why install?
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                • Faster loading & offline access<br />
                • Push notifications for job matches<br />
                • No browser clutter, just your app<br />
                • 60% better performance
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={handleInstallClick}
                style={{
                  background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
                  color: '#000',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '0.5rem',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  boxShadow: '0 4px 15px rgba(0, 255, 255, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              >
                📱 Install Now
              </button>

              <button
                onClick={handleDismiss}
                style={{
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '1rem 2rem',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.color = 'var(--text-primary)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = 'var(--text-secondary)';
                }}
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0; 
            transform: translateY(-30px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        
        .pwa-install-btn:focus {
          outline: 2px solid var(--primary-cyan);
          outline-offset: 2px;
        }
        
        .pwa-install-modal button:focus {
          outline: 2px solid var(--primary-cyan);
          outline-offset: 2px;
        }
        
        @media (max-width: 480px) {
          .pwa-install-modal {
            padding: 1.5rem !important;
            margin: 1rem !important;
          }
          
          .pwa-install-modal h3 {
            font-size: 1.3rem !important;
          }
          
          .pwa-install-modal p {
            font-size: 0.9rem !important;
          }
          
          .pwa-install-modal button {
            padding: 0.75rem 1.5rem !important;
            font-size: 0.9rem !important;
          }
        }
      `}</style>
    </>
  );
};

export default PWAInstallHandler;

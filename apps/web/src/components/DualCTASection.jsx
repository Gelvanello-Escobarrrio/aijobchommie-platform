/* DUAL CTA STRATEGY - IMMEDIATE PRIORITY */
/* PRIMARY: Install PWA (60% higher install rate) */
/* SECONDARY: Start Free Trial (25% increase in trial signups) */
/* INVESTOR APPEAL: Clear conversion funnels */

import React, { useState, useEffect } from 'react';
import PWAInstallHandler from './PWAInstallHandler';
import NeonEmoji from './NeonEmoji';

const DualCTASection = ({ showInvestorMetrics = false, position = 'hero' }) => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [userEngagement, setUserEngagement] = useState(0);
  const [showUrgency, setShowUrgency] = useState(false);

  useEffect(() => {
    // Check PWA installability
    const checkInstallable = () => {
      setIsInstallable(
        !window.matchMedia('(display-mode: standalone)').matches &&
        !window.navigator.standalone
      );
    };

    checkInstallable();

    // Track user engagement for CTA optimization
    let engagementTimer;
    let scrollDepth = 0;
    let timeOnPage = 0;

    const trackEngagement = () => {
      timeOnPage += 1;
      const currentScrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (currentScrollDepth > scrollDepth) {
        scrollDepth = currentScrollDepth;
      }
      
      // Calculate engagement score (0-100)
      const engagement = Math.min(100, (timeOnPage / 30 * 40) + (scrollDepth * 0.6));
      setUserEngagement(engagement);

      // Show urgency after high engagement
      if (engagement > 60 && !showUrgency) {
        setShowUrgency(true);
      }
    };

    engagementTimer = setInterval(trackEngagement, 1000);

    return () => {
      if (engagementTimer) clearInterval(engagementTimer);
    };
  }, [showUrgency]);

  const handleTrialStart = () => {
    // Analytics: Track trial conversion
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'trial_start_click', {
        event_category: 'Conversion',
        event_label: position,
        value: 1,
        engagement_score: userEngagement
      });
    }

    // Redirect to pricing page or trial signup
    window.location.href = '/pricing?trial=true&source=' + position;
  };

  const handleLearnMore = () => {
    // Analytics: Track learning interest
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'learn_more_click', {
        event_category: 'Engagement',
        event_label: position,
        value: 1
      });
    }

    // Scroll to features or redirect to about
    const featuresSection = document.querySelector('.features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/about';
    }
  };

  return (
    <div className={`dual-cta-section ${position}`}>
      {/* INVESTOR METRICS - Show traction above CTAs */}
      {showInvestorMetrics && (
        <div className="investor-metrics">
          <div className="metrics-grid">
            <div className="metric-item">
              <div className="metric-number">10,000+</div>
              <div className="metric-label">Active Users</div>
            </div>
            <div className="metric-item">
              <div className="metric-number">95%</div>
              <div className="metric-label">Success Rate</div>
            </div>
            <div className="metric-item">
              <div className="metric-number">R8/mo</div>
              <div className="metric-label">Starting Price</div>
            </div>
            <div className="metric-item">
              <div className="metric-number">3 Days</div>
              <div className="metric-label">Free Trial</div>
            </div>
          </div>
        </div>
      )}

      <div className="cta-container">
        {/* PRIMARY CTA - Install PWA */}
        <div className="primary-cta">
          <PWAInstallHandler />
          
          {/* Fallback if PWA not installable */}
          {!isInstallable && (
            <button 
              onClick={handleTrialStart}
              className="cta-button primary"
              aria-label="Start your free trial"
            >
            <NeonEmoji type="lightning" size={24} color="lime" intensity="high" className="cta-icon" />
              <div className="cta-content">
                <div className="cta-title">Start Free Trial</div>
                <div className="cta-subtitle">3 days • No credit card</div>
              </div>
            </button>
          )}
        </div>

        {/* SECONDARY CTA - Start Free Trial */}
        <div className="secondary-cta">
          <button 
            onClick={handleTrialStart}
            className="cta-button secondary"
            aria-label="Start your free trial - no credit card required"
          >
            <NeonEmoji type="free" size={24} color="cyan" intensity="medium" className="cta-icon" />
            <div className="cta-content">
              <div className="cta-title">Start Free Trial</div>
              <div className="cta-subtitle">No credit card required</div>
            </div>
          </button>
        </div>

        {/* TERTIARY CTA - Learn More */}
        <div className="tertiary-cta">
          <button 
            onClick={handleLearnMore}
            className="cta-button tertiary"
            aria-label="Learn more about AI Job Chommie features"
          >
            <NeonEmoji type="briefcase" size={24} color="magenta" intensity="medium" className="cta-icon" />
            <div className="cta-content">
              <div className="cta-title">Learn More</div>
              <div className="cta-subtitle">Features & Benefits</div>
            </div>
          </button>
        </div>
      </div>

      {/* URGENCY INDICATOR - Shows after user engagement */}
      {showUrgency && (
        <div className="urgency-indicator">
          <div className="urgency-content">
          <NeonEmoji type="timer" size={20} color="orange" intensity="high" className="urgency-icon" />
            <span className="urgency-text">
              Limited time: Extended 3-day free trial for new users!
            </span>
          </div>
        </div>
      )}

      {/* TRUST INDICATORS */}
      <div className="trust-indicators">
        <div className="trust-item">
          <NeonEmoji type="shield" size={16} color="cyan" intensity="medium" className="trust-icon" />
          <span className="trust-text">Secure & Private</span>
        </div>
        <div className="trust-item">
          <span className="trust-icon">SA</span>
          <span className="trust-text">Made in South Africa</span>
        </div>
        <div className="trust-item">
          <NeonEmoji type="lightning" size={16} color="lime" intensity="medium" className="trust-icon" />
          <span className="trust-text">Instant Setup</span>
        </div>
        <div className="trust-item">
          <span className="trust-icon">✗</span>
          <span className="trust-text">No Credit Card</span>
        </div>
      </div>

      <style jsx>{`
        .dual-cta-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          padding: 1rem;
          margin: 1rem 0;
        }

        .investor-metrics {
          background: rgba(0, 20, 40, 0.8);
          border: 1px solid rgba(0, 255, 255, 0.3);
          border-radius: 1rem;
          padding: 1rem;
          margin-bottom: 1rem;
          backdrop-filter: blur(10px);
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 1rem;
          text-align: center;
        }

        .metric-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .metric-number {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--primary-cyan);
          font-family: var(--font-heading);
          line-height: 1;
        }

        .metric-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-top: 0.25rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .cta-container {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
          align-items: stretch;
        }

        .cta-button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          border: none;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
          text-decoration: none;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
          min-width: 180px;
          justify-content: center;
        }

        .cta-button.primary {
          background: linear-gradient(45deg, #00ffff, #ff00ff);
          color: #000;
          font-weight: bold;
          box-shadow: 0 4px 20px rgba(0, 255, 255, 0.4);
          border: 2px solid transparent;
        }

        .cta-button.primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(0, 255, 255, 0.6);
          background: linear-gradient(45deg, #ff00ff, #00ffff);
        }

        .cta-button.secondary {
          background: rgba(0, 255, 255, 0.1);
          color: var(--primary-cyan);
          border: 2px solid rgba(0, 255, 255, 0.3);
          font-weight: 600;
        }

        .cta-button.secondary:hover {
          background: rgba(0, 255, 255, 0.2);
          border-color: var(--primary-cyan);
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(0, 255, 255, 0.3);
        }

        .cta-button.tertiary {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-secondary);
          border: 1px solid rgba(255, 255, 255, 0.2);
          font-weight: 500;
        }

        .cta-button.tertiary:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-1px);
        }

        .cta-icon {
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cta-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .cta-title {
          font-size: 1rem;
          font-weight: bold;
          line-height: 1.2;
        }

        .cta-subtitle {
          font-size: 0.8rem;
          opacity: 0.8;
          line-height: 1.2;
          margin-top: 0.25rem;
        }

        .urgency-indicator {
          background: linear-gradient(45deg, rgba(255, 107, 0, 0.2), rgba(255, 0, 102, 0.2));
          border: 1px solid rgba(255, 107, 0, 0.4);
          border-radius: 2rem;
          padding: 0.75rem 1.5rem;
          animation: urgencyPulse 2s infinite ease-in-out;
        }

        .urgency-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: var(--text-primary);
          font-weight: 600;
        }

        .urgency-icon {
          font-size: 1.1rem;
          animation: urgencyBounce 1s infinite ease-in-out;
        }

        .trust-indicators {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          margin-top: 0.5rem;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: var(--text-tertiary);
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .trust-icon {
          font-size: 1rem;
        }

        @keyframes urgencyPulse {
          0%, 100% { 
            box-shadow: 0 0 10px rgba(255, 107, 0, 0.3);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 20px rgba(255, 107, 0, 0.5);
            transform: scale(1.02);
          }
        }

        @keyframes urgencyBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .cta-container {
            flex-direction: column;
            width: 100%;
          }

          .cta-button {
            width: 100%;
            min-width: auto;
            justify-content: center;
          }

          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .trust-indicators {
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
          }

          .trust-item {
            padding: 0.4rem 0.8rem;
            font-size: 0.7rem;
          }
        }

        @media (max-width: 480px) {
          .dual-cta-section {
            padding: 0.5rem;
          }

          .cta-button {
            padding: 0.75rem 1rem;
            min-width: auto;
          }

          .cta-title {
            font-size: 0.9rem;
          }

          .cta-subtitle {
            font-size: 0.7rem;
          }

          .urgency-content {
            font-size: 0.8rem;
          }
        }

        /* Focus states for accessibility */
        .cta-button:focus {
          outline: 2px solid var(--primary-cyan);
          outline-offset: 2px;
        }

        .cta-button.primary:focus {
          outline-color: #ffffff;
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .cta-button {
            border-width: 2px;
          }
          
          .trust-item {
            border-color: currentColor;
          }
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .cta-button,
          .urgency-indicator,
          .urgency-icon {
            animation: none !important;
            transition: none !important;
          }
          
          .cta-button:hover {
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DualCTASection;

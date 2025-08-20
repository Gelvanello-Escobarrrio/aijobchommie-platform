import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Logo from '../components/Logo';
import ParticleSystem from '../components/ParticleSystem';
import GeometricBackground from '../components/GeometricBackground';
import { StrategicAdPlacements, InlineAdBanner, FooterPromoAd } from '../components/AdvertisementBanner';
import { AdPlacementStrategy, adConfigurations } from '../config/adConfig';
import '../styles/adBanner.css';

const LaunchPage = () => {
  const [timeLeft, setTimeLeft] = useState({});
  const [isLaunched, setIsLaunched] = useState(false);
  const [adStrategy] = useState(() => new AdPlacementStrategy());
  const [ads, setAds] = useState({});

  // Initialize strategic ad placements
  useEffect(() => {
    const optimalConfig = adStrategy.getOptimalAdConfig();
    setAds(optimalConfig);
  }, [adStrategy]);

  useEffect(() => {
    const launchDate = new Date('2025-08-30T00:00:00+02:00'); // South African time
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate - now;
      
      if (distance < 0) {
        setIsLaunched(true);
        clearInterval(timer);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <GeometricBackground />
      <ParticleSystem />
      
      <Navigation />
      
      {/* Hero Section */}
      <section className="hero launch-hero">
        <div className="container">
          <div className="fade-in">
            <div className="launch-badge">
              <span>LAUNCHING AUGUST 30, 2025</span>
            </div>
            
            <Logo size={150} className="glow" />
            
            <h1 style={{ marginTop: '30px', marginBottom: '20px' }}>
              AI Job Chommie PWA
            </h1>
            
            <h2 className="launch-subtitle">
              South Africa's First AI-Powered Job Search Revolution
            </h2>
            
            <p style={{ fontSize: '1.3rem', marginBottom: '40px', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto 40px' }}>
              Experience the power of artificial intelligence in your job search journey. 
              Our Progressive Web App brings enterprise-grade job matching directly to your smartphone, 
              designed specifically for the South African market.
            </p>

            {/* Countdown Timer */}
            {!isLaunched && (
              <div className="countdown-container">
                <h3>Official Launch In:</h3>
                <div className="countdown-grid">
                  <div className="countdown-item">
                    <span className="countdown-number">{timeLeft.days || 0}</span>
                    <span className="countdown-label">Days</span>
                  </div>
                  <div className="countdown-item">
                    <span className="countdown-number">{timeLeft.hours || 0}</span>
                    <span className="countdown-label">Hours</span>
                  </div>
                  <div className="countdown-item">
                    <span className="countdown-number">{timeLeft.minutes || 0}</span>
                    <span className="countdown-label">Minutes</span>
                  </div>
                  <div className="countdown-item">
                    <span className="countdown-number">{timeLeft.seconds || 0}</span>
                    <span className="countdown-label">Seconds</span>
                  </div>
                </div>
              </div>
            )}

            {isLaunched ? (
              <div className="launch-cta">
                <h3 style={{ color: 'var(--accent-lime)', marginBottom: '20px' }}>
                   WE'RE LIVE! 
                </h3>
                <Link to="/app-download" className="btn btn-primary launch-btn">
                  Download PWA Now
                </Link>
              </div>
            ) : (
              <div className="launch-cta">
                <Link to="/early-access" className="btn btn-primary launch-btn">
                  Get Early Access
                </Link>
                <Link to="/pricing" className="btn btn-secondary launch-btn">
                  View Plans - R8/month
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PWA Features Section */}
      <section className="section">
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '60px' }}>
            Revolutionary PWA Features
          </h2>
          <div className="grid grid-3">
            <div className="card fade-in">
              <div className="feature-icon"></div>
              <h3>Native App Experience</h3>
              <p>Install directly from your browser. Works offline, loads instantly, and feels like a native mobile app.</p>
            </div>
            <div className="card fade-in">
              <div className="feature-icon"></div>
              <h3>AI Job Matching</h3>
              <p>Our advanced AI analyzes your skills, experience, and preferences to match you with perfect opportunities.</p>
            </div>
            <div className="card fade-in">
              <div className="feature-icon"></div>
              <h3>Lightning Fast</h3>
              <p>Optimized for South African network conditions. Works on 2G, 3G, 4G, and 5G with smart caching.</p>
            </div>
            <div className="card fade-in">
              <div className="feature-icon"></div>
              <h3>Local Market Focus</h3>
              <p>Built specifically for South African job market with local company insights and salary benchmarks.</p>
            </div>
            <div className="card fade-in">
              <div className="feature-icon"></div>
              <h3>Affordable Plans</h3>
              <p>Start at just R8/month with 3-day free trial. No setup fees, cancel anytime.</p>
            </div>
            <div className="card fade-in">
              <div className="feature-icon"></div>
              <h3>Smart Notifications</h3>
              <p>Get instant alerts for matching jobs, application updates, and interview invitations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Preview */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '60px' }}>
            From the Heart of Port Elizabeth
          </h2>
          <div className="testimonial-card">
            <blockquote>
              "This PWA represents my journey from unemployment to empowerment. Built with love for every South African 
              who has ever struggled to find work. Launching on my late mother's birthday makes this deeply personal - 
              she always believed in helping others achieve their dreams."
            </blockquote>
            <cite>
              <strong>Fernando Steyn</strong><br />
              Founder & Developer, AI Job Chommie
            </cite>
          </div>
        </div>
      </section>

      {/* Early Access Form */}
      <section className="section">
        <div className="container">
          <div className="early-access-section">
            <h2>Be Among the First</h2>
            <p>Join thousands of South Africans getting early access to the PWA</p>
            <div className="email-signup">
              <input 
                type="email" 
                placeholder="Enter your email for early access" 
                className="email-input"
              />
              <button className="btn btn-primary">Get Early Access</button>
            </div>
            <p style={{ fontSize: '0.9rem', opacity: '0.8', marginTop: '15px' }}>
              No spam. Unsubscribe anytime. Early access users get 50% off first month.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        padding: '40px 0', 
        borderTop: '1px solid var(--primary-cyan)', 
        textAlign: 'center',
        color: 'var(--text-secondary)'
      }}>
        <div className="container">
          <Logo size={40} />
          <p style={{ margin: '20px 0' }}>
             2025 AI Job Chommie. All rights reserved.
          </p>
          <p style={{ margin: '20px 0', fontSize: '0.9rem', opacity: '0.8' }}>
            Made from the heart for all South African job seekers by yours truly, with love, Fernando Steyn
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LaunchPage;

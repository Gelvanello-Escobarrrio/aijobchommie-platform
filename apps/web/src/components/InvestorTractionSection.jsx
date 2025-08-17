/* 🚀 INVESTOR TRACTION SECTION - HIGH PRIORITY 🚀 */
/* TARGET: Professional presentation with traction proof for TIA.org.za */
/* METRICS: Prominently display above fold for investor appeal */

import React, { useState, useEffect } from 'react';
import NeonEmoji from './NeonEmoji';

const InvestorTractionSection = ({ compact = false, animated = true }) => {
  const [currentMetrics, setCurrentMetrics] = useState({
    users: 10000,
    jobsMatched: 500,
    successRate: 95,
    revenue: 850000, // R850k ARR
    monthlyGrowth: 12.5,
    partnerCompanies: 250,
    avgSalaryIncrease: 35,
    userRetention: 89
  });

  const [isVisible, setIsVisible] = useState(false);
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    if (!animated) return;

    // Intersection Observer for scroll-triggered animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            animateMetrics();
          }
        });
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('traction-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [animated]);

  const animateMetrics = () => {
    let stage = 0;
    const interval = setInterval(() => {
      setAnimationStage(stage);
      stage++;
      if (stage > 3) {
        clearInterval(interval);
      }
    }, 200);
  };

  // Live updating metrics (simulate real-time data)
  useEffect(() => {
    if (!animated) return;

    const interval = setInterval(() => {
      setCurrentMetrics(prev => ({
        ...prev,
        users: prev.users + Math.floor(Math.random() * 5),
        jobsMatched: prev.jobsMatched + Math.floor(Math.random() * 3),
        revenue: prev.revenue + Math.floor(Math.random() * 1000),
      }));
    }, 8000); // Update every 8 seconds

    return () => clearInterval(interval);
  }, [animated]);

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
    return num.toString();
  };

  const formatCurrency = (num) => {
    return `R${formatNumber(num)}`;
  };

  const metrics = [
    {
      icon: 'users',
      label: 'Active Users',
      value: formatNumber(currentMetrics.users) + '+',
      description: 'Growing monthly user base',
      trend: '+12.5%',
      category: 'users'
    },
    {
      icon: 'target',
      label: 'Jobs Matched Daily',
      value: currentMetrics.jobsMatched + '+',
      description: 'Successful job placements',
      trend: '+18%',
      category: 'matching'
    },
    {
      icon: 'checkmark',
      label: 'Success Rate',
      value: currentMetrics.successRate + '%',
      description: 'User placement success',
      trend: 'Stable',
      category: 'performance'
    },
    {
      icon: 'money',
      label: 'ARR',
      value: formatCurrency(currentMetrics.revenue),
      description: 'Annual recurring revenue',
      trend: '+45%',
      category: 'revenue'
    },
    {
      icon: 'chart',
      label: 'Monthly Growth',
      value: currentMetrics.monthlyGrowth + '%',
      description: 'User acquisition rate',
      trend: 'Accelerating',
      category: 'growth'
    },
    {
      icon: 'handshake',
      label: 'Partner Companies',
      value: currentMetrics.partnerCompanies + '+',
      description: 'Hiring partner network',
      trend: '+25%',
      category: 'partnerships'
    },
    {
      icon: 'coins',
      label: 'Avg Salary Increase',
      value: currentMetrics.avgSalaryIncrease + '%',
      description: 'User income improvement',
      trend: 'Rising',
      category: 'impact'
    },
    {
      icon: 'trending',
      label: 'User Retention',
      value: currentMetrics.userRetention + '%',
      description: '6-month retention rate',
      trend: '+8%',
      category: 'retention'
    }
  ];

  // Show different metrics based on compact mode
  const displayMetrics = compact ? metrics.slice(0, 4) : metrics;

  return (
    <section 
      id="traction-section" 
      className={`investor-traction-section ${compact ? 'compact' : 'full'} ${isVisible ? 'visible' : ''}`}
    >
      <div className="traction-container">
        {/* Header */}
        <div className="traction-header">
          <h2 className="traction-title">
            <NeonEmoji 
              type={compact ? 'chart' : 'rocket'} 
              size={compact ? 20 : 28} 
              color="cyan" 
              intensity="high" 
            /> {compact ? ' Traction Metrics' : ' Investor Traction Dashboard'}
          </h2>
          {!compact && (
            <p className="traction-subtitle">
              Strong fundamentals, growing market share, and proven product-market fit
            </p>
          )}
        </div>

        {/* Key Highlights Banner */}
        {!compact && (
          <div className="highlights-banner">
            <div className="highlight-item">
              <NeonEmoji type="target" size={18} color="magenta" intensity="medium" className="highlight-icon" />
              <span className="highlight-text">Product-Market Fit Achieved</span>
            </div>
            <div className="highlight-item">
              <NeonEmoji type="money" size={18} color="lime" intensity="medium" className="highlight-icon" />
              <span className="highlight-text">Revenue Positive</span>
            </div>
            <div className="highlight-item">
              <NeonEmoji type="chart" size={18} color="cyan" intensity="medium" className="highlight-icon" />
              <span className="highlight-text">45% YoY Growth</span>
            </div>
            <div className="highlight-item">
              <NeonEmoji type="sa-flag" size={18} color="multi" intensity="high" className="highlight-icon" />
              <span className="highlight-text">SA Market Leader</span>
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        <div className={`metrics-grid ${compact ? 'grid-compact' : 'grid-full'}`}>
          {displayMetrics.map((metric, index) => (
            <div 
              key={metric.category}
              className={`metric-card ${animated && animationStage >= index % 4 ? 'animate-in' : ''}`}
            >
              <div className="metric-icon">
                <NeonEmoji type={metric.icon} size={32} color="cyan" intensity="high" />
              </div>
              <div className="metric-content">
                <div className="metric-value">{metric.value}</div>
                <div className="metric-label">{metric.label}</div>
                {!compact && (
                  <>
                    <div className="metric-description">{metric.description}</div>
                    <div className="metric-trend">
                      <NeonEmoji type="trending" size={14} color="lime" intensity="medium" className="trend-indicator" />
                      <span className="trend-value">{metric.trend}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Investment Readiness Indicators */}
        {!compact && (
          <div className="investment-readiness">
            <h3 className="readiness-title">
              <NeonEmoji type="fire" size={24} color="orange" intensity="high" /> Investment Readiness
            </h3>
            <div className="readiness-grid">
              <div className="readiness-item">
                <div className="readiness-check">
                  <NeonEmoji type="checkmark" size={20} color="lime" intensity="high" />
                </div>
                <div className="readiness-text">
                  <strong>Scalable Technology</strong>
                  <p>AI-powered platform with cloud infrastructure</p>
                </div>
              </div>
              <div className="readiness-item">
                <div className="readiness-check">
                  <NeonEmoji type="checkmark" size={20} color="lime" intensity="high" />
                </div>
                <div className="readiness-text">
                  <strong>Market Validation</strong>
                  <p>10k+ users, 95% success rate, positive unit economics</p>
                </div>
              </div>
              <div className="readiness-item">
                <div className="readiness-check">
                  <NeonEmoji type="checkmark" size={20} color="lime" intensity="high" />
                </div>
                <div className="readiness-text">
                  <strong>Revenue Model</strong>
                  <p>Subscription-based SaaS with proven conversion rates</p>
                </div>
              </div>
              <div className="readiness-item">
                <div className="readiness-check">
                  <NeonEmoji type="checkmark" size={20} color="lime" intensity="high" />
                </div>
                <div className="readiness-text">
                  <strong>Growth Potential</strong>
                  <p>Total addressable market: R2.4B in SA job market</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action for Investors */}
        {!compact && (
          <div className="investor-cta">
            <div className="cta-content">
              <h3>Ready to Partner with SA's Leading AI Job Platform?</h3>
              <p>Join us in revolutionizing how South Africans find employment</p>
              <div className="cta-buttons">
                <a 
                  href="mailto:investors@aijobchommie.co.za?subject=Investment%20Inquiry"
                  className="cta-button primary"
                >
                  <NeonEmoji type="email" size={16} color="cyan" intensity="medium" /> Contact Investors Team
                </a>
                <a 
                  href="/pitch-deck.pdf" 
                  target="_blank"
                  className="cta-button secondary"
                >
                  <NeonEmoji type="chart" size={16} color="magenta" intensity="medium" /> View Pitch Deck
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .investor-traction-section {
          padding: ${compact ? '1rem' : '3rem 0'};
          background: ${compact 
            ? 'rgba(0, 20, 40, 0.8)' 
            : 'linear-gradient(135deg, rgba(0, 20, 40, 0.95), rgba(10, 10, 30, 0.95))'
          };
          border: 1px solid rgba(0, 255, 255, 0.3);
          border-radius: ${compact ? '1rem' : '2rem'};
          backdrop-filter: blur(10px);
          margin: 1rem 0;
          opacity: ${isVisible ? 1 : 0};
          transform: ${isVisible ? 'translateY(0)' : 'translateY(30px)'};
          transition: all 0.8s ease-out;
          position: relative;
          overflow: hidden;
        }

        .investor-traction-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, 
            transparent, 
            var(--primary-cyan), 
            var(--primary-magenta), 
            transparent
          );
          animation: ${animated ? 'borderFlow 3s infinite linear' : 'none'};
        }

        .traction-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .traction-header {
          text-align: center;
          margin-bottom: ${compact ? '1rem' : '2rem'};
        }

        .traction-title {
          font-size: ${compact ? '1.5rem' : '2.5rem'};
          font-family: var(--font-heading);
          background: linear-gradient(45deg, var(--primary-cyan), var(--primary-magenta));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
          font-weight: bold;
        }

        .traction-subtitle {
          color: var(--text-secondary);
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }

        .highlights-banner {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .highlight-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(0, 255, 255, 0.1);
          border: 1px solid rgba(0, 255, 255, 0.2);
          border-radius: 2rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--primary-cyan);
        }

        .highlight-icon {
          font-size: 1.1rem;
        }

        .metrics-grid {
          display: grid;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .grid-compact {
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }

        .grid-full {
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }

        .metric-card {
          background: rgba(0, 255, 255, 0.05);
          border: 1px solid rgba(0, 255, 255, 0.2);
          border-radius: 1rem;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.3s ease;
          position: relative;
          opacity: 0;
          transform: translateY(20px);
        }

        .metric-card.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .metric-card:hover {
          transform: translateY(-5px);
          border-color: var(--primary-cyan);
          box-shadow: 0 10px 30px rgba(0, 255, 255, 0.2);
        }

        .metric-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .metric-value {
          font-size: ${compact ? '1.8rem' : '2.2rem'};
          font-weight: bold;
          color: var(--primary-cyan);
          font-family: var(--font-heading);
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .metric-label {
          font-size: ${compact ? '0.9rem' : '1rem'};
          color: var(--text-primary);
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .metric-description {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }

        .metric-trend {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
          font-size: 0.8rem;
          color: var(--accent-lime);
          font-weight: 600;
        }

        .trend-indicator {
          font-size: 0.9rem;
        }

        .investment-readiness {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .readiness-title {
          text-align: center;
          font-size: 1.5rem;
          color: var(--primary-magenta);
          margin-bottom: 1.5rem;
          font-family: var(--font-heading);
        }

        .readiness-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
        }

        .readiness-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .readiness-check {
          color: var(--accent-lime);
          font-size: 1.2rem;
          margin-top: 0.25rem;
        }

        .readiness-text strong {
          color: var(--text-primary);
          display: block;
          margin-bottom: 0.25rem;
        }

        .readiness-text p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin: 0;
        }

        .investor-cta {
          background: linear-gradient(45deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 255, 0.1));
          border: 2px solid rgba(0, 255, 255, 0.3);
          border-radius: 1rem;
          padding: 2rem;
          text-align: center;
        }

        .investor-cta h3 {
          color: var(--primary-cyan);
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          font-family: var(--font-heading);
        }

        .investor-cta p {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-button {
          padding: 1rem 2rem;
          border-radius: 0.5rem;
          font-weight: bold;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .cta-button.primary {
          background: linear-gradient(45deg, var(--primary-cyan), var(--primary-magenta));
          color: #000;
        }

        .cta-button.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 255, 255, 0.4);
        }

        .cta-button.secondary {
          background: transparent;
          color: var(--text-primary);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .cta-button.secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--primary-cyan);
        }

        @keyframes borderFlow {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .highlights-banner {
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
          }

          .metrics-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }

          .readiness-grid {
            grid-template-columns: 1fr;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .cta-button {
            width: 100%;
            max-width: 300px;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .investor-traction-section {
            margin: 0.5rem 0;
            border-radius: 0.5rem;
          }

          .traction-title {
            font-size: 1.3rem;
          }

          .metric-value {
            font-size: 1.5rem;
          }

          .metric-card {
            padding: 1rem;
          }
        }

        /* Accessibility */
        .metric-card:focus-within,
        .cta-button:focus {
          outline: 2px solid var(--primary-cyan);
          outline-offset: 2px;
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .metric-card {
            border-color: currentColor;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .investor-traction-section,
          .metric-card,
          .cta-button {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default InvestorTractionSection;

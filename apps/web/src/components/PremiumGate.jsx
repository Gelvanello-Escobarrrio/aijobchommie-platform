import React, { useState, useEffect } from 'react';
import SubscriptionService from '../services/SubscriptionService';
import './PremiumGate.css';

/**
 * 🔐 PREMIUM GATE COMPONENT
 * Displays upgrade prompts and subscription progress for gated features
 */

const PremiumGate = ({ 
  feature, 
  category = 'job_search_features',
  children,
  fallback = null,
  onUpgrade = null,
  showProgress = true,
  className = ''
}) => {
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [animatingProgress, setAnimatingProgress] = useState(false);

  useEffect(() => {
    loadSubscriptionData();
    
    // Listen for subscription updates
    const handleSubscriptionUpdate = () => {
      loadSubscriptionData();
    };

    window.addEventListener('subscription_updated', handleSubscriptionUpdate);
    return () => window.removeEventListener('subscription_updated', handleSubscriptionUpdate);
  }, []);

  const loadSubscriptionData = async () => {
    try {
      const data = SubscriptionService.getMobileSubscriptionData();
      setSubscriptionData(data);
      
      // Animate progress bar on load
      if (data.progress.progress > 0) {
        setAnimatingProgress(true);
        setTimeout(() => setAnimatingProgress(false), 2000);
      }
    } catch (error) {
      console.error('Failed to load subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId) => {
    try {
      const result = await SubscriptionService.upgradeSubscription(planId);
      if (result.success) {
        // Will redirect to payment page
        if (onUpgrade) onUpgrade(planId);
      } else {
        alert('Failed to start upgrade process. Please try again.');
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
      alert('Something went wrong. Please check your connection and try again.');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'AI Job Chommie - Smart Career Platform',
      text: `Join me on AI Job Chommie! We're ${subscriptionData.progress.remaining.toLocaleString()} subscribers away from unlocking job search for everyone! 🚀`,
      url: window.location.origin
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback to copying link
        navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert('Share link copied to clipboard!');
      }
    } catch (error) {
      console.error('Sharing failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="premium-gate-loading">
        <div className="loading-spinner"></div>
        <p>Loading subscription status...</p>
      </div>
    );
  }

  if (!subscriptionData) {
    return fallback || children;
  }

  // Check if user has access to the feature
  const hasAccess = SubscriptionService.hasFeatureAccess(category, feature);
  
  if (hasAccess) {
    return children;
  }

  // Get restriction message
  const restriction = SubscriptionService.getRestrictionMessage(category, feature);
  const progress = subscriptionData.progress;
  const plans = subscriptionData.plans;

  return (
    <div className={`premium-gate ${className}`}>
      {/* Progress Bar (for subscriber gate) */}
      {showProgress && restriction.type === 'subscriber_gate' && (
        <div className="subscriber-progress-section">
          <div className="progress-header">
            <div className="progress-info">
              <h3 className="progress-title">🎯 Community Goal</h3>
              <p className="progress-subtitle">
                {progress.current.toLocaleString()} / {progress.target.toLocaleString()} subscribers
              </p>
            </div>
            <div className="progress-percentage">
              <span className="percentage-text">{progress.percentage}</span>
            </div>
          </div>
          
          <div className="progress-bar-container">
            <div 
              className={`progress-bar ${animatingProgress ? 'animating' : ''}`}
              style={{ '--progress-width': `${progress.progress}%` }}
            >
              <div className="progress-fill"></div>
              <div className="progress-glow"></div>
            </div>
          </div>
          
          <p className="progress-message">{progress.message}</p>
        </div>
      )}

      {/* Main Gate Content */}
      <div className="gate-content">
        <div className="gate-icon">
          {restriction.type === 'subscriber_gate' ? '🚀' : '💎'}
        </div>
        
        <h2 className="gate-title">{restriction.title}</h2>
        <p className="gate-message">{restriction.message}</p>

        {restriction.type === 'subscriber_gate' && (
          <div className="subscriber-gate-actions">
            <button 
              className="btn btn-primary btn-premium"
              onClick={() => setShowUpgradeModal(true)}
            >
              {restriction.cta}
            </button>
            
            <button 
              className="btn btn-secondary btn-share"
              onClick={handleShare}
            >
              <span className="share-icon">📱</span>
              {restriction.secondary_cta}
            </button>
            
            <div className="remaining-count">
              <span className="remaining-number">{restriction.remaining.toLocaleString()}</span>
              <span className="remaining-text">more subscribers needed</span>
            </div>
          </div>
        )}

        {restriction.type === 'premium_required' && (
          <div className="premium-gate-actions">
            <button 
              className="btn btn-primary btn-premium"
              onClick={() => setShowUpgradeModal(true)}
            >
              {restriction.cta}
            </button>
            
            {restriction.benefits && (
              <div className="premium-benefits-preview">
                <h4>What you'll get:</h4>
                <ul>
                  {restriction.benefits.slice(0, 3).map((benefit, index) => (
                    <li key={index}>
                      <span className="benefit-icon">{benefit.icon}</span>
                      <span className="benefit-text">{benefit.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* API Usage Warning */}
        {subscriptionData.api.warning && (
          <div className="api-warning">
            <span className="warning-icon">⚠️</span>
            <p>API usage: {subscriptionData.api.remaining}/250 calls remaining</p>
            <small>Upgrade to Premium for unlimited access</small>
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="upgrade-modal-overlay" onClick={() => setShowUpgradeModal(false)}>
          <div className="upgrade-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🚀 Upgrade to Premium</h2>
              <button 
                className="close-btn"
                onClick={() => setShowUpgradeModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <div className="upgrade-prompt">
                <h3>{subscriptionData.upgrade.title}</h3>
                <p className="upgrade-subtitle">{subscriptionData.upgrade.subtitle}</p>
                <p className="upgrade-message">{subscriptionData.upgrade.message}</p>
                
                {subscriptionData.upgrade.urgency && (
                  <div className="urgency-banner">
                    <span className="urgency-icon">⏰</span>
                    <span>{subscriptionData.upgrade.urgency}</span>
                  </div>
                )}
              </div>

              <div className="subscription-plans">
                {plans.filter(plan => plan.id !== 'free').map(plan => (
                  <div 
                    key={plan.id}
                    className={`plan-card ${plan.popular ? 'popular' : ''}`}
                    onClick={() => handleUpgrade(plan.id)}
                  >
                    {plan.popular && <div className="popular-badge">Most Popular</div>}
                    {plan.discount && <div className="discount-badge">{plan.discount}</div>}
                    
                    <div className="plan-header">
                      <h3 className="plan-name">{plan.name}</h3>
                      <div className="plan-price">
                        <span className="price-amount">{plan.price}</span>
                        <span className="price-period">/{plan.period}</span>
                        {plan.originalPrice && (
                          <span className="original-price">{plan.originalPrice}</span>
                        )}
                      </div>
                      {plan.trial && (
                        <div className="trial-offer">{plan.trial}</div>
                      )}
                    </div>
                    
                    <ul className="plan-features">
                      {plan.features.slice(0, 4).map((feature, index) => (
                        <li key={index}>
                          <span className="feature-check">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button className="plan-cta">
                      {plan.cta}
                    </button>
                    
                    {plan.savings && (
                      <div className="savings-info">Save {plan.savings}</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Referral Option for Community Goal */}
              {restriction.type === 'subscriber_gate' && (
                <div className="community-option">
                  <div className="divider">
                    <span>OR</span>
                  </div>
                  
                  <div className="community-goal">
                    <h4>🤝 Help Our Community</h4>
                    <p>Share AI Job Chommie with friends to unlock job search for everyone!</p>
                    
                    <button 
                      className="btn btn-outline community-share-btn"
                      onClick={handleShare}
                    >
                      <span className="share-icon">📱</span>
                      Share with Friends
                    </button>
                    
                    <div className="referral-rewards">
                      <h5>Referral Rewards:</h5>
                      <div className="rewards-grid">
                        <div className="reward-item">
                          <span className="reward-icon">🎁</span>
                          <small>1 referral = 1 week free</small>
                        </div>
                        <div className="reward-item">
                          <span className="reward-icon">💎</span>
                          <small>5 referrals = 1 month free</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumGate;

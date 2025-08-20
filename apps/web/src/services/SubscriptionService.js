/**
 *  SUBSCRIPTION SERVICE - PREMIUM JOB SEARCH GATING
 * Manages premium subscriptions and feature access for AI Job Chommie
 */

class SubscriptionService {
  constructor() {
    this.currentUser = null;
    this.subscriptionData = null;
    this.featureAccess = {};
    this.subscriberCount = 0;
    this.targetSubscribers = 10000;
    this.apiCallsRemaining = 250; // SerAPI monthly limit
    this.init();
  }

  /**
   *  Initialize subscription service
   */
  async init() {
    try {
      await this.loadUserSubscription();
      await this.loadSubscriberCount();
      this.setupFeatureAccess();
      this.startPeriodicUpdates();
    } catch (error) {
      console.error('Subscription service initialization failed:', error);
    }
  }

  /**
   *  Load current subscriber count and progress
   */
  async loadSubscriberCount() {
    try {
      const response = await fetch('/api/subscriptions/stats', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        this.subscriberCount = data.totalSubscribers || 0;
        this.apiCallsRemaining = data.apiCallsRemaining || 250;
      } else {
        // Fallback data for development
        this.subscriberCount = Math.floor(Math.random() * 1000) + 500; // Simulate growth
        this.apiCallsRemaining = 180; // Simulate usage
      }
    } catch (error) {
      console.error('Failed to load subscriber count:', error);
      this.subscriberCount = 750; // Fallback
    }
  }

  /**
   *  Load current user's subscription data
   */
  async loadUserSubscription() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/subscriptions/my-subscription', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        this.subscriptionData = data.subscription;
        this.currentUser = data.user;
      } else {
        // Fallback for development - simulate free user
        this.subscriptionData = {
          plan: 'free',
          status: 'active',
          features: ['basic_cv_analysis', 'career_advice', 'job_alerts'],
          limits: {
            job_searches: 0,
            cv_analyses: 3,
            career_consultations: 1
          }
        };
      }
    } catch (error) {
      console.error('Failed to load user subscription:', error);
      this.subscriptionData = null;
    }
  }

  /**
   *  Setup feature access based on subscription and subscriber count
   */
  setupFeatureAccess() {
    const isPremium = this.isPremiumUser();
    const hasReachedTarget = this.subscriberCount >= this.targetSubscribers;
    const hasApiCalls = this.apiCallsRemaining > 0;

    this.featureAccess = {
      // Core features available to everyone
      basic_features: {
        cv_upload: true,
        career_advice: true,
        profile_creation: true,
        notifications: true,
        social_features: true
      },

      // Premium-only features
      premium_features: {
        advanced_cv_analysis: isPremium,
        unlimited_career_consultations: isPremium,
        priority_support: isPremium,
        ad_free_experience: isPremium,
        advanced_analytics: isPremium,
        job_application_tracking: isPremium,
        salary_insights: isPremium,
        interview_prep: isPremium
      },

      // Job search features (gated by subscription count OR premium status)
      job_search_features: {
        basic_job_search: hasReachedTarget || isPremium,
        advanced_job_filtering: (hasReachedTarget && hasApiCalls) || isPremium,
        real_time_job_alerts: (hasReachedTarget && hasApiCalls) || isPremium,
        ai_job_matching: (hasReachedTarget && hasApiCalls) || isPremium,
        salary_comparison: isPremium,
        company_insights: isPremium,
        application_tracking: isPremium
      },

      // API usage limits
      api_limits: {
        job_searches_per_day: isPremium ? 100 : (hasReachedTarget ? 10 : 0),
        cv_analyses_per_month: isPremium ? -1 : 3, // -1 = unlimited
        career_consultations_per_month: isPremium ? -1 : 1
      }
    };
  }

  /**
   *  Check if user has premium subscription
   */
  isPremiumUser() {
    if (!this.subscriptionData) return false;
    
    const premiumPlans = ['basic', 'premium', 'pro', 'enterprise', 'lifetime'];
    return premiumPlans.includes(this.subscriptionData.plan) && 
           this.subscriptionData.status === 'active';
  }

  /**
   *  Get progress towards 10k subscribers
   */
  getSubscriberProgress() {
    const progress = Math.min((this.subscriberCount / this.targetSubscribers) * 100, 100);
    const remaining = Math.max(this.targetSubscribers - this.subscriberCount, 0);
    
    return {
      current: this.subscriberCount,
      target: this.targetSubscribers,
      progress: Math.round(progress),
      remaining,
      percentage: `${Math.round(progress)}%`,
      isUnlocked: this.subscriberCount >= this.targetSubscribers
    };
  }

  /**
   *  Check if specific feature is accessible
   */
  hasFeatureAccess(category, feature) {
    return this.featureAccess[category]?.[feature] || false;
  }

  /**
   *  Get feature restriction message
   */
  getRestrictionMessage(category, feature) {
    const isPremium = this.isPremiumUser();
    const progress = this.getSubscriberProgress();

    if (category === 'job_search_features') {
      if (isPremium) {
        return null; // Premium users have full access
      }
      
      if (progress.isUnlocked) {
        return {
          type: 'api_limit',
          title: ' Job Search Unlocked!',
          message: `Amazing! We've reached ${this.targetSubscribers.toLocaleString()} subscribers! Job search is now available to everyone.`,
          action: null
        };
      }
      
      return {
        type: 'subscriber_gate',
        title: ' Almost There!',
        message: `Job search unlocks at ${this.targetSubscribers.toLocaleString()} subscribers. We're at ${this.subscriberCount.toLocaleString()} (${progress.percentage})`,
        action: 'upgrade_or_share',
        cta: 'Get Premium Access Now',
        secondary_cta: 'Help Us Reach 10k',
        remaining: progress.remaining
      };
    }

    if (category === 'premium_features') {
      return {
        type: 'premium_required',
        title: ' Premium Feature',
        message: 'This feature is available with a Premium subscription.',
        action: 'upgrade',
        cta: 'Upgrade to Premium',
        benefits: this.getPremiumBenefits()
      };
    }

    return {
      type: 'unknown',
      title: 'Feature Unavailable',
      message: 'This feature is currently not available.',
      action: null
    };
  }

  /**
   *  Get premium subscription benefits
   */
  getPremiumBenefits() {
    return [
      {
        icon: '',
        title: 'Unlimited Job Search',
        description: 'Search jobs instantly without waiting for 10k subscribers'
      },
      {
        icon: '',
        title: 'Advanced AI Features',
        description: 'Unlimited CV analysis, career consultations, and AI job matching'
      },
      {
        icon: '',
        title: 'Premium Analytics',
        description: 'Track your applications, salary insights, and career progress'
      },
      {
        icon: '',
        title: 'Priority Support',
        description: 'Get help when you need it with premium customer support'
      },
      {
        icon: '',
        title: 'Ad-Free Experience',
        description: 'Enjoy AI Job Chommie without any advertisements'
      },
      {
        icon: '',
        title: 'Interview Prep Tools',
        description: 'AI-powered interview preparation and company insights'
      }
    ];
  }

  /**
   *  Get subscription plans with pricing
   */
  getSubscriptionPlans() {
    return [
      {
        id: 'free',
        name: 'Free',
        price: 'R0',
        period: 'forever',
        features: [
          'Basic CV analysis (3/month)',
          'Career advice chat',
          'Job alerts (when we reach 10k)',
          'Social networking features'
        ],
        limitations: [
          'No job search until 10k subscribers',
          'Limited CV analyses',
          'Ads included'
        ],
        cta: 'Current Plan',
        popular: false
      },
      {
        id: 'basic',
        name: 'Basic',
        price: 'R8',
        period: 'month',
        features: [
          'Basic CV analysis (unlimited)',
          'Career advice chat',
          'Job alerts (when we reach 10k)',
          'Social networking features',
          'Email support'
        ],
        limitations: [
          'No job search until 10k subscribers',
          'Ads included'
        ],
        cta: 'Start 3-Day Trial',
        popular: false,
        trial: '3 days free'
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 'R17',
        period: 'month',
        features: [
          ' Instant job search access',
          'Unlimited CV analysis',
          'Advanced AI job matching',
          'Priority customer support',
          'Ad-free experience',
          'Interview prep tools',
          'Salary insights',
          'Application tracking'
        ],
        limitations: [],
        cta: 'Upgrade Now',
        popular: true
      }
    ];
  }

  /**
   *  Create compelling upgrade prompts
   */
  createUpgradePrompt(context = 'general') {
    const progress = this.getSubscriberProgress();
    
    const prompts = {
      job_search: {
        title: ' Unlock Job Search Today!',
        subtitle: `Don't wait for ${progress.remaining.toLocaleString()} more subscribers`,
        message: 'Get instant access to thousands of SA jobs with Premium',
        urgency: 'Start with Basic plan R8/month or Premium R17/month',
        benefits: [
          'Search jobs right now',
          'AI-powered job matching',
          'Real-time job alerts',
          'Salary insights'
        ],
        cta: 'Get Premium Access',
        secondary: 'Or help us reach 10k subscribers'
      },
      
      cv_analysis: {
        title: ' Unlimited CV Analysis',
        subtitle: 'You\'ve used your free analyses',
        message: 'Get unlimited CV improvements with Premium',
        benefits: [
          'Unlimited CV scans',
          'Advanced AI suggestions',
          'ATS optimization tips',
          'Interview preparation'
        ],
        cta: 'Upgrade Now',
        secondary: null
      },

      general: {
        title: ' Unlock Your Career Potential',
        subtitle: 'Join thousands of SA professionals',
        message: 'Get premium career tools designed for South Africa',
        benefits: [
          'Instant job search access',
          'Unlimited AI features',
          'Priority support',
          'Ad-free experience'
        ],
        cta: 'Start Free Trial',
        secondary: 'Or share to help unlock for everyone'
      }
    };

    return prompts[context] || prompts.general;
  }

  /**
   *  Handle subscription upgrade
   */
  async upgradeSubscription(planId, paymentMethod = 'paystack') {
    try {
      const response = await fetch('/api/subscriptions/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          planId,
          paymentMethod,
          currency: 'ZAR'
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Redirect to payment gateway
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl;
        }
        
        return { success: true, data };
      } else {
        throw new Error('Failed to initiate subscription upgrade');
      }
    } catch (error) {
      console.error('Subscription upgrade failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   *  Track API usage for SerAPI limits
   */
  trackApiUsage(endpoint, cost = 1) {
    this.apiCallsRemaining = Math.max(0, this.apiCallsRemaining - cost);
    
    // Store usage locally for offline tracking
    const usage = JSON.parse(localStorage.getItem('api_usage') || '{}');
    const today = new Date().toISOString().split('T')[0];
    
    if (!usage[today]) usage[today] = {};
    if (!usage[today][endpoint]) usage[today][endpoint] = 0;
    
    usage[today][endpoint] += cost;
    localStorage.setItem('api_usage', JSON.stringify(usage));

    // Trigger warning if running low
    if (this.apiCallsRemaining <= 50) {
      this.triggerApiLimitWarning();
    }
  }

  /**
   *  Trigger API limit warning
   */
  triggerApiLimitWarning() {
    const event = new CustomEvent('api_limit_warning', {
      detail: {
        remaining: this.apiCallsRemaining,
        message: `Only ${this.apiCallsRemaining} API calls remaining this month!`,
        suggestion: 'Consider upgrading to Premium for unlimited access'
      }
    });
    
    window.dispatchEvent(event);
  }

  /**
   *  Start periodic updates
   */
  startPeriodicUpdates() {
    // Update subscriber count every 5 minutes
    setInterval(() => {
      this.loadSubscriberCount();
      this.setupFeatureAccess();
    }, 5 * 60 * 1000);

    // Update subscription status every hour
    setInterval(() => {
      this.loadUserSubscription();
    }, 60 * 60 * 1000);
  }

  /**
   *  Get mobile-optimized subscription UI data
   */
  getMobileSubscriptionData() {
    const progress = this.getSubscriberProgress();
    const isPremium = this.isPremiumUser();
    
    return {
      user: {
        isPremium,
        plan: this.subscriptionData?.plan || 'free',
        features: this.featureAccess
      },
      progress: {
        ...progress,
        message: progress.isUnlocked 
          ? ' Job search unlocked for everyone!' 
          : `${progress.remaining.toLocaleString()} more subscribers needed`
      },
      api: {
        remaining: this.apiCallsRemaining,
        percentage: Math.round((this.apiCallsRemaining / 250) * 100),
        warning: this.apiCallsRemaining <= 50
      },
      upgrade: this.createUpgradePrompt(),
      plans: this.getSubscriptionPlans()
    };
  }

  /**
   *  Generate referral incentives for reaching 10k
   */
  getReferralIncentives() {
    return {
      individual: [
        { referrals: 1, reward: '1 week Premium free', icon: '' },
        { referrals: 5, reward: '1 month Premium free', icon: '' },
        { referrals: 10, reward: '3 months Premium free', icon: '' },
        { referrals: 25, reward: '1 year Premium free', icon: '' }
      ],
      community: [
        { milestone: 5000, reward: 'Basic job search preview', progress: (this.subscriberCount / 5000) * 100 },
        { milestone: 7500, reward: 'Advanced AI features for all', progress: (this.subscriberCount / 7500) * 100 },
        { milestone: 10000, reward: 'Full job search unlock!', progress: (this.subscriberCount / 10000) * 100 }
      ]
    };
  }
}

// Export singleton instance
export default new SubscriptionService();

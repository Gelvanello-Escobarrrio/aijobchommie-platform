import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  MetallicCard, 
  MetallicButton, 
  SectionHeading, 
  MetallicBadge,
  MetallicToggle,
  AmbientLighting 
} from '../components/ui/MetallicComponents';
import Navigation from '../components/Navigation';
import { 
  CheckCircle, 
  X, 
  Zap, 
  Crown, 
  Building, 
  Star,
  Sparkles,
  Target,
  Shield,
  Users,
  TrendingUp,
  Clock,
  MessageSquare,
  Database,
  Cpu,
  Globe,
  Lock,
  Award,
  Rocket
} from 'lucide-react';

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Pricing data
  const plans = [
    {
      id: 'free',
      name: 'Basic',
      description: 'Perfect for getting started with AI job matching',
      monthlyPrice: 0,
      yearlyPrice: 0,
      badge: { text: 'Forever Free', variant: 'muted' as const },
      popular: false,
      features: [
        { text: '5 AI job matches per day', included: true },
        { text: 'Basic profile setup', included: true },
        { text: 'Email notifications', included: true },
        { text: 'Community support', included: true },
        { text: 'Advanced analytics', included: false },
        { text: 'Priority support', included: false },
        { text: 'Unlimited applications', included: false },
        { text: 'Custom integrations', included: false }
      ],
      ctaText: 'Get Started Free',
      ctaVariant: 'outline' as const,
      icon: <Zap className="w-6 h-6" />
    },
    {
      id: 'pro',
      name: 'Professional',
      description: 'Ideal for serious job seekers who want unlimited access',
      monthlyPrice: 149,
      yearlyPrice: 1290, // ~15% discount
      badge: { text: 'Most Popular', variant: 'tech' as const },
      popular: true,
      features: [
        { text: 'Unlimited AI job matches', included: true },
        { text: 'Advanced profile analytics', included: true },
        { text: 'Priority customer support', included: true },
        { text: 'Application tracking dashboard', included: true },
        { text: 'Interview preparation tools', included: true },
        { text: 'Salary insights & negotiation tips', included: true },
        { text: 'Premium job alerts', included: true },
        { text: 'Custom integrations', included: false }
      ],
      ctaText: 'Start Free Trial',
      ctaVariant: 'tech' as const,
      icon: <Crown className="w-6 h-6" />
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For organizations and recruiters who need advanced features',
      monthlyPrice: 499,
      yearlyPrice: 4990,
      badge: { text: 'Full Power', variant: 'chrome' as const },
      popular: false,
      features: [
        { text: 'Everything in Professional', included: true },
        { text: 'Team management dashboard', included: true },
        { text: 'Custom API integrations', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'Advanced reporting & analytics', included: true },
        { text: 'White-label branding options', included: true },
        { text: 'SLA guarantee (99.9% uptime)', included: true },
        { text: 'Custom feature development', included: true }
      ],
      ctaText: 'Contact Sales',
      ctaVariant: 'secondary' as const,
      icon: <Building className="w-6 h-6" />
    }
  ];

  // Features comparison
  const comparisonFeatures = [
    {
      category: 'Core Features',
      features: [
        { name: 'AI Job Matching', basic: '5/day', pro: 'Unlimited', enterprise: 'Unlimited' },
        { name: 'Profile Setup', basic: 'Basic', pro: 'Advanced', enterprise: 'Custom' },
        { name: 'Application Tracking', basic: '❌', pro: '✅', enterprise: '✅' },
        { name: 'Interview Prep', basic: '❌', pro: '✅', enterprise: '✅' },
      ]
    },
    {
      category: 'Analytics & Insights',
      features: [
        { name: 'Profile Analytics', basic: '❌', pro: '✅', enterprise: '✅' },
        { name: 'Salary Insights', basic: '❌', pro: '✅', enterprise: '✅' },
        { name: 'Market Trends', basic: '❌', pro: 'Basic', enterprise: 'Advanced' },
        { name: 'Custom Reports', basic: '❌', pro: '❌', enterprise: '✅' },
      ]
    },
    {
      category: 'Support & Services',
      features: [
        { name: 'Support Level', basic: 'Community', pro: 'Priority', enterprise: 'Dedicated' },
        { name: 'Response Time', basic: '48-72hrs', pro: '12-24hrs', enterprise: '1-4hrs' },
        { name: 'Account Manager', basic: '❌', pro: '❌', enterprise: '✅' },
        { name: 'Custom Training', basic: '❌', pro: '❌', enterprise: '✅' },
      ]
    }
  ];

  // FAQ specific to pricing
  const pricingFAQ = [
    {
      question: "Can I change plans anytime?",
      answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges."
    },
    {
      question: "Is there a free trial for paid plans?",
      answer: "Absolutely! All paid plans come with a 14-day free trial. No credit card required to start."
    },
    {
      question: "What happens if I cancel?",
      answer: "You can cancel anytime. Your plan remains active until the end of your billing period, and you keep access to all features."
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment in full."
    },
    {
      question: "Are there any setup fees?",
      answer: "No setup fees ever. The price you see is exactly what you pay, with no hidden costs or surprise charges."
    },
    {
      question: "How secure is my data?",
      answer: "We use bank-level encryption and comply with international security standards. Your data is always protected and never shared."
    }
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    
    if (planId === 'free') {
      navigate('/welcome');
    } else if (planId === 'enterprise') {
      navigate('/contact');
    } else {
      // Navigate to checkout/registration
      navigate('/welcome', { state: { selectedPlan: planId } });
    }
  };

  const getPrice = (plan: any) => {
    const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
    if (price === 0) return 'Free';
    
    const displayPrice = isYearly ? Math.floor(price / 12) : price;
    return `R${displayPrice}`;
  };

  const getSavings = (plan: any) => {
    if (plan.yearlyPrice === 0) return null;
    const monthlyCost = plan.monthlyPrice * 12;
    const savings = monthlyCost - plan.yearlyPrice;
    const percentage = Math.round((savings / monthlyCost) * 100);
    return percentage;
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary relative overflow-hidden">
      {/* Ambient Lighting */}
      <AmbientLighting />
      
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <MetallicBadge variant="tech" animated className="mb-6">
              💎 Premium AI Technology
            </MetallicBadge>
            
            <h1 className="text-5xl md:text-7xl font-heading font-black text-chrome mb-6">
              Choose Your
              <br />
              <span className="bg-gradient-tech bg-clip-text text-transparent">
                Success Plan
              </span>
            </h1>
            
            <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
              Unlock the full potential of AI-powered job searching. Every plan includes our 
              revolutionary matching technology designed specifically for South African professionals.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span className={`text-sm font-medium ${!isYearly ? 'text-tech-cyan' : 'text-text-secondary'}`}>
                Monthly
              </span>
              
              <MetallicToggle
                checked={isYearly}
                onChange={setIsYearly}
              />
              
              <span className={`text-sm font-medium ${isYearly ? 'text-tech-cyan' : 'text-text-secondary'}`}>
                Yearly
              </span>
              
              {isYearly && (
                <MetallicBadge variant="tech" size="sm" animated>
                  Save up to 15%
                </MetallicBadge>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className="relative"
              >
                <MetallicCard
                  className={`text-center h-full relative ${
                    plan.popular ? 'border-glow scale-105' : ''
                  }`}
                  glow={plan.popular ? 'intense' : 'subtle'}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <MetallicBadge variant={plan.badge.variant} animated>
                        <Star className="w-3 h-3 mr-1" />
                        {plan.badge.text}
                      </MetallicBadge>
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="mb-8">
                    <div className="flex items-center justify-center mb-4">
                      <div className="text-tech-cyan">{plan.icon}</div>
                    </div>
                    
                    {!plan.popular && (
                      <MetallicBadge variant={plan.badge.variant} className="mb-4">
                        {plan.badge.text}
                      </MetallicBadge>
                    )}
                    
                    <h3 className="text-2xl font-heading font-bold text-chrome mb-2">
                      {plan.name}
                    </h3>
                    
                    <p className="text-text-secondary text-sm mb-6">
                      {plan.description}
                    </p>

                    {/* Price Display */}
                    <div className="mb-6">
                      <div className="flex items-baseline justify-center mb-2">
                        <span className="text-5xl font-heading font-black text-chrome">
                          {getPrice(plan)}
                        </span>
                        {plan.monthlyPrice > 0 && (
                          <span className="text-text-tertiary text-lg ml-2">
                            /{isYearly ? 'month' : 'month'}
                          </span>
                        )}
                      </div>
                      
                      {isYearly && plan.yearlyPrice > 0 && (
                        <div className="text-sm text-text-tertiary">
                          <span className="line-through">R{plan.monthlyPrice * 12}/year</span>
                          <span className="text-state-success ml-2 font-medium">
                            Save {getSavings(plan)}%
                          </span>
                        </div>
                      )}
                      
                      {plan.monthlyPrice === 0 && (
                        <div className="text-sm text-tech-cyan font-medium">
                          No credit card required
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="mb-8">
                    <ul className="space-y-3 text-left">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          className="flex items-center"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (index * 0.1) + (featureIndex * 0.05) }}
                        >
                          {feature.included ? (
                            <CheckCircle className="w-5 h-5 text-state-success mr-3 flex-shrink-0" />
                          ) : (
                            <X className="w-5 h-5 text-text-muted mr-3 flex-shrink-0" />
                          )}
                          <span className={`text-sm ${feature.included ? 'text-text-secondary' : 'text-text-muted'}`}>
                            {feature.text}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <MetallicButton
                    variant={plan.ctaVariant}
                    size="lg"
                    fullWidth
                    onClick={() => handlePlanSelect(plan.id)}
                    className="btn-hover-shine"
                    glow={plan.popular}
                  >
                    {plan.ctaText}
                  </MetallicButton>

                  {/* Free Trial Note */}
                  {plan.monthlyPrice > 0 && (
                    <p className="text-xs text-text-tertiary mt-4">
                      14-day free trial • Cancel anytime
                    </p>
                  )}
                </MetallicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-20 bg-gradient-to-b from-bg-secondary to-transparent">
        <div className="container mx-auto px-6">
          <SectionHeading
            title="Detailed Feature Comparison"
            subtitle="Compare all features across our plans to find the perfect fit for your career goals."
            align="center"
          />

          <div className="max-w-6xl mx-auto">
            <MetallicCard className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-light">
                      <th className="text-left py-4 px-6 text-text-secondary font-heading font-semibold">
                        Feature Category
                      </th>
                      <th className="text-center py-4 px-6 text-text-secondary font-heading font-semibold">
                        Basic
                      </th>
                      <th className="text-center py-4 px-6 text-tech-cyan font-heading font-semibold">
                        Professional
                        <MetallicBadge variant="tech" size="sm" className="ml-2">Popular</MetallicBadge>
                      </th>
                      <th className="text-center py-4 px-6 text-text-secondary font-heading font-semibold">
                        Enterprise
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((category) => (
                      <React.Fragment key={category.category}>
                        <tr>
                          <td 
                            colSpan={4} 
                            className="py-4 px-6 bg-void-shadow text-chrome font-heading font-bold text-sm uppercase tracking-wider"
                          >
                            {category.category}
                          </td>
                        </tr>
                        {category.features.map((feature, index) => (
                          <tr key={index} className="border-b border-border-light/30">
                            <td className="py-3 px-6 text-text-secondary">
                              {feature.name}
                            </td>
                            <td className="py-3 px-6 text-center text-text-tertiary">
                              {feature.basic}
                            </td>
                            <td className="py-3 px-6 text-center text-tech-cyan font-medium">
                              {feature.pro}
                            </td>
                            <td className="py-3 px-6 text-center text-text-secondary">
                              {feature.enterprise}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </MetallicCard>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold text-chrome mb-4">
              Trusted by South African Professionals
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Join thousands of professionals who've accelerated their careers with our AI-powered platform.
            </p>
          </div>

          <div className="grid md:grid-4 gap-8 max-w-4xl mx-auto">
            {[
              { icon: <Shield />, title: 'Bank-Level Security', desc: 'Enterprise-grade encryption' },
              { icon: <Award />, title: 'Industry Leading', desc: '95% success rate' },
              { icon: <Users />, title: '5,000+ Users', desc: 'Growing community' },
              { icon: <Globe />, title: 'Local Expertise', desc: 'Built for South Africa' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-tech-cyan text-3xl mb-3 flex justify-center">
                  {item.icon}
                </div>
                <h3 className="font-heading font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-text-tertiary">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-bg-secondary">
        <div className="container mx-auto px-6">
          <SectionHeading
            title="Pricing Questions"
            subtitle="Everything you need to know about our pricing and plans."
            align="center"
          />

          <div className="max-w-3xl mx-auto">
            <div className="grid gap-4">
              {pricingFAQ.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <MetallicCard>
                    <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer list-none">
                        <h3 className="font-heading font-semibold text-lg pr-4">
                          {item.question}
                        </h3>
                        <motion.div
                          className="text-tech-cyan"
                          initial={false}
                          animate={{ rotate: 0 }}
                          whileHover={{ rotate: 180 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Sparkles className="w-5 h-5" />
                        </motion.div>
                      </summary>
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-border-light"
                      >
                        <p className="text-text-secondary leading-relaxed">
                          {item.answer}
                        </p>
                      </motion.div>
                    </details>
                  </MetallicCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-heading font-black text-chrome mb-6">
              Start Your Success Story Today
            </h2>
            
            <p className="text-xl text-text-secondary mb-8">
              Join the AI revolution in job searching. Your dream career is just one click away.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <MetallicButton 
                variant="tech" 
                size="lg"
                onClick={() => handlePlanSelect('pro')}
                icon={<Rocket />}
                iconPosition="right"
                className="min-w-56 btn-hover-shine"
              >
                Start Free Trial
              </MetallicButton>
              
              <MetallicButton 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/contact')}
                icon={<MessageSquare />}
                className="min-w-56"
              >
                Talk to Sales
              </MetallicButton>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-6 mt-8 text-sm text-text-tertiary">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-state-success" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-state-success" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-state-success" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-state-success" />
                <span>30-day money back</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom Trust Section */}
      <section className="py-16 bg-gradient-to-t from-bg-secondary to-transparent">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex items-center space-x-2 text-text-tertiary">
              <Lock className="w-5 h-5" />
              <span className="text-sm">Secure payment processing</span>
            </div>
            <div className="flex items-center space-x-2 text-text-tertiary">
              <Shield className="w-5 h-5" />
              <span className="text-sm">ISO 27001 certified</span>
            </div>
            <div className="flex items-center space-x-2 text-text-tertiary">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">99.9% uptime guarantee</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;

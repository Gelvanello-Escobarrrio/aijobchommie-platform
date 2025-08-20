import { motion } from 'framer-motion';
import {
  Brain,
  Check,
  CreditCard,
  Shield,
  Star,
  Target,
  X,
  Zap
} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  AmbientLighting,
  ChromeSeparator,
  MetallicBadge,
  MetallicButton,
  MetallicCard,
  SectionHeading
} from '../components/ui/MetallicComponents';

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Free Explorer",
      description: "Perfect for getting started with intelligent job matching",
      price: { monthly: 0, annual: 0 },
      badge: null,
      features: [
        { text: "5 smart job matches per day", included: true },
        { text: "Basic profile setup", included: true },
        { text: "Email notifications", included: true },
        { text: "Standard job search", included: true },
        { text: "Community support", included: true },
        { text: "Resume upload", included: true },
        { text: "Basic analytics", included: false },
        { text: "Priority support", included: false },
        { text: "Advanced matching", included: false },
        { text: "Application tracking", included: false }
      ],
      buttonText: "Get Started Free",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Professional",
      description: "Advanced features for serious job seekers",
      price: { monthly: 49, annual: 39 },
      badge: "Most Popular",
      features: [
        { text: "Unlimited smart job matches", included: true },
        { text: "Advanced profile optimization", included: true },
        { text: "Priority email & SMS alerts", included: true },
        { text: "Intelligent application tracking", included: true },
        { text: "Career insights dashboard", included: true },
        { text: "Professional CV analysis", included: true },
        { text: "Interview preparation tips", included: true },
        { text: "Priority support", included: true },
        { text: "Advanced matching algorithms", included: true },
        { text: "Salary negotiation guidance", included: true }
      ],
      buttonText: "Start Professional",
      buttonVariant: "tech" as const,
      popular: true
    },
    {
      name: "Enterprise",
      description: "For organizations and power users",
      price: { monthly: 99, annual: 79 },
      badge: "Premium",
      features: [
        { text: "Everything in Professional", included: true },
        { text: "Dedicated account manager", included: true },
        { text: "Custom integration support", included: true },
        { text: "Advanced analytics dashboard", included: true },
        { text: "WhatsApp job alerts", included: true },
        { text: "24/7 priority support", included: true },
        { text: "API access", included: true },
        { text: "Custom reporting", included: true },
        { text: "Team collaboration tools", included: true },
        { text: "Enterprise security features", included: true }
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
      popular: false
    }
  ];

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Intelligent Matching",
      description: "Advanced algorithms match you with the perfect opportunities based on your skills and preferences."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Precision Targeting",
      description: "Our platform understands South African market nuances for laser-focused recommendations."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Get matched with relevant jobs in seconds with intelligent caching and optimization."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "Bank-level encryption protects your data with enterprise-grade security measures."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Software Developer",
      company: "Cape Town Tech",
      content: "Job Chommie helped me find my dream job in just 2 weeks. The intelligent matching was incredibly accurate.",
      rating: 5
    },
    {
      name: "David Nkomo",
      role: "Marketing Manager",
      company: "Johannesburg Agency",
      content: "The platform's insights helped me negotiate a 30% salary increase. Professional service throughout.",
      rating: 5
    },
    {
      name: "Lisa van der Merwe",
      role: "Financial Analyst",
      company: "Durban Finance",
      content: "Outstanding support and the most intuitive job platform I've used. Highly recommended for professionals.",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "How does the intelligent matching work?",
      answer: "Our advanced algorithms analyze your skills, experience, preferences, and career goals to match you with the most suitable job opportunities. The system learns from your interactions to improve recommendations over time."
    },
    {
      question: "Can I change or cancel my subscription?",
      answer: "Yes, you can upgrade, downgrade, or cancel your subscription at any time. Changes take effect at the next billing cycle, and we offer pro-rated refunds for downgrades."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, and bank transfers through our secure Paystack integration. All payments are processed securely with bank-level encryption."
    },
    {
      question: "Do you offer support for job seekers?",
      answer: "Yes! All users get community support, while Professional and Enterprise subscribers receive priority support including career coaching and application assistance."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use enterprise-grade encryption and security measures to protect your personal information. Your data is never shared with third parties without your explicit consent."
    },
    {
      question: "Can I try before I buy?",
      answer: "Yes! Our Free Explorer plan gives you access to core features. You can also start a 14-day free trial of any paid plan to experience the full power of our platform."
    }
  ];

  return (
    <div className="min-h-screen bg-void-black">
      <AmbientLighting />

      {/* Hero Section */}
      <section className="hero-responsive flex items-center justify-center relative">
        <div className="responsive-container text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <MetallicBadge variant="tech" animated>
              <CreditCard className="w-4 h-4 mr-2" />
              Professional Pricing Plans
            </MetallicBadge>
          </motion.div>

          <motion.h1
            className="text-responsive-3xl font-heading font-black mb-6 text-chrome leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Choose Your
            <br />
            <span className="bg-gradient-tech bg-clip-text text-transparent">
              Professional Plan
            </span>
          </motion.h1>

          <motion.p
            className="text-responsive-lg text-text-secondary max-w-3xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Accelerate your career with intelligent job matching technology. Choose the plan that fits your
            professional goals and unlock the full potential of South Africa's most advanced career platform.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            className="flex items-center justify-center space-x-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <span className={`text-sm font-medium ${!isAnnual ? 'text-tech-cyan' : 'text-text-tertiary'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual ? 'bg-tech-cyan' : 'bg-void-shadow'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-chrome transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-tech-cyan' : 'text-text-tertiary'}`}>
              Annual
            </span>
            {isAnnual && (
              <MetallicBadge variant="tech" size="sm">
                Save 20%
              </MetallicBadge>
            )}
          </motion.div>
        </div>
      </section>

      <ChromeSeparator />

      {/* Pricing Plans */}
      <section className="section-responsive">
        <div className="responsive-container">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <MetallicCard className={`p-8 h-full relative ${plan.popular ? 'border-tech-cyan border-2' : ''}`}>
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <MetallicBadge variant="tech" animated>
                        {plan.badge}
                      </MetallicBadge>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-heading font-bold text-chrome mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-text-secondary mb-6">
                      {plan.description}
                    </p>

                    <div className="mb-6">
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-tech-cyan">
                          R{isAnnual ? plan.price.annual : plan.price.monthly}
                        </span>
                        <span className="text-text-tertiary ml-2">
                          {plan.price.monthly > 0 ? '/month' : ''}
                        </span>
                      </div>
                      {isAnnual && plan.price.monthly > 0 && (
                        <p className="text-sm text-text-tertiary mt-2">
                          Billed annually (R{plan.price.annual * 12})
                        </p>
                      )}
                    </div>

                    <MetallicButton
                      variant={plan.buttonVariant}
                      size="lg"
                      fullWidth
                      onClick={() => navigate('/checkout')}
                    >
                      {plan.buttonText}
                    </MetallicButton>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-text-primary">What's included:</h4>
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-tech-cyan flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-text-tertiary flex-shrink-0 mt-0.5" />
                        )}
                        <span className={`text-sm ${feature.included ? 'text-text-secondary' : 'text-text-tertiary'}`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </MetallicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ChromeSeparator />

      {/* Features Section */}
      <section className="section-responsive">
        <div className="responsive-container">
          <SectionHeading
            title="Why Choose Job Chommie?"
            subtitle="Advanced features designed for South African professionals"
            align="center"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <MetallicCard className="p-6 text-center h-full">
                  <div className="w-12 h-12 bg-gradient-tech rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-void-black">{feature.icon}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-chrome mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {feature.description}
                  </p>
                </MetallicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ChromeSeparator />

      {/* Testimonials */}
      <section className="section-responsive">
        <div className="responsive-container">
          <SectionHeading
            title="What Our Users Say"
            subtitle="Success stories from professionals across South Africa"
            align="center"
          />

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <MetallicCard className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-tech-cyan" />
                    ))}
                  </div>
                  <p className="text-text-secondary mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="border-t border-border-light pt-4">
                    <div className="font-semibold text-chrome">{testimonial.name}</div>
                    <div className="text-sm text-text-tertiary">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </MetallicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ChromeSeparator />

      {/* FAQ Section */}
      <section className="section-responsive">
        <div className="responsive-container">
          <SectionHeading
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about our platform and pricing"
            align="center"
          />

          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <MetallicCard className="p-6">
                  <h3 className="text-lg font-semibold text-chrome mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {faq.answer}
                  </p>
                </MetallicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ChromeSeparator />

      {/* CTA Section */}
      <section className="section-responsive">
        <div className="responsive-container text-center">
          <MetallicCard className="p-12 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-responsive-2xl font-heading font-bold text-chrome mb-6">
                Ready to Accelerate Your Career?
              </h2>
              <p className="text-responsive-lg text-text-secondary mb-8 max-w-2xl mx-auto">
                Join thousands of South African professionals who have found their dream jobs
                through our intelligent platform. Start your journey today.
              </p>
              <div className="flex-responsive-col gap-4 justify-center">
                <MetallicButton
                  variant="tech"
                  size="lg"
                  onClick={() => navigate('/checkout')}
                >
                  Start Your Free Trial
                </MetallicButton>
                <MetallicButton
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/contact')}
                >
                  Contact Sales Team
                </MetallicButton>
              </div>

              {/* Attribution */}
              <div className="mt-8 pt-6 border-t border-border-light">
                <p className="text-xs text-text-tertiary">
                  Platform created by <span className="text-tech-cyan font-medium">Fernando Steyn</span> | © 2025 Job Chommie Professional Platform
                </p>
              </div>
            </motion.div>
          </MetallicCard>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;

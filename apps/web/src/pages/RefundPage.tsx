import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  Mail,
  Phone,
  Shield,
  Zap
} from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import {
  AmbientLighting,
  ChromeSeparator,
  MetallicBadge,
  MetallicButton,
  MetallicCard,
  SectionHeading
} from '../components/ui/MetallicComponents';

const RefundPage: React.FC = () => {
  const navigate = useNavigate();

  const refundSteps = [
    {
      step: "1",
      title: "Request Submitted",
      description: "Submit your refund request through our support portal or email",
      timeframe: "Within 30 days"
    },
    {
      step: "2",
      title: "Review Process",
      description: "Our team reviews your request and account history",
      timeframe: "1-2 business days"
    },
    {
      step: "3",
      title: "Refund Processed",
      description: "If approved, refund is processed to your original payment method",
      timeframe: "3-5 business days"
    },
    {
      step: "4",
      title: "Confirmation",
      description: "You receive confirmation email with transaction details",
      timeframe: "Same day"
    }
  ];

  const scenarios = [
    {
      icon: <CheckCircle />,
      title: "Full Refund Eligible",
      description: "Within 30 days, minimal usage, technical issues on our end",
      color: "state-success"
    },
    {
      icon: <AlertTriangle />,
      title: "Partial Refund",
      description: "Used service significantly but have valid concerns",
      color: "state-warning"
    },
    {
      icon: <Shield />,
      title: "Service Credit",
      description: "Alternative to cash refund for continued service improvements",
      color: "tech-cyan"
    }
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary relative overflow-hidden">
      {/* Ambient Lighting Effects */}
      <AmbientLighting />

      {/* Hero Section */}
      <section className="section-responsive flex items-center justify-center relative safe-area-top">
        <motion.div
          className="responsive-container text-center z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <MetallicBadge variant="tech" animated className="mb-8">
            <Shield className="w-4 h-4 mr-2" />
            Refund Policy
          </MetallicBadge>

          <h1 className="text-responsive-3xl font-heading font-black mb-6 text-chrome leading-none">
            30-Day Money
            <br />
            <span className="bg-gradient-tech bg-clip-text text-transparent">
              Back Guarantee
            </span>
          </h1>

          <p className="text-responsive-lg text-text-secondary max-w-4xl mx-auto mb-8 leading-relaxed">
            We're confident you'll love AI Job Chommie. If you're not completely satisfied
            within 30 days, we'll refund your money. No questions asked.
          </p>

          <div className="flex items-center justify-center space-x-6 text-text-tertiary text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>30-Day Window</span>
            </div>
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span>Full Refund Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>No Questions Asked</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Policy Overview */}
      <section className="section-responsive bg-gradient-to-b from-transparent to-bg-secondary">
        <div className="responsive-container">
          <SectionHeading
            title="Our Refund Promise"
            subtitle="Simple, fair, and transparent refund policy designed with you in mind."
            align="center"
          />

          <div className="grid-responsive-3 gap-8 max-w-5xl mx-auto">
            {scenarios.map((scenario, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <MetallicCard className="text-center h-full">
                  <div className={`text-4xl mb-4 text-${scenario.color}`}>
                    {scenario.icon}
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-3">{scenario.title}</h3>
                  <p className="text-text-secondary">{scenario.description}</p>
                </MetallicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Refund Process */}
      <section className="section-responsive">
        <div className="responsive-container">
          <SectionHeading
            title="How Refunds Work"
            subtitle="Our simple 4-step process ensures quick and hassle-free refunds."
            align="center"
          />

          <div className="max-w-4xl mx-auto">
            {refundSteps.map((step, index) => (
              <motion.div
                key={index}
                className="relative flex items-center mb-12 last:mb-0"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                {/* Timeline line */}
                {index < refundSteps.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-20 bg-gradient-to-b from-tech-cyan to-transparent" />
                )}

                {/* Step number */}
                <div className="w-12 h-12 bg-gradient-tech rounded-full flex items-center justify-center mr-6 z-10 text-void-black font-bold">
                  {step.step}
                </div>

                {/* Content */}
                <MetallicCard className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-heading font-bold">{step.title}</h3>
                    <MetallicBadge variant="chrome">{step.timeframe}</MetallicBadge>
                  </div>
                  <p className="text-text-secondary">{step.description}</p>
                </MetallicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Terms */}
      <section className="section-responsive bg-gradient-to-b from-bg-secondary to-transparent">
        <div className="responsive-container max-w-4xl mx-auto">

          {/* Eligibility */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <MetallicCard>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-tech rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-void-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">Refund Eligibility</h2>
                  <div className="space-y-4 text-text-secondary">
                    <p>
                      <strong>30-Day Window:</strong> Refund requests must be submitted within 30 days of your initial purchase or subscription start date.
                    </p>
                    <p>
                      <strong>Paid Plans Only:</strong> Refunds apply to our Professional and Premium Elite plans. Free accounts are not eligible for refunds.
                    </p>
                    <p>
                      <strong>First-Time Customers:</strong> Full refunds are primarily available for first-time customers. Repeat refund requests may be reviewed on a case-by-case basis.
                    </p>
                    <p>
                      <strong>Service Issues:</strong> If you experience technical difficulties or service disruptions caused by our platform, you're eligible for a full refund regardless of usage.
                    </p>
                  </div>
                </div>
              </div>
            </MetallicCard>
          </motion.div>

          {/* What's Covered */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <MetallicCard>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-chrome rounded-lg flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-6 h-6 text-void-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">What's Covered</h2>
                  <div className="space-y-4 text-text-secondary">
                    <div>
                      <strong>Full Refunds:</strong>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Unused subscriptions cancelled within 30 days</li>
                        <li>Technical issues preventing service access</li>
                        <li>Service doesn't meet advertised features</li>
                        <li>Billing errors or duplicate charges</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Partial Refunds:</strong>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Significant service disruptions during your billing period</li>
                        <li>Downgrade requests with valid reasoning</li>
                        <li>Prorated refunds for cancelled annual subscriptions</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </MetallicCard>
          </motion.div>

          {/* Exclusions */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <MetallicCard>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-tech rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-void-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">Refund Limitations</h2>
                  <div className="space-y-4 text-text-secondary">
                    <p>
                      <strong>Usage-Based Limitations:</strong> Heavy usage of our AI matching services may affect refund eligibility. We consider factors like number of applications submitted and profile views.
                    </p>
                    <p>
                      <strong>Policy Violations:</strong> Accounts suspended or terminated for violating our Terms of Service are not eligible for refunds.
                    </p>
                    <p>
                      <strong>Third-Party Services:</strong> We cannot refund payments made to third-party services accessed through our platform.
                    </p>
                    <p>
                      <strong>Processing Fees:</strong> Payment processing fees (typically 2-3%) may be deducted from refunds where applicable.
                    </p>
                  </div>
                </div>
              </div>
            </MetallicCard>
          </motion.div>

          {/* How to Request */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <MetallicCard>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-chrome rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-void-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">How to Request a Refund</h2>
                  <div className="space-y-4 text-text-secondary">
                    <div>
                      <strong>Required Information:</strong>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Your account email address</li>
                        <li>Order number or transaction ID</li>
                        <li>Reason for refund request</li>
                        <li>Date of purchase</li>
                        <li>Any relevant screenshots or documentation</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Contact Methods:</strong>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Email: refunds@aijobchommie.co.za</li>
                        <li>Support portal through your account dashboard</li>
                        <li>Phone: +27 (0) 21 XXX XXXX (business hours)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </MetallicCard>
          </motion.div>

          {/* Processing Times */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <MetallicCard>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-tech rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-void-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">Processing Timeframes</h2>
                  <div className="space-y-4 text-text-secondary">
                    <p>
                      <strong>Review Period:</strong> Most refund requests are reviewed within 1-2 business days of submission.
                    </p>
                    <p>
                      <strong>Processing Time:</strong> Approved refunds are processed within 3-5 business days to your original payment method.
                    </p>
                    <p>
                      <strong>Bank Processing:</strong> Depending on your bank, it may take an additional 1-3 business days for the refund to appear in your account.
                    </p>
                    <p>
                      <strong>International Payments:</strong> Refunds to international cards may take 5-10 business days due to currency conversion and bank processing times.
                    </p>
                  </div>
                </div>
              </div>
            </MetallicCard>
          </motion.div>

        </div>
      </section>

      {/* Contact Support */}
      <section className="section-responsive">
        <div className="responsive-container">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <MetallicCard glow="intense" className="p-12">
              <div className="w-20 h-20 bg-gradient-tech rounded-full flex items-center justify-center mx-auto mb-8">
                <Mail className="w-10 h-10 text-void-black" />
              </div>

              <h2 className="text-responsive-2xl font-heading font-black text-chrome mb-6">
                Need Help with a Refund?
              </h2>

              <p className="text-responsive-lg text-text-secondary mb-8">
                Our support team is here to help. Contact us for any questions about
                refunds, billing, or our refund policy.
              </p>

              <div className="grid-responsive-2 gap-6 max-w-2xl mx-auto mb-8">
                <div className="flex items-center justify-center space-x-3 text-text-secondary">
                  <Mail className="w-5 h-5 text-tech-cyan" />
                  <span>refunds@aijobchommie.co.za</span>
                </div>
                <div className="flex items-center justify-center space-x-3 text-text-secondary">
                  <Phone className="w-5 h-5 text-tech-cyan" />
                  <span>+27 (0) 21 XXX XXXX</span>
                </div>
              </div>

              <div className="flex-responsive-col gap-4 justify-center items-center">
                <MetallicButton
                  variant="tech"
                  size="lg"
                  onClick={() => navigate('/contact')}
                  icon={<Zap />}
                  iconPosition="right"
                >
                  Contact Support
                </MetallicButton>

                <MetallicButton
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/terms')}
                >
                  View Terms of Service
                </MetallicButton>
              </div>

              <div className="text-sm text-text-tertiary mt-6">
                Average response time: Under 24 hours • Available Monday-Friday, 8AM-6PM SAST
              </div>
            </MetallicCard>
          </motion.div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="section-responsive bg-gradient-to-t from-bg-secondary to-transparent">
        <div className="responsive-container">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-heading font-bold text-chrome mb-4">
              Our Commitment to You
            </h3>

            <p className="text-text-secondary leading-relaxed">
              At AI Job Chommie, we believe in the quality of our service and your satisfaction.
              Our refund policy reflects our commitment to providing value and ensuring every
              South African has access to the best AI-powered job search experience possible.
            </p>

            <div className="mt-6 flex justify-center">
              <MetallicBadge variant="tech" size="lg">
                <Calendar className="w-4 h-4 mr-2" />
                Last Updated: January 2024
              </MetallicBadge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Separator */}
      <ChromeSeparator className="my-8" />
    </div>
  );
};

export default RefundPage;

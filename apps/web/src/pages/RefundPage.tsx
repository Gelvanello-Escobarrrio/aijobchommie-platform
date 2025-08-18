import React from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import { 
  MetallicCard, 
  SectionHeading, 
  AmbientLighting,
  MetallicButton 
} from '../components/ui/MetallicComponents';
import { 
  RefreshCw, 
  Clock, 
  CreditCard, 
  CheckCircle, 
  AlertTriangle, 
  DollarSign,
  Calendar,
  Phone,
  Mail,
  Shield
} from 'lucide-react';

const RefundPage: React.FC = () => {
  const refundScenarios = [
    {
      title: "30-Day Money-Back Guarantee",
      description: "Full refund within 30 days of purchase if you're not satisfied with our Premium services.",
      icon: <Clock />,
      eligibility: ["Premium subscription purchased within last 30 days", "Less than 50 job applications submitted", "No evidence of service abuse"],
      timeline: "3-5 business days",
      action: "Automatic approval"
    },
    {
      title: "Service Disruption Refund",
      description: "Partial refund for service outages exceeding 24 hours in any billing period.",
      icon: <AlertTriangle />,
      eligibility: ["Documented service outage >24 hours", "Affected during your billing period", "Service disruption not due to maintenance"],
      timeline: "5-7 business days",
      action: "Prorated refund"
    },
    {
      title: "Technical Issue Refund",
      description: "Full or partial refund if technical issues prevent you from using our core features.",
      icon: <RefreshCw />,
      eligibility: ["Unresolved technical issue >14 days", "Core features unavailable", "Support team unable to resolve"],
      timeline: "7-10 business days",
      action: "Case-by-case review"
    },
    {
      title: "Billing Error Refund",
      description: "Immediate refund for incorrect charges, duplicate payments, or billing mistakes.",
      icon: <CreditCard />,
      eligibility: ["Documented billing error", "Unauthorized duplicate charge", "Incorrect subscription upgrade"],
      timeline: "1-3 business days",
      action: "Immediate processing"
    }
  ];

  const steps = [
    {
      step: "1",
      title: "Review Eligibility",
      description: "Check if your situation qualifies for a refund according to our policy.",
      icon: <CheckCircle />
    },
    {
      step: "2",
      title: "Submit Request",
      description: "Contact our support team with your refund request and relevant details.",
      icon: <Mail />
    },
    {
      step: "3",
      title: "Review Process",
      description: "Our team will review your request within 2 business days.",
      icon: <Clock />
    },
    {
      step: "4",
      title: "Refund Processing",
      description: "Approved refunds are processed within 3-10 business days depending on the scenario.",
      icon: <DollarSign />
    }
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary relative overflow-hidden">
      <AmbientLighting />
      <Navigation />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <div className="responsive-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <SectionHeading
                title="Refund Policy"
                subtitle="We stand behind our service quality. If you're not completely satisfied with AI Job Chommie, we offer fair and transparent refund options designed to protect both your investment and our commitment to excellence."
                align="center"
              />
              
              <div className="flex items-center justify-center mt-8 space-x-8">
                <div className="flex items-center space-x-2 text-text-tertiary">
                  <Shield className="w-5 h-5 text-state-success" />
                  <span>30-Day Guarantee</span>
                </div>
                <div className="flex items-center space-x-2 text-text-tertiary">
                  <Clock className="w-5 h-5 text-tech-cyan" />
                  <span>Fast Processing</span>
                </div>
                <div className="flex items-center space-x-2 text-text-tertiary">
                  <CheckCircle className="w-5 h-5 text-state-success" />
                  <span>Fair & Transparent</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Money-Back Guarantee Highlight */}
        <section className="py-12 bg-gradient-to-r from-bg-secondary to-transparent">
          <div className="responsive-container">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <MetallicCard glow="intense" className="border-l-4 border-l-state-success text-center">
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                  <div className="text-state-success text-6xl">
                    <Shield />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-3xl font-heading font-bold text-chrome mb-3">
                      30-Day Money-Back Guarantee
                    </h3>
                    <p className="text-lg text-text-secondary mb-4">
                      Try AI Job Chommie Premium risk-free for 30 days. If you're not completely satisfied 
                      with your job search results, we'll refund your full subscription fee.
                    </p>
                    <div className="text-sm text-text-tertiary">
                      Valid for new Premium subscriptions • No questions asked • Full refund
                    </div>
                  </div>
                  <div>
                    <MetallicButton variant="tech" size="lg">
                      Claim Your Guarantee
                    </MetallicButton>
                  </div>
                </div>
              </MetallicCard>
            </motion.div>
          </div>
        </section>

        {/* Refund Scenarios */}
        <section className="py-20">
          <div className="responsive-container">
            <SectionHeading
              title="Refund Scenarios"
              subtitle="Different situations qualify for different types of refunds. Here's a comprehensive breakdown of when and how you can request a refund."
              align="center"
            />

            <div className="grid lg:grid-cols-2 gap-8">
              {refundScenarios.map((scenario, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <MetallicCard glow="medium" className="h-full">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="text-tech-cyan text-2xl">
                        {scenario.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-heading font-bold text-chrome mb-2">
                          {scenario.title}
                        </h3>
                        <p className="text-text-secondary mb-4">
                          {scenario.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-heading font-semibold text-text-primary mb-2">Eligibility Criteria:</h4>
                        <ul className="space-y-1">
                          {scenario.eligibility.map((criteria, cIndex) => (
                            <li key={cIndex} className="flex items-start space-x-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-state-success mt-0.5 flex-shrink-0" />
                              <span className="text-text-secondary">{criteria}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-border-light">
                        <div>
                          <div className="text-sm text-text-tertiary">Processing Time</div>
                          <div className="font-medium text-tech-cyan">{scenario.timeline}</div>
                        </div>
                        <div>
                          <div className="text-sm text-text-tertiary">Review Process</div>
                          <div className="font-medium text-chrome">{scenario.action}</div>
                        </div>
                      </div>
                    </div>
                  </MetallicCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Refund Process Steps */}
        <section className="py-20 bg-gradient-to-b from-bg-secondary to-transparent">
          <div className="responsive-container">
            <SectionHeading
              title="How to Request a Refund"
              subtitle="Our streamlined refund process is designed to be quick, fair, and transparent. Follow these simple steps to request your refund."
              align="center"
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <MetallicCard glow="subtle" className="text-center h-full relative">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="w-8 h-8 bg-gradient-tech rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {step.step}
                      </div>
                    </div>
                    
                    <div className="pt-6">
                      <div className="text-tech-cyan text-3xl mb-4">
                        {step.icon}
                      </div>
                      <h4 className="text-lg font-heading font-bold text-chrome mb-3">
                        {step.title}
                      </h4>
                      <p className="text-text-secondary text-sm">
                        {step.description}
                      </p>
                    </div>
                  </MetallicCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Important Information */}
        <section className="py-20">
          <div className="responsive-container">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <MetallicCard>
                  <div className="flex items-start space-x-4">
                    <div className="text-tech-cyan text-2xl">
                      <CheckCircle />
                    </div>
                    <div>
                      <h3 className="text-xl font-heading font-bold text-chrome mb-4">
                        What's Included in Refunds
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-state-success mt-1 flex-shrink-0" />
                          <span className="text-text-secondary text-sm">Full subscription fees for eligible refunds</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-state-success mt-1 flex-shrink-0" />
                          <span className="text-text-secondary text-sm">Processing fees (where applicable)</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-state-success mt-1 flex-shrink-0" />
                          <span className="text-text-secondary text-sm">Prorated amounts for partial periods</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-state-success mt-1 flex-shrink-0" />
                          <span className="text-text-secondary text-sm">Transaction fees (minus payment processing costs)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </MetallicCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <MetallicCard>
                  <div className="flex items-start space-x-4">
                    <div className="text-state-warning text-2xl">
                      <AlertTriangle />
                    </div>
                    <div>
                      <h3 className="text-xl font-heading font-bold text-chrome mb-4">
                        Refund Limitations
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-start space-x-2">
                          <AlertTriangle className="w-4 h-4 text-state-warning mt-1 flex-shrink-0" />
                          <span className="text-text-secondary text-sm">Service abuse or policy violations void refund eligibility</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <AlertTriangle className="w-4 h-4 text-state-warning mt-1 flex-shrink-0" />
                          <span className="text-text-secondary text-sm">Refunds only to original payment method</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <AlertTriangle className="w-4 h-4 text-state-warning mt-1 flex-shrink-0" />
                          <span className="text-text-secondary text-sm">Free tier and promotional credits are non-refundable</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <AlertTriangle className="w-4 h-4 text-state-warning mt-1 flex-shrink-0" />
                          <span className="text-text-secondary text-sm">Third-party service fees may not be refundable</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </MetallicCard>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-20 bg-gradient-to-t from-bg-secondary to-transparent">
          <div className="responsive-container">
            <motion.div
              className="text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <MetallicCard glow="medium">
                <h2 className="text-3xl font-heading font-bold text-chrome mb-6">
                  Need Help with a Refund?
                </h2>
                <p className="text-lg text-text-secondary mb-8">
                  Our customer success team is here to help you through the refund process. 
                  We're committed to resolving your concerns quickly and fairly.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 text-left">
                  <div className="text-center">
                    <div className="text-tech-cyan text-3xl mb-3">
                      <Mail />
                    </div>
                    <h4 className="font-heading font-semibold mb-2">Email Support</h4>
                    <p className="text-tech-cyan text-sm">refunds@aijobchommie.co.za</p>
                    <p className="text-text-tertiary text-xs mt-1">Response within 24 hours</p>
                  </div>
                  <div className="text-center">
                    <div className="text-tech-cyan text-3xl mb-3">
                      <Phone />
                    </div>
                    <h4 className="font-heading font-semibold mb-2">Phone Support</h4>
                    <p className="text-tech-cyan text-sm">+27 (0) 11 123 4567</p>
                    <p className="text-text-tertiary text-xs mt-1">Mon-Fri 9AM-5PM SAST</p>
                  </div>
                  <div className="text-center">
                    <div className="text-tech-cyan text-3xl mb-3">
                      <Calendar />
                    </div>
                    <h4 className="font-heading font-semibold mb-2">Live Chat</h4>
                    <p className="text-tech-cyan text-sm">Available 24/7</p>
                    <p className="text-text-tertiary text-xs mt-1">Instant support online</p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border-light">
                  <MetallicButton variant="tech" size="lg" className="mx-auto">
                    Contact Support Now
                  </MetallicButton>
                </div>
              </MetallicCard>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RefundPage;

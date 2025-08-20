import { motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Globe,
  Mail,
  Phone,
  Scale,
  Shield
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

const TermsPage: React.FC = () => {
  const navigate = useNavigate();

  const quickLinks = [
    { title: "User Accounts", href: "#accounts" },
    { title: "Service Usage", href: "#usage" },
    { title: "Payment Terms", href: "#payments" },
    { title: "Privacy & Data", href: "#privacy" },
    { title: "Termination", href: "#termination" },
    { title: "Contact Us", href: "#contact" }
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
            <Scale className="w-4 h-4 mr-2" />
            Legal Information
          </MetallicBadge>

          <h1 className="text-responsive-3xl font-heading font-black mb-6 text-chrome leading-none">
            Terms of
            <br />
            <span className="bg-gradient-tech bg-clip-text text-transparent">
              Service
            </span>
          </h1>

          <p className="text-responsive-lg text-text-secondary max-w-4xl mx-auto mb-8 leading-relaxed">
            Please read these Terms of Service carefully before using AI Job Chommie.
            By accessing our platform, you agree to be bound by these terms.
          </p>

          <div className="flex items-center justify-center space-x-4 text-text-tertiary text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Last Updated: January 2024</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Governed by South African Law</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Quick Navigation */}
      <section className="section-responsive bg-gradient-to-b from-transparent to-bg-secondary">
        <div className="responsive-container">
          <SectionHeading
            title="Quick Navigation"
            subtitle="Jump to specific sections of our Terms of Service."
            align="center"
          />

          <div className="grid-responsive-3 gap-4 max-w-4xl mx-auto">
            {quickLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                className="block"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <MetallicCard className="text-center hover:border-tech-cyan transition-colors cursor-pointer">
                  <FileText className="w-6 h-6 text-tech-cyan mx-auto mb-2" />
                  <span className="text-text-secondary hover:text-tech-cyan transition-colors">
                    {link.title}
                  </span>
                </MetallicCard>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="section-responsive">
        <div className="responsive-container max-w-4xl mx-auto">

          {/* Agreement to Terms */}
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
                  <h2 className="text-2xl font-heading font-bold mb-4">1. Agreement to Terms</h2>
                  <div className="space-y-4 text-text-secondary">
                    <p>
                      By accessing and using AI Job Chommie ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
                    </p>
                    <p>
                      These Terms of Service constitute a legally binding agreement between you and AI Job Chommie, a South African company, regarding your use of our platform and services.
                    </p>
                    <p>
                      If you do not agree to abide by the above, please do not use this service.
                    </p>
                  </div>
                </div>
              </div>
            </MetallicCard>
          </motion.div>

          {/* User Accounts */}
          <motion.div
            id="accounts"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <MetallicCard>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-chrome rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-void-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">2. User Accounts</h2>
                  <div className="space-y-4 text-text-secondary">
                    <p>
                      <strong>Account Creation:</strong> You must create an account to access our services. You are responsible for maintaining the confidentiality of your account information.
                    </p>
                    <p>
                      <strong>Accurate Information:</strong> You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate.
                    </p>
                    <p>
                      <strong>Account Security:</strong> You are responsible for all activities that occur under your account. Notify us immediately of any unauthorized use.
                    </p>
                    <p>
                      <strong>Age Requirement:</strong> You must be at least 18 years old to use our services or have parental/guardian consent.
                    </p>
                  </div>
                </div>
              </div>
            </MetallicCard>
          </motion.div>

          {/* Service Usage */}
          <motion.div
            id="usage"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <MetallicCard>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-tech rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-void-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">3. Acceptable Use</h2>
                  <div className="space-y-4 text-text-secondary">
                    <p>
                      <strong>Permitted Use:</strong> You may use AI Job Chommie solely for legitimate job searching, recruitment, and career development purposes.
                    </p>
                    <p>
                      <strong>Prohibited Activities:</strong>
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Posting false, misleading, or fraudulent job listings or applications</li>
                      <li>Attempting to gain unauthorized access to our systems</li>
                      <li>Using automated scripts or bots to access our services</li>
                      <li>Harassing, threatening, or discriminating against other users</li>
                      <li>Violating any applicable laws or regulations</li>
                      <li>Interfering with the proper functioning of our platform</li>
                    </ul>
                  </div>
                </div>
              </div>
            </MetallicCard>
          </motion.div>

          {/* Payment Terms */}
          <motion.div
            id="payments"
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
                  <h2 className="text-2xl font-heading font-bold mb-4">4. Payment Terms</h2>
                  <div className="space-y-4 text-text-secondary">
                    <p>
                      <strong>Subscription Plans:</strong> We offer various subscription plans with different features and pricing. All prices are in South African Rand (ZAR).
                    </p>
                    <p>
                      <strong>Payment Processing:</strong> Payments are processed securely through Paystack. We do not store your payment information.
                    </p>
                    <p>
                      <strong>Billing Cycle:</strong> Subscriptions are billed monthly unless otherwise specified. Billing occurs on the same day each month.
                    </p>
                    <p>
                      <strong>Refunds:</strong> Refunds are handled according to our Refund Policy. Please review our refund terms for detailed information.
                    </p>
                    <p>
                      <strong>Price Changes:</strong> We reserve the right to modify our pricing with 30 days' notice to existing subscribers.
                    </p>
                  </div>
                </div>
              </div>
            </MetallicCard>
          </motion.div>

          {/* Privacy and Data */}
          <motion.div
            id="privacy"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <MetallicCard>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-tech rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-void-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">5. Privacy and Data Protection</h2>
                  <div className="space-y-4 text-text-secondary">
                    <p>
                      <strong>Data Collection:</strong> We collect and process personal information as described in our Privacy Policy, which complies with the Protection of Personal Information Act (POPI Act).
                    </p>
                    <p>
                      <strong>Data Security:</strong> We implement industry-standard security measures to protect your personal information.
                    </p>
                    <p>
                      <strong>AI Processing:</strong> Your data may be processed by our AI algorithms to provide personalized job matching services.
                    </p>
                    <p>
                      <strong>Third-Party Services:</strong> We may use third-party services for analytics, payment processing, and other functionalities as outlined in our Privacy Policy.
                    </p>
                  </div>
                </div>
              </div>
            </MetallicCard>
          </motion.div>

          {/* Intellectual Property */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <MetallicCard>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-chrome rounded-lg flex items-center justify-center flex-shrink-0">
                  <Scale className="w-6 h-6 text-void-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">6. Intellectual Property</h2>
                  <div className="space-y-4 text-text-secondary">
                    <p>
                      <strong>Our Content:</strong> All content on AI Job Chommie, including text, graphics, logos, and software, is owned by us and protected by intellectual property laws.
                    </p>
                    <p>
                      <strong>User Content:</strong> You retain ownership of content you submit but grant us license to use it for providing our services.
                    </p>
                    <p>
                      <strong>AI Technology:</strong> Our AI algorithms and matching technology are proprietary and protected by intellectual property rights.
                    </p>
                  </div>
                </div>
              </div>
            </MetallicCard>
          </motion.div>

          {/* Termination */}
          <motion.div
            id="termination"
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
                  <h2 className="text-2xl font-heading font-bold mb-4">7. Termination</h2>
                  <div className="space-y-4 text-text-secondary">
                    <p>
                      <strong>By You:</strong> You may terminate your account at any time through your account settings or by contacting us.
                    </p>
                    <p>
                      <strong>By Us:</strong> We may terminate or suspend your account immediately if you violate these terms or engage in prohibited activities.
                    </p>
                    <p>
                      <strong>Effect of Termination:</strong> Upon termination, your right to use the service ceases immediately. We may retain certain information as required by law.
                    </p>
                  </div>
                </div>
              </div>
            </MetallicCard>
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <MetallicCard>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-chrome rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-void-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">8. Disclaimer and Limitation of Liability</h2>
                  <div className="space-y-4 text-text-secondary">
                    <p>
                      <strong>Service Availability:</strong> We strive to provide continuous service but cannot guarantee 100% uptime or uninterrupted access.
                    </p>
                    <p>
                      <strong>Job Matching:</strong> While our AI technology is advanced, we cannot guarantee specific job outcomes or successful matches.
                    </p>
                    <p>
                      <strong>Third-Party Content:</strong> We are not responsible for the accuracy or content of job listings posted by employers.
                    </p>
                    <p>
                      <strong>Limitation:</strong> Our liability is limited to the amount you paid for our services in the 12 months preceding any claim.
                    </p>
                  </div>
                </div>
              </div>
            </MetallicCard>
          </motion.div>

          {/* Governing Law */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <MetallicCard>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-tech rounded-lg flex items-center justify-center flex-shrink-0">
                  <Scale className="w-6 h-6 text-void-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">9. Governing Law</h2>
                  <div className="space-y-4 text-text-secondary">
                    <p>
                      These Terms of Service are governed by and construed in accordance with the laws of South Africa.
                    </p>
                    <p>
                      Any disputes arising under these terms will be subject to the exclusive jurisdiction of the South African courts.
                    </p>
                  </div>
                </div>
              </div>
            </MetallicCard>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            id="contact"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <MetallicCard glow="medium">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-tech rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-void-black" />
                </div>

                <h2 className="text-2xl font-heading font-bold mb-4">Questions About These Terms?</h2>

                <p className="text-text-secondary mb-6">
                  If you have any questions about these Terms of Service, please contact us.
                </p>

                <div className="space-y-3 text-text-secondary">
                  <div className="flex items-center justify-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>legal@aijobchommie.co.za</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>+27 (0) 21 XXX XXXX</span>
                  </div>
                </div>

                <div className="mt-6">
                  <MetallicButton
                    variant="tech"
                    onClick={() => navigate('/contact')}
                  >
                    Contact Support
                  </MetallicButton>
                </div>
              </div>
            </MetallicCard>
          </motion.div>

        </div>
      </section>

      {/* Footer Separator */}
      <ChromeSeparator className="my-8" />
    </div>
  );
};

export default TermsPage;

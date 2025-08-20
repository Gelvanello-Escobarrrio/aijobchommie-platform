import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Calendar,
  Database,
  Eye,
  FileText,
  Globe,
  Lock,
  Mail,
  Phone,
  Settings,
  Shield,
  Trash2,
  UserCheck
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

const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

  const dataTypes = [
    {
      icon: <UserCheck />,
      title: "Personal Information",
      description: "Name, email, phone number, date of birth, and profile information you provide",
      purpose: "Account management and personalized services"
    },
    {
      icon: <FileText />,
      title: "Professional Data",
      description: "Resume, work experience, skills, education, and career preferences",
      purpose: "AI-powered job matching and career recommendations"
    },
    {
      icon: <Globe />,
      title: "Usage Analytics",
      description: "How you interact with our platform, pages visited, and features used",
      purpose: "Platform improvement and user experience optimization"
    },
    {
      icon: <Settings />,
      title: "Technical Information",
      description: "IP address, browser type, device information, and system data",
      purpose: "Security, technical support, and platform functionality"
    }
  ];

  const rights = [
    {
      icon: <Eye />,
      title: "Right to Access",
      description: "Request a copy of all personal data we hold about you"
    },
    {
      icon: <Settings />,
      title: "Right to Rectification",
      description: "Correct or update any inaccurate personal information"
    },
    {
      icon: <Trash2 />,
      title: "Right to Erasure",
      description: "Request deletion of your personal data under certain circumstances"
    },
    {
      icon: <Lock />,
      title: "Right to Portability",
      description: "Receive your data in a structured, machine-readable format"
    },
    {
      icon: <AlertTriangle />,
      title: "Right to Object",
      description: "Object to processing of your data for certain purposes"
    },
    {
      icon: <Database />,
      title: "Right to Restriction",
      description: "Request we limit how we process your personal data"
    }
  ];

  const securityMeasures = [
    "End-to-end encryption for all data transmission",
    "Regular security audits and penetration testing",
    "Multi-factor authentication for account access",
    "Secure data centers with 24/7 monitoring",
    "Staff background checks and security training",
    "Regular backups and disaster recovery procedures"
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
            Privacy Policy
          </MetallicBadge>

          <h1 className="text-responsive-3xl font-heading font-black mb-6 text-chrome leading-none">
            Your Privacy
            <br />
            <span className="bg-gradient-tech bg-clip-text text-transparent">
              Matters to Us
            </span>
          </h1>

          <p className="text-responsive-lg text-text-secondary max-w-4xl mx-auto mb-8 leading-relaxed">
            We're committed to protecting your personal information and being transparent
            about how we collect, use, and safeguard your data in compliance with POPI Act.
          </p>

          <div className="flex items-center justify-center space-x-6 text-text-tertiary text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Last Updated: January 2024</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>POPI Act Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Bank-Level Security</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Data We Collect */}
      <section className="section-responsive bg-gradient-to-b from-transparent to-bg-secondary">
        <div className="responsive-container">
          <SectionHeading
            title="Information We Collect"
            subtitle="Understanding what data we collect and why it's necessary for our AI-powered services."
            align="center"
          />

          <div className="grid-responsive-2 gap-8 max-w-5xl mx-auto">
            {dataTypes.map((dataType, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <MetallicCard className="h-full">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-tech rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="text-void-black text-xl">{dataType.icon}</div>
                    </div>
                    <div>
                      <h3 className="text-xl font-heading font-bold mb-2">{dataType.title}</h3>
                      <p className="text-text-secondary mb-3">{dataType.description}</p>
                      <MetallicBadge variant="chrome" size="sm">
                        Purpose: {dataType.purpose}
                      </MetallicBadge>
                    </div>
                  </div>
                </MetallicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Use Data */}
      <section className="section-responsive">
        <div className="responsive-container max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <MetallicCard>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-tech rounded-lg flex items-center justify-center flex-shrink-0">
                  <Database className="w-6 h-6 text-void-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">How We Use Your Information</h2>
                  <div className="space-y-4 text-text-secondary">
                    <div>
                      <strong>AI Job Matching:</strong> We use your professional information, skills, and preferences to power our AI algorithms that match you with relevant job opportunities.
                    </div>
                    <div>
                      <strong>Service Provision:</strong> To create and manage your account, process payments, provide customer support, and deliver our core services.
                    </div>
                    <div>
                      <strong>Communication:</strong> To send you job alerts, platform updates, promotional content (with your consent), and important service notifications.
                    </div>
                    <div>
                      <strong>Platform Improvement:</strong> To analyze usage patterns, improve our AI algorithms, develop new features, and enhance user experience.
                    </div>
                    <div>
                      <strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes in South Africa.
                    </div>
                  </div>
                </div>
              </div>
            </MetallicCard>
          </motion.div>

          {/* AI Processing */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <MetallicCard>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-chrome rounded-lg flex items-center justify-center flex-shrink-0">
                  <Settings className="w-6 h-6 text-void-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">AI and Automated Processing</h2>
                  <div className="space-y-4 text-text-secondary">
                    <p>
                      <strong>Machine Learning:</strong> Our AI systems analyze your profile data to understand your skills, experience level, and career preferences for personalized job matching.
                    </p>
                    <p>
                      <strong>Automated Decisions:</strong> Some job recommendations are generated automatically by our AI. You can always request human review of any automated decisions that significantly affect you.
                    </p>
                    <p>
                      <strong>Data Training:</strong> We may use anonymized, aggregated data to improve our AI models, but individual profiles are never used to train algorithms for other users.
                    </p>
                    <p>
                      <strong>Opt-out Rights:</strong> You can opt out of certain automated processing while still using our core services, though this may limit personalization features.
                    </p>
                  </div>
                </div>
              </div>
            </MetallicCard>
          </motion.div>

          {/* Data Sharing */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <MetallicCard>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-tech rounded-lg flex items-center justify-center flex-shrink-0">
                  <UserCheck className="w-6 h-6 text-void-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">Data Sharing and Disclosure</h2>
                  <div className="space-y-4 text-text-secondary">
                    <div>
                      <strong>Employers:</strong> With your explicit consent, we may share your profile information with potential employers when you apply for jobs or express interest.
                    </div>
                    <div>
                      <strong>Service Providers:</strong> We work with trusted third-party providers for payment processing (Paystack), analytics, and technical infrastructure, all bound by strict confidentiality agreements.
                    </div>
                    <div>
                      <strong>Legal Requirements:</strong> We may disclose information when required by law, court order, or to protect our rights and the safety of our users.
                    </div>
                    <div>
                      <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, user data may be transferred as part of the transaction, with continued privacy protection.
                    </div>
                    <div>
                      <strong>Never Sold:</strong> We never sell your personal information to third parties for marketing or advertising purposes.
                    </div>
                  </div>
                </div>
              </div>
            </MetallicCard>
          </motion.div>

          {/* Security Measures */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <MetallicCard>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-chrome rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-void-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">Security Measures</h2>
                  <div className="space-y-4 text-text-secondary">
                    <p>
                      We implement industry-leading security measures to protect your personal information:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      {securityMeasures.map((measure, index) => (
                        <li key={index}>{measure}</li>
                      ))}
                    </ul>
                    <p>
                      <strong>Data Breaches:</strong> In the unlikely event of a security breach, we will notify affected users and relevant authorities within 72 hours as required by POPI Act.
                    </p>
                  </div>
                </div>
              </div>
            </MetallicCard>
          </motion.div>

          {/* Data Retention */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <MetallicCard>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-tech rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-void-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">Data Retention</h2>
                  <div className="space-y-4 text-text-secondary">
                    <p>
                      <strong>Active Accounts:</strong> We retain your personal information for as long as your account is active and for the provision of our services.
                    </p>
                    <p>
                      <strong>Account Deletion:</strong> When you delete your account, we remove your personal information within 30 days, except for data we're legally required to retain.
                    </p>
                    <p>
                      <strong>Legal Requirements:</strong> Some information may be retained longer to comply with legal obligations, resolve disputes, or enforce our agreements.
                    </p>
                    <p>
                      <strong>Anonymized Data:</strong> We may retain anonymized, aggregated data indefinitely for research and platform improvement purposes.
                    </p>
                  </div>
                </div>
              </div>
            </MetallicCard>
          </motion.div>

        </div>
      </section>

      {/* Your Rights */}
      <section className="section-responsive bg-gradient-to-b from-bg-secondary to-transparent">
        <div className="responsive-container">
          <SectionHeading
            title="Your Privacy Rights"
            subtitle="Under the Protection of Personal Information Act (POPI Act), you have several important rights regarding your personal data."
            align="center"
          />

          <div className="grid-responsive-3 gap-6 max-w-6xl mx-auto">
            {rights.map((right, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <MetallicCard className="text-center h-full">
                  <div className="text-tech-cyan text-3xl mb-4">{right.icon}</div>
                  <h3 className="text-lg font-heading font-bold mb-3">{right.title}</h3>
                  <p className="text-text-secondary text-sm">{right.description}</p>
                </MetallicCard>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <MetallicCard className="max-w-2xl mx-auto">
              <h3 className="text-xl font-heading font-bold mb-4">Exercise Your Rights</h3>
              <p className="text-text-secondary mb-6">
                To exercise any of these rights, contact our Data Protection Officer.
                We'll respond to your request within 30 days as required by law.
              </p>
              <MetallicButton
                variant="tech"
                onClick={() => navigate('/contact')}
                icon={<Mail />}
                iconPosition="right"
              >
                Contact Data Protection Officer
              </MetallicButton>
            </MetallicCard>
          </motion.div>
        </div>
      </section>

      {/* Cookies and Tracking */}
      <section className="section-responsive">
        <div className="responsive-container max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <MetallicCard>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-chrome rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-void-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">Cookies and Tracking</h2>
                  <div className="space-y-4 text-text-secondary">
                    <div>
                      <strong>Essential Cookies:</strong> Required for basic platform functionality, security, and user authentication. These cannot be disabled.
                    </div>
                    <div>
                      <strong>Analytics Cookies:</strong> Help us understand how users interact with our platform to improve services. You can opt out in your account settings.
                    </div>
                    <div>
                      <strong>Preference Cookies:</strong> Remember your settings and preferences for a personalized experience.
                    </div>
                    <div>
                      <strong>Third-Party Tracking:</strong> We use Google Analytics and other tools for platform improvement. These services have their own privacy policies.
                    </div>
                    <div>
                      <strong>Cookie Management:</strong> You can manage cookie preferences through your browser settings or our privacy dashboard.
                    </div>
                  </div>
                </div>
              </div>
            </MetallicCard>
          </motion.div>
        </div>
      </section>

      {/* International Transfers */}
      <section className="section-responsive bg-gradient-to-b from-transparent to-bg-secondary">
        <div className="responsive-container max-w-4xl mx-auto">
          <motion.div
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
                  <h2 className="text-2xl font-heading font-bold mb-4">International Data Transfers</h2>
                  <div className="space-y-4 text-text-secondary">
                    <p>
                      <strong>Data Location:</strong> Your personal information is primarily stored and processed in South Africa. Some services may involve transfers to other countries with adequate data protection.
                    </p>
                    <p>
                      <strong>Safeguards:</strong> When data is transferred internationally, we ensure appropriate safeguards are in place, including contractual protections and adequacy decisions.
                    </p>
                    <p>
                      <strong>Cloud Services:</strong> We use reputable cloud providers with data centers in South Africa and other countries with strong privacy laws.
                    </p>
                  </div>
                </div>
              </div>
            </MetallicCard>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
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
                <Shield className="w-10 h-10 text-void-black" />
              </div>

              <h2 className="text-responsive-2xl font-heading font-black text-chrome mb-6">
                Privacy Questions?
              </h2>

              <p className="text-responsive-lg text-text-secondary mb-8">
                Our Data Protection Officer is here to help with any privacy-related
                questions, concerns, or requests you may have.
              </p>

              <div className="grid-responsive-2 gap-6 max-w-2xl mx-auto mb-8">
                <div className="flex items-center justify-center space-x-3 text-text-secondary">
                  <Mail className="w-5 h-5 text-tech-cyan" />
                  <span>privacy@aijobchommie.co.za</span>
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
                  icon={<Mail />}
                  iconPosition="right"
                >
                  Contact Privacy Officer
                </MetallicButton>

                <MetallicButton
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/settings')}
                  icon={<Settings />}
                >
                  Privacy Settings
                </MetallicButton>
              </div>

              <div className="text-sm text-text-tertiary mt-6">
                Data Protection Officer • Available Monday-Friday, 8AM-6PM SAST
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

export default PrivacyPage;

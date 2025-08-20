import { motion } from 'framer-motion';
import {
  Building,
  CheckCircle,
  Clock,
  Globe,
  HelpCircle,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  User,
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
  MetallicInput,
  SectionHeading
} from '../components/ui/MetallicComponents';

const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const contactMethods = [
    {
      icon: <Mail />,
      title: "Email Support",
      description: "Get help via email with detailed responses",
      contact: "support@aijobchommie.co.za",
      response: "Within 24 hours",
      available: "24/7"
    },
    {
      icon: <Phone />,
      title: "Phone Support",
      description: "Speak directly with our support team",
      contact: "+27 (0) 21 XXX XXXX",
      response: "Immediate",
      available: "Mon-Fri, 8AM-6PM SAST"
    },
    {
      icon: <MessageSquare />,
      title: "Live Chat",
      description: "Real-time chat support through our platform",
      contact: "Available in your dashboard",
      response: "Real-time",
      available: "Mon-Fri, 8AM-6PM SAST"
    }
  ];

  const departments = [
    {
      icon: <HelpCircle />,
      title: "General Support",
      email: "support@aijobchommie.co.za",
      description: "Account issues, technical problems, general questions"
    },
    {
      icon: <Building />,
      title: "Business Inquiries",
      email: "business@aijobchommie.co.za",
      description: "Enterprise solutions, partnerships, bulk accounts"
    },
    {
      icon: <User />,
      title: "Data Protection",
      email: "privacy@aijobchommie.co.za",
      description: "Privacy concerns, data requests, POPI Act compliance"
    },
    {
      icon: <Zap />,
      title: "Technical Issues",
      email: "tech@aijobchommie.co.za",
      description: "Platform bugs, API issues, integration problems"
    }
  ];

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "Click 'Forgot Password' on the login page, enter your email, and follow the instructions sent to your inbox."
    },
    {
      question: "How does the AI job matching work?",
      answer: "Our AI analyzes your profile, skills, and preferences to find relevant job opportunities that match your career goals."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time through your account settings. Refunds are available within 30 days."
    },
    {
      question: "Do you support all South African provinces?",
      answer: "Yes, we cover job opportunities across all nine provinces of South Africa with local market expertise."
    },
    {
      question: "Is my personal data secure?",
      answer: "Absolutely. We use enterprise-grade security and comply with the Protection of Personal Information Act (POPI Act)."
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
            <MessageSquare className="w-4 h-4 mr-2" />
            Get in Touch
          </MetallicBadge>

          <h1 className="text-responsive-3xl font-heading font-black mb-6 text-chrome leading-none">
            We're Here
            <br />
            <span className="bg-gradient-tech bg-clip-text text-transparent">
              to Help
            </span>
          </h1>

          <p className="text-responsive-lg text-text-secondary max-w-4xl mx-auto mb-8 leading-relaxed">
            Have questions about AI Job Chommie? Need technical support? Want to explore
            enterprise solutions? Our team is ready to assist you every step of the way.
          </p>

          <div className="flex items-center justify-center space-x-6 text-text-tertiary text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>24hr Response Time</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>South African Team</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Expert Support</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Contact Methods */}
      <section className="section-responsive bg-gradient-to-b from-transparent to-bg-secondary">
        <div className="responsive-container">
          <SectionHeading
            title="Get Support Your Way"
            subtitle="Choose the contact method that works best for you."
            align="center"
          />

          <div className="grid-responsive-3 gap-8 max-w-5xl mx-auto">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <MetallicCard glow="subtle" className="text-center h-full">
                  <div className="text-tech-cyan text-4xl mb-4">{method.icon}</div>
                  <h3 className="text-xl font-heading font-bold mb-3">{method.title}</h3>
                  <p className="text-text-secondary mb-4">{method.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="font-mono text-sm text-chrome">{method.contact}</div>
                    <div className="text-xs text-text-tertiary">Response: {method.response}</div>
                    <div className="text-xs text-text-tertiary">{method.available}</div>
                  </div>

                  <MetallicBadge variant="tech" size="sm">
                    {method.title.split(' ')[0]}
                  </MetallicBadge>
                </MetallicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Departments */}
      <section className="section-responsive">
        <div className="responsive-container">
          <div className="grid-responsive-2 gap-12 max-w-6xl mx-auto">

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <MetallicCard glow="medium" className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-tech rounded-lg flex items-center justify-center">
                    <Send className="w-6 h-6 text-void-black" />
                  </div>
                  <h2 className="text-2xl font-heading font-bold">Send us a Message</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid-responsive-2 gap-4">
                    <MetallicInput
                      label="Full Name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                      icon={<User />}
                    />

                    <MetallicInput
                      label="Email Address"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      required
                      icon={<Mail />}
                    />
                  </div>

                  <div>
                    <label className="block text-text-secondary text-sm font-medium mb-2">
                      Inquiry Type
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-void-shadow border border-border-light rounded-md focus:border-tech-cyan focus:ring-1 focus:ring-tech-cyan transition-all text-text-primary"
                    >
                      <option value="general">General Support</option>
                      <option value="technical">Technical Issue</option>
                      <option value="business">Business Inquiry</option>
                      <option value="privacy">Privacy/Data Protection</option>
                      <option value="billing">Billing Question</option>
                    </select>
                  </div>

                  <MetallicInput
                    label="Subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="How can we help you?"
                    required
                  />

                  <div>
                    <label className="block text-text-secondary text-sm font-medium mb-2">
                      Message <span className="text-state-error">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Please describe your question or issue in detail..."
                      required
                      rows={6}
                      className="w-full px-4 py-2 bg-void-shadow border border-border-light rounded-md focus:border-tech-cyan focus:ring-1 focus:ring-tech-cyan transition-all text-text-primary resize-vertical"
                    />
                  </div>

                  <MetallicButton
                    type="submit"
                    variant="tech"
                    size="lg"
                    fullWidth
                    icon={<Send />}
                    iconPosition="right"
                  >
                    Send Message
                  </MetallicButton>

                  <p className="text-xs text-text-tertiary text-center">
                    We typically respond within 24 hours during business days
                  </p>
                </form>
              </MetallicCard>
            </motion.div>

            {/* Departments */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">Contact Departments</h2>
                  <p className="text-text-secondary">
                    Reach out to the right team for faster, more specialized assistance.
                  </p>
                </div>

                {departments.map((dept, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <MetallicCard>
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gradient-chrome rounded-lg flex items-center justify-center flex-shrink-0">
                          <div className="text-void-black text-lg">{dept.icon}</div>
                        </div>
                        <div>
                          <h3 className="font-heading font-bold mb-1">{dept.title}</h3>
                          <div className="text-tech-cyan text-sm font-mono mb-2">{dept.email}</div>
                          <p className="text-text-secondary text-sm">{dept.description}</p>
                        </div>
                      </div>
                    </MetallicCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Company Information */}
      <section className="section-responsive bg-gradient-to-b from-bg-secondary to-transparent">
        <div className="responsive-container">
          <div className="grid-responsive-2 gap-12 max-w-5xl mx-auto">

            {/* Office Info */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <MetallicCard className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-tech rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-8 h-8 text-void-black" />
                </div>

                <h3 className="text-xl font-heading font-bold mb-4">Our Office</h3>

                <div className="space-y-3 text-text-secondary">
                  <p>AI Job Chommie (Pty) Ltd</p>
                  <p>Cape Town, Western Cape<br />South Africa</p>
                  <p>Registration: XXXX/XXXXXX/XX</p>
                </div>

                <div className="mt-6 space-y-2">
                  <MetallicBadge variant="tech">South African Owned</MetallicBadge>
                  <MetallicBadge variant="chrome">POPI Act Compliant</MetallicBadge>
                </div>
              </MetallicCard>
            </motion.div>

            {/* Business Hours */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <MetallicCard className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-chrome rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-void-black" />
                  </div>
                  <h3 className="text-xl font-heading font-bold">Business Hours</h3>
                </div>

                <div className="space-y-3 text-text-secondary">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="text-tech-cyan">8:00 AM - 6:00 PM SAST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="text-text-tertiary">Email support only</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="text-text-tertiary">Email support only</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Public Holidays</span>
                    <span className="text-text-tertiary">Limited support</span>
                  </div>
                </div>

                <div className="mt-6 p-3 bg-void-shadow rounded-lg">
                  <p className="text-sm text-text-secondary">
                    <strong>Emergency Support:</strong> For urgent technical issues affecting
                    platform availability, email tech@aijobchommie.co.za with "URGENT" in the subject line.
                  </p>
                </div>
              </MetallicCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-responsive">
        <div className="responsive-container">
          <SectionHeading
            title="Frequently Asked Questions"
            subtitle="Quick answers to common questions. Can't find what you're looking for? Contact us directly."
            align="center"
          />

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
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
                      <h3 className="font-heading font-semibold text-lg">{faq.question}</h3>
                      <HelpCircle className="w-5 h-5 text-tech-cyan transition-transform group-open:rotate-90" />
                    </summary>
                    <div className="mt-4 pt-4 border-t border-border-light">
                      <p className="text-text-secondary">{faq.answer}</p>
                    </div>
                  </details>
                </MetallicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-responsive bg-gradient-to-t from-bg-secondary to-transparent">
        <div className="responsive-container">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-responsive-2xl font-heading font-black text-chrome mb-6">
              Still Have Questions?
            </h2>

            <p className="text-responsive-lg text-text-secondary mb-8">
              Our support team is here to help you succeed. Don't hesitate to reach out
              for personalized assistance with your AI Job Chommie experience.
            </p>

            <div className="flex-responsive-col gap-4 justify-center items-center">
              <MetallicButton
                variant="tech"
                size="lg"
                onClick={() => window.location.href = 'mailto:support@aijobchommie.co.za'}
                icon={<Mail />}
                iconPosition="right"
                className="min-w-56"
              >
                Email Support
              </MetallicButton>

              <MetallicButton
                variant="outline"
                size="lg"
                onClick={() => navigate('/about')}
                className="min-w-56"
              >
                Learn More About Us
              </MetallicButton>
            </div>

            <p className="text-sm text-text-tertiary mt-6">
              Average response time: Under 24 hours • South African support team
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer Separator */}
      <ChromeSeparator className="my-8" />
    </div>
  );
};

export default ContactPage;

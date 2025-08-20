import { motion } from 'framer-motion';
import {
  Activity,
  Award,
  Bell,
  Brain,
  CheckCircle,
  Cloud,
  Cpu,
  CreditCard,
  Database,
  FileText,
  Globe,
  Layers,
  Lock,
  MessageSquare,
  Network,
  Server,
  Settings,
  Shield,
  Target,
  TrendingUp,
  Zap
} from 'lucide-react';
import React, { useState } from 'react';

import {
  AmbientLighting,
  ChromeSeparator,
  MetallicBadge,
  MetallicButton,
  MetallicCard,
  SectionHeading
} from '../components/ui/MetallicComponents';

const FeaturesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('intelligent-matching');

  const featureCategories = [
    {
      id: 'intelligent-matching',
      title: 'Intelligent Matching Engine',
      icon: <Brain className="w-6 h-6" />,
      description: 'Advanced algorithmic job matching',
      features: [
        {
          title: 'Neural Job Matching',
          description: 'Advanced machine learning algorithms analyze thousands of data points to match candidates with perfect opportunities.',
          icon: <Target className="w-8 h-8 text-tech-cyan" />,
          technologies: ['OpenAI GPT-4', 'Hugging Face Transformers', 'Custom ML Models']
        },
        {
          title: 'Real-time Processing',
          description: 'Lightning-fast job processing with intelligent caching and optimization for instant results.',
          icon: <Zap className="w-8 h-8 text-tech-cyan" />,
          technologies: ['Redis Caching', 'ElasticSearch', 'CDN Optimization']
        },
        {
          title: 'Predictive Analytics',
          description: 'Career trajectory analysis and success probability calculations based on historical data.',
          icon: <TrendingUp className="w-8 h-8 text-tech-cyan" />,
          technologies: ['Predictive Modeling', 'Data Analytics', 'Success Metrics']
        }
      ]
    },
    {
      id: 'enterprise-infrastructure',
      title: 'Enterprise Infrastructure',
      icon: <Server className="w-6 h-6" />,
      description: 'Bank-grade security and scalability',
      features: [
        {
          title: 'Scalable Architecture',
          description: 'Microservices architecture with load balancing and auto-scaling capabilities for millions of users.',
          icon: <Cloud className="w-8 h-8 text-tech-cyan" />,
          technologies: ['Kubernetes', 'Docker', 'AWS/Azure Cloud']
        },
        {
          title: 'Enterprise Security',
          description: 'Military-grade encryption, JWT authentication, and comprehensive audit trails.',
          icon: <Shield className="w-8 h-8 text-tech-cyan" />,
          technologies: ['JWT Tokens', 'AES-256 Encryption', 'RBAC Security']
        },
        {
          title: 'High Availability',
          description: '99.99% uptime guarantee with redundant systems and automated failover.',
          icon: <Activity className="w-8 h-8 text-tech-cyan" />,
          technologies: ['Load Balancers', 'Database Clustering', 'CDN Networks']
        }
      ]
    },
    {
      id: 'data-intelligence',
      title: 'Data Intelligence Platform',
      icon: <Database className="w-6 h-6" />,
      description: 'Advanced data processing and insights',
      features: [
        {
          title: 'CV Analysis Engine',
          description: 'Intelligent document parsing with skill extraction and professional assessment.',
          icon: <FileText className="w-8 h-8 text-tech-cyan" />,
          technologies: ['OCR Technology', 'NLP Processing', 'Skill Taxonomy']
        },
        {
          title: 'Market Intelligence',
          description: 'Real-time job market analysis with salary insights and trend forecasting.',
          icon: <TrendingUp className="w-8 h-8 text-tech-cyan" />,
          technologies: ['Market API Integration', 'Trend Analysis', 'Salary Benchmarking']
        },
        {
          title: 'Career Insights',
          description: 'Personalized career guidance with industry-specific recommendations.',
          icon: <Award className="w-8 h-8 text-tech-cyan" />,
          technologies: ['Career Mapping', 'Industry Analysis', 'Growth Projections']
        }
      ]
    },
    {
      id: 'payment-systems',
      title: 'Payment & Billing Systems',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Comprehensive financial infrastructure',
      features: [
        {
          title: 'Paystack Integration',
          description: 'Full Paystack payment gateway with subscription management and automated billing.',
          icon: <CreditCard className="w-8 h-8 text-tech-cyan" />,
          technologies: ['Paystack API', 'Webhook Processing', 'Recurring Billing']
        },
        {
          title: 'Subscription Management',
          description: 'Flexible subscription tiers with automatic upgrades and proration.',
          icon: <Settings className="w-8 h-8 text-tech-cyan" />,
          technologies: ['Plan Management', 'Proration Logic', 'Usage Tracking']
        },
        {
          title: 'Financial Analytics',
          description: 'Complete financial reporting with revenue tracking and churn analysis.',
          icon: <TrendingUp className="w-8 h-8 text-tech-cyan" />,
          technologies: ['Revenue Analytics', 'Churn Prediction', 'Financial Reporting']
        }
      ]
    },
    {
      id: 'communication',
      title: 'Communication Systems',
      icon: <MessageSquare className="w-6 h-6" />,
      description: 'Multi-channel communication platform',
      features: [
        {
          title: 'Smart Notifications',
          description: 'Intelligent notification system with email, SMS, and WhatsApp integration.',
          icon: <Bell className="w-8 h-8 text-tech-cyan" />,
          technologies: ['Twilio SMS', 'WhatsApp Business', 'Email Automation']
        },
        {
          title: 'Real-time Messaging',
          description: 'WebSocket-based real-time communication for instant updates.',
          icon: <MessageSquare className="w-8 h-8 text-tech-cyan" />,
          technologies: ['WebSocket Protocol', 'Socket.io', 'Push Notifications']
        },
        {
          title: 'Multi-Language Support',
          description: 'Localization support for multiple South African languages.',
          icon: <Globe className="w-8 h-8 text-tech-cyan" />,
          technologies: ['i18n Framework', 'Language Detection', 'Cultural Adaptation']
        }
      ]
    },
    {
      id: 'advanced-apis',
      title: 'Advanced API Ecosystem',
      icon: <Network className="w-6 h-6" />,
      description: 'Comprehensive RESTful API suite',
      features: [
        {
          title: 'RESTful API Gateway',
          description: 'Complete API ecosystem with rate limiting, versioning, and comprehensive documentation.',
          icon: <Layers className="w-8 h-8 text-tech-cyan" />,
          technologies: ['API Gateway', 'Rate Limiting', 'API Versioning']
        },
        {
          title: 'Third-party Integrations',
          description: 'Seamless integration with job boards, ATS systems, and recruitment platforms.',
          icon: <Network className="w-8 h-8 text-tech-cyan" />,
          technologies: ['Job Board APIs', 'ATS Integration', 'Webhook Systems']
        },
        {
          title: 'Developer Tools',
          description: 'SDKs, documentation, and testing tools for enterprise integrations.',
          icon: <Cpu className="w-8 h-8 text-tech-cyan" />,
          technologies: ['SDK Development', 'API Documentation', 'Testing Frameworks']
        }
      ]
    }
  ];

  const activeFeatures = featureCategories.find(cat => cat.id === activeCategory)?.features || [];

  const stats = [
    { label: 'API Endpoints', value: '50+', icon: <Network /> },
    { label: 'Data Points Analyzed', value: '1M+', icon: <Database /> },
    { label: 'ML Models', value: '15+', icon: <Brain /> },
    { label: 'Security Layers', value: '7', icon: <Shield /> }
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
              <Cpu className="w-4 h-4 mr-2" />
              Enterprise-Grade Technology
            </MetallicBadge>
          </motion.div>

          <motion.h1
            className="text-responsive-3xl font-heading font-black mb-6 text-chrome leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Advanced Technology
            <br />
            <span className="bg-gradient-tech bg-clip-text text-transparent">
              Platform Features
            </span>
          </motion.h1>

          <motion.p
            className="text-responsive-lg text-text-secondary max-w-3xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover the sophisticated infrastructure and intelligent systems powering South Africa's
            most advanced career platform. Built with enterprise-grade technology for unmatched performance.
          </motion.p>

          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {stats.map((stat, index) => (
              <MetallicCard key={index} className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-tech rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-void-black text-lg">{stat.icon}</span>
                </div>
                <div className="text-2xl font-bold text-chrome mb-1">{stat.value}</div>
                <div className="text-sm text-text-tertiary">{stat.label}</div>
              </MetallicCard>
            ))}
          </motion.div>
        </div>
      </section>

      <ChromeSeparator />

      {/* Feature Categories */}
      <section className="section-responsive">
        <div className="responsive-container">
          <SectionHeading
            title="Technology Capabilities"
            subtitle="Explore our comprehensive suite of advanced features and enterprise-grade infrastructure"
            align="center"
          />

          {/* Category Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {featureCategories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-3 px-6 py-3 rounded-lg transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-tech-cyan text-void-black'
                    : 'bg-glass-chrome text-text-secondary hover:text-tech-cyan'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{category.icon}</span>
                <span className="font-medium">{category.title}</span>
              </motion.button>
            ))}
          </div>

          {/* Active Features Display */}
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {activeFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <MetallicCard className="p-8 h-full">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-tech-cyan/20 to-chrome/20 rounded-lg flex items-center justify-center mr-4">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-heading font-bold text-chrome mb-2">
                        {feature.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-text-secondary mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-tech-cyan mb-3">Technologies</h4>
                    {feature.technologies.map((tech, techIndex) => (
                      <div key={techIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-tech-cyan" />
                        <span className="text-sm text-text-tertiary">{tech}</span>
                      </div>
                    ))}
                  </div>
                </MetallicCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <ChromeSeparator />

      {/* Technical Architecture */}
      <section className="section-responsive">
        <div className="responsive-container">
          <SectionHeading
            title="Enterprise Architecture"
            subtitle="Built on modern, scalable infrastructure designed for high-performance and reliability"
            align="center"
          />

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <MetallicCard className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-tech rounded-lg flex items-center justify-center">
                      <Server className="w-6 h-6 text-void-black" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-chrome">Microservices Architecture</h3>
                      <p className="text-text-tertiary">Scalable and maintainable system design</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-tech rounded-lg flex items-center justify-center">
                      <Database className="w-6 h-6 text-void-black" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-chrome">Advanced Data Layer</h3>
                      <p className="text-text-tertiary">PostgreSQL with intelligent caching</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-tech rounded-lg flex items-center justify-center">
                      <Lock className="w-6 h-6 text-void-black" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-chrome">Security Framework</h3>
                      <p className="text-text-tertiary">Multi-layer security implementation</p>
                    </div>
                  </div>
                </div>
              </MetallicCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <MetallicCard className="p-6">
                <h4 className="font-bold text-chrome mb-3">Performance Metrics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Response Time</span>
                    <span className="text-tech-cyan font-mono">&lt; 100ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Uptime SLA</span>
                    <span className="text-tech-cyan font-mono">99.99%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Concurrent Users</span>
                    <span className="text-tech-cyan font-mono">100K+</span>
                  </div>
                </div>
              </MetallicCard>

              <MetallicCard className="p-6">
                <h4 className="font-bold text-chrome mb-3">Technology Stack</h4>
                <div className="grid grid-cols-2 gap-3">
                  <MetallicBadge variant="tech" size="sm">Node.js</MetallicBadge>
                  <MetallicBadge variant="tech" size="sm">TypeScript</MetallicBadge>
                  <MetallicBadge variant="tech" size="sm">PostgreSQL</MetallicBadge>
                  <MetallicBadge variant="tech" size="sm">Redis</MetallicBadge>
                  <MetallicBadge variant="tech" size="sm">Docker</MetallicBadge>
                  <MetallicBadge variant="tech" size="sm">Kubernetes</MetallicBadge>
                </div>
              </MetallicCard>
            </motion.div>
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
                Experience Enterprise-Grade Career Technology
              </h2>
              <p className="text-responsive-lg text-text-secondary mb-8 max-w-2xl mx-auto">
                Join thousands of professionals leveraging our advanced platform to accelerate their careers
                with intelligent technology and data-driven insights.
              </p>
              <div className="flex-responsive-col gap-4 justify-center">
                <MetallicButton
                  variant="tech"
                  size="lg"
                  onClick={() => window.location.href = '/pricing'}
                >
                  Start Your Professional Journey
                </MetallicButton>
                <MetallicButton
                  variant="outline"
                  size="lg"
                  onClick={() => window.location.href = '/contact'}
                >
                  Schedule Enterprise Demo
                </MetallicButton>
              </div>
            </motion.div>
          </MetallicCard>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;

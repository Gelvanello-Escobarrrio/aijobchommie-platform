import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  MetallicCard, 
  MetallicButton, 
  SectionHeading, 
  MetallicStat, 
  MetallicBadge,
  MetallicFeaturesGrid,
  AmbientLighting,
  ChromeSeparator 
} from '../components/ui/MetallicComponents';
import '../styles/premium-theme.css';
import Logo from '../components/ui/Logo';

// Import icons from Lucide React
import { 
  Brain, 
  Target, 
  Zap, 
  Shield, 
  Globe, 
  Users, 
  Briefcase, 
  TrendingUp,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Award,
  Rocket,
  Lock,
  Clock,
  Sparkles,
  Map,
  MessageSquare,
  Database,
  Cpu,
  Menu,
  X,
  Flag,
  Heart,
  ChevronDown
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Parallax effects
  const parallaxY = useTransform(scrollY, [0, 500], [0, -150]);
  const parallaxRotate = useTransform(scrollY, [0, 500], [0, 360]);
  
  // Mouse tracking for ambient effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Features data
  const features = [
    {
      icon: <Brain />,
      title: "AI-Powered Matching",
      description: "Advanced machine learning algorithms analyze your skills and match you with perfect job opportunities in real-time."
    },
    {
      icon: <Target />,
      title: "Precision Targeting",
      description: "Our AI understands South African job market nuances, ensuring laser-focused job recommendations."
    },
    {
      icon: <Zap />,
      title: "Lightning Fast",
      description: "Get matched with relevant jobs in seconds, not hours. Our platform processes thousands of listings instantly."
    },
    {
      icon: <Shield />,
      title: "Enterprise Security",
      description: "Bank-level encryption protects your data. Your privacy and security are our top priorities."
    },
    {
      icon: <Globe />,
      title: "South African Focus",
      description: "Built specifically for the South African job market with local expertise and market insights."
    },
    {
      icon: <Users />,
      title: "Community Driven",
      description: "Join thousands of successful job seekers who've found their dream careers through our platform."
    }
  ];

  // Stats data
  const stats = [
    { value: "95%", label: "Success Rate", icon: <TrendingUp /> },
    { value: "10,000+", label: "Jobs Matched", icon: <Briefcase /> },
    { value: "5,000+", label: "Happy Users", icon: <Users /> },
    { value: "24/7", label: "AI Support", icon: <Clock /> }
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Sipho Mthembu",
      role: "Software Developer",
      company: "Cape Town Tech",
      content: "AI Job Chommie found me the perfect role in just 2 days. The AI matching is incredibly accurate!",
      rating: 5,
      image: "/api/placeholder/64/64"
    },
    {
      name: "Thandiwe Khumalo",
      role: "Data Analyst",
      company: "Johannesburg Finance",
      content: "Best job search platform I've ever used. The South African focus makes all the difference.",
      rating: 5,
      image: "/api/placeholder/64/64"
    },
    {
      name: "Michael van der Merwe",
      role: "Product Manager",
      company: "Durban Startup",
      content: "Found my dream job within a week. The AI recommendations were spot-on every time.",
      rating: 5,
      image: "/api/placeholder/64/64"
    }
  ];

  const FAQ = [
    {
      question: "How does the AI matching work?",
      answer: "Our advanced AI analyzes your skills, experience, and preferences to match you with relevant job opportunities. It learns from your interactions to improve recommendations over time."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use enterprise-grade encryption and security measures to protect your personal information. Your data is never shared without your explicit consent."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time through your account settings. We offer a full refund policy for the first 30 days."
    },
    {
      question: "Do you cover all South African provinces?",
      answer: "Yes, we cover job opportunities across all nine provinces of South Africa, with special focus on major economic hubs."
    }
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary relative overflow-hidden">
      {/* Ambient Lighting Effects */}
      <AmbientLighting />
      
      {/* Mouse-following spotlight */}
      <motion.div
        className="fixed pointer-events-none z-0"
        style={{
          left: mousePosition.x - 300,
          top: mousePosition.y - 300,
          width: 600,
          height: 600,
          background: `radial-gradient(circle, rgba(192, 192, 192, 0.1) 0%, transparent 70%)`,
          borderRadius: '50%',
          filter: 'blur(40px)',
          opacity: 0.6
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-panel-chrome border-b border-border-light safe-area-top">
        <div className="responsive-container p-responsive">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 bg-gradient-chrome rounded-lg flex items-center justify-center shadow-chrome">
                <Brain className="w-6 h-6 text-void-black" />
              </div>
              <span className="text-chrome text-xl font-heading font-bold">
                AI Job Chommie
              </span>
            </motion.div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-text-secondary hover:text-tech-cyan underline-effect transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-text-secondary hover:text-tech-cyan underline-effect transition-colors">
                Pricing
              </a>
              <a href="#testimonials" className="text-text-secondary hover:text-tech-cyan underline-effect transition-colors">
                Reviews
              </a>
              <a href="#faq" className="text-text-secondary hover:text-tech-cyan underline-effect transition-colors">
                FAQ
              </a>
              
              <MetallicButton 
                variant="tech" 
                size="sm"
                onClick={() => navigate('/pricing')}
              >
                Get Started
              </MetallicButton>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <MetallicButton 
                variant="ghost" 
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </MetallicButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-bg-primary/95 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="p-8 pt-24"
            >
              <div className="space-y-6">
                <a 
                  href="#features" 
                  className="block text-2xl font-heading text-text-primary hover:text-tech-cyan transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a 
                  href="#pricing" 
                  className="block text-2xl font-heading text-text-primary hover:text-tech-cyan transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </a>
                <a 
                  href="#testimonials" 
                  className="block text-2xl font-heading text-text-primary hover:text-tech-cyan transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Reviews
                </a>
                <a 
                  href="#faq" 
                  className="block text-2xl font-heading text-text-primary hover:text-tech-cyan transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  FAQ
                </a>
                <div className="pt-4">
                  <MetallicButton 
                    variant="tech" 
                    size="lg"
                    fullWidth
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/pricing');
                    }}
                  >
                    Get Started
                  </MetallicButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="hero-responsive flex items-center justify-center relative safe-area-top">
        <motion.div 
          className="responsive-container text-center z-10"
          style={{ y: parallaxY }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <MetallicBadge variant="chrome" animated>
              <Sparkles className="w-4 h-4 mr-2" />
              Powered by Advanced AI
            </MetallicBadge>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            className="text-responsive-3xl font-heading font-black mb-6 text-chrome leading-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Find Your
            <br />
            <span className="bg-gradient-tech bg-clip-text text-transparent">
              Dream Job
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-responsive-lg text-text-secondary max-w-3xl mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            AI Job Chommie is your intelligent companion for navigating the South African job market. 
            Get matched with perfect opportunities using advanced AI technology.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex-responsive-col gap-4 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <MetallicButton 
              variant="tech" 
              size="lg"
              onClick={() => navigate('/pricing')}
              icon={<Rocket />}
              iconPosition="right"
              className="min-w-48"
            >
              Start Free Trial
            </MetallicButton>
            
            <MetallicButton 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/jobs')}
              icon={<Play />}
              className="min-w-48"
            >
              Watch Demo
            </MetallicButton>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex items-center justify-center space-x-8 text-text-tertiary text-sm"
          >
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Bank-Level Security</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span>Industry Leading</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>5,000+ Users</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-1/4 left-10 w-64 h-64 opacity-10"
          style={{ rotate: parallaxRotate }}
        >
          <div className="w-full h-full border border-border-light rounded-full"></div>
        </motion.div>
        
        <motion.div
          className="absolute bottom-1/4 right-10 w-32 h-32 opacity-10"
          style={{ rotate: parallaxRotate, rotateDirection: 'reverse' }}
        >
          <div className="w-full h-full border border-tech-cyan rounded-lg rotate-45"></div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="section-responsive bg-gradient-to-b from-transparent to-bg-secondary">
        <div className="responsive-container">
          <motion.div
            className="grid-responsive-4 gap-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <MetallicStat
                  value={stat.value}
                  label={stat.label}
                  icon={stat.icon}
                  animated={false}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-responsive">
        <div className="responsive-container">
          <SectionHeading
            title="Revolutionary AI Technology"
            subtitle="Experience the future of job searching with our cutting-edge artificial intelligence platform designed specifically for South African professionals."
            align="center"
          />
          
          <MetallicFeaturesGrid features={features} />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-responsive bg-gradient-to-b from-bg-secondary to-transparent">
        <div className="responsive-container">
          <SectionHeading
            title="How It Works"
            subtitle="Get started in just 3 simple steps and let our AI do the heavy lifting for your job search."
            align="center"
          />
          
          <div className="grid-responsive-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Create Your Profile",
                description: "Upload your CV and tell us about your career goals. Our AI analyzes your background instantly.",
                icon: <Users className="w-8 h-8" />
              },
              {
                step: "02", 
                title: "AI Matching",
                description: "Our advanced algorithms scan thousands of jobs and find perfect matches based on your profile.",
                icon: <Cpu className="w-8 h-8" />
              },
              {
                step: "03",
                title: "Get Hired",
                description: "Apply to curated job matches with one click and track your applications in real-time.",
                icon: <Award className="w-8 h-8" />
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <MetallicCard className="text-center h-full">
                  <div className="relative mb-6">
                    <div className="text-tech-cyan mb-4">{item.icon}</div>
                    <div className="text-6xl font-heading font-black text-chrome opacity-20 absolute -top-8 left-1/2 transform -translate-x-1/2">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-4">{item.title}</h3>
                  <p className="text-text-secondary">{item.description}</p>
                </MetallicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="section-responsive">
        <div className="responsive-container">
          <SectionHeading
            title="Success Stories"
            subtitle="Join thousands of South Africans who've accelerated their careers with AI Job Chommie."
            align="center"
          />
          
          <div className="grid-responsive-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <MetallicCard glow="medium" className="h-full">
                  {/* Rating Stars */}
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-tech-cyan fill-current" />
                    ))}
                  </div>
                  
                  {/* Testimonial Content */}
                  <blockquote className="text-text-secondary mb-6 italic">
                    "{testimonial.content}"
                  </blockquote>
                  
                  {/* Author */}
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-chrome rounded-full flex items-center justify-center text-void-black font-bold mr-4">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-text-primary">{testimonial.name}</div>
                      <div className="text-sm text-text-tertiary">{testimonial.role} at {testimonial.company}</div>
                    </div>
                  </div>
                </MetallicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section id="pricing" className="section-responsive bg-gradient-to-b from-transparent to-bg-secondary">
        <div className="responsive-container">
          <SectionHeading
            title="Simple, Transparent Pricing"
            subtitle="Choose the plan that fits your career goals. All plans include our advanced AI matching technology."
            align="center"
          />
          
          <div className="grid-responsive-3 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <MetallicCard className="text-center relative">
              <MetallicBadge variant="muted" className="mb-4">Basic</MetallicBadge>
              <div className="text-4xl font-heading font-bold text-chrome mb-2">Free</div>
              <div className="text-text-tertiary mb-6">Forever</div>
              
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-state-success mr-3" />
                  <span className="text-text-secondary">5 AI job matches/day</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-state-success mr-3" />
                  <span className="text-text-secondary">Basic profile setup</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-state-success mr-3" />
                  <span className="text-text-secondary">Email notifications</span>
                </li>
              </ul>
              
              <MetallicButton variant="outline" fullWidth>
                Get Started Free
              </MetallicButton>
            </MetallicCard>

            {/* Pro Plan */}
            <MetallicCard className="text-center relative border-glow" glow="intense">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <MetallicBadge variant="tech" animated>Most Popular</MetallicBadge>
              </div>
              
              <MetallicBadge variant="chrome" className="mb-4 mt-2">Professional</MetallicBadge>
              <div className="text-4xl font-heading font-bold text-chrome mb-2">R149</div>
              <div className="text-text-tertiary mb-6">per month</div>
              
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-state-success mr-3" />
                  <span className="text-text-secondary">Unlimited AI matches</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-state-success mr-3" />
                  <span className="text-text-secondary">Advanced profile analytics</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-state-success mr-3" />
                  <span className="text-text-secondary">Priority support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-state-success mr-3" />
                  <span className="text-text-secondary">Application tracking</span>
                </li>
              </ul>
              
              <MetallicButton variant="tech" fullWidth>
                Start Free Trial
              </MetallicButton>
            </MetallicCard>

            {/* Enterprise Plan */}
            <MetallicCard className="text-center relative">
              <MetallicBadge variant="default" className="mb-4">Enterprise</MetallicBadge>
              <div className="text-4xl font-heading font-bold text-chrome mb-2">Custom</div>
              <div className="text-text-tertiary mb-6">Contact us</div>
              
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-state-success mr-3" />
                  <span className="text-text-secondary">Everything in Pro</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-state-success mr-3" />
                  <span className="text-text-secondary">Custom integrations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-state-success mr-3" />
                  <span className="text-text-secondary">Dedicated support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-state-success mr-3" />
                  <span className="text-text-secondary">Team management</span>
                </li>
              </ul>
              
              <MetallicButton variant="secondary" fullWidth>
                Contact Sales
              </MetallicButton>
            </MetallicCard>
          </div>
        </div>
      </section>

      {/* South African Pride Section */}
      <section className="section-responsive">
        <div className="responsive-container">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center mb-8">
                <Map className="w-8 h-8 text-tech-cyan mr-3" />
                <h2 className="text-4xl font-heading font-bold text-chrome">
                  Built for South Africa
                </h2>
              </div>
              
              <p className="text-responsive-lg text-text-secondary mb-8 leading-relaxed">
                We understand the unique challenges and opportunities of the South African job market. 
                Our AI is trained specifically on local industry trends, salary expectations, and career paths.
              </p>
              
              <div className="flex flex-wrap justify-center items-center gap-8 text-text-tertiary">
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-chrome">9</div>
                  <div className="text-sm">Provinces Covered</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-chrome">11</div>
                  <div className="text-sm">Official Languages</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-chrome">100+</div>
                  <div className="text-sm">Industry Sectors</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-chrome">24/7</div>
                  <div className="text-sm">Local Support</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="section-responsive bg-gradient-to-b from-bg-secondary to-transparent">
        <div className="responsive-container">
          <SectionHeading
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about AI Job Chommie and how it can accelerate your career."
            align="center"
          />
          
          <div className="max-w-3xl mx-auto space-y-4">
            {FAQ.map((item, index) => (
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
                      <h3 className="font-heading font-semibold text-lg">{item.question}</h3>
                      <ArrowRight className="w-5 h-5 text-tech-cyan transition-transform group-open:rotate-90" />
                    </summary>
                    <div className="mt-4 pt-4 border-t border-border-light">
                      <p className="text-text-secondary">{item.answer}</p>
                    </div>
                  </details>
                </MetallicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section-responsive bg-gradient-to-t from-bg-secondary to-transparent">
        <div className="responsive-container">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-responsive-2xl font-heading font-black text-chrome mb-6">
              Ready to Accelerate Your Career?
            </h2>
            
            <p className="text-responsive-lg text-text-secondary mb-8">
              Join thousands of South Africans who've found their dream jobs with AI Job Chommie. 
              Start your free trial today and experience the future of job searching.
            </p>
            
            <div className="flex-responsive-col gap-4 justify-center items-center">
              <MetallicButton 
                variant="tech" 
                size="lg"
                onClick={() => navigate('/pricing')}
                icon={<Sparkles />}
                iconPosition="right"
                className="min-w-56"
              >
                Start Free Trial Now
              </MetallicButton>
              
              <MetallicButton 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/contact')}
                icon={<MessageSquare />}
                className="min-w-56"
              >
                Talk to Our Team
              </MetallicButton>
            </div>
            
            <p className="text-sm text-text-tertiary mt-6">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-light bg-bg-secondary safe-area-bottom">
        <div className="responsive-container py-12">
          <div className="grid-responsive-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <Logo size="md" />
                <div className="w-10 h-10 bg-gradient-chrome rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-void-black" />
                </div>
                <span className="text-chrome text-lg font-heading font-bold">
                  AI Job Chommie
                </span>
              </div>
              <p className="text-text-secondary mb-4 max-w-md">
                The intelligent job search platform built specifically for South African professionals. 
                Find your dream career with the power of AI.
              </p>
              <div className="flex items-center space-x-4">
                <MetallicBadge variant="tech">AI Powered</MetallicBadge>
                <MetallicBadge variant="default">South African</MetallicBadge>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="font-heading font-semibold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><a href="/jobs" className="text-text-secondary hover:text-tech-cyan underline-effect">Browse Jobs</a></li>
                <li><a href="/dashboard" className="text-text-secondary hover:text-tech-cyan underline-effect">Dashboard</a></li>
                <li><a href="/profile" className="text-text-secondary hover:text-tech-cyan underline-effect">Profile</a></li>
                <li><a href="/applications" className="text-text-secondary hover:text-tech-cyan underline-effect">Applications</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="font-heading font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="/contact" className="text-text-secondary hover:text-tech-cyan underline-effect">Contact Us</a></li>
                <li><a href="/about" className="text-text-secondary hover:text-tech-cyan underline-effect">About</a></li>
                <li><a href="/privacy" className="text-text-secondary hover:text-tech-cyan underline-effect">Privacy</a></li>
                <li><a href="/terms" className="text-text-secondary hover:text-tech-cyan underline-effect">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <ChromeSeparator className="my-8" />
          
          <div className="flex-responsive-row items-center justify-between">
            <p className="text-text-tertiary text-sm">
              <span className="flex items-center justify-center md:justify-start gap-2">
                © 2024 AI Job Chommie. All rights reserved. Made with
                <Heart className="w-4 h-4 text-red-500" />
                in South Africa
                <Flag className="w-4 h-4 text-green-500" />
              </span>
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <MetallicBadge variant="tech" size="sm">Enterprise Ready</MetallicBadge>
              <MetallicBadge variant="chrome" size="sm">ISO Certified</MetallicBadge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

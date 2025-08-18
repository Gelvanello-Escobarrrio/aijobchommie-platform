import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Brain, Cpu, Zap, Globe, Shield, TrendingUp, Users, Target, MapPin, Activity, Star, ArrowRight, Play, CheckCircle, Network, Bot, Briefcase, Menu, X } from 'lucide-react';

const LandingPage = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({ users: 0, jobs: 0, success: 0, companies: 0 });

  // Animate stats on load
  useEffect(() => {
    const targetStats = { users: 15247, jobs: 4821, success: 96, companies: 1240 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setStats({
        users: Math.floor((targetStats.users * step) / steps),
        jobs: Math.floor((targetStats.jobs * step) / steps),
        success: Math.floor((targetStats.success * step) / steps),
        companies: Math.floor((targetStats.companies * step) / steps)
      });
      
      if (step >= steps) clearInterval(timer);
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const testimonials = [
    {
      name: "Thabo Mthembu",
      role: "Software Developer",
      location: "Johannesburg",
      content: "AI Job Chommie found me the perfect tech job in just 2 weeks! The AI matching is incredible - it understood exactly what I was looking for.",
      rating: 5,
      avatar: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3e%3ccircle cx='50' cy='50' r='50' fill='%2300ffff'/%3e%3ctext x='50' y='55' font-family='Arial' font-size='40' fill='%23000' text-anchor='middle' dy='.3em'%3eTM%3c/text%3e%3c/svg%3e"
    },
    {
      name: "Nomsa Dlamini",
      role: "Marketing Manager",
      location: "Cape Town",
      content: "The premium features are worth every rand! Real-time job alerts and AI resume optimization helped me land my dream job.",
      rating: 5,
      avatar: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3e%3ccircle cx='50' cy='50' r='50' fill='%23ff6b35'/%3e%3ctext x='50' y='55' font-family='Arial' font-size='40' fill='%23fff' text-anchor='middle' dy='.3em'%3eND%3c/text%3e%3c/svg%3e"
    },
    {
      name: "Michael van der Merwe",
      role: "Project Manager",
      location: "Durban",
      content: "As someone who was unemployed for 6 months, AI Job Chommie was a lifesaver. The platform is intuitive and the job matches are spot-on!",
      rating: 5,
      avatar: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3e%3ccircle cx='50' cy='50' r='50' fill='%238b5cf6'/%3e%3ctext x='50' y='55' font-family='Arial' font-size='40' fill='%23fff' text-anchor='middle' dy='.3em'%3eMV%3c/text%3e%3c/svg%3e"
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "Neural Job Matching",
      description: "Our advanced AI neural networks analyze millions of data points to find jobs that perfectly match your skills, experience, and career aspirations."
    },
    {
      icon: Cpu,
      title: "Real-Time Processing",
      description: "Lightning-fast job alerts powered by our distributed computing infrastructure. Get notified within seconds of new opportunities."
    },
    {
      icon: Network,
      title: "Smart Resume Optimization",
      description: "AI-driven resume analysis and optimization that adapts your profile to match employer requirements and ATS systems."
    },
    {
      icon: Activity,
      title: "Predictive Analytics",
      description: "Machine learning models predict job market trends, salary ranges, and success probabilities for better career decisions."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption and verification systems ensure your data is protected and all employers are legitimate."
    },
    {
      icon: Bot,
      title: "AI Career Assistant",
      description: "24/7 intelligent chatbot provides personalized career advice, interview tips, and guidance throughout your job search journey."
    }
  ];

  const provinces = [
    { name: "Gauteng", jobs: 1234, color: "from-cyan-400 to-blue-500" },
    { name: "Western Cape", jobs: 987, color: "from-purple-400 to-pink-500" },
    { name: "KwaZulu-Natal", jobs: 756, color: "from-green-400 to-emerald-500" },
    { name: "Eastern Cape", jobs: 432, color: "from-orange-400 to-red-500" },
    { name: "Mpumalanga", jobs: 321, color: "from-yellow-400 to-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-slate-900" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                AI Job Chommie
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/jobs" className="nav-link">Jobs</Link>
              <Link to="/pricing" className="nav-link">Pricing</Link>
              <Link to="/about" className="nav-link">About</Link>
              <Link to="/contact" className="nav-link">Contact</Link>
              <Link to="/jobs" className="btn-primary text-sm">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI-Powered Job Search Platform
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  Find Your Dream Job in
                  <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                    South Africa 🇿🇦
                  </span>
                </h1>
                <p className="text-xl text-slate-300 leading-relaxed">
                  Join thousands of South Africans who have found their perfect jobs using our AI-powered platform. 
                  From entry-level positions to executive roles across all 9 provinces.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link to="/jobs" className="btn-primary text-lg px-8 py-4 group">
                  Start Job Search
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button
                  onClick={() => setShowVideo(true)}
                  className="btn-secondary text-lg px-8 py-4 group"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-700/50"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400">{stats.users.toLocaleString()}+</div>
                  <div className="text-slate-400">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">{stats.jobs.toLocaleString()}+</div>
                  <div className="text-slate-400">Jobs Posted</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">{stats.success}%</div>
                  <div className="text-slate-400">Success Rate</div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-3xl" />
                <div className="relative space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Job Recommendations</h3>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  </div>
                  {[
                    { title: "Senior React Developer", company: "Takealot", location: "Cape Town", salary: "R45,000 - R65,000", match: "95%" },
                    { title: "Marketing Manager", company: "Discovery", location: "Johannesburg", salary: "R35,000 - R50,000", match: "89%" },
                    { title: "Data Analyst", company: "Standard Bank", location: "Remote", salary: "R28,000 - R40,000", match: "84%" }
                  ].map((job, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.2 }}
                      className="card p-4 space-y-2 hover:scale-105 cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className="font-semibold text-white">{job.title}</h4>
                          <p className="text-slate-400 text-sm">{job.company} • {job.location}</p>
                          <p className="text-green-400 text-sm font-medium">{job.salary}/month</p>
                        </div>
                        <div className="text-right">
                          <div className="text-cyan-400 font-bold text-sm">{job.match} match</div>
                          <div className="w-12 h-2 bg-slate-700 rounded-full mt-1">
                            <div className="h-full bg-gradient-to-r from-cyan-400 to-green-400 rounded-full" style={{ width: job.match }} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose AI Job Chommie?</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              We leverage cutting-edge AI technology to revolutionize how South Africans find jobs. 
              Our platform is designed specifically for the local market.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card group hover:bg-slate-700/50 cursor-pointer"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-slate-900" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-slate-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Affordable Plans for Everyone</h2>
            <p className="text-xl text-slate-300">
              Start your job search journey for less than the cost of a taxi ride
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Basic Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="card relative"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Basic Plan</h3>
                <div className="text-4xl font-bold text-cyan-400 mb-2">R8<span className="text-lg text-slate-400">/month</span></div>
                <p className="text-slate-300">Perfect for getting started</p>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Apply to 20 jobs per month",
                  "Basic AI job matching",
                  "Weekly job alerts",
                  "Standard profile visibility",
                  "Resume upload & storage",
                  "Email support"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/pricing" className="btn-secondary w-full text-center">
                Get Started
              </Link>
            </motion.div>

            {/* Premium Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card relative border-cyan-500/50 bg-gradient-to-br from-slate-800 to-cyan-900/20"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Premium Plan</h3>
                <div className="text-4xl font-bold text-cyan-400 mb-2">R17<span className="text-lg text-slate-400">/month</span></div>
                <p className="text-slate-300">For serious job seekers</p>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Unlimited job applications",
                  "Advanced AI recommendations",
                  "Real-time job alerts",
                  "2x profile visibility",
                  "AI resume optimization",
                  "Career insights & analytics",
                  "Priority WhatsApp support",
                  "Interview preparation tools"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/pricing" className="btn-primary w-full text-center group">
                Upgrade to Premium
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-slate-300">
              Hear from South Africans who found their dream jobs through our platform
            </p>
          </div>
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="card max-w-4xl mx-auto text-center p-8"
              >
                <div className="flex items-center justify-center mb-6">
                  <img 
                    src={testimonials[activeTestimonial].avatar} 
                    alt={testimonials[activeTestimonial].name}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div className="text-left">
                    <h4 className="font-semibold text-xl">{testimonials[activeTestimonial].name}</h4>
                    <p className="text-slate-400">{testimonials[activeTestimonial].role}</p>
                    <div className="flex items-center mt-1">
                      <MapPin className="w-4 h-4 text-slate-400 mr-1" />
                      <span className="text-sm text-slate-400">{testimonials[activeTestimonial].location}</span>
                    </div>
                  </div>
                </div>
                <blockquote className="text-2xl text-slate-300 italic mb-6 leading-relaxed">
                  "{testimonials[activeTestimonial].content}"
                </blockquote>
                <div className="flex justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-center space-x-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    activeTestimonial === index ? 'bg-cyan-400' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Provincial Coverage */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Jobs Across All 9 Provinces</h2>
            <p className="text-xl text-slate-300">
              From Cape Town to Polokwane - find opportunities anywhere in South Africa
            </p>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {provinces.map((province, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card text-center group hover:scale-105 cursor-pointer"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${province.color} rounded-full mx-auto mb-4 flex items-center justify-center group-hover:rotate-12 transition-transform`}>
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{province.name}</h3>
                <p className="text-2xl font-bold text-cyan-400">{province.jobs}</p>
                <p className="text-slate-400 text-sm">Active Jobs</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <h2 className="text-5xl font-bold leading-tight">
              Ready to Transform
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Your Career?
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Join thousands of South Africans who have already found their dream jobs. 
              Start your journey today with our AI-powered job matching platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/jobs" className="btn-primary text-lg px-8 py-4 group">
                Start Your Job Search
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/pricing" className="btn-secondary text-lg px-8 py-4">
                View Pricing Plans
              </Link>
            </div>
            <p className="text-sm text-slate-400">
              No credit card required • Start with our free plan • Upgrade anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-slate-900" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  AI Job Chommie
                </span>
              </div>
              <p className="text-slate-400">
                South Africa's leading AI-powered job search platform. 
                Connecting talent with opportunity across all 9 provinces.
              </p>
              <div className="text-sm text-slate-500">
                🇿🇦 Made in South Africa with ❤️
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link to="/jobs" className="hover:text-cyan-400 transition-colors">Find Jobs</Link></li>
                <li><Link to="/pricing" className="hover:text-cyan-400 transition-colors">Pricing</Link></li>
                <li><Link to="/about" className="hover:text-cyan-400 transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-cyan-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link to="/help" className="hover:text-cyan-400 transition-colors">Help Center</Link></li>
                <li><Link to="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</Link></li>
                <li><Link to="/refund" className="hover:text-cyan-400 transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="mailto:support@aijobchommie.co.za" className="hover:text-cyan-400 transition-colors">support@aijobchommie.co.za</a></li>
                <li><a href="tel:+27123456789" className="hover:text-cyan-400 transition-colors">+27 12 345 6789</a></li>
                <li><span>WhatsApp Support Available</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700/50 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 AI Job Chommie. All rights reserved. Empowering South African careers with AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;


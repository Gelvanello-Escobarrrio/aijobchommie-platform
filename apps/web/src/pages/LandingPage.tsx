import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  Brain,
  Flag,
  Flame,
  Heart,
  Lock,
  Rocket,
  Shield,
  Star,
  TrendingUp,
  Zap
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import metallic components
import {
  ChromeSeparator,
  MetallicBadge,
  MetallicButton,
  MetallicCard,
  SectionHeading
} from '../components/ui/MetallicComponents';
import LandingHero from '../components/LandingHero';

// Import premium theme and animations
import '../styles/micro-interactions.css';
import '../styles/premium-theme.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, velocity: number}>>([]);
  

  // Explosive entry animation
  useEffect(() => {
    setIsVisible(true);
    // Generate floating particles
    const newParticles = Array.from({length: 50}, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      velocity: Math.random() * 2 + 1
    }));
    setParticles(newParticles);
  }, []);

  // Dynamic word rotation for attention (moved into LandingHero)

  // Advanced parallax and mouse tracking
  const parallaxY = useTransform(scrollY, [0, 1000], [0, -400]);
  const parallaxRotate = useTransform(scrollY, [0, 1000], [0, 720]);
  const scaleEffect = useTransform(scrollY, [0, 500], [1, 1.5]);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      setMousePosition({ x: clientX, y: clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Reference these variables to avoid no-unused-vars errors in strict TS config
  // They are used for future interactive UI features.
  void mousePosition;
  void isVisible;
  void parallaxY;
  void parallaxRotate;
  void scaleEffect;

  // Explosive stats moved into LandingHero

  // Mind-blowing features that grab attention
  const mindBlowingFeatures = [
    {
      icon: <Brain className="w-12 h-12" />,
      title: "AI MIND READER",
      description: "Our AI reads your career DNA and serves you jobs before you even think about them. It's not matching - it's MIND READING.",
      impact: "300% Faster Job Discovery",
      color: "from-purple-600 via-blue-600 to-cyan-500",
      animation: "animate-pulse"
    },
    {
      icon: <Rocket className="w-12 h-12" />,
      title: "CAREER CATAPULT",
      description: "Don't just find a job - LAUNCH your career into the stratosphere. Our platform doesn't just match, it CATAPULTS.",
      impact: "500% Salary Increase Potential",
      color: "from-red-500 via-pink-500 to-purple-600",
      animation: "animate-bounce"
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "LIGHTNING DOMINATION",
      description: "While others crawl, you'll TELEPORT to your dream job. Faster than light, more powerful than the competition.",
      impact: "Instant Job Conquest",
      color: "from-yellow-400 via-orange-500 to-red-600",
      animation: "animate-spin"
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "FORTRESS SECURITY",
      description: "Your data is locked in a digital FORTRESS that would make banks jealous. Enterprise-grade protection meets AI brilliance.",
      impact: "Military-Grade Protection",
      color: "from-gray-600 via-gray-800 to-black",
      animation: "animate-pulse"
    }
  ];

  // Testimonials that scream success
  const powerTestimonials = [
    {
      name: "Thabo 'The Transformer' Mthembu",
      role: "From Unemployed to CEO",
      company: "TechCorp SA",
      content: "Job Chommie didn't just find me a job - it TRANSFORMED my entire existence! From zero to CEO in 6 months. This is PURE MAGIC!",
      salaryJump: "R0 → R500K/month",
      avatar: "",
      rating: 5,
      effect: "LIFE CHANGED FOREVER"
    },
    {
      name: "Nomsa 'The Conqueror' Khumalo",
      role: "Data Science Empress",
      company: "AI Revolution Inc",
      content: "I didn't just get hired - I CONQUERED the tech industry! Job Chommie's AI saw my potential before I did. MIND-BLOWING!",
      salaryJump: "R25K → R200K/month",
      avatar: "",
      rating: 5,
      effect: "INDUSTRY DOMINATION"
    },
    {
      name: "Michael 'The Legend' van der Merwe",
      role: "Product Visionary",
      company: "Future Dynamics",
      content: "Job Chommie turned me into a LEGEND! The AI matching is so powerful, it's almost supernatural. PURE BRILLIANCE!",
      salaryJump: "R40K → R300K/month",
      avatar: "",
      rating: 5,
      effect: "LEGENDARY STATUS ACHIEVED"
    }
  ];

  return (
    <div className="min-h-screen bg-void-black text-text-primary overflow-x-hidden relative">
      {/* EXPLOSIVE Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated Gradient Orbs */}
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-cyan-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            x: [0, 100, 0],
            y: [0, -100, 0]
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-red-600/20 via-pink-600/20 to-orange-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            x: [0, -100, 0],
            y: [0, 100, 0]
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />

        {/* Floating Particles */}
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-tech-cyan rounded-full opacity-60"
            style={{ left: particle.x, top: particle.y }}
            animate={{
              y: [particle.y, particle.y - 500, particle.y],
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: particle.velocity * 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

  {/* Replace the large inline hero with the centralized LandingHero component */}
  <LandingHero />

      {/* MIND-BLOWING Features Section */}
      <section className="section-responsive bg-gradient-to-b from-void-black to-bg-secondary/50 relative overflow-hidden">
        <div className="responsive-container">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-20"
          >
            <h2 className="text-7xl font-heading font-black text-chrome mb-8">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-blue-500">
                SUPERNATURAL
              </span> POWERS
            </h2>
            <p className="text-3xl text-text-secondary max-w-4xl mx-auto font-bold">
              Experience technology so advanced, it's basically <span className="text-tech-cyan">MAGIC</span>
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {mindBlowingFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.3, duration: 0.8 }}
                whileHover={{ scale: 1.05, rotate: Math.random() * 4 - 2 }}
              >
                <MetallicCard
                  className={`h-full p-12 group cursor-pointer overflow-hidden relative border-4 border-transparent bg-gradient-to-br ${feature.color}`}
                  interactive
                  glow="intense"
                >
                  {/* Animated Icon */}
                  <div className={`w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-125 transition-all duration-500 ${feature.animation}`}>
                    <div className="text-white">{feature.icon}</div>
                  </div>

                  <h3 className="text-4xl font-heading font-black text-white mb-6 tracking-wider">
                    {feature.title}
                  </h3>

                  <p className="text-white/90 mb-8 leading-relaxed text-xl font-medium">
                    {feature.description}
                  </p>

                  {/* Impact Badge */}
                  <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-6 h-6 text-white" />
                      <span className="text-white font-black text-lg">{feature.impact}</span>
                    </div>
                  </div>

                  {/* Hover Explosion Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </MetallicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LEGENDARY Success Stories */}
      <section className="section-responsive bg-gradient-to-b from-bg-secondary/50 to-void-black">
        <div className="responsive-container">
          <SectionHeading
            title="LEGENDARY SUCCESS STORIES"
            subtitle="Real people who became LEGENDS with Job Chommie"
            centered
          />

          <div className="grid lg:grid-cols-3 gap-8">
            {powerTestimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.3, type: "spring", stiffness: 200 }}
                whileHover={{ y: -15, scale: 1.05 }}
              >
                <MetallicCard className="p-10 h-full relative overflow-hidden border-4 border-gold bg-gradient-to-br from-yellow-600/20 to-orange-600/20">
                  {/* Legendary Badge */}
                  <div className="absolute top-6 right-6">
                    <div className="bg-gradient-to-r from-gold to-yellow-500 text-black px-4 py-2 rounded-full font-black text-sm">
                      {testimonial.effect}
                    </div>
                  </div>

                  {/* Avatar & Stars */}
                  <div className="text-center mb-8">
                    <div className="text-6xl mb-4">{testimonial.avatar}</div>
                    <div className="flex justify-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 text-yellow-400 fill-current animate-pulse" />
                      ))}
                    </div>
                  </div>

                  {/* Profile */}
                  <div className="text-center mb-8">
                    <h4 className="font-heading font-black text-chrome text-2xl mb-2">{testimonial.name}</h4>
                    <p className="text-text-tertiary text-lg font-bold">{testimonial.role}</p>
                    <p className="text-tech-cyan font-bold text-lg">{testimonial.company}</p>
                  </div>

                  {/* Quote */}
                  <blockquote className="text-text-secondary mb-8 italic leading-relaxed text-lg font-medium text-center">
                    "{testimonial.content}"
                  </blockquote>

                  {/* Salary Jump */}
                  <div className="bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-2xl p-6 text-center">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <TrendingUp className="w-8 h-8 text-green-400" />
                      <span className="text-green-300 font-black text-xl">SALARY EXPLOSION:</span>
                    </div>
                    <div className="text-green-400 font-black text-2xl">{testimonial.salaryJump}</div>
                  </div>
                </MetallicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL EXPLOSIVE CTA */}
      <section className="section-responsive bg-gradient-to-br from-void-black via-purple-900/20 to-void-black relative overflow-hidden">
        {/* Mega Background Effects */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-red-600/30 via-purple-600/30 to-blue-600/30 rounded-full blur-3xl"
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 30, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tl from-green-600/30 via-cyan-600/30 to-purple-600/30 rounded-full blur-3xl"
            animate={{ rotate: -360, scale: [1.2, 1, 1.2] }}
            transition={{ duration: 25, repeat: Infinity }}
          />
        </div>

        <div className="responsive-container relative z-10">
          <motion.div
            className="text-center max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-8xl font-heading font-black text-chrome mb-12 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-blue-500">
                READY TO BECOME
              </span>
              <br />
              <span className="text-tech-cyan">UNSTOPPABLE?</span>
            </h2>

            <p className="text-3xl text-text-secondary mb-16 leading-relaxed font-bold">
              Stop being ordinary. Stop settling for less.
              <span className="text-tech-cyan font-black text-4xl"> DOMINATE </span>
              the South African job market with AI superpowers that make you
              <span className="text-purple-400 font-black text-4xl"> LEGENDARY</span>!
            </p>

            {/* Mega CTA Button */}
            <motion.div
              className="relative mb-16"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-purple-600 to-blue-500 rounded-full blur-2xl opacity-75 animate-pulse scale-110"></div>
              <MetallicButton
                variant="tech"
                size="xl"
                onClick={() => navigate('/auth/signup')}
                icon={<Flame className="w-10 h-10" />}
                iconPosition="right"
                className="relative min-w-[600px] text-3xl py-12 px-20 font-black tracking-widest shadow-2xl border-4 border-tech-cyan"
              >
                 UNLEASH MY CAREER DESTINY 
              </MetallicButton>
            </motion.div>

            <p className="text-text-tertiary text-xl font-bold">
               ZERO COST • INFINITE POWER • LEGENDARY RESULTS • WORLD DOMINATION 
            </p>
          </motion.div>
        </div>
      </section>

      {/* UPDATED Footer with 2025 */}
      <footer className="border-t-4 border-tech-cyan bg-void-black safe-area-bottom">
        <div className="responsive-container py-16">
          <div className="grid-responsive-4 gap-12">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <motion.div
                className="flex items-center space-x-4 mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-tech-cyan to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-tech-cyan/50">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <span className="text-chrome text-3xl font-heading font-black tracking-wider">
                  JOB CHOMMIE
                </span>
              </motion.div>

              <p className="text-text-secondary mb-6 max-w-md leading-relaxed text-lg font-medium">
                The most POWERFUL AI-driven career domination platform ever created for South African legends.
                Transform your career destiny with supernatural technology.
              </p>

              <div className="flex flex-wrap gap-4 mb-6">
                <MetallicBadge variant="tech" className="text-lg px-4 py-2"> AI POWERED</MetallicBadge>
                <MetallicBadge variant="chrome" className="text-lg px-4 py-2"> WORLD-CLASS</MetallicBadge>
                <MetallicBadge variant="default" className="text-lg px-4 py-2"> FORTRESS SECURE</MetallicBadge>
              </div>

              <div className="bg-gradient-to-r from-tech-cyan/20 to-purple-600/20 rounded-lg p-6 border border-tech-cyan/30">
                <p className="text-center text-tech-cyan font-bold text-lg">
                   Engineered by <span className="text-chrome font-black">Fernando Steyn</span> 
                  <br />
                  <span className="text-white text-xl font-black">Making South African careers LEGENDARY with AI</span>
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-heading font-black text-chrome mb-6 text-2xl">DOMINATION HUB</h4>
              <ul className="space-y-4">
                {[
                  { name: ' CONQUER JOBS', href: '/jobs' },
                  { name: ' COMMAND CENTER', href: '/dashboard' },
                  { name: ' PROFILE POWER', href: '/profile' },
                  { name: ' VICTORY TRACKER', href: '/applications' }
                ].map((link) => (
                  <li key={link.name}>
                    <motion.a
                      href={link.href}
                      className="text-text-secondary hover:text-tech-cyan transition-all duration-300 flex items-center gap-3 font-bold text-lg"
                      whileHover={{ x: 10, scale: 1.05 }}
                    >
                      <ArrowRight className="w-5 h-5" />
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-heading font-black text-chrome mb-6 text-2xl">SUPPORT FORTRESS</h4>
              <ul className="space-y-4">
                {[
                  { name: ' HELP STRONGHOLD', href: '/help' },
                  { name: ' CONTACT LEGENDS', href: '/contact' },
                  { name: ' ABOUT POWER', href: '/about' },
                  { name: ' PRIVACY SHIELD', href: '/privacy' },
                  { name: ' TERMS OF POWER', href: '/terms' }
                ].map((link) => (
                  <li key={link.name}>
                    <motion.a
                      href={link.href}
                      className="text-text-secondary hover:text-tech-cyan transition-all duration-300 flex items-center gap-3 font-bold text-lg"
                      whileHover={{ x: 10, scale: 1.05 }}
                    >
                      <ArrowRight className="w-5 h-5" />
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <ChromeSeparator className="my-12" />

          <div className="flex-responsive-row items-center justify-between">
            <motion.p
              className="text-text-tertiary"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <span className="flex items-center justify-center md:justify-start gap-4 text-xl font-bold">
                 2025 AI Job Chommie. All rights reserved. Forged with
                <Heart className="w-6 h-6 text-red-500 animate-pulse" />
                in South Africa
                <Flag className="w-6 h-6 text-green-500" />
              </span>
            </motion.p>

            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <MetallicBadge variant="tech" size="lg" className="px-6 py-3">
                <Lock className="w-4 h-4 mr-2" />
                ISO 27001 FORTRESS
              </MetallicBadge>
              <MetallicBadge variant="chrome" size="lg" className="px-6 py-3">
                <Shield className="w-4 h-4 mr-2" />
                POPI COMPLIANT
              </MetallicBadge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

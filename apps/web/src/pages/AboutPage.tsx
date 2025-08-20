import { motion } from 'framer-motion';
import {
  Award,
  Brain,
  Briefcase,
  ChevronRight,
  Clock,
  Globe,
  Heart,
  MapPin,
  Target,
  TrendingUp,
  Users,
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
  MetallicStat,
  SectionHeading
} from '../components/ui/MetallicComponents';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { value: "10,000+", label: "Jobs Matched", icon: <Briefcase /> },
    { value: "5,000+", label: "Happy Users", icon: <Users /> },
    { value: "95%", label: "Success Rate", icon: <TrendingUp /> },
    { value: "24/7", label: "AI Support", icon: <Clock /> }
  ];

  const values = [
    {
      icon: <Heart />,
      title: "Empowerment",
      description: "We believe every South African deserves access to quality employment opportunities that match their skills and aspirations."
    },
    {
      icon: <Brain />,
      title: "Innovation",
      description: "We leverage cutting-edge AI technology to revolutionize how people find jobs and how employers find talent."
    },
    {
      icon: <Globe />,
      title: "Inclusivity",
      description: "Our platform serves all South Africans across all provinces, languages, and skill levels with equal dedication."
    },
    {
      icon: <Target />,
      title: "Excellence",
      description: "We strive for perfection in everything we do, from our AI algorithms to our user experience design."
    }
  ];

  const team = [
    {
      name: "Fernando Steyn",
      role: "Founder & CEO",
      description: "Visionary entrepreneur with deep understanding of the South African job market and AI technology.",
      image: "/api/placeholder/120/120"
    },
    {
      name: "AI Development Team",
      role: "Machine Learning Engineers",
      description: "World-class AI specialists focused on creating intelligent job matching algorithms.",
      image: "/api/placeholder/120/120"
    },
    {
      name: "South African Market Experts",
      role: "Local Market Specialists",
      description: "Deep local knowledge ensuring our platform serves the unique needs of South African job seekers.",
      image: "/api/placeholder/120/120"
    }
  ];

  const milestones = [
    {
      year: "2024",
      title: "Platform Launch",
      description: "AI Job Chommie officially launches, bringing AI-powered job matching to South Africa."
    },
    {
      year: "2024",
      title: "5,000 Users",
      description: "Reached our first milestone of 5,000 registered users across all nine provinces."
    },
    {
      year: "2024",
      title: "10,000 Jobs Matched",
      description: "Successfully matched over 10,000 job opportunities with qualified candidates."
    },
    {
      year: "Future",
      title: "Continental Expansion",
      description: "Plans to expand AI Job Chommie across the African continent."
    }
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary relative overflow-hidden">
      {/* Ambient Lighting Effects */}
      <AmbientLighting />

      {/* Hero Section */}
      <section className="hero-responsive flex items-center justify-center relative safe-area-top">
        <motion.div
          className="responsive-container text-center z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <MetallicBadge variant="tech" animated className="mb-8">
            <Globe className="w-4 h-4 mr-2" />
            About AI Job Chommie
          </MetallicBadge>

          <h1 className="text-responsive-3xl font-heading font-black mb-6 text-chrome leading-none">
            Revolutionizing
            <br />
            <span className="bg-gradient-tech bg-clip-text text-transparent">
              Career Success
            </span>
            <br />
            in South Africa
          </h1>

          <p className="text-responsive-lg text-text-secondary max-w-4xl mx-auto mb-8 leading-relaxed">
            AI Job Chommie is more than just a job search platform. We're a technology company
            dedicated to transforming how South Africans find meaningful employment through
            the power of artificial intelligence.
          </p>

          <div className="flex-responsive-col gap-4 justify-center items-center mb-16">
            <MetallicButton
              variant="tech"
              size="lg"
              onClick={() => navigate('/pricing')}
              icon={<ChevronRight />}
              iconPosition="right"
            >
              Join Our Mission
            </MetallicButton>

            <MetallicButton
              variant="outline"
              size="lg"
              onClick={() => navigate('/contact')}
            >
              Contact Our Team
            </MetallicButton>
          </div>
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
                  animated={true}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="section-responsive">
        <div className="responsive-container">
          <div className="grid-responsive-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <SectionHeading
                title="Our Story"
                subtitle="Born from a vision to democratize access to quality employment opportunities across South Africa."
                align="left"
              />

              <div className="space-y-6 text-text-secondary leading-relaxed">
                <p>
                  AI Job Chommie was founded with a simple yet powerful belief: every South African
                  deserves access to meaningful employment opportunities that match their skills,
                  aspirations, and potential for growth.
                </p>

                <p>
                  Our founder, Fernando Steyn, recognized the unique challenges facing the South African
                  job market - from geographic barriers to skills mismatches - and envisioned a solution
                  powered by artificial intelligence that could bridge these gaps.
                </p>

                <p>
                  Today, we're proud to serve job seekers and employers across all nine provinces,
                  using advanced AI algorithms trained specifically on South African employment
                  patterns and market dynamics.
                </p>
              </div>

              <div className="mt-8 flex items-center space-x-4">
                <MetallicBadge variant="chrome">Est. 2024</MetallicBadge>
                <MetallicBadge variant="tech">South African Owned</MetallicBadge>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <MetallicCard glow="medium" className="p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-chrome rounded-full flex items-center justify-center mx-auto mb-6">
                    <Brain className="w-10 h-10 text-void-black" />
                  </div>

                  <h3 className="text-2xl font-heading font-bold mb-4 text-chrome">Our Mission</h3>

                  <p className="text-text-secondary mb-6">
                    To empower every South African with intelligent, personalized career opportunities
                    that unlock their full potential and contribute to the nation's economic growth.
                  </p>

                  <div className="flex justify-center">
                    <MetallicBadge variant="tech" size="lg">AI-Powered Success</MetallicBadge>
                  </div>
                </div>
              </MetallicCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="section-responsive bg-gradient-to-b from-bg-secondary to-transparent">
        <div className="responsive-container">
          <SectionHeading
            title="Our Core Values"
            subtitle="The principles that guide everything we do and every decision we make."
            align="center"
          />

          <div className="grid-responsive-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <MetallicCard className="h-full text-center">
                  <div className="text-tech-cyan text-4xl mb-6">{value.icon}</div>
                  <h3 className="text-xl font-heading font-bold mb-4">{value.title}</h3>
                  <p className="text-text-secondary">{value.description}</p>
                </MetallicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-responsive">
        <div className="responsive-container">
          <SectionHeading
            title="Meet Our Team"
            subtitle="Passionate professionals dedicated to transforming the South African job market."
            align="center"
          />

          <div className="grid-responsive-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <MetallicCard glow="subtle" className="text-center h-full">
                  <div className="w-24 h-24 bg-gradient-chrome rounded-full flex items-center justify-center mx-auto mb-6 text-void-black font-bold text-2xl">
                    {member.name.charAt(0)}
                  </div>

                  <h3 className="text-lg font-heading font-bold mb-2">{member.name}</h3>
                  <MetallicBadge variant="tech" className="mb-4">{member.role}</MetallicBadge>
                  <p className="text-text-secondary text-sm">{member.description}</p>
                </MetallicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section-responsive bg-gradient-to-b from-transparent to-bg-secondary">
        <div className="responsive-container">
          <SectionHeading
            title="Our Journey"
            subtitle="Key milestones in our mission to revolutionize South African employment."
            align="center"
          />

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                className="relative flex items-center mb-12 last:mb-0"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                {/* Timeline line */}
                {index < milestones.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-20 bg-gradient-to-b from-tech-cyan to-transparent" />
                )}

                {/* Timeline dot */}
                <div className="w-12 h-12 bg-gradient-chrome rounded-full flex items-center justify-center mr-6 z-10">
                  <Award className="w-6 h-6 text-void-black" />
                </div>

                {/* Content */}
                <MetallicCard className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-heading font-bold">{milestone.title}</h3>
                    <MetallicBadge variant="chrome">{milestone.year}</MetallicBadge>
                  </div>
                  <p className="text-text-secondary">{milestone.description}</p>
                </MetallicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* South African Pride Section */}
      <section className="section-responsive">
        <div className="responsive-container">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center mb-8">
              <MapPin className="w-8 h-8 text-tech-cyan mr-3" />
              <h2 className="text-4xl font-heading font-bold text-chrome">
                Proudly South African
              </h2>
            </div>

            <p className="text-responsive-lg text-text-secondary mb-8 leading-relaxed">
              We're not just operating in South Africa – we're part of its fabric. Our AI algorithms
              are trained on local data, our team understands local challenges, and our hearts beat
              for the success of every South African professional.
            </p>

            <div className="flex flex-wrap justify-center items-center gap-8 text-text-tertiary">
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-chrome">9</div>
                <div className="text-sm">Provinces Served</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-chrome">11</div>
                <div className="text-sm">Official Languages</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-chrome">100%</div>
                <div className="text-sm">Local Commitment</div>
              </div>
            </div>
          </motion.div>
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
              Ready to Join Our Success Story?
            </h2>

            <p className="text-responsive-lg text-text-secondary mb-8">
              Be part of the AI revolution transforming South African careers.
              Start your journey with us today.
            </p>

            <div className="flex-responsive-col gap-4 justify-center items-center">
              <MetallicButton
                variant="tech"
                size="lg"
                onClick={() => navigate('/pricing')}
                icon={<Zap />}
                iconPosition="right"
                className="min-w-56"
              >
                Start Your Journey
              </MetallicButton>

              <MetallicButton
                variant="outline"
                size="lg"
                onClick={() => navigate('/contact')}
                className="min-w-56"
              >
                Get in Touch
              </MetallicButton>
            </div>

            {/* Founder Attribution */}
            <div className="mt-12 pt-8 border-t border-border-light">
              <div className="text-center">
                <h4 className="text-lg font-heading font-bold text-chrome mb-3">Founded by Fernando Steyn</h4>
                <p className="text-sm text-text-secondary max-w-2xl mx-auto mb-4">
                  From skilled welder in Port Elizabeth to technology innovator, Fernando's personal experience
                  with South African employment challenges inspired him to create a platform that democratizes
                  access to career opportunities for all.
                </p>
                <div className="flex justify-center space-x-4 mb-4">
                  <MetallicBadge variant="tech" size="sm">Technology Innovator</MetallicBadge>
                  <MetallicBadge variant="chrome" size="sm">Employment Advocate</MetallicBadge>
                </div>
                <p className="text-xs text-text-tertiary">
                  © 2025 Job Chommie Professional Platform | Created by Fernando Steyn
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Separator */}
      <ChromeSeparator className="my-8" />
    </div>
  );
};

export default AboutPage;

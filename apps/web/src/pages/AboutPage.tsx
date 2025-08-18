import React from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import { 
  MetallicCard, 
  SectionHeading, 
  MetallicStat, 
  MetallicBadge,
  AmbientLighting,
  ChromeSeparator 
} from '../components/ui/MetallicComponents';
import { 
  Users, 
  Target, 
  Heart, 
  TrendingUp, 
  Globe, 
  Shield, 
  Zap, 
  Award 
} from 'lucide-react';

const AboutPage: React.FC = () => {
  const team = [
    {
      name: "Fernando Steyn",
      role: "Founder & CEO",
      image: "/api/placeholder/128/128",
      bio: "A visionary entrepreneur with a passion for leveraging AI to solve real-world problems. Fernando is dedicated to empowering South Africans through technology."
    },
    {
      name: "Sizwe Ndlovu",
      role: "Chief Technology Officer",
      image: "/api/placeholder/128/128",
      bio: "A brilliant technologist with deep expertise in AI and machine learning. Sizwe leads our engineering team in building a world-class platform."
    },
    {
      name: "Lerato Mokoena",
      role: "Head of Product",
      image: "/api/placeholder/128/128",
      bio: "A product visionary who is passionate about creating intuitive and impactful user experiences. Lerato ensures our platform meets the needs of every job seeker."
    },
    {
      name: "John Botha",
      role: "Lead Data Scientist",
      image: "/api/placeholder/128/128",
      bio: "A data science expert who is passionate about using data to create a more equitable job market. John leads our efforts in predictive analytics and AI matching."
    }
  ];

  const stats = [
    { value: "95%", label: "Success Rate", icon: <TrendingUp /> },
    { value: "10,000+", label: "Jobs Matched", icon: <Zap /> },
    { value: "5,000+", label: "Happy Users", icon: <Users /> },
    { value: "100%", label: "South African", icon: <Globe /> }
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
                title="About AI Job Chommie"
                subtitle="We are a team of passionate South Africans dedicated to revolutionizing the job market with the power of AI. Our mission is to create a more equitable and efficient path to employment for every citizen."
                align="center"
              />
            </motion.div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="py-20 bg-gradient-to-b from-bg-secondary to-transparent">
          <div className="responsive-container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <img 
                  src="/api/placeholder/500/500" 
                  alt="AI Job Chommie Mission" 
                  className="rounded-lg shadow-chrome-lg"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h2 className="text-4xl font-heading font-bold mb-6 text-chrome">
                  Our Mission
                </h2>
                <p className="text-lg text-text-secondary mb-6 leading-relaxed">
                  Our mission is to empower every South African with the tools and technology to build a successful career. We believe that AI can be a powerful force for good, and we are committed to using it to create a more inclusive and prosperous job market for all.
                </p>
                <p className="text-lg text-text-secondary leading-relaxed">
                  We are dedicated to helping those who need it most, with a special focus on providing affordable, high-quality job-seeking tools for unemployed and underemployed individuals.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-20">
          <div className="responsive-container">
            <SectionHeading
              title="Our Core Values"
              subtitle="Our values guide every decision we make and ensure we stay true to our mission of serving the South African people."
              align="center"
            />

            <div className="grid md:grid-cols-3 gap-8">
              <MetallicCard glow="subtle" className="text-center">
                <div className="text-tech-cyan text-4xl mb-4">
                  <Heart />
                </div>
                <h3 className="text-xl font-heading font-bold mb-4">People First</h3>
                <p className="text-text-secondary">
                  We prioritize the needs of our users above all else, with a special focus on creating a fair and equitable platform.
                </p>
              </MetallicCard>

              <MetallicCard glow="subtle" className="text-center">
                <div className="text-tech-cyan text-4xl mb-4">
                  <Zap />
                </div>
                <h3 className="text-xl font-heading font-bold mb-4">Innovation</h3>
                <p className="text-text-secondary">
                  We are committed to pushing the boundaries of technology to create the most advanced and effective job-seeking tools on the market.
                </p>
              </MetallicCard>

              <MetallicCard glow="subtle" className="text-center">
                <div className="text-tech-cyan text-4xl mb-4">
                  <Shield />
                </div>
                <h3 className="text-xl font-heading font-bold mb-4">Integrity</h3>
                <p className="text-text-secondary">
                  We operate with transparency and honesty, ensuring that our users can trust us with their data and their careers.
                </p>
              </MetallicCard>
            </div>
          </div>
        </section>

        {/* Meet the Team Section */}
        <section className="py-20 bg-gradient-to-t from-bg-secondary to-transparent">
          <div className="responsive-container">
            <SectionHeading
              title="Meet the Team"
              subtitle="We are a diverse team of entrepreneurs, engineers, and product visionaries who are passionate about building a better future for South Africa."
              align="center"
            />

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <MetallicCard glow="medium" className="text-center h-full">
                    <div className="mb-4">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-32 h-32 rounded-full mx-auto shadow-chrome-lg border-2 border-border-medium"
                      />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-chrome">{member.name}</h3>
                    <p className="text-tech-cyan font-medium mb-4">{member.role}</p>
                    <p className="text-text-secondary text-sm">{member.bio}</p>
                  </MetallicCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <div className="responsive-container">
            <div className="grid-responsive-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
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
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;

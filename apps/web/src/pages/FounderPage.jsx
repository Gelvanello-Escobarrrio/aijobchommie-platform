import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import ParticleSystem from '../components/ParticleSystem';
import GeometricBackground from '../components/GeometricBackground';

const FounderPage = () => {
  return (
    <div>
      {/* Background Effects */}
      <GeometricBackground />
      <ParticleSystem />
      
      {/* Cinematic Lighting */}
      <div className="spotlight-container">
        <div className="main-spotlight" style={{ left: '30%', top: '20%' }}></div>
        <div className="secondary-spotlight" style={{ left: '70%', top: '60%', animationDelay: '-3s' }}></div>
      </div>
      
      <Navigation />
      
      {/* Hero Section */}
      <section className="hero" style={{ minHeight: '70vh', paddingTop: '120px' }}>
        <div className="container">
          <div className="fade-in" style={{ textAlign: 'center' }}>
            <h1 style={{ marginBottom: '30px' }}>
              <span className="text-gradient">Meet the Founder</span>
            </h1>
            <p style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '800px', margin: '0 auto 40px' }}>
              From the welding yards of Port Elizabeth to the forefront of AI innovation – 
              one man's journey to democratize employment for all South Africans.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Introduction */}
      <section className="section">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center', gap: 'var(--space-4xl)' }}>
            <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 255, 0.1))' }}>
              <div style={{ 
                width: '200px', 
                height: '200px', 
                borderRadius: '50%', 
                background: 'linear-gradient(45deg, var(--primary-cyan), var(--primary-magenta))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '4rem',
                fontWeight: 'bold',
                color: 'var(--bg-primary)',
                margin: '0 auto var(--space-lg)',
                border: '4px solid var(--accent-lime)',
                boxShadow: '0 0 40px rgba(0, 255, 255, 0.3)'
              }}>
                FS
              </div>
              <h2 style={{ color: 'var(--primary-cyan)', marginBottom: 'var(--space-md)' }}>Fernando Steyn</h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--accent-lime)', marginBottom: 'var(--space-md)', fontWeight: '600' }}>
                Founder & CEO
              </p>
              <p style={{ fontSize: '1rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                "Technology should serve humanity, not the other way around. 
                Every line of code I write is dedicated to creating opportunities for my fellow South Africans."
              </p>
            </div>
            
            <div className="fade-in">
              <h2 style={{ marginBottom: 'var(--space-lg)', color: 'var(--primary-magenta)' }}>A Story of Resilience and Innovation</h2>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: 'var(--space-lg)' }}>
                Fernando Steyn's journey to founding AI Job Chommie is a testament to the power of perseverance and the belief 
                that technology can transform lives. Born and raised in the vibrant community of Port Elizabeth, Fernando's path 
                wasn't traditional – but it was authentic.
              </p>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: 'var(--space-lg)' }}>
                As a skilled welder who experienced unemployment firsthand, Fernando understands the frustration of job searching 
                in South Africa. He knows what it's like to have valuable skills but struggle to find opportunities that recognize 
                and reward that potential.
              </p>
              <blockquote style={{ 
                padding: 'var(--space-lg)', 
                background: 'rgba(157, 0, 255, 0.1)', 
                borderLeft: '4px solid var(--accent-violet)', 
                borderRadius: 'var(--radius-md)',
                fontStyle: 'italic',
                fontSize: '1.1rem'
              }}>
                "As a welder who faced unemployment, I understand the struggle. This app is my way of giving back to the community. 
                Every job seeker deserves the same advanced technology that big corporations use to find the best talent."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Background */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="fade-in" style={{ textAlign: 'center', marginBottom: 'var(--space-4xl)' }}>
            <h2 style={{ marginBottom: 'var(--space-md)' }}>Personal Journey</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
              From humble beginnings to technological innovation – the experiences that shaped AI Job Chommie's vision.
            </p>
          </div>

          <div className="grid grid-2" style={{ gap: 'var(--space-4xl)' }}>
            <div className="card hover-card">
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)', textAlign: 'center' }}>🏗️</div>
              <h3 style={{ color: 'var(--primary-cyan)', marginBottom: 'var(--space-md)' }}>Early Life & Trade Skills</h3>
              <p style={{ marginBottom: 'var(--space-md)' }}>
                Growing up in Port Elizabeth, Fernando learned the value of hard work and craftsmanship early. His journey into welding 
                taught him precision, patience, and the satisfaction of creating something valuable with his hands.
              </p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: 'var(--accent-lime)', marginRight: 'var(--space-sm)' }}>⚡</span>
                  Certified welder with 8+ years experience
                </li>
                <li style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: 'var(--accent-lime)', marginRight: 'var(--space-sm)' }}>⚡</span>
                  Worked across construction and manufacturing sectors
                </li>
                <li style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: 'var(--accent-lime)', marginRight: 'var(--space-sm)' }}>⚡</span>
                  Deep understanding of blue-collar employment challenges
                </li>
              </ul>
            </div>

            <div className="card hover-card">
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)', textAlign: 'center' }}>📚</div>
              <h3 style={{ color: 'var(--primary-magenta)', marginBottom: 'var(--space-md)' }}>Education & Self-Development</h3>
              <p style={{ marginBottom: 'var(--space-md)' }}>
                Never one to accept limitations, Fernando pursued continuous learning alongside his trade work. 
                Self-taught in programming and AI technologies, he represents the entrepreneurial spirit of modern South Africa.
              </p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: 'var(--accent-violet)', marginRight: 'var(--space-sm)' }}>🎓</span>
                  Self-taught programmer (Python, JavaScript, AI/ML)
                </li>
                <li style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: 'var(--accent-violet)', marginRight: 'var(--space-sm)' }}>🎓</span>
                  Completed online courses in machine learning
                </li>
                <li style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: 'var(--accent-violet)', marginRight: 'var(--space-sm)' }}>🎓</span>
                  Passionate advocate for accessible education
                </li>
              </ul>
            </div>

            <div className="card hover-card">
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)', textAlign: 'center' }}>💡</div>
              <h3 style={{ color: 'var(--accent-lime)', marginBottom: 'var(--space-md)' }}>The Unemployment Experience</h3>
              <p style={{ marginBottom: 'var(--space-md)' }}>
                When Fernando faced unemployment despite his skills and experience, he witnessed firsthand how broken 
                South Africa's job search system truly is. This personal struggle became the catalyst for AI Job Chommie.
              </p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: 'var(--primary-cyan)', marginRight: 'var(--space-sm)' }}>🔍</span>
                  Months of unsuccessful job applications
                </li>
                <li style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: 'var(--primary-cyan)', marginRight: 'var(--space-sm)' }}>🔍</span>
                  Witnessed systemic barriers in hiring processes
                </li>
                <li style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: 'var(--primary-cyan)', marginRight: 'var(--space-sm)' }}>🔍</span>
                  Recognized the need for AI-powered solutions
                </li>
              </ul>
            </div>

            <div className="card hover-card">
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)', textAlign: 'center' }}>❤️</div>
              <h3 style={{ color: 'var(--accent-violet)', marginBottom: 'var(--space-md)' }}>Family Values & Legacy</h3>
              <p style={{ marginBottom: 'var(--space-md)' }}>
                Fernando carries forward the values instilled by his late mother – compassion, perseverance, and the belief 
                that everyone deserves dignity in work. Her memory inspires every aspect of AI Job Chommie's mission.
              </p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: 'var(--primary-magenta)', marginRight: 'var(--space-sm)' }}>💝</span>
                  Dedicated to his late mother's memory
                </li>
                <li style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: 'var(--primary-magenta)', marginRight: 'var(--space-sm)' }}>💝</span>
                  Strong community and family orientation
                </li>
                <li style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: 'var(--primary-magenta)', marginRight: 'var(--space-sm)' }}>💝</span>
                  Believes in lifting others while climbing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Expertise */}
      <section className="section">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center', gap: 'var(--space-4xl)' }}>
            <div className="fade-in">
              <h2 style={{ marginBottom: 'var(--space-lg)' }}>Technical Innovation Meets Real-World Experience</h2>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: 'var(--space-lg)' }}>
                Fernando's unique combination of blue-collar work experience and self-taught technical expertise gives him 
                an unparalleled understanding of both the job seeker's struggle and the technological solutions that can address it.
              </p>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: 'var(--space-lg)' }}>
                His approach to AI development is grounded in practical problem-solving rather than theoretical concepts. 
                Every algorithm is designed with the real needs of South African job seekers in mind.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
                <span className="badge" style={{ background: 'var(--primary-cyan)', color: 'var(--bg-primary)' }}>AI/ML Engineering</span>
                <span className="badge" style={{ background: 'var(--primary-magenta)', color: 'var(--bg-primary)' }}>Full-Stack Development</span>
                <span className="badge" style={{ background: 'var(--accent-lime)', color: 'var(--bg-primary)' }}>UX/UI Design</span>
                <span className="badge" style={{ background: 'var(--accent-violet)', color: 'var(--bg-primary)' }}>Product Strategy</span>
              </div>
            </div>
            
            <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0, 255, 65, 0.1), rgba(0, 255, 255, 0.1))' }}>
              <h3 style={{ color: 'var(--accent-lime)', marginBottom: 'var(--space-md)' }}>🚀 Technical Achievements</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <div style={{ padding: 'var(--space-md)', background: 'rgba(0, 0, 0, 0.2)', borderRadius: 'var(--radius-md)' }}>
                  <h4 style={{ color: 'var(--primary-cyan)', marginBottom: 'var(--space-sm)' }}>AI Job Matching Algorithm</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Developed proprietary machine learning models that achieve 87% job placement success rate
                  </p>
                </div>
                <div style={{ padding: 'var(--space-md)', background: 'rgba(0, 0, 0, 0.2)', borderRadius: 'var(--radius-md)' }}>
                  <h4 style={{ color: 'var(--primary-magenta)', marginBottom: 'var(--space-sm)' }}>Mobile-First PWA Architecture</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Built scalable Progressive Web App optimized for South African mobile networks
                  </p>
                </div>
                <div style={{ padding: 'var(--space-md)', background: 'rgba(0, 0, 0, 0.2)', borderRadius: 'var(--radius-md)' }}>
                  <h4 style={{ color: 'var(--accent-violet)', marginBottom: 'var(--space-sm)' }}>Natural Language Processing</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Implemented multilingual NLP supporting all 11 South African official languages
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why AI Job Chommie */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="fade-in" style={{ textAlign: 'center', marginBottom: 'var(--space-4xl)' }}>
            <h2 style={{ marginBottom: 'var(--space-md)' }}>Why AI Job Chommie?</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
              The personal experiences and observations that drove Fernando to create South Africa's most advanced job matching platform.
            </p>
          </div>

          <div className="card" style={{ maxWidth: '900px', margin: '0 auto', background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.1), rgba(0, 255, 255, 0.1))' }}>
            <div className="grid grid-2" style={{ gap: 'var(--space-4xl)' }}>
              <div>
                <h3 style={{ color: 'var(--primary-magenta)', marginBottom: 'var(--space-md)' }}>The Problem I Witnessed</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--accent-lime)', marginRight: 'var(--space-sm)', marginTop: '2px' }}>❌</span>
                    <div>
                      <strong>Skills vs. Opportunities Mismatch:</strong> Talented people couldn't find work that matched their abilities
                    </div>
                  </li>
                  <li style={{ marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--accent-lime)', marginRight: 'var(--space-sm)', marginTop: '2px' }}>❌</span>
                    <div>
                      <strong>Expensive Recruitment Fees:</strong> Job boards and agencies charging fees that many couldn't afford
                    </div>
                  </li>
                  <li style={{ marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--accent-lime)', marginRight: 'var(--space-sm)', marginTop: '2px' }}>❌</span>
                    <div>
                      <strong>Biased Hiring Processes:</strong> Good candidates overlooked due to systemic barriers and unconscious bias
                    </div>
                  </li>
                  <li style={{ marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--accent-lime)', marginRight: 'var(--space-sm)', marginTop: '2px' }}>❌</span>
                    <div>
                      <strong>Information Asymmetry:</strong> Job seekers lacked insights into what employers really wanted
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 style={{ color: 'var(--primary-cyan)', marginBottom: 'var(--space-md)' }}>My AI-Powered Solution</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--accent-violet)', marginRight: 'var(--space-sm)', marginTop: '2px' }}>✅</span>
                    <div>
                      <strong>Intelligent Matching:</strong> AI analyzes skills, experience, and potential for perfect job-candidate fit
                    </div>
                  </li>
                  <li style={{ marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--accent-violet)', marginRight: 'var(--space-sm)', marginTop: '2px' }}>✅</span>
                    <div>
                      <strong>Affordable Access:</strong> Premium features starting at R17/month with free trials for everyone
                    </div>
                  </li>
                  <li style={{ marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--accent-violet)', marginRight: 'var(--space-sm)', marginTop: '2px' }}>✅</span>
                    <div>
                      <strong>Bias-Free Algorithms:</strong> AI focuses on skills and potential, not demographics or connections
                    </div>
                  </li>
                  <li style={{ marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--accent-violet)', marginRight: 'var(--space-sm)', marginTop: '2px' }}>✅</span>
                    <div>
                      <strong>Data-Driven Insights:</strong> Real-time market intelligence helps job seekers make informed decisions
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Philosophy */}
      <section className="section">
        <div className="container">
          <div className="fade-in" style={{ textAlign: 'center', marginBottom: 'var(--space-4xl)' }}>
            <h2 style={{ marginBottom: 'var(--space-md)' }}>Leadership Philosophy</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
              Fernando's approach to building technology that serves humanity rather than replacing it.
            </p>
          </div>

          <div className="grid grid-2" style={{ gap: 'var(--space-4xl)' }}>
            <div className="card hover-card" style={{ border: '2px solid var(--primary-cyan)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)', textAlign: 'center' }}>🤝</div>
              <h3 style={{ color: 'var(--primary-cyan)', marginBottom: 'var(--space-md)' }}>People-First Technology</h3>
              <p style={{ marginBottom: 'var(--space-md)' }}>
                "Technology should amplify human potential, not replace it. Every feature we build starts with a simple question: 
                How does this help a real person find meaningful work?"
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                This philosophy drives every product decision, from the user interface design to the AI algorithm training data.
              </p>
            </div>

            <div className="card hover-card" style={{ border: '2px solid var(--primary-magenta)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)', textAlign: 'center' }}>🔬</div>
              <h3 style={{ color: 'var(--primary-magenta)', marginBottom: 'var(--space-md)' }}>Continuous Innovation</h3>
              <p style={{ marginBottom: 'var(--space-md)' }}>
                "In the rapidly evolving world of AI, standing still means falling behind. We must constantly learn, 
                experiment, and improve to serve our users better."
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Fernando maintains active involvement in AI research and development, ensuring the platform stays cutting-edge.
              </p>
            </div>

            <div className="card hover-card" style={{ border: '2px solid var(--accent-lime)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)', textAlign: 'center' }}>💎</div>
              <h3 style={{ color: 'var(--accent-lime)', marginBottom: 'var(--space-md)' }}>Radical Transparency</h3>
              <p style={{ marginBottom: 'var(--space-md)' }}>
                "Users deserve to understand how our AI makes decisions about their careers. Black-box algorithms have no place 
                in something as important as employment."
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                This commitment extends to open pricing, clear privacy policies, and regular community updates.
              </p>
            </div>

            <div className="card hover-card" style={{ border: '2px solid var(--accent-violet)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)', textAlign: 'center' }}>🌍</div>
              <h3 style={{ color: 'var(--accent-violet)', marginBottom: 'var(--space-md)' }}>Community Impact</h3>
              <p style={{ marginBottom: 'var(--space-md)' }}>
                "Success isn't measured in downloads or revenue – it's measured in lives changed, families fed, 
                and communities strengthened through meaningful employment."
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Every business decision is evaluated through the lens of community benefit and social impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Quote Section */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', background: 'linear-gradient(135deg, rgba(157, 0, 255, 0.1), rgba(0, 255, 255, 0.1))' }}>
            <div style={{ fontSize: '4rem', marginBottom: 'var(--space-lg)' }}>💭</div>
            <blockquote style={{ 
              fontSize: '1.4rem', 
              lineHeight: '1.6', 
              fontStyle: 'italic',
              marginBottom: 'var(--space-xl)',
              color: 'var(--text-primary)'
            }}>
              "Every job seeker has a story, dreams, and potential waiting to be unlocked. My mother taught me that everyone deserves dignity in work. 
              AI Job Chommie is my promise to her memory and my gift to South Africa – technology that sees the person behind the resume 
              and matches them with opportunities that can change their life."
            </blockquote>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-md)' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                background: 'linear-gradient(45deg, var(--primary-cyan), var(--primary-magenta))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'var(--bg-primary)'
              }}>
                FS
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: '600', color: 'var(--primary-cyan)' }}>Fernando Steyn</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Founder & CEO, AI Job Chommie</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <div className="card" style={{ maxWidth: '700px', margin: '0 auto', background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 255, 0.1))' }}>
            <h2 style={{ marginBottom: 'var(--space-lg)' }}>Join Fernando's Vision</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: 'var(--space-xl)', color: 'var(--text-secondary)' }}>
              Experience the job search platform built by someone who truly understands your journey. 
              Let AI Job Chommie help you find the opportunity you deserve.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/pricing" className="btn btn-primary" style={{ fontSize: '1.1rem' }}>
                🚀 Start Your Journey
              </Link>
              <Link to="/mission" className="btn btn-secondary" style={{ fontSize: '1.1rem' }}>
                📚 Learn About Our Mission
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FounderPage;

import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import ParticleSystem from '../components/ParticleSystem';
import GeometricBackground from '../components/GeometricBackground';

const MissionPage = () => {
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
              <span className="text-gradient">Our Mission</span>
            </h1>
            <p style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '800px', margin: '0 auto 40px' }}>
              To democratize employment opportunities across South Africa by leveraging artificial intelligence 
              to create equal access to meaningful work for every job seeker, regardless of background, location, or resources.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="section">
        <div className="container">
          <div className="card" style={{ maxWidth: '900px', margin: '0 auto', background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 255, 0.1))' }}>
            <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-xl)', color: 'var(--primary-cyan)' }}>Our Mission Declaration</h2>
            <div style={{ fontSize: '1.2rem', lineHeight: '1.8', textAlign: 'center' }}>
              <p style={{ marginBottom: 'var(--space-lg)' }}>
                <strong>We believe that every South African deserves access to meaningful employment opportunities.</strong> 
                In a nation where unemployment affects millions of talented individuals, we refuse to accept the status quo. 
                Our mission is to bridge the gap between exceptional talent and quality opportunities using the transformative power of artificial intelligence.
              </p>
              <p style={{ marginBottom: 'var(--space-lg)' }}>
                Born from the townships and cities where dreams meet harsh realities, AI Job Chommie exists to level the playing field. 
                We're not just a job platform – we're a movement toward economic empowerment, social justice, and equal opportunity for all South Africans.
              </p>
              <div style={{ padding: 'var(--space-xl)', background: 'rgba(0, 255, 65, 0.1)', borderRadius: 'var(--radius-lg)', border: '2px solid var(--accent-lime)' }}>
                <h3 style={{ color: 'var(--accent-lime)', marginBottom: 'var(--space-md)' }}>Our Promise</h3>
                <p style={{ fontSize: '1.1rem', margin: 0 }}>
                  "We promise to use technology not to replace human potential, but to unlock it. 
                  Every line of code we write, every algorithm we train, and every feature we build serves one ultimate purpose: 
                  helping South Africans find work that pays fairly, grows sustainably, and creates lasting economic impact in our communities."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Impact Goals */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-4xl)' }}>Our Social Impact Goals</h2>
          <div className="grid grid-2" style={{ gap: 'var(--space-4xl)' }}>
            
            <div className="card hover-card" style={{ border: '2px solid var(--primary-cyan)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)', textAlign: 'center', color: 'var(--primary-cyan)' }}>◉</div>
              <h3 style={{ color: 'var(--primary-cyan)', marginBottom: 'var(--space-md)' }}>Unemployment Reduction</h3>
              <p style={{ marginBottom: 'var(--space-md)' }}>
                <strong>Target:</strong> Help reduce South Africa's unemployment rate by connecting 100,000 job seekers 
                with quality employment opportunities by 2027.
              </p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: 'var(--accent-lime)', marginRight: 'var(--space-sm)' }}>•</span>
                  Priority focus on youth employment (18-35 years)
                </li>
                <li style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: 'var(--accent-lime)', marginRight: 'var(--space-sm)' }}>•</span>
                  Special programs for rural and township communities
                </li>
                <li style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: 'var(--accent-lime)', marginRight: 'var(--space-sm)' }}>•</span>
                  Support for first-time job seekers and career changers
                </li>
              </ul>
            </div>

            <div className="card hover-card" style={{ border: '2px solid var(--primary-magenta)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)', textAlign: 'center', color: 'var(--primary-magenta)' }}></div>
              <h3 style={{ color: 'var(--primary-magenta)', marginBottom: 'var(--space-md)' }}>Skills Gap Bridging</h3>
              <p style={{ marginBottom: 'var(--space-md)' }}>
                <strong>Goal:</strong> Use AI-powered insights to identify and bridge critical skills gaps 
                in the South African economy, connecting talent with training opportunities.
              </p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: 'var(--accent-lime)', marginRight: 'var(--space-sm)' }}>•</span>
                  Real-time skills demand analysis
                </li>
                <li style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: 'var(--accent-lime)', marginRight: 'var(--space-sm)' }}>•</span>
                  Partnerships with training providers
                </li>
                <li style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: 'var(--accent-lime)', marginRight: 'var(--space-sm)' }}>•</span>
                  Personalized upskilling recommendations
                </li>
              </ul>
            </div>

            <div className="card hover-card" style={{ border: '2px solid var(--accent-lime)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)', textAlign: 'center', color: 'var(--accent-lime)' }}>▲</div>
              <h3 style={{ color: 'var(--accent-lime)', marginBottom: 'var(--space-md)' }}>Youth Employment Initiative</h3>
              <p style={{ marginBottom: 'var(--space-md)' }}>
                <strong>Mission:</strong> Create specialized pathways for young South Africans entering the job market, 
                providing mentorship, skills development, and direct connections to entry-level opportunities.
              </p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: 'var(--accent-violet)', marginRight: 'var(--space-sm)' }}>•</span>
                  Free access for students and recent graduates
                </li>
                <li style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: 'var(--accent-violet)', marginRight: 'var(--space-sm)' }}>•</span>
                  Career guidance and interview preparation
                </li>
                <li style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: 'var(--accent-violet)', marginRight: 'var(--space-sm)' }}>•</span>
                  Mentorship programs with industry professionals
                </li>
              </ul>
            </div>

            <div className="card hover-card" style={{ border: '2px solid var(--accent-violet)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)', textAlign: 'center', color: 'var(--accent-violet)' }}>●</div>
              <h3 style={{ color: 'var(--accent-violet)', marginBottom: 'var(--space-md)' }}>Rural Economic Empowerment</h3>
              <p style={{ marginBottom: 'var(--space-md)' }}>
                <strong>Commitment:</strong> Extend quality job opportunities beyond urban centers, 
                supporting rural communities and promoting economic growth across all provinces.
              </p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: 'var(--primary-cyan)', marginRight: 'var(--space-sm)' }}>•</span>
                  Mobile-optimized platform for limited connectivity
                </li>
                <li style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: 'var(--primary-cyan)', marginRight: 'var(--space-sm)' }}>•</span>
                  Local language support for all official languages
                </li>
                <li style={{ marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: 'var(--primary-cyan)', marginRight: 'var(--space-sm)' }}>•</span>
                  Partnerships with rural employers and cooperatives
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Community Commitment */}
      <section className="section">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center', gap: 'var(--space-4xl)' }}>
            <div className="fade-in">
              <h2 style={{ marginBottom: 'var(--space-lg)' }}>Community-First Approach</h2>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: 'var(--space-lg)' }}>
                We recognize that sustainable employment transformation requires deep community engagement. 
                Our success is measured not just in individual job placements, but in the collective economic 
                upliftment of South African communities.
              </p>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: 'var(--space-lg)' }}>
                Through strategic partnerships with universities, TVET colleges, community organizations, 
                and local businesses, we're building an ecosystem that supports long-term career growth 
                and economic development.
              </p>
            </div>
            
            <div className="card" style={{ background: 'linear-gradient(135deg, rgba(157, 0, 255, 0.1), rgba(0, 255, 65, 0.1))' }}>
              <h3 style={{ color: 'var(--accent-violet)', marginBottom: 'var(--space-md)' }}>Partnership Impact</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-sm)', background: 'rgba(0, 0, 0, 0.2)', borderRadius: 'var(--radius-sm)' }}>
                  <span>Universities & Colleges</span>
                  <span style={{ color: 'var(--accent-lime)', fontWeight: '600' }}>15+ Partnerships</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-sm)', background: 'rgba(0, 0, 0, 0.2)', borderRadius: 'var(--radius-sm)' }}>
                  <span>Local Businesses</span>
                  <span style={{ color: 'var(--accent-lime)', fontWeight: '600' }}>200+ Employers</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-sm)', background: 'rgba(0, 0, 0, 0.2)', borderRadius: 'var(--radius-sm)' }}>
                  <span>Community Organizations</span>
                  <span style={{ color: 'var(--accent-lime)', fontWeight: '600' }}>50+ NGOs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="fade-in" style={{ textAlign: 'center', marginBottom: 'var(--space-4xl)' }}>
            <h2 style={{ marginBottom: 'var(--space-md)' }}>Measuring Our Impact</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
              Transparency and accountability drive our mission. We track and report on key metrics 
              that demonstrate our progress toward transforming employment in South Africa.
            </p>
          </div>

          <div className="grid grid-3" style={{ marginBottom: 'var(--space-4xl)' }}>
            <div className="card" style={{ textAlign: 'center', border: '2px solid var(--primary-cyan)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)', color: 'var(--primary-cyan)' }}></div>
              <h3 style={{ color: 'var(--primary-cyan)', marginBottom: 'var(--space-sm)' }}>Employment Rate</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-cyan)', marginBottom: 'var(--space-sm)' }}>87%</div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Job seekers successfully employed within 90 days of active platform use
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', border: '2px solid var(--primary-magenta)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)', color: 'var(--primary-magenta)' }}>$</div>
              <h3 style={{ color: 'var(--primary-magenta)', marginBottom: 'var(--space-sm)' }}>Salary Improvement</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-magenta)', marginBottom: 'var(--space-sm)' }}>34%</div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Average salary increase for users who found new positions through our platform
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', border: '2px solid var(--accent-lime)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)', color: 'var(--accent-lime)' }}></div>
              <h3 style={{ color: 'var(--accent-lime)', marginBottom: 'var(--space-sm)' }}>Time to Employment</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-lime)', marginBottom: 'var(--space-sm)' }}>21</div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Average days from profile completion to first interview opportunity
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <div className="card" style={{ maxWidth: '700px', margin: '0 auto', background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 255, 0.1))' }}>
            <h2 style={{ marginBottom: 'var(--space-lg)' }}>Join Our Mission</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: 'var(--space-xl)', color: 'var(--text-secondary)' }}>
              Be part of South Africa's employment transformation. Whether you're a job seeker, employer, 
              or community partner, there's a place for you in our mission to create equal opportunity for all.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/pricing" className="btn btn-primary" style={{ fontSize: '1.1rem' }}>
                Start Your Journey
              </Link>
              <Link to="/about" className="btn btn-secondary" style={{ fontSize: '1.1rem' }}>
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MissionPage;

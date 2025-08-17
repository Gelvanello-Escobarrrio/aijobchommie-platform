import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import NeonEmoji from './NeonEmoji';

const EnhancedHeroSection = () => {
  const [currentCodeIndex, setCurrentCodeIndex] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const [timelineProgress, setTimelineProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [jobStats, setJobStats] = useState({ active: 10000, matched: 500, success: 95 });
  const heroRef = useRef(null);

  // Code samples for live visualization - wrapped in useMemo to prevent recreation on every render
  const codeSamples = useMemo(() => [
    {
      language: 'React',
      lines: [
        'const JobMatcher = () => {',
        '  const [jobs, setJobs] = useState([]);',
        '  const aiMatch = useAI("job-matching");',
        '  ',
        '  useEffect(() => {',
        '    aiMatch.findPerfectJobs(userProfile)',
        '      .then(matches => setJobs(matches));',
        '  }, [userProfile]);',
        '  ',
        '  return <JobList jobs={jobs} />;',
        '};'
      ]
    },
    {
      language: 'CSS',
      lines: [
        '.job-card {',
        '  background: linear-gradient(',
        '    135deg, #00ffff, #ff00ff',
        '  );',
        '  border-radius: 12px;',
        '  box-shadow: 0 10px 30px rgba(0, 255, 255, 0.3);',
        '  transition: transform 0.3s ease;',
        '}',
        '',
        '.job-card:hover {',
        '  transform: translateY(-10px);',
        '}'
      ]
    },
    {
      language: 'API',
      lines: [
        'POST /api/ai/job-match',
        '{',
        '  "skills": ["React", "Node.js", "Python"],',
        '  "location": "Cape Town, SA",',
        '  "experience": "3+ years",',
        '  "salary_min": 45000,',
        '  "remote": true',
        '}',
        '',
        'Response: 200 OK',
        '{ "matches": 127, "confidence": 96% }'
      ]
    }
  ], []);

  // Timeline steps
  const timelineSteps = [
    { name: 'Planning', icon: 'briefcase', progress: 100, color: '#00ff41' },
    { name: 'Design', icon: 'diamond', progress: 100, color: '#00ffff' },
    { name: 'AI Integration', icon: 'brain', progress: 85, color: '#ff00ff' },
    { name: 'Testing', icon: 'gear', progress: 70, color: '#ff6b00' },
    { name: 'Launch Aug 30', icon: 'rocket', progress: 45, color: '#9d00ff' }
  ];

  // Tech stack icons with animated connections
  const techStack = [
    { name: 'React', icon: 'settings', color: '#61dafb' },
    { name: 'AI/ML', icon: 'brain', color: '#ff6b6b' },
    { name: 'PWA', icon: 'mobile', color: '#5f27cd' },
    { name: 'Node.js', icon: 'gear', color: '#68d391' }
  ];

  // Live code typing effect
  useEffect(() => {
    const interval = setInterval(() => {
      const currentSample = codeSamples[currentCodeIndex];
      if (currentLine < currentSample.lines.length - 1) {
        setCurrentLine(prev => prev + 1);
      } else {
        setTimeout(() => {
          setCurrentCodeIndex(prev => (prev + 1) % codeSamples.length);
          setCurrentLine(0);
        }, 2000);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [currentCodeIndex, currentLine, codeSamples]);

  // Timeline animation
  useEffect(() => {
    const interval = setInterval(() => {
      setTimelineProgress(prev => (prev + 1) % 101);
      setActiveStep(prev => Math.floor((prev + 1) % timelineSteps.length));
    }, 3000);

    return () => clearInterval(interval);
  }, [timelineSteps.length]);

  // Launch countdown
  useEffect(() => {
    const launchDate = new Date('2025-08-30T00:00:00');
    
    const updateCountdown = () => {
      const now = new Date();
      const difference = launchDate - now;
      
      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Dynamic job statistics
  useEffect(() => {
    const interval = setInterval(() => {
      setJobStats(prev => ({
        active: prev.active + Math.floor(Math.random() * 3),
        matched: prev.matched + Math.floor(Math.random() * 2),
        success: 95 + Math.floor(Math.random() * 4)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        heroRef.current.style.transform = `translateY(${rate}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="enhanced-hero" ref={heroRef}>
      {/* South African Flag Accents */}
      <div className="sa-flag-accents">
        <div className="flag-stripe green"></div>
        <div className="flag-stripe gold"></div>
        <div className="flag-stripe red"></div>
        <div className="flag-stripe blue"></div>
      </div>

      {/* Main Hero Content */}
      <div className="hero-content">
        <div className="hero-main">
          <Logo size={150} className="hero-logo pulse-glow" />
          <h1 className="hero-title">
            <span className="text-gradient">AI Job Chommie</span>
          </h1>
          <p className="hero-subtitle">
            Your intelligent job search companion for <span className="sa-highlight">South Africa</span>
          </p>

          {/* Countdown Timer */}
          <div className="countdown-container">
            <h3><NeonEmoji type="rocket" size={24} color="magenta" intensity="high" /> Full Launch Countdown</h3>
            <div className="countdown-grid">
              <div className="countdown-item">
                <span className="countdown-number">{countdown.days}</span>
                <span className="countdown-label">Days</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-number">{countdown.hours}</span>
                <span className="countdown-label">Hours</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-number">{countdown.minutes}</span>
                <span className="countdown-label">Minutes</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-number">{countdown.seconds}</span>
                <span className="countdown-label">Seconds</span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hero-buttons">
            <Link to="/pricing" className="btn btn-primary pulse">
              <NeonEmoji type="free" size={20} color="lime" intensity="high" /> Start Free Trial
            </Link>
            <Link to="/about" className="btn btn-secondary">
              Learn More
            </Link>
          </div>

          {/* Built for South Africans Badge */}
          <div className="sa-badge">
            <NeonEmoji type="sa-flag" size={24} color="multi" intensity="medium" className="flag-icon" />
            <span>Built for South Africans</span>
          </div>
        </div>

        {/* Dynamic Code Visualization */}
        <div className="code-visualization">
          <div className="floating-code-window">
            <div className="code-header">
              <div className="window-controls">
                <span className="control close"></span>
                <span className="control minimize"></span>
                <span className="control maximize"></span>
              </div>
              <span className="code-title">{codeSamples[currentCodeIndex].language}</span>
            </div>
            <div className="code-content">
              {codeSamples[currentCodeIndex].lines.slice(0, currentLine + 1).map((line, index) => (
                <div 
                  key={index} 
                  className={`code-line ${index === currentLine ? 'typing' : 'complete'}`}
                >
                  <span className="line-number">{index + 1}</span>
                  <span className="code-text">{line}</span>
                </div>
              ))}
              <div className="cursor-blink">|</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Development Timeline */}
      <div className="development-timeline">
        <h3><NeonEmoji type="gear" size={24} color="orange" intensity="high" /> Development Progress</h3>
        <div className="timeline-container">
          <div className="timeline-progress" style={{ width: `${timelineProgress}%` }}></div>
          {timelineSteps.map((step, index) => (
            <div 
              key={index}
              className={`timeline-step ${index === activeStep ? 'active' : ''} ${step.progress === 100 ? 'completed' : ''}`}
              style={{ '--step-color': step.color }}
            >
              <div className="step-icon">
                <NeonEmoji type={step.icon} size={20} color="cyan" intensity="medium" />
              </div>
              <div className="step-content">
                <span className="step-name">{step.name}</span>
                <div className="step-progress">
                  <div className="progress-bar" style={{ width: `${step.progress}%`, backgroundColor: step.color }}></div>
                </div>
                <span className="step-percentage">{step.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack Showcase */}
      <div className="tech-stack-showcase">
        <h3><NeonEmoji type="lightning" size={24} color="lime" intensity="high" /> Powered by Modern Technology</h3>
        <div className="tech-grid">
          {techStack.map((tech, index) => (
            <div key={index} className="tech-item" style={{ '--tech-color': tech.color }}>
              <div className="tech-icon">
                <NeonEmoji type={tech.icon} size={32} color="cyan" intensity="medium" />
              </div>
              <span className="tech-name">{tech.name}</span>
              <div className="tech-connections">
                {index < techStack.length - 1 && <div className="connection-line"></div>}
              </div>
            </div>
          ))}
        </div>

        {/* PWA Mockup */}
        <div className="pwa-mockup">
          <div className="phone-frame">
            <div className="phone-screen">
              <div className="app-header">
                <Logo size={24} />
                <span>AI Job Chommie</span>
              </div>
              <div className="app-content">
                <div className="job-card-mini">
                  <div className="job-title">Senior Developer</div>
                  <div className="job-company">Cape Town Tech</div>
                  <div className="match-score">98% Match</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* South African Context */}
      <div className="sa-context">
        <div className="sa-map">
          <div className="coverage-areas">
            <div className="city-pin cape-town">Cape Town</div>
            <div className="city-pin johannesburg">Johannesburg</div>
            <div className="city-pin durban">Durban</div>
            <div className="city-pin port-elizabeth">Port Elizabeth</div>
          </div>
        </div>
        
        <div className="local-stats">
        <h3><NeonEmoji type="sa-flag" size={24} color="multi" intensity="high" /> South African Job Market</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{jobStats.active.toLocaleString()}+</div>
              <div className="stat-label">Active Job Seekers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{jobStats.matched}+</div>
              <div className="stat-label">Daily Matches</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{jobStats.success}%</div>
              <div className="stat-label">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Matching Algorithm Visualization */}
      <div className="algorithm-visualization">
        <h3><NeonEmoji type="brain" size={24} color="magenta" intensity="high" /> AI Matching Algorithm</h3>
        <div className="algorithm-flow">
          <div className="flow-step">
            <div className="flow-icon">
              <NeonEmoji type="briefcase" size={28} color="cyan" intensity="medium" />
            </div>
            <div className="flow-text">Your Profile</div>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step active">
            <div className="flow-icon">
              <NeonEmoji type="brain" size={28} color="magenta" intensity="high" />
            </div>
            <div className="flow-text">AI Analysis</div>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <div className="flow-icon">
              <NeonEmoji type="target" size={28} color="lime" intensity="high" />
            </div>
            <div className="flow-text">Perfect Matches</div>
          </div>
        </div>
      </div>

      {/* Enhanced User Interaction Controls */}
      <div className="interaction-controls">
        <button className="control-btn play-pause">
          <NeonEmoji type="play" size={16} color="cyan" intensity="medium" />
        </button>
        <button className="control-btn expand-code">
          <NeonEmoji type="search" size={16} color="magenta" intensity="medium" />
        </button>
        <button className="control-btn speed-control">
          <NeonEmoji type="lightning" size={16} color="lime" intensity="high" />
        </button>
      </div>
    </section>
  );
};

export default EnhancedHeroSection;

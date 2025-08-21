import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Eye } from 'lucide-react';
import {
  MetallicButton,
  MetallicBadge,
  MetallicCard,
  SectionHeading
} from './ui/MetallicComponents';
import './ui/landing-hero.css';

const LandingHero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section
      className="landing-hero relative min-h-screen flex items-center justify-center text-center overflow-hidden"
      role="region"
      aria-label="Hero — Conquer your career with AI"
      tabIndex={-1}
    >
      {/* Raster fallback (produced from the 4K SVG) for crisp, fast rendering when available. */}
      <img
        src="/assets/hero-4k.png"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="landing-hero__raster absolute right-0 top-0 pointer-events-none"
      />

      {/* Large original 4K SVG backdrop: moon + soft spotlight that illuminates the heading.
         This artwork is original and crafted for the project; it's NOT a copy of any screenshot.
         The SVG's natural dimensions are 3840x2160 (4K). We scale it responsively with CSS. */}
      <svg
        className="landing-hero__svg-large absolute right-0 top-0 pointer-events-none"
        viewBox="0 0 3840 2160"
        width="3840"
        height="2160"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
        role="img"
      >
        <defs>
          {/* Deep space gradient */}
          <linearGradient id="bg-4k" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#06070a" />
            <stop offset="55%" stopColor="#0b1220" />
            <stop offset="100%" stopColor="#07101a" />
          </linearGradient>

          {/* Main moon radial gradient (warm center -> cool edge) */}
          <radialGradient id="moon-4k" cx="0.85" cy="0.12" r="0.28">
            <stop offset="0%" stopColor="#fff9f0" stopOpacity="0.98" />
            <stop offset="30%" stopColor="#f0f8ff" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#cfe7ff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0b1220" stopOpacity="0" />
          </radialGradient>

          {/* subtle moon surface texture using noise-like radial shapes */}
          <radialGradient id="moon-spot" cx="0.82" cy="0.09" r="0.06">
            <stop offset="0%" stopColor="#fff7e6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          {/* soft spotlight that casts light toward the hero heading area */}
          <radialGradient id="spotlight" cx="0.75" cy="0.2" r="0.4">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="25%" stopColor="#cfe7ff" stopOpacity="0.28" />
            <stop offset="60%" stopColor="#93c5fd" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#0b1220" stopOpacity="0" />
          </radialGradient>

          {/* vignette to focus center-left content */}
          <radialGradient id="vignette" cx="0.35" cy="0.5" r="0.9">
            <stop offset="0%" stopColor="#000000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.6" />
          </radialGradient>

          {/* soft blur filter for moon halo */}
          <filter id="soft-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="40" result="b" />
            <feComposite in="SourceGraphic" in2="b" operator="over" />
          </filter>
        </defs>

        {/* background */}
        <rect width="3840" height="2160" fill="url(#bg-4k)" />

        {/* large 4K moon positioned in the top-right corner */}
        <g transform="translate(2900,120)">
          <circle cx="0" cy="0" r="420" fill="url(#moon-4k)" filter="url(#soft-blur)" />
          {/* surface spot to add character */}
          <ellipse cx="-120" cy="-60" rx="110" ry="70" fill="url(#moon-spot)" opacity="0.6" />
          <ellipse cx="60" cy="40" rx="80" ry="50" fill="#e6f3ff" opacity="0.12" />
        </g>
          {/* large 4K moon positioned in the top-right corner (ENLARGED) */}
          <g transform="translate(3000,80)">
            {/* increased radius to create a dominant moon that casts a broad spotlight */}
            <circle cx="0" cy="0" r="900" fill="url(#moon-4k)" filter="url(#soft-blur)" />
            {/* surface spot to add character */}
            <ellipse cx="-220" cy="-120" rx="220" ry="140" fill="url(#moon-spot)" opacity="0.7" />
            <ellipse cx="140" cy="80" rx="160" ry="100" fill="#e6f3ff" opacity="0.18" />
          </g>

        {/* subtle spotlight overlay aimed at heading area (left of center) */}
        <rect width="3840" height="2160" fill="url(#spotlight)" opacity="0.6" transform="translate(-420,0) scale(1.05)" />
    {/* intensified spotlight overlay aimed at heading area (left of center) */}
    <rect width="3840" height="2160" fill="url(#spotlight)" opacity="0.78" transform="translate(-740,160) scale(1.12)" style={{mixBlendMode: 'screen'}} />

        {/* faint abstract shapes to give depth, kept subtle */}
        <path d="M1200 1600 C 1400 1200, 1900 1100, 2300 900 C 2600 760, 3000 600, 3400 520 L 3600 480 L 3000 480 C 2600 480, 2200 560, 1900 700 C 1700 800, 1500 930, 1200 1060 C 1000 1150, 900 1300, 1200 1600 Z" fill="#07111a" opacity="0.6" />

        {/* faint vignette to focus the bright area toward the hero text */}
        <rect width="3840" height="2160" fill="url(#vignette)" />
      </svg>

      <div className="responsive-container z-20">
        <header aria-labelledby="hero-heading" className="mb-6">
          <MetallicBadge variant="tech" size="lg" className="mb-4">LIVE • AI POWERED</MetallicBadge>
          <SectionHeading title="CONQUER YOUR CAREER" subtitle="AI-first job discovery for ambitious professionals" centered />
        </header>

        <main>
          <h1 id="hero-heading" className="text-4xl md:text-6xl lg:text-7xl xl:text-[8rem] font-heading font-black leading-none mb-6">
            <span className="block text-gradient-tech">UNLEASH</span>
            <span className="block text-chrome">YOUR CAREER</span>
          </h1>

          <p className="text-base md:text-xl lg:text-2xl text-text-secondary mb-8 max-w-3xl mx-auto">Fast, private, and intelligent job matches — tailored to your profile and ambitions.</p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-10">
            <MetallicButton
              type="button"
              aria-label="Sign up for Job Chommie"
              variant="tech"
              size="xl"
              onClick={() => navigate('/auth/signup')}
              icon={<Flame className="w-6 h-6" />}
            >
              Get Started
            </MetallicButton>

            <MetallicButton
              type="button"
              aria-label="View a demo of Job Chommie"
              variant="outline"
              size="xl"
              onClick={() => navigate('/demo')}
              icon={<Eye className="w-6 h-6" />}
            >
              See Demo
            </MetallicButton>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <MetallicCard className="p-6" role="group" aria-label="Jobs indexed">
              <div className="text-left">
                <div className="text-2xl font-black text-chrome">500K+</div>
                <div className="text-sm text-text-secondary">Jobs indexed</div>
              </div>
            </MetallicCard>
            <MetallicCard className="p-6" role="group" aria-label="Match accuracy">
              <div className="text-left">
                <div className="text-2xl font-black text-chrome">99.9%</div>
                <div className="text-sm text-text-secondary">Match accuracy</div>
              </div>
            </MetallicCard>
            <MetallicCard className="p-6" role="group" aria-label="Proprietary ranking">
              <div className="text-left">
                <div className="text-2xl font-black text-chrome">AI-Powered</div>
                <div className="text-sm text-text-secondary">Proprietary ranking</div>
              </div>
            </MetallicCard>
          </div>
        </main>
      </div>
    </section>
  );
};

export default LandingHero;

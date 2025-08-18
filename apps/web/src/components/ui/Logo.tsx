import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'default' | 'white' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  className = '', 
  variant = 'default' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const baseClasses = `${sizeClasses[size]} ${className}`;

  // For now, using an inline SVG representation of your logo
  // In production, you would save the actual logo files and reference them
  return (
    <div className={`${baseClasses} relative`}>
      {/* Chrome metallic brain logo */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        style={{
          filter: 'drop-shadow(0 0 10px rgba(192, 192, 192, 0.5))'
        }}
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e0e0e0" />
            <stop offset="25%" stopColor="#c0c0c0" />
            <stop offset="50%" stopColor="#a0a0a0" />
            <stop offset="75%" stopColor="#808080" />
            <stop offset="100%" stopColor="#606060" />
          </linearGradient>
          <linearGradient id="faceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2a2a2a" />
            <stop offset="50%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>
        </defs>
        
        {/* Main circle */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="url(#logoGradient)"
          stroke="#ffffff"
          strokeWidth="1"
        />
        
        {/* Brain hemisphere (left) */}
        <path
          d="M 15 30 Q 20 20 30 25 Q 35 15 45 20 Q 50 10 55 25 Q 60 30 50 50 Q 45 60 35 55 Q 25 65 20 50 Q 10 45 15 30 Z"
          fill="#333333"
          stroke="#666666"
          strokeWidth="0.5"
        />
        
        {/* Brain neural pathways */}
        <path
          d="M 20 35 Q 25 40 30 35 M 25 45 Q 30 50 35 45 M 30 30 Q 35 35 40 30"
          stroke="#555555"
          strokeWidth="1"
          fill="none"
        />
        
        {/* Face profile (right) */}
        <path
          d="M 50 25 Q 70 20 75 40 Q 80 50 75 60 Q 70 75 55 70 Q 50 65 50 50 L 50 25 Z"
          fill="url(#faceGradient)"
          stroke="#333333"
          strokeWidth="0.5"
        />
        
        {/* Eye */}
        <circle cx="65" cy="40" r="2" fill="#666666" />
        
        {/* Nose line */}
        <path d="M 70 45 L 72 50" stroke="#333333" strokeWidth="0.5" />
        
        {/* Mouth */}
        <path d="M 68 55 Q 70 57 72 55" stroke="#333333" strokeWidth="0.5" fill="none" />
        
        {/* Tech circuit lines */}
        <path
          d="M 20 25 L 25 20 M 75 25 L 80 20 M 20 75 L 25 80 M 75 75 L 80 80"
          stroke="#00ccff"
          strokeWidth="1"
          opacity="0.6"
        />
        
        {/* Central dividing line */}
        <line
          x1="50"
          y1="10"
          x2="50"
          y2="90"
          stroke="#666666"
          strokeWidth="1"
          opacity="0.3"
        />
      </svg>
    </div>
  );
};

export default Logo;

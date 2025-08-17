import React from 'react';

const LogoWithAssets = ({ size = 50, className = '' }) => {
  // This component can use different logo sizes
  // Using the actual logo files from your Google Drive
  const logoSizes = {
    small: '/logos/android-launchericon-48-48.png',
    medium: '/logos/android-launchericon-72-72.png',
    medium96: '/logos/android-launchericon-96-96.png',
    large: '/logos/android-launchericon-144-144.png',
    xl: '/logos/android-launchericon-192-192.png',
    xxl: '/logos/android-launchericon-512-512.png'
  };

  // Select appropriate logo size based on requested size
  const getLogoPath = (requestedSize) => {
    if (requestedSize <= 48) return logoSizes.small;
    if (requestedSize <= 72) return logoSizes.medium;
    if (requestedSize <= 96) return logoSizes.medium96;
    if (requestedSize <= 144) return logoSizes.large;
    if (requestedSize <= 192) return logoSizes.xl;
    return logoSizes.xxl;
  };

  const logoPath = getLogoPath(size);

  return (
    <div 
      className={`logo ${className}`}
      style={{ 
        width: size, 
        height: size, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}
    >
      <img
        src={logoPath}
        alt="AI Job Chommie Logo"
        width={size}
        height={size}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.6))'
        }}
        onError={(e) => {
          // Fallback to SVG logo if PNG fails
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'block';
        }}
      />
      
      {/* Fallback SVG Logo */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'none' }}
      >
        {/* Outer circle with gradient */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="url(#gradient)"
          stroke="#00ffff"
          strokeWidth="2"
        />
        
        {/* AI Symbol */}
        <text
          x="50"
          y="35"
          textAnchor="middle"
          fill="#000000"
          fontSize="20"
          fontFamily="Orbitron, monospace"
          fontWeight="bold"
        >
          AI
        </text>
        
        {/* Job Symbol */}
        <text
          x="50"
          y="55"
          textAnchor="middle"
          fill="#000000"
          fontSize="12"
          fontFamily="Rajdhani, sans-serif"
          fontWeight="600"
        >
          JOB
        </text>
        
        {/* Circuit pattern */}
        <path
          d="M20 70 L30 70 L30 75 L35 75 M35 70 L40 70 M45 75 L50 75 M55 70 L65 70 L65 75 L70 75 M75 70 L80 70"
          stroke="#ff00ff"
          strokeWidth="1.5"
          fill="none"
        />
        
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffff" />
            <stop offset="100%" stopColor="#ff00ff" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default LogoWithAssets;

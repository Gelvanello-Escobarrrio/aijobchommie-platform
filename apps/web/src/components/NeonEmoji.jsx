import React, { useState, useEffect } from 'react';

/**
 * NeonEmoji - High-resolution neon-style emoji component
 * Replaces Unicode emojis with professional neon PNG assets
 * Supports lazy loading, accessibility, and performance optimization
 */
const NeonEmoji = ({ 
  type, 
  size = 32, 
  className = '', 
  alt = '', 
  lazy = true,
  glow = true,
  intensity = 'medium', // 'low', 'medium', 'high'
  color = 'cyan', // 'cyan', 'magenta', 'lime', 'orange', 'multi'
  onClick = null,
  style = {}
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Emoji type mapping to file names
  const emojiMap = {
    // CTA & Navigation
    'mobile': 'mobile-phone-neon.png',
    'rocket': 'rocket-neon.png',
    'briefcase': 'briefcase-neon.png',
    'star': 'star-neon.png',
    'free': 'free-tag-neon.png',
    'trial': 'trial-clock-neon.png',
    
    // Metrics & Performance
    'checkmark': 'checkmark-neon.png',
    'target': 'target-neon.png',
    'chart': 'chart-up-neon.png',
    'growth': 'growth-arrow-neon.png',
    'success': 'success-circle-neon.png',
    'trophy': 'trophy-neon.png',
    
    // Technology & Features
    'lightning': 'lightning-neon.png',
    'gear': 'gear-neon.png',
    'brain': 'ai-brain-neon.png',
    'diamond': 'diamond-neon.png',
    'shield': 'shield-neon.png',
    'lock': 'lock-secure-neon.png',
    
    // Business & Money
    'money': 'money-bag-neon.png',
    'dollar': 'dollar-sign-neon.png',
    'coins': 'coins-neon.png',
    'profit': 'profit-graph-neon.png',
    'investment': 'investment-chart-neon.png',
    
    // Users & Community
    'users': 'users-group-neon.png',
    'person': 'person-neon.png',
    'handshake': 'handshake-neon.png',
    'network': 'network-nodes-neon.png',
    
    // Actions & Controls
    'play': 'play-button-neon.png',
    'pause': 'pause-button-neon.png',
    'search': 'search-magnify-neon.png',
    'download': 'download-neon.png',
    'upload': 'upload-neon.png',
    'settings': 'settings-neon.png',
    
    // Status & Feedback
    'fire': 'fire-flame-neon.png',
    'trending': 'trending-up-neon.png',
    'hot': 'hot-pepper-neon.png',
    'new': 'new-badge-neon.png',
    'verified': 'verified-badge-neon.png',
    
    // Location & Geography
    'sa-flag': 'south-africa-flag-neon.png',
    'location': 'location-pin-neon.png',
    'globe': 'globe-neon.png',
    
    // Time & Schedule
    'clock': 'clock-time-neon.png',
    'calendar': 'calendar-neon.png',
    'timer': 'timer-neon.png',
    'hourglass': 'hourglass-neon.png',
    
    // Communication
    'email': 'email-neon.png',
    'phone': 'phone-neon.png',
    'message': 'message-bubble-neon.png',
    'notification': 'notification-bell-neon.png'
  };

  const fileName = emojiMap[type] || 'default-neon.svg';
  const imagePath = `/src/assets/neon-emojis/${fileName.replace('.png', '.svg')}`;
  
  // Generate CSS classes based on props
  const generateClasses = () => {
    const classes = ['neon-emoji'];
    
    if (glow) classes.push(`neon-glow-${intensity}`);
    classes.push(`neon-color-${color}`);
    if (className) classes.push(className);
    if (onClick) classes.push('clickable');
    if (isLoaded) classes.push('loaded');
    if (hasError) classes.push('error');
    
    return classes.join(' ');
  };

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
  };

  // Handle image error with fallback
  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
  };

  // Generate fallback Unicode emoji if image fails
  const getFallbackEmoji = () => {
    const fallbackMap = {
      'mobile': '📱',
      'rocket': '🚀',
      'briefcase': '💼',
      'star': '⭐',
      'checkmark': '✅',
      'target': '🎯',
      'chart': '📈',
      'lightning': '⚡',
      'money': '💰',
      'users': '👥',
      'fire': '🔥',
      'sa-flag': '🇿🇦',
      'clock': '⏰',
      'email': '📧'
    };
    return fallbackMap[type] || '✨';
  };

  // Preload high-resolution images
  useEffect(() => {
    if (!lazy) {
      const img = new Image();
      img.src = imagePath;
      img.onload = handleLoad;
      img.onerror = handleError;
    }
  }, [imagePath, lazy]);

  return (
    <span 
      className={generateClasses()}
      onClick={onClick}
      role={onClick ? 'button' : 'img'}
      aria-label={alt || `${type} neon emoji`}
      tabIndex={onClick ? 0 : -1}
      style={{
        '--emoji-size': `${size}px`,
        '--emoji-glow-size': `${size * 1.5}px`,
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
    >
      {!hasError ? (
        <img
          src={imagePath}
          alt={alt || `${type} neon emoji`}
          width={size}
          height={size}
          loading={lazy ? 'lazy' : 'eager'}
          onLoad={handleLoad}
          onError={handleError}
          className="neon-emoji-image"
        />
      ) : (
        <span className="neon-emoji-fallback" role="img" aria-label={alt || `${type} emoji`}>
          {getFallbackEmoji()}
        </span>
      )}

      <style jsx>{`
        .neon-emoji {
          display: inline-block;
          position: relative;
          line-height: 1;
          vertical-align: middle;
          transition: all 0.3s ease;
        }

        .neon-emoji-image {
          display: block;
          width: var(--emoji-size);
          height: var(--emoji-size);
          object-fit: contain;
          transition: all 0.3s ease;
          filter: brightness(1.1) contrast(1.2);
        }

        .neon-emoji-fallback {
          display: inline-block;
          font-size: calc(var(--emoji-size) * 0.8);
          line-height: 1;
        }

        /* Glow Effects */
        .neon-glow-low .neon-emoji-image {
          filter: brightness(1.1) contrast(1.2) drop-shadow(0 0 4px currentColor);
        }

        .neon-glow-medium .neon-emoji-image {
          filter: brightness(1.2) contrast(1.3) 
                  drop-shadow(0 0 8px currentColor) 
                  drop-shadow(0 0 16px currentColor);
        }

        .neon-glow-high .neon-emoji-image {
          filter: brightness(1.3) contrast(1.4) 
                  drop-shadow(0 0 12px currentColor) 
                  drop-shadow(0 0 24px currentColor) 
                  drop-shadow(0 0 36px currentColor);
        }

        /* Color Themes */
        .neon-color-cyan {
          color: var(--primary-cyan, #00ffff);
        }

        .neon-color-magenta {
          color: var(--primary-magenta, #ff00ff);
        }

        .neon-color-lime {
          color: var(--accent-lime, #39ff14);
        }

        .neon-color-orange {
          color: var(--neon-orange, #ff6b00);
        }

        .neon-color-multi .neon-emoji-image {
          filter: brightness(1.2) contrast(1.3)
                  drop-shadow(0 0 8px #00ffff)
                  drop-shadow(2px 2px 8px #ff00ff)
                  drop-shadow(-2px -2px 8px #39ff14);
        }

        /* Interactive States */
        .neon-emoji.clickable {
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .neon-emoji.clickable:hover {
          transform: scale(1.1);
        }

        .neon-emoji.clickable:active {
          transform: scale(0.95);
        }

        .neon-emoji.clickable:focus {
          outline: 2px solid var(--primary-cyan);
          outline-offset: 2px;
          border-radius: 4px;
        }

        /* Loading Animation */
        .neon-emoji:not(.loaded) .neon-emoji-image {
          opacity: 0.5;
          animation: pulse 1.5s infinite;
        }

        .neon-emoji.loaded .neon-emoji-image {
          opacity: 1;
          animation: fadeIn 0.5s ease;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Error State */
        .neon-emoji.error .neon-emoji-fallback {
          filter: grayscale(0.3) brightness(0.8);
        }

        /* Responsive Sizing */
        @media (max-width: 768px) {
          .neon-emoji {
            --emoji-size: calc(var(--emoji-size) * 0.9);
          }
        }

        @media (max-width: 480px) {
          .neon-emoji {
            --emoji-size: calc(var(--emoji-size) * 0.8);
          }
        }

        /* Reduced Motion Support */
        @media (prefers-reduced-motion: reduce) {
          .neon-emoji,
          .neon-emoji-image,
          .neon-emoji.clickable {
            animation: none;
            transition: none;
          }

          .neon-emoji.clickable:hover {
            transform: none;
          }
        }

        /* High Contrast Support */
        @media (prefers-contrast: high) {
          .neon-emoji-image {
            filter: brightness(1.4) contrast(1.6);
          }
        }
      `}</style>
    </span>
  );
};

export default NeonEmoji;

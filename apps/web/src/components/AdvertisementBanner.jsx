import React, { useState, useEffect } from 'react';

// STRATEGIC ADVERTISEMENT BANNER COMPONENT
// Designed for maximum conversion with cyberpunk aesthetics
const AdvertisementBanner = ({ 
  position = 'hero-overlay', 
  adContent,
  adLink = '#',
  isVisible = true,
  dismissible = true,
  autoRotate = false,
  rotationInterval = 5000,
  className = ''
}) => {
  const [isShown, setIsShown] = useState(isVisible);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  // Auto-rotation for multiple ads
  useEffect(() => {
    if (autoRotate && Array.isArray(adContent) && adContent.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prevIndex) => 
          (prevIndex + 1) % adContent.length
        );
      }, rotationInterval);
      
      return () => clearInterval(interval);
    }
  }, [autoRotate, adContent, rotationInterval]);

  // Handle dismiss
  const handleDismiss = () => {
    setIsShown(false);
    // Store dismissal in localStorage to persist across sessions
    localStorage.setItem(`ad-dismissed-${position}`, Date.now().toString());
  };

  // Check if ad was previously dismissed (within 24 hours)
  useEffect(() => {
    const dismissTime = localStorage.getItem(`ad-dismissed-${position}`);
    if (dismissTime) {
      const hoursSinceDismiss = (Date.now() - parseInt(dismissTime)) / (1000 * 60 * 60);
      if (hoursSinceDismiss < 24) {
        setIsShown(false);
      }
    }
  }, [position]);

  if (!isShown) return null;

  const currentAd = Array.isArray(adContent) ? adContent[currentAdIndex] : adContent;

  // Get position-specific styling
  const getPositionStyles = () => {
    const baseStyles = 'ad-banner transition-all duration-300 ease-out';
    
    switch (position) {
      case 'hero-overlay':
        return `${baseStyles} ad-hero-overlay fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-4xl`;
      
      case 'floating-corner':
        return `${baseStyles} ad-floating-corner fixed bottom-6 right-6 z-40 w-80`;
      
      case 'section-break':
        return `${baseStyles} ad-section-break w-full max-w-6xl mx-auto my-12`;
      
      case 'sidebar-sticky':
        return `${baseStyles} ad-sidebar-sticky sticky top-24 w-full max-w-sm`;
      
      case 'footer-promo':
        return `${baseStyles} ad-footer-promo w-full max-w-4xl mx-auto mb-8`;
      
      case 'mobile-banner':
        return `${baseStyles} ad-mobile-banner fixed bottom-0 left-0 right-0 z-50 md:hidden`;
      
      default:
        return baseStyles;
    }
  };

  return (
    <div className={`${getPositionStyles()} ${className}`}>
      <div className="ad-container relative overflow-hidden bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-lg border border-cyan-400/30 rounded-lg shadow-2xl hover:shadow-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300">
        
        {/* Cyberpunk Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-pink-400/5 animate-pulse"></div>
        
        {/* Dismissible X Button */}
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 z-10 w-6 h-6 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold transition-colors"
            aria-label="Close advertisement"
          >
            ×
          </button>
        )}

        {/* Ad Content Container */}
        <a 
          href={currentAd?.link || adLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block p-4 hover:scale-[1.02] transition-transform duration-300"
        >
          <div className="flex items-center gap-4">
            
            {/* Ad Icon/Logo */}
            {currentAd?.icon && (
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-400 to-pink-400 rounded-lg flex items-center justify-center text-xl">
                {currentAd.icon}
              </div>
            )}

            {/* Ad Text Content */}
            <div className="flex-grow">
              <h3 className="text-cyan-400 font-orbitron font-bold text-lg mb-1 leading-tight">
                {currentAd?.title || 'Premium Opportunity'}
              </h3>
              
              <p className="text-gray-300 text-sm mb-2 leading-snug">
                {currentAd?.description || 'Discover amazing opportunities waiting for you'}
              </p>
              
              {currentAd?.cta && (
                <span className="inline-block px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-black text-xs font-bold rounded-full hover:from-cyan-400 hover:to-blue-400 transition-colors">
                  {currentAd.cta} →
                </span>
              )}
            </div>

            {/* Ad Image (if provided) */}
            {currentAd?.image && (
              <div className="flex-shrink-0 w-16 h-16 bg-gray-800 rounded-lg overflow-hidden">
                <img 
                  src={currentAd.image} 
                  alt={currentAd.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </a>

        {/* Rotation Indicator */}
        {autoRotate && Array.isArray(adContent) && adContent.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            {adContent.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentAdIndex 
                    ? 'bg-cyan-400' 
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        )}

        {/* Cyberpunk Border Animation */}
        <div className="absolute inset-0 border border-transparent bg-gradient-to-r from-cyan-400/20 via-transparent to-pink-400/20 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </div>
  );
};

// STRATEGIC AD PLACEMENTS WRAPPER COMPONENT
export const StrategicAdPlacements = ({ ads = {} }) => {
  return (
    <>
      {/* 1. HERO OVERLAY - Prime real estate */}
      {ads.heroOverlay && (
        <AdvertisementBanner
          position="hero-overlay"
          adContent={ads.heroOverlay}
          dismissible={true}
          className="animate-fade-in"
        />
      )}

      {/* 2. FLOATING CORNER - Always visible, non-intrusive */}
      {ads.floatingCorner && (
        <AdvertisementBanner
          position="floating-corner"
          adContent={ads.floatingCorner}
          dismissible={true}
          autoRotate={true}
          rotationInterval={8000}
        />
      )}

      {/* 3. MOBILE BANNER - Mobile-first approach */}
      {ads.mobileBanner && (
        <AdvertisementBanner
          position="mobile-banner"
          adContent={ads.mobileBanner}
          dismissible={true}
        />
      )}
    </>
  );
};

// INLINE AD COMPONENTS FOR CONTENT SECTIONS
export const InlineAdBanner = ({ adData, className = '' }) => (
  <AdvertisementBanner
    position="section-break"
    adContent={adData}
    dismissible={false}
    className={`my-16 ${className}`}
  />
);

export const SidebarAd = ({ adData, className = '' }) => (
  <AdvertisementBanner
    position="sidebar-sticky"
    adContent={adData}
    dismissible={true}
    className={className}
  />
);

export const FooterPromoAd = ({ adData, className = '' }) => (
  <AdvertisementBanner
    position="footer-promo"
    adContent={adData}
    dismissible={false}
    className={className}
  />
);

export default AdvertisementBanner;

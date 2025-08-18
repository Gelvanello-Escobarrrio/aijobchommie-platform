import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ======== PREMIUM METALLIC CARD ========
interface MetallicCardProps {
  children: React.ReactNode;
  className?: string;
  depth?: number; // 3D depth effect (1-5)
  glow?: 'none' | 'subtle' | 'medium' | 'intense';
  interactive?: boolean;
  border?: 'none' | 'light' | 'medium' | 'heavy' | 'glow';
  onClick?: () => void;
}

export const MetallicCard: React.FC<MetallicCardProps> = ({
  children,
  className = '',
  depth = 3,
  glow = 'subtle',
  interactive = true,
  border = 'light',
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Calculate 3D rotation effect based on mouse position
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateY = ((x - centerX) / centerX) * (depth * 2);
    const rotateX = ((centerY - y) / centerY) * (depth * 2);
    
    setRotation({ x: rotateX, y: rotateY });
  };

  // Reset rotation when mouse leaves
  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  // Handle border styles
  let borderClass = '';
  switch (border) {
    case 'light':
      borderClass = 'border border-border-light';
      break;
    case 'medium':
      borderClass = 'border border-border-medium';
      break;
    case 'heavy':
      borderClass = 'border border-border-heavy';
      break;
    case 'glow':
      borderClass = 'chrome-border';
      break;
    default:
      borderClass = '';
  }
  
  // Handle glow effect
  let glowClass = '';
  switch (glow) {
    case 'subtle':
      glowClass = 'shadow-chrome';
      break;
    case 'medium':
      glowClass = 'shadow-chrome-lg';
      break;
    case 'intense':
      glowClass = 'shadow-[0_0_30px_rgba(192,192,192,0.6),0_0_60px_rgba(0,204,255,0.3)]';
      break;
    default:
      glowClass = 'shadow-md';
  }

  return (
    <motion.div
      ref={cardRef}
      className={`card-premium overflow-hidden ${borderClass} ${glowClass} ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${isPressed ? 0.98 : isHovered ? 1.02 : 1})`,
        transition: isHovered ? 'none' : 'all 0.5s ease'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={onClick}
      whileHover={{ translateY: -5 }}
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
    >
      <div className="card-premium-content relative z-10">
        {children}
      </div>
      
      {isHovered && glow !== 'none' && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-glass-chrome to-transparent opacity-20"
          style={{ 
            transform: 'translateX(-100%)',
            animation: 'shine 2s infinite' 
          }} 
        />
      )}
    </motion.div>
  );
};

// ======== PREMIUM METALLIC BUTTON ========
interface MetallicButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'tech' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const MetallicButton: React.FC<MetallicButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  glow = true,
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  icon,
  iconPosition = 'left'
}) => {
  // Base classes for all button variants
  let baseClasses = 'relative inline-flex items-center justify-center font-heading font-semibold uppercase tracking-wider overflow-hidden';
  
  // Size classes
  let sizeClasses = '';
  switch (size) {
    case 'sm':
      sizeClasses = 'px-3 py-1.5 text-sm rounded-md';
      break;
    case 'lg':
      sizeClasses = 'px-6 py-3 text-lg rounded-lg';
      break;
    default:
      sizeClasses = 'px-4 py-2 text-base rounded-md';
  }
  
  // Variant classes
  let variantClasses = '';
  switch (variant) {
    case 'primary':
      variantClasses = 'btn-metallic';
      break;
    case 'secondary':
      variantClasses = 'bg-transparent border-2 border-metallic-primary text-metallic-primary hover:bg-metallic-shadow hover:text-bg-primary hover:border-metallic-shadow';
      break;
    case 'tech':
      variantClasses = 'btn-tech';
      break;
    case 'outline':
      variantClasses = 'bg-transparent border border-border-light text-text-secondary hover:border-tech-cyan hover:text-tech-cyan';
      break;
    case 'ghost':
      variantClasses = 'bg-transparent text-text-secondary hover:bg-glass-chrome hover:text-text-primary';
      break;
    default:
      variantClasses = 'btn-metallic';
  }
  
  // Glow effect
  const glowClasses = glow ? 'hover:shadow-glow' : '';
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Disabled classes
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';
  
  return (
    <motion.button
      type={type}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${glowClasses} ${widthClasses} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={{ scale: 0.98 }}
      whileHover={{ translateY: -2 }}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center bg-void-black bg-opacity-40 z-10">
          <div className="loading-spinner w-5 h-5" />
        </span>
      )}
      
      <span className="flex items-center justify-center gap-2">
        {icon && iconPosition === 'left' && (
          <span className="inline-flex">{icon}</span>
        )}
        
        {children}
        
        {icon && iconPosition === 'right' && (
          <span className="inline-flex">{icon}</span>
        )}
      </span>
      
      {variant === 'primary' && (
        <span 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
          style={{ 
            transform: 'translateX(-100%)',
            animation: 'shine 2s infinite' 
          }} 
        />
      )}
    </motion.button>
  );
};

// ======== PREMIUM SECTION HEADING ========
interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  decorative?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  align = 'left',
  className = '',
  decorative = true
}) => {
  let alignClass = '';
  
  switch (align) {
    case 'center':
      alignClass = 'text-center';
      break;
    case 'right':
      alignClass = 'text-right';
      break;
    default:
      alignClass = 'text-left';
  }
  
  return (
    <div className={`mb-12 ${alignClass} ${className}`}>
      <h2 className="text-chrome text-3xl md:text-4xl font-bold mb-4">
        {title}
      </h2>
      
      {subtitle && (
        <p className="text-text-secondary text-lg max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
      
      {decorative && (
        <div className="relative h-px w-24 mt-6 bg-gradient-to-r from-transparent via-tech-cyan to-transparent mx-auto">
          <div 
            className="absolute top-0 left-0 w-10 h-px bg-tech-cyan opacity-75"
            style={{ animation: 'slide-right 2s infinite' }}
          />
        </div>
      )}
    </div>
  );
};

// ======== PREMIUM INPUT FIELD ========
interface MetallicInputProps {
  label?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
  required?: boolean;
  icon?: React.ReactNode;
}

export const MetallicInput: React.FC<MetallicInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  className = '',
  id,
  name,
  required = false,
  icon
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-text-secondary text-sm font-medium mb-2"
        >
          {label}
          {required && <span className="text-state-error ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-tertiary">
            {icon}
          </div>
        )}
        
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`w-full px-4 py-2 bg-void-shadow border border-border-light rounded-md focus:border-tech-cyan focus:ring-1 focus:ring-tech-cyan transition-all ${
            icon ? 'pl-10' : ''
          } ${error ? 'border-state-error' : ''} ${
            disabled ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        />
      </div>
      
      {error && (
        <p className="text-state-error text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

// ======== PREMIUM BADGE ========
interface MetallicBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'tech' | 'chrome' | 'muted';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

export const MetallicBadge: React.FC<MetallicBadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  animated = false
}) => {
  let variantClass = '';
  
  switch (variant) {
    case 'tech':
      variantClass = 'badge-tech';
      break;
    case 'chrome':
      variantClass = 'badge-chrome';
      break;
    case 'muted':
      variantClass = 'bg-void-shadow text-text-tertiary';
      break;
    default:
      variantClass = 'bg-void-carbon border border-border-light text-text-secondary';
  }
  
  let sizeClass = '';
  
  switch (size) {
    case 'sm':
      sizeClass = 'text-xs py-0.5 px-2';
      break;
    case 'lg':
      sizeClass = 'text-sm py-1 px-3';
      break;
    default:
      sizeClass = 'text-xs py-1 px-2.5';
  }
  
  const animatedClass = animated ? 'premium-badge' : '';
  
  return (
    <span className={`inline-flex items-center justify-center rounded-full font-medium uppercase tracking-wider ${variantClass} ${sizeClass} ${animatedClass} ${className}`}>
      {children}
    </span>
  );
};

// ======== METALLIC TOOLTIP ========
interface MetallicTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const MetallicTooltip: React.FC<MetallicTooltipProps> = ({
  children,
  content,
  position = 'top',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  let positionClass = '';
  
  switch (position) {
    case 'bottom':
      positionClass = 'top-full left-1/2 transform -translate-x-1/2 mt-1';
      break;
    case 'left':
      positionClass = 'right-full top-1/2 transform -translate-y-1/2 mr-1';
      break;
    case 'right':
      positionClass = 'left-full top-1/2 transform -translate-y-1/2 ml-1';
      break;
    default:
      positionClass = 'bottom-full left-1/2 transform -translate-x-1/2 mb-1';
  }
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      ref={tooltipRef}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`absolute z-50 w-max max-w-xs ${positionClass} ${className}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
          >
            <div className="glass-panel-chrome rounded-md p-2 text-sm shadow-lg text-text-primary">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ======== PREMIUM STATS COUNTER ========
interface MetallicStatProps {
  value: number | string;
  label: string;
  icon?: React.ReactNode;
  className?: string;
  animated?: boolean;
}

export const MetallicStat: React.FC<MetallicStatProps> = ({
  value,
  label,
  icon,
  className = '',
  animated = true
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'number' ? value : 0;
  
  useEffect(() => {
    if (!animated || typeof value !== 'number') {
      return;
    }
    
    let start = 0;
    const duration = 2000;
    const increment = numericValue / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= numericValue) {
        setDisplayValue(numericValue);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [numericValue, animated, value]);
  
  return (
    <div className={`flex flex-col items-center p-4 ${className}`}>
      {icon && (
        <div className="text-tech-cyan mb-3 text-3xl">
          {icon}
        </div>
      )}
      
      <div className="stat-counter text-4xl font-bold">
        {animated && typeof value === 'number' ? displayValue : value}
      </div>
      
      <div className="stat-label text-sm uppercase tracking-wider text-text-secondary mt-1">
        {label}
      </div>
    </div>
  );
};

// ======== PREMIUM TABS ========
interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface MetallicTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  variant?: 'default' | 'pills' | 'underlined';
}

export const MetallicTabs: React.FC<MetallicTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
  variant = 'default'
}) => {
  let tabsContainerClass = '';
  let tabItemBaseClass = 'px-4 py-2 text-sm font-medium transition-all relative';
  let activeTabClass = '';
  let inactiveTabClass = '';
  
  switch (variant) {
    case 'pills':
      tabsContainerClass = 'flex space-x-2 p-1 bg-void-shadow rounded-lg';
      tabItemBaseClass = 'px-4 py-2 text-sm font-medium rounded-md transition-all';
      activeTabClass = 'bg-tech-cyan text-void-black shadow-md';
      inactiveTabClass = 'text-text-secondary hover:text-text-primary';
      break;
    case 'underlined':
      tabsContainerClass = 'flex border-b border-border-light';
      tabItemBaseClass = 'px-4 py-2 text-sm font-medium transition-all border-b-2 border-transparent -mb-px';
      activeTabClass = 'border-tech-cyan text-tech-cyan';
      inactiveTabClass = 'text-text-secondary hover:text-text-primary hover:border-border-light';
      break;
    default:
      tabsContainerClass = 'tabs';
      tabItemBaseClass = 'tab';
      activeTabClass = 'active';
      inactiveTabClass = '';
  }
  
  return (
    <div className={`${tabsContainerClass} ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${tabItemBaseClass} ${
            activeTab === tab.id ? activeTabClass : inactiveTabClass
          }`}
          onClick={() => onChange(tab.id)}
        >
          <div className="flex items-center gap-2">
            {tab.icon && <span>{tab.icon}</span>}
            {tab.label}
          </div>
        </button>
      ))}
    </div>
  );
};

// ======== METALLIC PROGRESS BAR ========
interface MetallicProgressProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'default' | 'tech' | 'chrome';
}

export const MetallicProgress: React.FC<MetallicProgressProps> = ({
  value,
  max = 100,
  label,
  showValue = false,
  size = 'md',
  className = '',
  variant = 'default'
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  let heightClass = '';
  switch (size) {
    case 'sm':
      heightClass = 'h-1';
      break;
    case 'lg':
      heightClass = 'h-3';
      break;
    default:
      heightClass = 'h-2';
  }
  
  let progressClass = '';
  switch (variant) {
    case 'tech':
      progressClass = 'bg-gradient-tech';
      break;
    case 'chrome':
      progressClass = 'bg-gradient-chrome';
      break;
    default:
      progressClass = 'bg-tech-cyan';
  }
  
  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1">
          {label && (
            <span className="text-sm text-text-secondary">{label}</span>
          )}
          {showValue && (
            <span className="text-sm text-text-secondary font-mono">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      
      <div className={`w-full ${heightClass} bg-void-shadow rounded-full overflow-hidden`}>
        <motion.div
          className={`${heightClass} ${progressClass} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

// ======== PREMIUM LOADING SPINNER ========
interface MetallicSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'tech' | 'chrome';
  className?: string;
}

export const MetallicSpinner: React.FC<MetallicSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  className = ''
}) => {
  let sizeClass = '';
  switch (size) {
    case 'sm':
      sizeClass = 'w-4 h-4 border-2';
      break;
    case 'lg':
      sizeClass = 'w-10 h-10 border-4';
      break;
    default:
      sizeClass = 'w-6 h-6 border-2';
  }
  
  let colorClass = '';
  switch (variant) {
    case 'tech':
      colorClass = 'border-void-carbon border-t-tech-cyan';
      break;
    case 'chrome':
      colorClass = 'border-void-carbon border-t-metallic-primary';
      break;
    default:
      colorClass = 'border-border-light border-t-tech-cyan';
  }
  
  return (
    <div className={`loading-spinner ${sizeClass} ${colorClass} ${className}`} />
  );
};

// ======== METALLIC ALERT ========
interface MetallicAlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  className?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
}

export const MetallicAlert: React.FC<MetallicAlertProps> = ({
  children,
  variant = 'info',
  className = '',
  icon,
  onClose
}) => {
  let variantClass = '';
  let iconColor = '';
  
  switch (variant) {
    case 'success':
      variantClass = 'alert-success';
      iconColor = 'text-state-success';
      break;
    case 'warning':
      variantClass = 'alert-warning';
      iconColor = 'text-state-warning';
      break;
    case 'error':
      variantClass = 'alert-error';
      iconColor = 'text-state-error';
      break;
    default:
      variantClass = 'alert-info';
      iconColor = 'text-state-info';
  }
  
  return (
    <motion.div
      className={`alert flex items-start gap-3 ${variantClass} ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      {icon && (
        <div className={`flex-shrink-0 ${iconColor}`}>
          {icon}
        </div>
      )}
      
      <div className="flex-grow">{children}</div>
      
      {onClose && (
        <button 
          onClick={onClose}
          className="flex-shrink-0 text-text-tertiary hover:text-text-primary transition-colors"
          aria-label="Close alert"
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M12 4L4 12M4 4L12 12" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </motion.div>
  );
};

// ======== PREMIUM TOGGLE SWITCH ========
interface MetallicToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const MetallicToggle: React.FC<MetallicToggleProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  className = ''
}) => {
  return (
    <label className={`inline-flex items-center cursor-pointer ${disabled ? 'opacity-50' : ''} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        
        <div className={`toggle-slider ${checked ? 'bg-gradient-tech' : 'bg-void-shadow'}`}></div>
      </div>
      
      {label && (
        <span className="ml-3 text-sm text-text-secondary">
          {label}
        </span>
      )}
    </label>
  );
};

// ======== AVATAR COMPONENT ========
interface MetallicAvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
  initials?: string;
}

export const MetallicAvatar: React.FC<MetallicAvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  status,
  className = '',
  initials
}) => {
  let sizeClass = '';
  let fontSize = '';
  
  switch (size) {
    case 'sm':
      sizeClass = 'w-8 h-8';
      fontSize = 'text-xs';
      break;
    case 'lg':
      sizeClass = 'w-12 h-12';
      fontSize = 'text-lg';
      break;
    case 'xl':
      sizeClass = 'w-16 h-16';
      fontSize = 'text-xl';
      break;
    default:
      sizeClass = 'w-10 h-10';
      fontSize = 'text-sm';
  }
  
  let statusColorClass = '';
  switch (status) {
    case 'online':
      statusColorClass = 'bg-state-success';
      break;
    case 'offline':
      statusColorClass = 'bg-text-tertiary';
      break;
    case 'away':
      statusColorClass = 'bg-state-warning';
      break;
    case 'busy':
      statusColorClass = 'bg-state-error';
      break;
  }
  
  return (
    <div className={`avatar relative ${sizeClass} ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className={`w-full h-full flex items-center justify-center bg-void-carbon text-text-primary font-medium ${fontSize}`}>
          {initials || alt.charAt(0).toUpperCase()}
        </div>
      )}
      
      {status && (
        <span className={`absolute bottom-0 right-0 block w-2.5 h-2.5 ${statusColorClass} rounded-full ring-2 ring-bg-primary`}></span>
      )}
    </div>
  );
};

// ======== AMBIENT LIGHTING EFFECT ========
export const AmbientLighting: React.FC = () => {
  return (
    <>
      <div className="ambient-light ambient-light-top" />
      <div className="ambient-light ambient-light-left" />
      <div className="ambient-light ambient-light-right" />
    </>
  );
};

// ======== CHROME SEPARATOR ========
interface ChromeSeparatorProps {
  className?: string;
  width?: 'full' | 'half' | 'quarter';
}

export const ChromeSeparator: React.FC<ChromeSeparatorProps> = ({
  className = '',
  width = 'full'
}) => {
  let widthClass = '';
  
  switch (width) {
    case 'half':
      widthClass = 'w-1/2 mx-auto';
      break;
    case 'quarter':
      widthClass = 'w-1/4 mx-auto';
      break;
    default:
      widthClass = 'w-full';
  }
  
  return (
    <div className={`separator-chrome ${widthClass} ${className}`} />
  );
};

// ======== PREMIUM FEATURES GRID ========
interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface MetallicFeaturesGridProps {
  features: FeatureItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export const MetallicFeaturesGrid: React.FC<MetallicFeaturesGridProps> = ({
  features,
  columns = 3,
  className = ''
}) => {
  let gridClass = '';
  
  switch (columns) {
    case 2:
      gridClass = 'grid-2';
      break;
    case 4:
      gridClass = 'grid-4';
      break;
    default:
      gridClass = 'grid-3';
  }
  
  return (
    <div className={`grid ${gridClass} gap-6 ${className}`}>
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className="card-premium p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex flex-col items-center text-center">
            <div className="text-tech-cyan text-3xl mb-4">{feature.icon}</div>
            <h3 className="text-lg font-heading font-bold mb-2">{feature.title}</h3>
            <p className="text-text-secondary">{feature.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

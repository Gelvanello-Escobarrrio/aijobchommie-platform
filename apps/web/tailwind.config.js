/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Color system based on the metallic logo aesthetic
      colors: {
        // Metallic colors from logo
        'metallic': {
          'primary': '#c0c0c0',
          'highlight': '#e8e8e8', 
          'shadow': '#7a7a7a',
          'accent': '#d3d3d3',
        },
        
        // Void blacks from logo
        'void': {
          'black': '#000000',
          'dark': '#0a0a0a',
          'shadow': '#121212',
          'carbon': '#1a1a1a',
        },
        
        // Tech accent colors
        'tech': {
          'blue': '#4d97ff',
          'cyan': '#00ccff',
        },
        
        // Background colors
        'bg': {
          'primary': 'var(--bg-primary)',
          'secondary': 'var(--bg-secondary)',
          'tertiary': 'var(--bg-tertiary)',
          'elevated': 'var(--bg-elevated)',
        },
        
        // Text colors
        'text': {
          'primary': 'var(--text-primary)',
          'secondary': 'var(--text-secondary)', 
          'tertiary': 'var(--text-tertiary)',
          'muted': 'var(--text-muted)',
          'inverse': 'var(--text-inverse)',
          'accent': 'var(--text-accent)',
        },
        
        // Border colors
        'border': {
          'light': 'var(--border-light)',
          'medium': 'var(--border-medium)',
          'heavy': 'var(--border-heavy)',
          'glow': 'var(--border-glow)',
        },
        
        // State colors
        'state': {
          'success': 'var(--state-success)',
          'warning': 'var(--state-warning)',
          'error': 'var(--state-error)',
          'info': 'var(--state-info)',
        },
        
        // Glass effects
        'glass': {
          'dark': 'var(--glass-dark)',
          'chrome': 'var(--glass-chrome)',
        },
        
        // Overlay colors
        'overlay': {
          'dark': 'var(--overlay-dark)',
        }
      },
      
      // Background gradients
      backgroundImage: {
        'gradient-chrome': 'var(--gradient-chrome)',
        'gradient-dark-chrome': 'var(--gradient-dark-chrome)',
        'gradient-void': 'var(--gradient-void)',
        'gradient-tech': 'var(--gradient-tech)',
      },
      
      // Font families
      fontFamily: {
        'sans': 'var(--font-sans)',
        'heading': 'var(--font-heading)',
        'mono': 'var(--font-mono)',
      },
      
      // Font sizes
      fontSize: {
        'xs': 'var(--text-xs)',
        'sm': 'var(--text-sm)',
        'base': 'var(--text-base)',
        'lg': 'var(--text-lg)',
        'xl': 'var(--text-xl)',
        '2xl': 'var(--text-2xl)',
        '3xl': 'var(--text-3xl)',
        '4xl': 'var(--text-4xl)',
        '5xl': 'var(--text-5xl)',
        '6xl': 'var(--text-6xl)',
      },
      
      // Font weights
      fontWeight: {
        'thin': 'var(--weight-thin)',
        'light': 'var(--weight-light)',
        'normal': 'var(--weight-normal)',
        'medium': 'var(--weight-medium)',
        'semibold': 'var(--weight-semibold)',
        'bold': 'var(--weight-bold)',
        'black': 'var(--weight-black)',
      },
      
      // Line heights
      lineHeight: {
        'none': 'var(--leading-none)',
        'tight': 'var(--leading-tight)',
        'snug': 'var(--leading-snug)',
        'normal': 'var(--leading-normal)',
        'relaxed': 'var(--leading-relaxed)',
        'loose': 'var(--leading-loose)',
      },
      
      // Spacing
      spacing: {
        '3xs': 'var(--space-3xs)',
        '2xs': 'var(--space-2xs)',
        'xs': 'var(--space-xs)',
        'sm': 'var(--space-sm)',
        'md': 'var(--space-md)',
        'lg': 'var(--space-lg)',
        'xl': 'var(--space-xl)',
        '2xl': 'var(--space-2xl)',
        '3xl': 'var(--space-3xl)',
      },
      
      // Border radius
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
        'full': 'var(--radius-full)',
      },
      
      // Box shadow
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        'chrome': 'var(--shadow-chrome)',
        'chrome-lg': 'var(--shadow-chrome-lg)',
        'glow': 'var(--glow-chrome)',
        'glow-subtle': 'var(--glow-subtle)',
        'glow-tech': 'var(--glow-tech)',
      },
      
      // Z-index
      zIndex: {
        'background': 'var(--z-background)',
        'default': 'var(--z-default)',
        'elevated': 'var(--z-elevated)',
        'sticky': 'var(--z-sticky)',
        'overlay': 'var(--z-overlay)',
        'modal': 'var(--z-modal)',
        'toast': 'var(--z-toast)',
      },
      
      // Transitions
      transitionDuration: {
        'fast': 'var(--transition-fast)',
        'normal': 'var(--transition-normal)',
        'slow': 'var(--transition-slow)',
      },
      
      // Blur
      blur: {
        'sm': 'var(--blur-sm)',
        'md': 'var(--blur-md)',
        'lg': 'var(--blur-lg)',
      },
      
      // Opacity
      opacity: {
        '5': 'var(--opacity-5)',
        '10': 'var(--opacity-10)',
        '20': 'var(--opacity-20)',
        '30': 'var(--opacity-30)',
        '40': 'var(--opacity-40)',
        '50': 'var(--opacity-50)',
        '60': 'var(--opacity-60)',
        '70': 'var(--opacity-70)',
        '80': 'var(--opacity-80)',
        '90': 'var(--opacity-90)',
      },
      
      // Animation
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-left': 'slideLeft 0.5s ease-out',
        'slide-right': 'slideRight 0.5s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'glow-pulse': 'glowPulse 2s infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'floating': 'floating 3s ease-in-out infinite',
        'metal-shine': 'metalShine 5s linear infinite',
      },
      
      // Keyframes
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 5px var(--tech-cyan)' },
          '50%': { boxShadow: '0 0 20px var(--tech-cyan), 0 0 30px rgba(0, 204, 255, 0.5)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        floating: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        metalShine: {
          '0%': { transform: 'translateX(-100%) rotate(45deg)' },
          '100%': { transform: 'translateX(100%) rotate(45deg)' },
        },
      },
      
      // Custom screen sizes for better responsive design
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
      },
      
      // Container sizes
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
          xl: '2.5rem',
          '2xl': '3rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1400px',
        },
      },
      
      // Aspect ratios
      aspectRatio: {
        '4/3': '4 / 3',
        '3/2': '3 / 2',
        '2/3': '2 / 3',
        '9/16': '9 / 16',
      },
      
      // Backdrop blur
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      
      // Backdrop brightness
      backdropBrightness: {
        '25': '0.25',
        '50': '0.5',
        '75': '0.75',
        '90': '0.9',
        '95': '0.95',
        '105': '1.05',
        '110': '1.1',
        '125': '1.25',
      },
      
      // Transform
      scale: {
        '98': '0.98',
        '102': '1.02',
        '103': '1.03',
        '105': '1.05',
      },
      
      // Rotate
      rotate: {
        '1': '1deg',
        '2': '2deg',
        '3': '3deg',
        '5': '5deg',
        '10': '10deg',
        '15': '15deg',
      },
    },
  },
  plugins: [
    // Add custom utilities
    function({ addUtilities, theme }) {
      const newUtilities = {
        // Chrome text effect
        '.text-chrome': {
          background: 'var(--gradient-chrome)',
          '-webkit-background-clip': 'text',
          'background-clip': 'text',
          'color': 'transparent',
          'font-weight': theme('fontWeight.bold'),
        },
        
        // Glass panel effects
        '.glass-panel': {
          background: 'rgba(10, 10, 10, 0.7)',
          'backdrop-filter': 'blur(10px) saturate(180%)',
          border: '1px solid var(--border-light)',
          'box-shadow': 'var(--shadow-lg)',
        },
        
        '.glass-panel-chrome': {
          background: 'rgba(25, 25, 25, 0.7)',
          'backdrop-filter': 'blur(10px) saturate(180%)',
          border: '1px solid var(--border-medium)',
          'box-shadow': '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(192, 192, 192, 0.2)',
        },
        
        // Chrome border effect
        '.chrome-border': {
          position: 'relative',
          border: '1px solid transparent',
          'background-clip': 'padding-box',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '0',
            right: '0',
            bottom: '0',
            left: '0',
            margin: '-1px',
            'border-radius': 'inherit',
            background: 'var(--gradient-chrome)',
            'z-index': '-1',
          },
        },
        
        // Gradient backgrounds
        '.bg-gradient-chrome': {
          background: 'var(--gradient-chrome)',
        },
        
        '.bg-gradient-dark-chrome': {
          background: 'var(--gradient-dark-chrome)',
        },
        
        '.bg-gradient-void': {
          background: 'var(--gradient-void)',
        },
        
        '.bg-gradient-tech': {
          background: 'var(--gradient-tech)',
        },
        
        // Premium shadows
        '.shadow-chrome': {
          'box-shadow': 'var(--shadow-chrome)',
        },
        
        '.shadow-chrome-lg': {
          'box-shadow': 'var(--shadow-chrome-lg)',
        },
        
        // Glow effects
        '.glow-subtle': {
          'box-shadow': 'var(--glow-subtle)',
        },
        
        '.glow-chrome': {
          'box-shadow': 'var(--glow-chrome)',
        },
        
        '.glow-tech': {
          'box-shadow': 'var(--glow-tech)',
        },
        
        // 3D perspective
        '.perspective-1000': {
          perspective: '1000px',
        },
        
        '.preserve-3d': {
          'transform-style': 'preserve-3d',
        },
        
        // Premium card styles
        '.card-premium': {
          background: 'var(--bg-card)',
          'border-radius': 'var(--radius-lg)',
          padding: 'var(--space-xl)',
          'box-shadow': 'var(--shadow-chrome)',
          border: '1px solid var(--border-light)',
          transition: 'all var(--transition-normal)',
          transform: 'perspective(1000px) rotateX(0) rotateY(0) scale(1)',
          'transform-style': 'preserve-3d',
        },
        
        // Button styles
        '.btn-metallic': {
          background: 'var(--gradient-dark-chrome)',
          color: 'var(--text-primary)',
          border: 'none',
          padding: '0.75rem 1.5rem',
          'border-radius': 'var(--radius-md)',
          'font-weight': 'var(--weight-medium)',
          'box-shadow': '0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          transition: 'all var(--transition-normal)',
          'text-transform': 'uppercase',
          'letter-spacing': '0.05em',
          position: 'relative',
          overflow: 'hidden',
        },
        
        '.btn-tech': {
          background: 'var(--gradient-tech)',
          color: 'var(--text-inverse)',
          border: 'none',
          padding: '0.75rem 1.5rem',
          'border-radius': 'var(--radius-md)',
          'font-weight': 'var(--weight-semibold)',
          'box-shadow': '0 4px 10px rgba(0, 204, 255, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)',
          transition: 'all var(--transition-normal)',
          position: 'relative',
          overflow: 'hidden',
        },
        
        // Underline effect for links
        '.underline-effect': {
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            left: '0',
            bottom: '-2px',
            width: '0',
            height: '1px',
            background: 'var(--tech-cyan)',
            transition: 'width var(--transition-normal)',
          },
          '&:hover::after': {
            width: '100%',
          },
        },
        
        // Custom scrollbar
        '.scrollbar-custom': {
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'var(--bg-secondary)',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'var(--metallic-shadow)',
            'border-radius': '4px',
            border: '2px solid var(--bg-secondary)',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'var(--metallic-primary)',
          },
        },
      }

      addUtilities(newUtilities);
    },
    
    // Additional plugins for forms, typography, etc.
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
  
  // Dark mode strategy
  darkMode: 'class',
  
  // Important for overriding existing styles
  important: false,
};

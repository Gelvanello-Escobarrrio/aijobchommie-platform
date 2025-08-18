import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { MetallicButton, MetallicBadge } from './ui/MetallicComponents';
import { 
  Brain, 
  Menu, 
  X, 
  Home, 
  Briefcase, 
  User, 
  Settings, 
  CreditCard, 
  FileText,
  Mail,
  HelpCircle,
  LogIn,
  UserPlus,
  Zap
} from 'lucide-react';

interface NavigationProps {
  user?: any;
  onAuthAction?: (action: 'login' | 'register') => void;
}

const Navigation: React.FC<NavigationProps> = ({ user, onAuthAction }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Navigation items for authenticated users
  const authenticatedNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <Home /> },
    { label: 'Jobs', path: '/jobs', icon: <Briefcase /> },
    { label: 'Profile', path: '/profile', icon: <User /> },
    { label: 'Applications', path: '/applications', icon: <FileText /> },
    { label: 'Settings', path: '/settings', icon: <Settings /> },
  ];

  // Navigation items for public pages
  const publicNavItems = [
    { label: 'Features', path: '/#features', icon: <Zap /> },
    { label: 'Pricing', path: '/pricing', icon: <CreditCard /> },
    { label: 'About', path: '/about', icon: <User /> },
    { label: 'Contact', path: '/contact', icon: <Mail /> },
    { label: 'Help', path: '/help', icon: <HelpCircle /> },
  ];

  const navItems = user ? authenticatedNavItems : publicNavItems;

  const isActivePath = (path: string) => {
    if (path.startsWith('/#')) {
      return false; // Handle anchor links separately
    }
    return location.pathname === path;
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled 
            ? 'glass-panel-chrome border-b border-border-light shadow-chrome' 
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <motion.div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-chrome rounded-lg flex items-center justify-center shadow-chrome hover:shadow-chrome-lg transition-shadow">
                  <Brain className="w-6 h-6 text-void-black" />
                </div>
                
                {/* Pulse effect for logo */}
                <div className="absolute inset-0 rounded-lg bg-gradient-chrome opacity-75 animate-pulse"></div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-chrome text-xl font-heading font-bold">
                  AI Job Chommie
                </span>
                <span className="text-xs text-text-tertiary hidden sm:block">
                  Intelligent Career Acceleration
                </span>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {navItems.slice(0, 4).map((item) => (
                <motion.button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg flex items-center space-x-2 ${
                    isActivePath(item.path)
                      ? 'text-tech-cyan bg-glass-chrome'
                      : 'text-text-secondary hover:text-tech-cyan hover:bg-glass-chrome'
                  }`}
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 0 }}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.label}</span>
                  
                  {isActivePath(item.path) && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-tech-cyan"
                      layoutId="activeTab"
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* User Actions / Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <>
                  {/* User Menu */}
                  <div className="flex items-center space-x-3">
                    <MetallicBadge variant="tech" size="sm">
                      Pro Member
                    </MetallicBadge>
                    
                    <div className="relative group">
                      <div className="w-10 h-10 bg-gradient-chrome rounded-full flex items-center justify-center cursor-pointer shadow-md hover:shadow-lg transition-shadow">
                        <span className="text-void-black font-bold text-sm">
                          {user.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      
                      {/* Dropdown Menu */}
                      <div className="absolute right-0 top-full mt-2 w-48 glass-panel-chrome rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <div className="p-2">
                          <div className="px-3 py-2 border-b border-border-light">
                            <div className="font-medium text-text-primary">{user.name}</div>
                            <div className="text-sm text-text-tertiary">{user.email}</div>
                          </div>
                          
                          <button 
                            onClick={() => navigate('/profile')}
                            className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:text-tech-cyan hover:bg-glass-chrome rounded-md transition-colors flex items-center space-x-2 mt-2"
                          >
                            <User className="w-4 h-4" />
                            <span>Profile</span>
                          </button>
                          
                          <button 
                            onClick={() => navigate('/settings')}
                            className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:text-tech-cyan hover:bg-glass-chrome rounded-md transition-colors flex items-center space-x-2"
                          >
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                          </button>
                          
                          <button 
                            onClick={() => navigate('/subscription')}
                            className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:text-tech-cyan hover:bg-glass-chrome rounded-md transition-colors flex items-center space-x-2"
                          >
                            <CreditCard className="w-4 h-4" />
                            <span>Subscription</span>
                          </button>
                          
                          <div className="border-t border-border-light mt-2 pt-2">
                            <button 
                              onClick={() => {/* Handle logout */}}
                              className="w-full text-left px-3 py-2 text-sm text-state-error hover:bg-red-500/10 rounded-md transition-colors"
                            >
                              Sign Out
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <MetallicButton 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onAuthAction?.('login')}
                    icon={<LogIn />}
                  >
                    Sign In
                  </MetallicButton>
                  
                  <MetallicButton 
                    variant="tech" 
                    size="sm"
                    onClick={() => onAuthAction?.('register')}
                    icon={<UserPlus />}
                  >
                    Get Started
                  </MetallicButton>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-text-secondary hover:text-tech-cyan transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-overlay-dark z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] glass-panel-chrome z-50 lg:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border-light">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-chrome rounded-lg flex items-center justify-center">
                      <Brain className="w-4 h-4 text-void-black" />
                    </div>
                    <span className="text-chrome font-heading font-bold">Menu</span>
                  </div>
                  
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-text-secondary hover:text-tech-cyan transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 px-6 py-4">
                  <div className="space-y-2">
                    {navItems.map((item, index) => (
                      <motion.button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                          isActivePath(item.path)
                            ? 'bg-tech-cyan text-void-black shadow-md'
                            : 'text-text-secondary hover:text-tech-cyan hover:bg-glass-chrome'
                        }`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Separator */}
                  <div className="h-px bg-gradient-chrome my-6 opacity-30" />

                  {/* User Section */}
                  {user ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 px-4 py-3 bg-glass-chrome rounded-lg">
                        <div className="w-10 h-10 bg-gradient-chrome rounded-full flex items-center justify-center">
                          <span className="text-void-black font-bold text-sm">
                            {user.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-text-primary text-sm">{user.name}</div>
                          <div className="text-xs text-text-tertiary">{user.email}</div>
                        </div>
                      </div>
                      
                      <MetallicButton 
                        variant="outline" 
                        size="sm" 
                        fullWidth
                        onClick={() => {/* Handle logout */}}
                      >
                        Sign Out
                      </MetallicButton>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <MetallicButton 
                        variant="outline" 
                        size="sm" 
                        fullWidth
                        onClick={() => onAuthAction?.('login')}
                        icon={<LogIn />}
                      >
                        Sign In
                      </MetallicButton>
                      
                      <MetallicButton 
                        variant="tech" 
                        size="sm" 
                        fullWidth
                        onClick={() => onAuthAction?.('register')}
                        icon={<UserPlus />}
                      >
                        Get Started
                      </MetallicButton>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border-light">
                  <div className="flex items-center justify-center space-x-2">
                    <MetallicBadge variant="tech" size="sm">AI Powered</MetallicBadge>
                    <MetallicBadge variant="chrome" size="sm">South African</MetallicBadge>
                  </div>
                  
                  <p className="text-center text-xs text-text-tertiary mt-3">
                    © 2024 AI Job Chommie
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;

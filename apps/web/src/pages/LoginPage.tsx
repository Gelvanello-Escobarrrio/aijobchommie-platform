import { motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle,
  Chrome,
  Eye,
  EyeOff,
  Github,
  Lock,
  LogIn,
  Mail,
  Shield,
  Zap
} from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  AmbientLighting,
  ChromeSeparator,
  MetallicBadge,
  MetallicButton,
  MetallicCard,
  MetallicInput,
  MetallicToggle
} from '../components/ui/MetallicComponents';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock validation
      if (formData.email === 'admin@aijobchommie.co.za' && formData.password === 'admin123') {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // Implement social login
  };

  const features = [
    { icon: <Zap />, text: 'AI-Powered Job Matching' },
    { icon: <Shield />, text: 'Secure & Private' },
    { icon: <CheckCircle />, text: '95% Success Rate' }
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary relative overflow-hidden">
      <AmbientLighting />

      <div className="min-h-screen flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          <div className="flex flex-col justify-center items-center p-12 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient-chrome rounded-full flex items-center justify-center mx-auto mb-8">
                <LogIn className="w-10 h-10 text-void-black" />
              </div>

              <h1 className="text-4xl font-heading font-black text-chrome mb-4">
                Welcome Back to
                <br />
                <span className="bg-gradient-tech bg-clip-text text-transparent">
                  AI Job Chommie
                </span>
              </h1>

              <p className="text-lg text-text-secondary mb-8 max-w-md">
                Your intelligent career companion is ready to help you find
                your next opportunity in South Africa.
              </p>

              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-8 h-8 bg-gradient-tech rounded-lg flex items-center justify-center">
                      <div className="text-void-black text-sm">{feature.icon}</div>
                    </div>
                    <span className="text-text-secondary">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-tech-cyan rounded-full"></div>
            <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-chrome rounded-lg rotate-45"></div>
            <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-gradient-tech rounded-full opacity-20"></div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md"
          >
            <MetallicCard className="p-8" glow="medium">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-heading font-bold text-chrome mb-2">
                  Sign In
                </h2>
                <p className="text-text-secondary">
                  Access your AI-powered job search dashboard
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-state-error/10 border border-state-error rounded-lg flex items-center space-x-3"
                >
                  <AlertCircle className="w-5 h-5 text-state-error flex-shrink-0" />
                  <span className="text-state-error text-sm">{error}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <MetallicInput
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  required
                  icon={<Mail />}
                />

                <div className="relative">
                  <MetallicInput
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required
                    icon={<Lock />}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-text-tertiary hover:text-text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <MetallicToggle
                    checked={formData.rememberMe}
                    onChange={(checked: boolean) => setFormData({...formData, rememberMe: checked})}
                    label="Remember me"
                  />

                  <Link
                    to="/forgot-password"
                    className="text-sm text-tech-cyan hover:text-chrome transition-colors underline-effect"
                  >
                    Forgot password?
                  </Link>
                </div>

                <MetallicButton
                  type="submit"
                  variant="tech"
                  size="lg"
                  fullWidth
                  loading={loading}
                  icon={<LogIn />}
                  iconPosition="right"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </MetallicButton>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <ChromeSeparator />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-bg-primary text-text-tertiary">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <MetallicButton
                    variant="outline"
                    onClick={() => handleSocialLogin('google')}
                    icon={<Chrome />}
                  >
                    Google
                  </MetallicButton>

                  <MetallicButton
                    variant="outline"
                    onClick={() => handleSocialLogin('github')}
                    icon={<Github />}
                  >
                    GitHub
                  </MetallicButton>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-text-secondary">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="text-tech-cyan hover:text-chrome transition-colors font-medium underline-effect"
                  >
                    Sign up for free
                  </Link>
                </p>
              </div>

              <div className="mt-6 text-center">
                <MetallicBadge variant="tech" size="sm">
                  Demo: admin@aijobchommie.co.za / admin123
                </MetallicBadge>
              </div>
            </MetallicCard>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-center"
            >
              <div className="flex items-center justify-center space-x-6 text-text-tertiary text-sm">
                <span className="flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  Bank-Level Security
                </span>
                <span className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  POPI Act Compliant
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

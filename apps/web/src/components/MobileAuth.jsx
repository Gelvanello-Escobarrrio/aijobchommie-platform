import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiPhone, 
  FiArrowLeft, FiCheck, FiAlertCircle 
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const MobileAuth = ({ initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, register, forgotPassword } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (mode !== 'forgot') {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    if (mode === 'register') {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
        toast.success('Welcome back!');
      } else if (mode === 'register') {
        await register(formData);
        toast.success('Account created successfully!');
      } else if (mode === 'forgot') {
        await forgotPassword(formData.email);
        toast.success('Reset link sent to your email!');
        setMode('login');
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ icon: Icon, label, type, name, placeholder, ...props }) => (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-medium mb-2">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:border-blue-500 transition-colors ${
            errors[name] ? 'border-red-500' : 'border-gray-200'
          }`}
          placeholder={placeholder}
          {...props}
        />
        {name === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>
      {errors[name] && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-xs mt-1 flex items-center"
        >
          <FiAlertCircle className="w-3 h-3 mr-1" />
          {errors[name]}
        </motion.p>
      )}
    </div>
  );

  const pageVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-3 flex items-center">
        {mode !== 'login' && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setMode('login')}
            className="mr-3 p-2 rounded-full hover:bg-gray-100"
          >
            <FiArrowLeft className="w-5 h-5" />
          </motion.button>
        )}
        <h1 className="text-lg font-bold text-gray-900">
          {mode === 'login' ? 'Welcome Back' : 
           mode === 'register' ? 'Create Account' : 'Reset Password'}
        </h1>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6">
              {/* Logo */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                >
                  <FiUser className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  AI Job Chommie
                </h2>
                <p className="text-gray-600 text-sm">
                  {mode === 'login' ? 'Sign in to your account' :
                   mode === 'register' ? 'Create your account to get started' :
                   'Enter your email to reset password'}
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {mode === 'register' && (
                  <InputField
                    icon={FiUser}
                    label="Full Name"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                  />
                )}

                <InputField
                  icon={FiMail}
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                />

                {mode === 'register' && (
                  <InputField
                    icon={FiPhone}
                    label="Phone Number (Optional)"
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                  />
                )}

                {mode !== 'forgot' && (
                  <InputField
                    icon={FiLock}
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                  />
                )}

                {mode === 'register' && (
                  <InputField
                    icon={FiLock}
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                  />
                )}

                {mode === 'login' && (
                  <div className="flex justify-end mb-6">
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-blue-600 text-sm font-medium hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      {mode === 'login' ? 'Sign In' :
                       mode === 'register' ? 'Create Account' : 'Send Reset Link'}
                      <FiCheck className="w-4 h-4 ml-2" />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Footer */}
              <div className="mt-6 text-center">
                {mode === 'login' ? (
                  <p className="text-gray-600 text-sm">
                    Don't have an account?{' '}
                    <button
                      onClick={() => setMode('register')}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      Sign Up
                    </button>
                  </p>
                ) : mode === 'register' ? (
                  <p className="text-gray-600 text-sm">
                    Already have an account?{' '}
                    <button
                      onClick={() => setMode('login')}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      Sign In
                    </button>
                  </p>
                ) : (
                  <p className="text-gray-600 text-sm">
                    Remember your password?{' '}
                    <button
                      onClick={() => setMode('login')}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      Sign In
                    </button>
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MobileAuth;

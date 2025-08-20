/**
 *  AUTHENTICATION CONTEXT
 * 
 * Provides authentication state and methods throughout the app
 * Integrates with Supabase and custom JWT authentication
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import toast from 'react-hot-toast';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lukxqkgxayijqlqslabs.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1a3hxa2d4YXlpanFscXNsYWJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzE3NTIsImV4cCI6MjA2ODkwNzc1Mn0.SC9nZEsl1z4E_vvkQIBaWVBqnlOciMgBI5pZy3AopF0';
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// User interface
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profileImage?: string;
  location?: string;
  province?: string;
  city?: string;
  role: 'user' | 'employer' | 'admin';
  subscriptionPlan: 'free' | 'basic' | 'premium';
  subscriptionStatus: 'active' | 'cancelled' | 'expired';
  isVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configure axios defaults
axios.defaults.baseURL = apiUrl;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add request interceptor to include auth token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle auth errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Authentication Provider Component
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Initialize authentication state
   */
  useEffect(() => {
    initializeAuth();
  }, []);

  /**
   * Initialize authentication on app start
   */
  const initializeAuth = async () => {
    try {
      // Check for stored token and user
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          
          // Verify token is still valid
          await refreshUser();
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
        }
      }

      // Also check Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      if (session && !user) {
        // Convert Supabase user to our user format
        await handleSupabaseUser(session.user);
      }

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await handleSupabaseUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          handleSignOut();
        }
      });

      return () => subscription.unsubscribe();
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Supabase user data
   */
  const handleSupabaseUser = async (supabaseUser: any) => {
    try {
      // Get or create user profile from our API
      const response = await axios.post('/api/v1/auth/supabase-signin', {
        supabaseUserId: supabaseUser.id,
        email: supabaseUser.email,
        firstName: supabaseUser.user_metadata?.firstName || supabaseUser.email.split('@')[0],
        lastName: supabaseUser.user_metadata?.lastName || '',
        phone: supabaseUser.phone || supabaseUser.user_metadata?.phone
      });

      if (response.data.success) {
        const userData = response.data.data.user;
        const token = response.data.data.token;

        // Store token and user data
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
    } catch (error) {
      console.error('Error handling Supabase user:', error);
      toast.error('Authentication error occurred');
    }
  };

  /**
   * Sign up with email and password
   */
  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      setLoading(true);

      // Sign up with our API
      const response = await axios.post('/api/v1/auth/register', {
        email,
        password,
        firstName,
        lastName
      });

      if (response.data.success) {
        const userData = response.data.data.user;
        const token = response.data.data.token;

        // Store token and user data
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);

        toast.success('Welcome to AI Job Chommie! ');
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign in with email and password
   */
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);

      // Sign in with our API
      const response = await axios.post('/api/v1/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        const userData = response.data.data.user;
        const token = response.data.data.token;

        // Store token and user data
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);

        toast.success(`Welcome back, ${userData.firstName}! `);
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign out user
   */
  const signOut = async () => {
    try {
      // Sign out from our API
      await axios.post('/api/v1/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      handleSignOut();
    }
  };

  /**
   * Handle sign out cleanup
   */
  const handleSignOut = () => {
    // Clear local storage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    
    // Clear user state
    setUser(null);
    
    // Sign out from Supabase
    supabase.auth.signOut();
    
    toast.success('Signed out successfully');
  };

  /**
   * Update user profile
   */
  const updateProfile = async (updates: Partial<User>) => {
    try {
      const response = await axios.put('/api/v1/users/profile', updates);

      if (response.data.success) {
        const updatedUser = response.data.data.user;
        
        // Update stored user data
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        toast.success('Profile updated successfully');
      } else {
        throw new Error(response.data.message || 'Profile update failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Profile update failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  /**
   * Refresh user data
   */
  const refreshUser = async () => {
    try {
      const response = await axios.get('/api/v1/auth/me');

      if (response.data.success) {
        const userData = response.data.data.user;
        
        // Update stored user data
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      // Don't throw error here to avoid disrupting user experience
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use auth context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

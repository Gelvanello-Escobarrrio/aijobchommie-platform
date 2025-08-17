/**
 * User validation schemas using Zod
 * Focus on South African context and entry-level job seekers
 */

import { z } from 'zod';

// Basic user validation
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email('Please enter a valid email address').max(320),
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens and apostrophes'),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens and apostrophes'),
  phone: z.string()
    .regex(/^(?:\+27|27|0)(?:1[0-5]|2[1-37]|3[1-9]|4[1-6]|5[1-8]|6[1-3]|7[1-9]|8[1-4]|9[1-4])\d{7}$/, 
      'Please enter a valid South African phone number')
    .optional(),
  profilePicture: z.string().url().optional(),
  dateOfBirth: z.date().optional(),
  location: z.string().max(100).optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  skills: z.array(z.string().min(2).max(50)).max(20, 'Maximum 20 skills allowed').optional(),
  experience: z.string().max(2000).optional(),
  education: z.string().max(1000).optional(),
  resume: z.string().url().optional(),
  isVerified: z.boolean().default(false),
  isActive: z.boolean().default(true),
  role: z.enum(['job_seeker', 'employer', 'admin', 'manager']).default('job_seeker'),
  preferences: z.object({}).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastLoginAt: z.date().optional(),
  onboardingCompleted: z.boolean().default(false),
  subscriptionStatus: z.enum(['free', 'active', 'expired', 'canceled', 'suspended']).default('free'),
  subscriptionPlan: z.enum(['basic', 'premium', 'enterprise']).optional()
});

// Registration schema - simplified for entry-level users
export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address').max(320),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, 
      'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .transform(val => val.trim()),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .transform(val => val.trim()),
  phone: z.string()
    .regex(/^(?:\+27|27|0)(?:1[0-5]|2[1-37]|3[1-9]|4[1-6]|5[1-8]|6[1-3]|7[1-9]|8[1-4]|9[1-4])\d{7}$/, 
      'Please enter a valid South African phone number')
    .optional(),
  role: z.enum(['job_seeker', 'employer']).default('job_seeker'),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions'
  })
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional()
});

// Profile update schema - focused on job seekers
export const profileUpdateSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .optional(),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .optional(),
  phone: z.string()
    .regex(/^(?:\+27|27|0)(?:1[0-5]|2[1-37]|3[1-9]|4[1-6]|5[1-8]|6[1-3]|7[1-9]|8[1-4]|9[1-4])\d{7}$/, 
      'Please enter a valid South African phone number')
    .optional(),
  dateOfBirth: z.date().optional(),
  location: z.string().max(100).optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  skills: z.array(z.string().min(2).max(50)).max(20, 'Maximum 20 skills allowed').optional(),
  experience: z.string().max(2000).optional(),
  education: z.enum([
    'no_formal',
    'primary',
    'grade8',
    'grade9',
    'grade10',
    'grade11',
    'matric',
    'certificate',
    'diploma',
    'bachelor',
    'honours',
    'master',
    'doctorate'
  ]).optional()
});

// User preferences schema - tailored for South African job market
export const userPreferencesSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  jobAlerts: z.boolean().default(true),
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false), // Costly in SA
  preferredJobTypes: z.array(z.enum([
    'full_time',
    'part_time', 
    'contract',
    'temporary',
    'internship',
    'volunteer'
  ])).default(['full_time']),
  preferredLocations: z.array(z.string()).max(10).default([]),
  preferredSalaryRange: z.object({
    min: z.number().min(0).max(1000000),
    max: z.number().min(0).max(1000000),
    currency: z.enum(['ZAR', 'USD', 'EUR', 'GBP']).default('ZAR')
  }).refine(data => data.min <= data.max, {
    message: 'Minimum salary must be less than or equal to maximum salary'
  }),
  preferredWorkModel: z.array(z.enum(['remote', 'on_site', 'hybrid'])).default(['on_site']),
  preferredIndustries: z.array(z.string()).max(10).default([]),
  experienceLevel: z.enum(['entry', 'mid', 'senior', 'executive', 'internship']).default('entry'),
  availability: z.string().max(200).default('Available immediately'),
  remoteWork: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date()
});

// Password reset schemas
export const passwordResetRequestSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

export const passwordResetSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, 
      'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

// Skills validation - focused on South African job market
export const skillsSchema = z.array(
  z.string()
    .min(2, 'Each skill must be at least 2 characters')
    .max(50, 'Each skill must be less than 50 characters')
    .transform(skill => skill.trim().toLowerCase())
    .refine(skill => skill.length > 0, 'Skills cannot be empty')
).min(1, 'At least one skill is required')
  .max(20, 'Maximum 20 skills allowed');

// SA ID Number validation schema
export const saIdNumberSchema = z.string()
  .length(13, 'South African ID number must be exactly 13 digits')
  .regex(/^\d{13}$/, 'ID number must contain only digits')
  .refine(idNumber => {
    // Luhn algorithm validation
    const digits = idNumber.split('').map(Number);
    let sum = 0;
    
    for (let i = 0; i < 12; i++) {
      const digit = digits[i];
      if (i % 2 === 0) {
        sum += digit;
      } else {
        const doubled = digit * 2;
        sum += doubled > 9 ? doubled - 9 : doubled;
      }
    }
    
    const checksum = (10 - (sum % 10)) % 10;
    return checksum === digits[12];
  }, 'Invalid South African ID number');

// Emergency contact schema
export const emergencyContactSchema = z.object({
  name: z.string().min(2).max(100),
  relationship: z.string().min(2).max(50),
  phone: z.string()
    .regex(/^(?:\+27|27|0)(?:1[0-5]|2[1-37]|3[1-9]|4[1-6]|5[1-8]|6[1-3]|7[1-9]|8[1-4]|9[1-4])\d{7}$/, 
      'Please enter a valid South African phone number')
}).optional();

// Simple contact details for entry-level users
export const basicContactSchema = z.object({
  phone: z.string()
    .regex(/^(?:\+27|27|0)(?:1[0-5]|2[1-37]|3[1-9]|4[1-6]|5[1-8]|6[1-3]|7[1-9]|8[1-4]|9[1-4])\d{7}$/, 
      'Please enter a valid South African phone number'),
  email: z.string().email('Please enter a valid email address').optional(),
  address: z.string().max(200).optional(),
  nearestTaxi: z.string().max(100, 'Nearest taxi rank or public transport').optional(),
  canTravel: z.boolean().default(true),
  hasTransport: z.boolean().default(false)
});

// Export type inference helpers
export type User = z.infer<typeof userSchema>;
export type RegisterUser = z.infer<typeof registerSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;
export type UserPreferences = z.infer<typeof userPreferencesSchema>;
export type PasswordResetRequest = z.infer<typeof passwordResetRequestSchema>;
export type PasswordReset = z.infer<typeof passwordResetSchema>;
export type EmergencyContact = z.infer<typeof emergencyContactSchema>;
export type BasicContact = z.infer<typeof basicContactSchema>;

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profilePicture?: string;
  dateOfBirth?: Date;
  location?: string;
  bio?: string;
  skills?: string[];
  experience?: string;
  education?: string;
  resume?: string;
  isVerified: boolean;
  isActive: boolean;
  role: UserRole;
  preferences?: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  onboardingCompleted: boolean;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionPlan?: SubscriptionPlan;
}

export type UserRole = 'job_seeker' | 'employer' | 'admin' | 'manager';

export type SubscriptionStatus = 'free' | 'active' | 'expired' | 'canceled' | 'suspended';

export type SubscriptionPlan = 'basic' | 'premium' | 'enterprise';

export interface UserPreferences {
  id: string;
  userId: string;
  jobAlerts: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  preferredJobTypes: JobType[];
  preferredLocations: string[];
  preferredSalaryRange: SalaryRange;
  preferredWorkModel: WorkModel[];
  preferredIndustries: string[];
  experienceLevel: ExperienceLevel;
  availability: string;
  remoteWork: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: 'ZAR' | 'USD' | 'EUR' | 'GBP';
}

export type JobType = 'full_time' | 'part_time' | 'contract' | 'temporary' | 'internship' | 'volunteer';

export type WorkModel = 'remote' | 'on_site' | 'hybrid';

export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'executive' | 'internship';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  agreeToTerms: boolean;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ProfileUpdate {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: Date;
  location?: string;
  bio?: string;
  skills?: string[];
  experience?: string;
  education?: string;
}

export interface UserAnalytics {
  totalJobsApplied: number;
  totalJobsViewed: number;
  applicationResponseRate: number;
  profileViewCount: number;
  resumeDownloadCount: number;
  averageResponseTime: number;
  topSkills: string[];
  preferredIndustries: string[];
  monthlyActivity: MonthlyActivity[];
}

export interface MonthlyActivity {
  month: string;
  jobsApplied: number;
  jobsViewed: number;
  profileViews: number;
}

import { JobType, WorkModel, ExperienceLevel, SalaryRange } from './user';

export interface Job {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  requirements: string[];
  qualifications: string[];
  responsibilities: string[];
  benefits?: string[];
  companyId: string;
  company?: Company;
  location: string;
  isRemote: boolean;
  workModel: WorkModel;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  salaryRange?: SalaryRange;
  skills: string[];
  industry: string;
  category: string;
  isActive: boolean;
  isFeatured: boolean;
  isPremium: boolean;
  expiryDate?: Date;
  applicationDeadline?: Date;
  startDate?: Date;
  applicationCount: number;
  viewCount: number;
  aiScore?: number;
  aiTags?: string[];
  seoSlug: string;
  contactEmail?: string;
  contactPerson?: string;
  applicationInstructions?: string;
  externalUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  postedBy: string;
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  email: string;
  phone?: string;
  address?: Address;
  industry: string;
  size: CompanySize;
  founded?: number;
  culture?: string[];
  benefits?: string[];
  socialLinks?: SocialLinks;
  isVerified: boolean;
  isActive: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface Address {
  street?: string;
  city: string;
  province: string;
  postalCode?: string;
  country: string;
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  website?: string;
}

export type CompanySize = 
  | 'startup' 
  | 'small' 
  | 'medium' 
  | 'large' 
  | 'enterprise'
  | '1-10'
  | '11-50'
  | '51-200'
  | '201-1000'
  | '1000+';

export interface JobApplication {
  id: string;
  jobId: string;
  job?: Job;
  userId: string;
  user?: Partial<User>;
  status: ApplicationStatus;
  coverLetter?: string;
  resumeUrl?: string;
  portfolio?: string;
  expectedSalary?: number;
  availabilityDate?: Date;
  customQuestions?: ApplicationAnswer[];
  aiMatchScore?: number;
  aiAnalysis?: AIAnalysis;
  feedback?: ApplicationFeedback;
  appliedAt: Date;
  updatedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

export type ApplicationStatus = 
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'shortlisted'
  | 'interview_scheduled'
  | 'interviewed'
  | 'offer_extended'
  | 'hired'
  | 'rejected'
  | 'withdrawn'
  | 'expired';

export interface ApplicationAnswer {
  question: string;
  answer: string;
  type: 'text' | 'choice' | 'file' | 'date';
}

export interface AIAnalysis {
  skillsMatch: number;
  experienceMatch: number;
  locationMatch: number;
  salaryMatch: number;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface ApplicationFeedback {
  rating?: number;
  comments?: string;
  nextSteps?: string;
  interviewDate?: Date;
  interviewType?: 'phone' | 'video' | 'in_person';
  interviewNotes?: string;
}

export interface JobFilter {
  search?: string;
  location?: string;
  jobType?: JobType[];
  workModel?: WorkModel[];
  experienceLevel?: ExperienceLevel[];
  salaryMin?: number;
  salaryMax?: number;
  industry?: string[];
  company?: string[];
  skills?: string[];
  remote?: boolean;
  featured?: boolean;
  premium?: boolean;
  postedWithin?: 'day' | 'week' | 'month' | 'all';
  sortBy?: 'relevance' | 'date' | 'salary' | 'company';
  sortOrder?: 'asc' | 'desc';
}

export interface JobSearchResult {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: JobFilter;
  facets?: SearchFacets;
}

export interface SearchFacets {
  locations: FacetItem[];
  companies: FacetItem[];
  industries: FacetItem[];
  jobTypes: FacetItem[];
  workModels: FacetItem[];
  experienceLevels: FacetItem[];
  skills: FacetItem[];
}

export interface FacetItem {
  value: string;
  label: string;
  count: number;
}

export interface JobAlert {
  id: string;
  userId: string;
  name: string;
  filters: JobFilter;
  frequency: 'immediate' | 'daily' | 'weekly' | 'monthly';
  isActive: boolean;
  lastRun?: Date;
  jobsFound?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobRecommendation {
  job: Job;
  score: number;
  reasons: string[];
  matchingSkills: string[];
  missingSkills: string[];
}

import { User } from './user';

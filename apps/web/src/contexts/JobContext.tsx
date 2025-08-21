/**
 *  JOB CONTEXT
 * 
 * Provides job search state and methods throughout the app
 * Manages job listings, applications, and AI matching
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

// Job interface
export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  province: string;
  city: string;
  address?: string;
  description: string;
  requirements: string[];
  benefits: string[];
  responsibilities: string[];
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  salaryPeriod: string;
  jobType: string;
  category: string;
  subcategory?: string;
  experienceLevel: string;
  educationLevel?: string;
  workingHours?: string;
  contactEmail?: string;
  contactPhone?: string;
  applicationMethod?: string;
  applicationUrl?: string;
  tags: string[];
  isUrgent: boolean;
  isImmediateStart: boolean;
  noExperienceRequired: boolean;
  isFeatured: boolean;
  isVerified: boolean;
  isActive: boolean;
  isRemote: boolean;
  viewCount: number;
  applicationCount: number;
  source?: string;
  expiresAt?: Date;
  postedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Job application interface
export interface JobApplication {
  id: string;
  jobId: string;
  userId?: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  coverLetter?: string;
  resumeUrl?: string;
  status: 'submitted' | 'reviewing' | 'interviewed' | 'rejected' | 'accepted';
  trackingNumber: string;
  appliedAt: Date;
  job?: Job;
}

// Job search filters
export interface JobSearchFilters {
  search?: string;
  location?: string;
  province?: string;
  category?: string;
  jobType?: string;
  experienceLevel?: string;
  salaryMin?: number;
  salaryMax?: number;
  urgent?: boolean;
  featured?: boolean;
  remote?: boolean;
  noExperience?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// AI Job match result
export interface JobMatch {
  jobId: string;
  matchScore: number;
  matchReason: string;
  aiInsights?: string;
  job: Job;
}

// Job context interface
interface JobContextType {
  // State
  currentJob: Job | null;
  searchFilters: JobSearchFilters;
  
  // Actions
  setCurrentJob: (job: Job | null) => void;
  setSearchFilters: (filters: JobSearchFilters) => void;
  searchJobs: (filters: JobSearchFilters) => Promise<Job[]>;
  getJobById: (id: string) => Promise<Job>;
  applyToJob: (jobId: string, applicationData: any) => Promise<void>;
  getMyApplications: () => Promise<JobApplication[]>;
  getAIRecommendations: () => Promise<JobMatch[]>;
  
  // Loading states
  isSearching: boolean;
  isApplying: boolean;
}

// Create context
const JobContext = createContext<JobContextType | undefined>(undefined);

/**
 * Job Provider Component
 */
export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [searchFilters, setSearchFilters] = useState<JobSearchFilters>({});
  const [isSearching, setIsSearching] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const queryClient = useQueryClient();

  /**
   * Search for jobs with filters
   */
  const searchJobs = async (filters: JobSearchFilters): Promise<Job[]> => {
    try {
      setIsSearching(true);
      
      const params = new URLSearchParams();
      
      // Build query parameters
      if (filters.search) params.append('search', filters.search);
      if (filters.location) params.append('location', filters.location);
      if (filters.province) params.append('province', filters.province);
      if (filters.category) params.append('category', filters.category);
      if (filters.jobType) params.append('jobType', filters.jobType);
      if (filters.experienceLevel) params.append('experienceLevel', filters.experienceLevel);
      if (filters.salaryMin) params.append('salaryMin', filters.salaryMin.toString());
      if (filters.salaryMax) params.append('salaryMax', filters.salaryMax.toString());
      if (filters.urgent) params.append('urgent', 'true');
      if (filters.featured) params.append('featured', 'true');
      if (filters.remote) params.append('remote', 'true');
      if (filters.noExperience) params.append('noExperience', 'true');
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await axios.get(`/api/v1/jobs?${params.toString()}`);
      
      if (response.data.success) {
        return response.data.data.jobs;
      } else {
        throw new Error(response.data.message || 'Search failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Search failed';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * Get job by ID
   */
  const getJobById = async (id: string): Promise<Job> => {
    try {
      const response = await axios.get(`/api/v1/jobs/${id}`);
      
      if (response.data.success) {
        return response.data.data.job;
      } else {
        throw new Error(response.data.message || 'Job not found');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Job not found';
      toast.error(errorMessage);
      throw error;
    }
  };

  /**
   * Apply to a job
   */
  const applyToJob = async (jobId: string, applicationData: {
    applicantName: string;
    applicantEmail: string;
    applicantPhone: string;
    coverLetter?: string;
    resumeFile?: File;
  }) => {
    try {
      setIsApplying(true);

      // Create form data for file upload
      const formData = new FormData();
      formData.append('applicantName', applicationData.applicantName);
      formData.append('applicantEmail', applicationData.applicantEmail);
      formData.append('applicantPhone', applicationData.applicantPhone);
      
      if (applicationData.coverLetter) {
        formData.append('coverLetter', applicationData.coverLetter);
      }
      
      if (applicationData.resumeFile) {
        formData.append('resume', applicationData.resumeFile);
      }

      const response = await axios.post(`/api/v1/applications`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: { jobId }
      });

      if (response.data.success) {
        const application = response.data.data.application;
        
  // Invalidate applications cache
  // React Query types are strict in some versions; cast here to any to satisfy signature
  (queryClient.invalidateQueries as any)(['applications']);
        
        toast.success(`Application submitted! Tracking: ${application.trackingNumber}`);
      } else {
        throw new Error(response.data.message || 'Application failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Application failed';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsApplying(false);
    }
  };

  /**
   * Get user's applications
   */
  const getMyApplications = async (): Promise<JobApplication[]> => {
    try {
      const response = await axios.get('/api/v1/applications');
      
      if (response.data.success) {
        return response.data.data.applications;
      } else {
        throw new Error(response.data.message || 'Failed to fetch applications');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch applications';
      toast.error(errorMessage);
      throw error;
    }
  };

  /**
   * Get AI-powered job recommendations
   */
  const getAIRecommendations = async (): Promise<JobMatch[]> => {
    try {
      const response = await axios.get('/api/v1/jobs/ai/recommendations');
      
      if (response.data.success) {
        return response.data.data.recommendations;
      } else {
        throw new Error(response.data.message || 'Failed to get recommendations');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to get recommendations';
      console.error('AI recommendations error:', errorMessage);
      // Don't show toast for AI recommendations failure to avoid annoying users
      return [];
    }
  };

  const value: JobContextType = {
    // State
    currentJob,
    searchFilters,
    
    // Actions
    setCurrentJob,
    setSearchFilters,
    searchJobs,
    getJobById,
    applyToJob,
    getMyApplications,
    getAIRecommendations,
    
    // Loading states
    isSearching,
    isApplying
  };

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  );
};

/**
 * Hook to use job context
 */
export const useJobs = (): JobContextType => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};

/**
 * Custom hooks for specific job operations
 */

/**
 * Hook to fetch jobs with React Query
 */
export const useJobSearch = (filters: JobSearchFilters) => {
  const { searchJobs } = useJobs();
  
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => searchJobs(filters),
    enabled: Object.keys(filters).length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a single job
 */
export const useJob = (jobId: string) => {
  const { getJobById } = useJobs();
  
  return useQuery({
    queryKey: ['job', jobId],
    queryFn: () => getJobById(jobId),
    enabled: !!jobId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch user applications
 */
export const useMyApplications = () => {
  const { getMyApplications } = useJobs();
  
  return useQuery({
    queryKey: ['applications'],
    queryFn: getMyApplications,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to fetch AI recommendations
 */
export const useAIRecommendations = () => {
  const { getAIRecommendations } = useJobs();
  
  return useQuery({
    queryKey: ['ai-recommendations'],
    queryFn: getAIRecommendations,
    staleTime: 15 * 60 * 1000, // 15 minutes
    retry: 1, // Only retry once for AI features
  });
};

/**
 * Hook for job application mutation
 */
export const useApplyToJob = () => {
  const { applyToJob } = useJobs();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ jobId, applicationData }: { jobId: string; applicationData: any }) => 
      applyToJob(jobId, applicationData),
    onSuccess: () => {
      // Invalidate and refetch applications
  (queryClient.invalidateQueries as any)(['applications']);
    },
  });
};

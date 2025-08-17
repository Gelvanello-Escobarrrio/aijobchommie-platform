import axios from 'axios';

// Enhanced job service with scraper ecosystem integration
const API_BASE = process.env.REACT_APP_API_URL || '/api';

/**
 * Fetch jobs with comprehensive filtering and real-time updates
 */
export const fetchJobs = async (options = {}) => {
  try {
    const {
      search = '',
      location = '',
      dateFilter = 'yesterday',
      limit = 20,
      offset = 0,
      hasContact = true,
      minSalary = null,
      jobType = null,
      company = null
    } = options;

    const params = new URLSearchParams({
      search,
      location,
      dateFilter,
      limit: limit.toString(),
      offset: offset.toString(),
      hasContact: hasContact.toString()
    });

    if (minSalary) params.append('minSalary', minSalary.toString());
    if (jobType) params.append('jobType', jobType);
    if (company) params.append('company', company);

    const response = await axios.get(`${API_BASE}/jobs?${params}`);
    return {
      jobs: response.data.jobs || [],
      stats: response.data.stats || {},
      success: response.data.success || false,
      total: response.data.total || 0
    };
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw {
      message: error.response?.data?.message || error.message,
      status: error.response?.status || 500,
      jobs: [],
      stats: {}
    };
  }
};

/**
 * Trigger manual scraping with real-time updates
 */
export const triggerScraping = async (searchQuery = 'jobs South Africa', options = {}) => {
  try {
    const response = await axios.post(`${API_BASE}/jobs/scrape`, {
      searchQuery,
      ...options
    });
    
    return {
      operationId: response.data.operationId,
      message: response.data.message,
      estimatedTime: response.data.estimatedTime,
      success: true
    };
  } catch (error) {
    console.error('Error triggering scraping:', error);
    throw {
      message: error.response?.data?.message || 'Failed to start scraping',
      status: error.response?.status || 500,
      success: false
    };
  }
};

/**
 * Get scraping operation status
 */
export const getScrapingStatus = async (operationId) => {
  try {
    const response = await axios.get(`${API_BASE}/jobs/scrape/${operationId}/status`);
    return response.data;
  } catch (error) {
    console.error('Error getting scraping status:', error);
    throw error;
  }
};

/**
 * Get scraper ecosystem status and health
 */
export const getEcosystemStatus = async () => {
  try {
    const response = await axios.get(`${API_BASE}/scraper/status`);
    return response.data;
  } catch (error) {
    console.error('Error getting ecosystem status:', error);
    throw error;
  }
};

/**
 * Run test scraping for debugging
 */
export const runTestScraping = async () => {
  try {
    const response = await axios.post(`${API_BASE}/scraper/test`);
    return response.data;
  } catch (error) {
    console.error('Error running test scraping:', error);
    throw error;
  }
};

/**
 * Get job statistics and analytics
 */
export const getJobStats = async () => {
  try {
    const response = await axios.get(`${API_BASE}/jobs/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching job stats:', error);
    throw error;
  }
};

/**
 * Get detailed job by ID with contact information
 */
export const getJobDetails = async (jobId) => {
  try {
    const response = await axios.get(`${API_BASE}/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching job details:', error);
    throw error;
  }
};

/**
 * Save job for later
 */
export const saveJob = async (jobId) => {
  try {
    const response = await axios.post(`${API_BASE}/jobs/${jobId}/save`);
    return response.data;
  } catch (error) {
    console.error('Error saving job:', error);
    throw error;
  }
};

/**
 * Quick apply to job
 */
export const quickApply = async (jobId, applicationData = {}) => {
  try {
    const response = await axios.post(`${API_BASE}/jobs/${jobId}/apply`, applicationData);
    return response.data;
  } catch (error) {
    console.error('Error applying to job:', error);
    throw error;
  }
};

/**
 * Get user's saved jobs
 */
export const getSavedJobs = async () => {
  try {
    const response = await axios.get(`${API_BASE}/jobs/saved`);
    return response.data;
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    throw error;
  }
};

/**
 * Get user's application history
 */
export const getApplicationHistory = async () => {
  try {
    const response = await axios.get(`${API_BASE}/jobs/applications`);
    return response.data;
  } catch (error) {
    console.error('Error fetching application history:', error);
    throw error;
  }
};

/**
 * Real-time job updates using Server-Sent Events (SSE)
 */
export const subscribeToJobUpdates = (callback) => {
  const eventSource = new EventSource(`${API_BASE}/jobs/stream`);
  
  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      callback(data);
    } catch (error) {
      console.error('Error parsing job update:', error);
    }
  };
  
  eventSource.onerror = (error) => {
    console.error('SSE connection error:', error);
  };
  
  return () => {
    eventSource.close();
  };
};

/**
 * Enhanced search with AI matching
 */
export const searchJobsWithAI = async (searchQuery, userProfile = {}) => {
  try {
    const response = await axios.post(`${API_BASE}/jobs/ai-search`, {
      query: searchQuery,
      profile: userProfile
    });
    
    return {
      jobs: response.data.jobs || [],
      matchScores: response.data.matchScores || {},
      recommendations: response.data.recommendations || [],
      success: true
    };
  } catch (error) {
    console.error('Error with AI job search:', error);
    throw error;
  }
};

/**
 * Export utility functions
 */
export const formatSalary = (salary) => {
  if (!salary) return 'Not specified';
  return salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const formatJobType = (jobType) => {
  if (!jobType) return 'Full-time';
  return jobType.charAt(0).toUpperCase() + jobType.slice(1).toLowerCase();
};

export const calculateTimeAgo = (dateString) => {
  const now = new Date();
  const posted = new Date(dateString);
  const diffMs = now - posted;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
};

/**
 * Job quality score calculator
 */
export const calculateJobQuality = (job) => {
  let score = 0;
  
  // Has complete information
  if (job.title && job.company && job.location && job.description) score += 30;
  
  // Has contact information
  if (job.has_contact_info) score += 25;
  
  // Has salary information
  if (job.salary && !job.salary.toLowerCase().includes('negotiable')) score += 20;
  
  // Description quality
  if (job.description && job.description.length > 200) score += 15;
  
  // Recent posting
  if (job.posted_at) {
    const daysOld = Math.floor((Date.now() - new Date(job.posted_at)) / (1000 * 60 * 60 * 24));
    if (daysOld <= 7) score += 10;
  }
  
  return Math.min(score, 100);
};

export default {
  fetchJobs,
  triggerScraping,
  getScrapingStatus,
  getEcosystemStatus,
  runTestScraping,
  getJobStats,
  getJobDetails,
  saveJob,
  quickApply,
  getSavedJobs,
  getApplicationHistory,
  subscribeToJobUpdates,
  searchJobsWithAI,
  formatSalary,
  formatJobType,
  calculateTimeAgo,
  calculateJobQuality
};

/**
 * Feature Flags Configuration
 * Allow internal job scraping while disabling user-facing job features
 */

const featureFlags = {
  // INTERNAL FEATURES (Website Operations)
  internal: {
    jobScraping: {
      enabled: true, // Website can scrape jobs automatically
      scheduledScraping: true, // 2x daily automated scraping
      apiAccess: true, // Internal API can access job data
      dataProcessing: true // AI analysis, contact extraction, etc.
    },
    
    adminAccess: {
      enabled: true, // Admin can view scraped data
      jobManagement: true, // Admin can manage job database
      systemMonitoring: true // Monitor scraping performance
    }
  },
  
  // USER-FACING FEATURES (Disabled for now)
  userFeatures: {
    jobSearch: {
      enabled: false, // Users CANNOT search jobs
      comingSoon: true,
      message: "Job search features are coming soon! We're building an amazing job matching experience for you.",
      expectedLaunch: "Coming Soon"
    },
    
    jobBrowsing: {
      enabled: false, // Users CANNOT browse job listings
      comingSoon: true,
      message: "Job browsing will be available soon. Stay tuned!"
    },
    
    jobApplications: {
      enabled: false, // Users CANNOT apply to jobs yet
      comingSoon: true,
      message: "Job application features are in development."
    },
    
    jobAlerts: {
      enabled: false, // No job alerts for users yet
      comingSoon: true,
      message: "Personalized job alerts coming soon!"
    },
    
    dashboard: {
      jobRelatedFeatures: false, // Disable job-related dashboard items
      profileOnly: true // Only allow profile management
    }
  },
  
  // AVAILABLE USER FEATURES (These work normally)
  availableFeatures: {
    userRegistration: {
      enabled: true,
      message: "Create your account to be ready when job features launch!"
    },
    
    userProfile: {
      enabled: true,
      allowCvUpload: true, // Users can prepare their CVs
      allowSkillsInput: true // Users can add skills for future matching
    },
    
    landingPage: {
      enabled: true,
      showComingSoon: true // Show coming soon messages for job features
    },
    
    pricing: {
      enabled: true,
      showComplianceNotice: true,
      message: "Pricing shown for reference. Job features launching soon!"
    },
    
    about: {
      enabled: true
    },
    
    contact: {
      enabled: true
    },
    
    blog: {
      enabled: true // Can share job market insights, tips, etc.
    }
  },
  
  // COMPLIANCE & LEGAL
  compliance: {
    dolRegistration: {
      required: true,
      status: "pending", // "pending" | "approved" | "rejected"
      message: "Finalizing registration with Department of Labour"
    },
    
    temporaryEmploymentAgent: {
      required: true,
      status: "pending",
      registrationNumber: null // Will be filled when approved
    }
  },
  
  // DEVELOPMENT SETTINGS
  development: {
    demoMode: process.env.NODE_ENV === 'development',
    testDataGeneration: true,
    debugMode: process.env.NODE_ENV === 'development'
  }
};

// Helper functions
export const isFeatureEnabled = (featurePath) => {
  const feature = getNestedFeature(featureFlags, featurePath);
  return feature && feature.enabled === true;
};

export const canUserAccessFeature = (featurePath) => {
  // Check if this is a user-facing feature
  if (featurePath.startsWith('userFeatures.')) {
    return isFeatureEnabled(featurePath);
  }
  
  // Check available features
  if (featurePath.startsWith('availableFeatures.')) {
    return isFeatureEnabled(featurePath);
  }
  
  return false;
};

export const canInternalSystemAccess = (featurePath) => {
  // Internal systems can access internal features
  if (featurePath.startsWith('internal.')) {
    return isFeatureEnabled(featurePath);
  }
  
  return false;
};

export const getFeatureConfig = (featurePath) => {
  return getNestedFeature(featureFlags, featurePath);
};

export const getComingSoonMessage = (featurePath) => {
  const feature = getNestedFeature(featureFlags, featurePath);
  return feature?.message || "This feature is coming soon!";
};

export const isComplianceReady = () => {
  const dolStatus = featureFlags.compliance.dolRegistration.status;
  const teaStatus = featureFlags.compliance.temporaryEmploymentAgent.status;
  
  return dolStatus === 'approved' && teaStatus === 'approved';
};

const getNestedFeature = (obj, path) => {
  return path.split('.').reduce((current, key) => current && current[key], obj);
};

export default featureFlags;

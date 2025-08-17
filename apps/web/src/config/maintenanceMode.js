// Maintenance Mode Configuration
// This system allows easy toggling of features during compliance/development phases

/**
 * Maintenance Mode Configuration
 * Set these flags to control which features are available to users
 * While maintaining internal functionality for development/scraping
 */
export const MAINTENANCE_CONFIG = {
  // Job Search Features
  jobSearch: {
    enabled: false,
    reason: 'TEA Registration in Progress',
    expectedDate: '2024-06-15', // Expected launch date
    message: 'Job search functionality is temporarily unavailable while we complete our Department of Labour registration.',
    allowedRoles: ['admin', 'developer'], // Internal access only
  },

  // Job Applications
  jobApplications: {
    enabled: false,
    reason: 'Legal Compliance',
    expectedDate: '2024-06-15',
    message: 'Job application features will be available once our TEA registration is complete.',
    allowedRoles: ['admin', 'developer'],
  },

  // Job Posting (for employers)
  jobPosting: {
    enabled: false,
    reason: 'Platform Development',
    expectedDate: '2024-07-01',
    message: 'Employer job posting features are coming soon.',
    allowedRoles: ['admin', 'developer'],
  },

  // Worker Placement Services
  workerPlacement: {
    enabled: false,
    reason: 'TEA Registration Required',
    expectedDate: '2024-06-15',
    message: 'Worker placement services require completion of our Department of Labour registration.',
    allowedRoles: ['admin', 'developer'],
  },

  // Internal features (always enabled)
  internal: {
    scraping: {
      enabled: true,
      reason: 'Development',
      message: 'Internal scraping operations are active for development purposes.',
    },
    analytics: {
      enabled: true,
      reason: 'Monitoring',
      message: 'Analytics and monitoring systems are operational.',
    },
    api: {
      enabled: true,
      reason: 'Backend Services',
      message: 'API endpoints are available for internal services.',
    },
  },
};

/**
 * Check if a feature is enabled for the current user
 * @param {string} featureName - Name of the feature to check
 * @param {string|null} userRole - Current user's role (null for anonymous)
 * @returns {boolean} - Whether the feature is enabled
 */
export const isFeatureEnabled = (featureName, userRole = null) => {
  const feature = MAINTENANCE_CONFIG[featureName];
  
  if (!feature) {
    console.warn(`Feature "${featureName}" not found in maintenance config`);
    return false;
  }

  // Internal features are always enabled
  if (MAINTENANCE_CONFIG.internal[featureName]) {
    return MAINTENANCE_CONFIG.internal[featureName].enabled;
  }

  // Check if feature is globally enabled
  if (feature.enabled) {
    return true;
  }

  // Check if user has allowed role for disabled features
  if (feature.allowedRoles && userRole && feature.allowedRoles.includes(userRole)) {
    return true;
  }

  return false;
};

/**
 * Get maintenance message for a disabled feature
 * @param {string} featureName - Name of the feature
 * @returns {object} - Maintenance info object
 */
export const getMaintenanceInfo = (featureName) => {
  const feature = MAINTENANCE_CONFIG[featureName];
  
  if (!feature) {
    return {
      enabled: false,
      message: 'Feature not found',
      reason: 'Configuration Error',
      expectedDate: null,
    };
  }

  return {
    enabled: feature.enabled,
    message: feature.message || 'This feature is temporarily unavailable.',
    reason: feature.reason || 'Maintenance',
    expectedDate: feature.expectedDate || null,
  };
};

/**
 * Get all maintenance statuses for dashboard/admin view
 * @returns {object} - Complete maintenance status
 */
export const getAllMaintenanceStatus = () => {
  const status = {};
  
  Object.keys(MAINTENANCE_CONFIG).forEach(featureName => {
    if (featureName !== 'internal') {
      status[featureName] = {
        ...MAINTENANCE_CONFIG[featureName],
        info: getMaintenanceInfo(featureName),
      };
    }
  });

  // Add internal features separately
  status.internal = MAINTENANCE_CONFIG.internal;

  return status;
};

/**
 * Quick toggles for common scenarios
 */
export const QUICK_MODES = {
  // Full launch mode - everything enabled
  FULL_LAUNCH: {
    jobSearch: { enabled: true },
    jobApplications: { enabled: true },
    jobPosting: { enabled: true },
    workerPlacement: { enabled: true },
  },

  // TEA compliant mode - job features enabled
  TEA_COMPLIANT: {
    jobSearch: { enabled: true },
    jobApplications: { enabled: true },
    workerPlacement: { enabled: true },
    jobPosting: { enabled: false }, // May need additional licensing
  },

  // Preview mode - limited functionality
  PREVIEW_MODE: {
    jobSearch: { enabled: true, message: 'Preview mode - limited functionality' },
    jobApplications: { enabled: false },
    workerPlacement: { enabled: false },
    jobPosting: { enabled: false },
  },

  // Development mode - internal access only
  DEVELOPMENT: {
    jobSearch: { enabled: false },
    jobApplications: { enabled: false },
    workerPlacement: { enabled: false },
    jobPosting: { enabled: false },
  },
};

/**
 * Apply a quick mode configuration
 * @param {string} modeName - Name of the quick mode
 */
export const applyQuickMode = (modeName) => {
  const mode = QUICK_MODES[modeName];
  if (!mode) {
    console.error(`Quick mode "${modeName}" not found`);
    return false;
  }

  // In a real implementation, this would update the configuration
  // For now, it serves as a reference for manual updates
  console.log(`Apply quick mode "${modeName}":`, mode);
  return mode;
};

export default {
  MAINTENANCE_CONFIG,
  isFeatureEnabled,
  getMaintenanceInfo,
  getAllMaintenanceStatus,
  QUICK_MODES,
  applyQuickMode,
};

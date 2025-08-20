/**
 * OneSignal Configuration for AI Job Chommie
 * Centralized configuration for push notifications
 */

export const ONESIGNAL_CONFIG = {
  // App Configuration
  appId: process.env.REACT_APP_ONESIGNAL_APP_ID || '',
  safariWebId: process.env.REACT_APP_ONESIGNAL_SAFARI_WEB_ID || '',

  // Environment Settings
  allowLocalhostAsSecureOrigin: process.env.NODE_ENV === 'development',
  autoRegister: false, // We handle permissions manually

  // UI Configuration
  notifyButton: {
    enable: false // We use custom UI
  },

  // Welcome Notification
  welcomeNotification: {
    disable: true // Custom welcome flow
  },

  // Prompt Configuration
  promptOptions: {
    slidedown: {
      prompts: [
        {
          type: 'push',
          autoPrompt: false,
          text: {
            actionMessage: " Get instant job alerts from AI Job Chommie!",
            acceptButton: "Yes, notify me!",
            cancelButton: "Not now"
          }
        }
      ]
    }
  },

  // Debug mode
  debug: process.env.REACT_APP_DEBUG_ONESIGNAL === 'true'
};

// Notification Templates for Different Types
export const NOTIFICATION_TEMPLATES = {
  JOB_ALERT: {
    title: " New Job Match Found!",
    body: "{company} is hiring for {title} in {location}",
    icon: "/logos/logo-192.png",
    badge: "/logos/logo-72.png",
    data: {
      action: "view_job",
      type: "job_alert"
    }
  },

  APPLICATION_UPDATE: {
    title: " Application Update",
    body: "Your application for {title} at {company} has been updated",
    icon: "/logos/logo-192.png",
    badge: "/logos/logo-72.png",
    data: {
      action: "view_application",
      type: "application_update"
    }
  },

  AI_RECOMMENDATION: {
    title: " AI Job Recommendation",
    body: "Based on your profile, we found {count} new jobs perfect for you!",
    icon: "/logos/logo-192.png",
    badge: "/logos/logo-72.png",
    data: {
      action: "view_recommendations",
      type: "ai_recommendation"
    }
  },

  WEEKLY_SUMMARY: {
    title: " Weekly Job Summary",
    body: "This week: {newJobs} new jobs, {applications} applications sent",
    icon: "/logos/logo-192.png",
    badge: "/logos/logo-72.png",
    data: {
      action: "view_dashboard",
      type: "weekly_summary"
    }
  },

  PREMIUM_FEATURE: {
    title: " Premium Feature Available",
    body: "Upgrade to unlock AI-powered CV analysis and priority support",
    icon: "/logos/logo-192.png",
    badge: "/logos/logo-72.png",
    data: {
      action: "view_pricing",
      type: "premium_feature"
    }
  },

  SYSTEM_NOTIFICATION: {
    title: " AI Job Chommie",
    body: "{message}",
    icon: "/logos/logo-192.png",
    badge: "/logos/logo-72.png",
    data: {
      action: "open_app",
      type: "system"
    }
  }
};

// User Segment Tags for Targeted Notifications
export const USER_SEGMENTS = {
  NEW_USER: 'new_user',
  ACTIVE_JOBSEEKER: 'active_jobseeker',
  PREMIUM_USER: 'premium_user',
  INACTIVE_USER: 'inactive_user',
  JOB_ALERTS_ENABLED: 'job_alerts_enabled',
  LOCATION_BASED: 'location_',
  SKILL_BASED: 'skill_',
  INDUSTRY_BASED: 'industry_'
};

// Notification Frequency Options
export const NOTIFICATION_FREQUENCY = {
  IMMEDIATE: 'immediate',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  DISABLED: 'disabled'
};

// South African Job Categories for Targeting
export const SA_JOB_CATEGORIES = {
  'Information Technology': 'it',
  'Healthcare': 'healthcare',
  'Engineering': 'engineering',
  'Finance': 'finance',
  'Marketing': 'marketing',
  'Sales': 'sales',
  'Education': 'education',
  'Manufacturing': 'manufacturing',
  'Mining': 'mining',
  'Agriculture': 'agriculture',
  'Tourism': 'tourism',
  'Retail': 'retail',
  'Construction': 'construction',
  'Legal': 'legal',
  'Government': 'government'
};

// South African Cities for Location Targeting
export const SA_CITIES = {
  'Johannesburg': 'johannesburg',
  'Cape Town': 'cape_town',
  'Durban': 'durban',
  'Pretoria': 'pretoria',
  'Port Elizabeth': 'port_elizabeth',
  'Bloemfontein': 'bloemfontein',
  'East London': 'east_london',
  'Pietermaritzburg': 'pietermaritzburg',
  'Kimberley': 'kimberley',
  'Polokwane': 'polokwane',
  'Nelspruit': 'nelspruit',
  'Rustenburg': 'rustenburg'
};

export default ONESIGNAL_CONFIG;

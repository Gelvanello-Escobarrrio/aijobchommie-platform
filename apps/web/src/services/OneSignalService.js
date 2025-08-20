/**
 * OneSignal Push Notification Service
 * Handles all push notification functionality for job alerts and updates
 * Free tier: 10,000 subscribers, unlimited notifications
 */

import OneSignal from 'react-onesignal';
import { supabase } from '../config/supabase';
import ONESIGNAL_CONFIG, { NOTIFICATION_TEMPLATES, USER_SEGMENTS, NOTIFICATION_FREQUENCY } from '../config/onesignal';

class OneSignalService {
  constructor() {
    this.isInitialized = false;
    this.appId = ONESIGNAL_CONFIG.appId;
    this.currentUser = null;
    this.config = ONESIGNAL_CONFIG;
  }

  /**
   * Initialize OneSignal with your App ID
   * Call this once when the app starts
   */
  async initialize() {
    try {
      if (this.isInitialized || !this.appId) return;

      console.log(' Initializing OneSignal...');
      
      await OneSignal.init(this.config);

      // Set up event listeners
      this.setupEventListeners();
      this.isInitialized = true;
      
      console.log(' OneSignal initialized successfully');
    } catch (error) {
      console.error(' OneSignal initialization failed:', error);
    }
  }

  /**
   * Set up OneSignal event listeners
   */
  setupEventListeners() {
    // When user subscribes to notifications
    OneSignal.on('subscriptionChange', (isSubscribed) => {
      console.log(' Subscription changed:', isSubscribed);
      this.handleSubscriptionChange(isSubscribed);
    });

    // When notification is received
    OneSignal.on('notificationDisplay', (event) => {
      console.log(' Notification displayed:', event);
    });

    // When notification is clicked
    OneSignal.on('notificationClick', (event) => {
      console.log(' Notification clicked:', event);
      this.handleNotificationClick(event);
    });
  }

  /**
   * Request notification permissions from user
   */
  async requestPermission(userId = null) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      if (!this.appId) {
        console.warn(' OneSignal App ID not configured, using fallback notification');
        return false;
      }

      console.log(' Requesting notification permissions...');
      
      // Show OneSignal prompt
      const granted = await OneSignal.showSlidedownPrompt();
      
      if (granted) {
        console.log(' Notification permission granted');
        
        // Get the OneSignal player ID (unique device identifier)
        const playerId = await OneSignal.getUserId();
        
        if (userId && playerId) {
          // Save the player ID to user's profile
          await this.linkUserToDevice(userId, playerId);
        }

        // Set up default tags
        await this.setUserTags({
          registered: true,
          platform: 'web',
          user_id: userId || 'anonymous'
        });

        return true;
      } else {
        console.log(' Notification permission denied');
        return false;
      }
    } catch (error) {
      console.error(' Error requesting permission:', error);
      return false;
    }
  }

  /**
   * Link OneSignal device to user profile
   */
  async linkUserToDevice(userId, playerId) {
    try {
      const { error } = await supabase
        .from('user_devices')
        .upsert({
          user_id: userId,
          device_id: playerId,
          device_type: 'web',
          push_enabled: true,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      console.log(' Device linked to user profile');
    } catch (error) {
      console.error(' Error linking device to user:', error);
    }
  }

  /**
   * Set user tags for targeted notifications
   */
  async setUserTags(tags) {
    try {
      if (!this.isInitialized || !this.appId) return;
      
      await OneSignal.sendTags(tags);
      console.log(' User tags set:', tags);
    } catch (error) {
      console.error(' Error setting user tags:', error);
    }
  }

  /**
   * Set up job alert preferences
   */
  async setupJobAlerts(userId, preferences) {
    try {
      const tags = {
        user_id: userId,
        job_alerts: true,
        location: preferences.location || 'south-africa',
        job_types: preferences.jobTypes?.join(',') || '',
        salary_min: preferences.salaryMin || 0,
        keywords: preferences.keywords?.join(',') || ''
      };

      await this.setUserTags(tags);
      
      // Save to database
      const alertData = {
        user_id: userId,
        location: preferences.location || 'south-africa',
        job_types: preferences.jobTypes || [],
        keywords: preferences.keywords || [],
        salary_min: preferences.salaryMin || 0,
        salary_max: preferences.salaryMax || 999999,
        alert_frequency: preferences.frequency || 'immediate',
        is_active: true,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('job_alerts')
        .upsert(alertData);

      if (error) throw error;
      
      console.log(' Job alerts configured:', preferences);
    } catch (error) {
      console.error(' Error setting up job alerts:', error);
    }
  }

  /**
   * Send test notification
   */
  async sendTestNotification() {
    try {
      // This creates a local notification for testing
      // In production, notifications would be sent from your backend
      if (Notification.permission === 'granted') {
        const notification = new Notification(' OneSignal Test', {
          body: 'Your push notifications are working perfectly! ',
          icon: '/logos/logo-192.png',
          badge: '/logos/logo-72.png',
          tag: 'onesignal-test'
        });

        setTimeout(() => notification.close(), 5000);
      }
    } catch (error) {
      console.error(' Error sending test notification:', error);
    }
  }

  /**
   * Handle subscription changes
   */
  async handleSubscriptionChange(isSubscribed) {
    try {
      if (this.currentUser) {
        // Update user's notification preferences
        const { error } = await supabase
          .from('profiles')
          .update({
            push_notifications_enabled: isSubscribed,
            updated_at: new Date().toISOString()
          })
          .eq('id', this.currentUser.id);

        if (error) throw error;
      }
    } catch (error) {
      console.error(' Error handling subscription change:', error);
    }
  }

  /**
   * Handle notification clicks
   */
  handleNotificationClick(event) {
    try {
      const { data } = event;
      
      if (data?.action === 'view_job' && data?.job_id) {
        // Navigate to job details
        window.location.href = `/jobs/${data.job_id}`;
      } else if (data?.url) {
        // Navigate to custom URL
        window.location.href = data.url;
      }
    } catch (error) {
      console.error(' Error handling notification click:', error);
    }
  }

  /**
   * Check if notifications are supported and enabled
   */
  async getNotificationStatus() {
    try {
      if (!this.isInitialized || !this.appId) {
        return { supported: false, enabled: false, service: 'none' };
      }

      const supported = OneSignal.isPushNotificationsSupported();
      const enabled = await OneSignal.isPushNotificationsEnabled();
      
      return { supported, enabled, service: 'onesignal' };
    } catch (error) {
      console.error(' Error checking notification status:', error);
      return { supported: false, enabled: false, service: 'error' };
    }
  }

  /**
   * Update current user context
   */
  setCurrentUser(user) {
    this.currentUser = user;
  }

  /**
   * Unsubscribe from notifications
   */
  async unsubscribe() {
    try {
      if (!this.isInitialized || !this.appId) return;
      
      await OneSignal.setSubscription(false);
      console.log(' Unsubscribed from notifications');
    } catch (error) {
      console.error(' Error unsubscribing:', error);
    }
  }

  /**
   * Get OneSignal player ID (device identifier)
   */
  async getPlayerId() {
    try {
      if (!this.isInitialized || !this.appId) return null;
      return await OneSignal.getUserId();
    } catch (error) {
      console.error(' Error getting player ID:', error);
      return null;
    }
  }

  /**
   * Create required database tables SQL
   */
  getDatabaseTableSQL() {
    return `
      -- User Devices Table (for OneSignal)
      CREATE TABLE IF NOT EXISTS user_devices (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        device_id TEXT NOT NULL, -- OneSignal Player ID
        device_type TEXT DEFAULT 'web',
        push_enabled BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, device_id)
      );

      -- Job Alerts Table
      CREATE TABLE IF NOT EXISTS job_alerts (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        location TEXT,
        job_types TEXT[] DEFAULT '{}',
        keywords TEXT[] DEFAULT '{}',
        salary_min INTEGER DEFAULT 0,
        salary_max INTEGER DEFAULT 999999,
        alert_frequency TEXT DEFAULT 'immediate',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
  }
}

export default new OneSignalService();

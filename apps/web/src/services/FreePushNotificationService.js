/**
 * Free Push Notification Service for AI Job Chommie
 * Uses Web Push API and OneSignal (free tier) for job alerts
 * No Firebase required - completely free solution!
 */

import { supabase } from '../config/supabase';

class FreePushNotificationService {
  constructor() {
    this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
    this.isInitialized = false;
    this.registration = null;
    this.subscription = null;
    this.currentUser = null;
    
    // OneSignal App ID (you'll get this from your OneSignal dashboard)
    this.oneSignalAppId = process.env.REACT_APP_ONESIGNAL_APP_ID || '';
  }

  /**
   * Initialize the push notification service
   */
  async initialize() {
    try {
      if (!this.isSupported) {
        console.warn(' Push notifications are not supported on this device');
        return false;
      }

      if (this.isInitialized) return true;

      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log(' Service Worker registered');

      // Initialize OneSignal if app ID is available
      if (this.oneSignalAppId) {
        await this.initializeOneSignal();
      }

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error(' Failed to initialize push notifications:', error);
      return false;
    }
  }

  /**
   * Initialize OneSignal for enhanced push notifications
   */
  async initializeOneSignal() {
    try {
      // Dynamically load OneSignal SDK
      if (!window.OneSignal) {
        const script = document.createElement('script');
        script.src = 'https://cdn.onesignal.com/sdks/OneSignalSDK.js';
        document.head.appendChild(script);
        
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      window.OneSignal = window.OneSignal || [];
      
      window.OneSignal.push(function() {
        window.OneSignal.init({
          appId: this.oneSignalAppId,
          allowLocalhostAsSecureOrigin: true,
          autoRegister: false, // We'll handle registration manually
          notifyButton: {
            enable: false
          }
        });
      });

      console.log(' OneSignal initialized');
    } catch (error) {
      console.error(' OneSignal initialization failed:', error);
    }
  }

  /**
   * Request permission for push notifications
   */
  async requestPermission(userId = null) {
    try {
      if (!this.isSupported) {
        throw new Error('Push notifications not supported');
      }

      await this.initialize();

      // Request permission
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log(' Push notification permission granted');
        
        // Subscribe to push notifications
        await this.subscribeToPush(userId);
        
        return true;
      } else {
        console.log(' Push notification permission denied');
        return false;
      }
    } catch (error) {
      console.error(' Error requesting permission:', error);
      return false;
    }
  }

  /**
   * Subscribe to push notifications
   */
  async subscribeToPush(userId = null) {
    try {
      // Create subscription using Web Push
      this.subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          process.env.REACT_APP_VAPID_PUBLIC_KEY || this.getDefaultVAPIDKey()
        )
      });

      // Save subscription to database
      if (userId) {
        await this.saveSubscription(userId, this.subscription);
      }

      console.log(' Successfully subscribed to push notifications');
      return this.subscription;
    } catch (error) {
      console.error(' Failed to subscribe to push notifications:', error);
      throw error;
    }
  }

  /**
   * Save push subscription to Supabase
   */
  async saveSubscription(userId, subscription) {
    try {
      const subscriptionData = {
        user_id: userId,
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.getKey('p256dh') ? 
            btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')))) : null,
          auth: subscription.getKey('auth') ? 
            btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')))) : null
        },
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('push_subscriptions')
        .upsert(subscriptionData);

      if (error) throw error;
      
      console.log(' Push subscription saved to database');
    } catch (error) {
      console.error(' Failed to save subscription:', error);
    }
  }

  /**
   * Send a local notification (for testing)
   */
  async sendLocalNotification(title, options = {}) {
    try {
      if (!('Notification' in window)) {
        throw new Error('Notifications not supported');
      }

      if (Notification.permission === 'granted') {
        const notification = new Notification(title, {
          icon: '/logos/logo-192.png',
          badge: '/logos/logo-72.png',
          ...options
        });

        // Auto-close after 5 seconds
        setTimeout(() => notification.close(), 5000);

        return notification;
      }
    } catch (error) {
      console.error(' Error sending local notification:', error);
    }
  }

  /**
   * Set up job alert preferences
   */
  async setupJobAlerts(userId, preferences) {
    try {
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
      
      // Send confirmation notification
      await this.sendLocalNotification(
        ' Job Alerts Activated!',
        {
          body: `You'll receive notifications for ${preferences.jobTypes?.join(', ') || 'all'} jobs in ${preferences.location || 'South Africa'}`,
          tag: 'job-alerts-setup'
        }
      );

    } catch (error) {
      console.error(' Error setting up job alerts:', error);
    }
  }

  /**
   * Test push notification functionality
   */
  async testNotification() {
    try {
      await this.sendLocalNotification(
        ' Test Notification',
        {
          body: 'Push notifications are working perfectly! ',
          tag: 'test-notification',
          actions: [
            {
              action: 'view',
              title: 'View Jobs',
              icon: '/logos/logo-72.png'
            }
          ]
        }
      );
    } catch (error) {
      console.error(' Test notification failed:', error);
    }
  }

  /**
   * Send job found notification
   */
  async sendJobFoundNotification(job) {
    try {
      const notification = await this.sendLocalNotification(
        ` New Job Match: ${job.title}`,
        {
          body: `${job.company} • ${job.location} • ${job.salary || 'Competitive salary'}`,
          tag: `job-${job.id}`,
          data: {
            jobId: job.id,
            action: 'view-job'
          },
          actions: [
            {
              action: 'view',
              title: 'View Job',
              icon: '/logos/logo-72.png'
            },
            {
              action: 'apply',
              title: 'Quick Apply',
              icon: '/logos/logo-72.png'
            }
          ],
          requireInteraction: true // Keep notification visible until user interacts
        }
      );

      // Handle notification click
      if (notification) {
        notification.onclick = () => {
          window.focus();
          window.location.href = `/jobs/${job.id}`;
        };
      }

    } catch (error) {
      console.error(' Failed to send job notification:', error);
    }
  }

  /**
   * Get notification permission status
   */
  getPermissionStatus() {
    if (!this.isSupported) {
      return 'unsupported';
    }
    return Notification.permission;
  }

  /**
   * Check if notifications are enabled
   */
  isNotificationsEnabled() {
    return this.getPermissionStatus() === 'granted';
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe(userId = null) {
    try {
      if (this.subscription) {
        await this.subscription.unsubscribe();
        this.subscription = null;
      }

      if (userId) {
        // Remove from database
        const { error } = await supabase
          .from('push_subscriptions')
          .delete()
          .eq('user_id', userId);

        if (error) throw error;
      }

      console.log(' Successfully unsubscribed from push notifications');
    } catch (error) {
      console.error(' Error unsubscribing:', error);
    }
  }

  /**
   * Update current user context
   */
  setCurrentUser(user) {
    this.currentUser = user;
  }

  /**
   * Utility: Convert VAPID key to Uint8Array
   */
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  /**
   * Get default VAPID key (you should replace this with your own)
   */
  getDefaultVAPIDKey() {
    return 'BEl62iUYgUivxIkv69yViEuiBIa40HI-8BM9-ldHyGj8sB-iFkQ_MO1gO5S_8Dt0_3L-1hOKPt_B7ZxS3g';
  }

  /**
   * Create required database tables (run this once)
   */
  async createDatabaseTables() {
    try {
      // This would typically be run from your backend or Supabase SQL editor
      const tables = `
        -- Push Subscriptions Table
        CREATE TABLE IF NOT EXISTS push_subscriptions (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
          endpoint TEXT NOT NULL,
          keys JSONB NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id, endpoint)
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

        -- Notification History Table
        CREATE TABLE IF NOT EXISTS notification_history (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          body TEXT NOT NULL,
          job_id UUID,
          sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          read_at TIMESTAMP WITH TIME ZONE,
          clicked BOOLEAN DEFAULT false
        );
      `;

      console.log(' Database table creation SQL ready:', tables);
      return tables;
    } catch (error) {
      console.error(' Error creating database tables:', error);
    }
  }
}

export default new FreePushNotificationService();

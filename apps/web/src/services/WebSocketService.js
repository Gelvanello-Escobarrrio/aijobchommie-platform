/**
 * 🔥 REAL-TIME WEBSOCKET SERVICE
 * Handles all live connections, updates, and notifications
 */

class WebSocketService {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.listeners = new Map();
    this.isConnecting = false;
    this.heartbeatInterval = null;
    this.lastHeartbeat = null;
    
    // Connection states
    this.CONNECTING = 0;
    this.OPEN = 1;
    this.CLOSING = 2;
    this.CLOSED = 3;
  }

  /**
   * 🚀 Initialize WebSocket connection
   */
  connect(userId, token) {
    if (this.isConnecting || (this.socket && this.socket.readyState === this.OPEN)) {
      return;
    }

    this.isConnecting = true;
    const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:3001/ws';
    
    try {
      this.socket = new WebSocket(`${wsUrl}?userId=${userId}&token=${token}`);
      this.setupEventHandlers();
    } catch (error) {
      console.error('❌ WebSocket connection failed:', error);
      this.handleReconnect();
    }
  }

  /**
   * ⚡ Setup WebSocket event handlers
   */
  setupEventHandlers() {
    this.socket.onopen = (event) => {
      console.log('✅ WebSocket connected successfully');
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.startHeartbeat();
      
      // Notify listeners
      this.emit('connection_established', { 
        timestamp: new Date(),
        status: 'connected'
      });
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('❌ Error parsing WebSocket message:', error);
      }
    };

    this.socket.onclose = (event) => {
      console.log('🔌 WebSocket connection closed:', event.code, event.reason);
      this.isConnecting = false;
      this.stopHeartbeat();
      
      // Emit disconnect event
      this.emit('connection_lost', {
        code: event.code,
        reason: event.reason,
        timestamp: new Date()
      });

      // Attempt reconnection if not intentionally closed
      if (event.code !== 1000) {
        this.handleReconnect();
      }
    };

    this.socket.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      this.emit('connection_error', { error, timestamp: new Date() });
    };
  }

  /**
   * 💬 Handle incoming messages
   */
  handleMessage(data) {
    const { type, payload, timestamp } = data;
    
    switch (type) {
      case 'job_alert':
        this.handleJobAlert(payload);
        break;
      case 'application_update':
        this.handleApplicationUpdate(payload);
        break;
      case 'recruiter_message':
        this.handleRecruiterMessage(payload);
        break;
      case 'location_jobs':
        this.handleLocationJobs(payload);
        break;
      case 'system_notification':
        this.handleSystemNotification(payload);
        break;
      case 'heartbeat':
        this.handleHeartbeat(payload);
        break;
      default:
        console.log('📨 Unknown message type:', type);
    }

    // Emit to specific listeners
    this.emit(type, { ...payload, timestamp });
    this.emit('message', data);
  }

  /**
   * 🚨 Handle live job alerts
   */
  handleJobAlert(payload) {
    const { job, matchScore, alertType } = payload;
    
    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification('🔥 New Job Alert!', {
        body: `${job.title} at ${job.company} - ${matchScore}% match`,
        icon: '/icons/job-alert-192.png',
        badge: '/icons/badge-72.png',
        tag: `job_${job.id}`,
        data: { jobId: job.id, type: 'job_alert' },
        actions: [
          { action: 'view', title: 'View Job' },
          { action: 'save', title: 'Save for Later' }
        ]
      });
    }

    // Store in local storage for offline access
    this.storeNotification('job_alert', payload);
    
    console.log('🚨 Live Job Alert:', job.title, `${matchScore}% match`);
  }

  /**
   * 📄 Handle application status updates
   */
  handleApplicationUpdate(payload) {
    const { applicationId, status, company, position } = payload;
    
    // Show notification for status changes
    if (Notification.permission === 'granted') {
      const statusMessages = {
        'viewed': `Your application for ${position} at ${company} has been viewed!`,
        'interview': `Interview scheduled for ${position} at ${company}!`,
        'offer': `Job offer received from ${company}! 🎉`,
        'rejected': `Update on your ${position} application at ${company}`
      };

      new Notification('📄 Application Update', {
        body: statusMessages[status] || `Application status updated: ${status}`,
        icon: '/icons/application-192.png',
        tag: `app_${applicationId}`,
        data: { applicationId, type: 'application_update' }
      });
    }

    console.log('📄 Application Update:', applicationId, status);
  }

  /**
   * 💬 Handle recruiter messages
   */
  handleRecruiterMessage(payload) {
    const { senderId, senderName, message, company } = payload;
    
    // Show message notification
    if (Notification.permission === 'granted') {
      new Notification(`💬 Message from ${senderName}`, {
        body: `${company}: ${message.substring(0, 100)}...`,
        icon: '/icons/message-192.png',
        tag: `msg_${senderId}`,
        data: { senderId, type: 'recruiter_message' },
        actions: [
          { action: 'reply', title: 'Reply' },
          { action: 'view', title: 'View Conversation' }
        ]
      });
    }

    // Store message
    this.storeMessage(payload);
    
    console.log('💬 New recruiter message:', senderName, company);
  }

  /**
   * 📍 Handle location-based jobs
   */
  handleLocationJobs(payload) {
    const { jobs, location, radius } = payload;
    
    if (jobs.length > 0) {
      console.log(`📍 ${jobs.length} new jobs found near ${location} (${radius}km radius)`);
      
      // Show location-based notification
      if (Notification.permission === 'granted') {
        new Notification('📍 Jobs Near You!', {
          body: `${jobs.length} new jobs found within ${radius}km of ${location}`,
          icon: '/icons/location-192.png',
          tag: 'location_jobs',
          data: { location, jobCount: jobs.length, type: 'location_jobs' }
        });
      }
    }
  }

  /**
   * 🔔 Handle system notifications
   */
  handleSystemNotification(payload) {
    const { title, message, priority, category } = payload;
    
    console.log('🔔 System notification:', title, message);
    
    // Show high-priority system notifications
    if (priority === 'high' && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/icons/system-192.png',
        tag: `system_${category}`,
        requireInteraction: true
      });
    }
  }

  /**
   * 💓 Handle heartbeat
   */
  handleHeartbeat(payload) {
    this.lastHeartbeat = new Date();
    
    // Send heartbeat response
    this.send('heartbeat_response', {
      timestamp: this.lastHeartbeat,
      status: 'alive'
    });
  }

  /**
   * 📤 Send message to server
   */
  send(type, payload = {}) {
    if (this.socket && this.socket.readyState === this.OPEN) {
      const message = {
        type,
        payload,
        timestamp: new Date().toISOString()
      };
      
      this.socket.send(JSON.stringify(message));
      return true;
    }
    
    console.warn('⚠️ Cannot send message - WebSocket not connected');
    return false;
  }

  /**
   * 🔄 Subscribe to job alerts
   */
  subscribeToJobAlerts(preferences) {
    return this.send('subscribe_job_alerts', {
      keywords: preferences.keywords || [],
      locations: preferences.locations || [],
      salaryMin: preferences.salaryMin,
      salaryMax: preferences.salaryMax,
      jobTypes: preferences.jobTypes || [],
      experienceLevel: preferences.experienceLevel,
      remote: preferences.remote || false
    });
  }

  /**
   * 📍 Subscribe to location-based jobs
   */
  subscribeToLocationJobs(latitude, longitude, radius = 25) {
    return this.send('subscribe_location_jobs', {
      latitude,
      longitude,
      radius
    });
  }

  /**
   * 💬 Send recruiter message
   */
  sendRecruiterMessage(recruiterId, message) {
    return this.send('recruiter_message', {
      recipientId: recruiterId,
      message,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * 📄 Subscribe to application updates
   */
  subscribeToApplicationUpdates(applicationIds = []) {
    return this.send('subscribe_application_updates', {
      applicationIds
    });
  }

  /**
   * 🔔 Request notification permissions
   */
  async requestNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      console.log('🔔 Notification permission:', permission);
      return permission === 'granted';
    }
    return false;
  }

  /**
   * 📱 Register service worker for push notifications
   */
  async registerServiceWorker() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('📱 Service Worker registered:', registration);
        
        // Subscribe to push notifications
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(
            process.env.REACT_APP_VAPID_PUBLIC_KEY
          )
        });
        
        // Send subscription to server
        this.send('push_subscription', {
          subscription: subscription.toJSON()
        });
        
        return registration;
      } catch (error) {
        console.error('❌ Service Worker registration failed:', error);
      }
    }
  }

  /**
   * 🔄 Start heartbeat
   */
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.socket && this.socket.readyState === this.OPEN) {
        this.send('heartbeat', { timestamp: new Date() });
      }
    }, 30000); // Every 30 seconds
  }

  /**
   * ⏹️ Stop heartbeat
   */
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * 🔄 Handle reconnection
   */
  handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      this.emit('max_reconnect_attempts_reached');
      return;
    }

    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts);
    console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts + 1})`);
    
    setTimeout(() => {
      this.reconnectAttempts++;
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      
      if (userId && token) {
        this.connect(userId, token);
      }
    }, delay);
  }

  /**
   * 👂 Add event listener
   */
  on(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(callback);
  }

  /**
   * 🔇 Remove event listener
   */
  off(eventType, callback) {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * 📢 Emit event
   */
  emit(eventType, data) {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('❌ Error in event listener:', error);
        }
      });
    }
  }

  /**
   * 💾 Store notification locally
   */
  storeNotification(type, payload) {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.unshift({
      id: Date.now(),
      type,
      payload,
      timestamp: new Date().toISOString(),
      read: false
    });
    
    // Keep only last 100 notifications
    if (notifications.length > 100) {
      notifications.splice(100);
    }
    
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }

  /**
   * 💬 Store message locally
   */
  storeMessage(payload) {
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    messages.unshift({
      id: Date.now(),
      ...payload,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 50 messages
    if (messages.length > 50) {
      messages.splice(50);
    }
    
    localStorage.setItem('messages', JSON.stringify(messages));
  }

  /**
   * 🔧 Utility function for VAPID key conversion
   */
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  /**
   * 🔌 Disconnect WebSocket
   */
  disconnect() {
    this.stopHeartbeat();
    
    if (this.socket) {
      this.socket.close(1000, 'Client disconnecting');
      this.socket = null;
    }
    
    this.isConnecting = false;
    this.reconnectAttempts = 0;
  }

  /**
   * 📊 Get connection status
   */
  getStatus() {
    if (!this.socket) return 'disconnected';
    
    switch (this.socket.readyState) {
      case this.CONNECTING: return 'connecting';
      case this.OPEN: return 'connected';
      case this.CLOSING: return 'closing';
      case this.CLOSED: return 'disconnected';
      default: return 'unknown';
    }
  }

  /**
   * 🏃‍♂️ Check if connection is alive
   */
  isAlive() {
    if (!this.lastHeartbeat) return false;
    const now = new Date();
    return (now - this.lastHeartbeat) < 60000; // Within last minute
  }
}

// Export singleton instance
export default new WebSocketService();

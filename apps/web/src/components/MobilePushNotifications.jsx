/**
 * Mobile Push Notifications Manager
 * Handles notification permissions, setup, and testing for mobile users
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaBellSlash, FaCheck, FaTimes, FaPlay, FaCog } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import FreePushNotificationService from '../services/FreePushNotificationService';
import OneSignalService from '../services/OneSignalService';
import toast from 'react-hot-toast';

const MobilePushNotifications = () => {
  const { user } = useAuth();
  const [notificationStatus, setNotificationStatus] = useState({
    supported: false,
    enabled: false,
    service: 'none'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    location: 'south-africa',
    jobTypes: ['full-time'],
    keywords: [],
    salaryMin: 0,
    frequency: 'immediate'
  });
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = async () => {
    try {
      // Check both services
      const freeStatus = await FreePushNotificationService.getPermissionStatus();
      const oneSignalStatus = await OneSignalService.getNotificationStatus();
      
      // Prefer OneSignal if available
      if (oneSignalStatus.supported && oneSignalStatus.enabled) {
        setNotificationStatus(oneSignalStatus);
      } else {
        setNotificationStatus({
          supported: freeStatus !== 'unsupported',
          enabled: freeStatus === 'granted',
          service: 'web-push'
        });
      }
    } catch (error) {
      console.error('Error checking notification status:', error);
    }
  };

  const requestPermissions = async () => {
    try {
      setIsLoading(true);
      
      // Try OneSignal first, fallback to free service
      let granted = false;
      
      if (process.env.REACT_APP_ONESIGNAL_APP_ID) {
        granted = await OneSignalService.requestPermission(user?.id);
        if (granted) {
          toast.success('🔔 OneSignal notifications enabled!');
        }
      }
      
      if (!granted) {
        granted = await FreePushNotificationService.requestPermission(user?.id);
        if (granted) {
          toast.success('🔔 Push notifications enabled!');
        }
      }
      
      if (!granted) {
        toast.error('❌ Notification permission denied');
      }
      
      await checkNotificationStatus();
    } catch (error) {
      console.error('Error requesting permissions:', error);
      toast.error('❌ Failed to enable notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const setupJobAlerts = async () => {
    try {
      setIsLoading(true);
      
      // Set up alerts in both services
      if (notificationStatus.service === 'onesignal') {
        await OneSignalService.setupJobAlerts(user?.id, preferences);
      } else {
        await FreePushNotificationService.setupJobAlerts(user?.id, preferences);
      }
      
      toast.success('🚨 Job alerts configured!');
      setShowSetup(false);
    } catch (error) {
      console.error('Error setting up job alerts:', error);
      toast.error('❌ Failed to setup job alerts');
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestNotification = async () => {
    try {
      setIsLoading(true);
      
      if (notificationStatus.service === 'onesignal') {
        await OneSignalService.sendTestNotification();
      } else {
        await FreePushNotificationService.testNotification();
      }
      
      toast.success('🧪 Test notification sent!');
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast.error('❌ Test notification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const disableNotifications = async () => {
    try {
      setIsLoading(true);
      
      if (notificationStatus.service === 'onesignal') {
        await OneSignalService.unsubscribe();
      } else {
        await FreePushNotificationService.unsubscribe(user?.id);
      }
      
      await checkNotificationStatus();
      toast.success('🔇 Notifications disabled');
    } catch (error) {
      console.error('Error disabling notifications:', error);
      toast.error('❌ Failed to disable notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <FaBell style={styles.headerIcon} />
        <h2 style={styles.title}>Push Notifications</h2>
      </div>

      <div style={styles.statusCard}>
        <div style={styles.statusHeader}>
          <div style={styles.statusIcon}>
            {notificationStatus.enabled ? (
              <FaBell style={{ color: '#10b981' }} />
            ) : (
              <FaBellSlash style={{ color: '#ef4444' }} />
            )}
          </div>
          <div>
            <h3 style={styles.statusTitle}>
              {notificationStatus.enabled ? 'Notifications Enabled' : 'Notifications Disabled'}
            </h3>
            <p style={styles.statusSubtitle}>
              Service: {notificationStatus.service === 'onesignal' ? 'OneSignal' : 
                       notificationStatus.service === 'web-push' ? 'Web Push' : 'None'}
            </p>
          </div>
        </div>

        {!notificationStatus.supported && (
          <div style={styles.warningBanner}>
            ⚠️ Push notifications are not supported on this device
          </div>
        )}
      </div>

      <div style={styles.actionButtons}>
        {!notificationStatus.enabled ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={requestPermissions}
            disabled={isLoading || !notificationStatus.supported}
            style={styles.primaryButton}
          >
            {isLoading ? (
              <>🔄 Enabling...</>
            ) : (
              <>🔔 Enable Notifications</>
            )}
          </motion.button>
        ) : (
          <div style={styles.enabledActions}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSetup(true)}
              style={styles.secondaryButton}
            >
              <FaCog /> Setup Job Alerts
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={sendTestNotification}
              disabled={isLoading}
              style={styles.testButton}
            >
              {isLoading ? '🔄' : <FaPlay />} Test
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={disableNotifications}
              style={styles.dangerButton}
            >
              <FaTimes /> Disable
            </motion.button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showSetup && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={styles.setupModal}
          >
            <h3 style={styles.setupTitle}>🚨 Job Alert Preferences</h3>

            <div style={styles.formGroup}>
              <label style={styles.label}>Location</label>
              <select
                value={preferences.location}
                onChange={(e) => handlePreferenceChange('location', e.target.value)}
                style={styles.input}
              >
                <option value="south-africa">South Africa (All)</option>
                <option value="gauteng">Gauteng</option>
                <option value="western-cape">Western Cape</option>
                <option value="kwa-zulu-natal">KwaZulu-Natal</option>
                <option value="eastern-cape">Eastern Cape</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Job Types</label>
              <div style={styles.checkboxGroup}>
                {['full-time', 'part-time', 'contract', 'remote', 'internship'].map(type => (
                  <label key={type} style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={preferences.jobTypes.includes(type)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...preferences.jobTypes, type]
                          : preferences.jobTypes.filter(t => t !== type);
                        handlePreferenceChange('jobTypes', updated);
                      }}
                      style={styles.checkbox}
                    />
                    {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                  </label>
                ))}
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Keywords (comma-separated)</label>
              <input
                type="text"
                placeholder="e.g. developer, marketing, finance"
                value={preferences.keywords.join(', ')}
                onChange={(e) => handlePreferenceChange('keywords', 
                  e.target.value.split(',').map(k => k.trim()).filter(k => k)
                )}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Minimum Salary (ZAR)</label>
              <input
                type="number"
                placeholder="0"
                value={preferences.salaryMin}
                onChange={(e) => handlePreferenceChange('salaryMin', parseInt(e.target.value) || 0)}
                style={styles.input}
              />
            </div>

            <div style={styles.modalButtons}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={setupJobAlerts}
                disabled={isLoading}
                style={styles.primaryButton}
              >
                {isLoading ? '🔄 Setting up...' : '✅ Save Preferences'}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowSetup(false)}
                style={styles.cancelButton}
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={styles.infoSection}>
        <h4 style={styles.infoTitle}>📱 How it works:</h4>
        <ul style={styles.infoList}>
          <li>🚀 Get instant alerts when new jobs match your criteria</li>
          <li>🎯 Personalized notifications based on your preferences</li>
          <li>📍 Location-based job matching</li>
          <li>💰 Salary range filtering</li>
          <li>🔄 Real-time job updates</li>
        </ul>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '24px',
    gap: '12px'
  },
  headerIcon: {
    fontSize: '24px',
    color: '#3b82f6'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#111827',
    margin: 0
  },
  statusCard: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    border: '1px solid #e2e8f0'
  },
  statusHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  statusIcon: {
    fontSize: '20px'
  },
  statusTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#374151',
    margin: '0 0 4px 0'
  },
  statusSubtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0
  },
  warningBanner: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    padding: '12px',
    borderRadius: '8px',
    marginTop: '16px',
    fontSize: '14px'
  },
  actionButtons: {
    marginBottom: '24px'
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: '600',
    width: '100%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  enabledActions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  secondaryButton: {
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1
  },
  testButton: {
    backgroundColor: '#f59e0b',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 16px',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '60px'
  },
  dangerButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 16px',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  setupModal: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb'
  },
  setupTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '20px',
    textAlign: 'center'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px'
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#374151'
  },
  checkbox: {
    width: '16px',
    height: '16px'
  },
  modalButtons: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px'
  },
  cancelButton: {
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    flex: 1
  },
  infoSection: {
    backgroundColor: '#f0f9ff',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #bae6fd'
  },
  infoTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0c4a6e',
    marginBottom: '12px'
  },
  infoList: {
    fontSize: '14px',
    color: '#0369a1',
    paddingLeft: '20px',
    lineHeight: '1.6'
  }
};

export default MobilePushNotifications;

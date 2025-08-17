import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  User, 
  Bell, 
  Lock, 
  Palette, 
  Globe, 
  Smartphone,
  Shield,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
  Check,
  X,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  Crown,
  Users,
  Activity
} from 'lucide-react';
import toast from 'react-hot-toast';
import MobilePushNotifications from './MobilePushNotifications';

const MobileSettings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      push: true,
      email: true,
      sms: false,
      jobMatches: true,
      applications: true,
      interviews: true,
      marketing: false
    },
    privacy: {
      profileVisible: true,
      showSalary: false,
      showLocation: true,
      allowMessages: true,
      showActivity: false
    },
    preferences: {
      theme: 'system', // light, dark, system
      language: 'en',
      sound: true,
      autoApply: false,
      emailDigest: 'weekly'
    }
  });

  const [activeSection, setActiveSection] = useState(null);
  const [loading, setLoading] = useState(false);

  const sections = [
    {
      id: 'account',
      title: 'Account',
      icon: User,
      description: 'Profile and personal information',
      items: [
        { id: 'profile', title: 'Edit Profile', icon: User, action: 'navigate' },
        { id: 'subscription', title: 'Subscription', icon: Crown, action: 'navigate', badge: 'Premium' },
        { id: 'billing', title: 'Billing & Payments', icon: CreditCard, action: 'navigate' }
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      description: 'Manage your notification preferences',
      items: [
        { id: 'push', title: 'Push Notifications', type: 'toggle', key: 'notifications.push' },
        { id: 'email', title: 'Email Notifications', type: 'toggle', key: 'notifications.email' },
        { id: 'sms', title: 'SMS Notifications', type: 'toggle', key: 'notifications.sms' },
        { id: 'jobMatches', title: 'Job Match Alerts', type: 'toggle', key: 'notifications.jobMatches' },
        { id: 'applications', title: 'Application Updates', type: 'toggle', key: 'notifications.applications' },
        { id: 'interviews', title: 'Interview Reminders', type: 'toggle', key: 'notifications.interviews' },
        { id: 'marketing', title: 'Marketing Updates', type: 'toggle', key: 'notifications.marketing' }
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: Shield,
      description: 'Control your privacy and security settings',
      items: [
        { id: 'profileVisible', title: 'Profile Visibility', type: 'toggle', key: 'privacy.profileVisible' },
        { id: 'showSalary', title: 'Show Salary Expectations', type: 'toggle', key: 'privacy.showSalary' },
        { id: 'showLocation', title: 'Show Location', type: 'toggle', key: 'privacy.showLocation' },
        { id: 'allowMessages', title: 'Allow Direct Messages', type: 'toggle', key: 'privacy.allowMessages' },
        { id: 'showActivity', title: 'Show Activity Status', type: 'toggle', key: 'privacy.showActivity' },
        { id: 'changePassword', title: 'Change Password', icon: Lock, action: 'navigate' },
        { id: 'twoFactor', title: 'Two-Factor Authentication', icon: Shield, action: 'navigate' }
      ]
    },
    {
      id: 'preferences',
      title: 'Preferences',
      icon: Settings,
      description: 'Customize your app experience',
      items: [
        { id: 'theme', title: 'Theme', type: 'select', key: 'preferences.theme', 
          options: [
            { value: 'light', label: 'Light', icon: Sun },
            { value: 'dark', label: 'Dark', icon: Moon },
            { value: 'system', label: 'System', icon: Smartphone }
          ]
        },
        { id: 'language', title: 'Language', type: 'select', key: 'preferences.language',
          options: [
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Español' },
            { value: 'fr', label: 'Français' },
            { value: 'de', label: 'Deutsch' }
          ]
        },
        { id: 'sound', title: 'Sound Effects', type: 'toggle', key: 'preferences.sound' },
        { id: 'autoApply', title: 'Auto-Apply (Premium)', type: 'toggle', key: 'preferences.autoApply', premium: true },
        { id: 'emailDigest', title: 'Email Digest', type: 'select', key: 'preferences.emailDigest',
          options: [
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' },
            { value: 'never', label: 'Never' }
          ]
        }
      ]
    },
    {
      id: 'data',
      title: 'Data & Storage',
      icon: Activity,
      description: 'Manage your data and storage',
      items: [
        { id: 'exportData', title: 'Export My Data', icon: Download, action: 'export' },
        { id: 'importData', title: 'Import Data', icon: Upload, action: 'import' },
        { id: 'clearCache', title: 'Clear Cache', icon: Trash2, action: 'clear' },
        { id: 'deleteAccount', title: 'Delete Account', icon: AlertTriangle, action: 'delete', danger: true }
      ]
    },
    {
      id: 'support',
      title: 'Help & Support',
      icon: HelpCircle,
      description: 'Get help and contact support',
      items: [
        { id: 'help', title: 'Help Center', icon: HelpCircle, action: 'navigate' },
        { id: 'contact', title: 'Contact Support', icon: Users, action: 'contact' },
        { id: 'feedback', title: 'Send Feedback', icon: Activity, action: 'feedback' }
      ]
    }
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/v1/user/settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSetting = async (key, value) => {
    const keys = key.split('.');
    const newSettings = { ...settings };
    
    if (keys.length === 2) {
      newSettings[keys[0]][keys[1]] = value;
    } else {
      newSettings[key] = value;
    }
    
    setSettings(newSettings);

    try {
      await fetch('/api/v1/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newSettings)
      });

      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    }
  };

  const getSettingValue = (key) => {
    const keys = key.split('.');
    if (keys.length === 2) {
      return settings[keys[0]][keys[1]];
    }
    return settings[key];
  };

  const handleToggle = (key) => {
    const currentValue = getSettingValue(key);
    updateSetting(key, !currentValue);
  };

  const handleSelect = (key, value) => {
    updateSetting(key, value);
  };

  const handleAction = async (action, item) => {
    setLoading(true);
    
    try {
      switch (action) {
        case 'export':
          const response = await fetch('/api/v1/user/export', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'my-data.json';
          a.click();
          toast.success('Data exported successfully');
          break;
          
        case 'clear':
          localStorage.removeItem('app-cache');
          toast.success('Cache cleared successfully');
          break;
          
        case 'delete':
          if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            await fetch('/api/v1/user/delete', {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            localStorage.clear();
            window.location.href = '/';
          }
          break;
          
        case 'contact':
          toast.success('Redirecting to support...');
          break;
          
        default:
          break;
      }
    } catch (error) {
      console.error('Error handling action:', error);
      toast.error('Action failed');
    } finally {
      setLoading(false);
    }
  };

  const renderToggle = (item) => (
    <button
      onClick={() => handleToggle(item.key)}
      className={`w-12 h-6 rounded-full transition-colors relative ${
        getSettingValue(item.key) 
          ? 'bg-blue-500' 
          : 'bg-gray-300'
      }`}
    >
      <motion.div
        animate={{ x: getSettingValue(item.key) ? 24 : 2 }}
        className="w-5 h-5 bg-white rounded-full absolute top-0.5"
      />
    </button>
  );

  const renderSelect = (item) => {
    const [isOpen, setIsOpen] = useState(false);
    const currentValue = getSettingValue(item.key);
    const currentOption = item.options.find(opt => opt.value === currentValue);

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-32 p-2 bg-gray-100 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            {currentOption?.icon && <currentOption.icon size={16} />}
            <span className="text-sm">{currentOption?.label}</span>
          </div>
          <ChevronRight 
            size={16} 
            className={`transform transition-transform ${isOpen ? 'rotate-90' : ''}`} 
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border z-10"
            >
              {item.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    handleSelect(item.key, option.value);
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full p-3 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                >
                  {option.icon && <option.icon size={16} />}
                  <span>{option.label}</span>
                  {currentValue === option.value && <Check size={16} className="text-blue-500 ml-auto" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderItem = (item) => {
    const isActive = activeSection === item.id;
    
    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`p-4 rounded-xl border transition-all ${
          item.danger 
            ? 'border-red-200 hover:border-red-300 bg-red-50' 
            : 'border-gray-200 hover:border-gray-300 bg-white'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            {item.icon && (
              <div className={`p-2 rounded-lg ${
                item.danger ? 'bg-red-100' : 'bg-gray-100'
              }`}>
                <item.icon 
                  size={20} 
                  className={item.danger ? 'text-red-600' : 'text-gray-600'} 
                />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className={`font-medium ${
                  item.danger ? 'text-red-900' : 'text-gray-900'
                }`}>
                  {item.title}
                </h4>
                {item.badge && (
                  <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
                {item.premium && (
                  <Crown size={16} className="text-yellow-500" />
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {item.type === 'toggle' && renderToggle(item)}
            {item.type === 'select' && renderSelect(item)}
            {item.action && (
              <button
                onClick={() => handleAction(item.action, item)}
                disabled={loading}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 text-white">
        <div className="flex items-center space-x-3">
          <Settings size={28} />
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-blue-100">Customize your experience</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {sections.map((section) => (
          <div key={section.id} className="space-y-4">
            {/* Section Header */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <section.icon size={20} className="text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{section.title}</h2>
                <p className="text-sm text-gray-600">{section.description}</p>
              </div>
            </div>

            {/* Section Items */}
            <div className="space-y-3">
              {/* Add Push Notification Manager for notifications section */}
              {section.id === 'notifications' && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <MobilePushNotifications />
                </div>
              )}
              {section.items.map((item) => renderItem(item))}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            localStorage.clear();
            window.location.href = '/';
          }}
          className="w-full p-4 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </motion.button>

        {/* App Version */}
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">
            AI JobChommie v2.1.0
          </p>
          <p className="text-xs text-gray-400">
            Made with ❤️ for job seekers
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileSettings;

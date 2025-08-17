import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  Check, 
  Clock, 
  Briefcase, 
  Heart,
  MessageCircle,
  UserCheck,
  TrendingUp,
  Star,
  AlertCircle,
  Settings,
  Filter,
  Archive,
  Trash2,
  ExternalLink,
  Calendar,
  MapPin,
  DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';

const MobileNotificationCenter = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, jobs, applications, system, social
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const notificationTypes = {
    job_match: {
      icon: Briefcase,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    application_status: {
      icon: Check,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    interview: {
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    salary_insight: {
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    profile_view: {
      icon: UserCheck,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    system: {
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    social: {
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    }
  };

  const filterOptions = [
    { id: 'all', name: 'All', icon: Bell },
    { id: 'jobs', name: 'Jobs', icon: Briefcase },
    { id: 'applications', name: 'Applications', icon: Check },
    { id: 'system', name: 'System', icon: AlertCircle },
    { id: 'social', name: 'Social', icon: Heart }
  ];

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, filter]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/notifications?filter=${filter}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || mockNotifications);
        setUnreadCount(data.unreadCount || 5);
      } else {
        setNotifications(mockNotifications);
        setUnreadCount(5);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications(mockNotifications);
      setUnreadCount(5);
    } finally {
      setLoading(false);
    }
  };

  // Mock notifications for demo
  const mockNotifications = [
    {
      id: '1',
      type: 'job_match',
      title: 'New Job Match!',
      message: 'Frontend Developer at TechCorp matches your profile 95%',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      isRead: false,
      actionUrl: '/jobs/123',
      metadata: {
        company: 'TechCorp',
        location: 'Remote',
        salary: '$80k - $120k'
      }
    },
    {
      id: '2',
      type: 'application_status',
      title: 'Application Update',
      message: 'Your application for React Developer at StartupXYZ has been viewed by the hiring manager',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isRead: false,
      actionUrl: '/applications/456',
      metadata: {
        status: 'Under Review',
        nextStep: 'Technical Interview'
      }
    },
    {
      id: '3',
      type: 'interview',
      title: 'Interview Scheduled',
      message: 'Technical interview with BigTech Inc. scheduled for tomorrow at 2:00 PM',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      actionUrl: '/calendar/interview-789',
      metadata: {
        date: '2024-01-15',
        time: '14:00',
        type: 'Video Call'
      }
    },
    {
      id: '4',
      type: 'salary_insight',
      title: 'Salary Benchmark Alert',
      message: 'The average salary for your skills in San Francisco increased by 8% this month',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      actionUrl: '/insights/salary',
      metadata: {
        increase: '8%',
        averageSalary: '$135k',
        location: 'San Francisco'
      }
    },
    {
      id: '5',
      type: 'profile_view',
      title: 'Profile Viewed',
      message: '3 recruiters viewed your profile today',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      actionUrl: '/profile/views',
      metadata: {
        viewCount: 3,
        companies: ['Meta', 'Google', 'Netflix']
      }
    },
    {
      id: '6',
      type: 'system',
      title: 'Feature Unlock Coming Soon!',
      message: 'Job search will be available when we reach 10,000 subscribers. We\'re at 8,245 now!',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      isRead: false,
      actionUrl: '/milestones',
      metadata: {
        current: 8245,
        target: 10000,
        progress: 82
      }
    }
  ];

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`/api/v1/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? {...n, isRead: true} : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/v1/notifications/read-all', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setNotifications(prev => prev.map(n => ({...n, isRead: true})));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await fetch(`/api/v1/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      // Navigate to the notification's action URL
      window.location.href = notification.actionUrl;
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'jobs') return ['job_match', 'salary_insight'].includes(notification.type);
    if (filter === 'applications') return ['application_status', 'interview'].includes(notification.type);
    return notification.type === filter;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        className="bg-white w-full max-w-md max-h-[85vh] rounded-t-2xl sm:rounded-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-4 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Bell size={24} />
              <div>
                <h2 className="text-lg font-bold">Notifications</h2>
                {unreadCount > 0 && (
                  <p className="text-sm text-blue-100">{unreadCount} unread</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
                >
                  <Check size={18} />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-white bg-opacity-20 rounded-lg p-1">
            {filterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setFilter(option.id)}
                className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
                  filter === option.id
                    ? 'bg-white text-blue-600'
                    : 'text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <option.icon size={14} />
                <span>{option.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
              <p className="text-gray-500">No new notifications to show</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              <AnimatePresence>
                {filteredNotifications.map((notification, index) => {
                  const notificationType = notificationTypes[notification.type];
                  const Icon = notificationType?.icon || Bell;

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 hover:bg-gray-50 cursor-pointer relative ${
                        !notification.isRead ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex space-x-3">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          notificationType?.bgColor || 'bg-gray-100'
                        }`}>
                          <Icon 
                            size={20} 
                            className={notificationType?.color || 'text-gray-600'} 
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className={`text-sm font-medium ${
                                !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {notification.title}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {notification.message}
                              </p>

                              {/* Metadata */}
                              {notification.metadata && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {notification.metadata.company && (
                                    <span className="inline-flex items-center text-xs text-gray-500">
                                      <Briefcase size={12} className="mr-1" />
                                      {notification.metadata.company}
                                    </span>
                                  )}
                                  {notification.metadata.location && (
                                    <span className="inline-flex items-center text-xs text-gray-500">
                                      <MapPin size={12} className="mr-1" />
                                      {notification.metadata.location}
                                    </span>
                                  )}
                                  {notification.metadata.salary && (
                                    <span className="inline-flex items-center text-xs text-gray-500">
                                      <DollarSign size={12} className="mr-1" />
                                      {notification.metadata.salary}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="flex items-start space-x-2 ml-2">
                              <div className="flex flex-col items-end">
                                <span className="text-xs text-gray-500">
                                  {getTimeAgo(notification.timestamp)}
                                </span>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                                )}
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="p-1 rounded-full hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 size={14} className="text-gray-400" />
                              </button>
                            </div>
                          </div>

                          {notification.actionUrl && (
                            <div className="mt-2">
                              <div className="flex items-center text-xs text-blue-600">
                                <span>View details</span>
                                <ExternalLink size={12} className="ml-1" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {filteredNotifications.length > 0 && (
          <div className="border-t border-gray-100 p-4">
            <div className="flex space-x-3">
              <button className="flex-1 py-2 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Archive size={16} className="inline mr-2" />
                Archive All
              </button>
              <button className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                <Settings size={16} className="inline mr-2" />
                Settings
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MobileNotificationCenter;

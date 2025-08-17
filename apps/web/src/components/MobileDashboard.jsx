import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiBriefcase, FiUser, FiBell, FiSettings, 
  FiTrendingUp, FiMapPin, FiClock, FiStar, FiPlus,
  FiBookmark, FiFileText, FiDollarSign, FiTarget
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const MobileDashboard = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [stats, setStats] = useState({
    applications: 0,
    saved_jobs: 0,
    profile_views: 0,
    match_rate: '0%'
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load user stats
      const statsResponse = await fetch('/api/v1/analytics/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.data.overview);
      }

      // Load recent jobs
      const jobsResponse = await fetch('/api/v1/jobs/search?limit=5', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        setRecentJobs(jobsData.data.jobs || []);
      }

      // Load notifications
      const notifResponse = await fetch('/api/v1/notifications?limit=3', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (notifResponse.ok) {
        const notifData = await notifResponse.json();
        setNotifications(notifData.data.notifications || []);
      }

    } catch (error) {
      console.error('Dashboard loading error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const QuickAction = ({ icon: Icon, title, color, onClick, badge }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative p-4 rounded-2xl shadow-lg cursor-pointer ${color}`}
      onClick={onClick}
    >
      <Icon className="w-6 h-6 text-white mb-2" />
      <p className="text-white text-xs font-medium">{title}</p>
      {badge && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {badge}
        </div>
      )}
    </motion.div>
  );

  const StatCard = ({ icon: Icon, title, value, trend }) => (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-xs font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${trend > 0 ? 'bg-green-100' : 'bg-gray-100'}`}>
          <Icon className={`w-5 h-5 ${trend > 0 ? 'text-green-600' : 'text-gray-600'}`} />
        </div>
      </div>
    </div>
  );

  const JobCard = ({ job }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
            {job.title}
          </h3>
          <p className="text-gray-600 text-xs">{job.company}</p>
        </div>
        <div className="flex items-center space-x-1">
          <FiStar className="w-3 h-3 text-yellow-500" />
          <span className="text-xs font-medium text-gray-900">
            {job.ai_match_score || 85}%
          </span>
        </div>
      </div>
      
      <div className="flex items-center space-x-3 text-xs text-gray-500 mb-3">
        <div className="flex items-center">
          <FiMapPin className="w-3 h-3 mr-1" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center">
          <FiClock className="w-3 h-3 mr-1" />
          <span>2 days ago</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
            {job.job_type || 'Full-time'}
          </span>
          {job.salary_min && (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              R{job.salary_min.toLocaleString()}+
            </span>
          )}
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full font-medium"
        >
          Apply
        </motion.button>
      </div>
    </motion.div>
  );

  const NotificationItem = ({ notification }) => (
    <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-100">
      <div className={`p-2 rounded-full ${
        notification.type === 'job_match' ? 'bg-blue-100' :
        notification.type === 'application_update' ? 'bg-green-100' : 'bg-gray-100'
      }`}>
        <FiBell className={`w-4 h-4 ${
          notification.type === 'job_match' ? 'text-blue-600' :
          notification.type === 'application_update' ? 'text-green-600' : 'text-gray-600'
        }`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 line-clamp-1">
          {notification.title}
        </p>
        <p className="text-xs text-gray-500 line-clamp-2">
          {notification.message}
        </p>
        <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-blue-100 text-sm">{greeting} 👋</p>
            <h1 className="text-white text-lg font-bold">
              {user?.name || 'Job Seeker'}
            </h1>
          </div>
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <FiBell className="w-6 h-6 text-white cursor-pointer" />
            {notifications.length > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {notifications.length}
              </div>
            )}
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3">
          <QuickAction
            icon={FiSearch}
            title="Search Jobs"
            color="bg-blue-500"
            onClick={() => window.location.href = '/search'}
          />
          <QuickAction
            icon={FiBriefcase}
            title="Applications"
            color="bg-green-500"
            onClick={() => window.location.href = '/applications'}
            badge={stats.applications > 0 ? stats.applications : null}
          />
          <QuickAction
            icon={FiFileText}
            title="Upload CV"
            color="bg-purple-500"
            onClick={() => window.location.href = '/cv-upload'}
          />
          <QuickAction
            icon={FiUser}
            title="Profile"
            color="bg-orange-500"
            onClick={() => window.location.href = '/profile'}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 -mt-4">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatCard
            icon={FiBriefcase}
            title="Applications"
            value={stats.total_applications || 0}
            trend={1}
          />
          <StatCard
            icon={FiBookmark}
            title="Saved Jobs"
            value={stats.saved_jobs || 0}
            trend={1}
          />
          <StatCard
            icon={FiTarget}
            title="Match Rate"
            value={stats.application_rate || '0%'}
            trend={1}
          />
          <StatCard
            icon={FiTrendingUp}
            title="Profile Views"
            value={stats.profile_views || 0}
            trend={1}
          />
        </div>
      </div>

      {/* Job Recommendations */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Recommended for You</h2>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="text-blue-600 text-sm font-medium"
            onClick={() => window.location.href = '/jobs'}
          >
            View All
          </motion.button>
        </div>
        
        <div className="space-y-3">
          {recentJobs.length > 0 ? (
            recentJobs.slice(0, 3).map((job, index) => (
              <JobCard key={index} job={job} />
            ))
          ) : (
            <div className="text-center py-8">
              <FiBriefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No job recommendations yet</p>
              <p className="text-gray-400 text-sm">Complete your profile to get personalized matches</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
        
        <div className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <NotificationItem key={index} notification={notification} />
            ))
          ) : (
            <div className="text-center py-6">
              <FiBell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No recent activity</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="px-4 mb-6">
        <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-4 text-white">
          <div className="flex items-center mb-2">
            <FiStar className="w-5 h-5 mr-2" />
            <h3 className="font-semibold">Pro Tip</h3>
          </div>
          <p className="text-sm opacity-90">
            Complete your profile and upload your CV to get 3x more job matches!
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="mt-3 bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium"
            onClick={() => window.location.href = '/profile'}
          >
            Complete Profile
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default MobileDashboard;

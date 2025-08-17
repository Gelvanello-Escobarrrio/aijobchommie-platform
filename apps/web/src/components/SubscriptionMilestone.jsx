import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiUsers, FiSearch, FiTarget, FiTrendingUp, FiShare2,
  FiGift, FiStar, FiZap, FiHeart
} from 'react-icons/fi';

const SubscriptionMilestone = ({ compact = false, className = '' }) => {
  const [currentSubscribers, setCurrentSubscribers] = useState(0);
  const [loading, setLoading] = useState(true);
  const targetSubscribers = 10000;

  useEffect(() => {
    fetchSubscriberCount();
  }, []);

  const fetchSubscriberCount = async () => {
    try {
      const response = await fetch('/api/v1/analytics/subscribers');
      if (response.ok) {
        const data = await response.json();
        setCurrentSubscribers(data.data.total_subscribers || 0);
      }
    } catch (error) {
      console.error('Failed to fetch subscriber count:', error);
      // Mock data for development
      setCurrentSubscribers(Math.floor(Math.random() * 1000) + 150);
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = Math.min((currentSubscribers / targetSubscribers) * 100, 100);
  const remainingSubscribers = Math.max(targetSubscribers - currentSubscribers, 0);

  const getMilestoneMessage = () => {
    if (progressPercentage >= 100) {
      return "🎉 Search functionality is now LIVE!";
    } else if (progressPercentage >= 75) {
      return "🔥 So close! Search coming very soon!";
    } else if (progressPercentage >= 50) {
      return "🚀 Halfway there! Keep sharing!";
    } else if (progressPercentage >= 25) {
      return "📈 Great progress! We're building momentum!";
    } else {
      return "🌟 Help us unlock job search for everyone!";
    }
  };

  const getProgressColor = () => {
    if (progressPercentage >= 100) return 'bg-green-500';
    if (progressPercentage >= 75) return 'bg-orange-500';
    if (progressPercentage >= 50) return 'bg-blue-500';
    if (progressPercentage >= 25) return 'bg-purple-500';
    return 'bg-gray-400';
  };

  if (compact) {
    return (
      <div className={`bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-3 text-white ${className}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <FiTarget className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Search Unlock Progress</span>
          </div>
          <span className="text-xs font-bold">
            {currentSubscribers.toLocaleString()}/{targetSubscribers.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="bg-white h-2 rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <motion.div
            animate={{ rotate: progressPercentage >= 100 ? 360 : 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
          >
            {progressPercentage >= 100 ? (
              <FiZap className="w-6 h-6 text-white" />
            ) : (
              <FiSearch className="w-6 h-6 text-white" />
            )}
          </motion.div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Unlock Job Search Feature
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {getMilestoneMessage()}
        </p>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {loading ? '...' : currentSubscribers.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">Current Subscribers</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {loading ? '...' : remainingSubscribers.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">Subscribers Needed</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {loading ? '...' : Math.round(progressPercentage)}%
          </div>
          <div className="text-xs text-gray-500">Progress</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress to 10,000</span>
          <span className="text-sm text-gray-500">{Math.round(progressPercentage)}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 2, ease: "easeOut" }}
            className={`h-3 rounded-full ${getProgressColor()}`}
          />
        </div>
        
        {/* Milestone Markers */}
        <div className="relative mt-2">
          {[25, 50, 75, 100].map((milestone) => (
            <div
              key={milestone}
              className="absolute top-0 transform -translate-x-1/2"
              style={{ left: `${milestone}%` }}
            >
              <div 
                className={`w-2 h-2 rounded-full ${
                  progressPercentage >= milestone ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
              <div className="text-xs text-gray-500 mt-1 text-center">
                {milestone}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features That Will Be Unlocked */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <FiGift className="w-4 h-4 mr-2 text-purple-600" />
          What Gets Unlocked at 10,000 Subscribers?
        </h4>
        
        <div className="space-y-2">
          {[
            { icon: FiSearch, text: 'Full job search functionality', status: progressPercentage >= 100 },
            { icon: FiZap, text: 'Real-time job alerts', status: progressPercentage >= 100 },
            { icon: FiTarget, text: 'Advanced filtering options', status: progressPercentage >= 100 },
            { icon: FiTrendingUp, text: 'Location-based search', status: progressPercentage >= 100 },
          ].map((feature, index) => (
            <div key={index} className="flex items-center text-sm">
              <feature.icon 
                className={`w-4 h-4 mr-3 ${
                  feature.status ? 'text-green-500' : 'text-gray-400'
                }`} 
              />
              <span className={feature.status ? 'text-green-700' : 'text-gray-600'}>
                {feature.text}
              </span>
              {feature.status && (
                <FiStar className="w-3 h-3 ml-auto text-green-500" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium flex items-center justify-center"
        >
          <FiShare2 className="w-4 h-4 mr-2" />
          Share with Friends
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium flex items-center justify-center"
        >
          <FiHeart className="w-4 h-4 mr-2" />
          Invite Friends
        </motion.button>
      </div>

      {/* Additional Info */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800 text-center">
          💡 <strong>Why the wait?</strong> We use premium job search APIs that cost money per search. 
          Once we reach 10,000 subscribers, we'll have enough revenue to unlock unlimited searching for everyone! 
        </p>
      </div>
    </motion.div>
  );
};

export default SubscriptionMilestone;

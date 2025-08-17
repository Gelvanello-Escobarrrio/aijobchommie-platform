import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FiHome, FiSearch, FiBriefcase, FiBookmark, FiUser
} from 'react-icons/fi';

const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: FiHome,
      path: '/dashboard',
      color: 'text-blue-600'
    },
    {
      id: 'search',
      label: 'Search',
      icon: FiSearch,
      path: '/search',
      color: 'text-green-600'
    },
    {
      id: 'applications',
      label: 'Applications',
      icon: FiBriefcase,
      path: '/applications',
      color: 'text-purple-600'
    },
    {
      id: 'saved',
      label: 'Saved',
      icon: FiBookmark,
      path: '/saved',
      color: 'text-orange-600'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: FiUser,
      path: '/profile',
      color: 'text-pink-600'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb z-40">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleNavigation(item.path)}
              className="flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1"
            >
              <div className="relative">
                <motion.div
                  animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`p-2 rounded-xl ${
                    isActive ? 'bg-blue-100' : 'bg-transparent'
                  }`}
                >
                  <Icon 
                    className={`w-5 h-5 ${
                      isActive ? 'text-blue-600' : 'text-gray-500'
                    }`}
                  />
                </motion.div>
                
                {/* Active indicator dot */}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"
                  />
                )}
              </div>
              
              <span className={`text-xs font-medium mt-1 ${
                isActive ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;

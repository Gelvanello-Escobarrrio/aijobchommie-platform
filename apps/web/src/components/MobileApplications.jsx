import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCheck, FiClock, FiX, FiEye, FiMapPin, FiCalendar,
  FiFilter, FiBriefcase, FiTrendingUp, FiAlertCircle,
  FiRefreshCw, FiExternalLink, FiMessageSquare, FiPhone
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const MobileApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const statusFilters = [
    { id: 'all', label: 'All', count: 0 },
    { id: 'pending', label: 'Pending', count: 0, color: 'bg-yellow-100 text-yellow-700' },
    { id: 'interview', label: 'Interview', count: 0, color: 'bg-blue-100 text-blue-700' },
    { id: 'accepted', label: 'Accepted', count: 0, color: 'bg-green-100 text-green-700' },
    { id: 'rejected', label: 'Rejected', count: 0, color: 'bg-red-100 text-red-700' }
  ];

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, selectedStatus]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/applications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data.data.applications || []);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;
    
    if (selectedStatus !== 'all') {
      filtered = applications.filter(app => app.status === selectedStatus);
    }
    
    setFilteredApplications(filtered);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadApplications();
  };

  const handleWithdrawApplication = async (applicationId) => {
    try {
      const response = await fetch(`/api/v1/applications/${applicationId}/withdraw`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setApplications(prev => 
          prev.map(app => 
            app.id === applicationId 
              ? { ...app, status: 'withdrawn' }
              : app
          )
        );
        toast.success('Application withdrawn');
        setSelectedApplication(null);
      }
    } catch (error) {
      toast.error('Failed to withdraw application');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiClock className="w-4 h-4" />;
      case 'interview':
        return <FiEye className="w-4 h-4" />;
      case 'accepted':
        return <FiCheck className="w-4 h-4" />;
      case 'rejected':
        return <FiX className="w-4 h-4" />;
      default:
        return <FiClock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'interview':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'accepted':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const StatusFilterBar = () => (
    <div className="bg-white px-4 py-3 shadow-sm">
      <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
        {statusFilters.map((filter) => {
          const count = filter.id === 'all' 
            ? applications.length 
            : applications.filter(app => app.status === filter.id).length;

          return (
            <motion.button
              key={filter.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedStatus(filter.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap border transition-colors ${
                selectedStatus === filter.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-100 text-gray-700 border-gray-200'
              }`}
            >
              <span className="font-medium">{filter.label}</span>
              {count > 0 && (
                <span className={`px-2 py-1 rounded-full text-xs ${
                  selectedStatus === filter.id
                    ? 'bg-white bg-opacity-20 text-white'
                    : 'bg-white text-gray-700'
                }`}>
                  {count}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );

  const ApplicationCard = ({ application }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-3"
      onClick={() => setSelectedApplication(application)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg line-clamp-1 mb-1">
            {application.job_title}
          </h3>
          <p className="text-blue-600 font-medium text-sm">{application.company_name}</p>
        </div>
        
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(application.status)}`}>
          {getStatusIcon(application.status)}
          <span className="capitalize">{application.status}</span>
        </div>
      </div>

      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
        <div className="flex items-center">
          <FiMapPin className="w-3 h-3 mr-1" />
          <span>{application.location}</span>
        </div>
        
        <div className="flex items-center">
          <FiCalendar className="w-3 h-3 mr-1" />
          <span>Applied {getTimeAgo(application.applied_date)}</span>
        </div>
      </div>

      {application.interview_date && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
          <div className="flex items-center space-x-2">
            <FiCalendar className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              Interview scheduled for {new Date(application.interview_date).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {application.salary_offered && (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              R{application.salary_offered.toLocaleString()}
            </span>
          )}
          
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            {application.job_type || 'Full-time'}
          </span>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedApplication(application);
          }}
          className="px-3 py-1 text-blue-600 text-sm font-medium"
        >
          View Details
        </motion.button>
      </div>

      {application.notes && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-600 line-clamp-2">
            <strong>Note:</strong> {application.notes}
          </p>
        </div>
      )}
    </motion.div>
  );

  const ApplicationDetailModal = () => (
    <AnimatePresence>
      {selectedApplication && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end"
          onClick={() => setSelectedApplication(null)}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="bg-white w-full max-h-[90vh] rounded-t-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {selectedApplication.job_title}
                  </h2>
                  <p className="text-blue-600 font-medium">{selectedApplication.company_name}</p>
                </div>
                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedApplication(null)}
                  className="p-2 rounded-full bg-gray-100 ml-4"
                >
                  <FiX className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="flex items-center justify-between">
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-full border ${getStatusColor(selectedApplication.status)}`}>
                  {getStatusIcon(selectedApplication.status)}
                  <span className="font-medium capitalize">{selectedApplication.status}</span>
                </div>
                
                <span className="text-sm text-gray-500">
                  Applied {getTimeAgo(selectedApplication.applied_date)}
                </span>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[50vh]">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{selectedApplication.location}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Job Type</p>
                    <p className="font-medium">{selectedApplication.job_type || 'Full-time'}</p>
                  </div>
                  
                  {selectedApplication.salary_offered && (
                    <div>
                      <p className="text-sm text-gray-500">Salary Offered</p>
                      <p className="font-medium text-green-600">R{selectedApplication.salary_offered.toLocaleString()}</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-gray-500">Application ID</p>
                    <p className="font-medium text-xs text-gray-600">#{selectedApplication.id}</p>
                  </div>
                </div>

                {selectedApplication.interview_date && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <FiCalendar className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-900">Interview Scheduled</h3>
                    </div>
                    <p className="text-blue-800 mb-2">
                      {new Date(selectedApplication.interview_date).toLocaleDateString()} at{' '}
                      {new Date(selectedApplication.interview_date).toLocaleTimeString()}
                    </p>
                    
                    {selectedApplication.interview_location && (
                      <p className="text-sm text-blue-700 flex items-center">
                        <FiMapPin className="w-3 h-3 mr-1" />
                        {selectedApplication.interview_location}
                      </p>
                    )}
                  </div>
                )}

                {selectedApplication.notes && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {selectedApplication.notes}
                      </p>
                    </div>
                  </div>
                )}

                {selectedApplication.timeline && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Application Timeline</h3>
                    <div className="space-y-3">
                      {selectedApplication.timeline.map((event, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium text-gray-900">{event.title}</p>
                            <p className="text-sm text-gray-500">{event.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex space-x-3">
                {selectedApplication.contact_email && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 py-3 px-4 bg-green-100 text-green-700 rounded-lg font-medium flex items-center justify-center border border-green-200"
                  >
                    <FiMessageSquare className="w-4 h-4 mr-2" />
                    Contact
                  </motion.button>
                )}
                
                {selectedApplication.job_url && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.open(selectedApplication.job_url, '_blank')}
                    className="flex-1 py-3 px-4 bg-blue-100 text-blue-700 rounded-lg font-medium flex items-center justify-center border border-blue-200"
                  >
                    <FiExternalLink className="w-4 h-4 mr-2" />
                    View Job
                  </motion.button>
                )}
                
                {selectedApplication.status === 'pending' && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleWithdrawApplication(selectedApplication.id)}
                    className="flex-1 py-3 px-4 bg-red-100 text-red-700 rounded-lg font-medium flex items-center justify-center border border-red-200"
                  >
                    <FiX className="w-4 h-4 mr-2" />
                    Withdraw
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const EmptyState = () => (
    <div className="text-center py-12 px-4">
      <FiBriefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Yet</h3>
      <p className="text-gray-600 mb-6">
        Start applying to jobs to track your progress here
      </p>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => window.location.href = '/search'}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium"
      >
        Find Jobs
      </motion.button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">My Applications</h1>
            <p className="text-sm text-gray-600">{applications.length} total applications</p>
          </div>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-full bg-gray-100 text-gray-600"
          >
            <motion.div
              animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 1, repeat: refreshing ? Infinity : 0, ease: "linear" }}
            >
              <FiRefreshCw className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </div>
      </div>

      <StatusFilterBar />

      {/* Applications List */}
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
            />
          </div>
        ) : filteredApplications.length > 0 ? (
          <div className="space-y-3">
            {filteredApplications.map((application, index) => (
              <ApplicationCard key={application.id || index} application={application} />
            ))}
          </div>
        ) : selectedStatus === 'all' ? (
          <EmptyState />
        ) : (
          <div className="text-center py-12">
            <FiAlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No {selectedStatus} applications
            </h3>
            <p className="text-gray-600">
              Try selecting a different status filter
            </p>
          </div>
        )}
      </div>

      <ApplicationDetailModal />
    </div>
  );
};

export default MobileApplications;

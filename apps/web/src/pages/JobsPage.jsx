import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter, FaSort, FaSync, FaPlay, FaChartLine } from 'react-icons/fa';
import toast from 'react-hot-toast';
import JobCard from '../components/JobCard';
import { 
  fetchJobs, 
  triggerScraping, 
  getScrapingStatus, 
  subscribeToJobUpdates,
  getJobStats 
} from '../services/jobService';
import { canUserAccessFeature, getComingSoonMessage } from '../config/featureFlags';

const JobsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [jobStats, setJobStats] = useState({});
  const [scrapingStatus, setScrapingStatus] = useState(null);
  const [filters, setFilters] = useState({
    location: '',
    dateFilter: 'yesterday',
    hasContact: true,
    minSalary: null,
    jobType: null
  });

  const tabs = [
    { id: 'all', label: 'All', count: jobs.length },
    { id: 'for-you', label: 'For You', count: Math.floor(jobs.length * 0.6) },
    { id: 'saved', label: 'Saved', count: 2 },
    { id: 'applied', label: 'Applied', count: 5 }
  ];

  // Load jobs on component mount
  useEffect(() => {
    loadJobs();
    loadJobStats();
  }, [filters]);

  // Subscribe to real-time job updates
  useEffect(() => {
    const unsubscribe = subscribeToJobUpdates((update) => {
      if (update.type === 'new_jobs') {
        setJobs(prevJobs => [...prevJobs, ...update.jobs]);
        toast.success(`${update.jobs.length} new jobs found! `);
      } else if (update.type === 'scraping_progress') {
        setScrapingStatus(update.status);
      }
    });

    return unsubscribe;
  }, []);

  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchJobs({
        search: searchQuery,
        ...filters,
        limit: 20
      });
      
      setJobs(response.jobs || []);
      setJobStats(response.stats || {});
    } catch (error) {
      toast.error('Failed to load jobs. Please try again.');
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters]);

  const loadJobStats = useCallback(async () => {
    try {
      const stats = await getJobStats();
      setJobStats(stats);
    } catch (error) {
      console.error('Error loading job stats:', error);
    }
  }, []);

  const handleTriggerScraping = async () => {
    try {
      const result = await triggerScraping(searchQuery || 'jobs South Africa', {
        location: filters.location,
        dateFilter: filters.dateFilter
      });
      
      toast.success('Scraping started! New jobs will appear automatically.');
      setScrapingStatus('running');
      
      // Poll for status updates
      const statusInterval = setInterval(async () => {
        try {
          const status = await getScrapingStatus(result.operationId);
          setScrapingStatus(status.status);
          
          if (status.status === 'completed' || status.status === 'failed') {
            clearInterval(statusInterval);
            if (status.status === 'completed') {
              await loadJobs();
            }
          }
        } catch (error) {
          clearInterval(statusInterval);
        }
      }, 5000);
      
    } catch (error) {
      toast.error('Failed to start scraping. Please try again.');
    }
  };

  const handleJobClick = (job) => {
    navigate(`/jobs/${job.job_id}`);
  };

  const handleJobSave = (job) => {
    console.log('Job saved:', job);
  };

  const handleJobApply = (job) => {
    console.log('Applied to job:', job);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !searchQuery || 
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'for-you' && job.ai_match_score >= 80) ||
      (activeTab === 'saved' && job.is_saved) ||
      (activeTab === 'applied' && job.is_applied);
    
    return matchesSearch && matchesTab;
  });

  // Update tab counts
  const updatedTabs = [
    { id: 'all', label: 'All', count: jobs.length },
    { id: 'for-you', label: 'For You', count: jobs.filter(j => j.ai_match_score >= 80).length },
    { id: 'saved', label: 'Saved', count: jobs.filter(j => j.is_saved).length },
    { id: 'applied', label: 'Applied', count: jobs.filter(j => j.is_applied).length }
  ];

  // Check if user can access job search features
  const canAccessJobSearch = canUserAccessFeature('userFeatures.jobSearch');
  const comingSoonMessage = getComingSoonMessage('userFeatures.jobSearch');

  // If users can't access job search, show coming soon page
  if (!canAccessJobSearch) {
    return (
      <div className="min-h-screen px-4 py-6 pb-24 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto"
        >
          <button onClick={() => navigate(-1)} className="absolute top-6 left-6 text-neon-cyan text-2xl">←</button>
          
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-8xl mb-8"
          >
            
          </motion.div>
          
          <h1 className="text-3xl font-bold text-neon-cyan mb-4">Coming Soon!</h1>
          <p className="text-lg text-gray-300 mb-8">
            {comingSoonMessage}
          </p>
          
          <div className="bg-gray-800/50 p-6 rounded-lg border border-neon-cyan/30 mb-8">
            <h3 className="text-xl font-semibold text-neon-pink mb-3">What's Coming:</h3>
            <ul className="text-left space-y-2 text-gray-300">
              <li> AI-powered job search</li>
              <li> Instant job matching</li>
              <li> Quick apply system</li>
              <li> Personalized job alerts</li>
              <li> Career analytics</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-400 mb-4">
              Meanwhile, you can:
            </p>
            <div className="flex gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/profile')}
                className="bg-gradient-to-r from-neon-cyan to-neon-blue text-black px-6 py-2 rounded-full font-medium"
              >
                Setup Profile
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/pricing')}
                className="border border-neon-cyan text-neon-cyan px-6 py-2 rounded-full font-medium hover:bg-neon-cyan hover:text-black transition-all"
              >
                View Pricing
              </motion.button>
            </div>
          </div>
          
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-8 text-sm text-gray-500"
          >
            We're working hard to bring you the best job search experience!
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <button onClick={() => navigate(-1)} className="text-neon-cyan text-2xl">←</button>
        <div className="flex-1 text-center">
          <h1 className="text-2xl">Jobs</h1>
          {jobStats.totalWithContact && (
            <p className="text-sm text-gray-400">
              {jobStats.totalWithContact} jobs with contact info
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleTriggerScraping}
            disabled={scrapingStatus === 'running'}
            className="text-neon-green relative"
            title="Trigger fresh job scraping"
          >
            <FaPlay size={20} />
            {scrapingStatus === 'running' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="absolute -top-1 -right-1 w-3 h-3 border border-neon-green rounded-full border-t-transparent"
              />
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowFilters(!showFilters)}
            className="text-neon-cyan"
          >
            <FaFilter size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={loadJobs}
            className="text-neon-pink"
            title="Refresh jobs"
          >
            <FaSync size={20} />
          </motion.button>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="relative mb-6"
      >
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neon-cyan" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search jobs, skills, companies..."
          className="input-neon pl-12 w-full"
        />
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-4 mb-6 overflow-x-auto pb-2"
      >
        {tabs.map(tab => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 rounded-full whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-neon-cyan to-neon-blue text-black'
                : 'border border-gray-600 text-gray-400'
            }`}
          >
            {tab.label} ({tab.count})
          </motion.button>
        ))}
      </motion.div>

      {/* Job Cards */}
      <AnimatePresence>
        <div className="space-y-4">
          {loading && jobs.length === 0 ? (
            <div className="text-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-gray-400">Loading jobs...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No jobs found matching your criteria.</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTriggerScraping}
                className="bg-gradient-to-r from-neon-cyan to-neon-blue text-black px-6 py-3 rounded-full font-medium"
              >
                Find New Jobs
              </motion.button>
            </div>
          ) : (
            filteredJobs.map((job, index) => (
              <JobCard
                key={job.job_id || job.id || index}
                job={job}
                onJobClick={handleJobClick}
                onSave={handleJobSave}
                onApply={handleJobApply}
                priority={index < 3 && job.ai_match_score >= 90}
                className={index === 0 ? 'ring-1 ring-neon-cyan/30' : ''}
              />
            ))
          )}
        </div>
      </AnimatePresence>

      {/* Scraping Status */}
      {scrapingStatus && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-24 left-4 right-4 bg-gray-900/95 backdrop-blur-sm border border-neon-cyan/30 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {scrapingStatus === 'running' ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-neon-cyan border-t-transparent rounded-full"
                />
              ) : (
                <div className="w-4 h-4 bg-green-400 rounded-full" />
              )}
              <span className="text-sm text-gray-300">
                {scrapingStatus === 'running' ? 'Scraping for new jobs...' : 
                 scrapingStatus === 'completed' ? 'Scraping completed!' :
                 'Scraping failed'}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setScrapingStatus(null)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Load More */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="btn btn-neon-secondary w-full mt-8"
      >
        Load More Jobs
      </motion.button>

      {/* Filters Modal */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-end"
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 w-full rounded-t-3xl p-6 border-t-2 border-neon-cyan"
            >
              <h3 className="text-xl text-neon-cyan mb-6">Filters</h3>
              {/* Add filter options here */}
              <p className="text-gray-400">Filter options coming soon...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobsPage;

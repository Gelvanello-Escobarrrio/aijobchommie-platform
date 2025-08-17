import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiFilter, FiMapPin, FiDollarSign, FiClock,
  FiBriefcase, FiStar, FiBookmark, FiShare, FiX,
  FiChevronDown, FiTrendingUp, FiHeart, FiExternalLink
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const MobileJobSearch = () => {
  // IMPORTANT: Search is disabled for all users until 10k subscribers
  // Only curated recommendations are shown
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [filters, setFilters] = useState({
    jobType: '',
    salaryMin: '',
    salaryMax: '',
    experience: '',
    company: '',
    datePosted: ''
  });

  const searchRef = useRef(null);

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];
  const experienceLevels = ['Entry Level', '1-3 years', '3-5 years', '5+ years', 'Senior Level'];
  const dateOptions = ['Any time', 'Last 24 hours', 'Last 7 days', 'Last 30 days'];

  useEffect(() => {
    loadJobs();
  }, [currentPage]);

  useEffect(() => {
    applyFilters();
  }, [jobs, filters, searchQuery, location]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      // Load curated recommendations instead of search results
      const response = await fetch('/api/v1/jobs/recommendations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setJobs(data.data.jobs || []);
        setTotalPages(1); // Only one page of curated jobs
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
      toast.error('Failed to load job recommendations');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...jobs];

    if (searchQuery) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (location) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (filters.jobType) {
      filtered = filtered.filter(job => job.job_type === filters.jobType);
    }

    if (filters.salaryMin) {
      filtered = filtered.filter(job => job.salary_min >= parseInt(filters.salaryMin));
    }

    if (filters.salaryMax) {
      filtered = filtered.filter(job => job.salary_max <= parseInt(filters.salaryMax));
    }

    setFilteredJobs(filtered);
  };

  const handleSearch = () => {
    // Search disabled until 10k subscribers
    toast.error('Job search will be available after we reach 10,000 subscribers! 🚀');
  };

  const handleSaveJob = async (jobId) => {
    try {
      const response = await fetch(`/api/v1/jobs/${jobId}/save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setSavedJobs(prev => new Set([...prev, jobId]));
        toast.success('Job saved!');
      }
    } catch (error) {
      toast.error('Failed to save job');
    }
  };

  const handleApplyJob = async (jobId) => {
    try {
      const response = await fetch(`/api/v1/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast.success('Application submitted!');
      }
    } catch (error) {
      toast.error('Failed to submit application');
    }
  };

  const SearchBar = () => (
    <div className="bg-white p-4 shadow-sm">
      <div className="relative mb-3">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={searchRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search jobs, companies, keywords..."
          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>
      
      <div className="flex space-x-3">
        <div className="flex-1 relative">
          <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(true)}
          className="px-4 py-2.5 bg-gray-100 rounded-lg flex items-center"
        >
          <FiFilter className="w-4 h-4 text-gray-600" />
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSearch}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium"
        >
          Search
        </motion.button>
      </div>
    </div>
  );

  const JobCard = ({ job }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-3"
      onClick={() => setSelectedJob(job)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 mb-1">
            {job.title}
          </h3>
          <p className="text-blue-600 font-medium text-sm">{job.company}</p>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
            <FiStar className="w-3 h-3 text-yellow-500 mr-1" />
            <span className="text-xs font-medium text-yellow-700">
              {job.ai_match_score || 85}%
            </span>
          </div>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              handleSaveJob(job.id);
            }}
            className={`p-2 rounded-full ${
              savedJobs.has(job.id) ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <FiHeart className="w-4 h-4" fill={savedJobs.has(job.id) ? 'currentColor' : 'none'} />
          </motion.button>
        </div>
      </div>

      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
        <div className="flex items-center">
          <FiMapPin className="w-3 h-3 mr-1" />
          <span>{job.location}</span>
        </div>
        
        <div className="flex items-center">
          <FiClock className="w-3 h-3 mr-1" />
          <span>{job.posted_date || '2 days ago'}</span>
        </div>
        
        {job.salary_min && (
          <div className="flex items-center">
            <FiDollarSign className="w-3 h-3 mr-1" />
            <span>R{job.salary_min.toLocaleString()}+</span>
          </div>
        )}
      </div>

      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
        {job.description}
      </p>

      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
            {job.job_type || 'Full-time'}
          </span>
          
          {job.experience_level && (
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
              {job.experience_level}
            </span>
          )}
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            handleApplyJob(job.id);
          }}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg font-medium"
        >
          Apply Now
        </motion.button>
      </div>
    </motion.div>
  );

  const FiltersModal = () => (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end"
          onClick={() => setShowFilters(false)}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="bg-white w-full max-h-[80vh] rounded-t-2xl p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Filters</h2>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(false)}
                className="p-2 rounded-full bg-gray-100"
              >
                <FiX className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type
                </label>
                <select
                  value={filters.jobType}
                  onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">Any</option>
                  {jobTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level
                </label>
                <select
                  value={filters.experience}
                  onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">Any</option>
                  {experienceLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary Range (ZAR)
                </label>
                <div className="flex space-x-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.salaryMin}
                    onChange={(e) => setFilters({ ...filters, salaryMin: e.target.value })}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.salaryMax}
                    onChange={(e) => setFilters({ ...filters, salaryMax: e.target.value })}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Posted
                </label>
                <select
                  value={filters.datePosted}
                  onChange={(e) => setFilters({ ...filters, datePosted: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  {dateOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setFilters({
                      jobType: '',
                      salaryMin: '',
                      salaryMax: '',
                      experience: '',
                      company: '',
                      datePosted: ''
                    });
                  }}
                  className="flex-1 py-3 border border-gray-300 rounded-lg font-medium text-gray-700"
                >
                  Clear All
                </motion.button>
                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowFilters(false);
                    handleSearch();
                  }}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium"
                >
                  Apply Filters
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const JobDetailModal = () => (
    <AnimatePresence>
      {selectedJob && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end"
          onClick={() => setSelectedJob(null)}
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
                    {selectedJob.title}
                  </h2>
                  <p className="text-blue-600 font-medium">{selectedJob.company}</p>
                </div>
                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedJob(null)}
                  className="p-2 rounded-full bg-gray-100 ml-4"
                >
                  <FiX className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <FiMapPin className="w-4 h-4 mr-1" />
                  <span>{selectedJob.location}</span>
                </div>
                
                <div className="flex items-center">
                  <FiBriefcase className="w-4 h-4 mr-1" />
                  <span>{selectedJob.job_type || 'Full-time'}</span>
                </div>
                
                {selectedJob.salary_min && (
                  <div className="flex items-center">
                    <FiDollarSign className="w-4 h-4 mr-1" />
                    <span>R{selectedJob.salary_min.toLocaleString()}+</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center bg-yellow-50 px-3 py-2 rounded-full">
                  <FiStar className="w-4 h-4 text-yellow-500 mr-2" />
                  <span className="text-sm font-medium text-yellow-700">
                    {selectedJob.ai_match_score || 85}% Match
                  </span>
                </div>
                
                <span className="px-3 py-2 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                  {selectedJob.experience_level || 'All Levels'}
                </span>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[50vh]">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedJob.description}
                  </p>
                </div>

                {selectedJob.requirements && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {selectedJob.requirements}
                    </p>
                  </div>
                )}

                {selectedJob.benefits && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {selectedJob.benefits}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex space-x-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSaveJob(selectedJob.id)}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium flex items-center justify-center ${
                    savedJobs.has(selectedJob.id)
                      ? 'bg-red-100 text-red-600 border border-red-200'
                      : 'bg-white text-gray-700 border border-gray-200'
                  }`}
                >
                  <FiHeart className="w-4 h-4 mr-2" fill={savedJobs.has(selectedJob.id) ? 'currentColor' : 'none'} />
                  {savedJobs.has(selectedJob.id) ? 'Saved' : 'Save Job'}
                </motion.button>
                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleApplyJob(selectedJob.id)}
                  className="flex-2 py-3 px-6 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center"
                >
                  <FiExternalLink className="w-4 h-4 mr-2" />
                  Apply Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchBar />

      <div className="p-4">
        {/* Results Header */}
        <div className="mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-center mb-2">
              <FiStar className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-900">Curated Job Recommendations</span>
            </div>
            <p className="text-xs text-blue-700">
              These jobs are hand-picked by our AI based on your profile. Full search will be available after we reach 10,000 subscribers! 🚀
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                {filteredJobs.length} curated jobs available
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <FiTrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">Fresh jobs</span>
            </div>
          </div>
        </div>

        {/* Job Results */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
            />
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="space-y-3">
            {filteredJobs.map((job, index) => (
              <JobCard key={job.id || index} job={job} />
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2 mt-6">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
                  <motion.button
                    key={page}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      page === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-200'
                    }`}
                  >
                    {page}
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <FiBriefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearchQuery('');
                setLocation('');
                setFilters({
                  jobType: '',
                  salaryMin: '',
                  salaryMax: '',
                  experience: '',
                  company: '',
                  datePosted: ''
                });
                handleSearch();
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium"
            >
              Clear Search
            </motion.button>
          </div>
        )}
      </div>

      <FiltersModal />
      <JobDetailModal />
    </div>
  );
};

export default MobileJobSearch;

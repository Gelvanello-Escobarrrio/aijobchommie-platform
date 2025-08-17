import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Briefcase,
  Building,
  Clock,
  Star,
  Eye,
  BookmarkPlus,
  ExternalLink,
  TrendingUp,
  BarChart3,
  Users,
  Activity,
  Settings,
  Download,
  RefreshCw,
  AlertCircle,
  Crown,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

const ManagerJobSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    salary: { min: '', max: '' },
    experience: '',
    jobType: '',
    company: '',
    remote: false,
    postedDate: '7d'
  });
  const [sortBy, setSortBy] = useState('relevance');
  const [apiUsage, setApiUsage] = useState({ used: 0, limit: 250 });

  const experienceLevels = [
    { value: '', label: 'Any Experience' },
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'mid', label: 'Mid Level (3-5 years)' },
    { value: 'senior', label: 'Senior Level (6+ years)' },
    { value: 'executive', label: 'Executive Level' }
  ];

  const jobTypes = [
    { value: '', label: 'Any Type' },
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'internship', label: 'Internship' }
  ];

  const postedDateOptions = [
    { value: '1d', label: 'Past 24 hours' },
    { value: '3d', label: 'Past 3 days' },
    { value: '7d', label: 'Past week' },
    { value: '14d', label: 'Past 2 weeks' },
    { value: '30d', label: 'Past month' }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'date', label: 'Date Posted' },
    { value: 'salary', label: 'Salary (High to Low)' },
    { value: 'company', label: 'Company Name' }
  ];

  useEffect(() => {
    fetchApiUsage();
  }, []);

  const fetchApiUsage = async () => {
    try {
      const response = await fetch('/api/v1/admin/api-usage', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setApiUsage(data);
      }
    } catch (error) {
      console.error('Error fetching API usage:', error);
    }
  };

  const searchJobs = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    if (apiUsage.used >= apiUsage.limit) {
      toast.error('API limit reached for this month');
      return;
    }

    setLoading(true);
    
    try {
      const searchParams = new URLSearchParams({
        q: searchQuery,
        location: location,
        salary_min: filters.salary.min,
        salary_max: filters.salary.max,
        experience: filters.experience,
        job_type: filters.jobType,
        company: filters.company,
        remote: filters.remote.toString(),
        posted_date: filters.postedDate,
        sort_by: sortBy,
        limit: '20'
      });

      const response = await fetch(`/api/v1/admin/jobs/search?${searchParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || mockJobs);
        setApiUsage(prev => ({ ...prev, used: prev.used + 1 }));
        toast.success(`Found ${data.jobs?.length || 0} jobs`);
      } else {
        throw new Error('Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      setJobs(mockJobs);
      toast.error('Search failed, showing sample data');
    } finally {
      setLoading(false);
    }
  };

  // Mock job data for demonstration
  const mockJobs = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      salary: '$120k - $160k',
      type: 'Full Time',
      remote: true,
      posted: '2 days ago',
      description: 'Looking for an experienced React developer to join our growing team...',
      skills: ['React', 'TypeScript', 'Node.js'],
      logo: 'https://via.placeholder.com/48',
      applicants: 47,
      match: 95
    },
    {
      id: '2',
      title: 'Full Stack Engineer',
      company: 'StartupXYZ',
      location: 'Remote',
      salary: '$90k - $140k',
      type: 'Full Time',
      remote: true,
      posted: '1 week ago',
      description: 'Join our fast-growing startup and help build the next generation of...',
      skills: ['JavaScript', 'Python', 'AWS'],
      logo: 'https://via.placeholder.com/48',
      applicants: 32,
      match: 88
    },
    {
      id: '3',
      title: 'React Developer',
      company: 'BigTech Inc.',
      location: 'Seattle, WA',
      salary: '$100k - $150k',
      type: 'Full Time',
      remote: false,
      posted: '3 days ago',
      description: 'We are looking for a passionate React developer to work on...',
      skills: ['React', 'Redux', 'GraphQL'],
      logo: 'https://via.placeholder.com/48',
      applicants: 73,
      match: 92
    }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      salary: { min: '', max: '' },
      experience: '',
      jobType: '',
      company: '',
      remote: false,
      postedDate: '7d'
    });
  };

  const exportResults = () => {
    const dataStr = JSON.stringify(jobs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `job-search-results-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Search size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Advanced Job Search</h1>
              <p className="text-purple-100">Manager Dashboard - Full SerpAPI Access</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* API Usage Indicator */}
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Activity size={16} />
                <div>
                  <div className="text-sm font-medium">API Usage</div>
                  <div className="text-xs text-purple-200">
                    {apiUsage.used}/{apiUsage.limit} calls
                  </div>
                </div>
              </div>
              <div className="w-20 bg-white bg-opacity-20 rounded-full h-1 mt-2">
                <div 
                  className="bg-yellow-400 h-1 rounded-full"
                  style={{ width: `${(apiUsage.used / apiUsage.limit) * 100}%` }}
                />
              </div>
            </div>

            <button 
              onClick={fetchApiUsage}
              className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search jobs, companies, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl text-white placeholder-purple-200 border border-white border-opacity-20 focus:outline-none focus:border-opacity-40"
              onKeyPress={(e) => e.key === 'Enter' && searchJobs()}
            />
            <Search className="absolute left-4 top-3.5 text-purple-200" size={20} />
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-48 px-4 py-3 pl-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl text-white placeholder-purple-200 border border-white border-opacity-20 focus:outline-none focus:border-opacity-40"
              onKeyPress={(e) => e.key === 'Enter' && searchJobs()}
            />
            <MapPin className="absolute left-4 top-3.5 text-purple-200" size={20} />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={searchJobs}
            disabled={loading || apiUsage.used >= apiUsage.limit}
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white rounded-xl font-semibold flex items-center space-x-2 transition-colors"
          >
            {loading ? (
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Search size={20} />
            )}
            <span>{loading ? 'Searching...' : 'Search'}</span>
          </motion.button>
        </div>
      </div>

      <div className="flex">
        {/* Filters Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 p-6 space-y-6 max-h-screen overflow-y-auto">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 flex items-center">
              <Filter size={20} className="mr-2" />
              Filters
            </h2>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Clear All
            </button>
          </div>

          {/* Salary Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign size={16} className="inline mr-1" />
              Salary Range
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.salary.min}
                onChange={(e) => handleFilterChange('salary', { ...filters.salary, min: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.salary.max}
                onChange={(e) => handleFilterChange('salary', { ...filters.salary, max: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Briefcase size={16} className="inline mr-1" />
              Experience Level
            </label>
            <select
              value={filters.experience}
              onChange={(e) => handleFilterChange('experience', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {experienceLevels.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
          </div>

          {/* Job Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock size={16} className="inline mr-1" />
              Job Type
            </label>
            <select
              value={filters.jobType}
              onChange={(e) => handleFilterChange('jobType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {jobTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Remote Work */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="remote"
              checked={filters.remote}
              onChange={(e) => handleFilterChange('remote', e.target.checked)}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label htmlFor="remote" className="text-sm text-gray-700">Remote work only</label>
          </div>

          {/* Posted Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar size={16} className="inline mr-1" />
              Posted Date
            </label>
            <select
              value={filters.postedDate}
              onChange={(e) => handleFilterChange('postedDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {postedDateOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building size={16} className="inline mr-1" />
              Company
            </label>
            <input
              type="text"
              placeholder="e.g. Google, Microsoft"
              value={filters.company}
              onChange={(e) => handleFilterChange('company', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Search Results {jobs.length > 0 && `(${jobs.length})`}
              </h2>
              
              {/* Sort By */}
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {jobs.length > 0 && (
              <button
                onClick={exportResults}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
              >
                <Download size={16} />
                <span>Export Results</span>
              </button>
            )}
          </div>

          {/* Warning for Regular Users */}
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800">Manager Dashboard Only</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  This advanced search uses the SerpAPI and is only available to managers. 
                  Regular users see curated recommendations until we reach 10,000 subscribers.
                </p>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-600">Searching jobs...</p>
            </div>
          )}

          {/* Results */}
          {!loading && (
            <div className="space-y-4">
              {jobs.length === 0 && searchQuery && (
                <div className="text-center py-12">
                  <Search size={48} className="text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria</p>
                </div>
              )}

              {jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Building size={24} className="text-gray-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900 hover:text-purple-600 cursor-pointer">
                              {job.title}
                            </h3>
                            <p className="text-gray-600 font-medium">{job.company}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                              <span className="flex items-center">
                                <MapPin size={14} className="mr-1" />
                                {job.location}
                              </span>
                              <span className="flex items-center">
                                <DollarSign size={14} className="mr-1" />
                                {job.salary}
                              </span>
                              <span className="flex items-center">
                                <Clock size={14} className="mr-1" />
                                {job.posted}
                              </span>
                              {job.remote && (
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                  Remote
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="flex items-center text-sm text-gray-500">
                          <Users size={14} className="mr-1" />
                          {job.applicants} applicants
                        </div>
                        <div className="flex items-center text-sm text-green-600 font-medium">
                          <Star size={14} className="mr-1 fill-current" />
                          {job.match}% match
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <BookmarkPlus size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <ExternalLink size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerJobSearch;

/**
 * 🔍 JOB SEARCH COMPONENT
 * 
 * Advanced job search with filters and AI recommendations
 * Responsive design for South African job market
 */

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Star, Zap, Clock, DollarSign, ArrowUpDown } from 'lucide-react';
import { useJobs, useJobSearch, useAIRecommendations, type JobSearchFilters } from '../contexts/JobContext';
import JobCard from './JobCard';
import LoadingSpinner from './LoadingSpinner';

// South African provinces
const SA_PROVINCES = [
  'Western Cape',
  'Gauteng',
  'KwaZulu-Natal',
  'Eastern Cape',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Free State',
  'Northern Cape'
];

// Job categories
const JOB_CATEGORIES = [
  'Technology & IT',
  'Finance & Banking',
  'Healthcare & Medical',
  'Engineering',
  'Marketing & Sales',
  'Education & Training',
  'Manufacturing',
  'Construction',
  'Retail & FMCG',
  'Hospitality & Tourism',
  'Legal & Professional Services',
  'Government & NGO',
  'Mining & Resources',
  'Agriculture & Farming'
];

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Graduate Programme'];
const EXPERIENCE_LEVELS = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'];
const SALARY_RANGES = [
  { label: 'Any', min: 0, max: 0 },
  { label: 'R10k - R20k', min: 10000, max: 20000 },
  { label: 'R20k - R35k', min: 20000, max: 35000 },
  { label: 'R35k - R50k', min: 35000, max: 50000 },
  { label: 'R50k+', min: 50000, max: 1000000 }
];

const JobSearch: React.FC = () => {
  const { searchFilters, setSearchFilters, isSearching } = useJobs();
  const [localFilters, setLocalFilters] = useState<JobSearchFilters>(searchFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);

  // Job search query
  const { data: jobs = [], isLoading, error, refetch } = useJobSearch(searchFilters);
  
  // AI recommendations query
  const { data: recommendations = [], isLoading: isLoadingAI } = useAIRecommendations();

  // Update local filters when context filters change
  useEffect(() => {
    setLocalFilters(searchFilters);
  }, [searchFilters]);

  // Handle search
  const handleSearch = () => {
    setSearchFilters(localFilters);
  };

  // Handle filter change
  const handleFilterChange = (key: keyof JobSearchFilters, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    const clearedFilters = { search: localFilters.search || '' };
    setLocalFilters(clearedFilters);
    setSearchFilters(clearedFilters);
  };

  // Handle sort change
  const handleSortChange = (sortBy: string) => {
    const newOrder = localFilters.sortBy === sortBy && localFilters.sortOrder === 'desc' ? 'asc' : 'desc';
    const newFilters = { ...localFilters, sortBy, sortOrder: newOrder };
    setLocalFilters(newFilters);
    setSearchFilters(newFilters);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Find Your Dream Job in South Africa
        </h1>
        <p className="text-xl text-gray-600">
          Discover opportunities across all provinces with AI-powered matching
        </p>
      </div>

      {/* Main Search Bar */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Job title, company, or keywords..."
              value={localFilters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Location Filter */}
          <div className="relative min-w-[200px]">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={localFilters.province || ''}
              onChange={(e) => handleFilterChange('province', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">All Provinces</option>
              {SA_PROVINCES.map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSearching ? <LoadingSpinner size="sm" /> : <Search className="h-5 w-5" />}
            Search
          </button>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Filter className="h-5 w-5" />
            Filters
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={localFilters.category || ''}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {JOB_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                <select
                  value={localFilters.jobType || ''}
                  onChange={(e) => handleFilterChange('jobType', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  {JOB_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                <select
                  value={localFilters.experienceLevel || ''}
                  onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Levels</option>
                  {EXPERIENCE_LEVELS.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Salary Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                <select
                  onChange={(e) => {
                    const range = SALARY_RANGES[parseInt(e.target.value)];
                    if (range) {
                      handleFilterChange('salaryMin', range.min || undefined);
                      handleFilterChange('salaryMax', range.max || undefined);
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  {SALARY_RANGES.map((range, index) => (
                    <option key={index} value={index}>{range.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="mt-4 flex flex-wrap gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={localFilters.remote || false}
                  onChange={(e) => handleFilterChange('remote', e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="text-sm">Remote Work</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={localFilters.urgent || false}
                  onChange={(e) => handleFilterChange('urgent', e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="text-sm">Urgent Hiring</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={localFilters.featured || false}
                  onChange={(e) => handleFilterChange('featured', e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="text-sm">Featured Jobs</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={localFilters.noExperience || false}
                  onChange={(e) => handleFilterChange('noExperience', e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="text-sm">No Experience Required</span>
              </label>
            </div>

            {/* Filter Actions */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Apply Filters
              </button>
              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* AI Recommendations Toggle */}
      {recommendations.length > 0 && (
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowAIRecommendations(!showAIRecommendations)}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
          >
            <Star className="h-5 w-5" />
            {showAIRecommendations ? 'Hide' : 'Show'} AI Recommendations ({recommendations.length})
          </button>
        </div>
      )}

      {/* AI Recommendations */}
      {showAIRecommendations && recommendations.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-bold text-purple-900">AI Recommended for You</h2>
          </div>
          <div className="grid gap-4">
            {recommendations.slice(0, 3).map((recommendation) => (
              <div key={recommendation.jobId} className="bg-white rounded-lg p-4 border border-purple-200">
                <div className="flex justify-between items-start mb-2">
                  <JobCard job={recommendation.job} showMatchScore={true} matchScore={recommendation.matchScore} />
                </div>
                {recommendation.aiInsights && (
                  <p className="text-sm text-purple-700 mt-2 italic">
                    💡 {recommendation.aiInsights}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {jobs.length > 0 ? `${jobs.length} Jobs Found` : 'Search for Jobs'}
          </h2>
          {searchFilters.search && (
            <p className="text-gray-600">
              Results for "{searchFilters.search}"
              {searchFilters.province && ` in ${searchFilters.province}`}
            </p>
          )}
        </div>

        {/* Sort Options */}
        {jobs.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <button
              onClick={() => handleSortChange('postedAt')}
              className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Clock className="h-4 w-4" />
              Date
              <ArrowUpDown className="h-3 w-3" />
            </button>
            <button
              onClick={() => handleSortChange('salaryMax')}
              className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <DollarSign className="h-4 w-4" />
              Salary
              <ArrowUpDown className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {(isLoading || isSearching) && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-800">
            Failed to load jobs. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Job Results */}
      {jobs.length > 0 && !isLoading && (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {/* No Results */}
      {jobs.length === 0 && !isLoading && !error && searchFilters.search && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria or browse all available positions
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            View All Jobs
          </button>
        </div>
      )}
    </div>
  );
};

export default JobSearch;

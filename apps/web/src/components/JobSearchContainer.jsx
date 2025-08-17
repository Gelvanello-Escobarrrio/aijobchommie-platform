import React, { useState, useEffect } from 'react';
import PremiumGate from './PremiumGate';
import SubscriptionService from '../services/SubscriptionService';
import SouthAfricanSlangService from '../services/SouthAfricanSlangService';
import './JobSearchContainer.css';

/**
 * 🔍 JOB SEARCH CONTAINER - PREMIUM GATED IMPLEMENTATION
 * Integrates job search with subscription service and SA slang support
 */

const JobSearchContainer = () => {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState({
    jobType: 'all',
    experienceLevel: 'all',
    salaryRange: 'all',
    industry: 'all'
  });
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchStats, setSearchStats] = useState({ totalJobs: 0, apiCallsUsed: 0 });

  useEffect(() => {
    loadRecentSearches();
    loadSearchSuggestions();
  }, []);

  const loadRecentSearches = () => {
    const recent = JSON.parse(localStorage.getItem('recent_job_searches') || '[]');
    setRecentSearches(recent.slice(0, 5));
  };

  const saveSearch = (query, location) => {
    if (!query.trim()) return;
    
    const searchItem = {
      query: query.trim(),
      location: location.trim(),
      timestamp: new Date().toISOString(),
      id: Date.now()
    };

    const recent = JSON.parse(localStorage.getItem('recent_job_searches') || '[]');
    const updated = [searchItem, ...recent.filter(item => 
      item.query !== searchItem.query || item.location !== searchItem.location
    )].slice(0, 10);
    
    localStorage.setItem('recent_job_searches', JSON.stringify(updated));
    setRecentSearches(updated.slice(0, 5));
  };

  const loadSearchSuggestions = () => {
    const popularJobs = SouthAfricanSlangService.getJobSearchTerms?.() || [
      'Software Developer', 'Data Analyst', 'Marketing Manager', 'Sales Representative',
      'Accountant', 'Project Manager', 'Customer Service', 'HR Coordinator',
      'Graphic Designer', 'Business Analyst', 'Operations Manager', 'IT Support'
    ];
    
    setSuggestions(popularJobs.slice(0, 8));
  };

  const handleSearch = async (query = searchQuery, location = searchLocation) => {
    if (!query.trim()) {
      alert('Please enter a job title or keyword');
      return;
    }

    // Check if user has search access
    const hasAccess = SubscriptionService.hasFeatureAccess('job_search_features', 'basic_job_search');
    if (!hasAccess) {
      // PremiumGate will handle this case
      return;
    }

    setIsSearching(true);
    saveSearch(query, location);

    try {
      // Track API usage
      SubscriptionService.trackApiUsage('job_search', 1);

      // Simulate API call (replace with actual SerAPI integration)
      const mockResults = await simulateJobSearch(query, location);
      setJobs(mockResults);
      setSearchStats(prev => ({
        totalJobs: mockResults.length,
        apiCallsUsed: prev.apiCallsUsed + 1
      }));

    } catch (error) {
      console.error('Job search failed:', error);
      alert('Search failed. Please check your connection and try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const simulateJobSearch = async (query, location) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock job results with South African context
    const mockJobs = [
      {
        id: 1,
        title: `${query} - Cape Town`,
        company: 'TechCorp SA',
        location: location || 'Cape Town, Western Cape',
        salary: 'R25,000 - R35,000 per month',
        type: 'Full-time',
        posted: '2 days ago',
        description: `Looking for a skilled ${query} to join our dynamic team in Cape Town. Must have experience with modern technologies.`,
        requirements: ['3+ years experience', 'South African citizen', 'Valid work permit'],
        benefits: ['Medical aid', 'Pension fund', 'Flexible hours', '13th cheque']
      },
      {
        id: 2,
        title: `Senior ${query} - Johannesburg`,
        company: 'InnovateSA',
        location: location || 'Johannesburg, Gauteng',
        salary: 'R35,000 - R50,000 per month',
        type: 'Full-time',
        posted: '1 week ago',
        description: `Senior ${query} position available at leading SA company. Great growth opportunities.`,
        requirements: ['5+ years experience', 'Degree/Diploma', 'Leadership skills'],
        benefits: ['Medical aid', 'Car allowance', 'Bonus structure', 'Training budget']
      },
      {
        id: 3,
        title: `Junior ${query} - Durban`,
        company: 'StartupKZN',
        location: location || 'Durban, KwaZulu-Natal',
        salary: 'R18,000 - R25,000 per month',
        type: 'Full-time',
        posted: '3 days ago',
        description: `Entry-level ${query} position perfect for recent graduates. Mentorship provided.`,
        requirements: ['Recent graduate', 'Willingness to learn', 'Good communication'],
        benefits: ['Medical aid', 'Learning opportunities', 'Modern office', 'Team events']
      }
    ];

    // Filter based on current filters
    return mockJobs.filter(job => {
      if (filters.jobType !== 'all' && !job.type.toLowerCase().includes(filters.jobType)) {
        return false;
      }
      return true;
    });
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchLocation('');
    setJobs([]);
  };

  const getSalaryIcon = (salary) => {
    if (salary.includes('50,000')) return '💰';
    if (salary.includes('35,000')) return '💎';
    if (salary.includes('25,000')) return '💵';
    return '💴';
  };

  const getLocationEmoji = (location) => {
    if (location.includes('Cape Town')) return '🏔️';
    if (location.includes('Johannesburg')) return '🏙️';
    if (location.includes('Durban')) return '🏖️';
    if (location.includes('Pretoria')) return '🏛️';
    return '📍';
  };

  // Premium gate for job search features
  const JobSearchFeature = ({ children }) => (
    <PremiumGate
      feature="basic_job_search"
      category="job_search_features"
      showProgress={true}
      className="job-search-gate"
    >
      {children}
    </PremiumGate>
  );

  return (
    <div className="job-search-container">
      {/* Search Header */}
      <div className="search-header">
        <div className="header-content">
          <h1 className="search-title">
            <span className="title-icon">🔍</span>
            Find Your Dream Job in SA
          </h1>
          <p className="search-subtitle">
            Discover opportunities across South Africa with AI-powered matching
          </p>
        </div>

        {/* Progress Banner */}
        <div className="progress-banner">
          <div className="banner-content">
            <span className="banner-icon">🎯</span>
            <div className="banner-text">
              <span className="banner-title">Community Goal</span>
              <span className="banner-subtitle">
                {SubscriptionService.getSubscriberProgress().message}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Search Interface */}
      <JobSearchFeature>
        <div className="search-interface">
          {/* Search Form */}
          <div className="search-form">
            <div className="search-inputs">
              <div className="input-group">
                <div className="input-wrapper">
                  <span className="input-icon">💼</span>
                  <input
                    type="text"
                    placeholder="Job title, skills, or company (e.g., Software Developer)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="search-input"
                    disabled={isSearching}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="clear-btn"
                      type="button"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <span className="input-icon">📍</span>
                  <input
                    type="text"
                    placeholder="City or province (e.g., Cape Town, Gauteng)"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="search-input"
                    disabled={isSearching}
                  />
                  {searchLocation && (
                    <button
                      onClick={() => setSearchLocation('')}
                      className="clear-btn"
                      type="button"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="search-actions">
              <button
                onClick={() => handleSearch()}
                disabled={isSearching || !searchQuery.trim()}
                className="search-btn primary"
              >
                {isSearching ? (
                  <>
                    <div className="btn-spinner"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🔍</span>
                    Search Jobs
                  </>
                )}
              </button>

              {(searchQuery || searchLocation || jobs.length > 0) && (
                <button
                  onClick={clearSearch}
                  className="search-btn secondary"
                  disabled={isSearching}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick Search Suggestions */}
          {!searchQuery && suggestions.length > 0 && (
            <div className="quick-suggestions">
              <h3 className="suggestions-title">
                <span className="title-icon">⚡</span>
                Popular Searches
              </h3>
              <div className="suggestions-grid">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(suggestion)}
                    className="suggestion-chip"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recent Searches */}
          {!searchQuery && recentSearches.length > 0 && (
            <div className="recent-searches">
              <h3 className="recent-title">
                <span className="title-icon">🕒</span>
                Recent Searches
              </h3>
              <div className="recent-list">
                {recentSearches.map((search) => (
                  <button
                    key={search.id}
                    onClick={() => {
                      setSearchQuery(search.query);
                      setSearchLocation(search.location);
                    }}
                    className="recent-item"
                  >
                    <div className="recent-content">
                      <span className="recent-query">{search.query}</span>
                      {search.location && (
                        <span className="recent-location">in {search.location}</span>
                      )}
                    </div>
                    <span className="recent-time">
                      {new Date(search.timestamp).toLocaleDateString('en-ZA')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {jobs.length > 0 && (
            <div className="search-results">
              <div className="results-header">
                <h2 className="results-title">
                  <span className="title-icon">📋</span>
                  Found {jobs.length} Job{jobs.length !== 1 ? 's' : ''}
                </h2>
                <div className="results-stats">
                  <span className="stats-item">
                    <span className="stats-icon">🎯</span>
                    {searchQuery} jobs
                  </span>
                  {searchLocation && (
                    <span className="stats-item">
                      <span className="stats-icon">📍</span>
                      in {searchLocation}
                    </span>
                  )}
                </div>
              </div>

              <div className="jobs-list">
                {jobs.map((job) => (
                  <div key={job.id} className="job-card">
                    <div className="job-header">
                      <div className="job-title-section">
                        <h3 className="job-title">{job.title}</h3>
                        <div className="job-meta">
                          <span className="job-company">
                            <span className="meta-icon">🏢</span>
                            {job.company}
                          </span>
                          <span className="job-location">
                            <span className="meta-icon">{getLocationEmoji(job.location)}</span>
                            {job.location}
                          </span>
                          <span className="job-type">
                            <span className="meta-icon">⏰</span>
                            {job.type}
                          </span>
                        </div>
                      </div>
                      <div className="job-salary">
                        <span className="salary-icon">{getSalaryIcon(job.salary)}</span>
                        <span className="salary-text">{job.salary}</span>
                      </div>
                    </div>

                    <div className="job-body">
                      <p className="job-description">{job.description}</p>
                      
                      <div className="job-details">
                        <div className="job-requirements">
                          <h4>Requirements:</h4>
                          <ul>
                            {job.requirements.map((req, index) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="job-benefits">
                          <h4>Benefits:</h4>
                          <div className="benefits-tags">
                            {job.benefits.map((benefit, index) => (
                              <span key={index} className="benefit-tag">
                                {benefit}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="job-footer">
                      <div className="job-posted">
                        <span className="posted-icon">📅</span>
                        <span>Posted {job.posted}</span>
                      </div>
                      
                      <div className="job-actions">
                        <button className="job-btn primary">
                          <span className="btn-icon">💼</span>
                          Apply Now
                        </button>
                        <button className="job-btn secondary">
                          <span className="btn-icon">❤️</span>
                          Save
                        </button>
                        <button className="job-btn secondary">
                          <span className="btn-icon">📤</span>
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More */}
              <div className="load-more-section">
                <button className="load-more-btn" disabled>
                  <span className="btn-icon">⬇️</span>
                  Load More Jobs (Coming Soon)
                </button>
                <p className="load-more-note">
                  More advanced search features available with Premium
                </p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {searchQuery && !isSearching && jobs.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3 className="empty-title">No Jobs Found</h3>
              <p className="empty-message">
                Try adjusting your search terms or location to find more opportunities.
              </p>
              <div className="empty-suggestions">
                <p>Try searching for:</p>
                <div className="empty-suggestions-list">
                  {suggestions.slice(0, 4).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(suggestion)}
                      className="suggestion-chip small"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </JobSearchFeature>

      {/* Search Tips */}
      <div className="search-tips">
        <h3 className="tips-title">
          <span className="title-icon">💡</span>
          Search Tips for SA Job Market
        </h3>
        <div className="tips-grid">
          <div className="tip-item">
            <span className="tip-icon">🎯</span>
            <div className="tip-content">
              <h4>Be Specific</h4>
              <p>Use exact job titles like "Business Analyst" or "Software Developer"</p>
            </div>
          </div>
          <div className="tip-item">
            <span className="tip-icon">📍</span>
            <div className="tip-content">
              <h4>Location Matters</h4>
              <p>Include city or province for better targeted results</p>
            </div>
          </div>
          <div className="tip-item">
            <span className="tip-icon">🔄</span>
            <div className="tip-content">
              <h4>Try Variations</h4>
              <p>Search for both "IT Support" and "Technical Support"</p>
            </div>
          </div>
          <div className="tip-item">
            <span className="tip-icon">⏰</span>
            <div className="tip-content">
              <h4>Check Regularly</h4>
              <p>New jobs are posted daily - save your searches</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearchContainer;

/**
 * 🔍 JOB SEARCH PAGE
 * 
 * Main job search page with integrated search functionality
 */

import React from 'react';
import JobSearch from '../components/JobSearch';

const JobSearchPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <JobSearch />
    </div>
  );
};

export default JobSearchPage;

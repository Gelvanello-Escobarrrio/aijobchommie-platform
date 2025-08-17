/**
 * 💼 JOB CARD COMPONENT
 * 
 * Individual job listing card with South African context
 * Includes salary in ZAR, location, and key job details
 */

import React from 'react';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Zap, 
  Building, 
  User,
  Calendar,
  ExternalLink,
  Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Job } from '../contexts/JobContext';
import { formatDistanceToNow } from 'date-fns';

interface JobCardProps {
  job: Job;
  showMatchScore?: boolean;
  matchScore?: number;
}

const JobCard: React.FC<JobCardProps> = ({ job, showMatchScore = false, matchScore }) => {
  const navigate = useNavigate();

  // Format salary range in ZAR
  const formatSalary = () => {
    if (!job.salaryMin && !job.salaryMax) return 'Salary not disclosed';
    
    const formatAmount = (amount: number) => {
      if (amount >= 1000000) {
        return `R${(amount / 1000000).toFixed(1)}M`;
      } else if (amount >= 1000) {
        return `R${(amount / 1000).toFixed(0)}K`;
      } else {
        return `R${amount}`;
      }
    };

    if (job.salaryMin && job.salaryMax) {
      return `${formatAmount(job.salaryMin)} - ${formatAmount(job.salaryMax)} ${job.salaryPeriod}`;
    } else if (job.salaryMin) {
      return `From ${formatAmount(job.salaryMin)} ${job.salaryPeriod}`;
    } else if (job.salaryMax) {
      return `Up to ${formatAmount(job.salaryMax)} ${job.salaryPeriod}`;
    }
  };

  // Format time ago
  const getTimeAgo = () => {
    try {
      return formatDistanceToNow(new Date(job.postedAt), { addSuffix: true });
    } catch {
      return 'Recently posted';
    }
  };

  // Handle card click
  const handleCardClick = () => {
    navigate(`/jobs/${job.id}`);
  };

  // Handle company click
  const handleCompanyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/companies/${job.company.toLowerCase().replace(/\s+/g, '-')}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer p-6 relative"
    >
      {/* Featured/Urgent badges */}
      <div className="absolute top-4 right-4 flex gap-2">
        {job.isFeatured && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
            <Star className="h-3 w-3" />
            Featured
          </span>
        )}
        {job.isUrgent && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
            <Zap className="h-3 w-3" />
            Urgent
          </span>
        )}
        {job.isRemote && (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            Remote
          </span>
        )}
      </div>

      {/* Match Score */}
      {showMatchScore && matchScore && (
        <div className="absolute top-4 left-4">
          <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
            <Star className="h-3 w-3 fill-current" />
            {Math.round(matchScore)}% match
          </div>
        </div>
      )}

      {/* Company Logo & Info */}
      <div className="flex items-start gap-4 mb-4">
        {/* Logo placeholder */}
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
          {job.companyLogo ? (
            <img 
              src={job.companyLogo} 
              alt={`${job.company} logo`}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <Building className="h-6 w-6 text-gray-400" />
          )}
        </div>

        {/* Job Title & Company */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors">
            {job.title}
          </h3>
          <button
            onClick={handleCompanyClick}
            className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
          >
            {job.company}
            {job.isVerified && <span className="ml-1 text-blue-500">✓</span>}
          </button>
        </div>
      </div>

      {/* Job Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm text-gray-600">
        {/* Location */}
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span>{job.city}, {job.province}</span>
        </div>

        {/* Job Type */}
        <div className="flex items-center gap-1">
          <User className="h-4 w-4 text-gray-400" />
          <span>{job.jobType}</span>
        </div>

        {/* Experience Level */}
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span>{job.experienceLevel}</span>
        </div>

        {/* Posted Time */}
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-gray-400" />
          <span>{getTimeAgo()}</span>
        </div>
      </div>

      {/* Salary */}
      {(job.salaryMin || job.salaryMax) && (
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-4 w-4 text-green-600" />
          <span className="text-green-600 font-semibold">{formatSalary()}</span>
        </div>
      )}

      {/* Job Description Preview */}
      <p className="text-gray-700 text-sm mb-4 line-clamp-2">
        {job.description.length > 150 
          ? `${job.description.substring(0, 150)}...`
          : job.description
        }
      </p>

      {/* Skills/Requirements Tags */}
      {job.requirements && job.requirements.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {job.requirements.slice(0, 3).map((req, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
              >
                {req}
              </span>
            ))}
            {job.requirements.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{job.requirements.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Benefits Preview */}
      {job.benefits && job.benefits.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {job.benefits.slice(0, 2).map((benefit, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full"
              >
                {benefit}
              </span>
            ))}
            {job.benefits.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{job.benefits.length - 2} benefits
              </span>
            )}
          </div>
        </div>
      )}

      {/* Special Indicators */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          {job.noExperienceRequired && (
            <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
              No Experience Required
            </span>
          )}
          {job.isImmediateStart && (
            <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded-full">
              Immediate Start
            </span>
          )}
        </div>

        {/* View Count & Application Count */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>{job.viewCount} views</span>
          <span>{job.applicationCount} applications</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <button
          onClick={handleCardClick}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          View Details
          <ExternalLink className="h-3 w-3" />
        </button>

        <div className="flex gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Add save job functionality
            }}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Save job"
          >
            <Heart className="h-4 w-4" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/jobs/${job.id}/apply`);
            }}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;

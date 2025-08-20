/**
 *  JOB DETAILS PAGE
 * 
 * Complete job details view with application functionality
 * South African job market focused with local context
 */

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Building, 
  User, 
  Calendar, 
  Star, 
  Zap,
  CheckCircle,
  ArrowLeft,
  ExternalLink,
  Share2,
  Bookmark,
  AlertCircle,
  Eye,
  Users
} from 'lucide-react';
import { useJob } from '../contexts/JobContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDistanceToNow } from 'date-fns';

const JobDetails: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  
  const { data: job, isLoading, error } = useJob(jobId || '');

  // Update view count when job loads
  useEffect(() => {
    if (job) {
      // TODO: Track job view
      console.log(`Viewed job: ${job.id}`);
    }
  }, [job]);

  // Format salary range
  const formatSalary = (job: any) => {
    if (!job.salaryMin && !job.salaryMax) return null;
    
    const formatAmount = (amount: number) => {
      if (amount >= 1000000) {
        return `R${(amount / 1000000).toFixed(1)}M`;
      } else if (amount >= 1000) {
        return `R${(amount / 1000).toFixed(0)}K`;
      } else {
        return `R${amount.toLocaleString()}`;
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

  // Format posted time
  const getTimeAgo = (date: Date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return 'Recently posted';
    }
  };

  // Handle apply button
  const handleApply = () => {
    navigate(`/jobs/${jobId}/apply`);
  };

  // Handle share
  const handleShare = async () => {
    if (navigator.share && job) {
      try {
        await navigator.share({
          title: `${job.title} at ${job.company}`,
          text: `Check out this job opportunity: ${job.title} at ${job.company} in ${job.city}, ${job.province}`,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        alert('Job link copied to clipboard!');
      }
    } else if (job) {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Job link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" text="Loading job details..." />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h1>
          <p className="text-gray-600 mb-4">
            The job you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/jobs')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse All Jobs
          </button>
        </div>
      </div>
    );
  }

  const salary = formatSalary(job);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto p-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg flex items-center gap-2 text-gray-600"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Jobs
            </button>
          </div>

          {/* Job Header */}
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            {/* Company Logo */}
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              {job.companyLogo ? (
                <img 
                  src={job.companyLogo} 
                  alt={`${job.company} logo`}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Building className="h-8 w-8 text-gray-400" />
              )}
            </div>

            {/* Job Title & Details */}
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                {job.isFeatured && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                    <Star className="h-3 w-3" />
                    Featured
                  </span>
                )}
                {job.isUrgent && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                    <Zap className="h-3 w-3" />
                    Urgent Hiring
                  </span>
                )}
                {job.isRemote && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Remote Work Available
                  </span>
                )}
                {job.noExperienceRequired && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                    No Experience Required
                  </span>
                )}
                {job.isVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    <CheckCircle className="h-3 w-3" />
                    Verified Company
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <h2 className="text-xl text-gray-600 mb-4 flex items-center gap-2">
                {job.company}
                {job.isVerified && <CheckCircle className="h-5 w-5 text-blue-500" />}
              </h2>

              {/* Key Details */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{job.city}, {job.province}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>{job.jobType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{job.experienceLevel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{getTimeAgo(job.postedAt)}</span>
                </div>
              </div>

              {/* Salary */}
              {salary && (
                <div className="flex items-center gap-2 mt-4">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span className="text-lg font-semibold text-green-600">{salary}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 lg:flex-shrink-0">
              <button
                onClick={handleApply}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2"
              >
                Apply Now
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
                  title="Share job"
                >
                  <Share2 className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={() => {
                    // TODO: Add save job functionality
                  }}
                  className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
                  title="Save job"
                >
                  <Bookmark className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-100 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{job.viewCount} views</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{job.applicationCount} applications</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Description */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Job Description</h3>
              <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                {job.description}
              </div>
            </div>

            {/* Key Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Key Responsibilities</h3>
                <ul className="space-y-2">
                  {job.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Requirements</h3>
                <ul className="space-y-2">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Benefits & Perks</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {job.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">About the Company</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900">{job.company}</h4>
                  {job.isVerified && (
                    <span className="text-sm text-blue-600 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Verified Employer
                    </span>
                  )}
                </div>
                
                <div className="text-sm text-gray-600">
                  <p><strong>Industry:</strong> {job.category}</p>
                  <p><strong>Location:</strong> {job.address || `${job.city}, ${job.province}`}</p>
                </div>
              </div>

              {/* Contact Information */}
              {(job.contactEmail || job.contactPhone) && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-2">Contact</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    {job.contactEmail && (
                      <div>
                        <strong>Email:</strong> {job.contactEmail}
                      </div>
                    )}
                    {job.contactPhone && (
                      <div>
                        <strong>Phone:</strong> {job.contactPhone}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Job Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Job Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Job Type:</span>
                  <span className="ml-2 text-gray-600">{job.jobType}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Experience Level:</span>
                  <span className="ml-2 text-gray-600">{job.experienceLevel}</span>
                </div>
                {job.educationLevel && (
                  <div>
                    <span className="font-medium text-gray-700">Education:</span>
                    <span className="ml-2 text-gray-600">{job.educationLevel}</span>
                  </div>
                )}
                {job.workingHours && (
                  <div>
                    <span className="font-medium text-gray-700">Working Hours:</span>
                    <span className="ml-2 text-gray-600">{job.workingHours}</span>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-700">Posted:</span>
                  <span className="ml-2 text-gray-600">{getTimeAgo(job.postedAt)}</span>
                </div>
                {job.expiresAt && (
                  <div>
                    <span className="font-medium text-gray-700">Expires:</span>
                    <span className="ml-2 text-gray-600">
                      {formatDistanceToNow(new Date(job.expiresAt), { addSuffix: true })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Apply Section */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-2">Ready to Apply?</h3>
              <p className="text-blue-700 text-sm mb-4">
                Don't miss out on this opportunity. Apply now and take the next step in your career.
              </p>
              <button
                onClick={handleApply}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                Apply for this Job
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;

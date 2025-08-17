/**
 * 📝 JOB APPLICATION FORM
 * 
 * Complete job application form with file uploads
 * South African context with local phone number formatting
 */

import React, { useState } from 'react';
import { 
  Upload, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Send,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useApplyToJob, useJob } from '../contexts/JobContext';
import LoadingSpinner from './LoadingSpinner';
import toast from 'react-hot-toast';

interface JobApplicationFormProps {
  jobId: string;
  onSuccess?: () => void;
}

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({ 
  jobId, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    applicantName: '',
    applicantEmail: '',
    applicantPhone: '',
    coverLetter: ''
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);

  // Hooks
  const { data: job, isLoading: jobLoading } = useJob(jobId);
  const applyToJobMutation = useApplyToJob();

  // Validate South African phone number
  const validatePhoneNumber = (phone: string) => {
    // Remove spaces and special characters
    const cleaned = phone.replace(/[\s-()]/g, '');
    
    // South African phone patterns
    const patterns = [
      /^0[6-8][0-9]{8}$/, // Mobile: 06x, 07x, 08x followed by 8 digits
      /^0[1-5][0-9]{8}$/, // Landline: 01x-05x followed by 8 digits
      /^\+27[6-8][0-9]{8}$/, // International mobile
      /^\+27[1-5][0-9]{8}$/ // International landline
    ];

    return patterns.some(pattern => pattern.test(cleaned));
  };

  // Format phone number display
  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/[\s-()]/g, '');
    
    if (cleaned.startsWith('+27')) {
      return cleaned.replace(/^\+27([0-9]{2})([0-9]{3})([0-9]{4})$/, '+27 $1 $2 $3');
    } else if (cleaned.startsWith('0')) {
      return cleaned.replace(/^0([0-9]{2})([0-9]{3})([0-9]{4})$/, '0$1 $2 $3');
    }
    
    return phone;
  };

  // Validate email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.applicantName.trim()) {
      newErrors.applicantName = 'Full name is required';
    }

    if (!formData.applicantEmail.trim()) {
      newErrors.applicantEmail = 'Email is required';
    } else if (!validateEmail(formData.applicantEmail)) {
      newErrors.applicantEmail = 'Please enter a valid email address';
    }

    if (!formData.applicantPhone.trim()) {
      newErrors.applicantPhone = 'Phone number is required';
    } else if (!validatePhoneNumber(formData.applicantPhone)) {
      newErrors.applicantPhone = 'Please enter a valid South African phone number';
    }

    if (!resumeFile) {
      newErrors.resume = 'Please upload your CV/Resume';
    } else {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(resumeFile.type)) {
        newErrors.resume = 'Please upload a PDF or Word document';
      } else if (resumeFile.size > 5 * 1024 * 1024) { // 5MB limit
        newErrors.resume = 'File size must be less than 5MB';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle phone number change with formatting
  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    handleInputChange('applicantPhone', formatted);
  };

  // Handle file drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Handle file selection
  const handleFileSelect = (file: File) => {
    setResumeFile(file);
    if (errors.resume) {
      setErrors(prev => ({ ...prev, resume: '' }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    try {
      await applyToJobMutation.mutateAsync({
        jobId,
        applicationData: {
          ...formData,
          resumeFile: resumeFile!
        }
      });
      
      toast.success('Application submitted successfully!');
      onSuccess?.();
    } catch (error) {
      // Error is already handled by the mutation
    }
  };

  if (jobLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" text="Loading job details..." />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">
          <AlertCircle className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Job Not Found</h3>
        <p className="text-gray-600">The job you're trying to apply for could not be found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Job Info Header */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">Apply for this position</h2>
        <div className="text-blue-800">
          <h3 className="text-lg font-semibold">{job.title}</h3>
          <p className="text-sm">{job.company} • {job.city}, {job.province}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </h3>

          <div className="grid gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.applicantName}
                onChange={(e) => handleInputChange('applicantName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.applicantName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.applicantName && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.applicantName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.applicantEmail}
                onChange={(e) => handleInputChange('applicantEmail', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.applicantEmail ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="your.email@example.com"
              />
              {errors.applicantEmail && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.applicantEmail}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.applicantPhone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.applicantPhone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="071 234 5678 or +27 71 234 5678"
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter a South African phone number (mobile or landline)
              </p>
              {errors.applicantPhone && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.applicantPhone}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* CV/Resume Upload */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Upload className="h-5 w-5" />
            CV/Resume Upload
          </h3>

          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : errors.resume 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {resumeFile ? (
              <div className="text-green-600">
                <CheckCircle className="h-12 w-12 mx-auto mb-2" />
                <p className="font-semibold">{resumeFile.name}</p>
                <p className="text-sm text-gray-600">
                  {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <button
                  type="button"
                  onClick={() => setResumeFile(null)}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700 underline"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div>
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p className="text-lg font-medium text-gray-700 mb-1">
                  Drop your CV here, or{' '}
                  <label className="text-blue-600 hover:text-blue-700 cursor-pointer underline">
                    browse files
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </p>
                <p className="text-sm text-gray-500">
                  Supported formats: PDF, DOC, DOCX (max 5MB)
                </p>
              </div>
            )}
          </div>
          
          {errors.resume && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.resume}
            </p>
          )}
        </div>

        {/* Cover Letter */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Cover Letter
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Why are you interested in this position?
            </label>
            <textarea
              value={formData.coverLetter}
              onChange={(e) => handleInputChange('coverLetter', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell us about your interest in this role, relevant experience, and what you can bring to the team..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Optional but recommended. This helps you stand out from other applicants.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={applyToJobMutation.isLoading}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {applyToJobMutation.isLoading ? (
              <LoadingSpinner size="sm" color="white" />
            ) : (
              <Send className="h-5 w-5" />
            )}
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobApplicationForm;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaMapMarkerAlt, 
  FaBriefcase, 
  FaClock, 
  FaEnvelope, 
  FaPhone, 
  FaGlobe, 
  FaSave, 
  FaPaperPlane, 
  FaEye,
  FaStar,
  FaExternalLinkAlt,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
import { 
  formatSalary, 
  formatJobType, 
  calculateTimeAgo, 
  calculateJobQuality,
  saveJob,
  quickApply 
} from '../services/jobService';
import toast from 'react-hot-toast';

/**
 * Enhanced Job Card Component
 * 
 * Features:
 * ✅ Contact information display
 * ✅ Job quality scoring
 * ✅ Application tracking
 * ✅ POPI compliance indicators
 * ✅ Real-time updates
 * ✅ Interactive animations
 */
const JobCard = ({ 
  job, 
  onJobClick, 
  onSave, 
  onApply,
  showContactInfo = true,
  className = '',
  priority = false 
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [qualityScore, setQualityScore] = useState(0);

  useEffect(() => {
    if (job) {
      setQualityScore(calculateJobQuality(job));
    }
  }, [job]);

  if (!job) return null;

  const handleSaveJob = async (e) => {
    e.stopPropagation();
    try {
      await saveJob(job.job_id);
      setIsSaved(true);
      toast.success('Job saved successfully! 💾');
      if (onSave) onSave(job);
    } catch (error) {
      toast.error('Failed to save job. Please try again.');
    }
  };

  const handleQuickApply = async (e) => {
    e.stopPropagation();
    setIsApplying(true);
    
    try {
      await quickApply(job.job_id);
      toast.success('Application sent successfully! 🚀');
      if (onApply) onApply(job);
    } catch (error) {
      toast.error('Failed to apply. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    if (onJobClick) onJobClick(job);
  };

  const getQualityColor = (score) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-blue-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getMatchColor = (score) => {
    if (score >= 90) return 'var(--neon-green)';
    if (score >= 80) return 'var(--neon-cyan)';
    return 'var(--neon-yellow)';
  };

  const ContactInfo = () => {
    if (!showContactInfo || !job.contact_info || !job.has_contact_info) return null;

    const { emails, phones, websites, applicationUrls, contactMethods, popiCompliant } = job.contact_info;

    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700"
      >
        <div className="flex items-center gap-2 mb-3">
          <FaEnvelope className="text-neon-cyan text-sm" />
          <span className="text-sm font-medium text-neon-cyan">Contact Information</span>
          {popiCompliant && (
            <FaShieldAlt className="text-green-400 text-xs" title="POPI Compliant" />
          )}
        </div>

        <div className="space-y-2">
          {/* Email contacts */}
          {emails && emails.length > 0 && (
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-gray-400 text-xs" />
              <div className="flex flex-wrap gap-2">
                {emails.slice(0, 2).map((email, index) => (
                  <motion.a
                    key={index}
                    href={`mailto:${email}`}
                    whileHover={{ scale: 1.05 }}
                    className="text-xs bg-blue-900/30 text-blue-300 px-2 py-1 rounded border border-blue-700/50 hover:border-blue-500 transition-all"
                  >
                    {email}
                  </motion.a>
                ))}
              </div>
            </div>
          )}

          {/* Phone contacts */}
          {phones && phones.length > 0 && (
            <div className="flex items-center gap-2">
              <FaPhone className="text-gray-400 text-xs" />
              <div className="flex flex-wrap gap-2">
                {phones.slice(0, 2).map((phone, index) => (
                  <motion.a
                    key={index}
                    href={`tel:${phone}`}
                    whileHover={{ scale: 1.05 }}
                    className="text-xs bg-green-900/30 text-green-300 px-2 py-1 rounded border border-green-700/50 hover:border-green-500 transition-all"
                  >
                    {phone}
                  </motion.a>
                ))}
              </div>
            </div>
          )}

          {/* Website/Application links */}
          {(websites || applicationUrls) && (
            <div className="flex items-center gap-2">
              <FaGlobe className="text-gray-400 text-xs" />
              <div className="flex flex-wrap gap-2">
                {applicationUrls && applicationUrls.slice(0, 1).map((url, index) => (
                  <motion.a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    className="text-xs bg-purple-900/30 text-purple-300 px-2 py-1 rounded border border-purple-700/50 hover:border-purple-500 transition-all flex items-center gap-1"
                  >
                    Apply Online <FaExternalLinkAlt className="text-xs" />
                  </motion.a>
                ))}
                {websites && websites.slice(0, 1).map((url, index) => (
                  <motion.a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    className="text-xs bg-gray-700/30 text-gray-300 px-2 py-1 rounded border border-gray-600/50 hover:border-gray-500 transition-all flex items-center gap-1"
                  >
                    Website <FaExternalLinkAlt className="text-xs" />
                  </motion.a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contact quality indicator */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Contact Quality:</span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`text-xs ${
                    i < Math.floor((job.contact_info.contactQualityScore || 0) / 20) 
                      ? 'text-yellow-400' 
                      : 'text-gray-600'
                  }`}
                />
              ))}
              <span className="text-xs text-gray-400 ml-1">
                {job.contact_info.contactQualityScore || 0}/100
              </span>
            </div>
          </div>
          
          {contactMethods && contactMethods.length > 0 && (
            <span className="text-xs text-gray-400">
              {contactMethods.length} method{contactMethods.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </motion.div>
    );
  };

  const QualityIndicator = () => (
    <div className="flex items-center gap-2">
      <FaCheckCircle className={`text-sm ${getQualityColor(qualityScore)}`} />
      <span className={`text-xs font-medium ${getQualityColor(qualityScore)}`}>
        {qualityScore}% Quality
      </span>
    </div>
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className={`
        card-3d p-6 cursor-pointer transition-all duration-300
        ${priority ? 'ring-2 ring-neon-cyan/50 shadow-lg shadow-neon-cyan/20' : ''}
        ${className}
      `}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Priority badge */}
      {priority && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-gradient-to-r from-neon-cyan to-neon-blue text-black px-2 py-1 rounded-full text-xs font-bold"
        >
          PRIORITY
        </motion.div>
      )}

      {/* Job Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 pr-4">
          <h3 className="text-xl font-semibold text-neon-cyan mb-1 line-clamp-2">
            {job.title}
          </h3>
          <p className="text-gray-400 font-medium">{job.company}</p>
          
          {/* AI Match Score */}
          {job.ai_match_score && (
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-2 flex items-center gap-2"
            >
              <div
                className="text-lg font-bold"
                style={{
                  color: getMatchColor(job.ai_match_score),
                  textShadow: `0 0 15px ${getMatchColor(job.ai_match_score)}`
                }}
              >
                {job.ai_match_score}% Match
              </div>
              <QualityIndicator />
            </motion.div>
          )}
        </div>
      </div>

      {/* Job Details */}
      <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-400">
        <span className="flex items-center gap-1">
          <FaMapMarkerAlt className="text-neon-pink" />
          {job.location}
        </span>
        
        {job.salary && (
          <span className="flex items-center gap-1">
            <FaBriefcase className="text-neon-green" />
            {formatSalary(job.salary)}
          </span>
        )}
        
        <span className="flex items-center gap-1">
          <FaClock className="text-neon-cyan" />
          {formatJobType(job.job_type)}
        </span>
      </div>

      {/* Skills and Category */}
      {job.skills_required && job.skills_required.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {job.skills_required.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="text-xs bg-neon-blue/20 text-neon-blue px-2 py-1 rounded border border-neon-blue/30"
              >
                {skill}
              </span>
            ))}
            {job.skills_required.length > 4 && (
              <span className="text-xs text-gray-400">
                +{job.skills_required.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Description Preview */}
      <div className="mb-4">
        <p className="text-gray-300 text-sm line-clamp-3">
          {job.description || job.job_summary || 'No description available'}
        </p>
      </div>

      {/* Contact Information (expandable) */}
      <AnimatePresence>
        {expanded && <ContactInfo />}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex gap-3 mt-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSaveJob}
          disabled={isSaved}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm
            ${isSaved 
              ? 'bg-green-900/30 text-green-400 border border-green-700' 
              : 'border border-gray-600 hover:border-neon-cyan hover:text-neon-cyan'
            }
          `}
        >
          <FaSave />
          {isSaved ? 'Saved' : 'Save'}
        </motion.button>

        {job.has_contact_info && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleQuickApply}
            disabled={isApplying}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-blue text-black rounded-full font-medium text-sm disabled:opacity-50"
          >
            <FaPaperPlane />
            {isApplying ? 'Applying...' : 'Quick Apply'}
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleViewDetails}
          className="flex items-center gap-2 px-4 py-2 border border-neon-pink rounded-full hover:bg-neon-pink hover:text-black transition-all text-sm"
        >
          <FaEye />
          View Details
        </motion.button>
      </div>

      {/* Footer with metadata */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700/50">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>{calculateTimeAgo(job.posted_at || job.date_scraped)}</span>
          {job.source && (
            <span className="flex items-center gap-1">
              <FaGlobe className="text-xs" />
              {job.source}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {job.has_contact_info ? (
            <div className="flex items-center gap-1 text-green-400">
              <FaCheckCircle className="text-xs" />
              <span className="text-xs">Has Contact</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-yellow-400">
              <FaExclamationTriangle className="text-xs" />
              <span className="text-xs">No Direct Contact</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;

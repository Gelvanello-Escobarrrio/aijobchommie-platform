import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUpload, FiFileText, FiCamera, FiCheck, FiX, FiEye,
  FiDownload, FiEdit3, FiStar, FiAlertCircle, FiTrendingUp,
  FiTarget, FiUser, FiBriefcase, FiAward, FiBook
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const MobileCVUpload = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedCV, setUploadedCV] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (file) => {
    if (!file) return;

    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast.error('Please upload PDF, DOC, or DOCX files only');
      return;
    }

    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('cv', file);

      const response = await fetch('/api/v1/cv/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setUploadedCV({
          name: file.name,
          size: file.size,
          url: data.data.url,
          uploadedAt: new Date().toISOString()
        });
        setAnalysisResults(data.data.analysis);
        setActiveTab('analysis');
        toast.success('CV uploaded and analyzed successfully!');
      }
    } catch (error) {
      console.error('CV upload error:', error);
      toast.error('Failed to upload CV');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100 border-green-200';
    if (score >= 60) return 'bg-blue-100 border-blue-200';
    if (score >= 40) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

  const TabNavigation = () => (
    <div className="bg-white shadow-sm px-4 sticky top-0 z-10">
      <div className="flex space-x-1">
        {[
          { id: 'upload', label: 'Upload', icon: FiUpload },
          { id: 'analysis', label: 'Analysis', icon: FiTarget, disabled: !analysisResults },
          { id: 'improvements', label: 'Improve', icon: FiTrendingUp, disabled: !analysisResults }
        ].map((tab) => (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => !tab.disabled && setActiveTab(tab.id)}
            disabled={tab.disabled}
            className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center space-x-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : tab.disabled 
                ? 'border-transparent text-gray-300'
                : 'border-transparent text-gray-500'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );

  const UploadTab = () => (
    <div className="p-4 space-y-6">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 bg-gray-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => handleFileUpload(e.target.files[0])}
          className="hidden"
        />

        <motion.div
          animate={loading ? { scale: [1, 1.1, 1] } : { scale: 1 }}
          transition={{ duration: 1, repeat: loading ? Infinity : 0 }}
          className="mb-4"
        >
          <FiFileText className="w-16 h-16 text-blue-500 mx-auto" />
        </motion.div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Upload Your CV/Resume
        </h3>
        <p className="text-gray-600 text-sm mb-6">
          Upload your CV for AI-powered analysis and job matching
        </p>

        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="w-full py-3 px-6 bg-blue-600 text-white rounded-xl font-medium shadow-lg disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                <span>Analyzing...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <FiUpload className="w-4 h-4" />
                <span>Choose File</span>
              </div>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-medium"
          >
            <div className="flex items-center justify-center space-x-2">
              <FiCamera className="w-4 h-4" />
              <span>Scan with Camera</span>
            </div>
          </motion.button>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          Supported formats: PDF, DOC, DOCX (Max 5MB)
        </p>
      </div>

      {/* Current CV Status */}
      {uploadedCV && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900">Current CV</h4>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center">
              <FiCheck className="w-3 h-3 mr-1" />
              Uploaded
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiFileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{uploadedCV.name}</p>
              <p className="text-sm text-gray-500">
                {formatFileSize(uploadedCV.size)} • {new Date(uploadedCV.uploadedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex space-x-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setPreviewOpen(true)}
                className="p-2 text-gray-600 hover:text-blue-600"
              >
                <FiEye className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-600 hover:text-green-600"
              >
                <FiDownload className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Tips */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
        <div className="flex items-center mb-2">
          <FiStar className="w-5 h-5 mr-2" />
          <h4 className="font-semibold">Pro Tips</h4>
        </div>
        <ul className="text-sm space-y-1 text-blue-100">
          <li>• Use a clean, professional format</li>
          <li>• Include relevant keywords for your industry</li>
          <li>• Keep it concise and focused</li>
          <li>• Update regularly with new achievements</li>
        </ul>
      </div>
    </div>
  );

  const AnalysisTab = () => {
    if (!analysisResults) return null;

    const { overallScore, sections, keywords, improvements } = analysisResults;

    return (
      <div className="p-4 space-y-6">
        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`rounded-xl border-2 p-6 text-center ${getScoreBgColor(overallScore)}`}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-6xl font-bold ${getScoreColor(overallScore)} mb-2`}
          >
            {overallScore}
          </motion.div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Overall CV Score</h3>
          <p className="text-sm text-gray-600">
            {overallScore >= 80 ? 'Excellent! Your CV is highly competitive' :
             overallScore >= 60 ? 'Good! Some improvements recommended' :
             overallScore >= 40 ? 'Fair. Several areas need attention' :
             'Needs significant improvement'}
          </p>
        </motion.div>

        {/* Section Breakdown */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Section Analysis</h4>
          {sections?.map((section, index) => (
            <motion.div
              key={section.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-gray-900">{section.name}</h5>
                <div className="flex items-center space-x-2">
                  <div className={`text-sm font-medium ${getScoreColor(section.score)}`}>
                    {section.score}%
                  </div>
                  <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${section.score}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                      className={`h-full ${
                        section.score >= 80 ? 'bg-green-500' :
                        section.score >= 60 ? 'bg-blue-500' :
                        section.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                    />
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600">{section.feedback}</p>
            </motion.div>
          ))}
        </div>

        {/* Keywords Analysis */}
        {keywords && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Keyword Analysis</h4>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="space-y-3">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                    <FiCheck className="w-4 h-4 text-green-500 mr-2" />
                    Found Keywords ({keywords.found?.length || 0})
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {keywords.found?.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                    <FiAlertCircle className="w-4 h-4 text-yellow-500 mr-2" />
                    Missing Keywords ({keywords.missing?.length || 0})
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {keywords.missing?.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Insights */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white">
          <div className="flex items-center mb-3">
            <FiStar className="w-5 h-5 mr-2" />
            <h4 className="font-semibold">AI Insights</h4>
          </div>
          <div className="space-y-2 text-sm">
            <p>• Your CV shows strong technical skills</p>
            <p>• Consider adding more quantified achievements</p>
            <p>• Industry keywords are well-distributed</p>
            <p>• Format is clean and professional</p>
          </div>
        </div>
      </div>
    );
  };

  const ImprovementsTab = () => {
    if (!analysisResults) return null;

    const improvementCategories = [
      {
        icon: FiUser,
        title: 'Personal Branding',
        color: 'blue',
        suggestions: [
          'Add a compelling professional summary',
          'Include professional photo if appropriate',
          'Highlight unique value proposition'
        ]
      },
      {
        icon: FiBriefcase,
        title: 'Experience Section',
        color: 'green',
        suggestions: [
          'Use action verbs to start each bullet point',
          'Quantify achievements with numbers',
          'Show progression and growth'
        ]
      },
      {
        icon: FiAward,
        title: 'Skills & Achievements',
        color: 'purple',
        suggestions: [
          'Add relevant certifications',
          'Include technical skills matrix',
          'Highlight key accomplishments'
        ]
      },
      {
        icon: FiBook,
        title: 'Education & Training',
        color: 'orange',
        suggestions: [
          'Include relevant coursework',
          'Add professional development',
          'Mention academic achievements'
        ]
      }
    ];

    return (
      <div className="p-4 space-y-6">
        {/* Improvement Score */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Improvement Potential</h3>
          <p className="text-gray-600 text-sm mb-4">
            Follow these recommendations to boost your CV score
          </p>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">
              {analysisResults.overallScore}%
            </span>
            <FiTrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-2xl font-bold text-green-600">
              {Math.min(95, analysisResults.overallScore + 15)}%
            </span>
          </div>
        </div>

        {/* Improvement Categories */}
        <div className="space-y-4">
          {improvementCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-4"
            >
              <div className="flex items-center mb-3">
                <div className={`p-2 rounded-lg mr-3 bg-${category.color}-100`}>
                  <category.icon className={`w-5 h-5 text-${category.color}-600`} />
                </div>
                <h4 className="font-semibold text-gray-900">{category.title}</h4>
              </div>
              <ul className="space-y-2">
                {category.suggestions.map((suggestion, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-600">
                    <FiCheck className="w-3 h-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    {suggestion}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg"
        >
          <div className="flex items-center justify-center space-x-2">
            <FiEdit3 className="w-4 h-4" />
            <span>Generate Improved CV</span>
          </div>
        </motion.button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-4 pt-12 pb-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">CV Analysis</h1>
          <p className="text-blue-100 text-sm">
            AI-powered CV optimization and job matching
          </p>
        </div>
      </div>

      <TabNavigation />

      <div className="min-h-[60vh]">
        {activeTab === 'upload' && <UploadTab />}
        {activeTab === 'analysis' && <AnalysisTab />}
        {activeTab === 'improvements' && <ImprovementsTab />}
      </div>

      {/* CV Preview Modal */}
      <AnimatePresence>
        {previewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setPreviewOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">CV Preview</h3>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPreviewOpen(false)}
                  className="p-2 rounded-full bg-gray-100"
                >
                  <FiX className="w-5 h-5" />
                </motion.button>
              </div>
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                <p className="text-gray-500">CV preview will load here</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileCVUpload;

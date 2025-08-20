import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Brain,
  CheckCircle,
  Clock,
  Download,
  Eye,
  FileText,
  RefreshCw,
  Star,
  Target,
  Trash2,
  TrendingUp,
  Upload,
  Zap
} from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  AmbientLighting,
  ChromeSeparator,
  MetallicButton,
  MetallicCard,
  MetallicProgress,
  SectionHeading
} from '../components/ui/MetallicComponents';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  status: 'processing' | 'completed' | 'error';
  analysisScore?: number;
  feedback?: string[];
  suggestions?: string[];
}

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: '1',
      name: 'John_Doe_Resume_2024.pdf',
      size: 245760,
      type: 'application/pdf',
      uploadDate: '2024-01-20',
      status: 'completed',
      analysisScore: 87,
      feedback: [
        'Strong technical skills section',
        'Clear work experience descriptions',
        'Professional formatting and layout',
        'Relevant keywords for tech roles'
      ],
      suggestions: [
        'Add more quantifiable achievements',
        'Include portfolio links',
        'Add certifications section',
        'Update contact information'
      ]
    }
  ]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, []);

  const handleFileUpload = (files: FileList) => {
    const file = files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF or Word document');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsUploading(false);

          // Add uploaded file to list
          const newFile: UploadedFile = {
            id: Date.now().toString(),
            name: file.name,
            size: file.size,
            type: file.type,
            uploadDate: new Date().toISOString().split('T')[0],
            status: 'processing'
          };

          setUploadedFiles(prev => [newFile, ...prev]);

          // Simulate processing
          setTimeout(() => {
            setUploadedFiles(prev => prev.map(f =>
              f.id === newFile.id
                ? {
                    ...f,
                    status: 'completed',
                    analysisScore: Math.floor(Math.random() * 20) + 75,
                    feedback: [
                      'Resume structure is well organized',
                      'Good use of industry keywords',
                      'Professional experience clearly outlined'
                    ],
                    suggestions: [
                      'Add more specific metrics and achievements',
                      'Include relevant certifications',
                      'Update skills section with latest technologies'
                    ]
                  }
                : f
            ));
          }, 3000);

          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileUpload(e.target.files);
    }
  };

  const handleDeleteFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <RefreshCw className="w-5 h-5 text-tech-cyan animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-state-success" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-state-error" />;
      default:
        return <Clock className="w-5 h-5 text-text-tertiary" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'tech-cyan';
      case 'completed': return 'state-success';
      case 'error': return 'state-error';
      default: return 'text-tertiary';
    }
  };

  const tips = [
    {
      icon: <FileText />,
      title: 'Supported Formats',
      description: 'Upload PDF, DOC, or DOCX files up to 5MB'
    },
    {
      icon: <Brain />,
      title: 'AI Analysis',
      description: 'Get intelligent feedback on your resume structure and content'
    },
    {
      icon: <Target />,
      title: 'ATS Optimization',
      description: 'Ensure your resume passes Applicant Tracking Systems'
    },
    {
      icon: <Star />,
      title: 'Match Scoring',
      description: 'See how well your resume matches job requirements'
    }
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary relative overflow-hidden">
      <AmbientLighting />

      {/* Header */}
      <section className="section-responsive safe-area-top">
        <div className="responsive-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeading
              title="Resume Analysis"
              subtitle="Upload your CV for AI-powered analysis and optimization recommendations."
              align="center"
            />
          </motion.div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="section-responsive">
        <div className="responsive-container">
          <div className="grid-responsive-2 gap-8">

            {/* Upload Zone */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <MetallicCard className="p-8" glow="medium">
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                    dragActive
                      ? 'border-tech-cyan bg-tech-cyan/10'
                      : 'border-border-light hover:border-tech-cyan'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                  />

                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gradient-tech rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-void-black" />
                    </div>

                    <div>
                      <h3 className="text-xl font-heading font-bold mb-2">
                        Upload Your Resume
                      </h3>
                      <p className="text-text-secondary mb-4">
                        Drag and drop your file here, or click to browse
                      </p>

                      <MetallicButton
                        variant="tech"
                        onClick={() => document.getElementById('file-upload')?.click()}
                        icon={<Upload />}
                      >
                        Choose File
                      </MetallicButton>
                    </div>

                    <div className="text-sm text-text-tertiary">
                      Supported: PDF, DOC, DOCX (Max 5MB)
                    </div>
                  </div>

                  {isUploading && (
                    <div className="absolute inset-0 bg-bg-primary/90 flex items-center justify-center rounded-lg">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-tech rounded-full flex items-center justify-center mx-auto mb-4">
                          <Upload className="w-6 h-6 text-void-black" />
                        </div>
                        <p className="text-tech-cyan font-medium mb-4">Uploading...</p>
                        <MetallicProgress
                          value={uploadProgress}
                          max={100}
                          size="md"
                          variant="tech"
                          className="w-48"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </MetallicCard>
            </motion.div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <MetallicCard className="p-8">
                <h3 className="text-xl font-heading font-bold mb-6">
                  Resume Analysis Features
                </h3>

                <div className="space-y-6">
                  {tips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gradient-chrome rounded-lg flex items-center justify-center flex-shrink-0">
                        <div className="text-void-black text-lg">{tip.icon}</div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-text-primary mb-1">{tip.title}</h4>
                        <p className="text-sm text-text-secondary">{tip.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </MetallicCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <section className="section-responsive">
          <div className="responsive-container">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-heading font-bold mb-6">Your Files</h2>

              <div className="space-y-6">
                {uploadedFiles.map((file) => (
                  <MetallicCard key={file.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-chrome rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-void-black" />
                        </div>

                        <div>
                          <h3 className="font-semibold text-text-primary">{file.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-text-secondary">
                            <span>{formatFileSize(file.size)}</span>
                            <span>Uploaded {file.uploadDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className={`flex items-center space-x-2 text-${getStatusColor(file.status)}`}>
                          {getStatusIcon(file.status)}
                          <span className="font-medium capitalize">{file.status}</span>
                        </div>

                        <MetallicButton
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteFile(file.id)}
                          icon={<Trash2 />}
                        />
                      </div>
                    </div>

                    {file.status === 'completed' && file.analysisScore && (
                      <div className="space-y-6">
                        {/* Analysis Score */}
                        <div className="flex items-center justify-between p-4 bg-glass-chrome rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-tech rounded-lg flex items-center justify-center">
                              <Brain className="w-5 h-5 text-void-black" />
                            </div>
                            <div>
                              <h4 className="font-semibold">AI Analysis Score</h4>
                              <p className="text-sm text-text-secondary">Overall resume quality rating</p>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-3xl font-bold text-tech-cyan">{file.analysisScore}%</div>
                            <div className="text-sm text-text-tertiary">
                              {file.analysisScore >= 90 ? 'Excellent' :
                               file.analysisScore >= 75 ? 'Good' :
                               file.analysisScore >= 60 ? 'Fair' : 'Needs Work'}
                            </div>
                          </div>
                        </div>

                        {/* Feedback and Suggestions */}
                        <div className="grid-responsive-2 gap-6">
                          {/* Positive Feedback */}
                          {file.feedback && (
                            <div>
                              <h4 className="font-semibold text-state-success mb-3 flex items-center">
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Strengths
                              </h4>
                              <ul className="space-y-2">
                                {file.feedback.map((item, index) => (
                                  <li key={index} className="flex items-start text-sm">
                                    <div className="w-2 h-2 bg-state-success rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                    <span className="text-text-secondary">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Suggestions */}
                          {file.suggestions && (
                            <div>
                              <h4 className="font-semibold text-tech-cyan mb-3 flex items-center">
                                <TrendingUp className="w-5 h-5 mr-2" />
                                Improvement Suggestions
                              </h4>
                              <ul className="space-y-2">
                                {file.suggestions.map((item, index) => (
                                  <li key={index} className="flex items-start text-sm">
                                    <div className="w-2 h-2 bg-tech-cyan rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                    <span className="text-text-secondary">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-3 pt-4 border-t border-border-light">
                          <MetallicButton
                            variant="tech"
                            size="sm"
                            icon={<Eye />}
                            onClick={() => window.open('#', '_blank')}
                          >
                            View Analysis
                          </MetallicButton>

                          <MetallicButton
                            variant="outline"
                            size="sm"
                            icon={<Download />}
                          >
                            Download Report
                          </MetallicButton>

                          <MetallicButton
                            variant="outline"
                            size="sm"
                            icon={<Zap />}
                            onClick={() => navigate('/jobs')}
                          >
                            Find Matching Jobs
                          </MetallicButton>
                        </div>
                      </div>
                    )}

                    {file.status === 'processing' && (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gradient-tech rounded-full flex items-center justify-center mx-auto mb-4">
                            <Brain className="w-6 h-6 text-void-black" />
                          </div>
                          <p className="text-tech-cyan font-medium mb-2">Analyzing Resume...</p>
                          <p className="text-sm text-text-secondary">
                            Our AI is reviewing your resume structure, keywords, and content quality.
                          </p>
                        </div>
                      </div>
                    )}
                  </MetallicCard>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <ChromeSeparator className="my-8" />
    </div>
  );
};

export default UploadPage;

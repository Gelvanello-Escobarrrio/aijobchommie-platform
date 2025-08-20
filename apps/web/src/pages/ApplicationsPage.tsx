import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Eye,
  FileText,
  MapPin,
  Search,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  AmbientLighting,
  ChromeSeparator,
  MetallicBadge,
  MetallicButton,
  MetallicCard,
  MetallicStat
} from '../components/ui/MetallicComponents';

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  appliedDate: string;
  status: 'submitted' | 'under_review' | 'shortlisted' | 'interviewed' | 'hired' | 'rejected' | 'withdrawn';
  salary: string;
  matchingScore: number;
  feedback?: string;
  nextStep?: string;
  interviewDate?: string;
}

const ApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const applications: Application[] = [
    {
      id: '1',
      jobTitle: 'Senior React Developer',
      company: 'TechCorp SA',
      location: 'Cape Town, WC',
      appliedDate: '2024-01-20',
      status: 'under_review',
      salary: 'R45,000 - R65,000',
      matchingScore: 94,
      feedback: 'Your application is being reviewed by our technical team.',
      nextStep: 'Technical interview scheduled for next week'
    },
    {
      id: '2',
      jobTitle: 'Full Stack Developer',
      company: 'Digital Solutions',
      location: 'Johannesburg, GP',
      appliedDate: '2024-01-18',
      status: 'shortlisted',
      salary: 'R40,000 - R55,000',
      matchingScore: 89,
      feedback: 'Great profile! We would like to schedule an interview.',
      interviewDate: '2024-01-25'
    },
    {
      id: '3',
      jobTitle: 'Frontend Developer',
      company: 'StartupXYZ',
      location: 'Durban, KZN',
      appliedDate: '2024-01-15',
      status: 'interviewed',
      salary: 'R35,000 - R50,000',
      matchingScore: 91,
      feedback: 'Interview went well. Waiting for final decision.',
      nextStep: 'Expect to hear back within 3-5 business days'
    },
    {
      id: '4',
      jobTitle: 'JavaScript Developer',
      company: 'Web Agency',
      location: 'Pretoria, GP',
      appliedDate: '2024-01-12',
      status: 'rejected',
      salary: 'R30,000 - R45,000',
      matchingScore: 76,
      feedback: 'Thank you for your interest. We decided to go with a candidate with more Angular experience.'
    },
    {
      id: '5',
      jobTitle: 'React Native Developer',
      company: 'Mobile Corp',
      location: 'Cape Town, WC',
      appliedDate: '2024-01-10',
      status: 'hired',
      salary: 'R50,000 - R70,000',
      matchingScore: 96,
      feedback: 'Congratulations! We are excited to have you join our team.',
      nextStep: 'HR will contact you with onboarding details'
    }
  ];

  const stats = {
    totalApplications: applications.length,
    pending: applications.filter(app => ['submitted', 'under_review'].includes(app.status)).length,
    interviews: applications.filter(app => ['shortlisted', 'interviewed'].includes(app.status)).length,
    hired: applications.filter(app => app.status === 'hired').length,
    responseRate: Math.round((applications.filter(app => app.status !== 'submitted').length / applications.length) * 100)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'text-tertiary';
      case 'under_review': return 'tech-cyan';
      case 'shortlisted': return 'state-warning';
      case 'interviewed': return 'state-info';
      case 'hired': return 'state-success';
      case 'rejected': return 'state-error';
      case 'withdrawn': return 'text-tertiary';
      default: return 'text-tertiary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <Clock />;
      case 'under_review': return <Eye />;
      case 'shortlisted': return <Star />;
      case 'interviewed': return <Users />;
      case 'hired': return <CheckCircle />;
      case 'rejected': return <AlertTriangle />;
      case 'withdrawn': return <AlertTriangle />;
      default: return <Clock />;
    }
  };

  const getStatusText = (status: string) => {
    return status.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const filteredApplications = applications.filter(app => {
    const matchesFilter = filter === 'all' || app.status === filter;
    const matchesSearch = app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statusCounts = {
    all: applications.length,
    submitted: applications.filter(app => app.status === 'submitted').length,
    under_review: applications.filter(app => app.status === 'under_review').length,
    shortlisted: applications.filter(app => app.status === 'shortlisted').length,
    interviewed: applications.filter(app => app.status === 'interviewed').length,
    hired: applications.filter(app => app.status === 'hired').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  };

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
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-heading font-bold text-chrome mb-2">
                  My Applications
                </h1>
                <p className="text-text-secondary">
                  Track and manage your job applications with detailed insights.
                </p>
              </div>

                             <MetallicButton
                 variant="tech"
                 onClick={() => navigate('/jobs')}
                 icon={<Zap />}
               >
                 Get AI Recommendations
               </MetallicButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="section-responsive">
        <div className="responsive-container">
          <div className="grid-responsive-4 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <MetallicStat
                value={stats.totalApplications}
                label="Total Applications"
                icon={<FileText />}
                animated={true}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <MetallicStat
                value={stats.pending}
                label="Under Review"
                icon={<Clock />}
                animated={true}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <MetallicStat
                value={stats.interviews}
                label="Interview Stage"
                icon={<Users />}
                animated={true}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <MetallicStat
                value={`${stats.responseRate}%`}
                label="Response Rate"
                icon={<TrendingUp />}
                animated={true}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="section-responsive">
        <div className="responsive-container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <MetallicCard className="p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading font-bold">Filter Applications</h2>
                <MetallicBadge variant="tech">
                  {filteredApplications.length} results
                </MetallicBadge>
              </div>

              <div className="grid-responsive-2 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                  <input
                    type="text"
                    placeholder="Search by job title or company"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-void-shadow border border-border-light rounded-md focus:border-tech-cyan focus:ring-1 focus:ring-tech-cyan transition-all text-text-primary"
                  />
                </div>

                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-3 bg-void-shadow border border-border-light rounded-md focus:border-tech-cyan focus:ring-1 focus:ring-tech-cyan text-text-primary"
                >
                  <option value="all">All Status ({statusCounts.all})</option>
                  <option value="submitted">Submitted ({statusCounts.submitted})</option>
                  <option value="under_review">Under Review ({statusCounts.under_review})</option>
                  <option value="shortlisted">Shortlisted ({statusCounts.shortlisted})</option>
                  <option value="interviewed">Interviewed ({statusCounts.interviewed})</option>
                  <option value="hired">Hired ({statusCounts.hired})</option>
                  <option value="rejected">Rejected ({statusCounts.rejected})</option>
                </select>
              </div>

              <div className="flex flex-wrap gap-2">
                {Object.entries(statusCounts).map(([status, count]) => (
                  <button
                    key={status}
                    className="cursor-pointer"
                    onClick={() => setFilter(status)}
                  >
                    <MetallicBadge
                      variant={filter === status ? "tech" : "chrome"}
                    >
                      {getStatusText(status)} ({count})
                    </MetallicBadge>
                  </button>
                ))}
              </div>
            </MetallicCard>
          </motion.div>
        </div>
      </section>

      {/* Applications List */}
      <section className="section-responsive">
        <div className="responsive-container">
          <div className="space-y-6">
            {filteredApplications.map((application, index) => (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MetallicCard className="p-6 hover:border-tech-cyan transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-text-primary">
                          {application.jobTitle}
                        </h3>
                        <div className={`flex items-center space-x-1 text-${getStatusColor(application.status)}`}>
                          <span className="text-lg">{getStatusIcon(application.status)}</span>
                          <span className="font-medium">{getStatusText(application.status)}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6 text-sm text-text-secondary mb-4">
                        <span className="flex items-center">
                          <Building className="w-4 h-4 mr-1" />
                          {application.company}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {application.location}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Applied {application.appliedDate}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {application.salary}
                        </span>
                      </div>

                      {application.feedback && (
                        <div className="p-4 bg-void-shadow rounded-lg mb-4">
                          <h4 className="font-medium text-text-primary mb-2">Feedback:</h4>
                          <p className="text-text-secondary text-sm">{application.feedback}</p>
                        </div>
                      )}

                      {application.nextStep && (
                        <div className="p-4 bg-glass-chrome rounded-lg mb-4">
                          <h4 className="font-medium text-tech-cyan mb-2">Next Step:</h4>
                          <p className="text-text-secondary text-sm">{application.nextStep}</p>
                        </div>
                      )}

                      {application.interviewDate && (
                        <div className="p-4 bg-state-warning/10 border border-state-warning rounded-lg mb-4">
                          <h4 className="font-medium text-state-warning mb-2">Interview Scheduled:</h4>
                          <p className="text-text-secondary text-sm">
                            {application.interviewDate} - Please check your email for details
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-tech-cyan mb-1">
                        {application.matchingScore}%
                      </div>
                      <div className="text-xs text-text-tertiary mb-4">match score</div>

                      <div className="flex flex-col space-y-2">
                        <MetallicButton
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/jobs/${application.id}`)}
                          icon={<Eye />}
                        >
                          View Job
                        </MetallicButton>

                        {application.status === 'hired' && (
                          <MetallicButton
                            variant="tech"
                            size="sm"
                            icon={<Download />}
                          >
                            Contract
                          </MetallicButton>
                        )}

                        {['submitted', 'under_review'].includes(application.status) && (
                          <MetallicButton
                            variant="ghost"
                            size="sm"
                            icon={<AlertTriangle />}
                          >
                            Withdraw
                          </MetallicButton>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Progress Timeline */}
                  <div className="border-t border-border-light pt-4">
                    <div className="flex items-center justify-between text-xs">
                      <div className={`flex flex-col items-center ${['submitted', 'under_review', 'shortlisted', 'interviewed', 'hired'].includes(application.status) ? 'text-tech-cyan' : 'text-text-tertiary'}`}>
                        <div className={`w-3 h-3 rounded-full mb-1 ${['submitted', 'under_review', 'shortlisted', 'interviewed', 'hired'].includes(application.status) ? 'bg-tech-cyan' : 'bg-text-tertiary'}`}></div>
                        <span>Applied</span>
                      </div>

                      <div className={`flex-1 h-0.5 mx-2 ${['under_review', 'shortlisted', 'interviewed', 'hired'].includes(application.status) ? 'bg-tech-cyan' : 'bg-text-tertiary'}`}></div>

                      <div className={`flex flex-col items-center ${['under_review', 'shortlisted', 'interviewed', 'hired'].includes(application.status) ? 'text-tech-cyan' : 'text-text-tertiary'}`}>
                        <div className={`w-3 h-3 rounded-full mb-1 ${['under_review', 'shortlisted', 'interviewed', 'hired'].includes(application.status) ? 'bg-tech-cyan' : 'bg-text-tertiary'}`}></div>
                        <span>Review</span>
                      </div>

                      <div className={`flex-1 h-0.5 mx-2 ${['shortlisted', 'interviewed', 'hired'].includes(application.status) ? 'bg-tech-cyan' : 'bg-text-tertiary'}`}></div>

                      <div className={`flex flex-col items-center ${['shortlisted', 'interviewed', 'hired'].includes(application.status) ? 'text-tech-cyan' : 'text-text-tertiary'}`}>
                        <div className={`w-3 h-3 rounded-full mb-1 ${['shortlisted', 'interviewed', 'hired'].includes(application.status) ? 'bg-tech-cyan' : 'bg-text-tertiary'}`}></div>
                        <span>Interview</span>
                      </div>

                      <div className={`flex-1 h-0.5 mx-2 ${application.status === 'hired' ? 'bg-state-success' : 'bg-text-tertiary'}`}></div>

                      <div className={`flex flex-col items-center ${application.status === 'hired' ? 'text-state-success' : 'text-text-tertiary'}`}>
                        <div className={`w-3 h-3 rounded-full mb-1 ${application.status === 'hired' ? 'bg-state-success' : 'bg-text-tertiary'}`}></div>
                        <span>Hired</span>
                      </div>
                    </div>
                  </div>
                </MetallicCard>
              </motion.div>
            ))}
          </div>

          {filteredApplications.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <MetallicCard className="p-12">
                <Target className="w-16 h-16 text-tech-cyan mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Applications Found</h3>
                <p className="text-text-secondary mb-6">
                  {searchTerm || filter !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Start your job search and apply to positions that match your skills.'
                  }
                </p>
                                 <MetallicButton
                   variant="tech"
                   onClick={() => navigate('/jobs')}
                   icon={<Zap />}
                 >
                   Get Smart Job Recommendations
                 </MetallicButton>
              </MetallicCard>
            </motion.div>
          )}
        </div>
      </section>

      <ChromeSeparator className="my-8" />
    </div>
  );
};

export default ApplicationsPage;

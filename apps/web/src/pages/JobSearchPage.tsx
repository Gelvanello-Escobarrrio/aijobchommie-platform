import { motion } from 'framer-motion';
import {
  Building,
  Clock,
  DollarSign,
  ExternalLink,
  Eye,
  Heart,
  MapPin,
  Target,
  Users,
  X,
  Zap
} from 'lucide-react';
import React, { useState } from 'react';
import {
  AmbientLighting,
  ChromeSeparator,
  MetallicBadge,
  MetallicButton,
  MetallicCard,
  SectionHeading
} from '../components/ui/MetallicComponents';

const JobSearchPage: React.FC = () => {

  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [preferences, setPreferences] = useState({
    salaryRange: '',
    jobType: '',
    experience: '',
    remote: false
  });

  // AI-recommended jobs based on user profile
  const aiRecommendedJobs = [
    {
      id: '1',
      title: 'Senior React Developer',
      company: 'TechCorp SA',
      location: 'Cape Town, WC',
      salary: 'R45,000 - R65,000',
      jobType: 'Full-time',
      experience: 'Senior',
      postedDate: '2024-01-22',
      matchingScore: 94,
      isRemote: true,
      isFeatured: true,
      applicationCount: 23,
      viewCount: 156,
      saved: false,
      aiReason: 'Perfect match for your React and TypeScript skills with 5+ years experience',
      profileMatch: 'Your skills in React, TypeScript, and Node.js align perfectly with this role'
    },
    {
      id: '2',
      title: 'Full Stack Developer',
      company: 'Digital Solutions',
      location: 'Johannesburg, GP',
      salary: 'R40,000 - R55,000',
      jobType: 'Full-time',
      experience: 'Mid-level',
      postedDate: '2024-01-21',
      matchingScore: 89,
      isRemote: false,
      isFeatured: false,
      applicationCount: 45,
      viewCount: 234,
      saved: true,
      aiReason: 'Your full-stack background makes you an ideal candidate for this role',
      profileMatch: 'Your experience with modern web technologies matches their requirements'
    }
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary relative overflow-hidden">
      <AmbientLighting />

      {/* Header */}
      <section className="section-responsive safe-area-top">
        <div className="responsive-container">
          <SectionHeading
            title="AI Job Recommendations"
            subtitle="Our AI has analyzed your profile and found these perfect matches for you"
            align="center"
          />
        </div>
      </section>

      {/* AI Preferences Section */}
      <section className="section-responsive">
        <div className="responsive-container">
          <MetallicCard className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-heading font-bold text-chrome mb-2">
                  Intelligent Job Matching Preferences
                </h3>
                <p className="text-text-secondary">
                  Help our AI find better matches by updating your preferences
                </p>
              </div>
              <MetallicBadge variant="tech" animated>
                Intelligent Matching
              </MetallicBadge>
            </div>

            <div className="grid-responsive-2 gap-6">
              <div>
                <label className="block text-text-secondary text-sm font-medium mb-2">
                  Preferred Salary Range
                </label>
                <select
                  value={preferences.salaryRange}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPreferences({...preferences, salaryRange: e.target.value})}
                  className="w-full px-4 py-3 bg-void-shadow border border-border-light rounded-md focus:border-tech-cyan text-text-primary"
                >
                  <option value="">Any Salary</option>
                  <option value="entry">R15,000 - R30,000</option>
                  <option value="mid">R30,000 - R50,000</option>
                  <option value="senior">R50,000 - R80,000</option>
                  <option value="executive">R80,000+</option>
                </select>
              </div>

              <div>
                <label className="block text-text-secondary text-sm font-medium mb-2">
                  Job Type Preference
                </label>
                <select
                  value={preferences.jobType}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPreferences({...preferences, jobType: e.target.value})}
                  className="w-full px-4 py-3 bg-void-shadow border border-border-light rounded-md focus:border-tech-cyan text-text-primary"
                >
                  <option value="">Any Type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="remote">Remote</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.remote}
                    onChange={(e) => setPreferences({...preferences, remote: e.target.checked})}
                    className="mr-2 text-tech-cyan bg-transparent border-border-light rounded focus:ring-tech-cyan"
                  />
                  <span className="text-sm text-text-secondary">Open to remote work</span>
                </label>
              </div>

              <MetallicButton
                variant="tech"
                icon={<Target />}
              >
                Update AI Preferences
              </MetallicButton>
            </div>
          </MetallicCard>
        </div>
      </section>

      {/* Results Section */}
      <section className="section-responsive">
        <div className="responsive-container">
          <div className="grid-responsive-2 gap-8">

            {/* AI Recommended Jobs List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-heading font-bold flex items-center">
                  <Zap className="w-6 h-6 text-tech-cyan mr-2" />
                  {aiRecommendedJobs.length} Intelligent Recommendations
                </h2>
                <MetallicBadge variant="tech" animated>
                  Smart Matched
                </MetallicBadge>
              </div>

              <div className="p-4 bg-glass-chrome rounded-lg mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-tech rounded-lg flex items-center justify-center mt-1">
                    <Zap className="w-4 h-4 text-void-black" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-tech-cyan mb-1">How Intelligent Matching Works</h4>
                    <p className="text-sm text-text-secondary">
                      Our intelligent system analyzes your profile, skills, experience, and preferences to find jobs that match your career goals.
                      Each recommendation includes a compatibility score and reasoning for why it's a good fit.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {aiRecommendedJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <MetallicCard
                      className="cursor-pointer transition-all hover:border-tech-cyan"
                      onClick={() => setSelectedJob(job)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-text-primary">{job.title}</h3>
                            {job.isFeatured && (
                              <MetallicBadge variant="tech" size="sm">Featured</MetallicBadge>
                            )}
                            <MetallicBadge variant="chrome" size="sm">
                              Smart Match
                            </MetallicBadge>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-text-secondary mb-3">
                            <span className="flex items-center">
                              <Building className="w-4 h-4 mr-1" />
                              {job.company}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {job.location}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              2 days ago
                            </span>
                          </div>

                          {/* AI Reasoning */}
                          <div className="p-3 bg-tech-cyan/10 border border-tech-cyan/20 rounded-lg mb-3">
                            <p className="text-sm text-tech-cyan font-medium mb-1">
                              Why this matches you:
                            </p>
                            <p className="text-xs text-text-secondary italic">
                              "{job.aiReason}"
                            </p>
                          </div>

                          <div className="flex items-center space-x-6 text-sm">
                            <span className="flex items-center text-tech-cyan font-medium">
                              <DollarSign className="w-4 h-4 mr-1" />
                              {job.salary}
                            </span>
                            <span className="text-text-tertiary">{job.jobType}</span>
                            <span className="text-text-tertiary">{job.experience}</span>
                            {job.isRemote && (
                              <MetallicBadge variant="tech" size="sm">Remote</MetallicBadge>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-tech-cyan mb-1">
                            {job.matchingScore}%
                          </div>
                          <div className="text-xs text-text-tertiary">Match score</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-text-tertiary">
                          <span className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {job.applicationCount} applicants
                          </span>
                          <span className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {job.viewCount} views
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                            <MetallicButton
                              variant="ghost"
                              size="sm"
                            >
                              <Heart className={`w-4 h-4 ${job.saved ? 'fill-current text-state-error' : ''}`} />
                            </MetallicButton>
                          </div>

                          <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                            <MetallicButton
                              variant="tech"
                              size="sm"
                            >
                              Apply Now
                            </MetallicButton>
                          </div>
                        </div>
                      </div>
                    </MetallicCard>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* AI Job Analysis Sidebar */}
            <div className="sticky top-24">
              {selectedJob ? (
                <MetallicCard className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-heading font-bold mb-2">{selectedJob.title}</h2>
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-tech-cyan font-medium">{selectedJob.company}</span>
                        <span className="text-text-tertiary">•</span>
                        <span className="text-text-secondary">{selectedJob.location}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedJob(null)}
                      className="text-text-tertiary hover:text-text-primary"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Intelligent Analysis Section */}
                  <div className="p-4 bg-gradient-to-r from-tech-cyan/10 to-chrome/10 border border-tech-cyan/20 rounded-lg mb-6">
                    <div className="flex items-center mb-3">
                      <Zap className="w-5 h-5 text-tech-cyan mr-2" />
                      <h3 className="font-semibold text-tech-cyan">Match Analysis</h3>
                    </div>
                    <p className="text-sm text-text-secondary mb-3">
                      {selectedJob.profileMatch}
                    </p>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-tech-cyan">{selectedJob.matchingScore}%</div>
                      <div className="text-xs text-text-tertiary">Compatibility Score</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-chrome">{selectedJob.applicationCount}</div>
                      <div className="text-xs text-text-tertiary">Applicants</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-chrome">{selectedJob.viewCount}</div>
                      <div className="text-xs text-text-tertiary">Views</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <MetallicButton
                      variant="tech"
                      size="lg"
                      fullWidth
                      icon={<Zap />}
                    >
                      Apply with Smart Assistance
                    </MetallicButton>

                    <div className="grid grid-cols-2 gap-3">
                      <MetallicButton
                        variant="outline"
                        size="sm"
                        icon={<Heart />}
                      >
                        {selectedJob.saved ? 'Saved' : 'Save Job'}
                      </MetallicButton>

                      <MetallicButton
                        variant="outline"
                        size="sm"
                        icon={<ExternalLink />}
                      >
                        Share Job
                      </MetallicButton>
                    </div>

                    <div className="mt-4 p-3 bg-void-shadow rounded-lg">
                      <div className="flex items-center mb-2">
                        <Target className="w-4 h-4 text-tech-cyan mr-2" />
                        <span className="text-sm font-medium">Smart Recommendation</span>
                      </div>
                      <p className="text-xs text-text-secondary">
                        This position has been specifically selected based on intelligent analysis of your profile and career goals.
                      </p>
                    </div>
                  </div>
                </MetallicCard>
              ) : (
                <MetallicCard className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-tech rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-void-black" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Smart Job Analysis</h3>
                  <p className="text-text-secondary mb-4">
                    Click on any recommended job to see detailed compatibility analysis and matching insights.
                  </p>
                  <MetallicBadge variant="tech" size="sm">
                    Intelligent Insights
                  </MetallicBadge>
                </MetallicCard>
              )}
            </div>
          </div>
        </div>
      </section>

      <ChromeSeparator className="my-8" />
    </div>
  );
};

export default JobSearchPage;

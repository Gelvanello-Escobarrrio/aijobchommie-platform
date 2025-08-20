import { motion } from 'framer-motion';
import {
  BarChart3,
  Bell,
  Briefcase,
  Calendar,
  Clock,
  Eye,
  FileText,
  Heart,
  MapPin,
  Plus,
  Target,
  TrendingUp,
  User,
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
  MetallicProgress
} from '../components/ui/MetallicComponents';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [user] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    profileCompletion: 75,
    subscriptionPlan: 'Professional',
    memberSince: '2024-01-15'
  });

  const [stats] = useState({
    jobsApplied: 23,
    jobsViewed: 156,
    profileViews: 89,
    matchingScore: 87,
    applicationResponse: 34,
    savedJobs: 12
  });

  const [recentApplications] = useState([
    {
      id: '1',
      jobTitle: 'Senior React Developer',
      company: 'TechCorp SA',
      location: 'Cape Town, WC',
      appliedDate: '2024-01-20',
      status: 'under_review',
      matchingScore: 94,
      salary: 'R45,000 - R65,000'
    },
    {
      id: '2',
      jobTitle: 'Full Stack Developer',
      company: 'Digital Solutions',
      location: 'Johannesburg, GP',
      appliedDate: '2024-01-18',
      status: 'shortlisted',
      matchingScore: 89,
      salary: 'R40,000 - R55,000'
    },
    {
      id: '3',
      jobTitle: 'Frontend Developer',
      company: 'StartupXYZ',
      location: 'Durban, KZN',
      appliedDate: '2024-01-15',
      status: 'interviewed',
      matchingScore: 91,
      salary: 'R35,000 - R50,000'
    }
  ]);

  const [aiRecommendations] = useState([
    {
      id: '1',
      jobTitle: 'JavaScript Developer',
      company: 'Innovation Labs',
      location: 'Cape Town, WC',
      matchingScore: 96,
      reason: 'Perfect match for your React and TypeScript skills',
      salary: 'R50,000 - R70,000',
      postedDate: '2024-01-22',
      isNew: true
    },
    {
      id: '2',
      jobTitle: 'Product Manager',
      company: 'Growth Co.',
      location: 'Johannesburg, GP',
      matchingScore: 88,
      reason: 'Your leadership experience aligns well',
      salary: 'R60,000 - R80,000',
      postedDate: '2024-01-21',
      isNew: true
    },
    {
      id: '3',
      jobTitle: 'Tech Lead',
      company: 'Enterprise Solutions',
      location: 'Pretoria, GP',
      matchingScore: 92,
      reason: 'Seeking someone with your full-stack background',
      salary: 'R65,000 - R85,000',
      postedDate: '2024-01-20',
      isNew: false
    }
  ]);

  const [notifications] = useState([
    {
      id: '1',
      type: 'application',
      title: 'Application Update',
      message: 'TechCorp SA viewed your application for Senior React Developer',
      time: '2 hours ago',
      unread: true
    },
    {
      id: '2',
      type: 'match',
      title: 'New Job Match',
      message: '3 new jobs match your preferences',
      time: '5 hours ago',
      unread: true
    },
    {
      id: '3',
      type: 'profile',
      title: 'Profile Tip',
      message: 'Add your portfolio to increase matches by 40%',
      time: '1 day ago',
      unread: false
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'under_review': return 'tech-cyan';
      case 'shortlisted': return 'state-warning';
      case 'interviewed': return 'state-success';
      case 'hired': return 'state-success';
      case 'rejected': return 'state-error';
      default: return 'text-tertiary';
    }
  };

  const getStatusText = (status: string) => {
    return status.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary relative overflow-hidden">
      {/* Ambient Lighting Effects */}
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
                  Welcome back, {user.name}! 👋
                </h1>
                <p className="text-text-secondary">
                  Here's what's happening with your job search today.
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <MetallicBadge variant="tech">{user.subscriptionPlan}</MetallicBadge>
                                 <MetallicButton
                   variant="tech"
                   size="sm"
                   onClick={() => navigate('/jobs')}
                   icon={<Zap />}
                 >
                   Smart Recommendations
                 </MetallicButton>
              </div>
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
              <MetallicCard className="text-center">
                <div className="text-tech-cyan text-3xl mb-3">
                  <Briefcase className="mx-auto" />
                </div>
                <div className="text-2xl font-bold text-chrome mb-1">{stats.jobsApplied}</div>
                <div className="text-sm text-text-tertiary">Jobs Applied</div>
              </MetallicCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <MetallicCard className="text-center">
                <div className="text-tech-cyan text-3xl mb-3">
                  <Eye className="mx-auto" />
                </div>
                <div className="text-2xl font-bold text-chrome mb-1">{stats.jobsViewed}</div>
                <div className="text-sm text-text-tertiary">Jobs Viewed</div>
              </MetallicCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <MetallicCard className="text-center">
                <div className="text-tech-cyan text-3xl mb-3">
                  <Users className="mx-auto" />
                </div>
                <div className="text-2xl font-bold text-chrome mb-1">{stats.profileViews}</div>
                <div className="text-sm text-text-tertiary">Profile Views</div>
              </MetallicCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <MetallicCard className="text-center">
                <div className="text-tech-cyan text-3xl mb-3">
                  <Target className="mx-auto" />
                </div>
                <div className="text-2xl font-bold text-chrome mb-1">{stats.matchingScore}%</div>
                <div className="text-sm text-text-tertiary">Match Score</div>
              </MetallicCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="section-responsive">
        <div className="responsive-container">
          <div className="grid-responsive-2 gap-8">

            {/* Left Column */}
            <div className="space-y-8">

              {/* Profile Completion */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <MetallicCard>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-heading font-bold">Profile Completion</h3>
                    <MetallicBadge variant="chrome">{user.profileCompletion}%</MetallicBadge>
                  </div>

                  <MetallicProgress
                    value={user.profileCompletion}
                    max={100}
                    size="lg"
                    variant="tech"
                    className="mb-4"
                  />

                  <p className="text-text-secondary text-sm mb-4">
                    Complete your profile to get 40% more job matches and increase your visibility to employers.
                  </p>

                  <MetallicButton
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/profile')}
                    icon={<User />}
                  >
                    Complete Profile
                  </MetallicButton>
                </MetallicCard>
              </motion.div>

              {/* Recent Applications */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <MetallicCard>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-heading font-bold">Recent Applications</h3>
                    <MetallicButton
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/applications')}
                    >
                      View All
                    </MetallicButton>
                  </div>

                  <div className="space-y-4">
                    {recentApplications.map((app) => (
                      <div key={app.id} className="border border-border-light rounded-lg p-4 hover:border-tech-cyan transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-text-primary">{app.jobTitle}</h4>
                            <p className="text-sm text-text-secondary">{app.company}</p>
                          </div>
                          <MetallicBadge
                            variant="tech"
                            size="sm"
                          >
                            {app.matchingScore}% match
                          </MetallicBadge>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4 text-text-tertiary">
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {app.location}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {app.appliedDate}
                            </span>
                          </div>
                          <span className={`text-${getStatusColor(app.status)} font-medium`}>
                            {getStatusText(app.status)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </MetallicCard>
              </motion.div>

              {/* Career Insights */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <MetallicCard>
                  <h3 className="text-xl font-heading font-bold mb-4">Career Insights</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-void-shadow rounded-lg">
                      <div className="flex items-center">
                        <TrendingUp className="w-5 h-5 text-state-success mr-3" />
                        <span className="text-sm">Application Response Rate</span>
                      </div>
                      <span className="text-state-success font-bold">{stats.applicationResponse}%</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-void-shadow rounded-lg">
                      <div className="flex items-center">
                        <Heart className="w-5 h-5 text-state-error mr-3" />
                        <span className="text-sm">Saved Jobs</span>
                      </div>
                      <span className="text-tech-cyan font-bold">{stats.savedJobs}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-void-shadow rounded-lg">
                      <div className="flex items-center">
                        <BarChart3 className="w-5 h-5 text-tech-cyan mr-3" />
                        <span className="text-sm">Average Match Score</span>
                      </div>
                      <span className="text-tech-cyan font-bold">{stats.matchingScore}%</span>
                    </div>
                  </div>
                </MetallicCard>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">

              {/* AI Recommendations */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <MetallicCard>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-heading font-bold flex items-center">
                      <Zap className="w-6 h-6 text-tech-cyan mr-2" />
                      AI Recommendations
                    </h3>
                    <MetallicBadge variant="tech" animated>
                      {aiRecommendations.filter(r => r.isNew).length} New
                    </MetallicBadge>
                  </div>

                  <div className="space-y-4">
                    {aiRecommendations.map((job) => (
                      <div key={job.id} className="border border-border-light rounded-lg p-4 hover:border-tech-cyan transition-colors cursor-pointer">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center">
                              <h4 className="font-semibold text-text-primary">{job.jobTitle}</h4>
                              {job.isNew && (
                                <MetallicBadge variant="tech" size="sm" className="ml-2">New</MetallicBadge>
                              )}
                            </div>
                            <p className="text-sm text-text-secondary">{job.company}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-tech-cyan">{job.matchingScore}% match</div>
                            <div className="text-xs text-text-tertiary">{job.postedDate}</div>
                          </div>
                        </div>

                        <p className="text-sm text-text-secondary mb-3 italic">
                          "{job.reason}"
                        </p>

                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center text-text-tertiary">
                            <MapPin className="w-4 h-4 mr-1" />
                            {job.location}
                          </span>
                          <span className="text-tech-cyan font-medium">{job.salary}</span>
                        </div>

                        <div className="mt-3 flex space-x-2">
                          <MetallicButton variant="tech" size="sm" fullWidth>
                            Apply Now
                          </MetallicButton>
                          <MetallicButton variant="outline" size="sm">
                            <Heart className="w-4 h-4" />
                          </MetallicButton>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <MetallicButton
                      variant="outline"
                      onClick={() => navigate('/jobs')}
                      icon={<Plus />}
                    >
                      View More Recommendations
                    </MetallicButton>
                  </div>
                </MetallicCard>
              </motion.div>

              {/* Notifications */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <MetallicCard>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-heading font-bold flex items-center">
                      <Bell className="w-6 h-6 text-tech-cyan mr-2" />
                      Notifications
                    </h3>
                    <MetallicBadge variant="tech">
                      {notifications.filter(n => n.unread).length} unread
                    </MetallicBadge>
                  </div>

                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div key={notification.id} className={`p-3 rounded-lg border transition-colors ${notification.unread ? 'bg-void-shadow border-tech-cyan' : 'bg-transparent border-border-light'}`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-sm text-text-primary">{notification.title}</h4>
                            <p className="text-xs text-text-secondary mt-1">{notification.message}</p>
                          </div>
                          <div className="flex items-center">
                            {notification.unread && (
                              <div className="w-2 h-2 bg-tech-cyan rounded-full mr-2"></div>
                            )}
                            <span className="text-xs text-text-tertiary">{notification.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 text-center">
                    <MetallicButton variant="ghost" size="sm">
                      View All Notifications
                    </MetallicButton>
                  </div>
                </MetallicCard>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <MetallicCard>
                  <h3 className="text-xl font-heading font-bold mb-6">Quick Actions</h3>

                  <div className="grid grid-cols-2 gap-3">
                                       <MetallicButton
                     variant="outline"
                     size="sm"
                     onClick={() => navigate('/jobs')}
                     icon={<Zap />}
                   >
                     Smart Jobs
                   </MetallicButton>

                    <MetallicButton
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/profile')}
                      icon={<User />}
                    >
                      Edit Profile
                    </MetallicButton>

                    <MetallicButton
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/upload')}
                      icon={<FileText />}
                    >
                      Upload CV
                    </MetallicButton>

                    <MetallicButton
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/settings')}
                      icon={<Clock />}
                    >
                      Job Alerts
                    </MetallicButton>
                  </div>
                </MetallicCard>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Separator */}
      <ChromeSeparator className="my-8" />
    </div>
  );
};

export default DashboardPage;

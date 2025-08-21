import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Briefcase,
  Camera,
  CheckCircle,
  Edit3,
  Eye,
  FileText,
  Github,
  Globe,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Star,
  Target,
  TrendingUp,
  Upload,
  User
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

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  // prevent unused variable TS error
  void navigate;
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+27 82 123 4567',
    location: 'Cape Town, Western Cape',
    bio: 'Passionate full-stack developer with 5+ years of experience building scalable web applications. Love working with React, Node.js, and modern technologies.',
    title: 'Senior Full Stack Developer',
    profilePicture: null,
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    portfolio: 'https://johndoe.dev'
  });

  const [experience] = useState([
    {
      id: '1',
      company: 'TechCorp SA',
      position: 'Senior Developer',
      location: 'Cape Town, WC',
      startDate: '2022-03',
      endDate: null,
      current: true,
      description: 'Lead frontend development team, architected scalable React applications'
    },
    {
      id: '2',
      company: 'Digital Agency',
      position: 'Full Stack Developer',
      location: 'Johannesburg, GP',
      startDate: '2020-01',
      endDate: '2022-02',
      current: false,
      description: 'Developed and maintained multiple client websites and web applications'
    }
  ]);

  const [education] = useState([
    {
      id: '1',
      institution: 'University of Cape Town',
      degree: 'Bachelor of Computer Science',
      field: 'Computer Science',
      startDate: '2016',
      endDate: '2019',
      grade: 'Cum Laude'
    }
  ]);

  const [skills] = useState([
    { name: 'React', level: 90, endorsed: 12 },
    { name: 'TypeScript', level: 85, endorsed: 8 },
    { name: 'Node.js', level: 80, endorsed: 10 },
    { name: 'Python', level: 75, endorsed: 6 },
    { name: 'PostgreSQL', level: 70, endorsed: 5 },
    { name: 'AWS', level: 65, endorsed: 4 }
  ]);

  const completionData = {
    overall: 85,
    sections: {
      basicInfo: 100,
      experience: 90,
      education: 80,
      skills: 75,
      portfolio: 60
    }
  };

  const analytics = {
    profileViews: 89,
    searchAppearances: 156,
    applicationSuccess: 34,
    skillsRanking: 'Top 15%'
  };

  const handleSave = () => {
    setEditing(false);
    // Save profile data
  };

  const handleFileUpload = (type: 'resume' | 'picture') => {
    // Handle file upload
    console.log(`Upload ${type}`);
  };

  const getCompletionTip = () => {
    if (completionData.sections.portfolio < 80) {
      return 'Add portfolio projects to increase your visibility by 40%';
    }
    if (completionData.sections.skills < 80) {
      return 'Add more skills to improve job matching accuracy';
    }
    return 'Your profile looks great! Keep it updated with new experiences.';
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <User /> },
    { id: 'experience', label: 'Experience', icon: <Briefcase /> },
    { id: 'education', label: 'Education', icon: <GraduationCap /> },
    { id: 'skills', label: 'Skills', icon: <Star /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp /> }
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
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-heading font-bold text-chrome mb-2">
                  My Profile
                </h1>
                <p className="text-text-secondary">
                  Manage your professional information and career details.
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <MetallicBadge variant="tech">
                  {completionData.overall}% Complete
                </MetallicBadge>

                {editing ? (
                  <div className="flex space-x-2">
                    <MetallicButton
                      variant="outline"
                      onClick={() => setEditing(false)}
                    >
                      Cancel
                    </MetallicButton>
                    <MetallicButton
                      variant="tech"
                      onClick={handleSave}
                      icon={<Save />}
                    >
                      Save Changes
                    </MetallicButton>
                  </div>
                ) : (
                  <MetallicButton
                    variant="tech"
                    onClick={() => setEditing(true)}
                    icon={<Edit3 />}
                  >
                    Edit Profile
                  </MetallicButton>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Profile Header Card */}
      <section className="section-responsive">
        <div className="responsive-container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <MetallicCard className="p-8 mb-8" glow="medium">
              <div className="flex items-start space-x-6">
                {/* Profile Picture */}
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-chrome rounded-full flex items-center justify-center text-void-black font-bold text-2xl">
                    {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                  </div>
                  {editing && (
                    <button
                      onClick={() => handleFileUpload('picture')}
                      className="absolute -bottom-2 -right-2 w-8 h-8 bg-tech-cyan rounded-full flex items-center justify-center text-void-black hover:bg-chrome transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Basic Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-2xl font-heading font-bold text-chrome">
                      {profile.firstName} {profile.lastName}
                    </h2>
                    <MetallicBadge variant="tech">Verified</MetallicBadge>
                  </div>

                  <p className="text-lg text-tech-cyan font-medium mb-3">{profile.title}</p>

                  <div className="flex items-center space-x-6 text-sm text-text-secondary mb-4">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {profile.location}
                    </span>
                    <span className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {profile.email}
                    </span>
                    <span className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {profile.phone}
                    </span>
                  </div>

                  {/* Social Links */}
                  <div className="flex items-center space-x-4">
                    {profile.linkedin && (
                      <a
                        href={profile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-tech-cyan hover:text-chrome transition-colors"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {profile.github && (
                      <a
                        href={profile.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-tech-cyan hover:text-chrome transition-colors"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {profile.portfolio && (
                      <a
                        href={profile.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-tech-cyan hover:text-chrome transition-colors"
                      >
                        <Globe className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Profile Completion */}
                <div className="w-64">
                  <h3 className="font-semibold mb-3">Profile Completion</h3>
                  <MetallicProgress
                    value={completionData.overall}
                    max={100}
                    size="md"
                    variant="tech"
                    label={`${completionData.overall}%`}
                    showValue={true}
                    className="mb-3"
                  />
                  <p className="text-xs text-text-secondary">
                    {getCompletionTip()}
                  </p>
                </div>
              </div>
            </MetallicCard>
          </motion.div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="section-responsive">
        <div className="responsive-container">
          <div className="flex space-x-1 mb-8 overflow-x-auto">
            {tabs.map((tab) => (
              <MetallicButton
                key={tab.id}
                variant={activeTab === tab.id ? "tech" : "ghost"}
                onClick={() => setActiveTab(tab.id)}
                icon={tab.icon}
                className="whitespace-nowrap"
              >
                {tab.label}
              </MetallicButton>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="section-responsive">
        <div className="responsive-container">
          {activeTab === 'overview' && (
            <div className="grid-responsive-2 gap-8">
              {/* About */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <MetallicCard>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-heading font-bold">About</h3>
                    <MetallicBadge variant="chrome">
                      {completionData.sections.basicInfo}% Complete
                    </MetallicBadge>
                  </div>

                  {editing ? (
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3 bg-void-shadow border border-border-light rounded-md focus:border-tech-cyan focus:ring-1 focus:ring-tech-cyan transition-all text-text-primary resize-vertical"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-text-secondary leading-relaxed">{profile.bio}</p>
                  )}
                </MetallicCard>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <MetallicCard>
                  <h3 className="text-xl font-heading font-bold mb-6">Profile Analytics</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-tech-cyan">{analytics.profileViews}</div>
                      <div className="text-sm text-text-tertiary">Profile Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-tech-cyan">{analytics.searchAppearances}</div>
                      <div className="text-sm text-text-tertiary">Search Results</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-tech-cyan">{analytics.applicationSuccess}%</div>
                      <div className="text-sm text-text-tertiary">Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-tech-cyan">{analytics.skillsRanking}</div>
                      <div className="text-sm text-text-tertiary">Skills Rank</div>
                    </div>
                  </div>
                </MetallicCard>
              </motion.div>
            </div>
          )}

          {activeTab === 'experience' && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <MetallicCard>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-heading font-bold">Work Experience</h3>
                  <div className="flex items-center space-x-3">
                    <MetallicBadge variant="chrome">
                      {completionData.sections.experience}% Complete
                    </MetallicBadge>
                    <MetallicButton
                      variant="tech"
                      size="sm"
                      icon={<Plus />}
                    >
                      Add Experience
                    </MetallicButton>
                  </div>
                </div>

                <div className="space-y-6">
                  {experience.map((exp) => (
                    <div key={exp.id} className="border border-border-light rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-text-primary">{exp.position}</h4>
                          <p className="text-tech-cyan font-medium">{exp.company}</p>
                          <p className="text-sm text-text-secondary">{exp.location}</p>
                        </div>

                        <div className="text-right">
                          <div className="text-sm text-text-secondary">
                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                          </div>
                          {exp.current && (
                            <MetallicBadge variant="tech" size="sm">Current</MetallicBadge>
                          )}
                        </div>
                      </div>

                      <p className="text-text-secondary">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </MetallicCard>
            </motion.div>
          )}

          {activeTab === 'skills' && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <MetallicCard>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-heading font-bold">Skills & Expertise</h3>
                  <div className="flex items-center space-x-3">
                    <MetallicBadge variant="chrome">
                      {completionData.sections.skills}% Complete
                    </MetallicBadge>
                    <MetallicButton
                      variant="tech"
                      size="sm"
                      icon={<Plus />}
                    >
                      Add Skill
                    </MetallicButton>
                  </div>
                </div>

                <div className="grid-responsive-2 gap-6">
                  {skills.map((skill, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-text-primary">{skill.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-text-tertiary">{skill.endorsed} endorsements</span>
                          <Star className="w-4 h-4 text-tech-cyan" />
                        </div>
                      </div>

                      <MetallicProgress
                        value={skill.level}
                        max={100}
                        size="sm"
                        variant="tech"
                      />
                    </div>
                  ))}
                </div>
              </MetallicCard>
            </motion.div>
          )}

          {activeTab === 'education' && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <MetallicCard>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-heading font-bold">Education</h3>
                  <div className="flex items-center space-x-3">
                    <MetallicBadge variant="chrome">
                      {completionData.sections.education}% Complete
                    </MetallicBadge>
                    <MetallicButton
                      variant="tech"
                      size="sm"
                      icon={<Plus />}
                    >
                      Add Education
                    </MetallicButton>
                  </div>
                </div>

                <div className="space-y-6">
                  {education.map((edu) => (
                    <div key={edu.id} className="border border-border-light rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-text-primary">{edu.degree}</h4>
                          <p className="text-tech-cyan font-medium">{edu.institution}</p>
                          <p className="text-sm text-text-secondary">{edu.field}</p>
                          {edu.grade && (
                            <MetallicBadge variant="tech" size="sm" className="mt-2">
                              {edu.grade}
                            </MetallicBadge>
                          )}
                        </div>

                        <div className="text-right text-sm text-text-secondary">
                          {edu.startDate} - {edu.endDate}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </MetallicCard>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <div className="grid-responsive-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <MetallicCard>
                  <h3 className="text-xl font-heading font-bold mb-6">Profile Performance</h3>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-void-shadow rounded-lg">
                      <div className="flex items-center">
                        <Eye className="w-6 h-6 text-tech-cyan mr-3" />
                        <div>
                          <div className="font-medium">Profile Views</div>
                          <div className="text-sm text-text-tertiary">Last 30 days</div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-tech-cyan">{analytics.profileViews}</div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-void-shadow rounded-lg">
                      <div className="flex items-center">
                        <Target className="w-6 h-6 text-tech-cyan mr-3" />
                        <div>
                          <div className="font-medium">Search Appearances</div>
                          <div className="text-sm text-text-tertiary">In employer searches</div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-tech-cyan">{analytics.searchAppearances}</div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-void-shadow rounded-lg">
                      <div className="flex items-center">
                        <TrendingUp className="w-6 h-6 text-state-success mr-3" />
                        <div>
                          <div className="font-medium">Application Success Rate</div>
                          <div className="text-sm text-text-tertiary">Interviews to applications</div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-state-success">{analytics.applicationSuccess}%</div>
                    </div>
                  </div>
                </MetallicCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <MetallicCard>
                  <h3 className="text-xl font-heading font-bold mb-6">Recommendations</h3>

                  <div className="space-y-4">
                    <div className="p-4 border border-tech-cyan rounded-lg">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="w-5 h-5 text-state-success mr-2" />
                        <span className="font-medium">Profile Optimization</span>
                      </div>
                      <p className="text-sm text-text-secondary">
                        Add 2-3 more skills to improve your match score with job opportunities.
                      </p>
                    </div>

                    <div className="p-4 border border-state-warning rounded-lg">
                      <div className="flex items-center mb-2">
                        <AlertTriangle className="w-5 h-5 text-state-warning mr-2" />
                        <span className="font-medium">Portfolio Missing</span>
                      </div>
                      <p className="text-sm text-text-secondary">
                        Adding a portfolio can increase your profile views by 40%.
                      </p>
                    </div>

                    <div className="p-4 border border-tech-cyan rounded-lg">
                      <div className="flex items-center mb-2">
                        <FileText className="w-5 h-5 text-tech-cyan mr-2" />
                        <span className="font-medium">Resume Update</span>
                      </div>
                      <p className="text-sm text-text-secondary">
                        Upload an updated CV to keep your profile current.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <MetallicButton
                      variant="tech"
                      fullWidth
                      icon={<Upload />}
                      onClick={() => handleFileUpload('resume')}
                    >
                      Upload Updated Resume
                    </MetallicButton>
                  </div>
                </MetallicCard>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      <ChromeSeparator className="my-8" />
    </div>
  );
};

export default ProfilePage;

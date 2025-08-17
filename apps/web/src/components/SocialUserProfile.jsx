import React, { useState, useEffect } from 'react';
import { User, MapPin, Briefcase, Calendar, Link, Edit, Camera, Trophy, Users, Star, MessageSquare, Share2, Settings, Shield, Globe, Phone, Mail, Github, Linkedin, Twitter, Instagram, Award, Target, TrendingUp, Heart, BookOpen, Zap } from 'lucide-react';

const SocialUserProfile = ({ userId, isOwner = false }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [connections, setConnections] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    loadUserProfile();
    loadConnections();
    loadAchievements();
    loadUserPosts();
  }, [userId]);

  const loadUserProfile = async () => {
    try {
      const response = await fetch(`/api/social/profile/${userId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      } else {
        setProfile(getFallbackProfile());
      }
    } catch (error) {
      setProfile(getFallbackProfile());
    } finally {
      setLoading(false);
    }
  };

  const loadConnections = async () => {
    try {
      const response = await fetch(`/api/social/connections/${userId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setConnections(data.connections);
      }
    } catch (error) {
      console.error('Failed to load connections');
    }
  };

  const loadAchievements = async () => {
    try {
      const response = await fetch(`/api/social/achievements/${userId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAchievements(data.achievements);
      } else {
        setAchievements(getFallbackAchievements());
      }
    } catch (error) {
      setAchievements(getFallbackAchievements());
    }
  };

  const loadUserPosts = async () => {
    try {
      const response = await fetch(`/api/social/posts/user/${userId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      } else {
        setPosts(getFallbackPosts());
      }
    } catch (error) {
      setPosts(getFallbackPosts());
    }
  };

  const getFallbackProfile = () => ({
    id: userId,
    name: 'Thabo Mthembu',
    title: 'Senior React Developer',
    company: 'TechFlow SA',
    location: 'Cape Town, South Africa',
    bio: 'Passionate developer building the future of South African tech. Love braai, rugby, and clean code! 🇿🇦',
    avatar: '/api/placeholder/150/150',
    coverPhoto: '/api/placeholder/800/300',
    joinedDate: '2023-01-15',
    verified: true,
    stats: {
      connections: 234,
      posts: 45,
      likes: 892,
      profileViews: 1432
    },
    skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'GraphQL'],
    experience: [
      {
        title: 'Senior React Developer',
        company: 'TechFlow SA',
        startDate: '2022-01',
        current: true,
        description: 'Leading frontend development for fintech applications'
      },
      {
        title: 'Full Stack Developer',
        company: 'Innovation Labs',
        startDate: '2020-06',
        endDate: '2021-12',
        description: 'Built scalable web applications using React and Node.js'
      }
    ],
    education: [
      {
        institution: 'University of Cape Town',
        degree: 'BSc Computer Science',
        year: '2020',
        honors: 'Cum Laude'
      }
    ],
    socialLinks: {
      github: 'github.com/thabo-dev',
      linkedin: 'linkedin.com/in/thabo-mthembu',
      twitter: '@thabo_codes',
      portfolio: 'thabo.dev'
    },
    interests: ['Open Source', 'AI/ML', 'Fintech', 'Rugby', 'Photography'],
    languages: ['English', 'Afrikaans', 'isiXhosa'],
    contactInfo: {
      email: 'thabo@example.com',
      phone: '+27 82 123 4567',
      website: 'thabo.dev'
    }
  });

  const getFallbackAchievements = () => [
    {
      id: 1,
      title: 'Job Search Champion',
      description: 'Applied to 50+ jobs',
      icon: '🎯',
      earnedDate: '2024-01-15',
      rarity: 'common'
    },
    {
      id: 2,
      title: 'Network Builder',
      description: 'Connected with 100+ professionals',
      icon: '🤝',
      earnedDate: '2024-02-20',
      rarity: 'uncommon'
    },
    {
      id: 3,
      title: 'Content Creator',
      description: 'Posted 25+ helpful career tips',
      icon: '✍️',
      earnedDate: '2024-03-10',
      rarity: 'rare'
    },
    {
      id: 4,
      title: 'Interview Master',
      description: 'Completed AI interview prep course',
      icon: '🎓',
      earnedDate: '2024-02-05',
      rarity: 'uncommon'
    }
  ];

  const getFallbackPosts = () => [
    {
      id: 1,
      type: 'success_story',
      title: 'Just landed my dream job at TechFlow! 🎉',
      content: 'After 3 months of job hunting using AI Job Chommie, I finally got my dream role! The AI recommendations were spot-on, and the community support was amazing. Lekker grateful! 🇿🇦',
      timestamp: '2024-01-20T10:30:00Z',
      likes: 127,
      comments: 23,
      shares: 8,
      tags: ['success', 'gratitude', 'react-developer']
    },
    {
      id: 2,
      type: 'tip',
      title: 'Pro tip: How to ace technical interviews',
      content: 'Just completed 5 technical interviews this week. Here are my top tips:\n\n1. Practice coding challenges daily\n2. Understand the company\'s tech stack\n3. Ask clarifying questions\n4. Think out loud during problem-solving\n\nWhat worked for you? Drop your tips below! 👇',
      timestamp: '2024-01-15T14:22:00Z',
      likes: 89,
      comments: 31,
      shares: 15,
      tags: ['interview-tips', 'technical-interviews', 'career-advice']
    }
  ];

  const handleConnect = async () => {
    try {
      await fetch(`/api/social/connect/${userId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      loadConnections();
    } catch (error) {
      console.error('Failed to connect');
    }
  };

  const ProfileHeader = () => (
    <div className="relative">
      {/* Cover Photo */}
      <div className="h-48 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-t-xl relative overflow-hidden">
        <img 
          src={profile.coverPhoto} 
          alt="Cover" 
          className="w-full h-full object-cover opacity-50"
        />
        {isOwner && (
          <button className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors">
            <Camera className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Profile Info */}
      <div className="relative px-6 pb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 relative z-10">
          {/* Avatar */}
          <div className="relative mb-4 md:mb-0">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg"
            />
            {profile.verified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full">
                <Shield className="h-4 w-4" />
              </div>
            )}
            {isOwner && (
              <button className="absolute bottom-2 right-2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors">
                <Camera className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Action Buttons */}
          {!isOwner ? (
            <div className="flex space-x-3">
              <button
                onClick={handleConnect}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all flex items-center"
              >
                <Users className="h-4 w-4 mr-2" />
                Connect
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Message
              </button>
              <button className="border border-gray-300 text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
              <button className="border border-gray-300 text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Settings className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Profile Details */}
        <div className="mt-4">
          <div className="flex items-center mb-2">
            <h1 className="text-3xl font-bold text-gray-900 mr-3">{profile.name}</h1>
            {profile.verified && (
              <div className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </div>
            )}
          </div>
          
          <p className="text-xl text-gray-700 mb-2">{profile.title}</p>
          
          <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
            <div className="flex items-center">
              <Briefcase className="h-4 w-4 mr-1" />
              {profile.company}
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {profile.location}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Joined {new Date(profile.joinedDate).toLocaleDateString()}
            </div>
          </div>

          <p className="text-gray-700 mb-4 leading-relaxed">{profile.bio}</p>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 py-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{profile.stats.connections}</div>
              <div className="text-sm text-gray-600">Connections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{profile.stats.posts}</div>
              <div className="text-sm text-gray-600">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{profile.stats.likes}</div>
              <div className="text-sm text-gray-600">Likes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{profile.stats.profileViews}</div>
              <div className="text-sm text-gray-600">Views</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ProfileTabs = () => (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex space-x-8">
        {[
          { id: 'overview', label: 'Overview', icon: User },
          { id: 'experience', label: 'Experience', icon: Briefcase },
          { id: 'achievements', label: 'Achievements', icon: Trophy },
          { id: 'posts', label: 'Posts', icon: MessageSquare },
          { id: 'connections', label: 'Network', icon: Users }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                activeTab === tab.id
                  ? 'border-cyan-500 text-cyan-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );

  const OverviewTab = () => (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        {/* Skills */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-yellow-500" />
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-green-500" />
            Recent Posts
          </h3>
          <div className="space-y-4">
            {posts.slice(0, 2).map((post) => (
              <div key={post.id} className="border-l-4 border-cyan-500 pl-4">
                <h4 className="font-medium mb-2">{post.title}</h4>
                <p className="text-gray-600 text-sm mb-3">{post.content.substring(0, 200)}...</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    {post.likes}
                  </span>
                  <span className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {post.comments}
                  </span>
                  <span>{new Date(post.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Contact Info */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Phone className="h-5 w-5 mr-2 text-blue-500" />
            Contact
          </h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-3 text-gray-400" />
              <span className="text-sm">{profile.contactInfo.email}</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-3 text-gray-400" />
              <span className="text-sm">{profile.contactInfo.phone}</span>
            </div>
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-3 text-gray-400" />
              <span className="text-sm">{profile.contactInfo.website}</span>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Link className="h-5 w-5 mr-2 text-purple-500" />
            Social Links
          </h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <Github className="h-4 w-4 mr-3 text-gray-800" />
              <span className="text-sm">{profile.socialLinks.github}</span>
            </div>
            <div className="flex items-center">
              <Linkedin className="h-4 w-4 mr-3 text-blue-600" />
              <span className="text-sm">{profile.socialLinks.linkedin}</span>
            </div>
            <div className="flex items-center">
              <Twitter className="h-4 w-4 mr-3 text-blue-400" />
              <span className="text-sm">{profile.socialLinks.twitter}</span>
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-orange-500" />
            Interests
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const AchievementsTab = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {achievements.map((achievement) => (
        <div
          key={achievement.id}
          className={`bg-white rounded-lg p-6 border-2 ${
            achievement.rarity === 'rare' 
              ? 'border-purple-200 bg-purple-50' 
              : achievement.rarity === 'uncommon'
              ? 'border-blue-200 bg-blue-50'
              : 'border-gray-200'
          }`}
        >
          <div className="text-center">
            <div className="text-4xl mb-3">{achievement.icon}</div>
            <h3 className="font-semibold text-lg mb-2">{achievement.title}</h3>
            <p className="text-gray-600 text-sm mb-3">{achievement.description}</p>
            <div className="flex items-center justify-center space-x-2">
              <Award className={`h-4 w-4 ${
                achievement.rarity === 'rare' ? 'text-purple-500' :
                achievement.rarity === 'uncommon' ? 'text-blue-500' : 'text-gray-400'
              }`} />
              <span className={`text-xs font-medium ${
                achievement.rarity === 'rare' ? 'text-purple-600' :
                achievement.rarity === 'uncommon' ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Earned {new Date(achievement.earnedDate).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="bg-gray-200 h-48 rounded-t-xl"></div>
          <div className="space-y-3">
            <div className="bg-gray-200 h-8 w-1/3 rounded"></div>
            <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
            <div className="bg-gray-200 h-4 w-full rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
        <ProfileHeader />
      </div>

      <ProfileTabs />

      <div className="bg-gray-50 rounded-xl p-6">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'achievements' && <AchievementsTab />}
        {activeTab === 'posts' && (
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Posts</h3>
            <p className="text-gray-600">Share your career journey and connect with others</p>
          </div>
        )}
        {activeTab === 'experience' && (
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Experience</h3>
            <p className="text-gray-600">Professional experience and education details</p>
          </div>
        )}
        {activeTab === 'connections' && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Network</h3>
            <p className="text-gray-600">Professional connections and recommendations</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialUserProfile;

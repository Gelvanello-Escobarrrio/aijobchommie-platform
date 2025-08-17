import React, { useState, useEffect } from 'react';
import { Trophy, Star, Users, Calendar, MapPin, Briefcase, Heart, MessageSquare, Share2, Plus, Filter, Search, Award, TrendingUp, Zap, Target, CheckCircle, Camera, Edit } from 'lucide-react';

const SuccessStorySharing = () => {
  const [stories, setStories] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    loadSuccessStories();
  }, [filter, sortBy]);

  const loadSuccessStories = async () => {
    try {
      const response = await fetch(`/api/social/success-stories?filter=${filter}&sort=${sortBy}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStories(data.stories);
      } else {
        setStories(getFallbackStories());
      }
    } catch (error) {
      setStories(getFallbackStories());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackStories = () => [
    {
      id: 1,
      userId: 'user1',
      userName: 'Thabo Mthembu',
      userAvatar: '/api/placeholder/50/50',
      userTitle: 'Senior React Developer',
      category: 'promotion',
      title: 'From Junior to Senior in 12 Months! 🚀',
      content: 'Just completed my first year at TechFlow SA and got promoted to Senior React Developer! What an incredible journey of growth and learning with an amazingly supportive team.\n\nKey success strategies:\n• Taking on exciting challenging projects\n• Asking great questions and learning from experts\n• Contributing to open source projects\n• Mentoring new interns - so rewarding!\n• Staying curious and mastering new technologies\n\nTo anyone on their career journey - keep learning, keep growing, and embrace every opportunity! The growth mindset creates amazing results. 💪\n\n#CareerGrowth #ReactDeveloper #TechLife #SouthAfrica',
      company: 'TechFlow SA',
      previousRole: 'Junior React Developer',
      newRole: 'Senior React Developer',
      duration: '12 months',
      location: 'Cape Town, South Africa',
      timestamp: '2024-01-20T08:15:00Z',
      likes: 342,
      comments: 78,
      shares: 45,
      tags: ['promotion', 'react', 'career-growth', 'mentorship'],
      liked: false,
      achievements: ['First promotion', 'Team lead responsibilities', 'Mentoring others'],
      advice: 'Don\'t be afraid to ask questions and take on challenges that scare you a little.',
      verified: true
    },
    {
      id: 2,
      userId: 'user2',
      userName: 'Nomsa Dlamini',
      userAvatar: '/api/placeholder/50/50',
      userTitle: 'UX Designer',
      category: 'job_landed',
      title: 'Finally landed my dream UX role! 🎨✨',
      content: 'Thrilled to announce I\'ve joined Creative Agency as a Senior UX Designer! What an exciting journey of skill-building and connecting with amazing people in the design community.\n\nWhat led to this success:\n• Building a strong portfolio with real projects\n• Practicing design challenges daily - such great learning!\n• Networking within the design community\n• Learning about business impact and strategic design thinking\n• Staying focused and motivated throughout the process\n\nSpecial thanks to the AI Job Chommie community for the fantastic interview prep and incredible support. The practice sessions and feedback were invaluable!\n\nTo everyone on their job search journey - stay positive, keep building your skills, and trust the process! 🌟\n\n#UXDesign #JobSearch #DreamJob #Success #Community',
      company: 'Creative Agency',
      previousRole: 'Freelance Designer',
      newRole: 'Senior UX Designer',
      duration: '6 months search',
      location: 'Cape Town, South Africa',
      timestamp: '2024-01-18T14:30:00Z',
      likes: 289,
      comments: 65,
      shares: 32,
      tags: ['job-search', 'ux-design', 'success', 'networking'],
      liked: true,
      achievements: ['Successfully navigated multiple interviews', 'Built an impressive portfolio', 'Amazing community support'],
      advice: 'Focus on business impact in your design work, not just aesthetics.',
      verified: true
    },
    {
      id: 3,
      userId: 'user3',
      userName: 'Sipho Mabaso',
      userAvatar: '/api/placeholder/50/50',
      userTitle: 'Data Scientist',
      category: 'career_change',
      title: 'From Accounting to Data Science - Career Pivot Success! 📊',
      content: 'Amazing career transformation completed! Two years ago I was an accountant with a passion for data, and today I\'m a Data Scientist at AI Fintech Solutions with a 40% salary increase!\n\nMy successful transition strategy:\n• Started with exciting online courses (Python, SQL, ML)\n• Built 5 amazing real projects for my portfolio\n• Joined wonderful data science meetups and communities\n• Gained valuable experience through strategic project work\n• Applied strategically to roles that valued business acumen\n\nThe best part was showing employers how my finance background was a huge asset! My understanding of business metrics helped me stand out perfectly.\n\nIf you\'re thinking of switching careers, start your journey today! Stay consistent and remember - your unique background is exactly what makes you special and valuable!\n\n#CareerChange #DataScience #AccountingToTech #CareerPivot #SuccessStory',
      company: 'AI Fintech Solutions',
      previousRole: 'Senior Accountant',
      newRole: 'Data Scientist',
      duration: '2 years transition',
      location: 'Johannesburg, South Africa',
      timestamp: '2024-01-15T10:45:00Z',
      likes: 456,
      comments: 134,
      shares: 89,
      tags: ['career-change', 'data-science', 'upskilling', 'transition'],
      liked: false,
      achievements: ['40% salary increase', '5 portfolio projects', 'Career pivot'],
      advice: 'Your previous experience is an asset, not a liability. Find ways to make it relevant.',
      verified: true
    },
    {
      id: 4,
      userId: 'user4',
      userName: 'Aisha Patel',
      userAvatar: '/api/placeholder/50/50',
      userTitle: 'Product Manager',
      category: 'entrepreneurship',
      title: 'From Employee to Entrepreneur - Launched My SaaS! 💼',
      content: 'Incredible entrepreneurial journey! After 5 years as a Product Manager, I launched my own SaaS platform for South African SMEs and we hit R50k MRR in our 6th month!\n\nWhy I made this exciting jump:\n• Passionate about solving problems for SA businesses specifically\n• Had valuable industry knowledge and amazing connections\n• Built up smart savings to support the transition\n• Found an incredible co-founder with complementary tech skills\n\nKey success factors:\n• Confidence in my abilities and vision\n• Smart financial planning and preparation\n• Leveraging all my diverse skills and experience\n• Understanding the unique opportunities in local markets\n\nKey learnings and wins:\n• Validate early and often with real customers - so valuable!\n• Focus on revenue and customer success\n• Build strong relationships, not just great products\n• South African market has amazing unique opportunities\n\nTo anyone considering entrepreneurship - it\'s an incredibly rewarding journey! Plan well, leverage your strengths, and take that leap when you\'re ready!\n\n#Entrepreneurship #SaaS #ProductManagement #StartupSuccess #SouthAfricaBusiness',
      company: 'SME Solutions SA',
      previousRole: 'Senior Product Manager',
      newRole: 'Founder & CEO',
      duration: '8 months',
      location: 'Johannesburg, South Africa',
      timestamp: '2024-01-12T16:20:00Z',
      likes: 523,
      comments: 198,
      shares: 156,
      tags: ['entrepreneurship', 'saas', 'startup', 'product-management'],
      liked: true,
      achievements: ['R50k MRR', 'Successful launch', 'Team building'],
      advice: 'Validate your idea with real customers before building. Revenue beats features.',
      verified: true
    }
  ];

  const handleLike = async (storyId) => {
    try {
      await fetch(`/api/social/success-stories/${storyId}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      setStories(stories.map(story => 
        story.id === storyId 
          ? { ...story, liked: !story.liked, likes: story.liked ? story.likes - 1 : story.likes + 1 }
          : story
      ));
    } catch (error) {
      console.error('Failed to like story');
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'promotion': return <TrendingUp className="h-5 w-5" />;
      case 'job_landed': return <Target className="h-5 w-5" />;
      case 'career_change': return <Zap className="h-5 w-5" />;
      case 'entrepreneurship': return <Award className="h-5 w-5" />;
      default: return <Trophy className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'promotion': return 'bg-blue-100 text-blue-800';
      case 'job_landed': return 'bg-green-100 text-green-800';
      case 'career_change': return 'bg-purple-100 text-purple-800';
      case 'entrepreneurship': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'promotion': return 'Promotion';
      case 'job_landed': return 'Job Success';
      case 'career_change': return 'Career Change';
      case 'entrepreneurship': return 'Entrepreneurship';
      default: return 'Success';
    }
  };

  const SuccessStoryCard = ({ story }) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <img
              src={story.userAvatar}
              alt={story.userName}
              className="w-12 h-12 rounded-full mr-3"
            />
            <div>
              <div className="flex items-center">
                <h3 className="font-semibold text-gray-900">{story.userName}</h3>
                {story.verified && (
                  <CheckCircle className="h-4 w-4 text-blue-500 ml-1" />
                )}
              </div>
              <p className="text-sm text-gray-600">{story.userTitle}</p>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{new Date(story.timestamp).toLocaleDateString()}</span>
                <span className="mx-2">•</span>
                <MapPin className="h-3 w-3 mr-1" />
                <span>{story.location}</span>
              </div>
            </div>
          </div>
          
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(story.category)}`}>
            {getCategoryIcon(story.category)}
            <span className="ml-1">{getCategoryLabel(story.category)}</span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-3">{story.title}</h2>
      </div>

      {/* Career Transition Info */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-600 mb-1">From</div>
            <div className="font-medium text-gray-900">{story.previousRole}</div>
          </div>
          <div>
            <div className="text-gray-600 mb-1">To</div>
            <div className="font-medium text-gray-900">{story.newRole}</div>
          </div>
          <div>
            <div className="text-gray-600 mb-1">Company</div>
            <div className="font-medium text-gray-900">{story.company}</div>
          </div>
          <div>
            <div className="text-gray-600 mb-1">Timeline</div>
            <div className="font-medium text-gray-900">{story.duration}</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="text-gray-700 whitespace-pre-line mb-6 leading-relaxed">
          {story.content}
        </div>

        {/* Key Achievements */}
        {story.achievements && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Award className="h-4 w-4 mr-2 text-yellow-500" />
              Key Achievements
            </h4>
            <div className="space-y-2">
              {story.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{achievement}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Advice */}
        {story.advice && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              Key Advice
            </h4>
            <p className="text-blue-800 italic">"{story.advice}"</p>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {story.tags.map((tag, index) => (
            <span 
              key={index}
              className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full text-xs font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => handleLike(story.id)}
              className={`flex items-center space-x-2 ${
                story.liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
              } transition-colors`}
            >
              <Heart className={`h-5 w-5 ${story.liked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{story.likes}</span>
            </button>
            
            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
              <MessageSquare className="h-5 w-5" />
              <span className="text-sm font-medium">{story.comments}</span>
            </button>
            
            <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors">
              <Share2 className="h-5 w-5" />
              <span className="text-sm font-medium">{story.shares}</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>Inspiring story</span>
          </div>
        </div>
      </div>
    </div>
  );

  const CreateStoryModal = () => (
    showCreateModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Share Your Success Story</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>
            
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Success Category
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
                    <option value="promotion">Promotion</option>
                    <option value="job_landed">Job Success</option>
                    <option value="career_change">Career Change</option>
                    <option value="entrepreneurship">Entrepreneurship</option>
                    <option value="other">Other Achievement</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    placeholder="Your current company"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Story Title
                </label>
                <input
                  type="text"
                  placeholder="Give your success story a compelling title"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Previous Role
                  </label>
                  <input
                    type="text"
                    placeholder="Your previous position"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Role
                  </label>
                  <input
                    type="text"
                    placeholder="Your current position"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Success Story
                </label>
                <textarea
                  rows="8"
                  placeholder="Share your inspiring journey, key achievements, successful strategies, and positive advice for others. Focus on what worked well and the amazing outcomes you achieved!"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Achievements & Wins (optional)
                </label>
                <textarea
                  rows="3"
                  placeholder="List your main achievements and positive outcomes, one per line"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Best Success Advice
                </label>
                <input
                  type="text"
                  placeholder="One key piece of positive advice for others pursuing similar goals"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  placeholder="career-growth, promotion, success, achievement, inspiration (comma separated)"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="verify"
                  className="h-4 w-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                />
                <label htmlFor="verify" className="ml-2 text-sm text-gray-700">
                  I verify that this is a true, positive success story that represents my actual achievements
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all flex items-center"
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  Share Story
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-8 w-1/3 rounded mb-6"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-3"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Trophy className="h-7 w-7 text-yellow-500 mr-3" />
            Success Stories
          </h2>
          <p className="text-gray-600 mt-1">Celebrate achievements and inspire others in their career journey</p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Share Your Story
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search success stories..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="all">All Stories</option>
              <option value="promotion">Promotions</option>
              <option value="job_landed">Job Success</option>
              <option value="career_change">Career Changes</option>
              <option value="entrepreneurship">Entrepreneurship</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="inspiring">Most Inspiring</option>
            </select>
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="space-y-8">
        {stories
          .filter(story => 
            story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            story.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            story.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
          )
          .map(story => (
            <SuccessStoryCard key={story.id} story={story} />
          ))}
      </div>

      {/* Create Story Modal */}
      <CreateStoryModal />
    </div>
  );
};

export default SuccessStorySharing;

import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, TrendingUp, PlusCircle, Search, Filter, Bell, Bookmark, Share2, Heart, MessageCircle, Send, MoreHorizontal, Award, Zap, Target, Trophy } from 'lucide-react';
import SocialUserProfile from '../components/SocialUserProfile';
import CompanyReviews from '../components/CompanyReviews';
import ReferralSystem from '../components/ReferralSystem';

const SocialPage = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [feedFilter, setFeedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSocialFeed();
  }, [feedFilter]);

  const loadSocialFeed = async () => {
    try {
      const response = await fetch(`/api/social/feed?filter=${feedFilter}`, {
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
    } finally {
      setLoading(false);
    }
  };

  const getFallbackPosts = () => [
    {
      id: 1,
      userId: 'user1',
      userName: 'Thabo Mthembu',
      userAvatar: '/api/placeholder/50/50',
      userTitle: 'Senior React Developer',
      type: 'success_story',
      title: 'Career milestone achieved! ',
      content: 'Just completed my first year at TechFlow SA! What a journey it\'s been. From junior developer to senior in 12 months - the growth has been incredible. Grateful for the mentorship and opportunities. Next stop: technical lead! \n\n#CareerGrowth #TechLife #Grateful #SouthAfricaTech',
      timestamp: '2024-01-20T08:15:00Z',
      likes: 234,
      comments: 45,
      shares: 18,
      tags: ['career-growth', 'milestone', 'gratitude'],
      liked: false,
      saved: false,
      company: 'TechFlow SA'
    },
    {
      id: 2,
      userId: 'user2',
      userName: 'Nomsa Dlamini',
      userAvatar: '/api/placeholder/50/50',
      userTitle: 'UX Designer',
      type: 'tip',
      title: 'Design tip: User research in South African context 🇿🇦',
      content: 'Working on local products? Here\'s what I\'ve learned about user research in SA:\n\n1. Consider multiple languages in your interviews\n2. Account for diverse tech literacy levels\n3. Test on various device types and connection speeds\n4. Include rural and township perspectives\n5. Respect cultural contexts in design decisions\n\nOur diversity is our strength in design! What are your insights?',
      timestamp: '2024-01-19T16:30:00Z',
      likes: 178,
      comments: 67,
      shares: 24,
      tags: ['ux-design', 'user-research', 'south-africa', 'diversity'],
      liked: true,
      saved: false,
      company: 'Creative Agency'
    },
    {
      id: 3,
      userId: 'user3',
      userName: 'Sipho Mabaso',
      userAvatar: '/api/placeholder/50/50',
      userTitle: 'Data Scientist',
      type: 'job_alert',
      title: 'Hot opportunity: Senior Data Scientist at Fintech Startup! ',
      content: 'Amazing opportunity just dropped! They\'re looking for someone with Python, ML, and financial data experience. The team is growing fast and they offer equity + competitive salary. \n\nSwipe up in my bio for the application link! Who do I know that might be interested? Tag them below! \n\n#DataScience #Jobs #Fintech #ML #Python',
      timestamp: '2024-01-19T11:45:00Z',
      likes: 89,
      comments: 23,
      shares: 31,
      tags: ['job-opportunity', 'data-science', 'fintech'],
      liked: false,
      saved: true,
      company: 'AI Fintech Solutions',
      jobId: 'job123'
    },
    {
      id: 4,
      userId: 'user4',
      userName: 'Aisha Patel',
      userAvatar: '/api/placeholder/50/50',
      userTitle: 'Product Manager',
      type: 'discussion',
      title: 'Let\'s discuss: Remote work in South Africa post-2024 ',
      content: 'Interesting to see how remote work culture has evolved in SA. Some observations:\n\n More companies embracing hybrid models\n Better internet infrastructure in major cities\n Growing acceptance of work-life balance\n\n Still challenges with load shedding affecting productivity\n Timezone coordination with international teams\n Digital divide between urban and rural areas\n\nWhat\'s your experience been like? Pros and cons of remote work in SA?',
      timestamp: '2024-01-18T14:20:00Z',
      likes: 156,
      comments: 89,
      shares: 12,
      tags: ['remote-work', 'discussion', 'work-culture', 'south-africa'],
      liked: false,
      saved: false,
      company: 'Product Innovators'
    }
  ];

  const handleLikePost = async (postId) => {
    try {
      await fetch(`/api/social/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
          : post
      ));
    } catch (error) {
      console.error('Failed to like post');
    }
  };

  const handleSavePost = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, saved: !post.saved }
        : post
    ));
  };

  const PostCard = ({ post }) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      {/* Post Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <img
              src={post.userAvatar}
              alt={post.userName}
              className="w-12 h-12 rounded-full mr-3"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{post.userName}</h3>
              <p className="text-sm text-gray-600">{post.userTitle}</p>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <span>{new Date(post.timestamp).toLocaleDateString()}</span>
                {post.company && (
                  <>
                    <span className="mx-1">•</span>
                    <span>{post.company}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">{post.title}</h2>
        <div className="text-gray-700 whitespace-pre-line mb-4">
          {post.content}
        </div>

        {/* Post Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span 
              key={index}
              className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full text-xs font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Post Type Badge */}
        <div className="mb-4">
          {post.type === 'success_story' && (
            <div className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              <Trophy className="h-4 w-4 mr-1" />
              Success Story
            </div>
          )}
          {post.type === 'tip' && (
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              <Zap className="h-4 w-4 mr-1" />
              Pro Tip
            </div>
          )}
          {post.type === 'job_alert' && (
            <div className="inline-flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
              <Target className="h-4 w-4 mr-1" />
              Job Alert
            </div>
          )}
          {post.type === 'discussion' && (
            <div className="inline-flex items-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
              <MessageSquare className="h-4 w-4 mr-1" />
              Discussion
            </div>
          )}
        </div>
      </div>

      {/* Post Actions */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => handleLikePost(post.id)}
              className={`flex items-center space-x-2 ${
                post.liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
              } transition-colors`}
            >
              <Heart className={`h-5 w-5 ${post.liked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{post.likes}</span>
            </button>
            
            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm font-medium">{post.comments}</span>
            </button>
            
            <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors">
              <Share2 className="h-5 w-5" />
              <span className="text-sm font-medium">{post.shares}</span>
            </button>
          </div>
          
          <button
            onClick={() => handleSavePost(post.id)}
            className={`${
              post.saved ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
            } transition-colors`}
          >
            <Bookmark className={`h-5 w-5 ${post.saved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );

  const CreatePostModal = () => (
    showCreatePost && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Create New Post</h3>
              <button
                onClick={() => setShowCreatePost(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Post Type
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="discussion">Discussion</option>
                  <option value="success_story">Success Story</option>
                  <option value="tip">Pro Tip</option>
                  <option value="job_alert">Job Alert</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="What's on your mind?"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  rows="6"
                  placeholder="Share your thoughts, experiences, or insights..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (optional)
                </label>
                <input
                  type="text"
                  placeholder="career, tech, remote-work (comma separated)"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreatePost(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all flex items-center"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );

  const SocialFeed = () => (
    <div className="space-y-6">
      {/* Feed Controls */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={feedFilter}
              onChange={(e) => setFeedFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="all">All Posts</option>
              <option value="success_stories">Success Stories</option>
              <option value="tips">Pro Tips</option>
              <option value="discussions">Discussions</option>
              <option value="job_alerts">Job Alerts</option>
            </select>
            
            <button
              onClick={() => setShowCreatePost(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all flex items-center"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Post
            </button>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          posts
            .filter(post => 
              post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
              post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            )
            .map(post => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Users className="h-8 w-8 text-cyan-500 mr-3" />
                AI Job Chommie Social
              </h1>
              <p className="text-gray-600 mt-1">Connect, share, and grow your career with the community</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="relative p-2 text-gray-600 hover:text-cyan-500 transition-colors">
                <Bell className="h-6 w-6" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mt-6">
            <nav className="flex space-x-8">
              {[
                { id: 'feed', label: 'Social Feed', icon: MessageSquare },
                { id: 'profile', label: 'My Profile', icon: Users },
                { id: 'reviews', label: 'Company Reviews', icon: Award },
                { id: 'referrals', label: 'Referral Program', icon: Gift }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
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
        </div>

        {/* Content */}
        <div>
          {activeTab === 'feed' && <SocialFeed />}
          {activeTab === 'profile' && <SocialUserProfile userId="current-user" isOwner={true} />}
          {activeTab === 'reviews' && <CompanyReviews companyId="sample-company" companyName="TechFlow SA" />}
          {activeTab === 'referrals' && <ReferralSystem />}
        </div>

        {/* Create Post Modal */}
        <CreatePostModal />
      </div>
    </div>
  );
};

export default SocialPage;

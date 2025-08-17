import React, { useState, useEffect } from 'react';
import { Heart, Share2, Bookmark, TrendingUp, Sparkles, Target, Brain, Clock, MapPin, DollarSign, Users, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

const SmartRecommendations = ({ userId, userProfile }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedJobs, setLikedJobs] = useState(new Set());
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [userInteractions, setUserInteractions] = useState({
    likes: 0,
    saves: 0,
    views: 0,
    swipes: 0
  });
  const [algorithmStats, setAlgorithmStats] = useState({
    accuracy: 0,
    engagementRate: 0,
    cacheHitRate: 0,
    personalizedScore: 0
  });

  useEffect(() => {
    loadRecommendations();
  }, [userId, userProfile]);

  const loadRecommendations = async (refresh = false) => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/smart-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId,
          userProfile,
          refresh,
          interactions: userInteractions
        })
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations || []);
        setAlgorithmStats(data.algorithmStats || algorithmStats);
      } else {
        // Fallback recommendations
        setRecommendations(getFallbackRecommendations());
      }
    } catch (error) {
      console.error('Failed to load recommendations:', error);
      setRecommendations(getFallbackRecommendations());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackRecommendations = () => [
    {
      id: 1,
      title: "Senior React Developer",
      company: "TechFlow SA",
      location: "Cape Town",
      salary: "R55,000 - R75,000",
      match: 94,
      tags: ["React", "TypeScript", "GraphQL", "Remote"],
      reasons: ["Perfect skill match", "High growth company", "Competitive salary"],
      engagement: { likes: 127, saves: 89, views: 1432 },
      posted: "2 hours ago",
      remote: true,
      urgent: false,
      verified: true
    },
    {
      id: 2,
      title: "Full Stack JavaScript Developer",
      company: "Innovation Labs",
      location: "Johannesburg",
      salary: "R45,000 - R65,000",
      match: 91,
      tags: ["Node.js", "React", "MongoDB", "AWS"],
      reasons: ["Growing startup", "Learning opportunities", "Great team culture"],
      engagement: { likes: 203, saves: 156, views: 2134 },
      posted: "1 day ago",
      remote: false,
      urgent: true,
      verified: true
    },
    {
      id: 3,
      title: "Frontend Developer (Vue.js)",
      company: "Digital Innovations",
      location: "Durban",
      salary: "R40,000 - R55,000",
      match: 87,
      tags: ["Vue.js", "JavaScript", "SCSS", "Figma"],
      reasons: ["Creative projects", "Design collaboration", "Flexible hours"],
      engagement: { likes: 98, saves: 67, views: 876 },
      posted: "3 days ago",
      remote: true,
      urgent: false,
      verified: false
    }
  ];

  const handleLike = async (jobId) => {
    setLikedJobs(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(jobId)) {
        newLiked.delete(jobId);
      } else {
        newLiked.add(jobId);
      }
      return newLiked;
    });

    setUserInteractions(prev => ({
      ...prev,
      likes: prev.likes + (likedJobs.has(jobId) ? -1 : 1)
    }));

    // Send interaction to AI for learning
    await recordInteraction('like', jobId);
  };

  const handleSave = async (jobId) => {
    setSavedJobs(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(jobId)) {
        newSaved.delete(jobId);
      } else {
        newSaved.add(jobId);
      }
      return newSaved;
    });

    setUserInteractions(prev => ({
      ...prev,
      saves: prev.saves + (savedJobs.has(jobId) ? -1 : 1)
    }));

    await recordInteraction('save', jobId);
  };

  const handleShare = async (jobId) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this job opportunity',
          url: `${window.location.origin}/jobs/${jobId}`
        });
        await recordInteraction('share', jobId);
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/jobs/${jobId}`);
      alert('Job link copied to clipboard!');
    }
  };

  const recordInteraction = async (action, jobId) => {
    try {
      await fetch('/api/ai/record-interaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId,
          jobId,
          action,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.error('Failed to record interaction:', error);
    }
  };

  const nextRecommendation = () => {
    if (currentIndex < recommendations.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserInteractions(prev => ({ ...prev, swipes: prev.swipes + 1 }));
      recordInteraction('swipe_next', recommendations[currentIndex].id);
    }
  };

  const previousRecommendation = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setUserInteractions(prev => ({ ...prev, swipes: prev.swipes + 1 }));
      recordInteraction('swipe_prev', recommendations[currentIndex].id);
    }
  };

  const JobCard = ({ job, isActive }) => (
    <div className={`transform transition-all duration-300 ${
      isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-70'
    } bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 overflow-hidden`}>
      {/* Header */}
      <div className="relative p-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h3 className="text-xl font-bold">{job.title}</h3>
              {job.verified && <Sparkles className="h-5 w-5 ml-2 text-yellow-300" />}
            </div>
            <p className="text-cyan-100 font-medium">{job.company}</p>
            <div className="flex items-center mt-1 text-cyan-200 text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              {job.location}
              {job.remote && <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs">Remote OK</span>}
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center bg-white/20 px-3 py-2 rounded-full">
              <Target className="h-4 w-4 mr-1" />
              <span className="font-bold">{job.match}%</span>
            </div>
            {job.urgent && (
              <div className="mt-2 bg-red-500 px-2 py-1 rounded-full text-xs font-medium animate-pulse">
                URGENT
              </div>
            )}
          </div>
        </div>

        {/* Salary */}
        <div className="flex items-center text-white font-semibold">
          <DollarSign className="h-5 w-5 mr-2" />
          {job.salary}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {job.tags.map((tag, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {tag}
            </span>
          ))}
        </div>

        {/* AI Reasons */}
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <Brain className="h-5 w-5 text-purple-500 mr-2" />
            <span className="font-semibold text-gray-800">Why this matches you:</span>
          </div>
          <div className="space-y-2">
            {job.reasons.map((reason, index) => (
              <div key={index} className="flex items-center text-gray-700">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                {reason}
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Stats */}
        <div className="flex items-center justify-between text-gray-600 text-sm mb-6 bg-gray-50 rounded-lg p-3">
          <div className="flex items-center">
            <Heart className="h-4 w-4 mr-1" />
            {job.engagement.likes} likes
          </div>
          <div className="flex items-center">
            <Bookmark className="h-4 w-4 mr-1" />
            {job.engagement.saves} saves
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {job.engagement.views} views
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {job.posted}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => handleLike(job.id)}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl font-medium transition-all ${
              likedJobs.has(job.id)
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Heart className={`h-5 w-5 mr-2 ${likedJobs.has(job.id) ? 'fill-current' : ''}`} />
            {likedJobs.has(job.id) ? 'Liked' : 'Like'}
          </button>
          
          <button
            onClick={() => handleSave(job.id)}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl font-medium transition-all ${
              savedJobs.has(job.id)
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Bookmark className={`h-5 w-5 mr-2 ${savedJobs.has(job.id) ? 'fill-current' : ''}`} />
            {savedJobs.has(job.id) ? 'Saved' : 'Save'}
          </button>
          
          <button
            onClick={() => handleShare(job.id)}
            className="flex items-center justify-center py-3 px-4 rounded-xl font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>

        {/* Apply Button */}
        <button className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl">
          Apply Now
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600">AI is analyzing your profile and finding perfect matches...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a moment as we personalize your experience</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
            <Brain className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Smart Recommendations</h2>
        <p className="text-gray-600">AI-powered job matching tailored just for you</p>
      </div>

      {/* Algorithm Stats */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-purple-600">{algorithmStats.accuracy}%</div>
            <div className="text-xs text-gray-600">Match Accuracy</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-pink-600">{algorithmStats.engagementRate}%</div>
            <div className="text-xs text-gray-600">Engagement</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{algorithmStats.cacheHitRate}%</div>
            <div className="text-xs text-gray-600">Cache Hits</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{algorithmStats.personalizedScore}%</div>
            <div className="text-xs text-gray-600">Personalized</div>
          </div>
        </div>
        <div className="mt-3 text-center text-sm text-gray-600">
          <Sparkles className="h-4 w-4 inline mr-1" />
          TikTok-style algorithm with 90% cost savings through smart caching
        </div>
      </div>

      {/* Job Cards */}
      {recommendations.length > 0 ? (
        <div className="space-y-6">
          {/* Current Job Card */}
          <div className="relative">
            <JobCard job={recommendations[currentIndex]} isActive={true} />
            
            {/* Navigation */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={previousRecommendation}
                disabled={currentIndex === 0}
                className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                <ChevronUp className="h-5 w-5 mr-1" />
                Previous
              </button>

              <div className="flex items-center space-x-3">
                <span className="text-gray-600 font-medium">
                  {currentIndex + 1} of {recommendations.length}
                </span>
                <button
                  onClick={() => loadRecommendations(true)}
                  className="p-2 text-gray-600 hover:text-cyan-500 transition-colors"
                  title="Refresh recommendations"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
              </div>

              <button
                onClick={nextRecommendation}
                disabled={currentIndex === recommendations.length - 1}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all"
              >
                Next
                <ChevronDown className="h-5 w-5 ml-1" />
              </button>
            </div>
          </div>

          {/* Preview of next jobs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {recommendations.slice(currentIndex + 1, currentIndex + 3).map((job, index) => (
              <div key={job.id} className="transform scale-90 opacity-60">
                <JobCard job={job} isActive={false} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Recommendations Yet</h3>
          <p className="text-gray-600 mb-4">
            Complete your profile to get AI-powered job recommendations
          </p>
          <button
            onClick={() => loadRecommendations(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all"
          >
            Generate Recommendations
          </button>
        </div>
      )}

      {/* User Stats */}
      <div className="mt-8 bg-gray-50 rounded-xl p-4">
        <h4 className="font-semibold text-gray-800 mb-3">Your Activity</h4>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-cyan-600">{userInteractions.views}</div>
            <div className="text-xs text-gray-600">Views</div>
          </div>
          <div>
            <div className="text-lg font-bold text-red-500">{userInteractions.likes}</div>
            <div className="text-xs text-gray-600">Likes</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-500">{userInteractions.saves}</div>
            <div className="text-xs text-gray-600">Saves</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-500">{userInteractions.swipes}</div>
            <div className="text-xs text-gray-600">Swipes</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartRecommendations;

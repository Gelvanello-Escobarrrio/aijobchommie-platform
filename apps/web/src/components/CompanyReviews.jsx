import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, MessageCircle, Flag, Filter, Search, TrendingUp, Users, DollarSign, Clock, Award, AlertTriangle, CheckCircle, Building, MapPin, Calendar, Eye, Edit, Plus } from 'lucide-react';

const CompanyReviews = ({ companyId, companyName }) => {
  const [reviews, setReviews] = useState([]);
  const [companyStats, setCompanyStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reviews');
  const [sortBy, setSortBy] = useState('recent');
  const [filterBy, setFilterBy] = useState('all');
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCompanyData();
  }, [companyId]);

  const loadCompanyData = async () => {
    try {
      const [reviewsRes, statsRes] = await Promise.all([
        fetch(`/api/social/reviews/company/${companyId}?sort=${sortBy}&filter=${filterBy}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch(`/api/social/companies/${companyId}/stats`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      if (reviewsRes.ok && statsRes.ok) {
        const reviewsData = await reviewsRes.json();
        const statsData = await statsRes.json();
        setReviews(reviewsData.reviews);
        setCompanyStats(statsData.stats);
      } else {
        setReviews(getFallbackReviews());
        setCompanyStats(getFallbackStats());
      }
    } catch (error) {
      setReviews(getFallbackReviews());
      setCompanyStats(getFallbackStats());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackReviews = () => [
    {
      id: 1,
      userId: 'user1',
      userName: 'Nomsa Dlamini',
      userAvatar: '/api/placeholder/40/40',
      position: 'Software Developer',
      department: 'Engineering',
      workStatus: 'current',
      reviewDate: '2024-01-15',
      overallRating: 4.2,
      ratings: {
        workLifeBalance: 4.5,
        compensation: 3.8,
        culture: 4.6,
        management: 4.1,
        careerGrowth: 3.9
      },
      title: 'Great place for career growth!',
      pros: 'Amazing team culture, flexible working hours, and excellent learning opportunities. The company really invests in employee development and the tech stack is modern. Love the braai Fridays! 🇿🇦',
      cons: 'Salary could be more competitive compared to other tech companies. Sometimes deadlines can be quite tight.',
      advice: 'Come prepared to learn and grow. The team is very supportive but expect to be challenged.',
      helpful: 23,
      notHelpful: 2,
      verified: true,
      anonymous: false
    },
    {
      id: 2,
      userId: 'user2',
      userName: 'Pieter van der Merwe',
      userAvatar: '/api/placeholder/40/40',
      position: 'Product Manager',
      department: 'Product',
      workStatus: 'former',
      reviewDate: '2024-01-10',
      overallRating: 3.8,
      ratings: {
        workLifeBalance: 3.2,
        compensation: 4.1,
        culture: 4.2,
        management: 3.6,
        careerGrowth: 3.8
      },
      title: 'Good company but work-life balance needs improvement',
      pros: 'Competitive salary, good benefits package, smart colleagues, and interesting projects. The office in Sandton is lekker modern.',
      cons: 'Long hours are expected, especially during crunch times. Management can be a bit micromanaging at times.',
      advice: 'Great for ambitious professionals who don\'t mind working hard. Not ideal if you prioritize work-life balance.',
      helpful: 18,
      notHelpful: 5,
      verified: true,
      anonymous: false
    },
    {
      id: 3,
      userId: 'user3',
      userName: 'Anonymous',
      userAvatar: '/api/placeholder/40/40',
      position: 'Marketing Specialist',
      department: 'Marketing',
      workStatus: 'current',
      reviewDate: '2024-01-08',
      overallRating: 4.7,
      ratings: {
        workLifeBalance: 4.8,
        compensation: 4.2,
        culture: 4.9,
        management: 4.6,
        careerGrowth: 4.5
      },
      title: 'Best company culture I\'ve experienced!',
      pros: 'Outstanding company culture, very inclusive and diverse. Management genuinely cares about employees. Great benefits including medical aid and retirement contributions.',
      cons: 'Growing fast so some processes are still being refined. Office can get noisy during peak hours.',
      advice: 'Perfect place for someone looking for a supportive environment to grow their career.',
      helpful: 31,
      notHelpful: 1,
      verified: true,
      anonymous: true
    }
  ];

  const getFallbackStats = () => ({
    overallRating: 4.2,
    totalReviews: 127,
    recommendationRate: 83,
    ceoApproval: 78,
    ratingBreakdown: {
      5: 45,
      4: 38,
      3: 12,
      2: 4,
      1: 1
    },
    categoryRatings: {
      workLifeBalance: 4.1,
      compensation: 3.9,
      culture: 4.4,
      management: 4.0,
      careerGrowth: 4.2
    },
    demographics: {
      byDepartment: {
        'Engineering': 45,
        'Sales': 23,
        'Marketing': 18,
        'Operations': 15,
        'HR': 12,
        'Finance': 14
      },
      byExperience: {
        'Entry Level': 25,
        'Mid Level': 52,
        'Senior Level': 35,
        'Executive': 15
      }
    },
    trends: {
      ratingTrend: [3.8, 4.0, 4.1, 4.2, 4.2],
      months: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan']
    }
  });

  const handleVoteHelpful = async (reviewId, helpful = true) => {
    try {
      await fetch(`/api/social/reviews/${reviewId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ helpful })
      });
      loadCompanyData();
    } catch (error) {
      console.error('Failed to vote on review');
    }
  };

  const StarRating = ({ rating, size = 'sm', showNumber = true }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        <div className="flex">
          {[...Array(fullStars)].map((_, i) => (
            <Star key={i} className={`${size === 'lg' ? 'h-6 w-6' : 'h-4 w-4'} text-yellow-400 fill-current`} />
          ))}
          {hasHalfStar && (
            <Star className={`${size === 'lg' ? 'h-6 w-6' : 'h-4 w-4'} text-yellow-400 fill-current opacity-50`} />
          )}
          {[...Array(emptyStars)].map((_, i) => (
            <Star key={i} className={`${size === 'lg' ? 'h-6 w-6' : 'h-4 w-4'} text-gray-300`} />
          ))}
        </div>
        {showNumber && (
          <span className={`ml-2 text-gray-600 ${size === 'lg' ? 'text-lg' : 'text-sm'} font-medium`}>
            {rating.toFixed(1)}
          </span>
        )}
      </div>
    );
  };

  const CompanyOverview = () => (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 text-center border border-gray-200">
          <div className="flex justify-center mb-2">
            <StarRating rating={companyStats.overallRating} size="lg" />
          </div>
          <div className="text-sm text-gray-600">Overall Rating</div>
          <div className="text-xs text-gray-500 mt-1">{companyStats.totalReviews} reviews</div>
        </div>

        <div className="bg-white rounded-lg p-6 text-center border border-gray-200">
          <div className="flex items-center justify-center mb-2">
            <ThumbsUp className="h-6 w-6 text-green-500 mr-2" />
            <span className="text-2xl font-bold text-green-600">{companyStats.recommendationRate}%</span>
          </div>
          <div className="text-sm text-gray-600">Recommend</div>
          <div className="text-xs text-gray-500 mt-1">to a friend</div>
        </div>

        <div className="bg-white rounded-lg p-6 text-center border border-gray-200">
          <div className="flex items-center justify-center mb-2">
            <Award className="h-6 w-6 text-blue-500 mr-2" />
            <span className="text-2xl font-bold text-blue-600">{companyStats.ceoApproval}%</span>
          </div>
          <div className="text-sm text-gray-600">CEO Approval</div>
          <div className="text-xs text-gray-500 mt-1">rating</div>
        </div>

        <div className="bg-white rounded-lg p-6 text-center border border-gray-200">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="h-6 w-6 text-purple-500 mr-2" />
            <span className="text-2xl font-bold text-purple-600">Rising</span>
          </div>
          <div className="text-sm text-gray-600">Trend</div>
          <div className="text-xs text-gray-500 mt-1">popularity up</div>
        </div>
      </div>

      {/* Rating Breakdown */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Rating Breakdown</h3>
        <div className="space-y-3">
          {Object.entries(companyStats.ratingBreakdown).reverse().map(([stars, count]) => (
            <div key={stars} className="flex items-center">
              <span className="text-sm w-8">{stars}★</span>
              <div className="flex-1 mx-3 bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(count / companyStats.totalReviews) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 w-8">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Ratings */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Category Ratings</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(companyStats.categoryRatings).map(([category, rating]) => (
            <div key={category} className="flex items-center justify-between">
              <span className="text-sm text-gray-700 capitalize">
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <StarRating rating={rating} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ReviewsList = () => (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search reviews..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">Most Recent</option>
              <option value="helpful">Most Helpful</option>
              <option value="rating_high">Highest Rating</option>
              <option value="rating_low">Lowest Rating</option>
            </select>

            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
            >
              <option value="all">All Reviews</option>
              <option value="current">Current Employees</option>
              <option value="former">Former Employees</option>
              <option value="verified">Verified Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-6">
        {reviews.filter(review => 
          review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.pros.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.cons.toLowerCase().includes(searchQuery.toLowerCase())
        ).map((review) => (
          <div key={review.id} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
            {/* Review Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start">
                <img
                  src={review.userAvatar}
                  alt={review.userName}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium text-gray-900 mr-2">{review.userName}</h4>
                    {review.verified && (
                      <CheckCircle className="h-4 w-4 text-green-500" title="Verified Employee" />
                    )}
                    {review.anonymous && (
                      <Eye className="h-4 w-4 text-gray-400 ml-1" title="Anonymous Review" />
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span>{review.position}</span>
                    <span className="mx-2">•</span>
                    <span className="capitalize">{review.workStatus} Employee</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(review.reviewDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <StarRating rating={review.overallRating} />
              </div>
            </div>

            {/* Review Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{review.title}</h3>

            {/* Category Ratings */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
              {Object.entries(review.ratings).map(([category, rating]) => (
                <div key={category} className="text-center">
                  <div className="text-xs text-gray-600 mb-1 capitalize">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-sm font-medium">{rating.toFixed(1)}</div>
                </div>
              ))}
            </div>

            {/* Review Content */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center mb-2">
                  <ThumbsUp className="h-4 w-4 text-green-500 mr-2" />
                  <span className="font-medium text-green-700">Pros</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed pl-6">{review.pros}</p>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <ThumbsDown className="h-4 w-4 text-red-500 mr-2" />
                  <span className="font-medium text-red-700">Cons</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed pl-6">{review.cons}</p>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <MessageCircle className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="font-medium text-blue-700">Advice to Management</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed pl-6">{review.advice}</p>
              </div>
            </div>

            {/* Review Actions */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleVoteHelpful(review.id, true)}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-green-600 transition-colors"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>Helpful ({review.helpful})</span>
                </button>
                <button
                  onClick={() => handleVoteHelpful(review.id, false)}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
                >
                  <ThumbsDown className="h-4 w-4" />
                  <span>({review.notHelpful})</span>
                </button>
              </div>
              
              <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-500 transition-colors">
                <Flag className="h-4 w-4" />
                <span>Report</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="bg-gray-200 h-8 w-1/3 rounded"></div>
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-200 h-48 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Building className="h-8 w-8 text-cyan-500 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{companyName || 'Company Reviews'}</h1>
              <p className="text-gray-600">Honest reviews from current and former employees</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowWriteReview(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Write Review
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'reviews', label: 'Reviews', icon: MessageCircle },
              { id: 'salaries', label: 'Salaries', icon: DollarSign },
              { id: 'photos', label: 'Photos', icon: Eye }
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
        {activeTab === 'overview' && <CompanyOverview />}
        {activeTab === 'reviews' && <ReviewsList />}
        {activeTab === 'salaries' && (
          <div className="text-center py-12">
            <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Salary Information</h3>
            <p className="text-gray-600">Transparent salary data from employees</p>
          </div>
        )}
        {activeTab === 'photos' && (
          <div className="text-center py-12">
            <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Office Photos</h3>
            <p className="text-gray-600">See what it's like to work here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyReviews;

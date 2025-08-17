import React, { useState, useEffect } from 'react';
import { Users, Gift, Share2, Copy, Mail, MessageSquare, Trophy, TrendingUp, DollarSign, User, Check, ExternalLink, Calendar, Award, Target, Zap, Star, Crown, Medal } from 'lucide-react';

const ReferralSystem = () => {
  const [referralData, setReferralData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteMethod, setInviteMethod] = useState('link');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadReferralData();
  }, []);

  const loadReferralData = async () => {
    try {
      const response = await fetch('/api/social/referrals/my-data', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setReferralData(data);
      } else {
        setReferralData(getFallbackData());
      }
    } catch (error) {
      setReferralData(getFallbackData());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackData = () => ({
    user: {
      name: 'Thabo Mthembu',
      tier: 'Gold Referrer',
      nextTier: 'Platinum Referrer',
      progress: 7,
      nextTierTarget: 10,
      totalEarnings: 2450
    },
    stats: {
      totalReferrals: 7,
      successfulReferrals: 5,
      pendingReferrals: 2,
      totalEarnings: 2450,
      thisMonthEarnings: 450,
      conversionRate: 71,
      averageReward: 350
    },
    referrals: [
      {
        id: 1,
        name: 'Nomsa Dlamini',
        email: 'nomsa@example.com',
        status: 'successful',
        joinedDate: '2024-01-15',
        reward: 500,
        avatar: '/api/placeholder/40/40',
        milestones: ['signed_up', 'completed_profile', 'first_job_applied']
      },
      {
        id: 2,
        name: 'Pieter van der Merwe',
        email: 'pieter@example.com',
        status: 'successful',
        joinedDate: '2024-01-10',
        reward: 500,
        avatar: '/api/placeholder/40/40',
        milestones: ['signed_up', 'completed_profile', 'first_job_applied', 'got_first_job']
      },
      {
        id: 3,
        name: 'Lindiwe Khumalo',
        email: 'lindiwe@example.com',
        status: 'pending',
        invitedDate: '2024-01-20',
        reward: 0,
        avatar: '/api/placeholder/40/40',
        milestones: ['signed_up', 'completed_profile']
      },
      {
        id: 4,
        name: 'Sipho Mabaso',
        email: 'sipho@example.com',
        status: 'pending',
        invitedDate: '2024-01-18',
        reward: 0,
        avatar: '/api/placeholder/40/40',
        milestones: ['signed_up']
      }
    ],
    rewards: [
      { amount: 500, description: 'Friend completed profile + first application', date: '2024-01-16', status: 'paid' },
      { amount: 500, description: 'Friend got their first job through AI Job Chommie', date: '2024-01-12', status: 'paid' },
      { amount: 350, description: 'Bonus: Friend became premium subscriber', date: '2024-01-08', status: 'paid' },
      { amount: 200, description: 'Monthly referral bonus', date: '2024-01-01', status: 'paid' }
    ],
    referralLink: 'https://aijobchommie.co.za/invite/thabo-mthembu-xyz123',
    leaderboard: [
      { name: 'Sarah Johnson', referrals: 23, earnings: 'R8,500', tier: 'Diamond', avatar: '/api/placeholder/40/40' },
      { name: 'Thabo Mthembu', referrals: 7, earnings: 'R2,450', tier: 'Gold', avatar: '/api/placeholder/40/40', isMe: true },
      { name: 'Aisha Patel', referrals: 15, earnings: 'R5,200', tier: 'Platinum', avatar: '/api/placeholder/40/40' },
      { name: 'James Williams', referrals: 12, earnings: 'R4,100', tier: 'Silver', avatar: '/api/placeholder/40/40' },
      { name: 'Fatima Ali', referrals: 9, earnings: 'R3,200', tier: 'Silver', avatar: '/api/placeholder/40/40' }
    ],
    tiers: {
      Bronze: { min: 0, benefits: ['R200 per successful referral', 'Basic referral tracking'] },
      Silver: { min: 3, benefits: ['R300 per successful referral', 'Monthly bonus', 'Priority support'] },
      Gold: { min: 5, benefits: ['R500 per successful referral', 'Premium job alerts for referrals', 'Exclusive events access'] },
      Platinum: { min: 10, benefits: ['R750 per successful referral', 'Personal referral manager', 'Custom referral materials'] },
      Diamond: { min: 20, benefits: ['R1000 per successful referral', 'VIP treatment', 'Revenue sharing program'] }
    },
    challenges: [
      {
        id: 1,
        title: 'New Year Referral Challenge',
        description: 'Refer 5 friends in January and get a bonus R1000!',
        progress: 3,
        target: 5,
        reward: 1000,
        deadline: '2024-01-31',
        active: true
      },
      {
        id: 2,
        title: 'Quality Referrer Badge',
        description: 'Maintain 80% conversion rate for 3 months',
        progress: 2,
        target: 3,
        reward: 'Special badge + R500',
        deadline: '2024-03-31',
        active: true
      }
    ]
  });

  const handleCopyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralData.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error('Failed to copy link');
    }
  };

  const handleInvite = async (method, recipients) => {
    try {
      const response = await fetch('/api/social/referrals/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ method, recipients })
      });

      if (response.ok) {
        setShowInviteModal(false);
        loadReferralData();
      }
    } catch (error) {
      console.error('Failed to send invites');
    }
  };

  const getTierIcon = (tier) => {
    switch (tier) {
      case 'Diamond': return <Crown className="h-5 w-5 text-purple-500" />;
      case 'Platinum': return <Medal className="h-5 w-5 text-gray-400" />;
      case 'Gold': return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 'Silver': return <Award className="h-5 w-5 text-gray-400" />;
      case 'Bronze': return <Star className="h-5 w-5 text-orange-500" />;
      default: return <User className="h-5 w-5 text-gray-400" />;
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Diamond': return 'from-purple-500 to-pink-500';
      case 'Platinum': return 'from-gray-400 to-gray-600';
      case 'Gold': return 'from-yellow-400 to-orange-500';
      case 'Silver': return 'from-gray-300 to-gray-500';
      case 'Bronze': return 'from-orange-400 to-red-500';
      default: return 'from-gray-200 to-gray-400';
    }
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Current Tier & Progress */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={`p-3 rounded-full bg-gradient-to-r ${getTierColor(referralData.user.tier)} mr-4`}>
              {getTierIcon(referralData.user.tier)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{referralData.user.tier}</h2>
              <p className="text-cyan-100">Total Earnings: R{referralData.user.totalEarnings.toLocaleString()}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{referralData.stats.totalReferrals}</div>
            <div className="text-cyan-100">Total Referrals</div>
          </div>
        </div>

        {/* Progress to Next Tier */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Progress to {referralData.user.nextTier}</span>
            <span>{referralData.user.progress}/{referralData.user.nextTierTarget}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-500"
              style={{ width: `${(referralData.user.progress / referralData.user.nextTierTarget) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-cyan-100 mt-2">
            {referralData.user.nextTierTarget - referralData.user.progress} more successful referrals to reach {referralData.user.nextTier}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
          <div className="flex items-center justify-center mb-2">
            <Users className="h-6 w-6 text-blue-500 mr-2" />
            <span className="text-2xl font-bold text-blue-600">{referralData.stats.successfulReferrals}</span>
          </div>
          <div className="text-sm text-gray-600">Successful</div>
          <div className="text-xs text-gray-500 mt-1">conversions</div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
          <div className="flex items-center justify-center mb-2">
            <DollarSign className="h-6 w-6 text-green-500 mr-2" />
            <span className="text-2xl font-bold text-green-600">R{referralData.stats.thisMonthEarnings}</span>
          </div>
          <div className="text-sm text-gray-600">This Month</div>
          <div className="text-xs text-gray-500 mt-1">earnings</div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="h-6 w-6 text-purple-500 mr-2" />
            <span className="text-2xl font-bold text-purple-600">{referralData.stats.conversionRate}%</span>
          </div>
          <div className="text-sm text-gray-600">Conversion</div>
          <div className="text-xs text-gray-500 mt-1">rate</div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="h-6 w-6 text-orange-500 mr-2" />
            <span className="text-2xl font-bold text-orange-600">R{referralData.stats.averageReward}</span>
          </div>
          <div className="text-sm text-gray-600">Average</div>
          <div className="text-xs text-gray-500 mt-1">per referral</div>
        </div>
      </div>

      {/* Active Challenges */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Zap className="h-5 w-5 text-yellow-500 mr-2" />
          Active Challenges
        </h3>
        <div className="space-y-4">
          {referralData.challenges.filter(c => c.active).map((challenge) => (
            <div key={challenge.id} className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium text-gray-900">{challenge.title}</h4>
                  <p className="text-sm text-gray-600">{challenge.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-yellow-600">{typeof challenge.reward === 'number' ? `R${challenge.reward}` : challenge.reward}</div>
                  <div className="text-xs text-gray-500">Reward</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-600">{challenge.progress}/{challenge.target}</span>
                </div>
                <span className="text-gray-500">Ends {new Date(challenge.deadline).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ReferralsTab = () => (
    <div className="space-y-6">
      {/* Invite Actions */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Invite Your Friends</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium mb-2">Share Referral Link</h4>
            <div className="flex">
              <input
                type="text"
                value={referralData.referralLink}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 text-sm"
              />
              <button
                onClick={handleCopyReferralLink}
                className={`px-4 py-2 rounded-r-lg transition-colors ${
                  copied ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Share this link with friends to start earning!</p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium mb-2">Send Direct Invites</h4>
            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors flex items-center justify-center">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </button>
              <button className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors flex items-center justify-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                WhatsApp
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Invite specific people directly</p>
          </div>
        </div>
      </div>

      {/* Referral History */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Your Referrals</h3>
        <div className="space-y-4">
          {referralData.referrals.map((referral) => (
            <div key={referral.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <img
                  src={referral.avatar}
                  alt={referral.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <h4 className="font-medium text-gray-900">{referral.name}</h4>
                  <p className="text-sm text-gray-600">{referral.email}</p>
                  <div className="flex items-center mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      referral.status === 'successful' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {referral.status === 'successful' ? 'Successful' : 'Pending'}
                    </span>
                    {referral.status === 'successful' && (
                      <span className="ml-2 text-xs text-gray-500">
                        Joined {new Date(referral.joinedDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-bold text-green-600">
                  {referral.reward > 0 ? `+R${referral.reward}` : 'Pending'}
                </div>
                <div className="flex items-center mt-1">
                  {referral.milestones.map((milestone, index) => (
                    <div
                      key={milestone}
                      className={`w-2 h-2 rounded-full mr-1 ${
                        index < referral.milestones.length ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                      title={milestone.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const LeaderboardTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
          Top Referrers This Month
        </h3>
        <div className="space-y-3">
          {referralData.leaderboard.map((user, index) => (
            <div
              key={user.name}
              className={`flex items-center justify-between p-4 rounded-lg ${
                user.isMe 
                  ? 'bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200' 
                  : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  index === 0 ? 'bg-yellow-500 text-white' :
                  index === 1 ? 'bg-gray-400 text-white' :
                  index === 2 ? 'bg-orange-500 text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <h4 className={`font-medium ${user.isMe ? 'text-cyan-900' : 'text-gray-900'}`}>
                    {user.name} {user.isMe && '(You)'}
                  </h4>
                  <div className="flex items-center">
                    {getTierIcon(user.tier)}
                    <span className="text-sm text-gray-600 ml-1">{user.tier}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-gray-900">{user.earnings}</div>
                <div className="text-sm text-gray-600">{user.referrals} referrals</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tier Benefits */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Tier Benefits</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(referralData.tiers).map(([tier, data]) => (
            <div
              key={tier}
              className={`p-4 rounded-lg border-2 ${
                referralData.user.tier === tier 
                  ? 'border-cyan-200 bg-cyan-50' 
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center mb-3">
                {getTierIcon(tier)}
                <h4 className="font-medium ml-2">{tier}</h4>
                {referralData.user.tier === tier && (
                  <span className="ml-2 px-2 py-1 bg-cyan-500 text-white text-xs rounded-full">Current</span>
                )}
              </div>
              <div className="text-sm text-gray-600 mb-2">{data.min}+ successful referrals</div>
              <ul className="text-xs text-gray-600 space-y-1">
                {data.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-3 w-3 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const EarningsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Recent Earnings</h3>
        <div className="space-y-4">
          {referralData.rewards.map((reward, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">+R{reward.amount}</h4>
                <p className="text-sm text-gray-600">{reward.description}</p>
                <div className="flex items-center mt-1">
                  <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-500">{new Date(reward.date).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  reward.status === 'paid' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {reward.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="bg-gray-200 h-32 rounded-xl"></div>
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-200 h-16 rounded-lg"></div>
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
            <Gift className="h-8 w-8 text-cyan-500 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Referral Program</h1>
              <p className="text-gray-600">Earn rewards by helping friends find their dream jobs</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowInviteModal(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all flex items-center"
          >
            <Share2 className="h-5 w-5 mr-2" />
            Invite Friends
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'referrals', label: 'My Referrals', icon: Users },
              { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
              { id: 'earnings', label: 'Earnings', icon: DollarSign }
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
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'referrals' && <ReferralsTab />}
        {activeTab === 'leaderboard' && <LeaderboardTab />}
        {activeTab === 'earnings' && <EarningsTab />}
      </div>
    </div>
  );
};

export default ReferralSystem;

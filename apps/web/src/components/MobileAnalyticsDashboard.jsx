import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Users, 
  Briefcase, 
  Calendar,
  Target,
  Award,
  Activity,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Share2,
  ChevronRight,
  Building,
  Zap
} from 'lucide-react';

const MobileAnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  const timeRanges = [
    { id: '7d', name: '7 Days' },
    { id: '30d', name: '30 Days' },
    { id: '90d', name: '90 Days' }
  ];

  const metricTabs = [
    { id: 'overview', name: 'Overview', icon: Activity },
    { id: 'profile', name: 'Profile', icon: Users },
    { id: 'applications', name: 'Applications', icon: Target },
    { id: 'jobs', name: 'Jobs', icon: Briefcase }
  ];

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/analytics/dashboard?range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        setAnalytics(mockAnalytics);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalytics(mockAnalytics);
    } finally {
      setLoading(false);
    }
  };

  const mockAnalytics = {
    overview: {
      totalProfileViews: { value: 1247, change: 18.5, trend: 'up' },
      totalApplications: { value: 23, change: -5.2, trend: 'down' },
      jobMatches: { value: 89, change: 12.3, trend: 'up' },
      responseRate: { value: 67.8, change: 8.7, trend: 'up' }
    },
    profileMetrics: {
      views: { value: 1247, change: 18.5, trend: 'up' },
      searches: { value: 342, change: 25.1, trend: 'up' },
      contacts: { value: 89, change: 15.3, trend: 'up' },
      completeness: { value: 85, change: 5.2, trend: 'up' }
    },
    applicationMetrics: {
      applied: { value: 23, change: -5.2, trend: 'down' },
      interviews: { value: 8, change: 14.3, trend: 'up' },
      responses: { value: 15, change: 7.1, trend: 'up' },
      offers: { value: 2, change: 0, trend: 'neutral' }
    },
    jobMetrics: {
      matches: { value: 89, change: 12.3, trend: 'up' },
      saved: { value: 34, change: -2.1, trend: 'down' },
      viewed: { value: 156, change: 20.4, trend: 'up' },
      shared: { value: 12, change: 50.0, trend: 'up' }
    },
    topCompanies: [
      { name: 'Google', applications: 3, views: 45, match: 92 },
      { name: 'Meta', applications: 2, views: 38, match: 89 },
      { name: 'Apple', applications: 2, views: 32, match: 85 },
      { name: 'Netflix', applications: 1, views: 28, match: 88 },
      { name: 'Microsoft', applications: 1, views: 25, match: 82 }
    ],
    topSkills: [
      { name: 'React', demand: 95, match: 92 },
      { name: 'JavaScript', demand: 88, match: 90 },
      { name: 'TypeScript', demand: 82, match: 85 },
      { name: 'Node.js', demand: 78, match: 80 },
      { name: 'Python', demand: 75, match: 70 }
    ],
    chartData: {
      profileViews: [120, 145, 165, 180, 195, 210, 235],
      applications: [2, 1, 4, 3, 2, 5, 6],
      jobMatches: [8, 12, 15, 18, 20, 22, 25]
    },
    insights: [
      {
        type: 'improvement',
        title: 'Profile Optimization',
        message: 'Add 2 more skills to increase your profile visibility by 15%',
        action: 'Update Skills'
      },
      {
        type: 'trend',
        title: 'Market Trend',
        message: 'React developers see 23% higher response rates this month',
        action: 'View Trends'
      },
      {
        type: 'opportunity',
        title: 'Application Timing',
        message: 'Tuesday applications have 31% higher success rates',
        action: 'Schedule Applications'
      }
    ]
  };

  const renderMetricCard = (title, data, icon, format = 'number') => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${
          data.trend === 'up' ? 'bg-green-100' : 
          data.trend === 'down' ? 'bg-red-100' : 'bg-gray-100'
        }`}>
          {React.createElement(icon, {
            size: 20,
            className: data.trend === 'up' ? 'text-green-600' : 
              data.trend === 'down' ? 'text-red-600' : 'text-gray-600'
          })}
        </div>
        <div className={`flex items-center space-x-1 text-sm ${
          data.trend === 'up' ? 'text-green-600' : 
          data.trend === 'down' ? 'text-red-600' : 'text-gray-600'
        }`}>
          {data.trend === 'up' && <ArrowUp size={16} />}
          {data.trend === 'down' && <ArrowDown size={16} />}
          <span>{Math.abs(data.change)}%</span>
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-gray-900">
          {format === 'percentage' ? `${data.value}%` : data.value.toLocaleString()}
        </h3>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </motion.div>
  );

  const renderChart = (data, label, color = 'blue') => (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-4">{label}</h3>
      <div className="h-32 flex items-end space-x-2">
        {data.map((value, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(value / Math.max(...data)) * 100}%` }}
              transition={{ delay: index * 0.1 }}
              className={`w-full bg-gradient-to-t from-${color}-500 to-${color}-400 rounded-t-sm min-h-[4px]`}
            />
            <span className="text-xs text-gray-500 mt-2">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-blue-100">Track your job search performance</p>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={fetchAnalytics}
              className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
            >
              <RefreshCw size={20} />
            </button>
            <button className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors">
              <Share2 size={20} />
            </button>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex space-x-1 bg-white bg-opacity-20 rounded-lg p-1">
          {timeRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => setTimeRange(range.id)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                timeRange === range.id
                  ? 'bg-white text-blue-600'
                  : 'text-white hover:bg-white hover:bg-opacity-10'
              }`}
            >
              {range.name}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex space-x-1 -mb-px overflow-x-auto">
          {metricTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedMetric(tab.id)}
              className={`flex items-center space-x-2 py-3 px-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                selectedMetric === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-6">
        <AnimatePresence mode="wait">
          {selectedMetric === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                {renderMetricCard('Profile Views', analytics.overview.totalProfileViews, Eye)}
                {renderMetricCard('Applications', analytics.overview.totalApplications, Target)}
                {renderMetricCard('Job Matches', analytics.overview.jobMatches, Briefcase)}
                {renderMetricCard('Response Rate', analytics.overview.responseRate, TrendingUp, 'percentage')}
              </div>

              {/* Charts */}
              <div className="space-y-4">
                {renderChart(analytics.chartData.profileViews, 'Profile Views This Week', 'blue')}
                {renderChart(analytics.chartData.applications, 'Applications This Week', 'green')}
              </div>

              {/* AI Insights */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Zap size={20} className="text-yellow-500 mr-2" />
                  AI Insights
                </h3>
                <div className="space-y-3">
                  {analytics.insights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{insight.title}</h4>
                        <p className="text-sm text-gray-600">{insight.message}</p>
                      </div>
                      <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                        {insight.action}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {selectedMetric === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Profile Metrics */}
              <div className="grid grid-cols-2 gap-4">
                {renderMetricCard('Profile Views', analytics.profileMetrics.views, Eye)}
                {renderMetricCard('Searches', analytics.profileMetrics.searches, Activity)}
                {renderMetricCard('Contacts', analytics.profileMetrics.contacts, Users)}
                {renderMetricCard('Completeness', analytics.profileMetrics.completeness, Award, 'percentage')}
              </div>

              {/* Top Skills */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Top Skills Performance</h3>
                <div className="space-y-3">
                  {analytics.topSkills.map((skill, index) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-gray-600">{skill.match}% match</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.match}%` }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-blue-600 h-2 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {selectedMetric === 'applications' && (
            <motion.div
              key="applications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Application Metrics */}
              <div className="grid grid-cols-2 gap-4">
                {renderMetricCard('Applied', analytics.applicationMetrics.applied, Target)}
                {renderMetricCard('Interviews', analytics.applicationMetrics.interviews, Calendar)}
                {renderMetricCard('Responses', analytics.applicationMetrics.responses, TrendingUp)}
                {renderMetricCard('Offers', analytics.applicationMetrics.offers, Award)}
              </div>

              {/* Top Companies */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Top Companies</h3>
                <div className="space-y-3">
                  {analytics.topCompanies.map((company, index) => (
                    <motion.div
                      key={company.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Building size={20} className="text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{company.name}</h4>
                          <p className="text-sm text-gray-600">{company.applications} applications • {company.views} views</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">{company.match}% match</div>
                        <ChevronRight size={16} className="text-gray-400 ml-auto" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {selectedMetric === 'jobs' && (
            <motion.div
              key="jobs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Job Metrics */}
              <div className="grid grid-cols-2 gap-4">
                {renderMetricCard('Matches', analytics.jobMetrics.matches, Target)}
                {renderMetricCard('Saved', analytics.jobMetrics.saved, Briefcase)}
                {renderMetricCard('Viewed', analytics.jobMetrics.viewed, Eye)}
                {renderMetricCard('Shared', analytics.jobMetrics.shared, Share2)}
              </div>

              {/* Job Match Chart */}
              {renderChart(analytics.chartData.jobMatches, 'Daily Job Matches', 'green')}

              {/* Performance Summary */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Job Search Performance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">92%</div>
                    <div className="text-sm text-green-700">Avg. Match Score</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-sm text-blue-700">Jobs per Day</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MobileAnalyticsDashboard;

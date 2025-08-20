import axios from 'axios';
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip
} from 'chart.js';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
    FiActivity,
    FiAlertTriangle,
    FiBarChart2,
    FiBell,
    FiCheckCircle,
    FiDollarSign,
    FiLayout,
    FiSearch,
    FiTarget
} from 'react-icons/fi';
import AILogo from '../components/AILogo';
import ManagerJobSearch from '../components/ManagerJobSearch';
import MobileAnalyticsDashboard from '../components/MobileAnalyticsDashboard';
import MobileNotificationCenter from '../components/MobileNotificationCenter';
import SubscriptionMilestone from '../components/SubscriptionMilestone';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, search, analytics, notifications
  const [dateRange, setDateRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Financial Data States
  const [financialData, setFinancialData] = useState({
    totalRevenue: 125840,
    monthlyRevenue: 18420,
    yearlyRevenue: 221040,
    activeSubscriptions: 847,
    churnRate: 3.2,
    averageRevenue: 217,
    growthRate: 24.5,
    projectedRevenue: 28500
  });

  // Usage Metrics States
  const [usageMetrics, setUsageMetrics] = useState({
    dailyActiveUsers: 2841,
    weeklyActiveUsers: 8542,
    monthlyActiveUsers: 12485,
    newSignups: 342,
    conversionRate: 18.4,
    avgSessionDuration: '12m 34s',
    bounceRate: 24.5,
    pageViews: 184291
  });

  // System Health States
  const [systemHealth, setSystemHealth] = useState({
    cpuUsage: 42,
    memoryUsage: 68,
    diskUsage: 34,
    apiLatency: 124,
    uptime: 99.98,
    errorRate: 0.02,
    requestsPerMinute: 2847
  });

  // Problems/Alerts States
  const [problems, setProblems] = useState([
    { id: 1, type: 'warning', title: 'High API Usage', description: 'API calls approaching monthly limit (85%)', timestamp: new Date() },
    { id: 2, type: 'info', title: 'Scheduled Maintenance', description: 'Database maintenance scheduled for Sunday 2AM', timestamp: new Date() },
    { id: 3, type: 'success', title: 'Performance Improved', description: 'Response time improved by 15% after optimization', timestamp: new Date() }
  ]);

  // User Analytics
  const [userAnalytics, setUserAnalytics] = useState({
    byPlan: { basic: 5842, premium: 6643 },
    byLocation: { 'Gauteng': 4521, 'Western Cape': 3214, 'KZN': 2841, 'Eastern Cape': 1909 },
    byIndustry: { 'IT': 3421, 'Engineering': 2841, 'Finance': 2134, 'Healthcare': 1845, 'Other': 2244 }
  });

  // Cost Tracking States
  const [costData, setCostData] = useState({
    totalCost: 0,
    budgetRemaining: 150,
    budgetUsedPercentage: 0,
    breakdown: {},
    alerts: [],
    suggestions: [],
    status: 'healthy'
  });
  const [showCostModal, setShowCostModal] = useState(false);
  const [newCostEntry, setNewCostEntry] = useState({
    serviceName: '',
    costType: '',
    amount: '',
    description: ''
  });

  useEffect(() => {
    // Fetch financial data
    const fetchFinancialData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/manager/financial`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('ajc_token')}`,
          },
        });
        setFinancialData(response.data);
      } catch (error) {
        console.error('Failed to fetch financial data:', error);
      }
    };

    // Fetch usage metrics
    const fetchUsageMetrics = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/manager/metrics`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('ajc_token')}`,
          },
        });
        setUsageMetrics(response.data);
      } catch (error) {
        console.error('Failed to fetch usage metrics:', error);
      }
    };

    // Fetch potential problems
    const fetchProblems = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/manager/problems`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('ajc_token')}`,
          },
        });
        setProblems(response.data);
      } catch (error) {
        console.error('Failed to fetch problems:', error);
      }
    };

    // Fetch cost tracking data
    const fetchCostData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/manager/cost-dashboard`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('ajc_token')}`,
          },
        });
        setCostData(response.data || costData);
      } catch (error) {
        console.error('Failed to fetch cost data:', error);
      }
    };

    fetchFinancialData();
    fetchUsageMetrics();
    fetchProblems();
    fetchCostData();
  }, []);

  // Handle adding new cost entry
  const handleAddCost = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/manager/costs/log`, newCostEntry, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('ajc_token')}`,
        },
      });
      toast.success('Cost entry added successfully!');
      setShowCostModal(false);
      setNewCostEntry({ serviceName: '', costType: '', amount: '', description: '' });
      // Refresh cost data
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/manager/cost-dashboard`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('ajc_token')}`,
        },
      });
      setCostData(response.data || costData);
    } catch (error) {
      console.error('Failed to add cost entry:', error);
      toast.error('Failed to add cost entry');
    }
  };

  // Initialize cost tracking tables
  const initializeCostTracking = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/manager/costs/initialize`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('ajc_token')}`,
        },
      });
      toast.success('Cost tracking initialized!');
    } catch (error) {
      console.error('Failed to initialize cost tracking:', error);
      toast.error('Failed to initialize cost tracking');
    }
  };

  // Get status color based on budget usage
  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'healthy': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  // Navigation items for the manager dashboard
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiLayout, description: 'Overview & Analytics' },
    { id: 'search', label: 'Job Search', icon: FiSearch, description: 'Advanced SerpAPI Search' },
    { id: 'analytics', label: 'Analytics', icon: FiBarChart2, description: 'User Analytics Dashboard' },
    { id: 'milestones', label: 'Milestones', icon: FiTarget, description: '10k Subscriber Progress' }
  ];

  // Render the appropriate view based on currentView state
  const renderCurrentView = () => {
    switch (currentView) {
      case 'search':
        return <ManagerJobSearch />;
      case 'analytics':
        return <MobileAnalyticsDashboard />;
      case 'milestones':
        return <SubscriptionMilestone />;
      default:
        return renderDashboardView();
    }
  };

  // Main dashboard view (existing content)
  const renderDashboardView = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Financial Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 p-6 rounded-lg shadow-lg border border-cyan-400/20 hover:border-cyan-400/40 transition-colors"
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <FiDollarSign className="mr-2 text-cyan-400" /> Financial Overview
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total Revenue:</span>
              <span className="text-cyan-400 font-bold">R {financialData.totalRevenue?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Monthly Revenue:</span>
              <span className="text-green-400 font-bold">R {financialData.monthlyRevenue?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Active Subscriptions:</span>
              <span className="text-blue-400 font-bold">{financialData.activeSubscriptions?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Growth Rate:</span>
              <span className="text-purple-400 font-bold">+{financialData.growthRate || 0}%</span>
            </div>
          </div>
        </motion.div>

        {/* Usage Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 p-6 rounded-lg shadow-lg border border-green-400/20 hover:border-green-400/40 transition-colors"
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <FiBarChart2 className="mr-2 text-green-400" /> Usage Metrics
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Daily Active:</span>
              <span className="text-green-400 font-bold">{usageMetrics.dailyActiveUsers?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Monthly Active:</span>
              <span className="text-blue-400 font-bold">{usageMetrics.monthlyActiveUsers?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">New Signups:</span>
              <span className="text-purple-400 font-bold">{usageMetrics.newSignups?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Conversion Rate:</span>
              <span className="text-yellow-400 font-bold">{usageMetrics.conversionRate || 0}%</span>
            </div>
          </div>
        </motion.div>

        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 p-6 rounded-lg shadow-lg border border-purple-400/20 hover:border-purple-400/40 transition-colors"
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <FiActivity className="mr-2 text-purple-400" /> System Health
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">CPU Usage:</span>
              <span className="text-blue-400 font-bold">{systemHealth.cpuUsage || 0}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Memory:</span>
              <span className="text-yellow-400 font-bold">{systemHealth.memoryUsage || 0}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Uptime:</span>
              <span className="text-green-400 font-bold">{systemHealth.uptime || 99.98}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">API Latency:</span>
              <span className="text-purple-400 font-bold">{systemHealth.apiLatency || 124}ms</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Alerts & Issues */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-900 p-6 rounded-lg shadow-lg border border-red-400/20"
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <FiAlertTriangle className="mr-2 text-red-400" /> System Alerts
        </h2>
        {problems.length > 0 ? (
          <div className="space-y-3">
            {problems.map((problem, index) => (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border-l-4 ${
                  problem.type === 'warning' ? 'border-yellow-400 bg-yellow-400/10' :
                  problem.type === 'info' ? 'border-blue-400 bg-blue-400/10' :
                  'border-green-400 bg-green-400/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{problem.title}</h4>
                    <p className="text-sm text-gray-300">{problem.description}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    problem.type === 'warning' ? 'bg-yellow-400' :
                    problem.type === 'info' ? 'bg-blue-400' :
                    'bg-green-400'
                  }`} />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-green-400 flex items-center">
            <FiCheckCircle className="mr-2" />
            All systems operational
          </p>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <button
          onClick={() => setCurrentView('search')}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105"
        >
          <FiSearch className="text-2xl mb-2" />
          <h3 className="font-semibold">Advanced Search</h3>
          <p className="text-sm text-gray-200">Full SerpAPI Access</p>
        </button>

        <button
          onClick={() => setCurrentView('analytics')}
          className="bg-gradient-to-r from-green-600 to-teal-600 p-4 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all transform hover:scale-105"
        >
          <FiBarChart2 className="text-2xl mb-2" />
          <h3 className="font-semibold">Analytics</h3>
          <p className="text-sm text-gray-200">Detailed Reports</p>
        </button>

        <button
          onClick={() => setCurrentView('milestones')}
          className="bg-gradient-to-r from-yellow-600 to-orange-600 p-4 rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-all transform hover:scale-105"
        >
          <FiTarget className="text-2xl mb-2" />
          <h3 className="font-semibold">Milestones</h3>
          <p className="text-sm text-gray-200">10k Progress</p>
        </button>

        <button
          onClick={() => setShowNotifications(true)}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105"
        >
          <FiBell className="text-2xl mb-2" />
          <h3 className="font-semibold">Notifications</h3>
          <p className="text-sm text-gray-200">System Alerts</p>
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center space-x-4">
              <AILogo size="md" />
              <div>
                <h1 className="text-3xl font-bold text-cyan-400">Manager Dashboard</h1>
                <p className="text-gray-400">Full system control and analytics</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-2">
              {navigationItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    currentView === item.id
                      ? 'bg-cyan-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <item.icon size={18} />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              ))}

              <button
                onClick={() => setShowNotifications(true)}
                className="p-2 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors relative"
              >
                <FiBell size={18} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentView()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Notifications Modal */}
      <MobileNotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
};

export default ManagerDashboard;

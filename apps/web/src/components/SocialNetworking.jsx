import React, { useState, useEffect } from 'react';
import { Users, Search, MapPin, Briefcase, MessageSquare, UserPlus, Filter, Zap, Award, Star, CheckCircle, ExternalLink, Coffee, Calendar } from 'lucide-react';

const SocialNetworking = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [skillsFilter, setSkillsFilter] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [connections, setConnections] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNetworkingData();
  }, []);

  const loadNetworkingData = async () => {
    try {
      const [suggestionsRes, connectionsRes] = await Promise.all([
        fetch('/api/social/suggestions/connections', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/social/connections/current-user', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      if (suggestionsRes.ok && connectionsRes.ok) {
        const suggestionsData = await suggestionsRes.json();
        const connectionsData = await connectionsRes.json();
        setSuggestions(suggestionsData.suggestions);
        setConnections(connectionsData.connections);
      } else {
        setSuggestions(getFallbackSuggestions());
        setConnections(getFallbackConnections());
      }
    } catch (error) {
      setSuggestions(getFallbackSuggestions());
      setConnections(getFallbackConnections());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackSuggestions = () => [
    {
      id: 'user1',
      name: 'Thandiwe Mokoena',
      title: 'Senior Data Scientist',
      company: 'AI Solutions SA',
      location: 'Pretoria, South Africa',
      avatar: '/api/placeholder/60/60',
      skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Analytics'],
      mutualConnections: 8,
      verified: true,
      reason: 'Works in similar field',
      matchScore: 92,
      experience: '5+ years',
      education: 'University of Witwatersrand'
    },
    {
      id: 'user2',
      name: 'Ryan O\'Connor',
      title: 'DevOps Engineer',
      company: 'Cloud Services Co',
      location: 'Durban, South Africa',
      avatar: '/api/placeholder/60/60',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
      mutualConnections: 3,
      verified: false,
      reason: 'Same industry',
      matchScore: 87,
      experience: '4+ years',
      education: 'University of KwaZulu-Natal'
    },
    {
      id: 'user3',
      name: 'Amara Okafor',
      title: 'Product Designer',
      company: 'Design Studio ZA',
      location: 'Cape Town, South Africa',
      avatar: '/api/placeholder/60/60',
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
      mutualConnections: 12,
      verified: true,
      reason: 'Similar interests',
      matchScore: 89,
      experience: '6+ years',
      education: 'Cape Town Creative Academy'
    },
    {
      id: 'user4',
      name: 'Kobus van der Merwe',
      title: 'Full Stack Developer',
      company: 'Tech Startup',
      location: 'Johannesburg, South Africa',
      avatar: '/api/placeholder/60/60',
      skills: ['React', 'Node.js', 'TypeScript', 'GraphQL'],
      mutualConnections: 5,
      verified: false,
      reason: 'Tech stack overlap',
      matchScore: 94,
      experience: '3+ years',
      education: 'University of Johannesburg'
    }
  ];

  const getFallbackConnections = () => [
    {
      id: 'conn1',
      name: 'Nomsa Dlamini',
      title: 'UX Designer',
      company: 'Creative Agency',
      location: 'Cape Town, South Africa',
      avatar: '/api/placeholder/50/50',
      connectedDate: '2024-01-15',
      status: 'active',
      lastActive: '2 hours ago'
    },
    {
      id: 'conn2',
      name: 'Pieter van der Merwe',
      title: 'Product Manager',
      company: 'Tech Startup',
      location: 'Johannesburg, South Africa',
      avatar: '/api/placeholder/50/50',
      connectedDate: '2024-01-10',
      status: 'active',
      lastActive: '1 day ago'
    },
    {
      id: 'conn3',
      name: 'Sarah Johnson',
      title: 'Software Architect',
      company: 'Enterprise Solutions',
      location: 'Pretoria, South Africa',
      avatar: '/api/placeholder/50/50',
      connectedDate: '2024-01-08',
      status: 'active',
      lastActive: '3 days ago'
    }
  ];

  const handleConnect = async (userId) => {
    try {
      await fetch(`/api/social/connect/${userId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      // Update suggestions to show connection sent
      setSuggestions(suggestions.map(user => 
        user.id === userId ? { ...user, connectionSent: true } : user
      ));
    } catch (error) {
      console.error('Failed to connect');
    }
  };

  const handleSearch = async () => {
    try {
      const params = new URLSearchParams({
        query: searchQuery,
        location: locationFilter,
        skills: skillsFilter
      });
      
      const response = await fetch(`/api/social/users/search?${params}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.users);
      }
    } catch (error) {
      console.error('Search failed');
    }
  };

  const UserCard = ({ user, showConnectButton = true, showMatchScore = false }) => (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full mr-4"
            />
            {user.verified && (
              <CheckCircle className="absolute -bottom-1 -right-1 h-5 w-5 text-blue-500 bg-white rounded-full" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 flex items-center">
              {user.name}
              {showMatchScore && (
                <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  {user.matchScore}% match
                </span>
              )}
            </h3>
            <p className="text-gray-600 font-medium">{user.title}</p>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Briefcase className="h-4 w-4 mr-1" />
              <span className="mr-3">{user.company}</span>
              <MapPin className="h-4 w-4 mr-1" />
              <span>{user.location}</span>
            </div>
            {user.experience && (
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Award className="h-4 w-4 mr-1" />
                <span className="mr-3">{user.experience}</span>
                {user.education && (
                  <>
                    <Zap className="h-4 w-4 mr-1" />
                    <span>{user.education}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        
        {showMatchScore && user.reason && (
          <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {user.reason}
          </div>
        )}
      </div>

      {/* Skills */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {user.skills && user.skills.slice(0, 4).map((skill, index) => (
            <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
              {skill}
            </span>
          ))}
          {user.skills && user.skills.length > 4 && (
            <span className="text-xs text-gray-500">+{user.skills.length - 4} more</span>
          )}
        </div>
      </div>

      {/* Mutual Connections */}
      {user.mutualConnections > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            <Users className="h-4 w-4 inline mr-1" />
            {user.mutualConnections} mutual connection{user.mutualConnections !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Connection Info */}
      {user.connectedDate && (
        <div className="mb-4 text-sm text-gray-500">
          <Calendar className="h-4 w-4 inline mr-1" />
          Connected {new Date(user.connectedDate).toLocaleDateString()}
          {user.lastActive && (
            <span className="ml-2">• Last active {user.lastActive}</span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center space-x-2">
        {showConnectButton && !user.connectionSent ? (
          <button
            onClick={() => handleConnect(user.id)}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all flex items-center justify-center"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Connect
          </button>
        ) : user.connectionSent ? (
          <button
            disabled
            className="flex-1 bg-gray-100 text-gray-600 px-4 py-2 rounded-lg flex items-center justify-center"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Request Sent
          </button>
        ) : (
          <button className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all flex items-center justify-center">
            <MessageSquare className="h-4 w-4 mr-2" />
            Message
          </button>
        )}
        
        <button className="border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          <ExternalLink className="h-4 w-4" />
        </button>
        
        {user.coffeeChat && (
          <button className="border border-orange-300 text-orange-700 px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors">
            <Coffee className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );

  const SearchSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Find Professionals</h3>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search by name or title
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="e.g. React Developer"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="">All locations</option>
              <option value="Cape Town">Cape Town</option>
              <option value="Johannesburg">Johannesburg</option>
              <option value="Pretoria">Pretoria</option>
              <option value="Durban">Durban</option>
              <option value="Port Elizabeth">Port Elizabeth</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills
            </label>
            <input
              type="text"
              placeholder="e.g. React, Python, UX"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              value={skillsFilter}
              onChange={(e) => setSkillsFilter(e.target.value)}
            />
          </div>
        </div>
        
        <button
          onClick={handleSearch}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all"
        >
          Search Professionals
        </button>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Search Results</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {searchResults.map(user => (
              <UserCard key={user.id} user={user} showConnectButton={true} />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const SuggestionsSection = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-2">✨ AI-Powered Recommendations</h3>
        <p className="text-purple-100">We've found professionals who match your skills, interests, and career goals!</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {suggestions.map(user => (
          <UserCard key={user.id} user={user} showConnectButton={true} showMatchScore={true} />
        ))}
      </div>
    </div>
  );

  const ConnectionsSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Your Network</h3>
        <div className="text-sm text-gray-600">
          {connections.length} connection{connections.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      {connections.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {connections.map(user => (
            <UserCard key={user.id} user={user} showConnectButton={false} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No connections yet</h3>
          <p className="text-gray-600 mb-6">Start building your professional network by connecting with others</p>
          <button
            onClick={() => setActiveTab('discover')}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all"
          >
            Discover People
          </button>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-8 w-1/3 rounded mb-4"></div>
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-start mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mr-4"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'discover', label: 'Discover', icon: Zap },
            { id: 'search', label: 'Search', icon: Search },
            { id: 'connections', label: 'My Network', icon: Users }
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

      {/* Content */}
      <div>
        {activeTab === 'discover' && <SuggestionsSection />}
        {activeTab === 'search' && <SearchSection />}
        {activeTab === 'connections' && <ConnectionsSection />}
      </div>
    </div>
  );
};

export default SocialNetworking;

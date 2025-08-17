import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Bot, User, Search, MapPin, Filter, Sparkles, TrendingUp, Zap, Clock } from 'lucide-react';

const AIJobSearchChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Sawubona! 🇿🇦 I'm your AI Job Chommie powered by cutting-edge AI! Ask me anything about jobs in South Africa - I understand natural language and can help you find the perfect opportunity. Try saying something like 'Find me software developer jobs in Cape Town with good salary' or 'What remote work is available?'",
      timestamp: new Date(),
      suggestions: [
        "Find me software jobs in Johannesburg",
        "Remote work opportunities in marketing",
        "Entry-level positions near me",
        "High-paying finance jobs in Cape Town"
      ],
      cacheInfo: { cached: false, responseTime: 0 }
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    salary: '',
    jobType: '',
    experience: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [aiStats, setAiStats] = useState({
    totalQueries: 0,
    cachedResponses: 0,
    avgResponseTime: 0,
    costSavings: 0
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Call Hugging Face AI service with caching
  const callAIService = async (userMessage) => {
    const startTime = Date.now();
    
    try {
      const response = await fetch('/api/ai/chat-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationHistory,
          userContext: searchFilters
        })
      });

      if (!response.ok) {
        throw new Error('AI service unavailable');
      }

      const data = await response.json();
      const responseTime = Date.now() - startTime;
      
      // Update AI stats
      setAiStats(prev => ({
        totalQueries: prev.totalQueries + 1,
        cachedResponses: data.cached ? prev.cachedResponses + 1 : prev.cachedResponses,
        avgResponseTime: Math.round((prev.avgResponseTime + responseTime) / 2),
        costSavings: prev.costSavings + (data.cached ? 0.02 : 0)
      }));

      return {
        ...data,
        responseTime,
        cached: data.cached || false
      };
    } catch (error) {
      console.error('AI service error:', error);
      return generateFallbackResponse(userMessage);
    }
  };

  // Fallback response when AI service is down
  const generateFallbackResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    let jobs = [];
    let suggestions = [];

    if (lowerMessage.includes('software') || lowerMessage.includes('developer')) {
      response = "Eish! The AI is a bit slow right now, but I found some lekker software opportunities for you:";
      jobs = [
        { title: "Senior React Developer", company: "TechCorp SA", location: "Cape Town", salary: "R45,000 - R65,000", match: 95, tags: ['React', 'JavaScript', 'Remote OK'] },
        { title: "Full Stack Developer", company: "Innovation Labs", location: "Johannesburg", salary: "R40,000 - R55,000", match: 88, tags: ['Node.js', 'Python', 'MongoDB'] },
        { title: "Frontend Developer", company: "Digital Solutions", location: "Durban", salary: "R35,000 - R50,000", match: 82, tags: ['Vue.js', 'CSS3', 'TypeScript'] }
      ];
    } else if (lowerMessage.includes('remote')) {
      response = "Sharp! Even with the AI taking a coffee break, here are some remote opportunities:";
      jobs = [
        { title: "Remote Data Analyst", company: "Global Tech", location: "Remote (SA)", salary: "R38,000 - R48,000", match: 90, tags: ['Python', 'SQL', 'Remote'] },
        { title: "Content Writer (Remote)", company: "Media Company", location: "Remote", salary: "R28,000 - R38,000", match: 84, tags: ['Writing', 'SEO', 'Remote'] }
      ];
    } else {
      response = `Just now the AI will be back to full power! Meanwhile, here are some opportunities based on "${userMessage}":`;
      jobs = [
        { title: "Great Opportunity", company: "Growing Company", location: "Major City", salary: "Competitive", match: 87, tags: ['Growth', 'Benefits'] }
      ];
    }

    suggestions = [
      "Try a specific job title",
      "Tell me your preferred location",
      "What industry interests you?",
      "Help me improve my CV"
    ];

    return {
      response,
      jobs,
      suggestions,
      intent: ['job_search'],
      confidence: 0.7,
      cached: false,
      responseTime: 500,
      fallback: true
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setConversationHistory(prev => [...prev, inputMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Call AI service
    const aiResponse = await callAIService(inputMessage);
    
    const aiMessage = {
      id: Date.now() + 1,
      type: 'ai',
      content: aiResponse.response,
      timestamp: new Date(),
      jobs: aiResponse.jobs || [],
      suggestions: aiResponse.suggestions || [],
      intent: aiResponse.intent || [],
      confidence: aiResponse.confidence || 0.7,
      cacheInfo: {
        cached: aiResponse.cached,
        responseTime: aiResponse.responseTime,
        fallback: aiResponse.fallback || false
      }
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-ZA';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
      };

      recognition.start();
    } else {
      alert('Voice recognition not supported in this browser. Try Chrome or Edge.');
    }
  };

  const JobCard = ({ job }) => (
    <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-cyan-300">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight">{job.title}</h3>
        <div className="flex items-center bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
          <Sparkles className="h-3 w-3 mr-1" />
          {job.match}% match
        </div>
      </div>
      
      <p className="text-cyan-600 text-sm font-medium mb-1">{job.company}</p>
      
      <div className="flex items-center text-gray-600 text-sm mb-2">
        <MapPin className="h-3 w-3 mr-1" />
        {job.location}
      </div>
      
      <p className="text-gray-800 font-medium text-sm mb-3">{job.salary}</p>
      
      {job.tags && (
        <div className="flex flex-wrap gap-1 mb-3">
          {job.tags.map((tag, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-2">
        <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-3 rounded-lg text-xs font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 flex items-center justify-center">
          <TrendingUp className="h-3 w-3 mr-1" />
          Apply Now
        </button>
        <button className="border border-gray-300 text-gray-700 py-2 px-3 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors flex items-center justify-center">
          <Search className="h-3 w-3 mr-1" />
          View Details
        </button>
      </div>
    </div>
  );

  const CacheIndicator = ({ cacheInfo }) => (
    <div className="flex items-center text-xs text-gray-500 mt-1">
      {cacheInfo.cached ? (
        <>
          <Zap className="h-3 w-3 mr-1 text-green-500" />
          <span className="text-green-600">Cached response</span>
        </>
      ) : cacheInfo.fallback ? (
        <>
          <Clock className="h-3 w-3 mr-1 text-orange-500" />
          <span className="text-orange-600">Fallback mode</span>
        </>
      ) : (
        <>
          <Bot className="h-3 w-3 mr-1 text-blue-500" />
          <span className="text-blue-600">AI generated</span>
        </>
      )}
      <span className="ml-2">{cacheInfo.responseTime}ms</span>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header with AI Stats */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="bg-white/20 p-2 rounded-lg mr-3">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI Job Search Chat</h2>
              <p className="text-cyan-100 text-sm">Powered by Hugging Face AI with smart caching</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <div className="text-center">
              <div className="font-bold">{aiStats.totalQueries}</div>
              <div className="text-cyan-200">Queries</div>
            </div>
            <div className="text-center">
              <div className="font-bold">{aiStats.cachedResponses}</div>
              <div className="text-cyan-200">Cached</div>
            </div>
            <div className="text-center">
              <div className="font-bold">{aiStats.avgResponseTime}ms</div>
              <div className="text-cyan-200">Avg Time</div>
            </div>
            <div className="text-center">
              <div className="font-bold">${aiStats.costSavings.toFixed(2)}</div>
              <div className="text-cyan-200">Saved</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white/20 rounded-lg p-3 text-sm">
          <div className="flex items-center mb-1">
            <Sparkles className="h-4 w-4 mr-1" />
            <span className="font-medium">Cache Hit Rate: {aiStats.totalQueries > 0 ? Math.round((aiStats.cachedResponses / aiStats.totalQueries) * 100) : 0}%</span>
          </div>
          <div className="text-cyan-100 text-xs">
            Smart caching reduces AI costs by up to 90% while maintaining lightning-fast responses!
          </div>
        </div>

        {/* Filters */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="mt-3 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center text-sm"
        >
          <Filter className="h-4 w-4 mr-2" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
        
        {showFilters && (
          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Location (e.g., Cape Town)"
              className="bg-white/20 text-white placeholder-cyan-100 px-3 py-2 rounded-lg text-sm"
              value={searchFilters.location}
              onChange={(e) => setSearchFilters({...searchFilters, location: e.target.value})}
            />
            <input
              type="text"
              placeholder="Salary (e.g., R30k-R50k)"
              className="bg-white/20 text-white placeholder-cyan-100 px-3 py-2 rounded-lg text-sm"
              value={searchFilters.salary}
              onChange={(e) => setSearchFilters({...searchFilters, salary: e.target.value})}
            />
            <select
              className="bg-white/20 text-white px-3 py-2 rounded-lg text-sm"
              value={searchFilters.jobType}
              onChange={(e) => setSearchFilters({...searchFilters, jobType: e.target.value})}
            >
              <option value="" className="text-gray-800">Job Type</option>
              <option value="full-time" className="text-gray-800">Full-time</option>
              <option value="part-time" className="text-gray-800">Part-time</option>
              <option value="remote" className="text-gray-800">Remote</option>
              <option value="contract" className="text-gray-800">Contract</option>
            </select>
            <select
              className="bg-white/20 text-white px-3 py-2 rounded-lg text-sm"
              value={searchFilters.experience}
              onChange={(e) => setSearchFilters({...searchFilters, experience: e.target.value})}
            >
              <option value="" className="text-gray-800">Experience</option>
              <option value="entry" className="text-gray-800">Entry Level</option>
              <option value="mid" className="text-gray-800">Mid Level</option>
              <option value="senior" className="text-gray-800">Senior Level</option>
            </select>
          </div>
        )}
      </div>

      {/* Messages Container */}
      <div className="h-96 md:h-[600px] overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${message.type === 'user' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : 'bg-white border border-gray-200'} rounded-2xl p-4 shadow-sm`}>
              <div className="flex items-start">
                <div className={`p-2 rounded-full mr-3 ${message.type === 'user' ? 'bg-blue-600' : 'bg-gradient-to-r from-cyan-500 to-blue-500'}`}>
                  {message.type === 'user' ? 
                    <User className="h-4 w-4 text-white" /> : 
                    <Bot className="h-4 w-4 text-white" />
                  }
                </div>
                <div className="flex-1">
                  <p className={`${message.type === 'user' ? 'text-white' : 'text-gray-800'} leading-relaxed`}>
                    {message.content}
                  </p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <p className={`text-xs ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                    {message.cacheInfo && message.type === 'ai' && (
                      <CacheIndicator cacheInfo={message.cacheInfo} />
                    )}
                  </div>
                </div>
              </div>

              {/* Job Results */}
              {message.jobs && message.jobs.length > 0 && (
                <div className="mt-4">
                  <p className="text-gray-700 font-medium mb-3 text-sm">Found {message.jobs.length} matching opportunities:</p>
                  <div className="grid gap-3">
                    {message.jobs.map((job, index) => (
                      <JobCard key={index} job={job} />
                    ))}
                  </div>
                </div>
              )}

              {/* AI Confidence & Intent */}
              {message.confidence && message.type === 'ai' && (
                <div className="mt-3 flex items-center justify-between text-xs">
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">Confidence:</span>
                    <div className="bg-gray-200 rounded-full w-16 h-2">
                      <div 
                        className="bg-green-500 rounded-full h-2" 
                        style={{ width: `${message.confidence * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-gray-600">{Math.round(message.confidence * 100)}%</span>
                  </div>
                  {message.intent && (
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-1">Intent:</span>
                      {message.intent.map((intent, i) => (
                        <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-1">
                          {intent}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* AI Suggestions */}
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-4">
                  <p className="text-gray-600 text-sm mb-2">💡 Try asking:</p>
                  <div className="flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 px-3 py-2 rounded-full text-sm transition-all duration-200 hover:shadow-sm"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 rounded-full mr-3 bg-gradient-to-r from-cyan-500 to-blue-500">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="flex space-x-1 mb-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <p className="text-gray-600 text-xs">Processing with AI... Checking cache first!</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about jobs... e.g., 'Find me software developer jobs in Cape Town with R40k+ salary and remote options'"
              className="w-full p-4 pr-12 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              rows="3"
              maxLength="1000"
              disabled={isLoading}
            />
            <button
              onClick={startVoiceRecognition}
              disabled={isLoading}
              className={`absolute right-3 bottom-3 p-2 rounded-full transition-colors ${
                isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              } disabled:opacity-50`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span>{inputMessage.length}/1000</span>
            <span className="flex items-center">
              <Zap className="h-3 w-3 mr-1" />
              AI-powered with smart caching
            </span>
          </div>
          <span>Press Enter to send, Shift+Enter for new line</span>
        </div>
      </div>
    </div>
  );
};

export default AIJobSearchChat;

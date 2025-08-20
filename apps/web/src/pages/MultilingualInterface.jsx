import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  MessageCircle, 
  Volume2, 
  BookOpen, 
  Heart,
  Star,
  Users,
  MapPin,
  Zap,
  Award,
  Settings,
  ChevronDown,
  Info,
  Headphones
} from 'lucide-react';
import i18nService from '../services/i18nService';
import SlangService from '../services/SouthAfricanSlangService';
import toast from 'react-hot-toast';

const MultilingualInterface = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);
  const [slangMode, setSlangMode] = useState(false);
  const [showSlangTooltip, setShowSlangTooltip] = useState(false);
  const [detectedSlang, setDetectedSlang] = useState([]);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  useEffect(() => {
    // Initialize language service
    const detectedLang = i18nService.autoDetectLanguage();
    setCurrentLanguage(detectedLang);
    
    // Load user preferences
    const slangPref = localStorage.getItem('slangMode') === 'true';
    setSlangMode(slangPref);
    
    // Listen for language changes
    const handleLanguageChange = (event) => {
      setCurrentLanguage(event.detail.language);
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  const handleLanguageChange = (languageCode) => {
    i18nService.setLanguage(languageCode);
    setCurrentLanguage(languageCode);
    setIsLanguageSelectorOpen(false);
    
    // Show success message in new language
    const successMessage = i18nService.t('languageChanged', { language: i18nService.getLanguageInfo(languageCode)?.nativeName });
    toast.success(successMessage || `Language changed to ${languageCode}`);
  };

  const toggleSlangMode = () => {
    const newMode = !slangMode;
    setSlangMode(newMode);
    localStorage.setItem('slangMode', newMode.toString());
    
    if (newMode) {
      toast.success('Lekker! 🇿🇦 SA slang mode activated, my china!');
    } else {
      toast.success('Standard mode activated');
    }
  };

  const handleTextToSpeech = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      const langInfo = i18nService.getLanguageInfo();
      utterance.lang = i18nService.getLocale();
      utterance.rate = 0.8;
      utterance.pitch = 1;
      
      speechSynthesis.speak(utterance);
    } else {
      toast.error('Text-to-speech not supported in this browser');
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    let timeOfDay = 'general';
    
    if (hour < 12) timeOfDay = 'morning';
    else if (hour < 17) timeOfDay = 'afternoon';
    else timeOfDay = 'evening';
    
    if (slangMode && currentLanguage === 'en') {
      return SlangService.generateRandomGreeting(timeOfDay);
    }
    
    // Return translated greeting
    const greetingKey = timeOfDay === 'morning' ? 'goodMorning' : 
                       timeOfDay === 'afternoon' ? 'goodAfternoon' : 'goodEvening';
    return i18nService.t(greetingKey);
  };

  const detectSlangInText = (text) => {
    const slangWords = SlangService.containsSlang(text);
    setDetectedSlang(slangWords);
    return slangWords;
  };

  const formatLocalizedText = (text) => {
    if (slangMode && currentLanguage === 'en') {
      return SlangService.addLocalFlavor(text, 'medium');
    }
    return SlangService.formatSouthAfricanText(text);
  };

  const supportedLanguages = i18nService.getSupportedLanguages();
  const currentLangInfo = i18nService.getLanguageInfo();

  return (
    <div className="relative">
      {/* Language & Slang Controls */}
      <div className="fixed top-4 left-4 z-50 flex items-center space-x-2">
        {/* Language Selector */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsLanguageSelectorOpen(!isLanguageSelectorOpen)}
            className="flex items-center space-x-2 bg-white shadow-lg rounded-xl px-3 py-2 border border-gray-200 hover:border-blue-300 transition-colors"
          >
            <span className="text-xl">{currentLangInfo?.flag}</span>
            <span className="font-medium text-sm">{currentLangInfo?.nativeName}</span>
            <ChevronDown 
              size={16} 
              className={`transform transition-transform ${
                isLanguageSelectorOpen ? 'rotate-180' : ''
              }`} 
            />
          </motion.button>

          <AnimatePresence>
            {isLanguageSelectorOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 py-2 min-w-48 max-h-64 overflow-y-auto z-60"
              >
                <div className="px-3 py-2 border-b border-gray-100">
                  <h3 className="font-semibold text-sm text-gray-900 flex items-center">
                    <Globe size={16} className="mr-2 text-blue-500" />
                    Choose Language
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">All 11 SA official languages</p>
                </div>
                
                {supportedLanguages.map((lang) => (
                  <motion.button
                    key={lang.code}
                    whileHover={{ backgroundColor: '#f3f4f6' }}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-left transition-colors ${
                      currentLanguage === lang.code 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{lang.nativeName}</div>
                      <div className="text-xs text-gray-500">{lang.name}</div>
                    </div>
                    {currentLanguage === lang.code && (
                      <Star size={14} className="text-blue-500" />
                    )}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SA Slang Toggle */}
        {currentLanguage === 'en' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSlangMode}
            onMouseEnter={() => setShowSlangTooltip(true)}
            onMouseLeave={() => setShowSlangTooltip(false)}
            className={`relative flex items-center space-x-2 rounded-xl px-3 py-2 border transition-colors ${
              slangMode 
                ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white border-green-400 shadow-lg' 
                : 'bg-white text-gray-700 border-gray-200 hover:border-green-300 shadow-lg'
            }`}
          >
            <span className="text-lg">🇿🇦</span>
            <span className="font-medium text-sm">
              {slangMode ? 'Lekker!' : 'SA Slang'}
            </span>
            {slangMode && <Zap size={14} className="text-yellow-200" />}
          </motion.button>
        )}

        {/* Voice Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className={`flex items-center space-x-2 rounded-xl px-3 py-2 border transition-colors ${
            voiceEnabled 
              ? 'bg-purple-500 text-white border-purple-400 shadow-lg' 
              : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300 shadow-lg'
          }`}
        >
          <Volume2 size={16} />
          <span className="font-medium text-sm hidden sm:inline">Voice</span>
        </motion.button>
      </div>

      {/* Slang Tooltip */}
      <AnimatePresence>
        {showSlangTooltip && currentLanguage === 'en' && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="fixed top-16 left-4 bg-black text-white text-xs rounded-lg px-3 py-2 z-50 shadow-xl"
          >
            <div className="font-semibold mb-1">🇿🇦 SA Slang Mode</div>
            <div>Experience JobChommie in true South African style!</div>
            <div className="text-gray-300 mt-1">
              • Howzit instead of Hello<br/>
              • Lekker instead of Good<br/>
              • China instead of Friend
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slang Detection */}
      {detectedSlang.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-4 shadow-xl max-w-sm z-50"
        >
          <div className="flex items-start space-x-3">
            <BookOpen size={20} className="flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold mb-1">🇿🇦 SA Slang Detected!</h4>
              <div className="text-sm space-y-1">
                {detectedSlang.slice(0, 3).map((word, index) => {
                  const definition = SlangService.getSlangDefinition(word);
                  return (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="font-medium">{word}:</span>
                      <span className="text-orange-100">{definition?.meaning}</span>
                      <span>{SlangService.getSlangEmoji(word)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-4 m-4 rounded-r-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{currentLangInfo?.flag}</div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {getGreeting()}
              </h3>
              <p className="text-sm text-gray-600">
                {slangMode && currentLanguage === 'en' ? 
                  'Welcome to AI Job Chommie, your lekker career companion!' :
                  i18nService.t('welcome')
                }
              </p>
            </div>
          </div>
          
          {voiceEnabled && (
            <button
              onClick={() => handleTextToSpeech(getGreeting())}
              className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
            >
              <Headphones size={16} className="text-blue-600" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Language Statistics */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-4 m-4 border border-gray-200"
      >
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Award size={18} className="mr-2 text-yellow-500" />
          🇿🇦 Complete South African Localization
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-600">11</div>
            <div className="text-xs text-blue-700">Official Languages</div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-600">
              {SlangService.getSlangStatistics().total}
            </div>
            <div className="text-xs text-green-700">Slang Terms</div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-purple-600">9</div>
            <div className="text-xs text-purple-700">Provinces Covered</div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-orange-600">100%</div>
            <div className="text-xs text-orange-700">Local Context</div>
          </div>
        </div>
        
        {/* Slang Categories */}
        {slangMode && currentLanguage === 'en' && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            {Object.keys(SlangService.getSlangStatistics().categories).map((category) => (
              <div key={category} className="bg-gray-50 rounded-lg p-2 text-center">
                <div className="font-medium text-gray-900 capitalize">
                  {category.replace('_', ' ')}
                </div>
                <div className="text-xs text-gray-600">
                  {SlangService.getSlangStatistics().categories[category]} terms
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Enhanced Children with Context */}
      <div className="multilingual-content">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              currentLanguage,
              slangMode,
              t: i18nService.t.bind(i18nService),
              formatText: formatLocalizedText,
              detectSlang: detectSlangInText,
              generateGreeting: SlangService.generateRandomGreeting.bind(SlangService),
              celebrateSuccess: SlangService.generateCelebrationMessage.bind(SlangService)
            });
          }
          return child;
        })}
      </div>
    </div>
  );
};

// Higher-order component for adding translation capabilities
export const withTranslation = (WrappedComponent) => {
  return function TranslatedComponent(props) {
    const [currentLanguage, setCurrentLanguage] = useState(i18nService.getCurrentLanguage());
    
    useEffect(() => {
      const handleLanguageChange = (event) => {
        setCurrentLanguage(event.detail.language);
      };
      
      window.addEventListener('languageChanged', handleLanguageChange);
      return () => window.removeEventListener('languageChanged', handleLanguageChange);
    }, []);

    const enhancedProps = {
      ...props,
      t: i18nService.t.bind(i18nService),
      currentLanguage,
      formatCurrency: i18nService.formatCurrency.bind(i18nService),
      formatDate: i18nService.formatDate.bind(i18nService),
      formatNumber: i18nService.formatNumber.bind(i18nService),
      isRTL: i18nService.isRTL(),
      slangService: SlangService
    };

    return <WrappedComponent {...enhancedProps} />;
  };
};

// Translation hook
export const useTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState(i18nService.getCurrentLanguage());
  const [slangMode, setSlangMode] = useState(localStorage.getItem('slangMode') === 'true');
  
  useEffect(() => {
    const handleLanguageChange = (event) => {
      setCurrentLanguage(event.detail.language);
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  return {
    t: i18nService.t.bind(i18nService),
    currentLanguage,
    slangMode,
    setSlangMode,
    formatCurrency: i18nService.formatCurrency.bind(i18nService),
    formatDate: i18nService.formatDate.bind(i18nService),
    formatNumber: i18nService.formatNumber.bind(i18nService),
    isRTL: i18nService.isRTL(),
    changeLanguage: i18nService.setLanguage.bind(i18nService),
    detectSlang: SlangService.containsSlang.bind(SlangService),
    getSlangDefinition: SlangService.getSlangDefinition.bind(SlangService),
    addLocalFlavor: SlangService.addLocalFlavor.bind(SlangService),
    generateGreeting: SlangService.generateRandomGreeting.bind(SlangService),
    celebrateSuccess: SlangService.generateCelebrationMessage.bind(SlangService)
  };
};

export default MultilingualInterface;

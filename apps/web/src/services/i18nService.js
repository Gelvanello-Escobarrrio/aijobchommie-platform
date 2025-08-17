// src/services/i18nService.js

class I18nService {
  constructor() {
    this.currentLanguage = 'en';
    this.fallbackLanguage = 'en';
    this.translations = {};
    this.slangService = null; // Will be injected by SouthAfricanSlangService
    this.supportedLanguages = {
      en: { 
        code: 'en', 
        name: 'English', 
        nativeName: 'English',
        locale: 'en-US',
        rtl: false
      },
      es: { 
        code: 'es', 
        name: 'Spanish', 
        nativeName: 'Español',
        locale: 'es-ES',
        rtl: false
      },
      fr: { 
        code: 'fr', 
        name: 'French', 
        nativeName: 'Français',
        locale: 'fr-FR',
        rtl: false
      },
      de: { 
        code: 'de', 
        name: 'German', 
        nativeName: 'Deutsch',
        locale: 'de-DE',
        rtl: false
      },
      it: { 
        code: 'it', 
        name: 'Italian', 
        nativeName: 'Italiano',
        locale: 'it-IT',
        rtl: false
      },
      pt: { 
        code: 'pt', 
        name: 'Portuguese', 
        nativeName: 'Português',
        locale: 'pt-PT',
        rtl: false
      },
      nl: { 
        code: 'nl', 
        name: 'Dutch', 
        nativeName: 'Nederlands',
        locale: 'nl-NL',
        rtl: false
      },
      af: { 
        code: 'af', 
        name: 'Afrikaans', 
        nativeName: 'Afrikaans',
        locale: 'af-ZA',
        rtl: false
      },
      zu: { 
        code: 'zu', 
        name: 'Zulu', 
        nativeName: 'isiZulu',
        locale: 'zu-ZA',
        rtl: false
      },
      xh: { 
        code: 'xh', 
        name: 'Xhosa', 
        nativeName: 'isiXhosa',
        locale: 'xh-ZA',
        rtl: false
      },
      ar: { 
        code: 'ar', 
        name: 'Arabic', 
        nativeName: 'العربية',
        locale: 'ar-SA',
        rtl: true
      }
    };
    
    // Initialize with basic translations
    this.initializeTranslations();
    
    // Try to detect and set initial language
    this.initializeLanguage();
  }

  initializeTranslations() {
    this.translations = {
      en: {
        welcome: 'Welcome',
        languageChanged: 'Language changed to {{language}}',
        hello: 'Hello',
        goodbye: 'Goodbye',
        goodMorning: 'Good Morning',
        goodAfternoon: 'Good Afternoon',
        goodEvening: 'Good Evening',
        goodNight: 'Good Night'
      },
      es: {
        welcome: 'Bienvenido',
        languageChanged: 'Idioma cambiado a {{language}}',
        hello: 'Hola',
        goodbye: 'Adiós',
        goodMorning: 'Buenos Días',
        goodAfternoon: 'Buenas Tardes',
        goodEvening: 'Buenas Noches',
        goodNight: 'Buenas Noches'
      },
      fr: {
        welcome: 'Bienvenue',
        languageChanged: 'Langue changée en {{language}}',
        hello: 'Bonjour',
        goodbye: 'Au revoir',
        goodMorning: 'Bonjour',
        goodAfternoon: 'Bon après-midi',
        goodEvening: 'Bonsoir',
        goodNight: 'Bonne nuit'
      },
      af: {
        welcome: 'Welkom',
        languageChanged: 'Taal verander na {{language}}',
        hello: 'Hallo',
        goodbye: 'Totsiens',
        goodMorning: 'Goeie Môre',
        goodAfternoon: 'Goeie Middag',
        goodEvening: 'Goeie Aand',
        goodNight: 'Goeie Nag'
      },
      zu: {
        welcome: 'Siyakwamukela',
        languageChanged: 'Ulimi lushintshelwe ku {{language}}',
        hello: 'Sawubona',
        goodbye: 'Sala kahle',
        goodMorning: 'Sawubona (ekuseni)',
        goodAfternoon: 'Sawubona (emini)',
        goodEvening: 'Sawubona (kusihlwa)',
        goodNight: 'Lala kahle'
      }
    };
  }

  initializeLanguage() {
    // Try to get language from localStorage, browser, or use fallback
    const storedLang = this.getStoredLanguage();
    const browserLang = this.getBrowserLanguage();
    const detectedLang = storedLang || browserLang || this.fallbackLanguage;
    
    this.setLanguage(detectedLang);
  }

  getStoredLanguage() {
    try {
      return localStorage.getItem('selectedLanguage');
    } catch (e) {
      return null;
    }
  }

  getBrowserLanguage() {
    const browserLang = navigator.language || navigator.languages[0];
    if (browserLang) {
      const langCode = browserLang.split('-')[0];
      return this.supportedLanguages[langCode] ? langCode : null;
    }
    return null;
  }

  autoDetectLanguage() {
    return this.getBrowserLanguage() || this.fallbackLanguage;
  }

  setLanguage(languageCode) {
    if (this.supportedLanguages[languageCode]) {
      this.currentLanguage = languageCode;
      try {
        localStorage.setItem('selectedLanguage', languageCode);
      } catch (e) {
        // localStorage not available
      }
    }
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }

  getSupportedLanguages() {
    return Object.values(this.supportedLanguages);
  }

  getLanguageInfo(languageCode = null) {
    const lang = languageCode || this.currentLanguage;
    return this.supportedLanguages[lang];
  }

  getLocale() {
    return this.getLanguageInfo()?.locale || 'en-US';
  }

  isRTL() {
    return this.getLanguageInfo()?.rtl || false;
  }

  // Integration with South African Slang Service
  setSouthAfricanSlangService(slangService) {
    this.slangService = slangService;
  }

  // Enhanced translate method with slang support
  translate(key, params = {}, useSlang = false) {
    let translation = this.getBasicTranslation(key, params);
    
    // If slang service is available and requested, try to get slang version
    if (useSlang && this.slangService && this.isLocalSALanguage()) {
      const slangTranslation = this.slangService.translateToSlang(translation, this.currentLanguage);
      if (slangTranslation && slangTranslation !== translation) {
        return slangTranslation;
      }
    }
    
    return translation;
  }

  getBasicTranslation(key, params = {}) {
    const currentTranslations = this.translations[this.currentLanguage] || {};
    const fallbackTranslations = this.translations[this.fallbackLanguage] || {};
    
    let translation = currentTranslations[key] || fallbackTranslations[key] || key;
    
    // Parameter replacement
    Object.keys(params).forEach(param => {
      const regex = new RegExp(`{{${param}}}`, 'g');
      translation = translation.replace(regex, params[param]);
    });
    
    return translation;
  }

  isLocalSALanguage() {
    return ['af', 'zu', 'xh', 'en'].includes(this.currentLanguage);
  }

  // Enhanced t method with slang support
  t(key, params = {}, options = {}) {
    const { useSlang = false, context = null } = options;
    return this.translate(key, params, useSlang);
  }

  // Get localized job search terms (PWA-specific)
  getJobSearchTerms() {
    const terms = {
      en: {
        jobTitle: 'Job Title',
        location: 'Location',
        salaryRange: 'Salary Range',
        jobType: 'Job Type',
        company: 'Company',
        apply: 'Apply Now',
        viewDetails: 'View Details',
        remote: 'Remote',
        partTime: 'Part Time',
        fullTime: 'Full Time'
      },
      af: {
        jobTitle: 'Pos Titel',
        location: 'Ligging',
        salaryRange: 'Salaris Reeks',
        jobType: 'Werk Tipe',
        company: 'Maatskappy',
        apply: 'Doen nou aansoek',
        viewDetails: 'Sien Besonderhede',
        remote: 'Afgelegen',
        partTime: 'Deeltyds',
        fullTime: 'Voltyds'
      },
      zu: {
        jobTitle: 'Isihloko Somsebenzi',
        location: 'Indawo',
        salaryRange: 'Ububanzi Beholo',
        jobType: 'Uhlobo Lomsebenzi',
        company: 'Inkampani',
        apply: 'Faka Isicelo Manje',
        viewDetails: 'Buka Imininingwane',
        remote: 'Kude',
        partTime: 'Isikhathi Esingaphakathi',
        fullTime: 'Isikhathi Esigcwele'
      }
    };
    
    return terms[this.currentLanguage] || terms.en;
  }

  // Load additional translations
  loadTranslations(languageCode, translations) {
    if (!this.translations[languageCode]) {
      this.translations[languageCode] = {};
    }
    this.translations[languageCode] = {
      ...this.translations[languageCode],
      ...translations
    };
  }

  // Formatting functions
  formatCurrency(amount, currency = 'USD') {
    const locale = this.getLocale();
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
      }).format(amount);
    } catch (e) {
      return `${currency} ${amount}`;
    }
  }

  formatDate(date, options = {}) {
    const locale = this.getLocale();
    try {
      const defaultOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(new Date(date));
    } catch (e) {
      return new Date(date).toLocaleDateString();
    }
  }

  formatNumber(number, options = {}) {
    const locale = this.getLocale();
    try {
      return new Intl.NumberFormat(locale, options).format(number);
    } catch (e) {
      return number.toString();
    }
  }

  // Get greeting based on time of day
  getTimeBasedGreeting() {
    const hour = new Date().getHours();
    let greetingKey = 'hello';
    
    if (hour < 12) {
      greetingKey = 'goodMorning';
    } else if (hour < 17) {
      greetingKey = 'goodAfternoon';
    } else if (hour < 21) {
      greetingKey = 'goodEvening';
    } else {
      greetingKey = 'goodNight';
    }
    
    return this.t(greetingKey);
  }

  // Add a new supported language
  addSupportedLanguage(languageConfig) {
    this.supportedLanguages[languageConfig.code] = languageConfig;
  }

  // Remove a supported language
  removeSupportedLanguage(languageCode) {
    delete this.supportedLanguages[languageCode];
    delete this.translations[languageCode];
    
    if (this.currentLanguage === languageCode) {
      this.setLanguage(this.fallbackLanguage);
    }
  }
}

// Export a singleton instance
const i18nService = new I18nService();

export default i18nService;
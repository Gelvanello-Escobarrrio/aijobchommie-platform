/**
 * 🇿🇦 SOUTH AFRICAN SLANG & LOCALIZATION SERVICE
 * Complete dictionary of SA slang, colloquialisms, and local expressions
 */

class SouthAfricanSlangService {
  constructor() {
    this.slangDictionary = new Map();
    this.contextualPhrases = new Map();
    this.regionalVariations = new Map();
    this.loadSlangDictionary();
    this.loadContextualPhrases();
    this.loadRegionalVariations();
  }

  /**
   *  Load comprehensive SA slang dictionary
   */
  loadSlangDictionary() {
    this.slangDictionary.set('general', {
      // Universal SA Slang
      'lekker': { meaning: 'nice, good, great', usage: 'That job is lekker!', formal: 'excellent' },
      'braai': { meaning: 'barbecue', usage: 'Company braai this weekend', formal: 'barbecue' },
      'boet': { meaning: 'friend, buddy, brother', usage: 'Thanks boet!', formal: 'friend' },
      'china': { meaning: 'friend, mate', usage: 'My china got the job', formal: 'friend' },
      'bru': { meaning: 'friend, dude', usage: 'Nice one bru!', formal: 'friend' },
      'howzit': { meaning: 'how is it, hello', usage: 'Howzit going?', formal: 'hello' },
      'sharp': { meaning: 'cool, okay, good', usage: 'Sharp, see you at 9', formal: 'okay' },
      'eish': { meaning: 'expression of frustration', usage: 'Eish, missed the interview', formal: 'unfortunately' },
      'shame': { meaning: 'expression of sympathy', usage: 'Shame man, better luck next time', formal: 'sorry to hear' },
      'ag': { meaning: 'expression of annoyance/dismissal', usage: 'Ag man, whatever', formal: 'well' },
      'hey': { meaning: 'question tag', usage: 'Good job hey?', formal: 'right?' },
      'nogal': { meaning: 'actually, even', usage: 'Got promoted nogal!', formal: 'actually' },
      'sho': { meaning: 'wow, really?', usage: 'Sho! You got the job?', formal: 'really?' },
      'tjo': { meaning: 'wow, expression of surprise', usage: 'Tjo! That salary is high', formal: 'wow' },
      'yoh': { meaning: 'wow, expression of shock', usage: 'Yoh! What a long day', formal: 'wow' },
      'hectic': { meaning: 'intense, crazy, difficult', usage: 'Work was hectic today', formal: 'challenging' },
      'klap': { meaning: 'hit, smack', usage: 'Going to klap this interview', formal: 'excel at' },
      'skelmpie': { meaning: 'naughty person, rascal', usage: 'That skelmpie got away with it', formal: 'mischievous person' },
      'boerewors': { meaning: 'traditional sausage', usage: 'Boerewors at the office braai', formal: 'sausage' },
      'bakkie': { meaning: 'pickup truck', usage: 'Taking the bakkie to work', formal: 'pickup truck' },
      'robot': { meaning: 'traffic light', usage: 'Turn left at the robot', formal: 'traffic light' },
      'kombi': { meaning: 'minibus taxi', usage: 'Taking the kombi to town', formal: 'minibus' },
      'takkies': { meaning: 'sneakers, tennis shoes', usage: 'Wearing takkies to work', formal: 'sneakers' },
      'vetkoek': { meaning: 'fried bread', usage: 'Vetkoek for lunch', formal: 'fried bread' },
      'sosatie': { meaning: 'kebab', usage: 'Making sosaties for the braai', formal: 'kebab' },
      'koeksisters': { meaning: 'twisted pastry', usage: 'Koeksisters for tea time', formal: 'pastry' },
      'biltong': { meaning: 'dried meat', usage: 'Snacking on biltong', formal: 'dried meat' },
      'droëwors': { meaning: 'dried sausage', usage: 'Pack some droëwors', formal: 'dried sausage' }
    });

    this.slangDictionary.set('work_related', {
      // Work & Business Slang
      'skief': { meaning: 'crooked, not right', usage: 'This deal looks skief', formal: 'suspicious' },
      'tjommie': { meaning: 'friend, colleague', usage: 'Ask your tjommie about it', formal: 'colleague' },
      'skelmpies': { meaning: 'dodgy people', usage: 'Watch out for skelmpies', formal: 'untrustworthy people' },
      'smaak': { meaning: 'like, fancy', usage: 'I smaak this opportunity', formal: 'like' },
      'jol': { meaning: 'party, have fun', usage: 'Office jol tonight', formal: 'party' },
      'skinner': { meaning: 'gossip', usage: 'Heard the skinner about promotions?', formal: 'news' },
      'ou toppie': { meaning: 'old man, boss', usage: 'The ou toppie wants to see you', formal: 'boss' },
      'groot bul': { meaning: 'big boss', usage: 'Meeting with the groot bul', formal: 'senior manager' },
      'mamparra': { meaning: 'fool, idiot', usage: 'Don\'t be a mamparra', formal: 'foolish person' },
      'lightie': { meaning: 'young person', usage: 'New lightie starting Monday', formal: 'young person' },
      'oke': { meaning: 'guy, person', usage: 'That oke is hardworking', formal: 'person' },
      'ou': { meaning: 'guy, old', usage: 'That ou from accounting', formal: 'person' },
      'toppie': { meaning: 'old man, senior person', usage: 'The toppie has experience', formal: 'senior person' },
      'boetie': { meaning: 'little brother, young man', usage: 'Help the new boetie', formal: 'colleague' },
      'skelmpie': { meaning: 'rogue, crafty person', usage: 'Watch that skelmpie', formal: 'cunning person' }
    });

    this.slangDictionary.set('expressions', {
      // Common SA Expressions
      'just now': { meaning: 'later, sometime soon', usage: 'I\'ll call you just now', formal: 'shortly' },
      'now now': { meaning: 'very soon, immediately', usage: 'I\'m coming now now', formal: 'immediately' },
      'right now': { meaning: 'this very moment', usage: 'I need it right now', formal: 'immediately' },
      'is it': { meaning: 'really?', usage: 'Is it? That\'s interesting', formal: 'really?' },
      'shame man': { meaning: 'expression of sympathy', usage: 'Shame man, tough luck', formal: 'that\'s unfortunate' },
      'ag shame': { meaning: 'expression of sympathy', usage: 'Ag shame, you tried your best', formal: 'that\'s unfortunate' },
      'no man': { meaning: 'expression of disagreement', usage: 'No man, that\'s not right', formal: 'no' },
      'ja well': { meaning: 'expression of resignation', usage: 'Ja well, what can you do', formal: 'oh well' },
      'ja nee': { meaning: 'yes no, expression of agreement', usage: 'Ja nee, I understand', formal: 'I understand' },
      'nee man': { meaning: 'no way', usage: 'Nee man, I can\'t believe it', formal: 'no way' },
      'sho sho': { meaning: 'wow wow', usage: 'Sho sho! What a raise!', formal: 'amazing!' },
      'my bru': { meaning: 'my friend', usage: 'Thanks my bru', formal: 'my friend' },
      'shot bru': { meaning: 'thanks friend', usage: 'Shot bru for the help', formal: 'thank you' },
      'sharp sharp': { meaning: 'very good, excellent', usage: 'Sharp sharp! Well done', formal: 'excellent' },
      'lekker man': { meaning: 'great, excellent', usage: 'Lekker man! Good news', formal: 'excellent' },
      'cool story bro': { meaning: 'dismissive response', usage: 'Cool story bro', formal: 'okay' },
      'check it': { meaning: 'look at this', usage: 'Check it, new job posting', formal: 'look at this' },
      'safe': { meaning: 'okay, cool', usage: 'Safe, see you tomorrow', formal: 'okay' }
    });

    this.slangDictionary.set('modern_slang', {
      // Modern SA Slang (2020s)
      'fire': { meaning: 'excellent, amazing', usage: 'That interview was fire', formal: 'excellent' },
      'slay': { meaning: 'do excellently', usage: 'You slayed that presentation', formal: 'excelled' },
      'flex': { meaning: 'show off', usage: 'Stop flexing your new job', formal: 'showing off' },
      'lit': { meaning: 'exciting, cool', usage: 'The office party was lit', formal: 'exciting' },
      'mad': { meaning: 'very, extremely', usage: 'That\'s mad expensive', formal: 'very' },
      'bet': { meaning: 'okay, sure', usage: 'Bet, I\'ll be there', formal: 'okay' },
      'cap': { meaning: 'lie, false', usage: 'That\'s cap bro', formal: 'that\'s false' },
      'no cap': { meaning: 'no lie, truth', usage: 'No cap, best job ever', formal: 'honestly' },
      'sus': { meaning: 'suspicious', usage: 'That offer sounds sus', formal: 'suspicious' },
      'vibes': { meaning: 'atmosphere, feeling', usage: 'Good vibes at this company', formal: 'atmosphere' },
      'slaps': { meaning: 'excellent, great', usage: 'This opportunity slaps', formal: 'excellent' },
      'bussin': { meaning: 'excellent, amazing', usage: 'The salary is bussin', formal: 'excellent' },
      'periodt': { meaning: 'period, end of discussion', usage: 'I\'m taking the job, periodt', formal: 'final decision' },
      'facts': { meaning: 'true, agreed', usage: 'Facts, you\'re right', formal: 'true' },
      'say less': { meaning: 'I understand', usage: 'Say less, I\'m in', formal: 'understood' }
    });

    this.slangDictionary.set('township_slang', {
      // Township & Urban Slang
      'sho': { meaning: 'sure, okay', usage: 'Sho, I\'ll be there', formal: 'okay' },
      'eita': { meaning: 'hello, greetings', usage: 'Eita my bru!', formal: 'hello' },
      'aweh': { meaning: 'hello, what\'s up', usage: 'Aweh! How\'s work?', formal: 'hello' },
      'mfowethu': { meaning: 'my friend (Zulu)', usage: 'Thanks mfowethu', formal: 'my friend' },
      'bhuti': { meaning: 'brother (Zulu)', usage: 'Help me bhuti', formal: 'brother' },
      'sesi': { meaning: 'sister (Zulu)', usage: 'Hey sesi, how are you?', formal: 'sister' },
      'sharp left': { meaning: 'goodbye, see you later', usage: 'Sharp left, catch you tomorrow', formal: 'goodbye' },
      'checkers': { meaning: 'goodbye, see you', usage: 'Checkers bru', formal: 'goodbye' },
      'later': { meaning: 'goodbye', usage: 'Later my china', formal: 'goodbye' },
      'catch you on the flip side': { meaning: 'see you later', usage: 'Catch you on the flip side', formal: 'see you later' },
      'spot on': { meaning: 'exactly right', usage: 'Spot on bru!', formal: 'exactly' },
      'sorted': { meaning: 'arranged, fixed', usage: 'Job interview is sorted', formal: 'arranged' },
      'klapping': { meaning: 'doing well, succeeding', usage: 'Klapping it at work', formal: 'succeeding' },
      'chommie': { meaning: 'friend, buddy', usage: 'My chommie got promoted', formal: 'friend' }
    });

    this.slangDictionary.set('afrikaans_english', {
      // Afrikaans words commonly used in English
      'potjiekos': { meaning: 'stew cooked in cast iron pot', usage: 'Making potjiekos for the team', formal: 'stew' },
      'veldskoen': { meaning: 'leather shoes', usage: 'Wearing veldskoen to work', formal: 'leather shoes' },
      'tackies': { meaning: 'sneakers', usage: 'Casual Friday, wearing tackies', formal: 'sneakers' },
      'sjambok': { meaning: 'heavy leather whip', usage: 'Boss rules with a sjambok', formal: 'strict management' },
      'braai vleis': { meaning: 'barbecue meat', usage: 'Bringing braai vleis', formal: 'barbecue meat' },
      'bokmakirie': { meaning: 'type of bird', usage: 'Like a bokmakirie singing', formal: 'melodious' },
      'veld': { meaning: 'grassland, countryside', usage: 'Office in the veld', formal: 'countryside' },
      'kraal': { meaning: 'enclosure for animals', usage: 'Packed like a kraal', formal: 'crowded' },
      'stoep': { meaning: 'veranda, porch', usage: 'Meeting on the stoep', formal: 'porch' },
      'lapa': { meaning: 'outdoor entertainment area', usage: 'Company lapa function', formal: 'outdoor area' },
      'indaba': { meaning: 'meeting, discussion', usage: 'Big indaba at head office', formal: 'meeting' },
      'shangaan': { meaning: 'relating to Tsonga culture', usage: 'Shangaan traditional dress', formal: 'traditional' }
    });
  }

  /**
   *  Load contextual phrases and responses
   */
  loadContextualPhrases() {
    this.contextualPhrases.set('greetings', {
      morning: ['Howzit my bru!', 'Morning china!', 'Sawubona!', 'Eita!', 'Aweh my guy!'],
      afternoon: ['Sharp! How\'s it?', 'Afternoon boet!', 'Yebo!', 'Sho sho!'],
      evening: ['Evening my china!', 'Sharp left for today!', 'Lekker evening!'],
      casual: ['Hey hey!', 'Aweh!', 'Eita my bru!', 'Sho my china!', 'What\'s the skinner?']
    });

    this.contextualPhrases.set('job_search', {
      success: ['Lekker! You got it!', 'Sharp sharp! Well done boet!', 'Sho! That\'s fire!', 'Eish, you\'re killing it!'],
      encouragement: ['Ag shame man, keep trying!', 'Just now you\'ll get it!', 'Sharp, don\'t stress my bru!'],
      interview_prep: ['Klap that interview boet!', 'You\'ve got this china!', 'Go slay that interview!'],
      application: ['Shot for applying!', 'Lekker choice my bru!', 'That company is sharp!']
    });

    this.contextualPhrases.set('workplace', {
      teamwork: ['Let\'s jol together on this!', 'Sharp teamwork boet!', 'We\'re klapping this project!'],
      meetings: ['Big indaba today hey?', 'Meeting with the ou toppie', 'Boardroom skinner time'],
      deadlines: ['Eish, tight deadline!', 'Now now we need to finish', 'Hectic schedule today'],
      success: ['Lekker work my china!', 'You\'re on fire boet!', 'Sharp sharp performance!']
    });

    this.contextualPhrases.set('reactions', {
      surprise: ['Sho!', 'Tjo!', 'Yoh!', 'Eish!', 'Is it?', 'No ways!'],
      agreement: ['Ja nee', 'Sharp', 'Spot on', 'Facts my bru', 'Lekker', 'Sho'],
      disagreement: ['Nee man', 'Ag no ways', 'That\'s skief', 'Sus bru'],
      sympathy: ['Shame man', 'Ag shame', 'Eish my bru', 'Sorry boet']
    });
  }

  /**
   *  Load regional variations
   */
  loadRegionalVariations() {
    this.regionalVariations.set('gauteng', {
      common_phrases: ['Eish my bru', 'Sharp left', 'Aweh china', 'Spot on boet'],
      work_terms: ['Big indaba', 'Ou toppie', 'Office jol', 'Boardroom skinner'],
      greetings: ['Howzit Joburg!', 'Aweh Gauteng!', 'Sharp Pretoria!']
    });

    this.regionalVariations.set('western_cape', {
      common_phrases: ['Lekker my bru', 'Sharp sharp', 'Ag shame boet', 'Check it my china'],
      work_terms: ['Lekker job', 'Sharp opportunity', 'Braai with the team'],
      greetings: ['Howzit Cape Town!', 'Morning from the Mother City!', 'Lekker day in the Cape!']
    });

    this.regionalVariations.set('kwazulu_natal', {
      common_phrases: ['Sawubona my friend', 'Sharp mfowethu', 'Yebo yes!', 'Eish bhuti'],
      work_terms: ['Sharp position', 'Lekker company culture', 'Team indaba'],
      greetings: ['Sawubona KZN!', 'Howzit Durban!', 'Sharp from Pietermaritzburg!']
    });
  }

  /**
   *  Translate slang to formal English
   */
  translateSlangToFormal(text) {
    let formalText = text;
    
    // Iterate through all slang categories
    this.slangDictionary.forEach((category) => {
      Object.entries(category).forEach(([slang, data]) => {
        const regex = new RegExp(`\\b${slang}\\b`, 'gi');
        formalText = formalText.replace(regex, data.formal);
      });
    });

    return formalText;
  }

  /**
   *  Add local flavor to formal text
   */
  addLocalFlavor(text, intensity = 'medium') {
    const flavorWords = {
      'low': ['hey', 'sharp', 'lekker'],
      'medium': ['hey', 'sharp', 'lekker', 'boet', 'china', 'eish'],
      'high': ['hey', 'sharp', 'lekker', 'boet', 'china', 'eish', 'sho', 'my bru', 'nogal']
    };

    let localizedText = text;
    const words = flavorWords[intensity] || flavorWords.medium;
    
    // Add local expressions at natural points
    if (text.includes('good')) {
      localizedText = localizedText.replace(/good/gi, 'lekker');
    }
    if (text.includes('okay')) {
      localizedText = localizedText.replace(/okay/gi, 'sharp');
    }
    if (text.includes('friend')) {
      localizedText = localizedText.replace(/friend/gi, 'china');
    }

    return localizedText;
  }

  /**
   *  Get contextual slang suggestions
   */
  getContextualSlang(context, situation = '') {
    const contextMap = {
      'greeting': this.contextualPhrases.get('greetings'),
      'job_success': this.contextualPhrases.get('job_search')?.success,
      'encouragement': this.contextualPhrases.get('job_search')?.encouragement,
      'workplace': this.contextualPhrases.get('workplace'),
      'reaction': this.contextualPhrases.get('reactions')
    };

    return contextMap[context] || [];
  }

  /**
   *  Get regional slang for location
   */
  getRegionalSlang(region) {
    const regionKey = region.toLowerCase().replace(/\s+/g, '_');
    return this.regionalVariations.get(regionKey) || this.regionalVariations.get('gauteng');
  }

  /**
   *  Check if text contains slang
   */
  containsSlang(text) {
    const slangWords = [];
    
    this.slangDictionary.forEach((category) => {
      Object.keys(category).forEach(slang => {
        const regex = new RegExp(`\\b${slang}\\b`, 'gi');
        if (regex.test(text)) {
          slangWords.push(slang);
        }
      });
    });

    return slangWords;
  }

  /**
   *  Get slang definition
   */
  getSlangDefinition(word) {
    for (const [categoryName, category] of this.slangDictionary) {
      if (category[word.toLowerCase()]) {
        return {
          word,
          category: categoryName,
          ...category[word.toLowerCase()]
        };
      }
    }
    return null;
  }

  /**
   *  Generate random SA greeting
   */
  generateRandomGreeting(timeOfDay = 'general') {
    const greetings = this.contextualPhrases.get('greetings');
    const timeGreetings = greetings[timeOfDay] || greetings.casual;
    return timeGreetings[Math.floor(Math.random() * timeGreetings.length)];
  }

  /**
   *  Generate celebration message
   */
  generateCelebrationMessage(achievement) {
    const celebrations = {
      'job_offer': ['Lekker! You got the job boet!', 'Sho sho! Well done china!', 'Eish, you\'re on fire my bru!'],
      'interview': ['Sharp! Klap that interview!', 'You\'ve got this china!', 'Go slay it boet!'],
      'promotion': ['Tjo! Big promotion hey?', 'Lekker move up china!', 'Sharp sharp! Well deserved!'],
      'salary_increase': ['Yoh! Nice raise my bru!', 'Lekker money boet!', 'Sharp increase china!']
    };

    const messages = celebrations[achievement] || celebrations.job_offer;
    return messages[Math.floor(Math.random() * messages.length)];
  }

  /**
   *  Generate contextual response
   */
  generateContextualResponse(userInput, context = 'general') {
    const input = userInput.toLowerCase();
    
    // Check for common patterns and respond in SA slang
    if (input.includes('got the job') || input.includes('hired')) {
      return this.generateCelebrationMessage('job_offer');
    }
    
    if (input.includes('interview')) {
      return this.generateCelebrationMessage('interview');
    }
    
    if (input.includes('thanks') || input.includes('thank you')) {
      return ['Sharp my china!', 'Lekker boet!', 'No stress my bru!'][Math.floor(Math.random() * 3)];
    }
    
    if (input.includes('hello') || input.includes('hi')) {
      return this.generateRandomGreeting();
    }

    return 'Sharp sharp!'; // Default response
  }

  /**
   *  Format text with SA spelling and conventions
   */
  formatSouthAfricanText(text) {
    // Convert to SA English spellings and conventions
    let saText = text
      .replace(/\bcolor/g, 'colour')
      .replace(/\bflavor/g, 'flavour')
      .replace(/\bhonor/g, 'honour')
      .replace(/\blicense\b/g, 'licence')
      .replace(/\bpractice\b/g, 'practise') // when used as verb
      .replace(/\bcenter/g, 'centre')
      .replace(/\bmeter/g, 'metre')
      .replace(/\btheater/g, 'theatre')
      .replace(/\borganize/g, 'organise')
      .replace(/\brealize/g, 'realise');

    // Add local currency format
    saText = saText.replace(/\$(\d+)/g, 'R$1');
    
    return saText;
  }

  /**
   *  Get mobile-friendly slang explanations
   */
  getMobileSlangExplanation(word) {
    const definition = this.getSlangDefinition(word);
    if (!definition) return null;

    return {
      word: definition.word,
      shortMeaning: definition.meaning,
      example: definition.usage,
      formal: definition.formal,
      category: definition.category,
      emoji: this.getSlangEmoji(word)
    };
  }

  /**
   *  Get emoji for slang word
   */
  getSlangEmoji(word) {
    const emojiMap = {
      'lekker': '',
      'braai': '',
      'boet': '',
      'china': '',
      'howzit': '',
      'sharp': '',
      'eish': '',
      'shame': '',
      'sho': '',
      'tjo': '',
      'yoh': '',
      'hectic': '',
      'jol': '',
      'skinner': '',
      'mamparra': '‍',
      'lightie': '',
      'fire': '',
      'slay': '',
      'lit': '',
      'vibes': '',
      'aweh': '',
      'sawubona': ''
    };

    return emojiMap[word.toLowerCase()] || '🇿🇦';
  }

  /**
   *  Get all slang for category
   */
  getAllSlangForCategory(category) {
    return this.slangDictionary.get(category) || {};
  }

  /**
   *  Get slang statistics
   */
  getSlangStatistics() {
    let totalSlangWords = 0;
    const categoryStats = {};

    this.slangDictionary.forEach((category, categoryName) => {
      const count = Object.keys(category).length;
      categoryStats[categoryName] = count;
      totalSlangWords += count;
    });

    return {
      total: totalSlangWords,
      categories: categoryStats,
      regions: Array.from(this.regionalVariations.keys()),
      contextualPhrases: Array.from(this.contextualPhrases.keys())
    };
  }
}

// Export singleton instance
export default new SouthAfricanSlangService();

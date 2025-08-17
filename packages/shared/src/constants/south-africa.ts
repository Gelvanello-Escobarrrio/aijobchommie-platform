/**
 * South Africa specific constants for AI Job Chommie platform
 * Focus on accessibility and opportunities for all economic levels
 */

// South African Provinces
export const SA_PROVINCES = [
  { code: 'EC', name: 'Eastern Cape', capital: 'Bhisho' },
  { code: 'FS', name: 'Free State', capital: 'Bloemfontein' },
  { code: 'GP', name: 'Gauteng', capital: 'Johannesburg' },
  { code: 'KZN', name: 'KwaZulu-Natal', capital: 'Pietermaritzburg' },
  { code: 'LP', name: 'Limpopo', capital: 'Polokwane' },
  { code: 'MP', name: 'Mpumalanga', capital: 'Mbombela' },
  { code: 'NC', name: 'Northern Cape', capital: 'Kimberley' },
  { code: 'NW', name: 'North West', capital: 'Mahikeng' },
  { code: 'WC', name: 'Western Cape', capital: 'Cape Town' }
];

// Major South African Cities and Townships (inclusive of all areas)
export const SA_LOCATIONS = [
  // Major Cities
  { name: 'Johannesburg', province: 'GP', type: 'city', priority: 'high' },
  { name: 'Cape Town', province: 'WC', type: 'city', priority: 'high' },
  { name: 'Durban', province: 'KZN', type: 'city', priority: 'high' },
  { name: 'Pretoria', province: 'GP', type: 'city', priority: 'high' },
  { name: 'Port Elizabeth', province: 'EC', type: 'city', priority: 'medium' },
  { name: 'Bloemfontein', province: 'FS', type: 'city', priority: 'medium' },
  { name: 'East London', province: 'EC', type: 'city', priority: 'medium' },
  
  // Townships and Informal Settlements (where many job seekers live)
  { name: 'Soweto', province: 'GP', type: 'township', priority: 'high' },
  { name: 'Khayelitsha', province: 'WC', type: 'township', priority: 'high' },
  { name: 'Umlazi', province: 'KZN', type: 'township', priority: 'high' },
  { name: 'Tembisa', province: 'GP', type: 'township', priority: 'high' },
  { name: 'Alexandra', province: 'GP', type: 'township', priority: 'high' },
  { name: 'Gugulethu', province: 'WC', type: 'township', priority: 'medium' },
  { name: 'Mamelodi', province: 'GP', type: 'township', priority: 'medium' },
  { name: 'Chatsworth', province: 'KZN', type: 'township', priority: 'medium' }
];

// PRIORITY JOB CATEGORIES - Focused on immediate opportunities for the unemployed
export const SA_PRIORITY_JOB_CATEGORIES = [
  {
    category: 'General Labour',
    priority: 'critical',
    description: 'Immediate opportunities for anyone willing to work',
    jobs: [
      'General Worker',
      'Factory Worker',
      'Warehouse Worker',
      'Construction Labourer',
      'Packer',
      'Loader',
      'Moving Assistant',
      'Demolition Worker',
      'Garden Worker'
    ],
    requirements: 'No experience required',
    salaryRange: { min: 3500, max: 8000 }
  },
  {
    category: 'Cleaning & Domestic',
    priority: 'critical',
    description: 'High demand jobs in cleaning and household work',
    jobs: [
      'Cleaner',
      'Domestic Worker',
      'Housekeeper',
      'Office Cleaner',
      'Industrial Cleaner',
      'Window Cleaner',
      'Car Washer',
      'Carpet Cleaner',
      'Gardener'
    ],
    requirements: 'Basic training provided',
    salaryRange: { min: 3000, max: 7500 }
  },
  {
    category: 'Security & Safety',
    priority: 'high',
    description: 'Growing field with training opportunities',
    jobs: [
      'Security Guard',
      'Gate Guard',
      'Shopping Mall Security',
      'Event Security',
      'Night Watchman',
      'Access Control',
      'CCTV Operator',
      'Patrolman',
      'Traffic Marshal'
    ],
    requirements: 'PSIRA registration (can be obtained)',
    salaryRange: { min: 4000, max: 9000 }
  },
  {
    category: 'Food Service',
    priority: 'high',
    description: 'Restaurant and food industry opportunities',
    jobs: [
      'Kitchen Assistant',
      'Waiter/Waitress',
      'Cleaner (Restaurant)',
      'Food Prep Assistant',
      'Dishwasher',
      'Fast Food Worker',
      'Delivery Assistant',
      'Street Food Vendor',
      'Catering Assistant'
    ],
    requirements: 'Food handling certificate helpful',
    salaryRange: { min: 3500, max: 8500 }
  },
  {
    category: 'Transport & Delivery',
    priority: 'high',
    description: 'Growing delivery and transport sector',
    jobs: [
      'Delivery Driver',
      'Taxi Driver',
      'Uber/Bolt Driver',
      'Courier',
      'Moving Assistant',
      'Truck Assistant',
      'Petrol Attendant',
      'Parking Attendant',
      'Car Guard'
    ],
    requirements: 'Valid drivers license for some positions',
    salaryRange: { min: 4000, max: 12000 }
  },
  {
    category: 'Retail & Customer Service',
    priority: 'medium',
    description: 'Entry-level retail opportunities',
    jobs: [
      'Shop Assistant',
      'Cashier',
      'Packer (Retail)',
      'Merchandiser',
      'Stockroom Assistant',
      'Trolley Collector',
      'Customer Service',
      'Sales Assistant',
      'Promoter'
    ],
    requirements: 'Grade 10-12 preferred',
    salaryRange: { min: 4500, max: 10000 }
  }
];

// IMMEDIATE OPPORTUNITY SKILLS - Skills that can be learned quickly
export const SA_IMMEDIATE_SKILLS = [
  // No skills required
  'Willing to learn',
  'Reliable',
  'Punctual',
  'Physical fitness',
  'Team player',
  
  // Basic skills (1-7 days training)
  'Basic cleaning',
  'Manual labor',
  'Following instructions',
  'Safety awareness',
  'Basic communication',
  
  // Short-term learnable (1-4 weeks)
  'Food safety',
  'Customer service',
  'Cash handling',
  'Stock counting',
  'Basic computer literacy',
  'Cell phone operation',
  
  // Medium-term (1-6 months)
  'Security training',
  'First aid',
  'Driving license',
  'Forklift operation',
  'Basic maintenance'
];

// SALARY RANGES - Realistic for South African market, focused on entry-level
export const SA_SALARY_RANGES = [
  { min: 0, max: 4000, label: 'R0 - R4,000 (Part-time/Casual)', priority: 'critical' },
  { min: 4000, max: 6000, label: 'R4,000 - R6,000 (Entry Level)', priority: 'critical' },
  { min: 6000, max: 8000, label: 'R6,000 - R8,000 (General Work)', priority: 'high' },
  { min: 8000, max: 12000, label: 'R8,000 - R12,000 (Skilled Entry)', priority: 'high' },
  { min: 12000, max: 18000, label: 'R12,000 - R18,000 (Experienced)', priority: 'medium' },
  { min: 18000, max: 25000, label: 'R18,000 - R25,000 (Supervisor)', priority: 'medium' },
  { min: 25000, max: 35000, label: 'R25,000 - R35,000 (Management)', priority: 'low' },
  { min: 35000, max: null, label: 'R35,000+ (Professional)', priority: 'low' }
];

// EDUCATION LEVELS - Realistic and inclusive
export const SA_EDUCATION_LEVELS = [
  { value: 'no_formal', label: 'No formal education', jobsAvailable: true },
  { value: 'primary', label: 'Primary school (Grade 1-7)', jobsAvailable: true },
  { value: 'grade8', label: 'Grade 8', jobsAvailable: true },
  { value: 'grade9', label: 'Grade 9', jobsAvailable: true },
  { value: 'grade10', label: 'Grade 10', jobsAvailable: true },
  { value: 'grade11', label: 'Grade 11', jobsAvailable: true },
  { value: 'matric', label: 'Matric/Grade 12', jobsAvailable: true },
  { value: 'certificate', label: 'Certificate', jobsAvailable: true },
  { value: 'diploma', label: 'Diploma', jobsAvailable: true },
  { value: 'bachelor', label: 'Bachelor\'s degree', jobsAvailable: true },
  { value: 'honours', label: 'Honours degree', jobsAvailable: true },
  { value: 'master', label: 'Master\'s degree', jobsAvailable: true },
  { value: 'doctorate', label: 'Doctorate/PhD', jobsAvailable: true }
];

// LANGUAGES - South African languages with employment context
export const SA_LANGUAGES = [
  { code: 'en', name: 'English', essential: true, jobs: 'All sectors' },
  { code: 'af', name: 'Afrikaans', essential: false, jobs: 'Western Cape, farming' },
  { code: 'zu', name: 'isiZulu', essential: false, jobs: 'KZN, Gauteng' },
  { code: 'xh', name: 'isiXhosa', essential: false, jobs: 'Eastern Cape, Western Cape' },
  { code: 'nso', name: 'Sepedi', essential: false, jobs: 'Limpopo, Gauteng' },
  { code: 'st', name: 'Sesotho', essential: false, jobs: 'Free State, Gauteng' },
  { code: 'tn', name: 'Setswana', essential: false, jobs: 'North West, Gauteng' },
  { code: 'ts', name: 'Xitsonga', essential: false, jobs: 'Limpopo, Mpumalanga' },
  { code: 've', name: 'Tshivenda', essential: false, jobs: 'Limpopo' },
  { code: 'nd', name: 'isiNdebele', essential: false, jobs: 'Mpumalanga' },
  { code: 'ss', name: 'siSwati', essential: false, jobs: 'Mpumalanga' }
];

// COMMON INDUSTRIES WITH ENTRY-LEVEL OPPORTUNITIES
export const SA_ENTRY_LEVEL_INDUSTRIES = [
  {
    name: 'Retail & Wholesale',
    opportunities: 'Very High',
    description: 'Supermarkets, shops, malls',
    commonJobs: ['Shop Assistant', 'Packer', 'Cashier', 'Security']
  },
  {
    name: 'Manufacturing',
    opportunities: 'High',
    description: 'Factories, production lines',
    commonJobs: ['General Worker', 'Machine Operator', 'Packer', 'Quality Control']
  },
  {
    name: 'Construction',
    opportunities: 'High',
    description: 'Building, infrastructure',
    commonJobs: ['General Labourer', 'Assistant', 'Site Cleaner', 'Tool Handler']
  },
  {
    name: 'Hospitality',
    opportunities: 'High',
    description: 'Hotels, restaurants, events',
    commonJobs: ['Cleaner', 'Kitchen Assistant', 'Waiter', 'Room Service']
  },
  {
    name: 'Transport & Logistics',
    opportunities: 'High',
    description: 'Delivery, warehousing',
    commonJobs: ['Driver', 'Loader', 'Warehouse Worker', 'Courier']
  },
  {
    name: 'Cleaning Services',
    opportunities: 'Very High',
    description: 'Office cleaning, domestic work',
    commonJobs: ['Cleaner', 'Domestic Worker', 'Gardener', 'Maintenance']
  }
];

// IMMEDIATE EMPLOYMENT PROGRAMS
export const SA_EMPLOYMENT_PROGRAMS = [
  {
    name: 'EPWP (Expanded Public Works Programme)',
    description: 'Government job creation program',
    target: 'Unemployed youth and adults',
    duration: '6-24 months',
    sectors: ['Infrastructure', 'Environment', 'Social', 'Economic']
  },
  {
    name: 'CWP (Community Work Programme)',
    description: 'Community-based employment',
    target: 'Local unemployed residents',
    duration: '2 days per week minimum',
    sectors: ['Community services', 'Local development']
  },
  {
    name: 'YES Programme',
    description: 'Youth Employment Service',
    target: 'Youth 18-35 years',
    duration: '12 months',
    sectors: ['Private sector partnerships']
  }
];

// MOBILE-FIRST CONSIDERATIONS (many users will access via phone)
export const SA_MOBILE_CONSIDERATIONS = {
  DATA_COSTS: 'High - minimize data usage',
  CONNECTION: 'Often slow - optimize for 2G/3G',
  LANGUAGES: 'Multi-language support essential',
  LITERACY: 'Some users have limited literacy',
  FEATURES: [
    'Voice search',
    'Simple forms',
    'Image-based navigation',
    'Offline job saving',
    'SMS notifications',
    'WhatsApp integration'
  ]
};

// MINIMUM WAGE AND REALISTIC EXPECTATIONS
export const SA_WAGE_STANDARDS = {
  NATIONAL_MINIMUM_WAGE: {
    HOURLY: 27.58, // ZAR per hour
    DAILY: 220.64, // ZAR per day (8 hours)
    MONTHLY: 4558, // ZAR per month
    ANNUAL: 54696 // ZAR per year
  },
  DOMESTIC_WORKERS: {
    HOURLY: 19.09,
    MONTHLY: 3943
  },
  FARM_WORKERS: {
    HOURLY: 21.69,
    MONTHLY: 4479
  },
  LEARNERSHIP: {
    RATE: 'Can be below minimum wage during training'
  }
};

// COMMON REQUIREMENTS FOR ENTRY-LEVEL JOBS
export const SA_COMMON_REQUIREMENTS = {
  DOCUMENTS_NEEDED: [
    'South African ID Document',
    'Proof of residence',
    'Bank account details',
    'Reference letters (if available)',
    'Medical certificate (for some jobs)'
  ],
  CERTIFICATES_HELPFUL: [
    'Matric Certificate',
    'First Aid Certificate',
    'Computer Literacy Certificate',
    'Driver\'s License',
    'PSIRA Certificate (for security)',
    'Food Handlers Certificate'
  ],
  NO_EXPERIENCE_JOBS: [
    'General Worker',
    'Cleaner',
    'Kitchen Assistant',
    'Packer',
    'Loader',
    'Garden Worker',
    'Car Guard',
    'Domestic Worker'
  ]
};

// JOB SEARCH TIPS FOR ENTRY-LEVEL SEEKERS
export const SA_JOB_SEARCH_TIPS = [
  'Apply for multiple positions daily',
  'Be available to start immediately',
  'Dress neatly for interviews',
  'Arrive early for appointments',
  'Bring all required documents',
  'Show willingness to learn',
  'Be honest about your skills',
  'Ask family and friends about opportunities',
  'Check community notice boards',
  'Visit factories and shops in person'
];

// TRAINING OPPORTUNITIES
export const SA_TRAINING_OPPORTUNITIES = [
  {
    name: 'SETA Training',
    description: 'Skills development through Sector Education and Training Authorities',
    cost: 'Usually free',
    duration: '1-12 months'
  },
  {
    name: 'Learnerships',
    description: 'Work-based learning programs',
    cost: 'Paid while learning',
    duration: '12-24 months'
  },
  {
    name: 'Community Colleges',
    description: 'Technical and vocational training',
    cost: 'Low cost',
    duration: '6 months - 3 years'
  },
  {
    name: 'NGO Training',
    description: 'Skills training by non-profit organizations',
    cost: 'Usually free',
    duration: '1-6 months'
  }
];

// PRIORITY FEATURES FOR THE POOR/UNEMPLOYED
export const SA_PRIORITY_FEATURES = [
  'SMS job alerts (no data needed)',
  'Offline job viewing',
  'Simple one-click applications',
  'Voice-based job search',
  'Picture-based categories',
  'Transport cost calculator',
  'Nearest job location finder',
  'Free training opportunities',
  'Government program information',
  'Emergency job listings'
];

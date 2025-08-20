/**
 * 🇿🇦 SOUTH AFRICAN SEED DATA
 * 
 * Comprehensive seed data for AI Job Chommie platform
 * Includes provinces, cities, job categories, companies, and sample jobs
 */

import { db } from '../../../apps/web/src/src/config/database';
import { jobs, users, jobApplications, userProfiles } from '../../../apps/web/src/src/models/schema';
import bcrypt from 'bcryptjs';

// South African provinces with major cities
export const SOUTH_AFRICAN_DATA = {
  provinces: {
    'Western Cape': [
      'Cape Town', 'Stellenbosch', 'Paarl', 'Worcester', 'George', 'Mossel Bay', 
      'Hermanus', 'Swellendam', 'Oudtshoorn', 'Knysna', 'Plettenberg Bay'
    ],
    'Gauteng': [
      'Johannesburg', 'Pretoria', 'Sandton', 'Randburg', 'Roodepoort', 'Soweto',
      'Benoni', 'Boksburg', 'Germiston', 'Kempton Park', 'Springs', 'Vanderbijlpark'
    ],
    'KwaZulu-Natal': [
      'Durban', 'Pietermaritzburg', 'Newcastle', 'Pinetown', 'Chatsworth',
      'Umlazi', 'Phoenix', 'Richards Bay', 'Port Shepstone', 'Empangeni'
    ],
    'Eastern Cape': [
      'Port Elizabeth', 'East London', 'Uitenhage', 'King Williams Town',
      'Mdantsane', 'Queenstown', 'Bhisho', 'Grahamstown', 'Graaff-Reinet'
    ],
    'Limpopo': [
      'Polokwane', 'Thohoyandou', 'Tzaneen', 'Phalaborwa', 'Louis Trichardt',
      'Giyani', 'Musina', 'Bela-Bela', 'Modimolle'
    ],
    'Mpumalanga': [
      'Nelspruit', 'Witbank', 'Secunda', 'Middelburg', 'Standerton',
      'Sabie', 'White River', 'Barberton', 'Ermelo'
    ],
    'North West': [
      'Rustenburg', 'Klerksdorp', 'Potchefstroom', 'Mafikeng', 'Brits',
      'Carltonville', 'Lichtenburg', 'Zeerust'
    ],
    'Northern Cape': [
      'Kimberley', 'Upington', 'Springbok', 'De Aar', 'Kuruman',
      'Port Nolloth', 'Postmasburg', 'Calvinia'
    ],
    'Free State': [
      'Bloemfontein', 'Welkom', 'Kroonstad', 'Bethlehem', 'Phuthaditjhaba',
      'Sasolburg', 'Virginia', 'Parys', 'Harrismith'
    ]
  }
};

// Job categories specific to South African market
export const JOB_CATEGORIES = {
  'General Labour': [
    'General Worker', 'Factory Worker', 'Warehouse Worker', 'Production Assistant',
    'Packer', 'Sorter', 'Loader', 'Material Handler'
  ],
  'Cleaning & Domestic': [
    'Cleaning Assistant', 'Domestic Worker', 'Housekeeper', 'Office Cleaner',
    'Industrial Cleaner', 'Garden Services', 'Laundry Assistant'
  ],
  'Security Services': [
    'Security Guard', 'Access Control', 'Armed Response', 'CCTV Operator',
    'Security Supervisor', 'Patrol Officer', 'Event Security'
  ],
  'Food Service': [
    'Kitchen Assistant', 'Waiter/Waitress', 'Food Preparation', 'Dishwasher',
    'Barista', 'Fast Food Crew', 'Catering Assistant', 'Food Packer'
  ],
  'Retail & Sales': [
    'Shop Assistant', 'Cashier', 'Sales Representative', 'Merchandiser',
    'Stock Controller', 'Customer Service', 'Till Operator', 'Promoter'
  ],
  'Transport & Logistics': [
    'Delivery Driver', 'Truck Driver', 'Forklift Operator', 'Courier',
    'Dispatcher', 'Route Planner', 'Loading Bay Assistant'
  ],
  'Construction': [
    'Construction Worker', 'Painter', 'Electrician Assistant', 'Plumber Assistant',
    'Welder', 'Carpenter', 'Bricklayer', 'Roofer', 'General Handyman'
  ],
  'Healthcare Support': [
    'Healthcare Assistant', 'Porter', 'Cleaner (Healthcare)', 'Catering (Healthcare)',
    'Patient Transport', 'Pharmacy Assistant', 'Reception'
  ],
  'Agriculture': [
    'Farm Worker', 'Picker', 'Packer (Agriculture)', 'Equipment Operator',
    'Greenhouse Worker', 'Livestock Assistant', 'Irrigation Worker'
  ],
  'Mining Support': [
    'Mining Assistant', 'Equipment Operator (Mining)', 'Safety Assistant',
    'Maintenance Helper', 'Transport (Mining)', 'Surface Worker'
  ]
};

// South African companies (mix of real and realistic fictional ones)
export const SAMPLE_COMPANIES = [
  // Real major SA companies
  { name: 'Pick n Pay', sector: 'Retail', logo: null },
  { name: 'Shoprite Holdings', sector: 'Retail', logo: null },
  { name: 'Woolworths', sector: 'Retail', logo: null },
  { name: 'Clicks Group', sector: 'Retail', logo: null },
  { name: 'Bidvest', sector: 'Services', logo: null },
  { name: 'Imperial Holdings', sector: 'Logistics', logo: null },
  { name: 'Tiger Brands', sector: 'Food Manufacturing', logo: null },
  { name: 'Pioneer Foods', sector: 'Food Manufacturing', logo: null },
  { name: 'Mr Price Group', sector: 'Retail', logo: null },
  { name: 'Massmart', sector: 'Retail', logo: null },
  
  // Realistic fictional companies
  { name: 'Cape Town Cleaning Services', sector: 'Cleaning', logo: null },
  { name: 'Joburg Security Solutions', sector: 'Security', logo: null },
  { name: 'Durban Fresh Foods', sector: 'Food Processing', logo: null },
  { name: 'SA Transport & Logistics', sector: 'Transport', logo: null },
  { name: 'Garden Route Tourism', sector: 'Hospitality', logo: null },
  { name: 'Highveld Manufacturing', sector: 'Manufacturing', logo: null },
  { name: 'Coastal Construction Co.', sector: 'Construction', logo: null },
  { name: 'Western Cape Vineyards', sector: 'Agriculture', logo: null },
  { name: 'KZN Healthcare Support', sector: 'Healthcare', logo: null },
  { name: 'Free State Farming Co-op', sector: 'Agriculture', logo: null }
];

// Sample job requirements by category
export const JOB_REQUIREMENTS = {
  'entry-level': [
    'Matric certificate preferred but not essential',
    'No previous experience required',
    'Must be physically fit',
    'Reliable and punctual',
    'Able to work in a team',
    'Good communication skills',
    'Available to work shifts',
    'Own reliable transport preferred'
  ],
  'with-experience': [
    'Matric certificate required',
    '1-2 years relevant experience',
    'Valid drivers license',
    'Computer literacy preferred',
    'Previous experience in similar role',
    'Good customer service skills',
    'Able to work independently',
    'References required'
  ]
};

export const JOB_BENEFITS = [
  'Medical aid contribution after probation',
  'Annual bonus based on performance',
  'Overtime opportunities available',
  'On-the-job training provided',
  'Career advancement opportunities',
  'Transport allowance',
  'Free meals during shifts',
  'Uniform provided',
  'Paid annual leave',
  '13th cheque',
  'Skills development programs',
  'Employee wellness programs'
];

/**
 * Seed database with initial data
 */
export async function seedDatabase() {
  console.log(' Starting database seed process...');
  
  try {
    // Create sample admin user
    console.log(' Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123!', 12);
    
    const [adminUser] = await db.insert(users).values({
      email: 'admin@aijobchommie.co.za',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      phone: '+27123456789',
      location: 'Cape Town, Western Cape',
      province: 'Western Cape',
      city: 'Cape Town',
      role: 'admin',
      isVerified: true,
      subscriptionPlan: 'premium'
    }).returning();

    // Create sample regular users
    console.log(' Creating sample users...');
    const sampleUsers = [
      {
        email: 'john.doe@gmail.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'John',
        lastName: 'Doe',
        phone: '+27821234567',
        location: 'Johannesburg, Gauteng',
        province: 'Gauteng',
        city: 'Johannesburg',
        role: 'user'
      },
      {
        email: 'sarah.smith@gmail.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'Sarah',
        lastName: 'Smith',
        phone: '+27829876543',
        location: 'Cape Town, Western Cape',
        province: 'Western Cape',
        city: 'Cape Town',
        role: 'user'
      },
      {
        email: 'mike.johnson@gmail.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'Mike',
        lastName: 'Johnson',
        phone: '+27831122334',
        location: 'Durban, KwaZulu-Natal',
        province: 'KwaZulu-Natal',
        city: 'Durban',
        role: 'user'
      }
    ];

    const createdUsers = await db.insert(users).values(sampleUsers).returning();

    // Create comprehensive job listings
    console.log(' Creating sample job listings...');
    const sampleJobs = [];

    // Generate jobs for each category and location
    Object.entries(JOB_CATEGORIES).forEach(([category, jobTitles]) => {
      Object.entries(SOUTH_AFRICAN_DATA.provinces).forEach(([province, cities]) => {
        // Create 2-3 jobs per category per province
        for (let i = 0; i < Math.min(3, cities.length); i++) {
          const city = cities[i];
          const jobTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
          const company = SAMPLE_COMPANIES[Math.floor(Math.random() * SAMPLE_COMPANIES.length)];
          
          // Salary ranges by category (in ZAR)
          const salaryRanges = {
            'General Labour': { min: 3500, max: 5500 },
            'Cleaning & Domestic': { min: 3000, max: 4500 },
            'Security Services': { min: 4000, max: 6500 },
            'Food Service': { min: 2800, max: 4200 },
            'Retail & Sales': { min: 3200, max: 5000 },
            'Transport & Logistics': { min: 4500, max: 7500 },
            'Construction': { min: 4000, max: 8000 },
            'Healthcare Support': { min: 3800, max: 6000 },
            'Agriculture': { min: 2500, max: 4000 },
            'Mining Support': { min: 5000, max: 9000 }
          };

          const salaryRange = salaryRanges[category] || { min: 3000, max: 5000 };
          
          const job = {
            title: jobTitle,
            company: company.name,
            location: `${city}, ${province}`,
            province: province,
            city: city,
            address: `${Math.floor(Math.random() * 500) + 1} ${['Main', 'Church', 'Market', 'Industrial', 'Commercial'][Math.floor(Math.random() * 5)]} Street, ${city}`,
            description: generateJobDescription(jobTitle, company.name, city),
            requirements: JSON.stringify(getRandomRequirements()),
            benefits: JSON.stringify(getRandomBenefits()),
            responsibilities: JSON.stringify(generateResponsibilities(jobTitle)),
            salaryMin: salaryRange.min + Math.floor(Math.random() * 500),
            salaryMax: salaryRange.max + Math.floor(Math.random() * 1000),
            salaryCurrency: 'ZAR',
            salaryPeriod: 'monthly',
            jobType: getRandomJobType(),
            category: category,
            subcategory: jobTitle,
            experienceLevel: Math.random() > 0.7 ? 'mid-level' : 'entry-level',
            educationLevel: Math.random() > 0.5 ? 'matric' : null,
            workingHours: getRandomWorkingHours(),
            contactEmail: `hr@${company.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/gi, '')}.co.za`,
            contactPhone: generateSAPhoneNumber(),
            applicationMethod: ['online', 'email', 'phone', 'whatsapp'][Math.floor(Math.random() * 4)],
            tags: JSON.stringify([
              category.toLowerCase().replace(/\s+/g, '-'),
              city.toLowerCase(),
              province.toLowerCase().replace(/\s+/g, '-'),
              'entry-level',
              jobTitle.toLowerCase().replace(/\s+/g, '-')
            ]),
            isUrgent: Math.random() > 0.8,
            isImmediateStart: Math.random() > 0.7,
            noExperienceRequired: Math.random() > 0.6,
            isFeatured: Math.random() > 0.9,
            isVerified: Math.random() > 0.3,
            isActive: true,
            isRemote: Math.random() > 0.95, // Very few remote entry-level jobs
            source: 'manual',
            expiresAt: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)), // 30 days from now
            postedAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)) // Random date within last week
          };

          sampleJobs.push(job);
        }
      });
    });

    // Insert jobs in batches to avoid overwhelming the database
    const batchSize = 50;
    const jobBatches = [];
    for (let i = 0; i < sampleJobs.length; i += batchSize) {
      jobBatches.push(sampleJobs.slice(i, i + batchSize));
    }

    const allCreatedJobs = [];
    for (const batch of jobBatches) {
      const createdJobs = await db.insert(jobs).values(batch).returning();
      allCreatedJobs.push(...createdJobs);
      console.log(` Created ${createdJobs.length} jobs`);
    }

    // Create sample user profiles
    console.log(' Creating user profiles...');
    for (const user of createdUsers) {
      await db.insert(userProfiles).values({
        userId: user.id,
        bio: generateUserBio(user.firstName),
        skills: JSON.stringify(generateUserSkills()),
        education: JSON.stringify([
          {
            institution: 'Local High School',
            qualification: 'Matric Certificate',
            year: 2020,
            subjects: ['English', 'Afrikaans', 'Mathematics', 'Life Sciences']
          }
        ]),
        languages: JSON.stringify([
          { language: 'English', proficiency: 'Native' },
          { language: 'Afrikaans', proficiency: 'Conversational' }
        ]),
        preferredJobTypes: JSON.stringify(['full-time', 'part-time']),
        preferredLocations: JSON.stringify([user.province]),
        expectedSalaryMin: 3000,
        expectedSalaryMax: 6000,
        isAvailable: true
      });
    }

    // Create some sample job applications
    console.log(' Creating sample job applications...');
    const sampleApplications = [];
    const someJobs = allCreatedJobs.slice(0, 20); // Apply to first 20 jobs
    
    for (let i = 0; i < someJobs.length; i++) {
      const job = someJobs[i];
      const applicantUser = createdUsers[i % createdUsers.length];
      
      sampleApplications.push({
        jobId: job.id,
        userId: applicantUser.id,
        applicantName: `${applicantUser.firstName} ${applicantUser.lastName}`,
        applicantEmail: applicantUser.email,
        applicantPhone: applicantUser.phone || generateSAPhoneNumber(),
        coverLetter: generateCoverLetter(applicantUser.firstName, job.title, job.company),
        status: ['submitted', 'reviewing', 'interviewed'][Math.floor(Math.random() * 3)],
        trackingNumber: `TRK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        appliedAt: new Date(Date.now() - Math.floor(Math.random() * 5 * 24 * 60 * 60 * 1000))
      });
    }

    await db.insert(jobApplications).values(sampleApplications);

    console.log(' Database seeding completed successfully!');
    console.log(` Created:`);
    console.log(`   - 1 admin user`);
    console.log(`   - ${createdUsers.length} regular users`);
    console.log(`   - ${allCreatedJobs.length} job listings`);
    console.log(`   - ${createdUsers.length} user profiles`);
    console.log(`   - ${sampleApplications.length} job applications`);

  } catch (error) {
    console.error(' Database seeding failed:', error);
    throw error;
  }
}

// Helper functions
function generateJobDescription(title: string, company: string, city: string): string {
  const templates = [
    `${company} is looking for a reliable ${title} to join our team in ${city}. This is an excellent opportunity for someone looking to start or advance their career in a supportive environment. We offer comprehensive training and competitive compensation.`,
    
    `Join our dynamic team at ${company} as a ${title}! We are seeking motivated individuals who are eager to learn and contribute to our growing business in ${city}. Full training will be provided.`,
    
    `Exciting opportunity for a ${title} at ${company} in ${city}. We are looking for dedicated individuals who take pride in their work and want to be part of a successful team. No experience necessary - we will train the right candidate.`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

function getRandomRequirements(): string[] {
  const requirements = [...JOB_REQUIREMENTS['entry-level']];
  // Randomly select 3-5 requirements
  const count = 3 + Math.floor(Math.random() * 3);
  return requirements.sort(() => 0.5 - Math.random()).slice(0, count);
}

function getRandomBenefits(): string[] {
  const benefits = [...JOB_BENEFITS];
  // Randomly select 3-6 benefits
  const count = 3 + Math.floor(Math.random() * 4);
  return benefits.sort(() => 0.5 - Math.random()).slice(0, count);
}

function generateResponsibilities(title: string): string[] {
  const responsibilityTemplates = {
    'General Worker': [
      'Assist with general warehouse operations',
      'Pack and sort products according to specifications',
      'Maintain clean and safe work environment',
      'Follow all safety protocols and procedures',
      'Report any issues or concerns to supervisor'
    ],
    'Security Guard': [
      'Monitor premises and access points',
      'Conduct regular security patrols',
      'Check identification and authorization',
      'Complete incident reports when necessary',
      'Maintain professional appearance and conduct'
    ],
    'Kitchen Assistant': [
      'Assist with food preparation and cooking',
      'Maintain cleanliness in kitchen areas',
      'Wash dishes and kitchen equipment',
      'Stock ingredients and supplies',
      'Follow food safety and hygiene standards'
    ]
  };

  return responsibilityTemplates[title] || [
    'Perform assigned duties according to company standards',
    'Maintain clean and organized work area',
    'Follow all safety and operational procedures',
    'Communicate effectively with team members',
    'Complete tasks in a timely and efficient manner'
  ];
}

function getRandomJobType(): string {
  const types = ['full-time', 'part-time', 'contract', 'temporary'];
  const weights = [0.6, 0.25, 0.1, 0.05]; // Most jobs are full-time
  
  const random = Math.random();
  let sum = 0;
  
  for (let i = 0; i < types.length; i++) {
    sum += weights[i];
    if (random <= sum) {
      return types[i];
    }
  }
  
  return 'full-time';
}

function getRandomWorkingHours(): string {
  const options = [
    'Monday to Friday, 8AM - 5PM',
    'Monday to Saturday, 7AM - 4PM',
    'Shift work (day/night shifts available)',
    'Flexible hours',
    'Monday to Friday, 9AM - 6PM',
    'Weekends available',
    '24/7 shift patterns'
  ];
  
  return options[Math.floor(Math.random() * options.length)];
}

function generateSAPhoneNumber(): string {
  const prefixes = ['082', '083', '084', '072', '073', '074', '076', '078', '079'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = Math.floor(Math.random() * 9000000) + 1000000;
  return `+27${prefix}${number}`;
}

function generateUserBio(firstName: string): string {
  const bios = [
    `Hi, I'm ${firstName}! I'm a hardworking individual looking for opportunities to grow my career. I'm reliable, punctual, and eager to learn new skills. I believe in giving my best in everything I do.`,
    
    `${firstName} here - I'm passionate about finding work where I can make a difference. I have a positive attitude and I'm always willing to help my colleagues. Looking for a company where I can develop my skills.`,
    
    `My name is ${firstName} and I'm actively seeking employment opportunities. I'm a quick learner, work well in teams, and always maintain a professional attitude. I'm excited about starting my career journey.`
  ];
  
  return bios[Math.floor(Math.random() * bios.length)];
}

function generateUserSkills(): string[] {
  const skills = [
    'Communication', 'Teamwork', 'Time Management', 'Problem Solving', 
    'Customer Service', 'Computer Literacy', 'Attention to Detail', 
    'Physical Fitness', 'Reliability', 'Leadership', 'Organization',
    'Multi-tasking', 'Adaptability', 'Punctuality'
  ];
  
  // Return 4-8 random skills
  const count = 4 + Math.floor(Math.random() * 5);
  return skills.sort(() => 0.5 - Math.random()).slice(0, count);
}

function generateCoverLetter(firstName: string, jobTitle: string, company: string): string {
  return `Dear Hiring Manager,

I am writing to express my interest in the ${jobTitle} position at ${company}. I am a dedicated and hardworking individual who is eager to contribute to your team.

Although I may be new to this field, I am committed to learning and growing within the role. I pride myself on being reliable, punctual, and having a positive attitude towards work and colleagues.

I would welcome the opportunity to discuss how my enthusiasm and willingness to learn could benefit your organization. Thank you for considering my application.

Best regards,
${firstName}`;
}

// Export the seed function to be run from command line
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log(' Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error(' Seeding failed:', error);
      process.exit(1);
    });
}

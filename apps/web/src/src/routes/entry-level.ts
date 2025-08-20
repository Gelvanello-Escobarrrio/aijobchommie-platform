/**
 * Entry-Level Jobs Routes
 * PRIORITY: Highest - Focus on immediate job opportunities for the unemployed
 */

import express from 'express';
import { Request, Response } from 'express';
import { 
  SA_PRIORITY_JOB_CATEGORIES, 
  SA_SALARY_RANGES, 
  SA_LOCATIONS,
  SA_IMMEDIATE_SKILLS,
  SA_COMMON_REQUIREMENTS,
  createSuccessResponse,
  createErrorResponse
} from '@aijobchommie/shared';
import { logger } from '../utils/logger';

const router = express.Router();

/**
 * GET /api/v1/entry-level/jobs
 * Get entry-level jobs with priority sorting
 * NO AUTH REQUIRED - Accessible to everyone
 */
router.get('/jobs', async (req: Request, res: Response) => {
  try {
    const {
      location = 'all',
      category = 'all',
      salaryMin = 0,
      salaryMax = 15000, // Focus on entry-level range
      page = 1,
      limit = 20,
      sortBy = 'priority', // priority, date, salary, distance
      urgentOnly = false,
      immediateStart = false,
      noExperience = false
    } = req.query;

    // Mock data for now - replace with real database queries
    const mockJobs = [
      {
        id: '1',
        title: 'General Worker - Factory',
        company: 'Cape Town Manufacturing',
        location: 'Cape Town',
        salary: { min: 4500, max: 6000, currency: 'ZAR' },
        category: 'General Labour',
        priority: 'critical',
        urgentHiring: true,
        immediateStart: true,
        noExperienceRequired: true,
        description: 'Looking for reliable workers for factory production line. No experience necessary - full training provided.',
        requirements: ['South African ID', 'Available immediately', 'Physical fitness'],
        benefits: ['Training provided', 'Transport allowance', 'Meals provided'],
        contactPhone: '+27-21-xxx-xxxx',
        applicationMethod: 'walk_in',
        address: '123 Factory Street, Parow, Cape Town',
        workingHours: 'Monday-Friday, 7:00-16:00',
        startDate: 'Immediate',
        postedAt: new Date('2024-01-10'),
        tags: ['entry-level', 'no-experience', 'training-provided', 'transport-allowance']
      },
      {
        id: '2',
        title: 'Cleaner - Office Building',
        company: 'Clean Pro Services',
        location: 'Johannesburg',
        salary: { min: 4000, max: 5500, currency: 'ZAR' },
        category: 'Cleaning & Domestic',
        priority: 'critical',
        urgentHiring: true,
        immediateStart: true,
        noExperienceRequired: true,
        description: 'Office cleaning position available. Evening shift. Perfect for someone looking to start immediately.',
        requirements: ['South African ID', 'Reliable', 'Available evenings'],
        benefits: ['Weekly pay', 'Uniform provided', 'Performance bonus'],
        contactPhone: '+27-11-xxx-xxxx',
        applicationMethod: 'phone',
        workingHours: 'Monday-Friday, 17:00-21:00',
        startDate: 'This week',
        postedAt: new Date('2024-01-09'),
        tags: ['entry-level', 'evening-shift', 'weekly-pay', 'uniform-provided']
      },
      {
        id: '3',
        title: 'Security Guard - Shopping Mall',
        company: 'Secure Guard SA',
        location: 'Durban',
        salary: { min: 5000, max: 7000, currency: 'ZAR' },
        category: 'Security & Safety',
        priority: 'high',
        urgentHiring: false,
        immediateStart: true,
        noExperienceRequired: false,
        description: 'Security guard needed for busy shopping mall. PSIRA registration required or can be obtained.',
        requirements: ['South African ID', 'PSIRA registration (or willing to get)', 'Clear criminal record'],
        benefits: ['PSIRA training provided', 'Shift allowance', 'Medical aid'],
        contactPhone: '+27-31-xxx-xxxx',
        applicationMethod: 'email',
        workingHours: 'Rotating shifts',
        startDate: 'Next week',
        postedAt: new Date('2024-01-08'),
        tags: ['security', 'psira-training', 'medical-aid', 'shift-work']
      },
      {
        id: '4',
        title: 'Kitchen Assistant - Restaurant',
        company: 'Tasty Bites Restaurant',
        location: 'Pretoria',
        salary: { min: 3800, max: 5200, currency: 'ZAR' },
        category: 'Food Service',
        priority: 'high',
        urgentHiring: true,
        immediateStart: true,
        noExperienceRequired: true,
        description: 'Kitchen helper needed urgently. Great opportunity to learn cooking skills. Staff meals included.',
        requirements: ['South African ID', 'Willing to work weekends', 'Basic hygiene knowledge'],
        benefits: ['Staff meals', 'Tips sharing', 'Skills training'],
        contactPhone: '+27-12-xxx-xxxx',
        applicationMethod: 'walk_in',
        address: '456 Restaurant Ave, Pretoria Central',
        workingHours: 'Monday-Sunday, 10:00-22:00 (rotating shifts)',
        startDate: 'Tomorrow if possible',
        postedAt: new Date('2024-01-11'),
        tags: ['kitchen', 'staff-meals', 'tips', 'weekend-work']
      }
    ];

    // Filter jobs based on parameters
    let filteredJobs = mockJobs.filter(job => {
      if (location !== 'all' && !job.location.toLowerCase().includes(location.toLowerCase())) {
        return false;
      }
      
      if (category !== 'all' && job.category !== category) {
        return false;
      }
      
      if (job.salary.min < Number(salaryMin) || job.salary.max > Number(salaryMax)) {
        return false;
      }
      
      if (urgentOnly === 'true' && !job.urgentHiring) {
        return false;
      }
      
      if (immediateStart === 'true' && !job.immediateStart) {
        return false;
      }
      
      if (noExperience === 'true' && !job.noExperienceRequired) {
        return false;
      }
      
      return true;
    });

    // Sort jobs based on priority for entry-level seekers
    filteredJobs = filteredJobs.sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { critical: 3, high: 2, medium: 1, low: 0 };
        const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
        const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
        
        if (aPriority !== bPriority) {
          return bPriority - aPriority; // Higher priority first
        }
        
        // Secondary sort by urgent hiring
        if (a.urgentHiring !== b.urgentHiring) {
          return a.urgentHiring ? -1 : 1;
        }
        
        // Tertiary sort by immediate start
        if (a.immediateStart !== b.immediateStart) {
          return a.immediateStart ? -1 : 1;
        }
      }
      
      return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
    });

    // Pagination
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit))); // Max 50 jobs per page
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);
    const totalJobs = filteredJobs.length;
    const totalPages = Math.ceil(totalJobs / limitNum);

    // Add quick apply info
    const jobsWithQuickApply = paginatedJobs.map(job => ({
      ...job,
      quickApplyAvailable: job.applicationMethod === 'walk_in' || job.applicationMethod === 'phone',
      applicationInstructions: job.applicationMethod === 'walk_in' 
        ? `Visit us at: ${job.address}` 
        : job.applicationMethod === 'phone'
        ? `Call: ${job.contactPhone}`
        : 'Apply online',
      estimatedApplicationTime: job.applicationMethod === 'walk_in' ? '15 minutes' : '5 minutes'
    }));

    res.json(createSuccessResponse({
      jobs: jobsWithQuickApply,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalJobs,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      },
      filters: {
        location,
        category,
        salaryRange: { min: salaryMin, max: salaryMax },
        urgentOnly: urgentOnly === 'true',
        immediateStart: immediateStart === 'true',
        noExperience: noExperience === 'true'
      },
      summary: {
        totalJobs,
        urgentJobs: filteredJobs.filter(j => j.urgentHiring).length,
        immediateStartJobs: filteredJobs.filter(j => j.immediateStart).length,
        noExperienceJobs: filteredJobs.filter(j => j.noExperienceRequired).length
      }
    }, `Found ${totalJobs} entry-level job opportunities`));

  } catch (error) {
    logger.error('Error fetching entry-level jobs:', error);
    res.status(500).json(createErrorResponse('Failed to fetch entry-level jobs'));
  }
});

/**
 * GET /api/v1/entry-level/categories
 * Get job categories prioritized for entry-level seekers
 */
router.get('/categories', (req: Request, res: Response) => {
  try {
    res.json(createSuccessResponse({
      categories: SA_PRIORITY_JOB_CATEGORIES,
      message: 'Categories are sorted by priority - Critical and High priority categories offer the most immediate opportunities'
    }, 'Entry-level job categories retrieved successfully'));
  } catch (error) {
    logger.error('Error fetching job categories:', error);
    res.status(500).json(createErrorResponse('Failed to fetch job categories'));
  }
});

/**
 * GET /api/v1/entry-level/locations
 * Get locations with job opportunities
 */
router.get('/locations', (req: Request, res: Response) => {
  try {
    // Add job count data (mock for now)
    const locationsWithJobs = SA_LOCATIONS.map(location => ({
      ...location,
      jobCount: Math.floor(Math.random() * 500) + 10, // Mock job count
      entryLevelJobCount: Math.floor(Math.random() * 200) + 5,
      urgentJobCount: Math.floor(Math.random() * 50) + 1
    })).sort((a, b) => b.entryLevelJobCount - a.entryLevelJobCount);

    res.json(createSuccessResponse({
      locations: locationsWithJobs,
      priorityAreas: locationsWithJobs.filter(l => l.priority === 'high')
    }, 'Locations with entry-level job opportunities'));
  } catch (error) {
    logger.error('Error fetching locations:', error);
    res.status(500).json(createErrorResponse('Failed to fetch locations'));
  }
});

/**
 * GET /api/v1/entry-level/skills
 * Get skills that can help with entry-level jobs
 */
router.get('/skills', (req: Request, res: Response) => {
  try {
    res.json(createSuccessResponse({
      immediateSkills: SA_IMMEDIATE_SKILLS.slice(0, 20), // Top 20 most relevant
      skillsByTimeframe: {
        noSkillsRequired: [
          'Willing to learn',
          'Reliable',
          'Punctual',
          'Physical fitness',
          'Team player'
        ],
        oneWeekTraining: [
          'Basic cleaning',
          'Manual labor',
          'Following instructions',
          'Safety awareness',
          'Basic communication'
        ],
        oneMonthTraining: [
          'Food safety',
          'Customer service',
          'Cash handling',
          'Stock counting',
          'Basic computer literacy'
        ]
      },
      tips: [
        'Start with jobs that require no experience',
        'Show willingness to learn in applications',
        'Highlight reliability and punctuality',
        'Consider jobs with training provided',
        'Look for companies that offer transport allowance'
      ]
    }, 'Entry-level skills and development path'));
  } catch (error) {
    logger.error('Error fetching skills:', error);
    res.status(500).json(createErrorResponse('Failed to fetch skills'));
  }
});

/**
 * GET /api/v1/entry-level/requirements
 * Get common requirements for entry-level jobs
 */
router.get('/requirements', (req: Request, res: Response) => {
  try {
    res.json(createSuccessResponse({
      commonRequirements: SA_COMMON_REQUIREMENTS,
      preparationTips: [
        'Keep your ID document with you',
        'Have proof of residence ready',
        'Prepare reference letters from previous employers, teachers, or community leaders',
        'Get a basic bank account for salary payments',
        'Consider getting a basic medical certificate',
        'Dress neatly for interviews, even for entry-level positions'
      ],
      costFreeDocuments: [
        'South African ID Document',
        'Matric Certificate (if you have one)',
        'Reference letters from community members'
      ]
    }, 'Entry-level job requirements and preparation guide'));
  } catch (error) {
    logger.error('Error fetching requirements:', error);
    res.status(500).json(createErrorResponse('Failed to fetch requirements'));
  }
});

/**
 * GET /api/v1/entry-level/urgent
 * Get urgent entry-level jobs that need immediate filling
 */
router.get('/urgent', async (req: Request, res: Response) => {
  try {
    // Mock urgent jobs data
    const urgentJobs = [
      {
        id: '1',
        title: 'General Workers Needed URGENTLY',
        company: 'Quick Hire Factory',
        location: 'Johannesburg',
        salary: { amount: 5000, currency: 'ZAR' },
        startDate: 'Tomorrow',
        contactPhone: '+27-11-xxx-xxxx',
        applicationMethod: 'walk_in',
        address: '789 Industrial Road, Germiston',
        urgencyLevel: 'critical',
        reasonForUrgency: 'Large order needs immediate fulfillment',
        positionsAvailable: 20,
        requirements: ['South African ID', 'Available immediately']
      },
      {
        id: '2',
        title: 'Cleaners - Shopping Center',
        company: 'Clean Fast',
        location: 'Cape Town',
        salary: { amount: 4200, currency: 'ZAR' },
        startDate: 'This week',
        contactPhone: '+27-21-xxx-xxxx',
        applicationMethod: 'phone',
        urgencyLevel: 'high',
        reasonForUrgency: 'Staff shortage due to holidays',
        positionsAvailable: 8,
        requirements: ['South African ID', 'Own transport preferred']
      }
    ];

    res.json(createSuccessResponse({
      urgentJobs,
      totalUrgentPositions: urgentJobs.reduce((sum, job) => sum + job.positionsAvailable, 0),
      applicationTips: [
        'Call or visit immediately - urgent jobs fill up fast',
        'Have your ID and proof of residence ready',
        'Be prepared to start as soon as possible',
        'Ask about transport assistance if you need it'
      ]
    }, 'Urgent entry-level job opportunities'));

  } catch (error) {
    logger.error('Error fetching urgent jobs:', error);
    res.status(500).json(createErrorResponse('Failed to fetch urgent jobs'));
  }
});

/**
 * GET /api/v1/entry-level/salary-guide
 * Get salary expectations for entry-level positions
 */
router.get('/salary-guide', (req: Request, res: Response) => {
  try {
    res.json(createSuccessResponse({
      salaryRanges: SA_SALARY_RANGES.filter(range => range.priority === 'critical' || range.priority === 'high'),
      minimumWage: {
        hourly: 27.58,
        daily: 220.64,
        monthly: 4558,
        currency: 'ZAR'
      },
      negotiationTips: [
        'Focus on showing reliability rather than asking for higher pay initially',
        'Ask about performance bonuses and salary reviews',
        'Consider benefits like transport allowance and meals',
        'Be willing to start at minimum wage to gain experience',
        'Ask about opportunities for advancement'
      ],
      additionalBenefits: [
        'Transport allowance',
        'Meals provided',
        'Uniform provided',
        'Training opportunities',
        'Medical aid (after probation)',
        'Performance bonuses'
      ]
    }, 'Entry-level salary guide for South African job market'));
  } catch (error) {
    logger.error('Error fetching salary guide:', error);
    res.status(500).json(createErrorResponse('Failed to fetch salary guide'));
  }
});

export default router;

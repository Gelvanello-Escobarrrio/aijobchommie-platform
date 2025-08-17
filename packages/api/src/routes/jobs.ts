/**
 * 💼 JOBS ROUTES
 * 
 * Complete REST API for job management with CRUD operations
 */

import { Router, Request, Response } from 'express';
import { body, query, param, validationResult } from 'express-validator';
import { eq, and, like, gte, lte, desc, asc, count } from 'drizzle-orm';
import { db } from '../config/database';
import { jobs, jobApplications, NewJob } from '../models/schema';
import { authenticateToken, AuthenticatedRequest, authorize } from '../services/authService';
import { CacheService } from '../config/redis';
import winston from 'winston';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const logger = winston.createLogger({
  transports: [new winston.transports.Console()]
});

// =====================================
// 📝 VALIDATION MIDDLEWARE
// =====================================

const createJobValidation = [
  body('title')
    .isLength({ min: 3, max: 200 })
    .trim()
    .withMessage('Job title must be between 3 and 200 characters'),
  body('company')
    .isLength({ min: 2, max: 200 })
    .trim()
    .withMessage('Company name must be between 2 and 200 characters'),
  body('location')
    .isLength({ min: 2, max: 255 })
    .trim()
    .withMessage('Location is required'),
  body('province')
    .isIn(['Western Cape', 'Eastern Cape', 'Northern Cape', 'Free State', 'KwaZulu-Natal', 'North West', 'Gauteng', 'Mpumalanga', 'Limpopo'])
    .withMessage('Please select a valid South African province'),
  body('description')
    .isLength({ min: 50 })
    .trim()
    .withMessage('Job description must be at least 50 characters'),
  body('jobType')
    .isIn(['full-time', 'part-time', 'contract', 'temporary', 'internship'])
    .withMessage('Please select a valid job type'),
  body('category')
    .notEmpty()
    .trim()
    .withMessage('Job category is required'),
  body('salaryMin')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Minimum salary must be a positive number'),
  body('salaryMax')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Maximum salary must be a positive number')
];

const searchJobsValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive number'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('salaryMin')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Minimum salary must be a positive number'),
  query('salaryMax')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Maximum salary must be a positive number')
];

const jobParamValidation = [
  param('jobId')
    .isUUID()
    .withMessage('Invalid job ID format')
];

// =====================================
// 🌍 JOBS ROUTES
// =====================================

/**
 * @route   GET /api/v1/jobs
 * @desc    Get jobs with filtering, pagination, and search
 * @access  Public
 */
router.get('/', searchJobsValidation, async (req: Request, res: Response) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Please check your query parameters',
        details: errors.array()
      });
    }

    // Extract query parameters
    const {
      page = 1,
      limit = 20,
      search,
      location,
      province,
      category,
      jobType,
      experienceLevel,
      salaryMin,
      salaryMax,
      urgent,
      featured,
      remote,
      sortBy = 'postedAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Build cache key
    const cacheKey = `jobs:search:${JSON.stringify(req.query)}`;
    
    // Try to get from cache first
    const cachedResults = await CacheService.get(cacheKey);
    if (cachedResults) {
      return res.json({
        success: true,
        message: 'Jobs retrieved successfully',
        data: cachedResults,
        cached: true
      });
    }

    // Build where conditions
    const conditions: any[] = [eq(jobs.isActive, true)];

    if (search) {
      conditions.push(
        like(jobs.title, `%${search}%`)
      );
    }

    if (location) {
      conditions.push(like(jobs.location, `%${location}%`));
    }

    if (province) {
      conditions.push(eq(jobs.province, province as string));
    }

    if (category) {
      conditions.push(eq(jobs.category, category as string));
    }

    if (jobType) {
      conditions.push(eq(jobs.jobType, jobType as string));
    }

    if (experienceLevel) {
      conditions.push(eq(jobs.experienceLevel, experienceLevel as string));
    }

    if (salaryMin) {
      conditions.push(gte(jobs.salaryMin, parseInt(salaryMin as string)));
    }

    if (salaryMax) {
      conditions.push(lte(jobs.salaryMax, parseInt(salaryMax as string)));
    }

    if (urgent === 'true') {
      conditions.push(eq(jobs.isUrgent, true));
    }

    if (featured === 'true') {
      conditions.push(eq(jobs.isFeatured, true));
    }

    if (remote === 'true') {
      conditions.push(eq(jobs.isRemote, true));
    }

    // Build order clause
    let orderClause;
    const sortColumn = sortBy as keyof typeof jobs;
    if (sortOrder === 'asc') {
      orderClause = asc(jobs[sortColumn as keyof typeof jobs]);
    } else {
      orderClause = desc(jobs[sortColumn as keyof typeof jobs]);
    }

    // Get jobs with pagination
    const jobsResult = await db
      .select({
        id: jobs.id,
        title: jobs.title,
        company: jobs.company,
        companyLogo: jobs.companyLogo,
        location: jobs.location,
        province: jobs.province,
        city: jobs.city,
        description: jobs.description,
        requirements: jobs.requirements,
        benefits: jobs.benefits,
        salaryMin: jobs.salaryMin,
        salaryMax: jobs.salaryMax,
        salaryCurrency: jobs.salaryCurrency,
        salaryPeriod: jobs.salaryPeriod,
        jobType: jobs.jobType,
        category: jobs.category,
        subcategory: jobs.subcategory,
        experienceLevel: jobs.experienceLevel,
        educationLevel: jobs.educationLevel,
        workingHours: jobs.workingHours,
        tags: jobs.tags,
        isUrgent: jobs.isUrgent,
        isImmediateStart: jobs.isImmediateStart,
        noExperienceRequired: jobs.noExperienceRequired,
        isFeatured: jobs.isFeatured,
        isVerified: jobs.isVerified,
        isRemote: jobs.isRemote,
        viewCount: jobs.viewCount,
        applicationCount: jobs.applicationCount,
        postedAt: jobs.postedAt,
        expiresAt: jobs.expiresAt
      })
      .from(jobs)
      .where(and(...conditions))
      .orderBy(orderClause)
      .limit(limitNum)
      .offset(offset);

    // Get total count for pagination
    const [{ totalCount }] = await db
      .select({ totalCount: count() })
      .from(jobs)
      .where(and(...conditions));

    const totalPages = Math.ceil(totalCount / limitNum);

    const result = {
      jobs: jobsResult,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalJobs: totalCount,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      },
      filters: {
        search: search || null,
        location: location || null,
        province: province || null,
        category: category || null,
        jobType: jobType || null,
        experienceLevel: experienceLevel || null,
        salaryRange: salaryMin || salaryMax ? { min: salaryMin, max: salaryMax } : null,
        urgent: urgent === 'true',
        featured: featured === 'true',
        remote: remote === 'true'
      },
      sorting: {
        sortBy: sortBy as string,
        sortOrder: sortOrder as string
      }
    };

    // Cache the results for 5 minutes
    await CacheService.set(cacheKey, result, 300);

    res.json({
      success: true,
      message: 'Jobs retrieved successfully',
      data: result
    });

  } catch (error: any) {
    logger.error('Get jobs failed', {
      error: error.message,
      query: req.query
    });

    res.status(500).json({
      success: false,
      error: 'Failed to retrieve jobs',
      message: 'Something went wrong'
    });
  }
});

/**
 * @route   GET /api/v1/jobs/:jobId
 * @desc    Get single job by ID
 * @access  Public
 */
router.get('/:jobId', jobParamValidation, async (req: Request, res: Response) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Invalid job ID',
        details: errors.array()
      });
    }

    const { jobId } = req.params;

    // Try to get from cache first
    const cacheKey = `job:${jobId}`;
    const cachedJob = await CacheService.get(cacheKey);
    if (cachedJob) {
      // Increment view count asynchronously
      db.update(jobs)
        .set({ viewCount: cachedJob.viewCount + 1 })
        .where(eq(jobs.id, jobId))
        .then(() => {
          // Clear cache to ensure fresh data next time
          CacheService.del(cacheKey);
        });

      return res.json({
        success: true,
        message: 'Job retrieved successfully',
        data: { job: { ...cachedJob, viewCount: cachedJob.viewCount + 1 } },
        cached: true
      });
    }

    // Get job from database
    const [job] = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.id, jobId), eq(jobs.isActive, true)))
      .limit(1);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found',
        message: 'The requested job does not exist or has been removed'
      });
    }

    // Increment view count
    await db
      .update(jobs)
      .set({ viewCount: job.viewCount + 1 })
      .where(eq(jobs.id, jobId));

    const updatedJob = { ...job, viewCount: job.viewCount + 1 };

    // Cache the job for 10 minutes
    await CacheService.set(cacheKey, updatedJob, 600);

    res.json({
      success: true,
      message: 'Job retrieved successfully',
      data: { job: updatedJob }
    });

  } catch (error: any) {
    logger.error('Get job failed', {
      error: error.message,
      jobId: req.params.jobId
    });

    res.status(500).json({
      success: false,
      error: 'Failed to retrieve job',
      message: 'Something went wrong'
    });
  }
});

/**
 * @route   POST /api/v1/jobs
 * @desc    Create new job (Admin/Employer only)
 * @access  Private
 */
router.post('/', [
  authenticateToken,
  authorize(['admin', 'employer']),
  ...createJobValidation
], async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Please check your input data',
        details: errors.array()
      });
    }

    const {
      title,
      company,
      companyLogo,
      location,
      province,
      city,
      address,
      description,
      requirements,
      benefits,
      responsibilities,
      salaryMin,
      salaryMax,
      salaryCurrency = 'ZAR',
      salaryPeriod = 'monthly',
      jobType,
      category,
      subcategory,
      experienceLevel = 'entry-level',
      educationLevel,
      workingHours,
      contactEmail,
      contactPhone,
      applicationMethod = 'online',
      applicationUrl,
      tags,
      isUrgent = false,
      isImmediateStart = false,
      noExperienceRequired = false,
      isRemote = false,
      expiresAt
    } = req.body;

    // Create new job
    const newJob: NewJob = {
      title: title.trim(),
      company: company.trim(),
      companyLogo,
      location: location.trim(),
      province,
      city: city?.trim(),
      address: address?.trim(),
      description: description.trim(),
      requirements: Array.isArray(requirements) ? requirements : [],
      benefits: Array.isArray(benefits) ? benefits : [],
      responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
      salaryMin: salaryMin ? parseInt(salaryMin) : null,
      salaryMax: salaryMax ? parseInt(salaryMax) : null,
      salaryCurrency,
      salaryPeriod,
      jobType,
      category: category.trim(),
      subcategory: subcategory?.trim(),
      experienceLevel,
      educationLevel,
      workingHours,
      contactEmail,
      contactPhone,
      applicationMethod,
      applicationUrl,
      tags: Array.isArray(tags) ? tags : [],
      isUrgent,
      isImmediateStart,
      noExperienceRequired,
      isRemote,
      source: 'manual',
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isActive: true,
      isVerified: req.user?.role === 'admin' // Auto-verify for admins
    };

    const [createdJob] = await db.insert(jobs).values(newJob).returning();

    // Clear jobs cache
    await CacheService.clearPattern('jobs:search:*');

    logger.info('Job created successfully', {
      jobId: createdJob.id,
      title: createdJob.title,
      company: createdJob.company,
      createdBy: req.user?.id
    });

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: { job: createdJob }
    });

  } catch (error: any) {
    logger.error('Create job failed', {
      error: error.message,
      userId: req.user?.id,
      jobData: req.body
    });

    res.status(500).json({
      success: false,
      error: 'Failed to create job',
      message: 'Something went wrong'
    });
  }
});

/**
 * @route   PUT /api/v1/jobs/:jobId
 * @desc    Update job (Admin/Employer only)
 * @access  Private
 */
router.put('/:jobId', [
  authenticateToken,
  authorize(['admin', 'employer']),
  ...jobParamValidation,
  ...createJobValidation
], async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Please check your input data',
        details: errors.array()
      });
    }

    const { jobId } = req.params;
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    // Check if job exists
    const [existingJob] = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, jobId))
      .limit(1);

    if (!existingJob) {
      return res.status(404).json({
        success: false,
        error: 'Job not found',
        message: 'The requested job does not exist'
      });
    }

    // Update job
    const [updatedJob] = await db
      .update(jobs)
      .set(updateData)
      .where(eq(jobs.id, jobId))
      .returning();

    // Clear caches
    await CacheService.del(`job:${jobId}`);
    await CacheService.clearPattern('jobs:search:*');

    logger.info('Job updated successfully', {
      jobId: updatedJob.id,
      title: updatedJob.title,
      updatedBy: req.user?.id
    });

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: { job: updatedJob }
    });

  } catch (error: any) {
    logger.error('Update job failed', {
      error: error.message,
      jobId: req.params.jobId,
      userId: req.user?.id
    });

    res.status(500).json({
      success: false,
      error: 'Failed to update job',
      message: 'Something went wrong'
    });
  }
});

/**
 * @route   DELETE /api/v1/jobs/:jobId
 * @desc    Delete job (Admin only)
 * @access  Private
 */
router.delete('/:jobId', [
  authenticateToken,
  authorize(['admin']),
  ...jobParamValidation
], async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Invalid job ID',
        details: errors.array()
      });
    }

    const { jobId } = req.params;

    // Soft delete (deactivate) the job
    const [deactivatedJob] = await db
      .update(jobs)
      .set({ 
        isActive: false, 
        updatedAt: new Date() 
      })
      .where(eq(jobs.id, jobId))
      .returning();

    if (!deactivatedJob) {
      return res.status(404).json({
        success: false,
        error: 'Job not found',
        message: 'The requested job does not exist'
      });
    }

    // Clear caches
    await CacheService.del(`job:${jobId}`);
    await CacheService.clearPattern('jobs:search:*');

    logger.info('Job deleted successfully', {
      jobId: deactivatedJob.id,
      title: deactivatedJob.title,
      deletedBy: req.user?.id
    });

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });

  } catch (error: any) {
    logger.error('Delete job failed', {
      error: error.message,
      jobId: req.params.jobId,
      userId: req.user?.id
    });

    res.status(500).json({
      success: false,
      error: 'Failed to delete job',
      message: 'Something went wrong'
    });
  }
});

/**
 * @route   GET /api/v1/jobs/categories/list
 * @desc    Get all job categories with counts
 * @access  Public
 */
router.get('/categories/list', async (req: Request, res: Response) => {
  try {
    // Try to get from cache first
    const cacheKey = 'jobs:categories';
    const cachedCategories = await CacheService.get(cacheKey);
    if (cachedCategories) {
      return res.json({
        success: true,
        message: 'Job categories retrieved successfully',
        data: { categories: cachedCategories },
        cached: true
      });
    }

    // Get categories with job counts
    const categories = await db
      .select({
        category: jobs.category,
        count: count()
      })
      .from(jobs)
      .where(and(eq(jobs.isActive, true)))
      .groupBy(jobs.category)
      .orderBy(desc(count()));

    // Cache for 1 hour
    await CacheService.set(cacheKey, categories, 3600);

    res.json({
      success: true,
      message: 'Job categories retrieved successfully',
      data: { categories }
    });

  } catch (error: any) {
    logger.error('Get categories failed', {
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'Failed to retrieve categories',
      message: 'Something went wrong'
    });
  }
});

/**
 * @route   GET /api/v1/jobs/stats/overview
 * @desc    Get job statistics overview
 * @access  Public
 */
router.get('/stats/overview', async (req: Request, res: Response) => {
  try {
    // Try to get from cache first
    const cacheKey = 'jobs:stats:overview';
    const cachedStats = await CacheService.get(cacheKey);
    if (cachedStats) {
      return res.json({
        success: true,
        message: 'Job statistics retrieved successfully',
        data: cachedStats,
        cached: true
      });
    }

    // Get various statistics
    const [totalJobs] = await db
      .select({ count: count() })
      .from(jobs)
      .where(eq(jobs.isActive, true));

    const [urgentJobs] = await db
      .select({ count: count() })
      .from(jobs)
      .where(and(eq(jobs.isActive, true), eq(jobs.isUrgent, true)));

    const [remoteJobs] = await db
      .select({ count: count() })
      .from(jobs)
      .where(and(eq(jobs.isActive, true), eq(jobs.isRemote, true)));

    const [entryLevelJobs] = await db
      .select({ count: count() })
      .from(jobs)
      .where(and(
        eq(jobs.isActive, true), 
        eq(jobs.experienceLevel, 'entry-level')
      ));

    const stats = {
      totalActiveJobs: totalJobs.count,
      urgentJobs: urgentJobs.count,
      remoteJobs: remoteJobs.count,
      entryLevelJobs: entryLevelJobs.count,
      lastUpdated: new Date()
    };

    // Cache for 30 minutes
    await CacheService.set(cacheKey, stats, 1800);

    res.json({
      success: true,
      message: 'Job statistics retrieved successfully',
      data: stats
    });

  } catch (error: any) {
    logger.error('Get job stats failed', {
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'Failed to retrieve job statistics',
      message: 'Something went wrong'
    });
  }
});

export default router;

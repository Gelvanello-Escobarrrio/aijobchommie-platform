/**
 *  JOBS ROUTES
 */

import { Router, Request, Response } from 'express';
import { body, query, param, validationResult } from 'express-validator';
import { eq, and, like, gte, lte, desc, asc, count } from 'drizzle-orm';
import { db } from '../../config/database';
import { jobs, jobApplications, NewJob } from '../../models/schema';
import { authenticateToken, AuthenticatedRequest, authorize } from '../services/authService';
import { CacheService } from '../../config/redis';
import winston from 'winston';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const logger = winston.createLogger({ transports: [new winston.transports.Console()] });

const createJobValidation = [ body('title').isLength({ min: 3 }).withMessage('Job title must be between 3 and 200 characters') ];
const searchJobsValidation = [ query('page').optional().isInt({ min: 1 }), query('limit').optional().isInt({ min: 1, max: 100 }) ];
const jobParamValidation = [ param('jobId').isUUID() ];

router.get('/', searchJobsValidation, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, error: 'Validation failed', details: errors.array() });

    const { page = 1, limit = 20, search, location, province, category, jobType, salaryMin, salaryMax, urgent, featured, remote, sortBy = 'postedAt', sortOrder = 'desc' } = req.query as any;
    const pageNum = parseInt(page as any);
    const limitNum = parseInt(limit as any);
    const offset = (pageNum - 1) * limitNum;

    const cacheKey = `jobs:search:${JSON.stringify(req.query)}`;
    const cachedResults = await CacheService.get(cacheKey);
    if (cachedResults) return res.json({ success: true, message: 'Jobs retrieved successfully', data: cachedResults, cached: true });

    const conditions: any[] = [eq(jobs.isActive, true)];
    if (search) conditions.push(like(jobs.title, `%${search}%`));
    if (location) conditions.push(like(jobs.location, `%${location}%`));
    if (province) conditions.push(eq(jobs.province, province as string));
    if (category) conditions.push(eq(jobs.category, category as string));
    if (jobType) conditions.push(eq(jobs.jobType, jobType as string));
    if (salaryMin) conditions.push(gte(jobs.salaryMin, parseInt(salaryMin as string)));
    if (salaryMax) conditions.push(lte(jobs.salaryMax, parseInt(salaryMax as string)));
    if (urgent === 'true') conditions.push(eq(jobs.isUrgent, true));
    if (featured === 'true') conditions.push(eq(jobs.isFeatured, true));
    if (remote === 'true') conditions.push(eq(jobs.isRemote, true));

    let orderClause: any;
    const sortColumn = sortBy as keyof typeof jobs;
    if (sortOrder === 'asc') orderClause = asc((jobs as any)[sortColumn]); else orderClause = desc((jobs as any)[sortColumn]);

    const jobsResult = await db.select({ id: jobs.id, title: jobs.title, company: jobs.company, location: jobs.location, postedAt: jobs.postedAt }).from(jobs).where(and(...conditions)).orderBy(orderClause).limit(limitNum).offset(offset);

    const [{ totalCount }] = await db.select({ totalCount: count() }).from(jobs).where(and(...conditions));
    const totalPages = Math.ceil(totalCount / limitNum);

    const result = { jobs: jobsResult, pagination: { currentPage: pageNum, totalPages, totalJobs: totalCount, hasNextPage: pageNum < totalPages, hasPrevPage: pageNum > 1 }, filters: {}, sorting: { sortBy, sortOrder } };

    await CacheService.set(cacheKey, result, 300);

    res.json({ success: true, message: 'Jobs retrieved successfully', data: result });
  } catch (error: any) {
    logger.error('Get jobs failed', { error: error.message, query: req.query });
    res.status(500).json({ success: false, error: 'Failed to retrieve jobs', message: 'Something went wrong' });
  }
});

router.get('/:jobId', jobParamValidation, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, error: 'Validation failed', details: errors.array() });

    const { jobId } = req.params;
    const cacheKey = `job:${jobId}`;
    const cachedJob = await CacheService.get(cacheKey);
    if (cachedJob) {
      const cachedViewCount = (cachedJob.viewCount ?? 0) + 1;
      db.update(jobs).set({ viewCount: cachedViewCount }).where(eq(jobs.id, jobId)).then(() => { CacheService.del(cacheKey); });
        return res.json({ success: true, message: 'Job retrieved successfully', data: { job: { ...cachedJob, viewCount: cachedViewCount } }, cached: true });
    }

    const [job] = await db.select().from(jobs).where(and(eq(jobs.id, jobId), eq(jobs.isActive, true))).limit(1);
    if (!job) return res.status(404).json({ success: false, error: 'Job not found', message: 'The requested job does not exist or has been removed' });

  const newCount = (job.viewCount ?? 0) + 1;
  await db.update(jobs).set({ viewCount: newCount }).where(eq(jobs.id, jobId));
  const updatedJob = { ...job, viewCount: newCount };
    await CacheService.set(cacheKey, updatedJob, 600);

    res.json({ success: true, message: 'Job retrieved successfully', data: { job: updatedJob } });
  } catch (error: any) {
    logger.error('Get job failed', { error: error.message, jobId: req.params.jobId });
    res.status(500).json({ success: false, error: 'Failed to retrieve job', message: 'Something went wrong' });
  }
});

router.post('/', [ authenticateToken, authorize(['admin', 'employer']), ...createJobValidation ], async (req: AuthenticatedRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, error: 'Validation failed', details: errors.array() });

    const { title, company, location, description } = req.body as any;
    const newJob: NewJob = { title: title.trim(), company: company.trim(), location: location.trim(), description: description.trim(), isActive: true, isVerified: req.user?.role === 'admin' } as any;

    const [createdJob] = await db.insert(jobs).values(newJob).returning();
    await CacheService.clearPattern('jobs:search:*');

    logger.info('Job created successfully', { jobId: createdJob.id, title: createdJob.title, createdBy: req.user?.id });
    res.status(201).json({ success: true, message: 'Job created successfully', data: { job: createdJob } });
  } catch (error: any) {
    logger.error('Create job failed', { error: error.message, userId: req.user?.id, jobData: req.body });
    res.status(500).json({ success: false, error: 'Failed to create job', message: 'Something went wrong' });
  }
});

router.put('/:jobId', [ authenticateToken, authorize(['admin', 'employer']), ...jobParamValidation, ...createJobValidation ], async (req: AuthenticatedRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, error: 'Validation failed', details: errors.array() });

    const { jobId } = req.params;
    const updateData = { ...req.body, updatedAt: new Date() } as any;

    const [existingJob] = await db.select().from(jobs).where(eq(jobs.id, jobId)).limit(1);
    if (!existingJob) return res.status(404).json({ success: false, error: 'Job not found', message: 'The requested job does not exist' });

    const [updatedJob] = await db.update(jobs).set(updateData).where(eq(jobs.id, jobId)).returning();
    await CacheService.del(`job:${jobId}`); await CacheService.clearPattern('jobs:search:*');

    logger.info('Job updated successfully', { jobId: updatedJob.id, title: updatedJob.title, updatedBy: req.user?.id });
    res.json({ success: true, message: 'Job updated successfully', data: { job: updatedJob } });
  } catch (error: any) {
    logger.error('Update job failed', { error: error.message, jobId: req.params.jobId, userId: req.user?.id });
    res.status(500).json({ success: false, error: 'Failed to update job', message: 'Something went wrong' });
  }
});

router.delete('/:jobId', [ authenticateToken, authorize(['admin']), ...jobParamValidation ], async (req: AuthenticatedRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, error: 'Validation failed', details: errors.array() });

    const { jobId } = req.params;
    const [deactivatedJob] = await db.update(jobs).set({ isActive: false, updatedAt: new Date() }).where(eq(jobs.id, jobId)).returning();
    if (!deactivatedJob) return res.status(404).json({ success: false, error: 'Job not found', message: 'The requested job does not exist' });

    await CacheService.del(`job:${jobId}`); await CacheService.clearPattern('jobs:search:*');

    logger.info('Job deleted successfully', { jobId: deactivatedJob.id, title: deactivatedJob.title, deletedBy: req.user?.id });
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error: any) {
    logger.error('Delete job failed', { error: error.message, jobId: req.params.jobId, userId: req.user?.id });
    res.status(500).json({ success: false, error: 'Failed to delete job', message: 'Something went wrong' });
  }
});

router.get('/categories/list', async (req: Request, res: Response) => {
  try {
    const cacheKey = 'jobs:categories'; const cachedCategories = await CacheService.get(cacheKey); if (cachedCategories) return res.json({ success: true, message: 'Job categories retrieved successfully', data: { categories: cachedCategories }, cached: true });

    const categories = await db.select({ category: jobs.category, count: count() }).from(jobs).where(and(eq(jobs.isActive, true))).groupBy(jobs.category).orderBy(desc(count()));
    await CacheService.set(cacheKey, categories, 3600);

    res.json({ success: true, message: 'Job categories retrieved successfully', data: { categories } });
  } catch (error: any) {
    logger.error('Get categories failed', { error: error.message }); res.status(500).json({ success: false, error: 'Failed to retrieve categories', message: 'Something went wrong' });
  }
});

router.get('/stats/overview', async (req: Request, res: Response) => {
  try {
    const cacheKey = 'jobs:stats:overview'; const cachedStats = await CacheService.get(cacheKey); if (cachedStats) return res.json({ success: true, message: 'Job statistics retrieved successfully', data: cachedStats, cached: true });

    const [totalJobs] = await db.select({ count: count() }).from(jobs).where(eq(jobs.isActive, true));
    const [urgentJobs] = await db.select({ count: count() }).from(jobs).where(and(eq(jobs.isActive, true), eq(jobs.isUrgent, true)));
    const [remoteJobs] = await db.select({ count: count() }).from(jobs).where(and(eq(jobs.isActive, true), eq(jobs.isRemote, true)));
    const [entryLevelJobs] = await db.select({ count: count() }).from(jobs).where(and(eq(jobs.isActive, true), eq(jobs.experienceLevel, 'entry-level')));

    const stats = { totalActiveJobs: totalJobs.count, urgentJobs: urgentJobs.count, remoteJobs: remoteJobs.count, entryLevelJobs: entryLevelJobs.count, lastUpdated: new Date() };
    await CacheService.set(cacheKey, stats, 1800);

    res.json({ success: true, message: 'Job statistics retrieved successfully', data: stats });
  } catch (error: any) {
    logger.error('Get job stats failed', { error: error.message }); res.status(500).json({ success: false, error: 'Failed to retrieve job statistics', message: 'Something went wrong' });
  }
});

export default router;

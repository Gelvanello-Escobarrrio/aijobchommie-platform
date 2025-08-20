/**
 *  AI JOB MATCHING SERVICE
 * 
 * Advanced AI-powered job matching for South African job seekers
 * Uses OpenAI and Hugging Face for intelligent job recommendations
 */

import { OpenAI } from 'openai';
import { HfInference } from '@huggingface/inference';
import { db } from '../config/database';
import { jobs, users, userProfiles, jobSearches } from '../models/schema';
import { eq, and, gte, lte, like, or, desc, sql } from 'drizzle-orm';
import { CacheService } from '../config/redis';
import winston from 'winston';

const logger = winston.createLogger({
  transports: [new winston.transports.Console()]
});

// Initialize AI services
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-key'
});

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY || 'demo-key');

export interface JobMatchingCriteria {
  userId?: string;
  skills?: string[];
  experience?: string;
  location?: string;
  province?: string;
  salaryRange?: { min: number; max: number };
  jobTypes?: string[];
  categories?: string[];
  experienceLevel?: string;
  keywords?: string;
}

export interface JobMatchResult {
  jobId: string;
  matchScore: number;
  matchReason: string;
  job: any;
  aiInsights?: string;
}

export interface UserProfile {
  skills: string[];
  experience: any[];
  education: any[];
  preferredLocations: string[];
  expectedSalary: { min: number; max: number };
  bio?: string;
}

/**
 * AI Job Matching Service
 */
export class AIJobMatchingService {
  
  /**
   * Find jobs that match a user's profile using AI
   */
  static async findMatchingJobs(
    criteria: JobMatchingCriteria,
    limit: number = 20
  ): Promise<JobMatchResult[]> {
    try {
      logger.info(' Starting AI job matching', { criteria, limit });

      // Get user profile if userId provided
      let userProfile: UserProfile | null = null;
      if (criteria.userId) {
        userProfile = await this.getUserProfile(criteria.userId);
      }

      // Build search query for jobs
      const whereConditions = this.buildJobSearchConditions(criteria);
      
      // Get potential jobs from database
      const candidateJobs = await db
        .select()
        .from(jobs)
        .where(and(...whereConditions))
        .orderBy(desc(jobs.postedAt))
        .limit(limit * 2); // Get more candidates for better matching

      logger.info(` Found ${candidateJobs.length} candidate jobs`);

      if (candidateJobs.length === 0) {
        return [];
      }

      // Score and rank jobs using AI
      const scoredJobs = await Promise.all(
        candidateJobs.map(job => this.scoreJobMatch(job, criteria, userProfile))
      );

      // Sort by match score and take top results
      const topMatches = scoredJobs
        .filter(match => match.matchScore > 0.3) // Minimum match threshold
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);

      // Add AI insights for top matches
      const enhancedMatches = await Promise.all(
        topMatches.map(async (match) => {
          const insights = await this.generateJobInsights(match.job, userProfile);
          return { ...match, aiInsights: insights };
        })
      );

      // Cache results for better performance
      if (criteria.userId) {
        const cacheKey = `job-matches:${criteria.userId}:${JSON.stringify(criteria)}`;
        await CacheService.set(cacheKey, enhancedMatches, 3600); // 1 hour cache
      }

      logger.info(` AI matching completed. Found ${enhancedMatches.length} quality matches`);
      return enhancedMatches;

    } catch (error) {
      logger.error(' AI job matching failed:', error);
      // Fallback to basic matching
      return this.basicJobMatching(criteria, limit);
    }
  }

  /**
   * Get user profile for matching
   */
  private static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user) return null;

      const [profile] = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId))
        .limit(1);

      if (!profile) return null;

      return {
        skills: profile.skills as string[] || [],
        experience: profile.experience as any[] || [],
        education: profile.education as any[] || [],
        preferredLocations: profile.preferredLocations as string[] || [],
        expectedSalary: {
          min: profile.expectedSalaryMin || 0,
          max: profile.expectedSalaryMax || 50000
        },
        bio: profile.bio || ''
      };
    } catch (error) {
      logger.error('Failed to get user profile:', error);
      return null;
    }
  }

  /**
   * Build database query conditions
   */
  private static buildJobSearchConditions(criteria: JobMatchingCriteria) {
    const conditions = [eq(jobs.isActive, true)];

    if (criteria.location) {
      conditions.push(like(jobs.location, `%${criteria.location}%`));
    }

    if (criteria.province) {
      conditions.push(eq(jobs.province, criteria.province));
    }

    if (criteria.salaryRange) {
      if (criteria.salaryRange.min) {
        conditions.push(gte(jobs.salaryMin, criteria.salaryRange.min));
      }
      if (criteria.salaryRange.max) {
        conditions.push(lte(jobs.salaryMax, criteria.salaryRange.max));
      }
    }

    if (criteria.jobTypes && criteria.jobTypes.length > 0) {
      const jobTypeConditions = criteria.jobTypes.map(type => eq(jobs.jobType, type));
      conditions.push(or(...jobTypeConditions));
    }

    if (criteria.categories && criteria.categories.length > 0) {
      const categoryConditions = criteria.categories.map(cat => eq(jobs.category, cat));
      conditions.push(or(...categoryConditions));
    }

    if (criteria.experienceLevel) {
      conditions.push(eq(jobs.experienceLevel, criteria.experienceLevel));
    }

    if (criteria.keywords) {
      conditions.push(
        or(
          like(jobs.title, `%${criteria.keywords}%`),
          like(jobs.description, `%${criteria.keywords}%`),
          like(jobs.company, `%${criteria.keywords}%`)
        )
      );
    }

    return conditions;
  }

  /**
   * Score job match using AI and traditional algorithms
   */
  private static async scoreJobMatch(
    job: any,
    criteria: JobMatchingCriteria,
    userProfile: UserProfile | null
  ): Promise<JobMatchResult> {
    let matchScore = 0;
    const matchReasons: string[] = [];

    // Location matching (high weight for SA market)
    if (criteria.location || criteria.province) {
      const locationMatch = this.calculateLocationMatch(job, criteria);
      matchScore += locationMatch.score * 0.25;
      if (locationMatch.reason) matchReasons.push(locationMatch.reason);
    }

    // Salary matching
    if (criteria.salaryRange) {
      const salaryMatch = this.calculateSalaryMatch(job, criteria.salaryRange);
      matchScore += salaryMatch.score * 0.2;
      if (salaryMatch.reason) matchReasons.push(salaryMatch.reason);
    }

    // Skills and experience matching (if user profile available)
    if (userProfile) {
      const skillMatch = await this.calculateSkillMatch(job, userProfile);
      matchScore += skillMatch.score * 0.3;
      if (skillMatch.reason) matchReasons.push(skillMatch.reason);

      const experienceMatch = this.calculateExperienceMatch(job, userProfile);
      matchScore += experienceMatch.score * 0.15;
      if (experienceMatch.reason) matchReasons.push(experienceMatch.reason);
    }

    // Job type preference
    if (criteria.jobTypes && criteria.jobTypes.includes(job.jobType)) {
      matchScore += 0.1;
      matchReasons.push(`Matches preferred job type: ${job.jobType}`);
    }

    // Urgency and immediate start bonuses
    if (job.isUrgent) {
      matchScore += 0.05;
      matchReasons.push('Urgent hiring - quick application process');
    }

    if (job.isImmediateStart) {
      matchScore += 0.03;
      matchReasons.push('Immediate start available');
    }

    if (job.noExperienceRequired) {
      matchScore += 0.02;
      matchReasons.push('No experience required - perfect for career starters');
    }

    return {
      jobId: job.id,
      matchScore: Math.min(matchScore, 1.0), // Cap at 100%
      matchReason: matchReasons.join(' • '),
      job: job
    };
  }

  /**
   * Calculate location-based match score
   */
  private static calculateLocationMatch(job: any, criteria: JobMatchingCriteria) {
    let score = 0;
    let reason = '';

    if (criteria.province && job.province === criteria.province) {
      score += 0.8;
      reason = `Located in your preferred province: ${job.province}`;
    }

    if (criteria.location) {
      if (job.location.toLowerCase().includes(criteria.location.toLowerCase())) {
        score += 0.2;
        reason += reason ? ' and city area' : `Located in ${criteria.location} area`;
      }
    }

    return { score, reason };
  }

  /**
   * Calculate salary match score
   */
  private static calculateSalaryMatch(job: any, salaryRange: { min: number; max: number }) {
    let score = 0;
    let reason = '';

    const jobMin = job.salaryMin || 0;
    const jobMax = job.salaryMax || 100000;
    const userMin = salaryRange.min;
    const userMax = salaryRange.max;

    // Check if salary ranges overlap
    if (jobMax >= userMin && jobMin <= userMax) {
      const overlapMin = Math.max(jobMin, userMin);
      const overlapMax = Math.min(jobMax, userMax);
      const overlapSize = overlapMax - overlapMin;
      const userRangeSize = userMax - userMin;
      
      score = Math.min(overlapSize / userRangeSize, 1.0);
      reason = `Salary range R${jobMin}-R${jobMax} matches your expectations`;
    }

    return { score, reason };
  }

  /**
   * Calculate skills match using AI
   */
  private static async calculateSkillMatch(job: any, userProfile: UserProfile) {
    try {
      if (!userProfile.skills || userProfile.skills.length === 0) {
        return { score: 0.3, reason: '' }; // Neutral score if no skills provided
      }

      // Extract skills mentioned in job description
      const jobText = `${job.title} ${job.description} ${JSON.stringify(job.requirements || [])}`;
      const userSkills = userProfile.skills.join(', ');

      // Use AI to match skills (fallback to basic if AI unavailable)
      if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'demo-key') {
        const skillMatchPrompt = `
          Analyze the match between user skills and job requirements:
          
          User Skills: ${userSkills}
          Job: ${job.title} at ${job.company}
          Job Description: ${job.description.substring(0, 500)}
          
          Rate the skill match from 0-100 and provide a brief reason.
          Response format: "SCORE: X, REASON: brief explanation"
        `;

        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: skillMatchPrompt }],
          max_tokens: 100,
          temperature: 0.3
        });

        const result = response.choices[0]?.message?.content || '';
        const scoreMatch = result.match(/SCORE:\s*(\d+)/i);
        const reasonMatch = result.match(/REASON:\s*(.+)/i);

        if (scoreMatch) {
          const score = parseInt(scoreMatch[1]) / 100;
          const reason = reasonMatch ? reasonMatch[1].trim() : 'Skills alignment identified';
          return { score, reason };
        }
      }

      // Fallback to basic keyword matching
      return this.basicSkillMatching(jobText, userProfile.skills);

    } catch (error) {
      logger.error('Skills matching failed:', error);
      return this.basicSkillMatching(job.description, userProfile.skills);
    }
  }

  /**
   * Basic skill matching fallback
   */
  private static basicSkillMatching(jobText: string, userSkills: string[]) {
    const jobTextLower = jobText.toLowerCase();
    let matchCount = 0;

    for (const skill of userSkills) {
      if (jobTextLower.includes(skill.toLowerCase())) {
        matchCount++;
      }
    }

    const score = Math.min(matchCount / Math.max(userSkills.length, 3), 1.0);
    const reason = matchCount > 0 ? `${matchCount} of your skills match this role` : '';

    return { score, reason };
  }

  /**
   * Calculate experience level match
   */
  private static calculateExperienceMatch(job: any, userProfile: UserProfile) {
    let score = 0.5; // Default neutral score
    let reason = '';

    const userExperienceYears = this.calculateUserExperience(userProfile.experience);
    const jobExperienceLevel = job.experienceLevel || 'entry-level';

    switch (jobExperienceLevel) {
      case 'entry-level':
        score = 0.9; // Most users are entry-level
        reason = 'Perfect for your experience level';
        break;
      case 'mid-level':
        if (userExperienceYears >= 2) {
          score = 0.8;
          reason = 'Good match for your experience';
        } else {
          score = 0.4;
          reason = 'Slightly above your current experience level';
        }
        break;
      case 'senior':
        if (userExperienceYears >= 5) {
          score = 0.8;
          reason = 'Matches your senior experience';
        } else {
          score = 0.2;
          reason = 'Requires more experience than you currently have';
        }
        break;
    }

    return { score, reason };
  }

  /**
   * Calculate user's total years of experience
   */
  private static calculateUserExperience(experience: any[]): number {
    if (!experience || experience.length === 0) return 0;

    let totalMonths = 0;
    experience.forEach(exp => {
      if (exp.startDate && exp.endDate) {
        const start = new Date(exp.startDate);
        const end = exp.current ? new Date() : new Date(exp.endDate);
        const months = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30);
        totalMonths += Math.max(months, 0);
      }
    });

    return totalMonths / 12; // Convert to years
  }

  /**
   * Generate AI insights for a job match
   */
  private static async generateJobInsights(job: any, userProfile: UserProfile | null): Promise<string> {
    try {
      if (!userProfile || !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key') {
        return this.getBasicJobInsight(job);
      }

      const insightPrompt = `
        Provide a brief, encouraging insight about this job for a South African job seeker:
        
        Job: ${job.title} at ${job.company}
        Location: ${job.location}
        Salary: R${job.salaryMin}-R${job.salaryMax}
        User Skills: ${userProfile.skills.join(', ')}
        
        Give one positive, actionable insight in 20 words or less. Focus on opportunities and growth.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: insightPrompt }],
        max_tokens: 50,
        temperature: 0.7
      });

      return response.choices[0]?.message?.content?.trim() || this.getBasicJobInsight(job);

    } catch (error) {
      logger.error('Failed to generate AI insights:', error);
      return this.getBasicJobInsight(job);
    }
  }

  /**
   * Basic job insight fallback
   */
  private static getBasicJobInsight(job: any): string {
    const insights = [
      `Great opportunity to start your career with ${job.company}`,
      `Build valuable experience in ${job.category.toLowerCase()}`,
      `Join a growing company in ${job.city}`,
      `Develop new skills in a supportive environment`,
      `Perfect stepping stone for your career journey`
    ];

    if (job.isUrgent) {
      return "Urgent hiring means faster hiring process and quick start!";
    }

    if (job.noExperienceRequired) {
      return "No experience needed - they'll train you from the start!";
    }

    return insights[Math.floor(Math.random() * insights.length)];
  }

  /**
   * Fallback to basic job matching
   */
  private static async basicJobMatching(
    criteria: JobMatchingCriteria,
    limit: number
  ): Promise<JobMatchResult[]> {
    try {
      const whereConditions = this.buildJobSearchConditions(criteria);
      
      const candidateJobs = await db
        .select()
        .from(jobs)
        .where(and(...whereConditions))
        .orderBy(desc(jobs.postedAt))
        .limit(limit);

      return candidateJobs.map((job, index) => ({
        jobId: job.id,
        matchScore: 0.7 - (index * 0.05), // Decreasing score based on recency
        matchReason: 'Good match based on your search criteria',
        job: job,
        aiInsights: this.getBasicJobInsight(job)
      }));

    } catch (error) {
      logger.error('Basic job matching failed:', error);
      return [];
    }
  }

  /**
   * Log job search for analytics
   */
  static async logJobSearch(
    userId: string | null,
    query: string,
    filters: any,
    resultsCount: number,
    ipAddress?: string,
    userAgent?: string
  ) {
    try {
      await db.insert(jobSearches).values({
        userId: userId,
        query: query,
        filters: filters,
        resultsCount: resultsCount,
        ipAddress: ipAddress,
        userAgent: userAgent
      });
    } catch (error) {
      logger.error('Failed to log job search:', error);
    }
  }

  /**
   * Get job recommendations for a user
   */
  static async getJobRecommendations(userId: string, limit: number = 10): Promise<JobMatchResult[]> {
    try {
      // Check cache first
      const cacheKey = `recommendations:${userId}`;
      const cached = await CacheService.get(cacheKey);
      if (cached) {
        return cached as JobMatchResult[];
      }

      // Get user profile and preferences
      const userProfile = await this.getUserProfile(userId);
      if (!userProfile) {
        return this.getPopularJobs(limit);
      }

      // Build criteria from user profile
      const criteria: JobMatchingCriteria = {
        userId: userId,
        location: userProfile.preferredLocations[0],
        salaryRange: userProfile.expectedSalary,
        skills: userProfile.skills
      };

      // Get AI-powered recommendations
      const recommendations = await this.findMatchingJobs(criteria, limit);
      
      // Cache recommendations
      await CacheService.set(cacheKey, recommendations, 1800); // 30 minutes

      return recommendations;

    } catch (error) {
      logger.error('Failed to get job recommendations:', error);
      return this.getPopularJobs(limit);
    }
  }

  /**
   * Get popular jobs as fallback
   */
  private static async getPopularJobs(limit: number): Promise<JobMatchResult[]> {
    const popularJobs = await db
      .select()
      .from(jobs)
      .where(eq(jobs.isActive, true))
      .orderBy(desc(jobs.viewCount), desc(jobs.postedAt))
      .limit(limit);

    return popularJobs.map((job, index) => ({
      jobId: job.id,
      matchScore: 0.6 - (index * 0.03),
      matchReason: 'Popular job in your area',
      job: job,
      aiInsights: 'This position is getting lots of attention from other job seekers'
    }));
  }
}

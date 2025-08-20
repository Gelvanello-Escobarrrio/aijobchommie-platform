import { OpenAI } from 'openai';
import { HfInference } from '@huggingface/inference';
import { db } from '../../config/database';
import { jobs, users, userProfiles, jobSearches } from '../../models/schema';
import { eq, and, gte, lte, like, or, desc, sql } from 'drizzle-orm';
import { CacheService } from '../../config/redis';
import winston from 'winston';

const logger = winston.createLogger({ transports: [new winston.transports.Console()] });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'demo-key' });
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY || 'demo-key');

export interface JobMatchingCriteria { userId?: string; skills?: string[]; experience?: string; location?: string; province?: string; salaryRange?: { min: number; max: number }; jobTypes?: string[]; categories?: string[]; experienceLevel?: string; keywords?: string }
export interface JobMatchResult { jobId: string; matchScore: number; matchReason: string; job: any; aiInsights?: string }
export interface UserProfile { skills: string[]; experience: any[]; education: any[]; preferredLocations: string[]; expectedSalary: { min: number; max: number }; bio?: string }

export class AIJobMatchingService {
  static async findMatchingJobs(criteria: JobMatchingCriteria, limit: number = 20): Promise<JobMatchResult[]> {
    try {
      logger.info('Starting AI job matching', { criteria, limit });
      let userProfile: UserProfile | null = null;
      if (criteria.userId) userProfile = await this.getUserProfile(criteria.userId);
      const whereConditions = this.buildJobSearchConditions(criteria);
      const candidateJobs = await db.select().from(jobs).where(and(...whereConditions)).orderBy(desc(jobs.postedAt)).limit(limit * 2);
      if (candidateJobs.length === 0) return [];
      const scoredJobs = await Promise.all(candidateJobs.map(job => this.scoreJobMatch(job, criteria, userProfile)));
      const topMatches = scoredJobs.filter(match => match.matchScore > 0.3).sort((a, b) => b.matchScore - a.matchScore).slice(0, limit);
      const enhancedMatches = await Promise.all(topMatches.map(async (match) => { const insights = await this.generateJobInsights(match.job, userProfile); return { ...match, aiInsights: insights }; }));
      if (criteria.userId) { const cacheKey = `job-matches:${criteria.userId}:${JSON.stringify(criteria)}`; await CacheService.set(cacheKey, enhancedMatches, 3600); }
      logger.info(`AI matching completed. Found ${enhancedMatches.length} quality matches`);
      return enhancedMatches;
    } catch (error) {
      logger.error('AI job matching failed:', error);
      return this.basicJobMatching(criteria, limit);
    }
  }

  private static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!user) return null;
      const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
      if (!profile) return null;
      return { skills: (profile.skills as string[]) || [], experience: (profile.experience as any[]) || [], education: (profile.education as any[]) || [], preferredLocations: (profile.preferredLocations as string[]) || [], expectedSalary: { min: profile.expectedSalaryMin || 0, max: profile.expectedSalaryMax || 50000 }, bio: profile.bio || '' };
    } catch (error) { logger.error('Failed to get user profile:', error); return null; }
  }

  private static buildJobSearchConditions(criteria: JobMatchingCriteria) {
    const conditions: any[] = [eq(jobs.isActive, true)];
    if (criteria.location) conditions.push(like(jobs.location, `%${criteria.location}%`));
    if (criteria.province) conditions.push(eq(jobs.province, criteria.province));
    if (criteria.salaryRange) { if (criteria.salaryRange.min) conditions.push(gte(jobs.salaryMin, criteria.salaryRange.min)); if (criteria.salaryRange.max) conditions.push(lte(jobs.salaryMax, criteria.salaryRange.max)); }
    if (criteria.jobTypes && criteria.jobTypes.length > 0) { const jobTypeConditions = criteria.jobTypes.map((type) => eq(jobs.jobType, type)); conditions.push(or(...jobTypeConditions)); }
    if (criteria.categories && criteria.categories.length > 0) { const categoryConditions = criteria.categories.map((cat) => eq(jobs.category, cat)); conditions.push(or(...categoryConditions)); }
    if (criteria.experienceLevel) conditions.push(eq(jobs.experienceLevel, criteria.experienceLevel));
    if (criteria.keywords) conditions.push(or(like(jobs.title, `%${criteria.keywords}%`), like(jobs.description, `%${criteria.keywords}%`), like(jobs.company, `%${criteria.keywords}%`)));
    return conditions;
  }

  private static async scoreJobMatch(job: any, criteria: JobMatchingCriteria, userProfile: UserProfile | null): Promise<JobMatchResult> {
    let matchScore = 0;
    const matchReasons: string[] = [];
    if (criteria.location || criteria.province) { const locationMatch = this.calculateLocationMatch(job, criteria); matchScore += locationMatch.score * 0.25; if (locationMatch.reason) matchReasons.push(locationMatch.reason); }
    if (criteria.salaryRange) { const salaryMatch = this.calculateSalaryMatch(job, criteria.salaryRange); matchScore += salaryMatch.score * 0.2; if (salaryMatch.reason) matchReasons.push(salaryMatch.reason); }
    if (userProfile) { const skillMatch = await this.calculateSkillMatch(job, userProfile); matchScore += skillMatch.score * 0.3; if (skillMatch.reason) matchReasons.push(skillMatch.reason); const experienceMatch = this.calculateExperienceMatch(job, userProfile); matchScore += experienceMatch.score * 0.15; if (experienceMatch.reason) matchReasons.push(experienceMatch.reason); }
    if (criteria.jobTypes && criteria.jobTypes.includes(job.jobType)) { matchScore += 0.1; matchReasons.push(`Matches preferred job type: ${job.jobType}`); }
    if (job.isUrgent) { matchScore += 0.05; matchReasons.push('Urgent hiring - quick application process'); }
    if (job.isImmediateStart) { matchScore += 0.03; matchReasons.push('Immediate start available'); }
    if (job.noExperienceRequired) { matchScore += 0.02; matchReasons.push('No experience required - perfect for career starters'); }
    return { jobId: job.id, matchScore: Math.min(matchScore, 1.0), matchReason: matchReasons.join('   '), job };
  }

  private static calculateLocationMatch(job: any, criteria: JobMatchingCriteria) {
    let score = 0;
    let reason = '';
    if (criteria.province && job.province === criteria.province) { score += 0.8; reason = `Located in your preferred province: ${job.province}`; }
    if (criteria.location) { if (job.location.toLowerCase().includes(criteria.location.toLowerCase())) { score += 0.2; reason += reason ? ' and city area' : `Located in ${criteria.location} area`; } }
    return { score, reason };
  }

  private static calculateSalaryMatch(job: any, salaryRange: { min: number; max: number }) {
    let score = 0;
    let reason = '';
    const jobMin = job.salaryMin || 0;
    const jobMax = job.salaryMax || 100000;
    const userMin = salaryRange.min;
    const userMax = salaryRange.max;
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

  private static async calculateSkillMatch(job: any, userProfile: UserProfile) {
    try {
      if (!userProfile.skills || userProfile.skills.length === 0) return { score: 0.3, reason: '' };
      const jobText = `${job.title} ${job.description} ${JSON.stringify(job.requirements || [])}`;
      const userSkills = userProfile.skills.join(', ');
      if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'demo-key') {
        try {
          const skillMatchPrompt = `Analyze the match between user skills and job requirements:\nUser Skills: ${userSkills}\nJob: ${job.title} at ${job.company}\nJob Description: ${job.description.substring(0, 500)}\nRate the skill match from 0-100 and provide a brief reason.`;
          const response = await openai.chat.completions.create({ model: 'gpt-3.5-turbo', messages: [{ role: 'user', content: skillMatchPrompt }], max_tokens: 100, temperature: 0.3 } as any);
          const result = response.choices[0]?.message?.content || '';
          const scoreMatch = result.match(/SCORE:\s*(\d+)/i);
          const reasonMatch = result.match(/REASON:\s*(.+)/i);
          if (scoreMatch) { const score = parseInt(scoreMatch[1]) / 100; const reason = reasonMatch ? reasonMatch[1].trim() : 'Skills alignment identified'; return { score, reason }; }
        } catch (err) { logger.error('OpenAI skill match failed:', err); }
      }
      return this.basicSkillMatching(jobText, userProfile.skills);
    } catch (error) { logger.error('Skills matching failed:', error); return this.basicSkillMatching(job.description, userProfile.skills); }
  }

  private static basicSkillMatching(jobText: string, userSkills: string[]) {
    const jobTextLower = jobText.toLowerCase();
    let matchCount = 0;
    for (const skill of userSkills) { if (jobTextLower.includes(skill.toLowerCase())) matchCount++; }
    const score = Math.min(matchCount / Math.max(userSkills.length, 3), 1.0);
    const reason = matchCount > 0 ? `${matchCount} of your skills match this role` : '';
    return { score, reason };
  }

  private static calculateExperienceMatch(job: any, userProfile: UserProfile) {
    let score = 0.5;
    let reason = '';
    const userExperienceYears = this.calculateUserExperience(userProfile.experience);
    const jobExperienceLevel = job.experienceLevel || 'entry-level';
    switch (jobExperienceLevel) {
      case 'entry-level': score = 0.9; reason = 'Perfect for your experience level'; break;
      case 'mid-level': if (userExperienceYears >= 2) { score = 0.8; reason = 'Good match for your experience'; } else { score = 0.4; reason = 'Slightly above your current experience level'; } break;
      case 'senior': if (userExperienceYears >= 5) { score = 0.8; reason = 'Matches your senior experience'; } else { score = 0.2; reason = 'Requires more experience than you currently have'; } break;
    }
    return { score, reason };
  }

  private static calculateUserExperience(experience: any[]): number {
    if (!experience || experience.length === 0) return 0;
    let totalMonths = 0;
    experience.forEach(exp => { if (exp.startDate && exp.endDate) { const start = new Date(exp.startDate); const end = exp.current ? new Date() : new Date(exp.endDate); const months = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30); totalMonths += Math.max(months, 0); } });
    return totalMonths / 12;
  }

  private static async generateJobInsights(job: any, userProfile: UserProfile | null): Promise<string> {
    try {
      if (!userProfile || !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key') return this.getBasicJobInsight(job);
      const insightPrompt = `Provide a brief, encouraging insight about this job for a South African job seeker:\nJob: ${job.title} at ${job.company}\nLocation: ${job.location}\nSalary: R${job.salaryMin}-R${job.salaryMax}\nUser Skills: ${userProfile.skills.join(', ')}\nGive one positive, actionable insight in 20 words or less.`;
      const response = await openai.chat.completions.create({ model: 'gpt-3.5-turbo', messages: [{ role: 'user', content: insightPrompt }], max_tokens: 50, temperature: 0.7 } as any);
      return response.choices[0]?.message?.content?.trim() || this.getBasicJobInsight(job);
    } catch (error) { logger.error('Failed to generate AI insights:', error); return this.getBasicJobInsight(job); }
  }

  private static getBasicJobInsight(job: any): string {
    const insights = ['Great opportunity to start your career with ${job.company}', 'Build valuable experience in ${job.category.toLowerCase()}', 'Join a growing company in ${job.city}', 'Develop new skills in a supportive environment', 'Perfect stepping stone for your career journey'];
    if (job.isUrgent) return 'Urgent hiring means faster hiring process and quick start!';
    if (job.noExperienceRequired) return 'No experience needed - they\'ll train you from the start!';
    return insights[Math.floor(Math.random() * insights.length)];
  }

  private static async basicJobMatching(criteria: JobMatchingCriteria, limit: number): Promise<JobMatchResult[]> {
    try {
      const whereConditions = this.buildJobSearchConditions(criteria);
      const candidateJobs = await db.select().from(jobs).where(and(...whereConditions)).orderBy(desc(jobs.postedAt)).limit(limit);
      return candidateJobs.map((job, index) => ({ jobId: job.id, matchScore: 0.7 - (index * 0.05), matchReason: 'Good match based on your search criteria', job: job, aiInsights: this.getBasicJobInsight(job) }));
    } catch (error) { logger.error('Basic job matching failed:', error); return []; }
  }

  static async logJobSearch(userId: string | null, query: string, filters: any, resultsCount: number, ipAddress?: string, userAgent?: string) {
    try {
      await db.insert(jobSearches).values({ userId: userId, query: query, filters: filters, resultsCount: resultsCount, ipAddress: ipAddress, userAgent: userAgent });
    } catch (error) { logger.error('Failed to log job search:', error); }
  }

  static async getJobRecommendations(userId: string, limit: number = 10): Promise<JobMatchResult[]> {
    try {
      const cacheKey = `recommendations:${userId}`;
      const cached = await CacheService.get(cacheKey);
      if (cached) return cached as JobMatchResult[];
      const userProfile = await this.getUserProfile(userId);
      if (!userProfile) return this.getPopularJobs(limit);
      const criteria: JobMatchingCriteria = { userId: userId, location: userProfile.preferredLocations[0], salaryRange: userProfile.expectedSalary, skills: userProfile.skills };
      const recommendations = await this.findMatchingJobs(criteria, limit);
      await CacheService.set(cacheKey, recommendations, 1800);
      return recommendations;
    } catch (error) { logger.error('Failed to get job recommendations:', error); return this.getPopularJobs(limit); }
  }

  private static async getPopularJobs(limit: number): Promise<JobMatchResult[]> {
    const popularJobs = await db.select().from(jobs).where(eq(jobs.isActive, true)).orderBy(desc(jobs.viewCount), desc(jobs.postedAt)).limit(limit);
    return popularJobs.map((job, index) => ({ jobId: job.id, matchScore: 0.6 - (index * 0.03), matchReason: 'Popular job in your area', job: job, aiInsights: 'This position is getting lots of attention from other job seekers' }));
  }
}

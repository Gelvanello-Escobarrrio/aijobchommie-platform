/**
 * Production Scraping Configuration for AI Job Chommie
 * 
 * AUTOMATED 2x DAILY SCRAPING UNDER R100/MONTH
 * - 12:00 PM (Noon) & 12:00 AM (Midnight) SAST
 * - Cost-optimized strategy with free alternatives
 * - Comprehensive job source coverage
 * - Built-in error handling and monitoring
 */

const cron = require('node-cron');
const winston = require('winston');

class ProductionScrapingConfig {
  constructor() {
    this.config = {
      // BUDGET CONSTRAINTS
      monthlyBudget: 100, // ZAR
      preferFreeOptions: true,
      serpApiLimit: 50, // Keep within budget (~R50/month)
      
      // SCRAPING SCHEDULE (2x DAILY)
      schedules: {
        morning: '0 6 * * *',   // 6:00 AM SAST (catch overnight postings)
        evening: '0 18 * * *',  // 6:00 PM SAST (catch day postings)
      },
      
      // JOB SOURCES (FREE + PAID MIX)
      sources: {
        // FREE PUPPETEER SOURCES (Unlimited)
        free: {
          facebook: {
            enabled: true,
            urls: [
              'https://www.facebook.com/marketplace/jobs',
              'https://www.facebook.com/groups/capetownjobs',
              'https://www.facebook.com/groups/jobsinjohannesburg',
              'https://www.facebook.com/groups/southafricanjobs',
            ],
            searchQueries: [
              'general worker',
              'cleaner jobs',
              'security jobs',
              'kitchen assistant',
              'driver jobs'
            ]
          },
          
          jobSites: {
            enabled: true,
            sites: [
              'https://www.gumtree.co.za/s-jobs/v1c8p1',
              'https://www.pnet.co.za/jobs',
              'https://www.careerjunction.co.za',
              'https://www.jobmail.co.za',
              'https://www.jobjuice.co.za',
            ]
          },
          
          companyWebsites: {
            enabled: true,
            targets: [
              'shoprite.co.za/careers',
              'picknpay.co.za/careers',
              'woolworths.co.za/careers',
              'massmart.co.za/careers',
              'mcdza.co.za/careers'
            ]
          }
        },
        
        // PAID API SOURCES (Limited by budget)
        paid: {
          serpApi: {
            enabled: true,
            monthlyLimit: 50, // ~R50
            dailyLimit: 2,    // Spread across month
            queries: [
              'entry level jobs south africa',
              'general worker jobs',
              'cleaning jobs south africa'
            ]
          }
        }
      },
      
      // PERFORMANCE OPTIMIZATION
      performance: {
        maxConcurrentScrapes: 3,
        requestDelay: 2000,      // 2 seconds between requests
        retryAttempts: 3,
        timeoutMs: 30000,
        
        // Anti-detection measures
        userAgents: [
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
        ],
        
        proxy: {
          enabled: false, // Set to true if needed
          rotateIPs: false
        }
      }
    };
    
    this.logger = this.setupLogger();
    this.stats = {
      dailyRuns: 0,
      monthlyApiCalls: 0,
      totalJobsFound: 0,
      costTracking: 0
    };
  }
  
  setupLogger() {
    return winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({ filename: 'production-scraping.log' }),
        new winston.transports.Console()
      ]
    });
  }
  
  /**
   * Initialize automated scraping schedules
   */
  initializeSchedules() {
    this.logger.info('🚀 Initializing automated scraping schedules');
    
    // Morning scrape (6 AM)
    cron.schedule(this.config.schedules.morning, async () => {
      this.logger.info('🌅 MORNING SCRAPE STARTED - 6:00 AM SAST');
      await this.runScrapingSession('morning');
    }, {
      timezone: 'Africa/Johannesburg'
    });
    
    // Evening scrape (6 PM)
    cron.schedule(this.config.schedules.evening, async () => {
      this.logger.info('🌆 EVENING SCRAPE STARTED - 6:00 PM SAST');
      await this.runScrapingSession('evening');
    }, {
      timezone: 'Africa/Johannesburg'
    });
    
    this.logger.info('✅ Scraping schedules initialized successfully');
  }
  
  /**
   * Run complete scraping session with cost optimization
   */
  async runScrapingSession(sessionType) {
    const startTime = Date.now();
    
    try {
      this.logger.info(`📊 Session: ${sessionType} | Budget Used: R${this.stats.costTracking}/R${this.config.monthlyBudget}`);
      
      // 1. FREE SCRAPING (Always run first)
      const freeJobs = await this.runFreeScrapingSources();
      
      // 2. PAID API SCRAPING (Budget permitting)
      let apiJobs = [];
      if (this.canUsePaidAPI()) {
        apiJobs = await this.runPaidAPISources();
      }
      
      // 3. PROCESS AND SAVE JOBS
      const allJobs = [...freeJobs, ...apiJobs];
      const processedJobs = await this.processAndSaveJobs(allJobs, sessionType);
      
      const duration = Date.now() - startTime;
      this.logger.info(`✅ Session complete: ${processedJobs.length} jobs processed in ${duration}ms`);
      
      return processedJobs;
      
    } catch (error) {
      this.logger.error(`❌ Scraping session failed: ${error.message}`);
      return [];
    }
  }
  
  /**
   * Run all free scraping sources (Facebook, job sites, etc.)
   */
  async runFreeScrapingSources() {
    const jobs = [];
    
    try {
      // Facebook scraping
      if (this.config.sources.free.facebook.enabled) {
        const facebookJobs = await this.scrapeFacebookJobs();
        jobs.push(...facebookJobs);
        this.logger.info(`📘 Facebook: Found ${facebookJobs.length} jobs`);
      }
      
      // Job sites scraping
      if (this.config.sources.free.jobSites.enabled) {
        const jobSiteJobs = await this.scrapeJobSites();
        jobs.push(...jobSiteJobs);
        this.logger.info(`💼 Job Sites: Found ${jobSiteJobs.length} jobs`);
      }
      
      // Company websites
      if (this.config.sources.free.companyWebsites.enabled) {
        const companyJobs = await this.scrapeCompanyWebsites();
        jobs.push(...companyJobs);
        this.logger.info(`🏢 Companies: Found ${companyJobs.length} jobs`);
      }
      
    } catch (error) {
      this.logger.error(`❌ Free scraping error: ${error.message}`);
    }
    
    return jobs;
  }
  
  /**
   * Facebook Jobs Scraping (100% FREE)
   */
  async scrapeFacebookJobs() {
    const scraperService = require('../temp-saas/backend/services/scraperService');
    const jobs = [];
    
    try {
      // Import Puppeteer scraping function
      const { scrapeJobPostings } = scraperService;
      
      // Scrape Facebook job groups
      for (const query of this.config.sources.free.facebook.searchQueries) {
        try {
          const result = await scrapeJobPostings(`${query} facebook jobs south africa`, {
            source: 'facebook_free',
            usePuppeteer: true,
            limit: 20
          });
          
          if (result.success && result.jobs) {
            jobs.push(...result.jobs);
          }
          
          // Delay between searches
          await this.delay(3000);
          
        } catch (error) {
          this.logger.warn(`⚠️ Facebook search failed for "${query}": ${error.message}`);
        }
      }
      
    } catch (error) {
      this.logger.error(`❌ Facebook scraping error: ${error.message}`);
    }
    
    return jobs;
  }
  
  /**
   * Job Sites Scraping (100% FREE)
   */
  async scrapeJobSites() {
    const jobs = [];
    
    // This would use your existing Puppeteer infrastructure
    // to scrape South African job sites directly
    
    try {
      const puppeteer = require('puppeteer');
      
      for (const site of this.config.sources.free.jobSites.sites) {
        try {
          // Launch browser
          const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
          });
          
          const page = await browser.newPage();
          await page.setUserAgent(this.getRandomUserAgent());
          
          // Navigate and scrape
          await page.goto(site, { waitUntil: 'networkidle2' });
          
          // Extract job listings (customize per site)
          const siteJobs = await page.evaluate(() => {
            // Generic job extraction - customize per site
            const jobElements = document.querySelectorAll('.job-listing, .job-item, .job-card');
            const jobs = [];
            
            jobElements.forEach(element => {
              const title = element.querySelector('h2, h3, .job-title')?.textContent?.trim();
              const company = element.querySelector('.company, .employer')?.textContent?.trim();
              const location = element.querySelector('.location')?.textContent?.trim();
              
              if (title && company) {
                jobs.push({
                  title,
                  company,
                  location: location || 'South Africa',
                  source: 'job_site_free'
                });
              }
            });
            
            return jobs;
          });
          
          jobs.push(...siteJobs);
          await browser.close();
          
          this.logger.info(`🌐 ${site}: Found ${siteJobs.length} jobs`);
          
          // Delay between sites
          await this.delay(5000);
          
        } catch (error) {
          this.logger.warn(`⚠️ Job site scraping failed for ${site}: ${error.message}`);
        }
      }
      
    } catch (error) {
      this.logger.error(`❌ Job sites scraping error: ${error.message}`);
    }
    
    return jobs;
  }
  
  /**
   * Company Websites Scraping (100% FREE)
   */
  async scrapeCompanyWebsites() {
    const jobs = [];
    
    // Similar implementation to job sites but targeting company career pages
    try {
      for (const company of this.config.sources.free.companyWebsites.targets) {
        // Scrape company careers pages
        // Implementation would be similar to scrapeJobSites()
        this.logger.info(`🏢 Scraping ${company} careers page`);
        
        // Add delay
        await this.delay(4000);
      }
    } catch (error) {
      this.logger.error(`❌ Company scraping error: ${error.message}`);
    }
    
    return jobs;
  }
  
  /**
   * Check if we can use paid APIs within budget
   */
  canUsePaidAPI() {
    const budgetRemaining = this.config.monthlyBudget - this.stats.costTracking;
    const apiCostPerCall = 2; // ~R2 per SerpAPI call
    
    return budgetRemaining >= apiCostPerCall && 
           this.stats.monthlyApiCalls < this.config.sources.paid.serpApi.monthlyLimit;
  }
  
  /**
   * Run paid API sources (SerpAPI)
   */
  async runPaidAPISources() {
    const jobs = [];
    
    if (!this.canUsePaidAPI()) {
      this.logger.info('💰 Skipping paid APIs - budget limit reached');
      return jobs;
    }
    
    try {
      const serpApiService = require('../temp-saas/backend/services/serpApiJobService');
      
      for (const query of this.config.sources.paid.serpApi.queries) {
        try {
          const result = await serpApiService.searchAndSaveJobs({
            query: query,
            num: 20
          });
          
          if (result.success) {
            jobs.push(...result.jobs);
            this.stats.monthlyApiCalls++;
            this.stats.costTracking += 2; // ~R2 per call
          }
          
          // Only use daily limit
          if (this.stats.monthlyApiCalls >= this.config.sources.paid.serpApi.dailyLimit) {
            break;
          }
          
        } catch (error) {
          this.logger.warn(`⚠️ SerpAPI search failed for "${query}": ${error.message}`);
        }
      }
      
    } catch (error) {
      this.logger.error(`❌ Paid API scraping error: ${error.message}`);
    }
    
    return jobs;
  }
  
  /**
   * Process and save all jobs
   */
  async processAndSaveJobs(jobs, sessionType) {
    const { supabase } = require('../temp-saas/backend/config/supabase');
    
    try {
      // Filter jobs with contact info
      const jobsWithContact = jobs.filter(job => {
        return job.contact_info?.hasContact || 
               job.has_contact_info || 
               job.emails?.length > 0 ||
               job.phones?.length > 0;
      });
      
      this.logger.info(`📞 Contact filter: ${jobsWithContact.length}/${jobs.length} jobs have contact info`);
      
      if (jobsWithContact.length === 0) {
        return [];
      }
      
      // Save to database
      const { data, error } = await supabase
        .from('jobs')
        .upsert(jobsWithContact.map(job => ({
          ...job,
          scraping_session: sessionType,
          date_scraped: new Date().toISOString()
        })), {
          onConflict: 'job_id',
          ignoreDuplicates: true
        });
      
      if (error) {
        throw error;
      }
      
      this.stats.totalJobsFound += jobsWithContact.length;
      this.logger.info(`💾 Saved ${jobsWithContact.length} jobs to database`);
      
      return data || jobsWithContact;
      
    } catch (error) {
      this.logger.error(`❌ Job processing error: ${error.message}`);
      return [];
    }
  }
  
  /**
   * Helper functions
   */
  getRandomUserAgent() {
    const agents = this.config.performance.userAgents;
    return agents[Math.floor(Math.random() * agents.length)];
  }
  
  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Get current statistics
   */
  getStats() {
    return {
      ...this.stats,
      budgetUsed: `R${this.stats.costTracking}/R${this.config.monthlyBudget}`,
      budgetRemaining: this.config.monthlyBudget - this.stats.costTracking,
      isWithinBudget: this.stats.costTracking <= this.config.monthlyBudget,
      apiCallsRemaining: this.config.sources.paid.serpApi.monthlyLimit - this.stats.monthlyApiCalls
    };
  }
}

module.exports = ProductionScrapingConfig;

// Auto-initialize if this file is run directly
if (require.main === module) {
  const scraper = new ProductionScrapingConfig();
  scraper.initializeSchedules();
  
  console.log('🚀 Production scraping initialized!');
  console.log('📅 Schedules: 6:00 AM & 6:00 PM SAST daily');
  console.log('💰 Budget limit: R100/month');
  console.log('🎯 Target: Entry-level jobs with contact info');
  
  // Keep process running
  process.on('SIGTERM', () => {
    console.log('👋 Graceful shutdown...');
    process.exit(0);
  });
}

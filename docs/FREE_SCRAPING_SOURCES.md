# 🆓 Free and Low-Cost Scraping Sources for AI Job Chommie

## Overview
Complete guide to scraping job opportunities without breaking your R100/month budget. Your platform can automatically scrape these sources 2x daily with minimal to zero costs.

## 🎯 **100% FREE SOURCES (R0 cost)**

### 1. **Facebook Job Groups & Marketplace** 
- **Cost**: FREE (Unlimited)
- **Target**: Entry-level, general worker, cleaning jobs
- **Method**: Puppeteer automation
- **Sources**:
  ```
  https://www.facebook.com/marketplace/jobs
  https://www.facebook.com/groups/capetownjobs
  https://www.facebook.com/groups/jobsinjohannesburg  
  https://www.facebook.com/groups/southafricanjobs
  https://www.facebook.com/groups/jobsindurban
  https://www.facebook.com/groups/jobsinpretoria
  https://www.facebook.com/groups/generalworkerjobs
  https://www.facebook.com/groups/cleaningjobssa
  ```
- **Expected Yield**: 20-50 jobs per session
- **Contact Info**: High (direct Facebook messaging, phone numbers in posts)

### 2. **South African Job Boards**
- **Cost**: FREE (Web scraping)
- **Method**: Puppeteer + job site parsing
- **Primary Sources**:
  ```
  https://www.gumtree.co.za/s-jobs/v1c8p1
  https://www.pnet.co.za/jobs  
  https://www.careerjunction.co.za
  https://www.jobmail.co.za
  https://www.jobjuice.co.za
  https://www.careers24.com
  https://www.indeed.co.za
  https://www.glassdoor.co.za
  ```
- **Expected Yield**: 30-80 jobs per session
- **Contact Info**: Medium-High (apply buttons, company contact details)

### 3. **Company Career Pages**
- **Cost**: FREE (Direct website scraping)
- **Method**: Automated Puppeteer scraping of careers sections
- **Primary Targets**:
  ```
  Major Retailers:
  - shoprite.co.za/careers
  - picknpay.co.za/careers  
  - woolworths.co.za/careers
  - massmart.co.za/careers
  - spar.co.za/careers
  
  Fast Food & Hospitality:
  - mcdza.co.za/careers
  - kfc.co.za/careers
  - steers.co.za/careers
  - ocean-basket.com/careers
  
  Security Companies:
  - adt.co.za/careers
  - chubb.co.za/careers
  - securitas.co.za/careers
  
  Cleaning Services:
  - bidvest.co.za/careers
  - johnson-controls.com/careers
  ```
- **Expected Yield**: 10-25 jobs per session
- **Contact Info**: High (official HR contacts, application portals)

### 4. **Government Job Portals**
- **Cost**: FREE
- **Sources**:
  ```
  https://www.gov.za/documents/jobs
  https://www.dpsa.gov.za/vacancy_circular.php
  ```
- **Expected Yield**: 5-15 jobs per session
- **Contact Info**: Very High (official government contacts)

### 5. **University & Training Institution Job Boards**
- **Cost**: FREE
- **Sources**:
  ```
  https://www.wits.ac.za/staff/human-resources/recruitment/
  https://www.uct.ac.za/main/jobs
  https://www.sun.ac.za/english/Pages/careers.aspx
  ```
- **Expected Yield**: 5-10 jobs per session

## 💰 **Low-Cost API Sources (Under R50/month)**

### 1. **SerpAPI (Google Jobs)**
- **Cost**: $5/month for 100 searches (~R95)
- **Recommended Usage**: 50 searches/month (~R50)
- **Quality**: Excellent (aggregates from multiple sources)
- **Contact Info**: Variable
- **Strategy**: Use only for high-value searches

### 2. **ScrapingBee (Alternative)**  
- **Cost**: $29/month for 1000 requests (~R550)
- **Free Tier**: 1000 requests/month FREE
- **Quality**: Good for specific site scraping
- **Strategy**: Use free tier only

## 🛠️ **Technical Implementation**

### Facebook Scraping Code Example:
```javascript
async function scrapeFacebookJobGroups() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Anti-detection measures
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  await page.setViewport({ width: 1366, height: 768 });
  
  const jobs = [];
  const groups = [
    'https://www.facebook.com/groups/capetownjobs',
    'https://www.facebook.com/groups/jobsinjohannesburg'
  ];
  
  for (const group of groups) {
    try {
      await page.goto(group, { waitUntil: 'networkidle2' });
      await page.waitForTimeout(3000);
      
      // Extract job posts
      const groupJobs = await page.evaluate(() => {
        const posts = document.querySelectorAll('[data-pagelet*="FeedUnit"]');
        const jobs = [];
        
        posts.forEach(post => {
          const text = post.innerText.toLowerCase();
          if (text.includes('job') || text.includes('vacancy') || text.includes('hiring')) {
            const title = post.querySelector('span[dir="auto"]')?.textContent;
            const content = post.innerText;
            
            // Extract contact info
            const phoneMatch = content.match(/(\+27|0)[0-9\s-]{9,13}/);
            const emailMatch = content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
            
            if (title && (phoneMatch || emailMatch)) {
              jobs.push({
                title: title.substring(0, 100),
                description: content.substring(0, 500),
                phone: phoneMatch?.[0],
                email: emailMatch?.[0],
                source: 'facebook_free',
                contact_info: {
                  hasContact: true,
                  phones: phoneMatch ? [phoneMatch[0]] : [],
                  emails: emailMatch ? [emailMatch[0]] : []
                }
              });
            }
          }
        });
        
        return jobs;
      });
      
      jobs.push(...groupJobs);
      await page.waitForTimeout(5000); // Delay between groups
      
    } catch (error) {
      console.error(`Error scraping ${group}:`, error);
    }
  }
  
  await browser.close();
  return jobs;
}
```

### Job Site Scraping Code Example:
```javascript
async function scrapeJobSites() {
  const sites = [
    {
      url: 'https://www.gumtree.co.za/s-jobs/v1c8p1',
      selectors: {
        jobCard: '.related-ad-title',
        title: '.related-ad-title',
        company: '.ad-detail',
        location: '.ad-detail'
      }
    },
    {
      url: 'https://www.pnet.co.za/jobs',
      selectors: {
        jobCard: '.job-result-card',
        title: '.job-title',
        company: '.company-name', 
        location: '.job-location'
      }
    }
  ];
  
  const allJobs = [];
  
  for (const site of sites) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
      await page.goto(site.url, { waitUntil: 'networkidle2' });
      
      const siteJobs = await page.evaluate((selectors) => {
        const jobCards = document.querySelectorAll(selectors.jobCard);
        const jobs = [];
        
        jobCards.forEach(card => {
          const title = card.querySelector(selectors.title)?.textContent?.trim();
          const company = card.querySelector(selectors.company)?.textContent?.trim();
          const location = card.querySelector(selectors.location)?.textContent?.trim();
          
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
      }, site.selectors);
      
      allJobs.push(...siteJobs);
      console.log(`Found ${siteJobs.length} jobs from ${site.url}`);
      
    } catch (error) {
      console.error(`Error scraping ${site.url}:`, error);
    } finally {
      await browser.close();
    }
  }
  
  return allJobs;
}
```

## 📊 **Expected Results (Per Day)**

### Free Sources Only:
- **Facebook**: 30-60 jobs with contact info
- **Job Sites**: 40-80 jobs  
- **Company Sites**: 15-30 jobs
- **Total**: 85-170 jobs per day (2x runs)
- **Monthly**: 2,550-5,100 jobs
- **Cost**: R0

### Mixed Strategy (Free + R50 API):
- **Free Sources**: 85-170 jobs/day
- **SerpAPI**: 15-25 jobs/day (50 searches/month)
- **Total**: 100-195 jobs per day
- **Monthly**: 3,000-5,850 jobs  
- **Cost**: ~R50/month

## 🚀 **Deployment Steps**

1. **Install the scraping configuration**:
   ```bash
   cd C:\Users\user\aijobchommie-platform
   node scripts/production-scraping-config.js
   ```

2. **Environment variables** (add to `.env.production`):
   ```env
   # Optional - only if using SerpAPI
   SERPAPI_KEY=your_key_here
   SERPAPI_MONTHLY_LIMIT=50
   
   # Scraping settings
   ENABLE_FREE_SCRAPING=true
   ENABLE_FACEBOOK_SCRAPING=true
   ENABLE_JOB_SITES_SCRAPING=true
   SCRAPING_SCHEDULE=6,18
   ```

3. **Start automated scraping**:
   - The system will automatically run at 6 AM and 6 PM SAST
   - Monitor via logs in `production-scraping.log`
   - Check stats via `/api/v1/scraper/status`

## ⚡ **Performance Optimization**

### Anti-Detection Measures:
- Rotate User Agents
- Random delays (2-5 seconds)  
- Proxy rotation (if needed)
- Session management
- Request throttling

### Resource Management:
- Use headless browsers
- Close browsers after use
- Implement connection pooling
- Monitor memory usage
- Auto-restart on errors

## 📈 **Success Metrics**

- **Target**: 100+ jobs with contact info per day
- **Budget**: Under R100/month
- **Uptime**: 99%+ scheduled runs
- **Contact Rate**: 60%+ of jobs have contact info
- **Data Quality**: 95%+ valid job postings

## 🔧 **Monitoring & Maintenance**

### Daily Monitoring:
- Check scraping logs
- Verify job counts
- Monitor error rates
- Validate contact extraction

### Weekly Tasks:
- Review blocked sites
- Update selectors if needed
- Check budget usage
- Optimize slow scrapers

### Monthly Tasks:
- Analyze job quality
- Add new sources
- Remove dead sources
- Performance optimization

This setup will give you **comprehensive job coverage** at minimal cost, automatically running 2x daily and capturing thousands of entry-level jobs with contact information for your platform users!
